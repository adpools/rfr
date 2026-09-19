import React from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { SectionHeading } from '../components/common/SectionHeading';
import { talentData } from '../data/talentData';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'wouter';

export const AssetsNetworkPage: React.FC = () => {
  return (
    <PageWrapper
      title="The RFR Network & Talent Ecosystem"
      description="Join the RFR Network across four dedicated verticals: Careers, Models, Influencers, and Artists."
    >
      <div className="editorial-container py-12 md:py-20">
        <SectionHeading
          number="NETWORK"
          category="TALENT & ASSETS"
          title="THE RFR NETWORK"
          subtitle="A premier launchpad and collaborative ecosystem for passionate professionals, models, creators, and performing artists."
        />

        {/* 4 Portals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-16">
          {talentData.map((portal, idx) => (
            <div
              key={portal.id}
              className="p-8 md:p-10 rounded-3xl bg-[#111111] border border-neutral-800 hover:border-[#C7A46A]/50 transition-all flex flex-col justify-between group"
            >
              <div className="h-72 rounded-2xl overflow-hidden mb-6 editorial-image-frame relative">
                <img
                  src={portal.image}
                  alt={portal.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 px-3 py-1 rounded bg-black/80 backdrop-blur-md border border-[#C7A46A]/40 text-[#C7A46A] text-[10px] font-mono tracking-widest uppercase">
                  PORTAL 0{idx + 1}
                </div>
              </div>

              <div>
                <h3 className="text-2xl md:text-3xl font-serif text-white uppercase mb-2 group-hover:text-[#C7A46A] transition-colors">
                  {portal.title}
                </h3>
                <p className="text-xs text-[#C7A46A] font-mono tracking-wider uppercase mb-4">
                  {portal.tagline}
                </p>
                <p className="text-neutral-300 text-sm font-light leading-relaxed mb-6">
                  {portal.description}
                </p>
              </div>

              <div className="pt-6 border-t border-neutral-800 flex items-center justify-between">
                <Link
                  href={`/assets/${portal.id}`}
                  className="btn-luxury btn-luxury-gold rounded-full text-xs"
                >
                  <span>{portal.ctaLabel}</span>
                  <ArrowUpRight size={14} />
                </Link>
                <span className="text-xs font-mono text-neutral-500 uppercase">
                  ACTIVE INTAKE
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
};
