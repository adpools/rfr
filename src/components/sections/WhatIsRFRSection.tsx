import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { Link } from 'wouter';
import { Layers, Calendar, Compass, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export const WhatIsRFRSection: React.FC = () => {
  const pillars = [
    {
      id: 'how',
      num: '01',
      bgText: 'HOW',
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
    {
      id: 'when',
      num: '02',
      bgText: 'WHEN',
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
    {
      id: 'what',
      num: '03',
      bgText: 'WHAT',
      title: 'WHAT DOES RFR CREATE?',
      badge: 'OUTPUT ECOSYSTEM',
      icon: Compass,
      description: 'RFR stands for Riyas Fashion Runway — creating bespoke fashion runways, community festivals, influencer campaigns, user-generated content, billboard advertising, audio/video podcasts, and dedicated talent opportunities.',
      points: [
        'High couture runways & designer showcases.',
        'Commercial ad films & national influencer campaigns.',
        'Creative talent network spanning models, artists, and creators.'
      ],
      linkText: 'READ COMPLETE OVERVIEW',
      linkHref: '/what-is-rfr'
    }
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section
      id="chapter-03"
      className="full-viewport-scene bg-[#050505] border-b border-neutral-900 flex flex-col justify-center relative overflow-hidden py-16 md:py-32"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#C7A46A]/5 via-transparent to-transparent pointer-events-none" />

      <div className="editorial-container relative z-10 w-full my-auto">
        {/* Section Header */}
        <div className="flex flex-col items-center justify-center text-center mb-20">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-8 sm:w-16 h-[1px] bg-[#C7A46A]/50" />
            <span className="text-[10px] sm:text-xs font-mono tracking-[0.4em] text-[#C7A46A] uppercase font-bold">
              THE CREATIVE ARCHITECTURE
            </span>
            <div className="w-8 sm:w-16 h-[1px] bg-[#C7A46A]/50" />
          </div>

          <h2 className="text-6xl sm:text-7xl lg:text-[100px] font-serif text-[#F4F1EA] uppercase tracking-tighter leading-[0.85] mb-8 drop-shadow-2xl">
            WHAT IS RFR?
          </h2>
          <p className="text-sm sm:text-base font-serif font-light text-[#A09D96] leading-relaxed max-w-2xl mx-auto tracking-wide">
            Understanding the mechanics, operational cadence, and creative outputs of Riyas Fashion Runway. An ecosystem built for premium experiences.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {pillars.map((pillar) => {
            const IconComponent = pillar.icon;
            return (
              <motion.div
                key={pillar.id}
                variants={itemVariants}
                className="group relative flex flex-col justify-between h-full p-8 md:p-10 rounded-[24px] bg-[#0a0a0a]/80 backdrop-blur-xl border border-neutral-800/60 hover:border-[#C7A46A]/50 overflow-hidden transition-all duration-500 hover:shadow-[0_0_40px_rgba(199,164,106,0.1)] hover:-translate-y-2"
              >
                {/* Large Background Typography */}
                <div className="absolute -bottom-10 -right-6 text-[150px] font-serif font-bold text-white/[0.02] group-hover:text-[#C7A46A]/[0.05] transition-colors duration-700 select-none pointer-events-none leading-none">
                  {pillar.bgText}
                </div>

                <div className="relative z-10 flex flex-col h-full">
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-10">
                    <div className="flex flex-col gap-3">
                      <span className="text-4xl font-serif text-[#C7A46A]/40 group-hover:text-[#C7A46A] transition-colors duration-500">
                        {pillar.num}
                      </span>
                      <span className="px-3 py-1.5 rounded-md bg-[#111111] border border-neutral-800 text-[9px] font-mono text-[#C7A46A] uppercase tracking-[0.2em] w-fit">
                        {pillar.badge}
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-[#111111] border border-neutral-800 flex items-center justify-center text-neutral-500 group-hover:text-[#C7A46A] group-hover:border-[#C7A46A]/40 transition-all duration-500 group-hover:rotate-12">
                      <IconComponent size={20} />
                    </div>
                  </div>

                  {/* Narrative */}
                  <div className="mb-10 flex-grow">
                    <h3 className="text-2xl sm:text-3xl font-serif text-[#F4F1EA] uppercase mb-4 leading-tight tracking-tight">
                      {pillar.title}
                    </h3>
                    <p className="text-[13px] sm:text-[14px] text-[#A09D96] font-light leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>

                  {/* Bullet Points */}
                  <div className="space-y-4 mb-10">
                    {pillar.points.map((pt, idx) => (
                      <div key={idx} className="flex items-start gap-4 text-xs sm:text-[13px] text-[#8C8A85] group-hover:text-[#A09D96] font-light leading-relaxed transition-colors">
                        <CheckCircle2 size={16} className="text-[#C7A46A]/50 group-hover:text-[#C7A46A] flex-shrink-0 mt-0.5 transition-colors" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="pt-6 border-t border-neutral-900/80 group-hover:border-[#C7A46A]/30 transition-colors">
                    <Link
                      href={pillar.linkHref}
                      className="inline-flex items-center gap-3 text-[11px] font-mono font-bold tracking-widest text-[#E0DDD5] group-hover:text-[#C7A46A] uppercase transition-colors"
                    >
                      <span>{pillar.linkText}</span>
                      <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
