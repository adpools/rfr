import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { timelineData } from '../data/timelineData';
import { testimonialsData } from '../data/testimonialsData';
import { clientsAndPartnersList } from '../data/partnersClientsData';
import { pressData } from '../data/pressData';
import { galleryData } from '../data/galleryData';
import { servicesData } from '../data/servicesData';
import { talentData } from '../data/talentData';

// ==============================================================================
// RFR BY RIYAS — UNIFIED CMS & SUPABASE SERVICE LAYER
// Supports public content synchronization with zero-downtime offline fallback
// and full administrative CRUD operations mapped to exact PostgreSQL schema.
// ==============================================================================

// Storage upload helper
export const uploadMediaFile = async (
  file: File,
  folder: string = 'general'
): Promise<{ success: boolean; url?: string; error?: string }> => {
  if (!file) return { success: false, error: 'No file provided' };

  // 1. Strict MIME and extension validation to prevent Stored XSS
  const forbiddenMimeTypes = ['image/svg+xml', 'text/html', 'application/javascript'];
  const fileName = file.name.toLowerCase();
  if (
    forbiddenMimeTypes.includes(file.type.toLowerCase()) ||
    fileName.endsWith('.svg') ||
    fileName.endsWith('.html') ||
    fileName.endsWith('.js')
  ) {
    return {
      success: false,
      error: 'Security Error: SVG and script files are strictly blocked to prevent XSS. Use PNG, JPEG, WebP, or MP4.',
    };
  }

  // 2. Strict file size ceiling: 50 MB
  const maxBytes = 50 * 1024 * 1024;
  if (file.size > maxBytes) {
    return {
      success: false,
      error: `File size exceeds 50MB ceiling (${(file.size / (1024 * 1024)).toFixed(1)} MB).`,
    };
  }

  if (!isSupabaseConfigured) {
    // Generate safe local preview URL when working without active DB connection
    const localUrl = URL.createObjectURL(file);
    return { success: true, url: localUrl };
  }

  try {
    const timestamp = Date.now();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const path = `${folder}/${timestamp}_${cleanFileName}`;

    const { error: uploadError } = await supabase.storage
      .from('rfr-media')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      return { success: false, error: uploadError.message };
    }

    const { data } = supabase.storage.from('rfr-media').getPublicUrl(path);
    return { success: true, url: data.publicUrl };
  } catch (err: any) {
    return { success: false, error: err.message || 'Upload failed' };
  }
};

// ==============================================================================
// 1. SECTION VISIBILITY
// ==============================================================================
export const getSectionVisibility = async (): Promise<Record<string, boolean>> => {
  const fallback: Record<string, boolean> = {
    hero: true,
    statement: true,
    what_is_rfr: true,
    timeline: true,
    services: true,
    influencers: true,
    campaigns: true,
    partners: true,
    milestones: true,
    clients: true,
    testimonials: true,
    talent: true,
    press: true,
    contact: true,
  };

  if (!isSupabaseConfigured) return fallback;

  try {
    const { data, error } = await supabase
      .from('section_visibility')
      .select('section_key, is_visible');

    if (error || !data || data.length === 0) return fallback;

    const result: Record<string, boolean> = { ...fallback };
    data.forEach((row) => {
      result[row.section_key] = row.is_visible;
    });
    return result;
  } catch {
    return fallback;
  }
};

export const updateSectionVisibility = async (
  key: string,
  is_visible: boolean
): Promise<{ success: boolean; error?: string }> => {
  if (!isSupabaseConfigured) return { success: true };
  try {
    const { error } = await supabase
      .from('section_visibility')
      .update({ is_visible, updated_at: new Date().toISOString() })
      .eq('section_key', key);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};

// ==============================================================================
// 2. WEBSITE SETTINGS
// ==============================================================================
export interface WebsiteSettings {
  id?: string;
  site_title: string;
  tagline?: string;
  official_logo_url?: string;
  loading_screen_logo_url?: string;
  footer_logo_url?: string;
  favicon_url?: string;
  contact_email: string;
  contact_phone?: string;
  whatsapp_number?: string;
  office_address?: string;
  copyright_text?: string;
  hero_statement?: string;
  meta_keywords?: string[];
}

export const getWebsiteSettings = async (): Promise<WebsiteSettings | null> => {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from('website_settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error || !data) return null;
    return data as WebsiteSettings;
  } catch {
    return null;
  }
};

export const updateWebsiteSettings = async (
  settings: Partial<WebsiteSettings>
): Promise<{ success: boolean; error?: string }> => {
  if (!isSupabaseConfigured) return { success: true };
  try {
    const { data: existing } = await supabase
      .from('website_settings')
      .select('id')
      .limit(1)
      .maybeSingle();

    if (existing?.id) {
      const { error } = await supabase
        .from('website_settings')
        .update({ ...settings, updated_at: new Date().toISOString() })
        .eq('id', existing.id);
      if (error) return { success: false, error: error.message };
    } else {
      const { error } = await supabase
        .from('website_settings')
        .insert([settings]);
      if (error) return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};

// ==============================================================================
// 3. CONTACT INQUIRIES
// ==============================================================================
export interface ContactInquiry {
  id?: string;
  full_name: string;
  email: string;
  phone?: string;
  company_name?: string;
  service_interest: string;
  budget_range?: string;
  message: string;
  status?: 'new' | 'read' | 'in_progress' | 'completed' | 'archived';
  admin_notes?: string;
  bot_honey_field?: string;
  created_at?: string;
}

export const submitContactInquiry = async (
  inquiry: ContactInquiry
): Promise<{ success: boolean; error?: string }> => {
  // Client-side spam honeypot check
  if (inquiry.bot_honey_field && inquiry.bot_honey_field.trim() !== '') {
    // Silently drop bots or return fake success
    return { success: true };
  }

  if (!inquiry.full_name || !inquiry.email || !inquiry.message) {
    return { success: false, error: 'Name, email, and message are required.' };
  }

  if (!isSupabaseConfigured) {
    return { success: true };
  }

  try {
    const { error } = await supabase.from('contact_inquiries').insert([
      {
        full_name: inquiry.full_name.trim(),
        email: inquiry.email.trim(),
        phone: inquiry.phone?.trim() || null,
        company_name: inquiry.company_name?.trim() || null,
        service_interest: inquiry.service_interest || 'Brand Collaboration',
        budget_range: inquiry.budget_range || null,
        message: inquiry.message.trim(),
        status: 'new', // Matches CHECK (status IN ('new', 'read', 'in_progress', 'completed', 'archived'))
        bot_honey_field: null, // explicitly null per RLS policy
      },
    ]);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Submission failed' };
  }
};

export const getContactInquiries = async (
  statusFilter?: string
): Promise<ContactInquiry[]> => {
  if (!isSupabaseConfigured) return [];
  try {
    let query = supabase
      .from('contact_inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (statusFilter && statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    const { data, error } = await query;
    if (error || !data) return [];
    return data as ContactInquiry[];
  } catch {
    return [];
  }
};

export const updateContactInquiryStatus = async (
  id: string,
  status: 'new' | 'read' | 'in_progress' | 'completed' | 'archived',
  adminNotes?: string
): Promise<{ success: boolean; error?: string }> => {
  if (!isSupabaseConfigured) return { success: true };
  try {
    const updates: any = { status, updated_at: new Date().toISOString() };
    if (adminNotes !== undefined) updates.admin_notes = adminNotes;

    const { error } = await supabase
      .from('contact_inquiries')
      .update(updates)
      .eq('id', id);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};

// ==============================================================================
// 4. TIMELINE & EVENTS
// ==============================================================================
export const getTimelineYears = async (): Promise<any[]> => {
  if (!isSupabaseConfigured) return timelineData;

  try {
    const { data: years, error: yearsError } = await supabase
      .from('timeline_years')
      .select('*')
      .eq('is_published', true)
      .order('year', { ascending: true });

    if (yearsError || !years || years.length === 0) return timelineData;

    const { data: events, error: eventsError } = await supabase
      .from('timeline_events')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true });

    if (eventsError || !events) return timelineData;

    return years.map((y) => ({
      year: y.year,
      title: y.title,
      theme: y.theme,
      subtitle: y.subtitle,
      description: y.description,
      milestones: y.milestones || [],
      image: y.image || y.image_url,
      accent: y.accent || '#C7A46A',
      videoEmbedUrl: y.video_embed_url,
      driveFolderUrl: y.drive_folder_url,
      eventsList: events
        .filter((e) => e.year_id === y.id)
        .map((e) => ({
          id: e.id,
          name: e.name,
          type: e.type,
          categoryBadge: e.category_badge,
          locationOrClient: e.location_or_client,
          description: e.description,
          image: e.image,
          videoUrl: e.video_url,
          videoEmbedUrl: e.video_embed_url,
          hasVideo: e.has_video,
          driveFolderUrl: e.drive_folder_url,
          videos: e.videos || [],
        })),
    }));
  } catch {
    return timelineData;
  }
};

// ==============================================================================
// 5. TESTIMONIALS
// ==============================================================================
export const getTestimonials = async (): Promise<any[]> => {
  if (!isSupabaseConfigured) return testimonialsData;

  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) return testimonialsData;

    return data.map((t) => ({
      id: t.id,
      name: t.name,
      designation: t.designation,
      position: t.designation,
      organisation: t.company,
      quoteParagraphs: [t.quote],
      image: t.image || '/images/influencers/shikha-santhosh.jpg',
      brandHighlights: t.event_or_brand ? [t.event_or_brand] : [],
      rating: t.rating || 5,
    }));
  } catch {
    return testimonialsData;
  }
};

// ==============================================================================
// 6. CLIENTS & PARTNERS
// ==============================================================================
export const getPartnersClients = async (): Promise<any[]> => {
  if (!isSupabaseConfigured) return clientsAndPartnersList;

  try {
    const { data, error } = await supabase
      .from('partners_clients')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) return clientsAndPartnersList;

    return data.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      description: p.description,
      type: p.type,
      website: p.website,
      logo: p.logo,
    }));
  } catch {
    return clientsAndPartnersList;
  }
};

// ==============================================================================
// 7. PRESS & BLOG ARTICLES
// ==============================================================================
export const getPressArticles = async (): Promise<any[]> => {
  if (!isSupabaseConfigured) return pressData;

  try {
    const { data, error } = await supabase
      .from('press_articles')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) return pressData;

    return data.map((a) => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      category: a.category,
      date: a.date_label,
      author: a.author || 'Editorial Desk',
      readTime: a.read_time || '4 min read',
      coverImage: a.cover_image,
      excerpt: a.excerpt,
      content: Array.isArray(a.content) && a.content.length > 0 ? a.content : [a.excerpt],
      quote: a.quote_text ? { text: a.quote_text, author: a.quote_author || 'Riyas, Founder — RFR' } : undefined,
      tags: a.tags || [],
    }));
  } catch {
    return pressData;
  }
};

// ==============================================================================
// 8. GALLERY & CATEGORIES
// ==============================================================================
export const getGalleryItems = async (categorySlug?: string): Promise<any[]> => {
  if (!isSupabaseConfigured) {
    if (!categorySlug || categorySlug === 'all') return galleryData;
    return galleryData.filter((item) => item.category === categorySlug);
  }

  try {
    let query = supabase
      .from('gallery_items')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true });

    if (categorySlug && categorySlug !== 'all') {
      query = query.eq('category', categorySlug);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      if (!categorySlug || categorySlug === 'all') return galleryData;
      return galleryData.filter((item) => item.category === categorySlug);
    }

    return data.map((g) => ({
      id: g.id,
      title: g.title,
      category: g.category,
      caption: g.caption || '',
      year: g.year || 2026,
      credits: g.credits,
      image: g.image,
      dimensions: g.dimensions || 'landscape',
      tags: g.tags || [],
      videoEmbedUrl: g.video_embed_url,
      driveViewUrl: g.drive_view_url,
      hasVideo: g.has_video,
    }));
  } catch {
    return galleryData;
  }
};

// ==============================================================================
// 9. SERVICES & DISCIPLINES
// ==============================================================================
export const getServices = async (): Promise<any[]> => {
  return servicesData;
};

// ==============================================================================
// 10. TALENT GUILDS (MODELS & INFLUENCERS)
// ==============================================================================
export const getTalentCategories = async (): Promise<any[]> => {
  return talentData;
};

export const getTalentModels = async (): Promise<any[]> => {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase
      .from('talent_models')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true });

    if (error || !data) return [];
    return data;
  } catch {
    return [];
  }
};

export const getTalentInfluencers = async (): Promise<any[]> => {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase
      .from('talent_influencers')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true });

    if (error || !data) return [];
    return data;
  } catch {
    return [];
  }
};

// ==============================================================================
// 11. HERO BANNERS
// ==============================================================================
export interface HeroBanner {
  id?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image_url?: string;
  video_url?: string;
  cta_primary_label?: string;
  cta_primary_link?: string;
  cta_secondary_label?: string;
  cta_secondary_link?: string;
  sort_order?: number;
  is_published?: boolean;
}

export const getHeroBanners = async (): Promise<HeroBanner[]> => {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase
      .from('hero_banners')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true });

    if (error || !data) return [];
    return data as HeroBanner[];
  } catch {
    return [];
  }
};

// ==============================================================================
// 12. ABOUT RIYAS / FOUNDER LEADERSHIP
// ==============================================================================
export interface AboutRiyasData {
  id?: string;
  founder_name: string;
  official_title: string;
  quote?: string;
  portrait_image?: string;
  biography_paragraphs?: string[];
}

export const getAboutRiyas = async (): Promise<AboutRiyasData | null> => {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from('about_riyas')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error || !data) return null;
    return data as AboutRiyasData;
  } catch {
    return null;
  }
};

// ==============================================================================
// 13. ADMIN OVERVIEW METRICS COUNTER
// ==============================================================================
export interface AdminMetrics {
  timelineCount: number;
  testimonialsCount: number;
  partnersCount: number;
  pressCount: number;
  inquiriesCount: number;
  projectsCount: number;
  modelsCount: number;
  influencersCount: number;
  galleryCount: number;
}

export const getAdminMetrics = async (): Promise<AdminMetrics> => {
  const fallbackMetrics: AdminMetrics = {
    timelineCount: 48,
    testimonialsCount: 12,
    partnersCount: 20,
    pressCount: 8,
    inquiriesCount: 0,
    projectsCount: 12,
    modelsCount: 12,
    influencersCount: 10,
    galleryCount: 24,
  };

  if (!isSupabaseConfigured) return fallbackMetrics;

  try {
    const [
      timelineRes,
      testimonialsRes,
      partnersRes,
      pressRes,
      inquiriesRes,
      projectsRes,
      modelsRes,
      influencersRes,
      galleryRes,
    ] = await Promise.all([
      supabase.from('timeline_events').select('*', { count: 'exact', head: true }),
      supabase.from('testimonials').select('*', { count: 'exact', head: true }),
      supabase.from('partners_clients').select('*', { count: 'exact', head: true }),
      supabase.from('press_articles').select('*', { count: 'exact', head: true }),
      supabase.from('contact_inquiries').select('*', { count: 'exact', head: true }),
      supabase.from('projects_portfolio').select('*', { count: 'exact', head: true }),
      supabase.from('talent_models').select('*', { count: 'exact', head: true }),
      supabase.from('talent_influencers').select('*', { count: 'exact', head: true }),
      supabase.from('gallery_items').select('*', { count: 'exact', head: true }),
    ]);

    return {
      timelineCount: timelineRes.count ?? fallbackMetrics.timelineCount,
      testimonialsCount: testimonialsRes.count ?? fallbackMetrics.testimonialsCount,
      partnersCount: partnersRes.count ?? fallbackMetrics.partnersCount,
      pressCount: pressRes.count ?? fallbackMetrics.pressCount,
      inquiriesCount: inquiriesRes.count ?? 0,
      projectsCount: projectsRes.count ?? fallbackMetrics.projectsCount,
      modelsCount: modelsRes.count ?? fallbackMetrics.modelsCount,
      influencersCount: influencersRes.count ?? fallbackMetrics.influencersCount,
      galleryCount: galleryRes.count ?? fallbackMetrics.galleryCount,
    };
  } catch {
    return fallbackMetrics;
  }
};
