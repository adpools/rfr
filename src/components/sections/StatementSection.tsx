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
      className="full-viewport-scene bg-[#080808] border-t border-b border-[#B59A62]/10 overflow-hidden flex flex-col justify-center relative"
    >
      <div className="editorial-container relative z-10 my-auto">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start lg:items-end justify-between">
          
          {/* Left: Massive Typography */}
          <div className="flex-1 max-w-4xl">
            <motion.h2
              custom={1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={lineVariants}
              className="text-section-title font-serif font-light tracking-tight text-[#F4F1EA] uppercase leading-[0.9]"
            >
              RFR IS <span className="italic text-[#B59A62] font-normal">MORE THAN</span><br />
              A RUNWAY.
            </motion.h2>
          </div>

          {/* Right: Editorial Paragraph */}
          <div className="w-full lg:w-[35%]">
            <motion.p
              custom={2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={lineVariants}
              className="text-body-editorial font-sans font-light tracking-wide text-[#8C8A85] uppercase mb-8"
            >
              It is a creative ecosystem connecting fashion, lifestyle, brands, creators & audiences in a unified cinematic experience.
            </motion.p>
            
            <motion.div
              custom={3}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={lineVariants}
              className="w-16 h-[1px] bg-[#B59A62]/50"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
