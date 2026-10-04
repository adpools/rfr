import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

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
      className="full-viewport-scene bg-[#050505] flex flex-col justify-center items-center overflow-hidden relative"
    >
      {/* 1. Video Background Layer */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="absolute w-full h-full object-cover object-top opacity-50 filter brightness-75 contrast-125 saturate-50 blur-[2px]"
          src="/videos/Dandya%20Deeshna%20Event/hero-bg-optimized.mp4"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,5,5,0.85)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/90" />
      </div>

      {/* 2. Main Centered Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 w-full h-full pb-16">
        
        <div className="flex flex-col items-center justify-center w-full max-w-5xl mx-auto">
          {/* Top Minimal Label */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="w-12 h-[1px] bg-[#C7A46A]/40"></div>
            <span className="text-[9px] md:text-[11px] font-mono tracking-[0.4em] text-[#C7A46A] uppercase font-light">
              RIYAS FASHION RUNWAY — RFR BY RIYAS
            </span>
            <div className="w-12 h-[1px] bg-[#C7A46A]/40"></div>
          </motion.div>

          {/* Watch Reel Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="mb-8"
          >
            <button 
              onClick={() => setIsVideoModalOpen(true)}
              className="flex items-center gap-3 px-5 py-2.5 rounded-full border border-[#C7A46A]/30 hover:border-[#C7A46A] hover:bg-[#C7A46A]/10 transition-all group backdrop-blur-md bg-black/20"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
              <span className="text-[9px] md:text-[10px] font-mono tracking-[0.2em] text-[#E0DDD5] group-hover:text-[#C7A46A] transition-colors uppercase mt-px">
                WATCH 2020-2026 VIDEO ARCHIVE REEL
              </span>
              <Play size={10} className="text-[#C7A46A]" />
            </button>
          </motion.div>

          {/* EST Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="mb-8 px-6 py-2.5 border border-[#C7A46A]/20 rounded-md bg-black/40 backdrop-blur-sm"
          >
            <span className="text-[8px] md:text-[10px] font-mono tracking-[0.3em] text-[#C7A46A] uppercase">
              EST. 2020 • RUNWAYS • COMMERCIAL ADS • EXPERIENTIAL IPS
            </span>
          </motion.div>

          {/* Monumental Title */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-[18vw] md:text-[12vw] font-serif font-normal leading-none select-none text-[#F4F1EA] tracking-tighter drop-shadow-2xl"
          >
            RFR
          </motion.h1>

          {/* Description Text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 md:mt-8 text-[10px] md:text-sm font-serif font-light text-[#A09D96] max-w-3xl mx-auto uppercase tracking-[0.25em] leading-relaxed text-center"
          >
            A Creative Ecosystem Built Around Fashion, People & Possibility.
          </motion.p>
        </div>

        {/* Explore Chapters - Positioned Absolute at Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 1.2 }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6"
        >
          <span className="text-[9px] md:text-[10px] font-mono tracking-[0.4em] text-[#6b6964] uppercase text-center w-max">
            EXPLORE 13 CHAPTERS OF FASHION & PRODUCTIONS
          </span>
          <div className="w-[1px] h-16 md:h-20 bg-gradient-to-b from-[#C7A46A]/50 to-transparent"></div>
        </motion.div>

      </div>

      {/* 3. Bottom Scroll Cue - Repositioned to avoid overlap */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 1.5 }}
        className="absolute bottom-6 right-8 md:right-12 flex flex-col items-center gap-3 z-10 hidden sm:flex"
      >
        <span className="text-[9px] font-mono tracking-[0.2em] text-[#C7A46A] uppercase transform rotate-90 mb-4">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-[#C7A46A]/70 to-transparent"></div>
      </motion.div>

      {/* Interactive BG Video Modal */}
      <AnimatePresence>
        {isVideoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setIsVideoModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-6xl aspect-video bg-[#050505] p-2 md:p-4 border border-[#C7A46A]/30 relative rounded-xl shadow-[0_0_50px_rgba(199,164,106,0.15)] flex flex-col"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="absolute top-4 right-4 z-50 p-3 rounded-full bg-[#C7A46A] text-black shadow-lg hover:scale-110 transition-transform"
              >
                <X size={20} className="stroke-[3px]" />
              </button>

              {/* Video Player */}
              <div className="w-full h-full bg-black rounded-lg overflow-hidden relative">
                <video
                  autoPlay
                  controls
                  className="w-full h-full object-contain"
                  src="/videos/Dandya%20Deeshna%20Event/Dandya%20Highlights.mp4"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
