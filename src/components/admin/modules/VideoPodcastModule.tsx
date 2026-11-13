import React, { useState, useEffect } from 'react';
import {
  getMediaVideosAdmin,
  createMediaVideo,
  updateMediaVideo,
  deleteMediaVideo,
  toggleMediaVideoPublished,
  uploadMediaFile,
  MediaVideoItem
} from '../../../services/cmsService';
import {
  Video,
  Plus,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Save,
  X,
  Upload,
  Play,
  ExternalLink,
  Sparkles,
  Info,
  Clock,
  Film,
  Tag,
  Radio,
  Maximize2
} from 'lucide-react';
import { useMediaViewer } from '../../../context/MediaViewerContext';

interface VideoPodcastModuleProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  isConfigured: boolean;
}

export const VideoPodcastModule: React.FC<VideoPodcastModuleProps> = ({ showToast }) => {
  const { openImage, openVideo } = useMediaViewer();
  const [videos, setVideos] = useState<MediaVideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Filter & Search
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<MediaVideoItem | null>(null);
  const [previewVideo, setPreviewVideo] = useState<MediaVideoItem | null>(null);

  // Form State
  const [formData, setFormData] = useState<MediaVideoItem>({
    title: '',
    category: 'Podcast',
    description: '',
    video_url: '',
    video_embed_url: '',
    thumbnail_url: '',
    duration: '45 MIN',
    aspect_ratio: '16:9',
    tags: [],
    sort_order: 1,
    is_published: true,
  });

  const [rawTags, setRawTags] = useState('');

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const data = await getMediaVideosAdmin();
      setVideos(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to load video records', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // Close preview on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && previewVideo) {
        setPreviewVideo(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [previewVideo]);

  // Extract distinct categories
  const existingCategories = Array.from(
    new Set(videos.map((v) => v.category).filter(Boolean))
  ).sort();

  const openCreateModal = () => {
    setEditingVideo(null);
    setFormData({
      title: '',
      category: selectedCategory === 'all' ? 'Podcast' : selectedCategory,
      description: '',
      video_url: '',
      video_embed_url: '',
      thumbnail_url: '',
      duration: '45 MIN',
      aspect_ratio: '16:9',
      tags: [],
      sort_order: videos.length + 1,
      is_published: true,
    });
    setRawTags('');
    setIsModalOpen(true);
  };

  const openEditModal = (item: MediaVideoItem) => {
    setEditingVideo(item);
    setFormData({
      ...item,
      description: item.description || '',
      video_url: item.video_url || '',
      video_embed_url: item.video_embed_url || '',
      thumbnail_url: item.thumbnail_url || '',
      duration: item.duration || '',
      aspect_ratio: item.aspect_ratio || '16:9',
      tags: item.tags || [],
    });
    setRawTags((item.tags || []).join(', '));
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const res = await uploadMediaFile(file, 'thumbnails');
    setUploading(false);

    if (res.success && res.url) {
      setFormData((prev) => ({ ...prev, thumbnail_url: res.url || '' }));
      showToast('Thumbnail uploaded successfully', 'success');
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

    setSaving(true);

    const tagsArray = rawTags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload: Partial<MediaVideoItem> = {
      title: formData.title.trim(),
      category: formData.category.trim() || 'Highlight',
      description: formData.description?.trim() || null,
      video_url: formData.video_url?.trim() || null,
      video_embed_url: formData.video_embed_url?.trim() || null,
      thumbnail_url: formData.thumbnail_url?.trim() || null,
      duration: formData.duration?.trim() || null,
      aspect_ratio: formData.aspect_ratio || '16:9',
      tags: tagsArray,
      sort_order: Number(formData.sort_order) || 0,
      is_published: formData.is_published,
    };

    try {
      if (editingVideo && editingVideo.id) {
        const res = await updateMediaVideo(editingVideo.id, payload);
        if (res.success) {
          showToast('Video updated successfully', 'success');
          setIsModalOpen(false);
          fetchVideos();
        } else {
          showToast(res.error || 'Failed to update video', 'error');
        }
      } else {
        const res = await createMediaVideo(payload as any);
        if (res.success) {
          showToast('Video added successfully', 'success');
          setIsModalOpen(false);
          fetchVideos();
        } else {
          showToast(res.error || 'Failed to add video', 'error');
        }
      }
    } catch (err: any) {
      showToast(err.message || 'Operation failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: MediaVideoItem) => {
    if (!item.id) return;

    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${item.title}"?\n\nThis cannot be undone.`
    );
    if (!confirmed) return;

    try {
      const res = await deleteMediaVideo(item.id);
      if (res.success) {
        showToast('Video deleted', 'info');
        fetchVideos();
      } else {
        showToast(res.error || 'Failed to delete video', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  const handleTogglePublished = async (item: MediaVideoItem) => {
    if (!item.id) return;
    const newState = !item.is_published;

    // Optimistic update
    setVideos((prev) =>
      prev.map((v) => (v.id === item.id ? { ...v, is_published: newState } : v))
    );

    try {
      const res = await toggleMediaVideoPublished(item.id, newState);
      if (res.success) {
        showToast(newState ? 'Video published (Live)' : 'Video hidden', 'success');
      } else {
        // Rollback
        setVideos((prev) =>
          prev.map((v) => (v.id === item.id ? { ...v, is_published: !newState } : v))
        );
        showToast(res.error || 'Failed to update status', 'error');
      }
    } catch (err: any) {
      // Rollback
      setVideos((prev) =>
        prev.map((v) => (v.id === item.id ? { ...v, is_published: !newState } : v))
      );
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  // Helper to determine video provider
  const getProviderBadge = (item: MediaVideoItem) => {
    const url = (item.video_url || item.video_embed_url || '').toLowerCase();
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-950/80 text-red-400 border border-red-800/60 font-bold">
          YouTube
        </span>
      );
    }
    if (url.includes('drive.google.com')) {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-950/80 text-blue-400 border border-blue-800/60 font-bold">
          Google Drive
        </span>
      );
    }
    if (url.endsWith('.mp4')) {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 font-bold">
          MP4 Video
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-900 text-neutral-400 border border-neutral-800">
        Stream
      </span>
    );
  };

  // Filtered list
  const filteredVideos = videos.filter((item) => {
    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;

    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.tags && item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#C7A46A] uppercase tracking-wider mb-1">
            <Video size={14} />
            <span>STREAMING MEDIA & PODCAST SUITE</span>
          </div>
          <h1 className="text-2xl font-serif text-white uppercase tracking-wide">
            Videos & Podcasts Management
          </h1>
          <p className="text-neutral-400 text-xs font-light">
            Manage studio podcasts, event highlight reels, commercial films, and streaming archives stored in <code className="text-[#C7A46A]">public.media_videos</code>.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-xl bg-[#C7A46A] hover:bg-[#D4B678] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 self-start sm:self-auto transition-all shadow-lg shadow-[#C7A46A]/20"
        >
          <Plus size={16} />
          <span>Add Video / Podcast</span>
        </button>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#121212] border border-neutral-800">
          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1">
            Total Videos
          </span>
          <span className="text-2xl font-serif text-white">{videos.length}</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#121212] border border-neutral-800">
          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1">
            Live (Published)
          </span>
          <span className="text-2xl font-serif text-emerald-400">
            {videos.filter((v) => v.is_published).length}
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-[#121212] border border-neutral-800">
          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1">
            Podcast Episodes
          </span>
          <span className="text-2xl font-serif text-[#C7A46A]">
            {videos.filter((v) => v.category === 'Podcast').length}
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-[#121212] border border-neutral-800">
          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1">
            Categories
          </span>
          <span className="text-2xl font-serif text-neutral-300">
            {existingCategories.length}
          </span>
        </div>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-thin">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-[#C7A46A] text-black font-bold shadow-md shadow-[#C7A46A]/20'
                : 'bg-[#121212] text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            <span>All Videos</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedCategory === 'all' ? 'bg-black/20 text-black' : 'bg-neutral-800 text-neutral-400'
              }`}
            >
              {videos.length}
            </span>
          </button>

          {existingCategories.map((cat) => {
            const count = videos.filter((v) => v.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-[#C7A46A] text-black font-bold shadow-md shadow-[#C7A46A]/20'
                    : 'bg-[#121212] text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    selectedCategory === cat ? 'bg-black/20 text-black' : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px] md:w-80">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            placeholder="Search by title, description, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#121212] border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#C7A46A] transition-colors"
          />
        </div>
      </div>

      {/* Videos Grid */}
      {loading ? (
        <div className="py-24 text-center text-neutral-500 font-mono text-xs uppercase tracking-widest">
          Loading video and podcast archives...
        </div>
      ) : filteredVideos.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-[#121212] border border-neutral-800/80 p-8">
          <Video size={36} className="mx-auto text-neutral-600 mb-3" />
          <p className="text-white font-serif uppercase tracking-wider text-sm mb-1">
            No video records found
          </p>
          <p className="text-neutral-500 text-xs font-mono">
            {searchQuery
              ? 'Try refining your search query or clear the filter.'
              : 'Add your first video or podcast episode above.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((item) => (
            <div
              key={item.id || item.title}
              className={`rounded-2xl overflow-hidden bg-[#121212] border transition-all duration-300 flex flex-col justify-between group ${
                item.is_published
                  ? 'border-neutral-800 hover:border-[#C7A46A]/50'
                  : 'border-neutral-800/60 opacity-70 hover:opacity-100'
              }`}
            >
              {/* Thumbnail & Video Preview Trigger */}
              <div
                onClick={() => {
                  if (item.video_url || item.video_embed_url) {
                    openVideo({
                      src: item.video_url || item.video_embed_url,
                      embedUrl: item.video_embed_url,
                      title: item.title,
                      subtitle: item.description,
                      badge: item.category,
                    });
                  } else {
                    setPreviewVideo(item);
                  }
                }}
                className="relative aspect-video bg-black overflow-hidden cursor-pointer group/vid"
                title="Play video in universal player"
              >
                {item.thumbnail_url ? (
                  <img
                    src={item.thumbnail_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover/vid:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900 text-neutral-600">
                    <Film size={32} />
                    <span className="text-[10px] font-mono mt-1">No Thumbnail</span>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Centered Play Button Overlay */}
                <div className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-black/70 backdrop-blur-md border border-[#C7A46A] flex items-center justify-center text-[#C7A46A] group-hover/vid:bg-[#C7A46A] group-hover/vid:text-black transition-all duration-300 transform group-hover/vid:scale-110 shadow-xl">
                  <Play size={18} className="fill-current ml-0.5" />
                </div>

                {/* Top Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider font-bold bg-black/70 backdrop-blur-md text-[#C7A46A] border border-[#C7A46A]/30">
                    {item.category}
                  </span>
                  {getProviderBadge(item)}
                </div>

                {/* Bottom Badges */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                  {item.duration && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-black/70 backdrop-blur-md text-neutral-300 border border-white/10 flex items-center gap-1">
                      <Clock size={10} />
                      <span>{item.duration}</span>
                    </span>
                  )}
                  {item.aspect_ratio && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-black/70 backdrop-blur-md text-neutral-400 border border-white/10">
                      {item.aspect_ratio}
                    </span>
                  )}
                </div>

                {/* Sort Order */}
                <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded text-[10px] font-mono bg-black/70 backdrop-blur-md text-neutral-400 border border-white/10">
                  #{item.sort_order}
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-white font-serif text-base uppercase tracking-wide leading-snug group-hover:text-[#C7A46A] transition-colors line-clamp-1 mb-2">
                    {item.title}
                  </h3>

                  {item.description && (
                    <p className="text-neutral-400 text-xs font-light line-clamp-2 leading-relaxed mb-3">
                      {item.description}
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
                    {item.video_url && (
                      <a
                        href={item.video_url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-lg text-neutral-400 hover:text-[#C7A46A] hover:bg-neutral-800 transition-colors"
                        title="Open external video link"
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
                    <button
                      onClick={() => openEditModal(item)}
                      aria-label="Edit video"
                      className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      aria-label="Delete video"
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

      {/* Video Preview Modal */}
      {previewVideo && (
        <div
          onClick={() => setPreviewVideo(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#121212] border border-neutral-800 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl relative"
          >
            {/* Modal Header */}
            <div className="p-4 px-6 border-b border-neutral-800 flex items-center justify-between bg-[#151515]">
              <div className="flex items-center gap-2 truncate pr-4">
                <Video size={16} className="text-[#C7A46A] shrink-0" />
                <span className="text-white font-serif uppercase tracking-wide text-sm truncate">
                  {previewVideo.title}
                </span>
                <span className="text-[10px] font-mono text-[#C7A46A] border border-[#C7A46A]/30 px-2 py-0.5 rounded shrink-0">
                  {previewVideo.category}
                </span>
              </div>
              <button
                onClick={() => setPreviewVideo(null)}
                className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl transition-colors shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {/* Video Player */}
            <div className="w-full aspect-video bg-black">
              {previewVideo.video_embed_url ? (
                <iframe
                  src={
                    previewVideo.video_embed_url.includes('?')
                      ? `${previewVideo.video_embed_url}&autoplay=1`
                      : `${previewVideo.video_embed_url}?autoplay=1`
                  }
                  title={previewVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : previewVideo.video_url && previewVideo.video_url.endsWith('.mp4') ? (
                <video
                  src={previewVideo.video_url}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
              ) : previewVideo.video_url ? (
                <iframe
                  src={previewVideo.video_url}
                  title={previewVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-neutral-500 font-mono text-xs">
                  <Film size={40} className="mb-2 opacity-50" />
                  <span>No video URL or embed URL specified</span>
                </div>
              )}
            </div>

            {/* Modal Footer info */}
            {previewVideo.description && (
              <div className="p-4 px-6 bg-[#0a0a0a] border-t border-neutral-800">
                <p className="text-neutral-300 text-xs font-light leading-relaxed">
                  {previewVideo.description}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add / Edit Video Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#121212] border border-neutral-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl my-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#121212] border-b border-neutral-800 px-6 py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <Video size={16} className="text-[#C7A46A]" />
                <h2 className="text-lg font-serif text-white uppercase tracking-wide">
                  {editingVideo ? 'Edit Video / Podcast' : 'Add Video / Podcast'}
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
                  Video / Podcast Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rewind with Riyas — EP 01: Playback Singer Akhila Anand"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#C7A46A]"
                />
              </div>

              {/* Category, Duration, Aspect Ratio */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1.5">
                    Category <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    list="category-suggestions"
                    placeholder="e.g. Podcast, Highlight"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#C7A46A]"
                  />
                  <datalist id="category-suggestions">
                    <option value="Podcast" />
                    <option value="Highlight" />
                    <option value="Commercial Ad" />
                    <option value="Event Highlights" />
                    <option value="Music & Entertainment" />
                    <option value="Service Showcases" />
                    <option value="Automotive" />
                    <option value="Events" />
                    <option value="Advertising" />
                  </datalist>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1.5">
                    Duration
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 45 MIN or 03:20"
                    value={formData.duration || ''}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#C7A46A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1.5">
                    Aspect Ratio
                  </label>
                  <select
                    value={formData.aspect_ratio || '16:9'}
                    onChange={(e) => setFormData({ ...formData, aspect_ratio: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#C7A46A]"
                  >
                    <option value="16:9">16:9 (Landscape)</option>
                    <option value="9:16">9:16 (Vertical Reel)</option>
                    <option value="1:1">1:1 (Square)</option>
                  </select>
                </div>
              </div>

              {/* Video Embed URL & Watch URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1.5">
                    Video Embed URL (Iframe Preview)
                  </label>
                  <input
                    type="text"
                    placeholder="https://www.youtube.com/embed/... or Drive /preview"
                    value={formData.video_embed_url || ''}
                    onChange={(e) => setFormData({ ...formData, video_embed_url: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#C7A46A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1.5">
                    External Video URL (Watch / Share)
                  </label>
                  <input
                    type="text"
                    placeholder="https://www.youtube.com/watch?v=... or MP4 URL"
                    value={formData.video_url || ''}
                    onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#C7A46A]"
                  />
                </div>
              </div>

              {/* Thumbnail Asset (Upload or URL) */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1.5">
                  Thumbnail Photograph
                </label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Paste thumbnail image URL (or upload)..."
                      value={formData.thumbnail_url || ''}
                      onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
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

                  {formData.thumbnail_url && (
                    <div 
                      onClick={() => openImage({ src: formData.thumbnail_url!, title: formData.title || 'Video Thumbnail Preview', subtitle: formData.category })}
                      className="relative aspect-video w-48 rounded-xl overflow-hidden border border-neutral-800 bg-black cursor-pointer group"
                      title="Click to view full image in high-resolution"
                    >
                      <img
                        src={formData.thumbnail_url}
                        alt="Thumbnail preview"
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[#C7A46A]">
                        <Maximize2 size={16} />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1.5">
                  Description / Show Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Episode dialogue summary, artist guest credits, or campaign context..."
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black border border-neutral-800 text-white text-xs font-sans focus:outline-none focus:border-[#C7A46A]"
                />
              </div>

              {/* Tags & Sort Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1.5">
                    Tags (Comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Podcast, Celebrity, Music"
                    value={rawTags}
                    onChange={(e) => setRawTags(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#C7A46A]"
                  />
                </div>

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
              </div>

              {/* Publishing Status Toggle */}
              <div>
                <label className="flex items-center gap-3 p-3 rounded-xl bg-black border border-neutral-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="w-4 h-4 accent-[#C7A46A]"
                  />
                  <span className="text-xs font-mono text-white uppercase tracking-wider">
                    Published (Live on Website & Podcast Feed)
                  </span>
                </label>
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
                  <span>{saving ? 'Saving...' : editingVideo ? 'Update Video' : 'Save Video'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

