import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import { uploadMediaFile } from '../../../services/cmsService';
import { Plus, Edit3, Trash2, Eye, EyeOff, Search, Save, X, Upload, Camera, Tag, MapPin, Calendar, Maximize2 } from 'lucide-react';
import { useMediaViewer } from '../../../context/MediaViewerContext';

export interface RiyasGalleryItem {
  id?: string;
  title: string;
  caption?: string;
  image: string;
  shoot_date?: string;
  location?: string;
  tags?: string[];
  sort_order: number;
  is_published: boolean;
}

interface RiyasGalleryModuleProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  isConfigured: boolean;
}

export const RiyasGalleryModule: React.FC<RiyasGalleryModuleProps> = ({ showToast }) => {
  const { openImage } = useMediaViewer();
  const [items, setItems] = useState<RiyasGalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RiyasGalleryItem | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState<RiyasGalleryItem>({
    title: '',
    caption: '',
    image: '',
    shoot_date: '2026',
    location: 'Kerala, India',
    tags: ['Runway', 'Founder', 'Editorial'],
    sort_order: 1,
    is_published: true,
  });

  const [tagsInput, setTagsInput] = useState('Runway, Founder, Editorial');

  const fetchGallery = async () => {
    setLoading(true);
    if (!isSupabaseConfigured) {
      setItems([
        {
          id: '1',
          title: 'Master Editorial Portrait',
          caption: 'High-resolution master editorial portrait photograph of Riyas.',
          image: '/images/riyas%20img%20gal/0W0A4080.JPG',
          shoot_date: '2026',
          location: 'Studio Archive',
          tags: ['Portrait', 'Editorial'],
          sort_order: 1,
          is_published: true,
        },
        {
          id: '2',
          title: 'Runway Staging and Presentation',
          caption: 'Curating the inaugural runway lighting and sequence.',
          image: '/images/riyas%20img%20gal/0W0A4081.JPG',
          shoot_date: '2026',
          location: 'Runway Stage',
          tags: ['Runway', 'Stage'],
          sort_order: 2,
          is_published: true,
        },
      ]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('riyas_gallery_items')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setItems(data || []);
    } catch (err: any) {
      showToast(err.message || 'Failed to load gallery items', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      caption: '',
      image: '',
      shoot_date: '2026',
      location: 'Runway Stage',
      tags: ['Runway', 'Founder'],
      sort_order: items.length + 1,
      is_published: true,
    });
    setTagsInput('Runway, Founder');
    setIsModalOpen(true);
  };

  const openEditModal = (item: RiyasGalleryItem) => {
    setEditingItem(item);
    setFormData({ ...item });
    setTagsInput((item.tags || []).join(', '));
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const res = await uploadMediaFile(file, 'riyas-archive');
    setUploading(false);
    if (res.success && res.url) {
      setFormData((prev) => ({ ...prev, image: res.url || '' }));
      showToast('Photo uploaded successfully');
    } else {
      showToast(res.error || 'Upload failed', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.image) {
      showToast('Title and photo asset are required', 'error');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = {
      title: formData.title.trim(),
      caption: formData.caption ? formData.caption.trim() : null,
      image: formData.image.trim(),
      shoot_date: formData.shoot_date ? formData.shoot_date.trim() : null,
      location: formData.location ? formData.location.trim() : null,
      tags: tags.length > 0 ? tags : ['Runway'],
      sort_order: Number(formData.sort_order) || 0,
      is_published: formData.is_published,
      updated_at: new Date().toISOString(),
    };

    try {
      if (editingItem?.id) {
        const { error } = await supabase
          .from('riyas_gallery_items')
          .update(payload)
          .eq('id', editingItem.id);

        if (error) throw error;
        showToast('Gallery item updated');
      } else {
        const { error } = await supabase
          .from('riyas_gallery_items')
          .insert([payload]);

        if (error) throw error;
        showToast('Photo added to Riyas Archive');
      }
      setIsModalOpen(false);
      fetchGallery();
    } catch (err: any) {
      showToast(err.message || 'Save failed', 'error');
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this photo from the archive?')) return;
    try {
      const { error } = await supabase.from('riyas_gallery_items').delete().eq('id', id);
      if (error) throw error;
      showToast('Photo deleted');
      fetchGallery();
    } catch (err: any) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  const togglePublish = async (item: RiyasGalleryItem) => {
    if (!item.id) return;
    const newState = !item.is_published;
    try {
      const { error } = await supabase
        .from('riyas_gallery_items')
        .update({ is_published: newState, updated_at: new Date().toISOString() })
        .eq('id', item.id);

      if (error) throw error;
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, is_published: newState } : i))
      );
      showToast(newState ? 'Photo visible on gallery' : 'Photo hidden');
    } catch (err: any) {
      showToast(err.message || 'Update failed', 'error');
    }
  };

  const filteredItems = items.filter(
    (i) =>
      i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (i.caption && i.caption.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#C7A46A] uppercase tracking-wider mb-1">
            <Camera size={14} />
            <span>PORTRAITURE ARCHIVE</span>
          </div>
          <h1 className="text-2xl font-serif text-white uppercase tracking-wide">
            Riyas Photography Gallery
          </h1>
          <p className="text-neutral-400 text-xs font-light">
            Manage bespoke portraiture, behind-the-scenes event photography, and runway aesthetics.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-xl bg-[#C7A46A] hover:bg-[#D4B678] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 self-start sm:self-auto transition-all shadow-lg shadow-[#C7A46A]/20"
        >
          <Plus size={16} />
          <span>Upload New Photograph</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
        <input
          type="text"
          placeholder="Search photography by title, caption, or tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#111111] border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#C7A46A]"
        />
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="py-24 text-center text-neutral-500 font-mono text-xs uppercase tracking-widest">
          Loading photography archive...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="py-16 text-center text-neutral-500 font-mono text-xs border border-dashed border-neutral-800 rounded-2xl">
          No photographs found. Click &quot;Upload New Photograph&quot; to begin.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id || item.title}
              className="p-4 rounded-2xl bg-[#0D0D0D] border border-neutral-850 hover:border-neutral-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div 
                  onClick={() => openImage({
                    src: item.image,
                    title: item.title,
                    subtitle: item.caption || item.location,
                    category: 'RIYAS ARCHIVE',
                    year: item.shoot_date,
                  })}
                  className="aspect-[4/5] rounded-xl bg-[#141414] overflow-hidden relative border border-neutral-800 cursor-pointer group/portrait"
                  title="Click to view full portrait in high-resolution"
                >
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover/portrait:scale-105" />
                  
                  {/* Universal Media Trigger on Hover */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/portrait:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none z-10">
                    <div className="px-3.5 py-1.5 rounded-full bg-black/85 backdrop-blur-md border border-[#C7A46A]/60 text-[#C7A46A] text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5 shadow-xl transform scale-95 group-hover/portrait:scale-100 transition-transform">
                      <Maximize2 size={11} />
                      <span>Expand</span>
                    </div>
                  </div>

                  {item.shoot_date && (
                    <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-neutral-700 text-[10px] font-mono text-[#C7A46A] z-10 pointer-events-none">
                      {item.shoot_date}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-serif text-white font-medium truncate">{item.title}</h3>
                  {item.caption && <p className="text-neutral-400 text-xs font-light line-clamp-2 mt-1">{item.caption}</p>}
                </div>

                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((tag, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-[#181818] border border-neutral-800 text-[9px] font-mono text-neutral-400">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-neutral-850">
                <button
                  onClick={() => togglePublish(item)}
                  className={`flex items-center gap-1 text-xs font-mono px-2.5 py-1 rounded ${
                    item.is_published
                      ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/40'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {item.is_published ? <Eye size={12} /> : <EyeOff size={12} />}
                  <span>{item.is_published ? 'Live' : 'Draft'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-1.5 rounded-lg bg-[#181818] hover:bg-[#222] text-neutral-300 hover:text-white"
                  >
                    <Edit3 size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
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
                {editingItem ? 'Edit Photo' : 'Upload to Riyas Archive'}
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
                  Photo Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#C7A46A]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                  Caption / Description
                </label>
                <textarea
                  rows={2}
                  value={formData.caption || ''}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                    Shoot Date / Year
                  </label>
                  <input
                    type="text"
                    value={formData.shoot_date || ''}
                    onChange={(e) => setFormData({ ...formData, shoot_date: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                    Location / Venue
                  </label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                  Tags (Comma-separated)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                  Photograph Asset Upload *
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
                    <img 
                      src={formData.image} 
                      alt="Preview" 
                      onClick={() => openImage({ src: formData.image, title: formData.title || 'Photograph Preview', category: 'RIYAS ARCHIVE' })}
                      className="w-12 h-16 object-cover rounded border border-neutral-700 cursor-pointer hover:opacity-80 transition-opacity" 
                      title="Click to preview image"
                    />
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
                  <span className="text-xs font-mono text-neutral-300">Publish to live Riyas Photography Gallery</span>
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
                  <span>{editingItem ? 'Save Photo' : 'Upload Photo'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
