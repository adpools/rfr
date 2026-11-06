import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables for client connection (public safe)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

// Validates whether actual configuration credentials are provided
export const isSupabaseConfigured: boolean = Boolean(
  supabaseUrl && 
  supabasePublishableKey && 
  !supabaseUrl.includes('your-project-id') && 
  !supabasePublishableKey.includes('your-publishable-key')
);

// Fallback dummy URL and Key to ensure createClient does not crash the client bundle
// if environment variables are not yet populated by the administrator
const activeUrl = isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co';
const activeKey = isSupabaseConfigured ? supabasePublishableKey : 'placeholder-publishable-key';

export const supabase: SupabaseClient = createClient(activeUrl, activeKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true, // Required for secure password reset email magic links
    storageKey: 'rfr_admin_auth_session',
  },
});

// Type definitions for administrative authentication & session state
export type AdminRole = 'super_admin' | 'editor';

export interface AdminUserProfile {
  id: string;
  email: string;
  fullName?: string | null;
  role: AdminRole;
  isActive: boolean;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminAuthState {
  user: AdminUserProfile | null;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  isLoading: boolean;
  error: string | null;
}

