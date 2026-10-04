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
        {/* Section Header */}
        <div className="flex flex-col justify-start mb-8 pb-4">
          <div className="flex items-center gap-3 text-[10px] font-mono tracking-[0.35em] text-[#C7A46A] uppercase mb-2">
            <span>03</span>
            <span className="w-12 h-[1px] bg-[#C7A46A]" />
            <span>THE CREATIVE ARCHITECTURE</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-800 pb-4 gap-4">
            <div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#F4F1EA] uppercase tracking-tight">
                WHAT IS RFR?
              </h2>
              <p className="text-xs sm:text-sm font-light text-neutral-400 mt-2 max-w-xl">
                Understanding the mechanics, operational cadence, and creative outputs of Riyas Fashion Runway.
              </p>
            </div>
            <Link
              href="/what-is-rfr"
              className="inline-flex items-center gap-2 text-xs font-mono text-[#C7A46A] hover:text-white uppercase tracking-wider transition-colors"
            >
              <span>EXPLORE WHAT IS RFR PAGE</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

        {/* 3 Pillars Selector (a. How?, b. When?, c. What?) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          <button
            onClick={() => setActiveTab('how')}
            className={`p-4 rounded-2xl text-left border transition-all flex items-center justify-between ${
              activeTab === 'how'
                ? 'bg-[#121212] border-[#C7A46A] shadow-[0_0_15px_rgba(199,164,106,0.15)]'
                : 'bg-[#0a0a0a] border-neutral-850 hover:border-neutral-700'
            }`}
          >
            <div>
              <span className="text-[10px] font-mono text-[#C7A46A] uppercase tracking-widest block mb-1">
                SUB-SECTION A
              </span>
              <span className="text-lg font-serif text-white uppercase">a. How?</span>
            </div>
            <Layers size={18} className={activeTab === 'how' ? 'text-[#C7A46A]' : 'text-neutral-600'} />
          </button>

          <button
            onClick={() => setActiveTab('when')}
            className={`p-4 rounded-2xl text-left border transition-all flex items-center justify-between ${
              activeTab === 'when'
                ? 'bg-[#121212] border-[#C7A46A] shadow-[0_0_15px_rgba(199,164,106,0.15)]'
                : 'bg-[#0a0a0a] border-neutral-850 hover:border-neutral-700'
            }`}
          >
            <div>
              <span className="text-[10px] font-mono text-[#C7A46A] uppercase tracking-widest block mb-1">
                SUB-SECTION B
              </span>
              <span className="text-lg font-serif text-white uppercase">b. When?</span>
            </div>
            <Calendar size={18} className={activeTab === 'when' ? 'text-[#C7A46A]' : 'text-neutral-600'} />
          </button>

          <button
            onClick={() => setActiveTab('what')}
            className={`p-4 rounded-2xl text-left border transition-all flex items-center justify-between ${
              activeTab === 'what'
                ? 'bg-[#121212] border-[#C7A46A] shadow-[0_0_15px_rgba(199,164,106,0.15)]'
                : 'bg-[#0a0a0a] border-neutral-850 hover:border-neutral-700'
            }`}
          >
            <div>
              <span className="text-[10px] font-mono text-[#C7A46A] uppercase tracking-widest block mb-1">
                SUB-SECTION C
              </span>
              <span className="text-lg font-serif text-white uppercase">c. What?</span>
            </div>
            <Compass size={18} className={activeTab === 'what' ? 'text-[#C7A46A]' : 'text-neutral-600'} />
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
            className="p-8 md:p-10 rounded-3xl bg-[#0e0e0e] border border-neutral-800 flex flex-col md:flex-row gap-8 items-start justify-between"
          >
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-[#161616] border border-[#C7A46A]/30 text-[10px] font-mono text-[#C7A46A] uppercase tracking-widest">
                  {activeContent.badge}
                </span>
                <span className="text-xs font-mono text-neutral-500 uppercase">
                  PART {activeContent.subId.toUpperCase()}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif text-white uppercase">
                {activeContent.title}
              </h3>

              <p className="text-sm text-neutral-300 font-light leading-relaxed max-w-2xl">
                {activeContent.description}
              </p>

              <div className="space-y-2 pt-2">
                {activeContent.points.map((pt, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs text-neutral-300 font-light">
                    <CheckCircle2 size={14} className="text-[#C7A46A] flex-shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full md:w-64 flex-shrink-0 pt-4 md:pt-0 flex flex-col justify-between h-full border-t md:border-t-0 md:border-l border-neutral-800 md:pl-8">
              <div className="w-12 h-12 rounded-xl bg-[#161616] border border-neutral-700 flex items-center justify-center text-[#C7A46A] mb-4">
                <IconComponent size={24} />
              </div>

              <div>
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block mb-2">
                  NEXT STEP
                </span>
                <Link
                  href={activeContent.linkHref}
                  className="btn-luxury btn-luxury-gold rounded-xl text-xs py-2.5 px-4 w-full text-center inline-flex items-center justify-center gap-2"
                >
                  <span>{activeContent.linkText}</span>
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
