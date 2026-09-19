import React, { useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { timelineData } from '../data/timelineData';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Sparkles, Filter } from 'lucide-react';

export const TimelinePage: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');

  const filteredYears = selectedYear === 'all'
    ? timelineData
    : timelineData.filter((item) => item.year === selectedYear);

  return (
    <PageWrapper
      title="Timeline & Archival History (2020 — 2026)"
      description="The museum archive of Riyas Fashion Runway. Explore the journey, milestones, and evolution of RFR from inception to global frontier."
    >
      <div className="editorial-container">
        {/* Editorial Subpage Hero Header */}
        <div className="max-w-4xl mb-12 md:mb-16">
          <div className="flex items-center gap-3 text-xs font-mono tracking-[0.35em] text-[#C7A46A] uppercase mb-4">
            <Sparkles size={13} className="text-[#C7A46A]" />
            <span>ARCHIVE • THE CHRONICLE</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-light text-white uppercase tracking-tight leading-[0.98] mb-6">
            2020 — 2026 <br />
            <span className="italic text-[#C7A46A] font-normal">TIMELINE.</span>
          </h1>

          <p className="text-neutral-300 text-sm md:text-base font-light leading-relaxed max-w-2xl">
            A retrospective journey through six transformative chapters of fashion curation, experiential properties, and creative convergence—documenting the evolution of Riyas Fashion Runway.
          </p>
        </div>

        {/* Refined Museum Scrubber Bar */}
        <div className="p-2 md:p-3 rounded-2xl bg-[#111111]/90 border border-neutral-800 backdrop-blur-xl mb-16 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedYear('all')}
              className={`px-5 py-2 rounded-xl text-xs font-mono uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${
                selectedYear === 'all'
                  ? 'bg-[#C7A46A] text-[#080808] font-bold shadow-md shadow-[#C7A46A]/20'
                  : 'text-neutral-400 hover:text-white hover:bg-[#181818]'
              }`}
            >
              All Years (2020–2026)
            </button>
            {timelineData.map((item) => {
              const isSelected = selectedYear === item.year;
              return (
                <button
                  key={item.year}
                  onClick={() => setSelectedYear(item.year)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono tracking-wider transition-all duration-300 whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#C7A46A] text-[#080808] font-bold shadow-md shadow-[#C7A46A]/20'
                      : 'text-neutral-400 hover:text-white hover:bg-[#181818]'
                  }`}
                >
                  {item.year}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-400 px-3 hidden md:flex">
            <Filter size={12} className="text-[#C7A46A]" />
            <span>{selectedYear === 'all' ? 'SHOWING ALL 7 CHAPTERS' : `FILTERED: ${selectedYear}`}</span>
          </div>
        </div>

        {/* Museum Timeline Cards Flow */}
        <div className="relative space-y-16 md:space-y-24">
          {/* Subtle Vertical Spine Line on Desktop */}
          <div className="absolute left-[36px] top-6 bottom-6 w-[1px] bg-gradient-to-b from-transparent via-[#C7A46A]/20 to-transparent hidden lg:block pointer-events-none" />

          {filteredYears.map((item, idx) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: idx * 0.08 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 p-6 sm:p-10 md:p-12 rounded-3xl bg-[#0f0f0f] border border-neutral-800/80 hover:border-[#C7A46A]/40 transition-all duration-500 items-center relative group"
            >
              {/* Left Column: High-Fashion Photography Frame */}
              <div className="lg:col-span-5 h-72 sm:h-80 md:h-[400px] rounded-2xl overflow-hidden editorial-image-frame relative border border-neutral-800">
                <img
                  src={item.image}
                  alt={`${item.year} - ${item.title}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/85 backdrop-blur-md border border-[#C7A46A]/40 text-[#C7A46A] font-mono text-[10px] font-bold tracking-widest uppercase">
                  CHAPTER 0{idx + 1}
                </div>
              </div>

              {/* Right Column: Narrative Content */}
              <div className="lg:col-span-7 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-5xl sm:text-6xl md:text-7xl font-sculptural font-bold text-[#C7A46A] leading-none select-none">
                    {item.year}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#181818] border border-neutral-700 text-[10px] font-mono text-neutral-300 uppercase tracking-widest">
                    {item.theme}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-white uppercase tracking-wide mb-2 leading-tight">
                  {item.title}
                </h2>

                <p className="text-xs font-mono text-[#C7A46A] tracking-wider uppercase mb-4 font-medium">
                  {item.subtitle}
                </p>

                <p className="text-neutral-300 text-xs sm:text-sm md:text-base font-light leading-relaxed mb-6">
                  {item.description}
                </p>

                <div className="space-y-2.5 pt-6 border-t border-neutral-800/80">
                  <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase block mb-1">
                    VERIFIED RETROSPECTIVE HIGHLIGHTS
                  </span>
                  {item.milestones.map((milestone) => (
                    <div key={milestone} className="flex items-start gap-3 text-xs md:text-sm text-neutral-300 font-light">
                      <CheckCircle2 size={15} className="text-[#C7A46A] shrink-0 mt-0.5" />
                      <span>{milestone}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
};
