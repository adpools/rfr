import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Sparkles } from 'lucide-react';
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
      {/* Video Background Layer */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="absolute w-full h-full object-cover opacity-60 mix-blend-screen filter grayscale-[80%]"
          src="https://videos.pexels.com/video-files/4919750/4919750-hd_1920_1080_25fps.mp4"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/90 via-[#080808]/50 to-[#080808]"></div>
      </div>

      {/* TOP: Brand Identifier */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="relative z-10 pt-20"
      >
        <div className="flex items-center gap-3">
          <div className="w-[30px] h-[1px] bg-[#B59A62]/50"></div>
          <span className="text-[10px] md:text-xs font-sans tracking-[0.4em] text-[#B59A62] uppercase font-light">
            RIYAS FASHION RUNWAY
          </span>
          <div className="w-[30px] h-[1px] bg-[#B59A62]/50"></div>
        </div>
      </motion.div>

      {/* CENTER: Monumental RFR Title */}
      <div className="editorial-container relative z-10 my-auto flex flex-col items-center">
        <motion.h1
          initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-h1-monumental font-sculptural font-bold leading-none select-none text-[#F4F1EA]"
        >
          RFR
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-6 text-sm md:text-base font-serif font-light text-[#8C8A85] max-w-2xl mx-auto uppercase tracking-[0.2em] leading-relaxed text-center"
        >
          A Creative Ecosystem Built Around Fashion, People & Possibility.
        </motion.p>
      </div>

      {/* BOTTOM: Directional Cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 1.5 }}
        className="relative z-10 pb-12 flex flex-col items-center gap-4 text-[#8C8A85]"
      >
        <span className="text-[9px] tracking-[0.4em] uppercase font-sans font-light">
          SCROLL TO ENTER
        </span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-[#B59A62]/50 to-transparent"></div>
      </motion.div>
    </section>
  );
};
