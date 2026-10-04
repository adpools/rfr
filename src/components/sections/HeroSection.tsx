import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Sparkles, X, ExternalLink, Film, Award, Flame } from 'lucide-react';
import { useMediaQuery } from '../../hooks/useMediaQuery';

export const HeroSection: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const featuredReels = [
    {
      title: "Rewind with Riyas — Studio Talk Show",
      category: "ORIGINAL PODCAST IP",
      embedUrl: "https://drive.google.com/file/d/1nFgMIl7bLGHxTcKk46iixQNo4n-MQJHt/preview",
      tagline: "Unfiltered dialogues with cinema stars & fashion pioneers"
    },
    {
      title: "Citroën Basalt & Aircross Campaigns",
      category: "AUTOMOTIVE LAUNCH",
      embedUrl: "https://drive.google.com/file/d/1qwwQ8wxW-wOCRN9bG1bW23nJT9OSPN1g/preview",
      tagline: "High-fashion styling meets European SUV Coupe innovation"
    },
    {
      title: "Fans of Škoda — Full Highlights",
      category: "COMMUNITY & RALLY",
      embedUrl: "https://drive.google.com/file/d/18-WoWzGDIp7DnrCP6Cd7mA2XN-xr0e8A/preview",
      tagline: "Highway performance & automotive lifestyle with Škoda India"
    },
    {
      title: "Koottam Flea Market — Season 1 & 2",
      category: "COMMUNITY & RETAIL IP",
      embedUrl: "https://drive.google.com/file/d/1K0wzOv8anMih62lWwAXbRJCZGkxyh3IW/preview",
      tagline: "50+ independent brands, acoustic stage & thousands of visitors"
    },
    {
      title: "Chakita DD Retreat Haute Couture Runway",
      category: "DESIGNER COUTURE",
      embedUrl: "https://drive.google.com/file/d/1WMQC1KhSwMH8U973Iqfy7i_6K5fy7j5Y/preview",
      tagline: "Avant-garde runway choreography and celebrity showstoppers"
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const total = window.innerHeight;
      const progress = Math.min(Math.max(window.scrollY / total, 0), 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      id="chapter-01"
      className="full-viewport-scene bg-[#080808] flex flex-col justify-between items-center text-center px-4 overflow-hidden relative"
    >
      {/* Video Background Layer with Luxury Vignette */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="absolute w-full h-full object-cover opacity-50 filter brightness-75 contrast-125"
          src="https://videos.pexels.com/video-files/4919750/4919750-hd_1920_1080_25fps.mp4"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/60 to-[#080808]/85" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(8,8,8,0.7)_100%)]" />
      </div>

      {/* TOP: Brand Identifier + Live Media Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="relative z-10 pt-20 flex flex-col items-center gap-3"
      >
        <div className="flex items-center gap-3">
          <div className="w-[30px] h-[1px] bg-[#C7A46A]/50"></div>
          <span className="text-[10px] md:text-xs font-sans tracking-[0.4em] text-[#C7A46A] uppercase font-light">
            RIYAS FASHION RUNWAY — RFR BY RIYAS
          </span>
          <div className="w-[30px] h-[1px] bg-[#C7A46A]/50"></div>
        </div>

        {/* Video Reel Launcher Pill */}
        <button
          onClick={() => setIsVideoModalOpen(true)}
          className="mt-2 px-4 py-1.5 rounded-full bg-[#14120e]/90 border border-[#C7A46A]/50 hover:border-[#C7A46A] hover:bg-[#C7A46A]/10 text-white transition-all flex items-center gap-2 group backdrop-blur-md shadow-[0_0_20px_rgba(199,164,106,0.2)]"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <Film size={12} className="text-[#C7A46A]" />
          <span className="text-[10px] font-mono tracking-widest text-[#E8D8B8] uppercase group-hover:text-white transition-colors">
            WATCH 2020–2026 VIDEO ARCHIVE REEL
          </span>
          <Play size={10} className="text-[#C7A46A] group-hover:translate-x-0.5 transition-transform" />
        </button>
      </motion.div>

      {/* CENTER: Monumental RFR Title & Ethos */}
      <div className="editorial-container relative z-10 my-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="flex items-center gap-2 mb-2"
        >
          <span className="px-3 py-1 rounded bg-black/60 border border-[#C7A46A]/30 text-[10px] font-mono tracking-widest text-[#C7A46A] uppercase">
            EST. 2020 • RUNWAYS • COMMERCIAL ADS • EXPERIENTIAL IPS
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-h1-monumental font-sculptural font-bold leading-none select-none text-[#F4F1EA] tracking-tighter"
        >
          RFR
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-4 text-sm md:text-base font-serif font-light text-[#E0DDD5] max-w-2xl mx-auto uppercase tracking-[0.2em] leading-relaxed text-center"
        >
          A Creative Ecosystem Built Around Fashion, People & Possibility.
        </motion.p>

        {/* Dynamic Video Tags Highlight Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-6 flex flex-wrap justify-center items-center gap-2 max-w-3xl"
        >
          {[
            'Citroën Basalt & Aircross',
            'Fans of Škoda Rally',
            'Ather EV Riyas & Ganga',
            'Rewind with Riyas Podcast',
            'Koottam Flea S1 & S2',
            'Chakita Haute Couture',
            'Navaratri Naach 2025'
          ].map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-lg bg-black/50 border border-neutral-800 text-[11px] font-mono text-neutral-300 backdrop-blur-sm hover:border-[#C7A46A]/50 transition-colors"
            >
              ✦ {tag}
            </span>
          ))}
        </motion.div>
      </div>

      {/* BOTTOM: Scroll Cue + Quick Reel Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 1.2 }}
        className="relative z-10 pb-10 flex flex-col items-center gap-3 text-[#8C8A85]"
      >
        <span className="text-[9px] tracking-[0.4em] uppercase font-sans font-light text-[#C7A46A]/80">
          EXPLORE 13 CHAPTERS OF FASHION & PRODUCTIONS
        </span>
        <div className="w-[1px] h-10 bg-gradient-to-b from-[#C7A46A]/70 to-transparent"></div>
      </motion.div>

      {/* Interactive Video Archive Modal */}
      <AnimatePresence>
        {isVideoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-8"
            onClick={() => setIsVideoModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-5xl bg-[#0e0e0e] border border-[#C7A46A]/50 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(199,164,106,0.25)] flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-neutral-800 flex items-center justify-between bg-[#121212]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#1c1812] border border-[#C7A46A]/50 flex items-center justify-center text-[#C7A46A]">
                    <Film size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#C7A46A] uppercase tracking-widest block">
                      RFR OFFICIAL ARCHIVAL REEL
                    </span>
                    <h3 className="text-lg font-serif text-white uppercase">
                      {featuredReels[activeReelIndex].title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href="https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs"
                    target="_blank"
                    rel="noreferrer"
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#181818] border border-neutral-700 hover:border-[#C7A46A] text-[11px] font-mono text-neutral-300 hover:text-white uppercase transition-colors"
                  >
                    <span>OPEN DRIVE MASTER FOLDER</span>
                    <ExternalLink size={12} />
                  </a>

                  <button
                    onClick={() => setIsVideoModalOpen(false)}
                    className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-[#C7A46A] transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Video Player */}
              <div className="w-full h-80 sm:h-[480px] bg-black relative">
                <iframe
                  src={featuredReels[activeReelIndex].embedUrl}
                  title={featuredReels[activeReelIndex].title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Reel Selector Tabs */}
              <div className="p-4 bg-[#101010] border-t border-neutral-800 overflow-x-auto flex items-center gap-2">
                {featuredReels.map((reel, idx) => (
                  <button
                    key={reel.title}
                    onClick={() => setActiveReelIndex(idx)}
                    className={`px-4 py-2 rounded-xl text-left transition-all shrink-0 font-mono text-xs ${
                      activeReelIndex === idx
                        ? 'bg-[#C7A46A] text-black font-semibold'
                        : 'bg-[#181818] text-neutral-400 hover:text-white border border-neutral-800'
                    }`}
                  >
                    <span className="block text-[9px] uppercase tracking-wider opacity-75">
                      {reel.category}
                    </span>
                    <span className="truncate max-w-[200px] block">{reel.title}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
