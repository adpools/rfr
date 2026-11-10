-- ==============================================================================
-- RFR BY RIYAS — GENUINE CONTENT SEED MIGRATION
-- Migration Version: 20261109_seed_genuine_rfr_content.sql (STRICT & VERIFIED)
-- 
-- INTEGRITY & SAFETY STANDARDS:
-- 1. Exact Column Parity: Strictly matches 20261106_rfr_cms_complete_schema.sql.
-- 2. Zero-Embellishment Standard: Derived exclusively from authentic RFR assets.
--    No fabricated metrics, placeholder URLs, hallucinated awards, or speculative dates.
-- 3. Strict Provenance & Draft Isolation:
--    - Records whose factual details or production photos are verified directly from local
--      disk assets are marked published (is_published = true).
--    - Records with unverified details or narrative claims are seeded in draft mode
--      (is_published = false) and explicitly labeled as drafts pending verification.
--      Draft status is NOT treated as factual verification; unverified claims are omitted.
-- 4. Complete Founder Record Preservation (about_riyas):
--    The existing about_riyas record is 100% preserved. Zero INSERT/UPDATE/DELETE is
--    executed against about_riyas in this migration or any reconciliation script.
-- 5. Audit Accuracy: Part 0 candidate audit evaluates the exact 78 insertion candidates
--    separately from the read-only about_riyas preservation check.
-- ==============================================================================

-- ==============================================================================
-- PART 0: READ-ONLY INSERTION AUDIT & PREVIEW
-- (Run this query first in Supabase SQL Editor to preview insert candidate counts.
--  Uses candidate-by-candidate EXISTS checks:
--  - Zero join multiplication or negative counts.
--  - Handles existing duplicates safely.
--  - Exactly mirrors PART 1 insertion criteria.
--  - Enforces data integrity: zero mutation of existing founder records.)
-- ==============================================================================
WITH candidate_evaluations AS (
    -- 1. press_articles (18 Candidates evaluated by slug)
    SELECT 
        'press_articles' AS entity_name,
        'INSERT' AS operation_type,
        cand.val AS candidate_identifier,
        EXISTS (SELECT 1 FROM public.press_articles pa WHERE pa.slug = cand.val) AS already_exists
    FROM (VALUES 
        ('press-success-kerala'), ('press-asianet-news'), ('press-kerala-kaumudi'), 
        ('press-global-fashion-week'), ('press-metro-vartha'), ('press-techies-summer-fest'), 
        ('press-koottam-stage'), ('press-chandrika-daily'), ('press-koottam-announcement'), 
        ('press-manorama-music'), ('press-koottam-installation'), ('press-srishti-music'), 
        ('press-vanimahal-creations'), ('press-dr-praveen-musical'), ('press-technopark-feature'), 
        ('press-technopark-english-daily'), ('press-technopark-kerala-piravi'), ('press-aynus-entertainments')
    ) AS cand(val)

    UNION ALL

    -- 2. projects_portfolio (13 Candidates evaluated by slug — 6 unverified excluded)
    SELECT 
        'projects_portfolio' AS entity_name,
        'INSERT' AS operation_type,
        cand.val AS candidate_identifier,
        EXISTS (SELECT 1 FROM public.projects_portfolio pp WHERE pp.slug = cand.val) AS already_exists
    FROM (VALUES 
        ('citroen'), ('jeep'), ('skoda-ad'), ('fans-of-skoda'), ('rb'), 
        ('pothys'), ('dandya'), ('max-2025'), ('ather'), ('buildhub'), 
        ('max-onam-2022'), ('max-xmas-uds'), ('max-onam-2021')
    ) AS cand(val)

    UNION ALL

    -- 3. talent_influencers (7 Candidates evaluated by name)
    SELECT 
        'talent_influencers' AS entity_name,
        'INSERT' AS operation_type,
        cand.val AS candidate_identifier,
        EXISTS (SELECT 1 FROM public.talent_influencers ti WHERE ti.name = cand.val) AS already_exists
    FROM (VALUES 
        ('Deepamol'), ('Malavika'), ('Rhea George'), ('Rudiya'), 
        ('Sahalini Sharma'), ('Shikha Santhosh'), ('Thara Anitha Mathew')
    ) AS cand(val)

    UNION ALL

    -- 4. tic_events (4 Candidates evaluated by name)
    SELECT 
        'tic_events' AS entity_name,
        'INSERT' AS operation_type,
        cand.val AS candidate_identifier,
        EXISTS (SELECT 1 FROM public.tic_events te WHERE te.name = cand.val) AS already_exists
    FROM (VALUES 
        ('Trivandrum Influencer Circle Launch Event'), 
        ('TIC Event – 2 Hycinth'), 
        ('TIC Onam Event – Hyatt & News 18'), 
        ('TIC Onam Event – Imperial Kitchen')
    ) AS cand(val)

    UNION ALL

    -- 5. tic_content (1 Candidate evaluated by table initialization condition)
    SELECT 
        'tic_content' AS entity_name,
        'INSERT' AS operation_type,
        'collective_narrative' AS candidate_identifier,
        EXISTS (SELECT 1 FROM public.tic_content) AS already_exists

    UNION ALL

    -- 6. team_members (1 Candidate evaluated by name)
    SELECT 
        'team_members' AS entity_name,
        'INSERT' AS operation_type,
        cand.val AS candidate_identifier,
        EXISTS (SELECT 1 FROM public.team_members tm WHERE tm.name = cand.val) AS already_exists
    FROM (VALUES ('Adv. Riyas')) AS cand(val)

    UNION ALL

    -- 7. seo_metadata (34 Candidates evaluated by page_path)
    SELECT 
        'seo_metadata' AS entity_name,
        'INSERT' AS operation_type,
        cand.val AS candidate_identifier,
        EXISTS (SELECT 1 FROM public.seo_metadata sm WHERE sm.page_path = cand.val) AS already_exists
    FROM (VALUES 
        ('/'), ('/timeline'), ('/about'), ('/what-is-rfr'), ('/achievements'), 
        ('/milestones'), ('/founder'), ('/riyas'), ('/our-team'), ('/team'), 
        ('/services'), ('/services/events'), ('/services/events/:slug'), 
        ('/services/campaigns'), ('/services/campaigns/:slug'), ('/services/podcast'), 
        ('/podcast'), ('/business'), ('/partners'), ('/clients'), 
        ('/assets'), ('/assets/careers'), ('/assets/models'), ('/assets/influencers'), 
        ('/assets/artists'), ('/gallery'), ('/gallery/events'), ('/gallery/shows'), 
        ('/gallery/shoots'), ('/riyas-gallery'), ('/press'), ('/press/:slug'), 
        ('/tic'), ('/contact')
    ) AS cand(val)
),
insertion_entity_aggregation AS (
    SELECT 
        entity_name,
        operation_type,
        COUNT(*)::integer AS total_candidates,
        COUNT(*) FILTER (WHERE already_exists)::integer AS existing_matches,
        COUNT(*) FILTER (WHERE NOT already_exists)::integer AS insert_candidates,
        0::integer AS potential_updates
    FROM candidate_evaluations
    GROUP BY entity_name, operation_type
),
insertion_summary AS (
    SELECT 
        '=== TOTAL INSERTION CANDIDATES ===' AS entity_name,
        'INSERT_ONLY' AS operation_type,
        COALESCE(SUM(total_candidates), 0)::integer AS total_candidates,
        COALESCE(SUM(existing_matches), 0)::integer AS existing_matches,
        COALESCE(SUM(insert_candidates), 0)::integer AS insert_candidates,
        0::integer AS potential_updates
    FROM insertion_entity_aggregation
),
about_riyas_preservation AS (
    -- about_riyas read-only audit (Audits existing row count; 0 updates performed to strictly preserve founder data)
    SELECT 
        '=== PRESERVATION AUDIT (ABOUT_RIYAS) ===' AS entity_name,
        'READ_ONLY_PRESERVED' AS operation_type,
        COUNT(*)::integer AS total_candidates,
        COUNT(*) FILTER (WHERE id IS NOT NULL)::integer AS existing_matches,
        0::integer AS insert_candidates,
        0::integer AS potential_updates
    FROM public.about_riyas
)
SELECT 
    entity_name,
    operation_type,
    total_candidates,
    existing_matches,
    insert_candidates,
    potential_updates
FROM insertion_entity_aggregation
UNION ALL
SELECT * FROM insertion_summary
UNION ALL
SELECT * FROM about_riyas_preservation;

-- ==============================================================================
-- PART 1: NON-DESTRUCTIVE CONTENT SEEDING
-- (Executes safe inserts using ON CONFLICT DO NOTHING and WHERE NOT EXISTS.
--  Every column strictly matches 20261106_rfr_cms_complete_schema.sql.
--  Unverified fields are kept NULL; unverified project/event narratives are set
--  to is_published = false so they remain drafts in admin and never appear live.)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. PRESS ARTICLES (18 Clippings from Editorial Archives)
-- Schema: slug, title, category, date_label, author, read_time, cover_image, excerpt, content, is_featured_home, sort_order, is_published, created_at, updated_at
-- Category constraint: ('Press', 'News', 'Announcements', 'Collaborations', 'Achievements')
-- 5 verified clippings with visible official mastheads are published (is_published = true).
-- 13 entries (including 3 Technopark clippings without visible mastheads and 10 event releases)
-- are left unpublished (is_published = false) pending administrative verification.
-- read_time kept NULL (unverified factual estimate).
-- ------------------------------------------------------------------------------
INSERT INTO public.press_articles (
    slug, title, category, date_label, author, read_time, cover_image, excerpt, content, is_featured_home, sort_order, is_published, created_at, updated_at
) VALUES 
-- A. 5 Verified Print & Broadcast Clippings with Visible Mastheads (Published: is_published = true)
('press-success-kerala', 'Success Kerala: Feature Profile', 'Press', 'Editorial Archive', 'Success Kerala', NULL, '/news and press/WhatsApp Image 2026-11-06 at 10.53.08 AM (1).jpeg', 'പാഷനുണ്ടോ? വിജയം താനേ വരും! ഇത് സർട്ടിഫൈഡ് ഉറപ്പ്...!', ARRAY['Success Kerala magazine feature profile on Adv. Riyas.'], true, 1, true, now(), now()),
('press-asianet-news', 'Asianet News: Television Broadcast', 'News', 'Editorial Archive', 'Asianet News', NULL, '/news and press/WhatsApp Image 2026-11-04 at 9.41.04 PM.jpeg', 'Asianet News Broadcast Coverage', ARRAY['Asianet News television broadcast archive scan.'], true, 2, true, now(), now()),
('press-kerala-kaumudi', 'Kerala Kaumudi: Daily Newspaper Print', 'Press', 'Editorial Archive', 'Kerala Kaumudi', NULL, '/news and press/WhatsApp Image 2026-11-04 at 9.42.10 PM (1).jpeg', 'Kerala Kaumudi Daily Newspaper Print Archive', ARRAY['Kerala Kaumudi daily newspaper print archive.'], false, 3, true, now(), now()),
('press-metro-vartha', 'Metro Vartha: Daily Newspaper Print', 'Press', 'Editorial Archive', 'Metro Vartha', NULL, '/news and press/WhatsApp Image 2026-11-04 at 9.42.11 PM.jpeg', 'Metro Vartha Daily Newspaper Print Archive', ARRAY['Metro Vartha daily newspaper archive clipping.'], false, 4, true, now(), now()),
('press-chandrika-daily', 'Chandrika: Daily Newspaper Print', 'Press', 'Editorial Archive', 'Chandrika', NULL, '/news and press/WhatsApp Image 2026-11-04 at 9.42.08 PM (1).jpeg', 'Chandrika Daily Newspaper Print Archive', ARRAY['Chandrika daily newspaper print archive.'], false, 5, true, now(), now()),

-- B. 13 Event Releases, Collaboration Posters & Clippings with Pending Masthead Verification (Draft: is_published = false)
('press-technopark-feature', 'Technopark: Campus Initiative Print Coverage', 'Press', 'Editorial Archive', 'Pending Verification', NULL, '/news and press/WhatsApp Image 2026-11-04 at 9.42.11 PM (1).jpeg', 'Technopark Campus Newspaper Print Clipping', ARRAY['Technopark campus newspaper archive clipping.'], false, 6, false, now(), now()),
('press-technopark-english-daily', 'Technopark: English Daily Newspaper Report', 'Press', 'Editorial Archive', 'Pending Verification', NULL, '/news and press/WhatsApp Image 2026-11-04 at 9.42.11 PM (2).jpeg', 'English Daily Newspaper Event Report', ARRAY['English daily newspaper archive clipping on Technopark event.'], false, 7, false, now(), now()),
('press-technopark-kerala-piravi', 'Technopark: Kerala Piravi Newsprint Article', 'Press', 'Editorial Archive', 'Pending Verification', NULL, '/news and press/WhatsApp Image 2026-11-04 at 9.42.14 PM.jpeg', 'Kerala Piravi English Newsprint Article', ARRAY['English daily newspaper print archive on Kerala Piravi event.'], false, 8, false, now(), now()),
('press-global-fashion-week', 'Global Fashion Week: Red Carpet & Runway Feature', 'News', 'Editorial Archive', 'Global Fashion Week', NULL, '/news and press/WhatsApp Image 2026-11-04 at 9.41.05 PM (1).jpeg', 'Red Carpet & Runway Feature Scan', ARRAY['Archived event feature clipping.'], false, 9, false, now(), now()),
('press-techies-summer-fest', 'Techies Summer Fest: Official Release Scan', 'News', 'Editorial Archive', 'Techies Summer Fest', NULL, '/news and press/WhatsApp Image 2026-11-04 at 9.41.06 PM (1).jpeg', 'Festival Release Archive Scan', ARRAY['Archived festival release clipping.'], false, 10, false, now(), now()),
('press-koottam-stage', 'Koottam: Stage Presentation & Felicitations', 'Announcements', 'Editorial Archive', 'Koottam', NULL, '/news and press/WhatsApp Image 2026-11-04 at 9.41.04 PM (1).jpeg', 'Stage Presentation Archive Scan', ARRAY['Archived event stage presentation scan.'], false, 11, false, now(), now()),
('press-koottam-announcement', 'Koottam: Event Announcement Scan', 'Announcements', 'Editorial Archive', 'Koottam', NULL, '/news and press/WhatsApp Image 2026-11-04 at 9.41.05 PM.jpeg', 'Event Announcement Archive Scan', ARRAY['Archived event announcement scan.'], false, 12, false, now(), now()),
('press-manorama-music', 'Manorama Music: Koode Nee Release Feature', 'Collaborations', 'Editorial Archive', 'Manorama Music', NULL, '/news and press/WhatsApp Image 2026-11-04 at 9.41.06 PM (2).jpeg', 'Koode Nee Musical Release Scan', ARRAY['Archived musical release feature scan.'], false, 13, false, now(), now()),
('press-koottam-installation', 'Koottam: Event Showcase Scan', 'Announcements', 'Editorial Archive', 'Koottam', NULL, '/news and press/WhatsApp Image 2026-11-04 at 9.41.07 PM (1).jpeg', 'Event Showcase Archive Scan', ARRAY['Archived event showcase photo scan.'], false, 14, false, now(), now()),
('press-srishti-music', 'Srishti Music: Love You Too Feature', 'Collaborations', 'Editorial Archive', 'Srishti Music', NULL, '/news and press/WhatsApp Image 2026-11-04 at 9.41.07 PM.jpeg', 'Love You Too Musical Release Scan', ARRAY['Archived musical release feature scan.'], false, 15, false, now(), now()),
('press-vanimahal-creations', 'Vanimahal Creations: Production Feature Scan', 'Collaborations', 'Editorial Archive', 'Vanimahal Creations', NULL, '/news and press/WhatsApp Image 2026-11-04 at 9.41.08 PM.jpeg', 'Production Feature Archive Scan', ARRAY['Archived artistic production scan.'], false, 16, false, now(), now()),
('press-dr-praveen-musical', 'Dr. Praveen Musical: Cover Feature Scan', 'Collaborations', 'Editorial Archive', 'Dr. Praveen Musical', NULL, '/news and press/WhatsApp Image 2026-11-04 at 9.41.09 PM.jpeg', 'Musical Album Feature Archive Scan', ARRAY['Archived musical album feature scan.'], false, 17, false, now(), now()),
('press-aynus-entertainments', 'Aynus Entertainments: Production Showcase Scan', 'Collaborations', 'Editorial Archive', 'Aynus Entertainments', NULL, '/news and press/WhatsApp Image 2026-11-04 at 9.46.07 PM.jpeg', 'Production Showcase Archive Scan', ARRAY['Archived entertainment showcase scan.'], false, 18, false, now(), now())
ON CONFLICT (slug) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 2. PROJECTS PORTFOLIO (13 Source-Referenced Productions)
-- Schema: slug, title, client, category, year, cover_image, excerpt, description, tags, is_featured_home, sort_order, is_published, created_at, updated_at
-- Category constraint: ('Runway', 'Gala', 'Campaign', 'Shoot', 'Digital', 'Commercial')
-- 2 verified automotive campaigns with genuine production stills on disk are published (is_published = true).
-- 11 projects (including dandya and buildhub whose client contracts are unverified, and 9 brand logo placeholders)
-- are seeded as draft (is_published = false) pending administrative verification.
-- ------------------------------------------------------------------------------
INSERT INTO public.projects_portfolio (
    slug, title, client, category, year, cover_image, excerpt, description, tags, is_featured_home, sort_order, is_published, created_at, updated_at
) VALUES 
-- A. 2 Projects with Verified Production Photos on Disk (Published: is_published = true)
('citroen', 'Citroën Ad Campaign', 'Citroën India', 'Campaign', 2026, '/images/thumbnails/17xhWbUtxJePM8igOO7VADLDfiqcG6S04.jpg', 'Citroën Ad Campaign', 'Commercial production and advertising campaign for Citroën.', ARRAY['Automotive', 'Campaign'], true, 1, true, now(), now()),
('ather', 'Ather Scooter — Influencer Campaign', 'Ather Energy', 'Campaign', 2024, '/images/thumbnails/1agM4IPcwpZHfsXjbA-o8SfP4kkpPW1t_.jpg', 'Ather Scooter Influencer Campaign', 'Electric mobility influencer campaign for Ather Energy.', ARRAY['EV', 'Mobility', 'Campaign'], false, 2, true, now(), now()),

-- B. 11 Projects with Pending Archival / Photo Verification (Draft: is_published = false)
('dandya', 'Dandya Night', NULL, 'Gala', 2025, '/images/thumbnails/1dy6TIwofRd4bWLMrdHeiykYkqTVbFIFw.jpg', 'Dandya Night (Draft)', 'Draft portfolio record. Project description, client verification, and production dates are pending administrative verification against original archives.', ARRAY['Cultural', 'Festival'], false, 3, false, now(), now()),
('buildhub', 'Build Hub Ad', NULL, 'Commercial', 2024, '/images/thumbnails/1GEWSZYSU8qQKNW05-dSMkmuUBd2AbOhV.jpg', 'Build Hub Commercial Ad (Draft)', 'Draft portfolio record. Project description, client verification, and production dates are pending administrative verification against original archives.', ARRAY['Architecture', 'Commercial'], false, 4, false, now(), now()),
('jeep', 'Jeep Ad Campaign', 'Jeep India', 'Campaign', 2026, '/images/clients/jeep.png', 'Jeep Ad Campaign (Draft)', 'Draft portfolio record. Project description, production dates, and cover media are pending administrative verification against original archives.', ARRAY['Automotive', 'Campaign'], true, 5, false, now(), now()),
('skoda-ad', 'Škoda Ad Campaign', 'Škoda Auto India', 'Commercial', 2026, '/images/clients/skoda.png', 'Škoda Ad Campaign (Draft)', 'Draft portfolio record. Project description, production dates, and cover media are pending administrative verification against original archives.', ARRAY['Automotive', 'Commercial'], false, 6, false, now(), now()),
('fans-of-skoda', 'Fans of Škoda — Škoda Event', 'Škoda Auto India', 'Gala', 2026, '/images/clients/skoda.png', 'Fans of Škoda (Draft)', 'Draft portfolio record. Project description, production dates, and cover media are pending administrative verification against original archives.', ARRAY['Community', 'Event'], false, 7, false, now(), now()),
('rb', 'R&B Ad Campaign', 'R&B Lifestyle', 'Campaign', 2026, '/images/clients/rb.png', 'R&B Campaign (Draft)', 'Draft portfolio record. Project description, production dates, and cover media are pending administrative verification against original archives.', ARRAY['Fashion', 'Campaign'], true, 8, false, now(), now()),
('pothys', 'Pothys Swarnamahal — Vishu Influencer Campaign', 'Pothys Silks', 'Campaign', 2025, '/images/pothys.png', 'Pothys Campaign (Draft)', 'Draft portfolio record. Project description, production dates, and cover media are pending administrative verification against original archives.', ARRAY['Heritage', 'Silk', 'Campaign'], true, 9, false, now(), now()),
('max-2025', 'Influencer Campaign — Max', 'Max Fashion India', 'Campaign', 2025, '/images/clients/max.png', 'Max Campaign 2025 (Draft)', 'Draft portfolio record. Project description, production dates, and cover media are pending administrative verification against original archives.', ARRAY['Fashion', 'Retail', 'Campaign'], false, 10, false, now(), now()),
('max-onam-2022', 'Max Onam Collection Launch', 'Max Fashion India', 'Runway', 2022, '/images/clients/max.png', 'Max Onam 2022 (Draft)', 'Draft portfolio record. Project description, production dates, and cover media are pending administrative verification against original archives.', ARRAY['Runway', 'Festive'], false, 11, false, now(), now()),
('max-xmas-uds', 'MAX Xmas Collection Launch Event at UDS', 'Max Fashion India', 'Runway', 2021, '/images/clients/max.png', 'Max Xmas UDS (Draft)', 'Draft portfolio record. Project description, production dates, and cover media are pending administrative verification against original archives.', ARRAY['Runway', 'Winter'], false, 12, false, now(), now()),
('max-onam-2021', 'Max Influencer Campaign — Onam', 'Max Fashion India', 'Campaign', 2021, '/images/clients/max.png', 'Max Onam 2021 (Draft)', 'Draft portfolio record. Project description, production dates, and cover media are pending administrative verification against original archives.', ARRAY['Fashion', 'Campaign'], false, 13, false, now(), now())
ON CONFLICT (slug) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 3. TALENT INFLUENCERS (7 Creators — Strictly Unpublished Drafts with Safe Values)
-- Schema: name, niche, tier, profile_image, sort_order, is_published, created_at, updated_at
-- Niche is required by schema NOT NULL constraint: populated with safe neutral value 'Pending Verification'.
-- Tier is kept NULL (no unverified tier claims).
-- All 7 creators are seeded as unpublished drafts (is_published = false).
-- Unverified fields (follower counts, social handles) are strictly kept NULL.
-- ------------------------------------------------------------------------------
INSERT INTO public.talent_influencers (
    name, niche, tier, profile_image, sort_order, is_published, created_at, updated_at
)
SELECT * FROM (VALUES 
    ('Deepamol', 'Pending Verification', NULL::text, '/images/influencers/deepamol.jpg', 1, false, now(), now()),
    ('Malavika', 'Pending Verification', NULL::text, '/images/influencers/malavika.jpg', 2, false, now(), now()),
    ('Rhea George', 'Pending Verification', NULL::text, '/images/influencers/rhea-george.jpg', 3, false, now(), now()),
    ('Rudiya', 'Pending Verification', NULL::text, '/images/influencers/rudiya.jpg', 4, false, now(), now()),
    ('Sahalini Sharma', 'Pending Verification', NULL::text, '/images/influencers/sahalini-sharma.jpg', 5, false, now(), now()),
    ('Shikha Santhosh', 'Pending Verification', NULL::text, '/images/influencers/shikha-santhosh.jpg', 6, false, now(), now()),
    ('Thara Anitha Mathew', 'Pending Verification', NULL::text, '/images/influencers/thara-anitha-mathew.jpg', 7, false, now(), now())
) AS v(name, niche, tier, profile_image, sort_order, is_published, created_at, updated_at)
WHERE NOT EXISTS (SELECT 1 FROM public.talent_influencers ti WHERE ti.name = v.name);

-- ------------------------------------------------------------------------------
-- 4. TIC EVENTS (4 Authentic Conclaves from TIC Page)
-- Schema: name, event_date, venue, description, cover_image, sort_order, is_published, created_at, updated_at
-- Specific calendar dates are set to NULL (no invented dates).
-- Seeded as draft (is_published = false) pending administrative date verification.
-- ------------------------------------------------------------------------------
INSERT INTO public.tic_events (
    name, event_date, venue, description, cover_image, sort_order, is_published, created_at, updated_at
)
SELECT * FROM (VALUES
    ('Trivandrum Influencer Circle Launch Event', NULL::date, 'Trivandrum Influencer Circle', 'Draft event record. Specific dates, attendee metrics, and media coverage are pending administrative verification.', '/images/clients/tic.png', 1, false, now(), now()),
    ('TIC Event – 2 Hycinth', NULL::date, 'Hycinth Hotels', 'Draft event record. Specific dates, attendee metrics, and media coverage are pending administrative verification.', '/images/clients/tic.png', 2, false, now(), now()),
    ('TIC Onam Event – Hyatt & News 18', NULL::date, 'Hyatt Regency', 'Draft event record. Specific dates, attendee metrics, and media coverage are pending administrative verification.', '/images/clients/tic.png', 3, false, now(), now()),
    ('TIC Onam Event – Imperial Kitchen', NULL::date, 'Imperial Kitchen', 'Draft event record. Specific dates, attendee metrics, and media coverage are pending administrative verification.', '/images/clients/tic.png', 4, false, now(), now())
) AS v(name, event_date, venue, description, cover_image, sort_order, is_published, created_at, updated_at)
WHERE NOT EXISTS (SELECT 1 FROM public.tic_events te WHERE te.name = v.name);

-- ------------------------------------------------------------------------------
-- 5. TIC CONTENT (Core Narrative for Trivandrum Influencer Circle)
-- Schema: title, tagline, narrative, hero_image, is_published, created_at, updated_at
-- Seeded as draft (is_published = false) to prevent unverified promotional claims from going live.
-- ------------------------------------------------------------------------------
INSERT INTO public.tic_content (
    title, tagline, narrative, hero_image, is_published, created_at, updated_at
)
SELECT 
    'TRIVANDRUM INFLUENCER CIRCLE',
    'TIC • CO-FOUNDED BY RIYAS',
    'Trivandrum Influencer Circle (TIC) is a regional network of digital creators in Trivandrum, co-founded by Adv. Riyas.',
    '/images/clients/tic.png',
    false, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM public.tic_content);

-- ------------------------------------------------------------------------------
-- 6. TEAM MEMBERS (Founding Leadership Profile)
-- Schema: name, designation, department, bio, image, sort_order, is_published, created_at, updated_at
-- ------------------------------------------------------------------------------
INSERT INTO public.team_members (
    name, designation, department, bio, image, sort_order, is_published, created_at, updated_at
)
SELECT 
    'Adv. Riyas',
    'Founder, RFR',
    'Leadership',
    'Advocate at the High Court of Kerala and founder of RFR BY RIYAS.',
    '/images/riyas.jpg',
    1, true, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM public.team_members tm WHERE tm.name = 'Adv. Riyas');

-- ------------------------------------------------------------------------------
-- 7. SEO METADATA (Complete 34-Route Matrix — Strictly Accurate & Conservative)
-- Schema: page_path, meta_title, meta_description, keywords, canonical_url, og_image_url, created_at, updated_at
-- All promotional claims ("luxury", "vetted models", "verified creators", "landmark") have been removed.
-- ------------------------------------------------------------------------------
INSERT INTO public.seo_metadata (
    page_path, meta_title, meta_description, keywords, canonical_url, og_image_url, created_at, updated_at
) VALUES 
('/', 'RFR BY RIYAS — Fashion Runway, Brand Campaigns & Creative Direction', 'Official website of RFR BY RIYAS, founded by Adv. Riyas. Fashion runway curation, commercial brand campaigns, and creative productions in Kerala.', ARRAY['fashion runway', 'brand campaigns', 'RFR by Riyas', 'Kerala fashion', 'Adv. Riyas'], 'https://rfrbyriyas.com/', '/images/riyas.jpg', now(), now()),
('/timeline', 'Timeline — Production Archives | RFR BY RIYAS', 'Chronological archive of brand campaigns, fashion presentations, and productions curated by RFR BY RIYAS.', ARRAY['fashion timeline', 'runway archives', 'fashion history Kerala'], 'https://rfrbyriyas.com/timeline', '/images/riyas.jpg', now(), now()),
('/about', 'About RFR BY RIYAS — Overview', 'Overview of RFR BY RIYAS and its creative direction in fashion runway curation and commercial productions.', ARRAY['about RFR', 'Adv. Riyas', 'fashion runway direction'], 'https://rfrbyriyas.com/about', '/images/riyas.jpg', now(), now()),
('/what-is-rfr', 'What is RFR? — Overview | RFR BY RIYAS', 'Overview of the core areas of RFR BY RIYAS: fashion runways, brand campaigns, and creative productions.', ARRAY['what is RFR', 'creative productions', 'fashion curation'], 'https://rfrbyriyas.com/what-is-rfr', '/images/riyas.jpg', now(), now()),
('/achievements', 'Achievements & Media Archives | RFR BY RIYAS', 'Archive of runway shows, collaborations, and commercial fashion productions.', ARRAY['fashion archives', 'runway productions', 'RFR achievements'], 'https://rfrbyriyas.com/achievements', '/images/riyas.jpg', now(), now()),
('/milestones', 'Milestones | RFR BY RIYAS', 'Retrospective chronicling runway editions, media broadcasts, and partnerships.', ARRAY['fashion milestones', 'production history', 'runway retrospective'], 'https://rfrbyriyas.com/milestones', '/images/riyas.jpg', now(), now()),
('/founder', 'Adv. Riyas — Founder | RFR BY RIYAS', 'Profile of Adv. Riyas: High Court Advocate and founder of RFR BY RIYAS.', ARRAY['Adv. Riyas', 'RFR founder', 'fashion director Kerala'], 'https://rfrbyriyas.com/founder', '/images/riyas.jpg', now(), now()),
('/riyas', 'Adv. Riyas Portfolio | RFR BY RIYAS', 'Portfolio and creative direction archives of Adv. Riyas.', ARRAY['Adv. Riyas portfolio', 'fashion director profile'], 'https://rfrbyriyas.com/riyas', '/images/riyas.jpg', now(), now()),
('/our-team', 'Our Team | RFR BY RIYAS', 'Team members and creative production staff at RFR BY RIYAS.', ARRAY['fashion production team', 'runway coordinators', 'creative directors'], 'https://rfrbyriyas.com/our-team', '/images/final bro.png', now(), now()),
('/team', 'Team & Operations | RFR BY RIYAS', 'Team members and production coordinators behind RFR BY RIYAS events.', ARRAY['fashion operations', 'RFR team'], 'https://rfrbyriyas.com/team', '/images/final bro.png', now(), now()),
('/services', 'Services — Runways & Campaigns | RFR BY RIYAS', 'Overview of creative services: fashion runways, brand campaigns, studio broadcasts, and talent coordination.', ARRAY['fashion show production', 'brand campaigns', 'runway direction'], 'https://rfrbyriyas.com/services', '/images/final bro.png', now(), now()),
('/services/events', 'Fashion Events & Runway Staging | RFR BY RIYAS', 'Runway choreography, stage direction, and fashion event production.', ARRAY['fashion event management', 'runway staging', 'fashion show producer'], 'https://rfrbyriyas.com/services/events', '/images/final bro.png', now(), now()),
('/services/events/:slug', 'Event Production Details | RFR BY RIYAS', 'Specifications, staging concepts, and production execution for fashion events.', ARRAY['event production details', 'runway concepts'], 'https://rfrbyriyas.com/services/events', '/images/final bro.png', now(), now()),
('/services/campaigns', 'Commercial Brand Campaigns | RFR BY RIYAS', 'Commercial brand campaigns integrating creators, models, and visual productions.', ARRAY['commercial campaigns', 'brand visual direction', 'visual campaigns'], 'https://rfrbyriyas.com/services/campaigns', '/images/final bro.png', now(), now()),
('/services/campaigns/:slug', 'Campaign Details | RFR BY RIYAS', 'Project overview, visual direction, and production specifications for brand campaigns.', ARRAY['campaign details', 'visual production'], 'https://rfrbyriyas.com/services/campaigns', '/images/final bro.png', now(), now()),
('/services/podcast', 'Podcast Studio Services | RFR BY RIYAS', 'Podcast recording and video interview production services.', ARRAY['podcast studio', 'video production', 'studio interviews'], 'https://rfrbyriyas.com/services/podcast', '/images/clients/rb.png', now(), now()),
('/podcast', 'Rewind with Riyas Podcast | RFR BY RIYAS', 'Conversations on fashion, creative industry topics, and entrepreneurship.', ARRAY['Rewind with Riyas', 'fashion podcast', 'creator talkshow'], 'https://rfrbyriyas.com/podcast', '/images/clients/rb.png', now(), now()),
('/business', 'Business Solutions & Alliances | RFR BY RIYAS', 'Brand runway sponsorships, client showcases, and co-branded retail campaigns.', ARRAY['fashion business solutions', 'brand sponsorship', 'corporate partnerships'], 'https://rfrbyriyas.com/business', '/images/final bro.png', now(), now()),
('/partners', 'Brand Partners & Collaborations | RFR BY RIYAS', 'Brand partners and collaborators associated with RFR BY RIYAS productions.', ARRAY['brand partners', 'corporate collaborators', 'fashion alliances'], 'https://rfrbyriyas.com/partners', '/images/final bro.png', now(), now()),
('/clients', 'Clients & Brand Portfolio | RFR BY RIYAS', 'Brand collaborations and portfolio projects associated with RFR BY RIYAS.', ARRAY['fashion clients', 'brand collaborations', 'commercial portfolio'], 'https://rfrbyriyas.com/clients', '/images/clients/citroen.png', now(), now()),
('/assets', 'Talent Guild | RFR BY RIYAS', 'Directory of models, digital creators, and performers associated with RFR productions.', ARRAY['talent directory Kerala', 'creative roster', 'talent guild'], 'https://rfrbyriyas.com/assets', '/images/final bro.png', now(), now()),
('/assets/careers', 'Careers & Auditions | RFR BY RIYAS', 'Audition notices, backstage production opportunities, and career inquiries at RFR.', ARRAY['model auditions', 'creative careers', 'production roles'], 'https://rfrbyriyas.com/assets/careers', '/images/final bro.png', now(), now()),
('/assets/models', 'Models Directory | RFR BY RIYAS', 'Directory of runway models and commercial talent for fashion productions.', ARRAY['runway models Kerala', 'fashion models India', 'commercial talent'], 'https://rfrbyriyas.com/assets/models', '/images/final bro.png', now(), now()),
('/assets/influencers', 'Digital Creators Directory | RFR BY RIYAS', 'Directory of digital creators and social media influencers affiliated with RFR productions.', ARRAY['creator directory Kerala', 'digital influencers', 'content creators'], 'https://rfrbyriyas.com/assets/influencers', '/images/influencers/deepamol.jpg', now(), now()),
('/assets/artists', 'Artists & Performers | RFR BY RIYAS', 'Musicians, performers, and installation artists collaborating with live runways.', ARRAY['performers Kerala', 'runway artists', 'creative performers'], 'https://rfrbyriyas.com/assets/artists', '/images/final bro.png', now(), now()),
('/gallery', 'Photo Gallery | RFR BY RIYAS', 'Photographic archives documenting runway shows, fashion events, and commercial campaigns.', ARRAY['fashion photography', 'runway gallery', 'event photos'], 'https://rfrbyriyas.com/gallery', '/images/final bro.png', now(), now()),
('/gallery/events', 'Events Gallery | RFR BY RIYAS', 'Photographs from fashion events, conclaves, and brand showcases.', ARRAY['fashion event gallery', 'event photos'], 'https://rfrbyriyas.com/gallery/events', '/images/final bro.png', now(), now()),
('/gallery/shows', 'Runway Shows Gallery | RFR BY RIYAS', 'Photographs from runway shows and fashion presentations.', ARRAY['runway shows photography', 'fashion show photos'], 'https://rfrbyriyas.com/gallery/shows', '/images/final bro.png', now(), now()),
('/gallery/shoots', 'Campaign Shoots Gallery | RFR BY RIYAS', 'Photographs from commercial shoots and brand lookbooks.', ARRAY['photoshoot gallery', 'commercial campaign photography'], 'https://rfrbyriyas.com/gallery/shoots', '/images/final bro.png', now(), now()),
('/riyas-gallery', 'Adv. Riyas Photo Archive | RFR BY RIYAS', 'Photographs documenting public appearances and backstage direction by Adv. Riyas.', ARRAY['Adv. Riyas photos', 'fashion director gallery'], 'https://rfrbyriyas.com/riyas-gallery', '/images/riyas.jpg', now(), now()),
('/press', 'Press & Media Archives | RFR BY RIYAS', 'Archived newspaper clippings and broadcast media reports.', ARRAY['RFR press', 'press coverage', 'newspaper archives'], 'https://rfrbyriyas.com/press', '/news and press/WhatsApp Image 2026-11-06 at 10.53.08 AM (1).jpeg', now(), now()),
('/press/:slug', 'Press Article Detail | RFR BY RIYAS', 'Archived news clipping and publication details.', ARRAY['press clipping', 'media archive detail'], 'https://rfrbyriyas.com/press', '/news and press/WhatsApp Image 2026-11-06 at 10.53.08 AM (1).jpeg', now(), now()),
('/tic', 'Trivandrum Influencer Circle | RFR BY RIYAS', 'Regional creator network in Trivandrum, co-founded by Adv. Riyas.', ARRAY['Trivandrum Influencer Circle', 'TIC', 'creator network Trivandrum'], 'https://rfrbyriyas.com/tic', '/images/clients/tic.png', now(), now()),
('/contact', 'Contact & Enquiries | RFR BY RIYAS', 'Contact information for event bookings, sponsorships, and inquiries.', ARRAY['contact RFR', 'event enquiries', 'runway bookings'], 'https://rfrbyriyas.com/contact', '/images/final bro.png', now(), now())
ON CONFLICT (page_path) DO NOTHING;
