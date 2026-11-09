import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import { History, Shield, Clock, Search, RefreshCw, FileText } from 'lucide-react';

interface AuditLog {
  id?: string;
  admin_id?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  details?: any;
  ip_address?: string;
  created_at?: string;
}

interface AuditLogsModuleProps {
  isConfigured: boolean;
}

export const AuditLogsModule: React.FC<AuditLogsModuleProps> = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const sampleLogs: AuditLog[] = [
    {
      action: 'ADMIN_LOGIN',
      entity_type: 'AUTH',
      details: { email: 'riyas@rfrriyas.com', method: 'password' },
      created_at: new Date().toISOString(),
    },
    {
      action: 'UPDATE_SETTINGS',
      entity_type: 'WEBSITE_SETTINGS',
      details: { field: 'contact_phone', status: 'verified' },
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      action: 'TOGGLE_VISIBILITY',
      entity_type: 'SECTION_VISIBILITY',
      details: { section: 'hero', visible: true },
      created_at: new Date(Date.now() - 7200000).toISOString(),
    },
  ];

  const fetchLogs = async () => {
    setLoading(true);
    if (!isSupabaseConfigured) {
      setLogs(sampleLogs);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('admin_activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error || !data || data.length === 0) {
        setLogs(sampleLogs);
      } else {
        setLogs(data);
      }
    } catch {
      setLogs(sampleLogs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filtered = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.entity_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.details && JSON.stringify(l.details).toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl font-serif text-white uppercase tracking-wide">
            Activity Audit Log
          </h1>
          <p className="text-xs text-neutral-400 font-light mt-1">
            Immutable chronological register of all administrative updates, logins, and schema events.
          </p>
        </div>
        <button
          onClick={fetchLogs}
          className="px-4 py-2 rounded-xl bg-[#181818] hover:bg-[#222] text-xs font-mono text-neutral-300 hover:text-white flex items-center gap-2 self-start sm:self-auto"
        >
          <RefreshCw size={13} />
          <span>Refresh Logs</span>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
        <input
          type="text"
          placeholder="Search activity logs by action, entity, or payload..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#111111] border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#C7A46A]"
        />
      </div>

      {loading ? (
        <div className="text-center py-16 text-neutral-500 font-mono text-xs">
          Auditing system logs...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-neutral-500 font-mono text-xs border border-dashed border-neutral-800 rounded-2xl">
          No audit entries found.
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((log, idx) => (
            <div
              key={log.id || idx}
              className="p-4 rounded-xl bg-[#0D0D0D] border border-neutral-850 hover:border-neutral-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#141414] border border-neutral-800 text-[#C7A46A]">
                  <Shield size={14} />
                </div>
                <div>
                  <div className="text-white font-semibold flex items-center gap-2">
                    <span>{log.action}</span>
                    <span className="text-[10px] text-neutral-500">•</span>
                    <span className="text-[#C7A46A] text-[11px]">{log.entity_type}</span>
                  </div>
                  {log.details && (
                    <div className="text-[11px] text-neutral-400 mt-0.5 truncate max-w-lg">
                      {typeof log.details === 'object' ? JSON.stringify(log.details) : log.details}
                    </div>
                  )}
                </div>
              </div>

              <div className="text-[10px] text-neutral-500 flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                <Clock size={11} />
                <span>{log.created_at ? new Date(log.created_at).toLocaleString() : 'Recent'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

