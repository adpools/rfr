import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { founderData } from '../../data/founderData';
import { ArrowUpRight, Quote } from 'lucide-react';

export const FounderSection: React.FC = () => {
  return (
    <section
      id="chapter-05"
      className="full-viewport-scene bg-[#080808] border-b border-neutral-900 flex flex-col justify-between relative overflow-hidden"
    >
      <div className="editorial-container relative z-10 my-auto py-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Full-Screen Editorial Fashion Portrait (~60% width on desktop) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 relative"
          >
            <div className="relative h-[380px] sm:h-[460px] md:h-[540px] rounded-3xl overflow-hidden editorial-image-frame border border-[#C7A46A]/30">
              <img
                src={founderData.portraitImage}
                alt="Riyas — Founder of RFR"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent opacity-85" />

              {/* Floating Editorial Plate */}
              <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-[#0c0c0c]/90 backdrop-blur-md border border-[#C7A46A]/25">
                <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#C7A46A] block mb-1">
                  FOUNDER & CREATIVE DIRECTOR
                </span>
                <h3 className="text-3xl md:text-4xl font-sculptural text-white tracking-widest font-bold">
                  {founderData.name}
                </h3>
                <p className="text-xs text-neutral-400 font-sans tracking-wider uppercase mt-1">
                  {founderData.title}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Founder Narrative & Dossier (~40% width) */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="flex items-center gap-3 text-xs font-mono tracking-[0.35em] text-[#C7A46A] uppercase mb-4">
              <span>05</span>
              <span className="w-8 h-[1px] bg-[#C7A46A]" />
              <span>THE FOUNDER</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-serif text-white tracking-tight uppercase leading-tight mb-4">
              CRAFTING WORLDS BEYOND THE RUNWAY.
            </h2>

            <div className="space-y-3 text-neutral-300 text-xs md:text-sm font-light leading-relaxed mb-6">
              <p>{founderData.bioParagraphs[0]}</p>
              <p>{founderData.bioParagraphs[1]}</p>
            </div>

            {/* Quote Plate */}
            <div className="p-5 rounded-2xl bg-[#111111] border-l-2 border-[#C7A46A] mb-6">
              <Quote size={18} className="text-[#C7A46A] mb-2 opacity-60" />
              <p className="text-xs md:text-sm italic font-serif text-neutral-200 leading-relaxed mb-2">
                "{founderData.quote.text}"
              </p>
              <span className="text-[10px] font-mono tracking-widest text-[#C7A46A] uppercase block">
                — {founderData.quote.author}
              </span>
            </div>

            <Link
              href="/founder"
              data-cursor="PROFILE"
              className="inline-flex items-center gap-2 text-xs font-sans tracking-[0.2em] uppercase text-[#FAF9F6] hover:text-[#C7A46A] transition-colors group"
            >
              <span>READ FULL DOSSIER</span>
              <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform text-[#C7A46A]" />
            </Link>
          </div>
        </div>
      </div>

      {/* Level 05: Directional Cue */}
      <div className="scene-directional-cue">
        <span>05 / 17 • SCROLL TO PHILOSOPHY ↓</span>
      </div>
    </section>
  );
};
