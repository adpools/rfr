import React from 'react';
import { Link } from 'wouter';
import { ArrowUpRight, Handshake, Sparkles, Building2 } from 'lucide-react';

export const BusinessCTASection: React.FC = () => {
  return (
    <section
      id="chapter-06"
      className="full-viewport-scene bg-gradient-to-b from-[#0a0a0a] via-[#12100c] to-[#080808] border-b border-neutral-900 flex flex-col justify-center relative overflow-hidden py-16 md:py-24"
    >
      <div className="editorial-container relative z-10 my-auto py-10 text-center max-w-4xl mx-auto w-full">
        {/* Number & Label */}
        <div className="inline-flex items-center gap-3 text-xs font-mono tracking-[0.35em] text-[#C7A46A] uppercase mb-6">
          <span>06</span>
          <span className="w-8 h-[1px] bg-[#C7A46A]" />
          <span>COLLABORATION & ENTERPRISE</span>
        </div>

        {/* Monumental Headline */}
        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-light text-white uppercase tracking-tight leading-[0.95] mb-6">
          DO BUSINESS <br />
          <span className="italic text-[#C7A46A]">WITH US</span>
        </h2>

        {/* Pillars Subhead */}
        <p className="text-base sm:text-xl font-serif text-neutral-300 uppercase tracking-wider mb-4">
          BRANDS • CREATORS • MEDIA • ENTERPRISE
        </p>

        <p className="text-neutral-400 text-xs sm:text-sm font-light leading-relaxed max-w-xl mx-auto mb-10">
          Partner with RFR to engineer impactful brand experiences, high-conversion commercial campaigns, couture runway presentations, and cultural initiatives.
        </p>

        {/* 3 Business Collaboration Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 text-left">
          <div className="p-5 rounded-2xl bg-[#111111]/80 border border-neutral-800">
            <Sparkles size={16} className="text-[#C7A46A] mb-2" />
            <h4 className="text-sm font-serif text-white uppercase mb-1">Brand Campaigns</h4>
            <p className="text-xs text-neutral-400 font-light">Influencer marketing, UGC studios, ad films, and outdoor media.</p>
          </div>
          <div className="p-5 rounded-2xl bg-[#111111]/80 border border-neutral-800">
            <Building2 size={16} className="text-[#C7A46A] mb-2" />
            <h4 className="text-sm font-serif text-white uppercase mb-1">Runway Staging</h4>
            <p className="text-xs text-neutral-400 font-light">Couture showcases, brand launch events, and gala countdowns.</p>
          </div>
          <div className="p-5 rounded-2xl bg-[#111111]/80 border border-neutral-800">
            <Handshake size={16} className="text-[#C7A46A] mb-2" />
            <h4 className="text-sm font-serif text-white uppercase mb-1">IP Co-Production</h4>
            <p className="text-xs text-neutral-400 font-light">Sponsor flea markets, podcasts, and talent incubators.</p>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/business"
            className="btn-luxury btn-luxury-gold rounded-2xl px-6 py-3 text-xs inline-flex items-center gap-2"
          >
            <span>EXPLORE BUSINESS PORTAL</span>
            <ArrowUpRight size={14} />
          </Link>

          <Link
            href="/contact"
            className="px-6 py-3 rounded-2xl border border-neutral-700 text-xs font-mono tracking-widest uppercase text-white hover:border-[#C7A46A] hover:text-[#C7A46A] transition-colors"
          >
            INITIATE PROPOSAL
          </Link>
        </div>
      </div>
    </section>
  );
};
