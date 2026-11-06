import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { ArrowUpRight, Maximize2, X, ChevronLeft, ChevronRight, Newspaper, ExternalLink } from 'lucide-react';

interface HomepagePressFeature {
  id: string;
  publication: string;
  category: string;
  details: string;
  image: string;
  articleUrl?: string;
}

const majorPressFeatures: HomepagePressFeature[] = [
  {
    id: 'press-success-kerala',
    publication: 'Success Kerala',
    category: 'Success Story',
    details: "പാഷനുണ്ടോ? വിജയം താനേ വരും! ഇത് 'സർട്ടിഫൈഡ്' ഉറപ്പ്...! • Do You Have Passion? Success Will Come",
    image: '/news%20and%20press/WhatsApp%20Image%202026-11-06%20at%2010.53.08%20AM%20(1).jpeg',
    articleUrl: 'https://successkerala.com/do-you-have-passion-success-will-come-this-is-a-certified-guarantee/'
  },
  {
    id: 'press-asianet',
    publication: 'Asianet News',
    category: 'Television Broadcast',
    details: 'Prime News Feature • Runway & Nightlife Culture',
    image: '/news%20and%20press/WhatsApp%20Image%202026-11-04%20at%209.41.04%20PM.jpeg'
  },
  {
    id: 'press-kerala-kaumudi',
    publication: 'Kerala Kaumudi',
    category: 'Print Daily',
    details: 'State Daily Newspaper Clipping with Official Masthead',
    image: '/news%20and%20press/WhatsApp%20Image%202026-11-04%20at%209.42.10%20PM%20(1).jpeg'
  },
  {
    id: 'press-gfw',
    publication: 'Global Fashion Week',
    category: 'Runway Showcase',
    details: 'Season 3 Red Carpet & Runway Presentation',
    image: '/news%20and%20press/WhatsApp%20Image%202026-11-04%20at%209.41.05%20PM%20(1).jpeg'
  },
  {
    id: 'press-metro-vartha',
    publication: 'Metro Vartha',
    category: 'Print Daily',
    details: 'Statewide Daily Newsprint Feature with Masthead',
    image: '/news%20and%20press/WhatsApp%20Image%202026-11-04%20at%209.42.11%20PM.jpeg'
  },
  {
    id: 'press-summer-fest',
    publication: "Techie's Summer Fest",
    category: 'Festival Showcase',
    details: 'Technopark & Genrobotics • Riyas Abdul Rahim, Show Director',
    image: '/news%20and%20press/WhatsApp%20Image%202026-11-04%20at%209.41.06%20PM%20(1).jpeg'
  },
  {
    id: 'press-koottam-stage',
    publication: 'Koottam • Technopark',
    category: 'Official Felicitations',
    details: 'Stage Presentation, Award Ceremony & Lamp Lighting',
    image: '/news%20and%20press/WhatsApp%20Image%202026-11-04%20at%209.41.04%20PM%20(1).jpeg'
  },
  {
    id: 'press-chandrika',
    publication: 'Chandrika Daily',
    category: 'Print Daily',
    details: 'State Daily Newspaper Print Feature with Masthead',
    image: '/news%20and%20press/WhatsApp%20Image%202026-11-04%20at%209.42.08%20PM%20(1).jpeg'
  },
  {
    id: 'press-manorama-music',
    publication: 'Manorama Music',
    category: 'Media Production',
    details: 'Koode Nee Musical Release • Directed by Riyas Abdul Raheem',
    image: '/news%20and%20press/WhatsApp%20Image%202026-11-04%20at%209.41.06%20PM%20(2).jpeg'
  }
];

export const PressPreviewSection: React.FC = () => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (selectedIdx !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedIdx]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIdx === null) return;
      if (e.key === 'Escape') {
        setSelectedIdx(null);
      } else if (e.key === 'ArrowRight') {
        setSelectedIdx((prev) => (prev !== null ? (prev + 1) % majorPressFeatures.length : null));
      } else if (e.key === 'ArrowLeft') {
        setSelectedIdx((prev) => (prev !== null ? (prev - 1 + majorPressFeatures.length) % majorPressFeatures.length : null));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIdx]);

  const activeItem = selectedIdx !== null ? majorPressFeatures[selectedIdx] : null;

  return (
    <section
      id="chapter-12"
      className="bg-[#050505] border-b border-neutral-900 flex flex-col justify-start relative overflow-hidden py-20 md:py-28"
    >
      {/* Subtle luxury ambient glows */}
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-[#C7A46A]/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[600px] h-[600px] bg-[#C7A46A]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-14 md:mb-20">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-xs sm:text-sm font-serif font-bold text-[#C7A46A]">12</span>
            <div className="w-20 sm:w-28 h-[1px] bg-[#C7A46A]/50" />
            <span className="text-[10px] sm:text-xs font-mono tracking-[0.35em] text-[#C7A46A] uppercase">
              EDITORIAL & MEDIA
            </span>
          </div>

          <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif text-[#F4F1EA] uppercase tracking-tight leading-[0.9] mb-6 drop-shadow-2xl">
            PRESS & NEWS
          </h2>
          <p className="text-xs sm:text-sm md:text-base font-serif font-light text-[#A09D96] leading-relaxed max-w-2xl mx-auto tracking-wide">
            Authentic newspaper publications, state television broadcasts, red carpet dispatches, and media coverage documenting Riyas Fashion Runway.
          </p>
        </div>

        {/* Premium Press Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {majorPressFeatures.map((item, idx) => {
            const hasExternalUrl = !!item.articleUrl;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-5%' }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="bg-[#121212] border border-neutral-800 hover:border-[#C7A46A]/80 rounded-[22px] overflow-hidden transition-all duration-300 group flex flex-col shadow-xl hover:shadow-[0_12px_32px_rgba(199,164,106,0.12)] hover:-translate-y-1 relative"
              >
                {/* Image Frame */}
                <div
                  className="w-full h-64 sm:h-68 relative bg-[#0a0a0a] overflow-hidden flex items-center justify-center cursor-pointer"
                  onClick={() => {
                    if (hasExternalUrl && item.articleUrl) {
                      window.open(item.articleUrl, '_blank', 'noopener,noreferrer');
                    } else {
                      setSelectedIdx(idx);
                    }
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.publication}
                    className="w-full h-full object-cover object-top filter brightness-90 group-hover:brightness-100 group-hover:scale-105 transition-all duration-500 ease-out"
                    loading="lazy"
                  />

                  {/* Category Pill */}
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[9px] font-mono uppercase tracking-widest bg-black/80 border border-white/10 text-[#C7A46A] backdrop-blur-md z-10 shadow-md">
                    {item.category}
                  </span>

                  {/* Lightbox Quick-view Button (if external) */}
                  {hasExternalUrl && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedIdx(idx);
                      }}
                      className="absolute top-3 right-3 p-2 rounded-full bg-black/80 border border-white/10 text-white/80 hover:text-[#C7A46A] backdrop-blur-md z-10 shadow-md hover:scale-110 transition-all"
                      title="Enlarge Clipping"
                      aria-label="Enlarge Clipping"
                    >
                      <Maximize2 size={13} />
                    </button>
                  )}

                  {/* Hover Expand Overlay */}
                  <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                    {hasExternalUrl ? (
                      <span className="px-4 py-2 rounded-full bg-[#121212]/95 border border-[#C7A46A]/80 text-[#F4F1EA] text-[11px] font-mono tracking-wider flex items-center gap-2 shadow-2xl transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <ExternalLink size={13} className="text-[#C7A46A]" />
                        <span>READ FULL ARTICLE</span>
                      </span>
                    ) : (
                      <span className="px-4 py-2 rounded-full bg-[#121212]/95 border border-[#C7A46A]/80 text-[#F4F1EA] text-[11px] font-mono tracking-wider flex items-center gap-2 shadow-2xl transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <Maximize2 size={13} className="text-[#C7A46A]" />
                        <span>VIEW CLIPPING</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Meta */}
                <div className="p-5 flex flex-col justify-between flex-1 border-t border-neutral-800/80 bg-[#121212]">
                  <div>
                    <h3 className="text-base sm:text-lg font-sculptural font-bold text-white group-hover:text-[#C7A46A] transition-colors mb-1.5 uppercase tracking-wide truncate">
                      {item.publication}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-[#A09D96] font-sans line-clamp-2 leading-relaxed">
                      {item.details}
                    </p>
                  </div>

                  {hasExternalUrl && item.articleUrl ? (
                    <a
                      href={item.articleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 pt-3 border-t border-neutral-800/50 flex items-center justify-between text-[10px] font-mono font-bold text-[#C7A46A] hover:text-white transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="tracking-wider">READ ONLINE FEATURE</span>
                      <ExternalLink size={14} className="text-[#C7A46A]" />
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setSelectedIdx(idx)}
                      className="mt-4 pt-3 border-t border-neutral-800/50 flex items-center justify-between text-[10px] font-mono text-neutral-400 group-hover:text-[#C7A46A] transition-colors w-full text-left"
                    >
                      <span>PRESS ARCHIVE</span>
                      <ArrowUpRight size={14} className="text-[#C7A46A] opacity-70 group-hover:opacity-100 transition-opacity" />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* View All Button Centered at Bottom */}
        <div className="flex flex-col items-center justify-center mt-16 md:mt-20">
          <Link
            href="/press"
            className="group inline-flex items-center gap-4 px-8 py-4 rounded-full border border-neutral-800 hover:border-[#C7A46A] bg-[#0c0c0c] hover:bg-[#C7A46A]/10 transition-all duration-300 shadow-xl"
          >
            <Newspaper size={16} className="text-[#C7A46A]" />
            <span className="text-xs font-mono font-bold text-[#E0DDD5] group-hover:text-[#C7A46A] uppercase tracking-[0.2em] transition-colors">
              VIEW ALL PRESS & NEWS
            </span>
            <div className="w-8 h-8 rounded-full bg-[#181818] border border-neutral-800 group-hover:border-[#C7A46A] group-hover:bg-[#C7A46A] flex items-center justify-center transition-all duration-300">
              <ArrowUpRight size={14} className="text-[#A09D96] group-hover:text-black transition-colors" />
            </div>
          </Link>
          <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-widest mt-3">
            Explore 17+ Full Press Articles & Broadcast Clippings
          </span>
        </div>

      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeItem && selectedIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 md:p-8"
            onClick={() => setSelectedIdx(null)}
          >
            {/* Modal Dialog Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-5xl max-h-[92vh] w-full bg-[#111111] border border-neutral-800 rounded-3xl overflow-hidden flex flex-col shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-[#161616]">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono tracking-widest text-[#C7A46A] uppercase px-3 py-1 rounded-full border border-neutral-700 bg-black">
                    {activeItem.category}
                  </span>
                  <div>
                    <h4 className="text-base sm:text-lg font-sculptural font-bold text-white uppercase tracking-wider">
                      {activeItem.publication}
                    </h4>
                    <span className="text-xs text-neutral-400 font-sans block">
                      {activeItem.details}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedIdx(null)}
                  className="p-2.5 rounded-full bg-neutral-800/80 hover:bg-[#C7A46A] hover:text-black text-white transition-colors"
                  aria-label="Close image modal"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body / Image */}
              <div className="relative flex-1 min-h-[300px] max-h-[70vh] flex items-center justify-center p-4 sm:p-6 bg-black/60 overflow-hidden">
                <img
                  src={activeItem.image}
                  alt={activeItem.publication}
                  className="max-h-[66vh] max-w-full w-auto object-contain rounded-xl shadow-2xl"
                />

                {/* Previous Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIdx((prev) => (prev !== null ? (prev - 1 + majorPressFeatures.length) % majorPressFeatures.length : 0));
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 border border-neutral-700 hover:border-[#C7A46A] text-white hover:text-[#C7A46A] transition-colors"
                  aria-label="Previous press feature"
                >
                  <ChevronLeft size={20} />
                </button>

                {/* Next Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIdx((prev) => (prev !== null ? (prev + 1) % majorPressFeatures.length : 0));
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 border border-neutral-700 hover:border-[#C7A46A] text-white hover:text-[#C7A46A] transition-colors"
                  aria-label="Next press feature"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-3.5 border-t border-neutral-800 bg-[#141414] flex items-center justify-between text-xs font-mono text-neutral-400">
                <span>
                  Clipping {selectedIdx + 1} of {majorPressFeatures.length}
                </span>
                <div className="flex items-center gap-4">
                  {activeItem.articleUrl && (
                    <a
                      href={activeItem.articleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#C7A46A] hover:underline flex items-center gap-1.5 font-bold"
                    >
                      <span>Read Online Article</span>
                      <ExternalLink size={13} />
                    </a>
                  )}
                  <Link
                    href="/press"
                    className="text-neutral-300 hover:text-[#C7A46A] hover:underline flex items-center gap-1.5"
                    onClick={() => setSelectedIdx(null)}
                  >
                    <span>Open Full Archive</span>
                    <ArrowUpRight size={13} />
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
