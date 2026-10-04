import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { timelineData } from '../../data/timelineData';
import { ArrowUpRight, Sparkles, ChevronRight } from 'lucide-react';
import { Link } from 'wouter';

export const TimelinePreviewSection: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number>(timelineData[0].year);
  const activeData = timelineData.find((d) => d.year === selectedYear) || timelineData[0];

  return (
    <section
      id="chapter-01"
      className="full-viewport-scene bg-[#050505] border-b border-neutral-900 flex flex-col justify-center relative overflow-hidden py-16 md:py-24"
    >
      <div className="editorial-container relative z-10 w-full my-auto">
        {/* Top Header */}
        <div className="flex flex-col justify-start mb-8 pb-4">
          <div className="flex items-center gap-3 text-[10px] font-mono tracking-[0.35em] text-[#C7A46A] uppercase mb-2">
            <span>01</span>
            <span className="w-12 h-[1px] bg-[#C7A46A]" />
            <span>THE ARCHIVE (2020 – 2026)</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-800 pb-4 gap-4">
            <div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#F4F1EA] uppercase tracking-tight">
                TIMELINE
              </h2>
              <p className="text-xs sm:text-sm font-light text-neutral-400 mt-2 max-w-xl">
                A chronological retrospective of our evolution from foundational runway shows to an international creative ecosystem.
              </p>
            </div>
            <Link
              href="/timeline"
              className="inline-flex items-center gap-2 text-xs font-mono text-[#C7A46A] hover:text-white uppercase tracking-wider transition-colors"
            >
              <span>EXPLORE ALL 7 YEARS</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

        {/* Year Pills Navigation (2020 to 2026) */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {timelineData.map((item) => {
            const isSelected = item.year === selectedYear;
            return (
              <button
                key={item.year}
                onClick={() => setSelectedYear(item.year)}
                className={`px-4 sm:px-6 py-2 rounded-xl font-mono text-xs sm:text-sm font-semibold transition-all duration-300 flex-shrink-0 flex items-center gap-2 ${
                  isSelected
                    ? 'bg-[#C7A46A] text-black shadow-[0_0_15px_rgba(199,164,106,0.3)]'
                    : 'bg-[#111111] text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <span>{item.year}</span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
              </button>
            );
          })}
        </div>

        {/* Interactive Year Showcase Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeData.year}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#0a0a0a] border border-neutral-800/80 rounded-3xl p-6 sm:p-10"
          >
            {/* Left: Narrative */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-4xl sm:text-6xl font-sculptural text-[#C7A46A] font-bold">
                  {activeData.year}
                </span>
                <div className="h-10 w-[1px] bg-neutral-800" />
                <div>
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">
                    THEME
                  </span>
                  <span className="text-xs font-mono text-[#FAF9F6] uppercase tracking-wider font-medium">
                    {activeData.theme}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-serif text-white uppercase mb-2">
                  {activeData.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
                  {activeData.description}
                </p>
              </div>

              {/* Milestones / Events list */}
              <div className="space-y-2 pt-2 border-t border-neutral-900">
                <span className="text-[10px] font-mono text-[#C7A46A] uppercase tracking-widest block">
                  LANDMARK EVENTS ({activeData.eventsList.length})
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeData.eventsList.map((ev) => (
                    <span
                      key={ev.id}
                      className="px-3 py-1 rounded-lg bg-[#141414] border border-neutral-800 text-xs font-mono text-neutral-300"
                    >
                      ✦ {ev.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href={`/timeline#year-${activeData.year}`}
                  className="btn-luxury btn-luxury-gold rounded-xl text-xs py-2.5 px-6 inline-flex items-center gap-2"
                >
                  <span>VIEW {activeData.year} FULL RETROSPECTIVE</span>
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>

            {/* Right: Visual */}
            <div className="lg:col-span-6 h-64 sm:h-96 rounded-2xl overflow-hidden editorial-image-frame border border-neutral-800 relative">
              <img
                src={activeData.image}
                alt={activeData.title}
                className="w-full h-full object-cover grayscale hover:grayscale-0 hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-neutral-300">
                <span>RFR ARCHIVES • {activeData.year}</span>
                <span className="text-[#C7A46A]">VERIFIED RECORD</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
