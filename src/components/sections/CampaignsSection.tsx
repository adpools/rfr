import React, { useState } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { servicesData } from '../../data/servicesData';
import { ArrowUpRight, ArrowRight } from 'lucide-react';

export const CampaignsSection: React.FC = () => {
  const campaignServices = servicesData.filter((s) => s.category === 'campaigns');
  const [activeCampaign, setActiveCampaign] = useState(campaignServices[0]);

  return (
    <section
      id="chapter-08"
      className="full-viewport-scene bg-[#0a0a0a] border-b border-neutral-900 flex flex-col justify-between relative overflow-hidden"
    >
      {/* Dynamic Full-Bleed Background Image */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeCampaign.id}
            src={activeCampaign.image}
            alt={activeCampaign.title}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 0.35, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full object-cover grayscale brightness-50"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/70 to-[#0a0a0a]/85" />
      </div>

      <div className="editorial-container relative z-10 my-auto py-10 w-full">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-neutral-800/80">
          <div>
            <div className="flex items-center gap-3 text-xs font-mono tracking-[0.35em] text-[#C7A46A] uppercase mb-2">
              <span>08</span>
              <span className="w-8 h-[1px] bg-[#C7A46A]" />
              <span>COMMERCIAL AMPLIFICATION</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif text-white uppercase tracking-tight">
              CAMPAIGNS & ADVERTISING
            </h2>
          </div>

          <Link
            href="/services/campaigns"
            data-cursor="CAMPAIGNS"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-xs font-sans tracking-[0.2em] uppercase text-[#C7A46A] hover:text-white transition-colors group"
          >
            <span>VIEW ALL 5 CAMPAIGN FORMATS</span>
            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Interactive Master Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left: Interactive Category Selector */}
          <div className="lg:col-span-6 space-y-2">
            {campaignServices.map((campaign, idx) => {
              const isSelected = activeCampaign.id === campaign.id;
              return (
                <button
                  key={campaign.id}
                  onClick={() => setActiveCampaign(campaign)}
                  onMouseEnter={() => setActiveCampaign(campaign)}
                  data-cursor="INSPECT"
                  className={`w-full text-left p-4 md:p-5 rounded-2xl transition-all duration-300 flex items-center justify-between border ${
                    isSelected
                      ? 'bg-[#141414]/90 border-[#C7A46A] shadow-xl shadow-[#C7A46A]/10'
                      : 'bg-[#101010]/50 border-neutral-850 hover:border-neutral-700 hover:bg-[#141414]/60'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`font-mono text-xs ${
                        isSelected ? 'text-[#C7A46A] font-bold' : 'text-neutral-500'
                      }`}
                    >
                      0{idx + 1}
                    </span>
                    <span
                      className={`text-lg sm:text-xl font-serif uppercase tracking-wide transition-colors ${
                        isSelected ? 'text-white font-medium' : 'text-neutral-400'
                      }`}
                    >
                      {campaign.title}
                    </span>
                  </div>
                  <ArrowRight
                    size={16}
                    className={`transition-all duration-300 ${
                      isSelected ? 'text-[#C7A46A] translate-x-1 opacity-100' : 'text-neutral-600 opacity-0'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Right: Active Detail Plate */}
          <div className="lg:col-span-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCampaign.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="p-8 md:p-10 rounded-3xl bg-[#111111]/90 backdrop-blur-xl border border-[#C7A46A]/30 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#C7A46A] uppercase px-2.5 py-1 rounded border border-[#C7A46A]/40 inline-block mb-3">
                    {activeCampaign.badge}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-serif text-white uppercase mb-3">
                    {activeCampaign.title}
                  </h3>
                  <p className="text-xs font-mono text-neutral-400 uppercase tracking-widest mb-4">
                    {activeCampaign.subheading}
                  </p>
                  <p className="text-neutral-300 text-xs md:text-sm font-light leading-relaxed mb-6">
                    {activeCampaign.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-neutral-800 flex items-center justify-between">
                  <Link
                    href={`/services/campaigns/${activeCampaign.slug}`}
                    className="btn-luxury btn-luxury-gold rounded-full text-xs inline-flex items-center gap-2"
                  >
                    <span>STRATEGY & DELIVERABLES</span>
                    <ArrowUpRight size={13} />
                  </Link>
                  <span className="text-[11px] font-mono text-neutral-500 uppercase">
                    360° REACH
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Level 05: Directional Cue */}
      <div className="scene-directional-cue">
        <span>08 / 17 • SCROLL TO PODCAST ↓</span>
      </div>
    </section>
  );
};
