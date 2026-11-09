import React, { useEffect, useState } from 'react';
import { AdminModuleTab } from '../AdminLayout';
import { getAdminMetrics, AdminMetrics } from '../../../services/cmsService';
import { 
  Calendar, 
  Quote, 
  Briefcase, 
  Newspaper, 
  Mail, 
  Upload, 
  FolderKanban, 
  Users, 
  Radio, 
  Camera, 
  Sliders, 
  ShieldCheck, 
  Sparkles,
  Plus,
  ArrowRight
} from 'lucide-react';

interface OverviewModuleProps {
  onNavigate: (tab: AdminModuleTab) => void;
  isConfigured: boolean;
  isSuperAdmin: boolean;
}

export const OverviewModule: React.FC<OverviewModuleProps> = ({
  onNavigate,
  isConfigured,
  isSuperAdmin,
}) => {
  const [metrics, setMetrics] = useState<AdminMetrics>({
    timelineCount: 48,
    testimonialsCount: 12,
    partnersCount: 20,
    pressCount: 8,
    inquiriesCount: 0,
    projectsCount: 12,
    modelsCount: 12,
    influencersCount: 10,
    galleryCount: 24,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminMetrics().then((m) => {
      setMetrics(m);
      setLoading(false);
    });
  }, []);

  const cards = [
    { title: 'Timeline & Events', count: `${metrics.timelineCount} items`, icon: Calendar, tab: 'timeline' as AdminModuleTab, color: 'text-amber-400' },
    { title: 'Testimonials', count: `${metrics.testimonialsCount} quotes`, icon: Quote, tab: 'testimonials' as AdminModuleTab, color: 'text-blue-400' },
    { title: 'Partners & Clients', count: `${metrics.partnersCount} brands`, icon: Briefcase, tab: 'clients' as AdminModuleTab, color: 'text-emerald-400' },
    { title: 'News & Press', count: `${metrics.pressCount} articles`, icon: Newspaper, tab: 'press' as AdminModuleTab, color: 'text-purple-400' },
    { title: 'Client Inquiries', count: `${metrics.inquiriesCount} unread`, icon: Mail, tab: 'inquiries' as AdminModuleTab, color: 'text-rose-400' },
    { title: 'Portfolio Projects', count: `${metrics.projectsCount} projects`, icon: FolderKanban, tab: 'projects' as AdminModuleTab, color: 'text-[#C7A46A]' },
    { title: 'Models Guild', count: `${metrics.modelsCount} profiles`, icon: Users, tab: 'models' as AdminModuleTab, color: 'text-pink-400' },
    { title: 'Influencer Circle', count: `${metrics.influencersCount} creators`, icon: Radio, tab: 'influencers' as AdminModuleTab, color: 'text-indigo-400' },
    { title: 'Riyas Photo Archive', count: `${metrics.galleryCount} photos`, icon: Camera, tab: 'riyas_gallery' as AdminModuleTab, color: 'text-teal-400' },
  ];

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-[#141414] via-[#0E0E0E] to-[#141414] border border-neutral-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1A1A] border border-[#C7A46A]/30 text-[10px] font-mono text-[#C7A46A] uppercase tracking-widest">
              <Sparkles size={12} />
              EXECUTIVE CMS SUITE
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif text-white uppercase tracking-wide">
              RFR Control Room
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-xl font-light leading-relaxed">
              Centralized administrative governance for Riyas Fashion Runway. Update live timeline productions, manage press releases, audit inquiries, and control site-wide section visibility without code redeployments.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => onNavigate('timeline')}
              className="px-5 py-3 rounded-2xl bg-[#C7A46A] hover:bg-[#D4B678] text-[#080808] font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#C7A46A]/10 transition-all"
            >
              <Plus size={16} />
              <span>Add Event</span>
            </button>
            <button
              onClick={() => onNavigate('media')}
              className="px-5 py-3 rounded-2xl bg-[#1A1A1A] hover:bg-[#252525] text-white border border-neutral-700 font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
            >
              <Upload size={16} />
              <span>Media Library</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((m) => {
          const Icon = m.icon;
          return (
            <button
              key={m.title}
              onClick={() => onNavigate(m.tab)}
              className="p-5 rounded-2xl bg-[#0D0D0D] border border-neutral-800 hover:border-[#C7A46A]/50 transition-all text-left flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-[#141414] border border-neutral-800 ${m.color}`}>
                  <Icon size={20} />
                </div>
                <div>
                  <div className="text-xs text-neutral-400 font-mono uppercase tracking-wider">
                    {m.title}
                  </div>
                  <div className="text-lg font-serif text-white font-medium mt-0.5">
                    {loading ? '...' : m.count}
                  </div>
                </div>
              </div>
              <ArrowRight size={16} className="text-neutral-600 group-hover:text-[#C7A46A] transition-colors" />
            </button>
          );
        })}
      </div>

      {/* Quick Launchpad */}
      <div className="p-6 rounded-2xl bg-[#0A0A0A] border border-neutral-800/80 space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-widest text-[#C7A46A]">
          Quick Governance Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => onNavigate('sections')}
            className="p-3 rounded-xl bg-[#121212] hover:bg-[#1a1a1a] border border-neutral-800 text-left text-xs font-mono text-neutral-300 hover:text-white transition-all flex items-center gap-2"
          >
            <Sliders size={14} className="text-[#C7A46A]" />
            <span>Section Visibility</span>
          </button>
          <button
            onClick={() => onNavigate('branding')}
            className="p-3 rounded-xl bg-[#121212] hover:bg-[#1a1a1a] border border-neutral-800 text-left text-xs font-mono text-neutral-300 hover:text-white transition-all flex items-center gap-2"
          >
            <Sliders size={14} className="text-[#C7A46A]" />
            <span>Website Settings</span>
          </button>
          <button
            onClick={() => onNavigate('inquiries')}
            className="p-3 rounded-xl bg-[#121212] hover:bg-[#1a1a1a] border border-neutral-800 text-left text-xs font-mono text-neutral-300 hover:text-white transition-all flex items-center gap-2"
          >
            <Mail size={14} className="text-[#C7A46A]" />
            <span>Review Inquiries</span>
          </button>
          {isSuperAdmin && (
            <button
              onClick={() => onNavigate('admins')}
              className="p-3 rounded-xl bg-[#121212] hover:bg-[#1a1a1a] border border-neutral-800 text-left text-xs font-mono text-neutral-300 hover:text-white transition-all flex items-center gap-2"
            >
              <ShieldCheck size={14} className="text-[#C7A46A]" />
              <span>Admin Access</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

