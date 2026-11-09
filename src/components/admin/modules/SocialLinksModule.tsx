import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import { Plus, Edit3, Trash2, Eye, EyeOff, Save, X, Globe, ExternalLink } from 'lucide-react';

interface SocialLink {
  id?: string;
  platform: string;
  url: string;
  handle?: string;
  sort_order: number;
  is_visible: boolean;
}

interface SocialLinksModuleProps {
  showToast: (msg: string, type?: 'success' | 'error') => void;
  isConfigured: boolean;
}

export const SocialLinksModule: React.FC<SocialLinksModuleProps> = ({ showToast }) => {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);

  const [formData, setFormData] = useState<SocialLink>({
    platform: 'Instagram',
    url: 'https://instagram.com/rfr_by_riyas',
    handle: '@rfr_by_riyas',
    sort_order: 1,
    is_visible: true,
  });

  const fetchLinks = async () => {
    setLoading(true);
    if (!isSupabaseConfigured) {
      setLinks([
        { id: '1', platform: 'Instagram', url: 'https://instagram.com/rfr_by_riyas', handle: '@rfr_by_riyas', is_visible: true, sort_order: 1 },
        { id: '2', platform: 'YouTube', url: 'https://youtube.com/@rfrbyriyas', handle: 'RFR Official', is_visible: true, sort_order: 2 },
        { id: '3', platform: 'WhatsApp', url: 'https://wa.me/917736533346', handle: '+91 77365 33346', is_visible: true, sort_order: 3 },
      ]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('social_links')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setLinks(data || []);
    } catch (err: any) {
      showToast(err.message || 'Failed to load social links', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const openCreateModal = () => {
    setEditingLink(null);
    setFormData({
      platform: 'Instagram',
      url: '',
      handle: '',
      sort_order: links.length + 1,
      is_visible: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (link: SocialLink) => {
    setEditingLink(link);
    setFormData({ ...link });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.platform || !formData.url) {
      showToast('Platform name and URL are required', 'error');
      return;
    }

    const payload = {
      platform: formData.platform.trim(),
      url: formData.url.trim(),
      handle: formData.handle?.trim() || null,
      sort_order: Number(formData.sort_order) || 0,
      is_visible: formData.is_visible,
      updated_at: new Date().toISOString(),
    };

    try {
      if (editingLink?.id) {
        const { error } = await supabase
          .from('social_links')
          .update(payload)
          .eq('id', editingLink.id);

        if (error) throw error;
        showToast('Social channel updated');
      } else {
        const { error } = await supabase.from('social_links').insert([payload]);
        if (error) throw error;
        showToast('Social channel created');
      }
      setIsModalOpen(false);
      fetchLinks();
    } catch (err: any) {
      showToast(err.message || 'Save failed', 'error');
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this social link?')) return;
    try {
      const { error } = await supabase.from('social_links').delete().eq('id', id);
      if (error) throw error;
      showToast('Social channel deleted');
      fetchLinks();
    } catch (err: any) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  const toggleActive = async (link: SocialLink) => {
    if (!link.id) return;
    try {
      const { error } = await supabase
        .from('social_links')
        .update({ is_visible: !link.is_visible, updated_at: new Date().toISOString() })
        .eq('id', link.id);
      if (error) throw error;
      showToast(`Channel ${!link.is_visible ? 'enabled' : 'disabled'}`);
      fetchLinks();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl font-serif text-white uppercase tracking-wide">
            Social Media Channels
          </h1>
          <p className="text-xs text-neutral-400 font-light mt-1">
            Manage links, social handles, and channels displayed across site navigation and footer.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-xl bg-[#C7A46A] hover:bg-[#D4B678] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2"
        >
          <Plus size={15} />
          <span>Add Channel</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-neutral-500 font-mono text-xs">
          Loading social channels...
        </div>
      ) : links.length === 0 ? (
        <div className="text-center py-16 text-neutral-500 font-mono text-xs border border-dashed border-neutral-800 rounded-2xl">
          No social links found. Click &quot;Add Channel&quot; to begin.
        </div>
      ) : (
        <div className="space-y-3">
          {links.map((link) => (
            <div
              key={link.id}
              className="p-4 rounded-2xl bg-[#0D0D0D] border border-neutral-850 hover:border-neutral-700 transition-all flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#141414] border border-neutral-800 text-[#C7A46A]">
                  <Globe size={16} />
                </div>
                <div>
                  <div className="text-xs font-mono text-white font-medium">{link.platform}</div>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-mono text-neutral-400 hover:text-[#C7A46A] transition-colors flex items-center gap-1"
                  >
                    <span>{link.handle || link.url}</span>
                    <ExternalLink size={10} />
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleActive(link)}
                  className={`flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 rounded-lg ${
                    link.is_visible
                      ? 'bg-emerald-950/40 text-emerald-300'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {link.is_visible ? <Eye size={12} /> : <EyeOff size={12} />}
                  <span>{link.is_visible ? 'Visible' : 'Hidden'}</span>
                </button>

                <button
                  onClick={() => openEditModal(link)}
                  className="p-1.5 rounded-lg bg-[#181818] hover:bg-[#222] text-neutral-300 hover:text-white"
                >
                  <Edit3 size={13} />
                </button>
                <button
                  onClick={() => handleDelete(link.id)}
                  className="p-1.5 rounded-lg bg-red-950/30 hover:bg-red-900/50 text-red-400 hover:text-red-200"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <h2 className="text-xl font-serif text-white uppercase">
                {editingLink ? 'Edit Social Channel' : 'Add Social Channel'}
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
                  Platform Name (e.g. Instagram, YouTube) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Instagram, YouTube, LinkedIn"
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                  Full Profile URL *
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://..."
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                  Display Handle / Descriptor
                </label>
                <input
                  type="text"
                  placeholder="@handle or channel title"
                  value={formData.handle || ''}
                  onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={formData.sort_order || 0}
                  onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                />
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
                  <span>{editingLink ? 'Save Channel' : 'Add Channel'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
