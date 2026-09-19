import React from 'react';
import { motion } from 'framer-motion';
import { timelineData } from '../../data/timelineData';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';

export const TimelinePreviewSection: React.FC = () => {

  return (
    <>
      {/* Intro Scene */}
      <section
        id="chapter-timeline-intro"
        className="full-viewport-scene bg-[#050505] flex flex-col justify-center items-center text-center relative border-b border-[#B59A62]/10"
      >
        <div className="editorial-container relative z-10 flex flex-col items-center justify-center text-center">
          <span className="text-metadata text-[#C7A46A] block mb-4">
            THE ARCHIVE
          </span>
          <h2 className="text-section-title font-serif font-light tracking-tight text-[#F4F1EA] uppercase relative z-20">
            THE JOURNEY
          </h2>
          <p className="mt-8 text-body-editorial text-[#8C8A85] max-w-2xl text-center font-light uppercase tracking-wide relative z-10">
            A chronological retrospective of our evolution from a singular runway to an international creative ecosystem.
          </p>
        </div>
      </section>

      {/* Year Chapters */}
      {timelineData.map((item, index) => {
        const isEven = index % 2 === 0;
        return (
          <section
            key={item.year}
            id={`chapter-year-${item.year}`}
            className="full-viewport-scene bg-[#080808] border-b border-[#B59A62]/5 overflow-hidden flex flex-col justify-center"
          >
            <div className="editorial-container-wide relative z-10 w-full">
              <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-20 items-center justify-between`}>
                
                {/* Year Typography & Narrative */}
                <div className="w-full lg:w-[40%] flex flex-col justify-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-20%" }}
                    transition={{ duration: 1 }}
                  >
                    <span className="text-year-monumental font-sculptural text-[#B59A62] opacity-80 block mb-2 leading-none">
                      {item.year}
                    </span>
                    <h3 className="text-3xl lg:text-5xl font-serif text-[#F4F1EA] uppercase tracking-wide mb-6">
                      {item.title}
                    </h3>
                    <p className="text-body-editorial font-sans font-light text-[#8C8A85] mb-8 max-w-md">
                      {item.description}
                    </p>
                    
                    <div className="space-y-3 pt-6 border-t border-[#B59A62]/20">
                      {item.milestones.map((milestone) => (
                        <div key={milestone} className="flex items-start gap-3 text-xs md:text-sm text-[#8C8A85] font-light uppercase tracking-wider">
                          <CheckCircle2 size={16} className="text-[#B59A62] shrink-0 mt-0.5" />
                          <span>{milestone}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Imagery */}
                <div className="w-full lg:w-[60%] h-[50vh] lg:h-[75vh]">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2 }}
                    className="w-full h-full editorial-image-frame rounded-sm"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover grayscale opacity-90 transition-all duration-[2s] hover:scale-105 hover:grayscale-0 hover:opacity-100"
                    />
                  </motion.div>
                </div>

              </div>
            </div>
          </section>
        );
      })}
    </>
  );
};
