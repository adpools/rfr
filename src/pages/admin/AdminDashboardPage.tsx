import React, { useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { AdminLayout, AdminModuleTab } from '../../components/admin/AdminLayout';
import { CheckCircle2, AlertCircle } from 'lucide-react';

// Import all 20 specialized admin modules
import { OverviewModule } from '../../components/admin/modules/OverviewModule';
import { BannersModule } from '../../components/admin/modules/BannersModule';
import { TimelineModule } from '../../components/admin/modules/TimelineModule';
import { ProjectsModule } from '../../components/admin/modules/ProjectsModule';
import { GalleryModule } from '../../components/admin/modules/GalleryModule';
import { MediaLibraryModule } from '../../components/admin/modules/MediaLibraryModule';
import { ModelsModule } from '../../components/admin/modules/ModelsModule';
import { InfluencersModule } from '../../components/admin/modules/InfluencersModule';
import { TestimonialsModule } from '../../components/admin/modules/TestimonialsModule';
import { BlogModule } from '../../components/admin/modules/BlogModule';
import { PressModule } from '../../components/admin/modules/PressModule';
import { VideoPodcastModule } from '../../components/admin/modules/VideoPodcastModule';
import { ClientsModule } from '../../components/admin/modules/ClientsModule';
import { TicModule } from '../../components/admin/modules/TicModule';
import { AboutTeamModule } from '../../components/admin/modules/AboutTeamModule';
import { RiyasGalleryModule } from '../../components/admin/modules/RiyasGalleryModule';
import { InquiriesModule } from '../../components/admin/modules/InquiriesModule';
import { BrandingModule } from '../../components/admin/modules/BrandingModule';
import { SocialLinksModule } from '../../components/admin/modules/SocialLinksModule';
import { SectionVisibilityModule } from '../../components/admin/modules/SectionVisibilityModule';
import { SeoModule } from '../../components/admin/modules/SeoModule';
import { AuditLogsModule } from '../../components/admin/modules/AuditLogsModule';
import { AdminRbacModule } from '../../components/admin/modules/AdminRbacModule';
import { PagesContentModule } from '../../components/admin/modules/PagesContentModule';

export const AdminDashboardPage: React.FC = () => {
  const { isSuperAdmin, isConfigured } = useAdminAuth();
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
        <div 
          role="status" 
          aria-live="polite"
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-2xl border shadow-2xl flex items-center gap-3 text-xs font-mono tracking-wide transition-all transform animate-in slide-in-from-bottom-4 ${
            toast.type === 'success' 
              ? 'bg-emerald-950/90 border-emerald-700/80 text-emerald-200' 
              : toast.type === 'error'
              ? 'bg-red-950/90 border-red-700/80 text-red-200'
              : 'bg-[#181818] border-neutral-700 text-white'
          }`}
        >
          {toast.type === 'success' && <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />}
          {toast.type === 'error' && <AlertCircle size={16} className="text-red-400 shrink-0" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Admin Modules Switcher */}
      {activeTab === 'overview' && (
        <OverviewModule onNavigate={setActiveTab} isConfigured={isConfigured} isSuperAdmin={isSuperAdmin} />
      )}

      {activeTab === 'pages_content' && (
        <PagesContentModule showToast={showToast} isConfigured={isConfigured} />
      )}

      {activeTab === 'banners' && (
        <BannersModule showToast={showToast} isConfigured={isConfigured} />
      )}

      {activeTab === 'timeline' && (
        <TimelineModule showToast={showToast} isConfigured={isConfigured} />
      )}

      {activeTab === 'projects' && (
        <ProjectsModule showToast={showToast} isConfigured={isConfigured} />
      )}

      {activeTab === 'gallery' && (
        <GalleryModule showToast={showToast} isConfigured={isConfigured} />
      )}

      {activeTab === 'media' && (
        <MediaLibraryModule showToast={showToast} isConfigured={isConfigured} />
      )}

      {activeTab === 'models' && (
        <ModelsModule showToast={showToast} isConfigured={isConfigured} />
      )}

      {activeTab === 'influencers' && (
        <InfluencersModule showToast={showToast} isConfigured={isConfigured} />
      )}

      {activeTab === 'testimonials' && (
        <TestimonialsModule showToast={showToast} isConfigured={isConfigured} />
      )}

      {activeTab === 'blog' && (
        <BlogModule showToast={showToast} isConfigured={isConfigured} />
      )}

      {activeTab === 'press' && (
        <PressModule showToast={showToast} isConfigured={isConfigured} />
      )}

      {activeTab === 'videos' && (
        <VideoPodcastModule showToast={showToast} isConfigured={isConfigured} />
      )}

      {activeTab === 'clients' && (
        <ClientsModule showToast={showToast} isConfigured={isConfigured} />
      )}

      {activeTab === 'tic' && (
        <TicModule showToast={showToast} isConfigured={isConfigured} />
      )}

      {activeTab === 'about_team' && (
        <AboutTeamModule showToast={showToast} isConfigured={isConfigured} />
      )}

      {activeTab === 'riyas_gallery' && (
        <RiyasGalleryModule showToast={showToast} isConfigured={isConfigured} />
      )}

      {activeTab === 'inquiries' && (
        <InquiriesModule showToast={showToast} isConfigured={isConfigured} isSuperAdmin={isSuperAdmin} />
      )}

      {activeTab === 'branding' && (
        <BrandingModule showToast={showToast} isConfigured={isConfigured} />
      )}

      {activeTab === 'social_links' && (
        <SocialLinksModule showToast={showToast} isConfigured={isConfigured} />
      )}

      {activeTab === 'sections' && (
        <SectionVisibilityModule showToast={showToast} isConfigured={isConfigured} />
      )}

      {activeTab === 'seo' && (
        <SeoModule showToast={showToast} isConfigured={isConfigured} />
      )}

      {activeTab === 'logs' && (
        <AuditLogsModule isConfigured={isConfigured} />
      )}

      {activeTab === 'admins' && (
        <AdminRbacModule showToast={showToast} isConfigured={isConfigured} isSuperAdmin={isSuperAdmin} />
      )}
    </AdminLayout>
  );
};
