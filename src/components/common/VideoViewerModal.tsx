import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Maximize, Minimize, ExternalLink, Play, Film, FolderOpen 
} from 'lucide-react';

export interface VideoViewerItem {
  src?: string;
  embedUrl?: string;
  title?: string;
  badge?: string;
  subtitle?: string;
  description?: string;
  driveFolderUrl?: string;
  youtubeUrl?: string;
}

export interface VideoViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: VideoViewerItem | null;
}

// Helper to extract YouTube ID and Start Time from various YouTube URL formats
export const parseYouTubeInfo = (url?: string): { id: string | null; start?: number } => {
  if (!url) return { id: null };
  const trimmed = url.trim();

  // 1. Standard YouTube watch URL: youtube.com/watch?v=...
  const vMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (vMatch) {
    const startMatch = trimmed.match(/[?&](?:start|t)=(\d+)/);
    return {
      id: vMatch[1],
      start: startMatch ? parseInt(startMatch[1], 10) : undefined,
    };
  }

  // 2. Short URL: youtu.be/...
  const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) {
    const startMatch = trimmed.match(/[?&](?:start|t)=(\d+)/);
    return {
      id: shortMatch[1],
      start: startMatch ? parseInt(startMatch[1], 10) : undefined,
    };
  }

  // 3. Embed URL: youtube.com/embed/...
  const embedMatch = trimmed.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch) {
    const startMatch = trimmed.match(/[?&]start=(\d+)/);
    return {
      id: embedMatch[1],
      start: startMatch ? parseInt(startMatch[1], 10) : undefined,
    };
  }

  // 4. Shorts: youtube.com/shorts/...
  const shortsMatch = trimmed.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shortsMatch) {
    return { id: shortsMatch[1] };
  }

  // 5. Bare 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return { id: trimmed };
  }

  return { id: null };
};

export const VideoViewerModal: React.FC<VideoViewerModalProps> = ({
  isOpen,
  onClose,
  video,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Lock body scroll while open
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
      // Pause video when unmounting or closing
      if (videoRef.current) {
        videoRef.current.pause();
      }
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
      // Safe fallback if browser blocks fullscreen
    }
  };

  // Keyboard navigation (Escape to close)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !video) return null;

  // Resolve player type
  const rawUrl = video.src || video.embedUrl || '';
  const ytInfo = parseYouTubeInfo(video.embedUrl || video.src || video.youtubeUrl);
  const isGoogleDrive = rawUrl.includes('drive.google.com');

  let playerType: 'youtube' | 'drive' | 'direct' = 'direct';
  let embedUrl = '';

  if (ytInfo.id) {
    playerType = 'youtube';
    const startParam = ytInfo.start ? `&start=${ytInfo.start}` : '';
    embedUrl = `https://www.youtube.com/embed/${ytInfo.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1${startParam}`;
  } else if (isGoogleDrive) {
    playerType = 'drive';
    if (rawUrl.includes('/preview')) {
      embedUrl = rawUrl;
    } else {
      const match = rawUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      embedUrl = match ? `https://drive.google.com/file/d/${match[1]}/preview` : rawUrl;
    }
  } else if (video.embedUrl && video.embedUrl.startsWith('http')) {
    playerType = 'drive'; // Generic iframe embed
    embedUrl = video.embedUrl.includes('?') ? `${video.embedUrl}&autoplay=1` : `${video.embedUrl}?autoplay=1`;
  } else {
    playerType = 'direct';
  }

  const directVideoUrl = playerType === 'direct' ? rawUrl : undefined;
  const externalLink = video.youtubeUrl || (ytInfo.id ? `https://www.youtube.com/watch?v=${ytInfo.id}` : undefined);

  return (
    <AnimatePresence>
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[10000] bg-black/92 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 md:p-8 select-none overflow-hidden"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="relative max-w-5xl w-full flex flex-col bg-[#0d0d0d] rounded-2xl sm:rounded-3xl border border-neutral-800 shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Bar */}
          <div className="p-3.5 sm:p-4 px-4 sm:px-6 bg-[#141414] border-b border-neutral-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 truncate min-w-0">
              <div className="w-8 h-8 rounded-full bg-black/60 border border-neutral-700 flex items-center justify-center text-[#C7A46A] shrink-0">
                <Play size={14} className="fill-current ml-0.5" />
              </div>

              <div className="truncate">
                <div className="flex items-center gap-2 truncate">
                  {video.badge && (
                    <span className="text-[10px] font-mono tracking-widest text-[#C7A46A] uppercase px-2 py-0.5 rounded bg-black/80 border border-[#C7A46A]/30 shrink-0">
                      {video.badge}
                    </span>
                  )}
                  <h3 className="text-white font-serif uppercase tracking-wide text-xs sm:text-sm truncate">
                    {video.title || 'Official RFR Video Reel'}
                  </h3>
                </div>
                {video.subtitle && (
                  <p className="text-[11px] text-neutral-400 font-mono truncate hidden sm:block">
                    {video.subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {externalLink && (
                <a
                  href={externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-[#C7A46A] text-neutral-300 hover:text-[#C7A46A] text-xs font-mono transition-colors flex items-center gap-1.5"
                  title="Watch on YouTube"
                >
                  <span className="hidden sm:inline">YOUTUBE</span>
                  <ExternalLink size={13} />
                </a>
              )}

              {video.driveFolderUrl && (
                <a
                  href={video.driveFolderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-[#C7A46A] text-neutral-300 hover:text-[#C7A46A] text-xs font-mono transition-colors flex items-center gap-1.5"
                  title="Open Drive Archive"
                >
                  <FolderOpen size={13} />
                  <span className="hidden sm:inline">ARCHIVE</span>
                </a>
              )}

              <button
                type="button"
                onClick={toggleFullscreen}
                aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                className="p-2 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-[#C7A46A] text-neutral-300 hover:text-white transition-colors"
                title="Toggle Fullscreen"
              >
                {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
              </button>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close Video Player"
                className="p-2 rounded-full bg-neutral-900 border border-neutral-700 hover:border-[#C7A46A] text-neutral-300 hover:text-[#C7A46A] transition-all hover:scale-105"
                title="Close (Esc)"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Video Player Display */}
          <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
            {playerType === 'direct' && directVideoUrl ? (
              <video
                ref={videoRef}
                key={directVideoUrl}
                src={directVideoUrl}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              />
            ) : embedUrl ? (
              <iframe
                key={embedUrl}
                src={embedUrl}
                title={video.title || 'Video Player'}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-neutral-500 font-mono text-xs p-6 text-center">
                <Film size={44} className="mb-2 opacity-40 text-[#C7A46A]" />
                <span className="text-neutral-300">No streamable video source found for this asset.</span>
              </div>
            )}
          </div>

          {/* Description Footer (if available) */}
          {video.description && (
            <div className="p-3.5 sm:p-4 px-4 sm:px-6 bg-[#0c0c0c] border-t border-neutral-850">
              <p className="text-neutral-300 text-xs font-light leading-relaxed">
                {video.description}
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

