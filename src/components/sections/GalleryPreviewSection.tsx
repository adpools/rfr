import React, { useState } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { galleryData } from '../../data/galleryData';
import { LightboxModal } from '../common/LightboxModal';
import { GalleryItem } from '../../types';
import { Maximize2, ArrowUpRight } from 'lucide-react';

export const GalleryPreviewSection: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  return (
    <section
      id="chapter-archive"
      className="full-viewport-scene bg-[#050505] overflow-hidden flex flex-col justify-center"
    >
      <div className="editorial-container-wide relative z-10 w-full mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-metadata text-[#B59A62] block mb-4">
              FROM FASHION
            </span>
            <h2 className="text-section-title font-serif font-light text-[#F4F1EA] uppercase tracking-tight leading-none">
              THE ARCHIVE
            </h2>
          </div>
          <Link
            href="/gallery"
            className="inline-flex items-center gap-4 text-xs font-sans tracking-[0.25em] uppercase text-[#F4F1EA] hover:text-[#B59A62] transition-colors group"
          >
            <span>VIEW FULL ARCHIVE</span>
            <span className="w-8 h-[1px] bg-[#B59A62] group-hover:w-12 transition-all"></span>
          </Link>
        </div>
      </div>

      {/* Horizontal Scrolling Archive */}
      <div className="w-full relative pl-[5vw] lg:pl-[4rem] pr-[5vw] lg:pr-[4rem]">
        <div className="flex gap-8 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-8 pt-4">
          {galleryData.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, delay: idx * 0.1 }}
              onClick={() => setSelectedItem(item)}
              className="group relative flex-none w-[85vw] md:w-[45vw] lg:w-[35vw] h-[55vh] lg:h-[65vh] rounded-sm overflow-hidden cursor-pointer snap-center bg-[#080808]"
            >
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover grayscale opacity-80 group-hover:scale-105 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/90 via-[#050505]/20 to-transparent opacity-90 transition-opacity" />

              {/* Hover Interaction Content */}
              <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-metadata text-[#B59A62] border border-[#B59A62]/30 px-3 py-1 rounded-full">
                    {item.category}
                  </span>
                  <span className="text-[10px] text-[#8C8A85] font-mono">
                    {item.year}
                  </span>
                </div>

                <h3 className="text-2xl lg:text-3xl font-serif text-[#F4F1EA] uppercase tracking-wide leading-snug mb-4 group-hover:text-[#B59A62] transition-colors">
                  {item.title}
                </h3>
                
                <div className="w-0 h-[1px] bg-[#B59A62] group-hover:w-full transition-all duration-700 ease-out" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <LightboxModal
        item={selectedItem}
        items={galleryData}
        onClose={() => setSelectedItem(null)}
        onSelect={(item) => setSelectedItem(item)}
      />
    </section>
  );
};
