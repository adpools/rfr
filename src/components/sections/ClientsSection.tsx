import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Building2, Sparkles, ArrowUpRight } from 'lucide-react';
import { clientCategories } from '../../data/partnersClientsData';

export const ClientsSection: React.FC = () => {
  const featuredBrands = [
    { name: 'MANYAVAR', category: 'High-Fashion & Festive Couture' },
    { name: 'PUMA', category: 'Global Sportswear & Athleisure' },
    { name: 'MAX FASHION', category: 'Multi-Quarter Retail Campaigns' },
    { name: 'MAHINDRA', category: 'Automobile Commercial Film' },
    { name: 'UDS RESORTS', category: 'Luxury Hospitality & Runway Galas' },
    { name: 'LULU MALL', category: 'Global Fashion Week Shows' },
  ];

  return (
    <section
      id="chapter-09"
      className="full-viewport-scene bg-[#070707] border-b border-neutral-900 flex flex-col justify-center relative overflow-hidden py-16 md:py-24"
    >
      <div className="editorial-container relative z-10 w-full my-auto">
        {/* Section Header */}
        <div className="flex flex-col justify-start mb-12 pb-4">
          <div className="flex items-center gap-3 text-[10px] font-mono tracking-[0.35em] text-[#C7A46A] uppercase mb-2">
            <span>09</span>
            <span className="w-12 h-[1px] bg-[#C7A46A]" />
            <span>PORTFOLIO & VERTICALS</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-800 pb-4 gap-4">
            <div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#F4F1EA] uppercase tracking-tight">
                CLIENTS
              </h2>
              <p className="text-xs sm:text-sm font-light text-neutral-400 mt-2 max-w-xl">
                Delivering high-concept campaigns, runway showcases, and experiential brand properties for premier industry titans.
              </p>
            </div>
            <Link
              href="/clients"
              className="inline-flex items-center gap-2 text-xs font-mono text-[#C7A46A] hover:text-white uppercase tracking-wider transition-colors"
            >
              <span>VIEW FULL CLIENT PORTFOLIO</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

        {/* Featured Real-World Brands Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          {featuredBrands.map((b, idx) => (
            <motion.div
              key={b.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="p-5 rounded-2xl bg-[#111111] border border-neutral-800 hover:border-[#C7A46A]/50 transition-all text-center flex flex-col justify-center items-center h-32 group"
            >
              <span className="text-base sm:text-lg font-sculptural font-bold text-white tracking-widest group-hover:text-[#C7A46A] transition-colors">
                {b.name}
              </span>
              <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider mt-2 line-clamp-1">
                {b.category}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {clientCategories.slice(0, 6).map((cat, idx) => (
            <motion.div
              key={cat}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 + idx * 0.06 }}
              className="p-6 rounded-2xl bg-[#0c0c0c] border border-neutral-850 hover:border-[#C7A46A]/40 transition-all flex items-center justify-between"
            >
              <div>
                <span className="text-[10px] font-mono text-[#C7A46A] uppercase tracking-widest block mb-1">
                  INDUSTRY SECTOR 0{idx + 1}
                </span>
                <h4 className="text-lg font-serif text-white uppercase">{cat}</h4>
              </div>
              <Building2 size={18} className="text-neutral-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
