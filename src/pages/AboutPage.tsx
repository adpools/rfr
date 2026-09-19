import React from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { SectionHeading } from '../components/common/SectionHeading';
import { motion } from 'framer-motion';
import { Sparkles, Eye, Shield, Globe } from 'lucide-react';
import { Link } from 'wouter';

export const AboutPage: React.FC = () => {
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
      title="About Riyas Fashion Runway (RFR)"
      description="Learn about RFR's foundational ethos, creative vision, and multidisciplinary ecosystem connecting fashion, brands, and talent."
    >
      <div className="editorial-container py-12 md:py-20">
        <SectionHeading
          number="ABOUT"
          category="ETHOS & FOUNDATION"
          title="FROM FASHION TO POSSIBILITY."
          subtitle="Riyas Fashion Runway is a creative platform focused on fashion, lifestyle, entertainment, advertising, events and digital media."
        />

        {/* Narrative Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center my-16">
          <div className="lg:col-span-6 space-y-6 text-neutral-300 text-base md:text-lg font-light leading-relaxed">
            <p>
              Founded by <strong className="text-white font-medium">Riyas</strong>, RFR was born out of a desire to move beyond one-dimensional event production and construct an integrated creative universe.
            </p>
            <p>
              Fashion is not merely what walks across a stage—it is the music, the visual art direction, the digital conversation, the commercial narrative, and the human faces that bring imagination to life.
            </p>
            <p>
              By uniting runway showcases, lifestyle flea markets, youth creative experiences, influencer campaigns, cinematic brand films, and studio podcasting, RFR serves as a catalyst for creative power.
            </p>
          </div>

          <div className="lg:col-span-6 h-96 md:h-[460px] rounded-3xl overflow-hidden editorial-image-frame border border-neutral-800">
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80"
              alt="About RFR Platform"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* 4 Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-8 rounded-2xl bg-[#111111] border border-neutral-800 hover:border-[#C7A46A]/40 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-[#181818] border border-neutral-700 flex items-center justify-center text-[#C7A46A] mb-5">
                  <Icon size={20} />
                </div>
                <h3 className="text-xl font-serif text-white uppercase mb-2">{p.title}</h3>
                <p className="text-xs text-neutral-400 font-light leading-relaxed">{p.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Banner */}
        <div className="mt-20 p-10 rounded-3xl bg-[#121212] border border-[#C7A46A]/30 text-center">
          <h3 className="text-3xl font-serif text-white uppercase mb-3">DISCOVER THE ECOSYSTEM</h3>
          <p className="text-neutral-400 text-sm max-w-xl mx-auto mb-6">
            Explore how RFR's divisions collaborate seamlessly to elevate brand visibility and foster creative talent.
          </p>
          <Link
            href="/what-is-rfr"
            className="btn-luxury btn-luxury-gold rounded-full"
          >
            EXPLORE WHAT IS RFR
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
};
