import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'wouter';
import { ArrowUpRight } from 'lucide-react';
import { pressData } from '../../data/pressData';

export const PressPreviewSection: React.FC = () => {
  return (
    <section
      id="chapter-12"
      className="bg-[#050505] border-b border-neutral-900 flex flex-col justify-start relative overflow-hidden py-20 md:py-24"
    >
      <div className="absolute top-1/4 right-0 w-[1000px] h-[1000px] bg-[#C7A46A]/5 rounded-full blur-[200px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[1000px] h-[1000px] bg-[#C7A46A]/5 rounded-full blur-[200px] pointer-events-none" />

      <div className="w-full max-w-[100rem] mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Centered Header */}
        <div className="flex flex-col items-center text-center mb-16 md:mb-24">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-xs sm:text-sm font-serif font-bold text-[#C7A46A]">12</span>
            <div className="w-24 h-[1px] bg-[#C7A46A]/50" />
            <span className="text-[10px] sm:text-xs font-mono tracking-[0.4em] text-[#C7A46A] uppercase">
              EDITORIAL DISPATCHES
            </span>
          </div>

          <h2 className="text-6xl sm:text-7xl md:text-[90px] lg:text-[110px] font-serif text-[#F4F1EA] uppercase tracking-tighter leading-[0.8] mb-8 drop-shadow-2xl">
            PRESS <br />& NEWS
          </h2>
          <p className="text-sm sm:text-base font-serif font-light text-[#A09D96] leading-relaxed max-w-xl mx-auto tracking-wide">
            National and regional press coverage, runway announcements, feature stories, and exclusive industry interviews.
          </p>
        </div>

        {/* Space-Consuming Vertical Stack (Reduced Scale) */}
        <div className="flex flex-col gap-16 md:gap-24">
          {pressData.slice(0, 4).map((article, idx) => {
            const isEven = idx % 2 === 0;

            return (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-24 items-center group`}
              >
                <div className="w-full lg:w-1/2 h-[350px] md:h-[450px] rounded-[24px] overflow-hidden relative shadow-2xl">
                  <div className="absolute inset-0 bg-[#C7A46A]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 pointer-events-none mix-blend-overlay" />
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="absolute inset-0 w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:scale-110 group-hover:brightness-90 transition-all duration-1000 ease-out"
                  />
                </div>

                <div className="w-full lg:w-1/2 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-[10px] font-mono tracking-[0.2em] text-[#C7A46A] uppercase px-4 py-2 rounded-full border border-neutral-800 bg-[#0a0a0a]">
                      {article.category}
                    </span>
                    <span className="text-xs text-[#A09D96] font-mono tracking-widest">
                      {article.date}
                    </span>
                  </div>

                  <h3 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#F4F1EA] uppercase mb-6 leading-[1.1] tracking-tight group-hover:text-white transition-colors duration-500">
                    {article.title}
                  </h3>

                  <p className="text-[#A09D96] text-xs sm:text-sm font-light leading-relaxed mb-8 max-w-lg">
                    {article.excerpt}
                  </p>

                  <Link
                    href={`/press/${article.slug}`}
                    className="inline-flex items-center gap-4 text-xs font-mono font-bold text-[#E0DDD5] group-hover:text-[#C7A46A] uppercase tracking-[0.2em] transition-colors"
                  >
                    <span>READ FULL DISPATCH</span>
                    <div className="w-10 h-10 rounded-full bg-[#111111] border border-neutral-800 group-hover:bg-[#C7A46A] flex items-center justify-center transition-all duration-500 group-hover:scale-110">
                      <ArrowUpRight size={16} className="text-[#E0DDD5] group-hover:text-black transition-colors" />
                    </div>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {/* View All Button Centered at Bottom */}
        <div className="flex justify-center mt-20 md:mt-24">
          <Link
            href="/press"
            className="group flex items-center gap-4 px-8 py-4 rounded-full border border-neutral-800 hover:border-[#C7A46A]/60 bg-[#0a0a0a] hover:bg-[#C7A46A]/10 transition-all duration-500"
          >
            <span className="text-[10px] font-mono text-[#E0DDD5] group-hover:text-[#C7A46A] uppercase tracking-[0.2em] transition-colors">
              VIEW THE COMPLETE ARCHIVE
            </span>
            <div className="w-8 h-8 rounded-full bg-[#111111] group-hover:bg-[#C7A46A] flex items-center justify-center transition-colors">
              <ArrowUpRight size={14} className="text-[#A09D96] group-hover:text-black transition-colors" />
            </div>
          </Link>
        </div>

      </div>
    </section>
  );
};
