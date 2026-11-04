import React, { useState, useEffect } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Camera,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface RiyasImageItem {
  id: string;
  src: string;
  alt: string;
  orientation: 'landscape' | 'portrait';
}

const riyasImages: RiyasImageItem[] = [
  {
    id: 'riyas-01',
    src: '/images/riyas%20img%20gal/DSC00324.jpg',
    alt: 'Riyas editorial portraiture and runway showcase photograph',
    orientation: 'landscape',
  },
  {
    id: 'riyas-02',
    src: '/images/riyas%20img%20gal/IMG_7234.JPG.jpeg',
    alt: 'Riyas high-fashion lookbook portrait photograph',
    orientation: 'portrait',
  },
  {
    id: 'riyas-03',
    src: '/images/riyas%20img%20gal/FB_IMG_1763791773619.jpg',
    alt: 'Riyas lifestyle and fashion portrait photograph',
    orientation: 'landscape',
  },
  {
    id: 'riyas-04',
    src: '/images/riyas%20img%20gal/WhatsApp%20Image%202026-11-04%20at%2011.37.55%20PM.jpeg',
    alt: 'Riyas contemporary editorial portrait photograph',
    orientation: 'portrait',
  },
  {
    id: 'riyas-05',
    src: '/images/riyas%20img%20gal/WhatsApp%20Image%202026-11-04%20at%2011.37.56%20PM%20(1).jpeg',
    alt: 'Riyas signature styling and studio portrait photograph',
    orientation: 'portrait',
  },
  {
    id: 'riyas-06',
    src: '/images/riyas%20img%20gal/FB_IMG_1763791778722.jpg',
    alt: 'Riyas creative direction and event photograph',
    orientation: 'landscape',
  },
  {
    id: 'riyas-07',
    src: '/images/riyas%20img%20gal/WhatsApp%20Image%202026-11-04%20at%2011.37.56%20PM.jpeg',
    alt: 'Riyas fashion presentation and visual storytelling photograph',
    orientation: 'portrait',
  },
  {
    id: 'riyas-08',
    src: '/images/riyas%20img%20gal/WhatsApp%20Image%202026-11-04%20at%2011.37.57%20PM%20(1).jpeg',
    alt: 'Riyas cultural styling and lifestyle portrait photograph',
    orientation: 'portrait',
  },
  {
    id: 'riyas-09',
    src: '/images/riyas%20img%20gal/WhatsApp%20Image%202026-11-04%20at%2011.37.57%20PM.jpeg',
    alt: 'Riyas modern couture and expressive portrait photograph',
    orientation: 'portrait',
  },
];

export const RiyasGalleryPage: React.FC = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;
      if (e.key === 'Escape') {
        setSelectedImageIndex(null);
      } else if (e.key === 'ArrowRight') {
        setSelectedImageIndex((prev) => (prev !== null ? (prev + 1) % riyasImages.length : null));
      } else if (e.key === 'ArrowLeft') {
        setSelectedImageIndex((prev) =>
          prev !== null ? (prev - 1 + riyasImages.length) % riyasImages.length : null
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex]);

  const activeImage = selectedImageIndex !== null ? riyasImages[selectedImageIndex] : null;

  return (
    <PageWrapper
      title="Riyas — Photography Gallery | Riyas Fashion Runway"
      description="Exclusive photography gallery and curated portrait archive of Riyas."
    >
      <div className="editorial-container py-12 md:py-20">
        
        {/* Header Section */}
        <div className="max-w-4xl mb-12 md:mb-16">
          <div className="flex items-center gap-3 text-xs font-mono tracking-[0.35em] text-[#C7A46A] uppercase mb-4">
            <Camera size={14} className="text-[#C7A46A]" />
            <span>PHOTOGRAPHY ARCHIVE • PORTRAITURE</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-light text-white uppercase tracking-tight leading-[0.98] mb-6">
            RIYAS <br />
            <span className="italic text-[#C7A46A] font-normal">PHOTO GALLERY.</span>
          </h1>

          <p className="text-neutral-300 text-sm md:text-base font-light leading-relaxed max-w-2xl">
            A dedicated photography exhibition capturing bespoke editorial portraiture, runway aesthetics, and personal archival moments.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-400">
            <span className="px-3.5 py-1.5 rounded-full bg-[#141414] border border-neutral-800 text-[#C7A46A]">
              ✦ {riyasImages.length} Curated Photographs
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-[#141414] border border-neutral-800 text-neutral-300">
              ✦ Original Master Quality
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-[#141414] border border-neutral-800 text-[#FAF9F6]">
              ✦ Interactive Lightbox View
            </span>
          </div>
        </div>

        {/* Spacious Masonry Photography Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 sm:gap-8 space-y-6 sm:space-y-8">
          {riyasImages.map((img, idx) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              onClick={() => setSelectedImageIndex(idx)}
              className="break-inside-avoid group relative rounded-2xl overflow-hidden bg-[#0d0d0d] border border-neutral-800/80 hover:border-[#C7A46A]/60 transition-all duration-500 shadow-xl cursor-pointer"
            >
              <div className="relative overflow-hidden w-full bg-[#141414]">
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto block object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                />

                {/* Subtle Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
                  <div className="flex justify-end">
                    <span className="w-10 h-10 rounded-full bg-black/60 border border-neutral-700 backdrop-blur-md flex items-center justify-center text-[#C7A46A] group-hover:scale-110 transition-transform">
                      <Maximize2 size={16} />
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono text-neutral-300">
                    <span className="text-[#C7A46A] font-bold tracking-widest">
                      {String(idx + 1).padStart(2, '0')} / {String(riyasImages.length).padStart(2, '0')}
                    </span>
                    <span className="uppercase tracking-wider text-[11px] text-white/80">
                      EXPAND PHOTO
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Fullscreen High-Resolution Lightbox Modal */}
      <AnimatePresence>
        {activeImage && selectedImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-8 select-none"
            onClick={() => setSelectedImageIndex(null)}
          >
            {/* Top Bar Controls */}
            <div
              className="flex items-center justify-between w-full max-w-7xl mx-auto pb-4 border-b border-neutral-800/80"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-[#181818] border border-neutral-700 text-[#C7A46A] font-mono text-xs font-bold tracking-widest">
                  {String(selectedImageIndex + 1).padStart(2, '0')} / {String(riyasImages.length).padStart(2, '0')}
                </span>
                <span className="text-xs font-mono text-neutral-400 tracking-wider uppercase hidden sm:inline">
                  RIYAS PHOTOGRAPHY ARCHIVE
                </span>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={activeImage.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-700 hover:border-[#C7A46A] text-neutral-300 hover:text-[#C7A46A] text-xs font-mono transition-colors flex items-center gap-1.5"
                  title="Open Original Image"
                >
                  <span className="hidden sm:inline">ORIGINAL</span>
                  <ExternalLink size={13} />
                </a>

                <button
                  onClick={() => setSelectedImageIndex(null)}
                  aria-label="Close Lightbox"
                  className="p-2.5 rounded-full bg-neutral-900 border border-neutral-700 hover:border-[#C7A46A] text-white hover:text-[#C7A46A] transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Central Stage: Image & Prev / Next Arrows */}
            <div
              className="relative flex-1 flex items-center justify-center my-4 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Prev Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex((prev) =>
                    prev !== null ? (prev - 1 + riyasImages.length) % riyasImages.length : null
                  );
                }}
                aria-label="Previous photograph"
                className="absolute left-2 sm:left-6 z-20 p-3 sm:p-4 rounded-full bg-neutral-900/80 border border-neutral-700 hover:border-[#C7A46A] text-white hover:text-[#C7A46A] transition-all hover:scale-110 shadow-2xl backdrop-blur-md"
              >
                <ChevronLeft size={22} />
              </button>

              {/* Active Image */}
              <motion.div
                key={activeImage.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25 }}
                className="max-h-[82vh] max-w-[90vw] flex items-center justify-center p-2"
              >
                <img
                  src={activeImage.src}
                  alt={activeImage.alt}
                  className="max-h-[80vh] max-w-[88vw] object-contain rounded-xl shadow-2xl border border-neutral-800"
                />
              </motion.div>

              {/* Next Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex((prev) =>
                    prev !== null ? (prev + 1) % riyasImages.length : null
                  );
                }}
                aria-label="Next photograph"
                className="absolute right-2 sm:right-6 z-20 p-3 sm:p-4 rounded-full bg-neutral-900/80 border border-neutral-700 hover:border-[#C7A46A] text-white hover:text-[#C7A46A] transition-all hover:scale-110 shadow-2xl backdrop-blur-md"
              >
                <ChevronRight size={22} />
              </button>
            </div>

            {/* Bottom Thumbnail Strip */}
            <div
              className="w-full max-w-4xl mx-auto overflow-x-auto py-2 flex items-center justify-center gap-2 sm:gap-3"
              onClick={(e) => e.stopPropagation()}
            >
              {riyasImages.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImageIndex(i)}
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden border transition-all shrink-0 ${
                    i === selectedImageIndex
                      ? 'border-[#C7A46A] ring-2 ring-[#C7A46A]/40 scale-105'
                      : 'border-neutral-800 opacity-50 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img.src}
                    alt={`Thumbnail ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
};

