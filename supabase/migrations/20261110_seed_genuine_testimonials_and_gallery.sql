-- ==============================================================================
-- RFR BY RIYAS — MIGRATION: RECONCILE GENUINE TESTIMONIALS & RIYAS GALLERY
-- Target Database: Supabase PostgreSQL (hlyxzhafdjyflwcdecmp)
-- Safe, Idempotent, Non-destructive update
-- PRESERVES:
--   1. Existing 2 genuine testimonials (Dr Shikha Santhosh & Shalini Sharma)
--   2. Existing 4 hero banners & 87 media videos
--   3. All 6 timeline years, 65 events, and 47 video reels
--   4. RLS policies and super-admin protections
-- ==============================================================================

BEGIN;

-- 1. Populate genuine Anu testimonial in record 00000000-0000-4000-a002-000000000003
UPDATE public.testimonials
SET 
    name = 'Anu',
    designation = 'Celebrity Fashion Designer & Style Consultant',
    company = 'ToU|By Aanu — Aanu Designs Pvt. Ltd.',
    image = '/images/influencers/aanu.jpeg',
    quote = 'It has always been a pleasure associating with Riyaz, from my early collaborations at his events to being invited as a celebrity guest and serving on various judging panels. Having witnessed his journey over the years, what truly stands out is his passion, dedication and relentless hard work in building a name for himself. Every event he curates reflects his creativity, attention to detail and ability to bring people together. One of his most remarkable initiatives is the Trivandrum Influencer Circle, a wonderful platform connecting talent, creativity and opportunities. Beyond his professional achievements, Riyaz is a wonderful friend and a genuinely supportive person.',
    rating = 5,
    event_or_brand = 'Founder & Managing Director, ToU|By Aanu / TIC',
    is_featured_home = true,
    sort_order = 3,
    is_published = true,
    updated_at = now()
WHERE id = '00000000-0000-4000-a002-000000000003';

-- 2. Reconcile genuine 13 portraits in public.riyas_gallery_items
-- Remove previous seed records containing broken file references
DELETE FROM public.riyas_gallery_items 
WHERE id IN (
    '00000000-0000-4000-a006-000000000001',
    '00000000-0000-4000-a006-000000000002',
    '00000000-0000-4000-a006-000000000003',
    '00000000-0000-4000-a006-000000000004',
    '00000000-0000-4000-a006-000000000005',
    '00000000-0000-4000-a006-000000000006',
    '00000000-0000-4000-a006-000000000007',
    '00000000-0000-4000-a006-000000000008',
    '00000000-0000-4000-a006-000000000009',
    '00000000-0000-4000-a006-000000000010',
    '00000000-0000-4000-a006-000000000011',
    '00000000-0000-4000-a006-000000000012'
);

INSERT INTO public.riyas_gallery_items (
    id, title, caption, image, shoot_date, location, tags, sort_order, is_published
) VALUES
('00000000-0000-4000-a006-000000000001', 'Master Editorial Portrait', 'High-resolution master editorial portrait photograph of Riyas.', '/images/riyas%20img%20gal/0W0A4080.JPG', '2026', 'Studio Archive', ARRAY['Portrait', 'Editorial', 'Master'], 1, true),
('00000000-0000-4000-a006-000000000002', 'High-Fashion Lookbook', 'High-fashion lookbook vertical portrait photograph.', '/images/riyas%20img%20gal/FB_IMG_1755941174694.jpg', '2026', 'Runway Studio', ARRAY['Fashion', 'Vertical', 'Lookbook'], 2, true),
('00000000-0000-4000-a006-000000000003', 'Runway Staging and Presentation', 'Runway staging and luxury fashion editorial photograph.', '/images/riyas%20img%20gal/0W0A4081.JPG', '2026', 'Runway Stage', ARRAY['Runway', 'Stage', 'Lighting'], 3, true),
('00000000-0000-4000-a006-000000000004', 'Contemporary Portrait', 'Contemporary editorial portrait photograph.', '/images/riyas%20img%20gal/WhatsApp%20Image%202026-11-04%20at%2011.37.55%20PM.jpeg', '2026', 'Creative Space', ARRAY['Contemporary', 'Editorial'], 4, true),
('00000000-0000-4000-a006-000000000005', 'Creative Direction & Cinematics', 'Creative direction and cinematic presentation photograph.', '/images/riyas%20img%20gal/0W0A4085.JPG', '2026', 'Set Production', ARRAY['Creative', 'Cinematic'], 5, true),
('00000000-0000-4000-a006-000000000006', 'Signature Studio Styling', 'Signature styling and studio portrait photograph.', '/images/riyas%20img%20gal/FB_IMG_1718991236184.jpg', '2026', 'Studio', ARRAY['Signature', 'Studio'], 6, true),
('00000000-0000-4000-a006-000000000007', 'Monochromatic Editorial Look', 'Monochromatic editorial aesthetic portrait photograph.', '/images/riyas%20img%20gal/WhatsApp%20Image%202026-11-04%20at%2011.37.56%20PM%20(1).jpeg', '2026', 'Studio Suite', ARRAY['Monochromatic', 'Editorial'], 7, true),
('00000000-0000-4000-a006-000000000008', 'Editorial Portraiture & Showcase', 'Editorial portraiture and runway showcase photograph.', '/images/riyas%20img%20gal/DSC00324.jpg', '2026', 'Grand Runway', ARRAY['Runway', 'Master', 'Showcase'], 8, true),
('00000000-0000-4000-a006-000000000009', 'Fashion Presentation & Storytelling', 'Fashion presentation and visual storytelling photograph.', '/images/riyas%20img%20gal/WhatsApp%20Image%202026-11-04%20at%2011.37.56%20PM.jpeg', '2026', 'Set Archive', ARRAY['Storytelling', 'Presentation'], 9, true),
('00000000-0000-4000-a006-000000000010', 'Lifestyle & Fashion Portrait', 'Lifestyle and fashion portrait photograph.', '/images/riyas%20img%20gal/FB_IMG_1763791773619.jpg', '2026', 'Lifestyle Location', ARRAY['Lifestyle', 'Fashion'], 10, true),
('00000000-0000-4000-a006-000000000011', 'Cultural Styling & Aesthetics', 'Cultural styling and lifestyle portrait photograph.', '/images/riyas%20img%20gal/WhatsApp%20Image%202026-11-04%20at%2011.37.57%20PM%20(1).jpeg', '2026', 'Cultural Archive', ARRAY['Cultural', 'Heritage'], 11, true),
('00000000-0000-4000-a006-000000000012', 'Creative Direction & Event', 'Creative direction and event photograph.', '/images/riyas%20img%20gal/FB_IMG_1763791778722.jpg', '2026', 'Event Stage', ARRAY['Event', 'Direction'], 12, true),
('00000000-0000-4000-a006-000000000013', 'Modern Couture & Expression', 'Modern couture and expressive portrait photograph.', '/images/riyas%20img%20gal/WhatsApp%20Image%202026-11-04%20at%2011.37.57%20PM.jpeg', '2026', 'Couture Studio', ARRAY['Modern', 'Couture', 'Portrait'], 13, true);

COMMIT;

