import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import { uploadMediaFile } from '../../../services/cmsService';
import { Plus, Edit3, Trash2, Eye, EyeOff, Search, Save, X, Upload, Calendar, Play } from 'lucide-react';

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
  sort_order: number;
  is_published: boolean;
}

export interface TimelineYearRow {
  id: string;
  year: number;
  title?: string;
  theme?: string;
  subtitle?: string;
  description?: string;
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState<TimelineEvent>({
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
        { id: 'y-2026', year: 2026, title: 'EXPANSION & HORIZONS' },
        { id: 'y-2025', year: 2025, title: 'SCALE & ELEVATION' },
        { id: 'y-2024', year: 2024, title: 'THE ACCELERATION' },
        { id: 'y-2023', year: 2023, title: 'THE INFLECTION POINT' },
        { id: 'y-2022', year: 2022, title: 'THE RESURGENCE' },
        { id: 'y-2021', year: 2021, title: 'DIGITAL INNOVATION' },
        { id: 'y-2020', year: 2020, title: 'THE GENESIS' },
      ]);
      setEvents([
        {
          id: '1',
          year_number: 2024,
          name: 'Koottam Flea Festival Season 2',
          type: 'Event',
          category_badge: 'Cultural Flea',
          location_or_client: 'Technopark Ground, Trivandrum',
          description: 'A 2-day extravaganza uniting 100+ creative retail popups, food trucks, and live music acts.',
          image: '/images/timeline/koottam-season-2.jpg',
          sort_order: 1,
          is_published: true,
        },
        {
          id: '2',
          year_number: 2024,
          name: 'Škoda Auto Fans Rally Chronicle',
          type: 'Campaign',
          category_badge: 'Automotive Media',
          location_or_client: 'Škoda Auto India',
          description: 'Official video campaign production documenting the luxury automotive owner rally.',
          image: '/images/timeline/skoda.jpg',
          sort_order: 2,
          is_published: true,
        },
      ]);
      setLoading(false);
      return;
    }

    try {
      const { data: yearsData, error: yearsError } = await supabase
        .from('timeline_years')
        .select('*')
        .order('year', { ascending: false });

      if (yearsError) throw yearsError;
      setYears(yearsData || []);

      const { data: eventsData, error: eventsError } = await supabase
        .from('timeline_events')
        .select('*')
        .order('sort_order', { ascending: true });

      if (eventsError) throw eventsError;
      setEvents(eventsData || []);
    } catch (err: any) {
      showToast(err.message || 'Failed to load timeline', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchYearsAndEvents();
  }, []);

  const openCreateModal = () => {
    setEditingEvent(null);
    const matchingYearRow = years.find((y) => y.year === selectedYear);
    setFormData({
      year_id: matchingYearRow?.id,
      year_number: selectedYear,
      name: '',
      type: 'Event',
      category_badge: 'Runway Showcase',
      location_or_client: '',
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
    setFormData({ ...ev });
    setIsModalOpen(true);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Event name is required', 'error');
      return;
    }

    const matchingYearRow = years.find((y) => y.year === formData.year_number);

    const payload = {
      year_id: formData.year_id || matchingYearRow?.id || years[0]?.id,
      year_number: Number(formData.year_number) || selectedYear,
      name: formData.name.trim(),
      type: formData.type,
      category_badge: formData.category_badge ? formData.category_badge.trim() : null,
      location_or_client: formData.location_or_client ? formData.location_or_client.trim() : null,
      description: formData.description ? formData.description.trim() : null,
      image: formData.image ? formData.image.trim() : null,
      video_url: formData.video_url ? formData.video_url.trim() : null,
      has_video: Boolean(formData.video_url && formData.video_url.trim().length > 0),
      sort_order: Number(formData.sort_order) || 0,
      is_published: formData.is_published,
      updated_at: new Date().toISOString(),
    };

    try {
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
      fetchYearsAndEvents();
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

  const filteredEvents = events.filter((e) => {
    const matchesYear = e.year_number === selectedYear;
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
            <span>HISTORICAL CHRONICLE (2020–2026)</span>
          </div>
          <h1 className="text-2xl font-serif text-white uppercase tracking-wide">
            Timeline & Landmark Events
          </h1>
          <p className="text-neutral-400 text-xs font-light">
            Manage the year-by-year chronicle, milestone events, campaign productions, and venue records.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-xl bg-[#C7A46A] hover:bg-[#D4B678] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 self-start sm:self-auto transition-all shadow-lg shadow-[#C7A46A]/20"
        >
          <Plus size={16} />
          <span>Add Event to {selectedYear}</span>
        </button>
      </div>

      {/* Year Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-neutral-850">
        {years.map((y) => (
          <button
            key={y.year}
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
        <div className="py-16 text-center text-neutral-500 font-mono text-xs border border-dashed border-neutral-800 rounded-2xl">
          No events found for {selectedYear}. Click &quot;Add Event to {selectedYear}&quot; to begin.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEvents.map((ev) => (
            <div
              key={ev.id || ev.name}
              className="p-5 rounded-2xl bg-[#0D0D0D] border border-neutral-850 hover:border-neutral-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="aspect-[16/9] rounded-xl bg-[#141414] overflow-hidden relative border border-neutral-800">
                  {ev.image ? (
                    <img src={ev.image} alt={ev.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-600">
                      <Calendar size={24} />
                    </div>
                  )}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-neutral-700 text-[10px] font-mono text-[#C7A46A] uppercase">
                      {ev.type}
                    </span>
                    {ev.category_badge && (
                      <span className="px-2 py-0.5 rounded-full bg-neutral-900/80 text-neutral-300 text-[10px] font-mono uppercase">
                        {ev.category_badge}
                      </span>
                    )}
                  </div>
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <h2 className="text-xl font-serif text-white uppercase">
                {editingEvent ? 'Edit Timeline Event' : `Add Event to ${formData.year_number}`}
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
                  className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#C7A46A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                    Year Number
                  </label>
                  <input
                    type="number"
                    value={formData.year_number}
                    onChange={(e) => setFormData({ ...formData, year_number: parseInt(e.target.value) || 2026 })}
                    className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                  />
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
    </div>
  );
};
