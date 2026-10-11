import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'wouter';

import { servicesData } from '../../data/servicesData';

export const HeroSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [modalVideo, setModalVideo] = useState<{
    type: 'video' | 'youtube';
    src: string;
    title: string;
  } | null>(null);

  const [activePodcastEp, setActivePodcastEp] = useState(0);

  const podcastEpisodes = [
    { id: '-X_1HETQbho', label: 'EP 01', title: 'Akhila Anand' },
    { id: '8t8mJ0Z8Wiw', label: 'EP 02', title: 'Studio Master' },
    { id: 'BRx2vCrve6A', label: 'EP 03', title: 'Runway Couture' },
    { id: 'U9NnwHpdSU4', label: 'EP 04', title: 'Beyond Runway', start: 1410 },
  ];

  // Manually curated 4 main pillars for the Hero Section
  const heroSlides = [
    {
      id: 'generic-rfr',
      type: 'video',
      src: '/videos/Dandya%20Deeshna%20Event/Dandya%20Highlights.mp4',
      subtitle: 'EST. 2020 • CREATIVE STUDIO',
      title: 'RFR BY RIYAS',
      description: 'A Creative Studio specializing in immersive experiences, fashion productions, and culturally resonant campaigns.',
      link: '/about'
    },
    {
      id: 'events-runways',
      type: 'youtube',
      youtubeId: 'NTDkcWdruPs',
      start: 144, // Start from halfway (approx 2m 24s of 4m 48s video)
      src: 'https://www.youtube.com/embed/NTDkcWdruPs?start=144',
      subtitle: 'EVENTS • KOOTTAM FLEA & RUNWAYS',
      title: 'Events & Runways',
      description: 'The quintessential RFR signature runway presentations, Koottam Flea Market IP, and lifestyle curations.',
      link: '/services'
    },
    {
      id: 'campaigns-media',
      type: 'video',
      src: '/videos/Dandya%20Deeshna%20Event/Dandya%20Reel.mp4',
      subtitle: 'CAMPAIGNS • CINEMATIC PRODUCTION',
      title: 'Campaigns & Media',
      description: 'Luxury brand films, television commercials, and omnichannel campaign assets.',
      link: '/services'
    },
    {
      id: 'podcast',
      type: 'youtube',
      youtubeId: podcastEpisodes[activePodcastEp].id,
      start: podcastEpisodes[activePodcastEp].start,
      src: `https://www.youtube.com/embed/${podcastEpisodes[activePodcastEp].id}`,
      subtitle: 'PODCAST • CONVERSATIONS BEYOND RUNWAY',
      title: 'The RFR Podcast',
      description: 'Unfiltered, intellectual, and visionary dialogues with industry icons and creative entrepreneurs.',
      link: '/services/podcast'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [currentSlide, activePodcastEp, heroSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const currentEpId = podcastEpisodes[activePodcastEp].id;
  const currentEpStart = podcastEpisodes[activePodcastEp].start;

  return (
    <section
      id="chapter-01"
      className="full-viewport-scene !py-0 bg-[#050505] flex flex-col justify-center items-center overflow-hidden relative min-h-screen"
    >
      {/* 1. Background Slider Layer */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <AnimatePresence initial={false}>
          <motion.div
            key={`${currentSlide}-${heroSlides[currentSlide].youtubeId || heroSlides[currentSlide].src}`}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full overflow-hidden"
          >
            {heroSlides[currentSlide].type === 'youtube' ? (
              <div className="absolute inset-0 w-full h-full pointer-events-none">
                {(() => {
                  const yId = heroSlides[currentSlide].youtubeId || currentEpId;
                  const startSec = heroSlides[currentSlide].start ?? (currentSlide === 3 ? currentEpStart : 0);
                  return (
                    <iframe
                      key={`${yId}-${startSec}`}
                      src={`https://www.youtube.com/embed/${yId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${yId}&playsinline=1&rel=0&showinfo=0${startSec ? `&start=${startSec}` : ''}`}
                      className="absolute top-1/2 left-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2 pointer-events-none border-0"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                    />
                  );
                })()}
              </div>
            ) : heroSlides[currentSlide].type === 'video' ? (
              <video
                src={heroSlides[currentSlide].src}
                autoPlay
                muted
                loop
                playsInline
                className="absolute w-full h-full object-cover object-center opacity-100"
              />
            ) : (
              <img 
                src={heroSlides[currentSlide].src}
                alt={heroSlides[currentSlide].title}
                className="absolute w-full h-full object-cover object-top opacity-100"
              />
            )}
          </motion.div>
        </AnimatePresence>
        
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent z-10" />
        <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-[#050505]/90 to-transparent z-10" />
      </div>

      {/* 2. Main Centered Content */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 w-full h-full min-h-screen pt-20 pb-28 md:pb-24">
        
        <div className="flex flex-col items-center justify-center w-full max-w-5xl mx-auto my-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${currentSlide}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-center w-full px-4"
            >
              {/* Watch Reel Button (Slide 0: General Archive, Slide 1: Koottam Season 2 YouTube) */}
              {currentSlide === 0 && (
                <div className="mb-6 md:mb-8">
                  <button 
                    onClick={() => {
                      setModalVideo({
                        type: 'video',
                        src: '/videos/Dandya%20Deeshna%20Event/Dandya%20Highlights.mp4',
                        title: 'RFR 2020-2026 VIDEO ARCHIVE REEL'
                      });
                      setIsVideoModalOpen(true);
                    }}
                    className="flex items-center gap-4 px-6 md:px-8 py-3.5 md:py-4 rounded-full border border-[#C7A46A]/50 hover:border-[#C7A46A] hover:bg-[#C7A46A]/20 transition-all group backdrop-blur-md bg-black/40 shadow-2xl cursor-pointer"
                  >
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,1)]"></div>
                    <span className="text-xs md:text-sm font-mono tracking-[0.2em] text-[#E0DDD5] group-hover:text-[#C7A46A] transition-colors uppercase mt-px font-semibold">
                      WATCH 2020-2026 VIDEO ARCHIVE REEL
                    </span>
                    <Play size={14} className="text-[#C7A46A]" />
                  </button>
                </div>
              )}

              {currentSlide === 1 && (
                <div className="mb-6 md:mb-8">
                  <button 
                    onClick={() => {
                      setModalVideo({
                        type: 'youtube',
                        src: 'https://www.youtube.com/embed/NTDkcWdruPs?autoplay=1&start=144',
                        title: 'KOOTTAM FLEA SEASON 2 — OFFICIAL EVENT HIGHLIGHTS'
                      });
                      setIsVideoModalOpen(true);
                    }}
                    className="flex items-center gap-4 px-6 md:px-8 py-3.5 md:py-4 rounded-full border border-[#C7A46A]/50 hover:border-[#C7A46A] hover:bg-[#C7A46A]/20 transition-all group backdrop-blur-md bg-black/40 shadow-2xl cursor-pointer"
                  >
                    <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_12px_rgba(239,68,68,1)]"></div>
                    <span className="text-xs md:text-sm font-mono tracking-[0.2em] text-[#E0DDD5] group-hover:text-[#C7A46A] transition-colors uppercase mt-px font-semibold">
                      WATCH KOOTTAM SEASON 2 EVENT REEL
                    </span>
                    <Play size={14} className="text-[#C7A46A]" />
                  </button>
                </div>
              )}

              {/* Minimal Text Content Container without the box */}
              <div className="flex flex-col items-center max-w-6xl mx-auto w-full">
                
                {/* Subtitle / Caption */}
                <span className="text-xs sm:text-sm md:text-base font-mono tracking-[0.4em] text-[#C7A46A] uppercase font-bold mb-4 md:mb-6 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
                  {heroSlides[currentSlide].subtitle}
                </span>

                {/* Monumental Title */}
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[88px] xl:text-[96px] font-serif font-normal leading-[0.9] select-none text-[#F4F1EA] tracking-tighter drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)] text-center mb-4 md:mb-6">
                  {heroSlides[currentSlide].title}
                </h1>
                
                {/* Subheading / Caption */}
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-serif font-light text-[#E0DDD5] max-w-3xl mx-auto text-center leading-relaxed drop-shadow-[0_8px_20px_rgba(0,0,0,0.9)]">
                  {heroSlides[currentSlide].description}
                </p>

                {/* Podcast Episode Selector (Only on podcast slide) */}
                {currentSlide === 3 && (
                  <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
                    <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest mr-1">
                      EPISODE:
                    </span>
                    {podcastEpisodes.map((ep, idx) => (
                      <button
                        key={ep.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActivePodcastEp(idx);
                        }}
                        className={`px-3 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase transition-all ${
                          activePodcastEp === idx
                            ? 'bg-[#C7A46A] text-black font-bold shadow-lg scale-105'
                            : 'bg-black/60 backdrop-blur-md text-neutral-400 hover:text-white border border-[#C7A46A]/30 hover:border-[#C7A46A]'
                        }`}
                      >
                        {ep.label} • {ep.title}
                      </button>
                    ))}
                  </div>
                )}
                
                {/* Explore Button */}
                <div className="mt-8 md:mt-10">
                  <Link href={heroSlides[currentSlide].link} className="inline-flex items-center gap-3 px-8 md:px-10 py-3.5 md:py-4 rounded-full bg-[#C7A46A] hover:bg-[#D4B678] text-black transition-colors font-mono text-xs md:text-sm tracking-widest font-bold uppercase shadow-2xl hover:scale-105">
                    EXPLORE SERVICE
                    <ArrowUpRight size={16} className="stroke-[3px]" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* Pagination & Navigation */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 z-30 pointer-events-auto">
        <button 
          onClick={prevSlide}
          className="text-neutral-400 hover:text-[#C7A46A] transition-colors p-2"
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} strokeWidth={2} />
        </button>
        
        <div className="flex gap-3 items-center">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                index === currentSlide 
                  ? "w-8 bg-[#C7A46A]" 
                  : "w-2 bg-[#C7A46A]/30 hover:bg-[#C7A46A]/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <button 
          onClick={nextSlide}
          className="text-neutral-400 hover:text-[#C7A46A] transition-colors p-2"
          aria-label="Next slide"
        >
          <ChevronRight size={24} strokeWidth={2} />
        </button>
      </div>

      {/* Interactive BG Video Modal */}
      <AnimatePresence>
        {isVideoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setIsVideoModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-6xl aspect-video bg-[#050505] p-2 md:p-4 border border-[#C7A46A]/30 relative rounded-xl shadow-[0_0_50px_rgba(199,164,106,0.15)] flex flex-col"
            >
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="absolute top-4 right-4 z-50 p-3 rounded-full bg-[#C7A46A] text-black shadow-lg hover:scale-110 transition-transform"
              >
                <X size={20} className="stroke-[3px]" />
              </button>
              <div className="w-full h-full bg-black rounded-lg overflow-hidden relative">
                {modalVideo?.type === 'youtube' ? (
                  <iframe
                    src={modalVideo.src}
                    title={modalVideo.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    autoPlay
                    controls
                    className="w-full h-full object-contain"
                    src={modalVideo?.src || "/videos/Dandya%20Deeshna%20Event/Dandya%20Highlights.mp4"}
                  />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
