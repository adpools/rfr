-- ==============================================================================
-- RFR BY RIYAS — UNIFIED PAGE CONTENT SCHEMA
-- Migration Version: 20261109_page_content_schema (IDEMPOTENT & ISOLATED)
-- 
-- PURPOSE:
-- Provides a minimal, unified key-value storage for the six static page groups:
-- 1. Services Catalog (/services, /services/events, /services/campaigns, /services/podcast)
-- 2. What is RFR? (/what-is-rfr)
-- 3. Achievements Narrative (/achievements)
-- 4. Milestones Evolution (/milestones)
-- 5. Strategic Partnerships (/business, /partners)
-- 6. Talent Guild Sub-Pages (/assets/careers, /assets/artists)
-- 
-- INTEGRITY & SAFETY:
-- - Uses a dedicated `set_page_content_updated_at()` function to avoid touching the
--   shared `public.set_updated_at()` function.
-- - Public (anon & authenticated): Read published content only (is_published = true OR public.is_admin()).
-- - Admin: Full read/write management verified via public.is_admin().
-- - Idempotency: Uses IF NOT EXISTS, DROP TRIGGER IF EXISTS, and DROP POLICY IF EXISTS.
-- - Preserves all existing tables, admin accounts, and RLS policies.
-- ==============================================================================

-- 1. Dedicated Timestamp Trigger Function (Leaves shared public.set_updated_at untouched)
CREATE OR REPLACE FUNCTION public.set_page_content_updated_at()
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

REVOKE ALL ON FUNCTION public.set_page_content_updated_at() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.set_page_content_updated_at() TO authenticated;

-- 2. Unified Page Content Table
CREATE TABLE IF NOT EXISTS public.page_content (
    page_slug TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Performance Index on Published Slugs
CREATE INDEX IF NOT EXISTS idx_page_content_published 
    ON public.page_content(page_slug) WHERE is_published = true;

-- 4. Automated updated_at Trigger (Uses dedicated function)
DROP TRIGGER IF EXISTS trg_page_content_updated_at ON public.page_content;
CREATE TRIGGER trg_page_content_updated_at
BEFORE UPDATE ON public.page_content
FOR EACH ROW EXECUTE FUNCTION public.set_page_content_updated_at();

-- 5. Enable Row Level Security
ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;

-- 6. Public Read Policy: Allows reading published content or admin inspection
DROP POLICY IF EXISTS "Allow public read published page_content" ON public.page_content;
CREATE POLICY "Allow public read published page_content"
    ON public.page_content FOR SELECT TO anon, authenticated
    USING (is_published = true OR public.is_admin());

-- 7. Admin Full Access Policy: Allows authenticated admins to insert, update, and delete
DROP POLICY IF EXISTS "Allow admin full access on page_content" ON public.page_content;
CREATE POLICY "Allow admin full access on page_content"
    ON public.page_content FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 8. Explicit Least-Privilege Table Grants (Revokes ALL, prohibits TRUNCATE)
REVOKE ALL ON TABLE public.page_content FROM anon, authenticated;
GRANT SELECT ON TABLE public.page_content TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.page_content TO authenticated;
