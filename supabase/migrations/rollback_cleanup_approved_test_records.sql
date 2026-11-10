-- ==============================================================================
-- RFR BY RIYAS — ROLLBACK: RESTORE APPROVED TEMPORARY TEST DATA
-- Target Database: Supabase PostgreSQL (hlyxzhafdjyflwcdecmp)
-- Re-inserts the 14 records if required.
-- ==============================================================================

BEGIN;

-- 1. Restore 9 Draft Testimonials
INSERT INTO public.testimonials (
    id, name, designation, company, image, quote, rating, event_or_brand, is_featured_home, sort_order, is_published
) VALUES
('00000000-0000-4000-a002-000000000004'::uuid, '[UNVERIFIED - DRAFT FOR REVIEW]', 'Client Representative', 'Brand Partner', '/images/final bro.png', 'Verified testimonial copy pending leadership review in CMS.', 5, 'RFR Property', false, 4, false),
('00000000-0000-4000-a002-000000000005'::uuid, '[UNVERIFIED - DRAFT FOR REVIEW]', 'Client Representative', 'Brand Partner', '/images/final bro.png', 'Verified testimonial copy pending leadership review in CMS.', 5, 'RFR Property', false, 5, false),
('00000000-0000-4000-a002-000000000006'::uuid, '[UNVERIFIED - DRAFT FOR REVIEW]', 'Client Representative', 'Brand Partner', '/images/final bro.png', 'Verified testimonial copy pending leadership review in CMS.', 5, 'RFR Property', false, 6, false),
('00000000-0000-4000-a002-000000000007'::uuid, '[UNVERIFIED - DRAFT FOR REVIEW]', 'Client Representative', 'Brand Partner', '/images/final bro.png', 'Verified testimonial copy pending leadership review in CMS.', 5, 'RFR Property', false, 7, false),
('00000000-0000-4000-a002-000000000008'::uuid, '[UNVERIFIED - DRAFT FOR REVIEW]', 'Client Representative', 'Brand Partner', '/images/final bro.png', 'Verified testimonial copy pending leadership review in CMS.', 5, 'RFR Property', false, 8, false),
('00000000-0000-4000-a002-000000000009'::uuid, '[UNVERIFIED - DRAFT FOR REVIEW]', 'Client Representative', 'Brand Partner', '/images/final bro.png', 'Verified testimonial copy pending leadership review in CMS.', 5, 'RFR Property', false, 9, false),
('00000000-0000-4000-a002-000000000010'::uuid, '[UNVERIFIED - DRAFT FOR REVIEW]', 'Client Representative', 'Brand Partner', '/images/final bro.png', 'Verified testimonial copy pending leadership review in CMS.', 5, 'RFR Property', false, 10, false),
('00000000-0000-4000-a002-000000000011'::uuid, '[UNVERIFIED - DRAFT FOR REVIEW]', 'Client Representative', 'Brand Partner', '/images/final bro.png', 'Verified testimonial copy pending leadership review in CMS.', 5, 'RFR Property', false, 11, false),
('00000000-0000-4000-a002-000000000012'::uuid, '[UNVERIFIED - DRAFT FOR REVIEW]', 'Client Representative', 'Brand Partner', '/images/final bro.png', 'Verified testimonial copy pending leadership review in CMS.', 5, 'RFR Property', false, 12, false)
ON CONFLICT (id) DO NOTHING;

-- 2. Restore 4 Draft Press Articles
INSERT INTO public.press_articles (
    id, slug, title, category, date_label, author, read_time, cover_image, excerpt, content, tags, is_featured_home, sort_order, is_published
) VALUES
('00000000-0000-4000-a004-000000000005'::uuid, 'press-clipping-chandrika', '[UNVERIFIED - HELD AS DRAFT FOR MANUAL CMS REVIEW] Chandrika Print Feature', 'Press', 'Archival', 'Editorial Desk', '2 min read', '/images/final bro.png', 'Archival newspaper clipping pending verified English transcription in CMS.', ARRAY['Clipping', 'Draft']::text[], ARRAY['Press', 'Draft']::text[], false, 5, false),
('00000000-0000-4000-a004-000000000006'::uuid, 'press-clipping-kerala-kaumudi', '[UNVERIFIED - HELD AS DRAFT FOR MANUAL CMS REVIEW] Kerala Kaumudi Daily Clipping', 'Press', 'Archival', 'Editorial Desk', '2 min read', '/images/final bro.png', 'Archival newspaper clipping pending verified English transcription in CMS.', ARRAY['Clipping', 'Draft']::text[], ARRAY['Press', 'Draft']::text[], false, 6, false),
('00000000-0000-4000-a004-000000000007'::uuid, 'press-clipping-technopark', '[UNVERIFIED - HELD AS DRAFT FOR MANUAL CMS REVIEW] Technopark Campus Feature', 'Press', 'Archival', 'Editorial Desk', '2 min read', '/images/final bro.png', 'Archival newspaper clipping pending verified English transcription in CMS.', ARRAY['Clipping', 'Draft']::text[], ARRAY['Press', 'Draft']::text[], false, 7, false),
('00000000-0000-4000-a004-000000000008'::uuid, 'press-clipping-metro-vartha', '[UNVERIFIED - HELD AS DRAFT FOR MANUAL CMS REVIEW] Metro Vartha Newsprint Feature', 'Press', 'Archival', 'Editorial Desk', '2 min read', '/images/final bro.png', 'Archival newspaper clipping pending verified English transcription in CMS.', ARRAY['Clipping', 'Draft']::text[], ARRAY['Press', 'Draft']::text[], false, 8, false)
ON CONFLICT (id) DO NOTHING;

-- 3. Restore 1 Inception Marker Timeline Event
INSERT INTO public.timeline_events (
    id, year_id, year_number, name, type, category_badge, location_or_client, description, image, video_embed_url, has_video, drive_folder_url, sort_order, is_published
) VALUES (
    '00000000-0000-4000-a001-000000000001'::uuid,
    '00000000-0000-4000-a000-000000002020'::uuid,
    2020,
    'Inaugural Runway Showcase & Creative Genesis',
    'Event',
    'RUNWAY INCEPTION • CHOREOGRAPHY',
    'RFR Signature Event',
    'The defining genesis showcase curated by Riyas, establishing Kerala benchmark in luxury fashion choreography and runway staging.',
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80',
    NULL,
    false,
    NULL,
    1,
    true
)
ON CONFLICT (id) DO NOTHING;

COMMIT;

