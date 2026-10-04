import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Building2, ArrowUpRight } from 'lucide-react';
import { clientCategories } from '../../data/partnersClientsData';

export const ClientsSection: React.FC = () => {
  const featuredBrands = [
    { name: 'MANYAVAR', category: 'High-Fashion Couture', logo: 'https://logo.clearbit.com/manyavar.com' },
    { name: 'PUMA', category: 'Global Sportswear', logo: 'https://logo.clearbit.com/puma.com' },
    { name: 'MAX FASHION', category: 'Retail Campaigns', logo: 'https://logo.clearbit.com/maxfashion.in' },
    { name: 'MAHINDRA', category: 'Commercial Film', logo: 'https://logo.clearbit.com/mahindra.com' },
    { name: 'UDS RESORTS', category: 'Luxury Hospitality', logo: 'https://logo.clearbit.com/uds.co.in' },
    { name: 'LULU MALL', category: 'Global Fashion Week', logo: 'https://logo.clearbit.com/lulumall.in' },
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
              <h2 className="text-6xl sm:text-7xl lg:text-[110px] font-serif text-[#F4F1EA] uppercase tracking-tighter leading-[0.85] mb-6 drop-shadow-2xl">
                CLIENTS
              </h2>
              <p className="text-sm sm:text-[15px] font-serif font-light text-[#A09D96] leading-relaxed max-w-lg tracking-wide">
                Delivering high-concept campaigns, runway showcases, and experiential brand properties for premier industry titans.
              </p>
            </div>
            <Link
              href="/clients"
              className="group flex items-center gap-4 px-7 py-3.5 rounded-full border border-neutral-800 hover:border-[#C7A46A]/60 bg-[#0a0a0a] hover:bg-[#C7A46A]/10 transition-all duration-300"
            >
              <span className="text-[10px] font-mono text-[#E0DDD5] group-hover:text-[#C7A46A] uppercase tracking-[0.2em] transition-colors">
                VIEW FULL PORTFOLIO
              </span>
              <div className="w-7 h-7 rounded-full bg-[#111111] group-hover:bg-[#C7A46A] flex items-center justify-center transition-colors">
                <ArrowUpRight size={14} className="text-[#A09D96] group-hover:text-black transition-colors" />
              </div>
            </Link>
          </div>
        </div>

        {/* Featured Real-World Brands Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {featuredBrands.map((b, idx) => (
            <motion.div
              key={b.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="p-6 rounded-[20px] bg-[#0a0a0a]/90 backdrop-blur-md border border-neutral-900 shadow-xl hover:border-[#C7A46A]/60 transition-all duration-500 hover:-translate-y-1 text-center flex flex-col justify-center items-center h-48 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#C7A46A]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-14 h-14 bg-white rounded-full p-1.5 flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:scale-110 transition-transform duration-500">
                  <img src={b.logo} alt={b.name} className="w-full h-full object-contain rounded-full" onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/150/ffffff/000000?text=' + b.name.substring(0, 1) }} />
                </div>
                <span className="text-[11px] sm:text-xs font-sculptural font-bold text-[#E0DDD5] tracking-widest group-hover:text-[#C7A46A] transition-colors mb-1.5">
                  {b.name}
                </span>
                <span className="text-[8px] sm:text-[9px] font-mono text-neutral-500 uppercase tracking-[0.2em] line-clamp-2 px-2">
                  {b.category}
                </span>
              </div>
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
              className="p-8 rounded-[24px] bg-[#0a0a0a]/90 backdrop-blur-md border border-neutral-900 shadow-xl hover:border-[#C7A46A]/50 transition-all duration-500 flex items-center justify-between group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#C7A46A]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 w-full flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-[#C7A46A] uppercase tracking-[0.2em] block mb-3">
                    INDUSTRY SECTOR 0{idx + 1}
                  </span>
                  <h4 className="text-xl font-serif text-[#F4F1EA] uppercase tracking-wide group-hover:text-white transition-colors">{cat}</h4>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#111111] border border-neutral-800 flex items-center justify-center text-[#C7A46A] group-hover:scale-110 group-hover:bg-[#C7A46A] group-hover:text-black transition-all duration-500">
                  <Building2 size={16} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
