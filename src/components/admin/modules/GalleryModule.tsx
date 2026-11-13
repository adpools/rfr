import React, { useState, useEffect } from 'react';
import {
  getGalleryItemsAdmin,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  toggleGalleryItemPublished,
  uploadMediaFile,
  GalleryItemRecord
} from '../../../services/cmsService';
import {
  Images,
  Plus,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Save,
  X,
  Upload,
  Video,
  ExternalLink,
  Sparkles,
  Info,
  Calendar,
  Layers,
  Maximize2,
  Play
} from 'lucide-react';
import { useMediaViewer } from '../../../context/MediaViewerContext';

interface GalleryModuleProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  isConfigured: boolean;
}

export const GalleryModule: React.FC<GalleryModuleProps> = ({ showToast }) => {
  const { openImage, openVideo } = useMediaViewer();
  const [items, setItems] = useState<GalleryItemRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [activeCategory, setActiveCategory] = useState<'all' | 'events' | 'shows' | 'shoots'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItemRecord | null>(null);

  // Form State
  const [formData, setFormData] = useState<GalleryItemRecord>({
    title: '',
    category: 'events',
    caption: '',
    year: 2026,
    credits: '',
    image: '',
    dimensions: 'landscape',
    tags: [],
    video_embed_url: '',
    drive_view_url: '',
    has_video: false,
    sort_order: 1,
    is_published: true,
  });

  const [rawTags, setRawTags] = useState('');

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await getGalleryItemsAdmin();
      setItems(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch gallery items', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      category: activeCategory === 'all' ? 'events' : activeCategory,
      caption: '',
      year: 2026,
      credits: '',
      image: '',
      dimensions: 'landscape',
      tags: [],
      video_embed_url: '',
      drive_view_url: '',
      has_video: false,
      sort_order: items.length + 1,
      is_published: true,
    });
    setRawTags('');
    setIsModalOpen(true);
  };

  const openEditModal = (item: GalleryItemRecord) => {
    setEditingItem(item);
    setFormData({
      ...item,
      caption: item.caption || '',
      credits: item.credits || '',
      video_embed_url: item.video_embed_url || '',
      drive_view_url: item.drive_view_url || '',
      tags: item.tags || [],
    });
    setRawTags((item.tags || []).join(', '));
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const res = await uploadMediaFile(file, 'gallery-archive');
    setUploading(false);

    if (res.success && res.url) {
      setFormData((prev) => ({ ...prev, image: res.url || '' }));
      showToast('Photo uploaded successfully', 'success');
    } else {
      showToast(res.error || 'Upload failed', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      showToast('Title is required', 'error');
      return;
    }

    if (!formData.image.trim()) {
      showToast('Image URL or uploaded file is required', 'error');
      return;
    }

    setSaving(true);

    const tagsArray = rawTags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload: Partial<GalleryItemRecord> = {
      title: formData.title.trim(),
      category: formData.category,
      caption: formData.caption?.trim() || null,
      year: Number(formData.year) || 2026,
      credits: formData.credits?.trim() || null,
      image: formData.image.trim(),
      dimensions: formData.dimensions || 'landscape',
      tags: tagsArray,
      has_video: Boolean(formData.has_video),
      video_embed_url: formData.has_video && formData.video_embed_url?.trim() ? formData.video_embed_url.trim() : null,
      drive_view_url: formData.has_video && formData.drive_view_url?.trim() ? formData.drive_view_url.trim() : null,
      sort_order: Number(formData.sort_order) || 0,
      is_published: formData.is_published,
    };

    try {
      if (editingItem && editingItem.id) {
        const res = await updateGalleryItem(editingItem.id, payload);
        if (res.success) {
          showToast('Gallery item updated successfully', 'success');
          setIsModalOpen(false);
          fetchItems();
        } else {
          showToast(res.error || 'Failed to update item', 'error');
        }
      } else {
        const res = await createGalleryItem(payload as any);
        if (res.success) {
          showToast('Gallery item created successfully', 'success');
          setIsModalOpen(false);
          fetchItems();
        } else {
          showToast(res.error || 'Failed to create item', 'error');
        }
      }
    } catch (err: any) {
      showToast(err.message || 'Operation failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: GalleryItemRecord) => {
    if (!item.id) return;

    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${item.title}" from the general gallery?\n\nThis cannot be undone.`
    );
    if (!confirmed) return;

    try {
      const res = await deleteGalleryItem(item.id);
      if (res.success) {
        showToast('Gallery item deleted', 'info');
        fetchItems();
      } else {
        showToast(res.error || 'Failed to delete item', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  const handleTogglePublished = async (item: GalleryItemRecord) => {
    if (!item.id) return;
    const newState = !item.is_published;

    // Optimistic update
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, is_published: newState } : i))
    );

    try {
      const res = await toggleGalleryItemPublished(item.id, newState);
      if (res.success) {
        showToast(newState ? 'Item published (Live)' : 'Item hidden', 'success');
      } else {
        // Rollback
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, is_published: !newState } : i))
        );
        showToast(res.error || 'Failed to update status', 'error');
      }
    } catch (err: any) {
      // Rollback
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, is_published: !newState } : i))
      );
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  // Filtered list
  const filteredItems = items.filter((item) => {
    const matchesCategory =
      activeCategory === 'all' || item.category === activeCategory;

    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.credits && item.credits.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.caption && item.caption.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.tags && item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

    return matchesCategory && matchesSearch;
  });

  const categoryCounts = {
    all: items.length,
    events: items.filter((i) => i.category === 'events').length,
    shows: items.filter((i) => i.category === 'shows').length,
    shoots: items.filter((i) => i.category === 'shoots').length,
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#C7A46A] uppercase tracking-wider mb-1">
            <Images size={14} />
            <span>EDITORIAL VISUAL ARCHIVES</span>
          </div>
          <h1 className="text-2xl font-serif text-white uppercase tracking-wide">
            Curated Gallery (Events, Shows & Shoots)
          </h1>
          <p className="text-neutral-400 text-xs font-light">
            Manage high-contrast runway presentations, landmark events, and commercial brand shoots powering <code className="text-[#C7A46A]">/gallery</code> and Homepage Chapter 11.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-xl bg-[#C7A46A] hover:bg-[#D4B678] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 self-start sm:self-auto transition-all shadow-lg shadow-[#C7A46A]/20"
        >
          <Plus size={16} />
          <span>Add Gallery Item</span>
        </button>
      </div>

      {/* Fallback Notice Banner when DB table has 0 items */}
      {items.length === 0 && !loading && (
        <div className="p-4 rounded-2xl bg-[#121212] border border-[#C7A46A]/30 flex items-start gap-3">
          <Info size={18} className="text-[#C7A46A] mt-0.5 shrink-0" />
          <div className="text-xs font-mono space-y-1">
            <p className="text-neutral-200 font-bold uppercase tracking-wider">
              Zero Database Records in public.gallery_items
            </p>
            <p className="text-neutral-400 font-sans font-light leading-relaxed">
              The public website (<code className="text-[#C7A46A]">/gallery</code> and Homepage Chapter 11) is currently displaying the 17 built-in curated fallback items from <code className="text-neutral-300">galleryData.ts</code>. Once you add and publish items here, they will seamlessly take over.
            </p>
          </div>
        </div>
      )}

      {/* Filter Tabs & Search Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {(
            [
              { id: 'all', label: 'All Collections' },
              { id: 'events', label: 'Events' },
              { id: 'shows', label: 'Shows' },
              { id: 'shoots', label: 'Shoots' },
            ] as const
          ).map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#C7A46A] text-black font-bold shadow-md shadow-[#C7A46A]/20'
                  : 'bg-[#121212] text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeCategory === cat.id
                    ? 'bg-black/20 text-black'
                    : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                {categoryCounts[cat.id]}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px] md:w-80">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            placeholder="Search by title, credits, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#121212] border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#C7A46A] transition-colors"
          />
        </div>
      </div>

      {/* Gallery Items Grid */}
      {loading ? (
        <div className="py-24 text-center text-neutral-500 font-mono text-xs uppercase tracking-widest">
          Loading gallery items...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-[#121212] border border-neutral-800/80 p-8">
          <Images size={36} className="mx-auto text-neutral-600 mb-3" />
          <p className="text-white font-serif uppercase tracking-wider text-sm mb-1">
            No gallery items found
          </p>
          <p className="text-neutral-500 text-xs font-mono">
            {searchQuery
              ? 'Try refining your search query or clear the filter.'
              : 'Add your first curated item using the button above.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id || item.title}
              className={`rounded-2xl overflow-hidden bg-[#121212] border transition-all duration-300 flex flex-col justify-between group ${
                item.is_published
                  ? 'border-neutral-800 hover:border-[#C7A46A]/50'
                  : 'border-neutral-800/60 opacity-70 hover:opacity-100'
              }`}
            >
              {/* Media Preview Container */}
              <div 
                onClick={() => {
                  if (item.has_video && (item.video_embed_url || item.drive_view_url)) {
                    openVideo({
                      src: item.video_embed_url || item.drive_view_url,
                      embedUrl: item.video_embed_url,
                      title: item.title,
                      subtitle: item.caption || item.credits,
                      badge: `${item.category.toUpperCase()} REEL`,
                    });
                  } else if (item.image) {
                    openImage({
                      src: item.image,
                      title: item.title,
                      subtitle: item.caption || item.credits,
                      category: item.category.toUpperCase(),
                      year: item.year ? String(item.year) : undefined,
                    });
                  }
                }}
                className="relative aspect-[16/10] bg-black overflow-hidden cursor-pointer group/media"
                title={item.has_video ? 'Play video in universal player' : 'View image in high-resolution'}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover/media:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    // Fallback placeholder if broken URL
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80';
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Universal Media Trigger on Hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/media:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none z-10">
                  <div className="px-3 py-1.5 rounded-full bg-black/85 backdrop-blur-md border border-[#C7A46A]/60 text-[#C7A46A] text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5 shadow-xl transform scale-95 group-hover/media:scale-100 transition-transform">
                    {item.has_video ? (
                      <>
                        <Play size={10} className="fill-[#C7A46A]" />
                        <span>Play Reel</span>
                      </>
                    ) : (
                      <>
                        <Maximize2 size={11} />
                        <span>Expand Photo</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Category & Year Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10 pointer-events-none">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider font-bold bg-black/70 backdrop-blur-md text-[#C7A46A] border border-[#C7A46A]/30">
                    {item.category}
                  </span>
                  <span className="px-2 py-1 rounded-md text-[10px] font-mono bg-black/60 backdrop-blur-md text-neutral-300 border border-white/10">
                    {item.year || 2026}
                  </span>
                  {item.dimensions && (
                    <span className="px-2 py-1 rounded-md text-[9px] font-mono uppercase tracking-wider bg-black/60 backdrop-blur-md text-neutral-400 border border-white/10">
                      {item.dimensions}
                    </span>
                  )}
                </div>

                {/* Video Indicator */}
                {item.has_video && (
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (item.video_embed_url || item.drive_view_url) {
                        openVideo({
                          src: item.video_embed_url || item.drive_view_url,
                          embedUrl: item.video_embed_url,
                          title: item.title,
                          subtitle: item.caption || item.credits,
                          badge: `${item.category.toUpperCase()} REEL`,
                        });
                      }
                    }}
                    className="absolute top-3 right-3 px-2 py-1 rounded-md text-[10px] font-mono bg-[#C7A46A]/90 hover:bg-[#C7A46A] text-black font-bold flex items-center gap-1 shadow-md z-10 transition-colors cursor-pointer"
                    title="Play Video Reel"
                  >
                    <Video size={12} />
                    <span>REEL</span>
                  </div>
                )}

                {/* Sort Order Badge */}
                <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded text-[10px] font-mono bg-black/60 backdrop-blur-md text-neutral-400 border border-white/10 z-10 pointer-events-none">
                  #{item.sort_order}
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-white font-serif text-base uppercase tracking-wide leading-snug group-hover:text-[#C7A46A] transition-colors line-clamp-1 mb-1.5">
                    {item.title}
                  </h3>

                  {item.caption && (
                    <p className="text-neutral-400 text-xs font-light line-clamp-2 leading-relaxed mb-3">
                      {item.caption}
                    </p>
                  )}

                  {item.credits && (
                    <p className="text-[11px] font-mono text-[#C7A46A]/80 mb-3 truncate">
                      Credits: {item.credits}
                    </p>
                  )}

                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {item.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-mono text-neutral-400 bg-neutral-900/90 px-2 py-0.5 rounded border border-neutral-800"
                        >
                          #{tag}
                        </span>
                      ))}
                      {item.tags.length > 3 && (
                        <span className="text-[10px] font-mono text-neutral-500 self-center">
                          +{item.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Controls Footer */}
                <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
                  {/* Status Toggle */}
                  <button
                    onClick={() => handleTogglePublished(item)}
                    className={`flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg transition-colors ${
                      item.is_published
                        ? 'text-emerald-400 bg-emerald-950/30 hover:bg-emerald-950/50 border border-emerald-900/50'
                        : 'text-neutral-500 bg-neutral-900 hover:text-neutral-300 border border-neutral-800'
                    }`}
                  >
                    {item.is_published ? <Eye size={13} /> : <EyeOff size={13} />}
                    <span>{item.is_published ? 'Live' : 'Hidden'}</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(item)}
                      aria-label="Edit item"
                      className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      aria-label="Delete item"
                      className="p-2 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-red-950/20 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#121212] border border-neutral-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl my-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#121212] border-b border-neutral-800 px-6 py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <Images size={16} className="text-[#C7A46A]" />
                <h2 className="text-lg font-serif text-white uppercase tracking-wide">
                  {editingItem ? 'Edit Gallery Showcase' : 'Add Gallery Showcase'}
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Title */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1.5">
                  Showcase Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Koottam Flea Market 2022 — Official Highlights"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#C7A46A]"
                />
              </div>

              {/* Category, Year, Dimensions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1.5">
                    Category <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as 'events' | 'shows' | 'shoots',
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-black border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#C7A46A]"
                  >
                    <option value="events">Events</option>
                    <option value="shows">Shows</option>
                    <option value="shoots">Shoots</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1.5">
                    Year
                  </label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) || 2026 })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#C7A46A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1.5">
                    Dimensions
                  </label>
                  <select
                    value={formData.dimensions || 'landscape'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dimensions: e.target.value as 'portrait' | 'landscape' | 'square',
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-black border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#C7A46A]"
                  >
                    <option value="landscape">Landscape (16:9)</option>
                    <option value="portrait">Portrait (9:16)</option>
                    <option value="square">Square (1:1)</option>
                  </select>
                </div>
              </div>

              {/* Image Asset (Upload or URL) */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1.5">
                  Photograph Asset <span className="text-red-400">*</span>
                </label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Paste image URL (or upload below)..."
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-black border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#C7A46A]"
                    />
                    <label className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-mono text-xs cursor-pointer flex items-center gap-2 transition-colors shrink-0">
                      <Upload size={14} />
                      <span>{uploading ? 'Uploading...' : 'Upload'}</span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleFileUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Thumbnail Preview */}
                  {formData.image && (
                    <div 
                      onClick={() => openImage({ src: formData.image, title: formData.title || 'Curated Image Preview', category: formData.category.toUpperCase() })}
                      className="relative aspect-[16/9] w-48 rounded-xl overflow-hidden border border-neutral-800 bg-black cursor-pointer group"
                      title="Click to view full image in high-resolution"
                    >
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[#C7A46A]">
                        <Maximize2 size={16} />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Caption */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1.5">
                  Caption / Editorial Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Atmospheric summary, staging description, or highlight moments..."
                  value={formData.caption || ''}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black border border-neutral-800 text-white text-xs font-sans focus:outline-none focus:border-[#C7A46A]"
                />
              </div>

              {/* Credits & Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1.5">
                    Credits / Collaborators
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. RFR Media Productions & Koottam"
                    value={formData.credits || ''}
                    onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#C7A46A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1.5">
                    Tags (Comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Festival, Live Music, Crowd"
                    value={rawTags}
                    onChange={(e) => setRawTags(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#C7A46A]"
                  />
                </div>
              </div>

              {/* Video Integration Toggle */}
              <div className="p-4 rounded-2xl bg-black/60 border border-neutral-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Video size={16} className="text-[#C7A46A]" />
                    <div>
                      <span className="text-xs font-mono uppercase tracking-wider text-white font-bold block">
                        Associated Video Reel
                      </span>
                      <span className="text-[11px] text-neutral-400 font-light block">
                        Enable if this showcase features a video reel, drive preview, or teaser
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.has_video}
                    onChange={(e) => setFormData({ ...formData, has_video: e.target.checked })}
                    className="w-4 h-4 accent-[#C7A46A] cursor-pointer"
                  />
                </div>

                {formData.has_video && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-neutral-800">
                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                        Video Embed / Preview URL
                      </label>
                      <input
                        type="text"
                        placeholder="https://drive.google.com/file/d/.../preview"
                        value={formData.video_embed_url || ''}
                        onChange={(e) => setFormData({ ...formData, video_embed_url: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-black border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#C7A46A]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                        Google Drive Direct View URL
                      </label>
                      <input
                        type="text"
                        placeholder="https://drive.google.com/file/d/.../view"
                        value={formData.drive_view_url || ''}
                        onChange={(e) => setFormData({ ...formData, drive_view_url: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-black border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#C7A46A]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Sort Order & Publishing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1.5">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#C7A46A]"
                  />
                </div>

                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-3 p-3 rounded-xl bg-black border border-neutral-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_published}
                      onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                      className="w-4 h-4 accent-[#C7A46A]"
                    />
                    <span className="text-xs font-mono text-white uppercase tracking-wider">
                      Published (Live on Website)
                    </span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-6 border-t border-neutral-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-neutral-800 text-neutral-400 hover:text-white font-mono text-xs uppercase tracking-wider transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-[#C7A46A] hover:bg-[#D4B678] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shadow-[#C7A46A]/20 disabled:opacity-50"
                >
                  <Save size={15} />
                  <span>{saving ? 'Saving...' : editingItem ? 'Update Showcase' : 'Save Showcase'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

