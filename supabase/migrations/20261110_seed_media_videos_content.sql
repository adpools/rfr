-- ==============================================================================
-- RFR BY RIYAS — MIGRATION: SEED MEDIA VIDEOS (YOUTUBE & DRIVE STREAMING REELS)
-- Execution target: hlyxzhafdjyflwcdecmp
-- Safe, Idempotent, Non-destructive seed into public.media_videos
-- ZERO upload/download of local 601.79 MB MP4 assets
-- ==============================================================================

BEGIN;

-- Insert 87 Stream Videos (6 YouTube + 81 Google Drive Previews)
INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    'b47d1fe0-5af2-49a2-93f5-c51cc1490e93',
    'Rewind with Riyas — EP 01: Playback Singer Akhila Anand',
    'Podcast',
    'In-depth video dialogue with celebrated playback singer Akhila Anand exploring music, stage performance, and career evolution.',
    'https://www.youtube.com/watch?v=-X_1HETQbho',
    'https://www.youtube.com/embed/-X_1HETQbho',
    'https://img.youtube.com/vi/-X_1HETQbho/maxresdefault.jpg',
    '45 MIN',
    '16:9',
    ARRAY['Podcast', 'Celebrity', 'Music', 'Interview']::TEXT[],
    1,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    '0e8d7752-f3f2-49e8-96f3-880ac99a7492',
    'Rewind with Riyas — EP 02: Studio Master Dialogue',
    'Podcast',
    'Intimate conversation on high-fashion productions, creative direction, and runway stage curation.',
    'https://youtu.be/8t8mJ0Z8Wiw',
    'https://www.youtube.com/embed/8t8mJ0Z8Wiw',
    'https://img.youtube.com/vi/8t8mJ0Z8Wiw/maxresdefault.jpg',
    '48 MIN',
    '16:9',
    ARRAY['Podcast', 'Studio', 'Creative Direction']::TEXT[],
    2,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    '71aa3fd6-5f1a-4026-a7dd-77acfa5a7775',
    'Rewind with Riyas — EP 03: Runway Couture & Fashion Directing',
    'Podcast',
    'Deconstructing modern Indian couture, multi-designer showcases, and luxury event production.',
    'https://www.youtube.com/watch?v=BRx2vCrve6A',
    'https://www.youtube.com/embed/BRx2vCrve6A',
    'https://img.youtube.com/vi/BRx2vCrve6A/maxresdefault.jpg',
    '52 MIN',
    '16:9',
    ARRAY['Podcast', 'Couture', 'Runway']::TEXT[],
    3,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    '7598b15f-27ca-4782-b75b-cdc9baa08486',
    'Rewind with Riyas — EP 04: Beyond Runway & Cultural Convergence',
    'Podcast',
    'A deep-dive dialogue into experiential festivals, community-driven retail, and creative entrepreneurship.',
    'https://www.youtube.com/watch?v=U9NnwHpdSU4&t=1410s',
    'https://www.youtube.com/embed/U9NnwHpdSU4?start=1410',
    'https://img.youtube.com/vi/U9NnwHpdSU4/maxresdefault.jpg',
    '40 MIN',
    '16:9',
    ARRAY['Podcast', 'Culture', 'Entrepreneurship']::TEXT[],
    4,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    '2d2b56a7-14b0-47bb-b6f7-88117fbd8a00',
    'The Fourth — Koottam Flea Market Season 2 Official Headline Reel',
    'Highlight',
    'Official festival highlights capturing 100+ creative popups, acoustic stages, creator lanes, and 10,000+ festival attendees.',
    'https://www.youtube.com/watch?v=NTDkcWdruPs&t=144s',
    'https://www.youtube.com/embed/NTDkcWdruPs?start=144',
    'https://img.youtube.com/vi/NTDkcWdruPs/maxresdefault.jpg',
    '4:48',
    '16:9',
    ARRAY['Koottam Flea', 'Festival', 'Lifestyle', 'Crowd']::TEXT[],
    5,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    'e571a518-1323-46ac-9169-350489325eaa',
    'Love You Too — Musical Album Official Video',
    'Music & Entertainment',
    'Cinematic music video production and visual storytelling directed by RFR Productions.',
    'https://www.youtube.com/watch?v=jRZ4zlS5PlA',
    'https://www.youtube.com/embed/jRZ4zlS5PlA',
    'https://img.youtube.com/vi/jRZ4zlS5PlA/maxresdefault.jpg',
    '3:50',
    '16:9',
    ARRAY['Music Album', 'Cinematic', 'Visual Storytelling']::TEXT[],
    6,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    'c0e29164-14c7-478c-ac56-5adbcc0c9158',
    'Koottam Flea Market 2022 — Official Headline Video Reel',
    'Event Highlights',
    'Official high-energy video highlights capturing 50+ independent brands, creators, acoustic stage, and community celebration.',
    'https://drive.google.com/file/d/1K0wzOv8anMih62lWwAXbRJCZGkxyh3IW/view',
    'https://drive.google.com/file/d/1K0wzOv8anMih62lWwAXbRJCZGkxyh3IW/preview',
    '/images/thumbnails/1K0wzOv8anMih62lWwAXbRJCZGkxyh3IW.jpg',
    NULL,
    '16:9',
    ARRAY['Koottam Flea', 'Video Reel', 'Festival', 'Crowd', 'Drive Video']::TEXT[],
    7,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    '6dacfbc3-4243-4801-8190-14ee6308945a',
    'Koottam Flea 2022 — Live Music & Stage Atmosphere',
    'Event Highlights',
    'Stage production, acoustic live performances, and electrifying festival audience moments from Koottam 2022.',
    'https://drive.google.com/file/d/1OTBpm6zjAgEcxKbGFWZ3k78zsAsLtnW4/view',
    'https://drive.google.com/file/d/1OTBpm6zjAgEcxKbGFWZ3k78zsAsLtnW4/preview',
    '/images/thumbnails/1OTBpm6zjAgEcxKbGFWZ3k78zsAsLtnW4.jpg',
    NULL,
    '16:9',
    ARRAY['Live Stage', 'Acoustic', 'Music', 'Crowd', 'Drive Video']::TEXT[],
    8,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    'f09ae091-c110-429d-bc84-c7a57293e452',
    'Koottam Flea 2022 — Stalls, Food & Creator Lanes',
    'Event Highlights',
    'Vibrant boutique marketplace stalls, handcrafted lifestyle merchandise, and gourmet creator experiences.',
    'https://drive.google.com/file/d/1N3uDi9gPVaolGuFGvVHwlhuZ2kVhp5_0/view',
    'https://drive.google.com/file/d/1N3uDi9gPVaolGuFGvVHwlhuZ2kVhp5_0/preview',
    '/images/thumbnails/1N3uDi9gPVaolGuFGvVHwlhuZ2kVhp5_0.jpg',
    NULL,
    '16:9',
    ARRAY['Food Stalls', 'Creators', 'Retail', 'Lifestyle', 'Drive Video']::TEXT[],
    9,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    '414919a2-0264-40c7-841a-10ee1990a5ef',
    'Navaratri Naach 2025 — Official Video Highlights',
    'Event Highlights',
    'Celebratory festival gala with traditional Garba rhythms, high-energy stage performances, and celebrity judges.',
    'https://drive.google.com/file/d/1Fg28k07NGX7Bd4RuxfJ2eIBHXRY3BeZ6/view',
    'https://drive.google.com/file/d/1Fg28k07NGX7Bd4RuxfJ2eIBHXRY3BeZ6/preview',
    'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1200&q=80',
    NULL,
    '16:9',
    ARRAY['Navaratri', 'Garba', 'Dance', 'Drive Video']::TEXT[],
    10,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    'd42b130b-17d4-4bc9-a087-6d4b75ce888c',
    'Dandiya Night & Deeshna Event Teaser',
    'Event Highlights',
    'Vibrant colors, ethnic wardrobe styling, and thousands of attendees celebrating the spirit of Dandiya.',
    'https://drive.google.com/file/d/1dy6TIwofRd4bWLMrdHeiykYkqTVbFIFw/view',
    'https://drive.google.com/file/d/1dy6TIwofRd4bWLMrdHeiykYkqTVbFIFw/preview',
    '/images/thumbnails/1dy6TIwofRd4bWLMrdHeiykYkqTVbFIFw.jpg',
    NULL,
    '16:9',
    ARRAY['Dandiya', 'Festive', 'Costume', 'Drive Video']::TEXT[],
    11,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    '2316e2dd-7a6c-4340-9fb9-68ce78f188df',
    'NYE 2026 — Hycinth Five-Star Gala Video Highlights',
    'Event Highlights',
    'Monumental New Year countdown spectacle and VIP banquet featuring lighting choreography and live performers.',
    'https://drive.google.com/file/d/15vI0jdpl_uq2VdSPrU4py6ylu-bs-4Yv/view',
    'https://drive.google.com/file/d/15vI0jdpl_uq2VdSPrU4py6ylu-bs-4Yv/preview',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    NULL,
    '16:9',
    ARRAY['New Year', 'Gala', 'Countdown', 'Drive Video']::TEXT[],
    12,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    '603560a6-3b7c-4477-815f-0d602efcbf97',
    'Chakita DD Retreat Couture Runway Show',
    'Commercial Ad',
    'Avant-garde silhouette presentations and dramatic lighting choreography at DD Retreat.',
    'https://drive.google.com/file/d/1WMQC1KhSwMH8U973Iqfy7i_6K5fy7j5Y/view',
    'https://drive.google.com/file/d/1WMQC1KhSwMH8U973Iqfy7i_6K5fy7j5Y/preview',
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80',
    NULL,
    '16:9',
    ARRAY['Chakita', 'Couture', 'Runway', 'Drive Video']::TEXT[],
    13,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    '1390e172-9bfd-4bbe-9718-aae4615e888c',
    'Max Fashion Runway Show at UDS Resorts',
    'Commercial Ad',
    'Signature holiday collection runway showcase and celebrity guest appearance at UDS Resorts.',
    'https://drive.google.com/file/d/1CC9SQCDOADqMo4uMq-zbVKvWxyETh-bk/view',
    'https://drive.google.com/file/d/1CC9SQCDOADqMo4uMq-zbVKvWxyETh-bk/preview',
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80',
    NULL,
    '16:9',
    ARRAY['Max Fashion', 'UDS', 'Runway', 'Drive Video']::TEXT[],
    14,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    '5ea83b1f-5e0c-4153-b9c9-85cb717b8d8b',
    'Hycinth Fashion Event with Rohas',
    'Commercial Ad',
    'Contemporary ready-to-wear styling and model presentation staged at Hycinth.',
    'https://drive.google.com/file/d/1nD_NabOGiZW4GT_jawFlXRpPh9ok1ckL/view',
    'https://drive.google.com/file/d/1nD_NabOGiZW4GT_jawFlXRpPh9ok1ckL/preview',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
    NULL,
    '16:9',
    ARRAY['Hycinth', 'Models', 'Rohas', 'Drive Video']::TEXT[],
    15,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    'b56a272c-64c6-4f51-8482-178d3ec16603',
    'Citroën Aircross Commercial Combo Film',
    'Commercial Ad',
    'Cinematic brand film capturing dynamic French automotive styling and plush cabin comfort.',
    'https://drive.google.com/file/d/17xhWbUtxJePM8igOO7VADLDfiqcG6S04/view',
    'https://drive.google.com/file/d/17xhWbUtxJePM8igOO7VADLDfiqcG6S04/preview',
    '/images/thumbnails/17xhWbUtxJePM8igOO7VADLDfiqcG6S04.jpg',
    NULL,
    '16:9',
    ARRAY['Citroën', 'Automotive', 'Commercial Film', 'Drive Video']::TEXT[],
    16,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    '0e587f47-3d94-454c-b9ad-397aa9f4ad62',
    'Citroën Onam Campaign with Riyas & Thara',
    'Commercial Ad',
    'Vibrant festive storytelling connecting Kerala heritage with modern French automotive elegance.',
    'https://drive.google.com/file/d/1Jpf1n_swCBJtTytbskrRNVNIa_CMUeMF/view',
    'https://drive.google.com/file/d/1Jpf1n_swCBJtTytbskrRNVNIa_CMUeMF/preview',
    '/images/thumbnails/1Jpf1n_swCBJtTytbskrRNVNIa_CMUeMF.jpg',
    NULL,
    '16:9',
    ARRAY['Citroën', 'Onam', 'Riyas', 'Thara', 'Drive Video']::TEXT[],
    17,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    'd5a3a8cb-e0c0-4757-852f-2187ac4c0e8c',
    'Ather Electric Scooter Campaign — Riyas & Ganga',
    'Commercial Ad',
    'Smart EV performance and contemporary urban lifestyle video with Riyas & Ganga.',
    'https://drive.google.com/file/d/1YymReRbadPvKyAXFzmmGVSsm4lExjIoD/view',
    'https://drive.google.com/file/d/1YymReRbadPvKyAXFzmmGVSsm4lExjIoD/preview',
    '/images/thumbnails/1YymReRbadPvKyAXFzmmGVSsm4lExjIoD.jpg',
    NULL,
    '16:9',
    ARRAY['Ather', 'EV Scooter', 'Urban Commute', 'Drive Video']::TEXT[],
    18,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    'fa50bb85-7cf5-4e63-b0bb-60d390ebcbf2',
    'Fans of Škoda — Full Campaign & Drive Video',
    'Commercial Ad',
    'European engineering, owner community rally, and precision highway drive highlights.',
    'https://drive.google.com/file/d/18-WoWzGDIp7DnrCP6Cd7mA2XN-xr0e8A/view',
    'https://drive.google.com/file/d/18-WoWzGDIp7DnrCP6Cd7mA2XN-xr0e8A/preview',
    '/images/thumbnails/18-WoWzGDIp7DnrCP6Cd7mA2XN-xr0e8A.jpg',
    NULL,
    '16:9',
    ARRAY['Škoda', 'Automotive', 'Community', 'Drive Video']::TEXT[],
    19,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    '6949ba27-3be3-468e-87ce-ffae3bd1a301',
    'Buildhub Commercial Video (Riyas & Teena)',
    'Commercial Ad',
    'Luxury residential design, premium architectural materials, and interior solutions commercial.',
    'https://drive.google.com/file/d/1GEWSZYSU8qQKNW05-dSMkmuUBd2AbOhV/view',
    'https://drive.google.com/file/d/1GEWSZYSU8qQKNW05-dSMkmuUBd2AbOhV/preview',
    '/images/thumbnails/1GEWSZYSU8qQKNW05-dSMkmuUBd2AbOhV.jpg',
    NULL,
    '16:9',
    ARRAY['Buildhub', 'Real Estate', 'Architecture', 'Drive Video']::TEXT[],
    20,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    'f7b712c7-1161-4b85-9061-e3a3232e984c',
    'Lemon Tree Hotels Commercial Video Campaign',
    'Commercial Ad',
    'Cinematic brand commercial highlighting premier leisure hospitality, suites, and fine dining.',
    'https://drive.google.com/file/d/1pZfSfv6dcuY2s2uQKI6JudJjJZVpTUOd/view',
    'https://drive.google.com/file/d/1pZfSfv6dcuY2s2uQKI6JudJjJZVpTUOd/preview',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    NULL,
    '16:9',
    ARRAY['Lemon Tree', 'Hospitality', 'Resort', 'Drive Video']::TEXT[],
    21,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    '6a81bc39-318e-4dda-96a6-9b0690c8a89a',
    'Concept Tyres Commercial Film',
    'Commercial Ad',
    'High-speed performance, road safety, and grip demonstration commercial.',
    'https://drive.google.com/file/d/1NhbGg_5G5ZUGLkUak9hZRp1rVmOymWEQ/view',
    'https://drive.google.com/file/d/1NhbGg_5G5ZUGLkUak9hZRp1rVmOymWEQ/preview',
    '/images/thumbnails/1NhbGg_5G5ZUGLkUak9hZRp1rVmOymWEQ.jpg',
    NULL,
    '16:9',
    ARRAY['Concept Tyres', 'Automotive', 'Ad Film', 'Drive Video']::TEXT[],
    22,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    'cd49a047-1712-4b7d-ac53-536d54f30480',
    'Kids Fashion & Youth Creative Runways — Official Reel',
    'Service Showcases',
    'RFR youth platforms including Citi Kids, Jasmin & Teena Showcase empower children with professional runway training, ethical backstage management, thematic styling, and family-centered celebrations.',
    'https://drive.google.com/file/d/1ZKOWzZ-6Gajyvv8faIPy6tLryX17VLt5/view',
    'https://drive.google.com/file/d/1ZKOWzZ-6Gajyvv8faIPy6tLryX17VLt5/preview',
    '/images/thumbnails/1ZKOWzZ-6Gajyvv8faIPy6tLryX17VLt5.jpg',
    NULL,
    '16:9',
    ARRAY['Services', 'Kids Fashion & Youth Creative Runways']::TEXT[],
    23,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    '35d94933-1dd4-40b7-a785-26dd30dde386',
    'Cultural Festivals & Thematic Galas — Official Reel',
    'Service Showcases',
    'Large-scale cultural festivals produced by RFR—including Dandiya Deeshna Night and Navaratri Naach—uniting traditional Garba beats, dynamic DJ sets, ethnic fashion showcases, and massive community attendance.',
    'https://drive.google.com/file/d/12VKNlmgTDMnrom5oXBjj0fGXMUOjRYtp/view',
    'https://drive.google.com/file/d/12VKNlmgTDMnrom5oXBjj0fGXMUOjRYtp/preview',
    '/images/thumbnails/1N3WOWz33xZXorbuQ_nRc7FMSMAbCeRt_.jpg',
    NULL,
    '16:9',
    ARRAY['Services', 'Cultural Festivals & Thematic Galas']::TEXT[],
    24,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    '0009fa17-d45b-458a-b098-acaeebb1193c',
    'UGC & High-Conversion Creator Studio — Official Reel',
    'Service Showcases',
    'Native, unpolished-yet-premium content tailored for paid acquisition. Produced for leading brands including Build Hub, Fitora Lifestyle, and retail clients with rapid turnaround and direct ad account spark codes.',
    'https://drive.google.com/file/d/1u06VQPUy_karWcBOuLf10AFSGR_9PV35/view',
    'https://drive.google.com/file/d/1u06VQPUy_karWcBOuLf10AFSGR_9PV35/preview',
    '/images/thumbnails/1GEWSZYSU8qQKNW05-dSMkmuUBd2AbOhV.jpg',
    NULL,
    '16:9',
    ARRAY['Services', 'UGC & High-Conversion Creator Studio']::TEXT[],
    25,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    '2efd2366-4b9b-459f-bbef-c9352659fd2b',
    'Targeted Digital Ads & Performance Media — Official Reel',
    'Service Showcases',
    'Combining creative luxury aesthetics with analytical rigor, RFR Digital Ads division executes hyper-targeted paid funnels for automotive releases (Citroën Basalt, EV, Fans of Škoda), luxury hospitality, and festive sales.',
    'https://drive.google.com/file/d/1qwwQ8wxW-wOCRN9bG1bW23nJT9OSPN1g/view',
    'https://drive.google.com/file/d/1qwwQ8wxW-wOCRN9bG1bW23nJT9OSPN1g/preview',
    '/images/thumbnails/1qwwQ8wxW-wOCRN9bG1bW23nJT9OSPN1g.jpg',
    NULL,
    '16:9',
    ARRAY['Services', 'Targeted Digital Ads & Performance Media']::TEXT[],
    26,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    'fa03e810-8e90-4cb4-bf7e-91cabf4b92a5',
    'Jeep Ad Campaign (2026)',
    'Automotive',
    'Jeep Ad Campaign executed for Automotive.',
    'https://drive.google.com/file/d/1Dy1LKriiRMpgoQde6LlMlN0crd2dfh21/view',
    'https://drive.google.com/file/d/1Dy1LKriiRMpgoQde6LlMlN0crd2dfh21/preview',
    'https://drive.google.com/thumbnail?id=1Dy1LKriiRMpgoQde6LlMlN0crd2dfh21&sz=w1000',
    NULL,
    '16:9',
    ARRAY['Selected Work', 'Automotive', '2026']::TEXT[],
    27,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    '21f68b13-fafc-4156-bcc6-ae34d9514e4d',
    'Škoda Ad Campaign (2026)',
    'Automotive',
    'Škoda Ad Campaign executed for Automotive.',
    'https://drive.google.com/file/d/1ljkeLX6dlLT_jUgpKiNrDcnq34WC_wvX/view',
    'https://drive.google.com/file/d/1ljkeLX6dlLT_jUgpKiNrDcnq34WC_wvX/preview',
    'https://drive.google.com/thumbnail?id=1ljkeLX6dlLT_jUgpKiNrDcnq34WC_wvX&sz=w1000',
    NULL,
    '16:9',
    ARRAY['Selected Work', 'Automotive', '2026']::TEXT[],
    28,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    '0f1bd05c-bcde-43bc-ac48-34a50f161085',
    'Fans of Škoda — Škoda Event (2026)',
    'Events',
    'Fans of Škoda — Škoda Event executed for Events.',
    'https://drive.google.com/file/d/13o-0qqwpA1ERsc7AnB67udNe5jQNAI4R/view',
    'https://drive.google.com/file/d/13o-0qqwpA1ERsc7AnB67udNe5jQNAI4R/preview',
    'https://drive.google.com/thumbnail?id=13o-0qqwpA1ERsc7AnB67udNe5jQNAI4R&sz=w1000',
    NULL,
    '16:9',
    ARRAY['Selected Work', 'Events', '2026']::TEXT[],
    29,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    '40fcf720-7ef6-443c-a93d-277d831d49ff',
    'R&B Ad Campaign (2026)',
    'Advertising',
    'R&B Ad Campaign executed for Advertising.',
    'https://drive.google.com/file/d/15a_Xh_NZDPL60y73uq_752cJsAyN4S-a/view',
    'https://drive.google.com/file/d/15a_Xh_NZDPL60y73uq_752cJsAyN4S-a/preview',
    'https://drive.google.com/thumbnail?id=15a_Xh_NZDPL60y73uq_752cJsAyN4S-a&sz=w1000',
    NULL,
    '16:9',
    ARRAY['Selected Work', 'Advertising', '2026']::TEXT[],
    30,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    'bbbb3e35-33d1-4fc5-a2c2-13b165345709',
    'Pothys Swarnamahal — Vishu Influencer Campaign (2025)',
    'Fashion & Retail',
    'Pothys Swarnamahal — Vishu Influencer Campaign executed for Fashion & Retail.',
    'https://drive.google.com/file/d/1pCPpzIG-bo2Z7wiq1rYvQ3Mm1xWQ6tOO/view',
    'https://drive.google.com/file/d/1pCPpzIG-bo2Z7wiq1rYvQ3Mm1xWQ6tOO/preview',
    'https://drive.google.com/thumbnail?id=1pCPpzIG-bo2Z7wiq1rYvQ3Mm1xWQ6tOO&sz=w1000',
    NULL,
    '16:9',
    ARRAY['Selected Work', 'Fashion & Retail', '2025']::TEXT[],
    31,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    '08bc7629-4cb0-484f-9093-90462f5cd903',
    'Rewind with Riyas — Celebrity Interview Podcast (2025)',
    'Music & Entertainment',
    'Rewind with Riyas — Celebrity Interview Podcast executed for Music & Entertainment.',
    'https://drive.google.com/file/d/1BwkKNnLO0pV78_R2Cz-wjgL8pBP1eV7E/view',
    'https://drive.google.com/file/d/1BwkKNnLO0pV78_R2Cz-wjgL8pBP1eV7E/preview',
    'https://drive.google.com/thumbnail?id=1BwkKNnLO0pV78_R2Cz-wjgL8pBP1eV7E&sz=w1000',
    NULL,
    '16:9',
    ARRAY['Selected Work', 'Music & Entertainment', '2025']::TEXT[],
    32,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    'c20aced3-ef45-4534-a375-051fa69e42ff',
    'Healing Swan — Wellness Center Ad (2025)',
    'Advertising',
    'Healing Swan — Wellness Center Ad executed for Advertising.',
    'https://drive.google.com/file/d/1OlgBH9hHzF1GtYfPOlPvwaJaA_xtUmgc/view',
    'https://drive.google.com/file/d/1OlgBH9hHzF1GtYfPOlPvwaJaA_xtUmgc/preview',
    'https://drive.google.com/thumbnail?id=1OlgBH9hHzF1GtYfPOlPvwaJaA_xtUmgc&sz=w1000',
    NULL,
    '16:9',
    ARRAY['Selected Work', 'Advertising', '2025']::TEXT[],
    33,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    '9e94875e-0653-44a7-b4a3-44e4eedc542e',
    'Influencer Campaign — Nissan (2025)',
    'Automotive',
    'Influencer Campaign — Nissan executed for Automotive.',
    'https://drive.google.com/file/d/1gb6THCIg1MQ75dKOEKd7d52cea7Uh5L_/view',
    'https://drive.google.com/file/d/1gb6THCIg1MQ75dKOEKd7d52cea7Uh5L_/preview',
    'https://drive.google.com/thumbnail?id=1gb6THCIg1MQ75dKOEKd7d52cea7Uh5L_&sz=w1000',
    NULL,
    '16:9',
    ARRAY['Selected Work', 'Automotive', '2025']::TEXT[],
    34,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    '498cd345-91a7-4f1e-93d3-8fe7cc780544',
    'Influencer Campaign — Max (2025)',
    'Fashion & Retail',
    'Influencer Campaign — Max executed for Fashion & Retail.',
    'https://drive.google.com/file/d/1vLeEHWch-OxIwEdpMVSQCm4PL-h6cwbI/view',
    'https://drive.google.com/file/d/1vLeEHWch-OxIwEdpMVSQCm4PL-h6cwbI/preview',
    'https://drive.google.com/thumbnail?id=1vLeEHWch-OxIwEdpMVSQCm4PL-h6cwbI&sz=w1000',
    NULL,
    '16:9',
    ARRAY['Selected Work', 'Fashion & Retail', '2025']::TEXT[],
    35,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    '16d02040-fcc5-4602-8652-6fabdb632a7e',
    'Aaravam — Times of India Event (2024)',
    'Events',
    'Aaravam — Times of India Event executed for Events.',
    'https://drive.google.com/file/d/1rmoPoNcownVaPXRYmkaSa3M-n7u6yqhc/view',
    'https://drive.google.com/file/d/1rmoPoNcownVaPXRYmkaSa3M-n7u6yqhc/preview',
    'https://drive.google.com/thumbnail?id=1rmoPoNcownVaPXRYmkaSa3M-n7u6yqhc&sz=w1000',
    NULL,
    '16:9',
    ARRAY['Selected Work', 'Events', '2024']::TEXT[],
    36,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    '2ba1f144-c431-4311-96de-30a2d52a470f',
    'Ather Scooter — Influencer Campaign (2024)',
    'Automotive',
    'Ather Scooter — Influencer Campaign executed for Automotive.',
    'https://drive.google.com/file/d/1agM4IPcwpZHfsXjbA-o8SfP4kkpPW1t_/view',
    'https://drive.google.com/file/d/1agM4IPcwpZHfsXjbA-o8SfP4kkpPW1t_/preview',
    'https://drive.google.com/thumbnail?id=1agM4IPcwpZHfsXjbA-o8SfP4kkpPW1t_&sz=w1000',
    NULL,
    '16:9',
    ARRAY['Selected Work', 'Automotive', '2024']::TEXT[],
    37,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    '66eb7092-fc19-4901-9935-c7a928e3d93f',
    'Nissan Influencer Campaigns (2024)',
    'Automotive',
    'Nissan Influencer Campaigns executed for Automotive.',
    'https://drive.google.com/file/d/1VwTvpaUWW_I9WpXsRP-CPdGz9AHAqRCV/view',
    'https://drive.google.com/file/d/1VwTvpaUWW_I9WpXsRP-CPdGz9AHAqRCV/preview',
    'https://drive.google.com/thumbnail?id=1VwTvpaUWW_I9WpXsRP-CPdGz9AHAqRCV&sz=w1000',
    NULL,
    '16:9',
    ARRAY['Selected Work', 'Automotive', '2024']::TEXT[],
    38,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    '075013a1-52af-431f-972e-094cf617d937',
    'Scoria Lights Ad (2024)',
    'Advertising',
    'Scoria Lights Ad executed for Advertising.',
    'https://drive.google.com/file/d/1u1CYzKO07CXsMZqmVPcfM_IN7LyJuD9K/view',
    'https://drive.google.com/file/d/1u1CYzKO07CXsMZqmVPcfM_IN7LyJuD9K/preview',
    'https://drive.google.com/thumbnail?id=1u1CYzKO07CXsMZqmVPcfM_IN7LyJuD9K&sz=w1000',
    NULL,
    '16:9',
    ARRAY['Selected Work', 'Advertising', '2024']::TEXT[],
    39,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    '3b26f9f1-edca-4103-ab1c-3d094f4c02c5',
    'Max Onam Collection Launch (2022)',
    'Fashion & Retail',
    'Max Onam Collection Launch executed for Fashion & Retail.',
    'https://drive.google.com/file/d/1LYuokKdcbWKHTX5_fThVLGgKZ4JiM_xq/view',
    'https://drive.google.com/file/d/1LYuokKdcbWKHTX5_fThVLGgKZ4JiM_xq/preview',
    'https://drive.google.com/thumbnail?id=1LYuokKdcbWKHTX5_fThVLGgKZ4JiM_xq&sz=w1000',
    NULL,
    '16:9',
    ARRAY['Selected Work', 'Fashion & Retail', '2022']::TEXT[],
    40,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    '0eb24060-2dcd-485b-93b5-1c369dc91d25',
    'MAX Xmas Collection Launch Event at UDS (2021)',
    'Hospitality & Lifestyle',
    'MAX Xmas Collection Launch Event at UDS executed for Hospitality & Lifestyle.',
    'https://drive.google.com/file/d/1zhhm9Oj2Uz2Znskemv_8JL_OA9hWm4rT/view',
    'https://drive.google.com/file/d/1zhhm9Oj2Uz2Znskemv_8JL_OA9hWm4rT/preview',
    'https://drive.google.com/thumbnail?id=1zhhm9Oj2Uz2Znskemv_8JL_OA9hWm4rT&sz=w1000',
    NULL,
    '16:9',
    ARRAY['Selected Work', 'Hospitality & Lifestyle', '2021']::TEXT[],
    41,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    '5f246fd2-cc21-40a9-89c5-8629e0ec7535',
    'Max Influencer Campaign — Onam (2021)',
    'Fashion & Retail',
    'Max Influencer Campaign — Onam executed for Fashion & Retail.',
    'https://drive.google.com/file/d/13oW-kpjZX61Nwlljk3rtDIhyIxGgwtQX/view',
    'https://drive.google.com/file/d/13oW-kpjZX61Nwlljk3rtDIhyIxGgwtQX/preview',
    'https://drive.google.com/thumbnail?id=13oW-kpjZX61Nwlljk3rtDIhyIxGgwtQX&sz=w1000',
    NULL,
    '16:9',
    ARRAY['Selected Work', 'Fashion & Retail', '2021']::TEXT[],
    42,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    'b750cca9-5517-4516-b721-15d5d1a42657',
    'Trivandrum Influencer Circle (TIC) Launch Event Reel',
    'Influencer Network',
    'Official launch event highlights of the Trivandrum Influencer Circle collective.',
    'https://drive.google.com/file/d/13KL_xZOjSNeBFJDSfbLic-0wMlBT9lDf/view',
    'https://drive.google.com/file/d/13KL_xZOjSNeBFJDSfbLic-0wMlBT9lDf/preview',
    'https://drive.google.com/thumbnail?id=13KL_xZOjSNeBFJDSfbLic-0wMlBT9lDf&sz=w1000',
    NULL,
    '16:9',
    ARRAY['TIC', 'Launch Event', 'Influencers']::TEXT[],
    43,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    '48b55549-b011-4483-984e-1917bfb30bcf',
    'Max Influencer Campaigns — Deepawali (Part 1) (2021)',
    'Campaign',
    'High-energy Deepawali influencer marketing campaign highlighting the festive collection.',
    'https://drive.google.com/file/d/1JW1hGphQRupw8ONzVud7_99wOU2Lpbkc/view',
    'https://drive.google.com/file/d/1JW1hGphQRupw8ONzVud7_99wOU2Lpbkc/preview',
    'https://drive.google.com/thumbnail?id=1JW1hGphQRupw8ONzVud7_99wOU2Lpbkc&sz=w1200',
    NULL,
    '16:9',
    ARRAY['Timeline Event', 'Campaign', '2021']::TEXT[],
    44,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    'e23b456f-2f61-4da8-a1e7-918b7afab7a6',
    'Max Influencer Campaigns — Deepawali (Part 2) (2021)',
    'Campaign',
    'Continuation of the high-energy Deepawali influencer marketing campaign.',
    'https://drive.google.com/file/d/1m1OshIid4g-19bkk8LfhEnGIPSbMqLYf/view',
    'https://drive.google.com/file/d/1m1OshIid4g-19bkk8LfhEnGIPSbMqLYf/preview',
    'https://drive.google.com/thumbnail?id=1m1OshIid4g-19bkk8LfhEnGIPSbMqLYf&sz=w1200',
    NULL,
    '16:9',
    ARRAY['Timeline Event', 'Campaign', '2021']::TEXT[],
    45,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    '2170ba57-26c1-4e86-ac5f-4da5f1349a57',
    'Max Influencer Campaigns — Xmas (2021)',
    'Campaign',
    'Christmas season influencer marketing campaign for Max Fashion.',
    'https://drive.google.com/file/d/1-DOdgtZQyVc9Y0FaHn0iyKtAKaFJGP31/view',
    'https://drive.google.com/file/d/1-DOdgtZQyVc9Y0FaHn0iyKtAKaFJGP31/preview',
    'https://drive.google.com/thumbnail?id=1-DOdgtZQyVc9Y0FaHn0iyKtAKaFJGP31&sz=w1200',
    NULL,
    '16:9',
    ARRAY['Timeline Event', 'Campaign', '2021']::TEXT[],
    46,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    'b127888f-e463-4d58-9fdb-a89720eaa05c',
    'Vishu Max 2022 (Avoki Festive Launch) (2022)',
    'Event',
    'Vibrant Vishu festive collection launch and runway presentation celebrating traditional elegance with contemporary cuts.',
    'https://drive.google.com/file/d/1Yb5J03l42-tDKReQKTwIyeD8HkbcQUF-/view',
    'https://drive.google.com/file/d/1Yb5J03l42-tDKReQKTwIyeD8HkbcQUF-/preview',
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80',
    NULL,
    '16:9',
    ARRAY['Timeline Event', 'Event', '2022']::TEXT[],
    47,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    '387b7e06-8617-4780-82df-a85184d47140',
    'Global Fashion Week — Lulu Mall (2022)',
    'Show',
    'Spectacular multi-designer runway presentation bringing together top couture labels, international models, and media coverage.',
    'https://drive.google.com/file/d/1fjrTS7q0kSHRGTBQb1VKho8X25D9-gXZ/view',
    'https://drive.google.com/file/d/1fjrTS7q0kSHRGTBQb1VKho8X25D9-gXZ/preview',
    '/images/thumbnails/global fashion week lulu.JPG',
    NULL,
    '16:9',
    ARRAY['Timeline Event', 'Show', '2022']::TEXT[],
    48,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    '1dc482a4-4d58-485d-b42a-57814b2d55f8',
    'Fitora Brand Launch & Inauguration (2023)',
    'Event',
    'Grand store inauguration and celebrity brand launch event with full video coverage and VIP guest management.',
    'https://drive.google.com/file/d/1-evN1cSYflA2Euej4pEzqVfHJ03NlNHz/view',
    'https://drive.google.com/file/d/1-evN1cSYflA2Euej4pEzqVfHJ03NlNHz/preview',
    'https://drive.google.com/thumbnail?id=1-evN1cSYflA2Euej4pEzqVfHJ03NlNHz&sz=w1200',
    NULL,
    '16:9',
    ARRAY['Timeline Event', 'Event', '2023']::TEXT[],
    49,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    '8e39a563-3254-4fbb-94bf-256bd50ebb10',
    'Hanso 1 Commercial Brand Film (2023)',
    'Ad',
    'Cinematic brand commercial highlighting contemporary fashion and retail aesthetic excellence.',
    'https://drive.google.com/file/d/15HlASUrrPE6DeoQGJLklsHY1S2s5jJ8Y/view',
    'https://drive.google.com/file/d/15HlASUrrPE6DeoQGJLklsHY1S2s5jJ8Y/preview',
    'https://drive.google.com/thumbnail?id=15HlASUrrPE6DeoQGJLklsHY1S2s5jJ8Y&sz=w1200',
    NULL,
    '16:9',
    ARRAY['Timeline Event', 'Ad', '2023']::TEXT[],
    50,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    'e8ea733e-b901-44fb-a378-4918f69f9535',
    'Koode Nee — Musical Album (Manorama Music) (2023)',
    'Music Album',
    'Acclaimed musical video production released with major record label Manorama Music, generating widespread digital acclaim.',
    'https://drive.google.com/file/d/1KyZfc-c5FMJ2gtKxV26-2uX1Yo5ZTkka/view',
    'https://drive.google.com/file/d/1KyZfc-c5FMJ2gtKxV26-2uX1Yo5ZTkka/preview',
    'https://img.youtube.com/vi/clgdutCU5G8/hqdefault.jpg',
    NULL,
    '16:9',
    ARRAY['Timeline Event', 'Music Album', '2023']::TEXT[],
    51,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    '1268f4b1-884e-48ba-a3e4-0519836736de',
    'Ather – Festive Campaign (2024)',
    'Ad',
    'High-energy festive holiday campaign celebrating the joy of electric rides with seasonal storytelling and Santa theme.',
    'https://drive.google.com/file/d/1uyYLbEDv9vYWKTYV7MlkflIS9UATtEed/view',
    'https://drive.google.com/file/d/1uyYLbEDv9vYWKTYV7MlkflIS9UATtEed/preview',
    'https://drive.google.com/thumbnail?id=1uyYLbEDv9vYWKTYV7MlkflIS9UATtEed&sz=w1200',
    NULL,
    '16:9',
    ARRAY['Timeline Event', 'Ad', '2024']::TEXT[],
    52,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    '57f84f46-250a-4536-b0c3-6bf76677854e',
    'Ather (2024)',
    'Ad',
    'Solo creator highlight showcasing effortless city cruising and modern design aesthetics with Teena.',
    'https://drive.google.com/file/d/1EMcdGC2j-HSGaON7ApBTC0k9himB2auq/view',
    'https://drive.google.com/file/d/1EMcdGC2j-HSGaON7ApBTC0k9himB2auq/preview',
    'https://drive.google.com/thumbnail?id=1EMcdGC2j-HSGaON7ApBTC0k9himB2auq&sz=w1200',
    NULL,
    '16:9',
    ARRAY['Timeline Event', 'Ad', '2024']::TEXT[],
    53,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    '6d4557d0-7903-42cd-8612-164d1600d442',
    'Build Hub (2024)',
    'Ad',
    'Exclusive interior design walkthrough and architectural finishes presented by Teena.',
    'https://drive.google.com/file/d/1Xar8Hc2PUaoNoSrAsu9j2QqBCD5QOHtZ/view',
    'https://drive.google.com/file/d/1Xar8Hc2PUaoNoSrAsu9j2QqBCD5QOHtZ/preview',
    'https://drive.google.com/thumbnail?id=1Xar8Hc2PUaoNoSrAsu9j2QqBCD5QOHtZ&sz=w1200',
    NULL,
    '16:9',
    ARRAY['Timeline Event', 'Ad', '2024']::TEXT[],
    54,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    '78e54ff7-7443-4218-975b-31f94436b6f7',
    'Rewind with Riyas — Celebrity Talk Show & Podcast — Podcast Shikha Highlights',
    'Podcast',
    'Conversations beyond the runway. Intimate, unfiltered dialogues with film stars, fashion designers, top influencers, and creative pioneers.',
    'https://drive.google.com/file/d/1RLQpL8q5bt2kF2WhnqnA2PCmVPLKBLXz/view',
    'https://drive.google.com/file/d/1RLQpL8q5bt2kF2WhnqnA2PCmVPLKBLXz/preview',
    'https://drive.google.com/thumbnail?id=1RLQpL8q5bt2kF2WhnqnA2PCmVPLKBLXz&sz=w1200',
    NULL,
    '16:9',
    ARRAY['Timeline Reel', 'Rewind with Riyas — Celebrity Talk Show & Podcast']::TEXT[],
    55,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    '3b6cff13-3fac-43c8-8483-fae7b5bdc800',
    'Rewind with Riyas — Celebrity Talk Show & Podcast — Podcast Shikha 2',
    'Podcast',
    'Conversations beyond the runway. Intimate, unfiltered dialogues with film stars, fashion designers, top influencers, and creative pioneers.',
    'https://drive.google.com/file/d/1GmbrqmVslqttr67VN_cC6R3MI23LeA6G/view',
    'https://drive.google.com/file/d/1GmbrqmVslqttr67VN_cC6R3MI23LeA6G/preview',
    'https://drive.google.com/thumbnail?id=1GmbrqmVslqttr67VN_cC6R3MI23LeA6G&sz=w1200',
    NULL,
    '16:9',
    ARRAY['Timeline Reel', 'Rewind with Riyas — Celebrity Talk Show & Podcast']::TEXT[],
    56,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    'f385892b-c05e-44c7-9e7a-e84d0f89bba8',
    'Rewind with Riyas — Celebrity Talk Show & Podcast — Podcast Shikha 1',
    'Podcast',
    'Conversations beyond the runway. Intimate, unfiltered dialogues with film stars, fashion designers, top influencers, and creative pioneers.',
    'https://drive.google.com/file/d/13CvX5gywQ0hoFd4b08o2-MwdCb7oRyIv/view',
    'https://drive.google.com/file/d/13CvX5gywQ0hoFd4b08o2-MwdCb7oRyIv/preview',
    'https://drive.google.com/thumbnail?id=13CvX5gywQ0hoFd4b08o2-MwdCb7oRyIv&sz=w1200',
    NULL,
    '16:9',
    ARRAY['Timeline Reel', 'Rewind with Riyas — Celebrity Talk Show & Podcast']::TEXT[],
    57,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    '3e723ff5-af07-42cc-be38-3b1ebfa1b4cd',
    'Rewind with Riyas — Celebrity Talk Show & Podcast — Podcast Krishna 2',
    'Podcast',
    'Conversations beyond the runway. Intimate, unfiltered dialogues with film stars, fashion designers, top influencers, and creative pioneers.',
    'https://drive.google.com/file/d/1i-lBTYBgz7_LgaOdu1t65Cqcy4FcTvm0/view',
    'https://drive.google.com/file/d/1i-lBTYBgz7_LgaOdu1t65Cqcy4FcTvm0/preview',
    'https://drive.google.com/thumbnail?id=1i-lBTYBgz7_LgaOdu1t65Cqcy4FcTvm0&sz=w1200',
    NULL,
    '16:9',
    ARRAY['Timeline Reel', 'Rewind with Riyas — Celebrity Talk Show & Podcast']::TEXT[],
    58,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    '6f772957-1d9c-4f80-9647-52d5cd98c696',
    'Rewind with Riyas — Celebrity Talk Show & Podcast — Podcast Krishna',
    'Podcast',
    'Conversations beyond the runway. Intimate, unfiltered dialogues with film stars, fashion designers, top influencers, and creative pioneers.',
    'https://drive.google.com/file/d/1Q-ebpbx6ELdWoOmL0UcCkUuC9qI3EeVF/view',
    'https://drive.google.com/file/d/1Q-ebpbx6ELdWoOmL0UcCkUuC9qI3EeVF/preview',
    'https://drive.google.com/thumbnail?id=1Q-ebpbx6ELdWoOmL0UcCkUuC9qI3EeVF&sz=w1200',
    NULL,
    '16:9',
    ARRAY['Timeline Reel', 'Rewind with Riyas — Celebrity Talk Show & Podcast']::TEXT[],
    59,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    'e7b8bad2-d15e-46fe-8f39-cf4b4b359da6',
    'Rewind with Riyas — Celebrity Talk Show & Podcast — Podcast Akhila 1',
    'Podcast',
    'Conversations beyond the runway. Intimate, unfiltered dialogues with film stars, fashion designers, top influencers, and creative pioneers.',
    'https://drive.google.com/file/d/1lh7P_9jS1szbaRMo2q2iSRheTKFRQzjM/view',
    'https://drive.google.com/file/d/1lh7P_9jS1szbaRMo2q2iSRheTKFRQzjM/preview',
    'https://drive.google.com/thumbnail?id=1lh7P_9jS1szbaRMo2q2iSRheTKFRQzjM&sz=w1200',
    NULL,
    '16:9',
    ARRAY['Timeline Reel', 'Rewind with Riyas — Celebrity Talk Show & Podcast']::TEXT[],
    60,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    '979e8282-a2e1-4448-9d8d-cfeeefbf50b9',
    'Dandiya Deeshna Night & Highlights Video (2025)',
    'Event',
    'High-energy festive celebration uniting traditional Garba beats, dynamic DJ sets, ethnic fashion, and thousands of dancers.',
    'https://drive.google.com/file/d/1HY30vLdhdsZ63PE4t8Hr0Iu5hgxoD6Mu/view',
    'https://drive.google.com/file/d/1HY30vLdhdsZ63PE4t8Hr0Iu5hgxoD6Mu/preview',
    'https://drive.google.com/thumbnail?id=1HY30vLdhdsZ63PE4t8Hr0Iu5hgxoD6Mu&sz=w1200',
    NULL,
    '16:9',
    ARRAY['Timeline Event', 'Event', '2025']::TEXT[],
    61,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    'c699ed4c-fde8-412a-b89b-3354692c80eb',
    'Dandiya Deeshna Night & Highlights Video — Dandya Highlights 2',
    'Event',
    'High-energy festive celebration uniting traditional Garba beats, dynamic DJ sets, ethnic fashion, and thousands of dancers.',
    'https://drive.google.com/file/d/1k9VlXVJIsU2fwnC_Ff0P_np9FTbIatO3/view',
    'https://drive.google.com/file/d/1k9VlXVJIsU2fwnC_Ff0P_np9FTbIatO3/preview',
    'https://drive.google.com/thumbnail?id=1k9VlXVJIsU2fwnC_Ff0P_np9FTbIatO3&sz=w1200',
    NULL,
    '16:9',
    ARRAY['Timeline Reel', 'Dandiya Deeshna Night & Highlights Video']::TEXT[],
    62,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    '6dad3b3a-c1b4-4653-b2d1-02bdc7ecd692',
    'Hycinth Rohan Runway Videos (2025)',
    'Show',
    'Runway cuts and designer spotlight videos featuring high-fashion choreography at Hycinth.',
    'https://drive.google.com/file/d/1nhQCGv1wlvsZpVAfhI23eR5SccWEE_0E/view',
    'https://drive.google.com/file/d/1nhQCGv1wlvsZpVAfhI23eR5SccWEE_0E/preview',
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80',
    NULL,
    '16:9',
    ARRAY['Timeline Event', 'Show', '2025']::TEXT[],
    63,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    '9a33f4b2-2ffe-4ab0-874d-3d5183723a04',
    'NYE 2026 Hycinth Highlights & Countdown — NYE 2026 Max Showcase',
    'Event',
    'Exclusive countdown spectacle and VIP gala dinner produced with world-class light and sound architecture at Hycinth.',
    'https://drive.google.com/file/d/1XihgDqv_tpyl8Otw4NQNLVDn-CgY3ZyD/view',
    'https://drive.google.com/file/d/1XihgDqv_tpyl8Otw4NQNLVDn-CgY3ZyD/preview',
    'https://drive.google.com/thumbnail?id=1XihgDqv_tpyl8Otw4NQNLVDn-CgY3ZyD&sz=w1200',
    NULL,
    '16:9',
    ARRAY['Timeline Reel', 'NYE 2026 Hycinth Highlights & Countdown']::TEXT[],
    64,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    '5bde179b-3277-402a-a40c-a65e11af046c',
    'NYE 2026 Hycinth Highlights & Countdown — NYE 2026 FS Videos & Stage Production',
    'Event',
    'Exclusive countdown spectacle and VIP gala dinner produced with world-class light and sound architecture at Hycinth.',
    'https://drive.google.com/file/d/1aqqHq2lAQ5SLXhgteRT92P_aCIyG2eaq/view',
    'https://drive.google.com/file/d/1aqqHq2lAQ5SLXhgteRT92P_aCIyG2eaq/preview',
    'https://drive.google.com/thumbnail?id=1aqqHq2lAQ5SLXhgteRT92P_aCIyG2eaq&sz=w1200',
    NULL,
    '16:9',
    ARRAY['Timeline Reel', 'NYE 2026 Hycinth Highlights & Countdown']::TEXT[],
    65,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    '96f79851-e62d-4749-9207-093868f31616',
    'NYE 2026 Hycinth Highlights & Countdown — NYE Roopesh Costume Showcase',
    'Event',
    'Exclusive countdown spectacle and VIP gala dinner produced with world-class light and sound architecture at Hycinth.',
    'https://drive.google.com/file/d/1-Z06ay5-PfYu8_MR0pRUb0EBN0WV2vq-/view',
    'https://drive.google.com/file/d/1-Z06ay5-PfYu8_MR0pRUb0EBN0WV2vq-/preview',
    'https://drive.google.com/thumbnail?id=1-Z06ay5-PfYu8_MR0pRUb0EBN0WV2vq-&sz=w1200',
    NULL,
    '16:9',
    ARRAY['Timeline Reel', 'NYE 2026 Hycinth Highlights & Countdown']::TEXT[],
    66,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    '75d0a0ba-bbc0-421a-bf63-efe551bf444c',
    'Pothys Swarnamahal – Vishu Ad Influencer Campaign — Pothys Riyas & Rithu 2',
    'Campaign',
    'Festive Vishu jewellery influencer campaigns and commercial digital reels produced for Pothys Swarnamahal.',
    'https://drive.google.com/file/d/1RSzFXbd4u-PudlNFLVdpMa_5w2r6be41/view',
    'https://drive.google.com/file/d/1RSzFXbd4u-PudlNFLVdpMa_5w2r6be41/preview',
    'https://drive.google.com/thumbnail?id=1RSzFXbd4u-PudlNFLVdpMa_5w2r6be41&sz=w1200',
    NULL,
    '16:9',
    ARRAY['Timeline Reel', 'Pothys Swarnamahal – Vishu Ad Influencer Campaign']::TEXT[],
    67,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    'bc9fc8a2-991c-4ae1-9c50-2f54873536aa',
    'Pothys Swarnamahal – Vishu Ad Influencer Campaign — Pothys Riyas & Geethu',
    'Campaign',
    'Festive Vishu jewellery influencer campaigns and commercial digital reels produced for Pothys Swarnamahal.',
    'https://drive.google.com/file/d/1bj3XbE2Cb4Y18U63x2bVeCcWErZLOLMt/view',
    'https://drive.google.com/file/d/1bj3XbE2Cb4Y18U63x2bVeCcWErZLOLMt/preview',
    'https://drive.google.com/thumbnail?id=1bj3XbE2Cb4Y18U63x2bVeCcWErZLOLMt&sz=w1200',
    NULL,
    '16:9',
    ARRAY['Timeline Reel', 'Pothys Swarnamahal – Vishu Ad Influencer Campaign']::TEXT[],
    68,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    'a13e594d-10ba-46f7-be16-316888a2ee57',
    'Pothys Swarnamahal – Vishu Ad Influencer Campaign — Pothys Niranjana',
    'Campaign',
    'Festive Vishu jewellery influencer campaigns and commercial digital reels produced for Pothys Swarnamahal.',
    'https://drive.google.com/file/d/1OqhS56YREPJ6z7fTTNFYgD9gQUd9UjGU/view',
    'https://drive.google.com/file/d/1OqhS56YREPJ6z7fTTNFYgD9gQUd9UjGU/preview',
    'https://drive.google.com/thumbnail?id=1OqhS56YREPJ6z7fTTNFYgD9gQUd9UjGU&sz=w1200',
    NULL,
    '16:9',
    ARRAY['Timeline Reel', 'Pothys Swarnamahal – Vishu Ad Influencer Campaign']::TEXT[],
    69,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    '898f8881-581d-407b-8ef9-4937bc61b259',
    'Pothys Swarnamahal – Vishu Ad Influencer Campaign — Pothys Krishna Single',
    'Campaign',
    'Festive Vishu jewellery influencer campaigns and commercial digital reels produced for Pothys Swarnamahal.',
    'https://drive.google.com/file/d/1XSVcGEB6yHNAnFgIqRe96i0bN6nrdQv0/view',
    'https://drive.google.com/file/d/1XSVcGEB6yHNAnFgIqRe96i0bN6nrdQv0/preview',
    'https://drive.google.com/thumbnail?id=1XSVcGEB6yHNAnFgIqRe96i0bN6nrdQv0&sz=w1200',
    NULL,
    '16:9',
    ARRAY['Timeline Reel', 'Pothys Swarnamahal – Vishu Ad Influencer Campaign']::TEXT[],
    70,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    '62419ccb-5a11-4197-996c-d97236f4a722',
    'Pothys Swarnamahal – Vishu Ad Influencer Campaign — Pothys Krishna',
    'Campaign',
    'Festive Vishu jewellery influencer campaigns and commercial digital reels produced for Pothys Swarnamahal.',
    'https://drive.google.com/file/d/1bdxycJk0sl3Qo8Tfvuy1N5JBzOuXaF_d/view',
    'https://drive.google.com/file/d/1bdxycJk0sl3Qo8Tfvuy1N5JBzOuXaF_d/preview',
    'https://drive.google.com/thumbnail?id=1bdxycJk0sl3Qo8Tfvuy1N5JBzOuXaF_d&sz=w1200',
    NULL,
    '16:9',
    ARRAY['Timeline Reel', 'Pothys Swarnamahal – Vishu Ad Influencer Campaign']::TEXT[],
    71,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    '58a20881-b05f-441d-8bf2-4157568aa93b',
    'Pothys Swarnamahal – Vishu Ad Influencer Campaign — Pothys Diwali Ganga',
    'Campaign',
    'Festive Vishu jewellery influencer campaigns and commercial digital reels produced for Pothys Swarnamahal.',
    'https://drive.google.com/file/d/1TWrKeCoGW087YSxqMA2ZcAfE2uf520EG/view',
    'https://drive.google.com/file/d/1TWrKeCoGW087YSxqMA2ZcAfE2uf520EG/preview',
    'https://drive.google.com/thumbnail?id=1TWrKeCoGW087YSxqMA2ZcAfE2uf520EG&sz=w1200',
    NULL,
    '16:9',
    ARRAY['Timeline Reel', 'Pothys Swarnamahal – Vishu Ad Influencer Campaign']::TEXT[],
    72,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    'ed212367-38a7-4976-bf31-223baee8edb7',
    'Ather Scooter — Ather Combo Santa',
    'Campaign',
    'Next-generation electric scooter commercial campaign and festive holiday storytelling produced for Ather Energy.',
    'https://drive.google.com/file/d/1E5x3q55OZm8KmGBbbOHBMvJqvkf2WpPg/view',
    'https://drive.google.com/file/d/1E5x3q55OZm8KmGBbbOHBMvJqvkf2WpPg/preview',
    'https://drive.google.com/thumbnail?id=1E5x3q55OZm8KmGBbbOHBMvJqvkf2WpPg&sz=w1200',
    NULL,
    '16:9',
    ARRAY['Timeline Reel', 'Ather Scooter']::TEXT[],
    73,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    '8ca8e7f1-7d63-4309-8b18-cb3f3572af1f',
    'Citroën – Aircross Campaign — Citroën – Onam Showcase',
    'Campaign',
    'Flagship commercial video production highlighting the dynamic comfort, modular space, and European design of Citroën Aircross.',
    'https://drive.google.com/file/d/139wztoY-mC0R8Y5x0v_tZWbEqd1XyCmM/view',
    'https://drive.google.com/file/d/139wztoY-mC0R8Y5x0v_tZWbEqd1XyCmM/preview',
    'https://drive.google.com/thumbnail?id=139wztoY-mC0R8Y5x0v_tZWbEqd1XyCmM&sz=w1200',
    NULL,
    '16:9',
    ARRAY['Timeline Reel', 'Citroën – Aircross Campaign']::TEXT[],
    74,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    '47b095fa-d328-43b9-ad68-bd2fe5e3f951',
    'Citroën – Aircross Campaign — Citroën – Pre-Onam Campaign',
    'Campaign',
    'Flagship commercial video production highlighting the dynamic comfort, modular space, and European design of Citroën Aircross.',
    'https://drive.google.com/file/d/1Zic99SZst13pSd0l8-adVZwzuSxSbZj8/view',
    'https://drive.google.com/file/d/1Zic99SZst13pSd0l8-adVZwzuSxSbZj8/preview',
    'https://drive.google.com/thumbnail?id=1Zic99SZst13pSd0l8-adVZwzuSxSbZj8&sz=w1200',
    NULL,
    '16:9',
    ARRAY['Timeline Reel', 'Citroën – Aircross Campaign']::TEXT[],
    75,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    'a98e41b1-11d0-4a73-bde2-2fa83c273efd',
    'Citroën – Aircross Campaign — Citroën – Pre-Onam Showcase',
    'Campaign',
    'Flagship commercial video production highlighting the dynamic comfort, modular space, and European design of Citroën Aircross.',
    'https://drive.google.com/file/d/1kPqk0SWzlqcGt3dn1ZWGN5GWDuRXevQB/view',
    'https://drive.google.com/file/d/1kPqk0SWzlqcGt3dn1ZWGN5GWDuRXevQB/preview',
    'https://drive.google.com/thumbnail?id=1kPqk0SWzlqcGt3dn1ZWGN5GWDuRXevQB&sz=w1200',
    NULL,
    '16:9',
    ARRAY['Timeline Reel', 'Citroën – Aircross Campaign']::TEXT[],
    76,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    'eace39cc-f13b-4b53-b121-4f78b6280a1c',
    'Citroën – Aircross Campaign — Citroën – Lifestyle Drive',
    'Campaign',
    'Flagship commercial video production highlighting the dynamic comfort, modular space, and European design of Citroën Aircross.',
    'https://drive.google.com/file/d/157n4wQ7Mz5LvZcei3EuAnbwe9BIZlYR_/view',
    'https://drive.google.com/file/d/157n4wQ7Mz5LvZcei3EuAnbwe9BIZlYR_/preview',
    'https://drive.google.com/thumbnail?id=157n4wQ7Mz5LvZcei3EuAnbwe9BIZlYR_&sz=w1200',
    NULL,
    '16:9',
    ARRAY['Timeline Reel', 'Citroën – Aircross Campaign']::TEXT[],
    77,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    'd12945b3-1da0-42b7-b21c-4ebd42629f89',
    'Citroën – Aircross Campaign — Citroën – Festive Drive',
    'Campaign',
    'Flagship commercial video production highlighting the dynamic comfort, modular space, and European design of Citroën Aircross.',
    'https://drive.google.com/file/d/1bokzX5PR6GaioY8KazckyQhM3RFpiDCl/view',
    'https://drive.google.com/file/d/1bokzX5PR6GaioY8KazckyQhM3RFpiDCl/preview',
    'https://drive.google.com/thumbnail?id=1bokzX5PR6GaioY8KazckyQhM3RFpiDCl&sz=w1200',
    NULL,
    '16:9',
    ARRAY['Timeline Reel', 'Citroën – Aircross Campaign']::TEXT[],
    78,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    'ddf672df-ec0d-4066-b3be-6934d3cd35bd',
    'Citroën – Aircross Campaign — Citroën – Urban Drive',
    'Campaign',
    'Flagship commercial video production highlighting the dynamic comfort, modular space, and European design of Citroën Aircross.',
    'https://drive.google.com/file/d/1w004ZcoXcYgqMIwekDAOV3WwwRwULtei/view',
    'https://drive.google.com/file/d/1w004ZcoXcYgqMIwekDAOV3WwwRwULtei/preview',
    'https://drive.google.com/thumbnail?id=1w004ZcoXcYgqMIwekDAOV3WwwRwULtei&sz=w1200',
    NULL,
    '16:9',
    ARRAY['Timeline Reel', 'Citroën – Aircross Campaign']::TEXT[],
    79,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    '45601aba-335e-43f0-9b2a-d70aa956b3d4',
    'Citroën – Aircross Campaign — Citroën – EV Campaign',
    'Campaign',
    'Flagship commercial video production highlighting the dynamic comfort, modular space, and European design of Citroën Aircross.',
    'https://drive.google.com/file/d/15hsMQ6JIMxRxibiGZx8l5sIpubMQSCe3/view',
    'https://drive.google.com/file/d/15hsMQ6JIMxRxibiGZx8l5sIpubMQSCe3/preview',
    'https://drive.google.com/thumbnail?id=15hsMQ6JIMxRxibiGZx8l5sIpubMQSCe3&sz=w1200',
    NULL,
    '16:9',
    ARRAY['Timeline Reel', 'Citroën – Aircross Campaign']::TEXT[],
    80,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    'e071ef17-6834-4d18-be6b-d79de7c68c2b',
    'Citroën – Aircross Campaign — Citroën – Brand Film',
    'Campaign',
    'Flagship commercial video production highlighting the dynamic comfort, modular space, and European design of Citroën Aircross.',
    'https://drive.google.com/file/d/10zpUbgg33lw8Jeoj2YlFGWdwZ6wuMWoN/view',
    'https://drive.google.com/file/d/10zpUbgg33lw8Jeoj2YlFGWdwZ6wuMWoN/preview',
    'https://drive.google.com/thumbnail?id=10zpUbgg33lw8Jeoj2YlFGWdwZ6wuMWoN&sz=w1200',
    NULL,
    '16:9',
    ARRAY['Timeline Reel', 'Citroën – Aircross Campaign']::TEXT[],
    81,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    'bed94666-89cb-47c4-af3b-ae12a856296c',
    'Citroën – Aircross Campaign — Citroën – Interior & Cockpit Feature',
    'Campaign',
    'Flagship commercial video production highlighting the dynamic comfort, modular space, and European design of Citroën Aircross.',
    'https://drive.google.com/file/d/1SHBH3ggfVo2xlZSV8mgcsOMrj7KB3yZr/view',
    'https://drive.google.com/file/d/1SHBH3ggfVo2xlZSV8mgcsOMrj7KB3yZr/preview',
    'https://drive.google.com/thumbnail?id=1SHBH3ggfVo2xlZSV8mgcsOMrj7KB3yZr&sz=w1200',
    NULL,
    '16:9',
    ARRAY['Timeline Reel', 'Citroën – Aircross Campaign']::TEXT[],
    82,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    '51968bd0-2191-4f28-aae2-903854db2416',
    'Lemon Tree – Leisure Campaign — Lemon Tree – Suites & Dining Showcase',
    'Ad',
    'Cinematic brand film and promotional digital campaign highlighting premier leisure hospitality, suites, and dining with Jeevan.',
    'https://drive.google.com/file/d/1vpzEX0IxFEPa4x8fdepzHl7KwGsQODDM/view',
    'https://drive.google.com/file/d/1vpzEX0IxFEPa4x8fdepzHl7KwGsQODDM/preview',
    'https://drive.google.com/thumbnail?id=1vpzEX0IxFEPa4x8fdepzHl7KwGsQODDM&sz=w1200',
    NULL,
    '16:9',
    ARRAY['Timeline Reel', 'Lemon Tree – Leisure Campaign']::TEXT[],
    83,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    '6e3a9f42-25ba-442e-924f-0f9964c3d2ca',
    'Škoda – Fans of Škoda (2026)',
    'Event',
    'High-octane gathering for Skoda owners, automobile influencers, and rally enthusiasts featuring experiential drives.',
    'https://drive.google.com/file/d/1LOyGz3BF41nTpwEY00NtOwCt5CuKwPut/view',
    'https://drive.google.com/file/d/1LOyGz3BF41nTpwEY00NtOwCt5CuKwPut/preview',
    'https://drive.google.com/thumbnail?id=1LOyGz3BF41nTpwEY00NtOwCt5CuKwPut&sz=w1200',
    NULL,
    '16:9',
    ARRAY['Timeline Event', 'Event', '2026']::TEXT[],
    84,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    'aa97b898-5968-485d-afca-c460790ac700',
    'Škoda – Onam Campaign (2026)',
    'Ad',
    'Comprehensive festive Onam automotive commercial ad series produced for Škoda Auto India featuring Riyas & Thara.',
    'https://drive.google.com/file/d/1azn97OLlVtjOUk4Wk_4_0iUr6TdYAtX0/view',
    'https://drive.google.com/file/d/1azn97OLlVtjOUk4Wk_4_0iUr6TdYAtX0/preview',
    'https://drive.google.com/thumbnail?id=1azn97OLlVtjOUk4Wk_4_0iUr6TdYAtX0&sz=w1200',
    NULL,
    '16:9',
    ARRAY['Timeline Event', 'Ad', '2026']::TEXT[],
    85,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    '8cc6a7fe-ac60-48a1-ac29-c78ae8c637f1',
    'Škoda – Onam Campaign — Škoda – Festive Drive',
    'Ad',
    'Comprehensive festive Onam automotive commercial ad series produced for Škoda Auto India featuring Riyas & Thara.',
    'https://drive.google.com/file/d/1XZsYfl4gb5SxIxOIgTgVhtmRDAErn4Kb/view',
    'https://drive.google.com/file/d/1XZsYfl4gb5SxIxOIgTgVhtmRDAErn4Kb/preview',
    'https://drive.google.com/thumbnail?id=1XZsYfl4gb5SxIxOIgTgVhtmRDAErn4Kb&sz=w1200',
    NULL,
    '16:9',
    ARRAY['Timeline Reel', 'Škoda – Onam Campaign']::TEXT[],
    86,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.media_videos (
    id, title, category, description, video_url, video_embed_url, thumbnail_url, duration, aspect_ratio, tags, sort_order, is_published
) VALUES (
    'f8bcb097-9e76-4f99-bd9a-1506fb02e1aa',
    'Jeep – 4x4 Adventure Campaign (2026)',
    'Campaign',
    'High-octane off-road automotive commercial series exploring rugged capability, luxury trail design, and outdoor thrills with Jeep.',
    'https://drive.google.com/file/d/1IIbClQ4Af0jwZStOCRWdVGuS19YUiuYx/view',
    'https://drive.google.com/file/d/1IIbClQ4Af0jwZStOCRWdVGuS19YUiuYx/preview',
    'https://drive.google.com/thumbnail?id=1IIbClQ4Af0jwZStOCRWdVGuS19YUiuYx&sz=w1200',
    NULL,
    '16:9',
    ARRAY['Timeline Event', 'Campaign', '2026']::TEXT[],
    87,
    true
) ON CONFLICT (id) DO NOTHING;

COMMIT;
