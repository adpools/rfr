import React from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Redirect } from 'wouter';
import { ShieldAlert, Loader2 } from 'lucide-react';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
  requireSuperAdmin?: boolean;
}

export const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({
  children,
  requireSuperAdmin = false,
}) => {
  const { isAuthenticated, isSuperAdmin, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070707] flex flex-col items-center justify-center text-center p-6 select-none">
        <div className="relative flex items-center justify-center mb-6">
          <div className="w-16 h-16 rounded-full border-2 border-[#C7A46A]/20 border-t-[#C7A46A] animate-spin" />
          <img
            src="/images/final bro.png"
            alt="RFR"
            className="w-8 h-8 object-contain absolute"
          />
        </div>
        <div className="font-mono text-xs text-[#C7A46A] tracking-[0.3em] uppercase">
          VERIFYING EXECUTIVE ACCESS...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Redirect to="/admin/login" />;
  }

  if (requireSuperAdmin && !isSuperAdmin) {
    return (
      <div className="min-h-screen bg-[#070707] text-[#FAF9F6] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-950/40 border border-red-800/60 flex items-center justify-center text-red-400 mb-6">
          <ShieldAlert size={32} />
        </div>
        <h1 className="text-2xl font-serif uppercase tracking-wide mb-2 text-white">
          Elevated Permissions Required
        </h1>
        <p className="text-neutral-400 text-xs sm:text-sm max-w-md mb-8 leading-relaxed font-light">
          This administrative module requires <strong>Super Admin</strong> credentials. Your account is currently authorized with the <strong>Editor</strong> role.
        </p>
        <a
          href="/admin"
          className="px-6 py-3 rounded-xl bg-[#141414] border border-neutral-800 hover:border-[#C7A46A] text-[#C7A46A] font-mono text-xs uppercase tracking-widest transition-all"
        >
          Return to CMS Overview
        </a>
      </div>
    );
  }

  return <>{children}</>;
};

