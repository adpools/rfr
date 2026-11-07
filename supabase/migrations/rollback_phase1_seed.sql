-- ==============================================================================
-- RFR BY RIYAS — PHASE 1 DETERMINISTIC & FAIL-CLOSED ROLLBACK SCRIPT (V17.9)
-- Target Schema: PostgreSQL 15+ / Supabase
-- Operational Mode: ATOMIC TRANSACTION (BEGIN ... COMMIT)
-- Object Identity Protection: Fail-Closed Ownership Ledger Verification
-- Privilege Inversion: Exact Pre-Migration ACL Restoration & aclexplode() Assertion Gate
-- ==============================================================================

BEGIN;

-- ==============================================================================
-- SECTION 1: SYSTEM-CATALOG BOOTSTRAP VERIFICATION OF OWNERSHIP LEDGER
-- ==============================================================================

DO $$
DECLARE
    v_col_count INT;
    v_valid_cols INT;
    v_pk_count INT;
    v_check_count INT;
    v_fk_count INT;
    v_unexpected_con_count INT;
    v_pk_col TEXT;
    v_check_def TEXT;
    v_idx_count INT;
    v_idx_name TEXT;
    v_is_primary BOOLEAN;
    v_is_unique BOOLEAN;
    v_is_valid BOOLEAN;
    v_idx_am TEXT;
    v_idx_pred TEXT;
    v_idx_expr TEXT;
    v_idx_cols TEXT[];
    v_trig_count INT;
    v_rls_enabled BOOLEAN;
    v_force_rls BOOLEAN;
    v_policy_count INT;
    v_untrusted_grants INT;
    v_ledger_entries INT;
    v_foreign_entries INT;
    v_duplicate_entries INT;
    v_count_seed INT;
    v_count_table INT;
    v_count_supp INT;
    v_count_func INT;
    v_count_pol INT;
    v_count_pol_alt INT;
    v_count_priv_alt INT;
BEGIN
    -- 1. Verify ledger table exists in public schema and is owned by postgres
    IF NOT EXISTS (
        SELECT 1 FROM pg_class c
        JOIN pg_namespace n ON c.relnamespace = n.oid
        JOIN pg_roles r ON c.relowner = r.oid
        WHERE n.nspname = 'public' 
          AND c.relname = '_phase1_created_objects' 
          AND r.rolname = 'postgres'
    ) THEN
        RAISE EXCEPTION 'ROLLBACK_ABORTED (FAIL-CLOSED): Ledger table public._phase1_created_objects is missing, has invalid schema, or untrusted owner'
            USING ERRCODE = '55000';
    END IF;

    -- 2. Verify exact ledger columns, data types, nullability, and default expressions
    SELECT count(*) INTO v_col_count
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = '_phase1_created_objects';

    IF v_col_count != 10 THEN
        RAISE EXCEPTION 'ROLLBACK_ABORTED (FAIL-CLOSED): Ledger table column count mismatch (expected 10 columns, found %)', v_col_count
            USING ERRCODE = '55000';
    END IF;

    SELECT count(*) INTO v_valid_cols
    FROM (
        SELECT column_name, data_type, is_nullable, coalesce(column_default, '<none>') AS c_def
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = '_phase1_created_objects'
    ) cols
    WHERE (
        (column_name = 'id' AND data_type = 'uuid' AND is_nullable = 'NO' AND c_def = 'gen_random_uuid()') OR
        (column_name = 'migration_id' AND data_type = 'text' AND is_nullable = 'NO' AND c_def = '''20261107_phase1_hardened_seed''::text') OR
        (column_name = 'object_type' AND data_type = 'text' AND is_nullable = 'NO' AND c_def = '<none>') OR
        (column_name = 'schema_name' AND data_type = 'text' AND is_nullable = 'NO' AND c_def = '''public''::text') OR
        (column_name = 'object_name' AND data_type = 'text' AND is_nullable = 'NO' AND c_def = '<none>') OR
        (column_name = 'identity_arguments' AND data_type = 'text' AND is_nullable = 'YES' AND c_def = '<none>') OR
        (column_name = 'parent_table' AND data_type = 'text' AND is_nullable = 'YES' AND c_def = '<none>') OR
        (column_name = 'recorded_oid' AND data_type = 'oid' AND is_nullable = 'NO' AND c_def = '<none>') OR
        (column_name = 'recorded_signature' AND data_type = 'text' AND is_nullable = 'NO' AND c_def = '<none>') OR
        (column_name = 'created_at' AND data_type = 'timestamp with time zone' AND is_nullable = 'NO' AND c_def = 'now()')
    );

    IF v_valid_cols != 10 THEN
        RAISE EXCEPTION 'ROLLBACK_ABORTED (FAIL-CLOSED): Ledger table column definitions, nullability, or defaults have been altered (expected 10 valid columns, matched %)', v_valid_cols
            USING ERRCODE = '55000';
    END IF;

    -- 3. Verify ledger constraints:
    -- Primary key: exactly 1 on column 'id' named _phase1_created_objects_pkey
    SELECT count(*), min(att.attname)
    INTO v_pk_count, v_pk_col
    FROM pg_constraint con
    JOIN pg_class c ON con.conrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    JOIN pg_attribute att ON att.attrelid = c.oid AND att.attnum = con.conkey[1]
    WHERE n.nspname = 'public' AND c.relname = '_phase1_created_objects' 
      AND con.contype = 'p' AND array_length(con.conkey, 1) = 1;

    IF v_pk_count != 1 OR v_pk_col != 'id' THEN
        RAISE EXCEPTION 'ROLLBACK_ABORTED (FAIL-CLOSED): Primary key must be exactly on column "id" (found count: %, col: %)', v_pk_count, v_pk_col
            USING ERRCODE = '55000';
    END IF;

    -- Check constraint: exactly 1 on object_type checking the 7 allowed values
    SELECT count(*), min(pg_get_constraintdef(con.oid))
    INTO v_check_count, v_check_def
    FROM pg_constraint con
    JOIN pg_class c ON con.conrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE n.nspname = 'public' AND c.relname = '_phase1_created_objects' AND con.contype = 'c';

    IF v_check_count != 1 OR v_check_def != 'CHECK ((object_type = ANY (ARRAY[''TABLE''::text, ''SUPPORT_TABLE''::text, ''FUNCTION''::text, ''POLICY''::text, ''POLICY_ALTERATION''::text, ''PRIVILEGE_ALTERATION''::text, ''SEED_RECORD''::text])))' THEN
        RAISE EXCEPTION 'ROLLBACK_ABORTED (FAIL-CLOSED): CHECK constraint on object_type missing or altered: %', v_check_def
            USING ERRCODE = '55000';
    END IF;

    -- Zero foreign keys allowed on ledger
    SELECT count(*) INTO v_fk_count
    FROM pg_constraint con
    JOIN pg_class c ON con.conrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE n.nspname = 'public' AND c.relname = '_phase1_created_objects' AND con.contype = 'f';

    IF v_fk_count > 0 THEN
        RAISE EXCEPTION 'ROLLBACK_ABORTED (FAIL-CLOSED): Unexpected foreign key constraints found on ledger (count: %)', v_fk_count
            USING ERRCODE = '55000';
    END IF;

    -- Reject unexpected constraints (allowing standard NOT NULL constraints 'n' in modern PG)
    SELECT count(*) INTO v_unexpected_con_count
    FROM pg_constraint con
    JOIN pg_class c ON con.conrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE n.nspname = 'public' AND c.relname = '_phase1_created_objects' 
      AND con.contype NOT IN ('p', 'c', 'n');

    IF v_unexpected_con_count > 0 THEN
        RAISE EXCEPTION 'ROLLBACK_ABORTED (FAIL-CLOSED): Unexpected constraints found on ledger table (count: %)', v_unexpected_con_count
            USING ERRCODE = '55000';
    END IF;

    -- 4. Verify complete index definition: Exactly 1 index, named _phase1_created_objects_pkey, primary, unique, valid, btree, no pred, no expr, on ARRAY['id']
    SELECT count(*) INTO v_idx_count
    FROM pg_index i
    JOIN pg_class c ON i.indrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE n.nspname = 'public' AND c.relname = '_phase1_created_objects';

    IF v_idx_count != 1 THEN
        RAISE EXCEPTION 'ROLLBACK_ABORTED (FAIL-CLOSED): Expected exactly 1 index on ledger table, found %', v_idx_count
            USING ERRCODE = '55000';
    END IF;

    SELECT 
        ic.relname,
        i.indisprimary,
        i.indisunique,
        i.indisvalid,
        am.amname,
        pg_get_expr(i.indpred, i.indrelid),
        pg_get_expr(i.indexprs, i.indrelid),
        array_agg(att.attname::text ORDER BY k.ord)
    INTO 
        v_idx_name, 
        v_is_primary, 
        v_is_unique, 
        v_is_valid, 
        v_idx_am,
        v_idx_pred,
        v_idx_expr,
        v_idx_cols
    FROM pg_index i
    JOIN pg_class c ON i.indrelid = c.oid
    JOIN pg_class ic ON i.indexrelid = ic.oid
    JOIN pg_am am ON ic.relam = am.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    JOIN LATERAL unnest(i.indkey) WITH ORDINALITY AS k(attnum, ord) ON true
    JOIN pg_attribute att ON att.attrelid = i.indrelid AND att.attnum = k.attnum
    WHERE n.nspname = 'public' AND c.relname = '_phase1_created_objects'
    GROUP BY ic.relname, i.indisprimary, i.indisunique, i.indisvalid, am.amname, i.indpred, i.indexprs, i.indrelid;

    IF v_idx_name != '_phase1_created_objects_pkey' OR 
       NOT v_is_primary OR NOT v_is_unique OR NOT v_is_valid OR
       v_idx_am != 'btree' OR v_idx_pred IS NOT NULL OR v_idx_expr IS NOT NULL OR
       v_idx_cols != ARRAY['id'::text] THEN
        RAISE EXCEPTION 'ROLLBACK_ABORTED (FAIL-CLOSED): Primary key index identity, validity, uniqueness or definition mismatch (name: %, primary: %, unique: %, valid: %, am: %, cols: %)',
            v_idx_name, v_is_primary, v_is_unique, v_is_valid, v_idx_am, v_idx_cols
            USING ERRCODE = '55000';
    END IF;

    -- 5. Verify zero non-internal triggers exist on ledger table
    SELECT count(*) INTO v_trig_count
    FROM pg_trigger tr
    JOIN pg_class c ON tr.tgrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE n.nspname = 'public' AND c.relname = '_phase1_created_objects' AND NOT tr.tgisinternal;

    IF v_trig_count > 0 THEN
        RAISE EXCEPTION 'ROLLBACK_ABORTED (FAIL-CLOSED): Unexpected trigger detected on ledger table (expected 0, found %)', v_trig_count
            USING ERRCODE = '55000';
    END IF;

    -- 6. Verify Row Level Security AND FORCE Row Level Security are explicitly enabled on ledger with zero policies (default deny)
    SELECT c.relrowsecurity, c.relforcerowsecurity
    INTO v_rls_enabled, v_force_rls
    FROM pg_class c
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE n.nspname = 'public' AND c.relname = '_phase1_created_objects';

    IF NOT v_rls_enabled OR NOT v_force_rls THEN
        RAISE EXCEPTION 'ROLLBACK_ABORTED (FAIL-CLOSED): Ledger table public._phase1_created_objects must have both Row Level Security and FORCE Row Level Security enabled (relrowsecurity: %, relforcerowsecurity: %)',
            v_rls_enabled, v_force_rls
            USING ERRCODE = '55000';
    END IF;

    SELECT count(*) INTO v_policy_count
    FROM pg_policy pol
    JOIN pg_class c ON pol.polrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE n.nspname = 'public' AND c.relname = '_phase1_created_objects';

    IF v_policy_count > 0 THEN
        RAISE EXCEPTION 'ROLLBACK_ABORTED (FAIL-CLOSED): Unexpected policy detected on ledger table (expected 0 policies for default-deny, found %)', v_policy_count
            USING ERRCODE = '55000';
    END IF;

    -- 7. Verify zero grants have been issued on the ledger to untrusted roles
    SELECT count(*) INTO v_untrusted_grants
    FROM information_schema.role_table_grants
    WHERE table_schema = 'public' 
      AND table_name = '_phase1_created_objects'
      AND grantee IN ('anon', 'authenticated', 'PUBLIC');

    IF v_untrusted_grants > 0 THEN
        RAISE EXCEPTION 'ROLLBACK_ABORTED (FAIL-CLOSED): Ledger permissions have been tampered with (untrusted grants present)'
            USING ERRCODE = '55000';
    END IF;

    -- 8. Verify migration identity, zero NULL or foreign entries, zero duplicate entries, and exact distribution of 7 object types
    SELECT count(*) INTO v_foreign_entries
    FROM public._phase1_created_objects
    WHERE migration_id IS NULL OR migration_id != '20261107_phase1_hardened_seed';

    IF v_foreign_entries > 0 THEN
        RAISE EXCEPTION 'ROLLBACK_ABORTED (FAIL-CLOSED): Ledger contains % foreign or NULL migration_id entries', v_foreign_entries
            USING ERRCODE = '55000';
    END IF;

    SELECT count(*) - count(DISTINCT (object_type, schema_name, coalesce(parent_table, ''), object_name, coalesce(identity_arguments, '')))
    INTO v_duplicate_entries
    FROM public._phase1_created_objects
    WHERE migration_id = '20261107_phase1_hardened_seed';

    IF v_duplicate_entries > 0 THEN
        RAISE EXCEPTION 'ROLLBACK_ABORTED (FAIL-CLOSED): Detected % duplicate object entry(s) in migration ledger', v_duplicate_entries
            USING ERRCODE = '55000';
    END IF;

    SELECT count(*) INTO v_ledger_entries
    FROM public._phase1_created_objects
    WHERE migration_id = '20261107_phase1_hardened_seed';

    IF v_ledger_entries != 189 THEN
        RAISE EXCEPTION 'ROLLBACK_ABORTED (FAIL-CLOSED): Migration ledger identity verification failed (expected 189 entries for 20261107_phase1_hardened_seed, found %)', 
            v_ledger_entries
            USING ERRCODE = '55000';
    END IF;

    SELECT 
        count(*) FILTER (WHERE object_type = 'SEED_RECORD'),
        count(*) FILTER (WHERE object_type = 'TABLE'),
        count(*) FILTER (WHERE object_type = 'SUPPORT_TABLE'),
        count(*) FILTER (WHERE object_type = 'FUNCTION'),
        count(*) FILTER (WHERE object_type = 'POLICY'),
        count(*) FILTER (WHERE object_type = 'POLICY_ALTERATION'),
        count(*) FILTER (WHERE object_type = 'PRIVILEGE_ALTERATION')
    INTO 
        v_count_seed, v_count_table, v_count_supp, v_count_func, v_count_pol, v_count_pol_alt, v_count_priv_alt
    FROM public._phase1_created_objects
    WHERE migration_id = '20261107_phase1_hardened_seed';

    IF v_count_seed != 168 OR v_count_table != 3 OR v_count_supp != 2 OR v_count_func != 8 OR
       v_count_pol != 6 OR v_count_pol_alt != 1 OR v_count_priv_alt != 1 THEN
        RAISE EXCEPTION 'ROLLBACK_ABORTED (FAIL-CLOSED): Ledger object distribution mismatch (found SEED_RECORD: %, TABLE: %, SUPPORT_TABLE: %, FUNCTION: %, POLICY: %, POLICY_ALTERATION: %, PRIVILEGE_ALTERATION: %)',
            v_count_seed, v_count_table, v_count_supp, v_count_func, v_count_pol, v_count_pol_alt, v_count_priv_alt
            USING ERRCODE = '55000';
    END IF;

    RAISE NOTICE 'Ledger bootstrap verified: public._phase1_created_objects matches exact 10-column schema, types, nullability, defaults, PK on id, exact CHECK, complete index definition, 0 triggers, default-deny FORCE RLS, zero NULL/foreign migration_ids, zero duplicates, and exact 189-object distribution.';
END $$;

-- ==============================================================================
-- SECTION 2: FAIL-CLOSED CATALOG OID & CRYPTOGRAPHIC SIGNATURE VERIFICATION GATE
-- ==============================================================================

DO $$
DECLARE
    rec RECORD;
    v_curr_oid OID;
    v_curr_sig TEXT;
    v_row_found BOOLEAN;
    v_mismatches TEXT[] := ARRAY[]::TEXT[];
    v_verified_count INT := 0;
BEGIN
    FOR rec IN 
        SELECT object_type, schema_name, object_name, identity_arguments, parent_table, recorded_oid, recorded_signature
        FROM public._phase1_created_objects
        WHERE migration_id = '20261107_phase1_hardened_seed'
        ORDER BY created_at DESC
    LOOP
        v_curr_oid := NULL;
        v_curr_sig := NULL;

        IF rec.object_type IN ('TABLE', 'SUPPORT_TABLE') THEN
            SELECT c.oid INTO v_curr_oid
            FROM pg_class c
            JOIN pg_namespace n ON c.relnamespace = n.oid
            WHERE n.nspname = rec.schema_name AND c.relname = rec.object_name;

        ELSIF rec.object_type = 'FUNCTION' THEN
            SELECT p.oid INTO v_curr_oid
            FROM pg_proc p
            JOIN pg_namespace n ON p.pronamespace = n.oid
            WHERE n.nspname = rec.schema_name 
              AND p.proname = rec.object_name
              AND pg_get_function_identity_arguments(p.oid) = coalesce(rec.identity_arguments, '');

        ELSIF rec.object_type = 'POLICY' THEN
            SELECT pol.oid INTO v_curr_oid
            FROM pg_policy pol
            JOIN pg_class t ON pol.polrelid = t.oid
            JOIN pg_namespace n ON t.relnamespace = n.oid
            WHERE n.nspname = rec.schema_name 
              AND t.relname = rec.parent_table 
              AND pol.polname = rec.object_name;

        ELSIF rec.object_type = 'POLICY_ALTERATION' THEN
            -- Policy alteration recorded with recorded_oid = 0 (dropped baseline policy)
            v_curr_oid := 0;

        ELSIF rec.object_type = 'PRIVILEGE_ALTERATION' THEN
            -- Privilege alteration recorded with parent table OID
            SELECT c.oid INTO v_curr_oid
            FROM pg_class c
            JOIN pg_namespace n ON c.relnamespace = n.oid
            WHERE n.nspname = rec.schema_name AND c.relname = rec.parent_table;

        ELSIF rec.object_type = 'SEED_RECORD' THEN
            -- Check that parent table exists and has matching OID
            SELECT c.oid INTO v_curr_oid
            FROM pg_class c
            JOIN pg_namespace n ON c.relnamespace = n.oid
            WHERE n.nspname = rec.schema_name AND c.relname = rec.parent_table;

            -- Check that seed row exists in parent table
            EXECUTE format('SELECT EXISTS (SELECT 1 FROM %I.%I WHERE id = %L::uuid)', rec.schema_name, rec.parent_table, rec.object_name)
            INTO v_row_found;

            IF NOT v_row_found THEN
                v_mismatches := array_append(v_mismatches, 'SEED_RECORD row missing in ' || rec.parent_table || ': ' || rec.object_name);
            END IF;
        END IF;

        -- Verify OID against catalog
        IF v_curr_oid IS NULL THEN
            v_mismatches := array_append(v_mismatches, rec.object_type || ' missing from catalog: ' || rec.object_name);
        ELSIF v_curr_oid != rec.recorded_oid THEN
            v_mismatches := array_append(v_mismatches, rec.object_type || ' OID mismatch: ' || rec.object_name || ' (catalog: ' || v_curr_oid::text || ', recorded: ' || rec.recorded_oid::text || ')');
        END IF;

        -- Verify cryptographic signature
        v_curr_sig := public.compute_migration_object_signature(
            rec.object_type, rec.schema_name, rec.object_name, rec.identity_arguments, rec.parent_table
        );

        IF v_curr_sig IS NULL THEN
            v_mismatches := array_append(v_mismatches, rec.object_type || ' signature computation failed: ' || rec.object_name);
        ELSIF v_curr_sig != rec.recorded_signature THEN
            IF rec.object_type = 'SEED_RECORD' THEN
                -- If a seed record was edited in CMS, check if operator explicitly approved destructive rollback
                IF coalesce(current_setting('rfr.force_destructive_rollback', true), 'false') != 'true' THEN
                    v_mismatches := array_append(v_mismatches, 'SEED_RECORD modified since seed insertion (CMS edit detected in ' || rec.parent_table || ': ' || rec.object_name || ')');
                END IF;
            ELSE
                v_mismatches := array_append(v_mismatches, rec.object_type || ' signature mismatch: ' || rec.object_name);
            END IF;
        END IF;

        v_verified_count := v_verified_count + 1;
    END LOOP;

    -- FAIL-CLOSED GATE: Abort immediately on ANY discrepancy
    IF array_length(v_mismatches, 1) > 0 THEN
        RAISE EXCEPTION 'ROLLBACK_ABORTED (FAIL-CLOSED): Pre-rollback verification failed. Tampered, missing or altered objects detected: %', 
            array_to_string(v_mismatches, '; ')
            USING ERRCODE = '55000';
    END IF;

    IF v_verified_count != 189 THEN
        RAISE EXCEPTION 'ROLLBACK_ABORTED (FAIL-CLOSED): Verification count mismatch. Expected 189 objects, verified %', v_verified_count
            USING ERRCODE = '55000';
    END IF;

    RAISE NOTICE 'Fail-Closed Preflight Passed: All 189 objects verified intact against catalog OIDs and signatures.';
END $$;

-- ==============================================================================
-- SECTION 3: REVERSAL OF MODIFIED OBJECTS & RESTORATION OF BASELINE PRIVILEGES
-- ==============================================================================

DO $$
DECLARE
    v_priv_rec RECORD;
    v_captured_acl JSONB;
    v_pre_unrelated_acl JSONB;
    v_post_unrelated_acl JSONB;
    v_current_acl JSONB;
    v_owner_oid OID;
    v_owner_name TEXT;
    v_current_user_oid OID;
    v_unreproducible_grantors TEXT[];
    v_acl_item JSONB;
    v_grantee_oid OID;
    v_grantee_name TEXT;
    v_is_grantable BOOLEAN;
    v_existing_pol_cmd "char";
    v_existing_pol_permissive BOOLEAN;
    v_existing_pol_qual TEXT;
    v_existing_pol_with_check TEXT;
    v_existing_pol_roles OID[];
    v_expected_count INT;
    v_current_count INT;
    v_dup_current_count INT;
    v_diff_missing TEXT[];
    v_diff_unexpected TEXT[];
    v_anon_oid OID;
    v_auth_oid OID;
    v_expected_anon_insert BOOLEAN;
    v_expected_auth_insert BOOLEAN;
    v_admin_users_select BOOLEAN;
    v_admin_users_update BOOLEAN;
BEGIN
    SELECT oid INTO v_anon_oid FROM pg_roles WHERE rolname = 'anon';
    SELECT oid INTO v_auth_oid FROM pg_roles WHERE rolname = 'authenticated';

    -- 1. Fetch table owner OID and current session role OID for public.contact_inquiries
    SELECT c.relowner, r.rolname INTO v_owner_oid, v_owner_name
    FROM pg_class c
    JOIN pg_namespace n ON c.relnamespace = n.oid
    JOIN pg_roles r ON c.relowner = r.oid
    WHERE n.nspname = 'public' AND c.relname = 'contact_inquiries';

    IF v_owner_oid IS NULL THEN
        RAISE EXCEPTION 'ROLLBACK_ABORTED (FAIL-CLOSED): Table public.contact_inquiries owner not found'
            USING ERRCODE = '55000';
    END IF;

    SELECT r.oid INTO v_current_user_oid
    FROM pg_roles r
    WHERE r.rolname = current_user;

    IF v_current_user_oid IS NULL THEN
        RAISE EXCEPTION 'ROLLBACK_ABORTED (FAIL-CLOSED): Current session role "%" not found in pg_roles', current_user
            USING ERRCODE = '55000';
    END IF;

    -- 2. Fetch the captured pre-migration INSERT ACL snapshot from the verified ledger
    SELECT identity_arguments INTO v_priv_rec
    FROM public._phase1_created_objects
    WHERE migration_id = '20261107_phase1_hardened_seed' 
      AND object_type = 'PRIVILEGE_ALTERATION'
      AND object_name = 'contact_inquiries_insert_acl';

    IF v_priv_rec IS NULL OR v_priv_rec.identity_arguments IS NULL THEN
        RAISE EXCEPTION 'ROLLBACK_ABORTED (FAIL-CLOSED): Pre-migration ACL snapshot missing from ledger for contact_inquiries'
            USING ERRCODE = '55000';
    END IF;

    v_captured_acl := v_priv_rec.identity_arguments::jsonb;

    -- 3. Grantor Identity Verification & Reproduction Gate (Strict Catalog Semantics):
    SELECT array_agg(
        format('OID %s (role: %s)', acl_entry->>'grantor_oid', acl_entry->>'grantor_name')
    )
    INTO v_unreproducible_grantors
    FROM jsonb_array_elements(v_captured_acl) acl_entry
    WHERE (acl_entry->>'grantor_oid')::oid IS DISTINCT FROM v_current_user_oid;

    IF v_unreproducible_grantors IS NOT NULL AND array_length(v_unreproducible_grantors, 1) > 0 THEN
        RAISE EXCEPTION 'CANNOT_RESTORE_GRANTOR (FAIL-CLOSED): Pre-migration ACL snapshot contains grantor(s) [%] differing from current execution role OID % ("%"). In PostgreSQL, GRANT statements record CURRENT_USER as grantor; executing under current role cannot reproduce original grantor OID. Rollback aborted prior to modification.',
            array_to_string(v_unreproducible_grantors, ', '), v_current_user_oid, current_user
            USING ERRCODE = '55000';
    END IF;

    -- 4. Pre-Restoration Snapshot: Capture current unrelated (non-INSERT) ACL entries on contact_inquiries
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
    INTO v_pre_unrelated_acl
    FROM (
        SELECT (aclexplode(coalesce(c.relacl, acldefault('r', c.relowner)))).*
        FROM pg_class c
        JOIN pg_namespace n ON c.relnamespace = n.oid
        WHERE n.nspname = 'public' AND c.relname = 'contact_inquiries'
    ) a
    LEFT JOIN pg_roles r_grantee ON a.grantee = r_grantee.oid
    LEFT JOIN pg_roles r_grantor ON a.grantor = r_grantor.oid
    WHERE a.privilege_type != 'INSERT';

    -- 5. Restore baseline contact_inquiries direct public submission policy
    SELECT 
        pol.polcmd,
        pol.polpermissive,
        pg_get_expr(pol.polqual, pol.polrelid),
        pg_get_expr(pol.polwithcheck, pol.polrelid),
        pol.polroles
    INTO 
        v_existing_pol_cmd,
        v_existing_pol_permissive,
        v_existing_pol_qual,
        v_existing_pol_with_check,
        v_existing_pol_roles
    FROM pg_policy pol
    JOIN pg_class c ON pol.polrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE n.nspname = 'public' 
      AND c.relname = 'contact_inquiries' 
      AND pol.polname = 'Public can submit contact inquiries';

    IF v_existing_pol_cmd IS NOT NULL THEN
        DROP POLICY "Public can submit contact inquiries" ON public.contact_inquiries;
    END IF;

    -- Exact baseline definition from 20261106_rfr_cms_complete_schema.sql
    CREATE POLICY "Public can submit contact inquiries"
    ON public.contact_inquiries FOR INSERT
    TO anon, authenticated
    WITH CHECK (bot_honey_field IS NULL);
    RAISE NOTICE 'Restored exact baseline policy: "Public can submit contact inquiries" ON public.contact_inquiries';

    -- 6. Restore exact pre-migration INSERT privileges using ledger captured ACL snapshot
    FOR v_acl_item IN SELECT * FROM jsonb_array_elements(v_captured_acl) LOOP
        v_grantee_oid := (v_acl_item->>'grantee_oid')::oid;
        v_is_grantable := (v_acl_item->>'is_grantable')::boolean;

        IF v_grantee_oid = 0 THEN
            IF v_is_grantable THEN
                GRANT INSERT ON TABLE public.contact_inquiries TO PUBLIC WITH GRANT OPTION;
            ELSE
                GRANT INSERT ON TABLE public.contact_inquiries TO PUBLIC;
            END IF;
            RAISE NOTICE 'Restored INSERT on contact_inquiries TO PUBLIC (grantee OID 0; grantable: %).', v_is_grantable;

        ELSE
            SELECT rolname INTO v_grantee_name
            FROM pg_roles
            WHERE oid = v_grantee_oid;

            IF v_grantee_name IS NULL THEN
                RAISE EXCEPTION 'CANNOT_RESTORE_ACL (FAIL-CLOSED): Grantee role with OID % (recorded name: %) no longer exists in pg_roles. Cannot restore exact ACL; aborting rollback.',
                    v_grantee_oid, v_acl_item->>'grantee_name'
                    USING ERRCODE = '55000';
            END IF;

            IF v_is_grantable THEN
                EXECUTE format('GRANT INSERT ON TABLE public.contact_inquiries TO %I WITH GRANT OPTION', v_grantee_name);
            ELSE
                EXECUTE format('GRANT INSERT ON TABLE public.contact_inquiries TO %I', v_grantee_name);
            END IF;
            RAISE NOTICE 'Restored INSERT on contact_inquiries TO role % (OID %, grantable: %).', v_grantee_name, v_grantee_oid, v_is_grantable;
        END IF;
    END LOOP;

    -- 7. Post-Restoration Assertion: Verify unrelated (non-INSERT) privileges were 100% preserved
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
    INTO v_post_unrelated_acl
    FROM (
        SELECT (aclexplode(coalesce(c.relacl, acldefault('r', c.relowner)))).*
        FROM pg_class c
        JOIN pg_namespace n ON c.relnamespace = n.oid
        WHERE n.nspname = 'public' AND c.relname = 'contact_inquiries'
    ) a
    LEFT JOIN pg_roles r_grantee ON a.grantee = r_grantee.oid
    LEFT JOIN pg_roles r_grantor ON a.grantor = r_grantor.oid
    WHERE a.privilege_type != 'INSERT';

    IF v_pre_unrelated_acl IS DISTINCT FROM v_post_unrelated_acl THEN
        RAISE EXCEPTION 'POST_RESTORATION_VERIFICATION_FAILED: Rollback GRANT operations altered unrelated (non-INSERT) privileges on contact_inquiries (expected %, found %)',
            v_pre_unrelated_acl::text, v_post_unrelated_acl::text
            USING ERRCODE = '55000';
    END IF;

    -- 8. Post-Restoration Assertion: Complete OID-based 4-tuple comparison of restored vs expected INSERT ACL
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
    INTO v_current_acl
    FROM (
        SELECT (aclexplode(coalesce(c.relacl, acldefault('r', c.relowner)))).*
        FROM pg_class c
        JOIN pg_namespace n ON c.relnamespace = n.oid
        WHERE n.nspname = 'public' AND c.relname = 'contact_inquiries'
    ) a
    LEFT JOIN pg_roles r_grantee ON a.grantee = r_grantee.oid
    LEFT JOIN pg_roles r_grantor ON a.grantor = r_grantor.oid
    WHERE a.privilege_type = 'INSERT';

    v_expected_count := jsonb_array_length(v_captured_acl);
    v_current_count := jsonb_array_length(v_current_acl);

    IF v_expected_count != v_current_count THEN
        RAISE EXCEPTION 'POST_RESTORATION_VERIFICATION_FAILED: Restored ACL entry count mismatch. Expected %, found %',
            v_expected_count, v_current_count
            USING ERRCODE = '55000';
    END IF;

    -- Duplicate detection comparing OIDs directly
    SELECT count(*) - count(DISTINCT (
        (cur_item->>'grantor_oid')::oid, 
        (cur_item->>'grantee_oid')::oid, 
        cur_item->>'privilege_type', 
        (cur_item->>'is_grantable')::boolean
    ))
    INTO v_dup_current_count
    FROM jsonb_array_elements(v_current_acl) cur_item;

    IF v_dup_current_count > 0 THEN
        RAISE EXCEPTION 'POST_RESTORATION_VERIFICATION_FAILED: Duplicate ACL entries detected in restored table ACL.'
            USING ERRCODE = '55000';
    END IF;

    -- Missing entries check comparing OIDs directly
    SELECT array_agg(
        format('[grantor_oid=%s (%s), grantee_oid=%s (%s), priv=%s, grantable=%s]',
            exp->>'grantor_oid', exp->>'grantor_name', 
            exp->>'grantee_oid', exp->>'grantee_name', 
            exp->>'privilege_type', exp->>'is_grantable')
    )
    INTO v_diff_missing
    FROM jsonb_array_elements(v_captured_acl) exp
    WHERE NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements(v_current_acl) cur
        WHERE (cur->>'grantor_oid')::oid = (exp->>'grantor_oid')::oid
          AND (cur->>'grantee_oid')::oid = (exp->>'grantee_oid')::oid
          AND cur->>'privilege_type' = exp->>'privilege_type'
          AND (cur->>'is_grantable')::boolean = (exp->>'is_grantable')::boolean
    );

    -- Unexpected entries check comparing OIDs directly
    SELECT array_agg(
        format('[grantor_oid=%s (%s), grantee_oid=%s (%s), priv=%s, grantable=%s]',
            cur->>'grantor_oid', cur->>'grantor_name', 
            cur->>'grantee_oid', cur->>'grantee_name', 
            cur->>'privilege_type', cur->>'is_grantable')
    )
    INTO v_diff_unexpected
    FROM jsonb_array_elements(v_current_acl) cur
    WHERE NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements(v_captured_acl) exp
        WHERE (exp->>'grantor_oid')::oid = (cur->>'grantor_oid')::oid
          AND (exp->>'grantee_oid')::oid = (cur->>'grantee_oid')::oid
          AND exp->>'privilege_type' = cur->>'privilege_type'
          AND (exp->>'is_grantable')::boolean = (cur->>'is_grantable')::boolean
    );

    IF v_diff_missing IS NOT NULL AND array_length(v_diff_missing, 1) > 0 THEN
        RAISE EXCEPTION 'POST_RESTORATION_VERIFICATION_FAILED: Restored ACL missing expected INSERT entry(s): %',
            array_to_string(v_diff_missing, ', ')
            USING ERRCODE = '55000';
    END IF;

    IF v_diff_unexpected IS NOT NULL AND array_length(v_diff_unexpected, 1) > 0 THEN
        RAISE EXCEPTION 'POST_RESTORATION_VERIFICATION_FAILED: Restored ACL contains unexpected INSERT entry(s): %',
            array_to_string(v_diff_unexpected, ', ')
            USING ERRCODE = '55000';
    END IF;

    -- 9. Post-Restoration Assertion: Verify effective INSERT privileges match derived baseline expectations
    v_expected_anon_insert := EXISTS (
        SELECT 1 FROM jsonb_array_elements(v_captured_acl) exp_item 
        WHERE (exp_item->>'grantee_oid')::oid = v_anon_oid OR (exp_item->>'grantee_oid')::oid = 0
    );

    v_expected_auth_insert := EXISTS (
        SELECT 1 FROM jsonb_array_elements(v_captured_acl) exp_item 
        WHERE (exp_item->>'grantee_oid')::oid = v_auth_oid OR (exp_item->>'grantee_oid')::oid = 0
    );

    IF has_table_privilege('anon', 'public.contact_inquiries', 'INSERT') != v_expected_anon_insert THEN
        RAISE EXCEPTION 'POST_RESTORATION_VERIFICATION_FAILED: Effective INSERT privilege mismatch for anon (expected %, found %)',
            v_expected_anon_insert, NOT v_expected_anon_insert
            USING ERRCODE = '55000';
    END IF;

    IF has_table_privilege('authenticated', 'public.contact_inquiries', 'INSERT') != v_expected_auth_insert THEN
        RAISE EXCEPTION 'POST_RESTORATION_VERIFICATION_FAILED: Effective INSERT privilege mismatch for authenticated (expected %, found %)',
            v_expected_auth_insert, NOT v_expected_auth_insert
            USING ERRCODE = '55000';
    END IF;

    -- 10. Post-Restoration Assertion: Complete catalog verification of restored policy definition
    SELECT 
        pol.polcmd,
        pol.polpermissive,
        pg_get_expr(pol.polqual, pol.polrelid),
        pg_get_expr(pol.polwithcheck, pol.polrelid),
        pol.polroles
    INTO 
        v_existing_pol_cmd,
        v_existing_pol_permissive,
        v_existing_pol_qual,
        v_existing_pol_with_check,
        v_existing_pol_roles
    FROM pg_policy pol
    JOIN pg_class c ON pol.polrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE n.nspname = 'public' 
      AND c.relname = 'contact_inquiries' 
      AND pol.polname = 'Public can submit contact inquiries';

    IF v_existing_pol_cmd != 'a' OR NOT v_existing_pol_permissive OR v_existing_pol_qual IS NOT NULL OR 
       trim(coalesce(v_existing_pol_with_check, '')) != '(bot_honey_field IS NULL)' OR
       (v_existing_pol_roles IS DISTINCT FROM ARRAY[v_anon_oid, v_auth_oid] AND v_existing_pol_roles IS DISTINCT FROM ARRAY[v_auth_oid, v_anon_oid]) THEN
        RAISE EXCEPTION 'POST_RESTORATION_VERIFICATION_FAILED: Restored policy definition mismatch in catalog (cmd: %, permissive: %, qual: %, with_check: %, roles: %)',
            v_existing_pol_cmd, v_existing_pol_permissive, v_existing_pol_qual, v_existing_pol_with_check, v_existing_pol_roles::text
            USING ERRCODE = '55000';
    END IF;

    -- 11. Post-Restoration Assertion: Verify admin_users permissions are preserved
    v_admin_users_select := has_table_privilege('authenticated', 'public.admin_users', 'SELECT');
    v_admin_users_update := has_column_privilege('authenticated', 'public.admin_users', 'last_login_at', 'UPDATE');

    IF NOT v_admin_users_select THEN
        RAISE EXCEPTION 'POST_RESTORATION_VERIFICATION_FAILED: authenticated role lost SELECT on public.admin_users'
            USING ERRCODE = '55000';
    END IF;

    IF NOT v_admin_users_update THEN
        RAISE EXCEPTION 'POST_RESTORATION_VERIFICATION_FAILED: authenticated role lost UPDATE(last_login_at) on public.admin_users'
            USING ERRCODE = '55000';
    END IF;

    RAISE NOTICE 'Exact ACL verification passed via aclexplode(): Direct OID 4-tuple comparison matches captured pre-migration snapshot with zero duplicates, zero omissions, verified effective privilege parity, exact policy catalog restoration, and zero side effects on unrelated privileges.';
END $$;

-- ==============================================================================
-- SECTION 4: DELETION OF VERIFIED SEED ROWS (EXACTLY 168 ROWS VIA LEDGER)
-- Deleted in dependency-safe order (child tables before parent tables)
-- Pre-verified for row existence, parent identity, foreign user dependencies, and CMS edits
-- ==============================================================================

DO $$
DECLARE
    v_found_count INT;
    v_orphan_user_events INT;
    v_orphan_user_gallery_items INT;
    v_orphan_discovered INT;
    v_curr_sig TEXT;
    v_edited_details TEXT[] := ARRAY[]::TEXT[];
    v_join_predicate TEXT;
    v_parent_pk_col TEXT;
    v_child_pk_col TEXT;
    v_is_child_seeded BOOLEAN;
    v_query TEXT;
    rec RECORD;
    v_tables_ordered CONSTANT TEXT[] := ARRAY[
        'timeline_events',      -- child of timeline_years
        'timeline_years',       -- parent
        'gallery_items',        -- child of gallery_categories
        'gallery_categories',   -- parent
        'testimonials',
        'partners_clients',
        'press_articles',
        'about_riyas',
        'riyas_gallery_items',
        'social_links',
        'hero_banners',
        'services_catalog',
        'talent_guild_pillars',
        'ecosystem_nodes'
    ];
    v_expected_counts CONSTANT INT[] := ARRAY[
        65, 7, 16, 4, 12, 18, 8, 1, 12, 4, 1, 6, 4, 10
    ];
    i INT;
    v_tbl TEXT;
    v_expected INT;
BEGIN
    -- 1. Dependency safety check 1: Verify no user-created timeline_events reference seeded timeline_years
    SELECT count(*) INTO v_orphan_user_events
    FROM public.timeline_events e
    WHERE e.year_id IN (
        SELECT object_name::uuid 
        FROM public._phase1_created_objects 
        WHERE migration_id = '20261107_phase1_hardened_seed' AND object_type = 'SEED_RECORD' AND parent_table = 'timeline_years'
    )
    AND e.id NOT IN (
        SELECT object_name::uuid 
        FROM public._phase1_created_objects 
        WHERE migration_id = '20261107_phase1_hardened_seed' AND object_type = 'SEED_RECORD' AND parent_table = 'timeline_events'
    );

    IF v_orphan_user_events > 0 THEN
        RAISE EXCEPTION 'DEPENDENCY_VIOLATION (FAIL-CLOSED): Detected % user-created timeline_events referencing seeded timeline_years. Rollback cannot delete seeded parents without destroying or orphaning user data; aborting rollback.',
            v_orphan_user_events
            USING ERRCODE = '55000';
    END IF;

    -- 2. Dependency safety check 2: Verify no user-created gallery_items reference seeded gallery_categories slugs
    SELECT count(*) INTO v_orphan_user_gallery_items
    FROM public.gallery_items g
    WHERE g.category IN (
        SELECT c.slug
        FROM public.gallery_categories c
        WHERE c.id IN (
            SELECT object_name::uuid 
            FROM public._phase1_created_objects 
            WHERE migration_id = '20261107_phase1_hardened_seed' AND object_type = 'SEED_RECORD' AND parent_table = 'gallery_categories'
        )
    )
    AND g.id NOT IN (
        SELECT object_name::uuid 
        FROM public._phase1_created_objects 
        WHERE migration_id = '20261107_phase1_hardened_seed' AND object_type = 'SEED_RECORD' AND parent_table = 'gallery_items'
    );

    IF v_orphan_user_gallery_items > 0 THEN
        RAISE EXCEPTION 'DEPENDENCY_VIOLATION (FAIL-CLOSED): Detected % user-created gallery_items referencing seeded gallery_categories slugs. Deleting seeded categories would orphan user gallery items; aborting rollback.',
            v_orphan_user_gallery_items
            USING ERRCODE = '55000';
    END IF;

    -- 3. Dependency safety check 3: Dynamic foreign-key scanner supporting arbitrary referenced unique keys,
    -- composite keys, child tables without an 'id' column, and schema-qualified table identities.
    FOR rec IN
        WITH seeded_tables AS (
            SELECT DISTINCT schema_name, parent_table
            FROM public._phase1_created_objects
            WHERE migration_id = '20261107_phase1_hardened_seed' AND object_type = 'SEED_RECORD'
        )
        SELECT 
            con.conname AS constraint_name,
            n_child.nspname AS child_schema,
            c_child.relname AS child_table,
            n_parent.nspname AS parent_schema,
            c_parent.relname AS parent_table,
            con.conkey,
            con.confkey,
            c_child.oid AS child_oid,
            c_parent.oid AS parent_oid
        FROM pg_constraint con
        JOIN pg_class c_child ON con.conrelid = c_child.oid
        JOIN pg_namespace n_child ON c_child.relnamespace = n_child.oid
        JOIN pg_class c_parent ON con.confrelid = c_parent.oid
        JOIN pg_namespace n_parent ON c_parent.relnamespace = n_parent.oid
        JOIN seeded_tables st ON st.schema_name = n_parent.nspname AND st.parent_table = c_parent.relname
        WHERE con.contype = 'f'
    LOOP
        -- Construct arbitrary/composite join predicate between child and parent
        SELECT string_agg(format('child.%I = parent.%I', child_col, parent_col), ' AND ')
        INTO v_join_predicate
        FROM (
            SELECT 
                att_c.attname AS child_col,
                att_p.attname AS parent_col
            FROM unnest(rec.conkey) WITH ORDINALITY AS k(attnum, ord)
            JOIN unnest(rec.confkey) WITH ORDINALITY AS fk(attnum, ord) ON k.ord = fk.ord
            JOIN pg_attribute att_c ON att_c.attrelid = rec.child_oid AND att_c.attnum = k.attnum
            JOIN pg_attribute att_p ON att_p.attrelid = rec.parent_oid AND att_p.attnum = fk.attnum
            ORDER BY k.ord
        ) cols;

        -- Resolve parent primary key column dynamically
        SELECT min(att.attname) INTO v_parent_pk_col
        FROM pg_constraint pcon
        JOIN pg_attribute att ON att.attrelid = rec.parent_oid AND att.attnum = pcon.conkey[1]
        WHERE pcon.conrelid = rec.parent_oid AND pcon.contype = 'p';

        IF v_parent_pk_col IS NULL THEN
            v_parent_pk_col := 'id';
        END IF;

        -- Check whether child table itself is a seeded table from this migration
        SELECT EXISTS (
            SELECT 1 FROM public._phase1_created_objects
            WHERE migration_id = '20261107_phase1_hardened_seed' 
              AND object_type = 'SEED_RECORD'
              AND schema_name = rec.child_schema
              AND parent_table = rec.child_table
        ) INTO v_is_child_seeded;

        IF v_is_child_seeded THEN
            -- Child table is a seeded table: resolve child primary key column dynamically
            SELECT min(att.attname) INTO v_child_pk_col
            FROM pg_constraint ccon
            JOIN pg_attribute att ON att.attrelid = rec.child_oid AND att.attnum = ccon.conkey[1]
            WHERE ccon.conrelid = rec.child_oid AND ccon.contype = 'p';

            IF v_child_pk_col IS NULL THEN
                v_child_pk_col := 'id';
            END IF;

            -- Find any child records that reference a seeded parent but are NOT themselves recorded in the migration ledger
            v_query := format(
                'SELECT count(*) FROM %I.%I child 
                 WHERE EXISTS (
                     SELECT 1 FROM %I.%I parent 
                     WHERE parent.%I::text IN (
                         SELECT object_name FROM public._phase1_created_objects 
                         WHERE migration_id = ''20261107_phase1_hardened_seed'' 
                           AND object_type = ''SEED_RECORD'' 
                           AND schema_name = %L
                           AND parent_table = %L
                     )
                     AND %s
                 )
                 AND child.%I::text NOT IN (
                     SELECT object_name FROM public._phase1_created_objects 
                     WHERE migration_id = ''20261107_phase1_hardened_seed'' 
                       AND object_type = ''SEED_RECORD'' 
                       AND schema_name = %L
                       AND parent_table = %L
                 )',
                rec.child_schema, rec.child_table,
                rec.parent_schema, rec.parent_table,
                v_parent_pk_col,
                rec.parent_schema, rec.parent_table,
                v_join_predicate,
                v_child_pk_col,
                rec.child_schema, rec.child_table
            );
        ELSE
            -- Child table is NOT a seeded table (e.g. user-created table, junction table, table without 'id'):
            -- ANY row referencing a seeded parent row is an external user dependency!
            v_query := format(
                'SELECT count(*) FROM %I.%I child 
                 WHERE EXISTS (
                     SELECT 1 FROM %I.%I parent 
                     WHERE parent.%I::text IN (
                         SELECT object_name FROM public._phase1_created_objects 
                         WHERE migration_id = ''20261107_phase1_hardened_seed'' 
                           AND object_type = ''SEED_RECORD'' 
                           AND schema_name = %L
                           AND parent_table = %L
                     )
                     AND %s
                 )',
                rec.child_schema, rec.child_table,
                rec.parent_schema, rec.parent_table,
                v_parent_pk_col,
                rec.parent_schema, rec.parent_table,
                v_join_predicate
            );
        END IF;

        EXECUTE v_query INTO v_orphan_discovered;

        IF v_orphan_discovered > 0 THEN
            RAISE EXCEPTION 'DEPENDENCY_VIOLATION (FAIL-CLOSED): Detected % user-created record(s) in child table %.% (FK constraint "%") referencing seeded parent rows in %.%. Aborting rollback to prevent data loss or FK violations.',
                v_orphan_discovered, rec.child_schema, rec.child_table, rec.constraint_name, rec.parent_schema, rec.parent_table
                USING ERRCODE = '55000';
        END IF;
    END LOOP;

    -- 4. Pre-verification: Verify every target table and every recorded seed row ID exists before deleting anything
    FOR i IN 1..array_length(v_tables_ordered, 1) LOOP
        v_tbl := v_tables_ordered[i];
        v_expected := v_expected_counts[i];

        EXECUTE format(
            'SELECT count(*) FROM public.%I WHERE id IN (
                SELECT object_name::uuid 
                FROM public._phase1_created_objects 
                WHERE migration_id = %L 
                  AND object_type = %L 
                  AND parent_table = %L
            )',
            v_tbl,
            '20261107_phase1_hardened_seed',
            'SEED_RECORD',
            v_tbl
        ) INTO v_found_count;

        IF v_found_count != v_expected THEN
            RAISE EXCEPTION 'ROLLBACK_ABORTED (FAIL-CLOSED): Pre-deletion row count mismatch for table %. Expected % seed rows in database, found %',
                v_tbl, v_expected, v_found_count
                USING ERRCODE = '55000';
        END IF;
    END LOOP;

    -- 5. CMS Content Protection Gate: Detect changes against original seed values
    FOR i IN 1..array_length(v_tables_ordered, 1) LOOP
        v_tbl := v_tables_ordered[i];
        
        FOR rec IN
            SELECT object_name, recorded_signature
            FROM public._phase1_created_objects
            WHERE migration_id = '20261107_phase1_hardened_seed' 
              AND object_type = 'SEED_RECORD' 
              AND parent_table = v_tbl
        LOOP
            BEGIN
                v_curr_sig := public.compute_migration_object_signature('SEED_RECORD', 'public', rec.object_name, NULL, v_tbl);
            EXCEPTION WHEN OTHERS THEN
                v_curr_sig := NULL;
            END;

            IF v_curr_sig IS DISTINCT FROM rec.recorded_signature THEN
                v_edited_details := array_append(v_edited_details, format('%s:%s', v_tbl, rec.object_name));
            END IF;
        END LOOP;
    END LOOP;

    IF v_edited_details IS NOT NULL AND array_length(v_edited_details, 1) > 0 THEN
        IF coalesce(current_setting('rfr.force_destructive_rollback', true), 'false') != 'true' THEN
            RAISE EXCEPTION 'CMS_CONTENT_EDITED_ABORT (FAIL-CLOSED): Detected % seeded record(s) that have been modified by administrators since migration. Rollback will not silently delete edited CMS content. Modified records: [%]. To confirm intentional destruction of modified content, execute "SET LOCAL rfr.force_destructive_rollback = true;" within the transaction before running rollback.',
                array_length(v_edited_details, 1), array_to_string(v_edited_details, ', ')
                USING ERRCODE = '55000';
        ELSE
            RAISE WARNING 'DESTRUCTIVE OVERRIDE ACTIVE: Deleting % modified seed records per rfr.force_destructive_rollback directive.',
                array_length(v_edited_details, 1);
        END IF;
    END IF;

    -- 6. Execute deletion strictly filtering by verified migration ownership marker in ledger
    FOR i IN 1..array_length(v_tables_ordered, 1) LOOP
        v_tbl := v_tables_ordered[i];
        v_expected := v_expected_counts[i];

        EXECUTE format(
            'DELETE FROM public.%I WHERE id IN (
                SELECT object_name::uuid 
                FROM public._phase1_created_objects 
                WHERE migration_id = %L 
                  AND object_type = %L 
                  AND parent_table = %L
            )',
            v_tbl,
            '20261107_phase1_hardened_seed',
            'SEED_RECORD',
            v_tbl
        );
        RAISE NOTICE 'Deleted % seed records from table %', v_expected, v_tbl;
    END LOOP;
END $$;

-- ==============================================================================
-- SECTION 5: TEARDOWN OF MIGRATION OBJECTS & LEDGER SELF-DROP
-- ==============================================================================

-- 1. Drop migration policies
DO $$
DECLARE
    rec RECORD;
BEGIN
    FOR rec IN
        SELECT schema_name, parent_table, object_name
        FROM public._phase1_created_objects
        WHERE migration_id = '20261107_phase1_hardened_seed' AND object_type = 'POLICY'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I;', rec.object_name, rec.schema_name, rec.parent_table);
        RAISE NOTICE 'Dropped policy: % ON %.%', rec.object_name, rec.schema_name, rec.parent_table;
    END LOOP;
END $$;

-- 2. Drop migration functions
DO $$
DECLARE
    rec RECORD;
BEGIN
    FOR rec IN
        SELECT schema_name, object_name, identity_arguments
        FROM public._phase1_created_objects
        WHERE migration_id = '20261107_phase1_hardened_seed' AND object_type = 'FUNCTION'
    LOOP
        EXECUTE format('DROP FUNCTION IF EXISTS %I.%I(%s) RESTRICT;', rec.schema_name, rec.object_name, coalesce(rec.identity_arguments, ''));
        RAISE NOTICE 'Dropped function: %.%(%)', rec.schema_name, rec.object_name, coalesce(rec.identity_arguments, '');
    END LOOP;
END $$;

-- 3. Drop support tables
DO $$
DECLARE
    rec RECORD;
BEGIN
    FOR rec IN
        SELECT schema_name, object_name
        FROM public._phase1_created_objects
        WHERE migration_id = '20261107_phase1_hardened_seed' AND object_type = 'SUPPORT_TABLE'
    LOOP
        EXECUTE format('DROP TABLE IF EXISTS %I.%I RESTRICT;', rec.schema_name, rec.object_name);
        RAISE NOTICE 'Dropped support table: %', rec.object_name;
    END LOOP;
END $$;

-- 4. Drop extension content tables created by this migration
DO $$
DECLARE
    rec RECORD;
BEGIN
    FOR rec IN
        SELECT schema_name, object_name
        FROM public._phase1_created_objects
        WHERE migration_id = '20261107_phase1_hardened_seed' AND object_type = 'TABLE'
    LOOP
        EXECUTE format('DROP TABLE IF EXISTS %I.%I RESTRICT;', rec.schema_name, rec.object_name);
        RAISE NOTICE 'Dropped content table: %', rec.object_name;
    END LOOP;
END $$;

-- 5. Drop the helper signature function
DROP FUNCTION IF EXISTS public.compute_migration_object_signature(TEXT, TEXT, TEXT, TEXT, TEXT) RESTRICT;

-- 6. Drop the ownership ledger table itself
DROP TABLE public._phase1_created_objects RESTRICT;

COMMIT;
-- ==============================================================================
-- END OF PHASE 1 DETERMINISTIC ROLLBACK (rollback_phase1_seed.sql)
-- ==============================================================================
