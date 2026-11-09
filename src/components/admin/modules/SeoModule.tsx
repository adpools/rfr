import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import { uploadMediaFile } from '../../../services/cmsService';
import { Globe, Edit3, Save, X, Search, Upload } from 'lucide-react';

interface SeoItem {
  id?: string;
  page_path: string;
  meta_title: string;
  meta_description: string;
  keywords?: string[];
  og_image_url?: string;
  canonical_url?: string;
}

interface SeoModuleProps {
  showToast: (msg: string, type?: 'success' | 'error') => void;
  isConfigured: boolean;
}

export const SeoModule: React.FC<SeoModuleProps> = ({ showToast }) => {
  const [items, setItems] = useState<SeoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<SeoItem | null>(null);
  const [uploading, setUploading] = useState(false);

  const defaultRoutes: SeoItem[] = [
    {
      page_path: '/',
      meta_title: 'RFR By Riyas — Creative Ecosystem & Fashion Runway',
      meta_description: 'An international luxury fashion, lifestyle and creative ecosystem platform.',
      keywords: ['Fashion', 'Runway', 'Events', 'Influencers', 'Kerala'],
      canonical_url: 'https://rfrbyriyas.com',
    },
    {
      page_path: '/timeline',
      meta_title: 'Archival Timeline (2020–2026) | RFR by Riyas',
      meta_description: 'Explore the 7-year production chronicle, runways, and commercial lookbooks.',
      keywords: ['Timeline', 'Runway Archive', 'Fashion Shows'],
      canonical_url: 'https://rfrbyriyas.com/timeline',
    },
    {
      page_path: '/about',
      meta_title: 'About the Founder & Ecosystem | RFR by Riyas',
      meta_description: 'The journey, philosophy, and architectural vision of founder Riyas.',
      keywords: ['About Riyas', 'Founder', 'Luxury Fashion'],
      canonical_url: 'https://rfrbyriyas.com/about',
    },
    {
      page_path: '/services',
      meta_title: 'Commercial Services & Disciplines | RFR by Riyas',
      meta_description: 'Experiential event staging, influencer conclaves, and ad productions.',
      keywords: ['Services', 'Event Production', 'Campaigns'],
      canonical_url: 'https://rfrbyriyas.com/services',
    },
    {
      page_path: '/press',
      meta_title: 'News & Press Highlights | RFR by Riyas',
      meta_description: 'Statewide media coverage, television bulletins, and editorial features.',
      keywords: ['Press', 'News', 'Media Coverage'],
      canonical_url: 'https://rfrbyriyas.com/press',
    },
    {
      page_path: '/contact',
      meta_title: 'Contact & Executive Concierge | RFR by Riyas',
      meta_description: 'Book luxury fashion runways, casting calls, and commercial collaborations.',
      keywords: ['Contact', 'Booking', 'Collaborations'],
      canonical_url: 'https://rfrbyriyas.com/contact',
    },
  ];

  const fetchSeo = async () => {
    setLoading(true);
    if (!isSupabaseConfigured) {
      setItems(defaultRoutes);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.from('seo_metadata').select('*');
      if (error || !data || data.length === 0) {
        setItems(defaultRoutes);
      } else {
        const normalized: SeoItem[] = data.map((d: any) => ({
          id: d.id,
          page_path: d.page_path || d.route_path,
          meta_title: d.meta_title,
          meta_description: d.meta_description,
          keywords: d.keywords || [],
          og_image_url: d.og_image_url,
          canonical_url: d.canonical_url,
        }));
        setItems(normalized);
      }
    } catch {
      setItems(defaultRoutes);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeo();
  }, []);

  const openEditModal = (item: SeoItem) => {
    setEditingItem({ ...item });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const res = await uploadMediaFile(file, 'seo');
    setUploading(false);
    if (res.success && res.url) {
      setEditingItem((prev) => prev ? { ...prev, og_image_url: res.url } : null);
      showToast('OG share image uploaded');
    } else {
      showToast(res.error || 'Upload failed', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const payload = {
      page_path: editingItem.page_path,
      meta_title: editingItem.meta_title.trim(),
      meta_description: editingItem.meta_description.trim(),
      canonical_url: editingItem.canonical_url?.trim() || null,
      og_image_url: editingItem.og_image_url?.trim() || null,
      keywords: editingItem.keywords || [],
      updated_at: new Date().toISOString(),
    };

    try {
      if (editingItem.id) {
        const { error } = await supabase
          .from('seo_metadata')
          .update(payload)
          .eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('seo_metadata').insert([payload]);
        if (error) throw error;
      }
      showToast(`SEO updated for ${editingItem.page_path}`);
      setEditingItem(null);
      fetchSeo();
    } catch (err: any) {
      showToast(err.message || 'Save failed', 'error');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl font-serif text-white uppercase tracking-wide">
            SEO & Social Metadata
          </h1>
          <p className="text-xs text-neutral-400 font-light mt-1">
            Optimize search engine indexation, meta descriptions, and social share OG cards for every route.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-neutral-500 font-mono text-xs">
          Loading SEO routing tables...
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.page_path}
              className="p-5 rounded-2xl bg-[#0D0D0D] border border-neutral-850 hover:border-neutral-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#181818] border border-neutral-800 text-[10px] font-mono text-[#C7A46A]">
                    {item.page_path}
                  </span>
                  <span className="text-xs font-serif text-white font-medium truncate">
                    {item.meta_title}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 font-light line-clamp-1">
                  {item.meta_description}
                </p>
              </div>

              <button
                onClick={() => openEditModal(item)}
                className="px-4 py-2 rounded-xl bg-[#181818] hover:bg-[#222] text-xs font-mono text-neutral-300 hover:text-white flex items-center gap-2 shrink-0 self-start sm:self-auto"
              >
                <Edit3 size={13} />
                <span>Edit SEO</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <h2 className="text-xl font-serif text-white uppercase">
                Edit SEO: {editingItem.page_path}
              </h2>
              <button
                onClick={() => setEditingItem(null)}
                className="p-1 rounded-lg hover:bg-[#222] text-neutral-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                  Meta Title Tag *
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.meta_title}
                  onChange={(e) => setEditingItem({ ...editingItem, meta_title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#C7A46A]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                  Meta Description Tag *
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingItem.meta_description}
                  onChange={(e) => setEditingItem({ ...editingItem, meta_description: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                  Canonical URL
                </label>
                <input
                  type="text"
                  value={editingItem.canonical_url || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, canonical_url: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                  Social OG Image (1200x630)
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
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-5 py-2.5 rounded-xl border border-neutral-800 hover:bg-[#181818] text-neutral-300 font-mono text-xs uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#C7A46A] hover:bg-[#D4B678] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2"
                >
                  <Save size={15} />
                  <span>Save SEO</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
