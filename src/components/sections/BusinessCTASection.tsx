import React from 'react';
import { Link } from 'wouter';
import { ArrowUpRight } from 'lucide-react';

export const BusinessCTASection: React.FC = () => {
  return (
    <section
      id="chapter-15"
      className="full-viewport-scene bg-gradient-to-b from-[#0a0a0a] via-[#12100c] to-[#080808] border-b border-[#C7A46A]/20 flex flex-col justify-between relative overflow-hidden"
    >
      <div className="editorial-container relative z-10 my-auto py-12 text-center max-w-4xl mx-auto w-full">
        {/* Level 01: Small Label */}
        <div className="inline-flex items-center gap-3 text-xs font-mono tracking-[0.35em] text-[#C7A46A] uppercase mb-8">
          <span>15</span>
          <span className="w-8 h-[1px] bg-[#C7A46A]" />
          <span>COLLABORATION & PARTNERSHIPS</span>
        </div>

        {/* Level 02: Monumental Headline */}
        <h2 className="text-chapter-headline font-serif font-light text-white uppercase tracking-tight leading-[0.94] mb-6">
          LET’S CREATE <br />
          <span className="italic text-[#C7A46A]">SOMETHING</span> <br />
          MEMORABLE.
        </h2>

        {/* Level 03: Four Brand Pillars Subhead */}
        <p className="text-lg sm:text-2xl md:text-3xl font-serif text-neutral-300 uppercase tracking-wider mb-6">
          BRANDS. CREATORS. IDEAS. OPPORTUNITIES.
        </p>

        <p className="text-neutral-400 text-xs md:text-sm font-light leading-relaxed max-w-xl mx-auto mb-10">
          Partner with RFR to create meaningful brand experiences, commercial campaigns, runway showcases, and cultural initiatives.
        </p>

        {/* Level 04: Conversion CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/contact"
            data-cursor="CONNECT"
            className="btn-luxury btn-luxury-gold rounded-full text-xs inline-flex items-center gap-2 px-8 py-4"
          >
            <span>START A CONVERSATION</span>
            <ArrowUpRight size={14} />
          </Link>

          <Link
            href="/services"
            data-cursor="SERVICES"
            className="btn-luxury rounded-full text-xs inline-flex items-center gap-2 px-8 py-4"
          >
            <span>VIEW SERVICES & IP</span>
          </Link>
        </div>
      </div>

      {/* Level 05: Directional Cue */}
      <div className="scene-directional-cue">
        <span>15 / 17 • SCROLL TO CONTACT ↓</span>
      </div>
    </section>
  );
};
