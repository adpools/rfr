import React, { useState } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { galleryData } from '../../data/galleryData';
import { LightboxModal } from '../common/LightboxModal';
import { GalleryItem } from '../../types';
import { ArrowUpRight } from 'lucide-react';

export const GalleryPreviewSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'events' | 'shows' | 'shoots'>('all');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const filteredItems = selectedCategory === 'all'
    ? galleryData
    : galleryData.filter((i) => i.category === selectedCategory);

  return (
    <section
      id="chapter-11"
      className="full-viewport-scene bg-[#050505] border-b border-neutral-900 flex flex-col justify-center relative overflow-hidden py-24 md:py-32"
    >
      {/* Background Glowing Orb Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#C7A46A]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="editorial-container relative z-10 w-full my-auto max-w-7xl mx-auto mb-10">
        
        {/* Section Header - Editorial Redesign */}
        <div className="flex flex-col justify-start mb-14">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-[11px] sm:text-xs font-serif font-bold text-[#C7A46A]">11</span>
            <div className="w-16 sm:w-24 h-[1px] bg-[#C7A46A]/50" />
            <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.4em] text-[#C7A46A] uppercase">
              VISUAL CURATIONS
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-900 pb-8 gap-8">
            <div className="max-w-3xl">
              <h2 className="text-6xl sm:text-7xl lg:text-[110px] font-serif text-[#F4F1EA] uppercase tracking-tighter leading-[0.85] mb-6 drop-shadow-2xl">
                GALLERY
              </h2>
              <p className="text-sm sm:text-[15px] font-serif font-light text-[#A09D96] leading-relaxed max-w-lg tracking-wide">
                Curated visual archives spanning landmark events, couture runway shows, and commercial editorial shoots.
              </p>
            </div>
            <Link
              href="/gallery"
              className="group flex items-center gap-4 px-7 py-3.5 rounded-full border border-neutral-800 hover:border-[#C7A46A]/60 bg-[#0a0a0a] hover:bg-[#C7A46A]/10 transition-all duration-300"
            >
              <span className="text-[10px] font-mono text-[#E0DDD5] group-hover:text-[#C7A46A] uppercase tracking-[0.2em] transition-colors">
                VIEW FULL ARCHIVE
              </span>
              <div className="w-7 h-7 rounded-full bg-[#111111] group-hover:bg-[#C7A46A] flex items-center justify-center transition-colors">
                <ArrowUpRight size={14} className="text-[#A09D96] group-hover:text-black transition-colors" />
              </div>
            </Link>
          </div>
        </div>

        {/* 4 Category Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {[
            { id: 'all', label: 'All Archives' },
            { id: 'events', label: 'Events' },
            { id: 'shows', label: 'Shows' },
            { id: 'shoots', label: 'Shoots' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-6 py-3 rounded-full font-mono text-[10px] uppercase tracking-[0.2em] transition-all duration-300 border ${
                selectedCategory === cat.id
                  ? 'bg-[#C7A46A] text-black border-[#C7A46A] font-bold shadow-[0_0_15px_rgba(199,164,106,0.3)]'
                  : 'bg-[#0a0a0a]/80 backdrop-blur-md text-[#A09D96] border-neutral-800 hover:border-[#C7A46A]/50 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Horizontal Scrolling Archive */}
      <div className="w-full relative px-[5vw] lg:px-[max(5vw,calc((100vw-80rem)/2))] z-10">
        <AnimatePresence mode="popLayout">
          <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-8 pt-4">
            {filteredItems.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                onClick={() => setSelectedItem(item)}
                className="group relative flex-none w-[85vw] sm:w-[50vw] md:w-[40vw] lg:w-[35vw] xl:w-[28vw] h-[55vh] lg:h-[65vh] rounded-[24px] overflow-hidden cursor-pointer snap-center bg-[#0a0a0a] border border-neutral-900 hover:border-[#C7A46A]/50 transition-all duration-500 shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#C7A46A]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover grayscale opacity-80 group-hover:scale-105 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent opacity-90 transition-opacity z-10" />

                {/* Card Footer */}
                <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 z-20">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[9px] font-mono text-[#C7A46A] uppercase tracking-[0.2em] border border-[#C7A46A]/30 px-3 py-1.5 rounded-full bg-[#111111]/80 backdrop-blur-sm">
                      {item.category}
                    </span>
                    <span className="text-[10px] text-[#A09D96] font-mono tracking-widest">
                      {item.year}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-serif text-[#F4F1EA] uppercase tracking-wide leading-tight group-hover:text-white transition-colors">
                    {item.title}
                  </h3>
                  
                  {/* Hover explore button hint */}
                  <div className="mt-4 overflow-hidden h-0 group-hover:h-8 transition-all duration-500 opacity-0 group-hover:opacity-100 flex items-center gap-2 text-[10px] font-mono text-[#C7A46A] uppercase tracking-[0.2em]">
                    <span>EXPAND VIEW</span>
                    <ArrowUpRight size={14} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
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
