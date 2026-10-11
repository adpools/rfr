import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Building2, ArrowUpRight, Sparkles } from 'lucide-react';
import { clientCategories, clientsAndPartnersList } from '../../data/partnersClientsData';

export const ClientsSection: React.FC = () => {
  const featuredBrands = [
    {
      name: 'ŠKODA AUTO',
      category: 'European Automotive & Rallies',
      logo: '/images/clients/skoda.png',
      badge: 'AUTOMOTIVE'
    },
    {
      name: 'CITROËN',
      category: 'Commercial Ad Films & EV',
      logo: '/images/clients/citroen.png',
      badge: 'AUTOMOTIVE'
    },
    {
      name: 'JEEP',
      category: 'Legendary SUV & Lifestyle',
      logo: '/images/clients/jeep.png',
      badge: 'MOBILITY'
    },
    {
      name: 'MAX FASHION',
      category: 'Festive Campaigns & Runways',
      logo: '/images/clients/max.png',
      badge: 'RETAIL'
    },
    {
      name: 'R&B FASHION',
      category: 'Retail Runways & Lookbooks',
      logo: '/images/clients/rb.png',
      badge: 'FASHION'
    },
    {
      name: 'TIC GUILD',
      category: 'Trivandrum Influencers Circle',
      logo: '/images/clients/tic.png',
      badge: 'CREATORS'
    },
  ];

  return (
    <section
      id="chapter-09"
      className="full-viewport-scene bg-[#050505] border-b border-neutral-900 flex flex-col justify-center relative overflow-hidden py-24 md:py-32"
    >
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[#C7A46A]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#C7A46A]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="editorial-container relative z-10 w-full my-auto max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col justify-start mb-14">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-[11px] sm:text-xs font-serif font-bold text-[#C7A46A]">09</span>
            <div className="w-16 sm:w-24 h-[1px] bg-[#C7A46A]/50" />
            <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.4em] text-[#C7A46A] uppercase">
              PORTFOLIO & VERTICALS
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-900 pb-8 gap-8">
            <div className="max-w-3xl">
              <h2 className="text-6xl sm:text-7xl lg:text-[110px] font-sculptural font-bold text-white uppercase tracking-tight leading-[0.85] mb-6 drop-shadow-2xl">
                CLIENTS
              </h2>
              <p className="text-sm sm:text-base font-sans font-normal text-[#D4D2CD] leading-relaxed max-w-lg tracking-wide">
                Delivering high-concept campaigns, runway showcases, and experiential brand properties for premier industry titans.
              </p>
            </div>
            <Link
              href="/clients"
              className="group flex items-center gap-4 px-7 py-3.5 rounded-full border border-neutral-800 hover:border-[#C7A46A]/80 bg-[#121212] hover:bg-[#C7A46A]/15 transition-all duration-300"
            >
              <span className="text-[10px] font-mono font-bold text-[#E0DDD5] group-hover:text-[#C7A46A] uppercase tracking-[0.2em] transition-colors">
                VIEW FULL PORTFOLIO
              </span>
              <div className="w-7 h-7 rounded-full bg-[#1c1c1c] group-hover:bg-[#C7A46A] flex items-center justify-center transition-colors">
                <ArrowUpRight size={14} className="text-[#A09D96] group-hover:text-black transition-colors" />
              </div>
            </Link>
          </div>
        </div>

        {/* Featured Client Logos Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-5 mb-16">
          {featuredBrands.map((b, idx) => (
            <motion.div
              key={b.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="p-6 rounded-[22px] bg-[#121212] backdrop-blur-md border border-neutral-800 shadow-xl hover:border-[#C7A46A]/70 transition-all duration-500 hover:-translate-y-1.5 text-center flex flex-col justify-between items-center min-h-[210px] group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#C7A46A]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              {/* Badge */}
              <div className="w-full flex justify-between items-center mb-2 relative z-10">
                <span className="text-[9px] font-mono font-bold text-[#C7A46A] uppercase tracking-[0.2em]">
                  {b.badge}
                </span>
                <span className="text-[10px] font-mono font-medium text-neutral-400">
                  0{idx + 1}
                </span>
              </div>

              {/* Logo Frame */}
              <div className="relative z-10 w-full flex-1 flex items-center justify-center py-4 px-2">
                <div className="w-full h-16 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                  <img
                    src={b.logo}
                    alt={b.name}
                    className="max-h-12 w-auto max-w-full object-contain filter drop-shadow-[0_2px_12px_rgba(255,255,255,0.06)] group-hover:drop-shadow-[0_4px_20px_rgba(199,164,106,0.3)] transition-all duration-300"
                  />
                </div>
              </div>

              {/* Text Info */}
              <div className="relative z-10 pt-3 border-t border-neutral-800 w-full">
                <span className="text-xs sm:text-sm font-sculptural font-bold text-white tracking-wider group-hover:text-[#C7A46A] transition-colors block mb-1 uppercase">
                  {b.name}
                </span>
                <span className="text-[10px] font-sans font-medium text-[#A09D96] uppercase tracking-wider block truncate">
                  {b.category}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sectors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {clientCategories.slice(0, 6).map((cat, idx) => (
            <motion.div
              key={cat}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 + idx * 0.06 }}
              className="p-7 sm:p-8 rounded-[24px] bg-[#121212] border border-neutral-800 hover:border-[#C7A46A]/80 hover:bg-[#161616] shadow-2xl transition-all duration-300 flex items-center justify-between group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#C7A46A]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <div className="relative z-10 w-full flex items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-mono font-bold text-[#C7A46A] uppercase tracking-[0.25em] block mb-2.5">
                    INDUSTRY SECTOR 0{idx + 1}
                  </span>
                  <h4 className="text-xl sm:text-2xl font-sculptural font-bold text-white uppercase tracking-wider group-hover:text-[#C7A46A] transition-colors leading-snug">
                    {cat}
                  </h4>
                </div>
                <div className="w-11 h-11 rounded-full bg-[#1c1c1c] border border-neutral-700/80 flex items-center justify-center text-[#C7A46A] group-hover:scale-110 group-hover:bg-[#C7A46A] group-hover:text-black transition-all duration-300 shrink-0 shadow-md">
                  <Building2 size={18} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
