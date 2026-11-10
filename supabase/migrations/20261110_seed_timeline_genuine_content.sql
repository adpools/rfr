-- ==============================================================================
-- RFR BY RIYAS — MIGRATION: SEED GENUINE TIMELINE (2021–2025 & AUTHENTIC EVENTS)
-- Execution target: hlyxzhafdjyflwcdecmp
-- Safe, Idempotent, Non-destructive seed
-- PRESERVES: 
--   1. Existing 2026 Year ('6736b7bf-19dd-48ec-b6b1-ef3ee9dfe72b') & image ('final bro.png')
--   2. Existing 2026 Test Event ('cc8e67c2-9456-4e3b-acd9-92fa7cd21589')
-- ==============================================================================

BEGIN;

-- 1. Insert Missing Genuine Timeline Years (2021–2025)
INSERT INTO public.timeline_years (
    id, year, title, theme, subtitle, description, milestones, image, accent, video_url, video_embed_url, drive_folder_url, sort_order, is_published
) VALUES (
    'c95420c4-1346-4240-9750-11ec1d39143d',
    2021,
    'The Inception, Brand Campaigns & Festive Launches',
    'CONCEPTION, EXPANSION & MULTI-MEDIA',
    'Foundational Vision, Brand Campaigns, Musical Albums & Couture Launches',
    'RFR began its journey with a defining vision by Riyas, orchestrating premier entertainment and luxury celebrations, quickly expanding into high-frequency retail campaigns, commercial advertising, and designer holiday launches.',
    ARRAY['Inaugural flagship production curated by Riyas', 'Premier luxury hospitality collaboration with UDS', 'Establishment of RFR''s signature entertainment and event standard', 'Multi-quarter Max Fashion influencer campaigns across Onam, Deepawali, and Xmas', 'Musical video album production: ''Love You Too''', 'High-profile Xmas collection runway launch at UDS']::TEXT[],
    'https://drive.google.com/thumbnail?id=1zhhm9Oj2Uz2Znskemv_8JL_OA9hWm4rT&sz=w1200',
    '#C7A46A',
    NULL,
    'https://drive.google.com/file/d/1zhhm9Oj2Uz2Znskemv_8JL_OA9hWm4rT/preview',
    NULL,
    2021,
    true
) ON CONFLICT (year) DO NOTHING;

INSERT INTO public.timeline_years (
    id, year, title, theme, subtitle, description, milestones, image, accent, video_url, video_embed_url, drive_folder_url, sort_order, is_published
) VALUES (
    '8e014a83-2ec0-4bb4-a71c-fd81efb4064a',
    2022,
    'The Flea Phenomenon, Global Runways & Marquee Ads',
    'EXPERIENTIAL & RUNWAY DOMINANCE',
    'Koottam Flea Season 1, Global Fashion Week, Manyavar & Puma',
    'A monumental year introducing the flagship Koottam Flea Market IP, Global Fashion Week at Lulu, automobile ads, and brand celebrations.',
    ARRAY['Inaugural season launch of Koottam Flea Market IP', 'Global Fashion Week stage production at Lulu Mall', 'High-fashion Manyavar shoot & Mahindra commercial ad', 'New Year Event partnership with Puma']::TEXT[],
    '/images/kootam 2022.jpeg',
    '#C7A46A',
    NULL,
    NULL,
    NULL,
    2022,
    true
) ON CONFLICT (year) DO NOTHING;

INSERT INTO public.timeline_years (
    id, year, title, theme, subtitle, description, milestones, image, accent, video_url, video_embed_url, drive_folder_url, sort_order, is_published
) VALUES (
    'ec57088c-1a39-439d-960d-2957295fe73d',
    2023,
    'Cultural Fests, Musical Milestones & Flea Season 2',
    'CULTURE & COMMUNITY ELEVATION',
    'Koottam S2, The Fourth, Fitora Launch, Hanso & Manorama Music',
    'Expanded into tech corridor cultural festivals, blockbuster music labels, fashion inaugurations, and commercial brand films.',
    ARRAY['Koottam Flea Market Season 2 (The Fourth Edition)', 'Fitora Brand Inauguration & Celebrity Launch', 'Hanso 1 Commercial Brand Film Production', 'Musical Album ''Koode Nee'' with Manorama Music']::TEXT[],
    'https://img.youtube.com/vi/clgdutCU5G8/hqdefault.jpg',
    '#C7A46A',
    NULL,
    NULL,
    NULL,
    2023,
    true
) ON CONFLICT (year) DO NOTHING;

INSERT INTO public.timeline_years (
    id, year, title, theme, subtitle, description, milestones, image, accent, video_url, video_embed_url, drive_folder_url, sort_order, is_published
) VALUES (
    '022da710-9b91-465e-96f7-de9b613a8943',
    2024,
    'Automotive Campaigns, Times of India & Lifestyle Ads',
    'AUTOMOTIVE & MEDIA EXPANSION',
    'Fans of Skoda, Ather EV Campaigns, Build Hub, Concept Tyres & Luxury Ads',
    'Dominating automotive influencer campaigns, premier national media events, and multi-sector commercial ad shoots.',
    ARRAY['Fans of Škoda — Full Highlights commercial automotive campaign', 'Ather Electric Scooter campaigns with Riyas, Ganga, Rithu & Teena', 'Build Hub commercial ad films with Riyas, Teena & Reshma', 'Concept Tyres high-impact commercial video']::TEXT[],
    'https://drive.google.com/thumbnail?id=1agM4IPcwpZHfsXjbA-o8SfP4kkpPW1t_&sz=w1200',
    '#C7A46A',
    NULL,
    NULL,
    NULL,
    2024,
    true
) ON CONFLICT (year) DO NOTHING;

INSERT INTO public.timeline_years (
    id, year, title, theme, subtitle, description, milestones, image, accent, video_url, video_embed_url, drive_folder_url, sort_order, is_published
) VALUES (
    'bad867e2-d278-4019-a27c-24678f4e2539',
    2025,
    'Couture Shows, The Podcast, Pothys & Five-Star Galas',
    'STUDIO BROADCAST & COUTURE RUNWAYS',
    'Rewind with Riyas Podcast, Chakita DD Retreat, Navaratri Naach, Hycinth & Dandiya',
    'Launch of ''Rewind with Riyas'' celebrity podcast series, major fine jewelry ads, high-fashion designer shows, and luxury hotel countdowns.',
    ARRAY['Launch of ''Rewind with Riyas'' celebrity interview podcast studio', 'Chakita DD Retreat Couture Runway Show', 'Navaratri Naach 2025 Grand Festival Highlights', 'Hycinth Fashion Event with Rohas & Rohan', 'Dandiya Deeshna Night & Event Highlights']::TEXT[],
    'https://drive.google.com/thumbnail?id=1pCPpzIG-bo2Z7wiq1rYvQ3Mm1xWQ6tOO&sz=w1200',
    '#C7A46A',
    NULL,
    NULL,
    NULL,
    2025,
    true
) ON CONFLICT (year) DO NOTHING;

-- 2. Insert All 64 Authentic Timeline Events
INSERT INTO public.timeline_events (
    id, year_id, year_number, name, type, category_badge, location_or_client, description, image, video_url, video_embed_url, has_video, drive_folder_url, videos, sort_order, is_published
) VALUES (
    '2656c6e4-99b9-4723-89fa-2d8b3749a4c9',
    'c95420c4-1346-4240-9750-11ec1d39143d',
    2021,
    'Max Influencer Campaigns — Onam',
    'Campaign',
    'RETAIL INFLUENCER CAMPAIGN • VIDEO',
    'Max Fashion',
    'Festive Onam influencer marketing campaign driving retail engagement.',
    'https://drive.google.com/thumbnail?id=13oW-kpjZX61Nwlljk3rtDIhyIxGgwtQX&sz=w1200',
    NULL,
    'https://drive.google.com/file/d/13oW-kpjZX61Nwlljk3rtDIhyIxGgwtQX/preview',
    true,
    NULL,
    '[]'::jsonb,
    1,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline_events (
    id, year_id, year_number, name, type, category_badge, location_or_client, description, image, video_url, video_embed_url, has_video, drive_folder_url, videos, sort_order, is_published
) VALUES (
    '546aa6ca-aa9f-4c39-ab72-ae32cfa5eae8',
    'c95420c4-1346-4240-9750-11ec1d39143d',
    2021,
    'Max Influencer Campaigns — Deepawali (Part 1)',
    'Campaign',
    'RETAIL INFLUENCER CAMPAIGN • VIDEO',
    'Max Fashion',
    'High-energy Deepawali influencer marketing campaign highlighting the festive collection.',
    'https://drive.google.com/thumbnail?id=1JW1hGphQRupw8ONzVud7_99wOU2Lpbkc&sz=w1200',
    NULL,
    'https://drive.google.com/file/d/1JW1hGphQRupw8ONzVud7_99wOU2Lpbkc/preview',
    true,
    NULL,
    '[]'::jsonb,
    2,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline_events (
    id, year_id, year_number, name, type, category_badge, location_or_client, description, image, video_url, video_embed_url, has_video, drive_folder_url, videos, sort_order, is_published
) VALUES (
    '95021a32-25c6-489e-97b7-8946a71a6812',
    'c95420c4-1346-4240-9750-11ec1d39143d',
    2021,
    'Max Influencer Campaigns — Deepawali (Part 2)',
    'Campaign',
    'RETAIL INFLUENCER CAMPAIGN • VIDEO',
    'Max Fashion',
    'Continuation of the high-energy Deepawali influencer marketing campaign.',
    'https://drive.google.com/thumbnail?id=1m1OshIid4g-19bkk8LfhEnGIPSbMqLYf&sz=w1200',
    NULL,
    'https://drive.google.com/file/d/1m1OshIid4g-19bkk8LfhEnGIPSbMqLYf/preview',
    true,
    NULL,
    '[]'::jsonb,
    3,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline_events (
    id, year_id, year_number, name, type, category_badge, location_or_client, description, image, video_url, video_embed_url, has_video, drive_folder_url, videos, sort_order, is_published
) VALUES (
    '78ff984a-e05d-4a5b-807e-d1a5b2dc2b49',
    'c95420c4-1346-4240-9750-11ec1d39143d',
    2021,
    'Max Influencer Campaigns — Xmas',
    'Campaign',
    'RETAIL INFLUENCER CAMPAIGN • VIDEO',
    'Max Fashion',
    'Christmas season influencer marketing campaign for Max Fashion.',
    'https://drive.google.com/thumbnail?id=1-DOdgtZQyVc9Y0FaHn0iyKtAKaFJGP31&sz=w1200',
    NULL,
    'https://drive.google.com/file/d/1-DOdgtZQyVc9Y0FaHn0iyKtAKaFJGP31/preview',
    true,
    NULL,
    '[]'::jsonb,
    4,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline_events (
    id, year_id, year_number, name, type, category_badge, location_or_client, description, image, video_url, video_embed_url, has_video, drive_folder_url, videos, sort_order, is_published
) VALUES (
    'e949fc6a-af95-4630-a34d-08d9d56a497d',
    'c95420c4-1346-4240-9750-11ec1d39143d',
    2021,
    'Love You Too — Musical Album',
    'Music Album',
    'MUSICAL ALBUM PRODUCTION • VIDEO',
    'RFR Music & Productions',
    'Cinematic music video production and audio release capturing romantic visual storytelling and artistic direction.',
    'https://img.youtube.com/vi/jRZ4zlS5PlA/maxresdefault.jpg',
    NULL,
    'https://www.youtube.com/embed/jRZ4zlS5PlA',
    true,
    NULL,
    '[]'::jsonb,
    5,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline_events (
    id, year_id, year_number, name, type, category_badge, location_or_client, description, image, video_url, video_embed_url, has_video, drive_folder_url, videos, sort_order, is_published
) VALUES (
    '1a162db3-403f-460e-8435-4354afcae604',
    'c95420c4-1346-4240-9750-11ec1d39143d',
    2021,
    'MAX Xmas Collection Launch Event at UDS',
    'Event',
    'FASHION LAUNCH EVENT • VIDEO',
    'Max Fashion / UDS Resorts',
    'Exclusive holiday runway showcase and celebrity fashion launch for Max Xmas Collection at UDS.',
    'https://drive.google.com/thumbnail?id=1zhhm9Oj2Uz2Znskemv_8JL_OA9hWm4rT&sz=w1200',
    NULL,
    'https://drive.google.com/file/d/1zhhm9Oj2Uz2Znskemv_8JL_OA9hWm4rT/preview',
    true,
    'https://drive.google.com/drive/folders/1KeuGFZbCTFZgRCCSzHD44y-nZ5u4LOps',
    '[]'::jsonb,
    6,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline_events (
    id, year_id, year_number, name, type, category_badge, location_or_client, description, image, video_url, video_embed_url, has_video, drive_folder_url, videos, sort_order, is_published
) VALUES (
    '6bed1472-b491-450d-a0a4-4c5416c50a98',
    '8e014a83-2ec0-4bb4-a71c-fd81efb4064a',
    2022,
    'Koottam Flea Market — Season 1 (Official Video Reel)',
    'Event',
    'FLAGSHIP FLEA IP • VIDEO REEL',
    'RFR Signature IP',
    'The monumental launch of Koottam Flea Market Season 1, bringing together 50+ independent brands, creators, live music, and thousands of attendees.',
    'https://drive.google.com/thumbnail?id=1K0wzOv8anMih62lWwAXbRJCZGkxyh3IW&sz=w1200',
    NULL,
    'https://drive.google.com/file/d/1K0wzOv8anMih62lWwAXbRJCZGkxyh3IW/preview',
    true,
    'https://drive.google.com/drive/folders/1JPcPSXu6NjKFLhj-_b0r9Xh4vxCTnLaM',
    '[]'::jsonb,
    1,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline_events (
    id, year_id, year_number, name, type, category_badge, location_or_client, description, image, video_url, video_embed_url, has_video, drive_folder_url, videos, sort_order, is_published
) VALUES (
    '4ee6866b-4117-46e6-87fb-22b5d29e47ea',
    '8e014a83-2ec0-4bb4-a71c-fd81efb4064a',
    2022,
    'Koottam Flea 2022 — Live Music & Stage Highlights',
    'Event',
    'FESTIVAL REEL • LIVE STAGE',
    'Koottam 2022 Official Drive Archives',
    'Atmospheric stage production, acoustic live sets, and high-energy festival crowds captured during Koottam Flea Season 1.',
    'https://drive.google.com/thumbnail?id=1OTBpm6zjAgEcxKbGFWZ3k78zsAsLtnW4&sz=w1200',
    NULL,
    'https://drive.google.com/file/d/1OTBpm6zjAgEcxKbGFWZ3k78zsAsLtnW4/preview',
    true,
    'https://drive.google.com/drive/folders/1JPcPSXu6NjKFLhj-_b0r9Xh4vxCTnLaM',
    '[]'::jsonb,
    2,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline_events (
    id, year_id, year_number, name, type, category_badge, location_or_client, description, image, video_url, video_embed_url, has_video, drive_folder_url, videos, sort_order, is_published
) VALUES (
    'a9f99ab5-60a9-4ef4-8693-78337b64f207',
    '8e014a83-2ec0-4bb4-a71c-fd81efb4064a',
    2022,
    'Koottam Flea 2022 — Stalls, Food & Creators',
    'Event',
    'EXPERIENTIAL REEL • RETAIL',
    'Koottam 2022 Official Drive Archives',
    'Curated shopping lanes, artisanal lifestyle creators, gourmet pop-ups, and vibrant community celebrations.',
    'https://drive.google.com/thumbnail?id=1N3uDi9gPVaolGuFGvVHwlhuZ2kVhp5_0&sz=w1200',
    NULL,
    'https://drive.google.com/file/d/1N3uDi9gPVaolGuFGvVHwlhuZ2kVhp5_0/preview',
    true,
    'https://drive.google.com/drive/folders/1JPcPSXu6NjKFLhj-_b0r9Xh4vxCTnLaM',
    '[]'::jsonb,
    3,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline_events (
    id, year_id, year_number, name, type, category_badge, location_or_client, description, image, video_url, video_embed_url, has_video, drive_folder_url, videos, sort_order, is_published
) VALUES (
    '4240c0d7-885c-4523-b762-6ea4e6d4b3ed',
    '8e014a83-2ec0-4bb4-a71c-fd81efb4064a',
    2022,
    'Vishu Max 2022 (Avoki Festive Launch)',
    'Event',
    'FESTIVAL FASHION LAUNCH • VIDEO',
    'Max Fashion',
    'Vibrant Vishu festive collection launch and runway presentation celebrating traditional elegance with contemporary cuts.',
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80',
    NULL,
    'https://drive.google.com/file/d/1Yb5J03l42-tDKReQKTwIyeD8HkbcQUF-/preview',
    true,
    'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs',
    '[]'::jsonb,
    4,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline_events (
    id, year_id, year_number, name, type, category_badge, location_or_client, description, image, video_url, video_embed_url, has_video, drive_folder_url, videos, sort_order, is_published
) VALUES (
    '6bef124f-1564-4df0-8505-bbdd6db9a1a1',
    '8e014a83-2ec0-4bb4-a71c-fd81efb4064a',
    2022,
    'Citi Kids Jasmin & Teena Showcase',
    'Event',
    'YOUTH RUNWAY & TALENT • VIDEO',
    'RFR Youth Platform & Citi Kids',
    'Premier youth talent hunt and fashion runway show empowering kids with stage presence, styling, and grooming.',
    'https://drive.google.com/thumbnail?id=1ZKOWzZ-6Gajyvv8faIPy6tLryX17VLt5&sz=w1200',
    NULL,
    'https://drive.google.com/file/d/1ZKOWzZ-6Gajyvv8faIPy6tLryX17VLt5/preview',
    true,
    'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs',
    '[]'::jsonb,
    5,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline_events (
    id, year_id, year_number, name, type, category_badge, location_or_client, description, image, video_url, video_embed_url, has_video, drive_folder_url, videos, sort_order, is_published
) VALUES (
    'ada3100f-7ec4-4911-9bf4-4378395445e7',
    '8e014a83-2ec0-4bb4-a71c-fd81efb4064a',
    2022,
    'Global Fashion Week — Lulu Mall',
    'Show',
    'INTERNATIONAL RUNWAY',
    'Lulu International Mall',
    'Spectacular multi-designer runway presentation bringing together top couture labels, international models, and media coverage.',
    '/images/thumbnails/global fashion week lulu.JPG',
    NULL,
    'https://drive.google.com/file/d/1fjrTS7q0kSHRGTBQb1VKho8X25D9-gXZ/preview',
    true,
    'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs',
    '[]'::jsonb,
    6,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline_events (
    id, year_id, year_number, name, type, category_badge, location_or_client, description, image, video_url, video_embed_url, has_video, drive_folder_url, videos, sort_order, is_published
) VALUES (
    '43464a36-2ca6-4d24-a5f9-1c04f046b957',
    '8e014a83-2ec0-4bb4-a71c-fd81efb4064a',
    2022,
    'Maanyavar Shoot — SHAMMY',
    'Shoot',
    'HAUTE COUTURE SHOOT • EDITORIAL',
    'Manyavar / Shammy',
    'High-fashion ethnic couture and bridal styling editorial photoshoot featuring Shammy for Manyavar.',
    NULL,
    NULL,
    NULL,
    false,
    NULL,
    '[]'::jsonb,
    7,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline_events (
    id, year_id, year_number, name, type, category_badge, location_or_client, description, image, video_url, video_embed_url, has_video, drive_folder_url, videos, sort_order, is_published
) VALUES (
    'cc2d28fd-9f51-4a98-8e4d-5e830188f3f1',
    '8e014a83-2ec0-4bb4-a71c-fd81efb4064a',
    2022,
    'Mahindra Ad',
    'Ad',
    'AUTOMOTIVE COMMERCIAL • AD FILM',
    'Mahindra',
    'Commercial advertisement production and automotive lifestyle campaign directed for Mahindra.',
    NULL,
    NULL,
    NULL,
    false,
    NULL,
    '[]'::jsonb,
    8,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline_events (
    id, year_id, year_number, name, type, category_badge, location_or_client, description, image, video_url, video_embed_url, has_video, drive_folder_url, videos, sort_order, is_published
) VALUES (
    '459e2d52-49ce-44a6-aefe-290c249eaa4d',
    '8e014a83-2ec0-4bb4-a71c-fd81efb4064a',
    2022,
    'Red FM Kids Show',
    'Show',
    'YOUTH RUNWAY & TALENT • RADIO SHOW',
    '93.5 Red FM',
    'Premier youth talent runway and kids stage showcase conducted in media partnership with 93.5 Red FM.',
    '/images/thumbnails/red fm.jpg',
    NULL,
    NULL,
    false,
    NULL,
    '[]'::jsonb,
    9,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline_events (
    id, year_id, year_number, name, type, category_badge, location_or_client, description, image, video_url, video_embed_url, has_video, drive_folder_url, videos, sort_order, is_published
) VALUES (
    '867e6c14-f9ed-4ffe-a2ff-5c37320241ae',
    'ec57088c-1a39-439d-960d-2957295fe73d',
    2023,
    'The Fourth — Koottam Flea Market (Season 2)',
    'Event',
    'FLAGSHIP FLEA IP • VIDEO REEL',
    'RFR Signature IP',
    'The celebrated second edition of Koottam Flea Market featuring amplified shopping, celebrity acoustic performances, gourmet zones, and record footfalls.',
    'https://img.youtube.com/vi/NTDkcWdruPs/maxresdefault.jpg',
    NULL,
    'https://www.youtube.com/embed/NTDkcWdruPs?start=144',
    true,
    'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs',
    '[]'::jsonb,
    1,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline_events (
    id, year_id, year_number, name, type, category_badge, location_or_client, description, image, video_url, video_embed_url, has_video, drive_folder_url, videos, sort_order, is_published
) VALUES (
    '2acc4282-3feb-46f4-b692-c942a098278d',
    'ec57088c-1a39-439d-960d-2957295fe73d',
    2023,
    'Fitora Brand Launch & Inauguration',
    'Event',
    'BRAND LAUNCH EVENT • VIDEO',
    'Fitora Lifestyle',
    'Grand store inauguration and celebrity brand launch event with full video coverage and VIP guest management.',
    'https://drive.google.com/thumbnail?id=1-evN1cSYflA2Euej4pEzqVfHJ03NlNHz&sz=w1200',
    NULL,
    'https://drive.google.com/file/d/1-evN1cSYflA2Euej4pEzqVfHJ03NlNHz/preview',
    true,
    'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs',
    '[]'::jsonb,
    2,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline_events (
    id, year_id, year_number, name, type, category_badge, location_or_client, description, image, video_url, video_embed_url, has_video, drive_folder_url, videos, sort_order, is_published
) VALUES (
    '464462ce-c9c4-47fb-89b6-10530382c0ad',
    'ec57088c-1a39-439d-960d-2957295fe73d',
    2023,
    'Hanso 1 Commercial Brand Film',
    'Ad',
    'COMMERCIAL BRAND FILM • VIDEO',
    'Hanso Premium Lifestyle',
    'Cinematic brand commercial highlighting contemporary fashion and retail aesthetic excellence.',
    'https://drive.google.com/thumbnail?id=15HlASUrrPE6DeoQGJLklsHY1S2s5jJ8Y&sz=w1200',
    NULL,
    'https://drive.google.com/file/d/15HlASUrrPE6DeoQGJLklsHY1S2s5jJ8Y/preview',
    true,
    'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs',
    '[]'::jsonb,
    3,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline_events (
    id, year_id, year_number, name, type, category_badge, location_or_client, description, image, video_url, video_embed_url, has_video, drive_folder_url, videos, sort_order, is_published
) VALUES (
    'c05f4753-1867-4e94-a3d7-afbc103adafc',
    'ec57088c-1a39-439d-960d-2957295fe73d',
    2023,
    'Koode Nee — Musical Album (Manorama Music)',
    'Music Album',
    'CHART-TOPPING MUSICAL ALBUM • VIDEO',
    'Manorama Music / RFR Productions',
    'Acclaimed musical video production released with major record label Manorama Music, generating widespread digital acclaim.',
    'https://img.youtube.com/vi/clgdutCU5G8/hqdefault.jpg',
    NULL,
    'https://drive.google.com/file/d/1KyZfc-c5FMJ2gtKxV26-2uX1Yo5ZTkka/preview',
    true,
    'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs',
    '[]'::jsonb,
    4,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline_events (
    id, year_id, year_number, name, type, category_badge, location_or_client, description, image, video_url, video_embed_url, has_video, drive_folder_url, videos, sort_order, is_published
) VALUES (
    '0159c50f-f1c0-40d7-84db-5e73caa14e57',
    'ec57088c-1a39-439d-960d-2957295fe73d',
    2023,
    'Max Influencer Campaigns',
    'Campaign',
    'RETAIL INFLUENCER CAMPAIGN',
    'Max Fashion',
    'Multi-quarter festive influencer marketing campaigns driving customer engagement and retail fashion reach for Max Fashion.',
    NULL,
    NULL,
    NULL,
    false,
    NULL,
    '[]'::jsonb,
    5,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline_events (
    id, year_id, year_number, name, type, category_badge, location_or_client, description, image, video_url, video_embed_url, has_video, drive_folder_url, videos, sort_order, is_published
) VALUES (
    'd477f50f-b781-40f2-8180-76d5d45612ea',
    'ec57088c-1a39-439d-960d-2957295fe73d',
    2023,
    'Max Little Icon – Trivandrum Edition',
    'Show',
    'KIDS TALENT & RUNWAY • SHOWCASE',
    'Max Fashion / Trivandrum',
    'Premier youth talent hunt and fashion runway showcase celebrating young runway stars in Trivandrum.',
    '/images/thumbnails/max little icon 2023.jpg',
    NULL,
    NULL,
    false,
    NULL,
    '[]'::jsonb,
    6,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline_events (
    id, year_id, year_number, name, type, category_badge, location_or_client, description, image, video_url, video_embed_url, has_video, drive_folder_url, videos, sort_order, is_published
) VALUES (
    '43aca788-ba50-47d6-aad4-eed5dedcf4d3',
    'ec57088c-1a39-439d-960d-2957295fe73d',
    2023,
    'Techie Summer Fest – Cultural Fest, Technopark',
    'Event',
    'CULTURAL FESTIVAL • VIDEO',
    'Technopark Trivandrum',
    'Vibrant corporate cultural festival and community celebration staged across the Technopark campus.',
    NULL,
    '/videos/techie summer fest.MP4',
    NULL,
    true,
    NULL,
    '[]'::jsonb,
    7,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline_events (
    id, year_id, year_number, name, type, category_badge, location_or_client, description, image, video_url, video_embed_url, has_video, drive_folder_url, videos, sort_order, is_published
) VALUES (
    'f93f3d43-6be5-4d96-94d2-f2eb2555f3e5',
    'ec57088c-1a39-439d-960d-2957295fe73d',
    2023,
    'Lulu Funtura Ad',
    'Ad',
    'ENTERTAINMENT COMMERCIAL • AD FILM',
    'Lulu Funtura / Lulu Mall',
    'High-energy family entertainment and amusement center commercial advertisement campaign produced for Lulu Funtura.',
    NULL,
    NULL,
    NULL,
    false,
    NULL,
    '[]'::jsonb,
    8,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline_events (
    id, year_id, year_number, name, type, category_badge, location_or_client, description, image, video_url, video_embed_url, has_video, drive_folder_url, videos, sort_order, is_published
) VALUES (
    '0aa44d16-4254-4b2d-84eb-0c8f97184cd6',
    '022da710-9b91-465e-96f7-de9b613a8943',
    2024,
    'Times of India – Aaravam',
    'Event',
    'MEDIA EVENT • VIDEO',
    'Times of India',
    'Aaravam, a Times of India event.',
    'https://drive.google.com/thumbnail?id=1rmoPoNcownVaPXRYmkaSa3M-n7u6yqhc&sz=w1200',
    NULL,
    'https://drive.google.com/file/d/1rmoPoNcownVaPXRYmkaSa3M-n7u6yqhc/preview',
    true,
    'https://drive.google.com/drive/folders/1ztgFUcmtUSEv3sSrFcU3bKy2jI9xZWtL',
    '[]'::jsonb,
    1,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline_events (
    id, year_id, year_number, name, type, category_badge, location_or_client, description, image, video_url, video_embed_url, has_video, drive_folder_url, videos, sort_order, is_published
) VALUES (
    'bb646538-6fe0-4e8b-8eef-532368ebbf0d',
    '022da710-9b91-465e-96f7-de9b613a8943',
    2024,
    'Škoda – Fans of Škoda',
    'Campaign',
    'EUROPEAN AUTOMOTIVE • VIDEO REEL',
    'Škoda Auto India',
    'Sophisticated lifestyle automotive campaign featuring curated creators exploring performance, safety, and European luxury drives.',
    'https://drive.google.com/thumbnail?id=18-WoWzGDIp7DnrCP6Cd7mA2XN-xr0e8A&sz=w1200',
    NULL,
    'https://drive.google.com/file/d/18-WoWzGDIp7DnrCP6Cd7mA2XN-xr0e8A/preview',
    true,
    'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs',
    '[]'::jsonb,
    2,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline_events (
    id, year_id, year_number, name, type, category_badge, location_or_client, description, image, video_url, video_embed_url, has_video, drive_folder_url, videos, sort_order, is_published
) VALUES (
    '72d493c9-8dbb-4b02-b975-eb921fe65d46',
    '022da710-9b91-465e-96f7-de9b613a8943',
    2024,
    'Ather – Electric Scooter',
    'Campaign',
    'EV MOBILITY REEL • VIDEO',
    'Ather Energy',
    'Forward-looking electric mobility campaign connecting sustainable urban commute with tech-savvy lifestyle creators featuring Riyas & Ganga.',
    'https://drive.google.com/thumbnail?id=1YymReRbadPvKyAXFzmmGVSsm4lExjIoD&sz=w1200',
    NULL,
    'https://drive.google.com/file/d/1YymReRbadPvKyAXFzmmGVSsm4lExjIoD/preview',
    true,
    'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs',
    '[]'::jsonb,
    3,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline_events (
    id, year_id, year_number, name, type, category_badge, location_or_client, description, image, video_url, video_embed_url, has_video, drive_folder_url, videos, sort_order, is_published
) VALUES (
    '297425e4-71ff-4252-b2a1-61134261c98c',
    '022da710-9b91-465e-96f7-de9b613a8943',
    2024,
    'Ather – Electric Scooter',
    'Campaign',
    'EV LIFESTYLE CAMPAIGN • VIDEO',
    'Ather Energy',
    'Urban mobility narrative capturing youth commute, fast charging, and contemporary electric scooter performance.',
    'https://drive.google.com/thumbnail?id=1agM4IPcwpZHfsXjbA-o8SfP4kkpPW1t_&sz=w1200',
    NULL,
    'https://drive.google.com/file/d/1agM4IPcwpZHfsXjbA-o8SfP4kkpPW1t_/preview',
    true,
    'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs',
    '[]'::jsonb,
    4,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline_events (
    id, year_id, year_number, name, type, category_badge, location_or_client, description, image, video_url, video_embed_url, has_video, drive_folder_url, videos, sort_order, is_published
) VALUES (
    '0236a2a5-656e-4ad4-a8b7-18fecc99ce8b',
    '022da710-9b91-465e-96f7-de9b613a8943',
    2024,
    'Ather – Festive Campaign',
    'Ad',
    'HOLIDAY FESTIVE COMMERCIAL • VIDEO',
    'Ather Energy',
    'High-energy festive holiday campaign celebrating the joy of electric rides with seasonal storytelling and Santa theme.',
    'https://drive.google.com/thumbnail?id=1uyYLbEDv9vYWKTYV7MlkflIS9UATtEed&sz=w1200',
    NULL,
    'https://drive.google.com/file/d/1uyYLbEDv9vYWKTYV7MlkflIS9UATtEed/preview',
    true,
    'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs',
    '[]'::jsonb,
    5,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline_events (
    id, year_id, year_number, name, type, category_badge, location_or_client, description, image, video_url, video_embed_url, has_video, drive_folder_url, videos, sort_order, is_published
) VALUES (
    'bfe3f992-05a5-4a9b-8d9f-07ac91887dc1',
    '022da710-9b91-465e-96f7-de9b613a8943',
    2024,
    'Ather',
    'Ad',
    'SOLO INFLUENCER REEL • VIDEO',
    'Ather Energy',
    'Solo creator highlight showcasing effortless city cruising and modern design aesthetics with Teena.',
    'https://drive.google.com/thumbnail?id=1EMcdGC2j-HSGaON7ApBTC0k9himB2auq&sz=w1200',
    NULL,
    'https://drive.google.com/file/d/1EMcdGC2j-HSGaON7ApBTC0k9himB2auq/preview',
    true,
    'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs',
    '[]'::jsonb,
    6,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline_events (
    id, year_id, year_number, name, type, category_badge, location_or_client, description, image, video_url, video_embed_url, has_video, drive_folder_url, videos, sort_order, is_published
) VALUES (
    '260e0a95-a930-4b07-8f02-fa254411af48',
    '022da710-9b91-465e-96f7-de9b613a8943',
    2024,
    'Build Hub',
    'Ad',
    'REAL ESTATE & INTERIOR • VIDEO',
    'Build Hub',
    'Architectural video commercial spotlighting modern building solutions, luxury materials, and contemporary interior concepts.',
    'https://drive.google.com/thumbnail?id=1GEWSZYSU8qQKNW05-dSMkmuUBd2AbOhV&sz=w1200',
    NULL,
    'https://drive.google.com/file/d/1GEWSZYSU8qQKNW05-dSMkmuUBd2AbOhV/preview',
    true,
    'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs',
    '[]'::jsonb,
    7,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline_events (
    id, year_id, year_number, name, type, category_badge, location_or_client, description, image, video_url, video_embed_url, has_video, drive_folder_url, videos, sort_order, is_published
) VALUES (
    'a802c086-4ac5-4e01-b1c5-8428081b757c',
    '022da710-9b91-465e-96f7-de9b613a8943',
    2024,
    'Build Hub',
    'Campaign',
    'CREATOR REELS CAMPAIGN • VIDEO',
    'Build Hub / RFR Network',
    'Engaging vertical video format highlighting luxury living spaces and construction excellence with Riyas & Reshma.',
    'https://drive.google.com/thumbnail?id=1u0aURKkBDlL2OGBvTlBdObHisDbpAVf3&sz=w1200',
    NULL,
    'https://drive.google.com/file/d/1u06VQPUy_karWcBOuLf10AFSGR_9PV35/preview',
    true,
    'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs',
    '[]'::jsonb,
    8,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline_events (
    id, year_id, year_number, name, type, category_badge, location_or_client, description, image, video_url, video_embed_url, has_video, drive_folder_url, videos, sort_order, is_published
) VALUES (
    '039f7ff0-a3e0-4313-ab6b-d71636593b06',
    '022da710-9b91-465e-96f7-de9b613a8943',
    2024,
    'Build Hub',
    'Ad',
    'LIFESTYLE COMMERCIAL • VIDEO',
    'Build Hub',
    'Exclusive interior design walkthrough and architectural finishes presented by Teena.',
    'https://drive.google.com/thumbnail?id=1Xar8Hc2PUaoNoSrAsu9j2QqBCD5QOHtZ&sz=w1200',
    NULL,
    'https://drive.google.com/file/d/1Xar8Hc2PUaoNoSrAsu9j2QqBCD5QOHtZ/preview',
    true,
    'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs',
    '[]'::jsonb,
    9,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline_events (
    id, year_id, year_number, name, type, category_badge, location_or_client, description, image, video_url, video_embed_url, has_video, drive_folder_url, videos, sort_order, is_published
) VALUES (
    '97407a59-8afc-43ed-942c-5733eafceb21',
    '022da710-9b91-465e-96f7-de9b613a8943',
    2024,
    'Concept Tyres',
    'Ad',
    'AUTOMOTIVE ADVERT • VIDEO',
    'Concept Tyres',
    'Dynamic automotive commercial video capturing road grip, reliability, and precision tyre performance.',
    'https://drive.google.com/thumbnail?id=1NhbGg_5G5ZUGLkUak9hZRp1rVmOymWEQ&sz=w1200',
    NULL,
    'https://drive.google.com/file/d/1NhbGg_5G5ZUGLkUak9hZRp1rVmOymWEQ/preview',
    true,
    'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs',
    '[]'::jsonb,
    10,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline_events (
    id, year_id, year_number, name, type, category_badge, location_or_client, description, image, video_url, video_embed_url, has_video, drive_folder_url, videos, sort_order, is_published
) VALUES (
    '6854ecfa-d495-488c-aca2-e3affe6f2f12',
    '022da710-9b91-465e-96f7-de9b613a8943',
    2024,
    'Scoria Lights',
    'Ad',
    'COMMERCIAL AD • VIDEO',
    'Scoria Lights',
    'Commercial advertisement production and architectural lighting showcase produced for Scoria Lights.',
    NULL,
    '/videos/Scorio Lights .mp4',
    NULL,
    true,
    NULL,
    '[]'::jsonb,
    11,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline_events (
    id, year_id, year_number, name, type, category_badge, location_or_client, description, image, video_url, video_embed_url, has_video, drive_folder_url, videos, sort_order, is_published
) VALUES (
    'c034aaff-6ad3-407e-89b0-db7557a2bb1e',
    '022da710-9b91-465e-96f7-de9b613a8943',
    2024,
    'Nissan',
    'Campaign',
    'AUTOMOTIVE INFLUENCER CAMPAIGN • VIDEO',
    'Nissan Motors',
    'Dynamic automotive influencer campaign and road performance storytelling created for Nissan.',
    NULL,
    '/videos/Nissan Riyas 1.mp4',
    NULL,
    true,
    NULL,
    '[]'::jsonb,
    12,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline_events (
    id, year_id, year_number, name, type, category_badge, location_or_client, description, image, video_url, video_embed_url, has_video, drive_folder_url, videos, sort_order, is_published
) VALUES (
    'd62989f5-3bbf-44ff-92ac-3b076cffdbd5',
    'bad867e2-d278-4019-a27c-24678f4e2539',
    2025,
    'Rewind with Riyas — Celebrity Talk Show & Podcast',
    'Podcast',
    'ORIGINAL PODCAST STUDIO IP • 7 EPISODES',
    'RFR Studio IP',
    'Conversations beyond the runway. Intimate, unfiltered dialogues with film stars, fashion designers, top influencers, and creative pioneers.',
    'https://drive.google.com/thumbnail?id=1BwkKNnLO0pV78_R2Cz-wjgL8pBP1eV7E&sz=w1200',
    NULL,
    'https://drive.google.com/file/d/1BwkKNnLO0pV78_R2Cz-wjgL8pBP1eV7E/preview',
    true,
    'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs',
    '[{"id":"podcast-1","title":"Podcast Vijay 1","videoEmbedUrl":"https://drive.google.com/file/d/1BwkKNnLO0pV78_R2Cz-wjgL8pBP1eV7E/preview","image":"https://drive.google.com/thumbnail?id=1BwkKNnLO0pV78_R2Cz-wjgL8pBP1eV7E&sz=w1200"},{"id":"podcast-2","title":"Podcast Shikha Highlights","videoEmbedUrl":"https://drive.google.com/file/d/1RLQpL8q5bt2kF2WhnqnA2PCmVPLKBLXz/preview","image":"https://drive.google.com/thumbnail?id=1RLQpL8q5bt2kF2WhnqnA2PCmVPLKBLXz&sz=w1200"},{"id":"podcast-3","title":"Podcast Shikha 2","videoEmbedUrl":"https://drive.google.com/file/d/1GmbrqmVslqttr67VN_cC6R3MI23LeA6G/preview","image":"https://drive.google.com/thumbnail?id=1GmbrqmVslqttr67VN_cC6R3MI23LeA6G&sz=w1200"},{"id":"podcast-4","title":"Podcast Shikha 1","videoEmbedUrl":"https://drive.google.com/file/d/13CvX5gywQ0hoFd4b08o2-MwdCb7oRyIv/preview","image":"https://drive.google.com/thumbnail?id=13CvX5gywQ0hoFd4b08o2-MwdCb7oRyIv&sz=w1200"},{"id":"podcast-5","title":"Podcast Krishna 2","videoEmbedUrl":"https://drive.google.com/file/d/1i-lBTYBgz7_LgaOdu1t65Cqcy4FcTvm0/preview","image":"https://drive.google.com/thumbnail?id=1i-lBTYBgz7_LgaOdu1t65Cqcy4FcTvm0&sz=w1200"},{"id":"podcast-6","title":"Podcast Krishna","videoEmbedUrl":"https://drive.google.com/file/d/1Q-ebpbx6ELdWoOmL0UcCkUuC9qI3EeVF/preview","image":"https://drive.google.com/thumbnail?id=1Q-ebpbx6ELdWoOmL0UcCkUuC9qI3EeVF&sz=w1200"},{"id":"podcast-7","title":"Podcast Akhila 1","videoEmbedUrl":"https://drive.google.com/file/d/1lh7P_9jS1szbaRMo2q2iSRheTKFRQzjM/preview","image":"https://drive.google.com/thumbnail?id=1lh7P_9jS1szbaRMo2q2iSRheTKFRQzjM&sz=w1200"}]'::jsonb,
    1,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline_events (
    id, year_id, year_number, name, type, category_badge, location_or_client, description, image, video_url, video_embed_url, has_video, drive_folder_url, videos, sort_order, is_published
) VALUES (
    '922ac88d-aa98-43c7-a9d5-4d223ca7ddf2',
    'bad867e2-d278-4019-a27c-24678f4e2539',
    2025,
    'Chakita DD Retreat Show — Stage & Runway Highlights',
    'Show',
    'COUTURE DESIGNER RUNWAY • VIDEO',
    'Chakita Haute Couture / DD Retreat',
    'High-concept couture runway showcase featuring avant-garde tailoring, bespoke choreography, stage photography, and celebrity showstoppers.',
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80',
    NULL,
    'https://drive.google.com/file/d/1WMQC1KhSwMH8U973Iqfy7i_6K5fy7j5Y/preview',
    true,
    'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs',
    '[]'::jsonb,
    2,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline_events (
    id, year_id, year_number, name, type, category_badge, location_or_client, description, image, video_url, video_embed_url, has_video, drive_folder_url, videos, sort_order, is_published
) VALUES (
    'e016b890-8cd5-4fa4-ae38-85d39529dd01',
    'bad867e2-d278-4019-a27c-24678f4e2539',
    2025,
    'Navaratri Naach 2025 — Official Highlight Videos',
    'Event',
    'GRAND FESTIVAL REEL • VIDEO',
    'RFR Festive Productions',
    'Spectacular Navaratri celebratory gala featuring vibrant cultural performances, designer ethnic wear, and massive community attendance.',
    'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1200&q=80',
    NULL,
    'https://drive.google.com/file/d/1Fg28k07NGX7Bd4RuxfJ2eIBHXRY3BeZ6/preview',
    true,
    'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs',
    '[]'::jsonb,
    3,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline_events (
    id, year_id, year_number, name, type, category_badge, location_or_client, description, image, video_url, video_embed_url, has_video, drive_folder_url, videos, sort_order, is_published
) VALUES (
    'add503e7-e4bb-46cd-bf48-ef36c9c4b415',
    'bad867e2-d278-4019-a27c-24678f4e2539',
    2025,
    'Dandiya Deeshna Night & Highlights Video',
    'Event',
    'FESTIVE CULTURAL GALA • 3 REELS',
    'RFR Cultural Properties',
    'High-energy festive celebration uniting traditional Garba beats, dynamic DJ sets, ethnic fashion, and thousands of dancers.',
    'https://drive.google.com/thumbnail?id=1HY30vLdhdsZ63PE4t8Hr0Iu5hgxoD6Mu&sz=w1200',
    NULL,
    'https://drive.google.com/file/d/1HY30vLdhdsZ63PE4t8Hr0Iu5hgxoD6Mu/preview',
    true,
    'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs',
    '[{"id":"dandya-1","title":"Dandya Highlights","videoEmbedUrl":"https://drive.google.com/file/d/1HY30vLdhdsZ63PE4t8Hr0Iu5hgxoD6Mu/preview","image":"https://drive.google.com/thumbnail?id=1HY30vLdhdsZ63PE4t8Hr0Iu5hgxoD6Mu&sz=w1200"},{"id":"dandya-2","title":"Dandya Highlights 2","videoEmbedUrl":"https://drive.google.com/file/d/1k9VlXVJIsU2fwnC_Ff0P_np9FTbIatO3/preview","image":"https://drive.google.com/thumbnail?id=1k9VlXVJIsU2fwnC_Ff0P_np9FTbIatO3&sz=w1200"},{"id":"dandya-3","title":"Dandya Night Teaser","videoEmbedUrl":"https://drive.google.com/file/d/1dy6TIwofRd4bWLMrdHeiykYkqTVbFIFw/preview","image":"https://drive.google.com/thumbnail?id=1dy6TIwofRd4bWLMrdHeiykYkqTVbFIFw&sz=w1200"}]'::jsonb,
    4,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline_events (
    id, year_id, year_number, name, type, category_badge, location_or_client, description, image, video_url, video_embed_url, has_video, drive_folder_url, videos, sort_order, is_published
) VALUES (
    '2e286990-ef2f-487d-a034-032bcad737f7',
    'bad867e2-d278-4019-a27c-24678f4e2539',
    2025,
    'Dandiya Night Teaser Video',
    'Event',
    'FESTIVAL TEASER • VIDEO',
    'RFR Cultural Properties',
    'Official teaser video capturing the vibrant rhythm, colorful costumes, and electrifying atmosphere of Dandiya Night.',
    'https://drive.google.com/thumbnail?id=1dy6TIwofRd4bWLMrdHeiykYkqTVbFIFw&sz=w1200',
    NULL,
    'https://drive.google.com/file/d/1dy6TIwofRd4bWLMrdHeiykYkqTVbFIFw/preview',
    true,
    'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs',
    '[]'::jsonb,
    5,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline_events (
    id, year_id, year_number, name, type, category_badge, location_or_client, description, image, video_url, video_embed_url, has_video, drive_folder_url, videos, sort_order, is_published
) VALUES (
    '8a5c4cad-5fca-4fd7-9fd1-ab56b2497597',
    'bad867e2-d278-4019-a27c-24678f4e2539',
    2025,
    'Hycinth Fashion Event with Rohas',
    'Show',
    'LUXURY HOTEL RUNWAY • VIDEO',
    'Hycinth Hotels & Resorts',
    'Exclusive five-star fashion presentation spotlighting contemporary silhouettes, guest models, and curated lighting with Rohas.',
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80',
    NULL,
    'https://drive.google.com/file/d/1nD_NabOGiZW4GT_jawFlXRpPh9ok1ckL/preview',
    true,
    'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs',
    '[]'::jsonb,
    6,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline_events (
    id, year_id, year_number, name, type, category_badge, location_or_client, description, image, video_url, video_embed_url, has_video, drive_folder_url, videos, sort_order, is_published
) VALUES (
    '4cc8525a-0294-4299-830c-11612098978c',
    'bad867e2-d278-4019-a27c-24678f4e2539',
    2025,
    'Hycinth Rohan Runway Videos',
    'Show',
    'DESIGNER SHOWCASE • VIDEO',
    'Hycinth Hotels',
    'Runway cuts and designer spotlight videos featuring high-fashion choreography at Hycinth.',
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80',
    NULL,
    'https://drive.google.com/file/d/1nhQCGv1wlvsZpVAfhI23eR5SccWEE_0E/preview',
    true,
    'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs',
    '[]'::jsonb,
    7,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline_events (
    id, year_id, year_number, name, type, category_badge, location_or_client, description, image, video_url, video_embed_url, has_video, drive_folder_url, videos, sort_order, is_published
) VALUES (
    '49865ef8-31f7-4474-a5ac-d49980a4e449',
    'bad867e2-d278-4019-a27c-24678f4e2539',
    2025,
    'NYE 2026 Hycinth Highlights & Countdown',
    'Event',
    '5-STAR LUXURY GALA • 4 MEDIA GALLERIES',
    'Hycinth Hotels',
    'Exclusive countdown spectacle and VIP gala dinner produced with world-class light and sound architecture at Hycinth.',
    'https://drive.google.com/thumbnail?id=15vI0jdpl_uq2VdSPrU4py6ylu-bs-4Yv&sz=w1200',
    NULL,
    'https://drive.google.com/file/d/15vI0jdpl_uq2VdSPrU4py6ylu-bs-4Yv/preview',
    true,
    'https://drive.google.com/drive/folders/15vI0jdpl_uq2VdSPrU4py6ylu-bs-4Yv',
    '[{"id":"nye-1","title":"NYE 2026 Hycinth Highlights","videoEmbedUrl":"https://drive.google.com/file/d/15vI0jdpl_uq2VdSPrU4py6ylu-bs-4Yv/preview","image":"https://drive.google.com/thumbnail?id=15vI0jdpl_uq2VdSPrU4py6ylu-bs-4Yv&sz=w1200"},{"id":"nye-2","title":"NYE 2026 Max Showcase","videoEmbedUrl":"https://drive.google.com/file/d/1XihgDqv_tpyl8Otw4NQNLVDn-CgY3ZyD/preview","image":"https://drive.google.com/thumbnail?id=1XihgDqv_tpyl8Otw4NQNLVDn-CgY3ZyD&sz=w1200"},{"id":"nye-3","title":"NYE 2026 FS Videos & Stage Production","videoEmbedUrl":"https://drive.google.com/file/d/1aqqHq2lAQ5SLXhgteRT92P_aCIyG2eaq/preview","image":"https://drive.google.com/thumbnail?id=1aqqHq2lAQ5SLXhgteRT92P_aCIyG2eaq&sz=w1200"},{"id":"nye-4","title":"NYE Roopesh Costume Showcase","videoEmbedUrl":"https://drive.google.com/file/d/1-Z06ay5-PfYu8_MR0pRUb0EBN0WV2vq-/preview","image":"https://drive.google.com/thumbnail?id=1-Z06ay5-PfYu8_MR0pRUb0EBN0WV2vq-&sz=w1200"}]'::jsonb,
    8,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline_events (
    id, year_id, year_number, name, type, category_badge, location_or_client, description, image, video_url, video_embed_url, has_video, drive_folder_url, videos, sort_order, is_published
) VALUES (
    '3d93e292-d1cb-4f62-ae7a-595647a7971f',
    'bad867e2-d278-4019-a27c-24678f4e2539',
    2025,
    'NYE 2026 FS Videos & Stage Production',
    'Event',
    'SPECTACLE VIDEO • COUNTDOWN',
    'RFR Stage Architecture',
    'Immersive stage engineering, laser shows, and crowd euphoria captured during the NYE 2026 celebration.',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    NULL,
    'https://drive.google.com/file/d/1aqqHq2lAQ5SLXhgteRT92P_aCIyG2eaq/preview',
    true,
    'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs',
    '[]'::jsonb,
    9,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline_events (
    id, year_id, year_number, name, type, category_badge, location_or_client, description, image, video_url, video_embed_url, has_video, drive_folder_url, videos, sort_order, is_published
) VALUES (
    'ae0a2aad-ab5d-46db-b76c-5792677e3a33',
    'bad867e2-d278-4019-a27c-24678f4e2539',
    2025,
    'Pothys Swarnamahal – Vishu Ad Influencer Campaign',
    'Campaign',
    'JEWELLERY CAMPAIGN • 7 REELS',
    'Pothys Swarnamahal',
    'Festive Vishu jewellery influencer campaigns and commercial digital reels produced for Pothys Swarnamahal.',
    '/images/pothys.png',
    NULL,
    'https://drive.google.com/file/d/1pCPpzIG-bo2Z7wiq1rYvQ3Mm1xWQ6tOO/preview',
    true,
    NULL,
    '[{"id":"pothys-1","title":"Pothys Riyas & Ritu","videoEmbedUrl":"https://drive.google.com/file/d/1pCPpzIG-bo2Z7wiq1rYvQ3Mm1xWQ6tOO/preview","image":"https://drive.google.com/thumbnail?id=1pCPpzIG-bo2Z7wiq1rYvQ3Mm1xWQ6tOO&sz=w1200"},{"id":"pothys-2","title":"Pothys Riyas & Rithu 2","videoEmbedUrl":"https://drive.google.com/file/d/1RSzFXbd4u-PudlNFLVdpMa_5w2r6be41/preview","image":"https://drive.google.com/thumbnail?id=1RSzFXbd4u-PudlNFLVdpMa_5w2r6be41&sz=w1200"},{"id":"pothys-3","title":"Pothys Riyas & Geethu","videoEmbedUrl":"https://drive.google.com/file/d/1bj3XbE2Cb4Y18U63x2bVeCcWErZLOLMt/preview","image":"https://drive.google.com/thumbnail?id=1bj3XbE2Cb4Y18U63x2bVeCcWErZLOLMt&sz=w1200"},{"id":"pothys-4","title":"Pothys Niranjana","videoEmbedUrl":"https://drive.google.com/file/d/1OqhS56YREPJ6z7fTTNFYgD9gQUd9UjGU/preview","image":"https://drive.google.com/thumbnail?id=1OqhS56YREPJ6z7fTTNFYgD9gQUd9UjGU&sz=w1200"},{"id":"pothys-5","title":"Pothys Krishna Single","videoEmbedUrl":"https://drive.google.com/file/d/1XSVcGEB6yHNAnFgIqRe96i0bN6nrdQv0/preview","image":"https://drive.google.com/thumbnail?id=1XSVcGEB6yHNAnFgIqRe96i0bN6nrdQv0&sz=w1200"},{"id":"pothys-6","title":"Pothys Krishna","videoEmbedUrl":"https://drive.google.com/file/d/1bdxycJk0sl3Qo8Tfvuy1N5JBzOuXaF_d/preview","image":"https://drive.google.com/thumbnail?id=1bdxycJk0sl3Qo8Tfvuy1N5JBzOuXaF_d&sz=w1200"},{"id":"pothys-7","title":"Pothys Diwali Ganga","videoEmbedUrl":"https://drive.google.com/file/d/1TWrKeCoGW087YSxqMA2ZcAfE2uf520EG/preview","image":"https://drive.google.com/thumbnail?id=1TWrKeCoGW087YSxqMA2ZcAfE2uf520EG&sz=w1200"}]'::jsonb,
    10,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline_events (
    id, year_id, year_number, name, type, category_badge, location_or_client, description, image, video_url, video_embed_url, has_video, drive_folder_url, videos, sort_order, is_published
) VALUES (
    '2b331f12-6945-4a1f-8a00-5bf511298a30',
    'bad867e2-d278-4019-a27c-24678f4e2539',
    2025,
    'Chakita Designer Show',
    'Show',
    'COUTURE DESIGNER RUNWAY • VIDEO',
    'Chakita Haute Couture',
    'High-fashion designer runway showcase and bespoke couture choreography for Chakita.',
    'https://drive.google.com/thumbnail?id=1WMQC1KhSwMH8U973Iqfy7i_6K5fy7j5Y&sz=w1200',
    NULL,
    'https://drive.google.com/file/d/1WMQC1KhSwMH8U973Iqfy7i_6K5fy7j5Y/preview',
    true,
    'https://drive.google.com/drive/folders/1WMQC1KhSwMH8U973Iqfy7i_6K5fy7j5Y',
    '[]'::jsonb,
    11,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline_events (
    id, year_id, year_number, name, type, category_badge, location_or_client, description, image, video_url, video_embed_url, has_video, drive_folder_url, videos, sort_order, is_published
) VALUES (
    '5ff603a1-3555-4372-a3af-a1a13a8f568e',
    'bad867e2-d278-4019-a27c-24678f4e2539',
    2025,
    'Max Designer Show',
    'Show',
    'FASHION DESIGNER RUNWAY • VIDEO GALLERY',
    'Max Fashion',
    'Signature contemporary runway presentations and designer collection showcases for Max Fashion.',
    'https://drive.google.com/thumbnail?id=1nD_NabOGiZW4GT_jawFlXRpPh9ok1ckL&sz=w1200',
    NULL,
    'https://drive.google.com/file/d/1nD_NabOGiZW4GT_jawFlXRpPh9ok1ckL/preview',
    true,
    NULL,
    '[{"id":"max-1","title":"Max Designer Runway — Reel 01","videoEmbedUrl":"https://drive.google.com/file/d/1nD_NabOGiZW4GT_jawFlXRpPh9ok1ckL/preview","image":"https://drive.google.com/thumbnail?id=1nD_NabOGiZW4GT_jawFlXRpPh9ok1ckL&sz=w1200"},{"id":"max-2","title":"Max Designer Runway — Reel 02","videoEmbedUrl":"https://drive.google.com/file/d/1nhQCGv1wlvsZpVAfhI23eR5SccWEE_0E/preview","image":"https://drive.google.com/thumbnail?id=1nhQCGv1wlvsZpVAfhI23eR5SccWEE_0E&sz=w1200"}]'::jsonb,
    12,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline_events (
    id, year_id, year_number, name, type, category_badge, location_or_client, description, image, video_url, video_embed_url, has_video, drive_folder_url, videos, sort_order, is_published
) VALUES (
    '9f9ecdd2-0712-4872-94bf-38feb030241e',
    'bad867e2-d278-4019-a27c-24678f4e2539',
    2025,
    'Influencer Campaign – Nissan',
    'Campaign',
    'AUTOMOTIVE CAMPAIGN • VIDEO',
    'Nissan',
    'High-impact commercial influencer campaign highlighting Nissan performance, agility, and modern styling.',
    'https://drive.google.com/thumbnail?id=1gb6THCIg1MQ75dKOEKd7d52cea7Uh5L_&sz=w1200',
    NULL,
    'https://drive.google.com/file/d/1gb6THCIg1MQ75dKOEKd7d52cea7Uh5L_/preview',
    true,
    NULL,
    '[]'::jsonb,
    13,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline_events (
    id, year_id, year_number, name, type, category_badge, location_or_client, description, image, video_url, video_embed_url, has_video, drive_folder_url, videos, sort_order, is_published
) VALUES (
    'e95d5b12-ac08-4e0f-a867-bc07be0103b3',
    'bad867e2-d278-4019-a27c-24678f4e2539',
    2025,
    'Ather Scooter',
    'Campaign',
    'EV MOBILITY CAMPAIGN • 2 REELS',
    'Ather Energy',
    'Next-generation electric scooter commercial campaign and festive holiday storytelling produced for Ather Energy.',
    'https://drive.google.com/thumbnail?id=1YymReRbadPvKyAXFzmmGVSsm4lExjIoD&sz=w1200',
    NULL,
    'https://drive.google.com/file/d/1YymReRbadPvKyAXFzmmGVSsm4lExjIoD/preview',
    true,
    NULL,
    '[{"id":"ather-2025-1","title":"Ather Riyas & Ganga","videoEmbedUrl":"https://drive.google.com/file/d/1YymReRbadPvKyAXFzmmGVSsm4lExjIoD/preview","image":"https://drive.google.com/thumbnail?id=1YymReRbadPvKyAXFzmmGVSsm4lExjIoD&sz=w1200"},{"id":"ather-2025-2","title":"Ather Combo Santa","videoEmbedUrl":"https://drive.google.com/file/d/1E5x3q55OZm8KmGBbbOHBMvJqvkf2WpPg/preview","image":"https://drive.google.com/thumbnail?id=1E5x3q55OZm8KmGBbbOHBMvJqvkf2WpPg&sz=w1200"}]'::jsonb,
    14,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline_events (
    id, year_id, year_number, name, type, category_badge, location_or_client, description, image, video_url, video_embed_url, has_video, drive_folder_url, videos, sort_order, is_published
) VALUES (
    'ecdd3467-1e7a-4c18-9b0a-a9ef64cd73f1',
    'bad867e2-d278-4019-a27c-24678f4e2539',
    2025,
    'Healing Swan – Wellness Center Ad',
    'Ad',
    'WELLNESS & HEALTHCARE • AD FILM',
    'Healing Swan Wellness Center',
    'Serene commercial brand film and holistic lifestyle visual showcase produced for Healing Swan Wellness Center.',
    'https://drive.google.com/thumbnail?id=1OlgBH9hHzF1GtYfPOlPvwaJaA_xtUmgc&sz=w1200',
    NULL,
    'https://drive.google.com/file/d/1OlgBH9hHzF1GtYfPOlPvwaJaA_xtUmgc/preview',
    true,
    NULL,
    '[]'::jsonb,
    15,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline_events (
    id, year_id, year_number, name, type, category_badge, location_or_client, description, image, video_url, video_embed_url, has_video, drive_folder_url, videos, sort_order, is_published
) VALUES (
    '76f73791-024f-46d2-9436-3be9286808a3',
    'bad867e2-d278-4019-a27c-24678f4e2539',
    2025,
    'Influencer Campaign – Max',
    'Campaign',
    'FASHION INFLUENCER REEL • VIDEO',
    'Max Fashion',
    'Dynamic retail fashion influencer campaign featuring Shikha showcasing seasonal collections for Max Fashion.',
    'https://drive.google.com/thumbnail?id=1vLeEHWch-OxIwEdpMVSQCm4PL-h6cwbI&sz=w1200',
    NULL,
    'https://drive.google.com/file/d/1vLeEHWch-OxIwEdpMVSQCm4PL-h6cwbI/preview',
    true,
    NULL,
    '[]'::jsonb,
    16,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline_events (
    id, year_id, year_number, name, type, category_badge, location_or_client, description, image, video_url, video_embed_url, has_video, drive_folder_url, videos, sort_order, is_published
) VALUES (
    '97a8304c-538f-4fe2-8219-9dff0751bcba',
    '6736b7bf-19dd-48ec-b6b1-ef3ee9dfe72b',
    2026,
    'Citroën – Aircross Campaign',
    'Campaign',
    'FRENCH AUTOMOTIVE • 12 CAMPAIGN REELS',
    'Citroën India',
    'Flagship commercial video production highlighting the dynamic comfort, modular space, and European design of Citroën Aircross.',
    'https://drive.google.com/thumbnail?id=17xhWbUtxJePM8igOO7VADLDfiqcG6S04&sz=w1200',
    NULL,
    'https://drive.google.com/file/d/17xhWbUtxJePM8igOO7VADLDfiqcG6S04/preview',
    true,
    'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs',
    '[{"id":"citroen-1","title":"Citroën – Aircross Showcase","videoEmbedUrl":"https://drive.google.com/file/d/17xhWbUtxJePM8igOO7VADLDfiqcG6S04/preview","image":"https://drive.google.com/thumbnail?id=17xhWbUtxJePM8igOO7VADLDfiqcG6S04&sz=w1200"},{"id":"citroen-2","title":"Citroën – Onam Campaign","videoEmbedUrl":"https://drive.google.com/file/d/1Jpf1n_swCBJtTytbskrRNVNIa_CMUeMF/preview","image":"https://drive.google.com/thumbnail?id=1Jpf1n_swCBJtTytbskrRNVNIa_CMUeMF&sz=w1200"},{"id":"citroen-3","title":"Citroën – Onam Showcase","videoEmbedUrl":"https://drive.google.com/file/d/139wztoY-mC0R8Y5x0v_tZWbEqd1XyCmM/preview","image":"https://drive.google.com/thumbnail?id=139wztoY-mC0R8Y5x0v_tZWbEqd1XyCmM&sz=w1200"},{"id":"citroen-4","title":"Citroën – Pre-Onam Campaign","videoEmbedUrl":"https://drive.google.com/file/d/1Zic99SZst13pSd0l8-adVZwzuSxSbZj8/preview","image":"https://drive.google.com/thumbnail?id=1Zic99SZst13pSd0l8-adVZwzuSxSbZj8&sz=w1200"},{"id":"citroen-5","title":"Citroën – Pre-Onam Showcase","videoEmbedUrl":"https://drive.google.com/file/d/1kPqk0SWzlqcGt3dn1ZWGN5GWDuRXevQB/preview","image":"https://drive.google.com/thumbnail?id=1kPqk0SWzlqcGt3dn1ZWGN5GWDuRXevQB&sz=w1200"},{"id":"citroen-6","title":"Citroën – Lifestyle Drive","videoEmbedUrl":"https://drive.google.com/file/d/157n4wQ7Mz5LvZcei3EuAnbwe9BIZlYR_/preview","image":"https://drive.google.com/thumbnail?id=157n4wQ7Mz5LvZcei3EuAnbwe9BIZlYR_&sz=w1200"},{"id":"citroen-7","title":"Citroën – Festive Drive","videoEmbedUrl":"https://drive.google.com/file/d/1bokzX5PR6GaioY8KazckyQhM3RFpiDCl/preview","image":"https://drive.google.com/thumbnail?id=1bokzX5PR6GaioY8KazckyQhM3RFpiDCl&sz=w1200"},{"id":"citroen-8","title":"Citroën – Basalt Launch","videoEmbedUrl":"https://drive.google.com/file/d/1qwwQ8wxW-wOCRN9bG1bW23nJT9OSPN1g/preview","image":"https://drive.google.com/thumbnail?id=1qwwQ8wxW-wOCRN9bG1bW23nJT9OSPN1g&sz=w1200"},{"id":"citroen-9","title":"Citroën – Urban Drive","videoEmbedUrl":"https://drive.google.com/file/d/1w004ZcoXcYgqMIwekDAOV3WwwRwULtei/preview","image":"https://drive.google.com/thumbnail?id=1w004ZcoXcYgqMIwekDAOV3WwwRwULtei&sz=w1200"},{"id":"citroen-10","title":"Citroën – EV Campaign","videoEmbedUrl":"https://drive.google.com/file/d/15hsMQ6JIMxRxibiGZx8l5sIpubMQSCe3/preview","image":"https://drive.google.com/thumbnail?id=15hsMQ6JIMxRxibiGZx8l5sIpubMQSCe3&sz=w1200"},{"id":"citroen-11","title":"Citroën – Brand Film","videoEmbedUrl":"https://drive.google.com/file/d/10zpUbgg33lw8Jeoj2YlFGWdwZ6wuMWoN/preview","image":"https://drive.google.com/thumbnail?id=10zpUbgg33lw8Jeoj2YlFGWdwZ6wuMWoN&sz=w1200"},{"id":"citroen-12","title":"Citroën – Interior & Cockpit Feature","videoEmbedUrl":"https://drive.google.com/file/d/1SHBH3ggfVo2xlZSV8mgcsOMrj7KB3yZr/preview","image":"https://drive.google.com/thumbnail?id=1SHBH3ggfVo2xlZSV8mgcsOMrj7KB3yZr&sz=w1200"}]'::jsonb,
    1,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline_events (
    id, year_id, year_number, name, type, category_badge, location_or_client, description, image, video_url, video_embed_url, has_video, drive_folder_url, videos, sort_order, is_published
) VALUES (
    'aafb5fff-1f61-4256-979b-bd66c9666dc4',
    '6736b7bf-19dd-48ec-b6b1-ef3ee9dfe72b',
    2026,
    'Citroën – Onam Campaign',
    'Campaign',
    'FESTIVE AUTOMOTIVE REEL • VIDEO',
    'Citroën India',
    'Vibrant Onam festival narrative featuring Riyas and Thara exploring Kerala’s heritage in contemporary Citroën vehicles.',
    'https://drive.google.com/thumbnail?id=1Jpf1n_swCBJtTytbskrRNVNIa_CMUeMF&sz=w1200',
    NULL,
    'https://drive.google.com/file/d/1Jpf1n_swCBJtTytbskrRNVNIa_CMUeMF/preview',
    true,
    'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs',
    '[]'::jsonb,
    2,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline_events (
    id, year_id, year_number, name, type, category_badge, location_or_client, description, image, video_url, video_embed_url, has_video, drive_folder_url, videos, sort_order, is_published
) VALUES (
    '4b820183-f51d-4d52-8506-1d5e8fc4851a',
    '6736b7bf-19dd-48ec-b6b1-ef3ee9dfe72b',
    2026,
    'Citroën – Onam Showcase',
    'Ad',
    'FESTIVE LIFESTYLE REEL • VIDEO',
    'Citroën India',
    'Festive Kerala ethnic styling meets modern automotive elegance featuring Thara in the Citroën Onam special.',
    'https://drive.google.com/thumbnail?id=139wztoY-mC0R8Y5x0v_tZWbEqd1XyCmM&sz=w1200',
    NULL,
    'https://drive.google.com/file/d/139wztoY-mC0R8Y5x0v_tZWbEqd1XyCmM/preview',
    true,
    'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs',
    '[]'::jsonb,
    3,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline_events (
    id, year_id, year_number, name, type, category_badge, location_or_client, description, image, video_url, video_embed_url, has_video, drive_folder_url, videos, sort_order, is_published
) VALUES (
    'b55e8405-1caa-4590-99a2-0d753659f0f3',
    '6736b7bf-19dd-48ec-b6b1-ef3ee9dfe72b',
    2026,
    'Citroën – Pre-Onam Campaign',
    'Campaign',
    'PRE-FESTIVE CAMPAIGN • VIDEO',
    'Citroën India',
    'Excitement builds towards Onam celebrations with dynamic road trips, scenic Kerala routes, and Citroën comfort.',
    'https://drive.google.com/thumbnail?id=1kPqk0SWzlqcGt3dn1ZWGN5GWDuRXevQB&sz=w1200',
    NULL,
    'https://drive.google.com/file/d/1kPqk0SWzlqcGt3dn1ZWGN5GWDuRXevQB/preview',
    true,
    'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs',
    '[]'::jsonb,
    4,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline_events (
    id, year_id, year_number, name, type, category_badge, location_or_client, description, image, video_url, video_embed_url, has_video, drive_folder_url, videos, sort_order, is_published
) VALUES (
    'e2c12813-c46e-4789-a53f-4532d7e494c7',
    '6736b7bf-19dd-48ec-b6b1-ef3ee9dfe72b',
    2026,
    'Citroën – Basalt Launch',
    'Ad',
    'SUV COUPE AD • VIDEO',
    'Citroën India',
    'Sleek, high-fashion styling meets automotive innovation in the official Citroën Basalt launch video with Riyas.',
    'https://drive.google.com/thumbnail?id=1qwwQ8wxW-wOCRN9bG1bW23nJT9OSPN1g&sz=w1200',
    NULL,
    'https://drive.google.com/file/d/1qwwQ8wxW-wOCRN9bG1bW23nJT9OSPN1g/preview',
    true,
    'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs',
    '[]'::jsonb,
    5,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline_events (
    id, year_id, year_number, name, type, category_badge, location_or_client, description, image, video_url, video_embed_url, has_video, drive_folder_url, videos, sort_order, is_published
) VALUES (
    'c448867a-db01-4edc-9aa9-75b86b1cbbf8',
    '6736b7bf-19dd-48ec-b6b1-ef3ee9dfe72b',
    2026,
    'Citroën – EV Campaign',
    'Ad',
    'SUSTAINABLE EV AD • VIDEO',
    'Citroën India',
    'Quiet luxury, smooth electric acceleration, and urban chic lifestyle video featuring Thara in the all-electric Citroën ë-C3.',
    'https://drive.google.com/thumbnail?id=15hsMQ6JIMxRxibiGZx8l5sIpubMQSCe3&sz=w1200',
    NULL,
    'https://drive.google.com/file/d/15hsMQ6JIMxRxibiGZx8l5sIpubMQSCe3/preview',
    true,
    'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs',
    '[]'::jsonb,
    6,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline_events (
    id, year_id, year_number, name, type, category_badge, location_or_client, description, image, video_url, video_embed_url, has_video, drive_folder_url, videos, sort_order, is_published
) VALUES (
    'cee8c641-6598-4a04-9d53-b2211bcd3a5c',
    '6736b7bf-19dd-48ec-b6b1-ef3ee9dfe72b',
    2026,
    'Citroën – Commercial Showcase',
    'Ad',
    'AUTOMOTIVE EDITORIAL • VIDEO',
    'Citroën India',
    'Editorial commercial cut focusing on precision cockpit design, ambient textures, and lifestyle luxury with Thara.',
    'https://drive.google.com/thumbnail?id=1SHBH3ggfVo2xlZSV8mgcsOMrj7KB3yZr&sz=w1200',
    NULL,
    'https://drive.google.com/file/d/1SHBH3ggfVo2xlZSV8mgcsOMrj7KB3yZr/preview',
    true,
    'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs',
    '[]'::jsonb,
    7,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline_events (
    id, year_id, year_number, name, type, category_badge, location_or_client, description, image, video_url, video_embed_url, has_video, drive_folder_url, videos, sort_order, is_published
) VALUES (
    '51d38e80-7a63-401a-9af5-08b8e430267d',
    '6736b7bf-19dd-48ec-b6b1-ef3ee9dfe72b',
    2026,
    'Lemon Tree – Leisure Campaign',
    'Ad',
    'HOSPITALITY COMMERCIAL • 2 REELS',
    'Lemon Tree Hotels',
    'Cinematic brand film and promotional digital campaign highlighting premier leisure hospitality, suites, and dining with Jeevan.',
    'https://drive.google.com/thumbnail?id=1pZfSfv6dcuY2s2uQKI6JudJjJZVpTUOd&sz=w1200',
    NULL,
    'https://drive.google.com/file/d/1pZfSfv6dcuY2s2uQKI6JudJjJZVpTUOd/preview',
    true,
    'https://drive.google.com/drive/folders/1pZfSfv6dcuY2s2uQKI6JudJjJZVpTUOd',
    '[{"id":"lemon-1","title":"Lemon Tree – Brand Film","videoEmbedUrl":"https://drive.google.com/file/d/1pZfSfv6dcuY2s2uQKI6JudJjJZVpTUOd/preview","image":"https://drive.google.com/thumbnail?id=1pZfSfv6dcuY2s2uQKI6JudJjJZVpTUOd&sz=w1200"},{"id":"lemon-2","title":"Lemon Tree – Suites & Dining Showcase","videoEmbedUrl":"https://drive.google.com/file/d/1vpzEX0IxFEPa4x8fdepzHl7KwGsQODDM/preview","image":"https://drive.google.com/thumbnail?id=1vpzEX0IxFEPa4x8fdepzHl7KwGsQODDM&sz=w1200"}]'::jsonb,
    8,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline_events (
    id, year_id, year_number, name, type, category_badge, location_or_client, description, image, video_url, video_embed_url, has_video, drive_folder_url, videos, sort_order, is_published
) VALUES (
    '7b3d2191-452e-4e23-9104-eb12ab18370d',
    '6736b7bf-19dd-48ec-b6b1-ef3ee9dfe72b',
    2026,
    'Škoda – Fans of Škoda',
    'Event',
    'AUTOMOTIVE COMMUNITY IP • 3 REELS',
    'Škoda Auto India',
    'High-octane gathering for Skoda owners, automobile influencers, and rally enthusiasts featuring experiential drives.',
    'https://drive.google.com/thumbnail?id=1LOyGz3BF41nTpwEY00NtOwCt5CuKwPut&sz=w1200',
    NULL,
    'https://drive.google.com/file/d/1LOyGz3BF41nTpwEY00NtOwCt5CuKwPut/preview',
    true,
    'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs',
    '[{"id":"skoda-fans-1","title":"Škoda – Fans of Škoda","videoEmbedUrl":"https://drive.google.com/file/d/1LOyGz3BF41nTpwEY00NtOwCt5CuKwPut/preview","image":"https://drive.google.com/thumbnail?id=1LOyGz3BF41nTpwEY00NtOwCt5CuKwPut&sz=w1200"},{"id":"skoda-fans-2","title":"Škoda – Community Highlights","videoEmbedUrl":"https://drive.google.com/file/d/18-WoWzGDIp7DnrCP6Cd7mA2XN-xr0e8A/preview","image":"https://drive.google.com/thumbnail?id=18-WoWzGDIp7DnrCP6Cd7mA2XN-xr0e8A&sz=w1200"},{"id":"skoda-fans-3","title":"Škoda – Experiential Drive Teaser","videoEmbedUrl":"https://drive.google.com/file/d/13o-0qqwpA1ERsc7AnB67udNe5jQNAI4R/preview","image":"https://drive.google.com/thumbnail?id=13o-0qqwpA1ERsc7AnB67udNe5jQNAI4R&sz=w1200"}]'::jsonb,
    9,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline_events (
    id, year_id, year_number, name, type, category_badge, location_or_client, description, image, video_url, video_embed_url, has_video, drive_folder_url, videos, sort_order, is_published
) VALUES (
    'ac59734b-666b-4eeb-aa76-ae5ffd46d0af',
    '6736b7bf-19dd-48ec-b6b1-ef3ee9dfe72b',
    2026,
    'BLND – Menu Launch',
    'Event',
    'CULINARY LAUNCH • PENDING MEDIA',
    'BLND Resto-Bar',
    'High-profile menu unveiling and culinary tasting experience curated with leading lifestyle and food influencers.',
    NULL,
    NULL,
    NULL,
    false,
    NULL,
    '[]'::jsonb,
    10,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline_events (
    id, year_id, year_number, name, type, category_badge, location_or_client, description, image, video_url, video_embed_url, has_video, drive_folder_url, videos, sort_order, is_published
) VALUES (
    '3b4b4d31-6519-4da0-bb3a-f5ec2b7f50ea',
    '6736b7bf-19dd-48ec-b6b1-ef3ee9dfe72b',
    2026,
    'Škoda – Onam Campaign',
    'Ad',
    'AUTOMOTIVE AD CAMPAIGN • 3 REELS',
    'Škoda Auto India',
    'Comprehensive festive Onam automotive commercial ad series produced for Škoda Auto India featuring Riyas & Thara.',
    'https://drive.google.com/thumbnail?id=1azn97OLlVtjOUk4Wk_4_0iUr6TdYAtX0&sz=w1200',
    NULL,
    'https://drive.google.com/file/d/1azn97OLlVtjOUk4Wk_4_0iUr6TdYAtX0/preview',
    true,
    NULL,
    '[{"id":"skoda-ad-1","title":"Škoda – Onam Commercial","videoEmbedUrl":"https://drive.google.com/file/d/1azn97OLlVtjOUk4Wk_4_0iUr6TdYAtX0/preview","image":"https://drive.google.com/thumbnail?id=1azn97OLlVtjOUk4Wk_4_0iUr6TdYAtX0&sz=w1200"},{"id":"skoda-ad-2","title":"Škoda – Festive Drive","videoEmbedUrl":"https://drive.google.com/file/d/1XZsYfl4gb5SxIxOIgTgVhtmRDAErn4Kb/preview","image":"https://drive.google.com/thumbnail?id=1XZsYfl4gb5SxIxOIgTgVhtmRDAErn4Kb&sz=w1200"},{"id":"skoda-ad-3","title":"Škoda – Festive Special","videoEmbedUrl":"https://drive.google.com/file/d/1ljkeLX6dlLT_jUgpKiNrDcnq34WC_wvX/preview","image":"https://drive.google.com/thumbnail?id=1ljkeLX6dlLT_jUgpKiNrDcnq34WC_wvX&sz=w1200"}]'::jsonb,
    11,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline_events (
    id, year_id, year_number, name, type, category_badge, location_or_client, description, image, video_url, video_embed_url, has_video, drive_folder_url, videos, sort_order, is_published
) VALUES (
    '6aafb5dc-43e1-4a54-8377-c19826b98d8f',
    '6736b7bf-19dd-48ec-b6b1-ef3ee9dfe72b',
    2026,
    'Jeep – 4x4 Adventure Campaign',
    'Campaign',
    '4X4 ADVENTURE • 2 REELS',
    'Jeep India',
    'High-octane off-road automotive commercial series exploring rugged capability, luxury trail design, and outdoor thrills with Jeep.',
    'https://drive.google.com/thumbnail?id=1IIbClQ4Af0jwZStOCRWdVGuS19YUiuYx&sz=w1200',
    NULL,
    'https://drive.google.com/file/d/1IIbClQ4Af0jwZStOCRWdVGuS19YUiuYx/preview',
    true,
    NULL,
    '[{"id":"jeep-1","title":"Jeep – Off-Road Adventure","videoEmbedUrl":"https://drive.google.com/file/d/1IIbClQ4Af0jwZStOCRWdVGuS19YUiuYx/preview","image":"https://drive.google.com/thumbnail?id=1IIbClQ4Af0jwZStOCRWdVGuS19YUiuYx&sz=w1200"},{"id":"jeep-2","title":"Jeep – Trail Capability","videoEmbedUrl":"https://drive.google.com/file/d/1Dy1LKriiRMpgoQde6LlMlN0crd2dfh21/preview","image":"https://drive.google.com/thumbnail?id=1Dy1LKriiRMpgoQde6LlMlN0crd2dfh21&sz=w1200"}]'::jsonb,
    12,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline_events (
    id, year_id, year_number, name, type, category_badge, location_or_client, description, image, video_url, video_embed_url, has_video, drive_folder_url, videos, sort_order, is_published
) VALUES (
    'a2a5c98c-ab9e-4c1b-a454-eaac747aa9f4',
    '6736b7bf-19dd-48ec-b6b1-ef3ee9dfe72b',
    2026,
    'R&B Fashion – Casual Wear Campaign',
    'Ad',
    'FASHION RETAIL COMMERCIAL • VIDEO',
    'R&B Fashion',
    'Vibrant retail apparel brand commercial showcasing casual youth trends and lifestyle aesthetics featuring Riyas & Deepa.',
    'https://drive.google.com/thumbnail?id=15a_Xh_NZDPL60y73uq_752cJsAyN4S-a&sz=w1200',
    NULL,
    'https://drive.google.com/file/d/15a_Xh_NZDPL60y73uq_752cJsAyN4S-a/preview',
    true,
    NULL,
    '[]'::jsonb,
    13,
    true
) ON CONFLICT (id) DO NOTHING;

COMMIT;
