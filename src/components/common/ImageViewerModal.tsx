import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ZoomIn, ZoomOut, RotateCcw, Maximize, Minimize, 
  ChevronLeft, ChevronRight, ExternalLink, Image as ImageIcon 
} from 'lucide-react';

export interface ImageViewerItem {
  src: string;
  alt?: string | null;
  title?: string | null;
  subtitle?: string | null;
  caption?: string | null;
  category?: string | null;
  year?: string | null;
}

export interface ImageViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ImageViewerItem | null;
  items?: ImageViewerItem[];
  currentIndex?: number;
  onNavigate?: (index: number) => void;
}

const ZOOM_STEPS = [0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3, 4];

export const ImageViewerModal: React.FC<ImageViewerModalProps> = ({
  isOpen,
  onClose,
  item,
  items = [],
  currentIndex = 0,
  onNavigate,
}) => {
  const [zoomIndex, setZoomIndex] = useState(2); // default 1x (index 2 in ZOOM_STEPS)
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const currentZoom = ZOOM_STEPS[zoomIndex] || 1;
  const activeItem = item || (items.length > 0 ? items[currentIndex] : null);
  const hasMultiple = items.length > 1;

  // Reset zoom & pan when active item changes or modal closes
  const resetZoom = useCallback(() => {
    setZoomIndex(2); // 1x
    setPan({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    resetZoom();
  }, [activeItem?.src, resetZoom]);

  // Lock body scroll while open
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

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
        if (containerRef.current?.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        } else if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch {
      // safe fallback if fullscreen rejected by browser policy
    }
  };

  const handleZoomIn = () => {
    setZoomIndex((prev) => Math.min(prev + 1, ZOOM_STEPS.length - 1));
  };

  const handleZoomOut = () => {
    setZoomIndex((prev) => Math.max(prev - 1, 0));
  };

  // Keyboard navigation & zoom controls
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && hasMultiple && onNavigate) {
        onNavigate((currentIndex + 1) % items.length);
      } else if (e.key === 'ArrowLeft' && hasMultiple && onNavigate) {
        onNavigate((currentIndex - 1 + items.length) % items.length);
      } else if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        handleZoomIn();
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        handleZoomOut();
      } else if (e.key === '0') {
        e.preventDefault();
        resetZoom();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, hasMultiple, currentIndex, items.length, onNavigate, onClose, resetZoom]);

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  // Pan dragging logic when zoomed in
  const handleMouseDown = (e: React.MouseEvent) => {
    if (currentZoom <= 1) return;
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

  if (!isOpen || !activeItem) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[10000] bg-black/92 backdrop-blur-2xl flex flex-col justify-between p-3 sm:p-6 select-none overflow-hidden"
        onClick={onClose}
        onWheel={handleWheel}
      >
        {/* Top Header Bar */}
        <div
          className="flex items-center justify-between w-full max-w-7xl mx-auto pb-3 sm:pb-4 border-b border-neutral-800/80 z-20 gap-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Item Metadata */}
          <div className="flex items-center gap-2.5 sm:gap-3 truncate min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#181818] border border-neutral-700 flex items-center justify-center text-[#C7A46A] shrink-0">
              <ImageIcon size={15} />
            </div>

            <div className="truncate">
              <div className="flex items-center gap-2 truncate">
                {activeItem.subtitle && (
                  <span className="text-[10px] font-mono tracking-widest text-[#C7A46A] uppercase px-2 py-0.5 rounded bg-black/60 border border-[#C7A46A]/30 shrink-0">
                    {activeItem.subtitle}
                  </span>
                )}
                {hasMultiple && (
                  <span className="text-[10px] font-mono text-neutral-400 shrink-0">
                    {String(currentIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
                  </span>
                )}
                <h3 className="text-white font-serif uppercase tracking-wide text-xs sm:text-sm truncate">
                  {activeItem.title || activeItem.alt || 'High-Resolution Media Preview'}
                </h3>
              </div>
              {activeItem.caption && (
                <p className="text-[11px] text-neutral-400 font-light truncate max-w-xl hidden sm:block">
                  {activeItem.caption}
                </p>
              )}
            </div>
          </div>

          {/* Top Actions: Original Link, Fullscreen & Close */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={activeItem.src}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-[#C7A46A] text-neutral-300 hover:text-[#C7A46A] text-xs font-mono transition-colors flex items-center gap-1.5"
              title="Open Original Image in New Tab"
              aria-label="Open original image in new tab"
            >
              <span className="hidden sm:inline">ORIGINAL</span>
              <ExternalLink size={13} />
            </a>

            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              className="p-2 sm:p-2.5 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-[#C7A46A] text-neutral-300 hover:text-white transition-colors"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close Image Viewer"
              className="p-2 sm:p-2.5 rounded-full bg-neutral-900 border border-neutral-700 hover:border-[#C7A46A] text-neutral-300 hover:text-[#C7A46A] transition-all hover:scale-105"
              title="Close (Esc)"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Central Display Canvas */}
        <div
          className="relative flex-1 w-full flex items-center justify-center my-2 sm:my-4 overflow-hidden"
          onClick={(e) => {
            // Only close if clicking the backdrop, not during pan
            if (e.target === e.currentTarget && !isDragging) {
              onClose();
            }
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ cursor: currentZoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
        >
          {/* Previous Button */}
          {hasMultiple && onNavigate && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onNavigate((currentIndex - 1 + items.length) % items.length);
              }}
              aria-label="Previous Image"
              className="absolute left-2 sm:left-4 z-30 p-3 sm:p-4 rounded-full bg-neutral-900/80 border border-neutral-700 hover:border-[#C7A46A] text-white hover:text-[#C7A46A] transition-all hover:scale-110 shadow-2xl backdrop-blur-md"
            >
              <ChevronLeft size={22} />
            </button>
          )}

          {/* Centered Image with Aspect-Ratio Containment, Zoom & Pan */}
          <motion.div
            key={activeItem.src}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full flex items-center justify-center pointer-events-none p-2"
          >
            <img
              ref={imageRef}
              src={activeItem.src}
              alt={activeItem.alt || activeItem.title || 'Image Preview'}
              draggable={false}
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${currentZoom})`,
                transition: isDragging ? 'none' : 'transform 0.15s ease-out',
                maxHeight: 'calc(100vh - 160px)',
                maxWidth: '92vw',
              }}
              className="object-contain rounded-xl shadow-2xl pointer-events-auto select-none"
            />
          </motion.div>

          {/* Next Button */}
          {hasMultiple && onNavigate && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onNavigate((currentIndex + 1) % items.length);
              }}
              aria-label="Next Image"
              className="absolute right-2 sm:right-4 z-30 p-3 sm:p-4 rounded-full bg-neutral-900/80 border border-neutral-700 hover:border-[#C7A46A] text-white hover:text-[#C7A46A] transition-all hover:scale-110 shadow-2xl backdrop-blur-md"
            >
              <ChevronRight size={22} />
            </button>
          )}
        </div>

        {/* Bottom Floating Luxury Zoom & Fit Toolbar */}
        <div
          className="w-full max-w-md mx-auto z-20 flex items-center justify-between gap-3 px-4 py-2 sm:py-2.5 rounded-full bg-neutral-950/90 border border-neutral-800 backdrop-blur-xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Zoom Out Button */}
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={zoomIndex === 0}
            aria-label="Zoom Out"
            className="p-1.5 sm:p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 disabled:opacity-40 transition-colors"
            title="Zoom Out (-)"
          >
            <ZoomOut size={16} />
          </button>

          {/* Zoom Percentage Label */}
          <span className="font-mono text-xs text-[#C7A46A] font-bold tracking-wider min-w-[50px] text-center">
            {Math.round(currentZoom * 100)}%
          </span>

          {/* Zoom In Button */}
          <button
            type="button"
            onClick={handleZoomIn}
            disabled={zoomIndex === ZOOM_STEPS.length - 1}
            aria-label="Zoom In"
            className="p-1.5 sm:p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 disabled:opacity-40 transition-colors"
            title="Zoom In (+)"
          >
            <ZoomIn size={16} />
          </button>

          <div className="w-[1px] h-4 bg-neutral-800" />

          {/* Fit to Screen / Reset Zoom */}
          <button
            type="button"
            onClick={resetZoom}
            aria-label="Fit to Screen"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono text-neutral-300 hover:text-[#C7A46A] hover:bg-neutral-800/80 transition-colors"
            title="Reset Zoom / Fit to Screen (0)"
          >
            <RotateCcw size={13} />
            <span className="text-[11px] uppercase tracking-wider hidden sm:inline">Fit</span>
          </button>

          {/* Desktop Instruction Hint */}
          <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest hidden md:inline">
            {currentZoom > 1 ? 'Drag to Pan' : 'Scroll to Zoom'}
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
