import React from 'react';
import { motion } from 'framer-motion';

export const EcosystemSection: React.FC = () => {
  return (
    <section
      id="chapter-ecosystem"
      className="full-viewport-scene bg-[#050505] overflow-hidden flex flex-col justify-center items-center relative"
    >
      {/* Background Subtle Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#111111] via-[#050505] to-[#050505] opacity-50"></div>

      <div className="editorial-container relative z-10 w-full text-center">
        <span className="text-metadata text-[#B59A62] block mb-12">
          THE INTERCONNECTED MATRIX
        </span>

        <div className="relative">
          {/* Floating Elements (Subtle Animation) */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-16 left-[10%] lg:left-[20%] text-xs font-mono tracking-widest text-[#8C8A85] uppercase"
          >
            Podcast
          </motion.div>
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-10 -right-[5%] lg:right-[15%] text-xs font-mono tracking-widest text-[#8C8A85] uppercase"
          >
            Flea
          </motion.div>
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-20 left-[5%] lg:left-[15%] text-xs font-mono tracking-widest text-[#8C8A85] uppercase"
          >
            Studio
          </motion.div>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute -bottom-12 right-[10%] lg:right-[25%] text-xs font-mono tracking-widest text-[#8C8A85] uppercase"
          >
            Campaigns
          </motion.div>
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            className="absolute -top-8 right-[20%] lg:right-[35%] text-xs font-mono tracking-widest text-[#8C8A85] uppercase"
          >
            Runway
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-section-title font-serif font-light text-[#F4F1EA] uppercase tracking-tight leading-[0.9] relative z-10"
          >
            THE RFR<br />
            <span className="italic text-[#B59A62]">ECOSYSTEM</span>
          </motion.h2>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-16 text-body-editorial font-sans font-light text-[#8C8A85] max-w-xl mx-auto uppercase tracking-wide"
        >
          A symbiotic network of creative disciplines operating across multiple mediums to redefine contemporary culture.
        </motion.p>
      </div>
    </section>
  );
};
