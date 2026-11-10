-- ==============================================================================
-- RFR BY RIYAS — ROLLBACK: RECONCILE GENUINE TESTIMONIALS & RIYAS GALLERY
-- Target Database: Supabase PostgreSQL (hlyxzhafdjyflwcdecmp)
-- Reverts: 20261110_seed_genuine_testimonials_and_gallery.sql
-- ==============================================================================

BEGIN;

-- 1. Revert Anu testimonial back to draft state
UPDATE public.testimonials
SET 
    name = '[UNVERIFIED - DRAFT FOR REVIEW]',
    designation = 'Client Representative',
    company = 'Brand Partner',
    image = '/images/final bro.png',
    quote = 'Verified testimonial copy pending leadership review in CMS.',
    rating = 5,
    event_or_brand = 'RFR Property',
    is_featured_home = false,
    sort_order = 3,
    is_published = false,
    updated_at = now()
WHERE id = '00000000-0000-4000-a002-000000000003';

-- 2. Remove 13th gallery item
DELETE FROM public.riyas_gallery_items 
WHERE id = '00000000-0000-4000-a006-000000000013';

COMMIT;

