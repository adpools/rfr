import React, { useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useLocation } from 'wouter';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { login, resetPassword, isAuthenticated, isConfigured } = useAdminAuth();
  const [, setLocation] = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStatus, setForgotStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [forgotMessage, setForgotMessage] = useState<string | null>(null);

  // If already logged in, redirect to admin dashboard
  if (isAuthenticated) {
    setLocation('/admin');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      setLocation('/admin');
    } else {
      setErrorMessage(result.error || 'Failed to authenticate administrator.');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;

    setForgotStatus('sending');
    setForgotMessage(null);

    const result = await resetPassword(forgotEmail);
    if (result.success) {
      setForgotStatus('success');
      setForgotMessage('Password reset instructions have been dispatched to your email.');
    } else {
      setForgotStatus('error');
      setForgotMessage(result.error || 'Failed to dispatch password recovery link.');
    }
  };

  return (
    <div className="min-h-screen bg-[#060606] text-[#FAF9F6] flex flex-col justify-center items-center p-4 sm:p-6 relative selection:bg-[#C7A46A] selection:text-black">
      {/* Background ambient gold aura */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-[#C7A46A]/5 blur-[140px] pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-[#0D0D0D] border border-neutral-800/90 rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-8 flex flex-col items-center">
          <img
            src="/images/final bro.png"
            alt="RFR by Riyas"
            className="w-40 sm:w-48 h-auto object-contain mb-4 select-none"
            draggable={false}
          />
          <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.3em] text-[#C7A46A] uppercase mb-1">
            <ShieldCheck size={12} className="text-[#C7A46A]" />
            <span>EXECUTIVE CMS PORTAL</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-serif text-white uppercase tracking-wider">
            Admin Authentication
          </h1>
        </div>

        {/* Backend Connectivity Status Pill */}
        <div className="mb-6 p-3 rounded-xl bg-[#141414] border border-neutral-800 flex items-center justify-between text-xs font-mono">
          <span className="text-neutral-400">Backend Status:</span>
          {isConfigured ? (
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Supabase Connected
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-amber-400 font-semibold" title="Add keys to .env.local">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Awaiting .env.local
            </span>
          )}
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-200 text-xs flex items-start gap-3">
            <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2">
              Administrator Email
            </label>
            <div className="relative flex items-center">
              <Mail size={16} className="absolute left-4 text-neutral-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="advriyas@gmail.com"
                required
                className="w-full bg-[#141414] border border-neutral-800 focus:border-[#C7A46A] rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none transition-all font-sans"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                Password
              </label>
              <button
                type="button"
                onClick={() => {
                  setForgotEmail(email);
                  setShowForgotModal(true);
                }}
                className="text-[11px] font-mono text-[#C7A46A] hover:text-[#FAF9F6] transition-colors"
              >
                Forgot?
              </button>
            </div>
            <div className="relative flex items-center">
              <Lock size={16} className="absolute left-4 text-neutral-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full bg-[#141414] border border-neutral-800 focus:border-[#C7A46A] rounded-xl pl-11 pr-11 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none transition-all font-sans"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-neutral-500 hover:text-white transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3.5 px-6 rounded-xl bg-[#C7A46A] hover:bg-[#D4B678] text-black font-mono font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#C7A46A]/10 disabled:opacity-50"
          >
            <span>{isSubmitting ? 'VERIFYING CREDENTIALS...' : 'SIGN IN TO CMS'}</span>
            <ArrowRight size={14} />
          </button>
        </form>

        {/* Public Website Return Link */}
        <div className="mt-8 pt-6 border-t border-neutral-800/80 text-center">
          <a
            href="/"
            className="text-xs font-mono text-neutral-500 hover:text-[#C7A46A] transition-colors"
          >
            ← Return to Public Website
          </a>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#111111] border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative">
            <h2 className="text-lg font-serif uppercase tracking-wide text-white mb-2">
              Reset Administrator Password
            </h2>
            <p className="text-xs text-neutral-400 font-light mb-6 leading-relaxed">
              Enter your verified administrator email address to receive a secure recovery magic link.
            </p>

            {forgotStatus === 'success' ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-200 text-xs flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>{forgotMessage}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="w-full py-2.5 rounded-xl bg-[#1f1f1f] hover:bg-neutral-800 text-white font-mono text-xs uppercase tracking-wider"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                {forgotStatus === 'error' && (
                  <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-200 text-xs flex items-start gap-2">
                    <AlertCircle size={14} className="text-red-400 shrink-0 mt-0.5" />
                    <span>{forgotMessage}</span>
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    placeholder="advriyas@gmail.com"
                    className="w-full bg-[#181818] border border-neutral-700 focus:border-[#C7A46A] rounded-xl px-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none font-sans"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-4 py-2.5 rounded-xl text-neutral-400 hover:text-white font-mono text-xs uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotStatus === 'sending'}
                    className="px-5 py-2.5 rounded-xl bg-[#C7A46A] hover:bg-[#D4B678] text-black font-mono font-bold text-xs uppercase tracking-wider disabled:opacity-50"
                  >
                    {forgotStatus === 'sending' ? 'Sending...' : 'Send Recovery Link'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

