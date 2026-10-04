import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { talentData } from '../../data/talentData';

export const TalentPortalsSection: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(0);

  return (
    <section
      id="chapter-10"
      className="bg-[#050505] border-b border-neutral-900 flex flex-col justify-center relative overflow-hidden py-32 md:py-48"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#C7A46A]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[100rem] mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Centered Editorial Header */}
        <div className="flex flex-col items-center text-center mb-24 md:mb-32">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-xs sm:text-sm font-serif font-bold text-[#C7A46A]">10</span>
            <div className="w-24 h-[1px] bg-[#C7A46A]/50" />
            <span className="text-[10px] sm:text-xs font-mono tracking-[0.4em] text-[#C7A46A] uppercase">
              TALENT & OPPORTUNITIES
            </span>
          </div>
          
          <h2 className="text-7xl sm:text-8xl md:text-[130px] font-serif text-[#F4F1EA] uppercase tracking-tighter leading-[0.8] mb-10 drop-shadow-2xl">
            THE GUILDS
          </h2>
          <p className="text-base sm:text-lg font-serif font-light text-[#A09D96] leading-relaxed max-w-2xl mx-auto tracking-wide">
            Exclusive talent portals designed for industry disruption. Discover global opportunities across Careers, Models, Influencers, and Artists.
          </p>
        </div>

        {/* Horizontal Expanding Accordion (Flex Cards) */}
        <div className="flex flex-col md:flex-row h-[80vh] min-h-[600px] max-h-[800px] w-full gap-4 md:gap-2">
          {talentData.map((portal, idx) => {
            const isActive = hoveredIndex === idx;

            return (
              <motion.div
                key={portal.id}
                onHoverStart={() => setHoveredIndex(idx)}
                className={`relative rounded-[24px] md:rounded-[32px] overflow-hidden cursor-pointer transition-all duration-700 ease-[0.16,1,0.3,1] ${
                  isActive ? 'md:flex-[3] flex-[1]' : 'md:flex-[1] flex-[1]'
                }`}
              >
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                  <img 
                    src={portal.image} 
                    alt={portal.title} 
                    className={`w-full h-full object-cover transition-all duration-1000 ease-[0.16,1,0.3,1] ${isActive ? 'grayscale-0 scale-100 brightness-90' : 'grayscale brightness-50 scale-110'}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
                </div>

                {/* Content */}
                <div className="relative z-10 w-full h-full p-8 md:p-12 flex flex-col justify-end overflow-hidden">
                  
                  {/* Always visible vertical number / Title on non-active */}
                  <div className={`absolute top-8 left-8 transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-50'}`}>
                    <span className="text-[10px] font-mono tracking-widest text-[#C7A46A] uppercase">
                      0{idx + 1}
                    </span>
                  </div>

                  {/* Active Content Reveal */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="flex flex-col w-full md:w-[600px] max-w-full"
                      >
                        <span className="text-[9px] font-mono tracking-[0.2em] text-[#C7A46A] uppercase px-4 py-2 rounded-full bg-[#111111]/80 backdrop-blur-md border border-neutral-800 w-max mb-6">
                          {portal.tagline}
                        </span>
                        
                        <h3 className="text-4xl md:text-6xl font-serif text-[#F4F1EA] uppercase mb-4 leading-tight tracking-tight whitespace-nowrap">
                          {portal.title}
                        </h3>
                        
                        <p className="text-[#A09D96] text-sm md:text-base font-light leading-relaxed mb-8 line-clamp-2 md:line-clamp-none">
                          {portal.description}
                        </p>

                        <div className="hidden md:block space-y-3 mb-10">
                          {portal.opportunities.slice(0, 3).map((op, i) => (
                            <div key={i} className="flex items-start gap-4 text-xs md:text-sm text-[#E0DDD5] font-light">
                              <Sparkles size={16} className="text-[#C7A46A] flex-shrink-0 mt-0.5" />
                              <span>{op}</span>
                            </div>
                          ))}
                        </div>

                        <Link
                          href={`/assets/${portal.id}`}
                          className="inline-flex items-center gap-4 text-xs font-mono font-bold text-[#E0DDD5] hover:text-[#C7A46A] uppercase tracking-[0.2em] transition-colors w-max"
                        >
                          <span>{portal.ctaLabel}</span>
                          <div className="w-10 h-10 rounded-full bg-[#111111]/80 backdrop-blur-md border border-neutral-700/50 flex items-center justify-center transition-colors">
                            <ArrowUpRight size={16} className="text-[#E0DDD5]" />
                          </div>
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Inactive Vertical Title (Desktop Only) */}
                  {!isActive && (
                    <div className="hidden md:flex h-full items-end justify-center pb-8 absolute inset-0 pointer-events-none">
                      <h3 className="text-4xl font-serif text-neutral-500 uppercase tracking-widest -rotate-90 origin-bottom transform translate-y-[-50%] whitespace-nowrap">
                        {portal.title}
                      </h3>
                    </div>
                  )}
                  {/* Inactive Horizontal Title (Mobile) */}
                  {!isActive && (
                    <div className="flex md:hidden w-full items-center mt-auto">
                      <h3 className="text-2xl font-serif text-neutral-500 uppercase tracking-widest">
                        {portal.title}
                      </h3>
                    </div>
                  )}

                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
