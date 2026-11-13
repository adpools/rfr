import React, { useState, useEffect } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { SectionHeading } from '../components/common/SectionHeading';
import { Scale, Award, ShieldAlert, Sparkles, Building, Briefcase } from 'lucide-react';
import { Link } from 'wouter';
import { getPageContent } from '../services/cmsService';

export interface TermsClauseItem {
  title: string;
  desc: string;
}

export const DEFAULT_TERMS_ITEMS: TermsClauseItem[] = [
  {
    title: '1. Scope of Creative Architecture',
    desc: `RFR BY RIYAS operates as a full-spectrum creative platform providing runway choreography, high-fashion styling, staging, lighting, talent scouting, influencer marketing campaigns, commercial advertising production, and experiential festival management.

All commissioned projects are executed according to individual Statements of Work (SOW) referencing these overarching Terms of Production.`
  },
  {
    title: '2. Intellectual Property & Brand Ownership',
    desc: `The RFR monogram, brand assets, trademarked intellectual properties (including Koottam Flea Market, The Indian Couture conclaves, and Rewind with Riyas Podcast), set designs, and proprietary event formats remain the exclusive intellectual property of Adv. Riyas and RFR BY RIYAS.

Client brand marks and trademarks showcased during commissioned campaigns remain the property of their respective owners and are utilized under authorized license for the duration of the engagement.`
  },
  {
    title: '3. Talent & Artist Welfare',
    desc: `RFR adheres to rigorous ethical production standards. All runway models, performers, backstage coordinators, and creative crew members are guaranteed safe working conditions, respectful backstage environments, verified credentials, and prompt settlement of commercial remuneration.`
  },
  {
    title: '4. Force Majeure & Rescheduling',
    desc: `Neither party shall be held liable for delays or inability to stage outdoor or indoor festival productions resulting from acts of God, extreme weather phenomena, government advisories, or technical venue force majeure. In such events, RFR coordinates rescheduling to the nearest feasible window.`
  },
  {
    title: '5. Jurisdiction & Governance',
    desc: `These Terms of Production are governed by the laws of India. Any disputes arising out of contracts or commercial commissions shall be subject to the exclusive jurisdiction of the competent courts in Kerala, India.`
  }
];

export const DEFAULT_TERMS_CONTENT = {
  title: 'TERMS OF PRODUCTION',
  subtitle: 'Governing principles, intellectual property rights, and production standards for all runway presentations, brand collaborations, and talent engagements curated by RFR BY RIYAS.',
  category: 'PRODUCTION & LEGAL FRAMEWORK',
  operationalStandard: 'OPERATIONAL STANDARD: 2020–2026',
  items: DEFAULT_TERMS_ITEMS
};

const getTermsIcon = (title: string, index: number) => {
  const t = title.toLowerCase();
  if (t.includes('scope') || t.includes('architecture')) return <Scale size={20} />;
  if (t.includes('property') || t.includes('ownership')) return <Award size={20} />;
  if (t.includes('talent') || t.includes('welfare') || t.includes('artist')) return <Sparkles size={20} />;
  if (t.includes('force majeure') || t.includes('rescheduling')) return <ShieldAlert size={20} />;
  if (t.includes('jurisdiction') || t.includes('governance')) return <Building size={20} />;
  const icons = [<Scale size={20} />, <Award size={20} />, <Sparkles size={20} />, <ShieldAlert size={20} />, <Building size={20} />];
  return icons[index % icons.length] || <Briefcase size={20} />;
};

const renderClauseContent = (desc: string) => {
  const paragraphs = desc.split('\n\n').filter(Boolean);
  return (
    <div className="space-y-4">
      {paragraphs.map((p, pIdx) => (
        <p key={pIdx} className={pIdx > 0 ? 'text-neutral-400' : ''}>
          {p}
        </p>
      ))}
    </div>
  );
};

export const TermsPage: React.FC = () => {
  const [content, setContent] = useState(DEFAULT_TERMS_CONTENT);

  useEffect(() => {
    getPageContent('terms', {
      title: DEFAULT_TERMS_CONTENT.title,
      subtitle: DEFAULT_TERMS_CONTENT.subtitle,
      content: {
        category: DEFAULT_TERMS_CONTENT.category,
        operationalStandard: DEFAULT_TERMS_CONTENT.operationalStandard,
        items: DEFAULT_TERMS_ITEMS,
      },
    }).then((res) => {
      setContent((prev) => ({
        title: res.title || prev.title,
        subtitle: res.subtitle || prev.subtitle,
        category: res.content.category || prev.category,
        operationalStandard: res.content.operationalStandard || prev.operationalStandard,
        items: (Array.isArray(res.content.items) && res.content.items.length > 0)
          ? res.content.items
          : prev.items,
      }));
    });
  }, []);

  return (
    <PageWrapper
      title="Terms of Production — RFR BY RIYAS"
      description="Official Terms of Production, runway staging guidelines, intellectual property framework, and commercial agreements for Riyas Fashion Runway."
    >
      <div className="editorial-container py-12 md:py-20 max-w-4xl mx-auto">
        <SectionHeading
          number="TERMS"
          category={content.category}
          title={content.title}
          subtitle={content.subtitle}
        />

        <div className="space-y-12 my-12 text-[#D4D2CD] font-sans font-light leading-relaxed text-sm md:text-base">
          {content.items.map((clause, idx) => (
            <div
              key={clause.title || idx}
              className="p-8 rounded-2xl bg-[#0e0e0e] border border-neutral-800 space-y-4"
            >
              <div className="flex items-center gap-3 text-[#C7A46A] mb-2">
                {getTermsIcon(clause.title, idx)}
                <h3 className="text-lg md:text-xl font-serif text-white uppercase tracking-wider">
                  {clause.title}
                </h3>
              </div>

              {renderClauseContent(clause.desc)}
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-neutral-800 flex justify-between items-center text-xs font-mono text-neutral-500">
          <span>{content.operationalStandard || 'OPERATIONAL STANDARD: 2020–2026'}</span>
          <Link href="/contact" className="text-[#C7A46A] hover:underline uppercase tracking-wider">
            Initiate Executive Inquiries
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
};
