import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { ArrowUpRight, User, Award, Image as ImageIcon, Briefcase, Sparkles } from 'lucide-react';
import { founderData } from '../../data/founderData';

export const AboutSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'founder' | 'about'>('founder');

  return (
    <section
      id="chapter-02"
      className="full-viewport-scene bg-[#080808] border-b border-neutral-900 flex flex-col justify-center relative overflow-hidden py-16 md:py-24"
    >
      <div className="editorial-container relative z-10 w-full my-auto">
        {/* Section Header */}
        <div className="flex flex-col justify-start mb-8 pb-4">
          <div className="flex items-center gap-3 text-[10px] font-mono tracking-[0.35em] text-[#C7A46A] uppercase mb-2">
            <span>02</span>
            <span className="w-12 h-[1px] bg-[#C7A46A]" />
            <span>FOUNDATION & IDENTITY</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-800 pb-4 gap-4">
            <div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#F4F1EA] uppercase tracking-tight">
                ABOUT US
              </h2>
              <p className="text-xs sm:text-sm font-light text-neutral-400 mt-2 max-w-xl">
                Riyas Fashion Runway is an integrated creative platform built on runway heritage, artistic vision, and empowering possibility.
              </p>
            </div>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-xs font-mono text-[#C7A46A] hover:text-white uppercase tracking-wider transition-colors"
            >
              <span>VIEW FULL ABOUT PAGE</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => setActiveTab('founder')}
            className={`px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'founder'
                ? 'bg-[#C7A46A] text-black font-semibold shadow-[0_0_15px_rgba(199,164,106,0.3)]'
                : 'bg-[#111111] text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            <User size={14} />
            <span>a. Riyas Personal Profile - Founder</span>
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'about'
                ? 'bg-[#C7A46A] text-black font-semibold shadow-[0_0_15px_rgba(199,164,106,0.3)]'
                : 'bg-[#111111] text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            <Sparkles size={14} />
            <span>b. About (Achievements, Gallary, Works)</span>
          </button>
        </div>

        {/* Dynamic Tab Body */}
        <AnimatePresence mode="wait">
          {activeTab === 'founder' ? (
            <motion.div
              key="founder-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#0d0d0d] border border-neutral-800 rounded-3xl p-6 sm:p-10"
            >
              <div className="lg:col-span-5 h-80 sm:h-96 rounded-2xl overflow-hidden editorial-image-frame border border-neutral-800 relative">
                <img
                  src={founderData.portraitImage}
                  alt={founderData.name}
                  className="w-full h-full object-cover object-top grayscale hover:grayscale-0 transition-all duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[10px] font-mono text-[#C7A46A] uppercase tracking-widest block">
                    FOUNDER & CREATIVE DIRECTOR
                  </span>
                  <span className="text-xl font-serif text-white uppercase">{founderData.name}</span>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-6">
                <div>
                  <span className="text-[10px] font-mono text-[#C7A46A] tracking-widest uppercase block mb-1">
                    LEADERSHIP DOSSIER
                  </span>
                  <h3 className="text-3xl font-serif text-white uppercase mb-4">
                    THE VISIONARY BEHIND RFR
                  </h3>
                  <p className="text-sm text-neutral-300 font-light leading-relaxed mb-4">
                    {founderData.bioParagraphs[0]}
                  </p>
                  <p className="text-sm text-neutral-400 font-light leading-relaxed">
                    {founderData.bioParagraphs[1]}
                  </p>
                </div>

                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <Link href="/founder" className="btn-luxury btn-luxury-gold rounded-xl py-2.5 px-6 text-xs inline-flex items-center gap-2">
                    <span>EXPLORE FOUNDER DOSSIER</span>
                    <ArrowUpRight size={14} />
                  </Link>
                  <span className="text-xs font-mono text-neutral-500">
                    DIRECTOR • CHOREOGRAPHER • PRODUCER
                  </span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="about-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {/* i. Achievements */}
              <div className="p-6 md:p-8 rounded-2xl bg-[#0d0d0d] border border-neutral-800 hover:border-[#C7A46A]/50 transition-all flex flex-col justify-between group">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#141414] border border-neutral-700 flex items-center justify-center text-[#C7A46A] mb-4">
                    <Award size={20} />
                  </div>
                  <span className="text-[10px] font-mono text-[#C7A46A] uppercase tracking-widest block mb-1">
                    SUB-SECTION I
                  </span>
                  <h3 className="text-2xl font-serif text-white uppercase mb-2 group-hover:text-[#C7A46A] transition-colors">
                    ACHIEVEMENTS
                  </h3>
                  <p className="text-xs text-neutral-400 font-light leading-relaxed mb-6">
                    Over 100+ marquee runway showcases, 500+ talents mentored, and 50+ enterprise brand campaigns delivered with benchmark excellence.
                  </p>
                </div>
                <Link
                  href="/achievements"
                  className="inline-flex items-center gap-2 text-xs font-mono text-[#C7A46A] hover:text-white uppercase tracking-wider"
                >
                  <span>VIEW ACHIEVEMENTS</span>
                  <ArrowUpRight size={14} />
                </Link>
              </div>

              {/* ii. Gallary */}
              <div className="p-6 md:p-8 rounded-2xl bg-[#0d0d0d] border border-neutral-800 hover:border-[#C7A46A]/50 transition-all flex flex-col justify-between group">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#141414] border border-neutral-700 flex items-center justify-center text-[#C7A46A] mb-4">
                    <ImageIcon size={20} />
                  </div>
                  <span className="text-[10px] font-mono text-[#C7A46A] uppercase tracking-widest block mb-1">
                    SUB-SECTION II
                  </span>
                  <h3 className="text-2xl font-serif text-white uppercase mb-2 group-hover:text-[#C7A46A] transition-colors">
                    GALLARY
                  </h3>
                  <p className="text-xs text-neutral-400 font-light leading-relaxed mb-6">
                    A curated visual archive capturing couture runway presentations, editorial shoots, high-energy festival crowds, and behind-the-scenes artistry.
                  </p>
                </div>
                <Link
                  href="/gallery"
                  className="inline-flex items-center gap-2 text-xs font-mono text-[#C7A46A] hover:text-white uppercase tracking-wider"
                >
                  <span>EXPLORE GALLARY</span>
                  <ArrowUpRight size={14} />
                </Link>
              </div>

              {/* iii. Works */}
              <div className="p-6 md:p-8 rounded-2xl bg-[#0d0d0d] border border-neutral-800 hover:border-[#C7A46A]/50 transition-all flex flex-col justify-between group">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#141414] border border-neutral-700 flex items-center justify-center text-[#C7A46A] mb-4">
                    <Briefcase size={20} />
                  </div>
                  <span className="text-[10px] font-mono text-[#C7A46A] uppercase tracking-widest block mb-1">
                    SUB-SECTION III
                  </span>
                  <h3 className="text-2xl font-serif text-white uppercase mb-2 group-hover:text-[#C7A46A] transition-colors">
                    WORKS
                  </h3>
                  <p className="text-xs text-neutral-400 font-light leading-relaxed mb-6">
                    Landmark productions for Manyavar, Puma, Max Fashion, Mahindra, UDS Resorts, Lulu Fashion Week, and signature Koottam Flea editions.
                  </p>
                </div>
                <Link
                  href="/timeline"
                  className="inline-flex items-center gap-2 text-xs font-mono text-[#C7A46A] hover:text-white uppercase tracking-wider"
                >
                  <span>BROWSE PRODUCTIONS</span>
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
