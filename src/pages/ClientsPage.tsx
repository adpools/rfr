import React from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { SectionHeading } from '../components/common/SectionHeading';
import { clientCategories, clientsAndPartnersList } from '../data/partnersClientsData';
import { Building2, Sparkles, ArrowUpRight } from 'lucide-react';
import { Link } from 'wouter';

export const ClientsPage: React.FC = () => {
  const clients = clientsAndPartnersList.filter((x) => x.type === 'client');

  return (
    <PageWrapper
      title="Clients & Brand Showcase"
      description="Explore the luxury fashion, lifestyle, retail, automotive, and hospitality verticals served by RFR."
    >
      <div className="editorial-container py-12 md:py-20">
        <SectionHeading
          number="CLIENTS"
          category="PORTFOLIO VERTICALS"
          title="CLIENT ECOSYSTEM"
          subtitle="Delivering high-concept campaigns, runway showcases, and experiential properties for premier brands."
        />

        {/* Sectors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-16">
          {clientCategories.map((category, idx) => (
            <div
              key={category}
              className="p-8 rounded-2xl bg-[#111111] border border-neutral-800 hover:border-[#C7A46A]/50 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono text-[#C7A46A] uppercase tracking-widest">
                  CATEGORY 0{idx + 1}
                </span>
                <Building2 size={16} className="text-neutral-500 group-hover:text-[#C7A46A] transition-colors" />
              </div>

              <h3 className="text-2xl font-serif text-white uppercase mb-3 group-hover:text-[#C7A46A] transition-colors">
                {category}
              </h3>

              <p className="text-xs text-neutral-400 font-light leading-relaxed mb-6">
                Customized fashion show staging, influencer storytelling rosters, and digital performance funnels tailored for {category.toLowerCase()} demographics.
              </p>

              <div className="pt-4 border-t border-neutral-850 flex items-center justify-between text-xs text-neutral-500 font-mono">
                <span>RFR VERIFIED VERTICAL</span>
                <Sparkles size={12} className="text-[#C7A46A]" />
              </div>
            </div>
          ))}
        </div>

        {/* Client Onboarding CTA */}
        <div className="mt-16 p-10 rounded-3xl bg-[#121212] border border-[#C7A46A]/30 text-center">
          <h3 className="text-3xl font-serif text-white uppercase mb-3">BECOME A CLIENT BRAND</h3>
          <p className="text-neutral-400 text-sm max-w-xl mx-auto mb-6">
            Elevate your next product launch, festive campaign, or runway presence with RFR.
          </p>
          <Link href="/contact" className="btn-luxury btn-luxury-gold rounded-full inline-flex items-center gap-2">
            <span>REQUEST BRAND DECK</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
};
