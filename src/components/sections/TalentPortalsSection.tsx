import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { ArrowUpRight, Sparkles, Maximize2, X } from 'lucide-react';
import { talentData } from '../../data/talentData';
import { TalentCategory } from '../../types';
import { getPageContent } from '../../services/cmsService';

export const TalentPortalsSection: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(0);
  const [selectedImageMap, setSelectedImageMap] = useState<Record<string, string>>({});
  const [lightboxImage, setLightboxImage] = useState<{ src: string; title: string } | null>(null);
  const [portals, setPortals] = useState<TalentCategory[]>(talentData);

  // Load dynamic portal definitions from assets slug (content.portals)
  useEffect(() => {
    getPageContent('assets', {
      title: 'THE RFR NETWORK',
      subtitle: 'A premier launchpad and collaborative ecosystem for passionate professionals, models, creators, and performing artists.',
      content: {
        portals: talentData.map((t) => ({
          id: t.id,
          title: t.title,
          tagline: t.tagline,
          description: t.description,
          ctaLabel: t.ctaLabel,
          image: t.image,
        }))
      }
    }).then((res) => {
      if (Array.isArray(res.content?.portals) && res.content.portals.length > 0) {
        const merged = talentData.map((base) => {
          const override = res.content.portals.find((p: any) => p.id === base.id);
          if (!override) return base;
          return {
            ...base,
            title: override.title || base.title,
            tagline: override.tagline || base.tagline,
            description: override.description || base.description,
            ctaLabel: override.ctaLabel || base.ctaLabel,
            image: override.image || base.image,
          };
        });
        setPortals(merged);
      }
    });
  }, []);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightboxImage !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [lightboxImage]);

  return (
    <section
      id="chapter-10"
      className="bg-[#050505] border-b border-neutral-900 flex flex-col justify-center relative overflow-hidden py-28 md:py-40"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#C7A46A]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[100rem] mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Centered Editorial Header */}
        <div className="flex flex-col items-center text-center mb-16 md:mb-24">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-sculptural font-bold text-[#C7A46A]">10</span>
            <div className="w-20 sm:w-28 h-[1px] bg-[#C7A46A]/60" />
            <span className="text-xs font-mono font-bold tracking-[0.35em] text-[#C7A46A] uppercase">
              TALENT & OPPORTUNITIES
            </span>
          </div>
          
          <h2 className="text-6xl sm:text-7xl md:text-[100px] lg:text-[120px] font-sculptural font-bold text-white uppercase tracking-tight leading-[0.9] mb-8 drop-shadow-[0_10px_35px_rgba(0,0,0,0.9)]">
            THE GUILDS
          </h2>
          <p className="text-base sm:text-lg font-sans font-normal text-[#D4D2CD] leading-relaxed max-w-2xl mx-auto tracking-wide">
            Exclusive talent portals designed for industry disruption. Discover global opportunities across Careers, Models, Influencers, and Artists.
          </p>
        </div>

        {/* Horizontal Expanding Accordion (Flex Cards) */}
        <div className="flex flex-col md:flex-row h-auto md:h-[78vh] min-h-[580px] md:max-h-[760px] w-full gap-4 md:gap-3">
          {portals.map((portal, idx) => {
            const isActive = hoveredIndex === idx;
            const currentImg = selectedImageMap[portal.id] || portal.image;

            return (
              <motion.div
                key={portal.id}
                onHoverStart={() => setHoveredIndex(idx)}
                onClick={() => setHoveredIndex(idx)}
                className={`relative rounded-[24px] md:rounded-[32px] overflow-hidden cursor-pointer transition-all duration-700 ease-[0.16,1,0.3,1] ${
                  isActive ? 'md:flex-[3.5] flex-[1] min-h-[480px]' : 'md:flex-[1] flex-[1] min-h-[140px] md:min-h-0'
                }`}
              >
                {/* Background Image */}
                <div className="absolute inset-0 z-0 bg-[#0a0a0a]">
                  <img 
                    src={currentImg} 
                    alt={portal.title} 
                    className={`w-full h-full object-cover transition-all duration-1000 ease-[0.16,1,0.3,1] ${
                      isActive ? 'grayscale-0 scale-100 brightness-90' : 'grayscale brightness-40 scale-110'
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-[#050505]/20" />
                </div>

                {/* Content */}
                <div className="relative z-10 w-full h-full p-6 sm:p-8 md:p-12 flex flex-col justify-end overflow-hidden">
                  
                  {/* Always visible vertical number / Expand button */}
                  <div className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-3 z-20">
                    <span className="text-[11px] font-mono font-bold tracking-widest text-[#C7A46A] uppercase px-3 py-1 rounded-full bg-black/75 border border-white/10 backdrop-blur-md">
                      0{idx + 1}
                    </span>

                    {isActive && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLightboxImage({ src: currentImg, title: portal.title });
                        }}
                        className="p-1.5 rounded-full bg-black/75 border border-white/10 text-neutral-300 hover:text-[#C7A46A] hover:border-[#C7A46A] transition-colors"
                        title="View Full Image"
                        aria-label="View Full Image"
                      >
                        <Maximize2 size={13} />
                      </button>
                    )}
                  </div>

                  {/* Active Content Reveal */}
                  <AnimatePresence mode="wait">
                    {isActive && (
                      <motion.div
                        key={portal.id}
                        initial={{ opacity: 0, x: -25 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -25 }}
                        transition={{ duration: 0.45, delay: 0.08 }}
                        className="flex flex-col w-full md:w-[620px] max-w-full"
                      >
                        <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-[#C7A46A] uppercase px-4 py-1.5 rounded-full bg-[#111111]/90 backdrop-blur-md border border-neutral-700 w-max mb-5">
                          {portal.tagline}
                        </span>
                        
                        <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sculptural font-bold text-white uppercase mb-3 leading-tight tracking-tight">
                          {portal.title}
                        </h3>
                        
                        <p className="text-[#D4D2CD] text-xs sm:text-sm md:text-base font-normal leading-relaxed mb-6 line-clamp-3 md:line-clamp-none">
                          {portal.description}
                        </p>

                        {/* Interactive Guild Image Gallery Selector */}
                        {portal.gallery && portal.gallery.length > 1 && (
                          <div className="flex items-center gap-2 mb-6">
                            <span className="text-[10px] font-mono text-[#A09D96] uppercase tracking-wider mr-1">
                              GALLERY:
                            </span>
                            <div className="flex items-center gap-2">
                              {portal.gallery.map((imgUrl, gIdx) => {
                                const isSelected = currentImg === imgUrl;
                                return (
                                  <button
                                    key={gIdx}
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedImageMap((prev) => ({ ...prev, [portal.id]: imgUrl }));
                                    }}
                                    className={`w-10 h-10 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                                      isSelected 
                                        ? 'border-[#C7A46A] scale-105 shadow-[0_0_12px_rgba(199,164,106,0.4)]' 
                                        : 'border-neutral-700/80 opacity-60 hover:opacity-100 hover:border-neutral-500'
                                    }`}
                                    aria-label={`Select gallery image ${gIdx + 1}`}
                                  >
                                    <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        <div className="hidden md:block space-y-2.5 mb-8">
                          {portal.opportunities.slice(0, 3).map((op, i) => (
                            <div key={i} className="flex items-start gap-3 text-xs md:text-sm text-[#F4F1EA] font-normal">
                              <Sparkles size={15} className="text-[#C7A46A] flex-shrink-0 mt-0.5" />
                              <span>{op}</span>
                            </div>
                          ))}
                        </div>

                        <Link
                          href={`/assets/${portal.id}`}
                          className="inline-flex items-center gap-4 text-xs font-mono font-bold text-[#E0DDD5] hover:text-[#C7A46A] uppercase tracking-[0.2em] transition-colors w-max"
                        >
                          <span>{portal.ctaLabel}</span>
                          <div className="w-10 h-10 rounded-full bg-[#111111]/90 backdrop-blur-md border border-neutral-700/70 hover:border-[#C7A46A] flex items-center justify-center transition-colors">
                            <ArrowUpRight size={16} className="text-[#E0DDD5]" />
                          </div>
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Inactive Vertical Title (Desktop Only) */}
                  {!isActive && (
                    <div className="hidden md:flex h-full items-end justify-center pb-8 absolute inset-0 pointer-events-none">
                      <h3 className="text-2xl lg:text-3xl font-sculptural font-bold text-neutral-400 uppercase tracking-widest -rotate-90 origin-bottom transform translate-y-[-50%] whitespace-nowrap">
                        {portal.title}
                      </h3>
                    </div>
                  )}

                  {/* Inactive Horizontal Title (Mobile) */}
                  {!isActive && (
                    <div className="flex md:hidden w-full items-center mt-auto">
                      <h3 className="text-xl font-sculptural font-bold text-neutral-300 uppercase tracking-widest">
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

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 md:p-10"
            onClick={() => setLightboxImage(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-5xl max-h-[90vh] bg-[#111111] border border-neutral-800 rounded-3xl overflow-hidden flex flex-col shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-[#161616]">
                <span className="text-sm font-sculptural font-bold text-white uppercase tracking-wider">
                  {lightboxImage.title} • THE GUILDS
                </span>
                <button
                  type="button"
                  onClick={() => setLightboxImage(null)}
                  className="p-2 rounded-full bg-neutral-800 hover:bg-[#C7A46A] hover:text-black text-white transition-colors"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-4 sm:p-6 bg-black/80 flex items-center justify-center max-h-[75vh] overflow-hidden">
                <img
                  src={lightboxImage.src}
                  alt={lightboxImage.title}
                  className="max-h-[70vh] max-w-full w-auto object-contain rounded-xl shadow-2xl"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
