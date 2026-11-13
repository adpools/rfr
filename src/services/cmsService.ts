import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { timelineData } from '../data/timelineData';
import { testimonialsData } from '../data/testimonialsData';
import { clientsAndPartnersList } from '../data/partnersClientsData';
import { pressData } from '../data/pressData';
import { galleryData } from '../data/galleryData';
import { servicesData } from '../data/servicesData';
import { talentData } from '../data/talentData';
import { ecosystemNodes } from '../data/ecosystemData';
import { ServiceItem, EcosystemNode } from '../types';

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
  const honey = inquiry.bot_honey_field !== undefined && inquiry.bot_honey_field !== null && inquiry.bot_honey_field.trim() !== ''
    ? inquiry.bot_honey_field.trim()
    : null;

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
        bot_honey_field: honey, // Pass actual submitted honeypot field; DB RLS policy enforces (bot_honey_field IS NULL)
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
        .filter((e) => e.year_id === y.id || (e.year_number && e.year_number === y.year))
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

export const getTimelineEvents = async (yearId?: string): Promise<any[]> => {
  if (!isSupabaseConfigured) return [];
  try {
    let query = supabase
      .from('timeline_events')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true });

    if (yearId) {
      query = query.eq('year_id', yearId);
    }

    const { data, error } = await query;
    if (error || !data) return [];
    return data;
  } catch {
    return [];
  }
};

export const getTimelineYearRecord = async (year: number): Promise<any | null> => {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from('timeline_years')
      .select('*')
      .eq('year', year)
      .maybeSingle();

    if (error || !data) return null;
    return data;
  } catch {
    return null;
  }
};

export const ensureTimelineYearExists = async (
  year: number,
  title?: string
): Promise<{ data: any | null; error?: string }> => {
  if (!isSupabaseConfigured) return { data: null, error: 'Database not connected' };
  try {
    // 1. Check if year already exists
    const existing = await getTimelineYearRecord(year);
    if (existing?.id) {
      return { data: existing };
    }

    // 2. Insert new year record with complete schema compliance
    const payload = {
      year,
      title: title || `CHRONICLE OF ${year}`,
      theme: 'MILESTONES & PRODUCTIONS',
      subtitle: `Official chronicle and productions of ${year}`,
      description: `Historical records, brand campaigns, and headline productions curated during ${year}.`,
      image: '/images/final bro.png',
      accent: '#C7A46A',
      sort_order: year,
      is_published: true,
    };

    const { data, error } = await supabase
      .from('timeline_years')
      .insert([payload])
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data };
  } catch (err: any) {
    return { data: null, error: err.message || 'Failed to initialize timeline year' };
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

export interface RawPressArticle {
  id: string;
  slug: string;
  title: string;
  category: string;
  date_label: string;
  author?: string;
  read_time?: string;
  cover_image: string;
  excerpt: string;
  external_url?: string;
  is_featured_home: boolean;
  sort_order: number;
  is_published: boolean;
}

export const getPressClippings = async (): Promise<RawPressArticle[]> => {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase
      .from('press_articles')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true });

    if (error || !data) return [];
    return data as RawPressArticle[];
  } catch {
    return [];
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

export interface GalleryItemRecord {
  id?: string;
  title: string;
  category: 'events' | 'shows' | 'shoots';
  caption?: string | null;
  year?: number;
  credits?: string | null;
  image: string;
  dimensions?: 'portrait' | 'landscape' | 'square';
  tags?: string[];
  video_embed_url?: string | null;
  drive_view_url?: string | null;
  has_video?: boolean;
  sort_order?: number;
  is_published?: boolean;
  created_at?: string;
  updated_at?: string;
}

export const getGalleryItemsAdmin = async (): Promise<GalleryItemRecord[]> => {
  if (!isSupabaseConfigured) {
    return galleryData.map((item, idx) => ({
      id: item.id,
      title: item.title,
      category: item.category,
      caption: item.caption,
      year: item.year,
      credits: item.credits,
      image: item.image,
      dimensions: item.dimensions || 'landscape',
      tags: item.tags || [],
      video_embed_url: item.videoEmbedUrl,
      drive_view_url: item.driveViewUrl,
      has_video: Boolean(item.hasVideo),
      sort_order: idx + 1,
      is_published: true,
    }));
  }

  try {
    const { data, error } = await supabase
      .from('gallery_items')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (err: any) {
    console.error('getGalleryItemsAdmin error:', err);
    return [];
  }
};

export const createGalleryItem = async (
  item: Omit<GalleryItemRecord, 'id' | 'created_at' | 'updated_at'>
): Promise<{ success: boolean; data?: any; error?: string }> => {
  if (!item.title?.trim() || !item.image?.trim() || !item.category) {
    return { success: false, error: 'Title, category, and image are required.' };
  }

  if (!isSupabaseConfigured) {
    return { success: true, data: { ...item, id: `local-${Date.now()}` } };
  }

  try {
    const payload = {
      title: item.title.trim(),
      category: item.category,
      caption: item.caption?.trim() || null,
      year: Number(item.year) || 2026,
      credits: item.credits?.trim() || null,
      image: item.image.trim(),
      dimensions: item.dimensions || 'landscape',
      tags: Array.isArray(item.tags) ? item.tags : [],
      video_embed_url: item.video_embed_url?.trim() || null,
      drive_view_url: item.drive_view_url?.trim() || null,
      has_video: Boolean(item.has_video),
      sort_order: Number(item.sort_order) || 0,
      is_published: item.is_published !== undefined ? Boolean(item.is_published) : true,
    };

    const { data, error } = await supabase
      .from('gallery_items')
      .insert([payload])
      .select()
      .single();

    if (error) return { success: false, error: error.message };
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to create gallery item' };
  }
};

export const updateGalleryItem = async (
  id: string,
  item: Partial<GalleryItemRecord>
): Promise<{ success: boolean; data?: any; error?: string }> => {
  if (!id) return { success: false, error: 'Item ID is required.' };

  if (!isSupabaseConfigured) {
    return { success: true };
  }

  try {
    const payload: any = {
      updated_at: new Date().toISOString(),
    };

    if (item.title !== undefined) payload.title = item.title.trim();
    if (item.category !== undefined) payload.category = item.category;
    if (item.caption !== undefined) payload.caption = item.caption ? item.caption.trim() : null;
    if (item.year !== undefined) payload.year = Number(item.year) || 2026;
    if (item.credits !== undefined) payload.credits = item.credits ? item.credits.trim() : null;
    if (item.image !== undefined) payload.image = item.image.trim();
    if (item.dimensions !== undefined) payload.dimensions = item.dimensions;
    if (item.tags !== undefined) payload.tags = Array.isArray(item.tags) ? item.tags : [];
    if (item.video_embed_url !== undefined) payload.video_embed_url = item.video_embed_url ? item.video_embed_url.trim() : null;
    if (item.drive_view_url !== undefined) payload.drive_view_url = item.drive_view_url ? item.drive_view_url.trim() : null;
    if (item.has_video !== undefined) payload.has_video = Boolean(item.has_video);
    if (item.sort_order !== undefined) payload.sort_order = Number(item.sort_order) || 0;
    if (item.is_published !== undefined) payload.is_published = Boolean(item.is_published);

    const { data, error } = await supabase
      .from('gallery_items')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) return { success: false, error: error.message };
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update gallery item' };
  }
};

export const deleteGalleryItem = async (
  id: string
): Promise<{ success: boolean; error?: string }> => {
  if (!id) return { success: false, error: 'Item ID is required.' };

  if (!isSupabaseConfigured) {
    return { success: true };
  }

  try {
    const { error } = await supabase
      .from('gallery_items')
      .delete()
      .eq('id', id);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete gallery item' };
  }
};

export const toggleGalleryItemPublished = async (
  id: string,
  isPublished: boolean
): Promise<{ success: boolean; error?: string }> => {
  return updateGalleryItem(id, { is_published: isPublished });
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
  career_milestones?: any[];
  stats?: Record<string, string>;
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
    testimonialsCount: 3,
    partnersCount: 20,
    pressCount: 8,
    inquiriesCount: 0,
    projectsCount: 12,
    modelsCount: 12,
    influencersCount: 10,
    galleryCount: 13,
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
      supabase.from('riyas_gallery_items').select('*', { count: 'exact', head: true }),
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

// ==============================================================================
// 14. SERVICES CATALOG & ECOSYSTEM & MEDIA VIDEOS
// ==============================================================================
export const getServicesCatalog = async (categoryFilter?: string): Promise<ServiceItem[]> => {
  if (!isSupabaseConfigured) {
    if (!categoryFilter || categoryFilter === 'all') return servicesData;
    return servicesData.filter((s) => s.category === categoryFilter);
  }

  try {
    // 1. Fetch main services spectrum from page_content where page_slug = 'services'
    const { data: mainData, error: mainError } = await supabase
      .from('page_content')
      .select('content')
      .eq('page_slug', 'services')
      .eq('is_published', true)
      .maybeSingle();

    let items: ServiceItem[] = servicesData;
    if (!mainError && mainData?.content && Array.isArray(mainData.content.services) && mainData.content.services.length > 0) {
      items = mainData.content.services;
    }

    // 2. Overlay individual service customizations from page_content (page_slug like 'service_%')
    const { data: individualRows, error: indError } = await supabase
      .from('page_content')
      .select('page_slug, title, subtitle, content')
      .like('page_slug', 'service_%')
      .eq('is_published', true);

    if (!indError && individualRows && individualRows.length > 0) {
      items = items.map((item) => {
        const match = individualRows.find((r) => r.page_slug === `service_${item.slug}`);
        if (!match) return item;
        const c = match.content || {};
        return {
          ...item,
          title: match.title || item.title,
          subheading: match.subtitle || item.subheading,
          description: c.description || c.leadNarrative || item.description,
          detailedOverview: c.detailedOverview || c.secondaryNarrative || item.detailedOverview,
          deliverables: (Array.isArray(c.deliverables) && c.deliverables.length > 0)
            ? c.deliverables
            : item.deliverables,
          keyHighlights: (Array.isArray(c.keyHighlights) && c.keyHighlights.length > 0)
            ? c.keyHighlights
            : item.keyHighlights,
          badge: c.badge || item.badge,
          image: c.image || item.image,
        };
      });
    }

    if (!categoryFilter || categoryFilter === 'all') return items;
    return items.filter((s) => s.category === categoryFilter);
  } catch (err) {
    console.warn('getServicesCatalog fallback:', err);
    if (!categoryFilter || categoryFilter === 'all') return servicesData;
    return servicesData.filter((s) => s.category === categoryFilter);
  }
};

export const getEcosystemNodes = async (): Promise<EcosystemNode[]> => {
  if (!isSupabaseConfigured) return ecosystemNodes;
  try {
    const { data, error } = await supabase
      .from('ecosystem_nodes')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) return ecosystemNodes;

    return data.map((d: any) => ({
      id: d.node_id,
      label: d.label,
      category: d.category,
      description: d.description,
      x: Number(d.x),
      y: Number(d.y),
      z: Number(d.z),
      connections: d.connections || [],
      color: d.color || '#C7A46A',
    }));
  } catch {
    return ecosystemNodes;
  }
};

export const getMediaVideos = async (categoryFilter?: string): Promise<any[]> => {
  if (!isSupabaseConfigured) return [];
  try {
    let query = supabase
      .from('media_videos')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true });

    if (categoryFilter) {
      query = query.eq('category', categoryFilter);
    }

    const { data, error } = await query;
    if (error || !data) return [];
    return data;
  } catch {
    return [];
  }
};

export interface MediaVideoItem {
  id?: string;
  title: string;
  category: string;
  description?: string | null;
  video_url?: string | null;
  video_embed_url?: string | null;
  thumbnail_url?: string | null;
  duration?: string | null;
  aspect_ratio?: string | null;
  tags?: string[];
  sort_order?: number;
  is_published?: boolean;
  created_at?: string;
  updated_at?: string;
}

export const getMediaVideosAdmin = async (): Promise<MediaVideoItem[]> => {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase
      .from('media_videos')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (err: any) {
    console.error('getMediaVideosAdmin error:', err);
    return [];
  }
};

export const createMediaVideo = async (
  item: Omit<MediaVideoItem, 'id' | 'created_at' | 'updated_at'>
): Promise<{ success: boolean; data?: any; error?: string }> => {
  if (!item.title?.trim()) {
    return { success: false, error: 'Video title is required.' };
  }

  if (!isSupabaseConfigured) {
    return { success: true, data: { ...item, id: `local-${Date.now()}` } };
  }

  try {
    const payload = {
      title: item.title.trim(),
      category: item.category?.trim() || 'Highlight',
      description: item.description?.trim() || null,
      video_url: item.video_url?.trim() || null,
      video_embed_url: item.video_embed_url?.trim() || null,
      thumbnail_url: item.thumbnail_url?.trim() || null,
      duration: item.duration?.trim() || null,
      aspect_ratio: item.aspect_ratio || '16:9',
      tags: Array.isArray(item.tags) ? item.tags : [],
      sort_order: Number(item.sort_order) || 0,
      is_published: item.is_published !== undefined ? Boolean(item.is_published) : true,
    };

    const { data, error } = await supabase
      .from('media_videos')
      .insert([payload])
      .select()
      .single();

    if (error) return { success: false, error: error.message };
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to create media video' };
  }
};

export const updateMediaVideo = async (
  id: string,
  item: Partial<MediaVideoItem>
): Promise<{ success: boolean; data?: any; error?: string }> => {
  if (!id) return { success: false, error: 'Video ID is required.' };

  if (!isSupabaseConfigured) {
    return { success: true };
  }

  try {
    const payload: any = {
      updated_at: new Date().toISOString(),
    };

    if (item.title !== undefined) payload.title = item.title.trim();
    if (item.category !== undefined) payload.category = item.category.trim();
    if (item.description !== undefined) payload.description = item.description ? item.description.trim() : null;
    if (item.video_url !== undefined) payload.video_url = item.video_url ? item.video_url.trim() : null;
    if (item.video_embed_url !== undefined) payload.video_embed_url = item.video_embed_url ? item.video_embed_url.trim() : null;
    if (item.thumbnail_url !== undefined) payload.thumbnail_url = item.thumbnail_url ? item.thumbnail_url.trim() : null;
    if (item.duration !== undefined) payload.duration = item.duration ? item.duration.trim() : null;
    if (item.aspect_ratio !== undefined) payload.aspect_ratio = item.aspect_ratio || '16:9';
    if (item.tags !== undefined) payload.tags = Array.isArray(item.tags) ? item.tags : [];
    if (item.sort_order !== undefined) payload.sort_order = Number(item.sort_order) || 0;
    if (item.is_published !== undefined) payload.is_published = Boolean(item.is_published);

    const { data, error } = await supabase
      .from('media_videos')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) return { success: false, error: error.message };
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update media video' };
  }
};

export const deleteMediaVideo = async (
  id: string
): Promise<{ success: boolean; error?: string }> => {
  if (!id) return { success: false, error: 'Video ID is required.' };

  if (!isSupabaseConfigured) {
    return { success: true };
  }

  try {
    const { error } = await supabase
      .from('media_videos')
      .delete()
      .eq('id', id);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete media video' };
  }
};

export const toggleMediaVideoPublished = async (
  id: string,
  isPublished: boolean
): Promise<{ success: boolean; error?: string }> => {
  return updateMediaVideo(id, { is_published: isPublished });
};

export const getTicContent = async (): Promise<any | null> => {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from('tic_content')
      .select('*')
      .eq('is_published', true)
      .limit(1)
      .maybeSingle();

    if (error || !data) return null;
    return data;
  } catch {
    return null;
  }
};

export const getProjectsPortfolio = async (): Promise<any[]> => {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase
      .from('projects_portfolio')
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
// 15. UNIFIED PAGE CONTENT (FOR THE 6 STATIC PAGE GROUPS)
// ==============================================================================
export interface PageContentRecord<T = any> {
  page_slug: string;
  title: string;
  subtitle?: string;
  content: T;
  is_published: boolean;
  updated_at?: string;
}

export const getPageContent = async <T = any>(
  slug: string,
  fallback: { title?: string; subtitle?: string; content: T }
): Promise<{ title: string; subtitle: string; content: T }> => {
  if (!isSupabaseConfigured) {
    return {
      title: fallback.title || '',
      subtitle: fallback.subtitle || '',
      content: fallback.content,
    };
  }

  try {
    const { data, error } = await supabase
      .from('page_content')
      .select('*')
      .eq('page_slug', slug)
      .eq('is_published', true)
      .maybeSingle();

    if (error || !data) {
      return {
        title: fallback.title || '',
        subtitle: fallback.subtitle || '',
        content: fallback.content,
      };
    }

    return {
      title: data.title || fallback.title || '',
      subtitle: data.subtitle ?? fallback.subtitle ?? '',
      content: (data.content && typeof data.content === 'object' && Object.keys(data.content).length > 0)
        ? { ...fallback.content, ...data.content }
        : fallback.content,
    };
  } catch {
    return {
      title: fallback.title || '',
      subtitle: fallback.subtitle || '',
      content: fallback.content,
    };
  }
};

// ==============================================================================
// SEO METADATA LOOKUP (DYNAMIC ROUTE INGESTION)
// ==============================================================================
export interface SeoMetadataItem {
  id?: string;
  page_path: string;
  meta_title?: string;
  meta_description?: string;
  keywords?: string[];
  og_image_url?: string;
  canonical_url?: string;
}

export const getSeoMetadata = async (path: string): Promise<SeoMetadataItem | null> => {
  if (!isSupabaseConfigured) return null;
  try {
    const cleanPath = path === '/' ? '/' : path.replace(/\/+$/, '');
    const { data, error } = await supabase
      .from('seo_metadata')
      .select('*')
      .or(`page_path.eq.${cleanPath},page_path.eq.${cleanPath}/`)
      .limit(1)
      .maybeSingle();

    if (error || !data) return null;
    return {
      id: data.id,
      page_path: data.page_path || data.route_path,
      meta_title: data.meta_title,
      meta_description: data.meta_description,
      keywords: Array.isArray(data.keywords) ? data.keywords : [],
      og_image_url: data.og_image_url,
      canonical_url: data.canonical_url,
    };
  } catch {
    return null;
  }
};
