-- ==============================================================================
-- RFR BY RIYAS — AUDITED PRODUCTION DATABASE MIGRATION SCRIPT (VERSION 2.1)
-- Strict Compliance: Free Tier, Zero Destructive Overwrites, Anti-Spam, RLS
-- Security Hardened: Non-recursive RBAC, Anti-Truncation, SVG Lockdown,
-- Super-Admin Only Inquiries, Strict RESTRICT Rollback Compatibility
-- Target: Supabase PostgreSQL
-- ==============================================================================

-- 1. Essential Cryptographic Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- SECTION 1: GLOBAL UTILITY & IMMUTABILITY TRIGGER FUNCTIONS
-- ==============================================================================

-- Universal updated_at timestamp auto-updater
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- Immutability enforcer: Blocks UPDATE, DELETE, and TRUNCATE on audit logs
CREATE OR REPLACE FUNCTION public.prevent_log_tampering()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    RAISE EXCEPTION 'Audit logs are strictly immutable and cannot be updated, deleted, or truncated.';
END;
$$;

-- Protect the last active super_admin from accidental deactivation, demotion, or deletion
CREATE OR REPLACE FUNCTION public.protect_last_super_admin()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    remaining_count INT;
BEGIN
    IF (TG_OP = 'DELETE' AND OLD.role = 'super_admin') OR 
       (TG_OP = 'UPDATE' AND OLD.role = 'super_admin' AND (NEW.role <> 'super_admin' OR NEW.is_active = false)) THEN
        
        SELECT COUNT(*) INTO remaining_count
        FROM public.admin_users
        WHERE role = 'super_admin' 
          AND is_active = true 
          AND id <> OLD.id;

        IF remaining_count = 0 THEN
            RAISE EXCEPTION 'Action aborted: Cannot deactivate, demote, or delete the sole remaining active super_admin.';
        END IF;
    END IF;
    
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    END IF;
    RETURN NEW;
END;
$$;

-- Revoke direct execution of internal trigger functions from public
REVOKE ALL ON FUNCTION public.set_updated_at() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.prevent_log_tampering() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.protect_last_super_admin() FROM PUBLIC;

-- ==============================================================================
-- SECTION 2: ADMINISTRATOR RBAC & VERIFICATION (NON-RECURSIVE)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('super_admin', 'editor')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_active ON public.admin_users(is_active);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON public.admin_users(role);

-- Attach super_admin protection trigger
DROP TRIGGER IF EXISTS trg_protect_last_super_admin ON public.admin_users;
CREATE TRIGGER trg_protect_last_super_admin
BEFORE UPDATE OR DELETE ON public.admin_users
FOR EACH ROW EXECUTE FUNCTION public.protect_last_super_admin();

-- Attach updated_at trigger
DROP TRIGGER IF EXISTS trg_admin_users_updated_at ON public.admin_users;
CREATE TRIGGER trg_admin_users_updated_at
BEFORE UPDATE ON public.admin_users
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Function: Checks if the caller is an active administrator (super_admin or editor)
-- Runs as SECURITY DEFINER with fixed search_path to prevent privilege escalation.
-- Owned by postgres: exempt from RLS on admin_users, preventing recursive policy evaluation.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    admin_active BOOLEAN;
BEGIN
    IF auth.uid() IS NULL THEN
        RETURN false;
    END IF;

    SELECT is_active INTO admin_active
    FROM public.admin_users
    WHERE id = auth.uid()
    LIMIT 1;

    RETURN COALESCE(admin_active, false);
END;
$$;

-- Function: Checks if the caller is an active super_admin (exclusive privileges)
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    user_role TEXT;
    user_active BOOLEAN;
BEGIN
    IF auth.uid() IS NULL THEN
        RETURN false;
    END IF;

    SELECT role, is_active INTO user_role, user_active
    FROM public.admin_users
    WHERE id = auth.uid()
    LIMIT 1;

    RETURN (COALESCE(user_active, false) = true AND COALESCE(user_role, '') = 'super_admin');
END;
$$;

-- Function Permissions: Strictly restricted
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;

REVOKE ALL ON FUNCTION public.is_super_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_super_admin() TO authenticated;

-- ==============================================================================
-- SECTION 3: 20 STRUCTURED DATABASE TABLES WITH INTEGRITY CONSTRAINTS
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. website_settings
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.website_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_title TEXT NOT NULL DEFAULT 'RFR BY RIYAS',
    tagline TEXT,
    official_logo_url TEXT DEFAULT '/images/final bro.png',
    loading_screen_logo_url TEXT DEFAULT '/images/final bro.png',
    footer_logo_url TEXT DEFAULT '/images/final bro.png',
    favicon_url TEXT DEFAULT '/favicon.ico',
    contact_email TEXT NOT NULL DEFAULT 'advriyas@gmail.com',
    contact_phone TEXT,
    whatsapp_number TEXT,
    office_address TEXT,
    copyright_text TEXT DEFAULT '© 2026 RFR BY RIYAS. All rights reserved.',
    hero_statement TEXT,
    meta_keywords TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_website_settings_updated_at ON public.website_settings;
CREATE TRIGGER trg_website_settings_updated_at
BEFORE UPDATE ON public.website_settings
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ------------------------------------------------------------------------------
-- 2. hero_banners
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.hero_banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    eyebrow TEXT DEFAULT 'THE LUXURY CREATIVE ECOSYSTEM',
    title TEXT NOT NULL,
    subtitle TEXT,
    image_url TEXT,
    video_url TEXT,
    cta_primary_label TEXT DEFAULT 'EXPLORE CHRONICLE',
    cta_primary_link TEXT DEFAULT '/timeline',
    cta_secondary_label TEXT DEFAULT 'INITIATE COLLABORATION',
    cta_secondary_link TEXT DEFAULT '/contact',
    sort_order INT NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_hero_banners_order ON public.hero_banners(sort_order, is_published);

DROP TRIGGER IF EXISTS trg_hero_banners_updated_at ON public.hero_banners;
CREATE TRIGGER trg_hero_banners_updated_at
BEFORE UPDATE ON public.hero_banners
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ------------------------------------------------------------------------------
-- 3. projects_portfolio
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects_portfolio (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    client TEXT,
    category TEXT NOT NULL CHECK (category IN ('Runway', 'Gala', 'Campaign', 'Shoot', 'Digital', 'Commercial')),
    year INT NOT NULL DEFAULT 2026,
    cover_image TEXT NOT NULL,
    accent_color TEXT DEFAULT '#C7A46A',
    excerpt TEXT,
    description TEXT,
    deliverables TEXT[],
    tags TEXT[],
    video_url TEXT,
    video_embed_url TEXT,
    gallery_images TEXT[],
    is_featured_home BOOLEAN NOT NULL DEFAULT false,
    sort_order INT NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects_portfolio(slug);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects_portfolio(is_featured_home, sort_order) WHERE is_published = true;

DROP TRIGGER IF EXISTS trg_projects_updated_at ON public.projects_portfolio;
CREATE TRIGGER trg_projects_updated_at
BEFORE UPDATE ON public.projects_portfolio
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ------------------------------------------------------------------------------
-- 4. timeline_years
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.timeline_years (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year INT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    theme TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    description TEXT NOT NULL,
    milestones TEXT[] DEFAULT '{}',
    image TEXT NOT NULL,
    accent TEXT DEFAULT '#C7A46A',
    video_url TEXT,
    video_embed_url TEXT,
    drive_folder_url TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_timeline_years_year ON public.timeline_years(year DESC);

DROP TRIGGER IF EXISTS trg_timeline_years_updated_at ON public.timeline_years;
CREATE TRIGGER trg_timeline_years_updated_at
BEFORE UPDATE ON public.timeline_years
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ------------------------------------------------------------------------------
-- 5. timeline_events (SAFEGUARD: ON DELETE RESTRICT prevents accidental cascades)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.timeline_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year_id UUID NOT NULL REFERENCES public.timeline_years(id) ON DELETE RESTRICT,
    year_number INT NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('Event', 'Campaign', 'Ad', 'Shoot', 'Music Album', 'Show', 'Podcast')),
    category_badge TEXT,
    location_or_client TEXT,
    description TEXT,
    image TEXT,
    video_url TEXT,
    video_embed_url TEXT,
    has_video BOOLEAN NOT NULL DEFAULT false,
    drive_folder_url TEXT,
    videos JSONB DEFAULT '[]'::jsonb,
    sort_order INT NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_timeline_events_year ON public.timeline_events(year_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_timeline_events_published ON public.timeline_events(is_published);

DROP TRIGGER IF EXISTS trg_timeline_events_updated_at ON public.timeline_events;
CREATE TRIGGER trg_timeline_events_updated_at
BEFORE UPDATE ON public.timeline_events
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ------------------------------------------------------------------------------
-- 6. media_videos
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.media_videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT DEFAULT 'Highlight',
    description TEXT,
    video_url TEXT,
    video_embed_url TEXT,
    thumbnail_url TEXT,
    duration TEXT,
    aspect_ratio TEXT DEFAULT '16:9',
    tags TEXT[],
    sort_order INT NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_media_videos_published ON public.media_videos(is_published, sort_order);

DROP TRIGGER IF EXISTS trg_media_videos_updated_at ON public.media_videos;
CREATE TRIGGER trg_media_videos_updated_at
BEFORE UPDATE ON public.media_videos
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ------------------------------------------------------------------------------
-- 7. gallery_categories & gallery_items
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.gallery_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.gallery_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('events', 'shows', 'shoots')),
    caption TEXT,
    year INT NOT NULL DEFAULT 2026,
    credits TEXT,
    image TEXT NOT NULL,
    dimensions TEXT DEFAULT 'landscape' CHECK (dimensions IN ('portrait', 'landscape', 'square')),
    tags TEXT[] DEFAULT '{}',
    video_embed_url TEXT,
    drive_view_url TEXT,
    has_video BOOLEAN NOT NULL DEFAULT false,
    sort_order INT NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gallery_items_cat ON public.gallery_items(category, sort_order) WHERE is_published = true;

DROP TRIGGER IF EXISTS trg_gallery_items_updated_at ON public.gallery_items;
CREATE TRIGGER trg_gallery_items_updated_at
BEFORE UPDATE ON public.gallery_items
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ------------------------------------------------------------------------------
-- 8. talent_models
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.talent_models (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    tagline TEXT,
    category TEXT DEFAULT 'High Fashion & Runway',
    height TEXT,
    measurements TEXT,
    eye_color TEXT,
    hair_color TEXT,
    headshot_image TEXT NOT NULL,
    portfolio_images TEXT[] DEFAULT '{}',
    instagram_url TEXT,
    bio TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    sort_order INT NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_talent_models_sort ON public.talent_models(sort_order, is_published);

DROP TRIGGER IF EXISTS trg_talent_models_updated_at ON public.talent_models;
CREATE TRIGGER trg_talent_models_updated_at
BEFORE UPDATE ON public.talent_models
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ------------------------------------------------------------------------------
-- 9. talent_influencers
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.talent_influencers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    handle TEXT,
    niche TEXT NOT NULL,
    tier TEXT DEFAULT 'Macro' CHECK (tier IN ('Mega', 'Macro', 'Micro', 'Nano')),
    followers_count TEXT,
    engagement_rate TEXT,
    profile_image TEXT NOT NULL,
    instagram_url TEXT,
    youtube_url TEXT,
    bio TEXT,
    is_featured_home BOOLEAN NOT NULL DEFAULT false,
    sort_order INT NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_talent_influencers_sort ON public.talent_influencers(sort_order, is_published);

DROP TRIGGER IF EXISTS trg_talent_influencers_updated_at ON public.talent_influencers;
CREATE TRIGGER trg_talent_influencers_updated_at
BEFORE UPDATE ON public.talent_influencers
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ------------------------------------------------------------------------------
-- 10. testimonials
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    designation TEXT NOT NULL,
    company TEXT,
    image TEXT NOT NULL,
    quote TEXT NOT NULL,
    rating INT DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
    event_or_brand TEXT,
    is_featured_home BOOLEAN NOT NULL DEFAULT true,
    sort_order INT NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_testimonials_sort ON public.testimonials(sort_order) WHERE is_published = true;

DROP TRIGGER IF EXISTS trg_testimonials_updated_at ON public.testimonials;
CREATE TRIGGER trg_testimonials_updated_at
BEFORE UPDATE ON public.testimonials
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ------------------------------------------------------------------------------
-- 11. press_articles
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.press_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Press', 'News', 'Announcements', 'Collaborations', 'Achievements')),
    date_label TEXT NOT NULL,
    author TEXT DEFAULT 'Editorial Desk',
    read_time TEXT DEFAULT '3 min read',
    cover_image TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT[] NOT NULL DEFAULT '{}',
    quote_text TEXT,
    quote_author TEXT,
    tags TEXT[] DEFAULT '{}',
    external_url TEXT,
    is_featured_home BOOLEAN NOT NULL DEFAULT false,
    sort_order INT NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_press_slug ON public.press_articles(slug);
CREATE INDEX IF NOT EXISTS idx_press_home ON public.press_articles(is_featured_home, sort_order) WHERE is_published = true;

DROP TRIGGER IF EXISTS trg_press_articles_updated_at ON public.press_articles;
CREATE TRIGGER trg_press_articles_updated_at
BEFORE UPDATE ON public.press_articles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ------------------------------------------------------------------------------
-- 12. partners_clients
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.partners_clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('client', 'partner')),
    description TEXT,
    website TEXT,
    logo TEXT NOT NULL,
    is_transparent BOOLEAN NOT NULL DEFAULT true,
    sort_order INT NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_partners_clients_type ON public.partners_clients(type, sort_order) WHERE is_published = true;

DROP TRIGGER IF EXISTS trg_partners_clients_updated_at ON public.partners_clients;
CREATE TRIGGER trg_partners_clients_updated_at
BEFORE UPDATE ON public.partners_clients
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ------------------------------------------------------------------------------
-- 13. tic_content & tic_events
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tic_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL DEFAULT 'Trivandrum Influencer Circle (TIC)',
    tagline TEXT,
    narrative TEXT,
    hero_image TEXT,
    video_reel_url TEXT,
    stats JSONB DEFAULT '{}'::jsonb,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.tic_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    event_date DATE,
    venue TEXT,
    description TEXT,
    cover_image TEXT NOT NULL,
    gallery_images TEXT[] DEFAULT '{}',
    video_url TEXT,
    attendees_count TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_tic_content_updated_at ON public.tic_content;
CREATE TRIGGER trg_tic_content_updated_at
BEFORE UPDATE ON public.tic_content
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_tic_events_updated_at ON public.tic_events;
CREATE TRIGGER trg_tic_events_updated_at
BEFORE UPDATE ON public.tic_events
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ------------------------------------------------------------------------------
-- 14. about_riyas
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.about_riyas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    founder_name TEXT NOT NULL DEFAULT 'Adv. Riyas',
    official_title TEXT NOT NULL DEFAULT 'Founder & Creative Director, RFR',
    biography_paragraphs TEXT[] NOT NULL DEFAULT '{}',
    quote TEXT,
    signature_image TEXT,
    portrait_image TEXT NOT NULL DEFAULT '/images/riyas.jpg',
    career_milestones JSONB DEFAULT '[]'::jsonb,
    stats JSONB DEFAULT '{}'::jsonb,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_about_riyas_updated_at ON public.about_riyas;
CREATE TRIGGER trg_about_riyas_updated_at
BEFORE UPDATE ON public.about_riyas
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ------------------------------------------------------------------------------
-- 15. team_members
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    designation TEXT NOT NULL,
    department TEXT DEFAULT 'Executive Leadership',
    bio TEXT,
    image TEXT NOT NULL,
    linkedin_url TEXT,
    instagram_url TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_team_members_sort ON public.team_members(sort_order) WHERE is_published = true;

DROP TRIGGER IF EXISTS trg_team_members_updated_at ON public.team_members;
CREATE TRIGGER trg_team_members_updated_at
BEFORE UPDATE ON public.team_members
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ------------------------------------------------------------------------------
-- 16. riyas_gallery_items
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.riyas_gallery_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    caption TEXT,
    image TEXT NOT NULL,
    shoot_date TEXT,
    location TEXT,
    tags TEXT[] DEFAULT '{}',
    sort_order INT NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_riyas_gallery_sort ON public.riyas_gallery_items(sort_order) WHERE is_published = true;

DROP TRIGGER IF EXISTS trg_riyas_gallery_updated_at ON public.riyas_gallery_items;
CREATE TRIGGER trg_riyas_gallery_updated_at
BEFORE UPDATE ON public.riyas_gallery_items
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ------------------------------------------------------------------------------
-- 17. contact_inquiries (ANTI-SPAM VALIDATION & BOT TRAP)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL CHECK (length(trim(full_name)) BETWEEN 2 AND 100),
    email TEXT NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    phone TEXT CHECK (phone IS NULL OR length(phone) <= 30),
    company_name TEXT,
    service_interest TEXT,
    budget_range TEXT,
    message TEXT NOT NULL CHECK (length(trim(message)) BETWEEN 5 AND 5000),
    bot_honey_field TEXT DEFAULT NULL CHECK (bot_honey_field IS NULL),
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'in_progress', 'completed', 'archived')),
    admin_notes TEXT,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.contact_inquiries(status, created_at DESC);

DROP TRIGGER IF EXISTS trg_contact_inquiries_updated_at ON public.contact_inquiries;
CREATE TRIGGER trg_contact_inquiries_updated_at
BEFORE UPDATE ON public.contact_inquiries
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ------------------------------------------------------------------------------
-- 18. social_links
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.social_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform TEXT UNIQUE NOT NULL,
    url TEXT NOT NULL,
    handle TEXT,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_social_links_visible ON public.social_links(is_visible, sort_order);

DROP TRIGGER IF EXISTS trg_social_links_updated_at ON public.social_links;
CREATE TRIGGER trg_social_links_updated_at
BEFORE UPDATE ON public.social_links
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ------------------------------------------------------------------------------
-- 19. section_visibility
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.section_visibility (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_key TEXT UNIQUE NOT NULL,
    section_name TEXT NOT NULL,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_section_visibility_order ON public.section_visibility(display_order);

DROP TRIGGER IF EXISTS trg_section_visibility_updated_at ON public.section_visibility;
CREATE TRIGGER trg_section_visibility_updated_at
BEFORE UPDATE ON public.section_visibility
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ------------------------------------------------------------------------------
-- 20. seo_metadata
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.seo_metadata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_path TEXT UNIQUE NOT NULL,
    meta_title TEXT NOT NULL,
    meta_description TEXT NOT NULL,
    og_image_url TEXT,
    canonical_url TEXT,
    keywords TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_seo_page_path ON public.seo_metadata(page_path);

DROP TRIGGER IF EXISTS trg_seo_metadata_updated_at ON public.seo_metadata;
CREATE TRIGGER trg_seo_metadata_updated_at
BEFORE UPDATE ON public.seo_metadata
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ------------------------------------------------------------------------------
-- 21. admin_activity_logs (IMMUTABLE AUDIT TRAIL)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    admin_email TEXT NOT NULL,
    action TEXT NOT NULL,
    entity_table TEXT NOT NULL,
    entity_id TEXT,
    entity_title TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON public.admin_activity_logs(created_at DESC);

-- Attach row-level immutability trigger
DROP TRIGGER IF EXISTS trg_protect_activity_logs ON public.admin_activity_logs;
CREATE TRIGGER trg_protect_activity_logs
BEFORE UPDATE OR DELETE ON public.admin_activity_logs
FOR EACH ROW EXECUTE FUNCTION public.prevent_log_tampering();

-- Attach statement-level truncation trigger
DROP TRIGGER IF EXISTS trg_protect_activity_logs_truncate ON public.admin_activity_logs;
CREATE TRIGGER trg_protect_activity_logs_truncate
BEFORE TRUNCATE ON public.admin_activity_logs
FOR EACH STATEMENT EXECUTE FUNCTION public.prevent_log_tampering();

-- Revoke truncate explicitly from authenticated and anon
REVOKE TRUNCATE ON public.admin_activity_logs FROM anon, authenticated;

-- ==============================================================================
-- SECTION 4: ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

DO $$
DECLARE
    tbl text;
    content_tables text[] := ARRAY[
        'admin_users',
        'website_settings',
        'hero_banners',
        'projects_portfolio',
        'timeline_years',
        'timeline_events',
        'media_videos',
        'gallery_categories',
        'gallery_items',
        'talent_models',
        'talent_influencers',
        'testimonials',
        'press_articles',
        'partners_clients',
        'tic_content',
        'tic_events',
        'about_riyas',
        'team_members',
        'riyas_gallery_items',
        'contact_inquiries',
        'social_links',
        'section_visibility',
        'seo_metadata',
        'admin_activity_logs'
    ];
BEGIN
    FOREACH tbl IN ARRAY content_tables LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', tbl);
    END LOOP;
END $$;

-- ------------------------------------------------------------------------------
-- RLS: admin_users (Strict RBAC: Super Admin Only Management)
-- Self-read is allowed so any logged-in user can check their own profile.
-- Elevation, creation, and deletion strictly require is_super_admin().
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Admins can view own record or super_admin view all" ON public.admin_users;
CREATE POLICY "Admins can view own record or super_admin view all"
ON public.admin_users FOR SELECT
TO authenticated
USING (id = auth.uid() OR public.is_super_admin());

DROP POLICY IF EXISTS "Only super_admins can insert admin_users" ON public.admin_users;
CREATE POLICY "Only super_admins can insert admin_users"
ON public.admin_users FOR INSERT
TO authenticated
WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS "Only super_admins can update admin_users" ON public.admin_users;
CREATE POLICY "Only super_admins can update admin_users"
ON public.admin_users FOR UPDATE
TO authenticated
USING (public.is_super_admin())
WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS "Only super_admins can delete admin_users" ON public.admin_users;
CREATE POLICY "Only super_admins can delete admin_users"
ON public.admin_users FOR DELETE
TO authenticated
USING (public.is_super_admin());

-- ------------------------------------------------------------------------------
-- RLS: website_settings (Public reads global variables; Admins update)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view website settings" ON public.website_settings;
CREATE POLICY "Public can view website settings"
ON public.website_settings FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Admins can update website settings" ON public.website_settings;
CREATE POLICY "Admins can update website settings"
ON public.website_settings FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- RLS: hero_banners
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view published hero banners" ON public.hero_banners;
CREATE POLICY "Public can view published hero banners"
ON public.hero_banners FOR SELECT
TO anon, authenticated
USING (is_published = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins manage hero banners" ON public.hero_banners;
CREATE POLICY "Admins manage hero banners"
ON public.hero_banners FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- RLS: projects_portfolio
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view published projects" ON public.projects_portfolio;
CREATE POLICY "Public can view published projects"
ON public.projects_portfolio FOR SELECT
TO anon, authenticated
USING (is_published = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins manage projects" ON public.projects_portfolio;
CREATE POLICY "Admins manage projects"
ON public.projects_portfolio FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- RLS: timeline_years & timeline_events
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view published timeline years" ON public.timeline_years;
CREATE POLICY "Public can view published timeline years"
ON public.timeline_years FOR SELECT
TO anon, authenticated
USING (is_published = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins manage timeline years" ON public.timeline_years;
CREATE POLICY "Admins manage timeline years"
ON public.timeline_years FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Public can view published timeline events" ON public.timeline_events;
CREATE POLICY "Public can view published timeline events"
ON public.timeline_events FOR SELECT
TO anon, authenticated
USING (is_published = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins manage timeline events" ON public.timeline_events;
CREATE POLICY "Admins manage timeline events"
ON public.timeline_events FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- RLS: media_videos
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view published videos" ON public.media_videos;
CREATE POLICY "Public can view published videos"
ON public.media_videos FOR SELECT
TO anon, authenticated
USING (is_published = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins manage videos" ON public.media_videos;
CREATE POLICY "Admins manage videos"
ON public.media_videos FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- RLS: gallery_categories & gallery_items
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view gallery categories" ON public.gallery_categories;
CREATE POLICY "Public can view gallery categories"
ON public.gallery_categories FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Admins manage gallery categories" ON public.gallery_categories;
CREATE POLICY "Admins manage gallery categories"
ON public.gallery_categories FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Public can view published gallery items" ON public.gallery_items;
CREATE POLICY "Public can view published gallery items"
ON public.gallery_items FOR SELECT
TO anon, authenticated
USING (is_published = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins manage gallery items" ON public.gallery_items;
CREATE POLICY "Admins manage gallery items"
ON public.gallery_items FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- RLS: talent_models & talent_influencers
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view published models" ON public.talent_models;
CREATE POLICY "Public can view published models"
ON public.talent_models FOR SELECT
TO anon, authenticated
USING (is_published = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins manage models" ON public.talent_models;
CREATE POLICY "Admins manage models"
ON public.talent_models FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Public can view published influencers" ON public.talent_influencers;
CREATE POLICY "Public can view published influencers"
ON public.talent_influencers FOR SELECT
TO anon, authenticated
USING (is_published = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins manage influencers" ON public.talent_influencers;
CREATE POLICY "Admins manage influencers"
ON public.talent_influencers FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- RLS: testimonials
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view published testimonials" ON public.testimonials;
CREATE POLICY "Public can view published testimonials"
ON public.testimonials FOR SELECT
TO anon, authenticated
USING (is_published = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins manage testimonials" ON public.testimonials;
CREATE POLICY "Admins manage testimonials"
ON public.testimonials FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- RLS: press_articles
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view published press articles" ON public.press_articles;
CREATE POLICY "Public can view published press articles"
ON public.press_articles FOR SELECT
TO anon, authenticated
USING (is_published = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins manage press articles" ON public.press_articles;
CREATE POLICY "Admins manage press articles"
ON public.press_articles FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- RLS: partners_clients
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view published partners and clients" ON public.partners_clients;
CREATE POLICY "Public can view published partners and clients"
ON public.partners_clients FOR SELECT
TO anon, authenticated
USING (is_published = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins manage partners and clients" ON public.partners_clients;
CREATE POLICY "Admins manage partners and clients"
ON public.partners_clients FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- RLS: tic_content & tic_events
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view published TIC content" ON public.tic_content;
CREATE POLICY "Public can view published TIC content"
ON public.tic_content FOR SELECT
TO anon, authenticated
USING (is_published = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins manage TIC content" ON public.tic_content;
CREATE POLICY "Admins manage TIC content"
ON public.tic_content FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Public can view published TIC events" ON public.tic_events;
CREATE POLICY "Public can view published TIC events"
ON public.tic_events FOR SELECT
TO anon, authenticated
USING (is_published = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins manage TIC events" ON public.tic_events;
CREATE POLICY "Admins manage TIC events"
ON public.tic_events FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- RLS: about_riyas & team_members
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view published about riyas" ON public.about_riyas;
CREATE POLICY "Public can view published about riyas"
ON public.about_riyas FOR SELECT
TO anon, authenticated
USING (is_published = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins manage about riyas" ON public.about_riyas;
CREATE POLICY "Admins manage about riyas"
ON public.about_riyas FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Public can view published team members" ON public.team_members;
CREATE POLICY "Public can view published team members"
ON public.team_members FOR SELECT
TO anon, authenticated
USING (is_published = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins manage team members" ON public.team_members;
CREATE POLICY "Admins manage team members"
ON public.team_members FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- RLS: riyas_gallery_items
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view published riyas gallery items" ON public.riyas_gallery_items;
CREATE POLICY "Public can view published riyas gallery items"
ON public.riyas_gallery_items FOR SELECT
TO anon, authenticated
USING (is_published = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins manage riyas gallery items" ON public.riyas_gallery_items;
CREATE POLICY "Admins manage riyas gallery items"
ON public.riyas_gallery_items FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- RLS: contact_inquiries (STRICT: Super-Admin Only Read, Anonymous Insert)
-- Editors CANNOT read, view, or manage private client inquiries.
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can submit contact inquiries" ON public.contact_inquiries;
CREATE POLICY "Public can submit contact inquiries"
ON public.contact_inquiries FOR INSERT
TO anon, authenticated
WITH CHECK (bot_honey_field IS NULL);

DROP POLICY IF EXISTS "Only super_admins can view and manage contact inquiries" ON public.contact_inquiries;
CREATE POLICY "Only super_admins can view and manage contact inquiries"
ON public.contact_inquiries FOR ALL
TO authenticated
USING (public.is_super_admin())
WITH CHECK (public.is_super_admin());

-- ------------------------------------------------------------------------------
-- RLS: social_links, section_visibility, seo_metadata
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view visible social links" ON public.social_links;
CREATE POLICY "Public can view visible social links"
ON public.social_links FOR SELECT
TO anon, authenticated
USING (is_visible = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins manage social links" ON public.social_links;
CREATE POLICY "Admins manage social links"
ON public.social_links FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Public can view section visibility" ON public.section_visibility;
CREATE POLICY "Public can view section visibility"
ON public.section_visibility FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Admins manage section visibility" ON public.section_visibility;
CREATE POLICY "Admins manage section visibility"
ON public.section_visibility FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Public can view seo metadata" ON public.seo_metadata;
CREATE POLICY "Public can view seo metadata"
ON public.seo_metadata FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Admins manage seo metadata" ON public.seo_metadata;
CREATE POLICY "Admins manage seo metadata"
ON public.seo_metadata FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- RLS: admin_activity_logs (Append-Only: SELECT and INSERT only)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Admins can view activity logs" ON public.admin_activity_logs;
CREATE POLICY "Admins can view activity logs"
ON public.admin_activity_logs FOR SELECT
TO authenticated
USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can insert activity logs" ON public.admin_activity_logs;
CREATE POLICY "Admins can insert activity logs"
ON public.admin_activity_logs FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

-- ==============================================================================
-- SECTION 5: STORAGE BUCKETS & ACCESS POLICIES (SVG DISALLOWED FOR XSS SAFETY)
-- ==============================================================================

-- 1. Public Media Bucket (Images, Videos, PDFs)
-- Explicitly excludes 'image/svg+xml' to prevent Stored Cross-Site Scripting (XSS)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'rfr-media',
    'rfr-media',
    true,
    52428800, -- 50 MB
    ARRAY[
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/webp',
        'image/gif',
        'video/mp4',
        'video/webm',
        'application/pdf'
    ]
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 52428800,
    allowed_mime_types = ARRAY[
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/webp',
        'image/gif',
        'video/mp4',
        'video/webm',
        'application/pdf'
    ];

-- 2. Private Documents Bucket (Client briefs, contracts, exports)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'rfr-documents',
    'rfr-documents',
    false,
    52428800, -- 50 MB
    ARRAY[
        'application/pdf',
        'application/json',
        'text/csv'
    ]
)
ON CONFLICT (id) DO UPDATE SET
    public = false,
    file_size_limit = 52428800,
    allowed_mime_types = ARRAY[
        'application/pdf',
        'application/json',
        'text/csv'
    ];

-- Storage Policies: rfr-media
DROP POLICY IF EXISTS "Public can view media files" ON storage.objects;
CREATE POLICY "Public can view media files"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'rfr-media');

DROP POLICY IF EXISTS "Admins can upload media files" ON storage.objects;
CREATE POLICY "Admins can upload media files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'rfr-media' AND public.is_admin());

DROP POLICY IF EXISTS "Admins can update media files" ON storage.objects;
CREATE POLICY "Admins can update media files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'rfr-media' AND public.is_admin())
WITH CHECK (bucket_id = 'rfr-media' AND public.is_admin());

DROP POLICY IF EXISTS "Admins can delete media files" ON storage.objects;
CREATE POLICY "Admins can delete media files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'rfr-media' AND public.is_admin());

-- Storage Policies: rfr-documents (Private: Authenticated super_admin only)
DROP POLICY IF EXISTS "Super admins can view private documents" ON storage.objects;
CREATE POLICY "Super admins can view private documents"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'rfr-documents' AND public.is_super_admin());

DROP POLICY IF EXISTS "Super admins can upload private documents" ON storage.objects;
CREATE POLICY "Super admins can upload private documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'rfr-documents' AND public.is_super_admin());

DROP POLICY IF EXISTS "Super admins can delete private documents" ON storage.objects;
CREATE POLICY "Super admins can delete private documents"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'rfr-documents' AND public.is_super_admin());

-- ==============================================================================
-- SECTION 6: INITIAL BASELINE SEED (ONLY EXPLICITLY VERIFIED VALUES)
-- Zero invented phones, addresses, or unverified social handles.
-- ==============================================================================

INSERT INTO public.website_settings (
    site_title,
    official_logo_url,
    loading_screen_logo_url,
    footer_logo_url,
    favicon_url,
    contact_email
)
SELECT 
    'RFR BY RIYAS',
    '/images/final bro.png',
    '/images/final bro.png',
    '/images/final bro.png',
    '/favicon.ico',
    'advriyas@gmail.com'
WHERE NOT EXISTS (SELECT 1 FROM public.website_settings);

INSERT INTO public.section_visibility (section_key, section_name, is_visible, display_order)
VALUES
    ('hero', 'Hero Banner Showcase', true, 1),
    ('statement', 'Architectural Statement', true, 2),
    ('what_is_rfr', 'What is RFR Ecosystem', true, 3),
    ('timeline', 'Timeline & Archival Chronicle', true, 4),
    ('services', 'Services & Disciplines', true, 5),
    ('influencers', 'Influencer Network & TIC', true, 6),
    ('campaigns', 'Commercial Campaigns & Ad Films', true, 7),
    ('talent', 'Talent & Model Guilds', true, 8),
    ('testimonials', 'Client & Partner Testimonials', true, 9),
    ('press', 'News & Press Highlights', true, 10),
    ('clients', 'Partners & Client Logos', true, 11),
    ('contact', 'Contact & Booking Concierge', true, 12)
ON CONFLICT (section_key) DO NOTHING;
