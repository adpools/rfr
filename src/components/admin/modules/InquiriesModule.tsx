import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import { ContactInquiry, getContactInquiries, updateContactInquiryStatus } from '../../../services/cmsService';
import { Mail, Search, CheckCircle2, Clock, Archive, Trash2, Eye, X, Phone, Building2, Calendar, FileText } from 'lucide-react';

interface InquiriesModuleProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  isConfigured: boolean;
  isSuperAdmin: boolean;
}

export const InquiriesModule: React.FC<InquiriesModuleProps> = ({
  showToast,
  isSuperAdmin,
}) => {
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchInquiries = async () => {
    setLoading(true);
    if (!isSupabaseConfigured) {
      setInquiries([
        {
          id: 'demo-1',
          full_name: 'Vikram Malhotra',
          email: 'vikram@luxurycouture.in',
          phone: '+91 98470 12345',
          company_name: 'Malhotra Heritage Silks',
          service_interest: 'Fashion Runway & Event',
          budget_range: '₹15L - ₹25L',
          message: 'We are planning our 25th anniversary bridal lookbook and runway showcase in Kochi. Requesting a direct executive discussion with Riyas regarding creative direction and model guild casting.',
          status: 'new',
          created_at: new Date().toISOString(),
        },
      ]);
      setLoading(false);
      return;
    }

    try {
      const data = await getContactInquiries(statusFilter);
      setInquiries(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to load inquiries', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [statusFilter]);

  const openViewModal = (inq: ContactInquiry) => {
    setSelectedInquiry(inq);
    setAdminNotes(inq.admin_notes || '');
  };

  const handleStatusChange = async (newStatus: 'new' | 'read' | 'in_progress' | 'completed' | 'archived') => {
    if (!selectedInquiry?.id) return;
    setUpdating(true);
    const res = await updateContactInquiryStatus(selectedInquiry.id, newStatus, adminNotes);
    setUpdating(false);
    if (res.success) {
      showToast(`Inquiry marked as ${newStatus}`);
      setSelectedInquiry((prev) => prev ? { ...prev, status: newStatus, admin_notes: adminNotes } : null);
      fetchInquiries();
    } else {
      showToast(res.error || 'Failed to update status', 'error');
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedInquiry?.id) return;
    setUpdating(true);
    const res = await updateContactInquiryStatus(
      selectedInquiry.id,
      selectedInquiry.status || 'read',
      adminNotes
    );
    setUpdating(false);
    if (res.success) {
      showToast('Admin notes saved');
      fetchInquiries();
    } else {
      showToast(res.error || 'Failed to save notes', 'error');
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm('Are you sure you want to permanently delete this inquiry?')) return;
    try {
      const { error } = await supabase.from('contact_inquiries').delete().eq('id', id);
      if (error) throw error;
      showToast('Inquiry deleted');
      setSelectedInquiry(null);
      fetchInquiries();
    } catch (err: any) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  const filtered = inquiries.filter((i) =>
    i.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl font-serif text-white uppercase tracking-wide">
            Client Inquiries & Booking Concierge
          </h1>
          <p className="text-xs text-neutral-400 font-light mt-1">
            Incoming brand collaborations, runway staging requests, and executive inquiries.
          </p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {(['all', 'new', 'read', 'in_progress', 'completed', 'archived'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap ${
                statusFilter === s
                  ? 'bg-[#C7A46A] text-black font-bold'
                  : 'bg-[#121212] text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
        <input
          type="text"
          placeholder="Search inquiries by name, brand, email, or message content..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#111111] border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#C7A46A]"
        />
      </div>

      {loading ? (
        <div className="text-center py-16 text-neutral-500 font-mono text-xs">
          Loading inquiries...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-neutral-500 font-mono text-xs border border-dashed border-neutral-800 rounded-2xl">
          No inquiries found matching this filter.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((inq) => {
            const isNew = inq.status === 'new';
            return (
              <div
                key={inq.id}
                onClick={() => openViewModal(inq)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isNew
                    ? 'bg-[#12100A] border-[#C7A46A]/40 hover:border-[#C7A46A]'
                    : 'bg-[#0D0D0D] border-neutral-850 hover:border-neutral-700'
                }`}
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-serif text-white font-medium">
                      {inq.full_name}
                    </span>
                    {inq.company_name && (
                      <span className="text-xs font-mono text-[#C7A46A]">
                        • {inq.company_name}
                      </span>
                    )}
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider ${
                      inq.status === 'new'
                        ? 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                        : inq.status === 'in_progress'
                        ? 'bg-blue-950/60 text-blue-300 border border-blue-800/40'
                        : inq.status === 'completed'
                        ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}>
                      {inq.status}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-300 line-clamp-1 font-light">
                    {inq.message}
                  </p>

                  <div className="flex items-center gap-4 text-[11px] font-mono text-neutral-500">
                    <span>{inq.service_interest}</span>
                    {inq.budget_range && <span>Budget: {inq.budget_range}</span>}
                    {inq.created_at && (
                      <span>{new Date(inq.created_at).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openViewModal(inq);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#1A1A1A] hover:bg-[#222] border border-neutral-800 text-xs font-mono text-neutral-300 hover:text-white"
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Inquiry Detail Drawer Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div>
                <h2 className="text-xl font-serif text-white uppercase tracking-wide">
                  {selectedInquiry.full_name}
                </h2>
                {selectedInquiry.company_name && (
                  <p className="text-xs font-mono text-[#C7A46A] mt-0.5">
                    {selectedInquiry.company_name}
                  </p>
                )}
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="p-1 rounded-lg hover:bg-[#222] text-neutral-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#0D0D0D] border border-neutral-850 text-xs font-mono">
              <div className="flex items-center gap-2 text-neutral-300">
                <Mail size={14} className="text-[#C7A46A]" />
                <a href={`mailto:${selectedInquiry.email}`} className="hover:underline">
                  {selectedInquiry.email}
                </a>
              </div>
              {selectedInquiry.phone && (
                <div className="flex items-center gap-2 text-neutral-300">
                  <Phone size={14} className="text-[#C7A46A]" />
                  <a href={`tel:${selectedInquiry.phone}`} className="hover:underline">
                    {selectedInquiry.phone}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-2 text-neutral-400">
                <FileText size={14} className="text-[#C7A46A]" />
                <span>Service: {selectedInquiry.service_interest}</span>
              </div>
              {selectedInquiry.budget_range && (
                <div className="flex items-center gap-2 text-neutral-400">
                  <Building2 size={14} className="text-[#C7A46A]" />
                  <span>Budget: {selectedInquiry.budget_range}</span>
                </div>
              )}
            </div>

            {/* Message Body */}
            <div>
              <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-2">
                Client Message
              </label>
              <div className="p-4 rounded-2xl bg-[#161616] border border-neutral-800 text-neutral-200 text-sm font-light leading-relaxed whitespace-pre-wrap">
                {selectedInquiry.message}
              </div>
            </div>

            {/* Internal Admin Notes */}
            <div>
              <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-2">
                Internal Admin Notes (Only visible to staff)
              </label>
              <textarea
                rows={3}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Log follow-up calls, pricing quoted, meeting dates..."
                className="w-full px-4 py-3 rounded-xl bg-[#181818] border border-neutral-800 text-white text-xs font-mono"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  disabled={updating}
                  className="px-4 py-1.5 rounded-lg bg-[#222] hover:bg-[#333] text-xs font-mono text-[#C7A46A] border border-neutral-700"
                >
                  Save Notes
                </button>
              </div>
            </div>

            {/* Status Transition Actions */}
            <div className="pt-4 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleStatusChange('read')}
                  disabled={updating}
                  className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-mono text-neutral-200"
                >
                  Mark as Read
                </button>
                <button
                  onClick={() => handleStatusChange('in_progress')}
                  disabled={updating}
                  className="px-3 py-1.5 rounded-lg bg-blue-950/60 hover:bg-blue-900/80 text-xs font-mono text-blue-300 border border-blue-800/40"
                >
                  In Progress
                </button>
                <button
                  onClick={() => handleStatusChange('completed')}
                  disabled={updating}
                  className="px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 text-xs font-mono text-emerald-300 border border-emerald-800/40"
                >
                  Completed
                </button>
                <button
                  onClick={() => handleStatusChange('archived')}
                  disabled={updating}
                  className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-xs font-mono text-neutral-400 border border-neutral-700"
                >
                  Archive
                </button>
              </div>

              {isSuperAdmin && (
                <button
                  onClick={() => handleDelete(selectedInquiry.id)}
                  disabled={updating}
                  className="p-2 rounded-lg bg-red-950/30 hover:bg-red-900/50 text-red-400 hover:text-red-200"
                  title="Delete Inquiry"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
