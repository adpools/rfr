-- ==============================================================================
-- RFR BY RIYAS — ROLLBACK: SEED GENUINE TIMELINE (2021–2025 & AUTHENTIC EVENTS)
-- Execution target: hlyxzhafdjyflwcdecmp
-- Safe, Fail-closed rollback
-- PRESERVES: 
--   1. Existing 2026 Year ('6736b7bf-19dd-48ec-b6b1-ef3ee9dfe72b')
--   2. Existing 2026 Test Event ('cc8e67c2-9456-4e3b-acd9-92fa7cd21589')
-- ==============================================================================

BEGIN;

-- 1. Delete seeded timeline events (child records first to satisfy FK RESTRICT)
DELETE FROM public.timeline_events 
WHERE id = ANY(ARRAY[
    '2656c6e4-99b9-4723-89fa-2d8b3749a4c9'::uuid,
    '546aa6ca-aa9f-4c39-ab72-ae32cfa5eae8'::uuid,
    '95021a32-25c6-489e-97b7-8946a71a6812'::uuid,
    '78ff984a-e05d-4a5b-807e-d1a5b2dc2b49'::uuid,
    'e949fc6a-af95-4630-a34d-08d9d56a497d'::uuid,
    '1a162db3-403f-460e-8435-4354afcae604'::uuid,
    '6bed1472-b491-450d-a0a4-4c5416c50a98'::uuid,
    '4ee6866b-4117-46e6-87fb-22b5d29e47ea'::uuid,
    'a9f99ab5-60a9-4ef4-8693-78337b64f207'::uuid,
    '4240c0d7-885c-4523-b762-6ea4e6d4b3ed'::uuid,
    '6bef124f-1564-4df0-8505-bbdd6db9a1a1'::uuid,
    'ada3100f-7ec4-4911-9bf4-4378395445e7'::uuid,
    '43464a36-2ca6-4d24-a5f9-1c04f046b957'::uuid,
    'cc2d28fd-9f51-4a98-8e4d-5e830188f3f1'::uuid,
    '459e2d52-49ce-44a6-aefe-290c249eaa4d'::uuid,
    '867e6c14-f9ed-4ffe-a2ff-5c37320241ae'::uuid,
    '2acc4282-3feb-46f4-b692-c942a098278d'::uuid,
    '464462ce-c9c4-47fb-89b6-10530382c0ad'::uuid,
    'c05f4753-1867-4e94-a3d7-afbc103adafc'::uuid,
    '0159c50f-f1c0-40d7-84db-5e73caa14e57'::uuid,
    'd477f50f-b781-40f2-8180-76d5d45612ea'::uuid,
    '43aca788-ba50-47d6-aad4-eed5dedcf4d3'::uuid,
    'f93f3d43-6be5-4d96-94d2-f2eb2555f3e5'::uuid,
    '0aa44d16-4254-4b2d-84eb-0c8f97184cd6'::uuid,
    'bb646538-6fe0-4e8b-8eef-532368ebbf0d'::uuid,
    '72d493c9-8dbb-4b02-b975-eb921fe65d46'::uuid,
    '297425e4-71ff-4252-b2a1-61134261c98c'::uuid,
    '0236a2a5-656e-4ad4-a8b7-18fecc99ce8b'::uuid,
    'bfe3f992-05a5-4a9b-8d9f-07ac91887dc1'::uuid,
    '260e0a95-a930-4b07-8f02-fa254411af48'::uuid,
    'a802c086-4ac5-4e01-b1c5-8428081b757c'::uuid,
    '039f7ff0-a3e0-4313-ab6b-d71636593b06'::uuid,
    '97407a59-8afc-43ed-942c-5733eafceb21'::uuid,
    '6854ecfa-d495-488c-aca2-e3affe6f2f12'::uuid,
    'c034aaff-6ad3-407e-89b0-db7557a2bb1e'::uuid,
    'd62989f5-3bbf-44ff-92ac-3b076cffdbd5'::uuid,
    '922ac88d-aa98-43c7-a9d5-4d223ca7ddf2'::uuid,
    'e016b890-8cd5-4fa4-ae38-85d39529dd01'::uuid,
    'add503e7-e4bb-46cd-bf48-ef36c9c4b415'::uuid,
    '2e286990-ef2f-487d-a034-032bcad737f7'::uuid,
    '8a5c4cad-5fca-4fd7-9fd1-ab56b2497597'::uuid,
    '4cc8525a-0294-4299-830c-11612098978c'::uuid,
    '49865ef8-31f7-4474-a5ac-d49980a4e449'::uuid,
    '3d93e292-d1cb-4f62-ae7a-595647a7971f'::uuid,
    'ae0a2aad-ab5d-46db-b76c-5792677e3a33'::uuid,
    '2b331f12-6945-4a1f-8a00-5bf511298a30'::uuid,
    '5ff603a1-3555-4372-a3af-a1a13a8f568e'::uuid,
    '9f9ecdd2-0712-4872-94bf-38feb030241e'::uuid,
    'e95d5b12-ac08-4e0f-a867-bc07be0103b3'::uuid,
    'ecdd3467-1e7a-4c18-9b0a-a9ef64cd73f1'::uuid,
    '76f73791-024f-46d2-9436-3be9286808a3'::uuid,
    '97a8304c-538f-4fe2-8219-9dff0751bcba'::uuid,
    'aafb5fff-1f61-4256-979b-bd66c9666dc4'::uuid,
    '4b820183-f51d-4d52-8506-1d5e8fc4851a'::uuid,
    'b55e8405-1caa-4590-99a2-0d753659f0f3'::uuid,
    'e2c12813-c46e-4789-a53f-4532d7e494c7'::uuid,
    'c448867a-db01-4edc-9aa9-75b86b1cbbf8'::uuid,
    'cee8c641-6598-4a04-9d53-b2211bcd3a5c'::uuid,
    '51d38e80-7a63-401a-9af5-08b8e430267d'::uuid,
    '7b3d2191-452e-4e23-9104-eb12ab18370d'::uuid,
    'ac59734b-666b-4eeb-aa76-ae5ffd46d0af'::uuid,
    '3b4b4d31-6519-4da0-bb3a-f5ec2b7f50ea'::uuid,
    '6aafb5dc-43e1-4a54-8377-c19826b98d8f'::uuid,
    'a2a5c98c-ab9e-4c1b-a454-eaac747aa9f4'::uuid
]);

-- 2. Delete seeded timeline years (2021–2025 only)
DELETE FROM public.timeline_years 
WHERE id = ANY(ARRAY[
    'c95420c4-1346-4240-9750-11ec1d39143d'::uuid,
    '8e014a83-2ec0-4bb4-a71c-fd81efb4064a'::uuid,
    'ec57088c-1a39-439d-960d-2957295fe73d'::uuid,
    '022da710-9b91-465e-96f7-de9b613a8943'::uuid,
    'bad867e2-d278-4019-a27c-24678f4e2539'::uuid
]);

COMMIT;
