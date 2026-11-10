-- ==============================================================================
-- RFR BY RIYAS — ASSET STORAGE URL RECONCILIATION SCRIPT
-- Migration File: pending_url_reconciliation.sql (STRICT & VERIFIED)
-- 
-- STATUS: PENDING SEPARATE ADMIN APPROVAL (DO NOT EXECUTE UNTIL STORAGE UPLOAD IS COMPLETE)
-- 
-- CORE PRINCIPLES & SAFETY GUARANTEES:
--   1. Zero Overwrite of External URLs:
--      All queries strictly require: NOT LIKE 'http%' AND NOT LIKE '//%'.
--      External YouTube, Instagram, Google Drive, and web links are never touched.
--   2. Elimination of All Broad '/images/%' Storage Mappings:
--      Broad '/images/%' folder mappings have been completely removed. Every single
--      mapping is explicitly tied to a verified asset destination with exact 1-based start offsets:
--      - '/news and press/%'    (len 16) -> press/         (offset FROM 17) -> 'press/' || SUBSTRING(col FROM 17)
--      - '/images/clients/%'    (len 16) -> clients/       (offset FROM 17) -> 'clients/' || SUBSTRING(col FROM 17)
--      - '/logo/%'              (len  6) -> clients/       (offset FROM 7)  -> 'clients/' || SUBSTRING(col FROM 7)
--      - '/images/thumbnails/%' (len 19) -> portfolio/     (offset FROM 20) -> 'portfolio/' || SUBSTRING(col FROM 20)
--      - '/images/influencers/%'(len 20) -> influencers/   (offset FROM 21) -> 'influencers/' || SUBSTRING(col FROM 21)
--      - '/images/models/%'     (len 15) -> models/        (offset FROM 16) -> 'models/' || SUBSTRING(col FROM 16)
--      - '/images/gallery/%'    (len 16) -> gallery/       (offset FROM 17) -> 'gallery/' || SUBSTRING(col FROM 17)
--      - '/images/testimonials/%'(len 21)-> testimonials/  (offset FROM 22) -> 'testimonials/' || SUBSTRING(col FROM 22)
--      - '/videos/%'            (len  8) -> videos/        (offset FROM 9)  -> 'videos/' || SUBSTRING(col FROM 9)
--      - '/images/riyas.jpg'    -> branding/riyas.jpg
--      - '/images/final bro.png'-> branding/final bro.png
--      - '/images/pothys.png'   -> branding/pothys.png
--      - '/favicon.ico' or '/favicon.png' -> branding/favicon.png
--      Any path not matching these verified asset rules is safely skipped.
--      Zero double slashes ('//') or trailing slash filename omissions are produced.
--   3. Complete Founder Record Preservation (about_riyas):
--      In accordance with strict preservation requirements, about_riyas (portrait_image,
--      signature_image) is 100% EXCLUDED from this reconciliation script and the seed
--      migration (zero INSERT, zero UPDATE, zero DELETE). Existing founder data remains intact.
--   4. Thumbnail Safety (media_videos):
--      Thumbnails are images and are strictly mapped to verified image folders (portfolio/,
--      clients/, influencers/, branding/), NEVER to videos/.
--   5. External Video Embed Removal:
--      External video embed URLs (video_embed_url) are external player links,
--      NOT stored files, and are intentionally excluded from media storage reconciliation.
--   6. Strict Storage-Guarded Updates:
--      No database URL is updated unless the exact target object is verified to
--      exist in storage.objects ('rfr-media' bucket).
--   7. Array Guards (TEXT[]):
--      Array fields (projects_portfolio.gallery_images, talent_models.portfolio_images,
--      tic_events.gallery_images) are updated with WITH ORDINALITY, preserving original element
--      ordering and preserving all external or unchanged elements.
--   8. 100% Audit-to-Update Parity:
--      Every field audited in PART 1 has an exact matching UPDATE in PART 2,
--      and vice versa (30 distinct media fields across 17 tables).
--   9. Atomic Transaction Safety:
--      PART 2 is wrapped in BEGIN ... COMMIT to prevent partial or corrupted state.
-- ==============================================================================

-- ==============================================================================
-- PART 1: READ-ONLY AUDIT & PROPOSED URL PREVIEW (ZERO MUTATIONS)
-- Run this block first in Supabase SQL Editor. It inspects current database
-- references, computes proposed storage CDN URLs, and verifies whether the
-- matching objects already exist in the 'rfr-media' storage bucket.
-- ==============================================================================

-- Target: Verified Supabase Project ID: hlyxzhafdjyflwcdecmp (from .env.local)
-- Public Storage Endpoint: https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media
DO $$
BEGIN
    IF 'hlyxzhafdjyflwcdecmp' = '' OR length('hlyxzhafdjyflwcdecmp') <> 20 THEN
        RAISE EXCEPTION 'SAFETY STOP: Target project reference is invalid or blank.';
    END IF;
END $$;

WITH audited_references AS (
    -- 1. website_settings (official_logo_url, loading_screen_logo_url, footer_logo_url, favicon_url)
    SELECT 
        'website_settings' AS table_name,
        'official_logo_url' AS field_name,
        ws.official_logo_url AS original_path,
        'https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media/' || (
            CASE 
                WHEN ws.official_logo_url = '/images/final bro.png' THEN 'branding/final bro.png'
                WHEN ws.official_logo_url = '/images/riyas.jpg' THEN 'branding/riyas.jpg'
            END
        ) AS proposed_destination_url,
        CASE 
            WHEN ws.official_logo_url = '/images/final bro.png' THEN 'branding/final bro.png'
            WHEN ws.official_logo_url = '/images/riyas.jpg' THEN 'branding/riyas.jpg'
        END AS storage_object_name,
        EXISTS (
            SELECT 1 FROM storage.objects so 
            WHERE so.bucket_id = 'rfr-media' AND so.name = (
                CASE 
                    WHEN ws.official_logo_url = '/images/final bro.png' THEN 'branding/final bro.png'
                    WHEN ws.official_logo_url = '/images/riyas.jpg' THEN 'branding/riyas.jpg'
                END
            )
        ) AS is_uploaded_in_storage
    FROM public.website_settings ws
    WHERE ws.official_logo_url IN ('/images/final bro.png', '/images/riyas.jpg')

    UNION ALL

    SELECT 
        'website_settings' AS table_name,
        'loading_screen_logo_url' AS field_name,
        ws.loading_screen_logo_url AS original_path,
        'https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media/' || (
            CASE 
                WHEN ws.loading_screen_logo_url = '/images/final bro.png' THEN 'branding/final bro.png'
                WHEN ws.loading_screen_logo_url = '/images/riyas.jpg' THEN 'branding/riyas.jpg'
            END
        ) AS proposed_destination_url,
        CASE 
            WHEN ws.loading_screen_logo_url = '/images/final bro.png' THEN 'branding/final bro.png'
            WHEN ws.loading_screen_logo_url = '/images/riyas.jpg' THEN 'branding/riyas.jpg'
        END AS storage_object_name,
        EXISTS (
            SELECT 1 FROM storage.objects so 
            WHERE so.bucket_id = 'rfr-media' AND so.name = (
                CASE 
                    WHEN ws.loading_screen_logo_url = '/images/final bro.png' THEN 'branding/final bro.png'
                    WHEN ws.loading_screen_logo_url = '/images/riyas.jpg' THEN 'branding/riyas.jpg'
                END
            )
        ) AS is_uploaded_in_storage
    FROM public.website_settings ws
    WHERE ws.loading_screen_logo_url IN ('/images/final bro.png', '/images/riyas.jpg')

    UNION ALL

    SELECT 
        'website_settings' AS table_name,
        'footer_logo_url' AS field_name,
        ws.footer_logo_url AS original_path,
        'https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media/' || (
            CASE 
                WHEN ws.footer_logo_url = '/images/final bro.png' THEN 'branding/final bro.png'
                WHEN ws.footer_logo_url = '/images/riyas.jpg' THEN 'branding/riyas.jpg'
            END
        ) AS proposed_destination_url,
        CASE 
            WHEN ws.footer_logo_url = '/images/final bro.png' THEN 'branding/final bro.png'
            WHEN ws.footer_logo_url = '/images/riyas.jpg' THEN 'branding/riyas.jpg'
        END AS storage_object_name,
        EXISTS (
            SELECT 1 FROM storage.objects so 
            WHERE so.bucket_id = 'rfr-media' AND so.name = (
                CASE 
                    WHEN ws.footer_logo_url = '/images/final bro.png' THEN 'branding/final bro.png'
                    WHEN ws.footer_logo_url = '/images/riyas.jpg' THEN 'branding/riyas.jpg'
                END
            )
        ) AS is_uploaded_in_storage
    FROM public.website_settings ws
    WHERE ws.footer_logo_url IN ('/images/final bro.png', '/images/riyas.jpg')

    UNION ALL

    SELECT 
        'website_settings' AS table_name,
        'favicon_url' AS field_name,
        ws.favicon_url AS original_path,
        'https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media/branding/favicon.png' AS proposed_destination_url,
        'branding/favicon.png' AS storage_object_name,
        EXISTS (SELECT 1 FROM storage.objects so WHERE so.bucket_id = 'rfr-media' AND so.name = 'branding/favicon.png') AS is_uploaded_in_storage
    FROM public.website_settings ws
    WHERE ws.favicon_url IN ('/favicon.ico', '/favicon.png')

    UNION ALL

    -- 2. hero_banners (image_url, video_url)
    SELECT 
        'hero_banners' AS table_name,
        'image_url' AS field_name,
        hb.image_url AS original_path,
        'https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media/' || (
            CASE 
                WHEN hb.image_url = '/images/final bro.png' THEN 'branding/final bro.png'
                WHEN hb.image_url = '/images/riyas.jpg' THEN 'branding/riyas.jpg'
            END
        ) AS proposed_destination_url,
        CASE 
            WHEN hb.image_url = '/images/final bro.png' THEN 'branding/final bro.png'
            WHEN hb.image_url = '/images/riyas.jpg' THEN 'branding/riyas.jpg'
        END AS storage_object_name,
        EXISTS (
            SELECT 1 FROM storage.objects so 
            WHERE so.bucket_id = 'rfr-media' AND so.name = (
                CASE 
                    WHEN hb.image_url = '/images/final bro.png' THEN 'branding/final bro.png'
                    WHEN hb.image_url = '/images/riyas.jpg' THEN 'branding/riyas.jpg'
                END
            )
        ) AS is_uploaded_in_storage
    FROM public.hero_banners hb
    WHERE hb.image_url IN ('/images/final bro.png', '/images/riyas.jpg')

    UNION ALL

    SELECT 
        'hero_banners' AS table_name,
        'video_url' AS field_name,
        hb.video_url AS original_path,
        'https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media/videos/' || SUBSTRING(hb.video_url FROM 9) AS proposed_destination_url,
        'videos/' || SUBSTRING(hb.video_url FROM 9) AS storage_object_name,
        EXISTS (SELECT 1 FROM storage.objects so WHERE so.bucket_id = 'rfr-media' AND so.name = 'videos/' || SUBSTRING(hb.video_url FROM 9)) AS is_uploaded_in_storage
    FROM public.hero_banners hb
    WHERE hb.video_url LIKE '/videos/%' AND hb.video_url NOT LIKE 'http%' AND hb.video_url NOT LIKE '//%'

    UNION ALL

    -- 3. press_articles (cover_image)
    SELECT 
        'press_articles' AS table_name,
        'cover_image' AS field_name,
        pa.cover_image AS original_path,
        'https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media/press/' || SUBSTRING(pa.cover_image FROM 17) AS proposed_destination_url,
        'press/' || SUBSTRING(pa.cover_image FROM 17) AS storage_object_name,
        EXISTS (
            SELECT 1 FROM storage.objects so 
            WHERE so.bucket_id = 'rfr-media' AND so.name = 'press/' || SUBSTRING(pa.cover_image FROM 17)
        ) AS is_uploaded_in_storage
    FROM public.press_articles pa
    WHERE pa.cover_image LIKE '/news and press/%' AND pa.cover_image NOT LIKE 'http%' AND pa.cover_image NOT LIKE '//%'

    UNION ALL

    -- 4. projects_portfolio (cover_image, video_url, gallery_images)
    SELECT 
        'projects_portfolio' AS table_name,
        'cover_image' AS field_name,
        pp.cover_image AS original_path,
        'https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media/' || (
            CASE 
                WHEN pp.cover_image LIKE '/images/clients/%' THEN 'clients/' || SUBSTRING(pp.cover_image FROM 17)
                WHEN pp.cover_image LIKE '/images/thumbnails/%' THEN 'portfolio/' || SUBSTRING(pp.cover_image FROM 20)
                WHEN pp.cover_image = '/images/pothys.png' THEN 'branding/pothys.png'
                WHEN pp.cover_image = '/images/riyas.jpg' THEN 'branding/riyas.jpg'
                WHEN pp.cover_image = '/images/final bro.png' THEN 'branding/final bro.png'
            END
        ) AS proposed_destination_url,
        CASE 
            WHEN pp.cover_image LIKE '/images/clients/%' THEN 'clients/' || SUBSTRING(pp.cover_image FROM 17)
            WHEN pp.cover_image LIKE '/images/thumbnails/%' THEN 'portfolio/' || SUBSTRING(pp.cover_image FROM 20)
            WHEN pp.cover_image = '/images/pothys.png' THEN 'branding/pothys.png'
            WHEN pp.cover_image = '/images/riyas.jpg' THEN 'branding/riyas.jpg'
            WHEN pp.cover_image = '/images/final bro.png' THEN 'branding/final bro.png'
        END AS storage_object_name,
        EXISTS (
            SELECT 1 FROM storage.objects so 
            WHERE so.bucket_id = 'rfr-media' AND so.name = (
                CASE 
                    WHEN pp.cover_image LIKE '/images/clients/%' THEN 'clients/' || SUBSTRING(pp.cover_image FROM 17)
                    WHEN pp.cover_image LIKE '/images/thumbnails/%' THEN 'portfolio/' || SUBSTRING(pp.cover_image FROM 20)
                    WHEN pp.cover_image = '/images/pothys.png' THEN 'branding/pothys.png'
                    WHEN pp.cover_image = '/images/riyas.jpg' THEN 'branding/riyas.jpg'
                    WHEN pp.cover_image = '/images/final bro.png' THEN 'branding/final bro.png'
                END
            )
        ) AS is_uploaded_in_storage
    FROM public.projects_portfolio pp
    WHERE pp.cover_image NOT LIKE 'http%' AND pp.cover_image NOT LIKE '//%'
      AND (
        pp.cover_image LIKE '/images/clients/%' OR
        pp.cover_image LIKE '/images/thumbnails/%' OR
        pp.cover_image IN ('/images/pothys.png', '/images/riyas.jpg', '/images/final bro.png')
      )

    UNION ALL

    SELECT 
        'projects_portfolio' AS table_name,
        'video_url' AS field_name,
        pp.video_url AS original_path,
        'https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media/videos/' || SUBSTRING(pp.video_url FROM 9) AS proposed_destination_url,
        'videos/' || SUBSTRING(pp.video_url FROM 9) AS storage_object_name,
        EXISTS (
            SELECT 1 FROM storage.objects so 
            WHERE so.bucket_id = 'rfr-media' AND so.name = 'videos/' || SUBSTRING(pp.video_url FROM 9)
        ) AS is_uploaded_in_storage
    FROM public.projects_portfolio pp
    WHERE pp.video_url LIKE '/videos/%' AND pp.video_url NOT LIKE 'http%' AND pp.video_url NOT LIKE '//%'

    UNION ALL

    SELECT 
        'projects_portfolio' AS table_name,
        'gallery_images (item)' AS field_name,
        elem AS original_path,
        'https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media/' || (
            CASE 
                WHEN elem LIKE '/images/clients/%' THEN 'clients/' || SUBSTRING(elem FROM 17)
                WHEN elem LIKE '/images/thumbnails/%' THEN 'portfolio/' || SUBSTRING(elem FROM 20)
                WHEN elem = '/images/pothys.png' THEN 'branding/pothys.png'
                WHEN elem = '/images/riyas.jpg' THEN 'branding/riyas.jpg'
                WHEN elem = '/images/final bro.png' THEN 'branding/final bro.png'
            END
        ) AS proposed_destination_url,
        CASE 
            WHEN elem LIKE '/images/clients/%' THEN 'clients/' || SUBSTRING(elem FROM 17)
            WHEN elem LIKE '/images/thumbnails/%' THEN 'portfolio/' || SUBSTRING(elem FROM 20)
            WHEN elem = '/images/pothys.png' THEN 'branding/pothys.png'
            WHEN elem = '/images/riyas.jpg' THEN 'branding/riyas.jpg'
            WHEN elem = '/images/final bro.png' THEN 'branding/final bro.png'
        END AS storage_object_name,
        EXISTS (
            SELECT 1 FROM storage.objects so 
            WHERE so.bucket_id = 'rfr-media' AND so.name = (
                CASE 
                    WHEN elem LIKE '/images/clients/%' THEN 'clients/' || SUBSTRING(elem FROM 17)
                    WHEN elem LIKE '/images/thumbnails/%' THEN 'portfolio/' || SUBSTRING(elem FROM 20)
                    WHEN elem = '/images/pothys.png' THEN 'branding/pothys.png'
                    WHEN elem = '/images/riyas.jpg' THEN 'branding/riyas.jpg'
                    WHEN elem = '/images/final bro.png' THEN 'branding/final bro.png'
                END
            )
        ) AS is_uploaded_in_storage
    FROM public.projects_portfolio pp,
    LATERAL unnest(pp.gallery_images) AS elem
    WHERE elem NOT LIKE 'http%' AND elem NOT LIKE '//%'
      AND (
        elem LIKE '/images/clients/%' OR
        elem LIKE '/images/thumbnails/%' OR
        elem IN ('/images/pothys.png', '/images/riyas.jpg', '/images/final bro.png')
      )

    UNION ALL

    -- 5. talent_influencers (profile_image)
    SELECT 
        'talent_influencers' AS table_name,
        'profile_image' AS field_name,
        ti.profile_image AS original_path,
        'https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media/influencers/' || SUBSTRING(ti.profile_image FROM 21) AS proposed_destination_url,
        'influencers/' || SUBSTRING(ti.profile_image FROM 21) AS storage_object_name,
        EXISTS (
            SELECT 1 FROM storage.objects so 
            WHERE so.bucket_id = 'rfr-media' AND so.name = 'influencers/' || SUBSTRING(ti.profile_image FROM 21)
        ) AS is_uploaded_in_storage
    FROM public.talent_influencers ti
    WHERE ti.profile_image LIKE '/images/influencers/%' AND ti.profile_image NOT LIKE 'http%' AND ti.profile_image NOT LIKE '//%'

    UNION ALL

    -- 6. talent_models (headshot_image, portfolio_images)
    SELECT 
        'talent_models' AS table_name,
        'headshot_image' AS field_name,
        tm.headshot_image AS original_path,
        'https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media/models/' || SUBSTRING(tm.headshot_image FROM 16) AS proposed_destination_url,
        'models/' || SUBSTRING(tm.headshot_image FROM 16) AS storage_object_name,
        EXISTS (
            SELECT 1 FROM storage.objects so 
            WHERE so.bucket_id = 'rfr-media' AND so.name = 'models/' || SUBSTRING(tm.headshot_image FROM 16)
        ) AS is_uploaded_in_storage
    FROM public.talent_models tm
    WHERE tm.headshot_image LIKE '/images/models/%' AND tm.headshot_image NOT LIKE 'http%' AND tm.headshot_image NOT LIKE '//%'

    UNION ALL

    SELECT 
        'talent_models' AS table_name,
        'portfolio_images (item)' AS field_name,
        elem AS original_path,
        'https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media/models/' || SUBSTRING(elem FROM 16) AS proposed_destination_url,
        'models/' || SUBSTRING(elem FROM 16) AS storage_object_name,
        EXISTS (
            SELECT 1 FROM storage.objects so 
            WHERE so.bucket_id = 'rfr-media' AND so.name = 'models/' || SUBSTRING(elem FROM 16)
        ) AS is_uploaded_in_storage
    FROM public.talent_models tm,
    LATERAL unnest(tm.portfolio_images) AS elem
    WHERE elem LIKE '/images/models/%' AND elem NOT LIKE 'http%' AND elem NOT LIKE '//%'

    UNION ALL

    -- 7. tic_content (hero_image, video_reel_url)
    SELECT 
        'tic_content' AS table_name,
        'hero_image' AS field_name,
        tc.hero_image AS original_path,
        'https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media/clients/' || SUBSTRING(tc.hero_image FROM 17) AS proposed_destination_url,
        'clients/' || SUBSTRING(tc.hero_image FROM 17) AS storage_object_name,
        EXISTS (
            SELECT 1 FROM storage.objects so 
            WHERE so.bucket_id = 'rfr-media' AND so.name = 'clients/' || SUBSTRING(tc.hero_image FROM 17)
        ) AS is_uploaded_in_storage
    FROM public.tic_content tc
    WHERE tc.hero_image LIKE '/images/clients/%' AND tc.hero_image NOT LIKE 'http%' AND tc.hero_image NOT LIKE '//%'

    UNION ALL

    SELECT 
        'tic_content' AS table_name,
        'video_reel_url' AS field_name,
        tc.video_reel_url AS original_path,
        'https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media/videos/' || SUBSTRING(tc.video_reel_url FROM 9) AS proposed_destination_url,
        'videos/' || SUBSTRING(tc.video_reel_url FROM 9) AS storage_object_name,
        EXISTS (
            SELECT 1 FROM storage.objects so 
            WHERE so.bucket_id = 'rfr-media' AND so.name = 'videos/' || SUBSTRING(tc.video_reel_url FROM 9)
        ) AS is_uploaded_in_storage
    FROM public.tic_content tc
    WHERE tc.video_reel_url LIKE '/videos/%' AND tc.video_reel_url NOT LIKE 'http%' AND tc.video_reel_url NOT LIKE '//%'

    UNION ALL

    -- 8. tic_events (cover_image, video_url, gallery_images)
    SELECT 
        'tic_events' AS table_name,
        'cover_image' AS field_name,
        te.cover_image AS original_path,
        'https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media/clients/' || SUBSTRING(te.cover_image FROM 17) AS proposed_destination_url,
        'clients/' || SUBSTRING(te.cover_image FROM 17) AS storage_object_name,
        EXISTS (
            SELECT 1 FROM storage.objects so 
            WHERE so.bucket_id = 'rfr-media' AND so.name = 'clients/' || SUBSTRING(te.cover_image FROM 17)
        ) AS is_uploaded_in_storage
    FROM public.tic_events te
    WHERE te.cover_image LIKE '/images/clients/%' AND te.cover_image NOT LIKE 'http%' AND te.cover_image NOT LIKE '//%'

    UNION ALL

    SELECT 
        'tic_events' AS table_name,
        'video_url' AS field_name,
        te.video_url AS original_path,
        'https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media/videos/' || SUBSTRING(te.video_url FROM 9) AS proposed_destination_url,
        'videos/' || SUBSTRING(te.video_url FROM 9) AS storage_object_name,
        EXISTS (
            SELECT 1 FROM storage.objects so 
            WHERE so.bucket_id = 'rfr-media' AND so.name = 'videos/' || SUBSTRING(te.video_url FROM 9)
        ) AS is_uploaded_in_storage
    FROM public.tic_events te
    WHERE te.video_url LIKE '/videos/%' AND te.video_url NOT LIKE 'http%' AND te.video_url NOT LIKE '//%'

    UNION ALL

    SELECT 
        'tic_events' AS table_name,
        'gallery_images (item)' AS field_name,
        elem AS original_path,
        'https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media/clients/' || SUBSTRING(elem FROM 17) AS proposed_destination_url,
        'clients/' || SUBSTRING(elem FROM 17) AS storage_object_name,
        EXISTS (
            SELECT 1 FROM storage.objects so 
            WHERE so.bucket_id = 'rfr-media' AND so.name = 'clients/' || SUBSTRING(elem FROM 17)
        ) AS is_uploaded_in_storage
    FROM public.tic_events te,
    LATERAL unnest(te.gallery_images) AS elem
    WHERE elem LIKE '/images/clients/%' AND elem NOT LIKE 'http%' AND elem NOT LIKE '//%'

    UNION ALL

    -- 9. team_members (image)
    SELECT 
        'team_members' AS table_name,
        'image' AS field_name,
        tm.image AS original_path,
        'https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media/' || (
            CASE 
                WHEN tm.image = '/images/riyas.jpg' THEN 'branding/riyas.jpg'
                WHEN tm.image = '/images/final bro.png' THEN 'branding/final bro.png'
            END
        ) AS proposed_destination_url,
        CASE 
            WHEN tm.image = '/images/riyas.jpg' THEN 'branding/riyas.jpg'
            WHEN tm.image = '/images/final bro.png' THEN 'branding/final bro.png'
        END AS storage_object_name,
        EXISTS (
            SELECT 1 FROM storage.objects so 
            WHERE so.bucket_id = 'rfr-media' AND so.name = (
                CASE 
                    WHEN tm.image = '/images/riyas.jpg' THEN 'branding/riyas.jpg'
                    WHEN tm.image = '/images/final bro.png' THEN 'branding/final bro.png'
                END
            )
        ) AS is_uploaded_in_storage
    FROM public.team_members tm
    WHERE tm.image IN ('/images/riyas.jpg', '/images/final bro.png')

    UNION ALL

    -- 10. partners_clients (logo)
    SELECT 
        'partners_clients' AS table_name,
        'logo' AS field_name,
        pc.logo AS original_path,
        'https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media/' || (
            CASE 
                WHEN pc.logo LIKE '/images/clients/%' THEN 'clients/' || SUBSTRING(pc.logo FROM 17)
                WHEN pc.logo LIKE '/logo/%' THEN 'clients/' || SUBSTRING(pc.logo FROM 7)
                WHEN pc.logo = '/images/pothys.png' THEN 'branding/pothys.png'
                WHEN pc.logo = '/images/riyas.jpg' THEN 'branding/riyas.jpg'
                WHEN pc.logo = '/images/final bro.png' THEN 'branding/final bro.png'
            END
        ) AS proposed_destination_url,
        CASE 
            WHEN pc.logo LIKE '/images/clients/%' THEN 'clients/' || SUBSTRING(pc.logo FROM 17)
            WHEN pc.logo LIKE '/logo/%' THEN 'clients/' || SUBSTRING(pc.logo FROM 7)
            WHEN pc.logo = '/images/pothys.png' THEN 'branding/pothys.png'
            WHEN pc.logo = '/images/riyas.jpg' THEN 'branding/riyas.jpg'
            WHEN pc.logo = '/images/final bro.png' THEN 'branding/final bro.png'
        END AS storage_object_name,
        EXISTS (
            SELECT 1 FROM storage.objects so 
            WHERE so.bucket_id = 'rfr-media' AND so.name = (
                CASE 
                    WHEN pc.logo LIKE '/images/clients/%' THEN 'clients/' || SUBSTRING(pc.logo FROM 17)
                    WHEN pc.logo LIKE '/logo/%' THEN 'clients/' || SUBSTRING(pc.logo FROM 7)
                    WHEN pc.logo = '/images/pothys.png' THEN 'branding/pothys.png'
                    WHEN pc.logo = '/images/riyas.jpg' THEN 'branding/riyas.jpg'
                    WHEN pc.logo = '/images/final bro.png' THEN 'branding/final bro.png'
                END
            )
        ) AS is_uploaded_in_storage
    FROM public.partners_clients pc
    WHERE pc.logo NOT LIKE 'http%' AND pc.logo NOT LIKE '//%'
      AND (
        pc.logo LIKE '/images/clients/%' OR
        pc.logo LIKE '/logo/%' OR
        pc.logo IN ('/images/pothys.png', '/images/riyas.jpg', '/images/final bro.png')
      )

    UNION ALL

    -- 11. timeline_events (image, video_url)
    SELECT 
        'timeline_events' AS table_name,
        'image' AS field_name,
        te.image AS original_path,
        'https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media/' || (
            CASE 
                WHEN te.image LIKE '/images/thumbnails/%' THEN 'portfolio/' || SUBSTRING(te.image FROM 20)
                WHEN te.image LIKE '/images/clients/%' THEN 'clients/' || SUBSTRING(te.image FROM 17)
                WHEN te.image = '/images/pothys.png' THEN 'branding/pothys.png'
                WHEN te.image = '/images/riyas.jpg' THEN 'branding/riyas.jpg'
                WHEN te.image = '/images/final bro.png' THEN 'branding/final bro.png'
            END
        ) AS proposed_destination_url,
        CASE 
            WHEN te.image LIKE '/images/thumbnails/%' THEN 'portfolio/' || SUBSTRING(te.image FROM 20)
            WHEN te.image LIKE '/images/clients/%' THEN 'clients/' || SUBSTRING(te.image FROM 17)
            WHEN te.image = '/images/pothys.png' THEN 'branding/pothys.png'
            WHEN te.image = '/images/riyas.jpg' THEN 'branding/riyas.jpg'
            WHEN te.image = '/images/final bro.png' THEN 'branding/final bro.png'
        END AS storage_object_name,
        EXISTS (
            SELECT 1 FROM storage.objects so 
            WHERE so.bucket_id = 'rfr-media' AND so.name = (
                CASE 
                    WHEN te.image LIKE '/images/thumbnails/%' THEN 'portfolio/' || SUBSTRING(te.image FROM 20)
                    WHEN te.image LIKE '/images/clients/%' THEN 'clients/' || SUBSTRING(te.image FROM 17)
                    WHEN te.image = '/images/pothys.png' THEN 'branding/pothys.png'
                    WHEN te.image = '/images/riyas.jpg' THEN 'branding/riyas.jpg'
                    WHEN te.image = '/images/final bro.png' THEN 'branding/final bro.png'
                END
            )
        ) AS is_uploaded_in_storage
    FROM public.timeline_events te
    WHERE te.image NOT LIKE 'http%' AND te.image NOT LIKE '//%'
      AND (
        te.image LIKE '/images/thumbnails/%' OR
        te.image LIKE '/images/clients/%' OR
        te.image IN ('/images/pothys.png', '/images/riyas.jpg', '/images/final bro.png')
      )

    UNION ALL

    SELECT 
        'timeline_events' AS table_name,
        'video_url' AS field_name,
        te.video_url AS original_path,
        'https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media/videos/' || SUBSTRING(te.video_url FROM 9) AS proposed_destination_url,
        'videos/' || SUBSTRING(te.video_url FROM 9) AS storage_object_name,
        EXISTS (
            SELECT 1 FROM storage.objects so 
            WHERE so.bucket_id = 'rfr-media' AND so.name = 'videos/' || SUBSTRING(te.video_url FROM 9)
        ) AS is_uploaded_in_storage
    FROM public.timeline_events te
    WHERE te.video_url LIKE '/videos/%' AND te.video_url NOT LIKE 'http%' AND te.video_url NOT LIKE '//%'

    UNION ALL

    -- 12. timeline_years (image, video_url)
    SELECT 
        'timeline_years' AS table_name,
        'image' AS field_name,
        ty.image AS original_path,
        'https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media/' || (
            CASE 
                WHEN ty.image LIKE '/images/thumbnails/%' THEN 'portfolio/' || SUBSTRING(ty.image FROM 20)
                WHEN ty.image LIKE '/images/clients/%' THEN 'clients/' || SUBSTRING(ty.image FROM 17)
                WHEN ty.image = '/images/riyas.jpg' THEN 'branding/riyas.jpg'
                WHEN ty.image = '/images/final bro.png' THEN 'branding/final bro.png'
            END
        ) AS proposed_destination_url,
        CASE 
            WHEN ty.image LIKE '/images/thumbnails/%' THEN 'portfolio/' || SUBSTRING(ty.image FROM 20)
            WHEN ty.image LIKE '/images/clients/%' THEN 'clients/' || SUBSTRING(ty.image FROM 17)
            WHEN ty.image = '/images/riyas.jpg' THEN 'branding/riyas.jpg'
            WHEN ty.image = '/images/final bro.png' THEN 'branding/final bro.png'
        END AS storage_object_name,
        EXISTS (
            SELECT 1 FROM storage.objects so 
            WHERE so.bucket_id = 'rfr-media' AND so.name = (
                CASE 
                    WHEN ty.image LIKE '/images/thumbnails/%' THEN 'portfolio/' || SUBSTRING(ty.image FROM 20)
                    WHEN ty.image LIKE '/images/clients/%' THEN 'clients/' || SUBSTRING(ty.image FROM 17)
                    WHEN ty.image = '/images/riyas.jpg' THEN 'branding/riyas.jpg'
                    WHEN ty.image = '/images/final bro.png' THEN 'branding/final bro.png'
                END
            )
        ) AS is_uploaded_in_storage
    FROM public.timeline_years ty
    WHERE ty.image NOT LIKE 'http%' AND ty.image NOT LIKE '//%'
      AND (
        ty.image LIKE '/images/thumbnails/%' OR
        ty.image LIKE '/images/clients/%' OR
        ty.image IN ('/images/riyas.jpg', '/images/final bro.png')
      )

    UNION ALL

    SELECT 
        'timeline_years' AS table_name,
        'video_url' AS field_name,
        ty.video_url AS original_path,
        'https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media/videos/' || SUBSTRING(ty.video_url FROM 9) AS proposed_destination_url,
        'videos/' || SUBSTRING(ty.video_url FROM 9) AS storage_object_name,
        EXISTS (
            SELECT 1 FROM storage.objects so 
            WHERE so.bucket_id = 'rfr-media' AND so.name = 'videos/' || SUBSTRING(ty.video_url FROM 9)
        ) AS is_uploaded_in_storage
    FROM public.timeline_years ty
    WHERE ty.video_url LIKE '/videos/%' AND ty.video_url NOT LIKE 'http%' AND ty.video_url NOT LIKE '//%'

    UNION ALL

    -- 13. media_videos (thumbnail_url, video_url)
    -- Thumbnails are images: mapped to verified image folders, NEVER to videos/
    SELECT 
        'media_videos' AS table_name,
        'thumbnail_url' AS field_name,
        mv.thumbnail_url AS original_path,
        'https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media/' || (
            CASE 
                WHEN mv.thumbnail_url LIKE '/images/thumbnails/%' THEN 'portfolio/' || SUBSTRING(mv.thumbnail_url FROM 20)
                WHEN mv.thumbnail_url LIKE '/images/clients/%' THEN 'clients/' || SUBSTRING(mv.thumbnail_url FROM 17)
                WHEN mv.thumbnail_url LIKE '/images/influencers/%' THEN 'influencers/' || SUBSTRING(mv.thumbnail_url FROM 21)
                WHEN mv.thumbnail_url = '/images/pothys.png' THEN 'branding/pothys.png'
                WHEN mv.thumbnail_url = '/images/riyas.jpg' THEN 'branding/riyas.jpg'
                WHEN mv.thumbnail_url = '/images/final bro.png' THEN 'branding/final bro.png'
            END
        ) AS proposed_destination_url,
        CASE 
            WHEN mv.thumbnail_url LIKE '/images/thumbnails/%' THEN 'portfolio/' || SUBSTRING(mv.thumbnail_url FROM 20)
            WHEN mv.thumbnail_url LIKE '/images/clients/%' THEN 'clients/' || SUBSTRING(mv.thumbnail_url FROM 17)
            WHEN mv.thumbnail_url LIKE '/images/influencers/%' THEN 'influencers/' || SUBSTRING(mv.thumbnail_url FROM 21)
            WHEN mv.thumbnail_url = '/images/pothys.png' THEN 'branding/pothys.png'
            WHEN mv.thumbnail_url = '/images/riyas.jpg' THEN 'branding/riyas.jpg'
            WHEN mv.thumbnail_url = '/images/final bro.png' THEN 'branding/final bro.png'
        END AS storage_object_name,
        EXISTS (
            SELECT 1 FROM storage.objects so 
            WHERE so.bucket_id = 'rfr-media' AND so.name = (
                CASE 
                    WHEN mv.thumbnail_url LIKE '/images/thumbnails/%' THEN 'portfolio/' || SUBSTRING(mv.thumbnail_url FROM 20)
                    WHEN mv.thumbnail_url LIKE '/images/clients/%' THEN 'clients/' || SUBSTRING(mv.thumbnail_url FROM 17)
                    WHEN mv.thumbnail_url LIKE '/images/influencers/%' THEN 'influencers/' || SUBSTRING(mv.thumbnail_url FROM 21)
                    WHEN mv.thumbnail_url = '/images/pothys.png' THEN 'branding/pothys.png'
                    WHEN mv.thumbnail_url = '/images/riyas.jpg' THEN 'branding/riyas.jpg'
                    WHEN mv.thumbnail_url = '/images/final bro.png' THEN 'branding/final bro.png'
                END
            )
        ) AS is_uploaded_in_storage
    FROM public.media_videos mv
    WHERE mv.thumbnail_url NOT LIKE 'http%' AND mv.thumbnail_url NOT LIKE '//%'
      AND (
        mv.thumbnail_url LIKE '/images/thumbnails/%' OR
        mv.thumbnail_url LIKE '/images/clients/%' OR
        mv.thumbnail_url LIKE '/images/influencers/%' OR
        mv.thumbnail_url IN ('/images/pothys.png', '/images/riyas.jpg', '/images/final bro.png')
      )

    UNION ALL

    SELECT 
        'media_videos' AS table_name,
        'video_url' AS field_name,
        mv.video_url AS original_path,
        'https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media/videos/' || SUBSTRING(mv.video_url FROM 9) AS proposed_destination_url,
        'videos/' || SUBSTRING(mv.video_url FROM 9) AS storage_object_name,
        EXISTS (
            SELECT 1 FROM storage.objects so 
            WHERE so.bucket_id = 'rfr-media' AND so.name = 'videos/' || SUBSTRING(mv.video_url FROM 9)
        ) AS is_uploaded_in_storage
    FROM public.media_videos mv
    WHERE mv.video_url LIKE '/videos/%' AND mv.video_url NOT LIKE 'http%' AND mv.video_url NOT LIKE '//%'

    UNION ALL

    -- 14. gallery_items (image) -> gallery/
    SELECT 
        'gallery_items' AS table_name,
        'image' AS field_name,
        gi.image AS original_path,
        'https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media/gallery/' || SUBSTRING(gi.image FROM 17) AS proposed_destination_url,
        'gallery/' || SUBSTRING(gi.image FROM 17) AS storage_object_name,
        EXISTS (
            SELECT 1 FROM storage.objects so 
            WHERE so.bucket_id = 'rfr-media' AND so.name = 'gallery/' || SUBSTRING(gi.image FROM 17)
        ) AS is_uploaded_in_storage
    FROM public.gallery_items gi
    WHERE gi.image LIKE '/images/gallery/%' AND gi.image NOT LIKE 'http%' AND gi.image NOT LIKE '//%'

    UNION ALL

    -- 15. riyas_gallery_items (image) -> gallery/
    SELECT 
        'riyas_gallery_items' AS table_name,
        'image' AS field_name,
        rgi.image AS original_path,
        'https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media/gallery/' || SUBSTRING(rgi.image FROM 17) AS proposed_destination_url,
        'gallery/' || SUBSTRING(rgi.image FROM 17) AS storage_object_name,
        EXISTS (
            SELECT 1 FROM storage.objects so 
            WHERE so.bucket_id = 'rfr-media' AND so.name = 'gallery/' || SUBSTRING(rgi.image FROM 17)
        ) AS is_uploaded_in_storage
    FROM public.riyas_gallery_items rgi
    WHERE rgi.image LIKE '/images/gallery/%' AND rgi.image NOT LIKE 'http%' AND rgi.image NOT LIKE '//%'

    UNION ALL

    -- 16. testimonials (image) -> testimonials/
    SELECT 
        'testimonials' AS table_name,
        'image' AS field_name,
        t.image AS original_path,
        'https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media/testimonials/' || SUBSTRING(t.image FROM 22) AS proposed_destination_url,
        'testimonials/' || SUBSTRING(t.image FROM 22) AS storage_object_name,
        EXISTS (
            SELECT 1 FROM storage.objects so 
            WHERE so.bucket_id = 'rfr-media' AND so.name = 'testimonials/' || SUBSTRING(t.image FROM 22)
        ) AS is_uploaded_in_storage
    FROM public.testimonials t
    WHERE t.image LIKE '/images/testimonials/%' AND t.image NOT LIKE 'http%' AND t.image NOT LIKE '//%'

    UNION ALL

    -- 17. seo_metadata (og_image_url)
    SELECT 
        'seo_metadata' AS table_name,
        'og_image_url' AS field_name,
        sm.og_image_url AS original_path,
        'https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media/' || (
            CASE 
                WHEN sm.og_image_url = '/images/riyas.jpg' THEN 'branding/riyas.jpg'
                WHEN sm.og_image_url = '/images/final bro.png' THEN 'branding/final bro.png'
                WHEN sm.og_image_url = '/images/pothys.png' THEN 'branding/pothys.png'
                WHEN sm.og_image_url LIKE '/images/clients/%' THEN 'clients/' || SUBSTRING(sm.og_image_url FROM 17)
                WHEN sm.og_image_url LIKE '/images/influencers/%' THEN 'influencers/' || SUBSTRING(sm.og_image_url FROM 21)
                WHEN sm.og_image_url LIKE '/news and press/%' THEN 'press/' || SUBSTRING(sm.og_image_url FROM 17)
            END
        ) AS proposed_destination_url,
        CASE 
            WHEN sm.og_image_url = '/images/riyas.jpg' THEN 'branding/riyas.jpg'
            WHEN sm.og_image_url = '/images/final bro.png' THEN 'branding/final bro.png'
            WHEN sm.og_image_url = '/images/pothys.png' THEN 'branding/pothys.png'
            WHEN sm.og_image_url LIKE '/images/clients/%' THEN 'clients/' || SUBSTRING(sm.og_image_url FROM 17)
            WHEN sm.og_image_url LIKE '/images/influencers/%' THEN 'influencers/' || SUBSTRING(sm.og_image_url FROM 21)
            WHEN sm.og_image_url LIKE '/news and press/%' THEN 'press/' || SUBSTRING(sm.og_image_url FROM 17)
        END AS storage_object_name,
        EXISTS (
            SELECT 1 FROM storage.objects so 
            WHERE so.bucket_id = 'rfr-media' AND so.name = (
                CASE 
                    WHEN sm.og_image_url = '/images/riyas.jpg' THEN 'branding/riyas.jpg'
                    WHEN sm.og_image_url = '/images/final bro.png' THEN 'branding/final bro.png'
                    WHEN sm.og_image_url = '/images/pothys.png' THEN 'branding/pothys.png'
                    WHEN sm.og_image_url LIKE '/images/clients/%' THEN 'clients/' || SUBSTRING(sm.og_image_url FROM 17)
                    WHEN sm.og_image_url LIKE '/images/influencers/%' THEN 'influencers/' || SUBSTRING(sm.og_image_url FROM 21)
                    WHEN sm.og_image_url LIKE '/news and press/%' THEN 'press/' || SUBSTRING(sm.og_image_url FROM 17)
                END
            )
        ) AS is_uploaded_in_storage
    FROM public.seo_metadata sm
    WHERE sm.og_image_url NOT LIKE 'http%' AND sm.og_image_url NOT LIKE '//%'
      AND (
        sm.og_image_url IN ('/images/riyas.jpg', '/images/final bro.png', '/images/pothys.png') OR
        sm.og_image_url LIKE '/images/clients/%' OR
        sm.og_image_url LIKE '/images/influencers/%' OR
        sm.og_image_url LIKE '/news and press/%'
      )
)
SELECT 
    table_name,
    field_name,
    original_path,
    proposed_destination_url,
    storage_object_name,
    is_uploaded_in_storage
FROM audited_references
ORDER BY table_name, field_name;

-- ==============================================================================
-- PART 1-B: VALIDATION & ANOMALY DETECTION QUERY
-- Run this query to detect any double-slashes ('//'), missing filenames (trailing slashes),
-- empty filenames, or unapproved destination folders. Must return 0 rows before running Part 2.
-- ==============================================================================
WITH audited_references AS (
    SELECT 'website_settings' AS table_name, 'official_logo_url' AS field_name, ws.official_logo_url AS original_path,
        CASE WHEN ws.official_logo_url = '/images/final bro.png' THEN 'branding/final bro.png' WHEN ws.official_logo_url = '/images/riyas.jpg' THEN 'branding/riyas.jpg' END AS storage_object_name
    FROM public.website_settings ws WHERE ws.official_logo_url IN ('/images/final bro.png', '/images/riyas.jpg')
    UNION ALL
    SELECT 'website_settings', 'loading_screen_logo_url', ws.loading_screen_logo_url,
        CASE WHEN ws.loading_screen_logo_url = '/images/final bro.png' THEN 'branding/final bro.png' WHEN ws.loading_screen_logo_url = '/images/riyas.jpg' THEN 'branding/riyas.jpg' END
    FROM public.website_settings ws WHERE ws.loading_screen_logo_url IN ('/images/final bro.png', '/images/riyas.jpg')
    UNION ALL
    SELECT 'website_settings', 'footer_logo_url', ws.footer_logo_url,
        CASE WHEN ws.footer_logo_url = '/images/final bro.png' THEN 'branding/final bro.png' WHEN ws.footer_logo_url = '/images/riyas.jpg' THEN 'branding/riyas.jpg' END
    FROM public.website_settings ws WHERE ws.footer_logo_url IN ('/images/final bro.png', '/images/riyas.jpg')
    UNION ALL
    SELECT 'website_settings', 'favicon_url', ws.favicon_url, 'branding/favicon.png' FROM public.website_settings ws WHERE ws.favicon_url IN ('/favicon.ico', '/favicon.png')
    UNION ALL
    SELECT 'hero_banners', 'image_url', hb.image_url,
        CASE WHEN hb.image_url = '/images/final bro.png' THEN 'branding/final bro.png' WHEN hb.image_url = '/images/riyas.jpg' THEN 'branding/riyas.jpg' END
    FROM public.hero_banners hb WHERE hb.image_url IN ('/images/final bro.png', '/images/riyas.jpg')
    UNION ALL
    SELECT 'hero_banners', 'video_url', hb.video_url, 'videos/' || SUBSTRING(hb.video_url FROM 9)
    FROM public.hero_banners hb WHERE hb.video_url LIKE '/videos/%' AND hb.video_url NOT LIKE 'http%' AND hb.video_url NOT LIKE '//%'
    UNION ALL
    SELECT 'press_articles', 'cover_image', pa.cover_image, 'press/' || SUBSTRING(pa.cover_image FROM 17)
    FROM public.press_articles pa WHERE pa.cover_image LIKE '/news and press/%' AND pa.cover_image NOT LIKE 'http%' AND pa.cover_image NOT LIKE '//%'
    UNION ALL
    SELECT 'projects_portfolio', 'cover_image', pp.cover_image,
        CASE 
            WHEN pp.cover_image LIKE '/images/clients/%' THEN 'clients/' || SUBSTRING(pp.cover_image FROM 17)
            WHEN pp.cover_image LIKE '/images/thumbnails/%' THEN 'portfolio/' || SUBSTRING(pp.cover_image FROM 20)
            WHEN pp.cover_image = '/images/pothys.png' THEN 'branding/pothys.png'
            WHEN pp.cover_image = '/images/riyas.jpg' THEN 'branding/riyas.jpg'
            WHEN pp.cover_image = '/images/final bro.png' THEN 'branding/final bro.png'
        END
    FROM public.projects_portfolio pp WHERE pp.cover_image NOT LIKE 'http%' AND pp.cover_image NOT LIKE '//%'
      AND (pp.cover_image LIKE '/images/clients/%' OR pp.cover_image LIKE '/images/thumbnails/%' OR pp.cover_image IN ('/images/pothys.png', '/images/riyas.jpg', '/images/final bro.png'))
    UNION ALL
    SELECT 'projects_portfolio', 'video_url', pp.video_url, 'videos/' || SUBSTRING(pp.video_url FROM 9)
    FROM public.projects_portfolio pp WHERE pp.video_url LIKE '/videos/%' AND pp.video_url NOT LIKE 'http%' AND pp.video_url NOT LIKE '//%'
    UNION ALL
    SELECT 'projects_portfolio', 'gallery_images (item)', elem,
        CASE 
            WHEN elem LIKE '/images/clients/%' THEN 'clients/' || SUBSTRING(elem FROM 17)
            WHEN elem LIKE '/images/thumbnails/%' THEN 'portfolio/' || SUBSTRING(elem FROM 20)
            WHEN elem = '/images/pothys.png' THEN 'branding/pothys.png'
            WHEN elem = '/images/riyas.jpg' THEN 'branding/riyas.jpg'
            WHEN elem = '/images/final bro.png' THEN 'branding/final bro.png'
        END
    FROM public.projects_portfolio pp, LATERAL unnest(pp.gallery_images) AS elem
    WHERE elem NOT LIKE 'http%' AND elem NOT LIKE '//%' AND (elem LIKE '/images/clients/%' OR elem LIKE '/images/thumbnails/%' OR elem IN ('/images/pothys.png', '/images/riyas.jpg', '/images/final bro.png'))
    UNION ALL
    SELECT 'talent_influencers', 'profile_image', ti.profile_image, 'influencers/' || SUBSTRING(ti.profile_image FROM 21)
    FROM public.talent_influencers ti WHERE ti.profile_image LIKE '/images/influencers/%' AND ti.profile_image NOT LIKE 'http%' AND ti.profile_image NOT LIKE '//%'
    UNION ALL
    SELECT 'talent_models', 'headshot_image', tm.headshot_image, 'models/' || SUBSTRING(tm.headshot_image FROM 16)
    FROM public.talent_models tm WHERE tm.headshot_image LIKE '/images/models/%' AND tm.headshot_image NOT LIKE 'http%' AND tm.headshot_image NOT LIKE '//%'
    UNION ALL
    SELECT 'talent_models', 'portfolio_images (item)', elem, 'models/' || SUBSTRING(elem FROM 16)
    FROM public.talent_models tm, LATERAL unnest(tm.portfolio_images) AS elem WHERE elem LIKE '/images/models/%' AND elem NOT LIKE 'http%' AND elem NOT LIKE '//%'
    UNION ALL
    SELECT 'tic_content', 'hero_image', tc.hero_image, 'clients/' || SUBSTRING(tc.hero_image FROM 17)
    FROM public.tic_content tc WHERE tc.hero_image LIKE '/images/clients/%' AND tc.hero_image NOT LIKE 'http%' AND tc.hero_image NOT LIKE '//%'
    UNION ALL
    SELECT 'tic_content', 'video_reel_url', tc.video_reel_url, 'videos/' || SUBSTRING(tc.video_reel_url FROM 9)
    FROM public.tic_content tc WHERE tc.video_reel_url LIKE '/videos/%' AND tc.video_reel_url NOT LIKE 'http%' AND tc.video_reel_url NOT LIKE '//%'
    UNION ALL
    SELECT 'tic_events', 'cover_image', te.cover_image, 'clients/' || SUBSTRING(te.cover_image FROM 17)
    FROM public.tic_events te WHERE te.cover_image LIKE '/images/clients/%' AND te.cover_image NOT LIKE 'http%' AND te.cover_image NOT LIKE '//%'
    UNION ALL
    SELECT 'tic_events', 'video_url', te.video_url, 'videos/' || SUBSTRING(te.video_url FROM 9)
    FROM public.tic_events te WHERE te.video_url LIKE '/videos/%' AND te.video_url NOT LIKE 'http%' AND te.video_url NOT LIKE '//%'
    UNION ALL
    SELECT 'tic_events', 'gallery_images (item)', elem, 'clients/' || SUBSTRING(elem FROM 17)
    FROM public.tic_events te, LATERAL unnest(te.gallery_images) AS elem WHERE elem LIKE '/images/clients/%' AND elem NOT LIKE 'http%' AND elem NOT LIKE '//%'
    UNION ALL
    SELECT 'team_members', 'image', tm.image,
        CASE WHEN tm.image = '/images/riyas.jpg' THEN 'branding/riyas.jpg' WHEN tm.image = '/images/final bro.png' THEN 'branding/final bro.png' END
    FROM public.team_members tm WHERE tm.image IN ('/images/riyas.jpg', '/images/final bro.png')
    UNION ALL
    SELECT 'partners_clients', 'logo', pc.logo,
        CASE 
            WHEN pc.logo LIKE '/images/clients/%' THEN 'clients/' || SUBSTRING(pc.logo FROM 17)
            WHEN pc.logo LIKE '/logo/%' THEN 'clients/' || SUBSTRING(pc.logo FROM 7)
            WHEN pc.logo = '/images/pothys.png' THEN 'branding/pothys.png'
            WHEN pc.logo = '/images/riyas.jpg' THEN 'branding/riyas.jpg'
            WHEN pc.logo = '/images/final bro.png' THEN 'branding/final bro.png'
        END
    FROM public.partners_clients pc WHERE pc.logo NOT LIKE 'http%' AND pc.logo NOT LIKE '//%'
      AND (pc.logo LIKE '/images/clients/%' OR pc.logo LIKE '/logo/%' OR pc.logo IN ('/images/pothys.png', '/images/riyas.jpg', '/images/final bro.png'))
    UNION ALL
    SELECT 'timeline_events', 'image', te.image,
        CASE 
            WHEN te.image LIKE '/images/thumbnails/%' THEN 'portfolio/' || SUBSTRING(te.image FROM 20)
            WHEN te.image LIKE '/images/clients/%' THEN 'clients/' || SUBSTRING(te.image FROM 17)
            WHEN te.image = '/images/pothys.png' THEN 'branding/pothys.png'
            WHEN te.image = '/images/riyas.jpg' THEN 'branding/riyas.jpg'
            WHEN te.image = '/images/final bro.png' THEN 'branding/final bro.png'
        END
    FROM public.timeline_events te WHERE te.image NOT LIKE 'http%' AND te.image NOT LIKE '//%'
      AND (te.image LIKE '/images/thumbnails/%' OR te.image LIKE '/images/clients/%' OR te.image IN ('/images/pothys.png', '/images/riyas.jpg', '/images/final bro.png'))
    UNION ALL
    SELECT 'timeline_events', 'video_url', te.video_url, 'videos/' || SUBSTRING(te.video_url FROM 9)
    FROM public.timeline_events te WHERE te.video_url LIKE '/videos/%' AND te.video_url NOT LIKE 'http%' AND te.video_url NOT LIKE '//%'
    UNION ALL
    SELECT 'timeline_years', 'image', ty.image,
        CASE 
            WHEN ty.image LIKE '/images/thumbnails/%' THEN 'portfolio/' || SUBSTRING(ty.image FROM 20)
            WHEN ty.image LIKE '/images/clients/%' THEN 'clients/' || SUBSTRING(ty.image FROM 17)
            WHEN ty.image = '/images/riyas.jpg' THEN 'branding/riyas.jpg'
            WHEN ty.image = '/images/final bro.png' THEN 'branding/final bro.png'
        END
    FROM public.timeline_years ty WHERE ty.image NOT LIKE 'http%' AND ty.image NOT LIKE '//%'
      AND (ty.image LIKE '/images/thumbnails/%' OR ty.image LIKE '/images/clients/%' OR ty.image IN ('/images/riyas.jpg', '/images/final bro.png'))
    UNION ALL
    SELECT 'timeline_years', 'video_url', ty.video_url, 'videos/' || SUBSTRING(ty.video_url FROM 9)
    FROM public.timeline_years ty WHERE ty.video_url LIKE '/videos/%' AND ty.video_url NOT LIKE 'http%' AND ty.video_url NOT LIKE '//%'
    UNION ALL
    SELECT 'media_videos', 'thumbnail_url', mv.thumbnail_url,
        CASE 
            WHEN mv.thumbnail_url LIKE '/images/thumbnails/%' THEN 'portfolio/' || SUBSTRING(mv.thumbnail_url FROM 20)
            WHEN mv.thumbnail_url LIKE '/images/clients/%' THEN 'clients/' || SUBSTRING(mv.thumbnail_url FROM 17)
            WHEN mv.thumbnail_url LIKE '/images/influencers/%' THEN 'influencers/' || SUBSTRING(mv.thumbnail_url FROM 21)
            WHEN mv.thumbnail_url = '/images/pothys.png' THEN 'branding/pothys.png'
            WHEN mv.thumbnail_url = '/images/riyas.jpg' THEN 'branding/riyas.jpg'
            WHEN mv.thumbnail_url = '/images/final bro.png' THEN 'branding/final bro.png'
        END
    FROM public.media_videos mv WHERE mv.thumbnail_url NOT LIKE 'http%' AND mv.thumbnail_url NOT LIKE '//%'
      AND (mv.thumbnail_url LIKE '/images/thumbnails/%' OR mv.thumbnail_url LIKE '/images/clients/%' OR mv.thumbnail_url LIKE '/images/influencers/%' OR mv.thumbnail_url IN ('/images/pothys.png', '/images/riyas.jpg', '/images/final bro.png'))
    UNION ALL
    SELECT 'media_videos', 'video_url', mv.video_url, 'videos/' || SUBSTRING(mv.video_url FROM 9)
    FROM public.media_videos mv WHERE mv.video_url LIKE '/videos/%' AND mv.video_url NOT LIKE 'http%' AND mv.video_url NOT LIKE '//%'
    UNION ALL
    SELECT 'gallery_items', 'image', gi.image, 'gallery/' || SUBSTRING(gi.image FROM 17)
    FROM public.gallery_items gi WHERE gi.image LIKE '/images/gallery/%' AND gi.image NOT LIKE 'http%' AND gi.image NOT LIKE '//%'
    UNION ALL
    SELECT 'riyas_gallery_items', 'image', rgi.image, 'gallery/' || SUBSTRING(rgi.image FROM 17)
    FROM public.riyas_gallery_items rgi WHERE rgi.image LIKE '/images/gallery/%' AND rgi.image NOT LIKE 'http%' AND rgi.image NOT LIKE '//%'
    UNION ALL
    SELECT 'testimonials', 'image', t.image, 'testimonials/' || SUBSTRING(t.image FROM 22)
    FROM public.testimonials t WHERE t.image LIKE '/images/testimonials/%' AND t.image NOT LIKE 'http%' AND t.image NOT LIKE '//%'
    UNION ALL
    SELECT 'seo_metadata', 'og_image_url', sm.og_image_url,
        CASE 
            WHEN sm.og_image_url = '/images/riyas.jpg' THEN 'branding/riyas.jpg'
            WHEN sm.og_image_url = '/images/final bro.png' THEN 'branding/final bro.png'
            WHEN sm.og_image_url = '/images/pothys.png' THEN 'branding/pothys.png'
            WHEN sm.og_image_url LIKE '/images/clients/%' THEN 'clients/' || SUBSTRING(sm.og_image_url FROM 17)
            WHEN sm.og_image_url LIKE '/images/influencers/%' THEN 'influencers/' || SUBSTRING(sm.og_image_url FROM 21)
            WHEN sm.og_image_url LIKE '/news and press/%' THEN 'press/' || SUBSTRING(sm.og_image_url FROM 17)
        END
    FROM public.seo_metadata sm WHERE sm.og_image_url NOT LIKE 'http%' AND sm.og_image_url NOT LIKE '//%'
      AND (sm.og_image_url IN ('/images/riyas.jpg', '/images/final bro.png', '/images/pothys.png') OR sm.og_image_url LIKE '/images/clients/%' OR sm.og_image_url LIKE '/images/influencers/%' OR sm.og_image_url LIKE '/news and press/%')
)
SELECT 
    table_name,
    field_name,
    original_path,
    storage_object_name,
    CASE 
        WHEN storage_object_name LIKE '%//%' THEN 'FAIL: Double slash detected'
        WHEN storage_object_name LIKE '%/' THEN 'FAIL: Missing filename (trailing slash)'
        WHEN storage_object_name NOT SIMILAR TO '(press|clients|influencers|portfolio|models|gallery|testimonials|branding|videos)/%' THEN 'FAIL: Unapproved destination folder'
        WHEN length(storage_object_name) <= length(split_part(storage_object_name, '/', 1)) + 1 THEN 'FAIL: Empty filename'
        ELSE 'PASS'
    END AS validation_status
FROM audited_references
WHERE storage_object_name LIKE '%//%'
   OR storage_object_name LIKE '%/'
   OR storage_object_name NOT SIMILAR TO '(press|clients|influencers|portfolio|models|gallery|testimonials|branding|videos)/%'
   OR length(storage_object_name) <= length(split_part(storage_object_name, '/', 1)) + 1;


-- ==============================================================================
-- PART 2: STORAGE-GUARDED CONDITIONAL RECONCILIATION
-- (Only updates rows where the matching object ACTUALLY EXISTS in storage.objects)
-- Target: Verified Supabase Project ID: hlyxzhafdjyflwcdecmp (from .env.local).
-- 
-- ROLLBACK & SAFETY INSTRUCTIONS:
-- 1. All update statements below are executed within a single transaction block.
-- 2. If any statement or constraint fails, PostgreSQL automatically aborts the
--    entire transaction, guaranteeing zero partial updates.
-- 3. If running interactively and you need to abort, execute: ROLLBACK;
-- 4. Safe Inverse Reversion: If you ever need to restore all storage URLs back to
--    local web server paths, each table has an exact deterministic mapping.
--    Mathematical Offset Verification:
--      Base URL: 'https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media/press/'
--      Length: 82 characters (8 [https://] + 20 [ref] + 48 [.supabase.co/storage/v1/object/public/rfr-media/] + 6 [press/]).
--      In PostgreSQL 1-based indexing, SUBSTRING(url FROM 83) starts at the 83rd character (the first character of the filename).
--      Example:
--        UPDATE public.press_articles
--        SET cover_image = '/news and press/' || SUBSTRING(cover_image FROM 83)
--        WHERE cover_image LIKE 'https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media/press/%';
-- ==============================================================================

BEGIN;

-- VERIFIED TARGET: Supabase Project ID: hlyxzhafdjyflwcdecmp
-- Public Storage Endpoint: https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media
DO $$
BEGIN
    IF 'hlyxzhafdjyflwcdecmp' = '' OR length('hlyxzhafdjyflwcdecmp') <> 20 THEN
        RAISE EXCEPTION 'SAFETY STOP: Target project reference is invalid or blank.';
    END IF;
END $$;

-- 1. website_settings (official_logo_url, loading_screen_logo_url, footer_logo_url, favicon_url)
UPDATE public.website_settings ws
SET official_logo_url = 'https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media/' || (
    CASE 
        WHEN ws.official_logo_url = '/images/final bro.png' THEN 'branding/final bro.png'
        WHEN ws.official_logo_url = '/images/riyas.jpg' THEN 'branding/riyas.jpg'
    END
)
WHERE ws.official_logo_url IN ('/images/final bro.png', '/images/riyas.jpg')
  AND (
    (ws.official_logo_url = '/images/final bro.png' AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'branding/final bro.png'))
    OR (ws.official_logo_url = '/images/riyas.jpg' AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'branding/riyas.jpg'))
  );

UPDATE public.website_settings ws
SET loading_screen_logo_url = 'https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media/' || (
    CASE 
        WHEN ws.loading_screen_logo_url = '/images/final bro.png' THEN 'branding/final bro.png'
        WHEN ws.loading_screen_logo_url = '/images/riyas.jpg' THEN 'branding/riyas.jpg'
    END
)
WHERE ws.loading_screen_logo_url IN ('/images/final bro.png', '/images/riyas.jpg')
  AND (
    (ws.loading_screen_logo_url = '/images/final bro.png' AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'branding/final bro.png'))
    OR (ws.loading_screen_logo_url = '/images/riyas.jpg' AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'branding/riyas.jpg'))
  );

UPDATE public.website_settings ws
SET footer_logo_url = 'https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media/' || (
    CASE 
        WHEN ws.footer_logo_url = '/images/final bro.png' THEN 'branding/final bro.png'
        WHEN ws.footer_logo_url = '/images/riyas.jpg' THEN 'branding/riyas.jpg'
    END
)
WHERE ws.footer_logo_url IN ('/images/final bro.png', '/images/riyas.jpg')
  AND (
    (ws.footer_logo_url = '/images/final bro.png' AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'branding/final bro.png'))
    OR (ws.footer_logo_url = '/images/riyas.jpg' AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'branding/riyas.jpg'))
  );

UPDATE public.website_settings ws
SET favicon_url = 'https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media/branding/favicon.png'
WHERE ws.favicon_url IN ('/favicon.ico', '/favicon.png')
  AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'branding/favicon.png');

-- 2. hero_banners (image_url, video_url)
UPDATE public.hero_banners hb
SET image_url = 'https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media/' || (
    CASE 
        WHEN hb.image_url = '/images/final bro.png' THEN 'branding/final bro.png'
        WHEN hb.image_url = '/images/riyas.jpg' THEN 'branding/riyas.jpg'
    END
)
WHERE hb.image_url IN ('/images/final bro.png', '/images/riyas.jpg')
  AND (
    (hb.image_url = '/images/final bro.png' AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'branding/final bro.png'))
    OR (hb.image_url = '/images/riyas.jpg' AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'branding/riyas.jpg'))
  );

UPDATE public.hero_banners hb
SET video_url = 'https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media/videos/' || SUBSTRING(hb.video_url FROM 9)
WHERE hb.video_url LIKE '/videos/%' AND hb.video_url NOT LIKE 'http%' AND hb.video_url NOT LIKE '//%'
  AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'videos/' || SUBSTRING(hb.video_url FROM 9));

-- 3. press_articles (cover_image)
UPDATE public.press_articles pa
SET cover_image = 'https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media/press/' || SUBSTRING(pa.cover_image FROM 17)
WHERE pa.cover_image LIKE '/news and press/%' AND pa.cover_image NOT LIKE 'http%' AND pa.cover_image NOT LIKE '//%'
  AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'press/' || SUBSTRING(pa.cover_image FROM 17));

-- 4. projects_portfolio (cover_image, video_url, gallery_images)
UPDATE public.projects_portfolio pp
SET cover_image = 'https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media/' || (
    CASE 
        WHEN pp.cover_image LIKE '/images/clients/%' THEN 'clients/' || SUBSTRING(pp.cover_image FROM 17)
        WHEN pp.cover_image LIKE '/images/thumbnails/%' THEN 'portfolio/' || SUBSTRING(pp.cover_image FROM 20)
        WHEN pp.cover_image = '/images/pothys.png' THEN 'branding/pothys.png'
        WHEN pp.cover_image = '/images/riyas.jpg' THEN 'branding/riyas.jpg'
        WHEN pp.cover_image = '/images/final bro.png' THEN 'branding/final bro.png'
    END
)
WHERE pp.cover_image NOT LIKE 'http%' AND pp.cover_image NOT LIKE '//%'
  AND (
    (pp.cover_image LIKE '/images/clients/%' AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'clients/' || SUBSTRING(pp.cover_image FROM 17)))
    OR (pp.cover_image LIKE '/images/thumbnails/%' AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'portfolio/' || SUBSTRING(pp.cover_image FROM 20)))
    OR (pp.cover_image = '/images/pothys.png' AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'branding/pothys.png'))
    OR (pp.cover_image = '/images/riyas.jpg' AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'branding/riyas.jpg'))
    OR (pp.cover_image = '/images/final bro.png' AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'branding/final bro.png'))
  );

UPDATE public.projects_portfolio pp
SET video_url = 'https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media/videos/' || SUBSTRING(pp.video_url FROM 9)
WHERE pp.video_url LIKE '/videos/%' AND pp.video_url NOT LIKE 'http%' AND pp.video_url NOT LIKE '//%'
  AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'videos/' || SUBSTRING(pp.video_url FROM 9));

-- projects_portfolio TEXT[] array reconciliation: gallery_images (guarded: updates only if >= 1 element reconciles)
UPDATE public.projects_portfolio pp
SET gallery_images = ARRAY(
    SELECT 
        CASE 
            WHEN elem LIKE '/images/clients/%' AND elem NOT LIKE 'http%' AND elem NOT LIKE '//%'
                 AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'clients/' || SUBSTRING(elem FROM 17))
            THEN 'https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media/clients/' || SUBSTRING(elem FROM 17)
            WHEN elem LIKE '/images/thumbnails/%' AND elem NOT LIKE 'http%' AND elem NOT LIKE '//%'
                 AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'portfolio/' || SUBSTRING(elem FROM 20))
            THEN 'https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media/portfolio/' || SUBSTRING(elem FROM 20)
            WHEN elem = '/images/pothys.png' AND elem NOT LIKE 'http%' AND elem NOT LIKE '//%'
                 AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'branding/pothys.png')
            THEN 'https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media/branding/pothys.png'
            WHEN elem = '/images/riyas.jpg' AND elem NOT LIKE 'http%' AND elem NOT LIKE '//%'
                 AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'branding/riyas.jpg')
            THEN 'https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media/branding/riyas.jpg'
            WHEN elem = '/images/final bro.png' AND elem NOT LIKE 'http%' AND elem NOT LIKE '//%'
                 AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'branding/final bro.png')
            THEN 'https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media/branding/final bro.png'
            ELSE elem
        END
    FROM unnest(pp.gallery_images) WITH ORDINALITY AS t(elem, ord)
    ORDER BY ord
)
WHERE pp.gallery_images IS NOT NULL 
  AND cardinality(pp.gallery_images) > 0
  AND EXISTS (
      SELECT 1 
      FROM unnest(pp.gallery_images) AS elem
      WHERE (elem LIKE '/images/clients/%' AND elem NOT LIKE 'http%' AND elem NOT LIKE '//%' AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'clients/' || SUBSTRING(elem FROM 17)))
         OR (elem LIKE '/images/thumbnails/%' AND elem NOT LIKE 'http%' AND elem NOT LIKE '//%' AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'portfolio/' || SUBSTRING(elem FROM 20)))
         OR (elem = '/images/pothys.png' AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'branding/pothys.png'))
         OR (elem = '/images/riyas.jpg' AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'branding/riyas.jpg'))
         OR (elem = '/images/final bro.png' AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'branding/final bro.png'))
  );

-- 5. talent_influencers (profile_image)
UPDATE public.talent_influencers ti
SET profile_image = 'https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media/influencers/' || SUBSTRING(ti.profile_image FROM 21)
WHERE ti.profile_image LIKE '/images/influencers/%' AND ti.profile_image NOT LIKE 'http%' AND ti.profile_image NOT LIKE '//%'
  AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'influencers/' || SUBSTRING(ti.profile_image FROM 21));

-- 6. talent_models (headshot_image, portfolio_images)
UPDATE public.talent_models tm
SET headshot_image = 'https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media/models/' || SUBSTRING(tm.headshot_image FROM 16)
WHERE tm.headshot_image LIKE '/images/models/%' AND tm.headshot_image NOT LIKE 'http%' AND tm.headshot_image NOT LIKE '//%'
  AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'models/' || SUBSTRING(tm.headshot_image FROM 16));

UPDATE public.talent_models tm
SET portfolio_images = ARRAY(
    SELECT 
        CASE 
            WHEN elem LIKE '/images/models/%' AND elem NOT LIKE 'http%' AND elem NOT LIKE '//%'
                 AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'models/' || SUBSTRING(elem FROM 16))
            THEN 'https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media/models/' || SUBSTRING(elem FROM 16)
            ELSE elem
        END
    FROM unnest(tm.portfolio_images) WITH ORDINALITY AS t(elem, ord)
    ORDER BY ord
)
WHERE tm.portfolio_images IS NOT NULL 
  AND cardinality(tm.portfolio_images) > 0
  AND EXISTS (
      SELECT 1 
      FROM unnest(tm.portfolio_images) AS elem
      WHERE elem LIKE '/images/models/%' AND elem NOT LIKE 'http%' AND elem NOT LIKE '//%'
        AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'models/' || SUBSTRING(elem FROM 16))
  );

-- 7. tic_content (hero_image, video_reel_url)
UPDATE public.tic_content tc
SET hero_image = 'https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media/clients/' || SUBSTRING(tc.hero_image FROM 17)
WHERE tc.hero_image LIKE '/images/clients/%' AND tc.hero_image NOT LIKE 'http%' AND tc.hero_image NOT LIKE '//%'
  AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'clients/' || SUBSTRING(tc.hero_image FROM 17));

UPDATE public.tic_content tc
SET video_reel_url = 'https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media/videos/' || SUBSTRING(tc.video_reel_url FROM 9)
WHERE tc.video_reel_url LIKE '/videos/%' AND tc.video_reel_url NOT LIKE 'http%' AND tc.video_reel_url NOT LIKE '//%'
  AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'videos/' || SUBSTRING(tc.video_reel_url FROM 9));

-- 8. tic_events (cover_image, video_url, gallery_images)
UPDATE public.tic_events te
SET cover_image = 'https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media/clients/' || SUBSTRING(te.cover_image FROM 17)
WHERE te.cover_image LIKE '/images/clients/%' AND te.cover_image NOT LIKE 'http%' AND te.cover_image NOT LIKE '//%'
  AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'clients/' || SUBSTRING(te.cover_image FROM 17));

UPDATE public.tic_events te
SET video_url = 'https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media/videos/' || SUBSTRING(te.video_url FROM 9)
WHERE te.video_url LIKE '/videos/%' AND te.video_url NOT LIKE 'http%' AND te.video_url NOT LIKE '//%'
  AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'videos/' || SUBSTRING(te.video_url FROM 9));

UPDATE public.tic_events te
SET gallery_images = ARRAY(
    SELECT 
        CASE 
            WHEN elem LIKE '/images/clients/%' AND elem NOT LIKE 'http%' AND elem NOT LIKE '//%'
                 AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'clients/' || SUBSTRING(elem FROM 17))
            THEN 'https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media/clients/' || SUBSTRING(elem FROM 17)
            ELSE elem
        END
    FROM unnest(te.gallery_images) WITH ORDINALITY AS t(elem, ord)
    ORDER BY ord
)
WHERE te.gallery_images IS NOT NULL 
  AND cardinality(te.gallery_images) > 0
  AND EXISTS (
      SELECT 1 
      FROM unnest(te.gallery_images) AS elem
      WHERE elem LIKE '/images/clients/%' AND elem NOT LIKE 'http%' AND elem NOT LIKE '//%'
        AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'clients/' || SUBSTRING(elem FROM 17))
  );

-- 9. team_members (image)
UPDATE public.team_members tm
SET image = 'https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media/' || (
    CASE 
        WHEN tm.image = '/images/riyas.jpg' THEN 'branding/riyas.jpg'
        WHEN tm.image = '/images/final bro.png' THEN 'branding/final bro.png'
    END
)
WHERE tm.image IN ('/images/riyas.jpg', '/images/final bro.png')
  AND (
    (tm.image = '/images/riyas.jpg' AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'branding/riyas.jpg'))
    OR (tm.image = '/images/final bro.png' AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'branding/final bro.png'))
  );

-- 10. partners_clients (logo)
UPDATE public.partners_clients pc
SET logo = 'https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media/' || (
    CASE 
        WHEN pc.logo LIKE '/images/clients/%' THEN 'clients/' || SUBSTRING(pc.logo FROM 17)
        WHEN pc.logo LIKE '/logo/%' THEN 'clients/' || SUBSTRING(pc.logo FROM 7)
        WHEN pc.logo = '/images/pothys.png' THEN 'branding/pothys.png'
        WHEN pc.logo = '/images/riyas.jpg' THEN 'branding/riyas.jpg'
        WHEN pc.logo = '/images/final bro.png' THEN 'branding/final bro.png'
    END
)
WHERE pc.logo NOT LIKE 'http%' AND pc.logo NOT LIKE '//%'
  AND (
    (pc.logo LIKE '/images/clients/%' AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'clients/' || SUBSTRING(pc.logo FROM 17)))
    OR (pc.logo LIKE '/logo/%' AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'clients/' || SUBSTRING(pc.logo FROM 7)))
    OR (pc.logo = '/images/pothys.png' AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'branding/pothys.png'))
    OR (pc.logo = '/images/riyas.jpg' AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'branding/riyas.jpg'))
    OR (pc.logo = '/images/final bro.png' AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'branding/final bro.png'))
  );

-- 11. timeline_events (image, video_url)
UPDATE public.timeline_events te
SET image = 'https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media/' || (
    CASE 
        WHEN te.image LIKE '/images/thumbnails/%' THEN 'portfolio/' || SUBSTRING(te.image FROM 20)
        WHEN te.image LIKE '/images/clients/%' THEN 'clients/' || SUBSTRING(te.image FROM 17)
        WHEN te.image = '/images/pothys.png' THEN 'branding/pothys.png'
        WHEN te.image = '/images/riyas.jpg' THEN 'branding/riyas.jpg'
        WHEN te.image = '/images/final bro.png' THEN 'branding/final bro.png'
    END
)
WHERE te.image NOT LIKE 'http%' AND te.image NOT LIKE '//%'
  AND (
    (te.image LIKE '/images/thumbnails/%' AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'portfolio/' || SUBSTRING(te.image FROM 20)))
    OR (te.image LIKE '/images/clients/%' AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'clients/' || SUBSTRING(te.image FROM 17)))
    OR (te.image = '/images/pothys.png' AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'branding/pothys.png'))
    OR (te.image = '/images/riyas.jpg' AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'branding/riyas.jpg'))
    OR (te.image = '/images/final bro.png' AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'branding/final bro.png'))
  );

UPDATE public.timeline_events te
SET video_url = 'https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media/videos/' || SUBSTRING(te.video_url FROM 9)
WHERE te.video_url LIKE '/videos/%' AND te.video_url NOT LIKE 'http%' AND te.video_url NOT LIKE '//%'
  AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'videos/' || SUBSTRING(te.video_url FROM 9));

-- 12. timeline_years (image, video_url)
UPDATE public.timeline_years ty
SET image = 'https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media/' || (
    CASE 
        WHEN ty.image LIKE '/images/thumbnails/%' THEN 'portfolio/' || SUBSTRING(ty.image FROM 20)
        WHEN ty.image LIKE '/images/clients/%' THEN 'clients/' || SUBSTRING(ty.image FROM 17)
        WHEN ty.image = '/images/riyas.jpg' THEN 'branding/riyas.jpg'
        WHEN ty.image = '/images/final bro.png' THEN 'branding/final bro.png'
    END
)
WHERE ty.image NOT LIKE 'http%' AND ty.image NOT LIKE '//%'
  AND (
    (ty.image LIKE '/images/thumbnails/%' AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'portfolio/' || SUBSTRING(ty.image FROM 20)))
    OR (ty.image LIKE '/images/clients/%' AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'clients/' || SUBSTRING(ty.image FROM 17)))
    OR (ty.image = '/images/riyas.jpg' AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'branding/riyas.jpg'))
    OR (ty.image = '/images/final bro.png' AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'branding/final bro.png'))
  );

UPDATE public.timeline_years ty
SET video_url = 'https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media/videos/' || SUBSTRING(ty.video_url FROM 9)
WHERE ty.video_url LIKE '/videos/%' AND ty.video_url NOT LIKE 'http%' AND ty.video_url NOT LIKE '//%'
  AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'videos/' || SUBSTRING(ty.video_url FROM 9));

-- 13. media_videos (thumbnail_url, video_url)
-- Thumbnails are images: mapped to verified image folders, NEVER to videos/
UPDATE public.media_videos mv
SET thumbnail_url = 'https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media/' || (
    CASE 
        WHEN mv.thumbnail_url LIKE '/images/thumbnails/%' THEN 'portfolio/' || SUBSTRING(mv.thumbnail_url FROM 20)
        WHEN mv.thumbnail_url LIKE '/images/clients/%' THEN 'clients/' || SUBSTRING(mv.thumbnail_url FROM 17)
        WHEN mv.thumbnail_url LIKE '/images/influencers/%' THEN 'influencers/' || SUBSTRING(mv.thumbnail_url FROM 21)
        WHEN mv.thumbnail_url = '/images/pothys.png' THEN 'branding/pothys.png'
        WHEN mv.thumbnail_url = '/images/riyas.jpg' THEN 'branding/riyas.jpg'
        WHEN mv.thumbnail_url = '/images/final bro.png' THEN 'branding/final bro.png'
    END
)
WHERE mv.thumbnail_url NOT LIKE 'http%' AND mv.thumbnail_url NOT LIKE '//%'
  AND (
    (mv.thumbnail_url LIKE '/images/thumbnails/%' AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'portfolio/' || SUBSTRING(mv.thumbnail_url FROM 20)))
    OR (mv.thumbnail_url LIKE '/images/clients/%' AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'clients/' || SUBSTRING(mv.thumbnail_url FROM 17)))
    OR (mv.thumbnail_url LIKE '/images/influencers/%' AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'influencers/' || SUBSTRING(mv.thumbnail_url FROM 21)))
    OR (mv.thumbnail_url = '/images/pothys.png' AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'branding/pothys.png'))
    OR (mv.thumbnail_url = '/images/riyas.jpg' AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'branding/riyas.jpg'))
    OR (mv.thumbnail_url = '/images/final bro.png' AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'branding/final bro.png'))
  );

UPDATE public.media_videos mv
SET video_url = 'https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media/videos/' || SUBSTRING(mv.video_url FROM 9)
WHERE mv.video_url LIKE '/videos/%' AND mv.video_url NOT LIKE 'http%' AND mv.video_url NOT LIKE '//%'
  AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'videos/' || SUBSTRING(mv.video_url FROM 9));

-- 14. gallery_items (image) -> gallery/
UPDATE public.gallery_items gi
SET image = 'https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media/gallery/' || SUBSTRING(gi.image FROM 17)
WHERE gi.image LIKE '/images/gallery/%' AND gi.image NOT LIKE 'http%' AND gi.image NOT LIKE '//%'
  AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'gallery/' || SUBSTRING(gi.image FROM 17));

-- 15. riyas_gallery_items (image) -> gallery/
UPDATE public.riyas_gallery_items rgi
SET image = 'https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media/gallery/' || SUBSTRING(rgi.image FROM 17)
WHERE rgi.image LIKE '/images/gallery/%' AND rgi.image NOT LIKE 'http%' AND rgi.image NOT LIKE '//%'
  AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'gallery/' || SUBSTRING(rgi.image FROM 17));

-- 16. testimonials (image) -> testimonials/
UPDATE public.testimonials t
SET image = 'https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media/testimonials/' || SUBSTRING(t.image FROM 22)
WHERE t.image LIKE '/images/testimonials/%' AND t.image NOT LIKE 'http%' AND t.image NOT LIKE '//%'
  AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'testimonials/' || SUBSTRING(t.image FROM 22));

-- 17. seo_metadata (og_image_url)
UPDATE public.seo_metadata sm
SET og_image_url = 'https://hlyxzhafdjyflwcdecmp.supabase.co/storage/v1/object/public/rfr-media/' || (
    CASE 
        WHEN sm.og_image_url = '/images/riyas.jpg' THEN 'branding/riyas.jpg'
        WHEN sm.og_image_url = '/images/final bro.png' THEN 'branding/final bro.png'
        WHEN sm.og_image_url = '/images/pothys.png' THEN 'branding/pothys.png'
        WHEN sm.og_image_url LIKE '/images/clients/%' THEN 'clients/' || SUBSTRING(sm.og_image_url FROM 17)
        WHEN sm.og_image_url LIKE '/images/influencers/%' THEN 'influencers/' || SUBSTRING(sm.og_image_url FROM 21)
        WHEN sm.og_image_url LIKE '/news and press/%' THEN 'press/' || SUBSTRING(sm.og_image_url FROM 17)
    END
)
WHERE sm.og_image_url NOT LIKE 'http%' AND sm.og_image_url NOT LIKE '//%'
  AND (
    (sm.og_image_url = '/images/riyas.jpg' AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'branding/riyas.jpg'))
    OR (sm.og_image_url = '/images/final bro.png' AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'branding/final bro.png'))
    OR (sm.og_image_url = '/images/pothys.png' AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'branding/pothys.png'))
    OR (sm.og_image_url LIKE '/images/clients/%' AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'clients/' || SUBSTRING(sm.og_image_url FROM 17)))
    OR (sm.og_image_url LIKE '/images/influencers/%' AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'influencers/' || SUBSTRING(sm.og_image_url FROM 21)))
    OR (sm.og_image_url LIKE '/news and press/%' AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'rfr-media' AND name = 'press/' || SUBSTRING(sm.og_image_url FROM 17)))
  );

COMMIT;
