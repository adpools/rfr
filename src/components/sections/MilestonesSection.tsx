import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import { timelineData } from '../../data/timelineData';

export const MilestonesSection: React.FC = () => {
  return (
    <section
      id="chapter-08"
      className="full-viewport-scene bg-[#050505] border-b border-neutral-900 flex flex-col justify-center relative overflow-hidden py-24 md:py-32"
    >
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-[#C7A46A]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#C7A46A]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="editorial-container relative z-10 w-full my-auto max-w-7xl mx-auto">
        
        {/* Section Header - Editorial Redesign */}
        <div className="flex flex-col justify-start mb-14">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-[11px] sm:text-xs font-serif font-bold text-[#C7A46A]">08</span>
            <div className="w-16 sm:w-24 h-[1px] bg-[#C7A46A]/50" />
            <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.4em] text-[#C7A46A] uppercase">
              THE EVOLUTIONARY CHAPTERS
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-900 pb-8 gap-8">
            <div className="max-w-3xl">
              <h2 className="text-6xl sm:text-7xl lg:text-[110px] font-serif text-[#F4F1EA] uppercase tracking-tighter leading-[0.85] mb-6 drop-shadow-2xl">
                MILESTONES
              </h2>
              <p className="text-sm sm:text-[15px] font-serif font-light text-[#A09D96] leading-relaxed max-w-lg tracking-wide">
                Every event, campaign, IP release, and talent launch adds another defining chapter to our historic evolution.
              </p>
            </div>
            <Link
              href="/milestones"
              className="group flex items-center gap-4 px-7 py-3.5 rounded-full border border-neutral-800 hover:border-[#C7A46A]/60 bg-[#0a0a0a] hover:bg-[#C7A46A]/10 transition-all duration-300"
            >
              <span className="text-[10px] font-mono text-[#E0DDD5] group-hover:text-[#C7A46A] uppercase tracking-[0.2em] transition-colors">
                EXPLORE ALL CHAPTERS
              </span>
              <div className="w-7 h-7 rounded-full bg-[#111111] group-hover:bg-[#C7A46A] flex items-center justify-center transition-colors">
                <ArrowUpRight size={14} className="text-[#A09D96] group-hover:text-black transition-colors" />
              </div>
            </Link>
          </div>
        </div>

        {/* Milestones Scroll Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {timelineData.slice(0, 6).map((item, idx) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-8 rounded-[24px] bg-[#0a0a0a]/90 backdrop-blur-md border border-neutral-900 shadow-xl hover:border-[#C7A46A]/50 transition-all duration-500 hover:-translate-y-1 flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#C7A46A]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-4xl lg:text-5xl font-serif tracking-tighter text-[#C7A46A] group-hover:scale-105 transition-transform duration-500">
                    {item.year}
                  </span>
                  <span className="text-[9px] font-mono text-[#A09D96] uppercase tracking-[0.2em] px-3 py-1.5 rounded-full bg-[#111111] border border-neutral-800/80">
                    {item.theme}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-serif text-white uppercase mb-4 leading-snug group-hover:text-[#C7A46A] transition-colors">
                  {item.title}
                </h3>
                <p className="text-[#A09D96] text-[13px] sm:text-sm font-light leading-relaxed mb-6">
                  {item.description}
                </p>

                <div className="space-y-2.5 pt-2">
                  {item.milestones.slice(0, 2).map((m, mIdx) => (
                    <div key={mIdx} className="flex items-start gap-3 text-[11px] sm:text-xs text-[#E0DDD5] font-light leading-relaxed">
                      <Sparkles size={14} className="text-[#C7A46A] flex-shrink-0 mt-0.5 opacity-80" />
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-8 border-t border-neutral-900 flex items-center justify-between text-[10px] font-mono text-[#C7A46A] relative z-10">
                <Link href={`/timeline#year-${item.year}`} className="inline-flex items-center gap-2 group-hover:text-[#F4F1EA] uppercase tracking-[0.2em] transition-colors">
                  <span>DISCOVER YEAR</span>
                  <ArrowUpRight size={14} />
                </Link>
                <span className="text-neutral-600 tracking-widest">0{idx + 1}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
