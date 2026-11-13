import React, { useState, useEffect } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { SectionHeading } from '../components/common/SectionHeading';
import { Shield, Lock, Eye, FileText, Mail } from 'lucide-react';
import { Link } from 'wouter';
import { getPageContent } from '../services/cmsService';

export interface LegalClauseItem {
  title: string;
  desc: string;
}

export const DEFAULT_PRIVACY_ITEMS: LegalClauseItem[] = [
  {
    title: '1. Information We Collect',
    desc: `When you interact with the RFR BY RIYAS website, submit an executive contact inquiry, apply to our talent guilds (Careers, Models, Influencers, Artists), or initiate a commercial collaboration, we may collect:

• Contact details: Name, corporate entity, email address, telephone and WhatsApp number.
• Talent submissions: Lookbooks, portfolio URLs, social media handles, and performance experience.
• Commercial inquiries: Event requirements, sponsorship tiers, and production briefs.
• Technical analytics: Anonymous browser metrics, device types, and page interaction timestamps.`
  },
  {
    title: '2. Media, Photography & Archival Rights',
    desc: `As a marquee fashion runway and experiential event platform, RFR productions involve photography, cinematography, 4K multi-camera streaming, and digital amplification.

All runway models, artists, performers, and registered attendees participating in RFR Galas, Koottam Flea editions, or commercial shoots acknowledge that recorded media may be archived, broadcast, and curated in official lookbooks and press syndicates in accordance with production agreements.`
  },
  {
    title: '3. Enterprise Confidentiality',
    desc: `We treat corporate brand strategies, pre-launch runway collection lookbooks, and commercial rate cards with strict professional confidentiality. We never sell, lease, or monetize client or talent data to unauthorized third parties.`
  },
  {
    title: '4. Executive Desk & Inquiries',
    desc: `For data access requests, media inquiries, or privacy concerns, contact our legal and executive desk directly:`
  }
];

export const DEFAULT_PRIVACY_CONTENT = {
  title: 'PRIVACY POLICY',
  subtitle: 'RFR BY RIYAS is committed to safeguarding the privacy, media rights, and confidential communications of our clients, models, talent network, and commercial partners.',
  category: 'PRIVACY & CONFIDENTIALITY',
  lastUpdated: 'LAST UPDATED: 2026 EDITION',
  contactEmail: 'advriyas@gmail.com',
  contactPhone: '+91 77365 33346',
  items: DEFAULT_PRIVACY_ITEMS
};

const getPrivacyIcon = (title: string, index: number) => {
  const t = title.toLowerCase();
  if (t.includes('collect') || t.includes('information')) return <Shield size={20} />;
  if (t.includes('media') || t.includes('photography') || t.includes('archival')) return <Eye size={20} />;
  if (t.includes('confidentiality') || t.includes('enterprise')) return <Lock size={20} />;
  if (t.includes('desk') || t.includes('inquiries') || t.includes('contact')) return <Mail size={20} />;
  const icons = [<Shield size={20} />, <Eye size={20} />, <Lock size={20} />, <Mail size={20} />];
  return icons[index % icons.length] || <FileText size={20} />;
};

const renderClauseContent = (desc: string) => {
  const paragraphs = desc.split('\n\n').filter(Boolean);
  return (
    <div className="space-y-4">
      {paragraphs.map((p, pIdx) => {
        const lines = p.split('\n').filter(Boolean);
        const isBulletList = lines.some((line) => line.trim().startsWith('•') || line.trim().startsWith('-'));
        if (isBulletList) {
          return (
            <ul key={pIdx} className="list-disc pl-6 space-y-2 text-neutral-400">
              {lines.map((line, lIdx) => (
                <li key={lIdx}>{line.replace(/^[•\-]\s*/, '')}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={pIdx} className={pIdx > 0 ? 'text-neutral-400' : ''}>
            {p}
          </p>
        );
      })}
    </div>
  );
};

export const PrivacyPolicyPage: React.FC = () => {
  const [content, setContent] = useState(DEFAULT_PRIVACY_CONTENT);

  useEffect(() => {
    getPageContent('privacy', {
      title: DEFAULT_PRIVACY_CONTENT.title,
      subtitle: DEFAULT_PRIVACY_CONTENT.subtitle,
      content: {
        category: DEFAULT_PRIVACY_CONTENT.category,
        lastUpdated: DEFAULT_PRIVACY_CONTENT.lastUpdated,
        contactEmail: DEFAULT_PRIVACY_CONTENT.contactEmail,
        contactPhone: DEFAULT_PRIVACY_CONTENT.contactPhone,
        items: DEFAULT_PRIVACY_ITEMS,
      },
    }).then((res) => {
      setContent((prev) => ({
        title: res.title || prev.title,
        subtitle: res.subtitle || prev.subtitle,
        category: res.content.category || prev.category,
        lastUpdated: res.content.lastUpdated || prev.lastUpdated,
        contactEmail: res.content.contactEmail || prev.contactEmail,
        contactPhone: res.content.contactPhone || prev.contactPhone,
        items: (Array.isArray(res.content.items) && res.content.items.length > 0)
          ? res.content.items
          : prev.items,
      }));
    });
  }, []);

  return (
    <PageWrapper
      title="Privacy Policy — RFR BY RIYAS"
      description="Official Privacy Policy for Riyas Fashion Runway (RFR BY RIYAS). Learn how we handle client data, media rights, talent inquiries, and confidentiality."
    >
      <div className="editorial-container py-12 md:py-20 max-w-4xl mx-auto">
        <SectionHeading
          number="LEGAL"
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
                {getPrivacyIcon(clause.title, idx)}
                <h3 className="text-lg md:text-xl font-serif text-white uppercase tracking-wider">
                  {clause.title}
                </h3>
              </div>

              {renderClauseContent(clause.desc)}

              {(clause.title.toLowerCase().includes('desk') ||
                clause.title.toLowerCase().includes('inquiries') ||
                idx === content.items.length - 1) && (
                <div className="pt-2 flex flex-col sm:flex-row gap-4 font-mono text-xs">
                  <a
                    href={`mailto:${content.contactEmail || 'advriyas@gmail.com'}`}
                    className="px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-[#C7A46A] text-[#C7A46A] hover:text-white transition-colors"
                  >
                    {content.contactEmail || 'advriyas@gmail.com'}
                  </a>
                  <a
                    href={`tel:${(content.contactPhone || '+917736533346').replace(/\s+/g, '')}`}
                    className="px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-[#C7A46A] text-[#C7A46A] hover:text-white transition-colors"
                  >
                    {content.contactPhone || '+91 77365 33346'}
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-neutral-800 flex justify-between items-center text-xs font-mono text-neutral-500">
          <span>{content.lastUpdated || 'LAST UPDATED: 2026 EDITION'}</span>
          <Link href="/" className="text-[#C7A46A] hover:underline uppercase tracking-wider">
            Return to Homepage
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
};
