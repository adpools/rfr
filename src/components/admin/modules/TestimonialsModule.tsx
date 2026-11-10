import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import { uploadMediaFile } from '../../../services/cmsService';
import { Plus, Edit3, Trash2, Eye, EyeOff, Search, Save, X, Upload, Quote, Star } from 'lucide-react';

export interface Testimonial {
  id?: string;
  name: string;
  designation: string;
  company?: string;
  image: string;
  quote: string;
  rating: number;
  event_or_brand?: string;
  is_featured_home: boolean;
  sort_order: number;
  is_published: boolean;
}

interface TestimonialsModuleProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  isConfigured: boolean;
}

export const TestimonialsModule: React.FC<TestimonialsModuleProps> = ({ showToast }) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState<Testimonial>({
    name: '',
    designation: '',
    company: '',
    image: '',
    quote: '',
    rating: 5,
    event_or_brand: 'RFR Runway Showcase',
    is_featured_home: true,
    sort_order: 1,
    is_published: true,
  });

  const fetchTestimonials = async () => {
    setLoading(true);
    if (!isSupabaseConfigured) {
      setTestimonials([
        {
          id: '1',
          name: 'Anu',
          designation: 'Celebrity Fashion Designer & Style Consultant',
          company: 'ToU|By Aanu — Aanu Designs Pvt. Ltd.',
          image: '/images/influencers/aanu.jpeg',
          quote: 'It has always been a pleasure associating with Riyaz, from my early collaborations at his events to being invited as a celebrity guest and serving on various judging panels. His ability to curate, organise, and execute fashion showcases with finesse is commendable.',
          rating: 5,
          event_or_brand: 'Runway Jury & Celebrity Guest',
          is_featured_home: true,
          sort_order: 1,
          is_published: true,
        },
        {
          id: '2',
          name: 'Dr Shikha Santhosh',
          designation: 'Dental Surgeon / Model / Artist',
          company: 'Max Fashion Showstopper',
          image: '/images/influencers/shikha-santhosh.jpg',
          quote: 'It has been an absolute pleasure working with Riyaz. In every single project, he has stood out for his professionalism, clarity and dedication to the craft.',
          rating: 5,
          event_or_brand: 'Max Fashion Showcase',
          is_featured_home: true,
          sort_order: 2,
          is_published: true,
        },
      ]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (err: any) {
      showToast(err.message || 'Failed to load testimonials', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const openCreateModal = () => {
    setEditingTestimonial(null);
    setFormData({
      name: '',
      designation: '',
      company: '',
      image: '',
      quote: '',
      rating: 5,
      event_or_brand: 'RFR Fashion Runway',
      is_featured_home: true,
      sort_order: testimonials.length + 1,
      is_published: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (t: Testimonial) => {
    setEditingTestimonial(t);
    setFormData({ ...t });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const res = await uploadMediaFile(file, 'testimonials');
    setUploading(false);
    if (res.success && res.url) {
      setFormData((prev) => ({ ...prev, image: res.url || '' }));
      showToast('Client portrait uploaded');
    } else {
      showToast(res.error || 'Upload failed', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.quote.trim()) {
      showToast('Client name and review quote are required', 'error');
      return;
    }

    const payload = {
      name: formData.name.trim(),
      designation: formData.designation.trim() || 'Client',
      company: formData.company ? formData.company.trim() : null,
      image: formData.image.trim() || '/images/influencers/shikha-santhosh.jpg',
      quote: formData.quote.trim(),
      rating: Math.min(5, Math.max(1, Number(formData.rating) || 5)),
      event_or_brand: formData.event_or_brand ? formData.event_or_brand.trim() : null,
      is_featured_home: formData.is_featured_home,
      sort_order: Number(formData.sort_order) || 0,
      is_published: formData.is_published,
      updated_at: new Date().toISOString(),
    };

    try {
      if (editingTestimonial?.id) {
        const { error } = await supabase
          .from('testimonials')
          .update(payload)
          .eq('id', editingTestimonial.id);

        if (error) throw error;
        showToast('Testimonial updated');
      } else {
        const { error } = await supabase
          .from('testimonials')
          .insert([payload]);

        if (error) throw error;
        showToast('Testimonial added to live website');
      }
      setIsModalOpen(false);
      fetchTestimonials();
    } catch (err: any) {
      showToast(err.message || 'Save failed', 'error');
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      const { error } = await supabase.from('testimonials').delete().eq('id', id);
      if (error) throw error;
      showToast('Testimonial deleted');
      fetchTestimonials();
    } catch (err: any) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  const togglePublish = async (t: Testimonial) => {
    if (!t.id) return;
    const newState = !t.is_published;
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ is_published: newState, updated_at: new Date().toISOString() })
        .eq('id', t.id);

      if (error) throw error;
      setTestimonials((prev) =>
        prev.map((item) => (item.id === t.id ? { ...item, is_published: newState } : item))
      );
      showToast(newState ? 'Testimonial visible' : 'Testimonial hidden');
    } catch (err: any) {
      showToast(err.message || 'Update failed', 'error');
    }
  };

  const filteredTestimonials = testimonials.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.quote.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.company && t.company.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#C7A46A] uppercase tracking-wider mb-1">
            <Quote size={14} />
            <span>ENDORSEMENTS & REPUTATION</span>
          </div>
          <h1 className="text-2xl font-serif text-white uppercase tracking-wide">
            Testimonials & Client Words
          </h1>
          <p className="text-neutral-400 text-xs font-light">
            Manage authentic quotes, designations, brand affiliations, and ratings.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-xl bg-[#C7A46A] hover:bg-[#D4B678] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 self-start sm:self-auto transition-all shadow-lg shadow-[#C7A46A]/20"
        >
          <Plus size={16} />
          <span>Add Testimonial</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
        <input
          type="text"
          placeholder="Search testimonials by client name, quote, or company..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#111111] border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#C7A46A]"
        />
      </div>

      {/* Testimonials List */}
      {loading ? (
        <div className="py-24 text-center text-neutral-500 font-mono text-xs uppercase tracking-widest">
          Loading endorsements...
        </div>
      ) : filteredTestimonials.length === 0 ? (
        <div className="py-16 text-center text-neutral-500 font-mono text-xs border border-dashed border-neutral-800 rounded-2xl">
          No testimonials found. Click &quot;Add Testimonial&quot; to begin.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTestimonials.map((t) => (
            <div
              key={t.id || t.name}
              className="p-6 rounded-2xl bg-[#0D0D0D] border border-neutral-850 hover:border-neutral-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-[#181818] overflow-hidden flex-shrink-0 border border-neutral-800">
                      {t.image ? (
                        <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-500 font-serif font-bold">
                          {t.name[0]}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-base font-serif text-white font-medium">{t.name}</h3>
                      <div className="text-[10px] font-mono text-[#C7A46A]">{t.designation}</div>
                      {t.company && <div className="text-[10px] font-mono text-neutral-500">{t.company}</div>}
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5 text-amber-400">
                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                      <Star key={i} size={12} fill="currentColor" />
                    ))}
                  </div>
                </div>

                <p className="text-neutral-300 text-xs font-light leading-relaxed italic line-clamp-3">
                  &ldquo;{t.quote}&rdquo;
                </p>

                {t.event_or_brand && (
                  <span className="inline-block px-2.5 py-0.5 rounded bg-[#181818] border border-neutral-800 text-[10px] font-mono text-[#C7A46A]">
                    ✦ {t.event_or_brand}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-neutral-850">
                <button
                  onClick={() => togglePublish(t)}
                  className={`flex items-center gap-1.5 text-xs font-mono px-3 py-1 rounded-lg ${
                    t.is_published
                      ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/40'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {t.is_published ? <Eye size={13} /> : <EyeOff size={13} />}
                  <span>{t.is_published ? 'Visible' : 'Hidden'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(t)}
                    className="p-2 rounded-lg bg-[#181818] hover:bg-[#222] text-neutral-300 hover:text-white"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="p-2 rounded-lg bg-red-950/30 hover:bg-red-900/50 text-red-400 hover:text-red-200"
                  >
                    <Trash2 size={14} />
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
                {editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}
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
                  Person Name *
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
                    Designation / Title
                  </label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    value={formData.company || ''}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                  Testimonial Quote *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.quote}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                    Event / Brand Highlight
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Max Fashion Showcase"
                    value={formData.event_or_brand || ''}
                    onChange={(e) => setFormData({ ...formData, event_or_brand: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                    Rating (1-5 Stars)
                  </label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) || 5 })}
                    className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                  >
                    <option value={5}>5 Stars ★★★★★</option>
                    <option value={4}>4 Stars ★★★★☆</option>
                    <option value={3}>3 Stars ★★★☆☆</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                  Avatar / Portrait Photo Upload
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
                    <img src={formData.image} alt="Preview" className="w-10 h-10 object-cover rounded-full border border-neutral-700" />
                    <span className="text-[10px] font-mono text-neutral-500 truncate max-w-xs">{formData.image}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="rounded bg-[#181818] border-neutral-700 text-[#C7A46A]"
                  />
                  <span className="text-xs font-mono text-neutral-300">Published (Visible on site)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_featured_home}
                    onChange={(e) => setFormData({ ...formData, is_featured_home: e.target.checked })}
                    className="rounded bg-[#181818] border-neutral-700 text-[#C7A46A]"
                  />
                  <span className="text-xs font-mono text-neutral-300">Feature on Homepage</span>
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
                  <span>{editingTestimonial ? 'Save Changes' : 'Add Testimonial'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
