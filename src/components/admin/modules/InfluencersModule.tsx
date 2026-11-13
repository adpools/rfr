import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import { uploadMediaFile } from '../../../services/cmsService';
import { Plus, Edit3, Trash2, Eye, EyeOff, Search, Save, X, Upload, Radio, MapPin, Star, Maximize2 } from 'lucide-react';
import { useMediaViewer } from '../../../context/MediaViewerContext';
import { InstagramIcon } from '../../common/SocialIcons';

export interface TalentInfluencer {
  id?: string;
  name: string;
  handle?: string;
  niche: string;
  tier: 'Mega' | 'Macro' | 'Micro' | 'Nano';
  followers_count?: string;
  engagement_rate?: string;
  profile_image: string;
  instagram_url?: string;
  youtube_url?: string;
  bio?: string;
  is_featured_home: boolean;
  sort_order: number;
  is_published: boolean;
}

interface InfluencersModuleProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  isConfigured: boolean;
}

export const InfluencersModule: React.FC<InfluencersModuleProps> = ({ showToast }) => {
  const { openImage } = useMediaViewer();
  const [influencers, setInfluencers] = useState<TalentInfluencer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInfluencer, setEditingInfluencer] = useState<TalentInfluencer | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState<TalentInfluencer>({
    name: '',
    handle: '@rfr_creator',
    niche: 'Fashion & Lifestyle',
    tier: 'Macro',
    followers_count: '150K+',
    engagement_rate: '5.2%',
    profile_image: '',
    instagram_url: '',
    youtube_url: '',
    bio: '',
    is_featured_home: true,
    sort_order: 1,
    is_published: true,
  });

  const fetchInfluencers = async () => {
    setLoading(true);
    if (!isSupabaseConfigured) {
      setInfluencers([
        {
          id: '1',
          name: 'Anu (Aanu Designs)',
          handle: '@aanu_official',
          niche: 'Celebrity Fashion & Styling',
          tier: 'Macro',
          followers_count: '250K+',
          engagement_rate: '6.2%',
          profile_image: '/images/influencers/aanu.jpeg',
          instagram_url: 'https://instagram.com/aanu_official',
          bio: 'Celebrity fashion designer, style consultant, Founder & MD of ToU|By Aanu.',
          is_featured_home: true,
          sort_order: 1,
          is_published: true,
        },
        {
          id: '2',
          name: 'Shikha Santhosh',
          handle: '@dr.shikha_santhosh',
          niche: 'Luxury & Haute Couture',
          tier: 'Macro',
          followers_count: '180K+',
          engagement_rate: '7.1%',
          profile_image: '/images/influencers/shikha-santhosh.jpg',
          instagram_url: 'https://instagram.com/dr.shikha_santhosh',
          bio: 'Max Fashion showstopper, editorial model, and creator.',
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
        .from('talent_influencers')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setInfluencers(data || []);
    } catch (err: any) {
      showToast(err.message || 'Failed to load influencers', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfluencers();
  }, []);

  const openCreateModal = () => {
    setEditingInfluencer(null);
    setFormData({
      name: '',
      handle: '@creator',
      niche: 'Fashion & Lifestyle',
      tier: 'Macro',
      followers_count: '100K+',
      engagement_rate: '4.8%',
      profile_image: '',
      instagram_url: '',
      youtube_url: '',
      bio: '',
      is_featured_home: true,
      sort_order: influencers.length + 1,
      is_published: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (inf: TalentInfluencer) => {
    setEditingInfluencer(inf);
    setFormData({ ...inf });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const res = await uploadMediaFile(file, 'influencers');
    setUploading(false);
    if (res.success && res.url) {
      setFormData((prev) => ({ ...prev, profile_image: res.url || '' }));
      showToast('Profile image uploaded');
    } else {
      showToast(res.error || 'Upload failed', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Creator name is required', 'error');
      return;
    }

    const payload = {
      name: formData.name.trim(),
      handle: formData.handle ? formData.handle.trim() : null,
      niche: formData.niche.trim() || 'Fashion & Lifestyle',
      tier: formData.tier,
      followers_count: formData.followers_count ? formData.followers_count.trim() : null,
      engagement_rate: formData.engagement_rate ? formData.engagement_rate.trim() : null,
      profile_image: formData.profile_image.trim() || '/images/influencers/deepamol.jpg',
      instagram_url: formData.instagram_url ? formData.instagram_url.trim() : null,
      youtube_url: formData.youtube_url ? formData.youtube_url.trim() : null,
      bio: formData.bio ? formData.bio.trim() : null,
      is_featured_home: formData.is_featured_home,
      sort_order: Number(formData.sort_order) || 0,
      is_published: formData.is_published,
      updated_at: new Date().toISOString(),
    };

    try {
      if (editingInfluencer?.id) {
        const { error } = await supabase
          .from('talent_influencers')
          .update(payload)
          .eq('id', editingInfluencer.id);

        if (error) throw error;
        showToast('Influencer profile updated successfully');
      } else {
        const { error } = await supabase
          .from('talent_influencers')
          .insert([payload]);

        if (error) throw error;
        showToast('Influencer added to circle successfully');
      }
      setIsModalOpen(false);
      fetchInfluencers();
    } catch (err: any) {
      showToast(err.message || 'Save failed', 'error');
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this creator profile?')) return;
    try {
      const { error } = await supabase.from('talent_influencers').delete().eq('id', id);
      if (error) throw error;
      showToast('Creator removed');
      fetchInfluencers();
    } catch (err: any) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  const togglePublish = async (inf: TalentInfluencer) => {
    if (!inf.id) return;
    const newState = !inf.is_published;
    try {
      const { error } = await supabase
        .from('talent_influencers')
        .update({ is_published: newState, updated_at: new Date().toISOString() })
        .eq('id', inf.id);

      if (error) throw error;
      setInfluencers((prev) =>
        prev.map((item) => (item.id === inf.id ? { ...item, is_published: newState } : item))
      );
      showToast(newState ? 'Profile set to active' : 'Profile hidden');
    } catch (err: any) {
      showToast(err.message || 'Update failed', 'error');
    }
  };

  const filteredInfluencers = influencers.filter(
    (i) =>
      i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.niche.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#C7A46A] uppercase tracking-wider mb-1">
            <Radio size={14} />
            <span>TIC GUILD</span>
          </div>
          <h1 className="text-2xl font-serif text-white uppercase tracking-wide">
            Trivandrum Influencer Circle
          </h1>
          <p className="text-neutral-400 text-xs font-light">
            Manage creator profiles, follower metrics, engagement tiers, and campaign collaborators.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-xl bg-[#C7A46A] hover:bg-[#D4B678] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 self-start sm:self-auto transition-all shadow-lg shadow-[#C7A46A]/20"
        >
          <Plus size={16} />
          <span>Add Influencer</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
        <input
          type="text"
          placeholder="Search creators by name or niche..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#111111] border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#C7A46A]"
        />
      </div>

      {/* Roster Cards */}
      {loading ? (
        <div className="py-24 text-center text-neutral-500 font-mono text-xs uppercase tracking-widest">
          Loading creator network...
        </div>
      ) : filteredInfluencers.length === 0 ? (
        <div className="py-16 text-center text-neutral-500 font-mono text-xs border border-dashed border-neutral-800 rounded-2xl">
          No creators found. Click &quot;Add Influencer&quot; to begin.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredInfluencers.map((inf) => (
            <div
              key={inf.id || inf.name}
              className="p-5 rounded-2xl bg-[#0D0D0D] border border-neutral-850 hover:border-neutral-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div 
                    onClick={inf.profile_image ? () => openImage({
                      src: inf.profile_image,
                      title: inf.name,
                      subtitle: `${inf.niche} • ${inf.tier} Creator`,
                      category: 'INFLUENCER ALLIANCE',
                    }) : undefined}
                    className={`w-14 h-14 rounded-full bg-[#181818] overflow-hidden flex-shrink-0 border border-neutral-800 ${
                      inf.profile_image ? 'cursor-pointer hover:border-[#C7A46A] transition-colors group/avatar relative' : ''
                    }`}
                    title={inf.profile_image ? 'Click to inspect creator profile in high-resolution' : undefined}
                  >
                    {inf.profile_image ? (
                      <>
                        <img src={inf.profile_image} alt={inf.name} className="w-full h-full object-cover group-hover/avatar:scale-110 transition-transform" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center text-[#C7A46A]">
                          <Maximize2 size={14} />
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-500">
                        <Radio size={18} />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-serif text-white font-medium">{inf.name}</h3>
                    <div className="text-[10px] font-mono text-[#C7A46A] uppercase">{inf.niche}</div>
                    <div className="text-[10px] font-mono text-neutral-500">{inf.tier} Creator</div>
                  </div>
                </div>

                <div className="text-xs font-mono text-neutral-400 space-y-1">
                  {inf.followers_count && <div>Followers: {inf.followers_count}</div>}
                  {inf.engagement_rate && <div>Engagement: {inf.engagement_rate}</div>}
                  {inf.handle && (
                    <div className="flex items-center gap-1 text-pink-400/80 truncate">
                      <InstagramIcon size={11} />
                      <span className="truncate">{inf.handle}</span>
                    </div>
                  )}
                  {inf.bio && <p className="text-neutral-500 line-clamp-2 text-[11px] font-sans mt-2">{inf.bio}</p>}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-neutral-850">
                <button
                  onClick={() => togglePublish(inf)}
                  className={`flex items-center gap-1.5 text-xs font-mono px-3 py-1 rounded-lg ${
                    inf.is_published
                      ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/40'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {inf.is_published ? <Eye size={13} /> : <EyeOff size={13} />}
                  <span>{inf.is_published ? 'Active' : 'Hidden'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(inf)}
                    className="p-2 rounded-lg bg-[#181818] hover:bg-[#222] text-neutral-300 hover:text-white"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(inf.id)}
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
                {editingInfluencer ? 'Edit Creator Profile' : 'Add Creator to Circle'}
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
                  Full Name / Stage Identity *
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
                    Niche / Focus
                  </label>
                  <input
                    type="text"
                    value={formData.niche}
                    onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                    Audience Tier *
                  </label>
                  <select
                    value={formData.tier}
                    onChange={(e) => setFormData({ ...formData, tier: e.target.value as any })}
                    className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                  >
                    <option value="Mega">Mega (1M+)</option>
                    <option value="Macro">Macro (100K - 1M)</option>
                    <option value="Micro">Micro (10K - 100K)</option>
                    <option value="Nano">Nano (&lt; 10K)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                    Followers Count Text
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 250K+"
                    value={formData.followers_count || ''}
                    onChange={(e) => setFormData({ ...formData, followers_count: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                    Engagement Rate
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 5.8%"
                    value={formData.engagement_rate || ''}
                    onChange={(e) => setFormData({ ...formData, engagement_rate: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                    Social Handle
                  </label>
                  <input
                    type="text"
                    placeholder="@handle"
                    value={formData.handle || ''}
                    onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                    Instagram URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://instagram.com/..."
                    value={formData.instagram_url || ''}
                    onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                  Biography / Portfolio
                </label>
                <textarea
                  rows={3}
                  value={formData.bio || ''}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                  Profile Photo Upload
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
                {formData.profile_image && (
                  <div className="mt-2 flex items-center gap-2">
                    <img 
                      src={formData.profile_image} 
                      alt="Preview" 
                      onClick={() => openImage({ src: formData.profile_image, title: formData.name || 'Creator Portrait', category: formData.niche })}
                      className="w-10 h-10 object-cover rounded-full border border-neutral-700 cursor-pointer hover:opacity-80 transition-opacity" 
                      title="Click to view full image in high-resolution"
                    />
                    <span className="text-[10px] font-mono text-neutral-500 truncate max-w-xs">{formData.profile_image}</span>
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
                  <span>{editingInfluencer ? 'Save Changes' : 'Add Creator'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
