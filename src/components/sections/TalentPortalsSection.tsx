import React, { useState } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { talentData } from '../../data/talentData';
import { ArrowUpRight } from 'lucide-react';

export const TalentPortalsSection: React.FC = () => {
  const [hoveredPortal, setHoveredPortal] = useState<string>('models');

  return (
    <section
      id="chapter-11"
      className="full-viewport-scene bg-[#0a0a0a] border-b border-neutral-900 flex flex-col justify-between relative overflow-hidden"
    >
      <div className="editorial-container relative z-10 my-auto py-10 w-full">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-neutral-800/80">
          <div>
            <div className="flex items-center gap-3 text-xs font-mono tracking-[0.35em] text-[#C7A46A] uppercase mb-2">
              <span>11</span>
              <span className="w-8 h-[1px] bg-[#C7A46A]" />
              <span>THE TALENT ECOSYSTEM</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif text-white uppercase tracking-tight">
              THE RFR NETWORK
            </h2>
          </div>

          <Link
            href="/assets"
            data-cursor="NETWORK"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-xs font-sans tracking-[0.2em] uppercase text-[#C7A46A] hover:text-white transition-colors group"
          >
            <span>EXPLORE ALL 4 PORTALS</span>
            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* 4 Full-Height Expanding Horizontal Panels */}
        <div className="flex flex-col lg:flex-row gap-4 h-[500px] sm:h-[550px] w-full">
          {talentData.map((portal, idx) => {
            const isHovered = hoveredPortal === portal.id;
            return (
              <motion.div
                key={portal.id}
                onMouseEnter={() => setHoveredPortal(portal.id)}
                className={`relative rounded-3xl overflow-hidden border transition-all duration-700 flex flex-col justify-end p-6 md:p-8 cursor-pointer ${
                  isHovered
                    ? 'lg:flex-[2.4] border-[#C7A46A] shadow-2xl shadow-[#C7A46A]/10'
                    : 'lg:flex-[1] border-neutral-800/80 hover:border-neutral-700'
                }`}
              >
                {/* Background Full-Bleed Image */}
                <img
                  src={portal.image}
                  alt={portal.title}
                  className="absolute inset-0 w-full h-full object-cover grayscale brightness-50 transition-transform duration-1000 scale-100 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/60 to-transparent" />

                <div className="relative z-10">
                  <span className="text-[10px] font-mono tracking-widest text-[#C7A46A] uppercase block mb-2">
                    PORTAL 0{idx + 1}
                  </span>

                  <h3 className="text-2xl sm:text-3xl font-serif text-white uppercase tracking-wide mb-2 leading-tight">
                    {portal.title}
                  </h3>

                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-xs text-[#C7A46A] font-mono tracking-wider uppercase mb-3">
                        {portal.tagline}
                      </p>
                      <p className="text-xs md:text-sm text-neutral-300 font-light leading-relaxed mb-6 line-clamp-3">
                        {portal.description}
                      </p>
                    </motion.div>
                  )}

                  <Link
                    href={`/assets/${portal.id}`}
                    data-cursor="APPLY"
                    className="btn-luxury btn-luxury-gold rounded-full text-xs inline-flex items-center gap-2"
                  >
                    <span>{portal.ctaLabel}</span>
                    <ArrowUpRight size={13} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Level 05: Directional Cue */}
      <div className="scene-directional-cue">
        <span>11 / 17 • SCROLL TO ARCHIVE ↓</span>
      </div>
    </section>
  );
};
