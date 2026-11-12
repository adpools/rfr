import React, { useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  LayoutDashboard,
  Sparkles,
  Calendar,
  FolderKanban,
  Image as ImageIcon,
  Users,
  Quote,
  Newspaper,
  Briefcase,
  Radio,
  UserCheck,
  Camera,
  Mail,
  Sliders,
  Globe,
  History,
  Shield,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  Database,
  BookOpen,
  FileText
} from 'lucide-react';

export type AdminModuleTab =
  | 'overview'
  | 'banners'
  | 'pages_content'
  | 'timeline'
  | 'projects'
  | 'media'
  | 'models'
  | 'influencers'
  | 'testimonials'
  | 'blog'
  | 'press'
  | 'clients'
  | 'tic'
  | 'about_team'
  | 'riyas_gallery'
  | 'inquiries'
  | 'branding'
  | 'social_links'
  | 'sections'
  | 'seo'
  | 'logs'
  | 'admins';

interface AdminLayoutProps {
  activeTab: AdminModuleTab;
  onTabChange: (tab: AdminModuleTab) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  activeTab,
  onTabChange,
  children,
}) => {
  const { profile, isSuperAdmin, logout, isConfigured } = useAdminAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationSections = [
    {
      group: 'Core Showcase',
      items: [
        { id: 'overview' as AdminModuleTab, label: 'Overview', icon: LayoutDashboard },
        { id: 'banners' as AdminModuleTab, label: 'Hero Banners', icon: Sparkles },
        { id: 'timeline' as AdminModuleTab, label: 'Timeline & Events', icon: Calendar },
        { id: 'projects' as AdminModuleTab, label: 'Projects & Portfolio', icon: FolderKanban },
        { id: 'media' as AdminModuleTab, label: 'Media Library', icon: ImageIcon },
      ],
    },
    {
      group: 'Editorial & Publishing',
      items: [
        { id: 'pages_content' as AdminModuleTab, label: 'Pages & Narratives', icon: FileText },
        { id: 'blog' as AdminModuleTab, label: 'Blog & Articles', icon: BookOpen },
        { id: 'press' as AdminModuleTab, label: 'Press & Clippings', icon: Newspaper },
      ],
    },
    {
      group: 'Guilds & Endorsements',
      items: [
        { id: 'models' as AdminModuleTab, label: 'Models Guild', icon: Users },
        { id: 'influencers' as AdminModuleTab, label: 'Influencer Network', icon: Radio },
        { id: 'testimonials' as AdminModuleTab, label: 'Testimonials', icon: Quote },
        { id: 'clients' as AdminModuleTab, label: 'Partners & Clients', icon: Briefcase },
        { id: 'tic' as AdminModuleTab, label: 'TIC Ecosystem', icon: Radio },
      ],
    },
    {
      group: 'Leadership & Narrative',
      items: [
        { id: 'about_team' as AdminModuleTab, label: 'About & Team', icon: UserCheck },
        { id: 'riyas_gallery' as AdminModuleTab, label: 'Riyas Photo Archive', icon: Camera },
      ],
    },
    {
      group: 'Business & Communications',
      items: [
        {
          id: 'inquiries' as AdminModuleTab,
          label: 'Client Inquiries',
          icon: Mail,
          superAdminOnly: true
        },
      ],
    },
    {
      group: 'System & Branding',
      items: [
        { id: 'branding' as AdminModuleTab, label: 'Website Settings', icon: Sliders },
        { id: 'social_links' as AdminModuleTab, label: 'Social Channels', icon: Globe },
        { id: 'sections' as AdminModuleTab, label: 'Section Visibility', icon: Sliders },
        { id: 'seo' as AdminModuleTab, label: 'SEO & Metadata', icon: Globe },
        { id: 'logs' as AdminModuleTab, label: 'Activity Audit Log', icon: History },
        {
          id: 'admins' as AdminModuleTab,
          label: 'Admin RBAC',
          icon: Shield,
          superAdminOnly: true
        },
      ],
    },
  ];

  const handleTabClick = (tab: AdminModuleTab) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
  };

  return (
    <div className="admin-layout min-h-screen bg-[#080808] text-[#FAF9F6] flex flex-col selection:bg-[#C7A46A] selection:text-black font-sans">

      {/* Top Mobile Bar */}
      <header className="lg:hidden bg-[#0D0D0D] border-b border-neutral-800 p-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <img
            src="/images/final bro.png"
            alt="RFR Logo"
            className="h-7 w-auto object-contain"
          />
          <span className="font-serif text-sm uppercase tracking-wider text-white">
            RFR Executive CMS
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-[#141414] border border-neutral-800 text-neutral-300"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      <div className="flex flex-1 relative">

        {/* Sidebar Navigation */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-72 bg-[#0A0A0A] border-r border-neutral-800/90 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            } lg:static lg:w-72 shrink-0`}
        >
          {/* Sidebar Top: Brand & Identity */}
          <div className="p-6 border-b border-neutral-800/80">
            <div className="flex items-center gap-3.5 mb-3">
              <img
                src="/images/final bro.png"
                alt="RFR Logo"
                className="h-10 w-auto object-contain select-none"
              />
              <div className="flex flex-col">
                <span className="font-serif text-base font-bold tracking-wider text-white uppercase">
                  RFR BY RIYAS
                </span>
                <span className="text-[10px] font-mono text-[#C7A46A] tracking-[0.2em] uppercase">
                  EXECUTIVE CMS
                </span>
              </div>
            </div>

            {/* Backend Connectivity Status */}
            <div className="p-2.5 rounded-xl bg-[#121212] border border-neutral-800/90 flex items-center justify-between text-[11px] font-mono">
              <span className="text-neutral-400 flex items-center gap-1.5">
                <Database size={12} className="text-[#C7A46A]" />
                <span>Backend Status</span>
              </span>
              {isConfigured ? (
                <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold" title="Backend Connected">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Connected
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-amber-400 font-semibold" title="Backend Disconnected">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Disconnected
                </span>
              )}
            </div>
          </div>

          {/* Navigation Links Scroll Area */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-neutral-800">
            {navigationSections.map((section) => {
              // Filter out super_admin only items if caller is an editor
              const visibleItems = section.items.filter(
                (item) => !item.superAdminOnly || isSuperAdmin
              );

              if (visibleItems.length === 0) return null;

              return (
                <div key={section.group}>
                  <div className="px-3 mb-2 text-[10px] font-mono uppercase tracking-[0.25em] text-[#C7A46A]/80 font-semibold">
                    {section.group}
                  </div>
                  <div className="space-y-1">
                    {visibleItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleTabClick(item.id)}
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono tracking-wider transition-all duration-200 text-left ${isActive
                              ? 'bg-[#C7A46A] text-black font-bold shadow-lg shadow-[#C7A46A]/10'
                              : 'text-neutral-400 hover:text-white hover:bg-[#141414]'
                            }`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <Icon size={15} className={isActive ? 'text-black' : 'text-neutral-500'} />
                            <span className="truncate">{item.label}</span>
                          </div>
                          {isActive && <ChevronRight size={14} className="shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </nav>

          {/* Sidebar Footer: User Session & Logout */}
          <div className="p-4 border-t border-neutral-800/80 bg-[#070707]">
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex flex-col truncate pr-2">
                <span className="text-xs text-white font-medium truncate">
                  {profile?.email || 'admin@rfrbyriyas.com'}
                </span>
                <span className="text-[10px] font-mono text-[#C7A46A] uppercase tracking-wider">
                  {isSuperAdmin ? 'SUPER ADMIN' : 'EDITOR'}
                </span>
              </div>
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-[#141414] hover:bg-neutral-800 text-neutral-400 hover:text-[#C7A46A] transition-colors"
                title="View live website in new tab"
              >
                <ExternalLink size={14} />
              </a>
            </div>

            <button
              onClick={() => logout()}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#141414] hover:bg-red-950/40 border border-neutral-800 hover:border-red-800/60 text-neutral-400 hover:text-red-400 font-mono text-xs uppercase tracking-wider transition-all"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 bg-[#080808] p-4 sm:p-6 lg:p-10 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

