import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured, AdminRole } from '../../../lib/supabase';
import { Shield, Plus, Edit3, Trash2, CheckCircle2, XCircle, Search, Save, X, UserCheck, AlertTriangle } from 'lucide-react';

interface AdminUser {
  id: string;
  email: string;
  full_name?: string | null;
  role: AdminRole;
  is_active: boolean;
  last_login_at?: string | null;
  created_at: string;
}

interface AdminRbacModuleProps {
  showToast: (msg: string, type?: 'success' | 'error') => void;
  isConfigured: boolean;
  isSuperAdmin: boolean;
}

export const AdminRbacModule: React.FC<AdminRbacModuleProps> = ({
  showToast,
  isSuperAdmin,
}) => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);

  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    role: 'editor' as AdminRole,
  });

  const fetchAdmins = async () => {
    setLoading(true);
    if (!isSupabaseConfigured) {
      setAdmins([
        {
          id: '1',
          email: 'riyas@rfrriyas.com',
          full_name: 'Riyas (Founder)',
          role: 'super_admin',
          is_active: true,
          last_login_at: new Date().toISOString(),
          created_at: '2024-01-01',
        },
        {
          id: '2',
          email: 'editorial@rfrriyas.com',
          full_name: 'Content Lead',
          role: 'editor',
          is_active: true,
          last_login_at: new Date(Date.now() - 86400000).toISOString(),
          created_at: '2024-06-15',
        },
      ]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setAdmins(data || []);
    } catch (err: any) {
      showToast(err.message || 'Failed to load admin profiles', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const openCreateModal = () => {
    setEditingAdmin(null);
    setFormData({
      email: '',
      full_name: '',
      role: 'editor',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (a: AdminUser) => {
    setEditingAdmin(a);
    setFormData({
      email: a.email,
      full_name: a.full_name || '',
      role: a.role,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) {
      showToast('Email is required', 'error');
      return;
    }

    try {
      if (editingAdmin?.id) {
        const { error } = await supabase
          .from('admin_users')
          .update({
            full_name: formData.full_name,
            role: formData.role,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingAdmin.id);

        if (error) throw error;
        showToast('Admin role updated');
      } else {
        const { error } = await supabase.from('admin_users').insert([{
          email: formData.email.trim().toLowerCase(),
          full_name: formData.full_name.trim(),
          role: formData.role,
          is_active: true,
        }]);

        if (error) throw error;
        showToast('Admin user registered');
      }
      setIsModalOpen(false);
      fetchAdmins();
    } catch (err: any) {
      showToast(err.message || 'Operation failed', 'error');
    }
  };

  const toggleActive = async (admin: AdminUser) => {
    if (admin.role === 'super_admin' && admin.is_active) {
      const activeSuperAdmins = admins.filter((a) => a.role === 'super_admin' && a.is_active);
      if (activeSuperAdmins.length <= 1) {
        showToast('Cannot deactivate the last active super_admin', 'error');
        return;
      }
    }

    try {
      const { error } = await supabase
        .from('admin_users')
        .update({ is_active: !admin.is_active, updated_at: new Date().toISOString() })
        .eq('id', admin.id);

      if (error) throw error;
      showToast(`User ${!admin.is_active ? 'activated' : 'suspended'}`);
      fetchAdmins();
    } catch (err: any) {
      showToast(err.message || 'Failed to toggle status', 'error');
    }
  };

  const handleDelete = async (admin: AdminUser) => {
    if (admin.role === 'super_admin') {
      const superAdmins = admins.filter((a) => a.role === 'super_admin');
      if (superAdmins.length <= 1) {
        showToast('Cannot delete the sole super_admin account', 'error');
        return;
      }
    }

    if (!confirm(`Are you sure you want to remove admin access for ${admin.email}?`)) return;

    try {
      const { error } = await supabase.from('admin_users').delete().eq('id', admin.id);
      if (error) throw error;
      showToast('Admin profile deleted');
      fetchAdmins();
    } catch (err: any) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="p-8 rounded-3xl bg-[#0D0D0D] border border-neutral-800 text-center space-y-3">
        <Shield size={32} className="text-[#C7A46A] mx-auto" />
        <h3 className="text-lg font-serif text-white uppercase">Super Admin Access Required</h3>
        <p className="text-xs text-neutral-400 max-w-md mx-auto">
          Role-Based Access Control and staff permissions can only be managed by authenticated Super Administrators.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl font-serif text-white uppercase tracking-wide">
            Admin RBAC & Staff Governance
          </h1>
          <p className="text-xs text-neutral-400 font-light mt-1">
            Authorize administrative staff profiles, grant editorial permissions, and enforce Super Admin access.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-xl bg-[#C7A46A] hover:bg-[#D4B678] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2"
        >
          <Plus size={15} />
          <span>Add Staff Admin</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-neutral-500 font-mono text-xs">
          Loading admin profiles...
        </div>
      ) : (
        <div className="space-y-3">
          {admins.map((a) => (
            <div
              key={a.id}
              className="p-5 rounded-2xl bg-[#0D0D0D] border border-neutral-850 hover:border-neutral-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${a.role === 'super_admin' ? 'bg-[#C7A46A]/20 text-[#C7A46A] border border-[#C7A46A]/30' : 'bg-neutral-800 text-neutral-300'}`}>
                  <Shield size={16} />
                </div>
                <div>
                  <div className="text-white font-medium flex items-center gap-2">
                    <span>{a.full_name || a.email}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                      a.role === 'super_admin' ? 'bg-amber-950/60 text-amber-300 border border-amber-800/40' : 'bg-neutral-800 text-neutral-300'
                    }`}>
                      {a.role}
                    </span>
                  </div>
                  <div className="text-neutral-500 text-[11px] mt-0.5">{a.email}</div>
                  {a.last_login_at && (
                    <div className="text-[10px] text-neutral-600 mt-0.5">
                      Last Login: {new Date(a.last_login_at).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={() => toggleActive(a)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg ${
                    a.is_active
                      ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/40'
                      : 'bg-red-950/40 text-red-400 border border-red-800/40'
                  }`}
                >
                  {a.is_active ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                  <span>{a.is_active ? 'Active' : 'Suspended'}</span>
                </button>

                <button
                  onClick={() => openEditModal(a)}
                  className="p-1.5 rounded-lg bg-[#181818] hover:bg-[#222] text-neutral-300 hover:text-white"
                >
                  <Edit3 size={13} />
                </button>
                <button
                  onClick={() => handleDelete(a)}
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
                {editingAdmin ? 'Edit Admin Permissions' : 'Register Staff Admin'}
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
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Riyas or Senior Editor"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  disabled={Boolean(editingAdmin)}
                  placeholder="staff@rfrriyas.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                  Role Authorization *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as AdminRole })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
                >
                  <option value="editor">Editor (Manage content & media)</option>
                  <option value="super_admin">Super Admin (Full RBAC, Inquiries & Settings)</option>
                </select>
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
                  <span>{editingAdmin ? 'Update Role' : 'Register Admin'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

