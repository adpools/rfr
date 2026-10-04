import React, { useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { SectionHeading } from '../components/common/SectionHeading';
import { StudioMicScene } from '../components/3d/StudioMicScene';
import { ArrowUpRight, Play, Headphones, Radio, Mic, Sparkles, Video, ExternalLink } from 'lucide-react';
import { Link } from 'wouter';

export const PodcastPage: React.FC = () => {
  const [activeVideoUrl, setActiveVideoUrl] = useState<string>(
    'https://drive.google.com/file/d/1nFgMIl7bLGHxTcKk46iixQNo4n-MQJHt/preview'
  );

  const episodes = [
    {
      ep: 'EP 01',
      title: 'Rewind with Riyas — Premier Studio Edition',
      guest: 'Riyas (Founder & Creative Director, RFR)',
      duration: '48 MINS',
      date: 'FEBRUARY 2026',
      description: 'The premier studio broadcast featuring Riyas dissecting a decade of runway innovations, building independent fashion platforms, and mentoring the next generation of creative talent.',
      tags: ['Founder Series', 'Runway Strategy', 'Creator Economy'],
      image: '/images/riyas.jpg',
      videoEmbedUrl: 'https://drive.google.com/file/d/1nFgMIl7bLGHxTcKk46iixQNo4n-MQJHt/preview',
      driveFolderUrl: 'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs'
    },
    {
      ep: 'EP 02',
      title: 'Architecting the Future Runway: Couture Meets Creator Economies',
      guest: 'RFR Guest Curators & Fashion Directors',
      duration: '52 MINS',
      date: 'JANUARY 2026',
      description: 'Behind the lens of iconic editorial shoots, lighting contrast, color grading, and stage choreography that define modern luxury runways.',
      tags: ['Cinematography', 'Art Direction', 'Editorial'],
      image: '/images/thumbnails/1L5N6QBrapqaBkNIkJrs6LL1YYrg05qwF.jpg',
      videoEmbedUrl: 'https://drive.google.com/file/d/1L5N6QBrapqaBkNIkJrs6LL1YYrg05qwF/preview',
      driveFolderUrl: 'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs'
    },
    {
      ep: 'EP 03',
      title: 'Experiential Retail & The Modern Community Flea Marketplace',
      guest: 'Independent Designers & Koottam Curators',
      duration: '45 MINS',
      date: 'DECEMBER 2025',
      description: 'How curated flea markets and lifestyle pop-ups are revitalizing physical retail for emerging independent fashion brands.',
      tags: ['Experiential Retail', 'Flea Markets', 'Indie Brands'],
      image: '/images/thumbnails/1K0wzOv8anMih62lWwAXbRJCZGkxyh3IW.jpg',
      videoEmbedUrl: 'https://drive.google.com/file/d/1K0wzOv8anMih62lWwAXbRJCZGkxyh3IW/preview',
      driveFolderUrl: 'https://drive.google.com/drive/folders/1JPcPSXu6NjKFLhj-_b0r9Xh4vxCTnLaM'
    },
  ];

  return (
    <PageWrapper
      title="The RFR Podcast — Conversations Beyond The Runway"
      description="Listen and watch in-depth video dialogues with fashion pioneers, creative directors, influencers, and industry leaders on the RFR Studio Podcast."
    >
      <div className="editorial-container py-12 md:py-20">
        <SectionHeading
          number="05.C"
          category="MEDIA INITIATIVE • PODCAST STUDIO"
          title="CONVERSATIONS BEYOND THE RUNWAY"
          subtitle="The official RFR studio podcast exploring the intersection of couture, culture, entrepreneurship, and digital media."
        />

        {/* Hero 3D Studio & Video Player Showcase */}
        <div className="p-8 md:p-12 rounded-3xl bg-[#0a0a0a] border border-[#C7A46A]/30 my-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 flex flex-col items-center">
            <StudioMicScene />
            <div className="flex items-center gap-3 mt-4 text-xs font-mono text-[#C7A46A] uppercase">
              <Radio size={14} className="animate-pulse" />
              <span>STUDIO ONE BROADCAST FEED</span>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#181818] border border-neutral-700 text-xs font-mono text-neutral-300">
              <Headphones size={13} className="text-[#C7A46A]" />
              <span>STREAMING ON GOOGLE DRIVE • YOUTUBE • SPOTIFY</span>
            </div>

            <h3 className="text-3xl sm:text-4xl font-serif text-white uppercase leading-snug">
              INTELLECTUAL, UNFILTERED & VISIONARY DIALOGUES.
            </h3>

            <p className="text-neutral-300 text-sm md:text-base font-light leading-relaxed">
              Recorded in high-fidelity spatial audio and 4K multi-camera studio configurations, the RFR Podcast brings listeners inside the minds of visionary designers, creative entrepreneurs, models, and brand architects who are redefining global fashion.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs"
                target="_blank"
                rel="noreferrer"
                className="btn-luxury btn-luxury-gold rounded-2xl inline-flex items-center gap-2 text-xs"
              >
                <Video size={14} />
                <span>OPEN OFFICIAL VIDEO ARCHIVE</span>
                <ExternalLink size={12} />
              </a>

              <Link
                href="/contact"
                className="px-5 py-3 rounded-2xl bg-[#141414] border border-neutral-700 hover:border-[#C7A46A] text-xs font-mono uppercase tracking-wider text-neutral-300 hover:text-white transition-colors"
              >
                APPLY AS GUEST / SPONSOR
              </Link>
            </div>
          </div>
        </div>

        {/* Featured Video Player */}
        <div className="my-16 p-8 md:p-10 rounded-3xl bg-[#0d0d0d] border border-neutral-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-[10px] font-mono text-[#C7A46A] uppercase tracking-widest block mb-1">
                FEATURED BROADCAST
              </span>
              <h4 className="text-2xl font-serif text-white uppercase">
                REWIND WITH RIYAS — OFFICIAL EPISODE
              </h4>
            </div>
            <a
              href="https://drive.google.com/file/d/1nFgMIl7bLGHxTcKk46iixQNo4n-MQJHt/view"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-1.5 rounded-xl bg-[#181818] border border-neutral-700 text-xs font-mono text-[#C7A46A] uppercase hover:bg-white hover:text-black transition-colors inline-flex items-center gap-1.5"
            >
              <span>WATCH ON GOOGLE DRIVE</span>
              <ExternalLink size={12} />
            </a>
          </div>

          <div className="w-full h-80 sm:h-[480px] rounded-2xl overflow-hidden border border-neutral-850 bg-black">
            <iframe
              src={activeVideoUrl}
              title="Rewind with Riyas Podcast"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        {/* Curated Episodes Archive */}
        <div className="mt-16">
          <h3 className="text-2xl font-serif text-white uppercase tracking-wider mb-8">
            STUDIO EPISODES & CLIPS
          </h3>

          <div className="space-y-6">
            {episodes.map((ep) => (
              <div
                key={ep.ep}
                className="p-6 md:p-8 rounded-2xl bg-[#111111] border border-neutral-800 hover:border-[#C7A46A]/50 transition-all group grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
              >
                {/* Episode Video Thumbnail */}
                <div className="lg:col-span-4 relative h-48 rounded-xl overflow-hidden bg-black border border-neutral-800 group-hover:border-[#C7A46A]/40 transition-colors">
                  <img
                    src={ep.image}
                    alt={ep.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  <div className="absolute top-2.5 left-2.5 px-2 py-1 rounded bg-black/80 backdrop-blur-md border border-[#C7A46A]/40 text-[10px] font-mono text-[#C7A46A] font-bold">
                    {ep.ep}
                  </div>

                  <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-neutral-300 text-[10px] font-mono">
                    {ep.duration}
                  </div>

                  <button
                    onClick={() => {
                      setActiveVideoUrl(ep.videoEmbedUrl);
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    className="absolute inset-0 m-auto w-11 h-11 rounded-full bg-black/70 backdrop-blur-md border border-[#C7A46A] flex items-center justify-center text-[#C7A46A] group-hover:bg-[#C7A46A] group-hover:text-black transition-all duration-300 transform group-hover:scale-110 shadow-xl"
                    aria-label={`Play ${ep.title}`}
                  >
                    <Play size={16} className="fill-current ml-0.5" />
                  </button>
                </div>

                {/* Episode Info */}
                <div className="lg:col-span-8 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center gap-3 text-xs font-mono text-neutral-400 mb-2">
                      <span className="text-[#C7A46A] font-bold">{ep.ep}</span>
                      <span>• {ep.duration}</span>
                      <span>• {ep.date}</span>
                      <span className="text-neutral-500 hidden sm:inline">• {ep.guest}</span>
                    </div>

                    <h4 className="text-xl md:text-2xl font-serif text-white uppercase group-hover:text-[#C7A46A] transition-colors leading-snug">
                      {ep.title}
                    </h4>

                    <p className="text-neutral-300 text-xs md:text-sm font-light leading-relaxed mt-2">
                      {ep.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-neutral-850">
                    <div className="flex flex-wrap gap-2">
                      {ep.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-0.5 rounded-lg bg-[#161616] border border-neutral-800 text-[10px] font-mono uppercase text-neutral-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        setActiveVideoUrl(ep.videoEmbedUrl);
                        window.scrollTo({ top: 400, behavior: 'smooth' });
                      }}
                      className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#C7A46A] hover:text-white transition-colors"
                    >
                      <Play size={14} className="fill-current" />
                      <span>LOAD IN PLAYER</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};
