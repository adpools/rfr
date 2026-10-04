import React, { useState } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
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
      className="full-viewport-scene bg-[#050505] border-b border-neutral-900 flex flex-col justify-center relative overflow-hidden py-16 md:py-24"
    >
      <div className="editorial-container-wide relative z-10 w-full mb-8">
        {/* Header */}
        <div className="flex flex-col justify-start mb-6">
          <div className="flex items-center gap-3 text-[10px] font-mono tracking-[0.35em] text-[#C7A46A] uppercase mb-2">
            <span>11</span>
            <span className="w-12 h-[1px] bg-[#C7A46A]" />
            <span>VISUAL CURATIONS</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-800 pb-4 gap-4">
            <div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#F4F1EA] uppercase tracking-tight">
                GALLARY
              </h2>
              <p className="text-xs sm:text-sm font-light text-neutral-400 mt-2 max-w-xl">
                Curated visual archives spanning landmark events, couture runway shows, and commercial editorial shoots.
              </p>
            </div>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 text-xs font-mono text-[#C7A46A] hover:text-white uppercase tracking-wider transition-colors"
            >
              <span>VIEW FULL GALLERY ARCHIVE</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

        {/* 3 Categories (a. Events, b. Shows, c. Shoots) */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-1.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#C7A46A] text-black font-semibold'
                : 'bg-[#111111] text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            All Archives
          </button>
          <button
            onClick={() => setSelectedCategory('events')}
            className={`px-4 py-1.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all ${
              selectedCategory === 'events'
                ? 'bg-[#C7A46A] text-black font-semibold'
                : 'bg-[#111111] text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            a. Events
          </button>
          <button
            onClick={() => setSelectedCategory('shows')}
            className={`px-4 py-1.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all ${
              selectedCategory === 'shows'
                ? 'bg-[#C7A46A] text-black font-semibold'
                : 'bg-[#111111] text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            b. Shows
          </button>
          <button
            onClick={() => setSelectedCategory('shoots')}
            className={`px-4 py-1.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all ${
              selectedCategory === 'shoots'
                ? 'bg-[#C7A46A] text-black font-semibold'
                : 'bg-[#111111] text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            c. Shoots
          </button>
        </div>
      </div>

      {/* Horizontal Scrolling Archive */}
      <div className="w-full relative pl-[5vw] lg:pl-[4rem] pr-[5vw] lg:pr-[4rem]">
        <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-6">
          {filteredItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              onClick={() => setSelectedItem(item)}
              className="group relative flex-none w-[80vw] md:w-[40vw] lg:w-[30vw] h-[50vh] lg:h-[58vh] rounded-2xl overflow-hidden cursor-pointer snap-center bg-[#0d0d0d] border border-neutral-850 hover:border-[#C7A46A]/50 transition-all"
            >
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover grayscale opacity-80 group-hover:scale-105 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/95 via-[#050505]/20 to-transparent opacity-90 transition-opacity" />

              {/* Card Footer */}
              <div className="absolute bottom-0 left-0 w-full p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-[#C7A46A] uppercase tracking-widest border border-[#C7A46A]/30 px-3 py-1 rounded-full bg-[#111111]/80">
                    {item.category}
                  </span>
                  <span className="text-xs text-neutral-400 font-mono">
                    {item.year}
                  </span>
                </div>

                <h3 className="text-xl font-serif text-[#F4F1EA] uppercase tracking-wide leading-snug group-hover:text-[#C7A46A] transition-colors">
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
    </section>
  );
};
