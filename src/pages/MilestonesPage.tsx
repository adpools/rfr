import React from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { SectionHeading } from '../components/common/SectionHeading';
import { timelineData } from '../data/timelineData';
import { CheckCircle2, Award, Sparkles } from 'lucide-react';

export const MilestonesPage: React.FC = () => {
  return (
    <PageWrapper
      title="Milestones & Historical Chapters"
      description="Every chapter becomes part of the journey. Explore the defining milestones of Riyas Fashion Runway."
    >
      <div className="editorial-container py-12 md:py-20">
        <SectionHeading
          number="MILESTONES"
          category="THE EVOLUTION"
          title="EVERY CHAPTER BECOMES PART OF THE JOURNEY."
          subtitle="Every event, campaign, collaboration and partnership adds another chapter to the RFR journey."
        />

        <div className="my-16 space-y-12">
          {timelineData.map((item, idx) => (
            <div
              key={item.year}
              className="p-8 md:p-10 rounded-2xl bg-[#111111] border border-neutral-800 grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
            >
              <div className="md:col-span-3 text-center md:text-left border-b md:border-b-0 md:border-r border-neutral-800 pb-6 md:pb-0 md:pr-6">
                <span className="text-4xl md:text-6xl font-sculptural text-[#C7A46A] font-bold block">
                  {item.year}
                </span>
                <span className="text-xs font-mono text-neutral-400 tracking-widest uppercase mt-1 block">
                  {item.theme}
                </span>
              </div>

              <div className="md:col-span-9 space-y-3">
                <h3 className="text-2xl font-serif text-white uppercase">{item.title}</h3>
                <p className="text-sm text-neutral-300 font-light leading-relaxed">{item.description}</p>
                <div className="pt-3 flex flex-wrap gap-3">
                  {item.milestones.map((m) => (
                    <div key={m} className="flex items-center gap-2 text-xs text-neutral-400 bg-[#161616] px-3 py-1.5 rounded-lg border border-neutral-800">
                      <Sparkles size={12} className="text-[#C7A46A]" />
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
};
