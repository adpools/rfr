import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Trophy, Star, Award, Crown, TrendingUp, Users, Sparkles, ArrowUpRight } from 'lucide-react';

export const AchievementsSection: React.FC = () => {
  const stats = [
    { number: '100+', label: 'Marquee Runway Shows & Productions', icon: Crown },
    { number: '500+', label: 'Models & Artists Launched', icon: Users },
    { number: '50+', label: 'Commercial & Retail Brand Campaigns', icon: TrendingUp },
    { number: '5M+', label: 'Audience Footfall & Digital Reach', icon: Sparkles },
  ];

  const highlights = [
    {
      year: '2020–2026',
      title: 'Pioneering South India’s Luxury Runway Architecture',
      description: 'Engineered high-fashion stage productions, lighting choreography, and designer platforms that set benchmark production standards across major metros and luxury resorts.',
      badge: 'INDUSTRY BENCHMARK'
    },
    {
      year: 'FLAGSHIP IP',
      title: 'Koottam Flea Market & Festival Phenom',
      description: 'Conceptualized and scaled the multi-edition Koottam Flea Market IP, uniting 100+ creative vendors, live music, runway pop-ups, and over 100,000+ enthusiastic attendees.',
      badge: 'EXPERIENTIAL IP'
    },
    {
      year: 'COMMERCIAL REACH',
      title: 'Global Brands & Marquee Client Alliances',
      description: 'Executed high-impact campaigns and creative shoots for iconic labels including Manyavar, Puma, Max Fashion, Mahindra, UDS Resorts, Lulu Mall, and premier retail enterprises.',
      badge: 'ENTERPRISE TRUST'
    }
  ];

  return (
    <section
      id="chapter-04"
      className="full-viewport-scene bg-[#050505] border-b border-neutral-900 flex flex-col justify-center relative overflow-hidden py-16 md:py-24"
    >
      <div className="editorial-container relative z-10 w-full my-auto">
        {/* Section Header */}
        <div className="flex flex-col justify-start mb-12 pb-4">
          <div className="flex items-center gap-3 text-[10px] font-mono tracking-[0.35em] text-[#C7A46A] uppercase mb-2">
            <span>04</span>
            <span className="w-12 h-[1px] bg-[#C7A46A]" />
            <span>EXCELLENCE & RECOGNITION</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-800 pb-4 gap-4">
            <div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#F4F1EA] uppercase tracking-tight">
                ACHIEVEMENTS
              </h2>
              <p className="text-xs sm:text-sm font-light text-neutral-400 mt-2 max-w-xl">
                A legacy built on landmark productions, creative innovation, and setting the standard for runway excellence.
              </p>
            </div>
            <Link
              href="/achievements"
              className="inline-flex items-center gap-2 text-xs font-mono text-[#C7A46A] hover:text-white uppercase tracking-wider transition-colors"
            >
              <span>VIEW FULL ACHIEVEMENTS DOSSIER</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

        {/* 4 Numbers Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
          {stats.map((st, idx) => {
            const Icon = st.icon;
            return (
              <motion.div
                key={st.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="p-6 md:p-8 rounded-2xl bg-[#0d0d0d] border border-neutral-800 hover:border-[#C7A46A]/40 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-[#141414] border border-neutral-700 flex items-center justify-center text-[#C7A46A] mb-4">
                  <Icon size={20} />
                </div>
                <div className="text-3xl md:text-5xl font-sculptural font-bold text-[#F4F1EA] mb-2 tracking-tight">
                  {st.number}
                </div>
                <p className="text-xs text-neutral-400 font-light leading-snug uppercase tracking-wider">
                  {st.label}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* 3 Landmark Achievement Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {highlights.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 + idx * 0.1 }}
              className="p-6 md:p-8 rounded-2xl bg-[#0a0a0a] border border-neutral-800/80 hover:border-[#C7A46A]/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-[10px] font-mono text-[#C7A46A] uppercase tracking-widest px-2.5 py-0.5 rounded bg-[#161616] border border-[#C7A46A]/30">
                    {item.badge}
                  </span>
                  <span className="text-[11px] font-mono text-neutral-500">
                    {item.year}
                  </span>
                </div>
                <h3 className="text-xl font-serif text-white uppercase mb-3 group-hover:text-[#C7A46A] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-neutral-400 font-light leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-neutral-900 flex items-center justify-between text-xs text-neutral-500 font-mono">
                <span>RFR VERIFIED RECORD</span>
                <Award size={14} className="text-[#C7A46A]" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
