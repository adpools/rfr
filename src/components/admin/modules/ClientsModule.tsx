import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import { uploadMediaFile } from '../../../services/cmsService';
import { Plus, Edit3, Trash2, Eye, EyeOff, Search, Save, X, Upload, Briefcase, ExternalLink, Star } from 'lucide-react';

export interface PartnerClient {
  id?: string;
  name: string;
  category: string;
  type: 'client' | 'partner';
  description?: string;
  website?: string;
  logo: string;
  is_transparent: boolean;
  sort_order: number;
  is_published: boolean;
}

interface ClientsModuleProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  isConfigured: boolean;
}

export const ClientsModule: React.FC<ClientsModuleProps> = ({ showToast }) => {
  const [brands, setBrands] = useState<PartnerClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'client' | 'partner'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<PartnerClient | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState<PartnerClient>({
    name: '',
    category: 'Automotive & Mobility',
    type: 'client',
    description: '',
    website: '',
    logo: '',
    is_transparent: true,
    sort_order: 1,
    is_published: true,
  });

  const fetchBrands = async () => {
    setLoading(true);
    if (!isSupabaseConfigured) {
      setBrands([
        {
          id: '1',
          name: 'ŠKODA AUTO',
          category: 'European Automotive & Rallies',
          type: 'client',
          logo: '/images/clients/skoda.png',
          is_transparent: true,
          sort_order: 1,
          is_published: true,
        },
        {
          id: '2',
          name: 'CITROËN',
          category: 'Automotive & French Luxury',
          type: 'client',
          logo: '/images/clients/citroen.png',
          is_transparent: true,
          sort_order: 2,
          is_published: true,
        },
        {
          id: '3',
          name: 'JEEP',
          category: 'Off-Road Lifestyle & Adventure',
          type: 'client',
          logo: '/images/clients/jeep.png',
          is_transparent: true,
          sort_order: 3,
          is_published: true,
        },
      ]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('partners_clients')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setBrands(data || []);
    } catch (err: any) {
      showToast(err.message || 'Failed to load partners/clients', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const openCreateModal = () => {
    setEditingBrand(null);
    setFormData({
      name: '',
      category: 'Automotive & Mobility',
      type: 'client',
      description: '',
      website: '',
      logo: '',
      is_transparent: true,
      sort_order: brands.length + 1,
      is_published: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (b: PartnerClient) => {
    setEditingBrand(b);
    setFormData({ ...b });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const res = await uploadMediaFile(file, 'clients');
    setUploading(false);
    if (res.success && res.url) {
      setFormData((prev) => ({ ...prev, logo: res.url || '' }));
      showToast('Brand logo uploaded successfully');
    } else {
      showToast(res.error || 'Upload failed', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Brand name is required', 'error');
      return;
    }

    const payload = {
      name: formData.name.trim(),
      category: formData.category.trim() || 'Brand Partner',
      type: formData.type,
      description: formData.description ? formData.description.trim() : null,
      website: formData.website ? formData.website.trim() : null,
      logo: formData.logo.trim() || '/images/clients/skoda.png',
      is_transparent: formData.is_transparent,
      sort_order: Number(formData.sort_order) || 0,
      is_published: formData.is_published,
      updated_at: new Date().toISOString(),
    };

    try {
      if (editingBrand?.id) {
        const { error } = await supabase
          .from('partners_clients')
          .update(payload)
          .eq('id', editingBrand.id);

        if (error) throw error;
        showToast('Brand details updated');
      } else {
        const { error } = await supabase
          .from('partners_clients')
          .insert([payload]);

        if (error) throw error;
        showToast('Brand added to directory');
      }
      setIsModalOpen(false);
      fetchBrands();
    } catch (err: any) {
      showToast(err.message || 'Save failed', 'error');
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this brand?')) return;
    try {
      const { error } = await supabase.from('partners_clients').delete().eq('id', id);
      if (error) throw error;
      showToast('Brand deleted');
      fetchBrands();
    } catch (err: any) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  const togglePublish = async (b: PartnerClient) => {
    if (!b.id) return;
    const newState = !b.is_published;
    try {
      const { error } = await supabase
        .from('partners_clients')
        .update({ is_published: newState, updated_at: new Date().toISOString() })
        .eq('id', b.id);

      if (error) throw error;
      setBrands((prev) =>
        prev.map((item) => (item.id === b.id ? { ...item, is_published: newState } : item))
      );
      showToast(newState ? 'Brand visible' : 'Brand hidden');
    } catch (err: any) {
      showToast(err.message || 'Update failed', 'error');
    }
  };

  const filteredBrands = brands.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || b.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#C7A46A] uppercase tracking-wider mb-1">
            <Briefcase size={14} />
            <span>COMMERCIAL ALLIANCES</span>
          </div>
          <h1 className="text-2xl font-serif text-white uppercase tracking-wide">
            Partners & Clients Directory
          </h1>
          <p className="text-neutral-400 text-xs font-light">
            Manage corporate brand partnerships, automotive sponsors, and runway clientele.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-xl bg-[#C7A46A] hover:bg-[#D4B678] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 self-start sm:self-auto transition-all shadow-lg shadow-[#C7A46A]/20"
        >
          <Plus size={16} />
          <span>Add Brand</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            placeholder="Search brands by name or industry..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#111111] border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#C7A46A]"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as any)}
          className="px-4 py-2.5 rounded-xl bg-[#111111] border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#C7A46A]"
        >
          <option value="all">All Alliances</option>
          <option value="client">Clients Only</option>
          <option value="partner">Strategic Partners Only</option>
        </select>
      </div>

      {/* Brand Cards Grid */}
      {loading ? (
        <div className="py-24 text-center text-neutral-500 font-mono text-xs uppercase tracking-widest">
          Loading brand partners...
        </div>
      ) : filteredBrands.length === 0 ? (
        <div className="py-16 text-center text-neutral-500 font-mono text-xs border border-dashed border-neutral-800 rounded-2xl">
          No brands found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredBrands.map((brand) => (
            <div
              key={brand.id || brand.name}
              className="p-5 rounded-2xl bg-[#0D0D0D] border border-neutral-850 hover:border-neutral-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-12 rounded-xl bg-[#181818] p-2 flex items-center justify-center border border-neutral-800 shrink-0">
                    {brand.logo ? (
                      <img src={brand.logo} alt={brand.name} className="max-h-full max-w-full object-contain filter invert" />
                    ) : (
                      <Briefcase size={18} className="text-neutral-500" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-serif text-white font-medium truncate">{brand.name}</h3>
                    <div className="text-[10px] font-mono text-[#C7A46A] uppercase">{brand.type}</div>
                    <div className="text-[10px] font-mono text-neutral-500 truncate">{brand.category}</div>
                  </div>
                </div>

                {brand.description && (
                  <p className="text-neutral-400 text-xs font-light line-clamp-2 leading-relaxed">
                    {brand.description}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-neutral-850">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => togglePublish(brand)}
                    className={`flex items-center gap-1.5 text-xs font-mono px-3 py-1 rounded-lg ${
                      brand.is_published
                        ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/40'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {brand.is_published ? <Eye size={13} /> : <EyeOff size={13} />}
                    <span>{brand.is_published ? 'Active' : 'Hidden'}</span>
                  </button>

                  {brand.website && (
                    <a
                      href={brand.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-white"
                      title="Visit Website"
                    >
                      <ExternalLink size={13} />
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(brand)}
                    className="p-2 rounded-lg bg-[#181818] hover:bg-[#222] text-neutral-300 hover:text-white"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(brand.id)}
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
                {editingBrand ? 'Edit Brand Details' : 'Add Brand to Directory'}
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
                  Brand / Organization Name *
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
                    Alliance Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                  >
                    <option value="client">Client</option>
                    <option value="partner">Strategic Partner</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                    Industry Category *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                  Official Website URL
                </label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={formData.website || ''}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                  Description / Collaboration Scope
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
                  Brand Logo Upload
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
                {formData.logo && (
                  <div className="mt-2 flex items-center gap-2">
                    <img src={formData.logo} alt="Preview" className="w-12 h-8 object-contain rounded bg-neutral-900 border border-neutral-700 p-1" />
                    <span className="text-[10px] font-mono text-neutral-500 truncate max-w-xs">{formData.logo}</span>
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
                    checked={formData.is_transparent}
                    onChange={(e) => setFormData({ ...formData, is_transparent: e.target.checked })}
                    className="rounded bg-[#181818] border-neutral-700 text-[#C7A46A]"
                  />
                  <span className="text-xs font-mono text-neutral-300">Transparent Background</span>
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
                  <span>{editingBrand ? 'Save Changes' : 'Add Brand'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
