import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Sparkles, Award } from 'lucide-react';
import { testimonialsData } from '../../data/testimonialsData';

export const TestimonialsSection: React.FC = () => {
  return (
    <section
      id="testimonials"
      aria-label="Testimonials"
      className="bg-[#050505] border-b border-neutral-900 relative overflow-hidden py-24 md:py-36"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#C7A46A]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="editorial-container relative z-10 w-full">
        {/* Section Header */}
        <div className="flex flex-col mb-14 md:mb-20">
          <div className="flex items-center gap-3 text-[10px] font-mono tracking-[0.35em] text-[#C7A46A] uppercase mb-3">
            <Sparkles size={14} className="text-[#C7A46A]" />
            <span>ENDORSEMENTS & COLLABORATIONS</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-800 pb-6 gap-4">
            <div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#F4F1EA] uppercase tracking-tight">
                TESTIMONIALS
              </h2>
              <p className="text-xs sm:text-sm font-light text-neutral-400 mt-2 max-w-xl">
                Reflections from esteemed collaborators, showstoppers, and industry professionals who have shared landmark stages and creative productions with RFR.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-[#C7A46A] px-3.5 py-1.5 rounded-full bg-[#111111] border border-neutral-800 shrink-0">
              <Award size={13} />
              <span>Verified Collaborator</span>
            </div>
          </div>
        </div>

        {/* Testimonials List */}
        <div className="space-y-16">
          {testimonialsData.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center bg-[#0c0c0c] border border-neutral-800/90 hover:border-[#C7A46A]/40 rounded-3xl p-6 sm:p-10 lg:p-14 shadow-2xl transition-all duration-500"
            >
              {/* Left Column: Photograph */}
              <div className="lg:col-span-5 w-full">
                <div className="relative aspect-[3/4] sm:aspect-[4/5] rounded-2xl overflow-hidden bg-[#141414] border border-[#C7A46A]/30 shadow-2xl group">
                  <img
                    src={item.image}
                    alt={`${item.name} — ${item.designation}`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-top filter contrast-[1.03] group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                  {/* Identification Overlay on Photo */}
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <span className="text-[10px] font-mono tracking-widest text-[#C7A46A] uppercase block mb-1">
                      FEATURED COLLABORATOR
                    </span>
                    <h4 className="text-xl sm:text-2xl font-serif leading-tight">
                      {item.name}
                    </h4>
                    <p className="text-xs font-mono text-neutral-300 mt-1">
                      {item.designation}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Prominent Name, Designation, and Full Testimonial */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                <div>
                  {/* Watermark Quote Icon */}
                  <div className="mb-4 text-[#C7A46A]/40">
                    <Quote size={42} strokeWidth={1.5} />
                  </div>

                  {/* Name and Designation */}
                  <h3 className="text-3xl sm:text-4xl font-serif text-white uppercase tracking-tight mb-2">
                    {item.name}
                  </h3>
                  <p className="text-xs sm:text-sm font-mono text-[#C7A46A] uppercase tracking-widest mb-6 font-semibold">
                    {item.designation}
                  </p>

                  {/* Preserved Testimonial Paragraphs */}
                  <div className="space-y-4 text-neutral-300 text-sm sm:text-base md:text-lg font-light leading-relaxed">
                    {item.quoteParagraphs.map((para, pIdx) => (
                      <p key={pIdx} className="text-neutral-300">
                        {para}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Highlight Badges */}
                {item.brandHighlights && item.brandHighlights.length > 0 && (
                  <div className="pt-6 border-t border-neutral-800/80 flex flex-wrap items-center gap-3">
                    {item.brandHighlights.map((badge, bIdx) => (
                      <span
                        key={bIdx}
                        className="px-3.5 py-1.5 rounded-full bg-[#141414] border border-neutral-800 text-[11px] font-mono text-neutral-300 tracking-wider"
                      >
                        ✦ {badge}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

