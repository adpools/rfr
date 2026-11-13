import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import { uploadMediaFile } from '../../../services/cmsService';
import {
  Plus,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Save,
  X,
  Radio,
  Calendar,
  MapPin,
  Users,
  Building2,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Maximize2,
  Play
} from 'lucide-react';
import { useMediaViewer } from '../../../context/MediaViewerContext';
import {
  TicCreatorItem,
  TicBrandItem,
  DEFAULT_TIC_CREATORS,
  DEFAULT_TIC_BRANDS
} from '../../../pages/TICPage';

export interface TicEvent {
  id?: string;
  name: string;
  event_date?: string;
  venue?: string;
  description?: string;
  cover_image: string;
  attendees_count?: string;
  sort_order: number;
  is_published: boolean;
}

interface TicModuleProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  isConfigured: boolean;
}

export const TicModule: React.FC<TicModuleProps> = ({ showToast }) => {
  const { openImage, openVideo } = useMediaViewer();
  const [events, setEvents] = useState<TicEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TicEvent | null>(null);
  const [uploading, setUploading] = useState(false);

  // TIC Manifesto state (tic_content)
  const [manifestoTitle, setManifestoTitle] = useState('TRIVANDRUM INFLUENCER CIRCLE');
  const [manifestoTagline, setManifestoTagline] = useState('TIC • CO-FOUNDED BY RIYAS');
  const [manifestoNarrative, setManifestoNarrative] = useState(
    'Trivandrum Influencer Circle (TIC) is Kerala’s premier regional creator alliance. Co-Founded by Riyas, TIC was established to bridge authentic regional cultural resonance with high-conversion enterprise brand campaigns spanning fashion, automotive, hospitality, and digital storytelling.'
  );
  const [manifestoVideoUrl, setManifestoVideoUrl] = useState('https://drive.google.com/file/d/13KL_xZOjSNeBFJDSfbLic-0wMlBT9lDf/preview');
  const [savingManifesto, setSavingManifesto] = useState(false);

  // Raw stats JSONB container (strictly preserves any other existing keys)
  const [rawStats, setRawStats] = useState<Record<string, any>>({});

  // Core Creator Network (stats.creators)
  const [creators, setCreators] = useState<TicCreatorItem[]>(DEFAULT_TIC_CREATORS);
  const [isCreatorModalOpen, setIsCreatorModalOpen] = useState(false);
  const [editingCreatorIndex, setEditingCreatorIndex] = useState<number | null>(null);
  const [creatorFormData, setCreatorFormData] = useState<TicCreatorItem>({
    name: '',
    role: '',
    category: '',
  });

  // Strategic Brand Alliances (stats.brands)
  const [brands, setBrands] = useState<TicBrandItem[]>(DEFAULT_TIC_BRANDS);
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [editingBrandIndex, setEditingBrandIndex] = useState<number | null>(null);
  const [brandFormData, setBrandFormData] = useState<TicBrandItem>({
    name: '',
    category: '',
  });

  const [savingEcosystem, setSavingEcosystem] = useState(false);

  const [formData, setFormData] = useState<TicEvent>({
    name: '',
    event_date: new Date().toISOString().split('T')[0],
    venue: 'Hyatt Regency, Trivandrum',
    description: '',
    cover_image: '',
    attendees_count: '500+ Creators',
    sort_order: 1,
    is_published: true,
  });

  const fetchEvents = async () => {
    setLoading(true);
    if (!isSupabaseConfigured) {
      setEvents([
        {
          id: '1',
          name: 'TIC Creator Summit & Gala Night',
          event_date: '2026-03-15',
          venue: 'O by Tamara, Trivandrum',
          description: 'South India’s premier digital creator conclave and annual award night.',
          cover_image: '/images/clients/tic.png',
          attendees_count: '500+ Creators & Executives',
          sort_order: 1,
          is_published: true,
        },
      ]);
      setCreators(DEFAULT_TIC_CREATORS);
      setBrands(DEFAULT_TIC_BRANDS);
      setLoading(false);
      return;
    }

    try {
      // Fetch TIC Manifesto and Ecosystem Stats from tic_content
      const { data: contentData } = await supabase
        .from('tic_content')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (contentData) {
        if (contentData.title) setManifestoTitle(contentData.title);
        if (contentData.tagline) setManifestoTagline(contentData.tagline);
        if (contentData.narrative) setManifestoNarrative(contentData.narrative);
        if (contentData.video_reel_url) setManifestoVideoUrl(contentData.video_reel_url);

        const statsObj =
          contentData.stats && typeof contentData.stats === 'object' && !Array.isArray(contentData.stats)
            ? contentData.stats
            : {};
        setRawStats(statsObj);

        if (Array.isArray(statsObj.creators) && statsObj.creators.length > 0) {
          setCreators(statsObj.creators);
        } else {
          setCreators(DEFAULT_TIC_CREATORS);
        }

        if (Array.isArray(statsObj.brands) && statsObj.brands.length > 0) {
          setBrands(statsObj.brands);
        } else {
          setBrands(DEFAULT_TIC_BRANDS);
        }
      } else {
        setCreators(DEFAULT_TIC_CREATORS);
        setBrands(DEFAULT_TIC_BRANDS);
      }

      // Fetch TIC Events
      const { data, error } = await supabase
        .from('tic_events')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (err: any) {
      showToast(err.message || 'Failed to load TIC content', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Safe helper: ALWAYS retains every other existing property in stats JSONB
  const persistEcosystem = async (
    nextCreators: TicCreatorItem[],
    nextBrands: TicBrandItem[],
    successMsg: string
  ): Promise<boolean> => {
    setSavingEcosystem(true);
    if (!isSupabaseConfigured) {
      setCreators(nextCreators);
      setBrands(nextBrands);
      setSavingEcosystem(false);
      showToast(`${successMsg} (preview mode)`);
      return true;
    }

    try {
      // 1. Fetch fresh row from tic_content to preserve ANY existing properties in stats
      const { data: latestRow, error: fetchErr } = await supabase
        .from('tic_content')
        .select('id, stats')
        .limit(1)
        .maybeSingle();

      if (fetchErr) throw fetchErr;

      // 2. Safe merge: retain ALL existing stats properties
      const existingStats =
        latestRow?.stats && typeof latestRow.stats === 'object' && !Array.isArray(latestRow.stats)
          ? latestRow.stats
          : (rawStats && typeof rawStats === 'object' && !Array.isArray(rawStats) ? rawStats : {});

      const updatedStats = {
        ...existingStats,
        creators: nextCreators,
        brands: nextBrands,
      };

      // 3. Update or Insert
      if (latestRow?.id) {
        const { error: updateErr } = await supabase
          .from('tic_content')
          .update({
            stats: updatedStats,
            updated_at: new Date().toISOString(),
          })
          .eq('id', latestRow.id);

        if (updateErr) throw updateErr;
      } else {
        const { error: insertErr } = await supabase
          .from('tic_content')
          .insert([
            {
              title: manifestoTitle.trim() || 'TRIVANDRUM INFLUENCER CIRCLE',
              tagline: manifestoTagline.trim() || 'TIC • CO-FOUNDED BY RIYAS',
              narrative: manifestoNarrative.trim(),
              video_reel_url: manifestoVideoUrl.trim() || null,
              stats: updatedStats,
              updated_at: new Date().toISOString(),
            },
          ]);

        if (insertErr) throw insertErr;
      }

      setRawStats(updatedStats);
      setCreators(nextCreators);
      setBrands(nextBrands);
      showToast(successMsg);
      return true;
    } catch (err: any) {
      showToast(err.message || 'Failed to save TIC ecosystem', 'error');
      return false;
    } finally {
      setSavingEcosystem(false);
    }
  };

  const handleSaveManifesto = async () => {
    setSavingManifesto(true);
    if (!isSupabaseConfigured) {
      setTimeout(() => {
        setSavingManifesto(false);
        showToast('TIC Manifesto saved (preview)');
      }, 500);
      return;
    }

    try {
      const { data: existing } = await supabase
        .from('tic_content')
        .select('id, stats')
        .limit(1)
        .maybeSingle();

      const existingStats =
        existing?.stats && typeof existing.stats === 'object' && !Array.isArray(existing.stats)
          ? existing.stats
          : (rawStats && typeof rawStats === 'object' && !Array.isArray(rawStats) ? rawStats : {});

      const payload: any = {
        title: manifestoTitle.trim(),
        tagline: manifestoTagline.trim(),
        narrative: manifestoNarrative.trim(),
        video_reel_url: manifestoVideoUrl.trim() || null,
        updated_at: new Date().toISOString(),
      };

      if (existing?.id) {
        // Updating only manifesto text and video, leaving stats column completely preserved
        const { error } = await supabase
          .from('tic_content')
          .update(payload)
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        // If inserting fresh row, ensure stats is retained
        payload.stats = existingStats;
        const { error } = await supabase
          .from('tic_content')
          .insert([payload]);
        if (error) throw error;
      }
      showToast('TIC Manifesto & Headline updated');
    } catch (err: any) {
      showToast(err.message || 'Failed to save TIC manifesto', 'error');
    } finally {
      setSavingManifesto(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // --- Event Handlers ---
  const openCreateModal = () => {
    setEditingEvent(null);
    setFormData({
      name: '',
      event_date: new Date().toISOString().split('T')[0],
      venue: 'Hyatt Regency, Trivandrum',
      description: '',
      cover_image: '',
      attendees_count: '500+ Creators',
      sort_order: events.length + 1,
      is_published: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (ev: TicEvent) => {
    setEditingEvent(ev);
    setFormData({ ...ev });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const res = await uploadMediaFile(file, 'tic');
    setUploading(false);
    if (res.success && res.url) {
      setFormData((prev) => ({ ...prev, cover_image: res.url || '' }));
      showToast('Event cover uploaded');
    } else {
      showToast(res.error || 'Upload failed', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Event title is required', 'error');
      return;
    }

    const payload = {
      name: formData.name.trim(),
      event_date: formData.event_date || null,
      venue: formData.venue ? formData.venue.trim() : null,
      description: formData.description ? formData.description.trim() : null,
      cover_image: formData.cover_image.trim() || '/images/clients/tic.png',
      attendees_count: formData.attendees_count ? formData.attendees_count.trim() : null,
      sort_order: Number(formData.sort_order) || 0,
      is_published: formData.is_published,
      updated_at: new Date().toISOString(),
    };

    try {
      if (editingEvent?.id) {
        const { error } = await supabase
          .from('tic_events')
          .update(payload)
          .eq('id', editingEvent.id);

        if (error) throw error;
        showToast('TIC Event updated');
      } else {
        const { error } = await supabase
          .from('tic_events')
          .insert([payload]);

        if (error) throw error;
        showToast('TIC Event announced');
      }
      setIsModalOpen(false);
      fetchEvents();
    } catch (err: any) {
      showToast(err.message || 'Save failed', 'error');
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this TIC event?')) return;
    try {
      const { error } = await supabase.from('tic_events').delete().eq('id', id);
      if (error) throw error;
      showToast('Event deleted');
      fetchEvents();
    } catch (err: any) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  const togglePublish = async (ev: TicEvent) => {
    if (!ev.id) return;
    const newState = !ev.is_published;
    try {
      const { error } = await supabase
        .from('tic_events')
        .update({ is_published: newState, updated_at: new Date().toISOString() })
        .eq('id', ev.id);

      if (error) throw error;
      setEvents((prev) =>
        prev.map((item) => (item.id === ev.id ? { ...item, is_published: newState } : item))
      );
      showToast(newState ? 'Event published' : 'Event hidden');
    } catch (err: any) {
      showToast(err.message || 'Update failed', 'error');
    }
  };

  // --- Creator Handlers ---
  const openCreateCreatorModal = () => {
    setEditingCreatorIndex(null);
    setCreatorFormData({ name: '', role: '', category: 'Fashion & Luxury' });
    setIsCreatorModalOpen(true);
  };

  const openEditCreatorModal = (creator: TicCreatorItem, index: number) => {
    setEditingCreatorIndex(index);
    setCreatorFormData({ ...creator });
    setIsCreatorModalOpen(true);
  };

  const handleSaveCreator = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = creatorFormData.name.trim();
    const role = creatorFormData.role.trim();
    const category = creatorFormData.category.trim();

    if (!name) {
      showToast('Creator name is required', 'error');
      return;
    }
    if (!role) {
      showToast('Creator role / title is required', 'error');
      return;
    }

    const item: TicCreatorItem = {
      name,
      role,
      category: category || 'Lifestyle & Fashion',
    };

    let updated: TicCreatorItem[];
    if (editingCreatorIndex !== null) {
      updated = creators.map((c, i) => (i === editingCreatorIndex ? item : c));
    } else {
      updated = [...creators, item];
    }

    const success = await persistEcosystem(
      updated,
      brands,
      editingCreatorIndex !== null ? `Creator "${name}" updated` : `Creator "${name}" added to TIC`
    );

    if (success) {
      setIsCreatorModalOpen(false);
    }
  };

  const handleDeleteCreator = async (index: number) => {
    const target = creators[index];
    if (!target) return;
    if (!confirm(`Are you sure you want to remove creator "${target.name}" from the TIC network?`)) return;

    const updated = creators.filter((_, i) => i !== index);
    await persistEcosystem(updated, brands, `Creator "${target.name}" removed`);
  };

  const handleMoveCreator = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= creators.length) return;

    const updated = [...creators];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);

    await persistEcosystem(updated, brands, `Moved "${moved.name}" ${direction}`);
  };

  const handleResetCreators = async () => {
    if (
      !confirm(
        'Reset creators list to the 6 verified launch members? Any custom creator changes will be replaced with defaults.'
      )
    ) {
      return;
    }
    await persistEcosystem(DEFAULT_TIC_CREATORS, brands, 'Creators reset to launch defaults');
  };

  // --- Brand Handlers ---
  const openCreateBrandModal = () => {
    setEditingBrandIndex(null);
    setBrandFormData({ name: '', category: 'Enterprise Brand' });
    setIsBrandModalOpen(true);
  };

  const openEditBrandModal = (brand: TicBrandItem, index: number) => {
    setEditingBrandIndex(index);
    setBrandFormData({ ...brand });
    setIsBrandModalOpen(true);
  };

  const handleSaveBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = brandFormData.name.trim();
    const category = brandFormData.category.trim();

    if (!name) {
      showToast('Brand name is required', 'error');
      return;
    }

    const item: TicBrandItem = {
      name,
      category: category || 'Enterprise Partner',
    };

    let updated: TicBrandItem[];
    if (editingBrandIndex !== null) {
      updated = brands.map((b, i) => (i === editingBrandIndex ? item : b));
    } else {
      updated = [...brands, item];
    }

    const success = await persistEcosystem(
      creators,
      updated,
      editingBrandIndex !== null ? `Brand partner "${name}" updated` : `Brand partner "${name}" added to TIC`
    );

    if (success) {
      setIsBrandModalOpen(false);
    }
  };

  const handleDeleteBrand = async (index: number) => {
    const target = brands[index];
    if (!target) return;
    if (!confirm(`Are you sure you want to remove brand partner "${target.name}" from TIC alliances?`)) return;

    const updated = brands.filter((_, i) => i !== index);
    await persistEcosystem(creators, updated, `Brand partner "${target.name}" removed`);
  };

  const handleMoveBrand = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= brands.length) return;

    const updated = [...brands];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);

    await persistEcosystem(creators, updated, `Moved "${moved.name}" ${direction}`);
  };

  const handleResetBrands = async () => {
    if (
      !confirm(
        'Reset brand alliances to the 8 verified launch partners? Any custom brand changes will be replaced with defaults.'
      )
    ) {
      return;
    }
    await persistEcosystem(creators, DEFAULT_TIC_BRANDS, 'Brand alliances reset to launch defaults');
  };

  const filteredEvents = events.filter(
    (e) =>
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.venue && e.venue.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#C7A46A] uppercase tracking-wider mb-1">
            <Radio size={14} />
            <span>TIC ECOSYSTEM & CONCLAVES</span>
          </div>
          <h1 className="text-2xl font-serif text-white uppercase tracking-wide">
            TIC Ecosystem, Creators & Events
          </h1>
          <p className="text-neutral-400 text-xs font-light">
            Manage the Trivandrum Influencer Circle (TIC) guild narrative, creator talent roster, strategic brand alliances, and conclaves.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={openCreateCreatorModal}
            className="px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-[#C7A46A] text-neutral-200 hover:text-white font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all"
          >
            <Users size={14} className="text-[#C7A46A]" />
            <span>Add Creator</span>
          </button>
          <button
            onClick={openCreateBrandModal}
            className="px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-[#C7A46A] text-neutral-200 hover:text-white font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all"
          >
            <Building2 size={14} className="text-[#C7A46A]" />
            <span>Add Brand</span>
          </button>
          <button
            onClick={openCreateModal}
            className="px-5 py-2.5 rounded-xl bg-[#C7A46A] hover:bg-[#D4B678] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shadow-[#C7A46A]/20"
          >
            <Plus size={16} />
            <span>Announce TIC Event</span>
          </button>
        </div>
      </div>

      {/* 1. TIC Manifesto & Narrative Card (tic_content) */}
      <div className="p-6 rounded-3xl bg-[#0D0D0D] border border-neutral-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono uppercase tracking-widest text-[#C7A46A]">
            TIC Guild Manifesto & Narrative (tic_content)
          </h2>
          <button
            onClick={handleSaveManifesto}
            disabled={savingManifesto}
            className="px-4 py-1.5 rounded-xl bg-[#C7A46A] hover:bg-[#D4B678] text-black font-mono font-bold text-xs uppercase flex items-center gap-1.5 disabled:opacity-50"
          >
            <Save size={13} />
            <span>{savingManifesto ? 'Saving...' : 'Update Manifesto'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
              Headline Title
            </label>
            <input
              type="text"
              value={manifestoTitle}
              onChange={(e) => setManifestoTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-[#141414] border border-neutral-800 text-white text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
              Tagline / Subheading
            </label>
            <input
              type="text"
              value={manifestoTagline}
              onChange={(e) => setManifestoTagline(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-[#141414] border border-neutral-800 text-white text-xs font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
            Manifesto / Platform Narrative
          </label>
          <textarea
            rows={3}
            value={manifestoNarrative}
            onChange={(e) => setManifestoNarrative(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-[#141414] border border-neutral-800 text-white text-xs font-mono"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
            Launch Video Embed URL
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={manifestoVideoUrl}
              onChange={(e) => setManifestoVideoUrl(e.target.value)}
              placeholder="https://drive.google.com/file/d/.../preview"
              className="flex-1 px-4 py-2 rounded-xl bg-[#141414] border border-neutral-800 text-white text-xs font-mono"
            />
            {manifestoVideoUrl && (
              <button
                type="button"
                onClick={() => openVideo({
                  src: manifestoVideoUrl,
                  title: manifestoTitle || 'TIC Manifesto Video',
                  subtitle: manifestoTagline || 'Trivandrum Influencer Circle',
                  badge: 'TIC LAUNCH',
                })}
                className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-[#C7A46A] text-neutral-300 hover:text-black font-mono text-xs flex items-center gap-1.5 transition-colors shrink-0"
              >
                <Play size={13} className="fill-current" />
                <span>Preview</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. TIC Core Creator Network Card (stats.creators) */}
      <div className="p-6 rounded-3xl bg-[#0D0D0D] border border-neutral-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-850">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#C7A46A]/10 border border-[#C7A46A]/30 flex items-center justify-center text-[#C7A46A]">
              <Users size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-serif text-white uppercase tracking-wider">
                  Core Creator Network
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#C7A46A]/10 text-[#C7A46A] border border-[#C7A46A]/20">
                  {creators.length} Creators
                </span>
                <span className="text-[10px] font-mono text-neutral-500">
                  (tic_content.stats.creators)
                </span>
              </div>
              <p className="text-neutral-400 text-xs font-light mt-0.5">
                Regional influencers and creator talent featured in Section 4 on the live TIC page.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetCreators}
              disabled={savingEcosystem}
              className="px-3 py-1.5 rounded-xl border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-neutral-200 font-mono text-[11px] uppercase flex items-center gap-1.5 transition-all"
              title="Reset to 6 launch creators"
            >
              <RotateCcw size={12} />
              <span>Defaults</span>
            </button>
            <button
              onClick={openCreateCreatorModal}
              disabled={savingEcosystem}
              className="px-4 py-1.5 rounded-xl bg-[#C7A46A] hover:bg-[#D4B678] text-black font-mono font-bold text-xs uppercase flex items-center gap-1.5 transition-all"
            >
              <Plus size={14} />
              <span>Add Creator</span>
            </button>
          </div>
        </div>

        {creators.length === 0 ? (
          <div className="py-12 text-center text-neutral-500 font-mono text-xs border border-dashed border-neutral-800 rounded-2xl">
            No creators configured. Click &quot;Add Creator&quot; or &quot;Defaults&quot; to restore launch lineup.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {creators.map((c, idx) => (
              <div
                key={`${c.name}-${idx}`}
                className="p-4 rounded-2xl bg-[#141414] border border-neutral-800 hover:border-[#C7A46A]/40 transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h3 className="text-base font-serif text-white font-medium truncate">
                      {c.name}
                    </h3>
                    <span className="text-[10px] font-mono text-[#C7A46A] bg-[#C7A46A]/10 px-2 py-0.5 rounded-full border border-[#C7A46A]/20 shrink-0">
                      {c.category}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-neutral-400 line-clamp-2">
                    {c.role}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-neutral-800/80">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-mono text-neutral-500 mr-1">#{idx + 1}</span>
                    <button
                      onClick={() => handleMoveCreator(idx, 'up')}
                      disabled={idx === 0 || savingEcosystem}
                      className="p-1 rounded bg-[#1e1e1e] hover:bg-[#282828] text-neutral-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move up"
                    >
                      <ArrowUp size={12} />
                    </button>
                    <button
                      onClick={() => handleMoveCreator(idx, 'down')}
                      disabled={idx === creators.length - 1 || savingEcosystem}
                      className="p-1 rounded bg-[#1e1e1e] hover:bg-[#282828] text-neutral-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move down"
                    >
                      <ArrowDown size={12} />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditCreatorModal(c, idx)}
                      disabled={savingEcosystem}
                      className="p-1.5 rounded-lg bg-[#1e1e1e] hover:bg-[#282828] text-neutral-300 hover:text-white transition-colors"
                      title="Edit creator"
                    >
                      <Edit3 size={13} />
                    </button>
                    <button
                      onClick={() => handleDeleteCreator(idx)}
                      disabled={savingEcosystem}
                      className="p-1.5 rounded-lg bg-red-950/30 hover:bg-red-900/50 text-red-400 hover:text-red-200 transition-colors"
                      title="Remove creator"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. TIC Strategic Brand Alliances Card (stats.brands) */}
      <div className="p-6 rounded-3xl bg-[#0D0D0D] border border-neutral-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-850">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#C7A46A]/10 border border-[#C7A46A]/30 flex items-center justify-center text-[#C7A46A]">
              <Building2 size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-serif text-white uppercase tracking-wider">
                  Strategic Brand Alliances
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#C7A46A]/10 text-[#C7A46A] border border-[#C7A46A]/20">
                  {brands.length} Brands
                </span>
                <span className="text-[10px] font-mono text-neutral-500">
                  (tic_content.stats.brands)
                </span>
              </div>
              <p className="text-neutral-400 text-xs font-light mt-0.5">
                Corporate partners and commercial sponsors featured in Section 5 on the live TIC page.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetBrands}
              disabled={savingEcosystem}
              className="px-3 py-1.5 rounded-xl border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-neutral-200 font-mono text-[11px] uppercase flex items-center gap-1.5 transition-all"
              title="Reset to 8 launch brand partners"
            >
              <RotateCcw size={12} />
              <span>Defaults</span>
            </button>
            <button
              onClick={openCreateBrandModal}
              disabled={savingEcosystem}
              className="px-4 py-1.5 rounded-xl bg-[#C7A46A] hover:bg-[#D4B678] text-black font-mono font-bold text-xs uppercase flex items-center gap-1.5 transition-all"
            >
              <Plus size={14} />
              <span>Add Brand</span>
            </button>
          </div>
        </div>

        {brands.length === 0 ? (
          <div className="py-12 text-center text-neutral-500 font-mono text-xs border border-dashed border-neutral-800 rounded-2xl">
            No brand partners configured. Click &quot;Add Brand&quot; or &quot;Defaults&quot; to restore launch lineup.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {brands.map((b, idx) => (
              <div
                key={`${b.name}-${idx}`}
                className="p-4 rounded-xl bg-[#141414] border border-neutral-800 hover:border-[#C7A46A]/40 transition-all flex flex-col justify-between space-y-3"
              >
                <div className="text-center pt-1">
                  <h4 className="text-sm font-semibold text-white tracking-wide truncate">
                    {b.name}
                  </h4>
                  <span className="text-[10px] font-mono text-[#C7A46A] mt-1 block truncate">
                    {b.category}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2.5 border-t border-neutral-800/80">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMoveBrand(idx, 'up')}
                      disabled={idx === 0 || savingEcosystem}
                      className="p-1 rounded bg-[#1e1e1e] hover:bg-[#282828] text-neutral-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move left/up"
                    >
                      <ArrowUp size={11} />
                    </button>
                    <button
                      onClick={() => handleMoveBrand(idx, 'down')}
                      disabled={idx === brands.length - 1 || savingEcosystem}
                      className="p-1 rounded bg-[#1e1e1e] hover:bg-[#282828] text-neutral-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move right/down"
                    >
                      <ArrowDown size={11} />
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditBrandModal(b, idx)}
                      disabled={savingEcosystem}
                      className="p-1 rounded-lg bg-[#1e1e1e] hover:bg-[#282828] text-neutral-300 hover:text-white transition-colors"
                      title="Edit brand partner"
                    >
                      <Edit3 size={12} />
                    </button>
                    <button
                      onClick={() => handleDeleteBrand(idx)}
                      disabled={savingEcosystem}
                      className="p-1 rounded-lg bg-red-950/30 hover:bg-red-900/50 text-red-400 hover:text-red-200 transition-colors"
                      title="Remove brand"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. TIC Events & Creator Conclaves Section (tic_events) */}
      <div className="space-y-4 pt-4 border-t border-neutral-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-serif text-white uppercase tracking-wider">
              TIC Events & Conclaves Directory
            </h2>
            <p className="text-neutral-400 text-xs font-light">
              South India conclaves, networking galas, and festive activations.
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 rounded-xl bg-[#C7A46A] hover:bg-[#D4B678] text-black font-mono font-bold text-xs uppercase flex items-center gap-1.5 transition-all shadow-md shadow-[#C7A46A]/10"
          >
            <Plus size={14} />
            <span>Announce Event</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            placeholder="Search TIC events by name or venue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#111111] border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#C7A46A]"
          />
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="py-24 text-center text-neutral-500 font-mono text-xs uppercase tracking-widest">
            Loading events...
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="py-16 text-center text-neutral-500 font-mono text-xs border border-dashed border-neutral-800 rounded-2xl">
            No events announced. Click &quot;Announce TIC Event&quot; to begin.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredEvents.map((ev) => (
              <div
                key={ev.id || ev.name}
                className="p-5 rounded-2xl bg-[#0D0D0D] border border-neutral-850 hover:border-neutral-700 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div 
                    onClick={ev.cover_image ? () => openImage({
                      src: ev.cover_image,
                      title: ev.name,
                      subtitle: `${ev.event_date || ''} • ${ev.venue || ''}`,
                      category: 'TIC CONCLAVE',
                    }) : undefined}
                    className={`aspect-[16/9] rounded-xl bg-[#141414] overflow-hidden relative border border-neutral-800 ${
                      ev.cover_image ? 'cursor-pointer group/ticev' : ''
                    }`}
                    title={ev.cover_image ? 'Click to view event flyer in high-resolution' : undefined}
                  >
                    {ev.cover_image ? (
                      <img src={ev.cover_image} alt={ev.name} className="w-full h-full object-cover transition-transform duration-500 group-hover/ticev:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-600">
                        <Radio size={24} />
                      </div>
                    )}
                    {ev.cover_image && (
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/ticev:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none z-10">
                        <div className="px-3.5 py-1.5 rounded-full bg-black/85 backdrop-blur-md border border-[#C7A46A]/60 text-[#C7A46A] text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5 shadow-xl transform scale-95 group-hover/ticev:scale-100 transition-transform">
                          <Maximize2 size={11} />
                          <span>Expand</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-[11px] font-mono text-neutral-400">
                    {ev.event_date && (
                      <span className="flex items-center gap-1">
                        <Calendar size={12} className="text-[#C7A46A]" />
                        {ev.event_date}
                      </span>
                    )}
                    {ev.venue && (
                      <span className="flex items-center gap-1">
                        <MapPin size={12} className="text-neutral-500" />
                        {ev.venue}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-serif text-white font-medium">{ev.name}</h3>
                  {ev.description && <p className="text-neutral-400 text-xs font-light line-clamp-2">{ev.description}</p>}
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
                    <span>{ev.is_published ? 'Published' : 'Hidden'}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(ev)}
                      className="p-1.5 rounded-lg bg-[#181818] hover:bg-[#222] text-neutral-300 hover:text-white"
                    >
                      <Edit3 size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(ev.id)}
                      className="p-1.5 rounded-lg bg-red-950/30 hover:bg-red-900/50 text-red-400 hover:text-red-200"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <h2 className="text-xl font-serif text-white uppercase">
                {editingEvent ? 'Edit TIC Event' : 'Announce TIC Event'}
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
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#C7A46A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                    Event Date
                  </label>
                  <input
                    type="date"
                    value={formData.event_date || ''}
                    onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                    Expected Attendees
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 500+ Creators"
                    value={formData.attendees_count || ''}
                    onChange={(e) => setFormData({ ...formData, attendees_count: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                  Venue / Location
                </label>
                <input
                  type="text"
                  value={formData.venue || ''}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                />
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
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                  Event Flyer / Banner Upload
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
                {formData.cover_image && (
                  <div className="mt-2 flex items-center gap-2">
                    <img 
                      src={formData.cover_image} 
                      alt="Preview" 
                      onClick={() => openImage({ src: formData.cover_image, title: formData.name || 'TIC Event Flyer', category: 'TIC CONCLAVE' })}
                      className="w-16 h-10 object-cover rounded border border-neutral-700 cursor-pointer hover:opacity-80 transition-opacity" 
                      title="Click to view full image in high-resolution"
                    />
                    <span className="text-[10px] font-mono text-neutral-500 truncate max-w-xs">{formData.cover_image}</span>
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
                  <span className="text-xs font-mono text-neutral-300">Published to public website</span>
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
                  <span>{editingEvent ? 'Save Event' : 'Announce Event'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Creator Modal */}
      {isCreatorModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-[#C7A46A]" />
                <h2 className="text-xl font-serif text-white uppercase">
                  {editingCreatorIndex !== null ? 'Edit TIC Creator' : 'Add TIC Creator'}
                </h2>
              </div>
              <button
                onClick={() => setIsCreatorModalOpen(false)}
                className="p-1 rounded-lg hover:bg-[#222] text-neutral-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCreator} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                  Creator Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Riyas, Ganga, Rithu..."
                  value={creatorFormData.name}
                  onChange={(e) => setCreatorFormData({ ...creatorFormData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#C7A46A]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                  Role / Description *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Co-Founder • Runway & Creative Direction"
                  value={creatorFormData.role}
                  onChange={(e) => setCreatorFormData({ ...creatorFormData, role: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#C7A46A]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                  Category / Niche *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fashion & Luxury, Lifestyle, Automotive..."
                  value={creatorFormData.category}
                  onChange={(e) => setCreatorFormData({ ...creatorFormData, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#C7A46A]"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsCreatorModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-neutral-800 hover:bg-[#181818] text-neutral-300 font-mono text-xs uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEcosystem}
                  className="px-6 py-2.5 rounded-xl bg-[#C7A46A] hover:bg-[#D4B678] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 disabled:opacity-50"
                >
                  <Save size={15} />
                  <span>{editingCreatorIndex !== null ? 'Update Creator' : 'Save Creator'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Brand Modal */}
      {isBrandModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Building2 size={16} className="text-[#C7A46A]" />
                <h2 className="text-xl font-serif text-white uppercase">
                  {editingBrandIndex !== null ? 'Edit Brand Partner' : 'Add Brand Partner'}
                </h2>
              </div>
              <button
                onClick={() => setIsBrandModalOpen(false)}
                className="p-1 rounded-lg hover:bg-[#222] text-neutral-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveBrand} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                  Brand Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Max Fashion, Ather Energy, Škoda..."
                  value={brandFormData.name}
                  onChange={(e) => setBrandFormData({ ...brandFormData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#C7A46A]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                  Industry / Category *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apparel & Retail, Luxury Hospitality, EV Automotive..."
                  value={brandFormData.category}
                  onChange={(e) => setBrandFormData({ ...brandFormData, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#C7A46A]"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsBrandModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-neutral-800 hover:bg-[#181818] text-neutral-300 font-mono text-xs uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEcosystem}
                  className="px-6 py-2.5 rounded-xl bg-[#C7A46A] hover:bg-[#D4B678] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 disabled:opacity-50"
                >
                  <Save size={15} />
                  <span>{editingBrandIndex !== null ? 'Update Brand' : 'Save Brand'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
