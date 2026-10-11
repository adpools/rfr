import React, { useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { SectionHeading } from '../components/common/SectionHeading';
import { StudioMicScene } from '../components/3d/StudioMicScene';
import { ArrowUpRight, Play, Headphones, Radio, Mic, Sparkles, Video, ExternalLink } from 'lucide-react';
import { Link } from 'wouter';

export const PodcastPage: React.FC = () => {
  const episodes = [
    {
      ep: 'EP 01',
      title: 'Podcast With Akhila Anand | Playback Singer | Full Studio Podcast',
      guest: 'Akhila Anand (Playback Singer)',
      duration: '54 MINS',
      date: 'FEBRUARY 2026',
      description: 'An intimate, intellectual studio dialogue with celebrated playback singer Akhila Anand exploring musical discipline, stage presence, playback recording craft, and creative evolution in cinema.',
      tags: ['Playback Singer', 'Film Industry', 'Vocal Artistry'],
      youtubeId: '-X_1HETQbho',
      image: 'https://img.youtube.com/vi/-X_1HETQbho/maxresdefault.jpg',
      videoEmbedUrl: 'https://www.youtube.com/embed/-X_1HETQbho',
      youtubeUrl: 'https://www.youtube.com/watch?v=-X_1HETQbho',
      driveFolderUrl: 'https://www.youtube.com/watch?v=-X_1HETQbho'
    },
    {
      ep: 'EP 02',
      title: 'Rewind with Riyas — Studio Master Broadcast',
      guest: 'Riyas (Founder & Creative Director, RFR)',
      duration: '48 MINS',
      date: 'FEBRUARY 2026',
      description: 'The flagship studio broadcast featuring Riyas dissecting a decade of runway innovations, building independent fashion platforms, and mentoring the next generation of creative talent.',
      tags: ['Founder Series', 'Runway Strategy', 'Creator Economy'],
      youtubeId: '8t8mJ0Z8Wiw',
      image: 'https://img.youtube.com/vi/8t8mJ0Z8Wiw/maxresdefault.jpg',
      videoEmbedUrl: 'https://www.youtube.com/embed/8t8mJ0Z8Wiw',
      youtubeUrl: 'https://youtu.be/8t8mJ0Z8Wiw',
      driveFolderUrl: 'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs'
    },
    {
      ep: 'EP 03',
      title: 'Architecting the Future Runway: Couture Meets Creator Economies',
      guest: 'RFR Guest Curators & Fashion Directors',
      duration: '52 MINS',
      date: 'JANUARY 2026',
      description: 'Behind the lens of iconic editorial shoots, lighting contrast, color grading, and stage choreography that define modern luxury runways.',
      tags: ['Cinematography', 'Art Direction', 'Editorial'],
      youtubeId: 'BRx2vCrve6A',
      image: 'https://img.youtube.com/vi/BRx2vCrve6A/maxresdefault.jpg',
      videoEmbedUrl: 'https://www.youtube.com/embed/BRx2vCrve6A',
      youtubeUrl: 'https://www.youtube.com/watch?v=BRx2vCrve6A',
      driveFolderUrl: 'https://drive.google.com/drive/folders/1PL1A8dZ9LIlOGLqV8gXT2KKTVUkNYexs'
    },
    {
      ep: 'EP 04',
      title: 'Conversations Beyond The Runway: Cultural Fashion Movements',
      guest: 'Independent Designers & Koottam Curators',
      duration: '45 MINS',
      date: 'DECEMBER 2025',
      description: 'How curated flea markets, runway spectacles, and lifestyle pop-ups are revitalizing physical retail and creative entrepreneurship for independent fashion brands.',
      tags: ['Experiential Retail', 'Flea Markets', 'Indie Brands'],
      youtubeId: 'U9NnwHpdSU4',
      image: 'https://img.youtube.com/vi/U9NnwHpdSU4/maxresdefault.jpg',
      videoEmbedUrl: 'https://www.youtube.com/embed/U9NnwHpdSU4?start=1410',
      youtubeUrl: 'https://www.youtube.com/watch?v=U9NnwHpdSU4&t=1410s',
      driveFolderUrl: 'https://drive.google.com/drive/folders/1JPcPSXu6NjKFLhj-_b0r9Xh4vxCTnLaM'
    },
  ];

  const [activeEpisodeIndex, setActiveEpisodeIndex] = useState<number>(0);
  const currentEp = episodes[activeEpisodeIndex];

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
              <span>STREAMING ON YOUTUBE • SPOTIFY • APPLE PODCASTS</span>
            </div>

            <h3 className="text-3xl sm:text-4xl font-serif text-white uppercase leading-snug">
              INTELLECTUAL, UNFILTERED & VISIONARY DIALOGUES.
            </h3>

            <p className="text-neutral-300 text-sm md:text-base font-light leading-relaxed">
              Recorded in high-fidelity spatial audio and 4K multi-camera studio configurations, the RFR Podcast brings listeners inside the minds of visionary designers, creative entrepreneurs, models, and brand architects who are redefining global fashion.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="https://www.youtube.com"
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
        <div id="podcast-player" className="my-16 p-6 sm:p-8 md:p-10 rounded-3xl bg-[#0d0d0d] border border-neutral-800 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono text-[#C7A46A] uppercase tracking-widest font-bold">
                  NOW PLAYING • {currentEp.ep}
                </span>
                <span className="text-[10px] font-mono text-neutral-500">• {currentEp.duration}</span>
              </div>
              <h4 className="text-xl sm:text-2xl font-serif text-white uppercase">
                {currentEp.title}
              </h4>
            </div>
            
            <div className="flex items-center gap-3 flex-wrap">
              <a
                href={currentEp.youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-[#c4302b] hover:bg-[#e03a35] text-white text-xs font-mono uppercase tracking-wider transition-all inline-flex items-center gap-2 font-bold shadow-lg hover:scale-105"
              >
                <Play size={13} className="fill-current" />
                <span>WATCH ON YOUTUBE</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {/* Quick Episode Switcher Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4 border-b border-neutral-850">
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest mr-2 shrink-0">SELECT EPISODE:</span>
            {episodes.map((ep, idx) => (
              <button
                key={ep.ep}
                onClick={() => setActiveEpisodeIndex(idx)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all shrink-0 flex items-center gap-2 ${
                  activeEpisodeIndex === idx
                    ? 'bg-[#C7A46A] text-black font-bold shadow-md'
                    : 'bg-[#161616] text-neutral-400 hover:text-white border border-neutral-800 hover:border-[#C7A46A]/50'
                }`}
              >
                <span>{ep.ep}</span>
                <span className="opacity-60 hidden md:inline">• {ep.guest.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          {/* 16:9 Responsive Player */}
          <div className="w-full aspect-video rounded-2xl overflow-hidden border border-neutral-800 bg-black shadow-inner">
            <iframe
              key={currentEp.youtubeId}
              src={`${currentEp.videoEmbedUrl}${currentEp.videoEmbedUrl.includes('?') ? '&' : '?'}autoplay=1&rel=0`}
              title={currentEp.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        {/* Curated Episodes Archive */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-[10px] font-mono text-[#C7A46A] uppercase tracking-[0.25em] block mb-1">
                ARCHIVE CATALOG
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif text-white uppercase tracking-wider">
                ALL STUDIO EPISODES
              </h3>
            </div>
            <span className="text-xs font-mono text-neutral-500">
              {episodes.length} EPISODES BROADCASTED
            </span>
          </div>

          <div className="space-y-6">
            {episodes.map((ep, index) => {
              const isActive = activeEpisodeIndex === index;
              return (
                <div
                  key={ep.ep}
                  className={`p-6 md:p-8 rounded-2xl bg-[#111111] border transition-all group grid grid-cols-1 lg:grid-cols-12 gap-6 items-center ${
                    isActive
                      ? 'border-[#C7A46A] bg-[#14120e] shadow-[0_0_30px_rgba(199,164,106,0.15)]'
                      : 'border-neutral-800 hover:border-[#C7A46A]/50'
                  }`}
                >
                  {/* Episode Video Thumbnail */}
                  <div className="lg:col-span-4 relative h-52 sm:h-56 rounded-xl overflow-hidden bg-black border border-neutral-800 group-hover:border-[#C7A46A]/40 transition-colors">
                    <img
                      src={ep.image}
                      alt={ep.title}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${ep.youtubeId}/hqdefault.jpg`;
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded bg-black/80 backdrop-blur-md border border-[#C7A46A]/40 text-[10px] font-mono text-[#C7A46A] font-bold">
                      {ep.ep}
                    </div>

                    {isActive && (
                      <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded bg-[#C7A46A] text-black text-[9px] font-mono font-bold tracking-widest uppercase">
                        ACTIVE
                      </div>
                    )}

                    <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-neutral-300 text-[10px] font-mono">
                      {ep.duration}
                    </div>

                    <button
                      onClick={() => {
                        setActiveEpisodeIndex(index);
                        const playerElem = document.getElementById('podcast-player');
                        if (playerElem) {
                          playerElem.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-black/70 backdrop-blur-md border border-[#C7A46A] flex items-center justify-center text-[#C7A46A] group-hover:bg-[#C7A46A] group-hover:text-black transition-all duration-300 transform group-hover:scale-110 shadow-xl"
                      aria-label={`Play ${ep.title}`}
                    >
                      <Play size={18} className="fill-current ml-0.5" />
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

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            setActiveEpisodeIndex(index);
                            const playerElem = document.getElementById('podcast-player');
                            if (playerElem) {
                              playerElem.scrollIntoView({ behavior: 'smooth' });
                            }
                          }}
                          className={`inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest px-4 py-2 rounded-xl transition-all ${
                            isActive
                              ? 'bg-[#C7A46A] text-black font-bold'
                              : 'bg-neutral-900 border border-neutral-700 text-[#C7A46A] hover:bg-[#C7A46A] hover:text-black'
                          }`}
                        >
                          <Play size={12} className="fill-current" />
                          <span>{isActive ? 'PLAYING NOW' : 'LOAD IN PLAYER'}</span>
                        </button>

                        <a
                          href={ep.youtubeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-neutral-400 hover:text-white px-3 py-2 transition-colors"
                        >
                          <span>YOUTUBE</span>
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};
