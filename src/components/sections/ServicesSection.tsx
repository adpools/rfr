import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { servicesData } from '../../data/servicesData';
import { ArrowUpRight, Calendar, Megaphone, Mic, Sparkles, ChevronRight } from 'lucide-react';

export const ServicesSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'events' | 'campaigns' | 'podcast'>('events');

  const eventItems = servicesData.filter((s) => s.category === 'events');
  const campaignItems = servicesData.filter((s) => s.category === 'campaigns');
  const podcastItem = servicesData.find((s) => s.category === 'podcast') || servicesData[0];

  const [selectedEvent, setSelectedEvent] = useState(eventItems[0]);
  const [selectedCampaign, setSelectedCampaign] = useState(campaignItems[0]);

  return (
    <section
      id="chapter-05"
      className="full-viewport-scene bg-[#080808] border-b border-neutral-900 flex flex-col justify-center relative overflow-hidden py-16 md:py-24"
    >
      <div className="editorial-container relative z-10 w-full my-auto">
        {/* Section Header */}
        <div className="flex flex-col justify-start mb-8 pb-4">
          <div className="flex items-center gap-3 text-[10px] font-mono tracking-[0.35em] text-[#C7A46A] uppercase mb-2">
            <span>05</span>
            <span className="w-12 h-[1px] bg-[#C7A46A]" />
            <span>SERVICES & PRODUCTION CAPABILITIES</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-800 pb-4 gap-4">
            <div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#F4F1EA] uppercase tracking-tight">
                SERVICES
              </h2>
              <p className="text-xs sm:text-sm font-light text-neutral-400 mt-2 max-w-xl">
                Comprehensive creative, production, and marketing capabilities across Events, Campaigns, and Studio Podcasts.
              </p>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-xs font-mono text-[#C7A46A] hover:text-white uppercase tracking-wider transition-colors"
            >
              <span>EXPLORE ALL SERVICES & IP</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

        {/* 3 Main Category Tabs (a. Events, b. Campaigns, c. Podcast) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          <button
            onClick={() => setActiveCategory('events')}
            className={`p-4 rounded-2xl text-left border transition-all flex items-center justify-between ${
              activeCategory === 'events'
                ? 'bg-[#121212] border-[#C7A46A] shadow-[0_0_15px_rgba(199,164,106,0.15)]'
                : 'bg-[#0a0a0a] border-neutral-850 hover:border-neutral-700'
            }`}
          >
            <div>
              <span className="text-[10px] font-mono text-[#C7A46A] uppercase tracking-widest block mb-1">
                CATEGORY A (5 FORMATS)
              </span>
              <span className="text-lg font-serif text-white uppercase">a. Events</span>
            </div>
            <Calendar size={18} className={activeCategory === 'events' ? 'text-[#C7A46A]' : 'text-neutral-600'} />
          </button>

          <button
            onClick={() => setActiveCategory('campaigns')}
            className={`p-4 rounded-2xl text-left border transition-all flex items-center justify-between ${
              activeCategory === 'campaigns'
                ? 'bg-[#121212] border-[#C7A46A] shadow-[0_0_15px_rgba(199,164,106,0.15)]'
                : 'bg-[#0a0a0a] border-neutral-850 hover:border-neutral-700'
            }`}
          >
            <div>
              <span className="text-[10px] font-mono text-[#C7A46A] uppercase tracking-widest block mb-1">
                CATEGORY B (5 CHANNELS)
              </span>
              <span className="text-lg font-serif text-white uppercase">b. Campaigns</span>
            </div>
            <Megaphone size={18} className={activeCategory === 'campaigns' ? 'text-[#C7A46A]' : 'text-neutral-600'} />
          </button>

          <button
            onClick={() => setActiveCategory('podcast')}
            className={`p-4 rounded-2xl text-left border transition-all flex items-center justify-between ${
              activeCategory === 'podcast'
                ? 'bg-[#121212] border-[#C7A46A] shadow-[0_0_15px_rgba(199,164,106,0.15)]'
                : 'bg-[#0a0a0a] border-neutral-850 hover:border-neutral-700'
            }`}
          >
            <div>
              <span className="text-[10px] font-mono text-[#C7A46A] uppercase tracking-widest block mb-1">
                CATEGORY C (STUDIO IP)
              </span>
              <span className="text-lg font-serif text-white uppercase">c. Podcast</span>
            </div>
            <Mic size={18} className={activeCategory === 'podcast' ? 'text-[#C7A46A]' : 'text-neutral-600'} />
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
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#0d0d0d] border border-neutral-800 rounded-3xl p-6 sm:p-8"
            >
              {/* Left: 5 Event Formats */}
              <div className="lg:col-span-5 space-y-2">
                <span className="text-[10px] font-mono text-[#C7A46A] uppercase tracking-widest block mb-2">
                  SELECT EVENT FORMAT
                </span>
                {eventItems.map((ev, idx) => {
                  const isSelected = selectedEvent.id === ev.id;
                  const romanNumbers = ['i', 'ii', 'iii', 'iv', 'v'];
                  return (
                    <button
                      key={ev.id}
                      onClick={() => setSelectedEvent(ev)}
                      className={`w-full p-3.5 rounded-xl text-left border transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#181818] border-[#C7A46A] text-white shadow-[0_0_10px_rgba(199,164,106,0.2)]'
                          : 'bg-[#111111] border-neutral-800 text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-[#C7A46A]">
                          {romanNumbers[idx]}.
                        </span>
                        <span className="text-sm font-serif uppercase">{ev.title.split('&')[0]}</span>
                      </div>
                      <ChevronRight size={14} className={isSelected ? 'text-[#C7A46A]' : 'text-neutral-600'} />
                    </button>
                  );
                })}
              </div>

              {/* Right: Selected Event Detail */}
              <div className="lg:col-span-7 space-y-4 border-t lg:border-t-0 lg:border-l border-neutral-800 pt-6 lg:pt-0 lg:pl-8">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-[#C7A46A] uppercase tracking-widest px-2.5 py-0.5 rounded bg-[#161616] border border-[#C7A46A]/30">
                    {selectedEvent.badge}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-serif text-white uppercase">
                  {selectedEvent.title}
                </h3>

                <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
                  {selectedEvent.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  {selectedEvent.keyHighlights.slice(0, 4).map((kh, i) => (
                    <div key={i} className="text-xs text-neutral-400 flex items-start gap-2 bg-[#121212] p-2.5 rounded-lg border border-neutral-850">
                      <Sparkles size={12} className="text-[#C7A46A] flex-shrink-0 mt-0.5" />
                      <span>{kh}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <Link
                    href={`/services/events/${selectedEvent.slug}`}
                    className="btn-luxury btn-luxury-gold rounded-xl py-2 px-6 text-xs inline-flex items-center gap-2"
                  >
                    <span>EXPLORE THIS EVENT FORMAT</span>
                    <ArrowUpRight size={14} />
                  </Link>
                </div>
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
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#0d0d0d] border border-neutral-800 rounded-3xl p-6 sm:p-8"
            >
              {/* Left: 5 Campaign Channels */}
              <div className="lg:col-span-5 space-y-2">
                <span className="text-[10px] font-mono text-[#C7A46A] uppercase tracking-widest block mb-2">
                  SELECT CAMPAIGN VERTICAL
                </span>
                {campaignItems.map((cp, idx) => {
                  const isSelected = selectedCampaign.id === cp.id;
                  const romanNumbers = ['i', 'ii', 'iii', 'iv', 'v'];
                  return (
                    <button
                      key={cp.id}
                      onClick={() => setSelectedCampaign(cp)}
                      className={`w-full p-3.5 rounded-xl text-left border transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#181818] border-[#C7A46A] text-white shadow-[0_0_10px_rgba(199,164,106,0.2)]'
                          : 'bg-[#111111] border-neutral-800 text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-[#C7A46A]">
                          {romanNumbers[idx]}.
                        </span>
                        <span className="text-sm font-serif uppercase">{cp.title.split('&')[0]}</span>
                      </div>
                      <ChevronRight size={14} className={isSelected ? 'text-[#C7A46A]' : 'text-neutral-600'} />
                    </button>
                  );
                })}
              </div>

              {/* Right: Selected Campaign Detail */}
              <div className="lg:col-span-7 space-y-4 border-t lg:border-t-0 lg:border-l border-neutral-800 pt-6 lg:pt-0 lg:pl-8">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-[#C7A46A] uppercase tracking-widest px-2.5 py-0.5 rounded bg-[#161616] border border-[#C7A46A]/30">
                    {selectedCampaign.badge}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-serif text-white uppercase">
                  {selectedCampaign.title}
                </h3>

                <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
                  {selectedCampaign.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  {selectedCampaign.keyHighlights.slice(0, 4).map((kh, i) => (
                    <div key={i} className="text-xs text-neutral-400 flex items-start gap-2 bg-[#121212] p-2.5 rounded-lg border border-neutral-850">
                      <Sparkles size={12} className="text-[#C7A46A] flex-shrink-0 mt-0.5" />
                      <span>{kh}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <Link
                    href={`/services/campaigns/${selectedCampaign.slug}`}
                    className="btn-luxury btn-luxury-gold rounded-xl py-2 px-6 text-xs inline-flex items-center gap-2"
                  >
                    <span>EXPLORE CAMPAIGN CHANNEL</span>
                    <ArrowUpRight size={14} />
                  </Link>
                </div>
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
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#0d0d0d] border border-neutral-800 rounded-3xl p-6 sm:p-10"
            >
              <div className="lg:col-span-5 h-64 sm:h-80 rounded-2xl overflow-hidden editorial-image-frame border border-neutral-800 relative">
                <img
                  src={podcastItem.image}
                  alt={podcastItem.title}
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[10px] font-mono text-[#C7A46A] uppercase tracking-widest block">
                    {podcastItem.badge}
                  </span>
                  <span className="text-lg font-serif text-white uppercase">THE RFR PODCAST STUDIO</span>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-4">
                <span className="text-[10px] font-mono text-[#C7A46A] uppercase tracking-widest block mb-1">
                  CATEGORY C • STUDIO DIALOGUES
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif text-white uppercase">
                  CONVERSATIONS BEYOND THE RUNWAY
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
                  {podcastItem.detailedOverview}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="px-3 py-1 rounded-md bg-[#161616] text-xs font-mono text-neutral-400 border border-neutral-800">
                    ✦ Video Episodes on YouTube
                  </span>
                  <span className="px-3 py-1 rounded-md bg-[#161616] text-xs font-mono text-neutral-400 border border-neutral-800">
                    ✦ Spotify & Apple Podcasts
                  </span>
                  <span className="px-3 py-1 rounded-md bg-[#161616] text-xs font-mono text-neutral-400 border border-neutral-800">
                    ✦ Viral Shorts & Reels
                  </span>
                </div>
                <div className="pt-4">
                  <Link
                    href="/services/podcast"
                    className="btn-luxury btn-luxury-gold rounded-xl py-2.5 px-6 text-xs inline-flex items-center gap-2"
                  >
                    <span>ENTER PODCAST STUDIO</span>
                    <ArrowUpRight size={14} />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
