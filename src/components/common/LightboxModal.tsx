import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Tag, Play, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { GalleryItem } from '../../types';

interface LightboxModalProps {
  item: GalleryItem | null;
  items: GalleryItem[];
  onClose: () => void;
  onSelect: (item: GalleryItem) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  item,
  items,
  onClose,
  onSelect,
}) => {
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  useEffect(() => {
    setIsPlayingVideo(Boolean(item?.videoEmbedUrl));
  }, [item]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!item) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') {
        const idx = items.findIndex((i) => i.id === item.id);
        if (idx !== -1 && idx < items.length - 1) onSelect(items[idx + 1]);
      }
      if (e.key === 'ArrowLeft') {
        const idx = items.findIndex((i) => i.id === item.id);
        if (idx > 0) onSelect(items[idx - 1]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [item, items, onClose, onSelect]);

  if (!item) return null;

  const currentIndex = items.findIndex((i) => i.id === item.id);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-10 select-none"
        onClick={onClose}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Lightbox"
          className="absolute top-6 right-6 z-50 p-3 rounded-full bg-neutral-900/80 text-white border border-neutral-700 hover:border-[#C7A46A] hover:text-[#C7A46A] transition-all"
        >
          <X size={22} />
        </button>

        {/* Prev / Next Controls */}
        {currentIndex > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(items[currentIndex - 1]);
            }}
            aria-label="Previous Image"
            className="absolute left-6 z-50 p-3 rounded-full bg-neutral-900/80 text-white border border-neutral-700 hover:border-[#C7A46A] hover:text-[#C7A46A] transition-all hidden md:flex items-center justify-center"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {currentIndex < items.length - 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(items[currentIndex + 1]);
            }}
            aria-label="Next Image"
            className="absolute right-6 z-50 p-3 rounded-full bg-neutral-900/80 text-white border border-neutral-700 hover:border-[#C7A46A] hover:text-[#C7A46A] transition-all hidden md:flex items-center justify-center"
          >
            <ChevronRight size={24} />
          </button>
        )}

        {/* Lightbox Content Container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative max-w-6xl w-full max-h-[90vh] flex flex-col md:flex-row items-center justify-center gap-8 bg-neutral-950/80 rounded-3xl border border-neutral-800 p-4 md:p-6 overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Media Frame (Video Player or High-Res Image) */}
          <div className="w-full md:w-2/3 h-[50vh] md:h-[75vh] flex items-center justify-center overflow-hidden rounded-2xl bg-black relative border border-neutral-850">
            {isPlayingVideo && item.videoEmbedUrl ? (
              <iframe
                src={item.videoEmbedUrl}
                title={item.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={item.image}
                  alt={item.title}
                  className="max-w-full max-h-full object-contain rounded"
                />
                {item.videoEmbedUrl && (
                  <button
                    onClick={() => setIsPlayingVideo(true)}
                    className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-black/80 border border-[#C7A46A] flex items-center justify-center text-[#C7A46A] hover:bg-[#C7A46A] hover:text-black transition-all transform hover:scale-110 shadow-2xl"
                  >
                    <Play size={24} className="fill-current ml-1" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Metadata & Narrative */}
          <div className="w-full md:w-1/3 flex flex-col justify-between py-2 text-left">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] tracking-widest font-mono text-[#C7A46A] uppercase px-2.5 py-0.5 rounded bg-[#141414] border border-[#C7A46A]/30">
                  {item.category}
                </span>
                <span className="text-xs text-neutral-400 font-mono">
                  {item.year}
                </span>
                {item.videoEmbedUrl && (
                  <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-red-950/60 border border-red-800 text-red-300">
                    VIDEO REEL
                  </span>
                )}
              </div>

              <h3 className="text-2xl md:text-3xl font-serif text-[#FAF9F6] tracking-wide mb-3 leading-snug">
                {item.title}
              </h3>

              <p className="text-sm text-neutral-300 font-light leading-relaxed mb-6">
                {item.caption}
              </p>

              {item.credits && (
                <div className="text-xs text-neutral-500 mb-6">
                  <span className="text-[#C7A46A]/80 font-mono text-[10px] uppercase block mb-1">Archive Credits</span>
                  {item.credits}
                </div>
              )}

              {/* Action buttons if video is present */}
              {item.videoEmbedUrl && (
                <div className="flex flex-wrap gap-2 mb-6">
                  <button
                    onClick={() => setIsPlayingVideo(!isPlayingVideo)}
                    className="px-4 py-1.5 rounded-xl bg-[#C7A46A] text-black text-xs font-mono font-semibold uppercase tracking-wider hover:bg-white transition-colors flex items-center gap-1.5"
                  >
                    {isPlayingVideo ? <ImageIcon size={12} /> : <Play size={12} className="fill-current" />}
                    <span>{isPlayingVideo ? 'VIEW STILL COVER' : 'PLAY REEL'}</span>
                  </button>

                  {item.driveViewUrl && (
                    <a
                      href={item.driveViewUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-1.5 rounded-xl bg-[#161616] text-neutral-300 hover:text-white border border-neutral-800 hover:border-neutral-700 text-xs font-mono uppercase tracking-wider transition-colors flex items-center gap-1.5"
                    >
                      <span>OPEN DRIVE</span>
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-[11px] text-neutral-400 bg-neutral-900 px-3 py-1 rounded-lg border border-neutral-800"
                  >
                    <Tag size={10} className="text-[#C7A46A]" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-neutral-900 flex items-center justify-between text-xs text-neutral-500">
              <span>{currentIndex + 1} of {items.length}</span>
              <span className="text-[#C7A46A] text-[11px]">RFR ARCHIVE</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
