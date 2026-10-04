import React from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { SectionHeading } from '../components/common/SectionHeading';
import { motion } from 'framer-motion';
import { Trophy, Award, Crown, Sparkles, Star, TrendingUp, Users, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';

export const AchievementsPage: React.FC = () => {
  const metricCards = [
    { title: '100+ Flagship Productions', desc: 'Curated high-fashion runway shows, beauty pageants, countdown galas, and festival spectacles across India.' },
    { title: '500+ Talents Mentored', desc: 'Discovered, coached, groomed, and provided runway and commercial campaign exposure to hundreds of models, artists, and creators.' },
    { title: '50+ Global & National Brands', desc: 'Trusted by industry titans such as Manyavar, Puma, Max Fashion, Mahindra, Lulu Mall, and UDS Hotels.' },
    { title: '100,000+ Flea Market Attendees', desc: 'Built the Koottam Flea Market into a premier youth lifestyle and entrepreneurial cultural phenomenon.' },
    { title: '20+ Commercial Ad Campaigns', desc: 'Directed high-concept cinematic ad films and multi-quarter influencer marketing rollouts.' },
    { title: 'Multi-Edition Media Presence', desc: 'Featured across television news networks, lifestyle publications, regional press, and premier digital portals.' },
  ];

  const milestonesList = [
    {
      year: '2026',
      title: 'Global Expansion & Next-Gen Digital Production',
      details: 'Pioneering AI-integrated runway lookbooks, international fashion exchange tours, and launch of the RFR Creator Studio Residency.',
    },
    {
      year: '2025',
      title: 'The Supermodel & Haute Couture Grand Tours',
      details: 'Produced 12 marquee regional runway editions, expanded Koottam Flea to multiple city stops, and broke records in creator campaign impressions.',
    },
    {
      year: '2024',
      title: 'The Mega Runway & Media Ecosystem Boom',
      details: 'Executed high-impact commercial campaigns, expanded RFR Podcast video series, and established official partnerships with premier luxury resort chains.',
    },
    {
      year: '2023',
      title: 'The Koottam Flea Phenomenon & Brand Galas',
      details: 'Solidified the Flea Market format as a cultural staple, launched signature kids runway properties, and managed national festive campaigns.',
    },
    {
      year: '2022',
      title: 'Automotive Campaigns & Runway Dominance',
      details: 'Manyavar editorial launches, Mahindra brand commercial, and Global Fashion Week shows at Lulu Mall.',
    },
    {
      year: '2021',
      title: '3-Quarter Retail Campaigns & Music Albums',
      details: 'Delivered landmark multi-quarter Max Fashion festive influencer campaigns, released music videos, and hosted couture holiday launches.',
    },
    {
      year: '2020',
      title: 'The Historic Inception by Riyas',
      details: 'Inaugural New Year countdown and entertainment spectacle at UDS Resorts, establishing RFR’s signature luxury standard.',
    },
  ];

  return (
    <PageWrapper
      title="Achievements & Milestones — RFR By Riyas"
      description="Explore the historic achievements, accolades, records, and industry milestones achieved by Riyas Fashion Runway (RFR)."
    >
      <div className="editorial-container py-12 md:py-20">
        <SectionHeading
          number="04"
          category="EXCELLENCE & RECOGNITION"
          title="ACHIEVEMENTS"
          subtitle="A proven record of excellence in luxury fashion runways, experiential festivals, brand campaigns, and creative talent incubation."
        />

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-16">
          {metricCards.map((card, idx) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="p-8 rounded-2xl bg-[#0e0e0e] border border-neutral-800 hover:border-[#C7A46A]/50 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#161616] border border-neutral-700 flex items-center justify-center text-[#C7A46A] mb-5">
                  <Award size={20} />
                </div>
                <h3 className="text-xl font-serif text-white uppercase mb-3 group-hover:text-[#C7A46A] transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-neutral-400 font-light leading-relaxed">
                  {card.desc}
                </p>
              </div>
              <div className="pt-4 mt-6 border-t border-neutral-850 flex items-center justify-between text-xs text-[#C7A46A] font-mono">
                <span>RFR RECOGNIZED</span>
                <CheckCircle size={14} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Chronological Accolades */}
        <div className="my-20 p-8 md:p-12 rounded-3xl bg-[#0a0a0a] border border-[#C7A46A]/30">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono text-[#C7A46A] uppercase tracking-widest block mb-2">
              YEAR-BY-YEAR ACCLAIM
            </span>
            <h3 className="text-3xl md:text-4xl font-serif text-white uppercase">
              HALLMARK MILESTONES (2020 – 2026)
            </h3>
          </div>

          <div className="space-y-6">
            {milestonesList.map((m) => (
              <div
                key={m.year}
                className="p-6 md:p-8 rounded-2xl bg-[#111111] border border-neutral-800 flex flex-col md:flex-row gap-6 md:items-center justify-between"
              >
                <div className="md:w-32 flex-shrink-0">
                  <span className="text-3xl font-sculptural text-[#C7A46A] font-bold block">
                    {m.year}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-serif text-white uppercase mb-1">
                    {m.title}
                  </h4>
                  <p className="text-xs text-neutral-400 font-light leading-relaxed">
                    {m.details}
                  </p>
                </div>
                <div className="md:w-40 flex-shrink-0 text-left md:text-right">
                  <Link
                    href={`/timeline#year-${m.year}`}
                    className="inline-flex items-center gap-2 text-xs font-mono text-[#C7A46A] hover:text-white uppercase tracking-wider"
                  >
                    <span>EXPLORE YEAR</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 p-10 rounded-3xl bg-[#121212] border border-neutral-800 text-center">
          <h3 className="text-3xl font-serif text-white uppercase mb-3">CREATE YOUR NEXT MILESTONE WITH RFR</h3>
          <p className="text-neutral-400 text-sm max-w-xl mx-auto mb-6">
            Partner with RFR to engineer your brand’s most successful runway showcase, campaign, or experiential activation.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/business" className="btn-luxury btn-luxury-gold rounded-2xl">
              DO BUSINESS WITH US
            </Link>
            <Link href="/contact" className="px-6 py-3 rounded-2xl border border-neutral-700 text-xs font-mono tracking-widest uppercase text-white hover:border-[#C7A46A] hover:text-[#C7A46A] transition-colors">
              CONTACT INQUIRY DESK
            </Link>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};
