import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { founderData } from '../../data/founderData';
import { ArrowUpRight, Quote } from 'lucide-react';

export const FounderSection: React.FC = () => {
  return (
    <section
      id="chapter-founder"
      className="full-viewport-scene bg-[#050505] overflow-hidden flex flex-col justify-center"
    >
      <div className="editorial-container relative z-10 w-full h-full">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center justify-between">
          
          {/* Left: Large Portrait */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-[45%] h-[60vh] lg:h-[80vh] relative editorial-image-frame"
          >
            <img
              src={founderData.portraitImage}
              alt="Riyas — Founder of RFR"
              className="w-full h-full object-cover grayscale transition-transform duration-[2s] hover:scale-105"
            />
          </motion.div>

          {/* Right: Narrative */}
          <div className="w-full lg:w-[55%] flex flex-col justify-center">
            <span className="text-metadata text-[#B59A62] block mb-6">
              THE FOUNDER
            </span>
            
            <h2 className="text-section-title font-serif font-light text-[#F4F1EA] uppercase leading-[0.9] mb-8">
              {founderData.name}
            </h2>

            <div className="space-y-6 text-body-editorial font-sans font-light text-[#8C8A85] mb-12 max-w-xl">
              <p>{founderData.bioParagraphs[0]}</p>
              <p>{founderData.bioParagraphs[1]}</p>
            </div>

            <Link
              href="/founder"
              className="inline-flex items-center gap-4 text-xs font-sans tracking-[0.25em] uppercase text-[#F4F1EA] hover:text-[#B59A62] transition-colors group"
            >
              <span>READ DOSSIER</span>
              <span className="w-8 h-[1px] bg-[#B59A62] group-hover:w-12 transition-all"></span>
            </Link>
          </div>
          
        </div>
      </div>
    </section>
  );
};
