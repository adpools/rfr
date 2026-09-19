import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Sparkles } from 'lucide-react';
import { RunwayCanvas } from '../3d/RunwayCanvas';
import { FallbackBackdrop } from '../3d/FallbackBackdrop';
import { useMediaQuery } from '../../hooks/useMediaQuery';

export const HeroSection: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const isMobile = useMediaQuery('(max-width: 768px)');

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
      className="full-viewport-scene bg-[#080808] flex flex-col justify-between items-center text-center px-4 overflow-hidden"
    >
      {/* 3D WebGL Canvas or Lightweight Fallback */}
      {!isMobile ? (
        <RunwayCanvas scrollProgress={scrollProgress} />
      ) : (
        <FallbackBackdrop />
      )}

      {/* TOP: Brand Identifier */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 pt-16 md:pt-20"
      >
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#C7A46A]/30 bg-[#111111]/70 backdrop-blur-md">
          <Sparkles size={11} className="text-[#C7A46A]" />
          <span className="text-[10px] md:text-xs font-sans tracking-[0.35em] text-[#FAF9F6] uppercase font-light">
            RIYAS FASHION RUNWAY
          </span>
        </div>
      </motion.div>

      {/* CENTER: Monumental RFR Title & Editorial Headline */}
      <div className="editorial-container relative z-10 my-auto py-6 flex flex-col items-center">
        <motion.h1
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-hero-monumental font-sculptural font-bold leading-none select-none text-transparent bg-clip-text bg-gradient-to-b from-[#FAF9F6] via-[#E5C896] to-[#9E7C49] drop-shadow-2xl"
        >
          RFR
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7 }}
          className="mt-4 md:mt-6 text-xl sm:text-3xl md:text-4xl font-serif font-light text-[#FAF9F6] max-w-3xl mx-auto uppercase tracking-wide leading-snug"
        >
          CREATIVITY HAS A RUNWAY.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.8 }}
          className="mt-3 text-xs md:text-sm font-sans font-light tracking-[0.2em] text-neutral-400 uppercase max-w-xl mx-auto"
        >
          A Creative Ecosystem Built Around Fashion, People & Possibility.
        </motion.p>

        {/* Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.95 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#chapter-02"
            data-cursor="EXPLORE"
            className="px-8 py-3.5 rounded-full bg-[#C7A46A] text-[#080808] font-sans text-xs font-semibold tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all shadow-xl shadow-[#C7A46A]/20 flex items-center gap-2"
          >
            <span>EXPLORE RFR</span>
            <ArrowDown size={13} />
          </a>

          <a
            href="/timeline"
            data-cursor="JOURNEY"
            className="px-8 py-3.5 rounded-full bg-[#141414]/90 text-[#FAF9F6] border border-neutral-700 hover:border-[#C7A46A] font-sans text-xs font-medium tracking-[0.2em] uppercase transition-all flex items-center gap-2 backdrop-blur-md"
          >
            <span>OUR JOURNEY</span>
            <ArrowUpRight size={13} />
          </a>
        </motion.div>
      </div>

      {/* BOTTOM: Directional Cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="relative z-10 pb-8 flex flex-col items-center gap-2 text-neutral-500"
      >
        <span className="text-[9px] tracking-[0.35em] uppercase font-mono text-[#C7A46A]/80">
          01 / 17 • SCROLL TO ENTER ↓
        </span>
        <div className="w-4 h-7 rounded-full border border-neutral-700 flex items-start justify-center p-1">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            className="w-1 h-1.5 rounded-full bg-[#C7A46A]"
          />
        </div>
      </motion.div>
    </section>
  );
};
