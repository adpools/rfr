import React, { useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { SectionHeading } from '../components/common/SectionHeading';
import { servicesData } from '../data/servicesData';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'wouter';

export const ServicesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'events' | 'campaigns' | 'podcast'>('all');

  const filtered = activeTab === 'all'
    ? servicesData
    : servicesData.filter((s) => s.category === activeTab);

  return (
    <PageWrapper
      title="Services & Capabilities Spectrum"
      description="Explore RFR's 10 major service categories across Events, Campaigns, Advertising, UGC, OOH, and Podcast Studio."
    >
      <div className="editorial-container py-12 md:py-20">
        <SectionHeading
          number="SERVICES"
          category="PORTFOLIO SPECTRUM"
          title="SERVICES & CREATIVE IP"
          subtitle="Explore the complete spectrum of experiential event productions, commercial campaigns, influencer amplification, and podcast media."
        />

        {/* Filter Tabs */}
        <div className="flex items-center gap-3 overflow-x-auto pb-6 border-b border-neutral-800 mb-12">
          {[
            { id: 'all', label: 'All Services (11 IP)' },
            { id: 'events', label: 'Events & Runways' },
            { id: 'campaigns', label: 'Campaigns & Media' },
            { id: 'podcast', label: 'Podcast Studio' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'all' | 'events' | 'campaigns' | 'podcast')}
              className={`px-6 py-2.5 rounded-full text-xs font-mono uppercase tracking-widest transition-all ${
                activeTab === tab.id
                  ? 'bg-[#C7A46A] text-black font-bold'
                  : 'bg-[#121212] text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((service, idx) => {
            const detailUrl = service.category === 'podcast'
              ? '/services/podcast'
              : `/services/${service.category}/${service.slug}`;

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="rounded-2xl overflow-hidden bg-[#111111] border border-neutral-800 hover:border-[#C7A46A]/50 transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="h-64 overflow-hidden relative editorial-image-frame">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded bg-black/80 backdrop-blur-md border border-[#C7A46A]/40 text-[#C7A46A] text-[9px] font-mono tracking-widest uppercase">
                    {service.badge}
                  </div>
                </div>

                <div className="p-6 md:p-8 flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="text-xl md:text-2xl font-serif text-white uppercase tracking-wide mb-3 group-hover:text-[#C7A46A] transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-neutral-400 text-xs md:text-sm font-light leading-relaxed mb-6">
                      {service.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
                    <Link
                      href={detailUrl}
                      data-cursor="INSPECT"
                      className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-[#FAF9F6] hover:text-[#C7A46A] transition-colors uppercase"
                    >
                      <span>VIEW DETAILS</span>
                      <ArrowUpRight size={13} />
                    </Link>
                    <span className="text-[10px] font-mono text-[#C7A46A] uppercase">
                      {service.category}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </PageWrapper>
  );
};
