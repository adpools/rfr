import React from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { SectionHeading } from '../components/common/SectionHeading';
import { StudioMicScene } from '../components/3d/StudioMicScene';
import { ArrowUpRight, Play, Headphones, Radio, Mic, Sparkles } from 'lucide-react';
import { Link } from 'wouter';

export const PodcastPage: React.FC = () => {
  const episodes = [
    {
      ep: 'EP 01',
      title: 'Architecting the Future Runway: Couture Meets Creator Economies',
      guest: 'Riyas (Founder, RFR) & Guest Curators',
      duration: '48 MINS',
      date: 'FEBRUARY 2026',
      description: 'An expansive dialogue dissecting how modern luxury fashion shows are engineered to generate lasting cultural and digital resonance beyond the 15-minute catwalk.',
      tags: ['Runway Strategy', 'Creator Economy', 'Couture'],
    },
    {
      ep: 'EP 02',
      title: 'The Psychology of High-Fashion Visual Direction & Lighting',
      guest: 'Master Cinematographers & Art Directors',
      duration: '52 MINS',
      date: 'JANUARY 2026',
      description: 'Behind the lens of iconic editorial shoots and campaign films—exploring lighting contrast, color grading, and framing aesthetics.',
      tags: ['Cinematography', 'Art Direction', 'Editorial'],
    },
    {
      ep: 'EP 03',
      title: 'Experiential Retail & The Modern Community Marketplace',
      guest: 'Independent Designers & Event Producers',
      duration: '45 MINS',
      date: 'DECEMBER 2025',
      description: 'How curated flea markets and lifestyle pop-ups are revitalizing physical retail for emerging independent fashion brands.',
      tags: ['Experiential Retail', 'Flea Markets', 'Indie Brands'],
    },
  ];

  return (
    <PageWrapper
      title="The RFR Podcast — Conversations Beyond The Runway"
      description="Listen to in-depth dialogues with fashion pioneers, creative directors, influencers, and industry leaders on the RFR Studio Podcast."
    >
      <div className="editorial-container py-12 md:py-20">
        <SectionHeading
          number="STUDIO"
          category="MEDIA INITIATIVE"
          title="CONVERSATIONS BEYOND THE RUNWAY"
          subtitle="The official RFR studio podcast exploring the intersection of couture, culture, entrepreneurship, and digital media."
        />

        {/* Hero 3D Studio Showcase */}
        <div className="p-8 md:p-12 rounded-3xl bg-[#0a0a0a] border border-[#C7A46A]/30 my-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 flex flex-col items-center">
            <StudioMicScene />
            <div className="flex items-center gap-3 mt-4 text-xs font-mono text-[#C7A46A] uppercase">
              <Radio size={14} className="animate-pulse" />
              <span>STUDIO ONE BROADCAST FEED</span>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#181818] border border-neutral-700 text-xs font-mono text-neutral-300">
              <Headphones size={13} className="text-[#C7A46A]" />
              <span>AVAILABLE ON SPOTIFY • YOUTUBE • APPLE PODCASTS</span>
            </div>

            <h3 className="text-3xl sm:text-4xl font-serif text-white uppercase leading-snug">
              INTELLECTUAL, UNFILTERED & VISIONARY DIALOGUES.
            </h3>

            <p className="text-neutral-300 text-sm md:text-base font-light leading-relaxed">
              Recorded in high-fidelity spatial audio and 4K multi-camera studio configurations, the RFR Podcast brings listeners inside the minds of visionary designers, creative entrepreneurs, models, and brand architects who are redefining global fashion.
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="btn-luxury btn-luxury-gold rounded-full inline-flex items-center gap-2 text-xs"
              >
                <Mic size={14} />
                <span>APPLY AS PODCAST GUEST / SPONSOR</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Curated Episodes Archive */}
        <div className="mt-16">
          <h3 className="text-2xl font-serif text-white uppercase tracking-wider mb-8">
            STUDIO EPISODES
          </h3>

          <div className="space-y-6">
            {episodes.map((ep) => (
              <div
                key={ep.ep}
                className="p-6 md:p-8 rounded-2xl bg-[#111111] border border-neutral-800 hover:border-[#C7A46A]/50 transition-all group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-neutral-850 text-xs font-mono text-neutral-400">
                  <div className="flex items-center gap-3">
                    <span className="text-[#C7A46A] font-bold text-sm">{ep.ep}</span>
                    <span>• {ep.duration}</span>
                    <span>• {ep.date}</span>
                  </div>
                  <span className="text-neutral-500">{ep.guest}</span>
                </div>

                <h4 className="text-xl md:text-2xl font-serif text-white uppercase group-hover:text-[#C7A46A] transition-colors mb-3 leading-snug">
                  {ep.title}
                </h4>

                <p className="text-neutral-300 text-xs md:text-sm font-light leading-relaxed mb-6">
                  {ep.description}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-neutral-850">
                  <div className="flex flex-wrap gap-2">
                    {ep.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full bg-[#161616] border border-neutral-800 text-[10px] font-mono uppercase text-neutral-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => alert(`Episode streaming soon. RFR Studio series dispatch will notify subscribers.`)}
                    className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#C7A46A] hover:text-white transition-colors"
                  >
                    <Play size={14} className="fill-current" />
                    <span>STREAM EPISODE</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};
