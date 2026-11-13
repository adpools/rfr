import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import { uploadMediaFile } from '../../../services/cmsService';
import { Plus, Edit3, Trash2, Eye, EyeOff, Search, Save, X, Upload, Sparkles, Play, Video } from 'lucide-react';

export interface HeroBanner {
  id?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image_url?: string;
  video_url?: string;
  cta_primary_label?: string;
  cta_primary_link?: string;
  cta_secondary_label?: string;
  cta_secondary_link?: string;
  sort_order: number;
  is_published: boolean;
}

interface BannersModuleProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  isConfigured: boolean;
}

interface BannerPreview {
  type: 'image' | 'youtube' | 'video' | 'empty';
  src: string;
  youtubeId?: string;
  hasVideo: boolean;
  videoLabel?: string;
}

// Helper to determine the optimal preview media for a banner
const getBannerPreview = (item: { image_url?: string | null; video_url?: string | null }): BannerPreview => {
  const img = item.image_url?.trim() || '';
  const vid = item.video_url?.trim() || '';

  // Known legacy placeholder that does not exist on disk
  const isKnownMissingPath = img === '/images/hero-bg.jpg';

  const extractYouTubeId = (url: string) => {
    const match = url.match(/(?:embed\/|v=|youtu\.be\/|\/v\/)([^?&#]+)/);
    return match ? match[1] : null;
  };

  const ytId = vid ? extractYouTubeId(vid) : null;

  // 1. If explicit valid image exists and is not the known missing path
  if (img && !isKnownMissingPath) {
    return {
      type: 'image',
      src: img,
      hasVideo: Boolean(vid),
      videoLabel: ytId ? 'YouTube' : vid ? 'Video' : undefined,
    };
  }

  // 2. If video URL exists, use video preview or YouTube thumbnail
  if (vid) {
    if (ytId) {
      return {
        type: 'youtube',
        src: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
        youtubeId: ytId,
        hasVideo: true,
        videoLabel: 'YouTube',
      };
    }
    // Local or remote MP4 / WebM video
    return {
      type: 'video',
      src: vid,
      hasVideo: true,
      videoLabel: 'Video',
    };
  }

  // 3. Fallback to image if set
  if (img) {
    return {
      type: 'image',
      src: img,
      hasVideo: false,
    };
  }

  return {
    type: 'empty',
    src: '',
    hasVideo: false,
  };
};

// Reusable preview display for cards and modal
const BannerPreviewDisplay: React.FC<{
  banner: { image_url?: string | null; video_url?: string | null; title?: string; eyebrow?: string | null };
  className?: string;
  isModal?: boolean;
}> = ({ banner, className = '', isModal = false }) => {
  const preview = getBannerPreview(banner);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    setLoadError(false);
  }, [banner.image_url, banner.video_url]);

  return (
    <div className={`aspect-[16/9] rounded-xl bg-[#141414] overflow-hidden relative border border-neutral-800 ${className}`}>
      {/* 1. Image or YouTube thumbnail */}
      {(preview.type === 'image' || preview.type === 'youtube') && !loadError && (
        <img
          src={preview.src}
          alt={banner.title || 'Banner Preview'}
          className="w-full h-full object-cover"
          onError={() => setLoadError(true)}
        />
      )}

      {/* 2. Muted local / remote MP4 video preview with preload="metadata" (no autoplay across cards) */}
      {preview.type === 'video' && !loadError && (
        <video
          src={preview.src}
          preload="metadata"
          muted
          playsInline
          className="w-full h-full object-cover"
          onError={() => setLoadError(true)}
        />
      )}

      {/* 3. Clean branded fallback for empty or errored media (no broken-image icons) */}
      {(preview.type === 'empty' || loadError) && (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-[#0a0a0a] text-center select-none">
          <img
            src="/images/final bro.png"
            alt="RFR by Riyas"
            className="w-20 h-auto max-h-12 object-contain opacity-60 mb-2"
            draggable={false}
          />
          <span className="text-[10px] font-mono text-[#C7A46A]/80 uppercase tracking-widest">
            {preview.hasVideo ? 'Video Showcase' : 'RFR Stage'}
          </span>
        </div>
      )}

      {/* Eyebrow badge top-left (card view only) */}
      {!isModal && banner.eyebrow && (
        <div className="absolute top-3 left-3 px-3 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-neutral-700 text-[9px] font-mono text-[#C7A46A] uppercase max-w-[65%] truncate">
          {banner.eyebrow}
        </div>
      )}

      {/* Subtle VIDEO / YOUTUBE badge top-right */}
      {preview.hasVideo && (
        <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-[#C7A46A]/50 text-[9px] font-mono text-[#C7A46A] uppercase flex items-center gap-1.5 shadow-lg">
          <Play size={8} className="fill-[#C7A46A] text-[#C7A46A]" />
          <span>{preview.videoLabel || 'VIDEO'}</span>
        </div>
      )}
    </div>
  );
};

export const BannersModule: React.FC<BannersModuleProps> = ({ showToast }) => {
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<HeroBanner | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState<HeroBanner>({
    eyebrow: 'THE LUXURY CREATIVE ECOSYSTEM',
    title: '',
    subtitle: '',
    image_url: '',
    video_url: '',
    cta_primary_label: 'EXPLORE CHRONICLE',
    cta_primary_link: '/timeline',
    cta_secondary_label: 'INITIATE COLLABORATION',
    cta_secondary_link: '/contact',
    sort_order: 1,
    is_published: true,
  });

  const fetchBanners = async () => {
    setLoading(true);
    if (!isSupabaseConfigured) {
      setBanners([
        {
          id: '1',
          eyebrow: 'THE LUXURY CREATIVE ECOSYSTEM',
          title: 'RIYAS FASHION RUNWAY',
          subtitle: 'Where Haute Couture Meets Architectural Precision',
          cta_primary_label: 'EXPLORE CHRONICLE',
          cta_primary_link: '/timeline',
          cta_secondary_label: 'INITIATE COLLABORATION',
          cta_secondary_link: '/contact',
          video_url: '/videos/Dandya%20Deeshna%20Event/hero-bg-optimized.mp4',
          sort_order: 1,
          is_published: true,
        },
      ]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('hero_banners')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setBanners(data || []);
    } catch (err: any) {
      showToast(err.message || 'Failed to load banners', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const openCreateModal = () => {
    setEditingBanner(null);
    setFormData({
      eyebrow: 'THE LUXURY CREATIVE ECOSYSTEM',
      title: '',
      subtitle: '',
      image_url: '',
      video_url: '',
      cta_primary_label: 'EXPLORE CHRONICLE',
      cta_primary_link: '/timeline',
      cta_secondary_label: 'INITIATE COLLABORATION',
      cta_secondary_link: '/contact',
      sort_order: banners.length + 1,
      is_published: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (b: HeroBanner) => {
    setEditingBanner(b);
    setFormData({ ...b });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const res = await uploadMediaFile(file, 'banners');
    setUploading(false);
    if (res.success && res.url) {
      setFormData((prev) => ({ ...prev, image_url: res.url || '' }));
      showToast('Banner background asset uploaded');
    } else {
      showToast(res.error || 'Upload failed', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Banner title is required', 'error');
      return;
    }

    const payload = {
      eyebrow: formData.eyebrow ? formData.eyebrow.trim() : 'THE LUXURY CREATIVE ECOSYSTEM',
      title: formData.title.trim(),
      subtitle: formData.subtitle ? formData.subtitle.trim() : null,
      image_url: formData.image_url ? formData.image_url.trim() : null,
      video_url: formData.video_url ? formData.video_url.trim() : null,
      cta_primary_label: formData.cta_primary_label ? formData.cta_primary_label.trim() : 'EXPLORE CHRONICLE',
      cta_primary_link: formData.cta_primary_link ? formData.cta_primary_link.trim() : '/timeline',
      cta_secondary_label: formData.cta_secondary_label ? formData.cta_secondary_label.trim() : 'INITIATE COLLABORATION',
      cta_secondary_link: formData.cta_secondary_link ? formData.cta_secondary_link.trim() : '/contact',
      sort_order: Number(formData.sort_order) || 0,
      is_published: formData.is_published,
      updated_at: new Date().toISOString(),
    };

    try {
      if (editingBanner?.id) {
        const { error } = await supabase
          .from('hero_banners')
          .update(payload)
          .eq('id', editingBanner.id);

        if (error) throw error;
        showToast('Hero banner updated');
      } else {
        const { error } = await supabase
          .from('hero_banners')
          .insert([payload]);

        if (error) throw error;
        showToast('Hero banner created');
      }
      setIsModalOpen(false);
      fetchBanners();
    } catch (err: any) {
      showToast(err.message || 'Save failed', 'error');
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this banner?')) return;
    try {
      const { error } = await supabase.from('hero_banners').delete().eq('id', id);
      if (error) throw error;
      showToast('Banner deleted');
      fetchBanners();
    } catch (err: any) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  const togglePublish = async (b: HeroBanner) => {
    if (!b.id) return;
    const newState = !b.is_published;
    try {
      const { error } = await supabase
        .from('hero_banners')
        .update({ is_published: newState, updated_at: new Date().toISOString() })
        .eq('id', b.id);

      if (error) throw error;
      setBanners((prev) =>
        prev.map((item) => (item.id === b.id ? { ...item, is_published: newState } : item))
      );
      showToast(newState ? 'Banner visible' : 'Banner hidden');
    } catch (err: any) {
      showToast(err.message || 'Update failed', 'error');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#C7A46A] uppercase tracking-wider mb-1">
            <Sparkles size={14} />
            <span>HERO STAGE</span>
          </div>
          <h1 className="text-2xl font-serif text-white uppercase tracking-wide">
            Homepage Hero Banners
          </h1>
          <p className="text-neutral-400 text-xs font-light">
            Manage the cinematic headline slides, background video loops, and primary calls-to-action on the homepage.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-xl bg-[#C7A46A] hover:bg-[#D4B678] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 self-start sm:self-auto transition-all shadow-lg shadow-[#C7A46A]/20"
        >
          <Plus size={16} />
          <span>New Hero Slide</span>
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-24 text-center text-neutral-500 font-mono text-xs uppercase tracking-widest">
          Loading hero banners...
        </div>
      ) : banners.length === 0 ? (
        <div className="py-16 text-center text-neutral-500 font-mono text-xs border border-dashed border-neutral-800 rounded-2xl">
          No hero banners created. Click &quot;New Hero Slide&quot; to begin.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map((b) => (
            <div
              key={b.id || b.title}
              className="p-5 rounded-2xl bg-[#0D0D0D] border border-neutral-850 hover:border-neutral-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Unified Media Preview (Card View) */}
                <BannerPreviewDisplay banner={b} />

                <div>
                  <h3 className="text-base font-serif text-white font-medium">{b.title}</h3>
                  {b.subtitle && <p className="text-neutral-400 text-xs font-light line-clamp-2 mt-1">{b.subtitle}</p>}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-neutral-850">
                <button
                  onClick={() => togglePublish(b)}
                  className={`flex items-center gap-1.5 text-xs font-mono px-3 py-1 rounded-lg ${
                    b.is_published
                      ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/40'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {b.is_published ? <Eye size={13} /> : <EyeOff size={13} />}
                  <span>{b.is_published ? 'Published' : 'Hidden'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(b)}
                    className="p-2 rounded-lg bg-[#181818] hover:bg-[#222] text-neutral-300 hover:text-white"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(b.id)}
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
                {editingBanner ? 'Edit Hero Banner' : 'Create Hero Banner'}
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
                  Eyebrow Badge Text
                </label>
                <input
                  type="text"
                  value={formData.eyebrow || ''}
                  onChange={(e) => setFormData({ ...formData, eyebrow: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                  Main Headline Title *
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
                  Subtitle
                </label>
                <input
                  type="text"
                  value={formData.subtitle || ''}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                    Primary CTA Label
                  </label>
                  <input
                    type="text"
                    value={formData.cta_primary_label || ''}
                    onChange={(e) => setFormData({ ...formData, cta_primary_label: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                    Primary CTA Link
                  </label>
                  <input
                    type="text"
                    value={formData.cta_primary_link || ''}
                    onChange={(e) => setFormData({ ...formData, cta_primary_link: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                  Background Video URL (MP4 / WebM / YouTube)
                </label>
                <input
                  type="text"
                  placeholder="https://...mp4 or https://www.youtube.com/..."
                  value={formData.video_url || ''}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#C7A46A]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                  Background Poster Photo Upload
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
                {formData.image_url && (
                  <div className="mt-2 flex items-center justify-between gap-2 p-2 rounded-lg bg-[#141414] border border-neutral-800">
                    <span className="text-[10px] font-mono text-neutral-400 truncate max-w-xs">{formData.image_url}</span>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image_url: '' })}
                      className="text-[10px] font-mono text-red-400 hover:text-red-300 shrink-0"
                    >
                      Remove Poster
                    </button>
                  </div>
                )}
              </div>

              {/* Live Preview in Modal */}
              <div className="pt-2">
                <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1.5">
                  Live Preview
                </label>
                <div className="w-full max-w-sm">
                  <BannerPreviewDisplay banner={formData} isModal={true} />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="rounded bg-[#181818] border-neutral-700 text-[#C7A46A]"
                  />
                  <span className="text-xs font-mono text-neutral-300">Published to homepage</span>
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
                  <span>{editingBanner ? 'Save Banner' : 'Create Banner'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
