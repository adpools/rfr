import React from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { SectionHeading } from '../components/common/SectionHeading';
import { Compass, Layers, Calendar, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';

export const WhatIsRFRPage: React.FC = () => {
  return (
    <PageWrapper
      title="What is RFR? — The Creative Ecosystem Defined"
      description="Understand what Riyas Fashion Runway (RFR) is, how it operates, when activations happen, and what we create for brands and talent."
    >
      <div className="editorial-container py-12 md:py-20">
        <SectionHeading
          number="CORE"
          category="THE ARCHITECTURE"
          title="WHAT IS RFR?"
          subtitle="A complete overview of the vision, operational mechanics, seasonal rhythms, and creative outputs of Riyas Fashion Runway."
        />

        {/* 3 Main Narrative Blocks */}
        <div className="space-y-16 my-16">
          {/* Block 1: WHAT */}
          <div className="p-8 md:p-12 rounded-3xl bg-[#0f0f0f] border border-neutral-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4">
              <div className="w-12 h-12 rounded-xl bg-[#161616] border border-neutral-700 flex items-center justify-center text-[#C7A46A] mb-4">
                <Compass size={24} />
              </div>
              <span className="text-xs font-mono text-[#C7A46A] uppercase tracking-widest block mb-1">SECTION 01</span>
              <h3 className="text-3xl font-serif text-white uppercase">WHAT IS RFR?</h3>
            </div>
            <div className="lg:col-span-8 text-neutral-300 text-sm md:text-base font-light leading-relaxed space-y-4">
              <p>
                <strong className="text-white font-medium">RFR</strong> stands for <strong className="text-[#C7A46A] font-medium">Riyas Fashion Runway</strong>. It is a fashion, lifestyle, and multi-disciplinary creative platform founded by Riyas.
              </p>
              <p>
                Rather than functioning solely as an event firm, RFR operates as an interconnected creative ecosystem designed to unite runway couture, digital creator economies, enterprise advertising, and cultural media platforms into a singular, prestigious engine.
              </p>
            </div>
          </div>

          {/* Block 2: HOW */}
          <div className="p-8 md:p-12 rounded-3xl bg-[#0f0f0f] border border-neutral-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4">
              <div className="w-12 h-12 rounded-xl bg-[#161616] border border-neutral-700 flex items-center justify-center text-[#C7A46A] mb-4">
                <Layers size={24} />
              </div>
              <span className="text-xs font-mono text-[#C7A46A] uppercase tracking-widest block mb-1">SECTION 02</span>
              <h3 className="text-3xl font-serif text-white uppercase">HOW DOES IT WORK?</h3>
            </div>
            <div className="lg:col-span-8 text-neutral-300 text-sm md:text-base font-light leading-relaxed space-y-4">
              <p>
                RFR creates opportunities through strategic collaborations, high-concept ad campaigns, signature runway presentations, studio content production, talent representation, and omnichannel media distribution.
              </p>
              <p>
                We connect brands looking for high-aesthetic cultural relevance with talented models, creators, and artists seeking credible, well-produced platforms to amplify their work.
              </p>
            </div>
          </div>

          {/* Block 3: WHEN */}
          <div className="p-8 md:p-12 rounded-3xl bg-[#0f0f0f] border border-neutral-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4">
              <div className="w-12 h-12 rounded-xl bg-[#161616] border border-neutral-700 flex items-center justify-center text-[#C7A46A] mb-4">
                <Calendar size={24} />
              </div>
              <span className="text-xs font-mono text-[#C7A46A] uppercase tracking-widest block mb-1">SECTION 03</span>
              <h3 className="text-3xl font-serif text-white uppercase">WHEN DO WE OPERATE?</h3>
            </div>
            <div className="lg:col-span-8 text-neutral-300 text-sm md:text-base font-light leading-relaxed space-y-4">
              <p>
                RFR operates throughout the year through continuous seasonal campaigns, runway showcases, weekend community fleas, New Year countdown spectacles, brand commercial film shoots, podcast recordings, and special activations.
              </p>
            </div>
          </div>
        </div>

        {/* WHAT WE CREATE Breakdown */}
        <div className="p-10 rounded-3xl bg-gradient-to-b from-[#121212] to-[#0a0a0a] border border-[#C7A46A]/30">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-mono text-[#C7A46A] uppercase tracking-widest block mb-2">OUTPUT SPECTRUM</span>
            <h3 className="text-3xl font-serif text-white uppercase">WHAT WE CREATE</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Fashion', desc: 'Couture shows, designer launches & styling lookbooks.' },
              { title: 'Events', desc: 'Community fleas, galas, countdowns & festival celebrations.' },
              { title: 'Influencer Marketing', desc: 'Curated rosters, authentic reels & viral creator pushes.' },
              { title: 'Advertising', desc: 'Cinematic brand films, television commercials & print visuals.' },
              { title: 'Digital Media', desc: 'Social media ads, targeted conversion funnels & display.' },
              { title: 'OOH Media', desc: 'Strategic urban billboards, DOOH screens & transit takeovers.' },
              { title: 'Content Studio', desc: 'High-volume UGC vertical videos & aesthetic lookbooks.' },
              { title: 'Brand Experiences', desc: 'VIP hospitality zones, pop-up stores & sponsor lounges.' },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-2xl bg-[#161616] border border-neutral-800">
                <Sparkles size={16} className="text-[#C7A46A] mb-3" />
                <h4 className="text-lg font-serif text-white uppercase mb-2">{item.title}</h4>
                <p className="text-xs text-neutral-400 font-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/services"
              className="btn-luxury btn-luxury-gold rounded-full inline-flex items-center gap-2"
            >
              <span>EXPLORE ALL SERVICES & IP</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};
