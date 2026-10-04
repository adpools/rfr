import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { Layers, Calendar, Compass, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export const WhatIsRFRSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'how' | 'when' | 'what'>('how');

  const contentMap = {
    how: {
      subId: 'a',
      title: 'HOW DOES RFR OPERATE?',
      badge: 'OPERATIONAL MECHANICS',
      icon: Layers,
      description: 'RFR operates as a full-spectrum creative engine. We combine high-concept runway curation, talent scouting, influencer marketing campaigns, commercial advertising production, and experiential festival management into an integrated workflow.',
      points: [
        'End-to-end production: staging, sound, lighting, styling, casting, and choreography.',
        'Collaborative partnerships with premier luxury resort chains and regional hubs.',
        'Data-guided commercial storytelling tailored for multi-platform digital amplification.'
      ],
      linkText: 'EXPLORE OUR SERVICES',
      linkHref: '/services'
    },
    when: {
      subId: 'b',
      title: 'WHEN DO ACTIVATIONS OCCUR?',
      badge: 'SEASONAL RHYTHMS',
      icon: Calendar,
      description: 'RFR maintains year-round creative momentum through quarterly marquee events, continuous weekend flea market editions, festival countdowns, fashion weeks, and rapid-turnaround commercial shoots.',
      points: [
        'Seasonal fashion week showcases and designer holiday line releases.',
        'Multi-city Koottam Flea editions and youth experiential festivals.',
        'Year-round commercial ad film production and studio podcast recordings.'
      ],
      linkText: 'VIEW THE 2020-2026 TIMELINE',
      linkHref: '/timeline'
    },
    what: {
      subId: 'c',
      title: 'WHAT DOES RFR CREATE?',
      badge: 'OUTPUT ECOSYSTEM',
      icon: Compass,
      description: 'RFR stands for Riyas Fashion Runway — creating bespoke fashion runways, community festivals, influencer campaigns, user-generated content, billboard advertising, audio/video podcasts, and dedicated talent opportunities.',
      points: [
        'High couture runways & designer showcases.',
        'Commercial ad films & national influencer campaigns.',
        'Creative talent network spanning models, artists, and creators.'
      ],
      linkText: 'READ COMPLETE WHAT IS RFR PAGE',
      linkHref: '/what-is-rfr'
    }
  };

  const activeContent = contentMap[activeTab];
  const IconComponent = activeContent.icon;

  return (
    <section
      id="chapter-03"
      className="full-viewport-scene bg-[#060606] border-b border-neutral-900 flex flex-col justify-center relative overflow-hidden py-16 md:py-24"
    >
      <div className="editorial-container relative z-10 w-full my-auto">
        {/* Section Header - Editorial Redesign */}
        <div className="flex flex-col justify-start mb-14">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-[11px] sm:text-xs font-serif font-bold text-[#C7A46A]">03</span>
            <div className="w-16 sm:w-24 h-[1px] bg-[#C7A46A]/50" />
            <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.4em] text-[#C7A46A] uppercase">
              THE CREATIVE ARCHITECTURE
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-900 pb-8 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-6xl sm:text-7xl lg:text-[110px] font-serif text-[#F4F1EA] uppercase tracking-tighter leading-[0.85] mb-6 drop-shadow-2xl">
                WHAT IS RFR?
              </h2>
              <p className="text-sm sm:text-[15px] font-serif font-light text-[#A09D96] leading-relaxed max-w-lg tracking-wide">
                Understanding the mechanics, operational cadence, and creative outputs of Riyas Fashion Runway.
              </p>
            </div>
            <Link
              href="/what-is-rfr"
              className="group flex items-center gap-4 px-7 py-3.5 rounded-full border border-neutral-800 hover:border-[#C7A46A]/60 bg-[#0a0a0a] hover:bg-[#C7A46A]/10 transition-all duration-300"
            >
              <span className="text-[10px] font-mono text-[#E0DDD5] group-hover:text-[#C7A46A] uppercase tracking-[0.2em] transition-colors">
                EXPLORE WHAT IS RFR PAGE
              </span>
              <div className="w-7 h-7 rounded-full bg-[#111111] group-hover:bg-[#C7A46A] flex items-center justify-center transition-colors">
                <ArrowUpRight size={14} className="text-[#A09D96] group-hover:text-black transition-colors" />
              </div>
            </Link>
          </div>
        </div>

        {/* 3 Pillars Selector (How?, When?, What?) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mb-8">
          <button
            onClick={() => setActiveTab('how')}
            className={`group p-6 rounded-[14px] text-left border transition-all duration-300 flex items-center justify-between ${
              activeTab === 'how'
                ? 'bg-[#0a0a0a]/90 backdrop-blur-md border-[#C7A46A]/60 shadow-[0_4px_20px_rgba(0,0,0,0.5)]'
                : 'bg-transparent border-neutral-800/80 hover:border-[#C7A46A]/40'
            }`}
          >
            <div>
              <span className={`text-xl font-serif uppercase tracking-wide transition-colors ${activeTab === 'how' ? 'text-[#F4F1EA]' : 'text-neutral-300 group-hover:text-[#F4F1EA]'}`}>
                How?
              </span>
            </div>
            <Layers size={20} className={activeTab === 'how' ? 'text-[#C7A46A]' : 'text-neutral-600'} />
          </button>

          <button
            onClick={() => setActiveTab('when')}
            className={`group p-6 rounded-[14px] text-left border transition-all duration-300 flex items-center justify-between ${
              activeTab === 'when'
                ? 'bg-[#0a0a0a]/90 backdrop-blur-md border-[#C7A46A]/60 shadow-[0_4px_20px_rgba(0,0,0,0.5)]'
                : 'bg-transparent border-neutral-800/80 hover:border-[#C7A46A]/40'
            }`}
          >
            <div>
              <span className={`text-xl font-serif uppercase tracking-wide transition-colors ${activeTab === 'when' ? 'text-[#F4F1EA]' : 'text-neutral-300 group-hover:text-[#F4F1EA]'}`}>
                When?
              </span>
            </div>
            <Calendar size={20} className={activeTab === 'when' ? 'text-[#C7A46A]' : 'text-neutral-600'} />
          </button>

          <button
            onClick={() => setActiveTab('what')}
            className={`group p-6 rounded-[14px] text-left border transition-all duration-300 flex items-center justify-between ${
              activeTab === 'what'
                ? 'bg-[#0a0a0a]/90 backdrop-blur-md border-[#C7A46A]/60 shadow-[0_4px_20px_rgba(0,0,0,0.5)]'
                : 'bg-transparent border-neutral-800/80 hover:border-[#C7A46A]/40'
            }`}
          >
            <div>
              <span className={`text-xl font-serif uppercase tracking-wide transition-colors ${activeTab === 'what' ? 'text-[#F4F1EA]' : 'text-neutral-300 group-hover:text-[#F4F1EA]'}`}>
                What?
              </span>
            </div>
            <Compass size={20} className={activeTab === 'what' ? 'text-[#C7A46A]' : 'text-neutral-600'} />
          </button>
        </div>

        {/* Dynamic Detail Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            className="p-8 md:p-12 rounded-[24px] bg-[#0a0a0a]/90 backdrop-blur-md border border-neutral-900 shadow-2xl flex flex-col md:flex-row gap-10 items-start justify-between mt-6"
          >
            <div className="space-y-6 flex-1">
              <div className="flex items-center gap-4">
                <span className="px-4 py-2 rounded-lg bg-[#111111] border border-neutral-800/80 text-[10px] md:text-[11px] font-mono text-[#C7A46A] uppercase tracking-[0.2em]">
                  {activeContent.badge}
                </span>
                <span className="text-[10px] md:text-[11px] font-mono text-neutral-500 uppercase tracking-widest">
                  PART {activeContent.subId.toUpperCase()}
                </span>
              </div>

              <h3 className="text-3xl sm:text-4xl font-serif text-[#F4F1EA] uppercase leading-[1.15] tracking-tight">
                {activeContent.title}
              </h3>

              <p className="text-[13px] sm:text-[15px] text-[#A09D96] font-light leading-relaxed max-w-2xl tracking-wide">
                {activeContent.description}
              </p>

              <div className="space-y-4 pt-4 border-t border-neutral-900/50">
                {activeContent.points.map((pt, idx) => (
                  <div key={idx} className="flex items-start gap-4 text-xs sm:text-[13px] text-[#A09D96] font-light leading-relaxed">
                    <CheckCircle2 size={16} className="text-[#C7A46A] flex-shrink-0 mt-0.5 opacity-80" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full md:w-72 flex-shrink-0 pt-6 md:pt-0 flex flex-col justify-between h-full border-t md:border-t-0 md:border-l border-neutral-900 md:pl-10">
              <div className="w-14 h-14 rounded-[14px] bg-[#111111] border border-neutral-800/80 flex items-center justify-center text-[#C7A46A] mb-8">
                <IconComponent size={24} />
              </div>

              <div>
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-[0.2em] block mb-4">
                  NEXT STEP
                </span>
                <Link
                  href={activeContent.linkHref}
                  className="group flex items-center justify-center gap-3 bg-[#C7A46A] hover:bg-[#D4B678] text-black text-[11px] font-mono font-bold tracking-widest uppercase px-6 py-4 rounded-full transition-all w-full"
                >
                  <span>{activeContent.linkText}</span>
                  <ArrowUpRight size={14} className="group-hover:scale-110 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
