import React, { useState } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { pressData } from '../../data/pressData';
import { ArrowUpRight, ArrowRight, Newspaper } from 'lucide-react';

export const PressPreviewSection: React.FC = () => {
  const [activePress, setActivePress] = useState(pressData[0]);

  return (
    <section
      id="chapter-12"
      className="full-viewport-scene bg-[#0a0a0a] border-b border-neutral-900 flex flex-col justify-center relative overflow-hidden py-16 md:py-24"
    >
      {/* Dynamic Background Image */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.img
            key={activePress.id}
            src={activePress.coverImage}
            alt={activePress.title}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 0.35, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full object-cover grayscale brightness-50"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/70 to-[#0a0a0a]/85" />
      </div>

      <div className="editorial-container relative z-10 my-auto py-10 w-full">
        {/* Top Header */}
        <div className="flex flex-col justify-start mb-8 pb-4 relative">
          <div className="flex items-center gap-3 text-[10px] font-mono tracking-[0.35em] text-[#C7A46A] uppercase mb-2">
            <span>12</span>
            <span className="w-12 h-[1px] bg-[#C7A46A]" />
            <span>EDITORIAL DISPATCHES</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-800 pb-4 gap-4">
            <div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#F4F1EA] uppercase tracking-tight">
                PRESS & NEWS
              </h2>
              <p className="text-xs sm:text-sm font-light text-neutral-400 mt-2 max-w-xl">
                National and regional press coverage, runway announcements, feature stories, and industry interviews.
              </p>
            </div>
            <Link
              href="/press"
              className="inline-flex items-center gap-2 text-xs font-mono text-[#C7A46A] hover:text-white uppercase tracking-wider transition-colors"
            >
              <span>VIEW ALL EDITORIAL ARTICLES</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

        {/* Interactive Master Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
          {/* Left: Article List */}
          <div className="lg:col-span-6 space-y-3">
            {pressData.slice(0, 4).map((article, idx) => {
              const isSelected = activePress.id === article.id;
              return (
                <button
                  key={article.id}
                  onClick={() => setActivePress(article)}
                  onMouseEnter={() => setActivePress(article)}
                  className={`w-full text-left p-4 rounded-2xl transition-all duration-300 flex items-center justify-between border ${
                    isSelected
                      ? 'border-[#C7A46A] bg-[#121212] shadow-[0_0_15px_rgba(199,164,106,0.15)]'
                      : 'border-neutral-800 bg-[#0a0a0a] hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`font-mono text-xs uppercase font-semibold ${
                        isSelected ? 'text-[#C7A46A]' : 'text-neutral-500'
                      }`}
                    >
                      0{idx + 1}
                    </span>
                    <div>
                      <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider block mb-0.5">
                        {article.date} • {article.category}
                      </span>
                      <span
                        className={`text-sm sm:text-base font-serif uppercase tracking-wider line-clamp-1 transition-colors ${
                          isSelected ? 'text-[#F4F1EA]' : 'text-neutral-300'
                        }`}
                      >
                        {article.title}
                      </span>
                    </div>
                  </div>
                  {isSelected ? (
                    <ArrowRight size={14} className="text-[#C7A46A] flex-shrink-0" />
                  ) : (
                    <Newspaper size={14} className="text-neutral-600 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right: Active Detail Plate */}
          <div className="lg:col-span-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePress.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
                className="p-8 md:p-10 rounded-3xl bg-[#0B0B0B]/80 backdrop-blur-md border border-neutral-800 flex flex-col justify-between h-full min-h-[380px]"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[10px] font-mono tracking-widest text-[#C7A46A] uppercase px-3 py-1 rounded bg-[#161616] border border-[#C7A46A]/30">
                      {activePress.category}
                    </span>
                    <span className="text-xs font-mono text-neutral-500">
                      {activePress.date}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-serif text-[#F4F1EA] uppercase mb-3 leading-tight">
                    {activePress.title}
                  </h3>

                  <p className="text-neutral-300 text-xs sm:text-sm font-light leading-relaxed mb-6">
                    {activePress.excerpt}
                  </p>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-neutral-800">
                  <Link
                    href={`/press/${activePress.slug}`}
                    className="btn-luxury btn-luxury-gold rounded-xl py-2 px-6 text-xs inline-flex items-center gap-2"
                  >
                    <span>READ FULL ARTICLE</span>
                    <ArrowUpRight size={14} />
                  </Link>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                    {activePress.readTime}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
