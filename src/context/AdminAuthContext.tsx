import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured, AdminUserProfile, AdminRole } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';

interface AdminAuthContextType {
  user: User | null;
  profile: AdminUserProfile | null;
  role: AdminRole | null;
  isSuperAdmin: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isConfigured: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AdminUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch admin profile from public.admin_users
  const fetchAdminProfile = async (userId: string) => {
    try {
      const { data, error: profileError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', userId)
        .eq('is_active', true)
        .single();

      if (profileError || !data) {
        console.warn('User is authenticated in Supabase Auth but not registered or active in admin_users table.');
        setProfile(null);
        return null;
      }

      const adminProfile: AdminUserProfile = {
        id: data.id,
        email: data.email,
        fullName: data.full_name,
        role: data.role as AdminRole,
        isActive: data.is_active,
        lastLoginAt: data.last_login_at,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      setProfile(adminProfile);
      return adminProfile;
    } catch (err: any) {
      console.error('Error fetching admin profile:', err.message);
      setProfile(null);
      return null;
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    // Check active session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchAdminProfile(session.user.id).finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        await fetchAdminProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Secure email/password login
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setError(null);
    setIsLoading(true);

    if (!isSupabaseConfigured) {
      setIsLoading(false);
      const msg = 'Supabase credentials are not yet configured in .env.local. Please provide VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.';
      setError(msg);
      return { success: false, error: msg };
    }

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password,
      });

      if (authError || !data.user) {
        const errorMsg = authError?.message || 'Invalid email or password.';
        setError(errorMsg);
        setIsLoading(false);
        return { success: false, error: errorMsg };
      }

      setUser(data.user);

      // Verify that this user is explicitly an active administrator in admin_users
      const adminProfile = await fetchAdminProfile(data.user.id);
      if (!adminProfile) {
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
        const errorMsg = 'Access Denied: This account is not an authorized administrator in the RFR CMS.';
        setError(errorMsg);
        setIsLoading(false);
        return { success: false, error: errorMsg };
      }

      // Record login timestamp
      await supabase
        .from('admin_users')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', data.user.id);

      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      const errorMsg = err.message || 'An unexpected error occurred during login.';
      setError(errorMsg);
      setIsLoading(false);
      return { success: false, error: errorMsg };
    }
  };

  // Secure sign out
  const logout = async () => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
      setUser(null);
      setProfile(null);
    } catch (err) {
      console.error('Error during logout:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Send password reset email link
  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured) {
      return { success: false, error: 'Supabase is not yet configured.' };
    }

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/admin/login?type=recovery`,
      });

      if (resetError) {
        return { success: false, error: resetError.message };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Password reset request failed.' };
    }
  };

  // Update password after recovery link click
  const updatePassword = async (newPassword: string): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured) {
      return { success: false, error: 'Supabase is not yet configured.' };
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        return { success: false, error: updateError.message };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Password update failed.' };
    }
  };

  const isSuperAdmin = profile?.role === 'super_admin' && profile.isActive === true;
  const isAuthenticated = Boolean(user && profile && profile.isActive);

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        profile,
        role: profile?.role || null,
        isSuperAdmin,
        isAuthenticated,
        isLoading,
        error,
        isConfigured: isSupabaseConfigured,
        login,
        logout,
        resetPassword,
        updatePassword,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = (): AdminAuthContextType => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

