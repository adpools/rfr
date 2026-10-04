import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Handshake, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { partnerSectors } from '../../data/partnersClientsData';

export const PartnersSection: React.FC = () => {
  return (
    <section
      id="chapter-07"
      className="full-viewport-scene bg-[#060606] border-b border-neutral-900 flex flex-col justify-center relative overflow-hidden py-16 md:py-24"
    >
      <div className="editorial-container relative z-10 w-full my-auto">
        {/* Section Header */}
        <div className="flex flex-col justify-start mb-12 pb-4">
          <div className="flex items-center gap-3 text-[10px] font-mono tracking-[0.35em] text-[#C7A46A] uppercase mb-2">
            <span>07</span>
            <span className="w-12 h-[1px] bg-[#C7A46A]" />
            <span>STRATEGIC ALLIANCES</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-800 pb-4 gap-4">
            <div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#F4F1EA] uppercase tracking-tight">
                CHANNEL PARTNERS
              </h2>
              <p className="text-xs sm:text-sm font-light text-neutral-400 mt-2 max-w-xl">
                Collaborating with luxury venue operators, premier media syndicates, production houses, and talent consultancies.
              </p>
            </div>
            <Link
              href="/partners"
              className="inline-flex items-center gap-2 text-xs font-mono text-[#C7A46A] hover:text-white uppercase tracking-wider transition-colors"
            >
              <span>EXPLORE ALL PARTNER SECTORS</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

        {/* Sectors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {partnerSectors.slice(0, 6).map((sector, idx) => (
            <motion.div
              key={sector}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="p-6 md:p-8 rounded-2xl bg-[#0d0d0d] border border-neutral-800 hover:border-[#C7A46A]/50 transition-all flex flex-col justify-between group"
            >
              <div>
                <span className="text-[10px] font-mono text-[#C7A46A] tracking-widest uppercase block mb-3">
                  SECTOR 0{idx + 1}
                </span>
                <h3 className="text-xl font-serif text-white uppercase mb-3 leading-snug group-hover:text-[#C7A46A] transition-colors">
                  {sector}
                </h3>
                <p className="text-neutral-400 text-xs font-light leading-relaxed mb-6">
                  Providing enterprise-grade production infrastructure, broadcast media syndication, and high-prestige venues for all RFR initiatives.
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-900 flex items-center justify-between text-xs font-mono text-neutral-500">
                <span>RFR ALLIANCE</span>
                <Handshake size={14} className="text-[#C7A46A]" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="p-6 rounded-2xl bg-[#0f0f0f] border border-neutral-850 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck size={18} className="text-[#C7A46A]" />
            <span className="text-xs text-neutral-300 font-light">
              Interested in becoming an authorized RFR Channel Partner or Co-Producer?
            </span>
          </div>
          <Link
            href="/partners"
            className="px-5 py-2 rounded-xl bg-[#C7A46A] text-black text-xs font-mono uppercase tracking-wider font-semibold hover:bg-white transition-colors"
          >
            PARTNER WITH US
          </Link>
        </div>
      </div>
    </section>
  );
};
