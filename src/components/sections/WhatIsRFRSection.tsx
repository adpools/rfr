import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Compass, Layers, Calendar, ArrowUpRight } from 'lucide-react';
import { Link } from 'wouter';

export const WhatIsRFRSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState<'what' | 'how' | 'when' | 'create'>('what');

  const steps = [
    {
      id: 'what' as const,
      tag: '01 • WHAT',
      headline: 'RIYAS FASHION RUNWAY',
      subhead: 'The Foundation',
      description: 'RFR is a fashion, lifestyle, and multi-disciplinary creative platform founded by Riyas. A dedicated ecosystem engineered to transcend conventional runway limits and bridge high fashion with cultural media.',
      icon: Compass,
      accent: 'FOUNDED BY RIYAS',
    },
    {
      id: 'how' as const,
      tag: '02 • HOW',
      headline: 'COLLABORATE. CREATE. CONNECT.',
      subhead: 'The Methodology',
      description: 'RFR creates opportunities through high-production designer showcases, commercial campaigns, curated lifestyle events, studio content, talent management, and strategic brand partnerships.',
      icon: Layers,
      accent: 'CROSS-DISCIPLINE',
    },
    {
      id: 'when' as const,
      tag: '03 • WHEN',
      headline: 'ALL YEAR ROUND.',
      subhead: 'Continuous Activation',
      description: 'RFR operates continuously across the calendar year through seasonal runway collections, festive cultural galas, community fleas, brand commercial film shoots, podcast recordings, and pop-up activations.',
      icon: Calendar,
      accent: '365 DAYS ACTIVE',
    },
    {
      id: 'create' as const,
      tag: '04 • WHAT WE CREATE',
      headline: 'MULTIDISCIPLINARY OUTPUT',
      subhead: 'Full Spectrum',
      description: 'Fashion Runways • Curated Fleas & Galas • Influencer Campaigns • Commercial Advertising • Digital & OOH Media • UGC Studio • The RFR Podcast • Brand Experiences.',
      icon: Sparkles,
      accent: '360° CREATIVE SUITE',
    },
  ];

  const current = steps.find((s) => s.id === activeStep) || steps[0];

  return (
    <section
      id="chapter-03"
      className="full-viewport-scene bg-[#080808] border-b border-neutral-900 flex flex-col justify-between relative overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-[#C7A46A]/5 blur-3xl pointer-events-none" />

      <div className="editorial-container relative z-10 my-auto py-12">
        {/* Level 01: Small Label */}
        <div className="flex items-center gap-3 text-xs font-mono tracking-[0.35em] text-[#C7A46A] uppercase mb-8">
          <span>03</span>
          <span className="w-10 h-[1px] bg-[#C7A46A]" />
          <span>THE ECOSYSTEM ARCHITECTURE</span>
        </div>

        {/* Step Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-12 border-b border-neutral-800/80 pb-4">
          {steps.map((step) => {
            const isSelected = activeStep === step.id;
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`px-5 py-2 rounded-full text-xs font-mono uppercase tracking-widest transition-all duration-300 ${
                  isSelected
                    ? 'bg-[#C7A46A] text-[#080808] font-bold shadow-lg shadow-[#C7A46A]/20 scale-105'
                    : 'bg-[#121212] text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                {step.tag}
              </button>
            );
          })}
        </div>

        {/* Interactive Scene Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -25 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
          >
            <div className="lg:col-span-8">
              <span className="text-xs font-mono tracking-widest text-[#C7A46A] uppercase block mb-3">
                {current.subhead} • {current.accent}
              </span>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif text-[#FAF9F6] uppercase tracking-tight leading-[1.0] mb-6">
                {current.headline}
              </h2>
              <p className="text-neutral-300 text-sm md:text-base font-light leading-relaxed max-w-2xl mb-8">
                {current.description}
              </p>

              <div className="flex items-center gap-4">
                <Link
                  href="/what-is-rfr"
                  className="btn-luxury btn-luxury-gold rounded-full text-xs"
                >
                  <span>DEEP DIVE INTO ECOSYSTEM</span>
                  <ArrowUpRight size={13} />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 p-8 rounded-3xl bg-[#111111] border border-[#C7A46A]/20 flex flex-col justify-between h-72">
              <div className="w-12 h-12 rounded-xl bg-[#181818] border border-neutral-700 flex items-center justify-center text-[#C7A46A]">
                <current.icon size={24} />
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block mb-1">
                  RFR PRINCIPLE
                </span>
                <span className="text-lg font-serif text-white uppercase block leading-snug">
                  {current.subhead}
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Level 05: Directional Cue */}
      <div className="scene-directional-cue">
        <span>03 / 17 • SCROLL TO TIMELINE ↓</span>
      </div>
    </section>
  );
};
