-- ==============================================================================
-- RFR BY RIYAS — MIGRATION: CLEANUP APPROVED TEMPORARY TEST DATA (STEP 7)
-- Target Database: Supabase PostgreSQL (hlyxzhafdjyflwcdecmp)
-- Scope: Exactly 14 approved temporary test records
--   - 9 draft testimonials: 00000000-0000-4000-a002-000000000004 through ...0012
--   - 4 draft press articles: 00000000-0000-4000-a004-000000000005 through ...0008
--   - 1 inception marker event: 00000000-0000-4000-a001-000000000001
-- Safe, Idempotent, Atomic transaction. Deletes by exact UUID only.
-- Preserves ALL genuine content, published records, assets, and super-admin.
-- ==============================================================================

BEGIN;

-- 1. Delete 9 Draft / Unverified Testimonials by Exact UUID
DELETE FROM public.testimonials
WHERE id IN (
    '00000000-0000-4000-a002-000000000004'::uuid,
    '00000000-0000-4000-a002-000000000005'::uuid,
    '00000000-0000-4000-a002-000000000006'::uuid,
    '00000000-0000-4000-a002-000000000007'::uuid,
    '00000000-0000-4000-a002-000000000008'::uuid,
    '00000000-0000-4000-a002-000000000009'::uuid,
    '00000000-0000-4000-a002-000000000010'::uuid,
    '00000000-0000-4000-a002-000000000011'::uuid,
    '00000000-0000-4000-a002-000000000012'::uuid
);

-- 2. Delete 4 Draft / Unverified Press Clippings by Exact UUID
DELETE FROM public.press_articles
WHERE id IN (
    '00000000-0000-4000-a004-000000000005'::uuid,
    '00000000-0000-4000-a004-000000000006'::uuid,
    '00000000-0000-4000-a004-000000000007'::uuid,
    '00000000-0000-4000-a004-000000000008'::uuid
);

-- 3. Delete 1 Inception Marker Timeline Event by Exact UUID
DELETE FROM public.timeline_events
WHERE id = '00000000-0000-4000-a001-000000000001'::uuid;

-- 4. Record the cleanup action in admin activity audit log
INSERT INTO public.admin_activity_logs (
    admin_email,
    action,
    entity_table,
    entity_id,
    details
) VALUES (
    'advriyas@gmail.com',
    'CLEANUP_TEST_DATA',
    'system_cleanup',
    'step7-cleanup',
    jsonb_build_object(
        'deleted_testimonials_count', 9,
        'deleted_press_count', 4,
        'deleted_timeline_events_count', 1,
        'total_deleted', 14,
        'timestamp', now()
    )
);

COMMIT;

