import React from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { SectionHeading } from '../components/common/SectionHeading';
import { Scale, Award, ShieldAlert, Sparkles, Building, Briefcase } from 'lucide-react';
import { Link } from 'wouter';

export const TermsPage: React.FC = () => {
  return (
    <PageWrapper
      title="Terms of Production — RFR BY RIYAS"
      description="Official Terms of Production, runway staging guidelines, intellectual property framework, and commercial agreements for Riyas Fashion Runway."
    >
      <div className="editorial-container py-12 md:py-20 max-w-4xl mx-auto">
        <SectionHeading
          number="TERMS"
          category="PRODUCTION & LEGAL FRAMEWORK"
          title="TERMS OF PRODUCTION"
          subtitle="Governing principles, intellectual property rights, and production standards for all runway presentations, brand collaborations, and talent engagements curated by RFR BY RIYAS."
        />

        <div className="space-y-12 my-12 text-[#D4D2CD] font-sans font-light leading-relaxed text-sm md:text-base">
          {/* Section 1 */}
          <div className="p-8 rounded-2xl bg-[#0e0e0e] border border-neutral-800 space-y-4">
            <div className="flex items-center gap-3 text-[#C7A46A] mb-2">
              <Scale size={20} />
              <h3 className="text-lg md:text-xl font-serif text-white uppercase tracking-wider">
                1. Scope of Creative Architecture
              </h3>
            </div>
            <p>
              RFR BY RIYAS operates as a full-spectrum creative platform providing runway choreography, high-fashion styling, staging, lighting, talent scouting, influencer marketing campaigns, commercial advertising production, and experiential festival management.
            </p>
            <p className="text-neutral-400">
              All commissioned projects are executed according to individual Statements of Work (SOW) referencing these overarching Terms of Production.
            </p>
          </div>

          {/* Section 2 */}
          <div className="p-8 rounded-2xl bg-[#0e0e0e] border border-neutral-800 space-y-4">
            <div className="flex items-center gap-3 text-[#C7A46A] mb-2">
              <Award size={20} />
              <h3 className="text-lg md:text-xl font-serif text-white uppercase tracking-wider">
                2. Intellectual Property & Brand Ownership
              </h3>
            </div>
            <p>
              The RFR monogram, brand assets, trademarked intellectual properties (including Koottam Flea Market, The Indian Couture conclaves, and Rewind with Riyas Podcast), set designs, and proprietary event formats remain the exclusive intellectual property of Adv. Riyas and RFR BY RIYAS.
            </p>
            <p className="text-neutral-400">
              Client brand marks and trademarks showcased during commissioned campaigns remain the property of their respective owners and are utilized under authorized license for the duration of the engagement.
            </p>
          </div>

          {/* Section 3 */}
          <div className="p-8 rounded-2xl bg-[#0e0e0e] border border-neutral-800 space-y-4">
            <div className="flex items-center gap-3 text-[#C7A46A] mb-2">
              <Sparkles size={20} />
              <h3 className="text-lg md:text-xl font-serif text-white uppercase tracking-wider">
                3. Talent & Artist Welfare
              </h3>
            </div>
            <p>
              RFR adheres to rigorous ethical production standards. All runway models, performers, backstage coordinators, and creative crew members are guaranteed safe working conditions, respectful backstage environments, verified credentials, and prompt settlement of commercial remuneration.
            </p>
          </div>

          {/* Section 4 */}
          <div className="p-8 rounded-2xl bg-[#0e0e0e] border border-neutral-800 space-y-4">
            <div className="flex items-center gap-3 text-[#C7A46A] mb-2">
              <ShieldAlert size={20} />
              <h3 className="text-lg md:text-xl font-serif text-white uppercase tracking-wider">
                4. Force Majeure & Rescheduling
              </h3>
            </div>
            <p>
              Neither party shall be held liable for delays or inability to stage outdoor or indoor festival productions resulting from acts of God, extreme weather phenomena, government advisories, or technical venue force majeure. In such events, RFR coordinates rescheduling to the nearest feasible window.
            </p>
          </div>

          {/* Section 5 */}
          <div className="p-8 rounded-2xl bg-[#0e0e0e] border border-neutral-800 space-y-4">
            <div className="flex items-center gap-3 text-[#C7A46A] mb-2">
              <Building size={20} />
              <h3 className="text-lg md:text-xl font-serif text-white uppercase tracking-wider">
                5. Jurisdiction & Governance
              </h3>
            </div>
            <p>
              These Terms of Production are governed by the laws of India. Any disputes arising out of contracts or commercial commissions shall be subject to the exclusive jurisdiction of the competent courts in Kerala, India.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-neutral-800 flex justify-between items-center text-xs font-mono text-neutral-500">
          <span>OPERATIONAL STANDARD: 2020–2026</span>
          <Link href="/contact" className="text-[#C7A46A] hover:underline uppercase tracking-wider">
            Initiate Executive Inquiries
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
};

