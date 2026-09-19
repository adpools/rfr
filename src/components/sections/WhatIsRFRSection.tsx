import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { ArrowUpRight } from 'lucide-react';

export const WhatIsRFRSection: React.FC = () => {

  return (
    <section
      id="chapter-runway"
      className="full-viewport-scene bg-[#080808] border-b border-neutral-900 flex flex-col justify-between relative overflow-hidden"
    >
      <div className="editorial-container relative z-10 my-auto py-10 w-full">
        {/* Top Header */}
        <div className="flex flex-col justify-start mb-12 pb-4 relative">
          <div className="flex items-center gap-3 text-[10px] font-mono tracking-[0.35em] text-[#C7A46A] uppercase mb-2">
            <span>05</span>
            <span className="w-12 h-[1px] bg-[#C7A46A]" />
            <span>THE RUNWAY</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#333] pb-4 gap-4">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#F4F1EA] uppercase tracking-tight">
              RIYAS FASHION RUNWAY
            </h2>
          </div>
        </div>

        {/* Interactive Master Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
          
          {/* Left: Interactive Category Selector (Single Item for Runway) */}
          <div className="lg:col-span-5 space-y-3">
             <div className="w-full text-left px-6 py-4 rounded-full transition-all duration-300 flex items-center justify-between border border-[#C7A46A] bg-transparent shadow-[0_0_15px_rgba(199,164,106,0.1)]">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-[11px] text-[#C7A46A]">
                    01
                  </span>
                  <span className="text-sm sm:text-base font-serif uppercase tracking-wider text-[#F4F1EA]">
                    THE RUNWAY • 2020—PRESENT
                  </span>
                </div>
                <div className="w-2 h-2 rounded-full bg-[#C7A46A]" />
             </div>
          </div>

          {/* Right: Active Detail Plate with Image */}
          <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="p-8 md:p-10 rounded-[2rem] bg-[#0B0B0B]/60 backdrop-blur-md border border-[#333] flex flex-col justify-between h-full min-h-[420px]"
              >
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#C7A46A] uppercase px-3 py-1 rounded border border-[#C7A46A] inline-block mb-6">
                    PHYSICAL MANIFESTATION
                  </span>
                  <h3 className="text-3xl sm:text-4xl font-serif text-[#F4F1EA] uppercase mb-4 leading-tight italic">
                    Where couture discipline meets cultural relevance.
                  </h3>
                  
                  <div className="w-full h-48 md:h-64 my-8 rounded-xl overflow-hidden border border-[#333]">
                    <img 
                      src="https://images.pexels.com/photos/2916814/pexels-photo-2916814.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                      alt="Fashion Runway" 
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 opacity-90"
                    />
                  </div>
                </div>

                <div className="pt-6 flex items-center justify-between border-t border-[#333]">
                  <Link
                    href="/gallery"
                    className="px-6 py-3 md:px-8 bg-[#C5A76A] text-[#050505] font-sans font-bold text-[10px] uppercase tracking-[0.2em] rounded-full inline-flex items-center gap-2 hover:bg-[#F4F1EA] transition-colors"
                  >
                    <span>VIEW THE ARCHIVE</span>
                    <ArrowUpRight size={14} />
                  </Link>
                </div>
              </motion.div>
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
