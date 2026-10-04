import React, { useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { SectionHeading } from '../components/common/SectionHeading';
import { motion } from 'framer-motion';
import { Sparkles, Eye, Shield, Globe, Award, Image as ImageIcon, Briefcase, User, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import { founderData } from '../data/founderData';

export const AboutPage: React.FC = () => {
  const [selectedSubTab, setSelectedSubTab] = useState<'profile' | 'about'>('profile');

  const pillars = [
    {
      icon: Eye,
      title: 'Editorial Vision',
      desc: 'Treating every presentation, lookbook, and campaign with high-fashion editorial rigor, dramatic lighting, and refined curation.',
    },
    {
      icon: Sparkles,
      title: 'Creative Synergy',
      desc: 'Bridging high couture designers, energetic creators, and commercial enterprises to generate symbiotic cultural resonance.',
    },
    {
      icon: Globe,
      title: 'International Credibility',
      desc: 'Constructing production standards, spatial set architectures, and visual storytelling capable of competing on the global stage.',
    },
    {
      icon: Shield,
      title: 'Authenticity & Talent Welfare',
      desc: 'Providing models, creators, and artists with structured commercial opportunities, transparent workflows, and respectful mentorship.',
    },
  ];

  return (
    <PageWrapper
      title="About Us — Riyas Fashion Runway (RFR)"
      description="Learn about RFR's foundational ethos, founder profile by Riyas, achievements, curated gallery, and past landmark works."
    >
      <div className="editorial-container py-12 md:py-20">
        <SectionHeading
          number="02"
          category="FOUNDATION & LEADERSHIP"
          title="ABOUT US"
          subtitle="RFR By Riyas — An integrated creative platform focused on fashion, lifestyle, entertainment, advertising, events and digital media."
        />

        {/* Sub-Navigation Tabs matching Image hierarchy: a. Founder Profile, b. About (Achievements, Gallary, Works) */}
        <div className="flex flex-wrap items-center gap-3 my-10">
          <button
            onClick={() => setSelectedSubTab('profile')}
            className={`px-6 py-3 rounded-2xl font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2.5 ${
              selectedSubTab === 'profile'
                ? 'bg-[#C7A46A] text-black font-semibold shadow-[0_0_15px_rgba(199,164,106,0.3)]'
                : 'bg-[#111111] text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            <User size={14} />
            <span>a. Riyas Personal Profile - Founder</span>
          </button>

          <button
            onClick={() => setSelectedSubTab('about')}
            className={`px-6 py-3 rounded-2xl font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2.5 ${
              selectedSubTab === 'about'
                ? 'bg-[#C7A46A] text-black font-semibold shadow-[0_0_15px_rgba(199,164,106,0.3)]'
                : 'bg-[#111111] text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            <Sparkles size={14} />
            <span>b. About (Achievements, Gallary, Works)</span>
          </button>
        </div>

        {/* Tab 1: a. Riyas Personal Profile - Founder */}
        {selectedSubTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-12"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-[#0d0d0d] border border-neutral-800 rounded-3xl p-8 lg:p-12">
              <div className="lg:col-span-5 h-96 lg:h-[480px] rounded-2xl overflow-hidden editorial-image-frame border border-[#C7A46A]/30 relative">
                <img
                  src={founderData.portraitImage}
                  alt="Riyas — Founder & Creative Director of RFR"
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-[10px] font-mono tracking-widest text-[#C7A46A] uppercase block mb-1">
                    FOUNDER & CREATIVE DIRECTOR
                  </span>
                  <h4 className="text-3xl font-serif">RIYAS</h4>
                  <p className="text-xs text-neutral-300 font-light">Riyas Fashion Runway</p>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-6 text-neutral-300 text-sm md:text-base font-light leading-relaxed">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#161616] border border-[#C7A46A]/40 text-[10px] font-mono text-[#C7A46A] uppercase tracking-widest">
                    SECTION 2.A • LEADERSHIP
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif text-white uppercase">
                  BIOGRAPHY & CREATIVE VISION
                </h3>
                <p>
                  Founded by <strong className="text-white font-medium">Riyas</strong>, RFR was born out of a desire to move beyond standard event hosting and construct a prestige multi-disciplinary creative universe.
                </p>
                <p>
                  As an acclaimed director, fashion choreographer, and production architect, Riyas has spent over a decade orchestrating high-concept runways, celebrity launches, brand commercial films, and youth cultural festivals across South India.
                </p>
                <p>
                  His philosophy unites runway elegance with community empowerment—providing models, independent designers, and emerging artists a credible, high-prestige platform to thrive.
                </p>

                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <Link href="/founder" className="btn-luxury btn-luxury-gold rounded-xl py-2.5 px-6 text-xs inline-flex items-center gap-2">
                    <span>VIEW COMPLETE FOUNDER DOSSIER</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 2: b. About with i. Achievements, ii. Gallary, iii. Works */}
        {selectedSubTab === 'about' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-12"
          >
            {/* Narrative Overview */}
            <div className="p-8 md:p-10 rounded-3xl bg-[#0e0e0e] border border-neutral-800">
              <span className="text-[10px] font-mono text-[#C7A46A] uppercase tracking-widest block mb-2">
                SECTION 2.B • THE PLATFORM ETHOS
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif text-white uppercase mb-4">
                FROM FASHION TO POSSIBILITY
              </h3>
              <p className="text-neutral-300 text-sm md:text-base font-light leading-relaxed max-w-3xl">
                Riyas Fashion Runway is an integrated platform where runway couture, commercial advertising, influencer campaigns, lifestyle flea markets, and podcast media collaborate seamlessly to transform creative vision into commercial reality.
              </p>
            </div>

            {/* 3 Sub-Blocks: i. Achievements, ii. Gallary, iii. Works */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* i. Achievements */}
              <div className="p-8 rounded-3xl bg-[#0d0d0d] border border-neutral-800 hover:border-[#C7A46A]/50 transition-all flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#161616] border border-neutral-700 flex items-center justify-center text-[#C7A46A] mb-5">
                    <Award size={22} />
                  </div>
                  <span className="text-[10px] font-mono text-[#C7A46A] uppercase tracking-widest block mb-1">
                    SUB-SECTION 2.B.I
                  </span>
                  <h4 className="text-2xl font-serif text-white uppercase mb-3 group-hover:text-[#C7A46A] transition-colors">
                    ACHIEVEMENTS
                  </h4>
                  <p className="text-xs text-neutral-400 font-light leading-relaxed mb-6">
                    100+ marquee runway showcases, 500+ talents coached and launched, and premier collaborations with Manyavar, Puma, Max Fashion, and Mahindra.
                  </p>
                </div>
                <Link
                  href="/achievements"
                  className="btn-luxury btn-luxury-gold rounded-xl text-xs py-2 px-4 text-center inline-flex items-center justify-center gap-2"
                >
                  <span>VIEW ACHIEVEMENTS</span>
                  <ArrowRight size={12} />
                </Link>
              </div>

              {/* ii. Gallary */}
              <div className="p-8 rounded-3xl bg-[#0d0d0d] border border-neutral-800 hover:border-[#C7A46A]/50 transition-all flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#161616] border border-neutral-700 flex items-center justify-center text-[#C7A46A] mb-5">
                    <ImageIcon size={22} />
                  </div>
                  <span className="text-[10px] font-mono text-[#C7A46A] uppercase tracking-widest block mb-1">
                    SUB-SECTION 2.B.II
                  </span>
                  <h4 className="text-2xl font-serif text-white uppercase mb-3 group-hover:text-[#C7A46A] transition-colors">
                    GALLARY
                  </h4>
                  <p className="text-xs text-neutral-400 font-light leading-relaxed mb-6">
                    High-definition visual archive featuring events, runway couture shows, and fashion editorial shoots across 2020–2026.
                  </p>
                </div>
                <Link
                  href="/gallery"
                  className="btn-luxury btn-luxury-gold rounded-xl text-xs py-2 px-4 text-center inline-flex items-center justify-center gap-2"
                >
                  <span>EXPLORE GALLARY</span>
                  <ArrowRight size={12} />
                </Link>
              </div>

              {/* iii. Works */}
              <div className="p-8 rounded-3xl bg-[#0d0d0d] border border-neutral-800 hover:border-[#C7A46A]/50 transition-all flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#161616] border border-neutral-700 flex items-center justify-center text-[#C7A46A] mb-5">
                    <Briefcase size={22} />
                  </div>
                  <span className="text-[10px] font-mono text-[#C7A46A] uppercase tracking-widest block mb-1">
                    SUB-SECTION 2.B.III
                  </span>
                  <h4 className="text-2xl font-serif text-white uppercase mb-3 group-hover:text-[#C7A46A] transition-colors">
                    WORKS
                  </h4>
                  <p className="text-xs text-neutral-400 font-light leading-relaxed mb-6">
                    A comprehensive timeline catalog of productions, commercial ad films, musical albums, and multi-edition Koottam Flea Market events.
                  </p>
                </div>
                <Link
                  href="/timeline"
                  className="btn-luxury btn-luxury-gold rounded-xl text-xs py-2 px-4 text-center inline-flex items-center justify-center gap-2"
                >
                  <span>DISCOVER WORKS</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* 4 Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="p-6 rounded-2xl bg-[#111111] border border-neutral-800 hover:border-[#C7A46A]/40 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-[#181818] border border-neutral-700 flex items-center justify-center text-[#C7A46A] mb-4">
                  <Icon size={18} />
                </div>
                <h3 className="text-lg font-serif text-white uppercase mb-2">{p.title}</h3>
                <p className="text-xs text-neutral-400 font-light leading-relaxed">{p.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </PageWrapper>
  );
};
