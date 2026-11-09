import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import { uploadMediaFile } from '../../../services/cmsService';
import { Plus, Edit3, Trash2, Eye, EyeOff, Search, Save, X, Upload, Radio, Calendar, MapPin, ExternalLink } from 'lucide-react';

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
  const [events, setEvents] = useState<TicEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TicEvent | null>(null);
  const [uploading, setUploading] = useState(false);

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
          cover_image: '/images/events/tic-conclave.jpg',
          attendees_count: '500+ Creators & Executives',
          sort_order: 1,
          is_published: true,
        },
      ]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('tic_events')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (err: any) {
      showToast(err.message || 'Failed to load TIC events', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

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
      cover_image: formData.cover_image.trim() || '/images/events/tic-conclave.jpg',
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

  const filteredEvents = events.filter(
    (e) =>
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.venue && e.venue.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#C7A46A] uppercase tracking-wider mb-1">
            <Radio size={14} />
            <span>TIC CONCLAVES & GATHERINGS</span>
          </div>
          <h1 className="text-2xl font-serif text-white uppercase tracking-wide">
            TIC Events & Creator Conclaves
          </h1>
          <p className="text-neutral-400 text-xs font-light">
            Manage creator meetups, annual summits, networking dinners, and ticketing announcements.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-xl bg-[#C7A46A] hover:bg-[#D4B678] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 self-start sm:self-auto transition-all shadow-lg shadow-[#C7A46A]/20"
        >
          <Plus size={16} />
          <span>Announce TIC Event</span>
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

      {/* Grid */}
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
                <div className="aspect-[16/9] rounded-xl bg-[#141414] overflow-hidden relative border border-neutral-800">
                  {ev.cover_image ? (
                    <img src={ev.cover_image} alt={ev.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-600">
                      <Radio size={24} />
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

      {/* Modal */}
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
                    <img src={formData.cover_image} alt="Preview" className="w-16 h-10 object-cover rounded border border-neutral-700" />
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
    </div>
  );
};
