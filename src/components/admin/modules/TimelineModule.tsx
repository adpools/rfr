import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import { uploadMediaFile, ensureTimelineYearExists } from '../../../services/cmsService';
import { Plus, Edit3, Trash2, Eye, EyeOff, Search, Save, X, Upload, Calendar, FolderPlus, Play, ExternalLink, Layers } from 'lucide-react';

export interface TimelineEvent {
  id?: string;
  year_id?: string;
  year_number: number;
  name: string;
  type: 'Event' | 'Campaign' | 'Ad' | 'Shoot' | 'Music Album' | 'Show' | 'Podcast';
  category_badge?: string;
  location_or_client?: string;
  description?: string;
  image?: string;
  video_url?: string;
  video_embed_url?: string;
  has_video?: boolean;
  drive_folder_url?: string;
  videos?: Array<{
    id?: string;
    title?: string;
    image?: string;
    videoUrl?: string;
    videoEmbedUrl?: string;
    video_url?: string;
    video_embed_url?: string;
    driveFolderUrl?: string;
    drive_folder_url?: string;
  }>;
  sort_order: number;
  is_published: boolean;
  timeline_years?: {
    id: string;
    year: number;
    title?: string;
  };
}

// Helpers for timeline video resolution & embed normalization
const toDirectVideoUrl = (rawUrl?: string | null): string | undefined => {
  if (!rawUrl || typeof rawUrl !== 'string') return undefined;
  const trimmed = rawUrl.trim();
  if (!trimmed) return undefined;

  if (
    trimmed.match(/\.(mp4|webm|mov|ogg)(\?.*)?$/i) ||
    trimmed.startsWith('/videos/')
  ) {
    return trimmed;
  }
  return undefined;
};

const toEmbedUrl = (rawUrl?: string | null): string | undefined => {
  if (!rawUrl || typeof rawUrl !== 'string') return undefined;
  const trimmed = rawUrl.trim();
  if (!trimmed) return undefined;

  if (
    trimmed.match(/\.(mp4|webm|mov|ogg)(\?.*)?$/i) ||
    trimmed.startsWith('/videos/')
  ) {
    return undefined;
  }

  if (trimmed.includes('youtube.com/embed/')) {
    return trimmed.includes('autoplay=') ? trimmed : `${trimmed}${trimmed.includes('?') ? '&' : '?'}autoplay=1`;
  }

  const ytMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`;
  }

  if (trimmed.includes('drive.google.com')) {
    const driveMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (driveMatch && driveMatch[1]) {
      return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
    }
    const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idMatch && idMatch[1]) {
      return `https://drive.google.com/file/d/${idMatch[1]}/preview`;
    }
  }

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  return undefined;
};

const getEventVideoData = (ev: TimelineEvent) => {
  const directCandidate = ev.video_url || (ev as any).videoUrl;
  const embedCandidate = ev.video_embed_url || (ev as any).videoEmbedUrl;
  const childVideos = Array.isArray(ev.videos) ? ev.videos : [];

  const normalizedChildren = childVideos.map((v: any, index: number) => {
    const childDirect = toDirectVideoUrl(v.videoUrl || v.video_url);
    const childEmbed = toEmbedUrl(v.videoEmbedUrl || v.video_embed_url || v.videoUrl || v.video_url);
    return {
      id: v.id || String(index),
      title: v.title || `Reel ${index + 1}`,
      image: v.image,
      videoUrl: childDirect,
      videoEmbedUrl: childEmbed,
      driveFolderUrl: v.driveFolderUrl || v.drive_folder_url,
      hasVideo: Boolean(childDirect || childEmbed),
    };
  }).filter((v) => v.hasVideo);

  const directVideo = toDirectVideoUrl(directCandidate);
  const embedVideo = toEmbedUrl(embedCandidate || directCandidate);

  const hasValidVideo = Boolean(
    directVideo || 
    embedVideo || 
    (normalizedChildren.length > 0)
  );

  return {
    hasValidVideo,
    primaryVideoUrl: directVideo || normalizedChildren[0]?.videoUrl,
    primaryEmbedUrl: embedVideo || normalizedChildren[0]?.videoEmbedUrl,
    driveFolderUrl: ev.drive_folder_url || (ev as any).driveFolderUrl || normalizedChildren[0]?.driveFolderUrl,
    videosList: normalizedChildren,
  };
};

export interface TimelineYearRow {
  id: string;
  year: number;
  title: string;
  theme?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  accent?: string;
  sort_order?: number;
  is_published?: boolean;
}

interface TimelineModuleProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  isConfigured: boolean;
}

export const TimelineModule: React.FC<TimelineModuleProps> = ({ showToast }) => {
  const [years, setYears] = useState<TimelineYearRow[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Event Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);
  const [uploading, setUploading] = useState(false);

  // Video Preview Modal state
  const [activeVideoEvent, setActiveVideoEvent] = useState<TimelineEvent | null>(null);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number>(0);

  // Year Modal state
  const [isYearModalOpen, setIsYearModalOpen] = useState(false);
  const [editingYear, setEditingYear] = useState<TimelineYearRow | null>(null);
  const [yearUploading, setYearUploading] = useState(false);
  const [yearFormData, setYearFormData] = useState({
    year: 2026,
    title: '',
    theme: 'EXPANSION & INNOVATION',
    subtitle: '',
    description: '',
    image: '/images/final bro.png',
    accent: '#C7A46A',
    sort_order: 1,
    is_published: true,
  });

  const [formData, setFormData] = useState<TimelineEvent>({
    year_id: '',
    year_number: 2026,
    name: '',
    type: 'Event',
    category_badge: 'Flagship Event',
    location_or_client: 'Trivandrum, Kerala',
    description: '',
    image: '',
    video_url: '',
    has_video: false,
    sort_order: 1,
    is_published: true,
  });

  const fetchYearsAndEvents = async () => {
    setLoading(true);
    if (!isSupabaseConfigured) {
      setYears([
        { id: '00000000-0000-4000-a000-000000002026', year: 2026, title: 'EXPANSION & HORIZONS' },
        { id: '00000000-0000-4000-a000-000000002025', year: 2025, title: 'SCALE & ELEVATION' },
        { id: '00000000-0000-4000-a000-000000002024', year: 2024, title: 'THE ACCELERATION' },
        { id: '00000000-0000-4000-a000-000000002023', year: 2023, title: 'THE INFLECTION POINT' },
        { id: '00000000-0000-4000-a000-000000002022', year: 2022, title: 'THE RESURGENCE' },
        { id: '00000000-0000-4000-a000-000000002021', year: 2021, title: 'DIGITAL INNOVATION' },
        { id: '00000000-0000-4000-a000-000000002020', year: 2020, title: 'THE GENESIS' },
      ]);
      setEvents([
        {
          id: '1',
          year_id: '00000000-0000-4000-a000-000000002024',
          year_number: 2024,
          name: 'Koottam Flea Festival Season 2',
          type: 'Event',
          category_badge: 'Cultural Flea',
          location_or_client: 'Technopark Ground, Trivandrum',
          description: 'A 2-day extravaganza uniting 100+ creative retail popups, food trucks, and live music acts.',
          image: '/images/kootam 2022.jpeg',
          sort_order: 1,
          is_published: true,
        },
      ]);
      setLoading(false);
      return;
    }

    try {
      // 1. Fetch all years
      const { data: yearsData, error: yearsError } = await supabase
        .from('timeline_years')
        .select('*')
        .order('year', { ascending: false });

      if (yearsError) throw yearsError;
      setYears(yearsData || []);

      // 2. Fetch all events with joined year relationship
      const { data: eventsData, error: eventsError } = await supabase
        .from('timeline_events')
        .select('*, timeline_years(id, year, title)')
        .order('sort_order', { ascending: true });

      if (eventsError) throw eventsError;
      setEvents(eventsData || []);

      // If selected year is not in years list and years are present, default to the latest year
      if (yearsData && yearsData.length > 0 && !yearsData.some((y) => y.year === selectedYear)) {
        setSelectedYear(yearsData[0].year);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to load timeline chronicle', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchYearsAndEvents();
  }, []);

  // Close video preview on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeVideoEvent) {
        setActiveVideoEvent(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeVideoEvent]);

  const handleOpenVideoPreview = (ev: TimelineEvent) => {
    setActiveVideoEvent(ev);
    setSelectedVideoIndex(0);
  };

  const openCreateModal = () => {
    setEditingEvent(null);
    const matchingYearRow = years.find((y) => y.year === selectedYear);
    setFormData({
      year_id: matchingYearRow?.id || '',
      year_number: selectedYear,
      name: '',
      type: 'Event',
      category_badge: 'Flagship Event',
      location_or_client: 'Trivandrum, Kerala',
      description: '',
      image: '',
      video_url: '',
      has_video: false,
      sort_order: events.length + 1,
      is_published: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (ev: TimelineEvent) => {
    setEditingEvent(ev);
    const matchingYearRow = years.find((y) => (ev.year_id && y.id === ev.year_id) || y.year === ev.year_number);
    setFormData({
      ...ev,
      year_id: ev.year_id || matchingYearRow?.id || '',
      year_number: ev.year_number || matchingYearRow?.year || selectedYear,
    });
    setIsModalOpen(true);
  };

  const openCreateYearModal = (presetYear?: number) => {
    setEditingYear(null);
    const yr = presetYear || selectedYear || 2026;
    setYearFormData({
      year: yr,
      title: `THE ${yr} CHAPTER`,
      theme: 'EXPANSION & INNOVATION',
      subtitle: `Landmark Productions & Milestones of ${yr}`,
      description: `Official chronicle and productions documented for the year ${yr}.`,
      image: '/images/final bro.png',
      accent: '#C7A46A',
      sort_order: yr,
      is_published: true,
    });
    setIsYearModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const res = await uploadMediaFile(file, 'timeline');
    setUploading(false);
    if (res.success && res.url) {
      setFormData((prev) => ({ ...prev, image: res.url || '' }));
      showToast('Timeline event media uploaded');
    } else {
      showToast(res.error || 'Upload failed', 'error');
    }
  };

  const handleYearFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setYearUploading(true);
    const res = await uploadMediaFile(file, 'timeline');
    setYearUploading(false);
    if (res.success && res.url) {
      setYearFormData((prev) => ({ ...prev, image: res.url || '' }));
      showToast('Timeline year media uploaded');
    } else {
      showToast(res.error || 'Upload failed', 'error');
    }
  };

  const handleYearSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!yearFormData.year) {
      showToast('Year number is required', 'error');
      return;
    }
    if (!yearFormData.title.trim()) {
      showToast('Year title is required', 'error');
      return;
    }

    try {
      const payload = {
        year: Number(yearFormData.year),
        title: yearFormData.title.trim(),
        theme: yearFormData.theme.trim(),
        subtitle: yearFormData.subtitle.trim(),
        description: yearFormData.description.trim(),
        image: yearFormData.image.trim() || '/images/final bro.png',
        accent: yearFormData.accent || '#C7A46A',
        sort_order: Number(yearFormData.sort_order) || Number(yearFormData.year),
        is_published: yearFormData.is_published,
        updated_at: new Date().toISOString(),
      };

      if (editingYear?.id) {
        const { error } = await supabase
          .from('timeline_years')
          .update(payload)
          .eq('id', editingYear.id);
        if (error) throw error;
        showToast(`Year ${yearFormData.year} updated`);
      } else {
        const { error } = await supabase
          .from('timeline_years')
          .insert([payload]);
        if (error) throw error;
        showToast(`Year ${yearFormData.year} initialized in chronicle`);
      }

      setIsYearModalOpen(false);
      setSelectedYear(Number(yearFormData.year));
      await fetchYearsAndEvents();
    } catch (err: any) {
      showToast(err.message || 'Failed to save year record', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Event name is required', 'error');
      return;
    }

    const targetYearNum = Number(formData.year_number) || selectedYear;

    try {
      // 1. Resolve genuine database UUID for target year
      let targetYearObj: { id: string; year: number } | null = null;

      // Check in-memory list first
      if (formData.year_id) {
        const mem = years.find((y) => y.id === formData.year_id);
        if (mem) targetYearObj = mem;
      }

      if (!targetYearObj) {
        const mem = years.find((y) => y.year === targetYearNum);
        if (mem) targetYearObj = mem;
      }

      // If editing and same year, preserve editingEvent.year_id
      if (!targetYearObj && editingEvent?.year_id && editingEvent.year_number === targetYearNum) {
        targetYearObj = { id: editingEvent.year_id, year: targetYearNum };
      }

      // If not found in memory, query Supabase timeline_years directly
      if (!targetYearObj) {
        const { data: dbYear, error: dbYearErr } = await supabase
          .from('timeline_years')
          .select('id, year')
          .eq('year', targetYearNum)
          .maybeSingle();

        if (dbYearErr) throw dbYearErr;
        if (dbYear?.id) {
          targetYearObj = dbYear;
        }
      }

      // If year record still does not exist, safely initialize it in Supabase
      if (!targetYearObj) {
        const ensureRes = await ensureTimelineYearExists(targetYearNum);
        if (ensureRes.error || !ensureRes.data?.id) {
          showToast(ensureRes.error || `Please initialize year ${targetYearNum} first`, 'error');
          return;
        }
        targetYearObj = ensureRes.data;
        showToast(`Initialized chronicle year record for ${targetYearNum}`, 'info');
      }

      if (!targetYearObj || !targetYearObj.id) {
        showToast('Valid year_id UUID required for timeline event creation', 'error');
        return;
      }

      const finalYearId = targetYearObj.id;

      const payload = {
        year_id: finalYearId,
        year_number: targetYearNum,
        name: formData.name.trim(),
        type: formData.type,
        category_badge: formData.category_badge ? formData.category_badge.trim() : null,
        location_or_client: formData.location_or_client ? formData.location_or_client.trim() : null,
        description: formData.description ? formData.description.trim() : null,
        image: formData.image ? formData.image.trim() : null,
        video_url: formData.video_url ? formData.video_url.trim() : null,
        video_embed_url: formData.video_embed_url ? formData.video_embed_url.trim() : null,
        has_video: Boolean(formData.video_url && formData.video_url.trim().length > 0),
        drive_folder_url: formData.drive_folder_url ? formData.drive_folder_url.trim() : null,
        sort_order: Number(formData.sort_order) || 0,
        is_published: formData.is_published,
        updated_at: new Date().toISOString(),
      };

      if (editingEvent?.id) {
        const { error } = await supabase
          .from('timeline_events')
          .update(payload)
          .eq('id', editingEvent.id);

        if (error) throw error;
        showToast('Timeline event updated');
      } else {
        const { error } = await supabase
          .from('timeline_events')
          .insert([payload]);

        if (error) throw error;
        showToast('Event added to chronicle');
      }

      setIsModalOpen(false);
      await fetchYearsAndEvents();
    } catch (err: any) {
      showToast(err.message || 'Save failed', 'error');
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      const { error } = await supabase.from('timeline_events').delete().eq('id', id);
      if (error) throw error;
      showToast('Event deleted');
      fetchYearsAndEvents();
    } catch (err: any) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  const togglePublish = async (ev: TimelineEvent) => {
    if (!ev.id) return;
    const newState = !ev.is_published;
    try {
      const { error } = await supabase
        .from('timeline_events')
        .update({ is_published: newState, updated_at: new Date().toISOString() })
        .eq('id', ev.id);

      if (error) throw error;
      setEvents((prev) =>
        prev.map((item) => (item.id === ev.id ? { ...item, is_published: newState } : item))
      );
      showToast(newState ? 'Event visible' : 'Event hidden');
    } catch (err: any) {
      showToast(err.message || 'Update failed', 'error');
    }
  };

  const selectedYearObj = years.find((y) => y.year === selectedYear);

  const filteredEvents = events.filter((e) => {
    const matchesYear =
      (selectedYearObj && e.year_id === selectedYearObj.id) ||
      (e.timeline_years && e.timeline_years.year === selectedYear) ||
      e.year_number === selectedYear;

    const matchesSearch =
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.location_or_client && e.location_or_client.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesYear && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#C7A46A] uppercase tracking-wider mb-1">
            <Calendar size={14} />
            <span>HISTORICAL CHRONICLE (2020–2026+)</span>
          </div>
          <h1 className="text-2xl font-serif text-white uppercase tracking-wide">
            Timeline & Landmark Events
          </h1>
          <p className="text-neutral-400 text-xs font-light">
            Manage the year-by-year chronicle, milestone events, campaign productions, and venue records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => openCreateYearModal()}
            className="px-4 py-2.5 rounded-xl bg-[#141414] hover:bg-[#202020] text-[#C7A46A] border border-[#C7A46A]/30 font-mono font-medium text-xs uppercase tracking-wider flex items-center gap-2 transition-all"
          >
            <FolderPlus size={16} />
            <span>+ Add Year</span>
          </button>

          <button
            onClick={openCreateModal}
            className="px-5 py-2.5 rounded-xl bg-[#C7A46A] hover:bg-[#D4B678] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 self-start sm:self-auto transition-all shadow-lg shadow-[#C7A46A]/20"
          >
            <Plus size={16} />
            <span>Add Event to {selectedYear}</span>
          </button>
        </div>
      </div>

      {/* Year Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-neutral-850">
        {years.map((y) => (
          <button
            key={y.id || y.year}
            onClick={() => setSelectedYear(y.year)}
            className={`px-5 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap ${
              selectedYear === y.year
                ? 'bg-[#C7A46A] text-black font-bold shadow-md shadow-[#C7A46A]/20'
                : 'bg-[#111111] text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            {y.year} {y.title && `— ${y.title.slice(0, 15)}...`}
          </button>
        ))}

        <button
          onClick={() => openCreateYearModal()}
          className="px-4 py-2 rounded-xl text-xs font-mono text-[#C7A46A] bg-[#141414] hover:bg-[#222] border border-dashed border-[#C7A46A]/40 whitespace-nowrap transition-all"
        >
          + New Year
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
        <input
          type="text"
          placeholder={`Search ${selectedYear} events...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#111111] border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#C7A46A]"
        />
      </div>

      {/* Events List */}
      {loading ? (
        <div className="py-24 text-center text-neutral-500 font-mono text-xs uppercase tracking-widest">
          Loading chronicle events...
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="py-16 text-center text-neutral-500 font-mono text-xs border border-dashed border-neutral-800 rounded-2xl space-y-3">
          <p>No events found for {selectedYear}.</p>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 rounded-xl bg-[#181818] hover:bg-[#222] text-[#C7A46A] text-xs font-mono border border-neutral-700 inline-flex items-center gap-2"
          >
            <Plus size={14} />
            <span>Add First Event to {selectedYear}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEvents.map((ev) => {
            const videoInfo = getEventVideoData(ev);
            return (
              <div
                key={ev.id || ev.name}
                className="p-5 rounded-2xl bg-[#0D0D0D] border border-neutral-850 hover:border-neutral-700 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Event Media Preview */}
                  <div 
                    className={`aspect-[16/9] rounded-xl bg-[#141414] overflow-hidden relative border border-neutral-800 ${
                      videoInfo.hasValidVideo ? 'cursor-pointer group/media' : ''
                    }`}
                    onClick={videoInfo.hasValidVideo ? () => handleOpenVideoPreview(ev) : undefined}
                    role={videoInfo.hasValidVideo ? 'button' : undefined}
                    tabIndex={videoInfo.hasValidVideo ? 0 : undefined}
                    onKeyDown={videoInfo.hasValidVideo ? (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleOpenVideoPreview(ev);
                      }
                    } : undefined}
                    aria-label={videoInfo.hasValidVideo ? `Play video for ${ev.name}` : undefined}
                  >
                    {ev.image ? (
                      <img 
                        src={ev.image} 
                        alt={ev.name} 
                        className={`w-full h-full object-cover transition-transform duration-500 ${
                          videoInfo.hasValidVideo ? 'group-hover/media:scale-105' : ''
                        }`} 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-600">
                        <Calendar size={24} />
                      </div>
                    )}

                    {/* Top-left Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none z-10">
                      <span className="px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-neutral-700 text-[10px] font-mono text-[#C7A46A] uppercase">
                        {ev.type}
                      </span>
                      {ev.category_badge && (
                        <span className="px-2 py-0.5 rounded-full bg-neutral-900/80 text-neutral-300 text-[10px] font-mono uppercase">
                          {ev.category_badge}
                        </span>
                      )}
                    </div>

                    {/* Centered Play Button Overlay (Visible ONLY when card has valid video URL) */}
                    {videoInfo.hasValidVideo && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                        <div className="w-12 h-12 rounded-full bg-black/70 backdrop-blur-md border border-[#C7A46A] flex items-center justify-center text-[#C7A46A] group-hover/media:bg-[#C7A46A] group-hover/media:text-black group-hover/media:scale-110 transition-all duration-300 shadow-xl">
                          <Play size={18} className="fill-current ml-0.5" />
                        </div>
                      </div>
                    )}

                    {/* Bottom Indicator for Video Availability */}
                    {videoInfo.hasValidVideo && (
                      <div className="absolute bottom-2.5 right-2.5 pointer-events-none z-10">
                        <span className="px-2 py-0.5 rounded bg-black/80 border border-[#C7A46A]/40 text-[9px] font-mono text-[#C7A46A] uppercase tracking-wider flex items-center gap-1 backdrop-blur-sm">
                          {videoInfo.videosList.length > 1 ? (
                            <>
                              <Layers size={10} />
                              <span>{videoInfo.videosList.length} REELS</span>
                            </>
                          ) : (
                            <>
                              <Play size={8} className="fill-current" />
                              <span>PREVIEW VIDEO</span>
                            </>
                          )}
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    {ev.location_or_client && (
                      <div className="text-[10px] font-mono text-neutral-500">{ev.location_or_client}</div>
                    )}
                    <h3 className="text-base font-serif text-white font-medium">{ev.name}</h3>
                    {ev.description && <p className="text-neutral-400 text-xs font-light line-clamp-2 mt-1">{ev.description}</p>}
                  </div>
                </div>

              <div className="flex items-center justify-between pt-4 border-t border-neutral-850">
                <button
                  onClick={() => togglePublish(ev)}
                  className={`flex items-center gap-1 text-xs font-mono px-2.5 py-1 rounded ${
                    ev.is_published
                      ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/40'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {ev.is_published ? <Eye size={12} /> : <EyeOff size={12} />}
                  <span>{ev.is_published ? 'Live' : 'Hidden'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(ev)}
                    className="p-1.5 rounded-lg bg-[#181818] hover:bg-[#222] text-neutral-300 hover:text-white"
                    title="Edit Event"
                  >
                    <Edit3 size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(ev.id)}
                    className="p-1.5 rounded-lg bg-red-950/30 hover:bg-red-900/50 text-red-400 hover:text-red-200"
                    title="Delete Event"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    )}

      {/* Event Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <h2 className="text-xl font-serif text-white uppercase">
                {editingEvent ? 'Edit Timeline Event' : `Add Event to ${formData.year_number || selectedYear}`}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-[#222] text-neutral-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                  Event Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Hycinth Five-Star Gala"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#C7A46A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                    Timeline Year *
                  </label>
                  <select
                    value={formData.year_id || ''}
                    onChange={(e) => {
                      const selId = e.target.value;
                      const found = years.find((y) => y.id === selId);
                      if (found) {
                        setFormData((prev) => ({
                          ...prev,
                          year_id: found.id,
                          year_number: found.year,
                        }));
                      }
                    }}
                    className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                  >
                    {years.map((y) => (
                      <option key={y.id} value={y.id}>
                        {y.year} {y.title ? `— ${y.title.slice(0, 20)}` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                    Discipline / Event Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                  >
                    <option value="Event">Event</option>
                    <option value="Campaign">Campaign</option>
                    <option value="Ad">Ad</option>
                    <option value="Shoot">Shoot</option>
                    <option value="Music Album">Music Album</option>
                    <option value="Show">Show</option>
                    <option value="Podcast">Podcast</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                    Category Tag / Badge
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Cultural Flea / Runway"
                    value={formData.category_badge || ''}
                    onChange={(e) => setFormData({ ...formData, category_badge: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                    Location / Client
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Technopark / Škoda India"
                    value={formData.location_or_client || ''}
                    onChange={(e) => setFormData({ ...formData, location_or_client: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                  placeholder="Event details, key creative milestones, deliverables..."
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                  Event Photo Upload
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="text-xs text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-mono file:bg-[#222] file:text-white hover:file:bg-[#333]"
                  />
                  {uploading && <span className="text-xs text-[#C7A46A] font-mono animate-pulse">Uploading...</span>}
                </div>
                {formData.image && (
                  <div className="mt-2 flex items-center gap-2">
                    <img src={formData.image} alt="Preview" className="w-16 h-10 object-cover rounded border border-neutral-700" />
                    <span className="text-[10px] font-mono text-neutral-500 truncate max-w-xs">{formData.image}</span>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="rounded bg-[#181818] border-neutral-700 text-[#C7A46A]"
                  />
                  <span className="text-xs font-mono text-neutral-300">Published to public timeline</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-neutral-800 hover:bg-[#181818] text-neutral-300 font-mono text-xs uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#C7A46A] hover:bg-[#D4B678] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2"
                >
                  <Save size={15} />
                  <span>{editingEvent ? 'Save Changes' : 'Add Event'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Year Add/Edit Modal */}
      {isYearModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <h2 className="text-xl font-serif text-white uppercase">
                {editingYear ? `Edit Year ${editingYear.year}` : 'Initialize Chronicle Year'}
              </h2>
              <button
                onClick={() => setIsYearModalOpen(false)}
                className="p-1 rounded-lg hover:bg-[#222] text-neutral-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleYearSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                    Year Number *
                  </label>
                  <input
                    type="number"
                    required
                    value={yearFormData.year}
                    onChange={(e) => setYearFormData({ ...yearFormData, year: parseInt(e.target.value) || 2026 })}
                    className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                    Theme Key
                  </label>
                  <input
                    type="text"
                    value={yearFormData.theme}
                    onChange={(e) => setYearFormData({ ...yearFormData, theme: e.target.value })}
                    placeholder="e.g. THE MODERN HORIZON"
                    className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                  Chronicle Title *
                </label>
                <input
                  type="text"
                  required
                  value={yearFormData.title}
                  onChange={(e) => setYearFormData({ ...yearFormData, title: e.target.value })}
                  placeholder="e.g. Architectural Runways & Five-Star Galas"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={yearFormData.subtitle}
                  onChange={(e) => setYearFormData({ ...yearFormData, subtitle: e.target.value })}
                  placeholder="e.g. Hycinth Five-Star NYE Gala & Headline Guilds"
                  className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={yearFormData.description}
                  onChange={(e) => setYearFormData({ ...yearFormData, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                  Year Hero Photo
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleYearFileUpload}
                    className="text-xs text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-mono file:bg-[#222] file:text-white hover:file:bg-[#333]"
                  />
                  {yearUploading && <span className="text-xs text-[#C7A46A] font-mono animate-pulse">Uploading...</span>}
                </div>
                {yearFormData.image && (
                  <div className="mt-2 flex items-center gap-2">
                    <img src={yearFormData.image} alt="Preview" className="w-16 h-10 object-cover rounded border border-neutral-700" />
                    <span className="text-[10px] font-mono text-neutral-500 truncate max-w-xs">{yearFormData.image}</span>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={yearFormData.is_published}
                    onChange={(e) => setYearFormData({ ...yearFormData, is_published: e.target.checked })}
                    className="rounded bg-[#181818] border-neutral-700 text-[#C7A46A]"
                  />
                  <span className="text-xs font-mono text-neutral-300">Published to public timeline</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsYearModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-neutral-800 hover:bg-[#181818] text-neutral-300 font-mono text-xs uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#C7A46A] hover:bg-[#D4B678] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2"
                >
                  <Save size={15} />
                  <span>{editingYear ? 'Save Changes' : 'Initialize Year'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Timeline Video Preview Modal */}
      {activeVideoEvent && (() => {
        const videoData = getEventVideoData(activeVideoEvent);
        const currentReel = videoData.videosList && videoData.videosList.length > selectedVideoIndex
          ? videoData.videosList[selectedVideoIndex]
          : null;

        const currentVideoUrl = currentReel ? currentReel.videoUrl : videoData.primaryVideoUrl;
        const currentEmbedUrl = currentReel ? currentReel.videoEmbedUrl : videoData.primaryEmbedUrl;
        const currentTitle = currentReel?.title || activeVideoEvent.name;
        const currentDriveUrl = currentReel?.driveFolderUrl || videoData.driveFolderUrl;

        return (
          <div
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
            onClick={() => setActiveVideoEvent(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Admin Timeline Video Preview"
          >
            <div
              className="w-full max-w-4xl bg-[#111111] border border-[#C7A46A]/50 rounded-2xl overflow-hidden shadow-2xl flex flex-col my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-[#141414] gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-[10px] font-mono text-[#C7A46A] uppercase tracking-widest mb-1 truncate">
                    <span>{activeVideoEvent.year_number} CHRONICLE</span>
                    <span>•</span>
                    <span className="truncate">{activeVideoEvent.category_badge || activeVideoEvent.type}</span>
                    {activeVideoEvent.location_or_client && (
                      <>
                        <span>•</span>
                        <span className="truncate">{activeVideoEvent.location_or_client}</span>
                      </>
                    )}
                  </div>
                  <h3 className="text-base sm:text-lg font-serif text-white uppercase tracking-wide truncate">
                    {activeVideoEvent.name}
                  </h3>
                  {currentReel && (
                    <div className="flex items-center gap-2 mt-0.5 text-xs font-mono text-neutral-300">
                      <span className="text-[#C7A46A]">REEL {String(selectedVideoIndex + 1).padStart(2, '0')}:</span>
                      <span className="truncate">{currentReel.title}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  {currentDriveUrl && (
                    <a
                      href={currentDriveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-700 text-[#C7A46A] hover:bg-[#C7A46A] hover:text-black text-xs font-mono transition-all flex items-center gap-1.5"
                      title="Open Drive Folder"
                    >
                      <span className="hidden sm:inline">DRIVE FOLDER</span>
                      <ExternalLink size={13} />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => setActiveVideoEvent(null)}
                    aria-label="Close Video Player"
                    className="p-2 sm:p-2.5 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-300 hover:text-white hover:border-[#C7A46A] transition-all cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Video Player Display */}
              <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
                {currentVideoUrl ? (
                  <video
                    key={currentVideoUrl}
                    src={currentVideoUrl}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain"
                  />
                ) : currentEmbedUrl ? (
                  <iframe
                    key={currentEmbedUrl}
                    src={currentEmbedUrl}
                    title={currentTitle}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="text-center p-8 space-y-3">
                    <p className="text-sm font-mono text-neutral-400">No streamable video source found</p>
                  </div>
                )}
              </div>

              {/* Multi-reel switcher if there are multiple videos */}
              {videoData.videosList && videoData.videosList.length > 1 && (
                <div className="p-3 sm:p-4 bg-[#0e0e0e] border-t border-neutral-800">
                  <div className="flex items-center justify-between mb-2 text-xs font-mono uppercase tracking-wider text-neutral-400">
                    <div className="flex items-center gap-2 text-[#C7A46A]">
                      <Layers size={13} />
                      <span>MULTIPLE REELS ({videoData.videosList.length})</span>
                    </div>
                    <span className="text-[10px] text-neutral-500">SWITCH REEL</span>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {videoData.videosList.map((vid, idx) => {
                      const isSelected = idx === selectedVideoIndex;
                      return (
                        <button
                          key={vid.id || idx}
                          type="button"
                          onClick={() => setSelectedVideoIndex(idx)}
                          className={`px-3 py-1.5 rounded-lg text-left text-xs font-mono flex items-center gap-2 whitespace-nowrap transition-all border cursor-pointer ${
                            isSelected
                              ? 'bg-[#C7A46A]/20 border-[#C7A46A] text-[#C7A46A] font-bold'
                              : 'bg-[#151515] border-neutral-800 text-neutral-400 hover:text-white'
                          }`}
                        >
                          <Play size={10} className={isSelected ? 'fill-current' : ''} />
                          <span>0{idx + 1}. {vid.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="p-3 sm:p-4 bg-[#141414] border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
                <span className="font-mono text-[10px] sm:text-[11px] text-neutral-400">
                  ADMIN VERIFIED MEDIA PREVIEW • {activeVideoEvent.year_number}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveVideoEvent(null)}
                  className="px-4 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
