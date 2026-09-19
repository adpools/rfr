import React, { useState } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { talentData } from '../../data/talentData';
import { ArrowUpRight, ArrowRight } from 'lucide-react';

export const TalentPortalsSection: React.FC = () => {
  const [activePortal, setActivePortal] = useState(talentData[0]);

  return (
    <section
      id="chapter-11"
      className="full-viewport-scene bg-[#0a0a0a] border-b border-neutral-900 flex flex-col justify-between relative overflow-hidden"
    >
      {/* Dynamic Full-Bleed Background Image */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.img
            key={activePortal.id}
            src={activePortal.image}
            alt={activePortal.title}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 0.35, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full object-cover grayscale brightness-50"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/70 to-[#0a0a0a]/85" />
      </div>

      <div className="editorial-container relative z-10 my-auto py-10 w-full">
        {/* Top Header */}
        <div className="flex flex-col justify-start mb-12 pb-4 relative">
          <div className="flex items-center gap-3 text-[10px] font-mono tracking-[0.35em] text-[#C7A46A] uppercase mb-2">
            <span>11</span>
            <span className="w-12 h-[1px] bg-[#C7A46A]" />
            <span>THE TALENT ECOSYSTEM</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#333] pb-4 gap-4">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#F4F1EA] uppercase tracking-tight">
              THE RFR NETWORK
            </h2>
            <Link
              href="/assets"
              data-cursor="NETWORK"
              className="inline-flex items-center gap-2 text-[10px] font-sans tracking-[0.2em] uppercase text-[#C7A46A] hover:text-[#F4F1EA] transition-colors"
            >
              <span>EXPLORE ALL 4 PORTALS</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

        {/* Interactive Master Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
          {/* Left: Interactive Category Selector */}
          <div className="lg:col-span-6 space-y-3">
            {talentData.map((portal, idx) => {
              const isSelected = activePortal.id === portal.id;
              return (
                <button
                  key={portal.id}
                  onClick={() => setActivePortal(portal)}
                  onMouseEnter={() => setActivePortal(portal)}
                  data-cursor="INSPECT"
                  className={`w-full text-left px-6 py-4 rounded-full transition-all duration-300 flex items-center justify-between border ${
                    isSelected
                      ? 'border-[#C7A46A] bg-transparent shadow-[0_0_15px_rgba(199,164,106,0.1)]'
                      : 'border-[#333] bg-transparent hover:border-[#666]'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`font-mono text-[11px] ${
                        isSelected ? 'text-[#C7A46A]' : 'text-[#666]'
                      }`}
                    >
                      0{idx + 1}
                    </span>
                    <span
                      className={`text-sm sm:text-base font-serif uppercase tracking-wider transition-colors ${
                        isSelected ? 'text-[#F4F1EA]' : 'text-[#888]'
                      }`}
                    >
                      {portal.title}
                    </span>
                  </div>
                  {isSelected && (
                    <ArrowRight
                      size={14}
                      className="text-[#C7A46A]"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right: Active Detail Plate */}
          <div className="lg:col-span-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePortal.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="p-8 md:p-10 rounded-[2rem] bg-[#0B0B0B]/40 backdrop-blur-md border border-[#333] flex flex-col justify-between h-full min-h-[420px]"
              >
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#C7A46A] uppercase px-3 py-1 rounded border border-[#C7A46A] inline-block mb-6">
                    {activePortal.tagline}
                  </span>
                  <h3 className="text-3xl sm:text-4xl font-serif text-[#F4F1EA] uppercase mb-4 leading-tight">
                    {activePortal.title}
                  </h3>
                  <p className="text-[#aaa] text-sm font-sans font-light leading-relaxed mb-8">
                    {activePortal.description}
                  </p>
                </div>

                <div className="pt-6 flex items-center justify-between">
                  <Link
                    href={`/assets/${activePortal.id}`}
                    className="px-6 py-3 md:px-8 bg-[#C5A76A] text-[#050505] font-sans font-bold text-[10px] uppercase tracking-[0.2em] rounded-full inline-flex items-center gap-2 hover:bg-[#F4F1EA] transition-colors"
                  >
                    <span>{activePortal.ctaLabel}</span>
                    <ArrowUpRight size={14} />
                  </Link>
                  <span className="text-[10px] font-mono text-[#666] uppercase tracking-widest">
                    GLOBAL NETWORK
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Level 05: Directional Cue */}
      <div className="scene-directional-cue">
        <span>11 / 17 • SCROLL TO ARCHIVE ↓</span>
      </div>
    </section>
  );
};
