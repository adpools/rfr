import React, { useState } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { talentData } from '../../data/talentData';
import { ArrowUpRight, ArrowRight } from 'lucide-react';

export const TalentPortalsSection: React.FC = () => {
  const [activePortal, setActivePortal] = useState(talentData[0]);

  const letterList = ['a', 'b', 'c', 'd'];

  return (
    <section
      id="chapter-10"
      className="full-viewport-scene bg-[#0a0a0a] border-b border-neutral-900 flex flex-col justify-center relative overflow-hidden py-16 md:py-24"
    >
      {/* Dynamic Background Image */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.img
            key={activePortal.id}
            src={activePortal.image}
            alt={activePortal.title}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 0.3, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full object-cover grayscale brightness-50"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/70 to-[#0a0a0a]/85" />
      </div>

      <div className="editorial-container relative z-10 my-auto py-10 w-full">
        {/* Top Header */}
        <div className="flex flex-col justify-start mb-8 pb-4 relative">
          <div className="flex items-center gap-3 text-[10px] font-mono tracking-[0.35em] text-[#C7A46A] uppercase mb-2">
            <span>10</span>
            <span className="w-12 h-[1px] bg-[#C7A46A]" />
            <span>TALENT GUILDS & GUILDS</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-800 pb-4 gap-4">
            <div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#F4F1EA] uppercase tracking-tight">
                ASSETS
              </h2>
              <p className="text-xs sm:text-sm font-light text-neutral-400 mt-2 max-w-xl">
                Dedicated talent portals across Career, Models, Influencers, and Artists.
              </p>
            </div>
            <Link
              href="/assets"
              className="inline-flex items-center gap-2 text-xs font-mono text-[#C7A46A] hover:text-white uppercase tracking-wider transition-colors"
            >
              <span>VIEW ALL 4 ASSET GUILDS</span>
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
                  className={`w-full text-left px-5 py-3.5 rounded-2xl transition-all duration-300 flex items-center justify-between border ${
                    isSelected
                      ? 'border-[#C7A46A] bg-[#121212] shadow-[0_0_15px_rgba(199,164,106,0.15)]'
                      : 'border-neutral-800 bg-[#0a0a0a] hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`font-mono text-xs uppercase font-semibold ${
                        isSelected ? 'text-[#C7A46A]' : 'text-neutral-500'
                      }`}
                    >
                      {letterList[idx]}.
                    </span>
                    <span
                      className={`text-lg sm:text-xl font-serif uppercase tracking-wider transition-colors ${
                        isSelected ? 'text-[#F4F1EA]' : 'text-neutral-400'
                      }`}
                    >
                      {portal.title}
                    </span>
                  </div>
                  {isSelected ? (
                    <ArrowRight size={14} className="text-[#C7A46A]" />
                  ) : (
                    <span className="text-[10px] font-mono text-neutral-600 uppercase">PORTAL</span>
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
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
                className="p-8 md:p-10 rounded-3xl bg-[#0B0B0B]/80 backdrop-blur-md border border-neutral-800 flex flex-col justify-between h-full min-h-[380px]"
              >
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#C7A46A] uppercase px-3 py-1 rounded bg-[#161616] border border-[#C7A46A]/30 inline-block mb-4">
                    {activePortal.tagline}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-serif text-[#F4F1EA] uppercase mb-3 leading-tight">
                    {activePortal.title}
                  </h3>
                  <p className="text-neutral-300 text-xs sm:text-sm font-light leading-relaxed mb-6">
                    {activePortal.description}
                  </p>

                  <div className="space-y-1.5 pt-2 mb-6">
                    <span className="text-[10px] font-mono text-[#C7A46A] uppercase tracking-widest block">
                      KEY GUILD OPPORTUNITIES
                    </span>
                    {activePortal.opportunities.slice(0, 3).map((op, i) => (
                      <div key={i} className="text-xs text-neutral-400 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C7A46A]" />
                        <span>{op}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-neutral-800">
                  <Link
                    href={`/assets/${activePortal.id}`}
                    className="btn-luxury btn-luxury-gold rounded-xl py-2 px-6 text-xs inline-flex items-center gap-2"
                  >
                    <span>{activePortal.ctaLabel}</span>
                    <ArrowUpRight size={14} />
                  </Link>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                    RFR GUILD
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
