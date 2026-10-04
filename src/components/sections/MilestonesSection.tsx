import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Sparkles, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { timelineData } from '../../data/timelineData';

export const MilestonesSection: React.FC = () => {
  return (
    <section
      id="chapter-08"
      className="full-viewport-scene bg-[#050505] border-b border-neutral-900 flex flex-col justify-center relative overflow-hidden py-16 md:py-24"
    >
      <div className="editorial-container relative z-10 w-full my-auto">
        {/* Section Header */}
        <div className="flex flex-col justify-start mb-12 pb-4">
          <div className="flex items-center gap-3 text-[10px] font-mono tracking-[0.35em] text-[#C7A46A] uppercase mb-2">
            <span>08</span>
            <span className="w-12 h-[1px] bg-[#C7A46A]" />
            <span>THE EVOLUTIONARY CHAPTERS</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-800 pb-4 gap-4">
            <div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#F4F1EA] uppercase tracking-tight">
                MILESTONES
              </h2>
              <p className="text-xs sm:text-sm font-light text-neutral-400 mt-2 max-w-xl">
                Every event, campaign, IP release, and talent launch adds another defining chapter to our historic evolution.
              </p>
            </div>
            <Link
              href="/milestones"
              className="inline-flex items-center gap-2 text-xs font-mono text-[#C7A46A] hover:text-white uppercase tracking-wider transition-colors"
            >
              <span>VIEW ALL MILESTONE CHAPTERS</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

        {/* Milestones Scroll Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {timelineData.slice(0, 6).map((item, idx) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="p-6 md:p-8 rounded-2xl bg-[#0c0c0c] border border-neutral-800 hover:border-[#C7A46A]/50 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-sculptural font-bold text-[#C7A46A] group-hover:scale-105 transition-transform">
                    {item.year}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest px-2.5 py-0.5 rounded bg-[#161616] border border-neutral-800">
                    {item.theme}
                  </span>
                </div>

                <h3 className="text-xl font-serif text-white uppercase mb-2 group-hover:text-[#C7A46A] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-neutral-400 font-light leading-relaxed mb-4">
                  {item.description}
                </p>

                <div className="space-y-1.5 pt-2">
                  {item.milestones.slice(0, 2).map((m, mIdx) => (
                    <div key={mIdx} className="flex items-start gap-2 text-[11px] text-neutral-300 font-light">
                      <Sparkles size={12} className="text-[#C7A46A] flex-shrink-0 mt-0.5" />
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-6 border-t border-neutral-850 flex items-center justify-between text-xs font-mono text-[#C7A46A]">
                <Link href={`/timeline#year-${item.year}`} className="hover:underline flex items-center gap-1.5">
                  <span>DISCOVER YEAR</span>
                  <ArrowUpRight size={12} />
                </Link>
                <span className="text-neutral-600">0{idx + 1}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
