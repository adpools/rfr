import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import { uploadMediaFile } from '../../../services/cmsService';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  Search, 
  Save, 
  X, 
  Upload, 
  BookOpen, 
  ExternalLink, 
  Star, 
  Calendar, 
  Clock, 
  Tag, 
  Quote as QuoteIcon, 
  AlignLeft,
  FileText,
  Maximize2
} from 'lucide-react';
import { useMediaViewer } from '../../../context/MediaViewerContext';

export interface BlogArticle {
  id?: string;
  slug: string;
  title: string;
  category: 'Press' | 'News' | 'Announcements' | 'Collaborations' | 'Achievements';
  date_label: string;
  author: string;
  read_time: string;
  cover_image: string;
  excerpt: string;
  content: string[];
  quote_text?: string;
  quote_author?: string;
  tags: string[];
  external_url?: string;
  is_featured_home: boolean;
  sort_order: number;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

interface BlogModuleProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  isConfigured: boolean;
}

export const BlogModule: React.FC<BlogModuleProps> = ({ showToast }) => {
  const { openImage } = useMediaViewer();
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<BlogArticle | null>(null);
  const [uploading, setUploading] = useState(false);

  // Form State
  const [formData, setFormData] = useState<BlogArticle>({
    slug: '',
    title: '',
    category: 'News',
    date_label: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    author: 'Editorial Desk',
    read_time: '4 min read',
    cover_image: '',
    excerpt: '',
    content: [''],
    quote_text: '',
    quote_author: 'Riyas, Founder — RFR',
    tags: ['Fashion', 'Ecosystem', 'Runway'],
    external_url: '',
    is_featured_home: false,
    sort_order: 1,
    is_published: true,
  });

  const [rawContentText, setRawContentText] = useState('');
  const [rawTagsText, setRawTagsText] = useState('');

  const fetchArticles = async () => {
    setLoading(true);
    if (!isSupabaseConfigured) {
      setArticles([
        {
          id: 'sample-1',
          slug: 'redefining-the-fashion-ecosystem-rfr-vision',
          title: 'Redefining the Fashion Runway: How RFR is Bridging Couture, Creators, and Commercial Media',
          category: 'Press',
          date_label: 'February 18, 2026',
          author: 'Editorial Desk',
          read_time: '5 min read',
          cover_image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80',
          excerpt: 'An inside look at Riyas Fashion Runway’s expansive model—transforming traditional fashion presentation into an all-encompassing creative ecosystem.',
          content: [
            'In an era where fashion is consumed through six-second vertical clips as much as front-row runways, the traditional boundaries of fashion presentation have dissolved.',
            'Founded by Riyas, RFR was structured to address a critical disconnect in the creative industry: the separation between high couture showcases, digital creator economies, and tangible brand commercial ROI.'
          ],
          quote_text: 'The runway is no longer just a physical ramp; it is the genesis point of a global cultural conversation.',
          quote_author: 'Riyas, Founder — RFR',
          tags: ['Fashion', 'Ecosystem', 'Runway', 'Brand Strategy'],
          is_featured_home: true,
          sort_order: 1,
          is_published: true,
        },
        {
          id: 'sample-2',
          slug: 'the-rise-of-experiential-retail-flea-markets',
          title: 'The Renaissance of Community Fleas and Curated Lifestyle Marketplaces',
          category: 'News',
          date_label: 'January 12, 2026',
          author: 'Culture & Lifestyle',
          read_time: '4 min read',
          cover_image: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=1200&q=80',
          excerpt: 'Exploring how RFR Flea Market formats are giving independent designers and lifestyle artisans direct access to high-value urban demographics.',
          content: [
            'While digital commerce continues to expand, urban consumers are seeking authentic, physical, community-driven shopping experiences.',
            'RFR’s experiential flea market format merges artisanal lifestyle retail with live acoustic music and culinary pop-ups.'
          ],
          quote_text: 'Community retail is an incubator for design sovereignty.',
          quote_author: 'RFR Editorial',
          tags: ['Experiential Retail', 'Flea Markets', 'Community'],
          is_featured_home: true,
          sort_order: 2,
          is_published: true,
        }
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
      showToast(`Fetch error: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const openCreateModal = () => {
    setEditingArticle(null);
    const initial: BlogArticle = {
      slug: '',
      title: '',
      category: 'News',
      date_label: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      author: 'Editorial Desk',
      read_time: '4 min read',
      cover_image: '',
      excerpt: '',
      content: [''],
      quote_text: '',
      quote_author: 'Riyas, Founder — RFR',
      tags: ['Fashion', 'Ecosystem'],
      external_url: '',
      is_featured_home: false,
      sort_order: articles.length + 1,
      is_published: true,
    };
    setFormData(initial);
    setRawContentText('');
    setRawTagsText('Fashion, Ecosystem');
    setIsModalOpen(true);
  };

  const openEditModal = (a: BlogArticle) => {
    setEditingArticle(a);
    setFormData({ ...a });
    setRawContentText((a.content || []).join('\n\n'));
    setRawTagsText((a.tags || []).join(', '));
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const res = await uploadMediaFile(file, 'blog');
    setUploading(false);
    if (res.success && res.url) {
      setFormData((prev) => ({ ...prev, cover_image: res.url || '' }));
      showToast('Article cover uploaded successfully');
    } else {
      showToast(res.error || 'Upload failed', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      showToast('Article title is required', 'error');
      return;
    }

    // Auto-generate clean slug if not specified
    const slug = formData.slug.trim() 
      ? formData.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      : formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Parse paragraphs from textarea
    const paragraphs = rawContentText
      .split('\n\n')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const tags = rawTagsText
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = {
      slug,
      title: formData.title.trim(),
      category: formData.category,
      date_label: formData.date_label.trim() || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      author: formData.author.trim() || 'Editorial Desk',
      read_time: formData.read_time.trim() || '4 min read',
      cover_image: formData.cover_image.trim() || 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80',
      excerpt: formData.excerpt.trim() || formData.title,
      content: paragraphs.length > 0 ? paragraphs : [formData.excerpt || formData.title],
      quote_text: formData.quote_text ? formData.quote_text.trim() : null,
      quote_author: formData.quote_author ? formData.quote_author.trim() : null,
      tags: tags.length > 0 ? tags : ['Fashion'],
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
        showToast('Blog article updated successfully');
      } else {
        const { error } = await supabase
          .from('press_articles')
          .insert([payload]);

        if (error) throw error;
        showToast('New blog article published');
      }
      setIsModalOpen(false);
      fetchArticles();
    } catch (err: any) {
      showToast(err.message || 'Save failed', 'error');
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this blog article? This action is permanent.')) return;
    try {
      const { error } = await supabase
        .from('press_articles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      showToast('Article deleted');
      fetchArticles();
    } catch (err: any) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  const togglePublish = async (a: BlogArticle) => {
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
      showToast(newState ? 'Article published' : 'Article unpublished (draft)');
    } catch (err: any) {
      showToast(err.message || 'Update failed', 'error');
    }
  };

  const filteredArticles = articles.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.tags || []).some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = categoryFilter === 'all' || a.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#C7A46A] uppercase tracking-wider mb-1">
            <BookOpen size={14} />
            <span>EDITORIAL DISPATCHES & JOURNAL</span>
          </div>
          <h1 className="text-2xl font-serif text-white uppercase tracking-wide">
            Blog & Article Management
          </h1>
          <p className="text-neutral-400 text-xs font-light">
            Create, edit, curate paragraphs, attach cover imagery, and publish articles to the public blog and journal archive.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-xl bg-[#C7A46A] hover:bg-[#D4B678] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 self-start sm:self-auto transition-all shadow-lg shadow-[#C7A46A]/20"
        >
          <Plus size={16} />
          <span>Write New Article</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            placeholder="Search articles by title, excerpt, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#111111] border border-neutral-800 text-white text-xs font-mono placeholder:text-neutral-600 focus:outline-none focus:border-[#C7A46A]"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-[#111111] border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#C7A46A]"
        >
          <option value="all">All Categories</option>
          <option value="News">News</option>
          <option value="Press">Press</option>
          <option value="Announcements">Announcements</option>
          <option value="Collaborations">Collaborations</option>
          <option value="Achievements">Achievements</option>
        </select>
      </div>

      {/* Article Grid / Roster */}
      {loading ? (
        <div className="py-24 text-center text-neutral-500 font-mono text-xs uppercase tracking-widest">
          Loading editorial archives...
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="py-20 text-center text-neutral-500 font-mono text-xs border border-dashed border-neutral-800 rounded-3xl p-8 space-y-3">
          <FileText size={32} className="mx-auto text-neutral-600" />
          <p>No articles found matching your criteria.</p>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 rounded-xl bg-[#181818] hover:bg-[#222] border border-neutral-700 text-[#C7A46A] text-xs font-mono uppercase"
          >
            Create Your First Article
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredArticles.map((article) => (
            <div
              key={article.id || article.slug}
              className="p-5 rounded-2xl bg-[#0D0D0D] border border-neutral-850 hover:border-neutral-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Cover Image & Category Pill */}
                <div 
                  onClick={article.cover_image ? () => openImage({
                    src: article.cover_image,
                    title: article.title,
                    subtitle: `${article.author} • ${article.date_label}`,
                    category: article.category,
                  }) : undefined}
                  className={`aspect-[16/9] rounded-xl bg-[#141414] overflow-hidden relative border border-neutral-800 ${
                    article.cover_image ? 'cursor-pointer group/blog' : ''
                  }`}
                  title={article.cover_image ? 'Click to view cover in high-resolution' : undefined}
                >
                  {article.cover_image ? (
                    <img
                      src={article.cover_image}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/blog:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-600">
                      <BookOpen size={24} />
                    </div>
                  )}

                  {article.cover_image && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/blog:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none z-10">
                      <div className="px-3.5 py-1.5 rounded-full bg-black/85 backdrop-blur-md border border-[#C7A46A]/60 text-[#C7A46A] text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5 shadow-xl transform scale-95 group-hover/blog:scale-100 transition-transform">
                        <Maximize2 size={11} />
                        <span>Expand</span>
                      </div>
                    </div>
                  )}

                  <div className="absolute top-3 left-3 flex items-center gap-2 z-10 pointer-events-none">
                    <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-neutral-700 text-[10px] font-mono text-[#C7A46A] uppercase tracking-wider">
                      {article.category}
                    </span>
                    {article.is_featured_home && (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-[9px] font-mono text-amber-300 uppercase tracking-widest flex items-center gap-1">
                        <Star size={10} />
                        Featured
                      </span>
                    )}
                  </div>
                </div>

                {/* Metadata Row */}
                <div className="flex items-center gap-3 text-[11px] font-mono text-neutral-400">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} className="text-[#C7A46A]" />
                    {article.date_label}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} className="text-neutral-500" />
                    {article.read_time}
                  </span>
                </div>

                {/* Title & Excerpt */}
                <h3 className="text-base font-serif text-white font-medium line-clamp-2 leading-snug">
                  {article.title}
                </h3>
                <p className="text-xs font-light text-neutral-400 line-clamp-2 leading-relaxed">
                  {article.excerpt}
                </p>

                {/* Tags */}
                {article.tags && article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {article.tags.slice(0, 4).map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-[#181818] border border-neutral-800 text-[10px] font-mono text-neutral-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-neutral-850">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => togglePublish(article)}
                    className={`flex items-center gap-1.5 text-xs font-mono px-3 py-1 rounded-lg ${
                      article.is_published
                        ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/40'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {article.is_published ? <Eye size={13} /> : <EyeOff size={13} />}
                    <span>{article.is_published ? 'Published' : 'Draft'}</span>
                  </button>

                  <a
                    href={`/press/${article.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-400 hover:text-white transition-colors p-1"
                    title="Preview Live Page"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(article)}
                    className="p-2 rounded-lg bg-[#181818] hover:bg-[#222] text-neutral-300 hover:text-white transition-colors"
                    title="Edit Article"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(article.id)}
                    className="p-2 rounded-lg bg-red-950/30 hover:bg-red-900/50 text-red-400 hover:text-red-200 transition-colors"
                    title="Delete Article"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-3xl w-full max-h-[92vh] overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <BookOpen size={18} className="text-[#C7A46A]" />
                <h2 className="text-xl font-serif text-white uppercase tracking-wide">
                  {editingArticle ? 'Edit Blog Article' : 'Draft New Blog Article'}
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-[#222] text-neutral-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Redefining the Fashion Runway: Inside RFR’s 2026 Vision"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#C7A46A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#C7A46A]"
                  >
                    <option value="News">News</option>
                    <option value="Press">Press</option>
                    <option value="Announcements">Announcements</option>
                    <option value="Collaborations">Collaborations</option>
                    <option value="Achievements">Achievements</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                    Date Label
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. February 18, 2026"
                    value={formData.date_label}
                    onChange={(e) => setFormData({ ...formData, date_label: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                    Read Time
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 5 min read"
                    value={formData.read_time}
                    onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                    Author Credit
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Editorial Desk / Culture & Style"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                    URL Slug (auto-generated if empty)
                  </label>
                  <input
                    type="text"
                    placeholder="redefining-the-fashion-ecosystem"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                  Lead Excerpt (Summary displayed in cards) *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="A concise luxury summary of the article..."
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                  Full Article Body (Separate paragraphs with double Enter / blank line) *
                </label>
                <textarea
                  rows={7}
                  placeholder="First paragraph of the story...&#10;&#10;Second paragraph elaborating on the runway, creators, and media ecosystem...&#10;&#10;Third closing paragraph..."
                  value={rawContentText}
                  onChange={(e) => setRawContentText(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                    Editorial Pull Quote (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. The runway is no longer just a physical ramp..."
                    value={formData.quote_text || ''}
                    onChange={(e) => setFormData({ ...formData, quote_text: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                    Quote Attribution
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Riyas, Founder — RFR"
                    value={formData.quote_author || ''}
                    onChange={(e) => setFormData({ ...formData, quote_author: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                    Tags (Comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Fashion, Runway, Creators, Strategy"
                    value={rawTagsText}
                    onChange={(e) => setRawTagsText(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                    External Reference Link (Optional)
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

              {/* Cover Image Upload */}
              <div className="p-4 rounded-xl bg-[#141414] border border-neutral-850 space-y-2">
                <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                  Cover Header Photo
                </label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="text-xs text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-mono file:bg-[#222] file:text-white hover:file:bg-[#333]"
                  />
                  {uploading && <span className="text-xs text-[#C7A46A] font-mono animate-pulse">Uploading image...</span>}
                </div>
                {formData.cover_image && (
                  <div className="flex items-center gap-2 pt-2">
                    <img 
                      src={formData.cover_image} 
                      alt="Preview" 
                      onClick={() => openImage({ src: formData.cover_image, title: formData.title || 'Article Cover Preview', category: formData.category })}
                      className="w-16 h-10 object-cover rounded border border-neutral-700 cursor-pointer hover:opacity-80 transition-opacity" 
                      title="Click to view full image in high-resolution"
                    />
                    <span className="text-[10px] font-mono text-neutral-500 truncate max-w-xs">{formData.cover_image}</span>
                  </div>
                )}
              </div>

              {/* Switches */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="rounded bg-[#181818] border-neutral-700 text-[#C7A46A]"
                  />
                  <span className="text-xs font-mono text-neutral-300">Publish Immediately to Website</span>
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

              {/* Submit Buttons */}
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
                  <span>{editingArticle ? 'Save Article Changes' : 'Publish Article'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

