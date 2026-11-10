import React from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { SectionHeading } from '../components/common/SectionHeading';
import { Shield, Lock, Eye, FileText, Mail, Phone } from 'lucide-react';
import { Link } from 'wouter';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <PageWrapper
      title="Privacy Policy — RFR BY RIYAS"
      description="Official Privacy Policy for Riyas Fashion Runway (RFR BY RIYAS). Learn how we handle client data, media rights, talent inquiries, and confidentiality."
    >
      <div className="editorial-container py-12 md:py-20 max-w-4xl mx-auto">
        <SectionHeading
          number="LEGAL"
          category="PRIVACY & CONFIDENTIALITY"
          title="PRIVACY POLICY"
          subtitle="RFR BY RIYAS is committed to safeguarding the privacy, media rights, and confidential communications of our clients, models, talent network, and commercial partners."
        />

        <div className="space-y-12 my-12 text-[#D4D2CD] font-sans font-light leading-relaxed text-sm md:text-base">
          {/* Section 1 */}
          <div className="p-8 rounded-2xl bg-[#0e0e0e] border border-neutral-800 space-y-4">
            <div className="flex items-center gap-3 text-[#C7A46A] mb-2">
              <Shield size={20} />
              <h3 className="text-lg md:text-xl font-serif text-white uppercase tracking-wider">
                1. Information We Collect
              </h3>
            </div>
            <p>
              When you interact with the RFR BY RIYAS website, submit an executive contact inquiry, apply to our talent guilds (Careers, Models, Influencers, Artists), or initiate a commercial collaboration, we may collect:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-neutral-400">
              <li>Contact details: Name, corporate entity, email address, telephone and WhatsApp number.</li>
              <li>Talent submissions: Lookbooks, portfolio URLs, social media handles, and performance experience.</li>
              <li>Commercial inquiries: Event requirements, sponsorship tiers, and production briefs.</li>
              <li>Technical analytics: Anonymous browser metrics, device types, and page interaction timestamps.</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="p-8 rounded-2xl bg-[#0e0e0e] border border-neutral-800 space-y-4">
            <div className="flex items-center gap-3 text-[#C7A46A] mb-2">
              <Eye size={20} />
              <h3 className="text-lg md:text-xl font-serif text-white uppercase tracking-wider">
                2. Media, Photography & Archival Rights
              </h3>
            </div>
            <p>
              As a marquee fashion runway and experiential event platform, RFR productions involve photography, cinematography, 4K multi-camera streaming, and digital amplification.
            </p>
            <p className="text-neutral-400">
              All runway models, artists, performers, and registered attendees participating in RFR Galas, Koottam Flea editions, or commercial shoots acknowledge that recorded media may be archived, broadcast, and curated in official lookbooks and press syndicates in accordance with production agreements.
            </p>
          </div>

          {/* Section 3 */}
          <div className="p-8 rounded-2xl bg-[#0e0e0e] border border-neutral-800 space-y-4">
            <div className="flex items-center gap-3 text-[#C7A46A] mb-2">
              <Lock size={20} />
              <h3 className="text-lg md:text-xl font-serif text-white uppercase tracking-wider">
                3. Enterprise Confidentiality
              </h3>
            </div>
            <p>
              We treat corporate brand strategies, pre-launch runway collection lookbooks, and commercial rate cards with strict professional confidentiality. We never sell, lease, or monetize client or talent data to unauthorized third parties.
            </p>
          </div>

          {/* Section 4 */}
          <div className="p-8 rounded-2xl bg-[#0e0e0e] border border-neutral-800 space-y-4">
            <div className="flex items-center gap-3 text-[#C7A46A] mb-2">
              <Mail size={20} />
              <h3 className="text-lg md:text-xl font-serif text-white uppercase tracking-wider">
                4. Executive Desk & Inquiries
              </h3>
            </div>
            <p>
              For data access requests, media inquiries, or privacy concerns, contact our legal and executive desk directly:
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-4 font-mono text-xs">
              <a
                href="mailto:advriyas@gmail.com"
                className="px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-[#C7A46A] text-[#C7A46A] hover:text-white transition-colors"
              >
                advriyas@gmail.com
              </a>
              <a
                href="tel:+917736533346"
                className="px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-[#C7A46A] text-[#C7A46A] hover:text-white transition-colors"
              >
                +91 77365 33346
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-neutral-800 flex justify-between items-center text-xs font-mono text-neutral-500">
          <span>LAST UPDATED: 2026 EDITION</span>
          <Link href="/" className="text-[#C7A46A] hover:underline uppercase tracking-wider">
            Return to Homepage
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
};

