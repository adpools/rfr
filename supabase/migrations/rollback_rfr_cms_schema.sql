-- ==============================================================================
-- RFR BY RIYAS — STRICT RESTRICTIVE ROLLBACK SCRIPT (VERSION 2.1)
-- Purpose: Safely removes ONLY RFR CMS objects.
-- Safety Rule: Uses RESTRICT to REFUSE execution if unexpected or external
-- dependencies (views, foreign keys, external tables) exist.
-- Target Database: Supabase PostgreSQL
-- ==============================================================================

DO $$
BEGIN
    RAISE NOTICE 'Starting strict restrictive rollback of RFR by Riyas CMS database objects...';
END $$;

-- ------------------------------------------------------------------------------
-- 1. Remove Storage Policies & Buckets created by this migration
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view media files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload media files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update media files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete media files" ON storage.objects;

DROP POLICY IF EXISTS "Super admins can view private documents" ON storage.objects;
DROP POLICY IF EXISTS "Super admins can upload private documents" ON storage.objects;
DROP POLICY IF EXISTS "Super admins can delete private documents" ON storage.objects;

DELETE FROM storage.buckets WHERE id IN ('rfr-media', 'rfr-documents');

-- ------------------------------------------------------------------------------
-- 2. Drop Custom Triggers on Internal and CMS Tables
-- ------------------------------------------------------------------------------
DROP TRIGGER IF EXISTS trg_protect_activity_logs ON public.admin_activity_logs;
DROP TRIGGER IF EXISTS trg_protect_activity_logs_truncate ON public.admin_activity_logs;
DROP TRIGGER IF EXISTS trg_protect_last_super_admin ON public.admin_users;
DROP TRIGGER IF EXISTS trg_admin_users_updated_at ON public.admin_users;
DROP TRIGGER IF EXISTS trg_website_settings_updated_at ON public.website_settings;
DROP TRIGGER IF EXISTS trg_hero_banners_updated_at ON public.hero_banners;
DROP TRIGGER IF EXISTS trg_projects_updated_at ON public.projects_portfolio;
DROP TRIGGER IF EXISTS trg_timeline_years_updated_at ON public.timeline_years;
DROP TRIGGER IF EXISTS trg_timeline_events_updated_at ON public.timeline_events;
DROP TRIGGER IF EXISTS trg_media_videos_updated_at ON public.media_videos;
DROP TRIGGER IF EXISTS trg_gallery_items_updated_at ON public.gallery_items;
DROP TRIGGER IF EXISTS trg_talent_models_updated_at ON public.talent_models;
DROP TRIGGER IF EXISTS trg_talent_influencers_updated_at ON public.talent_influencers;
DROP TRIGGER IF EXISTS trg_testimonials_updated_at ON public.testimonials;
DROP TRIGGER IF EXISTS trg_press_articles_updated_at ON public.press_articles;
DROP TRIGGER IF EXISTS trg_partners_clients_updated_at ON public.partners_clients;
DROP TRIGGER IF EXISTS trg_tic_content_updated_at ON public.tic_content;
DROP TRIGGER IF EXISTS trg_tic_events_updated_at ON public.tic_events;
DROP TRIGGER IF EXISTS trg_about_riyas_updated_at ON public.about_riyas;
DROP TRIGGER IF EXISTS trg_team_members_updated_at ON public.team_members;
DROP TRIGGER IF EXISTS trg_riyas_gallery_updated_at ON public.riyas_gallery_items;
DROP TRIGGER IF EXISTS trg_contact_inquiries_updated_at ON public.contact_inquiries;
DROP TRIGGER IF EXISTS trg_social_links_updated_at ON public.social_links;
DROP TRIGGER IF EXISTS trg_section_visibility_updated_at ON public.section_visibility;
DROP TRIGGER IF EXISTS trg_seo_metadata_updated_at ON public.seo_metadata;

-- ------------------------------------------------------------------------------
-- 3. Drop Content Tables in STRICT REVERSE-DEPENDENCY ORDER using RESTRICT
-- Note: If any unexpected table, view, or foreign key depends on any of these tables,
-- PostgreSQL will REFUSE to proceed and throw an error, preventing silent data loss.
-- ------------------------------------------------------------------------------

-- Child tables first (foreign keys pointing to parent tables)
DROP TABLE IF EXISTS public.timeline_events RESTRICT;
DROP TABLE IF EXISTS public.timeline_years RESTRICT;

-- Independent CMS content tables
DROP TABLE IF EXISTS public.admin_activity_logs RESTRICT;
DROP TABLE IF EXISTS public.seo_metadata RESTRICT;
DROP TABLE IF EXISTS public.section_visibility RESTRICT;
DROP TABLE IF EXISTS public.social_links RESTRICT;
DROP TABLE IF EXISTS public.contact_inquiries RESTRICT;
DROP TABLE IF EXISTS public.riyas_gallery_items RESTRICT;
DROP TABLE IF EXISTS public.team_members RESTRICT;
DROP TABLE IF EXISTS public.about_riyas RESTRICT;
DROP TABLE IF EXISTS public.tic_events RESTRICT;
DROP TABLE IF EXISTS public.tic_content RESTRICT;
DROP TABLE IF EXISTS public.partners_clients RESTRICT;
DROP TABLE IF EXISTS public.press_articles RESTRICT;
DROP TABLE IF EXISTS public.testimonials RESTRICT;
DROP TABLE IF EXISTS public.talent_influencers RESTRICT;
DROP TABLE IF EXISTS public.talent_models RESTRICT;
DROP TABLE IF EXISTS public.gallery_items RESTRICT;
DROP TABLE IF EXISTS public.gallery_categories RESTRICT;
DROP TABLE IF EXISTS public.media_videos RESTRICT;
DROP TABLE IF EXISTS public.projects_portfolio RESTRICT;
DROP TABLE IF EXISTS public.hero_banners RESTRICT;
DROP TABLE IF EXISTS public.website_settings RESTRICT;

-- User authority table
DROP TABLE IF EXISTS public.admin_users RESTRICT;

-- ------------------------------------------------------------------------------
-- 4. Drop Security Functions & Trigger Handlers using RESTRICT
-- ------------------------------------------------------------------------------
DROP FUNCTION IF EXISTS public.is_super_admin() RESTRICT;
DROP FUNCTION IF EXISTS public.is_admin() RESTRICT;
DROP FUNCTION IF EXISTS public.protect_last_super_admin() RESTRICT;
DROP FUNCTION IF EXISTS public.prevent_log_tampering() RESTRICT;
DROP FUNCTION IF EXISTS public.set_updated_at() RESTRICT;

DO $$
BEGIN
    RAISE NOTICE 'Rollback complete. All RFR CMS tables, policies, and functions cleanly removed without cascading into external objects.';
END $$;
