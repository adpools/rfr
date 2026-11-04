import React from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { SectionHeading } from '../components/common/SectionHeading';
import { Link } from 'wouter';
import { User, Users } from 'lucide-react';

export const OurTeamPage: React.FC = () => {
  return (
    <PageWrapper
      title="Our Team — Riyas Fashion Runway (RFR)"
      description="Our Team at Riyas Fashion Runway (RFR)."
    >
      <div className="editorial-container py-12 md:py-20">
        <SectionHeading
          number="02"
          category="FOUNDATION & LEADERSHIP"
          title="ABOUT US"
          subtitle="RFR By Riyas — Our creative team and visionaries behind the platform."
        />

        {/* Navigation Tabs: About Riyas & Our Team */}
        <div className="flex flex-wrap items-center gap-3 my-10">
          <Link
            href="/about"
            className="px-6 py-3 rounded-2xl font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2.5 bg-[#111111] text-neutral-400 hover:text-[#C7A46A] hover:border-[#C7A46A]/50 border border-neutral-800 no-underline"
          >
            <User size={14} />
            <span>About Riyas</span>
          </Link>

          <div className="px-6 py-3 rounded-2xl font-mono text-xs uppercase tracking-wider flex items-center gap-2.5 bg-[#C7A46A] text-black font-semibold shadow-[0_0_15px_rgba(199,164,106,0.3)]">
            <Users size={14} />
            <span>Our Team</span>
          </div>
        </div>

        {/* Blank container ready for team content and images */}
        <div className="min-h-[40vh] flex flex-col justify-center">
          {/* Blank space for team content and images to be added later */}
        </div>
      </div>
    </PageWrapper>
  );
};
