import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { servicesData } from '../../data/servicesData';
import { ArrowUpRight, Calendar, Megaphone, Mic, Sparkles, Play, X, Film } from 'lucide-react';

export const ServicesSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'events' | 'campaigns' | 'podcast'>('events');
  const [selectedVideo, setSelectedVideo] = useState<{
    title: string;
    badge: string;
    videoUrl?: string;
    videoEmbedUrl?: string;
    driveFolderUrl?: string;
  } | null>(null);

  const eventItems = servicesData.filter((s) => s.category === 'events');
  const campaignItems = servicesData.filter((s) => s.category === 'campaigns');
  const podcastItem = servicesData.find((s) => s.category === 'podcast') || servicesData[0];

  return (
    <section
      id="chapter-05"
      className="full-viewport-scene bg-[#050505] border-b border-neutral-900 flex flex-col justify-center relative overflow-hidden py-16 md:py-24"
    >
      <div className="editorial-container relative z-10 w-full my-auto">
        
        {/* Section Header - Editorial Redesign */}
        <div className="flex flex-col justify-start mb-14">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-[11px] sm:text-xs font-serif font-bold text-[#C7A46A]">05</span>
            <div className="w-16 sm:w-24 h-[1px] bg-[#C7A46A]/50" />
            <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.4em] text-[#C7A46A] uppercase">
              SERVICES & PRODUCTION
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-900 pb-8 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-6xl sm:text-7xl lg:text-[110px] font-serif text-[#F4F1EA] uppercase tracking-tighter leading-[0.85] mb-6 drop-shadow-2xl">
                SERVICES
              </h2>
              <p className="text-sm sm:text-[15px] font-serif font-light text-[#A09D96] leading-relaxed max-w-lg tracking-wide">
                Comprehensive creative, production, and marketing capabilities across Events, Campaigns, and Studio Podcasts.
              </p>
            </div>
            <Link
              href="/services"
              className="group flex items-center gap-4 px-7 py-3.5 rounded-full border border-neutral-800 hover:border-[#C7A46A]/60 bg-[#0a0a0a] hover:bg-[#C7A46A]/10 transition-all duration-300"
            >
              <span className="text-[10px] font-mono text-[#E0DDD5] group-hover:text-[#C7A46A] uppercase tracking-[0.2em] transition-colors">
                EXPLORE ALL SERVICES
              </span>
              <div className="w-7 h-7 rounded-full bg-[#111111] group-hover:bg-[#C7A46A] flex items-center justify-center transition-colors">
                <ArrowUpRight size={14} className="text-[#A09D96] group-hover:text-black transition-colors" />
              </div>
            </Link>
          </div>
        </div>

        {/* 3 Main Category Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mb-12">
          <button
            onClick={() => setActiveCategory('events')}
            className={`group p-6 rounded-[14px] text-left border transition-all duration-300 flex items-center justify-between ${
              activeCategory === 'events'
                ? 'bg-[#0a0a0a]/90 backdrop-blur-md border-[#C7A46A]/60 shadow-[0_4px_20px_rgba(0,0,0,0.5)]'
                : 'bg-transparent border-neutral-800/80 hover:border-[#C7A46A]/40'
            }`}
          >
            <div>
              <span className={`text-xl font-serif uppercase tracking-wide transition-colors ${activeCategory === 'events' ? 'text-[#F4F1EA]' : 'text-neutral-300 group-hover:text-[#F4F1EA]'}`}>
                Events
              </span>
            </div>
            <Calendar size={20} className={activeCategory === 'events' ? 'text-[#C7A46A]' : 'text-neutral-600'} />
          </button>

          <button
            onClick={() => setActiveCategory('campaigns')}
            className={`group p-6 rounded-[14px] text-left border transition-all duration-300 flex items-center justify-between ${
              activeCategory === 'campaigns'
                ? 'bg-[#0a0a0a]/90 backdrop-blur-md border-[#C7A46A]/60 shadow-[0_4px_20px_rgba(0,0,0,0.5)]'
                : 'bg-transparent border-neutral-800/80 hover:border-[#C7A46A]/40'
            }`}
          >
            <div>
              <span className={`text-xl font-serif uppercase tracking-wide transition-colors ${activeCategory === 'campaigns' ? 'text-[#F4F1EA]' : 'text-neutral-300 group-hover:text-[#F4F1EA]'}`}>
                Campaigns
              </span>
            </div>
            <Megaphone size={20} className={activeCategory === 'campaigns' ? 'text-[#C7A46A]' : 'text-neutral-600'} />
          </button>

          <button
            onClick={() => setActiveCategory('podcast')}
            className={`group p-6 rounded-[14px] text-left border transition-all duration-300 flex items-center justify-between ${
              activeCategory === 'podcast'
                ? 'bg-[#0a0a0a]/90 backdrop-blur-md border-[#C7A46A]/60 shadow-[0_4px_20px_rgba(0,0,0,0.5)]'
                : 'bg-transparent border-neutral-800/80 hover:border-[#C7A46A]/40'
            }`}
          >
            <div>
              <span className={`text-xl font-serif uppercase tracking-wide transition-colors ${activeCategory === 'podcast' ? 'text-[#F4F1EA]' : 'text-neutral-300 group-hover:text-[#F4F1EA]'}`}>
                Podcast
              </span>
            </div>
            <Mic size={20} className={activeCategory === 'podcast' ? 'text-[#C7A46A]' : 'text-neutral-600'} />
          </button>
        </div>

        {/* Dynamic Category View */}
        <AnimatePresence mode="wait">
          {activeCategory === 'events' && (
            <motion.div
              key="events-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="w-full"
            >
              <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 scrollbar-none">
                {eventItems.map((item, idx) => (
                  <div key={item.id} className="min-w-[85vw] sm:min-w-[360px] lg:min-w-[420px] snap-center bg-[#0a0a0a] border border-neutral-900 hover:border-[#C7A46A]/50 rounded-[20px] overflow-hidden flex flex-col group transition-all duration-500 shadow-xl">
                    <div className="h-60 relative overflow-hidden bg-neutral-950">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
                      
                      {/* Play Reel button if video is present */}
                      {(item.videoUrl || item.videoEmbedUrl) && (
                        <button
                          type="button"
                          onClick={() => setSelectedVideo({
                            title: item.title,
                            badge: item.badge,
                            videoUrl: item.videoUrl,
                            videoEmbedUrl: item.videoEmbedUrl,
                            driveFolderUrl: item.driveFolderUrl
                          })}
                          className="absolute top-4 right-4 z-10 px-3 py-1.5 rounded-full bg-black/80 hover:bg-[#C7A46A] text-[#C7A46A] hover:text-black border border-[#C7A46A]/50 backdrop-blur-md text-[9px] font-mono tracking-wider uppercase transition-all duration-300 flex items-center gap-1.5 shadow-lg group/btn cursor-pointer"
                        >
                          <Play size={10} className="fill-current" />
                          <span>PLAY REEL</span>
                        </button>
                      )}

                      <div className="absolute bottom-4 left-6 right-6">
                        <span className="text-[10px] font-mono text-[#C7A46A] tracking-[0.2em] uppercase block">
                          {item.badge}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 sm:p-8 flex-1 flex flex-col bg-[#0a0a0a]">
                      <h4 className="text-xl sm:text-2xl font-serif text-[#F4F1EA] uppercase mb-3 leading-tight group-hover:text-white transition-colors">
                        {item.title}
                      </h4>

                      {/* Real Stats Metrics Pills */}
                      {item.stats && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {item.stats.map((st) => (
                            <div key={st.label} className="px-2.5 py-1 rounded bg-[#121212] border border-neutral-800 text-[10px] font-mono flex items-center gap-1.5">
                              <span className="font-bold text-[#C7A46A]">{st.value}</span>
                              <span className="text-neutral-400">{st.label}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <p className="text-[13px] sm:text-sm text-[#A09D96] font-light leading-relaxed mb-6 flex-1">
                        {item.description}
                      </p>

                      {/* Featured Brands / IPs */}
                      {item.featuredBrands && (
                        <div className="flex flex-wrap gap-1.5 mb-6">
                          {item.featuredBrands.map((brand) => (
                            <span key={brand} className="text-[9px] font-mono px-2 py-0.5 rounded bg-black/60 text-neutral-400 border border-neutral-800/80">
                              {brand}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <div className="pt-5 border-t border-neutral-900 flex justify-between items-center">
                        <Link href={`/services/events/${item.slug}`} className="inline-flex items-center gap-2 text-[10px] font-mono text-[#E0DDD5] group-hover:text-[#C7A46A] uppercase tracking-[0.2em] transition-colors">
                          <span>EXPLORE FORMAT</span>
                          <ArrowUpRight size={14} />
                        </Link>
                        <span className="text-[10px] font-mono text-neutral-600">0{idx + 1}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeCategory === 'campaigns' && (
            <motion.div
              key="campaigns-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="w-full"
            >
              <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 scrollbar-none">
                {campaignItems.map((item, idx) => (
                  <div key={item.id} className="min-w-[85vw] sm:min-w-[360px] lg:min-w-[420px] snap-center bg-[#0a0a0a] border border-neutral-900 hover:border-[#C7A46A]/50 rounded-[20px] overflow-hidden flex flex-col group transition-all duration-500 shadow-xl">
                    <div className="h-60 relative overflow-hidden bg-neutral-950">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
                      
                      {/* Play Reel button if video is present */}
                      {(item.videoUrl || item.videoEmbedUrl) && (
                        <button
                          type="button"
                          onClick={() => setSelectedVideo({
                            title: item.title,
                            badge: item.badge,
                            videoUrl: item.videoUrl,
                            videoEmbedUrl: item.videoEmbedUrl,
                            driveFolderUrl: item.driveFolderUrl
                          })}
                          className="absolute top-4 right-4 z-10 px-3 py-1.5 rounded-full bg-black/80 hover:bg-[#C7A46A] text-[#C7A46A] hover:text-black border border-[#C7A46A]/50 backdrop-blur-md text-[9px] font-mono tracking-wider uppercase transition-all duration-300 flex items-center gap-1.5 shadow-lg group/btn cursor-pointer"
                        >
                          <Play size={10} className="fill-current" />
                          <span>PLAY REEL</span>
                        </button>
                      )}

                      <div className="absolute bottom-4 left-6 right-6">
                        <span className="text-[10px] font-mono text-[#C7A46A] tracking-[0.2em] uppercase block">
                          {item.badge}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 sm:p-8 flex-1 flex flex-col bg-[#0a0a0a]">
                      <h4 className="text-xl sm:text-2xl font-serif text-[#F4F1EA] uppercase mb-3 leading-tight group-hover:text-white transition-colors">
                        {item.title}
                      </h4>

                      {/* Real Stats Metrics Pills */}
                      {item.stats && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {item.stats.map((st) => (
                            <div key={st.label} className="px-2.5 py-1 rounded bg-[#121212] border border-neutral-800 text-[10px] font-mono flex items-center gap-1.5">
                              <span className="font-bold text-[#C7A46A]">{st.value}</span>
                              <span className="text-neutral-400">{st.label}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <p className="text-[13px] sm:text-sm text-[#A09D96] font-light leading-relaxed mb-6 flex-1">
                        {item.description}
                      </p>

                      {/* Featured Brands / IPs */}
                      {item.featuredBrands && (
                        <div className="flex flex-wrap gap-1.5 mb-6">
                          {item.featuredBrands.map((brand) => (
                            <span key={brand} className="text-[9px] font-mono px-2 py-0.5 rounded bg-black/60 text-neutral-400 border border-neutral-800/80">
                              {brand}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <div className="pt-5 border-t border-neutral-900 flex justify-between items-center">
                        <Link href={`/services/campaigns/${item.slug}`} className="inline-flex items-center gap-2 text-[10px] font-mono text-[#E0DDD5] group-hover:text-[#C7A46A] uppercase tracking-[0.2em] transition-colors">
                          <span>EXPLORE FORMAT</span>
                          <ArrowUpRight size={14} />
                        </Link>
                        <span className="text-[10px] font-mono text-neutral-600">0{idx + 1}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeCategory === 'podcast' && (
            <motion.div
              key="podcast-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-[#0a0a0a]/90 backdrop-blur-md border border-neutral-900 rounded-[24px] p-8 sm:p-12 shadow-2xl"
            >
              <div className="lg:col-span-5 h-[350px] rounded-[16px] overflow-hidden editorial-image-frame border border-neutral-800 relative group/thumb">
                <img
                  src={podcastItem.image}
                  alt={podcastItem.title}
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/20 to-transparent pointer-events-none" />
                
                <button
                  type="button"
                  onClick={() => setSelectedVideo({
                    title: 'The RFR Podcast — Akhila Anand (Playback Singer)',
                    badge: 'EPISODE 01 • FULL INTERVIEW',
                    videoEmbedUrl: 'https://www.youtube.com/embed/-X_1HETQbho?autoplay=1',
                    driveFolderUrl: 'https://www.youtube.com/watch?v=-X_1HETQbho'
                  })}
                  className="absolute inset-0 flex items-center justify-center cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-full bg-black/70 backdrop-blur-md border border-[#C7A46A] flex items-center justify-center text-[#C7A46A] group-hover/thumb:bg-[#C7A46A] group-hover/thumb:text-black transition-all transform group-hover/thumb:scale-110 shadow-2xl">
                    <Play size={24} className="fill-current ml-0.5" />
                  </div>
                </button>

                <div className="absolute bottom-5 left-5 right-5 pointer-events-none">
                  <span className="text-[10px] font-mono text-[#C7A46A] uppercase tracking-[0.2em] block mb-1">
                    {podcastItem.badge}
                  </span>
                  <span className="text-xl font-serif text-white uppercase">THE RFR PODCAST STUDIO</span>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-6">
                <div>
                  <span className="text-[10px] font-mono text-[#C7A46A] uppercase tracking-[0.25em] block mb-3">
                    STUDIO DIALOGUES • RIYAS
                  </span>
                  <h3 className="text-3xl sm:text-4xl font-serif text-[#F4F1EA] uppercase leading-[1.15] tracking-tight">
                    CONVERSATIONS BEYOND THE RUNWAY
                  </h3>
                </div>

                {podcastItem.stats && (
                  <div className="flex flex-wrap gap-2.5">
                    {podcastItem.stats.map((st) => (
                      <div key={st.label} className="px-3 py-1.5 rounded-lg bg-[#141414] border border-neutral-800 text-[11px] font-mono flex items-center gap-2">
                        <span className="font-bold text-[#C7A46A]">{st.value}</span>
                        <span className="text-neutral-400">{st.label}</span>
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-[13px] sm:text-[15px] text-[#A09D96] font-light leading-relaxed max-w-2xl tracking-wide">
                  {podcastItem.detailedOverview}
                </p>

                <div className="flex flex-col gap-3 pt-4 border-t border-neutral-900/50">
                  <div className="flex items-start gap-4 text-xs sm:text-[13px] text-[#A09D96] font-light">
                    <Sparkles size={16} className="text-[#C7A46A] flex-shrink-0 mt-0.5 opacity-80" />
                    <span>Multi-Camera 4K Studio Episodes on YouTube</span>
                  </div>
                  <div className="flex items-start gap-4 text-xs sm:text-[13px] text-[#A09D96] font-light">
                    <Sparkles size={16} className="text-[#C7A46A] flex-shrink-0 mt-0.5 opacity-80" />
                    <span>In-depth Talks with Designers, Singers & Icons</span>
                  </div>
                  <div className="flex items-start gap-4 text-xs sm:text-[13px] text-[#A09D96] font-light">
                    <Sparkles size={16} className="text-[#C7A46A] flex-shrink-0 mt-0.5 opacity-80" />
                    <span>Snackable Reels & Vertical Video Distribution</span>
                  </div>
                </div>

                {/* 4 YouTube Episode Badges */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest mr-1">WATCH:</span>
                  {[
                    { ep: 'EP 01', id: '-X_1HETQbho', title: 'Akhila Anand' },
                    { ep: 'EP 02', id: '8t8mJ0Z8Wiw', title: 'Studio Master' },
                    { ep: 'EP 03', id: 'BRx2vCrve6A', title: 'Couture' },
                    { ep: 'EP 04', id: 'U9NnwHpdSU4', title: 'Beyond Runway' },
                  ].map((e) => (
                    <button
                      key={e.ep}
                      type="button"
                      onClick={() => setSelectedVideo({
                        title: `The RFR Podcast — ${e.title}`,
                        badge: `${e.ep} • OFFICIAL PODCAST`,
                        videoEmbedUrl: `https://www.youtube.com/embed/${e.id}?autoplay=1`,
                        driveFolderUrl: `https://www.youtube.com/watch?v=${e.id}`
                      })}
                      className="px-3 py-1.5 rounded-xl bg-neutral-900/80 hover:bg-[#C7A46A] text-[#C7A46A] hover:text-black border border-neutral-800 hover:border-[#C7A46A] text-[10px] font-mono transition-all inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Play size={9} className="fill-current" />
                      <span className="font-bold">{e.ep}</span>
                      <span className="opacity-70">• {e.title}</span>
                    </button>
                  ))}
                </div>

                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <Link
                    href="/services/podcast"
                    className="group inline-flex items-center gap-3 bg-[#C7A46A] hover:bg-[#D4B678] text-black text-[11px] font-mono font-bold tracking-widest uppercase px-7 py-4 rounded-full transition-all"
                  >
                    <span>ENTER PODCAST STUDIO</span>
                    <ArrowUpRight size={14} className="group-hover:scale-110 transition-transform" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => setSelectedVideo({
                      title: 'The RFR Podcast — Akhila Anand (Playback Singer)',
                      badge: 'FLAGSHIP EPISODE • 4K STREAM',
                      videoEmbedUrl: 'https://www.youtube.com/embed/-X_1HETQbho?autoplay=1',
                      driveFolderUrl: 'https://www.youtube.com/watch?v=-X_1HETQbho'
                    })}
                    className="inline-flex items-center gap-2.5 px-6 py-4 rounded-full border border-neutral-800 hover:border-[#C7A46A] text-[#E0DDD5] hover:text-white text-[11px] font-mono tracking-widest uppercase transition-all bg-[#0a0a0a] cursor-pointer"
                  >
                    <Film size={14} className="text-[#C7A46A]" />
                    <span>WATCH FEATURED REEL</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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

      </div>
    </section>
  );
};
