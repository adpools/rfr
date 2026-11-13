import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ChevronLeft, ChevronRight, Tag, Play, Image as ImageIcon, 
  ExternalLink, ZoomIn, ZoomOut, RotateCcw, Maximize, Minimize 
} from 'lucide-react';
import { GalleryItem } from '../../types';

interface LightboxModalProps {
  item: GalleryItem | null;
  items: GalleryItem[];
  onClose: () => void;
  onSelect: (item: GalleryItem) => void;
}

const ZOOM_STEPS = [0.75, 1, 1.25, 1.5, 2, 2.5, 3];

export const LightboxModal: React.FC<LightboxModalProps> = ({
  item,
  items,
  onClose,
  onSelect,
}) => {
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [zoomIndex, setZoomIndex] = useState(1); // 1x
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  const currentZoom = ZOOM_STEPS[zoomIndex] || 1;

  const resetZoom = useCallback(() => {
    setZoomIndex(1); // 1x
    setPan({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    setIsPlayingVideo(Boolean(item?.videoEmbedUrl));
    resetZoom();
  }, [item, resetZoom]);

  // Lock body scroll
  useEffect(() => {
    if (!item) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [item]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (frameRef.current?.requestFullscreen) {
          await frameRef.current.requestFullscreen();
        } else if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch {
      // safe fallback
    }
  };

  const handleZoomIn = () => {
    setZoomIndex((prev) => Math.min(prev + 1, ZOOM_STEPS.length - 1));
  };

  const handleZoomOut = () => {
    setZoomIndex((prev) => Math.max(prev - 1, 0));
  };

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
      if (!isPlayingVideo) {
        if (e.key === '+' || e.key === '=') {
          e.preventDefault();
          handleZoomIn();
        } else if (e.key === '-' || e.key === '_') {
          e.preventDefault();
          handleZoomOut();
        } else if (e.key === '0') {
          e.preventDefault();
          resetZoom();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [item, items, onClose, onSelect, isPlayingVideo, resetZoom]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (currentZoom <= 1 || isPlayingVideo) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || currentZoom <= 1) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (!item) return null;

  const currentIndex = items.findIndex((i) => i.id === item.id);

  return (
    <AnimatePresence>
      <motion.div
        ref={frameRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 md:p-10 select-none overflow-hidden"
        onClick={onClose}
      >
        {/* Top Floating Controls */}
        <div 
          className="absolute top-4 sm:top-6 right-4 sm:right-6 z-50 flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            className="p-2.5 sm:p-3 rounded-full bg-neutral-900/80 text-white border border-neutral-700 hover:border-[#C7A46A] hover:text-[#C7A46A] transition-all"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
          </button>

          <button
            onClick={onClose}
            aria-label="Close Lightbox"
            className="p-2.5 sm:p-3 rounded-full bg-neutral-900/80 text-white border border-neutral-700 hover:border-[#C7A46A] hover:text-[#C7A46A] transition-all"
            title="Close (Esc)"
          >
            <X size={20} />
          </button>
        </div>

        {/* Prev / Next Controls */}
        {currentIndex > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(items[currentIndex - 1]);
            }}
            aria-label="Previous Image"
            className="absolute left-3 sm:left-6 z-50 p-3 sm:p-4 rounded-full bg-neutral-900/80 text-white border border-neutral-700 hover:border-[#C7A46A] hover:text-[#C7A46A] transition-all flex items-center justify-center"
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
            className="absolute right-3 sm:right-6 z-50 p-3 sm:p-4 rounded-full bg-neutral-900/80 text-white border border-neutral-700 hover:border-[#C7A46A] hover:text-[#C7A46A] transition-all flex items-center justify-center"
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
          className="relative max-w-6xl w-full max-h-[90vh] flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-8 bg-neutral-950/80 rounded-3xl border border-neutral-800 p-4 sm:p-6 overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Media Frame (Video Player or High-Res Image with Zoom/Pan) */}
          <div 
            className="w-full md:w-2/3 h-[45vh] sm:h-[55vh] md:h-[75vh] flex items-center justify-center overflow-hidden rounded-2xl bg-black relative border border-neutral-850"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ cursor: !isPlayingVideo && currentZoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
          >
            {isPlayingVideo && item.videoEmbedUrl ? (
              <iframe
                src={item.videoEmbedUrl.includes('?') ? `${item.videoEmbedUrl}&autoplay=1` : `${item.videoEmbedUrl}?autoplay=1`}
                title={item.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
              />
            ) : (
              <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  draggable={false}
                  style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${currentZoom})`,
                    transition: isDragging ? 'none' : 'transform 0.15s ease-out',
                  }}
                  className="max-w-full max-h-full object-contain rounded select-none pointer-events-auto"
                />

                {item.videoEmbedUrl && (
                  <button
                    onClick={() => setIsPlayingVideo(true)}
                    className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-black/80 border border-[#C7A46A] flex items-center justify-center text-[#C7A46A] hover:bg-[#C7A46A] hover:text-black transition-all transform hover:scale-110 shadow-2xl"
                    aria-label="Play Reel"
                  >
                    <Play size={24} className="fill-current ml-1" />
                  </button>
                )}

                {/* Floating Image Zoom Bar */}
                {!isPlayingVideo && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/80 border border-neutral-700/80 backdrop-blur-md shadow-xl text-xs font-mono">
                    <button
                      type="button"
                      onClick={handleZoomOut}
                      disabled={zoomIndex === 0}
                      aria-label="Zoom Out"
                      className="p-1 rounded text-neutral-400 hover:text-white disabled:opacity-30"
                    >
                      <ZoomOut size={14} />
                    </button>
                    <span className="text-[11px] text-[#C7A46A] min-w-[36px] text-center font-bold">
                      {Math.round(currentZoom * 100)}%
                    </span>
                    <button
                      type="button"
                      onClick={handleZoomIn}
                      disabled={zoomIndex === ZOOM_STEPS.length - 1}
                      aria-label="Zoom In"
                      className="p-1 rounded text-neutral-400 hover:text-white disabled:opacity-30"
                    >
                      <ZoomIn size={14} />
                    </button>
                    <div className="w-[1px] h-3 bg-neutral-700" />
                    <button
                      type="button"
                      onClick={resetZoom}
                      aria-label="Reset Zoom"
                      className="p-1 rounded text-neutral-400 hover:text-[#C7A46A]"
                      title="Fit to Screen"
                    >
                      <RotateCcw size={12} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Metadata & Narrative */}
          <div className="w-full md:w-1/3 flex flex-col justify-between py-2 text-left overflow-y-auto max-h-[35vh] md:max-h-[75vh]">
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

              <h3 className="text-xl sm:text-2xl md:text-3xl font-serif text-[#FAF9F6] tracking-wide mb-3 leading-snug">
                {item.title}
              </h3>

              <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed mb-4 sm:mb-6">
                {item.caption}
              </p>

              {item.credits && (
                <div className="text-xs text-neutral-500 mb-4 sm:mb-6">
                  <span className="text-[#C7A46A]/80 font-mono text-[10px] uppercase block mb-1">Archive Credits</span>
                  {item.credits}
                </div>
              )}

              {/* Action buttons if video is present */}
              {item.videoEmbedUrl && (
                <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
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

            <div className="mt-6 pt-4 border-t border-neutral-900 flex items-center justify-between text-xs text-neutral-500">
              <span>{currentIndex + 1} of {items.length}</span>
              <span className="text-[#C7A46A] text-[11px]">RFR ARCHIVE</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
