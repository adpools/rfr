import React, { useState } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { galleryData } from '../../data/galleryData';
import { GalleryItem } from '../../types';
import { LightboxModal } from '../common/LightboxModal';
import { ArrowUpRight, Maximize2 } from 'lucide-react';

export const GalleryPreviewSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'events' | 'shows' | 'shoots'>('all');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const filteredItems = activeCategory === 'all'
    ? galleryData.slice(0, 4)
    : galleryData.filter((item) => item.category === activeCategory).slice(0, 4);

  return (
    <section
      id="chapter-12"
      className="full-viewport-scene bg-[#080808] border-b border-neutral-900 flex flex-col justify-between relative overflow-hidden"
    >
      <div className="editorial-container relative z-10 my-auto py-10 w-full">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-neutral-800/80">
          <div>
            <div className="flex items-center gap-3 text-xs font-mono tracking-[0.35em] text-[#C7A46A] uppercase mb-2">
              <span>12</span>
              <span className="w-8 h-[1px] bg-[#C7A46A]" />
              <span>VISUAL REPERTOIRE</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif text-white uppercase tracking-tight">
              THE ARCHIVE
            </h2>
          </div>

          <div className="flex items-center gap-4 mt-4 md:mt-0">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto">
              {(['all', 'events', 'shows', 'shoots'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-widest transition-all ${
                    activeCategory === cat
                      ? 'bg-[#C7A46A] text-black font-semibold shadow-md shadow-[#C7A46A]/20'
                      : 'bg-[#141414] text-neutral-400 hover:text-white border border-neutral-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <Link
              href="/gallery"
              data-cursor="GALLERY"
              className="inline-flex items-center gap-1.5 text-xs font-sans tracking-[0.2em] uppercase text-[#C7A46A] hover:text-white transition-colors group whitespace-nowrap pl-2"
            >
              <span>FULL VAULT</span>
              <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Asymmetric 4-Card Editorial Composition */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 h-[440px] sm:h-[480px]">
          {filteredItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              onClick={() => setSelectedItem(item)}
              data-cursor="OPEN"
              className="group relative rounded-3xl overflow-hidden cursor-pointer bg-[#121212] border border-neutral-800 hover:border-[#C7A46A]/60 transition-all duration-500 flex flex-col justify-end p-6"
            >
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 grayscale hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              <div className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 backdrop-blur-md text-white/70 group-hover:text-[#C7A46A] opacity-0 group-hover:opacity-100 transition-all duration-300">
                <Maximize2 size={15} />
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[9px] font-mono tracking-widest text-[#C7A46A] uppercase px-2 py-0.5 rounded border border-[#C7A46A]/30">
                    {item.category}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    {item.year}
                  </span>
                </div>

                <h3 className="text-xl font-serif text-white uppercase tracking-wide group-hover:text-[#C7A46A] transition-colors leading-snug">
                  {item.title}
                </h3>
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

      {/* Level 05: Directional Cue */}
      <div className="scene-directional-cue">
        <span>12 / 17 • SCROLL TO PRESS ↓</span>
      </div>
    </section>
  );
};
