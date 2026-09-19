import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { StudioMicScene } from '../3d/StudioMicScene';
import { ArrowUpRight, Radio, Headphones, Mic2 } from 'lucide-react';

export const PodcastSection: React.FC = () => {
  const topics = [
    'Fashion Couture & Streetwear',
    'Entertainment & Cinema',
    'Lifestyle & Creative Identity',
    'Brand Financing & Algorithms',
  ];

  return (
    <section
      id="chapter-09"
      className="full-viewport-scene bg-[#060606] border-b border-neutral-900 flex flex-col justify-between relative overflow-hidden"
    >
      {/* Background Studio Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C7A46A]/5 blur-3xl pointer-events-none" />

      <div className="editorial-container relative z-10 my-auto py-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: 3D Studio Microphone Monolith */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 p-8 rounded-3xl bg-[#0c0c0c] border border-[#C7A46A]/25 relative flex flex-col items-center justify-center text-center shadow-2xl"
          >
            <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-800/50 text-red-400 text-[10px] font-mono tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
              <span>STUDIO LIVE</span>
            </div>

            {/* 3D Mic Canvas */}
            <StudioMicScene />

            <div className="mt-4 pt-4 border-t border-neutral-800 w-full flex items-center justify-between text-xs font-mono text-neutral-400">
              <span className="flex items-center gap-1.5 text-[#C7A46A]">
                <Radio size={13} />
                <span>RFR STUDIO MEDIA</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Headphones size={13} />
                <span>SPATIAL AUDIO</span>
              </span>
            </div>
          </motion.div>

          {/* Right Column: Editorial Narrative */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="flex items-center gap-3 text-xs font-mono tracking-[0.35em] text-[#C7A46A] uppercase mb-4">
              <span>09</span>
              <span className="w-8 h-[1px] bg-[#C7A46A]" />
              <span>THE PODCAST INITIATIVE</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif text-white tracking-tight uppercase leading-tight mb-4">
              CONVERSATIONS <br />
              <span className="italic text-[#C7A46A] font-light">BEYOND</span> THE RUNWAY.
            </h2>

            <p className="text-neutral-300 text-xs md:text-sm font-light leading-relaxed mb-6 max-w-xl">
              Unfiltered, intellectual dialogues with visionary designers, creative entrepreneurs, models, and media moguls redefining the international creative landscape.
            </p>

            {/* Topics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-8 max-w-xl">
              {topics.map((t) => (
                <div
                  key={t}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-[#111111] border border-neutral-800 text-xs text-neutral-300"
                >
                  <Mic2 size={13} className="text-[#C7A46A] shrink-0" />
                  <span className="truncate">{t}</span>
                </div>
              ))}
            </div>

            <div>
              <Link
                href="/services/podcast"
                data-cursor="PODCAST"
                className="btn-luxury btn-luxury-gold rounded-full text-xs inline-flex items-center gap-2"
              >
                <span>EXPLORE PODCAST SERIES</span>
                <ArrowUpRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Level 05: Directional Cue */}
      <div className="scene-directional-cue">
        <span>09 / 17 • SCROLL TO ECOSYSTEM ↓</span>
      </div>
    </section>
  );
};
