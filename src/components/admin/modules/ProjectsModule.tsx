import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import { uploadMediaFile } from '../../../services/cmsService';
import { Plus, Edit3, Trash2, Eye, EyeOff, Search, Save, X, Upload, FolderKanban, Star, Maximize2, Play } from 'lucide-react';
import { useMediaViewer } from '../../../context/MediaViewerContext';

export interface ProjectItem {
  id?: string;
  slug: string;
  title: string;
  client?: string;
  category: 'Runway' | 'Gala' | 'Campaign' | 'Shoot' | 'Digital' | 'Commercial';
  year: number;
  cover_image: string;
  accent_color?: string;
  excerpt?: string;
  description?: string;
  deliverables?: string[];
  tags?: string[];
  video_url?: string;
  is_featured_home: boolean;
  sort_order: number;
  is_published: boolean;
}

interface ProjectsModuleProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  isConfigured: boolean;
}

export const ProjectsModule: React.FC<ProjectsModuleProps> = ({ showToast }) => {
  const { openImage, openVideo } = useMediaViewer();
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState<ProjectItem>({
    slug: '',
    title: '',
    client: '',
    category: 'Commercial',
    year: 2026,
    cover_image: '',
    accent_color: '#C7A46A',
    excerpt: '',
    description: '',
    deliverables: ['Creative Direction', 'Runway Choreography'],
    tags: ['Automotive', 'Launch'],
    video_url: '',
    is_featured_home: false,
    sort_order: 1,
    is_published: true,
  });

  const [rawDeliverables, setRawDeliverables] = useState('Creative Direction, Runway Choreography');

  const fetchProjects = async () => {
    setLoading(true);
    if (!isSupabaseConfigured) {
      setProjects([
        {
          id: '1',
          slug: 'citroen-ev-launch',
          title: 'Citroën Luxury EV Launch',
          client: 'Citroën Kerala',
          category: 'Commercial',
          year: 2024,
          cover_image: '/images/clients/citroen.png',
          accent_color: '#C7A46A',
          excerpt: 'Statewide luxury EV unveil featuring prominent lifestyle creators and high-octane visual productions.',
          description: 'A 360-degree commercial campaign with creator activations and cinema-grade commercial reels.',
          deliverables: ['Event Curation', 'Creator Casting', 'Commercial Video'],
          is_featured_home: true,
          sort_order: 1,
          is_published: true,
        },
        {
          id: '2',
          slug: 'fans-of-skoda-rally',
          title: 'Fans of Škoda Official Owner Rally',
          client: 'Škoda Auto India',
          category: 'Campaign',
          year: 2024,
          cover_image: '/images/clients/skoda.png',
          accent_color: '#4BA82E',
          excerpt: 'Flagship owner expedition across South India with bespoke automotive storytelling.',
          description: 'Directing on-road visual chronicles and VIP customer engagement experiences.',
          deliverables: ['Expedition Direction', 'Cinematic Documentaries'],
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
        .from('projects_portfolio')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setProjects(data || []);
    } catch (err: any) {
      showToast(err.message || 'Failed to load projects', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openCreateModal = () => {
    setEditingProject(null);
    setFormData({
      slug: '',
      title: '',
      client: '',
      category: 'Commercial',
      year: 2026,
      cover_image: '',
      accent_color: '#C7A46A',
      excerpt: '',
      description: '',
      deliverables: ['Creative Direction'],
      tags: ['Fashion'],
      video_url: '',
      is_featured_home: false,
      sort_order: projects.length + 1,
      is_published: true,
    });
    setRawDeliverables('Creative Direction, Runway Choreography');
    setIsModalOpen(true);
  };

  const openEditModal = (p: ProjectItem) => {
    setEditingProject(p);
    setFormData({ ...p });
    setRawDeliverables((p.deliverables || []).join(', '));
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const res = await uploadMediaFile(file, 'projects');
    setUploading(false);
    if (res.success && res.url) {
      setFormData((prev) => ({ ...prev, cover_image: res.url || '' }));
      showToast('Project cover photo uploaded');
    } else {
      showToast(res.error || 'Upload failed', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Project title is required', 'error');
      return;
    }

    const slug = formData.slug.trim()
      ? formData.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      : formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const deliverables = rawDeliverables
      .split(',')
      .map((d) => d.trim())
      .filter((d) => d.length > 0);

    const payload = {
      slug,
      title: formData.title.trim(),
      client: formData.client ? formData.client.trim() : null,
      category: formData.category,
      year: Number(formData.year) || 2026,
      cover_image: formData.cover_image.trim() || '/images/clients/citroen.png',
      accent_color: formData.accent_color || '#C7A46A',
      excerpt: formData.excerpt ? formData.excerpt.trim() : formData.title,
      description: formData.description ? formData.description.trim() : null,
      deliverables: deliverables.length > 0 ? deliverables : ['Creative Direction'],
      video_url: formData.video_url ? formData.video_url.trim() : null,
      is_featured_home: formData.is_featured_home,
      sort_order: Number(formData.sort_order) || 0,
      is_published: formData.is_published,
      updated_at: new Date().toISOString(),
    };

    try {
      if (editingProject?.id) {
        const { error } = await supabase
          .from('projects_portfolio')
          .update(payload)
          .eq('id', editingProject.id);

        if (error) throw error;
        showToast('Project updated successfully');
      } else {
        const { error } = await supabase
          .from('projects_portfolio')
          .insert([payload]);

        if (error) throw error;
        showToast('Project added to portfolio');
      }
      setIsModalOpen(false);
      fetchProjects();
    } catch (err: any) {
      showToast(err.message || 'Save failed', 'error');
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this portfolio project?')) return;
    try {
      const { error } = await supabase.from('projects_portfolio').delete().eq('id', id);
      if (error) throw error;
      showToast('Project deleted');
      fetchProjects();
    } catch (err: any) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  const togglePublish = async (p: ProjectItem) => {
    if (!p.id) return;
    const newState = !p.is_published;
    try {
      const { error } = await supabase
        .from('projects_portfolio')
        .update({ is_published: newState, updated_at: new Date().toISOString() })
        .eq('id', p.id);

      if (error) throw error;
      setProjects((prev) =>
        prev.map((item) => (item.id === p.id ? { ...item, is_published: newState } : item))
      );
      showToast(newState ? 'Project live' : 'Project hidden');
    } catch (err: any) {
      showToast(err.message || 'Update failed', 'error');
    }
  };

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.client && p.client.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#C7A46A] uppercase tracking-wider mb-1">
            <FolderKanban size={14} />
            <span>PORTFOLIO & CAMPAIGNS</span>
          </div>
          <h1 className="text-2xl font-serif text-white uppercase tracking-wide">
            Projects & Showcase Portfolio
          </h1>
          <p className="text-neutral-400 text-xs font-light">
            Manage commercial advertising campaigns, automotive unboxings, gala presentations, and fashion lookbooks.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-xl bg-[#C7A46A] hover:bg-[#D4B678] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 self-start sm:self-auto transition-all shadow-lg shadow-[#C7A46A]/20"
        >
          <Plus size={16} />
          <span>Add Project</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
        <input
          type="text"
          placeholder="Search portfolio by project title or client name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#111111] border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#C7A46A]"
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-24 text-center text-neutral-500 font-mono text-xs uppercase tracking-widest">
          Loading portfolio...
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="py-16 text-center text-neutral-500 font-mono text-xs border border-dashed border-neutral-800 rounded-2xl">
          No projects found. Click &quot;Add Project&quot; to begin.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProjects.map((p) => (
            <div
              key={p.id || p.slug}
              className="p-5 rounded-2xl bg-[#0D0D0D] border border-neutral-850 hover:border-neutral-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div 
                  onClick={() => {
                    if (p.video_url) {
                      openVideo({
                        src: p.video_url,
                        title: p.title,
                        subtitle: `${p.client || ''} (${p.year})`,
                        badge: p.category.toUpperCase(),
                      });
                    } else if (p.cover_image) {
                      openImage({
                        src: p.cover_image,
                        title: p.title,
                        subtitle: `${p.client || ''} (${p.year})`,
                        category: p.category.toUpperCase(),
                        year: String(p.year),
                      });
                    }
                  }}
                  className={`aspect-[16/10] rounded-xl bg-[#141414] overflow-hidden relative border border-neutral-800 ${
                    p.video_url || p.cover_image ? 'cursor-pointer group/project' : ''
                  }`}
                  title={p.video_url ? 'Play video showcase' : p.cover_image ? 'View image in high-resolution' : undefined}
                >
                  {p.cover_image ? (
                    <img src={p.cover_image} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 group-hover/project:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-500">
                      <FolderKanban size={24} />
                    </div>
                  )}

                  {/* Universal Media Trigger on Hover */}
                  {(p.video_url || p.cover_image) && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/project:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none z-10">
                      <div className="px-3.5 py-1.5 rounded-full bg-black/85 backdrop-blur-md border border-[#C7A46A]/60 text-[#C7A46A] text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5 shadow-xl transform scale-95 group-hover/project:scale-100 transition-transform">
                        {p.video_url ? (
                          <>
                            <Play size={10} className="fill-[#C7A46A]" />
                            <span>Play Reel</span>
                          </>
                        ) : (
                          <>
                            <Maximize2 size={11} />
                            <span>Expand</span>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="absolute top-3 left-3 flex items-center gap-2 z-10 pointer-events-none">
                    <span className="px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-neutral-700 text-[10px] font-mono text-[#C7A46A] uppercase">
                      {p.category}
                    </span>
                    {p.is_featured_home && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-mono uppercase flex items-center gap-1">
                        <Star size={9} />
                        Featured
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-mono text-neutral-400">{p.client} • {p.year}</div>
                  <h3 className="text-base font-serif text-white font-medium line-clamp-1">{p.title}</h3>
                  {p.excerpt && <p className="text-neutral-400 text-xs font-light line-clamp-2 mt-1">{p.excerpt}</p>}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-neutral-850">
                <button
                  onClick={() => togglePublish(p)}
                  className={`flex items-center gap-1 text-xs font-mono px-2.5 py-1 rounded ${
                    p.is_published
                      ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/40'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {p.is_published ? <Eye size={12} /> : <EyeOff size={12} />}
                  <span>{p.is_published ? 'Live' : 'Draft'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(p)}
                    className="p-1.5 rounded-lg bg-[#181818] hover:bg-[#222] text-neutral-300 hover:text-white"
                  >
                    <Edit3 size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
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
                {editingProject ? 'Edit Project' : 'Create New Portfolio Project'}
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
                  Project Title *
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
                    Client Name
                  </label>
                  <input
                    type="text"
                    value={formData.client || ''}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                  >
                    <option value="Runway">Runway</option>
                    <option value="Gala">Gala</option>
                    <option value="Campaign">Campaign</option>
                    <option value="Shoot">Shoot</option>
                    <option value="Digital">Digital</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                    Year
                  </label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || 2026 })}
                    className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                    URL Slug (auto-generated if empty)
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                  Deliverables (Comma-separated)
                </label>
                <input
                  type="text"
                  value={rawDeliverables}
                  onChange={(e) => setRawDeliverables(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                  Summary / Excerpt
                </label>
                <textarea
                  rows={2}
                  value={formData.excerpt || ''}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                  Cover Photo Upload
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
                    <img 
                      src={formData.cover_image} 
                      alt="Preview" 
                      onClick={() => openImage({ src: formData.cover_image, title: formData.title || 'Project Cover Image', category: formData.category })}
                      className="w-16 h-10 object-cover rounded border border-neutral-700 cursor-pointer hover:opacity-80 transition-opacity" 
                      title="Click to view full image in high-resolution"
                    />
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
                  <span className="text-xs font-mono text-neutral-300">Published</span>
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
                  <span>{editingProject ? 'Save Changes' : 'Create Project'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
