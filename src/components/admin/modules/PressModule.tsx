import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import { uploadMediaFile } from '../../../services/cmsService';
import { Plus, Edit3, Trash2, Eye, EyeOff, Search, Save, X, Upload, Newspaper, ExternalLink, Star } from 'lucide-react';

export interface PressArticle {
  id?: string;
  slug: string;
  title: string;
  category: 'Press' | 'News' | 'Announcements' | 'Collaborations' | 'Achievements';
  date_label: string;
  author?: string;
  read_time?: string;
  cover_image: string;
  excerpt: string;
  external_url?: string;
  is_featured_home: boolean;
  sort_order: number;
  is_published: boolean;
}

interface PressModuleProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  isConfigured: boolean;
}

export const PressModule: React.FC<PressModuleProps> = ({ showToast }) => {
  const [articles, setArticles] = useState<PressArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<PressArticle | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState<PressArticle>({
    slug: '',
    title: '',
    category: 'Press',
    date_label: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    author: 'RFR Editorial Desk',
    read_time: '3 min read',
    cover_image: '',
    excerpt: '',
    external_url: '',
    is_featured_home: false,
    sort_order: 1,
    is_published: true,
  });

  const fetchArticles = async () => {
    setLoading(true);
    if (!isSupabaseConfigured) {
      setArticles([
        {
          id: '1',
          slug: 'success-kerala-feature',
          title: "പാഷനുണ്ടോ? വിജയം താനേ വരും! ഇത് 'സർട്ടിഫൈഡ്' ഉറപ്പ്...! • Do You Have Passion? Success Will Come",
          category: 'Press',
          date_label: 'November 6, 2026',
          author: 'Success Kerala News',
          read_time: '4 min read',
          cover_image: '/news%20and%20press/WhatsApp%20Image%202026-11-06%20at%2010.53.08%20AM%20(1).jpeg',
          excerpt: 'In-depth exclusive cover feature on Riyas Abdul Rahim, creative journey, and RFR Runway ecosystem.',
          external_url: 'https://successkerala.com/do-you-have-passion-success-will-come-this-is-a-certified-guarantee/',
          is_featured_home: true,
          sort_order: 1,
          is_published: true,
        },
        {
          id: '2',
          slug: 'asianet-news-nightlife-runway',
          title: 'Asianet News Statewide Prime Bulletin: High-Fashion Runway Culture',
          category: 'News',
          date_label: 'November 4, 2026',
          author: 'Asianet News Desk',
          read_time: '3 min read',
          cover_image: '/news%20and%20press/WhatsApp%20Image%202026-11-04%20at%209.41.04%20PM.jpeg',
          excerpt: 'Statewide broadcast spotlighting RFR fashion events and youth creative leadership.',
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
        .from('press_articles')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setArticles(data || []);
    } catch (err: any) {
      showToast(err.message || 'Failed to load press clippings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const openCreateModal = () => {
    setEditingArticle(null);
    setFormData({
      slug: '',
      title: '',
      category: 'Press',
      date_label: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      author: 'RFR Editorial',
      read_time: '3 min read',
      cover_image: '',
      excerpt: '',
      external_url: '',
      is_featured_home: false,
      sort_order: articles.length + 1,
      is_published: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (a: PressArticle) => {
    setEditingArticle(a);
    setFormData({ ...a });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const res = await uploadMediaFile(file, 'press');
    setUploading(false);
    if (res.success && res.url) {
      setFormData((prev) => ({ ...prev, cover_image: res.url || '' }));
      showToast('Press clipping uploaded');
    } else {
      showToast(res.error || 'Upload failed', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Article title is required', 'error');
      return;
    }

    const slug = formData.slug.trim()
      ? formData.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      : formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const payload = {
      slug,
      title: formData.title.trim(),
      category: formData.category,
      date_label: formData.date_label.trim() || new Date().toLocaleDateString(),
      author: formData.author ? formData.author.trim() : 'Editorial Desk',
      read_time: formData.read_time ? formData.read_time.trim() : '3 min read',
      cover_image: formData.cover_image.trim() || '/news%20and%20press/WhatsApp%20Image%202026-11-04%20at%209.41.04%20PM.jpeg',
      excerpt: formData.excerpt.trim() || formData.title,
      external_url: formData.external_url ? formData.external_url.trim() : null,
      is_featured_home: formData.is_featured_home,
      sort_order: Number(formData.sort_order) || 0,
      is_published: formData.is_published,
      updated_at: new Date().toISOString(),
    };

    try {
      if (editingArticle?.id) {
        const { error } = await supabase
          .from('press_articles')
          .update(payload)
          .eq('id', editingArticle.id);

        if (error) throw error;
        showToast('Press clipping updated');
      } else {
        const { error } = await supabase
          .from('press_articles')
          .insert([payload]);

        if (error) throw error;
        showToast('Press clipping added to archive');
      }
      setIsModalOpen(false);
      fetchArticles();
    } catch (err: any) {
      showToast(err.message || 'Save failed', 'error');
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this press clipping?')) return;
    try {
      const { error } = await supabase.from('press_articles').delete().eq('id', id);
      if (error) throw error;
      showToast('Article deleted');
      fetchArticles();
    } catch (err: any) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  const togglePublish = async (a: PressArticle) => {
    if (!a.id) return;
    const newState = !a.is_published;
    try {
      const { error } = await supabase
        .from('press_articles')
        .update({ is_published: newState, updated_at: new Date().toISOString() })
        .eq('id', a.id);

      if (error) throw error;
      setArticles((prev) =>
        prev.map((item) => (item.id === a.id ? { ...item, is_published: newState } : item))
      );
      showToast(newState ? 'Clipping live' : 'Clipping hidden');
    } catch (err: any) {
      showToast(err.message || 'Update failed', 'error');
    }
  };

  const filteredArticles = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#C7A46A] uppercase tracking-wider mb-1">
            <Newspaper size={14} />
            <span>MEDIA COVERAGE & CLIPPINGS</span>
          </div>
          <h1 className="text-2xl font-serif text-white uppercase tracking-wide">
            News & Press Clippings
          </h1>
          <p className="text-neutral-400 text-xs font-light">
            Manage authentic print mastheads, TV broadcast features, and media publications.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-xl bg-[#C7A46A] hover:bg-[#D4B678] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 self-start sm:self-auto transition-all shadow-lg shadow-[#C7A46A]/20"
        >
          <Plus size={16} />
          <span>Add Press Clipping</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
        <input
          type="text"
          placeholder="Search press clippings by title or publication..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#111111] border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#C7A46A]"
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-24 text-center text-neutral-500 font-mono text-xs uppercase tracking-widest">
          Loading press coverage...
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="py-16 text-center text-neutral-500 font-mono text-xs border border-dashed border-neutral-800 rounded-2xl">
          No press clippings found. Click &quot;Add Press Clipping&quot; to begin.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredArticles.map((a) => (
            <div
              key={a.id || a.slug}
              className="p-5 rounded-2xl bg-[#0D0D0D] border border-neutral-850 hover:border-neutral-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="aspect-[16/10] rounded-xl bg-[#141414] overflow-hidden relative border border-neutral-800">
                  {a.cover_image ? (
                    <img src={a.cover_image} alt={a.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-600">
                      <Newspaper size={24} />
                    </div>
                  )}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-neutral-700 text-[10px] font-mono text-[#C7A46A] uppercase">
                      {a.category}
                    </span>
                    {a.is_featured_home && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-mono uppercase flex items-center gap-1">
                        <Star size={9} />
                        Featured
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-mono text-neutral-400">{a.author} • {a.date_label}</div>
                  <h3 className="text-base font-serif text-white font-medium line-clamp-2 mt-1">{a.title}</h3>
                  {a.excerpt && <p className="text-neutral-400 text-xs font-light line-clamp-2 mt-1">{a.excerpt}</p>}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-neutral-850">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => togglePublish(a)}
                    className={`flex items-center gap-1 text-xs font-mono px-2.5 py-1 rounded ${
                      a.is_published
                        ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/40'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {a.is_published ? <Eye size={12} /> : <EyeOff size={12} />}
                    <span>{a.is_published ? 'Live' : 'Draft'}</span>
                  </button>

                  {a.external_url && (
                    <a
                      href={a.external_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 rounded text-neutral-400 hover:text-white"
                      title="Read Article Source"
                    >
                      <ExternalLink size={13} />
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(a)}
                    className="p-1.5 rounded-lg bg-[#181818] hover:bg-[#222] text-neutral-300 hover:text-white"
                  >
                    <Edit3 size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(a.id)}
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
                {editingArticle ? 'Edit Press Clipping' : 'Add Press Clipping'}
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
                  Headline Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#C7A46A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                    Publication / Channel
                  </label>
                  <input
                    type="text"
                    value={formData.author || ''}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                    Coverage Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                  >
                    <option value="Press">Press</option>
                    <option value="News">News</option>
                    <option value="Announcements">Announcements</option>
                    <option value="Collaborations">Collaborations</option>
                    <option value="Achievements">Achievements</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                    Coverage Date
                  </label>
                  <input
                    type="text"
                    value={formData.date_label}
                    onChange={(e) => setFormData({ ...formData, date_label: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                    External Article URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={formData.external_url || ''}
                    onChange={(e) => setFormData({ ...formData, external_url: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                  Excerpt / Summary
                </label>
                <textarea
                  rows={2}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                  Clipping / Masthead Image Upload
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
                {formData.cover_image && (
                  <div className="mt-2 flex items-center gap-2">
                    <img src={formData.cover_image} alt="Preview" className="w-16 h-10 object-cover rounded border border-neutral-700" />
                    <span className="text-[10px] font-mono text-neutral-500 truncate max-w-xs">{formData.cover_image}</span>
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
                  <span className="text-xs font-mono text-neutral-300">Published to public press</span>
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
                  <span>{editingArticle ? 'Save Clipping' : 'Add Clipping'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
