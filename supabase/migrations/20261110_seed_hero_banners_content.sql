-- ==============================================================================
-- RFR BY RIYAS — SEED HERO BANNERS (PRIORITY 3)
-- Execution target: hlyxzhafdjyflwcdecmp
-- Safe, non-destructive migration for the 4 core Hero section pillars.
-- Idempotent: ON CONFLICT (id) DO NOTHING
-- ==============================================================================

BEGIN;

INSERT INTO public.hero_banners (
  id,
  eyebrow,
  title,
  subtitle,
  image_url,
  video_url,
  cta_primary_label,
  cta_primary_link,
  cta_secondary_label,
  cta_secondary_link,
  sort_order,
  is_published,
  created_at,
  updated_at
) VALUES
(
  'b0000001-0000-4000-8000-000000000001'::uuid,
  'EST. 2020 • CREATIVE STUDIO',
  'RFR BY RIYAS',
  'A Creative Studio specializing in immersive experiences, fashion productions, and culturally resonant campaigns.',
  '/images/hero-bg.jpg',
  '/videos/Dandya%20Deeshna%20Event/hero-bg-optimized.mp4',
  'EXPLORE CHRONICLE',
  '/about',
  'WATCH 2020-2026 ARCHIVE',
  'https://drive.google.com/file/d/1dy6TIwofRd4bWLMrdHeiykYkqTVbFIFw/preview',
  1,
  true,
  NOW(),
  NOW()
),
(
  'b0000001-0000-4000-8000-000000000002'::uuid,
  'EVENTS • KOOTTAM FLEA & RUNWAYS',
  'Events & Runways',
  'The quintessential RFR signature runway presentations, Koottam Flea Market IP, and lifestyle curations.',
  NULL,
  'https://www.youtube.com/embed/NTDkcWdruPs?start=144',
  'EXPLORE SERVICES',
  '/services',
  'WATCH KOOTTAM SEASON 2',
  'https://www.youtube.com/embed/NTDkcWdruPs?autoplay=1&start=144',
  2,
  true,
  NOW(),
  NOW()
),
(
  'b0000001-0000-4000-8000-000000000003'::uuid,
  'CAMPAIGNS • CINEMATIC PRODUCTION',
  'Campaigns & Media',
  'Luxury brand films, television commercials, and omnichannel campaign assets.',
  NULL,
  '/videos/Dandya%20Deeshna%20Event/Dandya%20Reel.mp4',
  'VIEW SHOWCASES',
  '/services',
  NULL,
  NULL,
  3,
  true,
  NOW(),
  NOW()
),
(
  'b0000001-0000-4000-8000-000000000004'::uuid,
  'PODCAST • CONVERSATIONS BEYOND RUNWAY',
  'The RFR Podcast',
  'Unfiltered, intellectual, and visionary dialogues with industry icons and creative entrepreneurs.',
  NULL,
  'https://www.youtube.com/embed/-X_1HETQbho',
  'LISTEN ON STUDIO',
  '/services/podcast',
  NULL,
  NULL,
  4,
  true,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

COMMIT;

