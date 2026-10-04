import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { servicesData } from '../../data/servicesData';
import { ArrowUpRight, Calendar, Megaphone, Mic, Sparkles } from 'lucide-react';

export const ServicesSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'events' | 'campaigns' | 'podcast'>('events');

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
                  <div key={item.id} className="min-w-[85vw] sm:min-w-[350px] lg:min-w-[400px] snap-center bg-[#0a0a0a] border border-neutral-900 hover:border-[#C7A46A]/50 rounded-[20px] overflow-hidden flex flex-col group transition-all duration-500 shadow-xl">
                    <div className="h-56 relative overflow-hidden">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
                      <div className="absolute bottom-4 left-6">
                        <span className="text-[10px] font-mono text-[#C7A46A] tracking-[0.2em] uppercase">{item.badge}</span>
                      </div>
                    </div>
                    <div className="p-6 sm:p-8 flex-1 flex flex-col bg-[#0a0a0a]">
                      <h4 className="text-2xl font-serif text-[#F4F1EA] uppercase mb-4 leading-tight group-hover:text-white transition-colors">{item.title}</h4>
                      <p className="text-[13px] sm:text-sm text-[#A09D96] font-light leading-relaxed mb-8 flex-1">{item.description}</p>
                      
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
                  <div key={item.id} className="min-w-[85vw] sm:min-w-[350px] lg:min-w-[400px] snap-center bg-[#0a0a0a] border border-neutral-900 hover:border-[#C7A46A]/50 rounded-[20px] overflow-hidden flex flex-col group transition-all duration-500 shadow-xl">
                    <div className="h-56 relative overflow-hidden">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
                      <div className="absolute bottom-4 left-6">
                        <span className="text-[10px] font-mono text-[#C7A46A] tracking-[0.2em] uppercase">{item.badge}</span>
                      </div>
                    </div>
                    <div className="p-6 sm:p-8 flex-1 flex flex-col bg-[#0a0a0a]">
                      <h4 className="text-2xl font-serif text-[#F4F1EA] uppercase mb-4 leading-tight group-hover:text-white transition-colors">{item.title}</h4>
                      <p className="text-[13px] sm:text-sm text-[#A09D96] font-light leading-relaxed mb-8 flex-1">{item.description}</p>
                      
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
              <div className="lg:col-span-5 h-[350px] rounded-[16px] overflow-hidden editorial-image-frame border border-neutral-800 relative">
                <img
                  src={podcastItem.image}
                  alt={podcastItem.title}
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-5 left-5 right-5">
                  <span className="text-[10px] font-mono text-[#C7A46A] uppercase tracking-[0.2em] block mb-1">
                    {podcastItem.badge}
                  </span>
                  <span className="text-xl font-serif text-white uppercase">THE RFR PODCAST STUDIO</span>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-6">
                <div>
                  <span className="text-[10px] font-mono text-[#C7A46A] uppercase tracking-[0.25em] block mb-3">
                    STUDIO DIALOGUES
                  </span>
                  <h3 className="text-3xl sm:text-4xl font-serif text-[#F4F1EA] uppercase leading-[1.15] tracking-tight">
                    CONVERSATIONS BEYOND THE RUNWAY
                  </h3>
                </div>
                <p className="text-[13px] sm:text-[15px] text-[#A09D96] font-light leading-relaxed max-w-2xl tracking-wide">
                  {podcastItem.detailedOverview}
                </p>
                <div className="flex flex-col gap-3 pt-4 border-t border-neutral-900/50">
                  <div className="flex items-start gap-4 text-xs sm:text-[13px] text-[#A09D96] font-light">
                    <Sparkles size={16} className="text-[#C7A46A] flex-shrink-0 mt-0.5 opacity-80" />
                    <span>Video Episodes on YouTube</span>
                  </div>
                  <div className="flex items-start gap-4 text-xs sm:text-[13px] text-[#A09D96] font-light">
                    <Sparkles size={16} className="text-[#C7A46A] flex-shrink-0 mt-0.5 opacity-80" />
                    <span>Spotify & Apple Podcasts</span>
                  </div>
                  <div className="flex items-start gap-4 text-xs sm:text-[13px] text-[#A09D96] font-light">
                    <Sparkles size={16} className="text-[#C7A46A] flex-shrink-0 mt-0.5 opacity-80" />
                    <span>Viral Shorts & Reels</span>
                  </div>
                </div>
                <div className="pt-6">
                  <Link
                    href="/services/podcast"
                    className="group inline-flex items-center gap-3 bg-[#C7A46A] hover:bg-[#D4B678] text-black text-[11px] font-mono font-bold tracking-widest uppercase px-7 py-4 rounded-full transition-all"
                  >
                    <span>ENTER PODCAST STUDIO</span>
                    <ArrowUpRight size={14} className="group-hover:scale-110 transition-transform" />
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
