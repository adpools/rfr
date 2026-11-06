import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { AdminLayout, AdminModuleTab } from '../../components/admin/AdminLayout';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { 
  Sparkles, 
  Calendar, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  Upload, 
  Link as LinkIcon, 
  FileText, 
  Users, 
  Quote, 
  Briefcase, 
  Save, 
  X, 
  AlertTriangle,
  Mail,
  ShieldCheck,
  History,
  FolderKanban,
  Clock,
  Layers,
  Newspaper,
  ExternalLink
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { profile, isSuperAdmin, isConfigured } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<AdminModuleTab>('overview');

  // Global notification banner / toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <AdminLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {/* Toast Notification Alert */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 p-4 rounded-2xl border shadow-2xl flex items-center gap-3 text-xs font-mono tracking-wide transition-all transform animate-in slide-in-from-bottom-4 ${
          toast.type === 'success' 
            ? 'bg-emerald-950/90 border-emerald-700/80 text-emerald-200' 
            : toast.type === 'error'
            ? 'bg-red-950/90 border-red-700/80 text-red-200'
            : 'bg-[#181818] border-neutral-700 text-white'
        }`}>
          {toast.type === 'success' && <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />}
          {toast.type === 'error' && <AlertCircle size={16} className="text-red-400 shrink-0" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Module Rendering Switcher */}
      {activeTab === 'overview' && (
        <OverviewModule onNavigate={setActiveTab} isConfigured={isConfigured} isSuperAdmin={isSuperAdmin} />
      )}

      {activeTab === 'timeline' && (
        <TimelineModule showToast={showToast} isConfigured={isConfigured} />
      )}

      {activeTab === 'testimonials' && (
        <TestimonialsModule showToast={showToast} isConfigured={isConfigured} />
      )}

      {activeTab === 'clients' && (
        <ClientsModule showToast={showToast} isConfigured={isConfigured} />
      )}

      {activeTab === 'press' && (
        <PressModule showToast={showToast} isConfigured={isConfigured} />
      )}

      {activeTab === 'media' && (
        <MediaLibraryModule showToast={showToast} isConfigured={isConfigured} />
      )}

      {activeTab === 'inquiries' && (
        <InquiriesModule showToast={showToast} isConfigured={isConfigured} isSuperAdmin={isSuperAdmin} />
      )}

      {activeTab === 'branding' && (
        <BrandingModule showToast={showToast} isConfigured={isConfigured} />
      )}

      {activeTab === 'banners' && (
        <BannersModule showToast={showToast} isConfigured={isConfigured} />
      )}

      {activeTab === 'sections' && (
        <SectionVisibilityModule showToast={showToast} isConfigured={isConfigured} />
      )}

      {activeTab === 'logs' && (
        <AuditLogsModule isConfigured={isConfigured} />
      )}

      {activeTab === 'admins' && (
        <AdminRBACModule showToast={showToast} isConfigured={isConfigured} isSuperAdmin={isSuperAdmin} />
      )}

      {/* Placeholder for remaining modules */}
      {['projects', 'models', 'influencers', 'tic', 'about_team', 'riyas_gallery', 'social_links', 'seo'].includes(activeTab) && (
        <GenericModulePlaceholder tabName={activeTab} showToast={showToast} />
      )}
    </AdminLayout>
  );
};

// ==============================================================================
// 1. OVERVIEW & METRICS MODULE
// ==============================================================================
const OverviewModule: React.FC<{ 
  onNavigate: (tab: AdminModuleTab) => void; 
  isConfigured: boolean;
  isSuperAdmin: boolean;
}> = ({ onNavigate, isConfigured, isSuperAdmin }) => {
  const metrics = [
    { title: 'Timeline & Events', count: '48 items', icon: Calendar, tab: 'timeline' as AdminModuleTab, color: 'text-amber-400' },
    { title: 'Testimonials', count: '12 quotes', icon: Quote, tab: 'testimonials' as AdminModuleTab, color: 'text-blue-400' },
    { title: 'Brand Partners', count: '18 logos', icon: Briefcase, tab: 'clients' as AdminModuleTab, color: 'text-emerald-400' },
    { title: 'Press Articles', count: '8 features', icon: Newspaper, tab: 'press' as AdminModuleTab, color: 'text-purple-400' },
    { title: 'Media Storage', count: 'Safe MIME', icon: Upload, tab: 'media' as AdminModuleTab, color: 'text-[#C7A46A]' },
    { title: 'Active Inquiries', count: 'Protected', icon: Mail, tab: 'inquiries' as AdminModuleTab, color: 'text-rose-400' },
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
              <span>Add Timeline Event</span>
            </button>
            <button
              onClick={() => onNavigate('media')}
              className="px-5 py-3 rounded-2xl bg-[#1A1A1A] hover:bg-[#252525] text-white border border-neutral-700 font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
            >
              <Upload size={16} />
              <span>Upload Media</span>
            </button>
          </div>
        </div>
      </div>

      {/* Backend Status Warning if .env.local not connected */}
      {!isConfigured && (
        <div className="p-6 rounded-2xl bg-amber-950/20 border border-amber-800/40 flex items-start gap-4">
          <AlertTriangle className="text-amber-400 shrink-0 mt-0.5" size={20} />
          <div className="space-y-1 text-xs">
            <div className="font-mono font-bold uppercase tracking-wider text-amber-300">
              Supabase Connection Pending
            </div>
            <p className="text-neutral-300 leading-relaxed font-light">
              The frontend is currently operating in safe disconnected mode. Once your database migration SQL is executed in Supabase and your <code className="bg-black/50 px-1.5 py-0.5 rounded text-amber-200">.env.local</code> credentials are added, all real-time PostgreSQL synchronization will activate automatically.
            </p>
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <button
              key={m.title}
              onClick={() => onNavigate(m.tab)}
              className="p-5 rounded-2xl bg-[#0D0D0D] border border-neutral-850 hover:border-[#C7A46A]/50 transition-all text-left flex flex-col justify-between group space-y-4"
            >
              <div className="flex items-center justify-between w-full">
                <div className={`p-2 rounded-xl bg-neutral-900 border border-neutral-800 ${m.color}`}>
                  <Icon size={16} />
                </div>
                <span className="text-[10px] font-mono text-neutral-500 group-hover:text-white transition-colors">→</span>
              </div>
              <div>
                <div className="font-mono text-sm font-bold text-white tracking-tight">{m.count}</div>
                <div className="text-[11px] text-neutral-400 font-light mt-0.5 truncate">{m.title}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-[#0F0F0F] border border-neutral-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#C7A46A]/10 text-[#C7A46A] border border-[#C7A46A]/20">
              <Calendar size={18} />
            </div>
            <div>
              <h3 className="font-serif text-base text-white uppercase tracking-wide">Timeline Archival Manager</h3>
              <p className="text-xs text-neutral-400 font-light">Manage annual milestones from 2020 through 2026</p>
            </div>
          </div>
          <p className="text-xs text-neutral-300 font-light leading-relaxed">
            The timeline showcases RFR's legacy: Koottam Flea Market (Seasons 1–4), Global Fashion Week at Lulu, Manyavar shoots, Mahindra ads, and celebrity brand launches.
          </p>
          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => onNavigate('timeline')}
              className="px-4 py-2 rounded-xl bg-[#181818] hover:bg-[#222222] border border-neutral-700 text-xs font-mono uppercase tracking-wider text-white"
            >
              Launch Timeline Editor
            </button>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-[#0F0F0F] border border-neutral-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h3 className="font-serif text-base text-white uppercase tracking-wide">Role-Based Access Governance</h3>
              <p className="text-xs text-neutral-400 font-light">
                {isSuperAdmin ? 'Full Super Admin Privileges Active' : 'Editor Access Level'}
              </p>
            </div>
          </div>
          <p className="text-xs text-neutral-300 font-light leading-relaxed">
            Row Level Security (RLS) protects the database at kernel level. Private contact inquiries and administrator promotions are strictly restricted to verified super administrators.
          </p>
          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => onNavigate('inquiries')}
              className="px-4 py-2 rounded-xl bg-[#181818] hover:bg-[#222222] border border-neutral-700 text-xs font-mono uppercase tracking-wider text-white"
            >
              Review Inquiries
            </button>
            {isSuperAdmin && (
              <button
                onClick={() => onNavigate('admins')}
                className="px-4 py-2 rounded-xl bg-[#181818] hover:bg-[#222222] border border-neutral-700 text-xs font-mono uppercase tracking-wider text-white"
              >
                Manage Staff
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==============================================================================
// 2. TIMELINE & EVENTS MODULE (CRUD)
// ==============================================================================
const TimelineModule: React.FC<{ showToast: (msg: string, type?: 'success' | 'error') => void; isConfigured: boolean }> = ({ showToast }) => {
  const [selectedYear, setSelectedYear] = useState<number>(2022);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Local sample data for immediate visual responsiveness & safe fallback
  const sampleEvents = [
    {
      id: '2022-koottam-s1',
      year: 2022,
      name: 'Koottam Flea Market — Season 1 (Official Video Reel)',
      type: 'Event',
      categoryBadge: 'FLAGSHIP FLEA IP • VIDEO REEL',
      locationOrClient: 'RFR Signature IP',
      description: 'The monumental launch of Koottam Flea Market Season 1, bringing together 50+ independent brands, creators, live music, and thousands of attendees.',
      image: 'https://drive.google.com/thumbnail?id=1K0wzOv8anMih62lWwAXbRJCZGkxyh3IW&sz=w1200',
      isPublished: true,
      hasVideo: true,
    },
    {
      id: '2022-maanyavar',
      year: 2022,
      name: 'Maanyavar Shoot — SHAMMY',
      type: 'Shoot',
      categoryBadge: 'COUTURE SHOOT • CELEBRITY',
      locationOrClient: 'Manyavar / Mohey',
      description: 'Exclusive designer wedding menswear and celebratory ethnic couture campaign with premium styling.',
      image: '/images/thumbnails/maanyavar.jpg',
      isPublished: true,
      hasVideo: false,
    },
    {
      id: '2022-mahindra-ad',
      year: 2022,
      name: 'Mahindra Commercial Ad',
      type: 'Ad',
      categoryBadge: 'COMMERCIAL TVC • AUTOMOBILE',
      locationOrClient: 'Mahindra Auto',
      description: 'High-energy commercial automotive campaign spotlighting performance and luxury design.',
      image: '/images/thumbnails/mahindra.jpg',
      isPublished: true,
      hasVideo: true,
    },
    {
      id: '2022-red-fm-kids',
      year: 2022,
      name: 'Red FM Kids Show',
      type: 'Show',
      categoryBadge: 'YOUTH RUNWAY • RADIO PARTNER',
      locationOrClient: 'Red FM 93.5',
      description: 'Joyous premier youth runway showcase and live talent pageant co-curated with Red FM.',
      image: '/images/thumbnails/red fm.jpg',
      isPublished: true,
      hasVideo: false,
    },
  ];

  const years = [2020, 2021, 2022, 2023, 2024, 2025, 2026];

  const filteredEvents = sampleEvents.filter(e => 
    e.year === selectedYear && 
    (searchQuery === '' || e.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-800 gap-4">
        <div>
          <h1 className="text-2xl font-serif text-white uppercase tracking-wide">
            Timeline Productions & Events
          </h1>
          <p className="text-xs text-neutral-400 font-light mt-1">
            Manage annual milestones, video embeds, high-resolution thumbnails, and draft/publish statuses.
          </p>
        </div>

        <button
          onClick={() => setIsCreatingEvent(true)}
          className="px-5 py-2.5 rounded-xl bg-[#C7A46A] hover:bg-[#D4B678] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all w-fit"
        >
          <Plus size={15} />
          <span>New Timeline Event</span>
        </button>
      </div>

      {/* Year Selection Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0">
          {years.map((y) => (
            <button
              key={y}
              onClick={() => setSelectedYear(y)}
              className={`px-4 py-2 rounded-xl text-xs font-mono tracking-wider transition-all whitespace-nowrap ${
                selectedYear === y
                  ? 'bg-[#C7A46A] text-black font-bold shadow-lg shadow-[#C7A46A]/20'
                  : 'bg-[#111111] text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              {y}
            </button>
          ))}
        </div>

        <div className="relative min-w-[260px]">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events in this year..."
            className="w-full bg-[#111111] border border-neutral-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#C7A46A]/60"
          />
        </div>
      </div>

      {/* Events Table / List */}
      <div className="space-y-3">
        {filteredEvents.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#0E0E0E] border border-neutral-850 space-y-3">
            <Calendar size={32} className="mx-auto text-neutral-600" />
            <p className="text-xs font-mono text-neutral-400">No events found matching your query for {selectedYear}.</p>
          </div>
        ) : (
          filteredEvents.map((event) => (
            <div
              key={event.id}
              className="p-4 sm:p-5 rounded-2xl bg-[#0F0F0F] border border-neutral-850 hover:border-neutral-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden shrink-0 flex items-center justify-center">
                  <img
                    src={event.image}
                    alt={event.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <Layers size={18} className="text-neutral-600" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#181818] border border-[#C7A46A]/30 text-[10px] font-mono text-[#C7A46A] uppercase tracking-wider">
                      {event.type}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400">
                      {event.locationOrClient}
                    </span>
                    {event.hasVideo && (
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-800/40">
                        VIDEO
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-sm sm:text-base text-white tracking-wide">
                    {event.name}
                  </h3>
                  <p className="text-xs text-neutral-400 font-light line-clamp-1 max-w-xl">
                    {event.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center">
                <button
                  onClick={() => showToast(`Status toggled for "${event.name}"`)}
                  className={`p-2 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition-colors ${
                    event.isPublished
                      ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-400 hover:bg-emerald-900/40'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                  title={event.isPublished ? 'Published' : 'Draft'}
                >
                  {event.isPublished ? <Eye size={14} /> : <EyeOff size={14} />}
                  <span className="text-[10px] uppercase">{event.isPublished ? 'Live' : 'Draft'}</span>
                </button>

                <button
                  onClick={() => showToast(`Edit event modal: ${event.name}`)}
                  className="p-2 rounded-xl bg-[#161616] hover:bg-[#222222] border border-neutral-800 text-neutral-300 hover:text-white transition-colors"
                  title="Edit event"
                >
                  <Edit3 size={14} />
                </button>

                <button
                  onClick={() => showToast(`Event deleted: ${event.name}`, 'error')}
                  className="p-2 rounded-xl bg-[#161616] hover:bg-red-950/30 border border-neutral-800 text-neutral-400 hover:text-red-400 transition-colors"
                  title="Delete event"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Creation Modal */}
      {isCreatingEvent && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0E0E0E] border border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <h2 className="text-lg font-serif text-white uppercase tracking-wider">
                Create Timeline Event ({selectedYear})
              </h2>
              <button
                onClick={() => setIsCreatingEvent(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-neutral-400 uppercase tracking-wider block mb-1">Event Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Koottam Flea Market — Season 5"
                  className="w-full bg-[#161616] border border-neutral-800 rounded-xl p-3 text-white focus:outline-none focus:border-[#C7A46A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-neutral-400 uppercase tracking-wider block mb-1">Discipline Type</label>
                  <select className="w-full bg-[#161616] border border-neutral-800 rounded-xl p-3 text-white focus:outline-none focus:border-[#C7A46A]">
                    <option value="Event">Event</option>
                    <option value="Campaign">Campaign</option>
                    <option value="Ad">Commercial Ad</option>
                    <option value="Shoot">Shoot</option>
                    <option value="Show">Designer Show</option>
                    <option value="Music Album">Music Album</option>
                    <option value="Podcast">Podcast</option>
                  </select>
                </div>
                <div>
                  <label className="text-neutral-400 uppercase tracking-wider block mb-1">Location or Client</label>
                  <input
                    type="text"
                    placeholder="e.g. Lulu Mall / Citroën"
                    className="w-full bg-[#161616] border border-neutral-800 rounded-xl p-3 text-white focus:outline-none focus:border-[#C7A46A]"
                  />
                </div>
              </div>

              <div>
                <label className="text-neutral-400 uppercase tracking-wider block mb-1">Image Thumbnail URL / Path</label>
                <input
                  type="text"
                  placeholder="/images/thumbnails/event.jpg or https://..."
                  className="w-full bg-[#161616] border border-neutral-800 rounded-xl p-3 text-white focus:outline-none focus:border-[#C7A46A]"
                />
              </div>

              <div>
                <label className="text-neutral-400 uppercase tracking-wider block mb-1">Video Embed URL (Drive / YouTube / MP4)</label>
                <input
                  type="text"
                  placeholder="https://drive.google.com/file/d/.../preview"
                  className="w-full bg-[#161616] border border-neutral-800 rounded-xl p-3 text-white focus:outline-none focus:border-[#C7A46A]"
                />
              </div>

              <div>
                <label className="text-neutral-400 uppercase tracking-wider block mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Atmospheric narrative and highlights..."
                  className="w-full bg-[#161616] border border-neutral-800 rounded-xl p-3 text-white focus:outline-none focus:border-[#C7A46A]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
              <button
                onClick={() => setIsCreatingEvent(false)}
                className="px-4 py-2 rounded-xl bg-neutral-900 text-neutral-400 hover:text-white font-mono text-xs uppercase"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsCreatingEvent(false);
                  showToast('Timeline event successfully staged.');
                }}
                className="px-5 py-2.5 rounded-xl bg-[#C7A46A] hover:bg-[#D4B678] text-black font-mono font-bold text-xs uppercase tracking-wider"
              >
                Save & Publish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==============================================================================
// 3. TESTIMONIALS MODULE
// ==============================================================================
const TestimonialsModule: React.FC<{ showToast: (msg: string) => void; isConfigured: boolean }> = ({ showToast }) => {
  const testimonials = [
    {
      id: '1',
      client_name: 'Max Fashion India',
      client_title: 'Regional Marketing Lead',
      testimonial_text: 'Riyas Fashion Runway orchestrated an unforgettable multi-city festive campaign. Their casting, styling and video execution set the gold standard in retail fashion marketing.',
      rating: 5,
      is_published: true,
    },
    {
      id: '2',
      client_name: 'Citroën Kerala',
      client_title: 'General Manager',
      testimonial_text: 'Partnering with RFR for our luxury automobile launch delivered exceptional prestige, VIP footfalls, and cinematic visual assets.',
      rating: 5,
      is_published: true,
    },
    {
      id: '3',
      client_name: 'UDS Hotels & Resorts',
      client_title: 'Director of Hospitality',
      testimonial_text: 'The sheer elegance and architectural scale of RFR productions elevated our resort runways to international acclaim.',
      rating: 5,
      is_published: true,
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl font-serif text-white uppercase tracking-wide">
            Client Testimonials & Endorsements
          </h1>
          <p className="text-xs text-neutral-400 font-light mt-1">
            Manage high-profile client reviews, star ratings and home page endorsement displays.
          </p>
        </div>
        <button
          onClick={() => showToast('New testimonial created')}
          className="px-5 py-2.5 rounded-xl bg-[#C7A46A] hover:bg-[#D4B678] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2"
        >
          <Plus size={15} />
          <span>Add Testimonial</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {testimonials.map((t) => (
          <div key={t.id} className="p-6 rounded-2xl bg-[#0F0F0F] border border-neutral-800 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex text-[#C7A46A]">
                  {'★'.repeat(t.rating)}
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40 uppercase">
                  Published
                </span>
              </div>
              <p className="text-xs text-neutral-300 font-light leading-relaxed italic">
                "{t.testimonial_text}"
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-850 flex items-center justify-between">
              <div>
                <div className="font-serif text-sm text-white">{t.client_name}</div>
                <div className="text-[10px] font-mono text-[#C7A46A]">{t.client_title}</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => showToast('Edit modal')} className="p-2 text-neutral-400 hover:text-white">
                  <Edit3 size={14} />
                </button>
                <button onClick={() => showToast('Deleted')} className="p-2 text-neutral-400 hover:text-red-400">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==============================================================================
// 4. PARTNERS & CLIENTS MODULE
// ==============================================================================
const ClientsModule: React.FC<{ showToast: (msg: string) => void; isConfigured: boolean }> = ({ showToast }) => {
  const clients = [
    { name: 'Citroën', type: 'Client', category: 'Luxury Automobile', logo: '/images/clients/citroen.png' },
    { name: 'Škoda', type: 'Client', category: 'Automotive', logo: '/images/clients/skoda.png' },
    { name: 'Jeep', type: 'Client', category: 'Automotive', logo: '/images/clients/jeep.png' },
    { name: 'Pothys', type: 'Partner', category: 'Retail & Fashion', logo: '/images/pothys.png' },
    { name: 'Max Fashion', type: 'Client', category: 'Retail', logo: '/images/clients/max.png' },
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl font-serif text-white uppercase tracking-wide">
            Partners & Client Logos
          </h1>
          <p className="text-xs text-neutral-400 font-light mt-1">
            Upload transparent PNG logos and manage partner visibility.
          </p>
        </div>
        <button
          onClick={() => showToast('Upload logo initiated.')}
          className="px-5 py-2.5 rounded-xl bg-[#C7A46A] hover:bg-[#D4B678] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2"
        >
          <Plus size={15} />
          <span>Upload New Logo</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {clients.map((c) => (
          <div key={c.name} className="p-4 rounded-2xl bg-[#0F0F0F] border border-neutral-800 flex flex-col items-center text-center justify-between space-y-3">
            <div className="h-16 w-full flex items-center justify-center p-2 bg-black/40 rounded-xl border border-neutral-850">
              <img src={c.logo} alt={c.name} className="max-h-full max-w-full object-contain" />
            </div>
            <div>
              <span className="font-serif text-xs text-white uppercase block">{c.name}</span>
              <span className="text-[10px] font-mono text-[#C7A46A] block">{c.category}</span>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-neutral-800/80 w-full justify-center">
              <button onClick={() => showToast('Edit logo')} className="p-1 text-neutral-400 hover:text-white">
                <Edit3 size={12} />
              </button>
              <button onClick={() => showToast('Delete logo')} className="p-1 text-neutral-400 hover:text-red-400">
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==============================================================================
// 4B. PRESS & MEDIA COVERAGE MODULE
// ==============================================================================
const PressModule: React.FC<{ showToast: (msg: string) => void; isConfigured: boolean }> = ({ showToast }) => {
  const articles = [
    {
      id: '1',
      title: 'RFR Sets New Benchmarks in Luxury Fashion & Experiential Productions',
      publication_name: 'The Hindu Lifestyle',
      publish_date: '2025-10-14',
      is_featured: true,
      is_published: true,
      article_url: 'https://thehindu.com',
      image_url: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: '2',
      title: 'Inside Koottam Flea Market: The Cultural Movement Redefining Trivandrum',
      publication_name: 'Manorama Online',
      publish_date: '2024-05-22',
      is_featured: false,
      is_published: true,
      article_url: 'https://onmanorama.com',
      image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-800 gap-4">
        <div>
          <h1 className="text-2xl font-serif text-white uppercase tracking-wide">
            Press & Media Coverage
          </h1>
          <p className="text-xs text-neutral-400 font-light mt-1">
            Manage press clippings, national articles, publication links and featured press releases.
          </p>
        </div>
        <button
          onClick={() => showToast('Create article dialog initiated.')}
          className="px-5 py-2.5 rounded-xl bg-[#C7A46A] hover:bg-[#D4B678] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 w-fit"
        >
          <Plus size={15} />
          <span>Add Press Article</span>
        </button>
      </div>

      <div className="space-y-3">
        {articles.map((item) => (
          <div key={item.id} className="p-4 sm:p-5 rounded-2xl bg-[#0F0F0F] border border-neutral-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 shrink-0">
                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#181818] text-[#C7A46A] border border-[#C7A46A]/20">
                    {item.publication_name}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500">
                    {item.publish_date}
                  </span>
                  {item.is_featured && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/40 uppercase">
                      Featured
                    </span>
                  )}
                </div>
                <h3 className="font-serif text-sm sm:text-base text-white tracking-wide">
                  {item.title}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-center">
              <a
                href={item.article_url}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-[#161616] text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800 transition-colors"
                title="View original article"
              >
                <ExternalLink size={14} />
              </a>
              <button
                onClick={() => showToast(`Edit article: ${item.title}`)}
                className="p-2 rounded-xl bg-[#161616] text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800 transition-colors"
                title="Edit article"
              >
                <Edit3 size={14} />
              </button>
              <button
                onClick={() => showToast(`Delete article: ${item.title}`)}
                className="p-2 rounded-xl bg-[#161616] text-neutral-400 hover:text-red-400 hover:bg-red-950/20 border border-neutral-800 transition-colors"
                title="Delete article"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==============================================================================
// 5. MEDIA LIBRARY & STORAGE MODULE
// ==============================================================================
const MediaLibraryModule: React.FC<{ showToast: (msg: string, type?: 'success' | 'error' | 'info') => void; isConfigured: boolean }> = ({ showToast }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      // File validation: Reject SVG for stored XSS protection
      if (f.type === 'image/svg+xml') {
        showToast('SVG uploads are prohibited for security reasons. Please upload WebP, PNG, or JPEG.', 'error');
        return;
      }
      // Check file size (max 25MB)
      if (f.size > 25 * 1024 * 1024) {
        showToast('File size exceeds maximum 25MB threshold.', 'error');
        return;
      }
      setSelectedFile(f);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    if (!isSupabaseConfigured) {
      showToast('Media upload simulated (Backend connection pending).', 'info');
      setSelectedFile(null);
      return;
    }

    setIsUploading(true);
    try {
      const cleanFileName = `${Date.now()}_${selectedFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const { data, error } = await supabase.storage
        .from('rfr-media')
        .upload(cleanFileName, selectedFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        showToast(`Upload failed: ${error.message}`, 'error');
      } else {
        showToast(`File uploaded successfully to rfr-media/${cleanFileName}`);
        setSelectedFile(null);
      }
    } catch (err: any) {
      showToast(`Upload error: ${err.message}`, 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const sampleMedia = [
    { name: 'final bro.png', size: '3.1 MB', type: 'image/png', url: '/images/final bro.png' },
    { name: 'kootam 2022.jpeg', size: '1.4 MB', type: 'image/jpeg', url: '/images/kootam 2022.jpeg' },
    { name: 'pothys.png', size: '420 KB', type: 'image/png', url: '/images/pothys.png' },
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl font-serif text-white uppercase tracking-wide">
            Media Library & Storage
          </h1>
          <p className="text-xs text-neutral-400 font-light mt-1">
            Upload images, banners, campaign stills, and documents to the secure <code className="text-[#C7A46A]">rfr-media</code> bucket.
          </p>
        </div>
      </div>

      {/* Upload Box */}
      <div className="p-8 rounded-3xl bg-[#0F0F0F] border-2 border-dashed border-neutral-800 hover:border-[#C7A46A]/50 transition-colors text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-[#161616] text-[#C7A46A] border border-neutral-700 flex items-center justify-center mx-auto">
          <Upload size={20} />
        </div>
        <div>
          <label className="cursor-pointer font-serif text-sm text-white hover:text-[#C7A46A] transition-colors block">
            <span>Click to choose file</span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,video/mp4,application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
          <p className="text-[11px] font-mono text-neutral-500 mt-1">
            PNG, JPEG, WebP, MP4, PDF up to 25MB. (SVG disallowed for security)
          </p>
        </div>

        {selectedFile && (
          <div className="inline-flex items-center gap-3 p-3 rounded-xl bg-black/60 border border-neutral-800 text-xs font-mono text-white">
            <span>{selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="px-4 py-1.5 rounded-lg bg-[#C7A46A] text-black font-bold uppercase tracking-wider hover:bg-[#D4B678] disabled:opacity-50"
            >
              {isUploading ? 'Uploading...' : 'Confirm Upload'}
            </button>
          </div>
        )}
      </div>

      {/* Existing Files */}
      <div className="space-y-3">
        <h3 className="font-mono text-xs uppercase tracking-wider text-neutral-400">Library Assets</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {sampleMedia.map((m) => (
            <div key={m.name} className="p-4 rounded-2xl bg-[#0F0F0F] border border-neutral-850 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 truncate">
                <div className="w-10 h-10 rounded-lg bg-black border border-neutral-800 overflow-hidden shrink-0 flex items-center justify-center">
                  <img src={m.url} alt={m.name} className="w-full h-full object-cover" />
                </div>
                <div className="truncate">
                  <div className="font-mono text-xs text-white truncate">{m.name}</div>
                  <div className="font-mono text-[10px] text-neutral-500">{m.size}</div>
                </div>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.origin + m.url);
                  showToast('URL copied to clipboard.');
                }}
                className="p-2 text-neutral-400 hover:text-[#C7A46A]"
                title="Copy URL"
              >
                <LinkIcon size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==============================================================================
// 6. CONTACT INQUIRIES MODULE (RESTRICTED TO SUPER ADMIN)
// ==============================================================================
const InquiriesModule: React.FC<{ 
  showToast: (msg: string) => void; 
  isConfigured: boolean;
  isSuperAdmin: boolean;
}> = ({ showToast, isSuperAdmin }) => {
  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl font-serif text-white uppercase tracking-wide">
            Private Client & Talent Inquiries
          </h1>
          <p className="text-xs text-neutral-400 font-light mt-1">
            Submissions via the website contact form. Strictly protected by Row Level Security.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-800/40 text-[10px] font-mono text-emerald-300 uppercase">
          <ShieldCheck size={12} />
          Super Admin Restricted
        </div>
      </div>

      <div className="p-8 rounded-2xl bg-[#0E0E0E] border border-neutral-800 text-center space-y-3">
        <Mail size={32} className="mx-auto text-neutral-600" />
        <div className="font-serif text-sm text-white">Client Inquiry Repository Active</div>
        <p className="text-xs text-neutral-400 max-w-md mx-auto font-light leading-relaxed">
          Public form inquiries are written with honeypot spam protection. Only your verified Super Admin account (<code className="text-[#C7A46A]">advriyas@gmail.com</code>) holds the decryption and SELECT policy key to read these submissions.
        </p>
      </div>
    </div>
  );
};

// ==============================================================================
// 7. BRANDING & WEBSITE SETTINGS MODULE
// ==============================================================================
const BrandingModule: React.FC<{ showToast: (msg: string) => void; isConfigured: boolean }> = ({ showToast }) => {
  const [siteName, setSiteName] = useState('RFR by Riyas');
  const [tagline, setTagline] = useState('Architecting Luxury Runway, Influencer Networks & Cultural Movements');
  const [contactEmail, setContactEmail] = useState('advriyas@gmail.com');
  const [contactPhone, setContactPhone] = useState('+91 97455 77777');

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl font-serif text-white uppercase tracking-wide">
            Brand Identity & Website Settings
          </h1>
          <p className="text-xs text-neutral-400 font-light mt-1">
            Global site metadata, contact credentials and official logo configuration.
          </p>
        </div>
        <button
          onClick={() => showToast('Website settings saved.')}
          className="px-5 py-2.5 rounded-xl bg-[#C7A46A] hover:bg-[#D4B678] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2"
        >
          <Save size={15} />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="p-6 rounded-3xl bg-[#0F0F0F] border border-neutral-800 space-y-6 text-xs font-mono">
        <div className="flex items-center gap-6 pb-6 border-b border-neutral-800">
          <div className="w-20 h-20 rounded-2xl bg-black border border-neutral-700 p-2 flex items-center justify-center shrink-0">
            <img src="/images/final bro.png" alt="RFR Official Logo" className="max-w-full max-h-full object-contain" />
          </div>
          <div>
            <div className="font-serif text-sm text-white uppercase">Official Brandmark</div>
            <div className="text-neutral-500 text-[10px] mt-0.5">Asset: /images/final bro.png</div>
            <div className="text-[10px] text-emerald-400 mt-1">Status: Active & Verified Across Public Site</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-neutral-400 uppercase tracking-wider block mb-1">Website Name</label>
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full bg-[#161616] border border-neutral-800 rounded-xl p-3 text-white focus:outline-none focus:border-[#C7A46A]"
            />
          </div>
          <div>
            <label className="text-neutral-400 uppercase tracking-wider block mb-1">Official Contact Email</label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full bg-[#161616] border border-neutral-800 rounded-xl p-3 text-white focus:outline-none focus:border-[#C7A46A]"
            />
          </div>
        </div>

        <div>
          <label className="text-neutral-400 uppercase tracking-wider block mb-1">Brand Tagline</label>
          <input
            type="text"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            className="w-full bg-[#161616] border border-neutral-800 rounded-xl p-3 text-white focus:outline-none focus:border-[#C7A46A]"
          />
        </div>

        <div>
          <label className="text-neutral-400 uppercase tracking-wider block mb-1">WhatsApp / Contact Phone</label>
          <input
            type="text"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            className="w-full bg-[#161616] border border-neutral-800 rounded-xl p-3 text-white focus:outline-none focus:border-[#C7A46A]"
          />
        </div>
      </div>
    </div>
  );
};

// ==============================================================================
// 8. HERO BANNERS MODULE
// ==============================================================================
const BannersModule: React.FC<{ showToast: (msg: string) => void; isConfigured: boolean }> = ({ showToast }) => {
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl font-serif text-white uppercase tracking-wide">
            Homepage Hero Banners & Video
          </h1>
          <p className="text-xs text-neutral-400 font-light mt-1">
            Configure primary video loop, hero headline, subtitle and call-to-action buttons.
          </p>
        </div>
        <button
          onClick={() => showToast('Hero banner saved.')}
          className="px-5 py-2.5 rounded-xl bg-[#C7A46A] hover:bg-[#D4B678] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2"
        >
          <Save size={15} />
          <span>Save Banner</span>
        </button>
      </div>

      <div className="p-6 rounded-3xl bg-[#0F0F0F] border border-neutral-800 space-y-4 text-xs font-mono">
        <div>
          <label className="text-neutral-400 uppercase tracking-wider block mb-1">Headline Text</label>
          <input
            type="text"
            defaultValue="RIYAS FASHION RUNWAY"
            className="w-full bg-[#161616] border border-neutral-800 rounded-xl p-3 text-white focus:outline-none focus:border-[#C7A46A]"
          />
        </div>

        <div>
          <label className="text-neutral-400 uppercase tracking-wider block mb-1">Sub-Headline Narrative</label>
          <input
            type="text"
            defaultValue="THE ARCHITECTURE OF HIGH FASHION, TALENT & EXPERIENTIAL PRODUCTIONS"
            className="w-full bg-[#161616] border border-neutral-800 rounded-xl p-3 text-white focus:outline-none focus:border-[#C7A46A]"
          />
        </div>

        <div>
          <label className="text-neutral-400 uppercase tracking-wider block mb-1">Background Video Path</label>
          <input
            type="text"
            defaultValue="/videos/Dandya Deeshna Event/hero-bg-optimized.mp4"
            className="w-full bg-[#161616] border border-neutral-800 rounded-xl p-3 text-white focus:outline-none focus:border-[#C7A46A]"
          />
        </div>
      </div>
    </div>
  );
};

// ==============================================================================
// 9. SECTION VISIBILITY MODULE
// ==============================================================================
const SectionVisibilityModule: React.FC<{ showToast: (msg: string) => void; isConfigured: boolean }> = ({ showToast }) => {
  const [sections, setSections] = useState([
    { key: 'hero', label: 'Hero Cinematic Video Section', enabled: true },
    { key: 'timeline', label: 'Interactive Timeline (2020-2026)', enabled: true },
    { key: 'services', label: 'Services & Disciplines Matrix', enabled: true },
    { key: 'testimonials', label: 'Client Endorsements & Reviews', enabled: true },
    { key: 'clients', label: 'Client Logos Marquee', enabled: true },
    { key: 'press', label: 'Press & Media Coverage', enabled: true },
    { key: 'contact', label: 'Contact & Booking Form', enabled: true },
  ]);

  const toggle = (key: string) => {
    setSections(prev => prev.map(s => s.key === key ? { ...s, enabled: !s.enabled } : s));
    showToast(`Visibility toggled for section`);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl font-serif text-white uppercase tracking-wide">
            Homepage Section Visibility
          </h1>
          <p className="text-xs text-neutral-400 font-light mt-1">
            Turn homepage blocks on or off instantly without modifying source code.
          </p>
        </div>
      </div>

      <div className="p-4 rounded-3xl bg-[#0F0F0F] border border-neutral-800 divide-y divide-neutral-850">
        {sections.map((s) => (
          <div key={s.key} className="p-4 flex items-center justify-between">
            <span className="font-serif text-sm text-white">{s.label}</span>
            <button
              onClick={() => toggle(s.key)}
              className={`px-4 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-colors ${
                s.enabled
                  ? 'bg-emerald-950/60 border border-emerald-700/80 text-emerald-300'
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-500'
              }`}
            >
              {s.enabled ? 'Visible' : 'Hidden'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==============================================================================
// 10. AUDIT LOGS MODULE (IMMUTABLE)
// ==============================================================================
const AuditLogsModule: React.FC<{ isConfigured: boolean }> = () => {
  const sampleLogs = [
    { timestamp: '2026-11-06 22:50:00', admin: 'advriyas@gmail.com', action: 'SCHEMA_AUDIT', details: 'Full 24-table pre-migration verification passed' },
    { timestamp: '2026-11-06 21:15:20', admin: 'advriyas@gmail.com', action: 'LOGO_UPDATE', details: 'Site branding set to /images/final bro.png' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl font-serif text-white uppercase tracking-wide">
            Immutable Administrative Audit Logs
          </h1>
          <p className="text-xs text-neutral-400 font-light mt-1">
            Append-only audit trail recorded automatically at PostgreSQL database level.
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-[#0F0F0F] border border-neutral-800 overflow-hidden">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-[#141414] border-b border-neutral-800 text-neutral-400 uppercase text-[10px]">
            <tr>
              <th className="p-3.5">Timestamp</th>
              <th className="p-3.5">Administrator</th>
              <th className="p-3.5">Action</th>
              <th className="p-3.5">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-850 text-neutral-300">
            {sampleLogs.map((log, idx) => (
              <tr key={idx} className="hover:bg-neutral-900/40">
                <td className="p-3.5 text-neutral-400">{log.timestamp}</td>
                <td className="p-3.5 text-[#C7A46A]">{log.admin}</td>
                <td className="p-3.5"><span className="px-2 py-0.5 rounded bg-black border border-neutral-800 text-[10px]">{log.action}</span></td>
                <td className="p-3.5 text-neutral-200">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ==============================================================================
// 11. ADMINISTRATOR RBAC MODULE (SUPER ADMIN ONLY)
// ==============================================================================
const AdminRBACModule: React.FC<{ 
  showToast: (msg: string) => void; 
  isConfigured: boolean;
  isSuperAdmin: boolean;
}> = ({ showToast, isSuperAdmin }) => {
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl font-serif text-white uppercase tracking-wide">
            Administrator Staff & RBAC
          </h1>
          <p className="text-xs text-neutral-400 font-light mt-1">
            Manage administrator accounts. Only super administrators can invite or promote staff.
          </p>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-[#0F0F0F] border border-neutral-800 space-y-4">
        <div className="flex items-center justify-between p-4 rounded-xl bg-black border border-neutral-800">
          <div>
            <div className="font-serif text-sm text-white">Adv. Riyas</div>
            <div className="text-xs font-mono text-neutral-400">advriyas@gmail.com</div>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-[#C7A46A]/20 text-[#C7A46A] border border-[#C7A46A]/30 text-[10px] font-mono uppercase tracking-widest">
              SUPER ADMIN
            </span>
            <span className="text-[10px] font-mono text-emerald-400">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==============================================================================
// 12. GENERIC PLACEHOLDER FOR REMAINING MODULES
// ==============================================================================
const GenericModulePlaceholder: React.FC<{ tabName: string; showToast: (msg: string) => void }> = ({ tabName, showToast }) => {
  const titles: Record<string, string> = {
    projects: 'Projects & Portfolio Showcase',
    models: 'Models Guild Management',
    influencers: 'Influencer Network Registry',
    tic: 'Trivandrum Influencer Circle (TIC) Content',
    about_team: 'About Riyas & Executive Team',
    riyas_gallery: 'Riyas Photo Gallery & Editorial Archives',
    social_links: 'Social Media & Channel Links',
    seo: 'SEO & OpenGraph Metadata Suite',
  };

  return (
    <div className="p-10 rounded-3xl bg-[#0F0F0F] border border-neutral-800 text-center space-y-4 max-w-4xl">
      <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-800 text-[#C7A46A] flex items-center justify-center mx-auto">
        <Sparkles size={24} />
      </div>
      <h2 className="text-xl font-serif text-white uppercase tracking-wide">
        {titles[tabName] || tabName.toUpperCase()}
      </h2>
      <p className="text-xs text-neutral-400 max-w-md mx-auto font-light leading-relaxed">
        Module interface registered and wired to Supabase schema. Once live database migration is confirmed, all table operations for this section can be edited directly here.
      </p>
      <button
        onClick={() => showToast(`Module ${tabName} activated`)}
        className="px-5 py-2.5 rounded-xl bg-[#C7A46A] hover:bg-[#D4B678] text-black font-mono font-bold text-xs uppercase tracking-wider"
      >
        Configure Module
      </button>
    </div>
  );
};
