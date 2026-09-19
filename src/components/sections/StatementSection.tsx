import React from 'react';
import { motion, Variants } from 'framer-motion';

export const StatementSection: React.FC = () => {
  const lineVariants: Variants = {
    hidden: { opacity: 0, y: 35 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.85, delay: i * 0.18, ease: 'easeOut' },
    }),
  };

  return (
    <section
      id="chapter-02"
      className="full-viewport-scene bg-[#0a0a0a] border-t border-b border-[#C7A46A]/15 overflow-hidden flex flex-col justify-center relative"
    >
      {/* Background Watermark Typography */}
      <div className="watermark-text select-none">
        ECOSYSTEM
      </div>

      <div className="editorial-container relative z-10 my-auto py-12">
        <div className="max-w-5xl mx-auto">
          {/* Level 01: Small Editorial Label */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-mono tracking-[0.35em] uppercase text-[#C7A46A] mb-8 flex items-center gap-3"
          >
            <span>02</span>
            <span className="w-10 h-[1px] bg-[#C7A46A]" />
            <span>THE RFR STATEMENT</span>
          </motion.div>

          {/* Level 02: Large Headline */}
          <div className="space-y-4 md:space-y-6">
            <motion.h2
              custom={1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={lineVariants}
              className="text-chapter-headline font-serif font-light tracking-tight text-[#FAF9F6] uppercase"
            >
              RFR IS <span className="italic text-[#C7A46A] font-normal">MORE THAN</span> A RUNWAY.
            </motion.h2>

            <motion.p
              custom={2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={lineVariants}
              className="text-editorial-statement font-serif font-light tracking-tight text-neutral-300 uppercase leading-[1.05]"
            >
              IT IS A CREATIVE ECOSYSTEM CONNECTING FASHION, LIFESTYLE, BRANDS, CREATORS & AUDIENCES.
            </motion.p>
          </div>

          {/* Level 03: Supporting Editorial Copy */}
          <motion.div
            custom={3}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={lineVariants}
            className="mt-14 pt-8 border-t border-neutral-800/80 grid grid-cols-1 md:grid-cols-3 gap-8 text-neutral-400 text-xs md:text-sm font-light leading-relaxed"
          >
            <div>
              <span className="text-[#C7A46A] font-mono text-xs uppercase block mb-1.5">01 • CULTURE</span>
              Rooted in couture discipline, elevated by genuine cultural relevance and youth creative energy.
            </div>
            <div>
              <span className="text-[#C7A46A] font-mono text-xs uppercase block mb-1.5">02 • COLLABORATION</span>
              A sanctuary for brands, creators, models, and innovators to cross-pollinate and co-create.
            </div>
            <div>
              <span className="text-[#C7A46A] font-mono text-xs uppercase block mb-1.5">03 • VISIBILITY</span>
              Delivering high-voltage physical and digital exposure that converts fleeting attention into lasting prestige.
            </div>
          </motion.div>
        </div>
      </div>

      {/* Level 05: Directional Cue */}
      <div className="scene-directional-cue">
        <span>02 / 17 • SCROLL TO EXPLORE ↓</span>
      </div>
    </section>
  );
};
