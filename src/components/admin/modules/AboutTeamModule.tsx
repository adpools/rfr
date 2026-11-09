import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import { uploadMediaFile } from '../../../services/cmsService';
import { Plus, Edit3, Trash2, Eye, EyeOff, Save, X, Upload, UserCheck } from 'lucide-react';
import { InstagramIcon, LinkedinIcon } from '../../common/SocialIcons';

export interface TeamMember {
  id?: string;
  name: string;
  designation: string;
  department?: string;
  bio?: string;
  image: string;
  linkedin_url?: string;
  instagram_url?: string;
  sort_order: number;
  is_published: boolean;
}

interface AboutTeamModuleProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  isConfigured: boolean;
}

export const AboutTeamModule: React.FC<AboutTeamModuleProps> = ({ showToast }) => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [uploading, setUploading] = useState(false);

  // Founder Bio state
  const [founderName, setFounderName] = useState('Adv. Riyas');
  const [officialTitle, setOfficialTitle] = useState('Founder & Creative Director, RFR');
  const [visionQuote, setVisionQuote] = useState('Fashion is not merely what we wear; it is an architectural symphony of identity, passion and purpose.');
  const [savingBio, setSavingBio] = useState(false);

  const [formData, setFormData] = useState<TeamMember>({
    name: '',
    designation: 'Creative Director',
    department: 'Runway & Creative Direction',
    bio: '',
    image: '',
    linkedin_url: '',
    instagram_url: '',
    sort_order: 1,
    is_published: true,
  });

  const fetchData = async () => {
    setLoading(true);
    if (!isSupabaseConfigured) {
      setMembers([
        {
          id: '1',
          name: 'Adv. Riyas',
          designation: 'Founder & Managing Director',
          department: 'Executive Leadership',
          bio: 'Visionary architect behind RFR, serial luxury entrepreneur, and founder of TIC.',
          image: '/images/riyas.jpg',
          linkedin_url: 'https://linkedin.com',
          instagram_url: 'https://instagram.com/adv_riyas',
          sort_order: 1,
          is_published: true,
        },
      ]);
      setLoading(false);
      return;
    }

    try {
      // Fetch Founder Bio from about_riyas
      const { data: aboutData } = await supabase
        .from('about_riyas')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (aboutData) {
        if (aboutData.founder_name) setFounderName(aboutData.founder_name);
        if (aboutData.official_title) setOfficialTitle(aboutData.official_title);
        if (aboutData.quote) setVisionQuote(aboutData.quote);
      }

      // Fetch Team Members from team_members
      const { data: teamData, error: teamError } = await supabase
        .from('team_members')
        .select('*')
        .order('sort_order', { ascending: true });

      if (teamError) throw teamError;
      setMembers(teamData || []);
    } catch (err: any) {
      showToast(err.message || 'Failed to load team data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveBio = async () => {
    setSavingBio(true);
    if (!isSupabaseConfigured) {
      setTimeout(() => {
        setSavingBio(false);
        showToast('Founder narrative saved (preview)');
      }, 500);
      return;
    }

    try {
      const { data: existing } = await supabase
        .from('about_riyas')
        .select('id')
        .limit(1)
        .maybeSingle();

      const payload = {
        founder_name: founderName.trim(),
        official_title: officialTitle.trim(),
        quote: visionQuote.trim(),
        updated_at: new Date().toISOString(),
      };

      if (existing?.id) {
        const { error } = await supabase
          .from('about_riyas')
          .update(payload)
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('about_riyas')
          .insert([payload]);
        if (error) throw error;
      }
      showToast('Founder narrative updated');
    } catch (err: any) {
      showToast(err.message || 'Save bio failed', 'error');
    } finally {
      setSavingBio(false);
    }
  };

  const openCreateModal = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      designation: 'Production Lead',
      department: 'Show Operations',
      bio: '',
      image: '',
      linkedin_url: '',
      instagram_url: '',
      sort_order: members.length + 1,
      is_published: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (m: TeamMember) => {
    setEditingMember(m);
    setFormData({ ...m });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const res = await uploadMediaFile(file, 'team');
    setUploading(false);
    if (res.success && res.url) {
      setFormData((prev) => ({ ...prev, image: res.url || '' }));
      showToast('Team portrait uploaded');
    } else {
      showToast(res.error || 'Upload failed', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Member name is required', 'error');
      return;
    }

    const payload = {
      name: formData.name.trim(),
      designation: formData.designation.trim() || 'Team Member',
      department: formData.department ? formData.department.trim() : 'Executive Leadership',
      bio: formData.bio ? formData.bio.trim() : null,
      image: formData.image.trim() || '/images/riyas.jpg',
      linkedin_url: formData.linkedin_url ? formData.linkedin_url.trim() : null,
      instagram_url: formData.instagram_url ? formData.instagram_url.trim() : null,
      sort_order: Number(formData.sort_order) || 0,
      is_published: formData.is_published,
      updated_at: new Date().toISOString(),
    };

    try {
      if (editingMember?.id) {
        const { error } = await supabase
          .from('team_members')
          .update(payload)
          .eq('id', editingMember.id);

        if (error) throw error;
        showToast('Team member updated');
      } else {
        const { error } = await supabase
          .from('team_members')
          .insert([payload]);

        if (error) throw error;
        showToast('Team member added to directory');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Save failed', 'error');
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this team member?')) return;
    try {
      const { error } = await supabase.from('team_members').delete().eq('id', id);
      if (error) throw error;
      showToast('Member deleted');
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  const togglePublish = async (m: TeamMember) => {
    if (!m.id) return;
    const newState = !m.is_published;
    try {
      const { error } = await supabase
        .from('team_members')
        .update({ is_published: newState, updated_at: new Date().toISOString() })
        .eq('id', m.id);

      if (error) throw error;
      setMembers((prev) =>
        prev.map((item) => (item.id === m.id ? { ...item, is_published: newState } : item))
      );
      showToast(newState ? 'Member visible on /our-team' : 'Member hidden');
    } catch (err: any) {
      showToast(err.message || 'Update failed', 'error');
    }
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#C7A46A] uppercase tracking-wider mb-1">
            <UserCheck size={14} />
            <span>EXECUTIVE & CREATIVE LEADERSHIP</span>
          </div>
          <h1 className="text-2xl font-serif text-white uppercase tracking-wide">
            About Riyas & Core Team
          </h1>
          <p className="text-neutral-400 text-xs font-light">
            Manage the founder’s official narrative, visionary quote, and the executive team directory for the public website.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-xl bg-[#C7A46A] hover:bg-[#D4B678] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 self-start sm:self-auto transition-all shadow-lg shadow-[#C7A46A]/20"
        >
          <Plus size={16} />
          <span>Add Team Member</span>
        </button>
      </div>

      {/* Founder Narrative Card */}
      <div className="p-6 rounded-3xl bg-[#0D0D0D] border border-neutral-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono uppercase tracking-widest text-[#C7A46A]">
            Founder Official Narrative (about_riyas)
          </h2>
          <button
            onClick={handleSaveBio}
            disabled={savingBio}
            className="px-4 py-1.5 rounded-xl bg-[#C7A46A] hover:bg-[#D4B678] text-black font-mono font-bold text-xs uppercase flex items-center gap-1.5 disabled:opacity-50"
          >
            <Save size={13} />
            <span>{savingBio ? 'Saving...' : 'Update Narrative'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
              Founder Name
            </label>
            <input
              type="text"
              value={founderName}
              onChange={(e) => setFounderName(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-[#141414] border border-neutral-800 text-white text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
              Official Title
            </label>
            <input
              type="text"
              value={officialTitle}
              onChange={(e) => setOfficialTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-[#141414] border border-neutral-800 text-white text-xs font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
            Visionary Quote
          </label>
          <textarea
            rows={2}
            value={visionQuote}
            onChange={(e) => setVisionQuote(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-[#141414] border border-neutral-800 text-white text-xs font-mono"
          />
        </div>
      </div>

      {/* Team Members List */}
      <div>
        <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-4">
          Core Team Roster ({members.length})
        </h3>

        {loading ? (
          <div className="text-center py-16 text-neutral-500 font-mono text-xs">
            Loading team roster...
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-16 text-neutral-500 font-mono text-xs border border-dashed border-neutral-800 rounded-2xl">
            No team members added. Click &quot;Add Team Member&quot; to begin.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {members.map((m) => (
              <div
                key={m.id || m.name}
                className="p-5 rounded-2xl bg-[#0D0D0D] border border-neutral-850 hover:border-neutral-700 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#181818] overflow-hidden flex-shrink-0 border border-neutral-800">
                      {m.image ? (
                        <img src={m.image} alt={m.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-500">
                          <UserCheck size={18} />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-base font-serif text-white font-medium">{m.name}</h3>
                      <div className="text-[10px] font-mono text-[#C7A46A]">{m.designation}</div>
                      {m.department && <div className="text-[10px] font-mono text-neutral-500">{m.department}</div>}
                    </div>
                  </div>

                  {m.bio && <p className="text-neutral-400 line-clamp-2 text-xs font-light">{m.bio}</p>}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-neutral-850">
                  <button
                    onClick={() => togglePublish(m)}
                    className={`flex items-center gap-1 text-xs font-mono px-2.5 py-0.5 rounded ${
                      m.is_published
                        ? 'bg-emerald-950/40 text-emerald-300'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {m.is_published ? <Eye size={12} /> : <EyeOff size={12} />}
                    <span>{m.is_published ? 'Visible' : 'Hidden'}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(m)}
                      className="p-1.5 rounded-lg bg-[#181818] hover:bg-[#222] text-neutral-300 hover:text-white"
                    >
                      <Edit3 size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(m.id)}
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
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <h2 className="text-xl font-serif text-white uppercase">
                {editingMember ? 'Edit Team Member' : 'Add Team Member'}
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
                    Designation / Title
                  </label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={formData.department || ''}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                  Bio / Responsibilities
                </label>
                <textarea
                  rows={3}
                  value={formData.bio || ''}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                    LinkedIn Profile URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://linkedin.com/in/..."
                    value={formData.linkedin_url || ''}
                    onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                    Instagram Profile URL
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
                  Portrait Photo Upload
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
                {formData.image && (
                  <div className="mt-2 flex items-center gap-2">
                    <img src={formData.image} alt="Preview" className="w-10 h-10 object-cover rounded-full border border-neutral-700" />
                    <span className="text-[10px] font-mono text-neutral-500 truncate max-w-xs">{formData.image}</span>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="rounded bg-[#181818] border-neutral-700 text-[#C7A46A]"
                  />
                  <span className="text-xs font-mono text-neutral-300">Visible on /our-team</span>
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
                  <span>{editingMember ? 'Save Member' : 'Add Member'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
