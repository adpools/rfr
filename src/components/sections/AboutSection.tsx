import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { ArrowUpRight } from 'lucide-react';

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
      className="full-viewport-scene bg-[#080808] border-b border-neutral-900 flex flex-col justify-between relative overflow-hidden"
    >
      <div className="editorial-container relative z-10 my-auto py-10 w-full">
        {/* Top Header */}
        <div className="flex flex-col justify-start mb-12 pb-4 relative">
          <div className="flex items-center gap-3 text-[10px] font-mono tracking-[0.35em] text-[#C7A46A] uppercase mb-2">
            <span>06</span>
            <span className="w-12 h-[1px] bg-[#C7A46A]" />
            <span>THE CREATIVE PHILOSOPHY</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#333] pb-4 gap-4">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#F4F1EA] uppercase tracking-tight">
              FROM FASHION TO POSSIBILITY
            </h2>
          </div>
        </div>

        {/* Interactive Master Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
          
          {/* Left: Interactive Category Selector (Single Item for Philosophy) */}
          <div className="lg:col-span-5 space-y-3">
             <div className="w-full text-left px-6 py-4 rounded-full transition-all duration-300 flex items-center justify-between border border-[#C7A46A] bg-transparent shadow-[0_0_15px_rgba(199,164,106,0.1)]">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-[11px] text-[#C7A46A]">
                    01
                  </span>
                  <span className="text-sm sm:text-base font-serif uppercase tracking-wider text-[#F4F1EA]">
                    CORE MANIFESTO
                  </span>
                </div>
                <div className="w-2 h-2 rounded-full bg-[#C7A46A]" />
             </div>
          </div>

          {/* Right: Active Detail Plate */}
          <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="p-8 md:p-10 rounded-[2rem] bg-[#0B0B0B]/60 backdrop-blur-md border border-[#333] flex flex-col justify-between h-full min-h-[420px]"
              >
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#C7A46A] uppercase px-3 py-1 rounded border border-[#C7A46A] inline-block mb-6">
                    ABOUT RFR
                  </span>
                  <h3 className="text-3xl sm:text-4xl font-serif text-[#F4F1EA] uppercase mb-4 leading-tight italic">
                    Where creativity meets opportunity.
                  </h3>
                  
                  <div className="space-y-4 text-[#aaa] text-sm font-sans font-light leading-relaxed mb-8">
                    <p>
                      Riyas Fashion Runway is a creative platform focused on fashion, lifestyle, entertainment, advertising, events and digital media.
                    </p>
                    <p>
                      From discovering new talent to creating brand experiences, RFR provides a platform where creativity meets opportunity. We engineer high-concept environments that elevate runway art into enduring cultural conversations.
                    </p>
                  </div>

                  <div className="flex flex-col space-y-3 text-[10px] font-mono text-neutral-400 uppercase tracking-widest mb-8">
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

                <div className="pt-6 flex items-center justify-between border-t border-[#333]">
                  <Link
                    href="/about"
                    className="px-6 py-3 md:px-8 bg-[#C5A76A] text-[#050505] font-sans font-bold text-[10px] uppercase tracking-[0.2em] rounded-full inline-flex items-center gap-2 hover:bg-[#F4F1EA] transition-colors"
                  >
                    <span>EXPLORE OUR HISTORY</span>
                    <ArrowUpRight size={14} />
                  </Link>
                </div>
              </motion.div>
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
