-- ==============================================================================
-- RFR BY RIYAS — PHASE 1 HARDENED DATABASE MIGRATION & MASTER CONTENT SEED (VERSION 17.11)
-- Target Schema: PostgreSQL 15+ / Supabase
-- Operational Mode: ATOMIC TRANSACTION (BEGIN ... COMMIT)
-- Object Identity Protection: Fail-Closed Ownership Ledger Verification
-- ==============================================================================

BEGIN;

-- ==============================================================================
-- SECTION 1: PREFLIGHT COLLISION DETECTION & MUTEX TABLE VERIFICATION
-- ==============================================================================

DO $$
DECLARE
    v_collisions TEXT[];
BEGIN
    -- 1. Verify that newly created extension and support tables do not already exist
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = '_phase1_created_objects') THEN
        RAISE EXCEPTION 'MIGRATION ABORTED: Ledger table public._phase1_created_objects already exists from a prior state'
            USING ERRCODE = '54000';
    END IF;

    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'admin_mutation_locks') THEN
        RAISE EXCEPTION 'MIGRATION ABORTED: Mutex table public.admin_mutation_locks already exists'
            USING ERRCODE = '54001';
    END IF;

    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'contact_rate_limits') THEN
        RAISE EXCEPTION 'MIGRATION ABORTED: Table public.contact_rate_limits already exists'
            USING ERRCODE = '54001';
    END IF;

    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'services_catalog') THEN
        RAISE EXCEPTION 'MIGRATION ABORTED: Table public.services_catalog already exists'
            USING ERRCODE = '54001';
    END IF;

    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'talent_guild_pillars') THEN
        RAISE EXCEPTION 'MIGRATION ABORTED: Table public.talent_guild_pillars already exists'
            USING ERRCODE = '54001';
    END IF;

    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'ecosystem_nodes') THEN
        RAISE EXCEPTION 'MIGRATION ABORTED: Table public.ecosystem_nodes already exists'
            USING ERRCODE = '54001';
    END IF;

    -- 2. Preflight-check all 168 reserved seed UUIDs across existing tables
    SELECT array_agg(t.tbl || ' (id: ' || t.id::text || ')')
    INTO v_collisions
    FROM (
        SELECT 'timeline_years' AS tbl, id FROM public.timeline_years WHERE id = ANY(ARRAY[
    '00000000-0000-4000-a000-000000002020'::uuid,
    '00000000-0000-4000-a000-000000002021'::uuid,
    '00000000-0000-4000-a000-000000002022'::uuid,
    '00000000-0000-4000-a000-000000002023'::uuid,
    '00000000-0000-4000-a000-000000002024'::uuid,
    '00000000-0000-4000-a000-000000002025'::uuid,
    '00000000-0000-4000-a000-000000002026'::uuid
])
        UNION ALL
        SELECT 'timeline_events', id FROM public.timeline_events WHERE id = ANY(ARRAY[
    '00000000-0000-4000-a001-000000000001'::uuid,
    '00000000-0000-4000-a001-000000000002'::uuid,
    '00000000-0000-4000-a001-000000000003'::uuid,
    '00000000-0000-4000-a001-000000000004'::uuid,
    '00000000-0000-4000-a001-000000000005'::uuid,
    '00000000-0000-4000-a001-000000000006'::uuid,
    '00000000-0000-4000-a001-000000000007'::uuid,
    '00000000-0000-4000-a001-000000000008'::uuid,
    '00000000-0000-4000-a001-000000000009'::uuid,
    '00000000-0000-4000-a001-000000000010'::uuid,
    '00000000-0000-4000-a001-000000000011'::uuid,
    '00000000-0000-4000-a001-000000000012'::uuid,
    '00000000-0000-4000-a001-000000000013'::uuid,
    '00000000-0000-4000-a001-000000000014'::uuid,
    '00000000-0000-4000-a001-000000000015'::uuid,
    '00000000-0000-4000-a001-000000000016'::uuid,
    '00000000-0000-4000-a001-000000000017'::uuid,
    '00000000-0000-4000-a001-000000000018'::uuid,
    '00000000-0000-4000-a001-000000000019'::uuid,
    '00000000-0000-4000-a001-000000000020'::uuid,
    '00000000-0000-4000-a001-000000000021'::uuid,
    '00000000-0000-4000-a001-000000000022'::uuid,
    '00000000-0000-4000-a001-000000000023'::uuid,
    '00000000-0000-4000-a001-000000000024'::uuid,
    '00000000-0000-4000-a001-000000000025'::uuid,
    '00000000-0000-4000-a001-000000000026'::uuid,
    '00000000-0000-4000-a001-000000000027'::uuid,
    '00000000-0000-4000-a001-000000000028'::uuid,
    '00000000-0000-4000-a001-000000000029'::uuid,
    '00000000-0000-4000-a001-000000000030'::uuid,
    '00000000-0000-4000-a001-000000000031'::uuid,
    '00000000-0000-4000-a001-000000000032'::uuid,
    '00000000-0000-4000-a001-000000000033'::uuid,
    '00000000-0000-4000-a001-000000000034'::uuid,
    '00000000-0000-4000-a001-000000000035'::uuid,
    '00000000-0000-4000-a001-000000000036'::uuid,
    '00000000-0000-4000-a001-000000000037'::uuid,
    '00000000-0000-4000-a001-000000000038'::uuid,
    '00000000-0000-4000-a001-000000000039'::uuid,
    '00000000-0000-4000-a001-000000000040'::uuid,
    '00000000-0000-4000-a001-000000000041'::uuid,
    '00000000-0000-4000-a001-000000000042'::uuid,
    '00000000-0000-4000-a001-000000000043'::uuid,
    '00000000-0000-4000-a001-000000000044'::uuid,
    '00000000-0000-4000-a001-000000000045'::uuid,
    '00000000-0000-4000-a001-000000000046'::uuid,
    '00000000-0000-4000-a001-000000000047'::uuid,
    '00000000-0000-4000-a001-000000000048'::uuid,
    '00000000-0000-4000-a001-000000000049'::uuid,
    '00000000-0000-4000-a001-000000000050'::uuid,
    '00000000-0000-4000-a001-000000000051'::uuid,
    '00000000-0000-4000-a001-000000000052'::uuid,
    '00000000-0000-4000-a001-000000000053'::uuid,
    '00000000-0000-4000-a001-000000000054'::uuid,
    '00000000-0000-4000-a001-000000000055'::uuid,
    '00000000-0000-4000-a001-000000000056'::uuid,
    '00000000-0000-4000-a001-000000000057'::uuid,
    '00000000-0000-4000-a001-000000000058'::uuid,
    '00000000-0000-4000-a001-000000000059'::uuid,
    '00000000-0000-4000-a001-000000000060'::uuid,
    '00000000-0000-4000-a001-000000000061'::uuid,
    '00000000-0000-4000-a001-000000000062'::uuid,
    '00000000-0000-4000-a001-000000000063'::uuid,
    '00000000-0000-4000-a001-000000000064'::uuid,
    '00000000-0000-4000-a001-000000000065'::uuid
])
        UNION ALL
        SELECT 'testimonials', id FROM public.testimonials WHERE id = ANY(ARRAY[
    '00000000-0000-4000-a002-000000000001'::uuid,
    '00000000-0000-4000-a002-000000000002'::uuid,
    '00000000-0000-4000-a002-000000000003'::uuid,
    '00000000-0000-4000-a002-000000000004'::uuid,
    '00000000-0000-4000-a002-000000000005'::uuid,
    '00000000-0000-4000-a002-000000000006'::uuid,
    '00000000-0000-4000-a002-000000000007'::uuid,
    '00000000-0000-4000-a002-000000000008'::uuid,
    '00000000-0000-4000-a002-000000000009'::uuid,
    '00000000-0000-4000-a002-000000000010'::uuid,
    '00000000-0000-4000-a002-000000000011'::uuid,
    '00000000-0000-4000-a002-000000000012'::uuid
])
        UNION ALL
        SELECT 'partners_clients', id FROM public.partners_clients WHERE id = ANY(ARRAY[
    '00000000-0000-4000-a003-000000000001'::uuid,
    '00000000-0000-4000-a003-000000000002'::uuid,
    '00000000-0000-4000-a003-000000000003'::uuid,
    '00000000-0000-4000-a003-000000000004'::uuid,
    '00000000-0000-4000-a003-000000000005'::uuid,
    '00000000-0000-4000-a003-000000000006'::uuid,
    '00000000-0000-4000-a003-000000000007'::uuid,
    '00000000-0000-4000-a003-000000000008'::uuid,
    '00000000-0000-4000-a003-000000000009'::uuid,
    '00000000-0000-4000-a003-000000000010'::uuid,
    '00000000-0000-4000-a003-000000000011'::uuid,
    '00000000-0000-4000-a003-000000000012'::uuid,
    '00000000-0000-4000-a003-000000000013'::uuid,
    '00000000-0000-4000-a003-000000000014'::uuid,
    '00000000-0000-4000-a003-000000000015'::uuid,
    '00000000-0000-4000-a003-000000000016'::uuid,
    '00000000-0000-4000-a003-000000000017'::uuid,
    '00000000-0000-4000-a003-000000000018'::uuid
])
        UNION ALL
        SELECT 'press_articles', id FROM public.press_articles WHERE id = ANY(ARRAY[
    '00000000-0000-4000-a004-000000000001'::uuid,
    '00000000-0000-4000-a004-000000000002'::uuid,
    '00000000-0000-4000-a004-000000000003'::uuid,
    '00000000-0000-4000-a004-000000000004'::uuid,
    '00000000-0000-4000-a004-000000000005'::uuid,
    '00000000-0000-4000-a004-000000000006'::uuid,
    '00000000-0000-4000-a004-000000000007'::uuid,
    '00000000-0000-4000-a004-000000000008'::uuid
])
        UNION ALL
        SELECT 'about_riyas', id FROM public.about_riyas WHERE id = ANY(ARRAY[
    '00000000-0000-4000-a005-000000000001'::uuid
])
        UNION ALL
        SELECT 'riyas_gallery_items', id FROM public.riyas_gallery_items WHERE id = ANY(ARRAY[
    '00000000-0000-4000-a006-000000000001'::uuid,
    '00000000-0000-4000-a006-000000000002'::uuid,
    '00000000-0000-4000-a006-000000000003'::uuid,
    '00000000-0000-4000-a006-000000000004'::uuid,
    '00000000-0000-4000-a006-000000000005'::uuid,
    '00000000-0000-4000-a006-000000000006'::uuid,
    '00000000-0000-4000-a006-000000000007'::uuid,
    '00000000-0000-4000-a006-000000000008'::uuid,
    '00000000-0000-4000-a006-000000000009'::uuid,
    '00000000-0000-4000-a006-000000000010'::uuid,
    '00000000-0000-4000-a006-000000000011'::uuid,
    '00000000-0000-4000-a006-000000000012'::uuid
])
        UNION ALL
        SELECT 'gallery_categories', id FROM public.gallery_categories WHERE id = ANY(ARRAY[
    '00000000-0000-4000-a007-000000000001'::uuid,
    '00000000-0000-4000-a007-000000000002'::uuid,
    '00000000-0000-4000-a007-000000000003'::uuid,
    '00000000-0000-4000-a007-000000000004'::uuid
])
        UNION ALL
        SELECT 'gallery_items', id FROM public.gallery_items WHERE id = ANY(ARRAY[
    '00000000-0000-4000-a008-000000000001'::uuid,
    '00000000-0000-4000-a008-000000000002'::uuid,
    '00000000-0000-4000-a008-000000000003'::uuid,
    '00000000-0000-4000-a008-000000000004'::uuid,
    '00000000-0000-4000-a008-000000000005'::uuid,
    '00000000-0000-4000-a008-000000000006'::uuid,
    '00000000-0000-4000-a008-000000000007'::uuid,
    '00000000-0000-4000-a008-000000000008'::uuid,
    '00000000-0000-4000-a008-000000000009'::uuid,
    '00000000-0000-4000-a008-000000000010'::uuid,
    '00000000-0000-4000-a008-000000000011'::uuid,
    '00000000-0000-4000-a008-000000000012'::uuid,
    '00000000-0000-4000-a008-000000000013'::uuid,
    '00000000-0000-4000-a008-000000000014'::uuid,
    '00000000-0000-4000-a008-000000000015'::uuid,
    '00000000-0000-4000-a008-000000000016'::uuid
])
        UNION ALL
        SELECT 'social_links', id FROM public.social_links WHERE id = ANY(ARRAY[
    '00000000-0000-4000-a009-000000000001'::uuid,
    '00000000-0000-4000-a009-000000000002'::uuid,
    '00000000-0000-4000-a009-000000000003'::uuid,
    '00000000-0000-4000-a009-000000000004'::uuid
])
        UNION ALL
        SELECT 'hero_banners', id FROM public.hero_banners WHERE id = ANY(ARRAY[
    '00000000-0000-4000-a00a-000000000001'::uuid
])
    ) t;

    IF v_collisions IS NOT NULL AND array_length(v_collisions, 1) > 0 THEN
        RAISE EXCEPTION 'MIGRATION ABORTED: Preflight detected collisions on reserved UUIDs: %', 
            array_to_string(v_collisions, ', ')
            USING ERRCODE = '23505';
    END IF;

    RAISE NOTICE 'Preflight passed: Zero collisions across all 168 reserved UUIDs.';
END $$;

-- ==============================================================================
-- SECTION 2: CREATION OF OWNERSHIP LEDGER, MUTEX & SUPPORT TABLES
-- ==============================================================================

-- 1. Ownership Ledger
CREATE TABLE public._phase1_created_objects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    migration_id TEXT NOT NULL DEFAULT '20261107_phase1_hardened_seed',
    object_type TEXT NOT NULL CHECK (object_type IN ('TABLE', 'SUPPORT_TABLE', 'FUNCTION', 'POLICY', 'POLICY_ALTERATION', 'PRIVILEGE_ALTERATION', 'SEED_RECORD')),
    schema_name TEXT NOT NULL DEFAULT 'public',
    object_name TEXT NOT NULL,
    identity_arguments TEXT,
    parent_table TEXT,
    recorded_oid OID NOT NULL,
    recorded_signature TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT pg_catalog.now()
);

REVOKE ALL ON TABLE public._phase1_created_objects FROM PUBLIC, anon, authenticated;
GRANT ALL ON TABLE public._phase1_created_objects TO postgres;
ALTER TABLE public._phase1_created_objects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public._phase1_created_objects FORCE ROW LEVEL SECURITY;

-- 2. Staff Lifecycle Mutation Mutex Table
CREATE TABLE public.admin_mutation_locks (
    lock_key TEXT PRIMARY KEY,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT pg_catalog.now()
);

REVOKE ALL ON TABLE public.admin_mutation_locks FROM PUBLIC, anon, authenticated;
GRANT ALL ON TABLE public.admin_mutation_locks TO postgres;

-- Seed the single mutex serialization lock row
INSERT INTO public.admin_mutation_locks (lock_key, description)
VALUES ('super_admin_invariant_lock', 'Serialization mutex for all privileged staff lifecycle mutations');

-- 3. Contact Rate Limits Table (Keyed HMAC-SHA256 digests)
CREATE TABLE public.contact_rate_limits (
    ip_hash BYTEA PRIMARY KEY,
    submission_count INT NOT NULL DEFAULT 1,
    window_start TIMESTAMPTZ NOT NULL DEFAULT pg_catalog.now()
);

CREATE INDEX idx_contact_rate_limits_window ON public.contact_rate_limits (window_start);

REVOKE ALL ON TABLE public.contact_rate_limits FROM PUBLIC, anon, authenticated;
GRANT ALL ON TABLE public.contact_rate_limits TO postgres;

-- 4. Services Catalog Table
CREATE TABLE public.services_catalog (
    id UUID PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('events', 'campaigns', 'podcast')),
    badge TEXT NOT NULL,
    subheading TEXT NOT NULL,
    description TEXT NOT NULL,
    detailed_overview TEXT NOT NULL,
    key_highlights TEXT[] DEFAULT '{}',
    deliverables TEXT[] DEFAULT '{}',
    target_audience TEXT NOT NULL,
    image TEXT NOT NULL,
    accent_image TEXT,
    video_url TEXT,
    video_embed_url TEXT,
    drive_folder_url TEXT,
    stats JSONB DEFAULT '[]'::jsonb,
    featured_brands TEXT[] DEFAULT '{}',
    sort_order INT NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT pg_catalog.now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT pg_catalog.now()
);

-- 5. Talent Guild Pillars Table
CREATE TABLE public.talent_guild_pillars (
    id UUID PRIMARY KEY,
    pillar_id TEXT UNIQUE NOT NULL CHECK (pillar_id IN ('careers', 'models', 'influencers', 'artists')),
    title TEXT NOT NULL,
    tagline TEXT NOT NULL,
    description TEXT NOT NULL,
    opportunities TEXT[] DEFAULT '{}',
    requirements TEXT[] DEFAULT '{}',
    cta_label TEXT NOT NULL DEFAULT 'APPLY NOW',
    image TEXT NOT NULL,
    gallery TEXT[] DEFAULT '{}',
    sort_order INT NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT pg_catalog.now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT pg_catalog.now()
);

-- 6. Ecosystem Nodes Table
CREATE TABLE public.ecosystem_nodes (
    id UUID PRIMARY KEY,
    node_id TEXT UNIQUE NOT NULL,
    label TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    x NUMERIC NOT NULL DEFAULT 0,
    y NUMERIC NOT NULL DEFAULT 0,
    z NUMERIC NOT NULL DEFAULT 0,
    connections TEXT[] DEFAULT '{}',
    color TEXT NOT NULL DEFAULT '#C7A46A',
    sort_order INT NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT pg_catalog.now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT pg_catalog.now()
);

-- ==============================================================================
-- SECTION 3: CREATION OF HARDENED SECURITY & RPC FUNCTIONS
-- ==============================================================================

-- 1. Canonical Migration Object Signature Verifier
CREATE OR REPLACE FUNCTION public.compute_migration_object_signature(
    p_object_type TEXT,
    p_schema TEXT,
    p_object_name TEXT,
    p_identity_args TEXT DEFAULT NULL,
    p_parent_table TEXT DEFAULT NULL
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
DECLARE
    v_raw TEXT;
BEGIN
    IF p_object_type = 'TABLE' OR p_object_type = 'SUPPORT_TABLE' THEN
        SELECT string_agg(item, E'\n' ORDER BY item) INTO v_raw
        FROM (
            SELECT 'COL:' || column_name || ':' || data_type || ':' || is_nullable || ':' || coalesce(column_default, '<none>') AS item
            FROM information_schema.columns
            WHERE table_schema = p_schema AND table_name = p_object_name
            UNION ALL
            SELECT 'OWNER:' || r.rolname
            FROM pg_class c
            JOIN pg_namespace n ON c.relnamespace = n.oid
            JOIN pg_roles r ON c.relowner = r.oid
            WHERE n.nspname = p_schema AND c.relname = p_object_name
        ) sub;

    ELSIF p_object_type = 'FUNCTION' THEN
        SELECT string_agg(item, E'\n' ORDER BY item) INTO v_raw
        FROM (
            SELECT 'FUNC:' || p.proname || ':' || 
                   pg_get_function_identity_arguments(p.oid) || ':' || 
                   pg_get_function_result(p.oid) || ':' || 
                   p.prosecdef::text || ':' || 
                   p.provolatile::text || ':' || 
                   r.rolname || ':' || 
                   encode(sha256(convert_to(p.prosrc, 'UTF8')), 'hex') AS item
            FROM pg_proc p
            JOIN pg_namespace n ON p.pronamespace = n.oid
            JOIN pg_roles r ON p.proowner = r.oid
            WHERE n.nspname = p_schema 
              AND p.proname = p_object_name
              AND (p_identity_args IS NULL OR pg_get_function_identity_arguments(p.oid) = p_identity_args)
        ) sub;

    ELSIF p_object_type = 'POLICY' THEN
        SELECT 'POL:' || pol.polname || ':' || pol.polcmd::text || ':' || 
               coalesce(pg_get_expr(pol.polqual, pol.polrelid), '<none>') || ':' || 
               coalesce(pg_get_expr(pol.polwithcheck, pol.polrelid), '<none>')
        INTO v_raw
        FROM pg_policy pol
        JOIN pg_class t ON pol.polrelid = t.oid
        JOIN pg_namespace n ON t.relnamespace = n.oid
        WHERE n.nspname = p_schema AND t.relname = p_parent_table AND pol.polname = p_object_name;

    ELSIF p_object_type = 'POLICY_ALTERATION' THEN
        v_raw := 'POL_ALT:' || coalesce(p_parent_table, '<none>') || ':' || p_object_name;

    ELSIF p_object_type = 'PRIVILEGE_ALTERATION' THEN
        v_raw := 'PRIV_ALT:' || coalesce(p_parent_table, '<none>') || ':' || p_object_name || ':' || coalesce(p_identity_args, '<none>');

    ELSIF p_object_type = 'SEED_RECORD' THEN
        -- Compute complete SHA-256 content digest of the seed row to detect any post-seed edits
        BEGIN
            EXECUTE format('SELECT encode(sha256(convert_to(row_to_json(r)::text, ''UTF8'')), ''hex'') FROM %I.%I r WHERE id = %L::uuid', 
                p_schema, p_parent_table, p_object_name)
            INTO v_raw;
        EXCEPTION WHEN OTHERS THEN
            v_raw := NULL;
        END;
        RETURN v_raw;
    END IF;

    IF v_raw IS NULL THEN
        RETURN NULL;
    END IF;

    RETURN encode(sha256(convert_to(v_raw, 'UTF8')), 'hex');
END;
$$;

REVOKE ALL ON FUNCTION public.compute_migration_object_signature(TEXT, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.compute_migration_object_signature(TEXT, TEXT, TEXT, TEXT, TEXT) TO postgres;

-- 2. Staff Management: admin_update_staff_role
CREATE OR REPLACE FUNCTION public.admin_update_staff_role(
    p_target_id UUID,
    p_new_role TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
DECLARE
    v_caller_id UUID;
    v_caller_email TEXT;
    v_target_email TEXT;
    v_target_current_role TEXT;
    v_target_is_active BOOLEAN;
    v_active_super_admins INT;
BEGIN
    v_caller_id := auth.uid();
    IF v_caller_id IS NULL THEN
        RAISE EXCEPTION 'AUTHENTICATION_REQUIRED: Valid JWT session required'
            USING ERRCODE = '42501';
    END IF;

    IF p_new_role NOT IN ('super_admin', 'editor') THEN
        RAISE EXCEPTION 'INVALID_PARAMETER: Role must be either super_admin or editor'
            USING ERRCODE = '22023';
    END IF;

    -- Mutex lock
    PERFORM 1 FROM public.admin_mutation_locks 
    WHERE lock_key = 'super_admin_invariant_lock' 
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'SYSTEM_INTEGRITY_ERROR: Global staff mutation lock row is missing'
            USING ERRCODE = 'P0005';
    END IF;

    -- POST-MUTEX caller authorization check
    SELECT email INTO v_caller_email
    FROM public.admin_users
    WHERE id = v_caller_id AND role = 'super_admin' AND is_active = true;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'UNAUTHORIZED: Caller is not an active Super Admin at execution time'
            USING ERRCODE = '42501';
    END IF;

    SELECT email, role, is_active 
    INTO v_target_email, v_target_current_role, v_target_is_active
    FROM public.admin_users
    WHERE id = p_target_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'USER_NOT_FOUND: Target staff profile does not exist'
            USING ERRCODE = 'P0002';
    END IF;

    -- Invariant: Cannot demote the last active super_admin
    IF v_target_current_role = 'super_admin' AND p_new_role != 'super_admin' AND v_target_is_active = true THEN
        SELECT count(*) INTO v_active_super_admins
        FROM public.admin_users
        WHERE role = 'super_admin' AND is_active = true;

        IF v_active_super_admins <= 1 THEN
            RAISE EXCEPTION 'INVARIANT_VIOLATION: Cannot demote the last active Super Admin'
                USING ERRCODE = 'P0004';
        END IF;
    END IF;

    UPDATE public.admin_users
    SET role = p_new_role, updated_at = pg_catalog.now()
    WHERE id = p_target_id;

    -- Log to existing immutable audit table admin_activity_logs
    INSERT INTO public.admin_activity_logs (
        admin_id, admin_email, action, entity_table, entity_id, entity_title, details, ip_address, created_at
    ) VALUES (
        v_caller_id,
        v_caller_email,
        'UPDATE_STAFF_ROLE',
        'admin_users',
        p_target_id::text,
        v_target_email,
        jsonb_build_object('old_role', v_target_current_role, 'new_role', p_new_role),
        inet_client_addr()::text,
        pg_catalog.now()
    );

    RETURN jsonb_build_object(
        'success', true,
        'target_id', p_target_id,
        'new_role', p_new_role,
        'updated_at', pg_catalog.now()
    );
END;
$$;

REVOKE ALL ON FUNCTION public.admin_update_staff_role(UUID, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_update_staff_role(UUID, TEXT) TO authenticated;

-- 3. Staff Management: admin_toggle_staff_active
CREATE OR REPLACE FUNCTION public.admin_toggle_staff_active(
    p_target_id UUID,
    p_is_active BOOLEAN
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
DECLARE
    v_caller_id UUID;
    v_caller_email TEXT;
    v_target_email TEXT;
    v_target_role TEXT;
    v_active_super_admins INT;
BEGIN
    v_caller_id := auth.uid();
    IF v_caller_id IS NULL THEN
        RAISE EXCEPTION 'AUTHENTICATION_REQUIRED: Valid JWT session required'
            USING ERRCODE = '42501';
    END IF;

    PERFORM 1 FROM public.admin_mutation_locks 
    WHERE lock_key = 'super_admin_invariant_lock' 
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'SYSTEM_INTEGRITY_ERROR: Global staff mutation lock row is missing'
            USING ERRCODE = 'P0005';
    END IF;

    -- POST-MUTEX caller check
    SELECT email INTO v_caller_email
    FROM public.admin_users
    WHERE id = v_caller_id AND role = 'super_admin' AND is_active = true;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'UNAUTHORIZED: Caller is not an active Super Admin at execution time'
            USING ERRCODE = '42501';
    END IF;

    SELECT email, role INTO v_target_email, v_target_role
    FROM public.admin_users
    WHERE id = p_target_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'USER_NOT_FOUND: Target staff profile does not exist'
            USING ERRCODE = 'P0002';
    END IF;

    IF v_target_role = 'super_admin' AND p_is_active = false THEN
        SELECT count(*) INTO v_active_super_admins
        FROM public.admin_users
        WHERE role = 'super_admin' AND is_active = true;

        IF v_active_super_admins <= 1 THEN
            RAISE EXCEPTION 'INVARIANT_VIOLATION: Cannot deactivate the last active Super Admin'
                USING ERRCODE = 'P0004';
        END IF;
    END IF;

    UPDATE public.admin_users
    SET is_active = p_is_active, updated_at = pg_catalog.now()
    WHERE id = p_target_id;

    INSERT INTO public.admin_activity_logs (
        admin_id, admin_email, action, entity_table, entity_id, entity_title, details, ip_address, created_at
    ) VALUES (
        v_caller_id,
        v_caller_email,
        'TOGGLE_STAFF_ACTIVE',
        'admin_users',
        p_target_id::text,
        v_target_email,
        jsonb_build_object('is_active', p_is_active),
        inet_client_addr()::text,
        pg_catalog.now()
    );

    RETURN jsonb_build_object(
        'success', true,
        'target_id', p_target_id,
        'is_active', p_is_active,
        'updated_at', pg_catalog.now()
    );
END;
$$;

REVOKE ALL ON FUNCTION public.admin_toggle_staff_active(UUID, BOOLEAN) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_toggle_staff_active(UUID, BOOLEAN) TO authenticated;

-- 4. Staff Management: admin_stage_staff_deletion
CREATE OR REPLACE FUNCTION public.admin_stage_staff_deletion(
    p_target_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
DECLARE
    v_caller_id UUID;
    v_caller_email TEXT;
    v_target_email TEXT;
    v_target_role TEXT;
    v_target_sync_status TEXT;
    v_active_super_admins INT;
BEGIN
    v_caller_id := auth.uid();
    IF v_caller_id IS NULL THEN
        RAISE EXCEPTION 'AUTHENTICATION_REQUIRED: Valid JWT session required'
            USING ERRCODE = '42501';
    END IF;

    PERFORM 1 FROM public.admin_mutation_locks 
    WHERE lock_key = 'super_admin_invariant_lock' 
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'SYSTEM_INTEGRITY_ERROR: Global staff mutation lock row is missing'
            USING ERRCODE = 'P0005';
    END IF;

    -- POST-MUTEX caller check
    SELECT email INTO v_caller_email
    FROM public.admin_users
    WHERE id = v_caller_id AND role = 'super_admin' AND is_active = true;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'UNAUTHORIZED: Caller is not an active Super Admin at execution time'
            USING ERRCODE = '42501';
    END IF;

    SELECT email, role, sync_status 
    INTO v_target_email, v_target_role, v_target_sync_status
    FROM public.admin_users
    WHERE id = p_target_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'USER_NOT_FOUND: Target staff profile does not exist'
            USING ERRCODE = 'P0002';
    END IF;

    IF v_target_sync_status = 'pending_auth_deletion' THEN
        RETURN jsonb_build_object(
            'success', true,
            'staged_id', p_target_id,
            'status', 'already_pending_auth_deletion'
        );
    END IF;

    IF v_target_role = 'super_admin' THEN
        SELECT count(*) INTO v_active_super_admins
        FROM public.admin_users
        WHERE role = 'super_admin' AND is_active = true;

        IF v_active_super_admins <= 1 THEN
            RAISE EXCEPTION 'INVARIANT_VIOLATION: Cannot delete the last active Super Admin'
                USING ERRCODE = 'P0004';
        END IF;
    END IF;

    UPDATE public.admin_users
    SET is_active = false,
        sync_status = 'pending_auth_deletion',
        updated_at = pg_catalog.now()
    WHERE id = p_target_id;

    INSERT INTO public.admin_activity_logs (
        admin_id, admin_email, action, entity_table, entity_id, entity_title, details, ip_address, created_at
    ) VALUES (
        v_caller_id,
        v_caller_email,
        'STAGE_STAFF_DELETION',
        'admin_users',
        p_target_id::text,
        v_target_email,
        jsonb_build_object('sync_status', 'pending_auth_deletion'),
        inet_client_addr()::text,
        pg_catalog.now()
    );

    RETURN jsonb_build_object(
        'success', true,
        'staged_id', p_target_id,
        'status', 'pending_auth_deletion'
    );
END;
$$;

REVOKE ALL ON FUNCTION public.admin_stage_staff_deletion(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_stage_staff_deletion(UUID) TO authenticated;

-- 5. Staff Management: admin_complete_staff_deletion
CREATE OR REPLACE FUNCTION public.admin_complete_staff_deletion(
    p_target_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
DECLARE
    v_caller_id UUID;
    v_caller_email TEXT;
    v_target_email TEXT;
    v_target_role TEXT;
    v_target_is_active BOOLEAN;
    v_target_sync_status TEXT;
BEGIN
    v_caller_id := auth.uid();
    IF v_caller_id IS NULL THEN
        RAISE EXCEPTION 'AUTHENTICATION_REQUIRED: Valid JWT session required'
            USING ERRCODE = '42501';
    END IF;

    PERFORM 1 FROM public.admin_mutation_locks 
    WHERE lock_key = 'super_admin_invariant_lock' 
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'SYSTEM_INTEGRITY_ERROR: Global staff mutation lock row is missing'
            USING ERRCODE = 'P0005';
    END IF;

    -- POST-MUTEX caller check
    SELECT email INTO v_caller_email
    FROM public.admin_users
    WHERE id = v_caller_id AND role = 'super_admin' AND is_active = true;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'UNAUTHORIZED: Caller is not an active Super Admin at execution time'
            USING ERRCODE = '42501';
    END IF;

    SELECT email, role, is_active, sync_status 
    INTO v_target_email, v_target_role, v_target_is_active, v_target_sync_status
    FROM public.admin_users
    WHERE id = p_target_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'USER_NOT_FOUND: Target staff profile does not exist'
            USING ERRCODE = 'P0002';
    END IF;

    IF v_target_sync_status != 'pending_auth_deletion' OR v_target_is_active != false THEN
        RAISE EXCEPTION 'ILLEGAL_STATE: Profile must be staged with sync_status=pending_auth_deletion and is_active=false before final deletion'
            USING ERRCODE = '55000';
    END IF;

    DELETE FROM public.admin_users
    WHERE id = p_target_id;

    INSERT INTO public.admin_activity_logs (
        admin_id, admin_email, action, entity_table, entity_id, entity_title, details, ip_address, created_at
    ) VALUES (
        v_caller_id,
        v_caller_email,
        'COMPLETE_STAFF_DELETION',
        'admin_users',
        p_target_id::text,
        v_target_email,
        jsonb_build_object(
            'email_hash', encode(sha256(convert_to(v_target_email, 'UTF8')), 'hex'),
            'role', v_target_role
        ),
        inet_client_addr()::text,
        pg_catalog.now()
    );

    RETURN jsonb_build_object(
        'success', true,
        'deleted_id', p_target_id,
        'completed_at', pg_catalog.now()
    );
END;
$$;

REVOKE ALL ON FUNCTION public.admin_complete_staff_deletion(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_complete_staff_deletion(UUID) TO authenticated;

-- 6. Staff Management: admin_create_staff_profile
CREATE OR REPLACE FUNCTION public.admin_create_staff_profile(
    p_user_id UUID,
    p_email TEXT,
    p_role TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
DECLARE
    v_caller_id UUID;
    v_caller_email TEXT;
BEGIN
    v_caller_id := auth.uid();
    IF v_caller_id IS NULL THEN
        RAISE EXCEPTION 'AUTHENTICATION_REQUIRED: Valid JWT session required'
            USING ERRCODE = '42501';
    END IF;

    IF p_role != 'editor' THEN
        RAISE EXCEPTION 'SECURITY_VIOLATION: Staff accounts may only be created with the editor role'
            USING ERRCODE = '42501';
    END IF;

    PERFORM 1 FROM public.admin_mutation_locks 
    WHERE lock_key = 'super_admin_invariant_lock' 
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'SYSTEM_INTEGRITY_ERROR: Global staff mutation lock row is missing'
            USING ERRCODE = 'P0005';
    END IF;

    -- POST-MUTEX caller check
    SELECT email INTO v_caller_email
    FROM public.admin_users
    WHERE id = v_caller_id AND role = 'super_admin' AND is_active = true;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'UNAUTHORIZED: Caller is not an active Super Admin at execution time'
            USING ERRCODE = '42501';
    END IF;

    INSERT INTO public.admin_users (id, email, role, is_active, sync_status, created_at, updated_at)
    VALUES (p_user_id, lower(trim(p_email)), 'editor', true, 'synced', pg_catalog.now(), pg_catalog.now());

    INSERT INTO public.admin_activity_logs (
        admin_id, admin_email, action, entity_table, entity_id, entity_title, details, ip_address, created_at
    ) VALUES (
        v_caller_id,
        v_caller_email,
        'CREATE_STAFF_PROFILE',
        'admin_users',
        p_user_id::text,
        lower(trim(p_email)),
        jsonb_build_object('role', 'editor'),
        inet_client_addr()::text,
        pg_catalog.now()
    );

    RETURN jsonb_build_object(
        'success', true,
        'user_id', p_user_id,
        'email', lower(trim(p_email)),
        'role', 'editor'
    );
END;
$$;

REVOKE ALL ON FUNCTION public.admin_create_staff_profile(UUID, TEXT, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_create_staff_profile(UUID, TEXT, TEXT) TO authenticated;

-- 7. Login Timestamp Helper: record_admin_login
CREATE OR REPLACE FUNCTION public.record_admin_login()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
BEGIN
    IF auth.uid() IS NOT NULL THEN
        UPDATE public.admin_users
        SET last_login_at = pg_catalog.now()
        WHERE id = auth.uid();
    END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.record_admin_login() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.record_admin_login() TO authenticated;

-- 8. Contact Form Ingestion: process_contact_submission (Zero HMAC Secrets in Database)
CREATE OR REPLACE FUNCTION public.process_contact_submission(
    p_full_name TEXT,
    p_email TEXT,
    p_phone TEXT,
    p_company_name TEXT,
    p_service_interest TEXT,
    p_budget_range TEXT,
    p_message TEXT,
    p_bot_honey_field TEXT,
    p_ip_hash BYTEA -- Opaque one-way digest computed by Edge Function (NO SECRETS PASSED)
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
DECLARE
    v_count INT;
BEGIN
    -- Honeypot check: If bot filled the field, silently drop without writing
    IF p_bot_honey_field IS NOT NULL AND length(trim(p_bot_honey_field)) > 0 THEN
        RETURN jsonb_build_object('success', true, 'status', 'filtered');
    END IF;

    -- Atomic per-client rate limit (evaluated only if ip_hash is present)
    IF p_ip_hash IS NOT NULL THEN
        INSERT INTO public.contact_rate_limits (ip_hash, submission_count, window_start)
        VALUES (p_ip_hash, 1, pg_catalog.now())
        ON CONFLICT (ip_hash) DO UPDATE
        SET submission_count = CASE 
                WHEN contact_rate_limits.window_start < pg_catalog.now() - INTERVAL '10 minutes' THEN 1
                ELSE contact_rate_limits.submission_count + 1
            END,
            window_start = CASE
                WHEN contact_rate_limits.window_start < pg_catalog.now() - INTERVAL '10 minutes' THEN pg_catalog.now()
                ELSE contact_rate_limits.window_start
            END
        RETURNING submission_count INTO v_count;

        IF v_count > 5 THEN
            RAISE EXCEPTION 'RATE_LIMIT_EXCEEDED: Maximum 5 inquiries per 10 minutes from this network'
                USING ERRCODE = 'P0029';
        END IF;
    END IF;

    -- Insert into existing contact_inquiries table schema
    INSERT INTO public.contact_inquiries (
        full_name,
        email,
        phone,
        company_name,
        service_interest,
        budget_range,
        message,
        bot_honey_field,
        ip_address,
        status,
        created_at,
        updated_at
    ) VALUES (
        trim(p_full_name),
        lower(trim(p_email)),
        CASE WHEN p_phone IS NOT NULL AND trim(p_phone) != '' THEN trim(p_phone) ELSE NULL END,
        trim(p_company_name),
        trim(p_service_interest),
        trim(p_budget_range),
        trim(p_message),
        NULL, -- bot_honey_field is enforced NULL by database CHECK constraint
        NULL, -- Raw IP address is omitted to maintain user privacy
        'new',
        pg_catalog.now(),
        pg_catalog.now()
    );

    RETURN jsonb_build_object('success', true, 'status', 'submitted');
END;
$$;

REVOKE ALL ON FUNCTION public.process_contact_submission(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, BYTEA) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.process_contact_submission(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, BYTEA) TO postgres, service_role;

-- ==============================================================================
-- SECTION 4: CONTACT FORM DIRECT INSERT BYPASS ELIMINATION & ACL CAPTURE
-- ==============================================================================

DO $$
DECLARE
    v_pol_cmd "char";
    v_pol_permissive BOOLEAN;
    v_pol_qual TEXT;
    v_pol_with_check TEXT;
    v_pol_roles OID[];
    v_anon_oid OID;
    v_auth_oid OID;
    v_tbl_oid OID;
    v_priv_sig TEXT;
    v_captured_insert_acl JSONB;
    v_captured_unrelated_acl JSONB;
    v_post_revoke_unrelated_acl JSONB;
    v_post_revoke_insert_acl JSONB;
    v_anon_effective_insert BOOLEAN;
    v_auth_effective_insert BOOLEAN;
    v_leaked_public_roles TEXT[];
BEGIN
    SELECT oid INTO v_anon_oid FROM pg_roles WHERE rolname = 'anon';
    SELECT oid INTO v_auth_oid FROM pg_roles WHERE rolname = 'authenticated';

    -- 1. Preflight assertion: Verify baseline policy exists with complete exact expected definition
    SELECT 
        pol.polcmd,
        pol.polpermissive,
        pg_get_expr(pol.polqual, pol.polrelid),
        pg_get_expr(pol.polwithcheck, pol.polrelid),
        pol.polroles
    INTO 
        v_pol_cmd,
        v_pol_permissive,
        v_pol_qual,
        v_pol_with_check,
        v_pol_roles
    FROM pg_policy pol
    JOIN pg_class c ON pol.polrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE n.nspname = 'public' 
      AND c.relname = 'contact_inquiries' 
      AND pol.polname = 'Public can submit contact inquiries';

    IF v_pol_cmd IS NULL THEN
        RAISE EXCEPTION 'PREFLIGHT_ABORTED: Baseline policy "Public can submit contact inquiries" not found on public.contact_inquiries'
            USING ERRCODE = '55000';
    END IF;

    -- Verify exact catalog attributes: INSERT ('a'), PERMISSIVE, no USING qual, exact WITH CHECK, roles (anon, authenticated)
    IF v_pol_cmd != 'a' OR NOT v_pol_permissive OR v_pol_qual IS NOT NULL OR trim(coalesce(v_pol_with_check, '')) != '(bot_honey_field IS NULL)' THEN
        RAISE EXCEPTION 'PREFLIGHT_ABORTED: Baseline policy "Public can submit contact inquiries" definition mismatch (cmd: %, permissive: %, qual: %, with_check: %)',
            v_pol_cmd, v_pol_permissive, v_pol_qual, v_pol_with_check
            USING ERRCODE = '55000';
    END IF;

    IF v_pol_roles IS DISTINCT FROM ARRAY[v_anon_oid, v_auth_oid] AND v_pol_roles IS DISTINCT FROM ARRAY[v_auth_oid, v_anon_oid] THEN
        RAISE EXCEPTION 'PREFLIGHT_ABORTED: Baseline policy "Public can submit contact inquiries" roles mismatch (expected [anon, authenticated], found %)',
            v_pol_roles::text
            USING ERRCODE = '55000';
    END IF;

    -- 2. Preflight assertion: Capture exact live INSERT ACL entries via aclexplode()
    -- Handles both explicit relacl and default privileges via acldefault('r', c.relowner)
    -- Identifies PUBLIC grantee using grantee OID = 0
    SELECT coalesce(jsonb_agg(
        jsonb_build_object(
            'grantor_oid', a.grantor,
            'grantor_name', coalesce(r_grantor.rolname, a.grantor::text),
            'grantee_oid', a.grantee,
            'grantee_name', CASE WHEN a.grantee = 0 THEN 'PUBLIC' ELSE coalesce(r_grantee.rolname, a.grantee::text) END,
            'privilege_type', a.privilege_type,
            'is_grantable', a.is_grantable
        ) ORDER BY a.grantee, a.grantor
    ), '[]'::jsonb)
    INTO v_captured_insert_acl
    FROM (
        SELECT (aclexplode(coalesce(c.relacl, acldefault('r', c.relowner)))).*
        FROM pg_class c
        JOIN pg_namespace n ON c.relnamespace = n.oid
        WHERE n.nspname = 'public' AND c.relname = 'contact_inquiries'
    ) a
    LEFT JOIN pg_roles r_grantee ON a.grantee = r_grantee.oid
    LEFT JOIN pg_roles r_grantor ON a.grantor = r_grantor.oid
    WHERE a.privilege_type = 'INSERT';

    -- 3. Preflight assertion: Capture all non-INSERT (unrelated) ACL entries on contact_inquiries
    -- To prove that subsequent REVOKE affects strictly INSERT privileges with zero side effects.
    SELECT coalesce(jsonb_agg(
        jsonb_build_object(
            'grantor_oid', a.grantor,
            'grantor_name', coalesce(r_grantor.rolname, a.grantor::text),
            'grantee_oid', a.grantee,
            'grantee_name', CASE WHEN a.grantee = 0 THEN 'PUBLIC' ELSE coalesce(r_grantee.rolname, a.grantee::text) END,
            'privilege_type', a.privilege_type,
            'is_grantable', a.is_grantable
        ) ORDER BY a.grantee, a.grantor, a.privilege_type
    ), '[]'::jsonb)
    INTO v_captured_unrelated_acl
    FROM (
        SELECT (aclexplode(coalesce(c.relacl, acldefault('r', c.relowner)))).*
        FROM pg_class c
        JOIN pg_namespace n ON c.relnamespace = n.oid
        WHERE n.nspname = 'public' AND c.relname = 'contact_inquiries'
    ) a
    LEFT JOIN pg_roles r_grantee ON a.grantee = r_grantee.oid
    LEFT JOIN pg_roles r_grantor ON a.grantor = r_grantor.oid
    WHERE a.privilege_type != 'INSERT';

    SELECT c.oid INTO v_tbl_oid
    FROM pg_class c
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE n.nspname = 'public' AND c.relname = 'contact_inquiries';

    -- 4. Compute cryptographic signature covering the actual stored snapshot
    v_priv_sig := public.compute_migration_object_signature(
        'PRIVILEGE_ALTERATION',
        'public',
        'contact_inquiries_insert_acl',
        v_captured_insert_acl::text,
        'contact_inquiries'
    );

    -- 5. Record exact original ACL snapshot in the migration ownership ledger
    INSERT INTO public._phase1_created_objects (
        migration_id, object_type, schema_name, object_name, parent_table, identity_arguments, recorded_oid, recorded_signature
    ) VALUES (
        '20261107_phase1_hardened_seed',
        'PRIVILEGE_ALTERATION',
        'public',
        'contact_inquiries_insert_acl',
        'contact_inquiries',
        v_captured_insert_acl::text,
        v_tbl_oid,
        v_priv_sig
    );

    -- 6. Eliminate public direct insert bypass
    DROP POLICY IF EXISTS "Public can submit contact inquiries" ON public.contact_inquiries;
    REVOKE INSERT ON TABLE public.contact_inquiries FROM PUBLIC, anon, authenticated;

    -- 7. Post-revocation assertion: Verify unrelated privileges on contact_inquiries were NOT altered
    SELECT coalesce(jsonb_agg(
        jsonb_build_object(
            'grantor_oid', a.grantor,
            'grantor_name', coalesce(r_grantor.rolname, a.grantor::text),
            'grantee_oid', a.grantee,
            'grantee_name', CASE WHEN a.grantee = 0 THEN 'PUBLIC' ELSE coalesce(r_grantee.rolname, a.grantee::text) END,
            'privilege_type', a.privilege_type,
            'is_grantable', a.is_grantable
        ) ORDER BY a.grantee, a.grantor, a.privilege_type
    ), '[]'::jsonb)
    INTO v_post_revoke_unrelated_acl
    FROM (
        SELECT (aclexplode(coalesce(c.relacl, acldefault('r', c.relowner)))).*
        FROM pg_class c
        JOIN pg_namespace n ON c.relnamespace = n.oid
        WHERE n.nspname = 'public' AND c.relname = 'contact_inquiries'
    ) a
    LEFT JOIN pg_roles r_grantee ON a.grantee = r_grantee.oid
    LEFT JOIN pg_roles r_grantor ON a.grantor = r_grantor.oid
    WHERE a.privilege_type != 'INSERT';

    IF v_captured_unrelated_acl IS DISTINCT FROM v_post_revoke_unrelated_acl THEN
        RAISE EXCEPTION 'MIGRATION_ABORTED: REVOKE INSERT inadvertently altered unrelated ACL entries on contact_inquiries (expected %, found %)',
            v_captured_unrelated_acl::text, v_post_revoke_unrelated_acl::text
            USING ERRCODE = '55000';
    END IF;

    -- 8. Post-revocation assertion: Verify zero direct INSERT privileges remain for PUBLIC, anon, or authenticated
    SELECT coalesce(jsonb_agg(
        jsonb_build_object(
            'grantee_name', CASE WHEN a.grantee = 0 THEN 'PUBLIC' ELSE coalesce(r_grantee.rolname, a.grantee::text) END
        )
    ), '[]'::jsonb)
    INTO v_post_revoke_insert_acl
    FROM (
        SELECT (aclexplode(coalesce(c.relacl, acldefault('r', c.relowner)))).*
        FROM pg_class c
        JOIN pg_namespace n ON c.relnamespace = n.oid
        WHERE n.nspname = 'public' AND c.relname = 'contact_inquiries'
    ) a
    LEFT JOIN pg_roles r_grantee ON a.grantee = r_grantee.oid
    WHERE a.privilege_type = 'INSERT' 
      AND (a.grantee = 0 OR r_grantee.rolname IN ('anon', 'authenticated'));

    IF jsonb_array_length(v_post_revoke_insert_acl) > 0 THEN
        RAISE EXCEPTION 'MIGRATION_ABORTED (FAIL-CLOSED): Contact inquiries still has active direct public INSERT privileges after REVOKE: %',
            v_post_revoke_insert_acl::text
            USING ERRCODE = '55000';
    END IF;

    -- 9. Post-revocation assertion: Verify EFFECTIVE INSERT privilege is completely revoked
    -- Checks role memberships, inheritance, and default privileges via has_table_privilege()
    v_anon_effective_insert := has_table_privilege('anon', 'public.contact_inquiries', 'INSERT');
    v_auth_effective_insert := has_table_privilege('authenticated', 'public.contact_inquiries', 'INSERT');

    IF v_anon_effective_insert THEN
        RAISE EXCEPTION 'MIGRATION_ABORTED (FAIL-CLOSED): anon role still possesses EFFECTIVE INSERT privilege on contact_inquiries (via inheritance or default privileges)'
            USING ERRCODE = '55000';
    END IF;

    IF v_auth_effective_insert THEN
        RAISE EXCEPTION 'MIGRATION_ABORTED (FAIL-CLOSED): authenticated role still possesses EFFECTIVE INSERT privilege on contact_inquiries (via inheritance or default privileges)'
            USING ERRCODE = '55000';
    END IF;

    -- 10. Post-revocation assertion: Recursively inspect role memberships and inheritance
    -- Proves no public-facing role inherits INSERT privilege from any ancestor role
    WITH RECURSIVE public_roles AS (
        SELECT r.oid, r.rolname, r.rolinherit
        FROM pg_roles r
        WHERE r.rolname IN ('anon', 'authenticated')
        UNION
        SELECT parent.oid, parent.rolname, parent.rolinherit
        FROM public_roles child
        JOIN pg_auth_members pam ON pam.member = child.oid
        JOIN pg_roles parent ON pam.roleid = parent.oid
        WHERE child.rolinherit = true
    )
    SELECT array_agg(format('role=%s (OID=%s)', pr.rolname, pr.oid))
    INTO v_leaked_public_roles
    FROM public_roles pr
    WHERE has_table_privilege(pr.oid, 'public.contact_inquiries', 'INSERT');

    IF v_leaked_public_roles IS NOT NULL AND array_length(v_leaked_public_roles, 1) > 0 THEN
        RAISE EXCEPTION 'MIGRATION_ABORTED (FAIL-CLOSED): Public role inheritance check failed. The following public-accessible role(s) possess effective INSERT privilege on contact_inquiries: %',
            array_to_string(v_leaked_public_roles, ', ')
            USING ERRCODE = '55000';
    END IF;

    -- 11. Post-revocation assertion: Confirm untrusted public-facing connector roles (e.g. authenticator) lack direct INSERT
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticator') THEN
        IF has_table_privilege('authenticator', 'public.contact_inquiries', 'INSERT') THEN
            RAISE EXCEPTION 'MIGRATION_ABORTED (FAIL-CLOSED): Untrusted role authenticator has effective INSERT privilege on contact_inquiries'
                USING ERRCODE = '55000';
        END IF;
    END IF;

    RAISE NOTICE 'Contact form direct insert bypass eliminated: Verified effective INSERT privilege is FALSE for anon and authenticated, zero public role inheritance paths exist, and unrelated privileges are intact.';
END $$;

-- Super-admin view and management permissions remain preserved from baseline:
-- (Existing policy "Only super_admins can view and manage contact inquiries" remains active)

-- ==============================================================================
-- SECTION 5: RLS POLICIES & GRANULAR CONTENT GRANTS
-- ==============================================================================

-- Enable RLS on newly created content tables
ALTER TABLE public.services_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.talent_guild_pillars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ecosystem_nodes ENABLE ROW LEVEL SECURITY;

-- Services Catalog Policies
CREATE POLICY "services_catalog_anon_read" ON public.services_catalog
    FOR SELECT TO anon, authenticated
    USING (is_published = true OR public.is_admin());

CREATE POLICY "services_catalog_admin_write" ON public.services_catalog
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Talent Guild Pillars Policies
CREATE POLICY "talent_guild_pillars_anon_read" ON public.talent_guild_pillars
    FOR SELECT TO anon, authenticated
    USING (is_published = true OR public.is_admin());

CREATE POLICY "talent_guild_pillars_admin_write" ON public.talent_guild_pillars
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Ecosystem Nodes Policies
CREATE POLICY "ecosystem_nodes_anon_read" ON public.ecosystem_nodes
    FOR SELECT TO anon, authenticated
    USING (is_published = true OR public.is_admin());

CREATE POLICY "ecosystem_nodes_admin_write" ON public.ecosystem_nodes
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Granular table-level grants on newly created content tables
GRANT SELECT ON TABLE public.services_catalog, public.talent_guild_pillars, public.ecosystem_nodes TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.services_catalog, public.talent_guild_pillars, public.ecosystem_nodes TO authenticated;

-- NOTE: public.website_settings, section_visibility, hero_banners, contact_inquiries,
-- admin_users and all other baseline tables already have their production permissions and RLS policies
-- established by 20261106_rfr_cms_complete_schema.sql. They are NOT altered or re-granted here.

-- NOTE: public.admin_users baseline permissions (SELECT, UPDATE(last_login_at)) are 100% PRESERVED.

-- ==============================================================================
-- SECTION 6: REGISTER CREATED OBJECTS IN OWNERSHIP LEDGER
-- ==============================================================================

DO $$
DECLARE
    v_oid OID;
    v_sig TEXT;
BEGIN
    -- 1. Tables (Support and Extension)
    -- services_catalog
    SELECT c.oid INTO v_oid FROM pg_class c JOIN pg_namespace n ON c.relnamespace = n.oid WHERE n.nspname = 'public' AND c.relname = 'services_catalog';
    IF v_oid IS NULL THEN RAISE EXCEPTION 'LEDGER_ERROR: services_catalog OID not found'; END IF;
    v_sig := public.compute_migration_object_signature('TABLE', 'public', 'services_catalog');
    INSERT INTO public._phase1_created_objects (migration_id, object_type, schema_name, object_name, recorded_oid, recorded_signature) 
    VALUES ('20261107_phase1_hardened_seed', 'TABLE', 'public', 'services_catalog', v_oid, v_sig);

    -- talent_guild_pillars
    SELECT c.oid INTO v_oid FROM pg_class c JOIN pg_namespace n ON c.relnamespace = n.oid WHERE n.nspname = 'public' AND c.relname = 'talent_guild_pillars';
    IF v_oid IS NULL THEN RAISE EXCEPTION 'LEDGER_ERROR: talent_guild_pillars OID not found'; END IF;
    v_sig := public.compute_migration_object_signature('TABLE', 'public', 'talent_guild_pillars');
    INSERT INTO public._phase1_created_objects (migration_id, object_type, schema_name, object_name, recorded_oid, recorded_signature) 
    VALUES ('20261107_phase1_hardened_seed', 'TABLE', 'public', 'talent_guild_pillars', v_oid, v_sig);

    -- ecosystem_nodes
    SELECT c.oid INTO v_oid FROM pg_class c JOIN pg_namespace n ON c.relnamespace = n.oid WHERE n.nspname = 'public' AND c.relname = 'ecosystem_nodes';
    IF v_oid IS NULL THEN RAISE EXCEPTION 'LEDGER_ERROR: ecosystem_nodes OID not found'; END IF;
    v_sig := public.compute_migration_object_signature('TABLE', 'public', 'ecosystem_nodes');
    INSERT INTO public._phase1_created_objects (migration_id, object_type, schema_name, object_name, recorded_oid, recorded_signature) 
    VALUES ('20261107_phase1_hardened_seed', 'TABLE', 'public', 'ecosystem_nodes', v_oid, v_sig);

    -- admin_mutation_locks
    SELECT c.oid INTO v_oid FROM pg_class c JOIN pg_namespace n ON c.relnamespace = n.oid WHERE n.nspname = 'public' AND c.relname = 'admin_mutation_locks';
    IF v_oid IS NULL THEN RAISE EXCEPTION 'LEDGER_ERROR: admin_mutation_locks OID not found'; END IF;
    v_sig := public.compute_migration_object_signature('SUPPORT_TABLE', 'public', 'admin_mutation_locks');
    INSERT INTO public._phase1_created_objects (migration_id, object_type, schema_name, object_name, recorded_oid, recorded_signature) 
    VALUES ('20261107_phase1_hardened_seed', 'SUPPORT_TABLE', 'public', 'admin_mutation_locks', v_oid, v_sig);

    -- contact_rate_limits
    SELECT c.oid INTO v_oid FROM pg_class c JOIN pg_namespace n ON c.relnamespace = n.oid WHERE n.nspname = 'public' AND c.relname = 'contact_rate_limits';
    IF v_oid IS NULL THEN RAISE EXCEPTION 'LEDGER_ERROR: contact_rate_limits OID not found'; END IF;
    v_sig := public.compute_migration_object_signature('SUPPORT_TABLE', 'public', 'contact_rate_limits');
    INSERT INTO public._phase1_created_objects (migration_id, object_type, schema_name, object_name, recorded_oid, recorded_signature) 
    VALUES ('20261107_phase1_hardened_seed', 'SUPPORT_TABLE', 'public', 'contact_rate_limits', v_oid, v_sig);

    -- 2. Functions (Exact Identity Arguments)
    -- compute_migration_object_signature
    SELECT p.oid INTO v_oid FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND p.proname = 'compute_migration_object_signature' AND pg_get_function_identity_arguments(p.oid) = 'p_object_type text, p_schema text, p_object_name text, p_identity_args text, p_parent_table text';
    IF v_oid IS NULL THEN RAISE EXCEPTION 'LEDGER_ERROR: compute_migration_object_signature OID not found'; END IF;
    v_sig := public.compute_migration_object_signature('FUNCTION', 'public', 'compute_migration_object_signature', 'p_object_type text, p_schema text, p_object_name text, p_identity_args text, p_parent_table text');
    INSERT INTO public._phase1_created_objects (migration_id, object_type, schema_name, object_name, identity_arguments, recorded_oid, recorded_signature) 
    VALUES ('20261107_phase1_hardened_seed', 'FUNCTION', 'public', 'compute_migration_object_signature', 'p_object_type text, p_schema text, p_object_name text, p_identity_args text, p_parent_table text', v_oid, v_sig);

    -- admin_update_staff_role
    SELECT p.oid INTO v_oid FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND p.proname = 'admin_update_staff_role' AND pg_get_function_identity_arguments(p.oid) = 'p_target_id uuid, p_new_role text';
    IF v_oid IS NULL THEN RAISE EXCEPTION 'LEDGER_ERROR: admin_update_staff_role OID not found'; END IF;
    v_sig := public.compute_migration_object_signature('FUNCTION', 'public', 'admin_update_staff_role', 'p_target_id uuid, p_new_role text');
    INSERT INTO public._phase1_created_objects (migration_id, object_type, schema_name, object_name, identity_arguments, recorded_oid, recorded_signature) 
    VALUES ('20261107_phase1_hardened_seed', 'FUNCTION', 'public', 'admin_update_staff_role', 'p_target_id uuid, p_new_role text', v_oid, v_sig);

    -- admin_toggle_staff_active
    SELECT p.oid INTO v_oid FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND p.proname = 'admin_toggle_staff_active' AND pg_get_function_identity_arguments(p.oid) = 'p_target_id uuid, p_is_active boolean';
    IF v_oid IS NULL THEN RAISE EXCEPTION 'LEDGER_ERROR: admin_toggle_staff_active OID not found'; END IF;
    v_sig := public.compute_migration_object_signature('FUNCTION', 'public', 'admin_toggle_staff_active', 'p_target_id uuid, p_is_active boolean');
    INSERT INTO public._phase1_created_objects (migration_id, object_type, schema_name, object_name, identity_arguments, recorded_oid, recorded_signature) 
    VALUES ('20261107_phase1_hardened_seed', 'FUNCTION', 'public', 'admin_toggle_staff_active', 'p_target_id uuid, p_is_active boolean', v_oid, v_sig);

    -- admin_stage_staff_deletion
    SELECT p.oid INTO v_oid FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND p.proname = 'admin_stage_staff_deletion' AND pg_get_function_identity_arguments(p.oid) = 'p_target_id uuid';
    IF v_oid IS NULL THEN RAISE EXCEPTION 'LEDGER_ERROR: admin_stage_staff_deletion OID not found'; END IF;
    v_sig := public.compute_migration_object_signature('FUNCTION', 'public', 'admin_stage_staff_deletion', 'p_target_id uuid');
    INSERT INTO public._phase1_created_objects (migration_id, object_type, schema_name, object_name, identity_arguments, recorded_oid, recorded_signature) 
    VALUES ('20261107_phase1_hardened_seed', 'FUNCTION', 'public', 'admin_stage_staff_deletion', 'p_target_id uuid', v_oid, v_sig);

    -- admin_complete_staff_deletion
    SELECT p.oid INTO v_oid FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND p.proname = 'admin_complete_staff_deletion' AND pg_get_function_identity_arguments(p.oid) = 'p_target_id uuid';
    IF v_oid IS NULL THEN RAISE EXCEPTION 'LEDGER_ERROR: admin_complete_staff_deletion OID not found'; END IF;
    v_sig := public.compute_migration_object_signature('FUNCTION', 'public', 'admin_complete_staff_deletion', 'p_target_id uuid');
    INSERT INTO public._phase1_created_objects (migration_id, object_type, schema_name, object_name, identity_arguments, recorded_oid, recorded_signature) 
    VALUES ('20261107_phase1_hardened_seed', 'FUNCTION', 'public', 'admin_complete_staff_deletion', 'p_target_id uuid', v_oid, v_sig);

    -- admin_create_staff_profile
    SELECT p.oid INTO v_oid FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND p.proname = 'admin_create_staff_profile' AND pg_get_function_identity_arguments(p.oid) = 'p_user_id uuid, p_email text, p_role text';
    IF v_oid IS NULL THEN RAISE EXCEPTION 'LEDGER_ERROR: admin_create_staff_profile OID not found'; END IF;
    v_sig := public.compute_migration_object_signature('FUNCTION', 'public', 'admin_create_staff_profile', 'p_user_id uuid, p_email text, p_role text');
    INSERT INTO public._phase1_created_objects (migration_id, object_type, schema_name, object_name, identity_arguments, recorded_oid, recorded_signature) 
    VALUES ('20261107_phase1_hardened_seed', 'FUNCTION', 'public', 'admin_create_staff_profile', 'p_user_id uuid, p_email text, p_role text', v_oid, v_sig);

    -- record_admin_login
    SELECT p.oid INTO v_oid FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND p.proname = 'record_admin_login' AND pg_get_function_identity_arguments(p.oid) = '';
    IF v_oid IS NULL THEN RAISE EXCEPTION 'LEDGER_ERROR: record_admin_login OID not found'; END IF;
    v_sig := public.compute_migration_object_signature('FUNCTION', 'public', 'record_admin_login', '');
    INSERT INTO public._phase1_created_objects (migration_id, object_type, schema_name, object_name, identity_arguments, recorded_oid, recorded_signature) 
    VALUES ('20261107_phase1_hardened_seed', 'FUNCTION', 'public', 'record_admin_login', '', v_oid, v_sig);

    -- process_contact_submission
    SELECT p.oid INTO v_oid FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND p.proname = 'process_contact_submission' AND pg_get_function_identity_arguments(p.oid) = 'p_full_name text, p_email text, p_phone text, p_company_name text, p_service_interest text, p_budget_range text, p_message text, p_bot_honey_field text, p_ip_hash bytea';
    IF v_oid IS NULL THEN RAISE EXCEPTION 'LEDGER_ERROR: process_contact_submission OID not found'; END IF;
    v_sig := public.compute_migration_object_signature('FUNCTION', 'public', 'process_contact_submission', 'p_full_name text, p_email text, p_phone text, p_company_name text, p_service_interest text, p_budget_range text, p_message text, p_bot_honey_field text, p_ip_hash bytea');
    INSERT INTO public._phase1_created_objects (migration_id, object_type, schema_name, object_name, identity_arguments, recorded_oid, recorded_signature) 
    VALUES ('20261107_phase1_hardened_seed', 'FUNCTION', 'public', 'process_contact_submission', 'p_full_name text, p_email text, p_phone text, p_company_name text, p_service_interest text, p_budget_range text, p_message text, p_bot_honey_field text, p_ip_hash bytea', v_oid, v_sig);

    -- 3. Policies on Extension Tables (Recorded with live pg_policy.oid)
    SELECT pol.oid INTO v_oid FROM pg_policy pol JOIN pg_class t ON pol.polrelid = t.oid JOIN pg_namespace n ON t.relnamespace = n.oid WHERE n.nspname = 'public' AND t.relname = 'services_catalog' AND pol.polname = 'services_catalog_anon_read';
    IF v_oid IS NULL THEN RAISE EXCEPTION 'LEDGER_ERROR: services_catalog_anon_read policy OID not found'; END IF;
    v_sig := public.compute_migration_object_signature('POLICY', 'public', 'services_catalog_anon_read', NULL, 'services_catalog');
    INSERT INTO public._phase1_created_objects (migration_id, object_type, schema_name, object_name, parent_table, recorded_oid, recorded_signature) 
    VALUES ('20261107_phase1_hardened_seed', 'POLICY', 'public', 'services_catalog_anon_read', 'services_catalog', v_oid, v_sig);

    SELECT pol.oid INTO v_oid FROM pg_policy pol JOIN pg_class t ON pol.polrelid = t.oid JOIN pg_namespace n ON t.relnamespace = n.oid WHERE n.nspname = 'public' AND t.relname = 'services_catalog' AND pol.polname = 'services_catalog_admin_write';
    IF v_oid IS NULL THEN RAISE EXCEPTION 'LEDGER_ERROR: services_catalog_admin_write policy OID not found'; END IF;
    v_sig := public.compute_migration_object_signature('POLICY', 'public', 'services_catalog_admin_write', NULL, 'services_catalog');
    INSERT INTO public._phase1_created_objects (migration_id, object_type, schema_name, object_name, parent_table, recorded_oid, recorded_signature) 
    VALUES ('20261107_phase1_hardened_seed', 'POLICY', 'public', 'services_catalog_admin_write', 'services_catalog', v_oid, v_sig);

    SELECT pol.oid INTO v_oid FROM pg_policy pol JOIN pg_class t ON pol.polrelid = t.oid JOIN pg_namespace n ON t.relnamespace = n.oid WHERE n.nspname = 'public' AND t.relname = 'talent_guild_pillars' AND pol.polname = 'talent_guild_pillars_anon_read';
    IF v_oid IS NULL THEN RAISE EXCEPTION 'LEDGER_ERROR: talent_guild_pillars_anon_read policy OID not found'; END IF;
    v_sig := public.compute_migration_object_signature('POLICY', 'public', 'talent_guild_pillars_anon_read', NULL, 'talent_guild_pillars');
    INSERT INTO public._phase1_created_objects (migration_id, object_type, schema_name, object_name, parent_table, recorded_oid, recorded_signature) 
    VALUES ('20261107_phase1_hardened_seed', 'POLICY', 'public', 'talent_guild_pillars_anon_read', 'talent_guild_pillars', v_oid, v_sig);

    SELECT pol.oid INTO v_oid FROM pg_policy pol JOIN pg_class t ON pol.polrelid = t.oid JOIN pg_namespace n ON t.relnamespace = n.oid WHERE n.nspname = 'public' AND t.relname = 'talent_guild_pillars' AND pol.polname = 'talent_guild_pillars_admin_write';
    IF v_oid IS NULL THEN RAISE EXCEPTION 'LEDGER_ERROR: talent_guild_pillars_admin_write policy OID not found'; END IF;
    v_sig := public.compute_migration_object_signature('POLICY', 'public', 'talent_guild_pillars_admin_write', NULL, 'talent_guild_pillars');
    INSERT INTO public._phase1_created_objects (migration_id, object_type, schema_name, object_name, parent_table, recorded_oid, recorded_signature) 
    VALUES ('20261107_phase1_hardened_seed', 'POLICY', 'public', 'talent_guild_pillars_admin_write', 'talent_guild_pillars', v_oid, v_sig);

    SELECT pol.oid INTO v_oid FROM pg_policy pol JOIN pg_class t ON pol.polrelid = t.oid JOIN pg_namespace n ON t.relnamespace = n.oid WHERE n.nspname = 'public' AND t.relname = 'ecosystem_nodes' AND pol.polname = 'ecosystem_nodes_anon_read';
    IF v_oid IS NULL THEN RAISE EXCEPTION 'LEDGER_ERROR: ecosystem_nodes_anon_read policy OID not found'; END IF;
    v_sig := public.compute_migration_object_signature('POLICY', 'public', 'ecosystem_nodes_anon_read', NULL, 'ecosystem_nodes');
    INSERT INTO public._phase1_created_objects (migration_id, object_type, schema_name, object_name, parent_table, recorded_oid, recorded_signature) 
    VALUES ('20261107_phase1_hardened_seed', 'POLICY', 'public', 'ecosystem_nodes_anon_read', 'ecosystem_nodes', v_oid, v_sig);

    SELECT pol.oid INTO v_oid FROM pg_policy pol JOIN pg_class t ON pol.polrelid = t.oid JOIN pg_namespace n ON t.relnamespace = n.oid WHERE n.nspname = 'public' AND t.relname = 'ecosystem_nodes' AND pol.polname = 'ecosystem_nodes_admin_write';
    IF v_oid IS NULL THEN RAISE EXCEPTION 'LEDGER_ERROR: ecosystem_nodes_admin_write policy OID not found'; END IF;
    v_sig := public.compute_migration_object_signature('POLICY', 'public', 'ecosystem_nodes_admin_write', NULL, 'ecosystem_nodes');
    INSERT INTO public._phase1_created_objects (migration_id, object_type, schema_name, object_name, parent_table, recorded_oid, recorded_signature) 
    VALUES ('20261107_phase1_hardened_seed', 'POLICY', 'public', 'ecosystem_nodes_admin_write', 'ecosystem_nodes', v_oid, v_sig);

    -- 4. Baseline Policy Alteration (Tracking dropped policy on contact_inquiries)
    v_sig := public.compute_migration_object_signature('POLICY_ALTERATION', 'public', 'Public can submit contact inquiries', NULL, 'contact_inquiries');
    INSERT INTO public._phase1_created_objects (migration_id, object_type, schema_name, object_name, parent_table, recorded_oid, recorded_signature)
    VALUES ('20261107_phase1_hardened_seed', 'POLICY_ALTERATION', 'public', 'Public can submit contact inquiries', 'contact_inquiries', 0, v_sig);

    RAISE NOTICE 'Ownership ledger populated successfully with 21 schema objects (including privilege and policy alterations).';
END $$;

-- ==============================================================================
-- SECTION 7: MASTER SEED DATA INSERTION (EXACTLY 168 DETERMINISTIC UUIDs)
-- 154 Verified Records (Published) + 14 Placeholder Records (Unpublished Drafts)
-- ==============================================================================

-- 1. timeline_years (7 records)
INSERT INTO public.timeline_years (
    id, year, title, theme, subtitle, description, milestones, image, accent, sort_order, is_published
) VALUES
('00000000-0000-4000-a000-000000002020', 2020, 'The Genesis & Cultural Resonance', 'THE INCEPTION', 'Foundational Vision & First Runway Shows', 'The inception of Riyas Fashion Runway, establishing a benchmark in luxury fashion choreography, experiential curation, and couture presentations.', ARRAY['Inaugural Runway Showcase by Riyas', 'Establishment of core creative directing team', 'Initial brand partnerships with luxury hospitality venues'], 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80', '#C7A46A', 1, true),
('00000000-0000-4000-a000-000000002021', 2021, 'The Inception, Brand Campaigns & Festive Launches', 'CONCEPTION, EXPANSION & MULTI-MEDIA', 'Foundational Vision, Brand Campaigns, Musical Albums & Couture Launches', 'RFR began its journey with a defining vision by Riyas, orchestrating premier entertainment and luxury celebrations, quickly expanding into high-frequency retail campaigns, commercial advertising, and designer holiday launches.', ARRAY['Inaugural flagship production curated by Riyas', 'Premier luxury hospitality collaboration with UDS', 'Multi-quarter Max Fashion influencer campaigns across Onam, Deepawali, and Xmas', 'Musical video album production: Love You Too'], 'https://drive.google.com/thumbnail?id=1zhhm9Oj2Uz2Znskemv_8JL_OA9hWm4rT&sz=w1200', '#C7A46A', 2, true),
('00000000-0000-4000-a000-000000002022', 2022, 'The Flea Phenomenon, Global Runways & Marquee Ads', 'EXPERIENTIAL & RUNWAY DOMINANCE', 'Koottam Flea Season 1, Global Fashion Week, Manyavar & Puma', 'A monumental year introducing the flagship Koottam Flea Market IP, Global Fashion Week at Lulu, automobile ads, and brand celebrations.', ARRAY['Inaugural season launch of Koottam Flea Market IP', 'Global Fashion Week stage production at Lulu Mall', 'High-fashion Manyavar shoot & Mahindra commercial ad', 'New Year Event partnership with Puma'], '/images/kootam 2022.jpeg', '#C7A46A', 3, true),
('00000000-0000-4000-a000-000000002023', 2023, 'The Multi-City Scale, Acoustic Stages & Commercial Ads', 'SCALING HORIZONS & COMMERCE', 'Koottam Season 2, Commercial Ad Films, Fitora & Music Albums', 'A transformative chapter expanding into iconic retail brand launches, music labels, fashion inaugurations, and commercial brand films.', ARRAY['Koottam Flea Market Season 2 (The Fourth Edition)', 'Fitora Brand Inauguration & Celebrity Launch', 'Hanso 1 Commercial Brand Film Production', 'Musical Album Koode Nee with Manorama Music'], 'https://img.youtube.com/vi/clgdutCU5G8/hqdefault.jpg', '#C7A46A', 4, true),
('00000000-0000-4000-a000-000000002024', 2024, 'High-Fashion Ecosystem, D2C Accelerators & Massive Fleas', 'CULTURAL EPICENTER & COMMERCIAL EXPANSION', 'Koottam Season 3, South Indian Fashion Awards, Lulu Runway & OOH Billboard Blitz', 'Expanding into a multi-tier luxury ecosystem orchestrating large-scale fashion awards, high-street retail acceleration, and multi-day experiential fleas.', ARRAY['Koottam Flea Market Season 3 with 50+ designer stalls', 'South Indian Fashion Awards stage curation', 'Extensive multi-city OOH billboard campaign for premier clients', 'Lulu Runway fashion week choreography'], '/images/thumbnails/kootam%203%20poster.jpg', '#C7A46A', 5, true),
('00000000-0000-4000-a000-000000002025', 2025, 'Haute Couture, Cultural IPs & The Podcast Era', 'COUTURE ELEVATION & DIALOGUE', 'Koottam Season 4, Chakita Haute Couture, Cultural Dandiya Nights & RFR The Podcast', 'A landmark era defined by architectural couture runway productions, high-engagement festive IPs, and the launch of RFR The Podcast.', ARRAY['Koottam Flea Market Season 4 blockbuster multi-day edition', 'Chakita Haute Couture Runway at DD Retreat', 'Grand Dandiya Night cultural celebration with 2,000+ attendees', 'Launch of RFR The Podcast with headline industry creators'], '/images/thumbnails/WhatsApp%20Image%202026-11-04%20at%209.42.09%20PM%20(2).jpeg', '#C7A46A', 6, true),
('00000000-0000-4000-a000-000000002026', 2026, 'The Modern Era — Architectural Runways & Five-Star Galas', 'THE MODERN HORIZON', 'Hycinth Five-Star NYE Gala, Koottam Season 5 Premiere & Elite Guilds', 'Setting new benchmarks in luxury runway choreography, high-fashion talent curation, and experiential brand galas across premier properties.', ARRAY['Hycinth Five-Star New Year Eve Countdown Gala', 'Koottam Flea Market Season 5 Headline Production', 'Launch of RFR Talent and Influencer Guild Portals'], 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80', '#C7A46A', 7, true);

-- 2. timeline_events (65 records)
INSERT INTO public.timeline_events (
    id, year_id, year_number, name, type, category_badge, location_or_client, description, image, video_embed_url, has_video, drive_folder_url, sort_order, is_published
) VALUES
('00000000-0000-4000-a001-000000000001', '00000000-0000-4000-a000-000000002020', 2020, 'Inaugural Runway Showcase & Creative Genesis', 'Event', 'RUNWAY INCEPTION • CHOREOGRAPHY', 'RFR Signature Event', 'The defining genesis showcase curated by Riyas, establishing Kerala benchmark in luxury fashion choreography and runway staging.', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80', NULL, false, NULL, 1, true),
('00000000-0000-4000-a001-000000000002', '00000000-0000-4000-a000-000000002021', 2021, 'Max Influencer Campaigns — Onam', 'Campaign', 'RETAIL INFLUENCER CAMPAIGN • VIDEO', 'Max Fashion', 'Festive Onam influencer marketing campaign driving retail engagement.', 'https://drive.google.com/thumbnail?id=13oW-kpjZX61Nwlljk3rtDIhyIxGgwtQX&sz=w1200', 'https://drive.google.com/file/d/13oW-kpjZX61Nwlljk3rtDIhyIxGgwtQX/preview', true, NULL, 2, true),
('00000000-0000-4000-a001-000000000003', '00000000-0000-4000-a000-000000002021', 2021, 'Max Influencer Campaigns — Deepawali (Part 1)', 'Campaign', 'RETAIL INFLUENCER CAMPAIGN • VIDEO', 'Max Fashion', 'High-energy Deepawali influencer marketing campaign highlighting the festive collection.', 'https://drive.google.com/thumbnail?id=1JW1hGphQRupw8ONzVud7_99wOU2Lpbkc&sz=w1200', 'https://drive.google.com/file/d/1JW1hGphQRupw8ONzVud7_99wOU2Lpbkc/preview', true, NULL, 3, true),
('00000000-0000-4000-a001-000000000004', '00000000-0000-4000-a000-000000002021', 2021, 'Max Influencer Campaigns — Deepawali (Part 2)', 'Campaign', 'RETAIL INFLUENCER CAMPAIGN • VIDEO', 'Max Fashion', 'Continuation of the high-energy Deepawali influencer marketing campaign.', 'https://drive.google.com/thumbnail?id=1m1OshIid4g-19bkk8LfhEnGIPSbMqLYf&sz=w1200', 'https://drive.google.com/file/d/1m1OshIid4g-19bkk8LfhEnGIPSbMqLYf/preview', true, NULL, 4, true),
('00000000-0000-4000-a001-000000000005', '00000000-0000-4000-a000-000000002021', 2021, 'Max Influencer Campaigns — Xmas', 'Campaign', 'RETAIL INFLUENCER CAMPAIGN • VIDEO', 'Max Fashion', 'Christmas season influencer marketing campaign for Max Fashion.', 'https://drive.google.com/thumbnail?id=1-DOdgtZQyVc9Y0FaHn0iyKtAKaFJGP31&sz=w1200', 'https://drive.google.com/file/d/1-DOdgtZQyVc9Y0FaHn0iyKtAKaFJGP31/preview', true, NULL, 5, true),
('00000000-0000-4000-a001-000000000006', '00000000-0000-4000-a000-000000002021', 2021, 'Love You Too — Musical Album', 'Music Album', 'MUSICAL ALBUM PRODUCTION • VIDEO', 'RFR Music & Productions', 'Cinematic music video production and audio release capturing romantic visual storytelling and artistic direction.', 'https://img.youtube.com/vi/jRZ4zlS5PlA/maxresdefault.jpg', 'https://www.youtube.com/embed/jRZ4zlS5PlA', true, NULL, 6, true),
('00000000-0000-4000-a001-000000000007', '00000000-0000-4000-a000-000000002021', 2021, 'MAX Xmas Collection Launch Event at UDS', 'Event', 'FASHION LAUNCH EVENT • VIDEO', 'Max Fashion / UDS Resorts', 'Exclusive holiday runway showcase and celebrity fashion launch for Max Xmas Collection at UDS.', 'https://drive.google.com/thumbnail?id=1zhhm9Oj2Uz2Znskemv_8JL_OA9hWm4rT&sz=w1200', 'https://drive.google.com/file/d/1zhhm9Oj2Uz2Znskemv_8JL_OA9hWm4rT/preview', true, 'https://drive.google.com/drive/folders/1KeuGFZbCTFZgRCCSzHD44y-nZ5u4LOps', 7, true),
('00000000-0000-4000-a001-000000000008', '00000000-0000-4000-a000-000000002022', 2022, 'Koottam Flea Market — Season 1 (Official Video Reel)', 'Event', 'FLAGSHIP FLEA IP • VIDEO REEL', 'RFR Signature IP', 'The monumental launch of Koottam Flea Market Season 1, bringing together 50+ independent brands, creators, live music, and thousands of attendees.', 'https://drive.google.com/thumbnail?id=1K0wzOv8anMih62lWwAXbRJCZGkxyh3IW&sz=w1200', 'https://drive.google.com/file/d/1K0wzOv8anMih62lWwAXbRJCZGkxyh3IW/preview', true, 'https://drive.google.com/drive/folders/1JPcPSXu6NjKFLhj-_b0r9Xh4vxCTnLaM', 8, true),
('00000000-0000-4000-a001-000000000009', '00000000-0000-4000-a000-000000002022', 2022, 'Koottam Flea 2022 — Live Music & Stage Highlights', 'Event', 'FESTIVAL REEL • LIVE STAGE', 'Koottam 2022 Official Drive Archives', 'Atmospheric stage production, acoustic live sets, and high-energy festival crowds captured during Koottam Flea Season 1.', 'https://drive.google.com/thumbnail?id=1OTBpm6zjAgEcxKbGFWZ3k78zsAsLtnW4&sz=w1200', 'https://drive.google.com/file/d/1OTBpm6zjAgEcxKbGFWZ3k78zsAsLtnW4/preview', true, 'https://drive.google.com/drive/folders/1JPcPSXu6NjKFLhj-_b0r9Xh4vxCTnLaM', 9, true),
('00000000-0000-4000-a001-000000000010', '00000000-0000-4000-a000-000000002022', 2022, 'Koottam Flea 2022 — Stalls, Food & Creators', 'Event', 'EXPERIENTIAL REEL • RETAIL', 'Koottam 2022 Official Drive Archives', 'Curated shopping lanes, artisanal lifestyle creators, gourmet pop-ups, and vibrant community celebrations.', 'https://drive.google.com/thumbnail?id=1N3uDi9gPVaolGuFGvVHwlhuZ2kVhp5_0&sz=w1200', 'https://drive.google.com/file/d/1N3uDi9gPVaolGuFGvVHwlhuZ2kVhp5_0/preview', true, 'https://drive.google.com/drive/folders/1JPcPSXu6NjKFLhj-_b0r9Xh4vxCTnLaM', 10, true),
('00000000-0000-4000-a001-000000000011', '00000000-0000-4000-a000-000000002022', 2022, 'Vishu Max 2022 (Avoki Festive Launch)', 'Event', 'FESTIVAL FASHION LAUNCH • VIDEO', 'Max Fashion', 'Vibrant Vishu festive collection launch and runway presentation celebrating traditional elegance with contemporary cuts.', 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80', 'https://drive.google.com/file/d/1Yb5J03l42-tDKReQKTwIyeD8HkbcQUF-/preview', true, 'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs', 11, true),
('00000000-0000-4000-a001-000000000012', '00000000-0000-4000-a000-000000002022', 2022, 'Citi Kids Jasmin & Teena Showcase', 'Event', 'YOUTH RUNWAY & TALENT • VIDEO', 'RFR Youth Platform & Citi Kids', 'Premier youth talent hunt and fashion runway show empowering kids with stage presence, styling, and grooming.', 'https://drive.google.com/thumbnail?id=1ZKOWzZ-6Gajyvv8faIPy6tLryX17VLt5&sz=w1200', 'https://drive.google.com/file/d/1ZKOWzZ-6Gajyvv8faIPy6tLryX17VLt5/preview', true, 'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs', 12, true),
('00000000-0000-4000-a001-000000000013', '00000000-0000-4000-a000-000000002022', 2022, 'Global Fashion Week — Lulu Mall', 'Show', 'INTERNATIONAL RUNWAY', 'Lulu International Mall', 'Spectacular multi-designer runway presentation bringing together top couture labels, international models, and media coverage.', '/images/thumbnails/global fashion week lulu.JPG', 'https://drive.google.com/file/d/1fjrTS7q0kSHRGTBQb1VKho8X25D9-gXZ/preview', true, 'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs', 13, true),
('00000000-0000-4000-a001-000000000014', '00000000-0000-4000-a000-000000002022', 2022, 'Maanyavar Shoot — SHAMMY', 'Shoot', 'HAUTE COUTURE SHOOT • EDITORIAL', 'Manyavar / Shammy', 'High-fashion ethnic couture and bridal styling editorial photoshoot featuring Shammy for Manyavar.', NULL, NULL, false, NULL, 14, true),
('00000000-0000-4000-a001-000000000015', '00000000-0000-4000-a000-000000002022', 2022, 'Mahindra Ad', 'Ad', 'AUTOMOTIVE COMMERCIAL • AD FILM', 'Mahindra', 'Commercial advertisement production and automotive lifestyle campaign directed for Mahindra.', NULL, NULL, false, NULL, 15, true),
('00000000-0000-4000-a001-000000000016', '00000000-0000-4000-a000-000000002022', 2022, 'Red FM Kids Show', 'Show', 'YOUTH RUNWAY & TALENT • RADIO SHOW', '93.5 Red FM', 'Premier youth talent runway and kids stage showcase conducted in media partnership with 93.5 Red FM.', '/images/thumbnails/red fm.jpg', NULL, false, NULL, 16, true),
('00000000-0000-4000-a001-000000000017', '00000000-0000-4000-a000-000000002023', 2023, 'The Fourth — Koottam Flea Market (Season 2)', 'Event', 'FLAGSHIP FLEA IP • VIDEO REEL', 'RFR Signature IP', 'The celebrated second edition of Koottam Flea Market featuring amplified shopping, celebrity acoustic performances, gourmet zones, and record footfalls.', 'https://img.youtube.com/vi/NTDkcWdruPs/maxresdefault.jpg', 'https://www.youtube.com/embed/NTDkcWdruPs?start=144', true, 'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs', 17, true),
('00000000-0000-4000-a001-000000000018', '00000000-0000-4000-a000-000000002023', 2023, 'Fitora Brand Launch & Inauguration', 'Event', 'BRAND LAUNCH EVENT • VIDEO', 'Fitora Lifestyle', 'Grand store inauguration and celebrity brand launch event with full video coverage and VIP guest management.', 'https://drive.google.com/thumbnail?id=1-evN1cSYflA2Euej4pEzqVfHJ03NlNHz&sz=w1200', 'https://drive.google.com/file/d/1-evN1cSYflA2Euej4pEzqVfHJ03NlNHz/preview', true, 'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs', 18, true),
('00000000-0000-4000-a001-000000000019', '00000000-0000-4000-a000-000000002023', 2023, 'Hanso 1 Commercial Brand Film', 'Ad', 'COMMERCIAL BRAND FILM • VIDEO', 'Hanso Premium Lifestyle', 'Cinematic brand commercial highlighting contemporary fashion and retail aesthetic excellence.', 'https://drive.google.com/thumbnail?id=15HlASUrrPE6DeoQGJLklsHY1S2s5jJ8Y&sz=w1200', 'https://drive.google.com/file/d/15HlASUrrPE6DeoQGJLklsHY1S2s5jJ8Y/preview', true, 'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs', 19, true),
('00000000-0000-4000-a001-000000000020', '00000000-0000-4000-a000-000000002023', 2023, 'Koode Nee — Musical Album (Manorama Music)', 'Music Album', 'CHART-TOPPING MUSICAL ALBUM • VIDEO', 'Manorama Music / RFR Productions', 'Acclaimed musical video production released with major record label Manorama Music, generating widespread digital acclaim.', 'https://img.youtube.com/vi/clgdutCU5G8/hqdefault.jpg', 'https://drive.google.com/file/d/1KyZfc-c5FMJ2gtKxV26-2uX1Yo5ZTkka/preview', true, 'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs', 20, true),
('00000000-0000-4000-a001-000000000021', '00000000-0000-4000-a000-000000002023', 2023, 'Max Influencer Campaigns', 'Campaign', 'RETAIL INFLUENCER CAMPAIGN', 'Max Fashion', 'Multi-quarter festive influencer marketing campaigns driving customer engagement and retail fashion reach for Max Fashion.', NULL, NULL, false, NULL, 21, true),
('00000000-0000-4000-a001-000000000022', '00000000-0000-4000-a000-000000002023', 2023, 'Max Little Icon – Trivandrum Edition', 'Show', 'KIDS TALENT & RUNWAY • SHOWCASE', 'Max Fashion / Trivandrum', 'Premier youth talent hunt and fashion runway showcase celebrating young runway stars in Trivandrum.', '/images/thumbnails/max little icon 2023.jpg', NULL, false, NULL, 22, true),
('00000000-0000-4000-a001-000000000023', '00000000-0000-4000-a000-000000002023', 2023, 'Techie Summer Fest – Cultural Fest, Technopark', 'Event', 'CULTURAL FESTIVAL • VIDEO', 'Technopark Trivandrum', 'Vibrant corporate cultural festival and community celebration staged across the Technopark campus.', NULL, NULL, true, NULL, 23, true),
('00000000-0000-4000-a001-000000000024', '00000000-0000-4000-a000-000000002023', 2023, 'Lulu Funtura Ad', 'Ad', 'ENTERTAINMENT COMMERCIAL • AD FILM', 'Lulu Funtura / Lulu Mall', 'High-energy family entertainment and amusement center commercial advertisement campaign produced for Lulu Funtura.', NULL, NULL, false, NULL, 24, true),
('00000000-0000-4000-a001-000000000025', '00000000-0000-4000-a000-000000002024', 2024, 'Times of India – Aaravam', 'Event', 'MEDIA EVENT • VIDEO', 'Times of India', 'Aaravam, a Times of India event.', 'https://drive.google.com/thumbnail?id=1rmoPoNcownVaPXRYmkaSa3M-n7u6yqhc&sz=w1200', 'https://drive.google.com/file/d/1rmoPoNcownVaPXRYmkaSa3M-n7u6yqhc/preview', true, 'https://drive.google.com/drive/folders/1ztgFUcmtUSEv3sSrFcU3bKy2jI9xZWtL', 25, true),
('00000000-0000-4000-a001-000000000026', '00000000-0000-4000-a000-000000002024', 2024, 'Škoda – Fans of Škoda', 'Campaign', 'EUROPEAN AUTOMOTIVE • VIDEO REEL', 'Škoda Auto India', 'Sophisticated lifestyle automotive campaign featuring curated creators exploring performance, safety, and European luxury drives.', 'https://drive.google.com/thumbnail?id=18-WoWzGDIp7DnrCP6Cd7mA2XN-xr0e8A&sz=w1200', 'https://drive.google.com/file/d/18-WoWzGDIp7DnrCP6Cd7mA2XN-xr0e8A/preview', true, 'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs', 26, true),
('00000000-0000-4000-a001-000000000027', '00000000-0000-4000-a000-000000002024', 2024, 'Ather – Electric Scooter', 'Campaign', 'EV MOBILITY REEL • VIDEO', 'Ather Energy', 'Forward-looking electric mobility campaign connecting sustainable urban commute with tech-savvy lifestyle creators featuring Riyas & Ganga.', 'https://drive.google.com/thumbnail?id=1YymReRbadPvKyAXFzmmGVSsm4lExjIoD&sz=w1200', 'https://drive.google.com/file/d/1YymReRbadPvKyAXFzmmGVSsm4lExjIoD/preview', true, 'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs', 27, true),
('00000000-0000-4000-a001-000000000028', '00000000-0000-4000-a000-000000002024', 2024, 'Ather – Electric Scooter', 'Campaign', 'EV LIFESTYLE CAMPAIGN • VIDEO', 'Ather Energy', 'Urban mobility narrative capturing youth commute, fast charging, and contemporary electric scooter performance.', 'https://drive.google.com/thumbnail?id=1agM4IPcwpZHfsXjbA-o8SfP4kkpPW1t_&sz=w1200', 'https://drive.google.com/file/d/1agM4IPcwpZHfsXjbA-o8SfP4kkpPW1t_/preview', true, 'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs', 28, true),
('00000000-0000-4000-a001-000000000029', '00000000-0000-4000-a000-000000002024', 2024, 'Ather – Festive Campaign', 'Ad', 'HOLIDAY FESTIVE COMMERCIAL • VIDEO', 'Ather Energy', 'High-energy festive holiday campaign celebrating the joy of electric rides with seasonal storytelling and Santa theme.', 'https://drive.google.com/thumbnail?id=1uyYLbEDv9vYWKTYV7MlkflIS9UATtEed&sz=w1200', 'https://drive.google.com/file/d/1uyYLbEDv9vYWKTYV7MlkflIS9UATtEed/preview', true, 'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs', 29, true),
('00000000-0000-4000-a001-000000000030', '00000000-0000-4000-a000-000000002024', 2024, 'Ather', 'Ad', 'SOLO INFLUENCER REEL • VIDEO', 'Ather Energy', 'Solo creator highlight showcasing effortless city cruising and modern design aesthetics with Teena.', 'https://drive.google.com/thumbnail?id=1EMcdGC2j-HSGaON7ApBTC0k9himB2auq&sz=w1200', 'https://drive.google.com/file/d/1EMcdGC2j-HSGaON7ApBTC0k9himB2auq/preview', true, 'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs', 30, true),
('00000000-0000-4000-a001-000000000031', '00000000-0000-4000-a000-000000002024', 2024, 'Build Hub', 'Ad', 'REAL ESTATE & INTERIOR • VIDEO', 'Build Hub', 'Architectural video commercial spotlighting modern building solutions, luxury materials, and contemporary interior concepts.', 'https://drive.google.com/thumbnail?id=1GEWSZYSU8qQKNW05-dSMkmuUBd2AbOhV&sz=w1200', 'https://drive.google.com/file/d/1GEWSZYSU8qQKNW05-dSMkmuUBd2AbOhV/preview', true, 'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs', 31, true),
('00000000-0000-4000-a001-000000000032', '00000000-0000-4000-a000-000000002024', 2024, 'Build Hub', 'Campaign', 'CREATOR REELS CAMPAIGN • VIDEO', 'Build Hub / RFR Network', 'Engaging vertical video format highlighting luxury living spaces and construction excellence with Riyas & Reshma.', 'https://drive.google.com/thumbnail?id=1u0aURKkBDlL2OGBvTlBdObHisDbpAVf3&sz=w1200', 'https://drive.google.com/file/d/1u06VQPUy_karWcBOuLf10AFSGR_9PV35/preview', true, 'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs', 32, true),
('00000000-0000-4000-a001-000000000033', '00000000-0000-4000-a000-000000002024', 2024, 'Build Hub', 'Ad', 'LIFESTYLE COMMERCIAL • VIDEO', 'Build Hub', 'Exclusive interior design walkthrough and architectural finishes presented by Teena.', 'https://drive.google.com/thumbnail?id=1Xar8Hc2PUaoNoSrAsu9j2QqBCD5QOHtZ&sz=w1200', 'https://drive.google.com/file/d/1Xar8Hc2PUaoNoSrAsu9j2QqBCD5QOHtZ/preview', true, 'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs', 33, true),
('00000000-0000-4000-a001-000000000034', '00000000-0000-4000-a000-000000002024', 2024, 'Concept Tyres', 'Ad', 'AUTOMOTIVE ADVERT • VIDEO', 'Concept Tyres', 'Dynamic automotive commercial video capturing road grip, reliability, and precision tyre performance.', 'https://drive.google.com/thumbnail?id=1NhbGg_5G5ZUGLkUak9hZRp1rVmOymWEQ&sz=w1200', 'https://drive.google.com/file/d/1NhbGg_5G5ZUGLkUak9hZRp1rVmOymWEQ/preview', true, 'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs', 34, true),
('00000000-0000-4000-a001-000000000035', '00000000-0000-4000-a000-000000002024', 2024, 'Scoria Lights', 'Ad', 'COMMERCIAL AD • VIDEO', 'Scoria Lights', 'Commercial advertisement production and architectural lighting showcase produced for Scoria Lights.', NULL, NULL, true, NULL, 35, true),
('00000000-0000-4000-a001-000000000036', '00000000-0000-4000-a000-000000002024', 2024, 'Nissan', 'Campaign', 'AUTOMOTIVE INFLUENCER CAMPAIGN • VIDEO', 'Nissan Motors', 'Dynamic automotive influencer campaign and road performance storytelling created for Nissan.', NULL, NULL, true, NULL, 36, true),
('00000000-0000-4000-a001-000000000037', '00000000-0000-4000-a000-000000002025', 2025, 'Rewind with Riyas — Celebrity Talk Show & Podcast', 'Podcast', 'ORIGINAL PODCAST STUDIO IP • 7 EPISODES', 'RFR Studio IP', 'Conversations beyond the runway. Intimate, unfiltered dialogues with film stars, fashion designers, top influencers, and creative pioneers.', 'https://drive.google.com/thumbnail?id=1BwkKNnLO0pV78_R2Cz-wjgL8pBP1eV7E&sz=w1200', 'https://drive.google.com/file/d/1BwkKNnLO0pV78_R2Cz-wjgL8pBP1eV7E/preview', true, 'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs', 37, true),
('00000000-0000-4000-a001-000000000038', '00000000-0000-4000-a000-000000002025', 2025, 'Chakita DD Retreat Show — Stage & Runway Highlights', 'Show', 'COUTURE DESIGNER RUNWAY • VIDEO', 'Chakita Haute Couture / DD Retreat', 'High-concept couture runway showcase featuring avant-garde tailoring, bespoke choreography, stage photography, and celebrity showstoppers.', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80', 'https://drive.google.com/file/d/1WMQC1KhSwMH8U973Iqfy7i_6K5fy7j5Y/preview', true, 'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs', 38, true),
('00000000-0000-4000-a001-000000000039', '00000000-0000-4000-a000-000000002025', 2025, 'Navaratri Naach 2025 — Official Highlight Videos', 'Event', 'GRAND FESTIVAL REEL • VIDEO', 'RFR Festive Productions', 'Spectacular Navaratri celebratory gala featuring vibrant cultural performances, designer ethnic wear, and massive community attendance.', 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1200&q=80', 'https://drive.google.com/file/d/1Fg28k07NGX7Bd4RuxfJ2eIBHXRY3BeZ6/preview', true, 'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs', 39, true),
('00000000-0000-4000-a001-000000000040', '00000000-0000-4000-a000-000000002025', 2025, 'Dandiya Deeshna Night & Highlights Video', 'Event', 'FESTIVE CULTURAL GALA • 3 REELS', 'RFR Cultural Properties', 'High-energy festive celebration uniting traditional Garba beats, dynamic DJ sets, ethnic fashion, and thousands of dancers.', 'https://drive.google.com/thumbnail?id=1HY30vLdhdsZ63PE4t8Hr0Iu5hgxoD6Mu&sz=w1200', 'https://drive.google.com/file/d/1HY30vLdhdsZ63PE4t8Hr0Iu5hgxoD6Mu/preview', true, 'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs', 40, true),
('00000000-0000-4000-a001-000000000041', '00000000-0000-4000-a000-000000002025', 2025, 'Dandiya Night Teaser Video', 'Event', 'FESTIVAL TEASER • VIDEO', 'RFR Cultural Properties', 'Official teaser video capturing the vibrant rhythm, colorful costumes, and electrifying atmosphere of Dandiya Night.', 'https://drive.google.com/thumbnail?id=1dy6TIwofRd4bWLMrdHeiykYkqTVbFIFw&sz=w1200', 'https://drive.google.com/file/d/1dy6TIwofRd4bWLMrdHeiykYkqTVbFIFw/preview', true, 'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs', 41, true),
('00000000-0000-4000-a001-000000000042', '00000000-0000-4000-a000-000000002025', 2025, 'Hycinth Fashion Event with Rohas', 'Show', 'LUXURY HOTEL RUNWAY • VIDEO', 'Hycinth Hotels & Resorts', 'Exclusive five-star fashion presentation spotlighting contemporary silhouettes, guest models, and curated lighting with Rohas.', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80', 'https://drive.google.com/file/d/1nD_NabOGiZW4GT_jawFlXRpPh9ok1ckL/preview', true, 'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs', 42, true),
('00000000-0000-4000-a001-000000000043', '00000000-0000-4000-a000-000000002025', 2025, 'Hycinth Rohan Runway Videos', 'Show', 'DESIGNER SHOWCASE • VIDEO', 'Hycinth Hotels', 'Runway cuts and designer spotlight videos featuring high-fashion choreography at Hycinth.', 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80', 'https://drive.google.com/file/d/1nhQCGv1wlvsZpVAfhI23eR5SccWEE_0E/preview', true, 'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs', 43, true),
('00000000-0000-4000-a001-000000000044', '00000000-0000-4000-a000-000000002025', 2025, 'NYE 2026 Hycinth Highlights & Countdown', 'Event', '5-STAR LUXURY GALA • 4 MEDIA GALLERIES', 'Hycinth Hotels', 'Exclusive countdown spectacle and VIP gala dinner produced with world-class light and sound architecture at Hycinth.', 'https://drive.google.com/thumbnail?id=15vI0jdpl_uq2VdSPrU4py6ylu-bs-4Yv&sz=w1200', 'https://drive.google.com/file/d/15vI0jdpl_uq2VdSPrU4py6ylu-bs-4Yv/preview', true, 'https://drive.google.com/drive/folders/15vI0jdpl_uq2VdSPrU4py6ylu-bs-4Yv', 44, true),
('00000000-0000-4000-a001-000000000045', '00000000-0000-4000-a000-000000002025', 2025, 'NYE 2026 FS Videos & Stage Production', 'Event', 'SPECTACLE VIDEO • COUNTDOWN', 'RFR Stage Architecture', 'Immersive stage engineering, laser shows, and crowd euphoria captured during the NYE 2026 celebration.', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80', 'https://drive.google.com/file/d/1aqqHq2lAQ5SLXhgteRT92P_aCIyG2eaq/preview', true, 'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs', 45, true),
('00000000-0000-4000-a001-000000000046', '00000000-0000-4000-a000-000000002025', 2025, 'Pothys Swarnamahal – Vishu Ad Influencer Campaign', 'Campaign', 'JEWELLERY CAMPAIGN • 7 REELS', 'Pothys Swarnamahal', 'Festive Vishu jewellery influencer campaigns and commercial digital reels produced for Pothys Swarnamahal.', '/images/pothys.png', 'https://drive.google.com/file/d/1pCPpzIG-bo2Z7wiq1rYvQ3Mm1xWQ6tOO/preview', true, NULL, 46, true),
('00000000-0000-4000-a001-000000000047', '00000000-0000-4000-a000-000000002025', 2025, 'Chakita Designer Show', 'Show', 'COUTURE DESIGNER RUNWAY • VIDEO', 'Chakita Haute Couture', 'High-fashion designer runway showcase and bespoke couture choreography for Chakita.', 'https://drive.google.com/thumbnail?id=1WMQC1KhSwMH8U973Iqfy7i_6K5fy7j5Y&sz=w1200', 'https://drive.google.com/file/d/1WMQC1KhSwMH8U973Iqfy7i_6K5fy7j5Y/preview', true, 'https://drive.google.com/drive/folders/1WMQC1KhSwMH8U973Iqfy7i_6K5fy7j5Y', 47, true),
('00000000-0000-4000-a001-000000000048', '00000000-0000-4000-a000-000000002025', 2025, 'Max Designer Show', 'Show', 'FASHION DESIGNER RUNWAY • VIDEO GALLERY', 'Max Fashion', 'Signature contemporary runway presentations and designer collection showcases for Max Fashion.', 'https://drive.google.com/thumbnail?id=1nD_NabOGiZW4GT_jawFlXRpPh9ok1ckL&sz=w1200', 'https://drive.google.com/file/d/1nD_NabOGiZW4GT_jawFlXRpPh9ok1ckL/preview', true, NULL, 48, true),
('00000000-0000-4000-a001-000000000049', '00000000-0000-4000-a000-000000002025', 2025, 'Influencer Campaign – Nissan', 'Campaign', 'AUTOMOTIVE CAMPAIGN • VIDEO', 'Nissan', 'High-impact commercial influencer campaign highlighting Nissan performance, agility, and modern styling.', 'https://drive.google.com/thumbnail?id=1gb6THCIg1MQ75dKOEKd7d52cea7Uh5L_&sz=w1200', 'https://drive.google.com/file/d/1gb6THCIg1MQ75dKOEKd7d52cea7Uh5L_/preview', true, NULL, 49, true),
('00000000-0000-4000-a001-000000000050', '00000000-0000-4000-a000-000000002025', 2025, 'Ather Scooter', 'Campaign', 'EV MOBILITY CAMPAIGN • 2 REELS', 'Ather Energy', 'Next-generation electric scooter commercial campaign and festive holiday storytelling produced for Ather Energy.', 'https://drive.google.com/thumbnail?id=1YymReRbadPvKyAXFzmmGVSsm4lExjIoD&sz=w1200', 'https://drive.google.com/file/d/1YymReRbadPvKyAXFzmmGVSsm4lExjIoD/preview', true, NULL, 50, true),
('00000000-0000-4000-a001-000000000051', '00000000-0000-4000-a000-000000002025', 2025, 'Healing Swan – Wellness Center Ad', 'Ad', 'WELLNESS & HEALTHCARE • AD FILM', 'Healing Swan Wellness Center', 'Serene commercial brand film and holistic lifestyle visual showcase produced for Healing Swan Wellness Center.', 'https://drive.google.com/thumbnail?id=1OlgBH9hHzF1GtYfPOlPvwaJaA_xtUmgc&sz=w1200', 'https://drive.google.com/file/d/1OlgBH9hHzF1GtYfPOlPvwaJaA_xtUmgc/preview', true, NULL, 51, true),
('00000000-0000-4000-a001-000000000052', '00000000-0000-4000-a000-000000002025', 2025, 'Influencer Campaign – Max', 'Campaign', 'FASHION INFLUENCER REEL • VIDEO', 'Max Fashion', 'Dynamic retail fashion influencer campaign featuring Shikha showcasing seasonal collections for Max Fashion.', 'https://drive.google.com/thumbnail?id=1vLeEHWch-OxIwEdpMVSQCm4PL-h6cwbI&sz=w1200', 'https://drive.google.com/file/d/1vLeEHWch-OxIwEdpMVSQCm4PL-h6cwbI/preview', true, NULL, 52, true),
('00000000-0000-4000-a001-000000000053', '00000000-0000-4000-a000-000000002026', 2026, 'Citroën – Aircross Campaign', 'Campaign', 'FRENCH AUTOMOTIVE • 12 CAMPAIGN REELS', 'Citroën India', 'Flagship commercial video production highlighting the dynamic comfort, modular space, and European design of Citroën Aircross.', 'https://drive.google.com/thumbnail?id=17xhWbUtxJePM8igOO7VADLDfiqcG6S04&sz=w1200', 'https://drive.google.com/file/d/17xhWbUtxJePM8igOO7VADLDfiqcG6S04/preview', true, 'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs', 53, true),
('00000000-0000-4000-a001-000000000054', '00000000-0000-4000-a000-000000002026', 2026, 'Citroën – Onam Campaign', 'Campaign', 'FESTIVE AUTOMOTIVE REEL • VIDEO', 'Citroën India', 'Vibrant Onam festival narrative featuring Riyas and Thara exploring Kerala’s heritage in contemporary Citroën vehicles.', 'https://drive.google.com/thumbnail?id=1Jpf1n_swCBJtTytbskrRNVNIa_CMUeMF&sz=w1200', 'https://drive.google.com/file/d/1Jpf1n_swCBJtTytbskrRNVNIa_CMUeMF/preview', true, 'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs', 54, true),
('00000000-0000-4000-a001-000000000055', '00000000-0000-4000-a000-000000002026', 2026, 'Citroën – Onam Showcase', 'Ad', 'FESTIVE LIFESTYLE REEL • VIDEO', 'Citroën India', 'Festive Kerala ethnic styling meets modern automotive elegance featuring Thara in the Citroën Onam special.', 'https://drive.google.com/thumbnail?id=139wztoY-mC0R8Y5x0v_tZWbEqd1XyCmM&sz=w1200', 'https://drive.google.com/file/d/139wztoY-mC0R8Y5x0v_tZWbEqd1XyCmM/preview', true, 'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs', 55, true),
('00000000-0000-4000-a001-000000000056', '00000000-0000-4000-a000-000000002026', 2026, 'Citroën – Pre-Onam Campaign', 'Campaign', 'PRE-FESTIVE CAMPAIGN • VIDEO', 'Citroën India', 'Excitement builds towards Onam celebrations with dynamic road trips, scenic Kerala routes, and Citroën comfort.', 'https://drive.google.com/thumbnail?id=1kPqk0SWzlqcGt3dn1ZWGN5GWDuRXevQB&sz=w1200', 'https://drive.google.com/file/d/1kPqk0SWzlqcGt3dn1ZWGN5GWDuRXevQB/preview', true, 'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs', 56, true),
('00000000-0000-4000-a001-000000000057', '00000000-0000-4000-a000-000000002026', 2026, 'Citroën – Basalt Launch', 'Ad', 'SUV COUPE AD • VIDEO', 'Citroën India', 'Sleek, high-fashion styling meets automotive innovation in the official Citroën Basalt launch video with Riyas.', 'https://drive.google.com/thumbnail?id=1qwwQ8wxW-wOCRN9bG1bW23nJT9OSPN1g&sz=w1200', 'https://drive.google.com/file/d/1qwwQ8wxW-wOCRN9bG1bW23nJT9OSPN1g/preview', true, 'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs', 57, true),
('00000000-0000-4000-a001-000000000058', '00000000-0000-4000-a000-000000002026', 2026, 'Citroën – EV Campaign', 'Ad', 'SUSTAINABLE EV AD • VIDEO', 'Citroën India', 'Quiet luxury, smooth electric acceleration, and urban chic lifestyle video featuring Thara in the all-electric Citroën ë-C3.', 'https://drive.google.com/thumbnail?id=15hsMQ6JIMxRxibiGZx8l5sIpubMQSCe3&sz=w1200', 'https://drive.google.com/file/d/15hsMQ6JIMxRxibiGZx8l5sIpubMQSCe3/preview', true, 'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs', 58, true),
('00000000-0000-4000-a001-000000000059', '00000000-0000-4000-a000-000000002026', 2026, 'Citroën – Commercial Showcase', 'Ad', 'AUTOMOTIVE EDITORIAL • VIDEO', 'Citroën India', 'Editorial commercial cut focusing on precision cockpit design, ambient textures, and lifestyle luxury with Thara.', 'https://drive.google.com/thumbnail?id=1SHBH3ggfVo2xlZSV8mgcsOMrj7KB3yZr&sz=w1200', 'https://drive.google.com/file/d/1SHBH3ggfVo2xlZSV8mgcsOMrj7KB3yZr/preview', true, 'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs', 59, true),
('00000000-0000-4000-a001-000000000060', '00000000-0000-4000-a000-000000002026', 2026, 'Lemon Tree – Leisure Campaign', 'Ad', 'HOSPITALITY COMMERCIAL • 2 REELS', 'Lemon Tree Hotels', 'Cinematic brand film and promotional digital campaign highlighting premier leisure hospitality, suites, and dining with Jeevan.', 'https://drive.google.com/thumbnail?id=1pZfSfv6dcuY2s2uQKI6JudJjJZVpTUOd&sz=w1200', 'https://drive.google.com/file/d/1pZfSfv6dcuY2s2uQKI6JudJjJZVpTUOd/preview', true, 'https://drive.google.com/drive/folders/1pZfSfv6dcuY2s2uQKI6JudJjJZVpTUOd', 60, true),
('00000000-0000-4000-a001-000000000061', '00000000-0000-4000-a000-000000002026', 2026, 'Škoda – Fans of Škoda', 'Event', 'AUTOMOTIVE COMMUNITY IP • 3 REELS', 'Škoda Auto India', 'High-octane gathering for Skoda owners, automobile influencers, and rally enthusiasts featuring experiential drives.', 'https://drive.google.com/thumbnail?id=1LOyGz3BF41nTpwEY00NtOwCt5CuKwPut&sz=w1200', 'https://drive.google.com/file/d/1LOyGz3BF41nTpwEY00NtOwCt5CuKwPut/preview', true, 'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs', 61, true),
('00000000-0000-4000-a001-000000000062', '00000000-0000-4000-a000-000000002026', 2026, 'BLND – Menu Launch', 'Event', 'CULINARY LAUNCH • PENDING MEDIA', 'BLND Resto-Bar', 'High-profile menu unveiling and culinary tasting experience curated with leading lifestyle and food influencers.', NULL, NULL, false, NULL, 62, true),
('00000000-0000-4000-a001-000000000063', '00000000-0000-4000-a000-000000002026', 2026, 'Škoda – Onam Campaign', 'Ad', 'AUTOMOTIVE AD CAMPAIGN • 3 REELS', 'Škoda Auto India', 'Comprehensive festive Onam automotive commercial ad series produced for Škoda Auto India featuring Riyas & Thara.', 'https://drive.google.com/thumbnail?id=1azn97OLlVtjOUk4Wk_4_0iUr6TdYAtX0&sz=w1200', 'https://drive.google.com/file/d/1azn97OLlVtjOUk4Wk_4_0iUr6TdYAtX0/preview', true, NULL, 63, true),
('00000000-0000-4000-a001-000000000064', '00000000-0000-4000-a000-000000002026', 2026, 'Jeep – 4x4 Adventure Campaign', 'Campaign', '4X4 ADVENTURE • 2 REELS', 'Jeep India', 'High-octane off-road automotive commercial series exploring rugged capability, luxury trail design, and outdoor thrills with Jeep.', 'https://drive.google.com/thumbnail?id=1IIbClQ4Af0jwZStOCRWdVGuS19YUiuYx&sz=w1200', 'https://drive.google.com/file/d/1IIbClQ4Af0jwZStOCRWdVGuS19YUiuYx/preview', true, NULL, 64, true),
('00000000-0000-4000-a001-000000000065', '00000000-0000-4000-a000-000000002026', 2026, 'R&B Fashion – Casual Wear Campaign', 'Ad', 'FASHION RETAIL COMMERCIAL • VIDEO', 'R&B Fashion', 'Vibrant retail apparel brand commercial showcasing casual youth trends and lifestyle aesthetics featuring Riyas & Deepa.', 'https://drive.google.com/thumbnail?id=15a_Xh_NZDPL60y73uq_752cJsAyN4S-a&sz=w1200', 'https://drive.google.com/file/d/15a_Xh_NZDPL60y73uq_752cJsAyN4S-a/preview', true, NULL, 65, true);

-- 3. testimonials (12 records: 2 published verified testimonials from testimonialsData.ts, 10 unverified drafts for CMS review)
INSERT INTO public.testimonials (
    id, name, designation, company, image, quote, rating, event_or_brand, is_featured_home, sort_order, is_published
) VALUES
('00000000-0000-4000-a002-000000000001', 'Dr Shikha Santhosh', 'Dental Surgeon / Model / Artist', 'Max Fashion / Independent', '/images/influencers/shikha-santhosh.jpg', 'It has been an absolute pleasure working with Riyaz. I have had the opportunity to collaborate with him on multiple ad shoots and in every single project, he has stood out for his professionalism, clarity and dedication to the craft. He had also invited me to be a part of multiple events as a Jury member and twice as the showstopper for Max Fashion Show. He creates an environment where creativity thrives.', 5, 'Max Fashion Showstopper (2x)', true, 1, true),
('00000000-0000-4000-a002-000000000002', 'Shalini Sharma', 'Fashion Model / Influencer / Core Team, DISHNA', 'DISHNA', '/images/influencers/shalini-sharma.jpg', 'It has been a wonderful experience working with Riyaz. We have had the opportunity to be part of several fashion shows, photoshoots, and also work together as part of the core team of DISHNA. It has always been a pleasure to collaborate with him. His dedication, creativity, and passion for his work make every experience special.', 5, 'Fashion Shows & DISHNA', true, 2, true),
('00000000-0000-4000-a002-000000000003', '[UNVERIFIED - DRAFT FOR REVIEW]', 'Client Representative', 'Brand Partner', '/images/final bro.png', 'Verified testimonial copy pending leadership review in CMS.', 5, 'RFR Property', false, 3, false),
('00000000-0000-4000-a002-000000000004', '[UNVERIFIED - DRAFT FOR REVIEW]', 'Client Representative', 'Brand Partner', '/images/final bro.png', 'Verified testimonial copy pending leadership review in CMS.', 5, 'RFR Property', false, 4, false),
('00000000-0000-4000-a002-000000000005', '[UNVERIFIED - DRAFT FOR REVIEW]', 'Client Representative', 'Brand Partner', '/images/final bro.png', 'Verified testimonial copy pending leadership review in CMS.', 5, 'RFR Property', false, 5, false),
('00000000-0000-4000-a002-000000000006', '[UNVERIFIED - DRAFT FOR REVIEW]', 'Client Representative', 'Brand Partner', '/images/final bro.png', 'Verified testimonial copy pending leadership review in CMS.', 5, 'RFR Property', false, 6, false),
('00000000-0000-4000-a002-000000000007', '[UNVERIFIED - DRAFT FOR REVIEW]', 'Client Representative', 'Brand Partner', '/images/final bro.png', 'Verified testimonial copy pending leadership review in CMS.', 5, 'RFR Property', false, 7, false),
('00000000-0000-4000-a002-000000000008', '[UNVERIFIED - DRAFT FOR REVIEW]', 'Client Representative', 'Brand Partner', '/images/final bro.png', 'Verified testimonial copy pending leadership review in CMS.', 5, 'RFR Property', false, 8, false),
('00000000-0000-4000-a002-000000000009', '[UNVERIFIED - DRAFT FOR REVIEW]', 'Client Representative', 'Brand Partner', '/images/final bro.png', 'Verified testimonial copy pending leadership review in CMS.', 5, 'RFR Property', false, 9, false),
('00000000-0000-4000-a002-000000000010', '[UNVERIFIED - DRAFT FOR REVIEW]', 'Client Representative', 'Brand Partner', '/images/final bro.png', 'Verified testimonial copy pending leadership review in CMS.', 5, 'RFR Property', false, 10, false),
('00000000-0000-4000-a002-000000000011', '[UNVERIFIED - DRAFT FOR REVIEW]', 'Client Representative', 'Brand Partner', '/images/final bro.png', 'Verified testimonial copy pending leadership review in CMS.', 5, 'RFR Property', false, 11, false),
('00000000-0000-4000-a002-000000000012', '[UNVERIFIED - DRAFT FOR REVIEW]', 'Client Representative', 'Brand Partner', '/images/final bro.png', 'Verified testimonial copy pending leadership review in CMS.', 5, 'RFR Property', false, 12, false);

-- 4. partners_clients (18 records)
INSERT INTO public.partners_clients (
    id, name, category, type, description, website, logo, is_transparent, sort_order, is_published
) VALUES
('00000000-0000-4000-a003-000000000001', 'ŠKODA AUTO INDIA', 'Automotive & Mobility', 'client', 'Headline automotive commercial films, Fans of Škoda owner rallies, and digital campaign productions.', '', '/images/clients/skoda.png', true, 1, true),
('00000000-0000-4000-a003-000000000002', 'CITROËN INDIA', 'Automotive & Mobility', 'client', 'Commercial video campaigns for Basalt, Aircross, and EV models featuring key regional influencers.', '', '/images/clients/citroen.png', true, 2, true),
('00000000-0000-4000-a003-000000000003', 'JEEP', 'Automotive & Mobility', 'client', 'Legendary SUV experiential brand partnerships and rugged lifestyle campaigns.', '', '/images/clients/jeep.png', true, 3, true),
('00000000-0000-4000-a003-000000000004', 'R&B FASHION', 'Fashion & Couture', 'client', 'High-energy fashion runway launches, retail store inaugurations, and seasonal lookbook curations.', '', '/images/clients/rb.png', true, 4, true),
('00000000-0000-4000-a003-000000000005', 'MARAIKAR GROUP', 'Automotive & Mobility', 'client', 'Premier automotive, commercial transport, and multi-vertical enterprise group across South India.', '', '/logo/marikar-group.svg', true, 5, true),
('00000000-0000-4000-a003-000000000006', 'W', 'Fashion & Couture', 'client', 'Contemporary women’s ethnic fashion and premium apparel brand with nationwide runway and retail presence.', '', '/logo/w-logo.png', true, 6, true),
('00000000-0000-4000-a003-000000000007', 'TRIVANDRUM INFLUENCERS CIRCLE', 'Creator Guilds & Media', 'client', 'The premier South Indian creator guild uniting 45+ top influencers for enterprise brand campaigns.', '', '', true, 7, true),
('00000000-0000-4000-a003-000000000008', 'MAX FASHION', 'Retail & E-Commerce', 'client', 'Multi-quarter festive campaign shoots, Onam & Diwali influencer promotions, and UDS runway showcases.', '', '/images/clients/max.png', true, 8, true),
('00000000-0000-4000-a003-000000000009', 'PUMA', 'Fashion & Couture', 'client', 'Global sportswear brand experiential activations and marquee New Year celebrations.', '', '', true, 9, true),
('00000000-0000-4000-a003-000000000010', 'MANYAVAR', 'Fashion & Couture', 'client', 'High-fashion ethnic wear editorial productions and bridal couture showcases.', '', '', true, 10, true),
('00000000-0000-4000-a003-000000000011', 'UDS HOTELS & RESORTS', 'Hospitality & Luxury Venues', 'client', 'Five-star destination gala countdowns, seaside runway productions, and VIP hospitality.', '', '', true, 11, true),
('00000000-0000-4000-a003-000000000012', 'LULU INTERNATIONAL MALL', 'Retail & E-Commerce', 'client', 'Global Fashion Week mainstage productions, multi-designer showcases, and mall-wide fashion activations.', '', '', true, 12, true),
('00000000-0000-4000-a003-000000000013', 'ATHER ENERGY', 'Automotive & Mobility', 'client', 'Sustainable EV mobility reels, urban commute storytelling, and holiday festive ad campaigns.', '', '/logo/ather-transparent.png', true, 13, true),
('00000000-0000-4000-a003-000000000014', 'BUILD HUB', 'Commercial Films & Ads', 'client', 'Architectural video commercials and interior lifestyle showcase campaigns.', '', '/logo/buildhub-transparent.png', true, 14, true),
('00000000-0000-4000-a003-000000000015', 'INDUS MOTORS', 'Automotive & Mobility', 'client', 'Premier automotive sales and commercial mobility network brand partnerships across South India.', '', '/logo/indus-motors-transparent.png', true, 15, true),
('00000000-0000-4000-a003-000000000016', 'IMPERIAL KITCHEN', 'Hospitality & Luxury Venues', 'client', 'Authentic South Indian culinary feasts and premier lifestyle hospitality gatherings.', '', '/logo/imperial-kitchen-transparent.png', true, 16, true),
('00000000-0000-4000-a003-000000000017', 'HYCINTH HOTELS', 'Hospitality & Luxury Venues', 'client', 'Five-star luxury hospitality, celebrity gala countdowns, and VIP destination brand showcases.', '', '/logo/hycinth-logo.svg', true, 17, true),
('00000000-0000-4000-a003-000000000018', 'Manorama Music', 'Media Houses & Press Portals', 'partner', NULL, '', '', true, 18, true);

-- 5. press_articles (8 records: 4 published, 4 held as draft for review)
INSERT INTO public.press_articles (
    id, slug, title, category, date_label, author, read_time, cover_image, excerpt, content, tags, is_featured_home, sort_order, is_published
) VALUES
('00000000-0000-4000-a004-000000000001', 'redefining-the-fashion-ecosystem-rfr-vision', 'Redefining the Fashion Runway: How RFR is Bridging Couture, Creators, and Commercial Media', 'Press', 'February 18, 2026', 'Editorial Desk', '5 min read', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80', 'An inside look at Riyas Fashion Runway’s expansive model—transforming traditional fashion presentation into an all-encompassing creative ecosystem.', ARRAY['In an era where fashion is consumed through six-second vertical clips as much as front-row runways, the traditional boundaries of fashion presentation have dissolved. Riyas Fashion Runway (RFR) stands at the forefront of this transformation.', 'Founded by Riyas, RFR was structured to address a critical disconnect in the creative industry: the separation between high couture showcases, digital creator economies, and tangible brand commercial ROI.', 'By integrating high-production runway spectacles with organic UGC pipelines, strategic influencer campaigns, and cultural media formats like the RFR Podcast, the platform has established a new benchmark for fashion ecosystems.']::text[], ARRAY['Fashion', 'Ecosystem', 'Runway', 'Brand Strategy']::text[], true, 1, true),
('00000000-0000-4000-a004-000000000002', 'the-rise-of-experiential-retail-flea-markets', 'The Renaissance of Community Fleas and Curated Lifestyle Marketplaces', 'News', 'January 12, 2026', 'Culture & Lifestyle', '4 min read', 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=1200&q=80', 'Exploring how RFR Flea Market formats are giving independent designers and lifestyle artisans direct access to high-value urban demographics.', ARRAY['While digital commerce continues to expand, urban consumers are seeking authentic, physical, community-driven shopping experiences with high energy and live atmosphere.', 'RFR’s experiential flea market format merges artisanal lifestyle retail with live acoustic music, gourmet culinary pop-ups, and interactive creator zones.', 'Each curation serves as an incubator where emerging independent labels test new collections and build loyal, lifelong customer relationships in a high-aesthetic setting.']::text[], ARRAY['Experiential Retail', 'Flea Markets', 'Community', 'Indie Brands']::text[], true, 2, true),
('00000000-0000-4000-a004-000000000003', 'conversations-beyond-runway-rfr-podcast-launch', 'Conversations Beyond the Runway: Inside the RFR Studio Podcast Initiative', 'Announcements', 'November 28, 2025', 'Media Division', '3 min read', 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=80', 'Unfiltered dialogues with designers, top creators, and industry entrepreneurs dissecting the realities of modern fashion business.', ARRAY['RFR officially announced the launch of its dedicated studio series: Conversations Beyond the Runway.', 'Hosted in a minimalist, high-production studio environment, the podcast dives deep into topics often left unaddressed in standard fashion media—from creative burnout and intellectual property to brand financing and viral marketing algorithms.', 'Episodes are broadcast across Spotify, YouTube, and Apple Podcasts with dedicated short-form clips tailored for next-gen digital audiences.']::text[], ARRAY['Podcast', 'Studio', 'Interviews', 'Thought Leadership']::text[], true, 3, true),
('00000000-0000-4000-a004-000000000004', 'talent-first-philosophy-models-and-creators', 'Building Sustainable Creative Careers: RFR’s Talent Ecosystem Roster', 'Collaborations', 'October 15, 2025', 'Talent Guild', '4 min read', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80', 'How structured representation, ethical production, and brand matching are shaping the next generation of models and digital creators.', ARRAY['Discovering new talent is only the first step. Providing them with consistent, high-credibility brand platforms is where true transformation occurs.', 'Through its four dedicated portals—Careers, Models, Influencers, and Artists—RFR creates a transparent pathway for talent to transition from local recognition to national and international prominence.', 'With transparent rate structuring, legal compliance, and comprehensive portfolio building, the RFR Network is raising the bar for talent welfare.']::text[], ARRAY['Talent', 'Models', 'Influencers', 'Empowerment']::text[], true, 4, true),
('00000000-0000-4000-a004-000000000005', 'press-clipping-chandrika', '[UNVERIFIED - HELD AS DRAFT FOR MANUAL CMS REVIEW] Chandrika Print Feature', 'Press', 'Archival', 'Editorial Desk', '2 min read', '/images/final bro.png', 'Archival newspaper clipping pending verified English transcription in CMS.', ARRAY['Clipping', 'Draft']::text[], ARRAY['Press', 'Draft']::text[], false, 5, false),
('00000000-0000-4000-a004-000000000006', 'press-clipping-kerala-kaumudi', '[UNVERIFIED - HELD AS DRAFT FOR MANUAL CMS REVIEW] Kerala Kaumudi Daily Clipping', 'Press', 'Archival', 'Editorial Desk', '2 min read', '/images/final bro.png', 'Archival newspaper clipping pending verified English transcription in CMS.', ARRAY['Clipping', 'Draft']::text[], ARRAY['Press', 'Draft']::text[], false, 6, false),
('00000000-0000-4000-a004-000000000007', 'press-clipping-technopark', '[UNVERIFIED - HELD AS DRAFT FOR MANUAL CMS REVIEW] Technopark Campus Feature', 'Press', 'Archival', 'Editorial Desk', '2 min read', '/images/final bro.png', 'Archival newspaper clipping pending verified English transcription in CMS.', ARRAY['Clipping', 'Draft']::text[], ARRAY['Press', 'Draft']::text[], false, 7, false),
('00000000-0000-4000-a004-000000000008', 'press-clipping-metro-vartha', '[UNVERIFIED - HELD AS DRAFT FOR MANUAL CMS REVIEW] Metro Vartha Newsprint Feature', 'Press', 'Archival', 'Editorial Desk', '2 min read', '/images/final bro.png', 'Archival newspaper clipping pending verified English transcription in CMS.', ARRAY['Clipping', 'Draft']::text[], ARRAY['Press', 'Draft']::text[], false, 8, false);

-- 6. about_riyas (1 record)
INSERT INTO public.about_riyas (
    id, founder_name, official_title, biography_paragraphs, quote, portrait_image, career_milestones, stats, is_published
) VALUES (
    '00000000-0000-4000-a005-000000000001',
    'RIYAS',
    'Co-Founder — Trivandrum Influencer Circle',
    ARRAY['Riyas is a fashion enthusiast, creative entrepreneur, influencer and event professional with extensive experience across fashion, advertising, events, social media and brand collaborations.', 'With a passion for fashion and creative storytelling, Riyas has worked with brands through designer shoots, advertising campaigns, influencer collaborations, events and digital promotions.', 'Riyas Fashion Runway is an extension of this creative journey — a platform created to bring people, brands and opportunities together.', 'Under Riyas''s vision, RFR has evolved from runway productions into an international-grade creative ecosystem encompassing experiential retail, talent development, commercial campaigns, and cultural media.']::text[],
    'Creativity has no single format. It lives in the convergence of fashion, people, and boundless possibility.',
    '/images/riyas.jpg',
    '[]'::jsonb,
    '{}'::jsonb,
    true
);

-- 7. riyas_gallery_items (12 records)
INSERT INTO public.riyas_gallery_items (
    id, title, caption, image, sort_order, is_published
) VALUES
('00000000-0000-4000-a006-000000000001', 'Riyas Editorial Portrait 01', 'High-resolution master editorial portrait', '/images/riyas img gal/0W0A4080.JPG', 1, true),
('00000000-0000-4000-a006-000000000002', 'Riyas Fashion Lookbook 02', 'High-fashion lookbook vertical portrait', '/images/riyas img gal/FB_IMG_1755941174694.jpg', 2, true),
('00000000-0000-4000-a006-000000000003', 'Riyas Runway Staging 03', 'Runway staging and luxury fashion editorial', '/images/riyas img gal/0W0A4081.JPG', 3, true),
('00000000-0000-4000-a006-000000000004', 'Riyas Contemporary Portrait 04', 'Contemporary editorial portrait photograph', '/images/riyas img gal/WhatsApp Image 2026-11-04 at 11.37.55 PM.jpeg', 4, true),
('00000000-0000-4000-a006-000000000005', 'Riyas Creative Direction 05', 'Creative direction and cinematic presentation', '/images/riyas img gal/0W0A4085.JPG', 5, true),
('00000000-0000-4000-a006-000000000006', 'Riyas Studio Styling 06', 'Signature styling and studio portrait photograph', '/images/riyas img gal/FB_IMG_1718991236184.jpg', 6, true),
('00000000-0000-4000-a006-000000000007', 'Riyas Monochromatic Look 07', 'Editorial monochromatic aesthetic portrait', '/images/riyas img gal/WhatsApp Image 2026-11-04 at 11.37.56 PM (1).jpeg', 7, true),
('00000000-0000-4000-a006-000000000008', 'Riyas Fashion Showcase 08', 'High-fashion runway presentation showcase', '/images/riyas img gal/0W0A4086.JPG', 8, true),
('00000000-0000-4000-a006-000000000009', 'Riyas Couture Staging 09', 'Haute couture curation and architectural lighting', '/images/riyas img gal/WhatsApp Image 2026-11-04 at 11.37.56 PM.jpeg', 9, true),
('00000000-0000-4000-a006-000000000010', 'Riyas Bespoke Tailoring 10', 'Bespoke tailoring and luxury menswear editorial', '/images/riyas img gal/FB_IMG_1718991244583.jpg', 10, true),
('00000000-0000-4000-a006-000000000011', 'Riyas Luxury Gala 11', 'Luxury gala appearance and creative direction', '/images/riyas img gal/WhatsApp Image 2026-11-04 at 11.37.57 PM.jpeg', 11, true),
('00000000-0000-4000-a006-000000000012', 'Riyas Outdoor Staging 12', 'Outdoor runway choreography and set production', '/images/riyas img gal/FB_IMG_1718991249767.jpg', 12, true);

-- 8. gallery_categories (4 records)
INSERT INTO public.gallery_categories (
    id, slug, title, sort_order
) VALUES
('00000000-0000-4000-a007-000000000001', 'events', 'Events & Flea Archives', 1),
('00000000-0000-4000-a007-000000000002', 'shows', 'Shows & Couture Runways', 2),
('00000000-0000-4000-a007-000000000003', 'shoots', 'Shoots & Commercial Ads', 3),
('00000000-0000-4000-a007-000000000004', 'campaigns', 'Influencer & Brand Campaigns', 4);

-- 9. gallery_items (16 records)
INSERT INTO public.gallery_items (
    id, title, category, caption, year, credits, image, dimensions, tags, video_embed_url, drive_view_url, has_video, sort_order, is_published
) VALUES
('00000000-0000-4000-a008-000000000001', 'Koottam Flea Market 2022 — Official Headline Video Reel', 'events', 'Official high-energy video highlights capturing 50+ independent brands, creators, acoustic stage, and community celebration.', 2022, 'RFR Media Productions & Koottam Archives', '/images/thumbnails/1K0wzOv8anMih62lWwAXbRJCZGkxyh3IW.jpg', 'landscape', ARRAY['Koottam Flea', 'Video Reel', 'Festival', 'Crowd', 'Drive Video']::text[], 'https://drive.google.com/file/d/1K0wzOv8anMih62lWwAXbRJCZGkxyh3IW/preview', 'https://drive.google.com/file/d/1K0wzOv8anMih62lWwAXbRJCZGkxyh3IW/view', true, 1, true),
('00000000-0000-4000-a008-000000000002', 'Koottam Flea 2022 — Live Music & Stage Atmosphere', 'events', 'Stage production, acoustic live performances, and electrifying festival audience moments from Koottam 2022.', 2022, 'RFR Media Productions & Koottam Archives', '/images/thumbnails/1OTBpm6zjAgEcxKbGFWZ3k78zsAsLtnW4.jpg', 'portrait', ARRAY['Live Stage', 'Acoustic', 'Music', 'Crowd', 'Drive Video']::text[], 'https://drive.google.com/file/d/1OTBpm6zjAgEcxKbGFWZ3k78zsAsLtnW4/preview', 'https://drive.google.com/file/d/1OTBpm6zjAgEcxKbGFWZ3k78zsAsLtnW4/view', true, 2, true),
('00000000-0000-4000-a008-000000000003', 'Koottam Flea 2022 — Stalls, Food & Creator Lanes', 'events', 'Vibrant boutique marketplace stalls, handcrafted lifestyle merchandise, and gourmet creator experiences.', 2022, 'RFR Media Productions & Koottam Archives', '/images/thumbnails/1N3uDi9gPVaolGuFGvVHwlhuZ2kVhp5_0.jpg', 'landscape', ARRAY['Food Stalls', 'Creators', 'Retail', 'Lifestyle', 'Drive Video']::text[], 'https://drive.google.com/file/d/1N3uDi9gPVaolGuFGvVHwlhuZ2kVhp5_0/preview', 'https://drive.google.com/file/d/1N3uDi9gPVaolGuFGvVHwlhuZ2kVhp5_0/view', true, 3, true),
('00000000-0000-4000-a008-000000000004', 'Navaratri Naach 2025 — Official Video Highlights', 'events', 'Celebratory festival gala with traditional Garba rhythms, high-energy stage performances, and celebrity judges.', 2025, 'RFR Festive Productions', 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1200&q=80', 'landscape', ARRAY['Navaratri', 'Garba', 'Dance', 'Drive Video']::text[], 'https://drive.google.com/file/d/1Fg28k07NGX7Bd4RuxfJ2eIBHXRY3BeZ6/preview', 'https://drive.google.com/file/d/1Fg28k07NGX7Bd4RuxfJ2eIBHXRY3BeZ6/view', true, 4, true),
('00000000-0000-4000-a008-000000000005', 'Dandiya Night & Deeshna Event Teaser', 'events', 'Vibrant colors, ethnic wardrobe styling, and thousands of attendees celebrating the spirit of Dandiya.', 2025, 'RFR Cultural Properties', '/images/thumbnails/1dy6TIwofRd4bWLMrdHeiykYkqTVbFIFw.jpg', 'portrait', ARRAY['Dandiya', 'Festive', 'Costume', 'Drive Video']::text[], 'https://drive.google.com/file/d/1dy6TIwofRd4bWLMrdHeiykYkqTVbFIFw/preview', 'https://drive.google.com/file/d/1dy6TIwofRd4bWLMrdHeiykYkqTVbFIFw/view', true, 5, true),
('00000000-0000-4000-a008-000000000006', 'NYE 2026 — Hycinth Five-Star Gala Video Highlights', 'events', 'Monumental New Year countdown spectacle and VIP banquet featuring lighting choreography and live performers.', 2026, 'Hycinth Hotels & RFR Productions', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80', 'landscape', ARRAY['New Year', 'Gala', 'Countdown', 'Drive Video']::text[], 'https://drive.google.com/file/d/15vI0jdpl_uq2VdSPrU4py6ylu-bs-4Yv/preview', 'https://drive.google.com/file/d/15vI0jdpl_uq2VdSPrU4py6ylu-bs-4Yv/view', true, 6, true),
('00000000-0000-4000-a008-000000000007', 'Chakita DD Retreat Couture Runway Show', 'shows', 'Avant-garde silhouette presentations and dramatic lighting choreography at DD Retreat.', 2025, 'Chakita Haute Couture & RFR Runway', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80', 'portrait', ARRAY['Chakita', 'Couture', 'Runway', 'Drive Video']::text[], 'https://drive.google.com/file/d/1WMQC1KhSwMH8U973Iqfy7i_6K5fy7j5Y/preview', 'https://drive.google.com/file/d/1WMQC1KhSwMH8U973Iqfy7i_6K5fy7j5Y/view', true, 7, true),
('00000000-0000-4000-a008-000000000008', 'Max Fashion Runway Show at UDS Resorts', 'shows', 'Signature holiday collection runway showcase and celebrity guest appearance at UDS Resorts.', 2022, 'Max Fashion & UDS', 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80', 'landscape', ARRAY['Max Fashion', 'UDS', 'Runway', 'Drive Video']::text[], 'https://drive.google.com/file/d/1CC9SQCDOADqMo4uMq-zbVKvWxyETh-bk/preview', 'https://drive.google.com/file/d/1CC9SQCDOADqMo4uMq-zbVKvWxyETh-bk/view', true, 8, true),
('00000000-0000-4000-a008-000000000009', 'Hycinth Fashion Event with Rohas', 'shows', 'Contemporary ready-to-wear styling and model presentation staged at Hycinth.', 2025, 'Hycinth Hotels & RFR Fashion', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80', 'portrait', ARRAY['Hycinth', 'Models', 'Rohas', 'Drive Video']::text[], 'https://drive.google.com/file/d/1nD_NabOGiZW4GT_jawFlXRpPh9ok1ckL/preview', 'https://drive.google.com/file/d/1nD_NabOGiZW4GT_jawFlXRpPh9ok1ckL/view', true, 9, true),
('00000000-0000-4000-a008-000000000010', 'Couture Silhouette in Obsidian', 'shows', 'Dramatic runway lighting spotlighting avant-garde sculptural couture.', 2025, 'RFR Fashion Runway', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80', 'portrait', ARRAY['Runway', 'Couture', 'Black Dress', 'High Fashion']::text[], NULL, NULL, false, 10, true),
('00000000-0000-4000-a008-000000000011', 'Citroën Aircross Commercial Combo Film', 'shoots', 'Cinematic brand film capturing dynamic French automotive styling and plush cabin comfort.', 2026, 'Citroën India & RFR Productions', '/images/thumbnails/17xhWbUtxJePM8igOO7VADLDfiqcG6S04.jpg', 'landscape', ARRAY['Citroën', 'Automotive', 'Commercial Film', 'Drive Video']::text[], 'https://drive.google.com/file/d/17xhWbUtxJePM8igOO7VADLDfiqcG6S04/preview', 'https://drive.google.com/file/d/17xhWbUtxJePM8igOO7VADLDfiqcG6S04/view', true, 11, true),
('00000000-0000-4000-a008-000000000012', 'Citroën Onam Campaign with Riyas & Thara', 'shoots', 'Vibrant festive storytelling connecting Kerala heritage with modern French automotive elegance.', 2026, 'Citroën India & RFR Network', '/images/thumbnails/1Jpf1n_swCBJtTytbskrRNVNIa_CMUeMF.jpg', 'portrait', ARRAY['Citroën', 'Onam', 'Riyas', 'Thara', 'Drive Video']::text[], 'https://drive.google.com/file/d/1Jpf1n_swCBJtTytbskrRNVNIa_CMUeMF/preview', 'https://drive.google.com/file/d/1Jpf1n_swCBJtTytbskrRNVNIa_CMUeMF/view', true, 12, true),
('00000000-0000-4000-a008-000000000013', 'Ather Electric Scooter Campaign — Riyas & Ganga', 'shoots', 'Smart EV performance and contemporary urban lifestyle video with Riyas & Ganga.', 2024, 'Ather Energy & RFR Productions', '/images/thumbnails/1YymReRbadPvKyAXFzmmGVSsm4lExjIoD.jpg', 'portrait', ARRAY['Ather', 'EV Scooter', 'Urban Commute', 'Drive Video']::text[], 'https://drive.google.com/file/d/1YymReRbadPvKyAXFzmmGVSsm4lExjIoD/preview', 'https://drive.google.com/file/d/1YymReRbadPvKyAXFzmmGVSsm4lExjIoD/view', true, 13, true),
('00000000-0000-4000-a008-000000000014', 'Fans of Škoda — Full Campaign & Drive Video', 'shoots', 'European engineering, owner community rally, and precision highway drive highlights.', 2024, 'Škoda Auto India & RFR Productions', '/images/thumbnails/18-WoWzGDIp7DnrCP6Cd7mA2XN-xr0e8A.jpg', 'landscape', ARRAY['Škoda', 'Automotive', 'Community', 'Drive Video']::text[], 'https://drive.google.com/file/d/18-WoWzGDIp7DnrCP6Cd7mA2XN-xr0e8A/preview', 'https://drive.google.com/file/d/18-WoWzGDIp7DnrCP6Cd7mA2XN-xr0e8A/view', true, 14, true),
('00000000-0000-4000-a008-000000000015', 'Buildhub Commercial Video (Riyas & Teena)', 'shoots', 'Luxury residential design, premium architectural materials, and interior solutions commercial.', 2024, 'Build Hub & RFR Studio', '/images/thumbnails/1GEWSZYSU8qQKNW05-dSMkmuUBd2AbOhV.jpg', 'portrait', ARRAY['Buildhub', 'Real Estate', 'Architecture', 'Drive Video']::text[], 'https://drive.google.com/file/d/1GEWSZYSU8qQKNW05-dSMkmuUBd2AbOhV/preview', 'https://drive.google.com/file/d/1GEWSZYSU8qQKNW05-dSMkmuUBd2AbOhV/view', true, 15, true),
('00000000-0000-4000-a008-000000000016', 'Lemon Tree Hotels Commercial Video Campaign', 'shoots', 'Cinematic brand commercial highlighting premier leisure hospitality, suites, and fine dining.', 2026, 'Lemon Tree Hotels & RFR Media', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80', 'landscape', ARRAY['Lemon Tree', 'Hospitality', 'Resort', 'Drive Video']::text[], 'https://drive.google.com/file/d/1pZfSfv6dcuY2s2uQKI6JudJjJZVpTUOd/preview', 'https://drive.google.com/file/d/1pZfSfv6dcuY2s2uQKI6JudJjJZVpTUOd/view', true, 16, true);

-- 10. social_links (4 records)
INSERT INTO public.social_links (
    id, platform, url, handle, is_visible, sort_order
) VALUES
('00000000-0000-4000-a009-000000000001', 'Instagram', 'https://instagram.com/riyas_fashion_runway', '@riyas_fashion_runway', true, 1),
('00000000-0000-4000-a009-000000000002', 'YouTube', 'https://youtube.com/@RFRProductions', 'RFR Productions', true, 2),
('00000000-0000-4000-a009-000000000003', 'LinkedIn', 'https://linkedin.com/company/riyas-fashion-runway', 'Riyas Fashion Runway', true, 3),
('00000000-0000-4000-a009-000000000004', 'Spotify', 'https://open.spotify.com/show/rfr-runway-beats', 'RFR Runway Beats', true, 4);

-- 11. hero_banners (1 record)
INSERT INTO public.hero_banners (
    id, eyebrow, title, subtitle, image_url, video_url, cta_primary_label, cta_primary_link, cta_secondary_label, cta_secondary_link, sort_order, is_published
) VALUES (
    '00000000-0000-4000-a00a-000000000001',
    'THE LUXURY CREATIVE ECOSYSTEM',
    'ARCHITECTING COUTURE & EXPERIENTIAL RUNWAYS',
    'Pioneering experiential flea markets, premier fashion weeks, multi-format media productions, and brand campaigns.',
    '/images/thumbnails/global%20fashion%20week%20lulu.JPG',
    '/videos/hero-bg-optimized.mp4',
    'EXPLORE CHRONICLE',
    '/timeline',
    'INITIATE COLLABORATION',
    '/contact',
    1,
    true
);

-- 12. services_catalog (6 records)
INSERT INTO public.services_catalog (
    id, slug, title, category, badge, subheading, description, detailed_overview, key_highlights, deliverables, target_audience, image, accent_image, video_url, video_embed_url, drive_folder_url, stats, featured_brands, sort_order, is_published
) VALUES
('00000000-0000-4000-a00b-000000000001', 'flea-markets', 'Koottam Flea Market & Lifestyle Curations', 'events', 'SIGNATURE FLEA IP • SEASONS 1–4', 'Kerala''s benchmark experiential flea marketplace uniting 50+ independent brands, creators & live entertainment.', 'RFR''s flagship Koottam Flea Market IP brings together 50+ independent fashion labels, artisanal lifestyle crafts, gourmet culinary creators, acoustic stages, and thousands of attendees in high-vibe weekend curations.', 'Koottam Flea Market is RFR''s proprietary signature IP, conceived to celebrate indie entrepreneurs, home-grown fashion labels, handmade artisan accessories, and contemporary street culture. Across 4 blockbuster editions, Koottam unites curated retail stalls with acoustic live music stages, gourmet pop-up cafes, influencer meetups, and interactive art installations.', ARRAY['Curation of 50+ independent fashion, lifestyle & artisanal brands per edition', 'Integrated live music stages, acoustic sets, and runway pop-ups', 'Engaging culinary spaces and gourmet creator showcases', 'Over 15,000+ enthusiastic attendees across multi-day seasons']::text[], ARRAY['Stall curation & vendor spatial design', 'Comprehensive on-ground production and stage management', 'Sponsor integration & experiential branded zones', 'Omnichannel social and influencer amplification']::text[], 'Fashion-forward shoppers, families, creative professionals, and lifestyle enthusiasts.', '/images/kootam 2022.jpeg', 'https://img.youtube.com/vi/NTDkcWdruPs/maxresdefault.jpg', 'https://www.youtube.com/watch?v=NTDkcWdruPs&t=144s', 'https://www.youtube.com/embed/NTDkcWdruPs?start=144', 'https://drive.google.com/drive/folders/1JPcPSXu6NjKFLhj-_b0r9Xh4vxCTnLaM', '[{"value":"4+","label":"Flagship Seasons"},{"value":"50+","label":"Curated Brands"},{"value":"15,000+","label":"Weekend Footfall"}]'::jsonb, ARRAY['Koottam S1–S4', 'The Fourth Edition', 'Indie Designers', 'Acoustic Stage']::text[], 1, true),
('00000000-0000-4000-a00b-000000000002', 'new-year-events', 'New Year Celebrations & Countdown Galas', 'events', '5-STAR LUXURY COUNTDOWN GALAS', 'Marquee holiday spectacles at UDS Kovalam and Hycinth Hotels with world-class light and sound architecture.', 'High-octane countdown galas produced across Kerala''s premier 5-star properties, featuring headline DJ acts, couture countdown showcases, laser projection mapping, and VIP brand lounges.', 'Engineered as monumental holiday celebrations, RFR New Year productions unite premium hospitality, world-class sound, bespoke lighting architecture, celebrity talent, and immersive visual storytelling. From the seaside luxury of UDS Kovalam to the rooftop elegance of Hycinth Hotels, RFR designs every element of the countdown experience.', ARRAY['Monumental countdown stage architecture and intelligent laser lighting design', 'Headline DJ acts, live performers, and couture countdown showcases', 'VIP hospitality suites and brand lounge takeovers with Puma & partners', 'Full-spectrum crowd flow, guest security, and broadcast video documentation']::text[], ARRAY['Concept, theme, and artistic direction', 'Stage engineering and visual projection mapping', 'Artist curation, booking, and rider fulfillment', 'Sponsor visibility and bespoke VIP brand activations']::text[], 'High-net-worth attendees, urban tastemakers, luxury travelers, and nightlife connoisseurs.', '/images/thumbnails/1KRUi5K2br7newqT5-lfH8Sq7R9EBkyFh.jpg', '/images/thumbnails/1KVBGrkwk5I2ejh8tgxjUasBLyUH_58cO.jpg', '/videos/Dandya%20Deeshna%20Event/hero-bg-optimized.mp4', 'https://drive.google.com/file/d/15vI0jdpl_uq2VdSPrU4py6ylu-bs-4Yv/preview', 'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs', '[{"value":"5-Star","label":"Venue Partners"},{"value":"3,000+","label":"VIP Guests"},{"value":"Turnkey","label":"Laser & Sound"}]'::jsonb, ARRAY['UDS Kovalam', 'Hycinth Hotels', 'Puma Celebrations', 'FS Stage Architecture']::text[], 2, true),
('00000000-0000-4000-a00b-000000000003', 'fashion-events', 'Fashion Runway & Designer Showcases', 'events', 'HIGH COUTURE & RUNWAY ARCHITECTURE', 'The quintessential RFR signature runway presentations from Global Fashion Week Lulu to Chakita DD Retreat.', 'Conceived, styled, and choreographed by Riyas, RFR produces high-couture runway spectacles spotlighting national and international designers, top runway models, avant-garde set design, and 4K editorial broadcasts.', 'At the heart of RFR lies the runway. Riyas conceives, styles, casts, and choreographs couture runway presentations that rival international fashion weeks. Landmark productions include Global Fashion Week at Lulu Mall, Chakita Haute Couture at DD Retreat, Max Xmas Collection at UDS, and seasonal designer launches with national press attention.', ARRAY['Bespoke runway spatial architectures and avant-garde lighting set design', 'Master styling, model casting, and runway choreography by Riyas & industry veterans', 'High-definition multi-camera editorial live streaming and photo coverage', 'Curated buyer, press, and celebrity front-row guest management']::text[], ARRAY['End-to-end runway production and technical backstage coordination', 'Model casting, makeup, hair direction, and wardrobe management', 'Editorial lookbooks and runway video assets', 'National and international fashion media press release dissemination']::text[], 'Fashion houses, couture designers, luxury labels, media, and buyers.', '/images/thumbnails/1MBi1pa3gvbsaC1_T08cz2s82e6dtTKBV.jpg', '/images/thumbnails/1NnWxP1pFfosW1TKY2-NMR1FRJwX6CTZa.jpg', '/videos/Dandya%20Deeshna%20Event/hero-bg-optimized.mp4', 'https://drive.google.com/file/d/1WMQC1KhSwMH8U973Iqfy7i_6K5fy7j5Y/preview', 'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs', '[{"value":"500+","label":"Runway Looks Styled"},{"value":"50+","label":"Couture Designers"},{"value":"4K","label":"Editorial Livestream"}]'::jsonb, ARRAY['Global Fashion Week Lulu', 'Chakita Haute Couture', 'Max Xmas Runway', 'Hycinth Runway']::text[], 3, true),
('00000000-0000-4000-a00b-000000000004', 'kids-events', 'Kids Fashion & Youth Creative Runways', 'events', 'CITI KIDS & YOUTH TALENT PLATFORMS', 'Nurturing young confidence through high-production junior runways, confidence grooming, and family festivals.', 'RFR youth platforms including Citi Kids, Jasmin & Teena Showcase empower children with professional runway training, ethical backstage management, thematic styling, and family-centered celebrations.', 'RFR Kids & Youth division provides a safe, vibrant, and confidence-building artistic platform for the next generation of creative talent. Through our signature Citi Kids and youth runway showcases, children learn posture, stage presence, and confidence grooming in an inspiring, positive, and supportive environment.', ARRAY['Junior runway coaching, styling, and confidence grooming', 'Family-centric interactive zones, creative art pavilions, and gaming', 'Ethical, positive, and supportive production environment', 'High-resolution family portraiture and portfolio captures']::text[], ARRAY['Kids runway choreography and thematic apparel curation', 'Parent hospitality lounges and entertainment schedules', 'Brand integration for apparel, footwear, FMCG, and education labels', 'Commemorative certificates, awards, and portfolio files']::text[], 'Children, parents, youth fashion brands, and family lifestyle businesses.', '/images/thumbnails/1ZKOWzZ-6Gajyvv8faIPy6tLryX17VLt5.jpg', '/images/thumbnails/1LoUUKvQtv4LNrvmDJpMm6WcbFVUokEi-.jpg', '/videos/Dandya%20Deeshna%20Event/hero-bg-optimized.mp4', 'https://drive.google.com/file/d/1ZKOWzZ-6Gajyvv8faIPy6tLryX17VLt5/preview', 'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs', '[{"value":"200+","label":"Junior Talents Groomed"},{"value":"100%","label":"Family Approved"},{"value":"4K","label":"Portfolio Capture"}]'::jsonb, ARRAY['Citi Kids', 'Jasmin & Teena', 'Youth Talent Hunt', 'Junior Runway']::text[], 4, true),
('00000000-0000-4000-a00b-000000000005', 'festival-events', 'Cultural Festivals & Thematic Galas', 'events', 'DANDIYA DEESHNA & NAVARATRI NAACH', 'High-energy festive galas translating cultural heritage into contemporary celebrations with thousands of dancers.', 'Large-scale cultural festivals produced by RFR—including Dandiya Deeshna Night and Navaratri Naach—uniting traditional Garba beats, dynamic DJ sets, ethnic fashion showcases, and massive community attendance.', 'RFR translates cultural heritage into high-energy celebratory spectacles. Our flagship Dandiya Deeshna Night and Navaratri Naach productions bring thousands of revelers together in traditional attire, featuring pulsating sound, vibrant ambient lighting installations, celebrity guests, and live ethnic music.', ARRAY['Immersive thematic set styling inspired by heritage and contemporary art', 'Multi-genre musical and traditional percussion performances', 'Interactive artisan crafts and traditional gourmet culinary spreads', 'Widespread community engagement and high-impact media reach']::text[], ARRAY['Curated cultural performance lineups and artist management', 'Thematic entrance installations and lighting decor', 'VIP guest hosting and hospitality protocols', 'Public relations and digital promotional coverage']::text[], 'Cultural patrons, community communities, corporate partners, and families.', '/images/thumbnails/1N3WOWz33xZXorbuQ_nRc7FMSMAbCeRt_.jpg', '/images/thumbnails/1dy6TIwofRd4bWLMrdHeiykYkqTVbFIFw.jpg', '/videos/Dandya%20Deeshna%20Event/Dandya%20Reel.mp4', 'https://drive.google.com/file/d/12VKNlmgTDMnrom5oXBjj0fGXMUOjRYtp/preview', 'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs', '[{"value":"5,000+","label":"Festival Attendees"},{"value":"100%","label":"Live Ethnic Percussion"},{"value":"Multi-Day","label":"Celebrations"}]'::jsonb, ARRAY['Dandiya Deeshna Night', 'Navaratri Naach', 'Vishu Avoki Launch', 'Cultural Galas']::text[], 5, true),
('00000000-0000-4000-a00b-000000000006', 'influencer', 'Trivandrum Influencer Circle (TIC) & Talent Alliances', 'campaigns', 'INFLUENCE & STORYTELLING • TIC NETWORK', 'Curating high-credibility creator collaborations connecting global brands with South India''s most engaged audiences.', 'Founded and led by RFR, Trivandrum Influencer Circle (TIC) unites top lifestyle, fashion, tech, and automotive creators (Riyas, Ganga, Rithu, Teena, Jeevan, Thara) for authentic brand campaigns with Max Fashion, Ather, and Citroën.', 'We curate creator rosters tailored to brand DNA. As the founders of the Trivandrum Influencer Circle (TIC), RFR bridges the gap between regional cultural authenticity and enterprise brand goals. We manage end-to-end campaign execution from conceptual scripting and talent casting to shoot direction, legal compliance, and multi-platform posting.', ARRAY['Data-driven creator matching based on aesthetic alignment and engagement metrics', 'Bespoke campaign creative briefs and visual storyboarding', 'End-to-end contractual, legal, and deliverable compliance management', 'Comprehensive ROI and performance analytics reporting with 50M+ combined reach']::text[], ARRAY['Creator shortlisting and rate negotiations', 'Content review and creative brand safety vetting', 'Multi-platform posting schedules (Reels, TikTok, YouTube, Threads)', 'Consolidated campaign analytics dossier']::text[], 'Lifestyle, beauty, fashion, tech, automobile, and hospitality brands.', '/images/thumbnails/1YymReRbadPvKyAXFzmmGVSsm4lExjIoD.jpg', '/images/thumbnails/1Jpf1n_swCBJtTytbskrRNVNIa_CMUeMF.jpg', NULL, 'https://drive.google.com/file/d/1YymReRbadPvKyAXFzmmGVSsm4lExjIoD/preview', 'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs', '[{"value":"50M+","label":"Combined Reel Reach"},{"value":"45+","label":"Creator Roster"},{"value":"100%","label":"Verified Engagement"}]'::jsonb, ARRAY['TIC Guild', 'Max Fashion', 'Ather Energy', 'Citroën India']::text[], 6, true);

-- 13. talent_guild_pillars (4 records)
INSERT INTO public.talent_guild_pillars (
    id, pillar_id, title, tagline, description, opportunities, requirements, cta_label, image, gallery, sort_order, is_published
) VALUES
('00000000-0000-4000-a00c-000000000001', 'careers', 'CAREERS AT RFR', 'Shape the future of fashion, media, and experiential entertainment.', 'RFR provides opportunities for passionate individuals who want to build careers across fashion curation, event management, media production, content creation, brand strategy, and entertainment logistics.', ARRAY['Fashion Show Choreographers & Stylists', 'Event Operations & Production Managers', 'Digital Media & Video Editors', 'Brand Partnership & Sponsorship Executives', 'Social Media Curators & Community Managers', 'Graphic Designers & Visual Storytellers']::text[], ARRAY['Passion for contemporary fashion, arts, and experiential design', 'Collaborative mindset with high attention to editorial detail', 'Ability to thrive in fast-paced, high-octane creative environments', 'Demonstrated portfolio or relevant domain experience']::text[], 'EXPLORE CAREERS', '/images/thumbnails/max%20little%20icon%202023.jpg', ARRAY['/images/thumbnails/max%20little%20icon%202023.jpg', '/news%20and%20press/WhatsApp%20Image%202026-11-04%20at%209.41.06%20PM%20(1).jpeg']::text[], 1, true),
('00000000-0000-4000-a00c-000000000002', 'models', 'MODELS NETWORK', 'Step onto the runway and front international fashion campaigns.', 'A platform for aspiring and established models to discover high-profile opportunities across couture fashion shows, designer lookbooks, commercial ad campaigns, brand promotions, and editorial shoots.', ARRAY['Couture & Ready-To-Wear Runway Presentations', 'Designer Campaign Shoots & Commercial Print', 'Brand Activation & VIP Showcase Hostings', 'Fashion Week & Festival Runway Slots', 'E-Commerce & High-Frequency Catalog Lookbooks', 'Digital Editorial & Magazine Features']::text[], ARRAY['Strong runway walk and camera poise', 'Professional punctuality and work ethic', 'Open to varied fashion styling, couture, and creative concepts', 'Updated comp card / portfolio photos']::text[], 'JOIN AS MODEL', '/images/thumbnails/global%20fashion%20week%20lulu.JPG', ARRAY['/images/thumbnails/global%20fashion%20week%20lulu.JPG', '/images/thumbnails/red%20fm.jpg']::text[], 2, true),
('00000000-0000-4000-a00c-000000000003', 'influencers', 'INFLUENCER & CREATOR ROSTER', 'Monetize your voice and partner with marquee lifestyle brands.', 'RFR connects digital creators and lifestyle influencers with forward-thinking brands for authentic sponsorships, red-carpet invitations, viral UGC collaborations, and exclusive brand ambassadorships.', ARRAY['Paid Brand Ambassadorships & Product Campaigns', 'Exclusive VIP Access to Runway Shows & Gala Events', 'Co-Created Product Drops & Collection Launches', 'Sponsored Reels, YouTube Vlogs & UGC Deals', 'Live Event Coverage & Backstage Access Passes', 'Guest Appearances on the RFR Podcast Studio']::text[], ARRAY['Authentic, engaged social media following (Micro, Macro, or Celebrity)', 'High-quality visual aesthetic aligned with fashion/lifestyle', 'Commitment to transparent campaign metrics and timely deliverables', 'Active on Instagram, YouTube, or TikTok']::text[], 'JOIN AS INFLUENCER', '/images/influencers/malavika.jpg', ARRAY['/images/influencers/malavika.jpg', '/images/influencers/rudiya.jpg', '/images/influencers/rhea-george.jpg']::text[], 3, true),
('00000000-0000-4000-a00c-000000000004', 'artists', 'ARTISTS & PERFORMERS GUILD', 'Showcase your artistry across iconic stages and cultural platforms.', 'RFR brings together musicians, DJs, dancers, visual artists, sculptors, and creative innovators for high-impact event performances, brand collaborations, and multimedia stage experiences.', ARRAY['Headline Musical Performances & Live DJ Sets', 'Avant-Garde Choreography & Runway Dance Acts', 'Live Art Installations & Spatial Sculptures', 'Collaborative Merchandise & Visual Art Pieces', 'Festival Stage Main-Act Bookings', 'Original Soundtrack Scoring for Fashion Films']::text[], ARRAY['Original artistic repertoire or performance mastery', 'Experience in live stage production or public showcases', 'Ability to integrate with thematic and high-fashion aesthetics', 'Audio/Video showreel or artistic portfolio submission']::text[], 'JOIN AS ARTIST', '/news%20and%20press/WhatsApp%20Image%202026-11-04%20at%209.41.06%20PM%20(2).jpeg', ARRAY['/news%20and%20press/WhatsApp%20Image%202026-11-04%20at%209.41.06%20PM%20(2).jpeg', '/news%20and%20press/WhatsApp%20Image%202026-11-04%20at%209.41.07%20PM.jpeg', '/news%20and%20press/WhatsApp%20Image%202026-11-04%20at%209.41.08%20PM.jpeg']::text[], 4, true);

-- 14. ecosystem_nodes (10 records)
INSERT INTO public.ecosystem_nodes (
    id, node_id, label, category, description, x, y, z, connections, color, sort_order, is_published
) VALUES
('00000000-0000-4000-a00d-000000000001', 'rfr-core', 'RFR CORE', 'Nucleus', 'The central creative engine orchestrating fashion runways, experiential properties, and multi-format brand campaigns.', 0, 0, 0, ARRAY['brands', 'models', 'influencers', 'artists', 'creators', 'media', 'venues', 'agencies', 'audiences']::text[], '#C7A46A', 1, true),
('00000000-0000-4000-a00d-000000000002', 'brands', 'BRANDS & LABELS', 'Commercial', 'Luxury fashion houses, D2C retail labels, lifestyle conglomerates, automotive, and hospitality partners.', -2.8, 1.8, -0.5, ARRAY['rfr-core', 'creators', 'influencers', 'agencies']::text[], '#F4F1EA', 2, true),
('00000000-0000-4000-a00d-000000000003', 'models', 'MODELS GUILD', 'Talent', 'Couture runway models, commercial talent, editorial muses, and aspiring fashion faces.', -3.2, -1.2, 0.8, ARRAY['rfr-core', 'brands', 'media']::text[], '#C7A46A', 3, true),
('00000000-0000-4000-a00d-000000000004', 'influencers', 'INFLUENCERS', 'Talent', 'High-engagement digital creators, lifestyle tastemakers, and social storytellers.', -1.4, -2.8, -0.8, ARRAY['rfr-core', 'brands', 'creators', 'audiences']::text[], '#C7A46A', 4, true),
('00000000-0000-4000-a00d-000000000005', 'artists', 'ARTISTS & DJS', 'Performers', 'Musicians, live performers, electronic music producers, choreographers, and visual artists.', 1.5, -2.7, 0.6, ARRAY['rfr-core', 'venues', 'audiences']::text[], '#F4F1EA', 5, true),
('00000000-0000-4000-a00d-000000000006', 'creators', 'UGC CREATORS', 'Production', 'Specialized vertical video creators, photographers, editors, and aesthetic copywriters.', 3.2, -1, -0.7, ARRAY['rfr-core', 'brands', 'media']::text[], '#C7A46A', 6, true),
('00000000-0000-4000-a00d-000000000007', 'media', 'MEDIA HOUSES', 'Amplification', 'Fashion publications, digital magazines, broadcast networks, and international press portals.', 2.9, 1.6, 0.4, ARRAY['rfr-core', 'brands', 'audiences']::text[], '#C7A46A', 7, true),
('00000000-0000-4000-a00d-000000000008', 'venues', 'PREMIER VENUES', 'Infrastructure', 'Luxury hotel ballrooms, open-air amphitheaters, heritage spaces, and high-fashion studio spaces.', 1.2, 2.8, -0.6, ARRAY['rfr-core', 'artists', 'brands']::text[], '#F4F1EA', 8, true),
('00000000-0000-4000-a00d-000000000009', 'agencies', 'PARTNER AGENCIES', 'Strategic', 'Advertising agencies, media buying firms, casting houses, and PR collectives.', -1.2, 2.8, 0.7, ARRAY['rfr-core', 'brands', 'media']::text[], '#C7A46A', 9, true),
('00000000-0000-4000-a00d-000000000010', 'audiences', 'AUDIENCES', 'Community', 'Tastemakers, consumers, fashion patrons, and experiential enthusiasts who give life to every creation.', 0, -3.5, 1.2, ARRAY['rfr-core', 'brands', 'influencers', 'artists']::text[], '#FAF9F6', 10, true);


-- ==============================================================================
-- SECTION 8: REGISTER SEED RECORDS & FINAL MIGRATION LEDGER AUDIT
-- ==============================================================================

DO $$
DECLARE
    v_total_objects INT;
    v_total_seeds INT;
BEGIN
    -- 1. Register all 168 seed records into ownership ledger with deterministic signatures
    INSERT INTO public._phase1_created_objects (
        migration_id, object_type, schema_name, parent_table, object_name, recorded_oid, recorded_signature
    )
    SELECT 
        '20261107_phase1_hardened_seed',
        'SEED_RECORD',
        'public',
        s.tbl,
        s.id::text,
        c.oid,
        public.compute_migration_object_signature('SEED_RECORD', 'public', s.id::text, NULL, s.tbl)
    FROM (
    SELECT 'timeline_years' AS tbl, id FROM public.timeline_years WHERE id = ANY(ARRAY[
        '00000000-0000-4000-a000-000000002020'::uuid,
        '00000000-0000-4000-a000-000000002021'::uuid,
        '00000000-0000-4000-a000-000000002022'::uuid,
        '00000000-0000-4000-a000-000000002023'::uuid,
        '00000000-0000-4000-a000-000000002024'::uuid,
        '00000000-0000-4000-a000-000000002025'::uuid,
        '00000000-0000-4000-a000-000000002026'::uuid
    ])
    UNION ALL
    SELECT 'timeline_events' AS tbl, id FROM public.timeline_events WHERE id = ANY(ARRAY[
        '00000000-0000-4000-a001-000000000001'::uuid,
        '00000000-0000-4000-a001-000000000002'::uuid,
        '00000000-0000-4000-a001-000000000003'::uuid,
        '00000000-0000-4000-a001-000000000004'::uuid,
        '00000000-0000-4000-a001-000000000005'::uuid,
        '00000000-0000-4000-a001-000000000006'::uuid,
        '00000000-0000-4000-a001-000000000007'::uuid,
        '00000000-0000-4000-a001-000000000008'::uuid,
        '00000000-0000-4000-a001-000000000009'::uuid,
        '00000000-0000-4000-a001-000000000010'::uuid,
        '00000000-0000-4000-a001-000000000011'::uuid,
        '00000000-0000-4000-a001-000000000012'::uuid,
        '00000000-0000-4000-a001-000000000013'::uuid,
        '00000000-0000-4000-a001-000000000014'::uuid,
        '00000000-0000-4000-a001-000000000015'::uuid,
        '00000000-0000-4000-a001-000000000016'::uuid,
        '00000000-0000-4000-a001-000000000017'::uuid,
        '00000000-0000-4000-a001-000000000018'::uuid,
        '00000000-0000-4000-a001-000000000019'::uuid,
        '00000000-0000-4000-a001-000000000020'::uuid,
        '00000000-0000-4000-a001-000000000021'::uuid,
        '00000000-0000-4000-a001-000000000022'::uuid,
        '00000000-0000-4000-a001-000000000023'::uuid,
        '00000000-0000-4000-a001-000000000024'::uuid,
        '00000000-0000-4000-a001-000000000025'::uuid,
        '00000000-0000-4000-a001-000000000026'::uuid,
        '00000000-0000-4000-a001-000000000027'::uuid,
        '00000000-0000-4000-a001-000000000028'::uuid,
        '00000000-0000-4000-a001-000000000029'::uuid,
        '00000000-0000-4000-a001-000000000030'::uuid,
        '00000000-0000-4000-a001-000000000031'::uuid,
        '00000000-0000-4000-a001-000000000032'::uuid,
        '00000000-0000-4000-a001-000000000033'::uuid,
        '00000000-0000-4000-a001-000000000034'::uuid,
        '00000000-0000-4000-a001-000000000035'::uuid,
        '00000000-0000-4000-a001-000000000036'::uuid,
        '00000000-0000-4000-a001-000000000037'::uuid,
        '00000000-0000-4000-a001-000000000038'::uuid,
        '00000000-0000-4000-a001-000000000039'::uuid,
        '00000000-0000-4000-a001-000000000040'::uuid,
        '00000000-0000-4000-a001-000000000041'::uuid,
        '00000000-0000-4000-a001-000000000042'::uuid,
        '00000000-0000-4000-a001-000000000043'::uuid,
        '00000000-0000-4000-a001-000000000044'::uuid,
        '00000000-0000-4000-a001-000000000045'::uuid,
        '00000000-0000-4000-a001-000000000046'::uuid,
        '00000000-0000-4000-a001-000000000047'::uuid,
        '00000000-0000-4000-a001-000000000048'::uuid,
        '00000000-0000-4000-a001-000000000049'::uuid,
        '00000000-0000-4000-a001-000000000050'::uuid,
        '00000000-0000-4000-a001-000000000051'::uuid,
        '00000000-0000-4000-a001-000000000052'::uuid,
        '00000000-0000-4000-a001-000000000053'::uuid,
        '00000000-0000-4000-a001-000000000054'::uuid,
        '00000000-0000-4000-a001-000000000055'::uuid,
        '00000000-0000-4000-a001-000000000056'::uuid,
        '00000000-0000-4000-a001-000000000057'::uuid,
        '00000000-0000-4000-a001-000000000058'::uuid,
        '00000000-0000-4000-a001-000000000059'::uuid,
        '00000000-0000-4000-a001-000000000060'::uuid,
        '00000000-0000-4000-a001-000000000061'::uuid,
        '00000000-0000-4000-a001-000000000062'::uuid,
        '00000000-0000-4000-a001-000000000063'::uuid,
        '00000000-0000-4000-a001-000000000064'::uuid,
        '00000000-0000-4000-a001-000000000065'::uuid
    ])
    UNION ALL
    SELECT 'testimonials' AS tbl, id FROM public.testimonials WHERE id = ANY(ARRAY[
        '00000000-0000-4000-a002-000000000001'::uuid,
        '00000000-0000-4000-a002-000000000002'::uuid,
        '00000000-0000-4000-a002-000000000003'::uuid,
        '00000000-0000-4000-a002-000000000004'::uuid,
        '00000000-0000-4000-a002-000000000005'::uuid,
        '00000000-0000-4000-a002-000000000006'::uuid,
        '00000000-0000-4000-a002-000000000007'::uuid,
        '00000000-0000-4000-a002-000000000008'::uuid,
        '00000000-0000-4000-a002-000000000009'::uuid,
        '00000000-0000-4000-a002-000000000010'::uuid,
        '00000000-0000-4000-a002-000000000011'::uuid,
        '00000000-0000-4000-a002-000000000012'::uuid
    ])
    UNION ALL
    SELECT 'partners_clients' AS tbl, id FROM public.partners_clients WHERE id = ANY(ARRAY[
        '00000000-0000-4000-a003-000000000001'::uuid,
        '00000000-0000-4000-a003-000000000002'::uuid,
        '00000000-0000-4000-a003-000000000003'::uuid,
        '00000000-0000-4000-a003-000000000004'::uuid,
        '00000000-0000-4000-a003-000000000005'::uuid,
        '00000000-0000-4000-a003-000000000006'::uuid,
        '00000000-0000-4000-a003-000000000007'::uuid,
        '00000000-0000-4000-a003-000000000008'::uuid,
        '00000000-0000-4000-a003-000000000009'::uuid,
        '00000000-0000-4000-a003-000000000010'::uuid,
        '00000000-0000-4000-a003-000000000011'::uuid,
        '00000000-0000-4000-a003-000000000012'::uuid,
        '00000000-0000-4000-a003-000000000013'::uuid,
        '00000000-0000-4000-a003-000000000014'::uuid,
        '00000000-0000-4000-a003-000000000015'::uuid,
        '00000000-0000-4000-a003-000000000016'::uuid,
        '00000000-0000-4000-a003-000000000017'::uuid,
        '00000000-0000-4000-a003-000000000018'::uuid
    ])
    UNION ALL
    SELECT 'press_articles' AS tbl, id FROM public.press_articles WHERE id = ANY(ARRAY[
        '00000000-0000-4000-a004-000000000001'::uuid,
        '00000000-0000-4000-a004-000000000002'::uuid,
        '00000000-0000-4000-a004-000000000003'::uuid,
        '00000000-0000-4000-a004-000000000004'::uuid,
        '00000000-0000-4000-a004-000000000005'::uuid,
        '00000000-0000-4000-a004-000000000006'::uuid,
        '00000000-0000-4000-a004-000000000007'::uuid,
        '00000000-0000-4000-a004-000000000008'::uuid
    ])
    UNION ALL
    SELECT 'about_riyas' AS tbl, id FROM public.about_riyas WHERE id = ANY(ARRAY[
        '00000000-0000-4000-a005-000000000001'::uuid
    ])
    UNION ALL
    SELECT 'riyas_gallery_items' AS tbl, id FROM public.riyas_gallery_items WHERE id = ANY(ARRAY[
        '00000000-0000-4000-a006-000000000001'::uuid,
        '00000000-0000-4000-a006-000000000002'::uuid,
        '00000000-0000-4000-a006-000000000003'::uuid,
        '00000000-0000-4000-a006-000000000004'::uuid,
        '00000000-0000-4000-a006-000000000005'::uuid,
        '00000000-0000-4000-a006-000000000006'::uuid,
        '00000000-0000-4000-a006-000000000007'::uuid,
        '00000000-0000-4000-a006-000000000008'::uuid,
        '00000000-0000-4000-a006-000000000009'::uuid,
        '00000000-0000-4000-a006-000000000010'::uuid,
        '00000000-0000-4000-a006-000000000011'::uuid,
        '00000000-0000-4000-a006-000000000012'::uuid
    ])
    UNION ALL
    SELECT 'gallery_categories' AS tbl, id FROM public.gallery_categories WHERE id = ANY(ARRAY[
        '00000000-0000-4000-a007-000000000001'::uuid,
        '00000000-0000-4000-a007-000000000002'::uuid,
        '00000000-0000-4000-a007-000000000003'::uuid,
        '00000000-0000-4000-a007-000000000004'::uuid
    ])
    UNION ALL
    SELECT 'gallery_items' AS tbl, id FROM public.gallery_items WHERE id = ANY(ARRAY[
        '00000000-0000-4000-a008-000000000001'::uuid,
        '00000000-0000-4000-a008-000000000002'::uuid,
        '00000000-0000-4000-a008-000000000003'::uuid,
        '00000000-0000-4000-a008-000000000004'::uuid,
        '00000000-0000-4000-a008-000000000005'::uuid,
        '00000000-0000-4000-a008-000000000006'::uuid,
        '00000000-0000-4000-a008-000000000007'::uuid,
        '00000000-0000-4000-a008-000000000008'::uuid,
        '00000000-0000-4000-a008-000000000009'::uuid,
        '00000000-0000-4000-a008-000000000010'::uuid,
        '00000000-0000-4000-a008-000000000011'::uuid,
        '00000000-0000-4000-a008-000000000012'::uuid,
        '00000000-0000-4000-a008-000000000013'::uuid,
        '00000000-0000-4000-a008-000000000014'::uuid,
        '00000000-0000-4000-a008-000000000015'::uuid,
        '00000000-0000-4000-a008-000000000016'::uuid
    ])
    UNION ALL
    SELECT 'social_links' AS tbl, id FROM public.social_links WHERE id = ANY(ARRAY[
        '00000000-0000-4000-a009-000000000001'::uuid,
        '00000000-0000-4000-a009-000000000002'::uuid,
        '00000000-0000-4000-a009-000000000003'::uuid,
        '00000000-0000-4000-a009-000000000004'::uuid
    ])
    UNION ALL
    SELECT 'hero_banners' AS tbl, id FROM public.hero_banners WHERE id = ANY(ARRAY[
        '00000000-0000-4000-a00a-000000000001'::uuid
    ])
    UNION ALL
    SELECT 'services_catalog' AS tbl, id FROM public.services_catalog WHERE id = ANY(ARRAY[
        '00000000-0000-4000-a00b-000000000001'::uuid,
        '00000000-0000-4000-a00b-000000000002'::uuid,
        '00000000-0000-4000-a00b-000000000003'::uuid,
        '00000000-0000-4000-a00b-000000000004'::uuid,
        '00000000-0000-4000-a00b-000000000005'::uuid,
        '00000000-0000-4000-a00b-000000000006'::uuid
    ])
    UNION ALL
    SELECT 'talent_guild_pillars' AS tbl, id FROM public.talent_guild_pillars WHERE id = ANY(ARRAY[
        '00000000-0000-4000-a00c-000000000001'::uuid,
        '00000000-0000-4000-a00c-000000000002'::uuid,
        '00000000-0000-4000-a00c-000000000003'::uuid,
        '00000000-0000-4000-a00c-000000000004'::uuid
    ])
    UNION ALL
    SELECT 'ecosystem_nodes' AS tbl, id FROM public.ecosystem_nodes WHERE id = ANY(ARRAY[
        '00000000-0000-4000-a00d-000000000001'::uuid,
        '00000000-0000-4000-a00d-000000000002'::uuid,
        '00000000-0000-4000-a00d-000000000003'::uuid,
        '00000000-0000-4000-a00d-000000000004'::uuid,
        '00000000-0000-4000-a00d-000000000005'::uuid,
        '00000000-0000-4000-a00d-000000000006'::uuid,
        '00000000-0000-4000-a00d-000000000007'::uuid,
        '00000000-0000-4000-a00d-000000000008'::uuid,
        '00000000-0000-4000-a00d-000000000009'::uuid,
        '00000000-0000-4000-a00d-000000000010'::uuid
    ])
    ) s
    JOIN pg_class c ON c.relname = s.tbl
    JOIN pg_namespace n ON c.relnamespace = n.oid AND n.nspname = 'public';

    -- 2. Verify exact seed records registered count
    SELECT count(*) INTO v_total_seeds 
    FROM public._phase1_created_objects 
    WHERE migration_id = '20261107_phase1_hardened_seed' AND object_type = 'SEED_RECORD';

    IF v_total_seeds != 168 THEN
        RAISE EXCEPTION 'MIGRATION_VERIFICATION_FAILED: Expected 168 seed records in ledger, found %', v_total_seeds
            USING ERRCODE = '55000';
    END IF;

    -- 3. Verify total created objects in ledger (21 schema objects + 168 seed records = 189 objects)
    SELECT count(*) INTO v_total_objects 
    FROM public._phase1_created_objects 
    WHERE migration_id = '20261107_phase1_hardened_seed';

    IF v_total_objects != 189 THEN
        RAISE EXCEPTION 'MIGRATION_VERIFICATION_FAILED: Expected 189 total objects in ledger, found %', v_total_objects
            USING ERRCODE = '55000';
    END IF;

    RAISE NOTICE 'Migration ownership ledger audit passed: Exactly % objects registered (% schema objects, % seed records).',
        v_total_objects, (v_total_objects - v_total_seeds), v_total_seeds;
END $$;

COMMIT;
-- ==============================================================================
-- END OF PHASE 1 HARDENED MIGRATION (20261107_phase1_hardened_seed.sql)
-- ==============================================================================
