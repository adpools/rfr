import React from 'react';
import { motion } from 'framer-motion';

export const AboutSection: React.FC = () => {
  const keywords = [
    'FASHION',
    'LIFESTYLE',
    'CREATORS',
    'BRANDS',
    'EVENTS',
    'MEDIA',
    'CULTURE',
    'OPPORTUNITY',
    'RUNWAY',
    'EXPERIENCE',
  ];

  return (
    <section
      id="chapter-06"
      className="full-viewport-scene bg-[#0a0a0a] border-b border-neutral-900 flex flex-col justify-between relative overflow-hidden"
    >
      <div className="editorial-container relative z-10 my-auto py-12 w-full">
        {/* Level 01: Label */}
        <div className="flex items-center gap-3 text-xs font-mono tracking-[0.35em] text-[#C7A46A] uppercase mb-8">
          <span>06</span>
          <span className="w-8 h-[1px] bg-[#C7A46A]" />
          <span>THE CREATIVE PHILOSOPHY</span>
        </div>

        {/* Level 02: Monumental Headline */}
        <h2 className="text-chapter-headline font-serif font-light text-white uppercase tracking-tight mb-8">
          FROM FASHION <br />
          <span className="italic text-[#C7A46A]">TO POSSIBILITY.</span>
        </h2>

        {/* Level 03 & 04: Split Editorial Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-7 space-y-4 text-neutral-300 text-sm md:text-base font-light leading-relaxed">
            <p>
              Riyas Fashion Runway is a creative platform focused on fashion, lifestyle, entertainment, advertising, events and digital media.
            </p>
            <p>
              From discovering new talent to creating brand experiences, RFR provides a platform where creativity meets opportunity. We engineer high-concept environments that elevate runway art into enduring cultural conversations.
            </p>
          </div>

          <div className="md:col-span-5 flex flex-col justify-center border-l border-neutral-800/80 pl-8 space-y-3 text-xs font-mono text-neutral-400 uppercase tracking-widest">
            <div className="flex items-center gap-3 text-[#FAF9F6]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C7A46A]" />
              <span>ESTABLISHED 2020</span>
            </div>
            <div className="flex items-center gap-3 text-[#FAF9F6]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C7A46A]" />
              <span>MULTIDISCIPLINARY SPECTRUM</span>
            </div>
            <div className="flex items-center gap-3 text-[#FAF9F6]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C7A46A]" />
              <span>GLOBAL EDITORIAL QUALITY</span>
            </div>
          </div>
        </div>
      </div>

      {/* Infinite Animated Keywords Ribbon */}
      <div className="py-4 bg-[#111111] border-y border-[#C7A46A]/20 overflow-hidden relative">
        <div className="marquee-track flex items-center gap-8 text-xs md:text-sm font-sculptural tracking-[0.25em] text-[#C7A46A] uppercase">
          {keywords.concat(keywords).map((kw, idx) => (
            <React.Fragment key={idx}>
              <span className="hover:text-white transition-colors select-none">{kw}</span>
              <span className="text-neutral-700 select-none">✦</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Level 05: Directional Cue */}
      <div className="scene-directional-cue">
        <span>06 / 17 • SCROLL TO EVENTS ↓</span>
      </div>
    </section>
  );
};
