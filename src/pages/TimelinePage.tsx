import React, { useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { timelineData } from '../data/timelineData';
import { TimelineEventItem } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Filter, 
  Play, 
  X, 
  Calendar, 
  MapPin, 
  Tv, 
  Music, 
  Megaphone, 
  Video, 
  ExternalLink,
  ChevronRight,
  Layers
} from 'lucide-react';

export const TimelinePage: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeVideoEvent, setActiveVideoEvent] = useState<TimelineEventItem | null>(null);

  const categories = [
    { id: 'all', label: 'All Disciplines' },
    { id: 'Event', label: 'Events & Galas' },
    { id: 'Campaign', label: 'Influencer Campaigns' },
    { id: 'Ad', label: 'Commercial Ads' },
    { id: 'Show', label: 'Designer Shows & Shoots' },
    { id: 'Music Album', label: 'Musical Albums' },
    { id: 'Podcast', label: 'Podcasts' },
  ];

  const filteredYears = timelineData
    .filter((item) => selectedYear === 'all' || item.year === selectedYear)
    .map((yearItem) => {
      const filteredEvents = yearItem.eventsList.filter((ev) => {
        if (selectedCategory === 'all') return true;
        if (selectedCategory === 'Show' && (ev.type === 'Show' || ev.type === 'Shoot')) return true;
        return ev.type === selectedCategory;
      });
      return {
        ...yearItem,
        eventsList: filteredEvents,
      };
    })
    .filter((yearItem) => yearItem.eventsList.length > 0 || selectedCategory === 'all');

  const totalEventsCount = timelineData.reduce((acc, curr) => acc + curr.eventsList.length, 0);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Event':
        return Calendar;
      case 'Campaign':
        return Megaphone;
      case 'Ad':
        return Tv;
      case 'Music Album':
        return Music;
      case 'Podcast':
        return Video;
      default:
        return Sparkles;
    }
  };

  return (
    <PageWrapper
      title="Timeline & Archival Chronicle (2020 — 2026)"
      description="The official archive of Riyas Fashion Runway. Explore all events, influencer campaigns, ads, shows, and musical productions from 2020 to 2026."
    >
      <div className="editorial-container py-12 md:py-20">
        
        {/* Editorial Subpage Hero Header */}
        <div className="max-w-4xl mb-12 md:mb-16">
          <div className="flex items-center gap-3 text-xs font-mono tracking-[0.35em] text-[#C7A46A] uppercase mb-4">
            <Sparkles size={14} className="text-[#C7A46A]" />
            <span>THE HISTORICAL CHRONICLE • 2020 — 2026</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-light text-white uppercase tracking-tight leading-[0.98] mb-6">
            RFR JOURNEY & <br />
            <span className="italic text-[#C7A46A] font-normal">EVENT TIMELINE.</span>
          </h1>

          <p className="text-neutral-300 text-sm md:text-base font-light leading-relaxed max-w-3xl">
            A comprehensive, verified retrospective of every landmark event, multi-quarter influencer campaign, commercial advertisement, runway showcase, and musical production spearheaded by <strong>Riyas</strong> and <strong>Riyas Fashion Runway (RFR)</strong>.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-400">
            <span className="px-3.5 py-1.5 rounded-full bg-[#141414] border border-neutral-800 text-[#C7A46A]">
              ✦ 7 Annual Chapters (2020–2026)
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-[#141414] border border-neutral-800 text-neutral-300">
              ✦ {totalEventsCount} Documented Productions
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-[#141414] border border-neutral-800 text-[#FAF9F6]">
              ✦ Video Footage & Media Enabled
            </span>
          </div>
        </div>

        {/* Museum Control Center: Year & Category Filters */}
        <div className="p-4 md:p-6 rounded-3xl bg-[#0e0e0e]/95 border border-neutral-800 backdrop-blur-2xl mb-16 shadow-2xl space-y-4">
          {/* Year Scrubber Bar */}
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-neutral-800/80">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none w-full">
              <button
                onClick={() => setSelectedYear('all')}
                className={`px-5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${
                  selectedYear === 'all'
                    ? 'bg-[#C7A46A] text-[#080808] font-bold shadow-lg shadow-[#C7A46A]/20'
                    : 'text-neutral-400 hover:text-white hover:bg-[#181818]'
                }`}
              >
                All Years (2020–2026)
              </button>
              {timelineData.map((item) => {
                const isSelected = selectedYear === item.year;
                return (
                  <button
                    key={item.year}
                    onClick={() => setSelectedYear(item.year)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-mono tracking-wider transition-all duration-300 whitespace-nowrap ${
                      isSelected
                        ? 'bg-[#C7A46A] text-[#080808] font-bold shadow-lg shadow-[#C7A46A]/20'
                        : 'text-neutral-400 hover:text-white hover:bg-[#181818]'
                    }`}
                  >
                    {item.year}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-widest mr-2 hidden sm:inline-block">
              FILTER TYPE:
            </span>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-sans transition-all duration-200 ${
                  selectedCategory === cat.id
                    ? 'bg-neutral-200 text-black font-semibold shadow-sm'
                    : 'bg-[#151515] text-neutral-400 hover:text-white hover:bg-[#202020] border border-neutral-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Timeline Sections Flow */}
        <div className="space-y-24">
          {filteredYears.map((yearItem, yearIdx) => (
            <motion.section
              key={yearItem.year}
              id={`year-${yearItem.year}`}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: yearIdx * 0.05 }}
              className="p-6 sm:p-10 md:p-12 rounded-3xl bg-[#0b0b0b] border border-neutral-800/90 relative overflow-hidden"
            >
              {/* Year Header Banner */}
              <div className="flex flex-col lg:flex-row lg:items-end justify-between pb-8 mb-10 border-b border-neutral-800 gap-6">
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-5xl sm:text-7xl lg:text-8xl font-sculptural font-bold text-[#C7A46A] leading-none select-none tracking-tight">
                      {yearItem.year}
                    </span>
                    <div className="space-y-1">
                      <span className="px-3 py-1 rounded-full bg-[#181818] border border-[#C7A46A]/40 text-[10px] font-mono text-[#C7A46A] uppercase tracking-widest block w-fit">
                        {yearItem.theme}
                      </span>
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif text-white uppercase tracking-wide">
                        {yearItem.title}
                      </h2>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm font-mono text-neutral-400 uppercase tracking-wider">
                    {yearItem.subtitle}
                  </p>
                </div>

                <div className="text-left lg:text-right max-w-md">
                  <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed mb-3">
                    {yearItem.description}
                  </p>
                  <span className="text-[11px] font-mono text-[#C7A46A] tracking-wider uppercase">
                    {yearItem.eventsList.length} DOCUMENTED {yearItem.eventsList.length === 1 ? 'PRODUCTION' : 'PRODUCTIONS'}
                  </span>
                </div>
              </div>

              {/* Individual Events & Productions Grid for this Year */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {yearItem.eventsList.map((event, evIdx) => {
                  const Icon = getTypeIcon(event.type);
                  return (
                    <div
                      key={event.id}
                      className="group rounded-2xl bg-[#121212] border border-neutral-800 hover:border-[#C7A46A]/60 transition-all duration-300 flex flex-col justify-between overflow-hidden relative shadow-lg hover:shadow-2xl hover:shadow-[#C7A46A]/5"
                    >
                      {/* Event Media / Thumbnail Box */}
                      <div className="h-52 sm:h-56 w-full relative overflow-hidden bg-black">
                        <img
                          src={event.image || yearItem.image}
                          alt={event.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                        
                        {/* Badges on Thumbnail */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                          <span className="px-2.5 py-1 rounded-md bg-black/85 backdrop-blur-md border border-[#C7A46A]/50 text-[10px] font-mono text-[#C7A46A] uppercase tracking-wider font-semibold">
                            {event.categoryBadge || event.type}
                          </span>
                          
                          <span className="px-2 py-1 rounded-md bg-black/75 backdrop-blur-md text-white text-[10px] font-mono flex items-center gap-1 border border-neutral-700">
                            <Icon size={11} className="text-[#C7A46A]" />
                            <span>{event.type}</span>
                          </span>
                        </div>

                        {/* Video Play Button Overlay */}
                        <button
                          onClick={() => setActiveVideoEvent(event)}
                          className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-black/70 backdrop-blur-md border border-[#C7A46A] flex items-center justify-center text-[#C7A46A] group-hover:bg-[#C7A46A] group-hover:text-black transition-all duration-300 transform group-hover:scale-110 shadow-xl"
                          title="Watch Event Video & Visuals"
                          aria-label={`Play video for ${event.name}`}
                        >
                          <Play size={18} className="fill-current ml-0.5" />
                        </button>
                      </div>

                      {/* Event Details Content */}
                      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          {event.locationOrClient && (
                            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#C7A46A] uppercase tracking-wider mb-2">
                              <MapPin size={12} className="shrink-0 text-[#C7A46A]" />
                              <span className="truncate">{event.locationOrClient}</span>
                            </div>
                          )}

                          <h3 className="text-lg sm:text-xl font-serif text-white uppercase tracking-wide group-hover:text-[#C7A46A] transition-colors leading-snug">
                            {event.name}
                          </h3>

                          {event.description && (
                            <p className="mt-2.5 text-xs text-neutral-300 font-light leading-relaxed">
                              {event.description}
                            </p>
                          )}
                        </div>

                        {/* Card Footer Actions */}
                        <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between">
                          <button
                            onClick={() => setActiveVideoEvent(event)}
                            className="inline-flex items-center gap-2 text-xs font-mono text-[#C7A46A] hover:text-white uppercase tracking-wider transition-colors"
                          >
                            <Play size={12} className="fill-current" />
                            <span>WATCH VIDEO / MEDIA</span>
                          </button>

                          <span className="text-[10px] font-mono text-neutral-500 uppercase">
                            {yearItem.year}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.section>
          ))}
        </div>

        {/* Video Player Modal */}
        <AnimatePresence>
          {activeVideoEvent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9900] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8"
              onClick={() => setActiveVideoEvent(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-4xl bg-[#111111] border border-[#C7A46A]/50 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
              >
                {/* Modal Header */}
                <div className="p-6 border-b border-neutral-800 flex items-center justify-between bg-[#141414]">
                  <div>
                    <div className="flex items-center gap-2 text-[11px] font-mono text-[#C7A46A] uppercase tracking-widest mb-1">
                      <span>{activeVideoEvent.categoryBadge || activeVideoEvent.type}</span>
                      <span>•</span>
                      <span>{activeVideoEvent.locationOrClient}</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-serif text-white uppercase">
                      {activeVideoEvent.name}
                    </h3>
                  </div>

                  <button
                    onClick={() => setActiveVideoEvent(null)}
                    aria-label="Close Video Player"
                    className="p-3 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-300 hover:text-white hover:border-[#C7A46A] transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Video Playback / Visualizer Screen */}
                <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
                  {activeVideoEvent.videoUrl ? (
                    <video
                      src={activeVideoEvent.videoUrl}
                      controls
                      autoPlay
                      className="w-full h-full object-cover"
                    />
                  ) : activeVideoEvent.videoEmbedUrl ? (
                    <iframe
                      src={activeVideoEvent.videoEmbedUrl}
                      title={activeVideoEvent.name}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="relative w-full h-full flex flex-col items-center justify-center text-center p-8 bg-gradient-to-b from-[#141414] to-[#0a0a0a]">
                      <img
                        src={activeVideoEvent.image}
                        alt={activeVideoEvent.name}
                        className="absolute inset-0 w-full h-full object-cover opacity-30 filter blur-sm"
                      />
                      <div className="relative z-10 max-w-lg space-y-4">
                        <div className="w-16 h-16 rounded-full bg-[#C7A46A]/20 border border-[#C7A46A] flex items-center justify-center text-[#C7A46A] mx-auto shadow-lg">
                          <Video size={28} />
                        </div>
                        <h4 className="text-2xl font-serif text-white uppercase">
                          {activeVideoEvent.name}
                        </h4>
                        <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
                          {activeVideoEvent.description}
                        </p>
                        <div className="pt-2">
                          <span className="inline-block px-4 py-2 rounded-xl bg-[#C7A46A] text-black text-xs font-mono font-bold tracking-widest uppercase">
                            ARCHIVAL FOOTAGE & CINEMATIC REEL
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal Footer Notes */}
                <div className="p-6 bg-[#141414] border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-[#C7A46A]" />
                    <span>RFR Archival Reel • Riyas Fashion Runway Production</span>
                  </div>

                  <button
                    onClick={() => setActiveVideoEvent(null)}
                    className="px-5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-mono text-xs uppercase tracking-wider transition-colors"
                  >
                    Close Player
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </PageWrapper>
  );
};
