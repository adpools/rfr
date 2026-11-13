import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { timelineData } from '../../data/timelineData';
import { getTimelineYears } from '../../services/cmsService';
import { ArrowUpRight, Sparkles, ChevronRight, Play, X } from 'lucide-react';
import { Link } from 'wouter';

export const TimelinePreviewSection: React.FC = () => {
  const [data, setData] = useState<any[]>(timelineData);
  const [selectedYear, setSelectedYear] = useState<number>(timelineData[0].year);
  const [activeEventIndex, setActiveEventIndex] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [selectedVideo, setSelectedVideo] = useState<{
    title: string;
    badge: string;
    videoUrl?: string;
    videoEmbedUrl?: string;
    driveFolderUrl?: string;
  } | null>(null);

  useEffect(() => {
    getTimelineYears().then((res) => {
      if (res && res.length > 0) {
        setData(res);
      }
    });
  }, []);

  const activeData = data.find((d) => d.year === selectedYear) || data[0] || timelineData[0];
  const activeEvent = activeData?.eventsList?.[activeEventIndex] || activeData?.eventsList?.[0];

  // Reset event index and re-enable autoplay when changing years
  useEffect(() => {
    setActiveEventIndex(0);
    setIsAutoPlaying(true);
  }, [selectedYear]);

  // Auto-cycle through events for the selected year
  useEffect(() => {
    if (!isAutoPlaying || !activeData.eventsList || activeData.eventsList.length <= 1) return;
    const interval = setInterval(() => {
      setActiveEventIndex((prev) => (prev + 1) % activeData.eventsList.length);
    }, 10000); // 10 seconds per event slide
    return () => clearInterval(interval);
  }, [activeData, selectedYear, isAutoPlaying, activeEventIndex]);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedVideo) {
        setSelectedVideo(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedVideo]);

  const targetVideoUrl = activeEvent?.videoUrl || activeEvent?.videos?.[0]?.videoUrl;
  const targetVideoEmbedUrl = activeEvent?.videoEmbedUrl || activeEvent?.videos?.[0]?.videoEmbedUrl || activeData.videoEmbedUrl;
  const hasVideo = Boolean(targetVideoUrl || targetVideoEmbedUrl || activeEvent?.hasVideo);
  const currentImageUrl = (activeEvent ? activeEvent.image : null) || activeEvent?.videos?.[0]?.image || activeData.image;

  const handleOpenVideo = () => {
    if (!hasVideo) return;
    setIsAutoPlaying(false);
    setSelectedVideo({
      title: activeEvent?.name || activeData.title,
      badge: `${activeData.year} ARCHIVE • ${activeEvent?.categoryBadge || activeEvent?.type || 'EVENT REEL'}`,
      videoUrl: targetVideoUrl,
      videoEmbedUrl: targetVideoEmbedUrl,
      driveFolderUrl: activeEvent?.driveFolderUrl || activeData.driveFolderUrl,
    });
  };

  return (
    <section
      id="chapter-01"
      className="full-viewport-scene bg-[#050505] border-b border-neutral-900 flex flex-col justify-center relative overflow-hidden py-16 md:py-24"
    >
      <div className="editorial-container relative z-10 w-full my-auto">
        {/* Top Header - Editorial Redesign */}
        <div className="flex flex-col justify-start mb-14">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-[11px] sm:text-xs font-serif font-bold text-[#C7A46A]">01</span>
            <div className="w-16 sm:w-24 h-[1px] bg-[#C7A46A]/50" />
            <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.4em] text-[#C7A46A] uppercase">
              THE ARCHIVE (2020 — 2026)
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-900 pb-8 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-6xl sm:text-7xl lg:text-[110px] font-serif text-[#F4F1EA] uppercase tracking-tighter leading-[0.85] mb-6 drop-shadow-2xl">
                TIMELINE
              </h2>
              <p className="text-sm sm:text-[15px] font-serif font-light text-[#A09D96] leading-relaxed max-w-lg tracking-wide">
                A chronological retrospective of our evolution from foundational runway shows to an international creative ecosystem.
              </p>
            </div>
            
            <Link
              href="/timeline"
              className="group flex items-center gap-4 px-7 py-3.5 rounded-full border border-neutral-800 hover:border-[#C7A46A]/60 bg-[#0a0a0a] hover:bg-[#C7A46A]/10 transition-all duration-300"
            >
              <span className="text-[10px] font-mono text-[#E0DDD5] group-hover:text-[#C7A46A] uppercase tracking-[0.2em] transition-colors">
                EXPLORE ALL 7 YEARS
              </span>
              <div className="w-7 h-7 rounded-full bg-[#111111] group-hover:bg-[#C7A46A] flex items-center justify-center transition-colors">
                <ArrowUpRight size={14} className="text-[#A09D96] group-hover:text-black transition-colors" />
              </div>
            </Link>
          </div>
        </div>

        {/* Year Pills Navigation (2020 to 2026) */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {data.map((item) => {
            const isSelected = item.year === selectedYear;
            return (
              <button
                key={item.year}
                onClick={() => setSelectedYear(item.year)}
                className={`px-4 sm:px-6 py-2 rounded-xl font-mono text-xs sm:text-sm font-semibold transition-all duration-300 flex-shrink-0 flex items-center gap-2 ${
                  isSelected
                    ? 'bg-[#C7A46A] text-black shadow-[0_0_15px_rgba(199,164,106,0.3)]'
                    : 'bg-[#111111] text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <span>{item.year}</span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
              </button>
            );
          })}
        </div>

        {/* Interactive Year Showcase Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeData.year}-${activeEvent?.id || 'main'}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-[#0a0a0a]/90 backdrop-blur-md border border-neutral-900 rounded-3xl p-8 sm:p-12 shadow-2xl"
          >
            {/* Left: Narrative */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <div className="flex items-center gap-5 mb-10">
                <span className="text-6xl sm:text-7xl lg:text-[100px] font-serif text-[#C7A46A] font-medium tracking-tighter leading-none shrink-0 min-w-[130px] sm:min-w-[160px] lg:min-w-[220px]">
                  {activeData.year}
                </span>
                <div className="h-14 w-[1px] bg-neutral-800 shrink-0" />
                <div className="flex flex-col justify-center gap-2">
                  <span className="text-[10px] font-mono text-[#8C8A85] uppercase tracking-widest block">
                    THEME
                  </span>
                  <span className="text-xs sm:text-[13px] font-mono text-[#F4F1EA] uppercase tracking-wider font-medium">
                    {activeData.theme}
                  </span>
                </div>
              </div>

              <div className="mb-10">
                <h3 className="text-3xl sm:text-4xl font-serif text-[#F4F1EA] uppercase mb-5 leading-[1.15] tracking-tight min-h-[4rem] sm:min-h-[4.5rem] flex items-center">
                  {activeEvent?.name || activeData.title}
                </h3>
                <p className="text-[13px] sm:text-[15px] text-[#A09D96] font-light leading-relaxed max-w-lg min-h-[4.5rem]">
                  {activeEvent?.description || activeData.description}
                </p>
              </div>

              {/* Milestones / Events list */}
              <div className="w-full h-[1px] bg-neutral-900 mb-8" />
              <div className="space-y-4 mb-10">
                <span className="text-[10px] md:text-[11px] font-mono text-[#C7A46A] uppercase tracking-[0.2em] block">
                  LANDMARK EVENTS ({activeData.eventsList.length})
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {activeData.eventsList.map((ev: any, idx: number) => (
                    <button
                      key={ev.id}
                      onClick={() => {
                        setActiveEventIndex(idx);
                        setIsAutoPlaying(false);
                      }}
                      className={`px-4 py-2 rounded-lg border text-[11px] md:text-xs font-mono tracking-wider transition-all duration-300 text-left ${
                        idx === activeEventIndex 
                        ? "bg-[#C7A46A] text-black border-[#C7A46A] shadow-[0_0_10px_rgba(199,164,106,0.3)] font-bold"
                        : "bg-[#111111] text-[#E0DDD5] border-neutral-800/80 hover:border-neutral-500 hover:bg-neutral-900"
                      }`}
                    >
                      ✦ {ev.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href={`/timeline#year-${activeData.year}`}
                  className="inline-flex items-center gap-3 bg-[#C7A46A] hover:bg-[#D4B678] text-black text-[11px] font-mono font-bold tracking-widest uppercase px-7 py-4 rounded-full transition-all"
                >
                  <span>VIEW {activeData.year} FULL RETROSPECTIVE</span>
                  <ArrowUpRight size={14} className="ml-1" />
                </Link>
              </div>
            </div>

            {/* Right: Visual */}
            <div 
              className={`lg:col-span-6 h-72 sm:h-[450px] rounded-2xl overflow-hidden editorial-image-frame border border-neutral-800 relative shadow-2xl bg-black ${
                hasVideo ? 'cursor-pointer group/media' : ''
              }`}
              onMouseEnter={() => setIsAutoPlaying(false)}
              onClick={hasVideo ? handleOpenVideo : undefined}
              role={hasVideo ? 'button' : undefined}
              tabIndex={hasVideo ? 0 : undefined}
              onKeyDown={hasVideo ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleOpenVideo();
                }
              } : undefined}
              aria-label={hasVideo ? `Play video for ${activeEvent?.name || activeData.title}` : undefined}
            >
              {currentImageUrl ? (
                <img
                  key={currentImageUrl}
                  src={currentImageUrl}
                  alt={activeEvent?.name || activeData.title}
                  className={`w-full h-full object-cover transition-all duration-700 ${hasVideo ? 'group-hover/media:scale-105' : ''}`}
                />
              ) : targetVideoUrl ? (
                <video
                  key={targetVideoUrl}
                  src={targetVideoUrl}
                  muted
                  playsInline
                  className={`w-full h-full object-cover transition-all duration-700 ${hasVideo ? 'group-hover/media:scale-105' : ''}`}
                />
              ) : null}

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

              {/* Play Button Overlay (Visible only when video exists) */}
              {hasVideo && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div 
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-black/70 backdrop-blur-md border border-[#C7A46A] flex items-center justify-center text-[#C7A46A] group-hover/media:bg-[#C7A46A] group-hover/media:text-black transition-all duration-300 transform group-hover/media:scale-110 shadow-2xl"
                  >
                    <Play size={24} className="fill-current ml-1" />
                  </div>
                </div>
              )}

              {/* Bottom Metadata Banner */}
              <div className="absolute bottom-5 left-5 right-5 flex flex-col md:flex-row items-start md:items-center justify-between text-xs font-mono text-neutral-300 pointer-events-none gap-2 z-10">
                <span className="truncate w-full max-w-[70%]">
                  RFR ARCHIVES • {activeData.year} • {activeEvent?.categoryBadge || 'RECORD'}
                </span>
                <span className="text-[#C7A46A] flex-shrink-0">
                  {hasVideo ? 'CLICK TO WATCH REEL' : 'VERIFIED RECORD'}
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Video Player Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-xl"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-4xl bg-[#0c0c0c] border border-[#C7A46A]/40 rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-[#111]">
                <div>
                  <span className="text-[10px] font-mono text-[#C7A46A] uppercase tracking-widest block">
                    {selectedVideo.badge}
                  </span>
                  <h4 className="text-base sm:text-lg font-serif text-[#F4F1EA] uppercase">
                    {selectedVideo.title}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedVideo(null)}
                  aria-label="Close Video Player"
                  className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-700 hover:border-[#C7A46A] flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="relative aspect-video w-full bg-black">
                {selectedVideo.videoUrl && selectedVideo.videoUrl.endsWith('.mp4') ? (
                  <video
                    src={selectedVideo.videoUrl}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain"
                  />
                ) : selectedVideo.videoEmbedUrl ? (
                  <iframe
                    src={selectedVideo.videoEmbedUrl}
                    title={selectedVideo.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : null}
              </div>

              {selectedVideo.driveFolderUrl && (
                <div className="px-6 py-3 bg-[#0a0a0a] border-t border-neutral-900 flex justify-between items-center text-xs">
                  <span className="text-neutral-500 font-mono text-[10px]">OFFICIAL RFR REEL ARCHIVE</span>
                  <a
                    href={selectedVideo.driveFolderUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-[#C7A46A] hover:underline font-mono text-[11px]"
                  >
                    <span>VIEW FULL ARCHIVE</span>
                    <ArrowUpRight size={12} />
                  </a>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
