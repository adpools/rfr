import React, { useState, useEffect } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { SectionHeading } from '../components/common/SectionHeading';
import { ContactSection } from '../components/sections/ContactSection';
import { ArrowUpRight, Sparkles, Building2, Megaphone, Flame, Award } from 'lucide-react';
import { Link } from 'wouter';
import { getPageContent } from '../services/cmsService';

export const BusinessPage: React.FC = () => {
  const iconList = [Award, Megaphone, Flame, Building2];
  const [pageInfo, setPageInfo] = useState({
    title: 'DO BUSINESS WITH US',
    subtitle: 'Partner with RFR to engineer unforgettable brand moments, high-credibility influencer narratives, and multi-format cultural visibility.',
    models: [
      {
        title: 'Title & Headline Sponsorships',
        desc: 'Marquee naming rights, VIP hospitality suites, runway stage branding, and red-carpet dominance across flagship RFR Galas and Fashion Weeks.',
      },
      {
        title: '360° Omnichannel Campaigns',
        desc: 'Bespoke integration uniting high-production commercial films, influencer creator tiers, OOH urban billboards, and digital ad funnels.',
      },
      {
        title: 'Experiential Activations & Flea Pop-ups',
        desc: 'Custom branded retail pavilions, sensory sampling zones, and VIP lounge takeovers across high-footfall lifestyle festivals.',
      },
      {
        title: 'Strategic Production & Co-Branded IP',
        desc: 'Long-term joint venture IP development, co-branded collection drops, and dedicated podcast series seasons.',
      },
    ]
  });

  useEffect(() => {
    getPageContent('business', {
      title: 'DO BUSINESS WITH US',
      subtitle: 'Partner with RFR to engineer unforgettable brand moments, high-credibility influencer narratives, and multi-format cultural visibility.',
      content: {
        items: pageInfo.models
      }
    }).then((res) => {
      setPageInfo({
        title: res.title || 'DO BUSINESS WITH US',
        subtitle: res.subtitle || 'Partner with RFR to engineer unforgettable brand moments, high-credibility influencer narratives, and multi-format cultural visibility.',
        models: (res.content.items && res.content.items.length > 0) ? res.content.items : pageInfo.models
      });
    });
  }, []);

  return (
    <PageWrapper
      title="Do Business With Us — Enterprise Collaborations & Partnerships"
      description="Partner with Riyas Fashion Runway (RFR) for brand sponsorships, influencer campaigns, experiential retail activations, and commercial media."
    >
      <div className="editorial-container py-12 md:py-20">
        <SectionHeading
          number="PARTNERSHIP"
          category="COMMERCIAL COLLABORATION"
          title={pageInfo.title}
          subtitle={pageInfo.subtitle}
        />

        {/* 4 Partnership Engagement Frameworks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-16">
          {pageInfo.models.map((m, idx) => {
            const Icon = iconList[idx % iconList.length] || Award;
            return (
              <div
                key={m.title}
                className="p-8 rounded-2xl bg-[#111111] border border-neutral-800 hover:border-[#C7A46A]/50 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#181818] border border-neutral-700 flex items-center justify-center text-[#C7A46A] mb-6 group-hover:scale-110 transition-transform">
                  <Icon size={22} />
                </div>
                <span className="text-[10px] font-mono text-[#C7A46A] uppercase tracking-widest block mb-2">
                  ENGAGEMENT FRAMEWORK 0{idx + 1}
                </span>
                <h3 className="text-2xl font-serif text-white uppercase mb-3 group-hover:text-[#C7A46A] transition-colors">
                  {m.title}
                </h3>
                <p className="text-neutral-300 text-sm font-light leading-relaxed">
                  {m.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Executive Inquiry Form */}
        <div className="mt-20">
          <ContactSection />
        </div>
      </div>
    </PageWrapper>
  );
};
