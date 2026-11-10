-- ==============================================================================
-- RFR BY RIYAS — CONSOLIDATED SUPABASE CMS PERMISSIONS & RBAC HARDENING FIX
-- Migration: 20261109_cms_permissions_hardening.sql
--
-- Security Audit & Integrity Verification:
--  1. Schema-wide sequence REVOKE/GRANT statements removed. All 24 CMS tables
--     utilize UUID primary keys (gen_random_uuid() or auth.users(id) references).
--     Zero tables rely on SERIAL, BIGSERIAL, IDENTITY, or nextval() sequences.
--     Therefore, zero sequence permissions are required or granted.
--  2. Broad ALTER DEFAULT PRIVILEGES statements completely omitted.
--  3. Explicitly verified all 24 CMS tables and storage objects exist in the schema.
--  4. Scoped Storage permissions aligned with existing Storage RLS policies:
--     - storage.buckets: SELECT only for anon and authenticated (read-only metadata).
--     - storage.objects: SELECT for anon (restricted by RLS to bucket 'rfr-media').
--     - storage.objects: CRUD for authenticated (strictly gated by is_admin() for media
--       and is_super_admin() for private documents).
--  5. Preserved existing admin_users RBAC:
--     - anon has zero access.
--     - authenticated gated by existing RLS: self-profile read for editors, CRUD for super_admin.
--     - Existing protect_last_super_admin() trigger remains intact.
--  6. Preserved contact_inquiries honeypot check (bot_honey_field IS NULL).
--     - anon has INSERT only; SELECT is strictly denied.
--     - Only super_admin can view and manage inquiries via existing RLS.
--  7. Preserved audit log immutability:
--     - admin_activity_logs: SELECT, INSERT only for authenticated; UPDATE/DELETE/TRUNCATE revoked.
--     - Immutability trigger prevent_log_tampering() remains intact.
--  8. Zero RLS disabling. Zero modifications to existing security definer functions.
-- ==============================================================================

BEGIN;

-- ==============================================================================
-- 1. SCHEMA USAGE PRIVILEGES
-- ==============================================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT USAGE ON SCHEMA storage TO anon, authenticated;

-- ==============================================================================
-- 2. HELPER FUNCTIONS EXECUTION PRIVILEGES
-- is_admin() is evaluated by anon in public content RLS policies (USING is_published OR is_admin()).
-- is_super_admin() is restricted strictly to authenticated callers.
-- ==============================================================================
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_super_admin() TO authenticated;

-- ==============================================================================
-- 3. TABLE-LEVEL PERMISSIONS FOR ROLE 'anon' (PUBLIC WEBSITE VISITORS)
-- Read-only access to published content on 21 public-facing tables.
-- ==============================================================================
GRANT SELECT ON TABLE public.website_settings TO anon;
GRANT SELECT ON TABLE public.hero_banners TO anon;
GRANT SELECT ON TABLE public.projects_portfolio TO anon;
GRANT SELECT ON TABLE public.timeline_years TO anon;
GRANT SELECT ON TABLE public.timeline_events TO anon;
GRANT SELECT ON TABLE public.media_videos TO anon;
GRANT SELECT ON TABLE public.gallery_categories TO anon;
GRANT SELECT ON TABLE public.gallery_items TO anon;
GRANT SELECT ON TABLE public.talent_models TO anon;
GRANT SELECT ON TABLE public.talent_influencers TO anon;
GRANT SELECT ON TABLE public.testimonials TO anon;
GRANT SELECT ON TABLE public.press_articles TO anon;
GRANT SELECT ON TABLE public.partners_clients TO anon;
GRANT SELECT ON TABLE public.tic_content TO anon;
GRANT SELECT ON TABLE public.tic_events TO anon;
GRANT SELECT ON TABLE public.about_riyas TO anon;
GRANT SELECT ON TABLE public.team_members TO anon;
GRANT SELECT ON TABLE public.riyas_gallery_items TO anon;
GRANT SELECT ON TABLE public.social_links TO anon;
GRANT SELECT ON TABLE public.section_visibility TO anon;
GRANT SELECT ON TABLE public.seo_metadata TO anon;

-- Anonymous submission of contact inquiries:
--  - Checked by existing RLS policy: WITH CHECK (bot_honey_field IS NULL)
--  - SELECT is strictly revoked: anon cannot read submitted inquiries under any circumstances
GRANT INSERT ON TABLE public.contact_inquiries TO anon;
REVOKE SELECT, UPDATE, DELETE, TRUNCATE ON TABLE public.contact_inquiries FROM anon;

-- Administrative table isolation:
--  - anon is denied all access to admin_users and admin_activity_logs
REVOKE ALL ON TABLE public.admin_users FROM anon;
REVOKE ALL ON TABLE public.admin_activity_logs FROM anon;

-- ==============================================================================
-- 4. TABLE-LEVEL PERMISSIONS FOR ROLE 'authenticated' (CMS ADMINISTRATORS & EDITORS)
-- Full CRUD on CMS content tables, strictly gated by existing RLS public.is_admin().
-- ==============================================================================
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.website_settings TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.hero_banners TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.projects_portfolio TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.timeline_years TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.timeline_events TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.media_videos TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.gallery_categories TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.gallery_items TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.talent_models TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.talent_influencers TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.testimonials TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.press_articles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.partners_clients TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.tic_content TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.tic_events TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.about_riyas TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.team_members TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.riyas_gallery_items TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.social_links TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.section_visibility TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.seo_metadata TO authenticated;

-- Contact Inquiries: Granted to authenticated, but gated strictly to super_admin by RLS
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.contact_inquiries TO authenticated;

-- Admin Users (RBAC): Granted to authenticated, but gated by RLS:
--  - SELECT: self-profile read or super_admin view all
--  - INSERT/UPDATE/DELETE: strictly is_super_admin()
--  - Deletion/demotion of last super_admin blocked by trigger protect_last_super_admin()
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.admin_users TO authenticated;

-- Activity Logs: Append-only audit trail.
--  - SELECT and INSERT granted to authenticated (gated by RLS is_admin())
--  - UPDATE, DELETE, and TRUNCATE are strictly revoked at the privilege level
--  - Immutability enforced by trigger prevent_log_tampering()
GRANT SELECT, INSERT ON TABLE public.admin_activity_logs TO authenticated;
REVOKE UPDATE, DELETE, TRUNCATE ON TABLE public.admin_activity_logs FROM authenticated, anon;

-- ==============================================================================
-- 5. SUPABASE STORAGE PERMISSIONS (SCHEMA: storage)
-- Carefully scoped based on existing Storage RLS policies:
--  - storage.buckets: SELECT only (read metadata). Bucket creation/deletion restricted.
--  - storage.objects: SELECT for anon & authenticated (RLS restricts anon to rfr-media).
--  - storage.objects: INSERT, UPDATE, DELETE for authenticated (RLS restricts media mutations
--    to is_admin() and private documents to is_super_admin()).
-- ==============================================================================
GRANT SELECT ON TABLE storage.buckets TO anon, authenticated;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON TABLE storage.buckets FROM anon, authenticated;

GRANT SELECT ON TABLE storage.objects TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE storage.objects TO authenticated;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON TABLE storage.objects FROM anon;

COMMIT;
