import React from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { SectionHeading } from '../components/common/SectionHeading';
import { partnerSectors, clientsAndPartnersList } from '../data/partnersClientsData';
import { ShieldCheck, ArrowUpRight, Handshake } from 'lucide-react';
import { Link } from 'wouter';

export const PartnersPage: React.FC = () => {
  const partners = clientsAndPartnersList.filter((x) => x.type === 'partner');

  return (
    <PageWrapper
      title="Strategic Channel Partners & Alliances"
      description="Discover RFR's network of partner alliances across luxury venues, media houses, creative consultancies, and production teams."
    >
      <div className="editorial-container py-12 md:py-20">
        <SectionHeading
          number="ALLIANCES"
          category="CHANNEL PARTNERS"
          title="CHANNEL PARTNERS"
          subtitle="Collaborating with visionary media houses, luxury venue operators, technical cinematographers, and talent representation guilds."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-16">
          {partnerSectors.map((sector, idx) => (
            <div
              key={sector}
              className="p-8 rounded-2xl bg-[#111111] border border-neutral-800 hover:border-[#C7A46A]/50 transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono text-[#C7A46A] tracking-widest uppercase block mb-3">
                  PARTNER SECTOR 0{idx + 1}
                </span>
                <h3 className="text-xl font-serif text-white uppercase mb-4 leading-snug">
                  {sector}
                </h3>
                <p className="text-neutral-400 text-xs font-light leading-relaxed mb-6">
                  Providing enterprise-grade infrastructure, audience syndication, and production capabilities across all RFR initiatives.
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-800 flex items-center justify-between text-xs font-mono text-neutral-500">
                <span>RFR ALLIANCE</span>
                <Handshake size={14} className="text-[#C7A46A]" />
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 p-10 rounded-3xl bg-[#121212] border border-[#C7A46A]/30 text-center">
          <h3 className="text-3xl font-serif text-white uppercase mb-3">JOIN THE ALLIANCE NETWORK</h3>
          <p className="text-neutral-400 text-sm max-w-xl mx-auto mb-6">
            Are you a venue operator, media agency, or production specialist looking to partner with RFR?
          </p>
          <Link href="/contact" className="btn-luxury btn-luxury-gold rounded-full inline-flex items-center gap-2">
            <span>PROPOSE PARTNERSHIP</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
};
