import React from 'react';
import { motion } from 'framer-motion';

export const WhatIsRFRSection: React.FC = () => {

  return (
    <section
      id="chapter-runway"
      className="full-viewport-scene bg-[#050505] overflow-hidden flex flex-col justify-center"
    >
      <div className="editorial-container-wide relative z-10 w-full h-full flex flex-col lg:flex-row gap-12 lg:gap-0 items-center justify-between">
        
        {/* Left: 30% Text */}
        <div className="w-full lg:w-[35%] flex flex-col justify-center order-2 lg:order-1 pr-0 lg:pr-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <span className="text-metadata text-[#B59A62] block mb-6">
              THE RUNWAY • 2020—PRESENT
            </span>
            <h2 className="text-section-title font-serif font-light text-[#F4F1EA] uppercase leading-[0.9] mb-8">
              RIYAS<br />
              FASHION<br />
              RUNWAY
            </h2>
            <p className="text-body-editorial font-sans font-light text-[#8C8A85] mb-10 max-w-sm uppercase tracking-wide">
              Where couture discipline meets cultural relevance. The physical manifestation of the RFR ecosystem.
            </p>
            
            <a
              href="/gallery"
              className="inline-flex items-center gap-4 text-xs font-sans tracking-[0.25em] uppercase text-[#F4F1EA] hover:text-[#B59A62] transition-colors group"
            >
              <span>VIEW THE ARCHIVE</span>
              <span className="w-8 h-[1px] bg-[#B59A62] group-hover:w-12 transition-all"></span>
            </a>
          </motion.div>
        </div>

        {/* Right: 70% Image/Video Frame */}
        <div className="w-full lg:w-[65%] h-[60vh] lg:h-[85vh] order-1 lg:order-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="w-full h-full editorial-image-frame rounded-sm"
          >
            <img
              src="https://images.unsplash.com/photo-1492633423870-43d1cd2a4c2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
              alt="Riyas Fashion Runway"
              className="w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-1000"
            />
          </motion.div>
        </div>
        
      </div>
    </section>
  );
};
