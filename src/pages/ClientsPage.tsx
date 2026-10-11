import React from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { SectionHeading } from '../components/common/SectionHeading';
import { clientCategories, clientsAndPartnersList } from '../data/partnersClientsData';
import { Building2, Sparkles, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';

export const ClientsPage: React.FC = () => {
  const clients = clientsAndPartnersList.filter((x) => x.type === 'client');
  const partners = clientsAndPartnersList.filter((x) => x.type === 'partner');
  const logoClients = clients.filter((c) => !!c.logo);

  return (
    <PageWrapper
      title="Clients & Brand Showcase"
      description="Explore the luxury fashion, lifestyle, retail, automotive, and hospitality verticals served by RFR."
    >
      <div className="editorial-container py-12 md:py-20">
        <SectionHeading
          number="CLIENTS"
          category="PORTFOLIO & PARTNERS"
          title="CLIENT ECOSYSTEM"
          subtitle="Delivering high-concept campaigns, runway showcases, and experiential properties for premier industry leaders."
        />

        {/* Featured Brand Logos Grid */}
        <div className="my-16">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-[10px] font-mono text-[#C7A46A] tracking-[0.25em] uppercase">
              FEATURED BRAND ALLIANCES
            </span>
            <div className="flex-1 h-[1px] bg-neutral-800" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
            {logoClients.map((client, idx) => (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="p-6 rounded-2xl bg-[#141414] border border-neutral-800 hover:border-[#C7A46A]/70 shadow-xl transition-all duration-300 flex flex-col justify-between items-center min-h-[220px] group"
              >
                <div className="w-full flex justify-between items-center text-[10px] font-mono font-medium text-neutral-400">
                  <span className="text-[#C7A46A] font-bold">{client.category}</span>
                  <span>0{idx + 1}</span>
                </div>

                <div className="w-full h-20 flex items-center justify-center my-3 group-hover:scale-105 transition-transform">
                  <img
                    src={client.logo}
                    alt={client.name}
                    className="max-h-14 w-auto max-w-full object-contain filter drop-shadow-[0_2px_12px_rgba(255,255,255,0.06)] group-hover:drop-shadow-[0_4px_20px_rgba(199,164,106,0.3)] transition-all"
                  />
                </div>

                <div className="w-full pt-3 border-t border-neutral-800 text-center">
                  <h4 className="text-xs sm:text-sm font-sculptural font-bold text-white uppercase tracking-wider group-hover:text-[#C7A46A] transition-colors mb-1">
                    {client.name}
                  </h4>
                  <p className="text-[10px] text-neutral-300 font-normal line-clamp-2 leading-relaxed">
                    {client.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sectors Grid */}
        <div className="my-16">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-[10px] font-mono text-[#C7A46A] tracking-[0.25em] uppercase">
              PORTFOLIO SECTOR BREAKDOWN
            </span>
            <div className="flex-1 h-[1px] bg-neutral-800" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {clientCategories.map((category, idx) => (
              <div
                key={category}
                className="p-8 rounded-2xl bg-[#141414] border border-neutral-800 hover:border-[#C7A46A]/70 transition-all duration-300 group shadow-xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono font-bold text-[#C7A46A] uppercase tracking-widest">
                    CATEGORY 0{idx + 1}
                  </span>
                  <Building2 size={18} className="text-neutral-500 group-hover:text-[#C7A46A] transition-colors" />
                </div>

                <h3 className="text-xl sm:text-2xl font-sculptural font-bold text-white uppercase mb-3 group-hover:text-[#C7A46A] transition-colors leading-snug">
                  {category}
                </h3>

                <p className="text-xs sm:text-sm text-neutral-300 font-normal leading-relaxed mb-6">
                  Customized fashion show staging, influencer storytelling rosters, and digital performance funnels tailored for {category.toLowerCase()} demographics.
                </p>

                <div className="pt-4 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400 font-mono">
                  <span>RFR VERIFIED VERTICAL</span>
                  <Sparkles size={14} className="text-[#C7A46A]" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Client Onboarding CTA */}
        <div className="mt-16 p-10 rounded-3xl bg-[#121212] border border-[#C7A46A]/30 text-center">
          <h3 className="text-3xl font-serif text-white uppercase mb-3">BECOME A CLIENT BRAND</h3>
          <p className="text-neutral-400 text-sm max-w-xl mx-auto mb-6">
            Elevate your next product launch, festive campaign, or runway presence with RFR.
          </p>
          <Link href="/contact" className="btn-luxury btn-luxury-gold rounded-2xl inline-flex items-center gap-2">
            <span>REQUEST BRAND DECK</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
};
