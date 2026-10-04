import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Handshake, ArrowUpRight, ShieldCheck } from 'lucide-react';

export const PartnersSection: React.FC = () => {
  const enhancedSectors = [
    {
      title: 'Media Houses & Press Portals',
      desc: 'Amplifying the RFR narrative through premier editorial partnerships, digital syndication, and expansive broadcast coverage across global channels.',
    },
    {
      title: 'Digital Streaming Platforms',
      desc: 'Ensuring high-fidelity global reach by simulcasting RFR runway shows, podcasts, and digital campaigns across leading OTT networks.',
    },
    {
      title: 'Premium Luxury Venues',
      desc: 'Co-creating immersive spatial experiences by transforming high-end architectural landmarks, luxury resorts, and prime real estate into runway destinations.',
    },
    {
      title: 'Creative Agencies',
      desc: 'Collaborating with avant-garde design, PR, and advertising agencies to execute monumental brand activations and multi-channel campaigns.',
    },
    {
      title: 'Production & Cinematography',
      desc: 'Powering the visual engine of RFR with industry-leading lighting architects, 6K camera crews, and master acoustic engineering syndicates.',
    },
    {
      title: 'Talent & Artist Guilds',
      desc: 'Fostering the next generation of creative icons by partnering with elite modeling agencies, artist management firms, and casting directors.',
    }
  ];

  return (
    <section
      id="chapter-07"
      className="full-viewport-scene bg-[#050505] border-b border-neutral-900 flex flex-col justify-center relative overflow-hidden py-24 md:py-32"
    >
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#C7A46A]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#C7A46A]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="editorial-container relative z-10 w-full my-auto max-w-7xl mx-auto">
        
        {/* Section Header - Editorial Redesign */}
        <div className="flex flex-col justify-start mb-14">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-[11px] sm:text-xs font-serif font-bold text-[#C7A46A]">07</span>
            <div className="w-16 sm:w-24 h-[1px] bg-[#C7A46A]/50" />
            <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.4em] text-[#C7A46A] uppercase">
              STRATEGIC ALLIANCES
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-900 pb-8 gap-8">
            <div className="max-w-3xl">
              <h2 className="text-6xl sm:text-7xl lg:text-[110px] font-serif text-[#F4F1EA] uppercase tracking-tighter leading-[0.85] mb-6 drop-shadow-2xl">
                CHANNEL PARTNERS
              </h2>
              <p className="text-sm sm:text-[15px] font-serif font-light text-[#A09D96] leading-relaxed max-w-lg tracking-wide">
                Collaborating with luxury venue operators, premier media syndicates, production houses, and talent consultancies.
              </p>
            </div>
            <Link
              href="/partners"
              className="group flex items-center gap-4 px-7 py-3.5 rounded-full border border-neutral-800 hover:border-[#C7A46A]/60 bg-[#0a0a0a] hover:bg-[#C7A46A]/10 transition-all duration-300"
            >
              <span className="text-[10px] font-mono text-[#E0DDD5] group-hover:text-[#C7A46A] uppercase tracking-[0.2em] transition-colors">
                EXPLORE PARTNER SECTORS
              </span>
              <div className="w-7 h-7 rounded-full bg-[#111111] group-hover:bg-[#C7A46A] flex items-center justify-center transition-colors">
                <ArrowUpRight size={14} className="text-[#A09D96] group-hover:text-black transition-colors" />
              </div>
            </Link>
          </div>
        </div>

        {/* Sectors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {enhancedSectors.map((sector, idx) => (
            <motion.div
              key={sector.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-8 rounded-[24px] bg-[#0a0a0a]/90 backdrop-blur-md border border-neutral-900 shadow-xl hover:border-[#C7A46A]/50 transition-all duration-500 hover:-translate-y-1 flex flex-col justify-between group"
            >
              <div>
                <span className="text-[10px] font-mono text-[#C7A46A] tracking-[0.2em] uppercase block mb-4">
                  SECTOR 0{idx + 1}
                </span>
                <h3 className="text-2xl font-serif text-[#F4F1EA] uppercase mb-4 leading-tight group-hover:text-[#C7A46A] transition-colors">
                  {sector.title}
                </h3>
                <p className="text-[#A09D96] text-[13px] sm:text-sm font-light leading-relaxed mb-8">
                  {sector.desc}
                </p>
              </div>

              <div className="pt-5 border-t border-neutral-900 flex items-center justify-between text-[10px] font-mono tracking-[0.2em] text-neutral-500 uppercase">
                <span>RFR ALLIANCE</span>
                <Handshake size={16} className="text-[#C7A46A]" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="p-8 rounded-[24px] bg-[#0a0a0a]/90 backdrop-blur-md border border-neutral-900 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#111111] border border-neutral-800 flex items-center justify-center text-[#C7A46A]">
              <ShieldCheck size={18} />
            </div>
            <span className="text-sm sm:text-[15px] font-serif text-[#F4F1EA] tracking-wide">
              Interested in becoming an authorized RFR Channel Partner or Co-Producer?
            </span>
          </div>
          <Link
            href="/partners"
            className="group flex items-center gap-3 px-6 py-3 rounded-full border border-neutral-800 hover:border-[#C7A46A]/60 bg-[#111111] hover:bg-[#C7A46A]/10 transition-all duration-300"
          >
            <span className="text-[10px] font-mono font-bold text-[#E0DDD5] group-hover:text-[#C7A46A] uppercase tracking-[0.2em] transition-colors">
              PARTNER WITH US
            </span>
            <ArrowUpRight size={14} className="text-[#A09D96] group-hover:text-[#C7A46A] transition-colors" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
