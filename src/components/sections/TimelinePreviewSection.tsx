import React, { useState } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { timelineData } from '../../data/timelineData';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';

export const TimelinePreviewSection: React.FC = () => {
  const [activeYear, setActiveYear] = useState(timelineData[0].year);
  const currentItem = timelineData.find((item) => item.year === activeYear) || timelineData[0];

  return (
    <section
      id="chapter-04"
      className="full-viewport-scene bg-[#0a0a0a] border-b border-neutral-900 flex flex-col justify-between relative overflow-hidden"
    >
      <div className="editorial-container relative z-10 my-auto py-10 w-full">
        {/* Header Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-neutral-800/80">
          <div>
            <div className="flex items-center gap-3 text-xs font-mono tracking-[0.35em] text-[#C7A46A] uppercase mb-2">
              <span>04</span>
              <span className="w-8 h-[1px] bg-[#C7A46A]" />
              <span>THE ARCHIVAL RETROSPECTIVE</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif text-white uppercase tracking-tight">
              THE JOURNEY / TIMELINE
            </h2>
          </div>

          <Link
            href="/timeline"
            data-cursor="TIMELINE"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-xs font-sans tracking-[0.2em] uppercase text-[#C7A46A] hover:text-white transition-colors group"
          >
            <span>EXPLORE MUSEUM ARCHIVE</span>
            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Year Scrubbing Rail */}
        <div className="flex items-center gap-2 md:gap-4 overflow-x-auto pb-4 border-b border-neutral-800/80 mb-8 scrollbar-none">
          {timelineData.map((item) => {
            const isSelected = item.year === activeYear;
            return (
              <button
                key={item.year}
                onClick={() => setActiveYear(item.year)}
                className={`px-5 py-2 rounded-full text-xs md:text-sm font-mono tracking-wider transition-all duration-300 ${
                  isSelected
                    ? 'bg-[#C7A46A] text-[#080808] font-bold shadow-lg shadow-[#C7A46A]/20 scale-105'
                    : 'bg-[#121212] text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                {item.year}
              </button>
            );
          })}
        </div>

        {/* Active Year Showcase Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentItem.year}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          >
            {/* Left Spatial Imagery */}
            <div className="lg:col-span-6 h-72 sm:h-80 md:h-[380px] rounded-3xl overflow-hidden editorial-image-frame relative border border-neutral-800">
              <img
                src={currentItem.image}
                alt={`${currentItem.year} - ${currentItem.title}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-[#C7A46A]/40 text-[#C7A46A] font-mono text-xs font-bold">
                {currentItem.theme}
              </div>
            </div>

            {/* Right Details & Monumental Year */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <span className="text-6xl sm:text-7xl md:text-8xl font-sculptural font-bold text-[#C7A46A] leading-none mb-2 block select-none">
                {currentItem.year}
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif text-white uppercase tracking-wide mb-2 leading-snug">
                {currentItem.title}
              </h3>
              <p className="text-xs font-sans text-[#C7A46A] tracking-widest uppercase font-medium mb-4">
                {currentItem.subtitle}
              </p>
              <p className="text-neutral-300 text-xs md:text-sm font-light leading-relaxed mb-6">
                {currentItem.description}
              </p>

              <div className="space-y-2 border-t border-neutral-800/80 pt-4">
                {currentItem.milestones.slice(0, 2).map((milestone) => (
                  <div key={milestone} className="flex items-center gap-2.5 text-xs text-neutral-300 font-light">
                    <CheckCircle2 size={14} className="text-[#C7A46A] shrink-0" />
                    <span>{milestone}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Level 05: Directional Cue */}
      <div className="scene-directional-cue">
        <span>04 / 17 • SCROLL TO FOUNDER ↓</span>
      </div>
    </section>
  );
};
