import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { ArrowUpRight, Handshake, Sparkles, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { getPageContent } from '../../services/cmsService';

const defaultBusinessCards = [
  {
    icon: Sparkles,
    title: 'Brand Campaigns',
    desc: 'Influencer marketing, UGC studios, ad films, and premium outdoor media placements.',
  },
  {
    icon: Building2,
    title: 'Runway Staging',
    desc: 'Couture showcases, designer brand launch events, and massive signature gala countdowns.',
  },
  {
    icon: Handshake,
    title: 'IP Co-Production',
    desc: 'Sponsor massive flea markets, cutting-edge podcasts, and vibrant creative talent incubators.',
  },
];

export const BusinessCTASection: React.FC = () => {
  const [data, setData] = useState({
    title: 'DO BUSINESS WITH US',
    subtitle: 'BRANDS • CREATORS • MEDIA • ENTERPRISE',
    leadNarrative: 'Partner with RFR to engineer impactful brand experiences, high-conversion commercial campaigns, couture runway presentations, and cultural initiatives.',
    cards: defaultBusinessCards,
  });

  useEffect(() => {
    getPageContent('business', {
      title: 'DO BUSINESS WITH US',
      subtitle: 'BRANDS • CREATORS • MEDIA • ENTERPRISE',
      content: {
        leadNarrative: 'Partner with RFR to engineer impactful brand experiences, high-conversion commercial campaigns, couture runway presentations, and cultural initiatives.',
        items: [
          { title: defaultBusinessCards[0].title, desc: defaultBusinessCards[0].desc },
          { title: defaultBusinessCards[1].title, desc: defaultBusinessCards[1].desc },
          { title: defaultBusinessCards[2].title, desc: defaultBusinessCards[2].desc },
        ]
      }
    }).then((res) => {
      setData((prev) => {
        const updatedCards = prev.cards.map((card, idx) => {
          if (Array.isArray(res.content?.items) && res.content.items[idx]) {
            const item = res.content.items[idx];
            return {
              ...card,
              title: item.title || card.title,
              desc: item.desc || (item as any).description || card.desc,
            };
          }
          return card;
        });

        return {
          title: res.title || prev.title,
          subtitle: res.subtitle || prev.subtitle,
          leadNarrative: res.content?.leadNarrative || prev.leadNarrative,
          cards: updatedCards,
        };
      });
    });
  }, []);

  return (
    <section
      id="chapter-06"
      className="full-viewport-scene bg-[#050505] border-b border-neutral-900 flex flex-col justify-center relative overflow-hidden py-24 md:py-32"
    >
      {/* Background Glowing Orb Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#C7A46A]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="editorial-container relative z-10 my-auto py-10 text-center max-w-6xl mx-auto w-full">
        {/* Number & Label */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-4 text-[10px] sm:text-xs font-mono tracking-[0.4em] text-[#C7A46A] uppercase mb-8"
        >
          <span className="font-serif font-bold">06</span>
          <span className="w-16 h-[1px] bg-[#C7A46A]/50" />
          <span>COLLABORATION & ENTERPRISE</span>
        </motion.div>

        {/* Monumental Headline */}
        <motion.h2 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="text-6xl sm:text-8xl lg:text-[140px] font-serif text-[#F4F1EA] uppercase tracking-tighter leading-[0.8] mb-10 drop-shadow-2xl"
        >
          {data.title.toLowerCase() === 'do business with us' ? (
            <>
              DO BUSINESS <br />
              <span className="italic font-light text-[#C7A46A] tracking-normal">WITH US</span>
            </>
          ) : (
            data.title
          )}
        </motion.h2>

        {/* Pillars Subhead */}
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-lg sm:text-2xl font-serif text-[#E0DDD5] uppercase tracking-[0.3em] mb-6"
        >
          {data.subtitle}
        </motion.p>

        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-[#A09D96] text-sm sm:text-base font-light leading-relaxed max-w-2xl mx-auto mb-16 tracking-wide"
        >
          {data.leadNarrative}
        </motion.p>

        {/* 3 Business Collaboration Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16 text-left">
          {data.cards.map((card, idx) => {
            const IconComponent = card.icon;
            return (
              <motion.div 
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 + idx * 0.2 }}
                className="group p-8 rounded-[24px] bg-[#0a0a0a]/90 backdrop-blur-md border border-neutral-900 shadow-2xl hover:border-[#C7A46A]/60 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#C7A46A]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-[14px] bg-[#111111] border border-neutral-800/80 flex items-center justify-center text-[#C7A46A] mb-6 group-hover:scale-110 transition-transform duration-500">
                    <IconComponent size={20} />
                  </div>
                  <h4 className="text-xl font-serif text-white uppercase mb-3 tracking-wide">{card.title}</h4>
                  <p className="text-[13px] text-[#A09D96] font-light leading-relaxed">{card.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTAs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-6"
        >
          <Link
            href="/business"
            className="group flex items-center gap-4 px-8 py-4 rounded-full border border-neutral-800 hover:border-[#C7A46A]/60 bg-[#0a0a0a] hover:bg-[#C7A46A]/10 transition-all duration-300 shadow-xl"
          >
            <span className="text-[11px] font-mono font-bold text-[#E0DDD5] group-hover:text-[#C7A46A] uppercase tracking-[0.2em] transition-colors">
              EXPLORE BUSINESS PORTAL
            </span>
            <div className="w-8 h-8 rounded-full bg-[#111111] group-hover:bg-[#C7A46A] flex items-center justify-center transition-colors">
              <ArrowUpRight size={16} className="text-[#A09D96] group-hover:text-black transition-colors" />
            </div>
          </Link>

          <Link
            href="/contact"
            className="px-8 py-4 rounded-full border border-neutral-800 hover:border-[#C7A46A]/50 bg-transparent text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-neutral-400 hover:text-[#C7A46A] transition-all duration-300"
          >
            INITIATE PROPOSAL
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
