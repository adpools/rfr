-- ==============================================================================
-- RFR BY RIYAS — ROLLBACK: SEED HERO BANNERS (PRIORITY 3)
-- Execution target: hlyxzhafdjyflwcdecmp
-- Safe rollback for the 4 seeded hero banner pillars
-- ==============================================================================

BEGIN;

DELETE FROM public.hero_banners 
WHERE id = ANY(ARRAY[
    'b0000001-0000-4000-8000-000000000001'::uuid,
    'b0000001-0000-4000-8000-000000000002'::uuid,
    'b0000001-0000-4000-8000-000000000003'::uuid,
    'b0000001-0000-4000-8000-000000000004'::uuid
]);

COMMIT;

