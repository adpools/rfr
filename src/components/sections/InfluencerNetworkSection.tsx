import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Maximize2, X, ChevronLeft, ChevronRight, Users } from 'lucide-react';

interface InfluencerItem {
  id: string;
  name: string;
  image: string;
  altImage?: string;
  driveFileId?: string;
}

export const influencerRoster: InfluencerItem[] = [
  {
    id: 'deepamol',
    name: 'Deepamol',
    image: '/images/influencers/deepamol.jpg',
    altImage: '/images/influencers/deepamol-2.jpg',
    driveFileId: '1jVIvlaE77dXPCRNxp-v5vYU5H44lTPFY'
  },
  {
    id: 'malavika',
    name: 'Malavika',
    image: '/images/influencers/malavika.jpg',
    altImage: '/images/influencers/malavika-2.jpg',
    driveFileId: '1ZfwonJkpih7WwBd0AhPJsaYPp8e0Ttqa'
  },
  {
    id: 'rhea-george',
    name: 'Rhea George',
    image: '/images/influencers/rhea-george.jpg',
    altImage: '/images/influencers/rhea-george-2.jpg',
    driveFileId: '1Y14DeHyJjDVdOoU8t2Di2uFXuNacx6wt'
  },
  {
    id: 'rudiya',
    name: 'Rudiya',
    image: '/images/influencers/rudiya.jpg',
    altImage: '/images/influencers/rudiya-2.jpg',
    driveFileId: '1xekNvkJ96o771oCraXYydSeOTC0FFisA'
  },
  {
    id: 'sahalini-sharma',
    name: 'Sahalini Sharma',
    image: '/images/influencers/sahalini-sharma.jpg',
    altImage: '/images/influencers/sahalini-sharma-2.jpg',
    driveFileId: '1TlY1Nrf6kVIOxo2rBb6v_n9a0K5-dTE_'
  },
  {
    id: 'shikha-santhosh',
    name: 'Shikha Santhosh',
    image: '/images/influencers/shikha-santhosh.jpg',
    driveFileId: '1vRC76L6RCD-u8dbBnTfg6JmR92xMzTxy'
  },
  {
    id: 'thara-anitha-mathew',
    name: 'Thara Anitha Mathew',
    image: '/images/influencers/thara-anitha-mathew.jpg',
    driveFileId: '1dcVocQiTgQJoE1Q1IBgalmUgZpmb1nz2'
  }
];

export const InfluencerNetworkSection: React.FC = () => {
  const [activeModalIndex, setActiveModalIndex] = useState<number | null>(null);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeModalIndex === null) return;
      if (e.key === 'Escape') {
        setActiveModalIndex(null);
      } else if (e.key === 'ArrowRight') {
        setActiveModalIndex((prev) => (prev !== null ? (prev + 1) % influencerRoster.length : null));
      } else if (e.key === 'ArrowLeft') {
        setActiveModalIndex((prev) =>
          prev !== null ? (prev - 1 + influencerRoster.length) % influencerRoster.length : null
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModalIndex]);

  const activeInfluencer = activeModalIndex !== null ? influencerRoster[activeModalIndex] : null;

  return (
    <section
      id="influencer-network"
      aria-label="Influencer Network"
      className="bg-[#070707] border-b border-neutral-900 relative overflow-hidden py-24 md:py-36"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#C7A46A]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="editorial-container relative z-10 w-full">
        {/* Section Header */}
        <div className="flex flex-col mb-16 md:mb-20">
          <div className="flex items-center gap-3 text-[10px] font-mono tracking-[0.35em] text-[#C7A46A] uppercase mb-3">
            <Users size={14} className="text-[#C7A46A]" />
            <span>TALENT ROSTER • CREATOR COLLECTIVE</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-800 pb-6 gap-4">
            <div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#F4F1EA] uppercase tracking-tight">
                INFLUENCER NETWORK
              </h2>
              <p className="text-xs sm:text-sm font-light text-neutral-400 mt-2 max-w-xl">
                A premier roster of regional lifestyle creators, fashion ambassadors, and digital storytellers partnering with marquee enterprise campaigns.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-[#C7A46A] px-3.5 py-1.5 rounded-full bg-[#111111] border border-neutral-800 shrink-0">
              <Sparkles size={13} />
              <span>{influencerRoster.length} Verified Creators</span>
            </div>
          </div>
        </div>

        {/* Influencer Grid: Multiple balanced columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
          {influencerRoster.map((person, idx) => (
            <motion.div
              key={person.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.06 }}
              onClick={() => setActiveModalIndex(idx)}
              className="group flex flex-col cursor-pointer"
            >
              {/* Photograph Card */}
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#111111] border border-neutral-800/80 group-hover:border-[#C7A46A]/60 transition-all duration-500 shadow-xl">
                <img
                  src={person.image}
                  alt={`${person.name} — Influencer photograph`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Subtle Hover Gradient & Zoom Indicator */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-4">
                  <span className="w-9 h-9 rounded-full bg-black/60 border border-neutral-700 backdrop-blur-md flex items-center justify-center text-[#C7A46A] group-hover:scale-110 transition-transform shadow-lg">
                    <Maximize2 size={15} />
                  </span>
                </div>
              </div>

              {/* Influencer Name: Displayed clearly below photograph */}
              <div className="mt-3.5 px-1">
                <h3 className="font-serif text-base sm:text-lg text-white uppercase tracking-wide group-hover:text-[#C7A46A] transition-colors leading-snug">
                  {person.name}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeInfluencer && activeModalIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-8 select-none"
            onClick={() => setActiveModalIndex(null)}
          >
            {/* Top Bar */}
            <div
              className="flex items-center justify-between w-full max-w-5xl mx-auto pb-4 border-b border-neutral-800/80"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-[#181818] border border-neutral-700 text-[#C7A46A] font-mono text-xs font-bold tracking-widest">
                  {String(activeModalIndex + 1).padStart(2, '0')} / {String(influencerRoster.length).padStart(2, '0')}
                </span>
                <span className="text-sm font-serif text-white uppercase tracking-wider">
                  {activeInfluencer.name}
                </span>
              </div>

              <button
                onClick={() => setActiveModalIndex(null)}
                aria-label="Close Lightbox"
                className="p-2.5 rounded-full bg-neutral-900 border border-neutral-700 hover:border-[#C7A46A] text-white hover:text-[#C7A46A] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Central Stage */}
            <div
              className="relative flex-1 flex items-center justify-center my-4 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Prev Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveModalIndex((prev) =>
                    prev !== null ? (prev - 1 + influencerRoster.length) % influencerRoster.length : null
                  );
                }}
                aria-label="Previous influencer"
                className="absolute left-2 sm:left-6 z-20 p-3 sm:p-4 rounded-full bg-neutral-900/80 border border-neutral-700 hover:border-[#C7A46A] text-white hover:text-[#C7A46A] transition-all hover:scale-110 shadow-2xl backdrop-blur-md"
              >
                <ChevronLeft size={22} />
              </button>

              {/* Active Image */}
              <motion.div
                key={activeInfluencer.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25 }}
                className="max-h-[78vh] max-w-[85vw] flex flex-col items-center justify-center p-2"
              >
                <img
                  src={activeInfluencer.image}
                  alt={`${activeInfluencer.name} photograph`}
                  className="max-h-[72vh] max-w-[80vw] object-contain rounded-xl shadow-2xl border border-neutral-800"
                />
                <h4 className="font-serif text-xl sm:text-2xl text-white uppercase tracking-wider mt-4">
                  {activeInfluencer.name}
                </h4>
              </motion.div>

              {/* Next Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveModalIndex((prev) =>
                    prev !== null ? (prev + 1) % influencerRoster.length : null
                  );
                }}
                aria-label="Next influencer"
                className="absolute right-2 sm:right-6 z-20 p-3 sm:p-4 rounded-full bg-neutral-900/80 border border-neutral-700 hover:border-[#C7A46A] text-white hover:text-[#C7A46A] transition-all hover:scale-110 shadow-2xl backdrop-blur-md"
              >
                <ChevronRight size={22} />
              </button>
            </div>

            {/* Bottom Thumbnail Strip */}
            <div
              className="w-full max-w-3xl mx-auto overflow-x-auto py-2 flex items-center justify-center gap-2 sm:gap-3"
              onClick={(e) => e.stopPropagation()}
            >
              {influencerRoster.map((person, i) => (
                <button
                  key={person.id}
                  onClick={() => setActiveModalIndex(i)}
                  className={`w-12 h-14 rounded-lg overflow-hidden border transition-all shrink-0 ${
                    i === activeModalIndex
                      ? 'border-[#C7A46A] ring-2 ring-[#C7A46A]/40 scale-105'
                      : 'border-neutral-800 opacity-50 hover:opacity-100'
                  }`}
                >
                  <img
                    src={person.image}
                    alt={person.name}
                    className="w-full h-full object-cover object-top"
                  />
                </button>
              ))}
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

