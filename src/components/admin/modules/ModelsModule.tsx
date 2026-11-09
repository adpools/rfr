import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import { uploadMediaFile } from '../../../services/cmsService';
import { Plus, Edit3, Trash2, Eye, EyeOff, Search, Save, X, Upload, Users, Star } from 'lucide-react';
import { InstagramIcon } from '../../common/SocialIcons';

export interface TalentModel {
  id?: string;
  name: string;
  slug?: string;
  tagline?: string;
  category: string;
  height?: string;
  measurements?: string;
  eye_color?: string;
  hair_color?: string;
  headshot_image: string;
  portfolio_images?: string[];
  instagram_url?: string;
  bio?: string;
  is_featured: boolean;
  sort_order: number;
  is_published: boolean;
}

interface ModelsModuleProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  isConfigured: boolean;
}

export const ModelsModule: React.FC<ModelsModuleProps> = ({ showToast }) => {
  const [models, setModels] = useState<TalentModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<TalentModel | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState<TalentModel>({
    name: '',
    category: 'High Fashion & Runway',
    tagline: 'Runway Lead',
    height: '178 cm',
    measurements: '34-24-35',
    headshot_image: '',
    instagram_url: '',
    bio: '',
    is_featured: false,
    sort_order: 1,
    is_published: true,
  });

  const fetchModels = async () => {
    setLoading(true);
    if (!isSupabaseConfigured) {
      setModels([
        {
          id: '1',
          name: 'Dr Shikha Santhosh',
          category: 'Runway / Editorial',
          tagline: 'Dental Surgeon & Acclaimed Showstopper',
          height: '176 cm',
          measurements: '34-25-36',
          headshot_image: '/images/influencers/shikha-santhosh.jpg',
          instagram_url: 'https://instagram.com/dr.shikha_santhosh',
          bio: 'Dental surgeon, acclaimed high-fashion model, and 2x Max Fashion showstopper.',
          is_featured: true,
          sort_order: 1,
          is_published: true,
        },
        {
          id: '2',
          name: 'Shalini Sharma',
          category: 'Couture & Editorial',
          tagline: 'International Commercial Talent',
          height: '178 cm',
          measurements: '34-24-35',
          headshot_image: '/images/influencers/shalini-sharma.jpg',
          instagram_url: 'https://instagram.com/shalinisharma_official',
          bio: 'International fashion model, commercial talent, and runway lead.',
          is_featured: true,
          sort_order: 2,
          is_published: true,
        },
      ]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('talent_models')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setModels(data || []);
    } catch (err: any) {
      showToast(err.message || 'Failed to load models', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const openCreateModal = () => {
    setEditingModel(null);
    setFormData({
      name: '',
      category: 'High Fashion & Runway',
      tagline: 'Runway Lead',
      height: '178 cm',
      measurements: '34-24-35',
      headshot_image: '',
      instagram_url: '',
      bio: '',
      is_featured: false,
      sort_order: models.length + 1,
      is_published: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (m: TalentModel) => {
    setEditingModel(m);
    setFormData({ ...m });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const res = await uploadMediaFile(file, 'models');
    setUploading(false);
    if (res.success && res.url) {
      setFormData((prev) => ({ ...prev, headshot_image: res.url || '' }));
      showToast('Model portfolio photo uploaded');
    } else {
      showToast(res.error || 'Upload failed', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Model name is required', 'error');
      return;
    }

    const payload = {
      name: formData.name.trim(),
      category: formData.category.trim() || 'High Fashion & Runway',
      tagline: formData.tagline ? formData.tagline.trim() : null,
      height: formData.height ? formData.height.trim() : null,
      measurements: formData.measurements ? formData.measurements.trim() : null,
      headshot_image: formData.headshot_image.trim() || '/images/influencers/shikha-santhosh.jpg',
      instagram_url: formData.instagram_url ? formData.instagram_url.trim() : null,
      bio: formData.bio ? formData.bio.trim() : null,
      is_featured: formData.is_featured,
      sort_order: Number(formData.sort_order) || 0,
      is_published: formData.is_published,
      updated_at: new Date().toISOString(),
    };

    try {
      if (editingModel?.id) {
        const { error } = await supabase
          .from('talent_models')
          .update(payload)
          .eq('id', editingModel.id);

        if (error) throw error;
        showToast('Model profile updated successfully');
      } else {
        const { error } = await supabase
          .from('talent_models')
          .insert([payload]);

        if (error) throw error;
        showToast('Model added to roster successfully');
      }
      setIsModalOpen(false);
      fetchModels();
    } catch (err: any) {
      showToast(err.message || 'Save failed', 'error');
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this model profile?')) return;
    try {
      const { error } = await supabase.from('talent_models').delete().eq('id', id);
      if (error) throw error;
      showToast('Model deleted');
      fetchModels();
    } catch (err: any) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  const togglePublish = async (m: TalentModel) => {
    if (!m.id) return;
    const newState = !m.is_published;
    try {
      const { error } = await supabase
        .from('talent_models')
        .update({ is_published: newState, updated_at: new Date().toISOString() })
        .eq('id', m.id);

      if (error) throw error;
      setModels((prev) =>
        prev.map((item) => (item.id === m.id ? { ...item, is_published: newState } : item))
      );
      showToast(newState ? 'Profile set to active' : 'Profile hidden');
    } catch (err: any) {
      showToast(err.message || 'Update failed', 'error');
    }
  };

  const filteredModels = models.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.category && m.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#C7A46A] uppercase tracking-wider mb-1">
            <Users size={14} />
            <span>TALENT MANAGEMENT</span>
          </div>
          <h1 className="text-2xl font-serif text-white uppercase tracking-wide">
            Models Guild Roster
          </h1>
          <p className="text-neutral-400 text-xs font-light">
            Manage high-fashion runway models, editorial talents, and portfolio specifications.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-xl bg-[#C7A46A] hover:bg-[#D4B678] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 self-start sm:self-auto transition-all shadow-lg shadow-[#C7A46A]/20"
        >
          <Plus size={16} />
          <span>Add Model Profile</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
        <input
          type="text"
          placeholder="Search models by name or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#111111] border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#C7A46A]"
        />
      </div>

      {/* Roster Cards */}
      {loading ? (
        <div className="py-24 text-center text-neutral-500 font-mono text-xs uppercase tracking-widest">
          Loading models roster...
        </div>
      ) : filteredModels.length === 0 ? (
        <div className="py-16 text-center text-neutral-500 font-mono text-xs border border-dashed border-neutral-800 rounded-2xl">
          No models found. Click &quot;Add Model Profile&quot; to begin.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredModels.map((m) => (
            <div
              key={m.id || m.name}
              className="p-5 rounded-2xl bg-[#0D0D0D] border border-neutral-850 hover:border-neutral-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-[#181818] overflow-hidden flex-shrink-0 border border-neutral-800">
                    {m.headshot_image ? (
                      <img src={m.headshot_image} alt={m.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-500">
                        <Users size={18} />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-serif text-white font-medium">{m.name}</h3>
                    <div className="text-[10px] font-mono text-[#C7A46A] uppercase">{m.category}</div>
                    {m.tagline && <div className="text-[10px] font-mono text-neutral-500">{m.tagline}</div>}
                  </div>
                </div>

                <div className="text-xs font-mono text-neutral-400 space-y-1">
                  {m.height && <div>Height: {m.height}</div>}
                  {m.measurements && <div>Stats: {m.measurements}</div>}
                  {m.instagram_url && (
                    <div className="flex items-center gap-1 text-pink-400/80 truncate">
                      <InstagramIcon size={11} />
                      <span className="truncate">{m.instagram_url}</span>
                    </div>
                  )}
                  {m.bio && <p className="text-neutral-500 line-clamp-2 text-[11px] font-sans mt-2">{m.bio}</p>}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-neutral-850">
                <button
                  onClick={() => togglePublish(m)}
                  className={`flex items-center gap-1.5 text-xs font-mono px-3 py-1 rounded-lg ${
                    m.is_published
                      ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/40'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {m.is_published ? <Eye size={13} /> : <EyeOff size={13} />}
                  <span>{m.is_published ? 'Active' : 'Hidden'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(m)}
                    className="p-2 rounded-lg bg-[#181818] hover:bg-[#222] text-neutral-300 hover:text-white"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(m.id)}
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
                {editingModel ? 'Edit Model Profile' : 'Add Model to Guild'}
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
                  Full Name *
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
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                    Tagline / Specialization
                  </label>
                  <input
                    type="text"
                    value={formData.tagline || ''}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                    Height
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 178 cm"
                    value={formData.height || ''}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                    Measurements / Stats
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 34-24-35"
                    value={formData.measurements || ''}
                    onChange={(e) => setFormData({ ...formData, measurements: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                  Instagram Profile Link
                </label>
                <input
                  type="text"
                  placeholder="https://instagram.com/..."
                  value={formData.instagram_url || ''}
                  onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                  Biography / Runway Accolades
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
                  Headshot Photo Upload
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
                {formData.headshot_image && (
                  <div className="mt-2 flex items-center gap-2">
                    <img src={formData.headshot_image} alt="Preview" className="w-10 h-10 object-cover rounded-full border border-neutral-700" />
                    <span className="text-[10px] font-mono text-neutral-500 truncate max-w-xs">{formData.headshot_image}</span>
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
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="rounded bg-[#181818] border-neutral-700 text-[#C7A46A]"
                  />
                  <span className="text-xs font-mono text-neutral-300">Featured</span>
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
                  <span>{editingModel ? 'Save Changes' : 'Add Model'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
