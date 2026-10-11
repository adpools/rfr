import React, { useState } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { StudioMicScene } from '../3d/StudioMicScene';
import { ArrowUpRight, Radio, Headphones, Mic2, Play, X, ExternalLink } from 'lucide-react';

export const PodcastSection: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const episodes = [
    {
      id: '-X_1HETQbho',
      ep: 'EP 01',
      title: 'With Akhila Anand',
      guest: 'Akhila Anand',
      url: 'https://www.youtube.com/watch?v=-X_1HETQbho',
      embedUrl: 'https://www.youtube.com/embed/-X_1HETQbho?autoplay=1'
    },
    {
      id: '8t8mJ0Z8Wiw',
      ep: 'EP 02',
      title: 'Studio Master Broadcast',
      guest: 'Riyas',
      url: 'https://youtu.be/8t8mJ0Z8Wiw',
      embedUrl: 'https://www.youtube.com/embed/8t8mJ0Z8Wiw?autoplay=1'
    },
    {
      id: 'BRx2vCrve6A',
      ep: 'EP 03',
      title: 'Couture & Runways',
      guest: 'RFR Curators',
      url: 'https://www.youtube.com/watch?v=BRx2vCrve6A',
      embedUrl: 'https://www.youtube.com/embed/BRx2vCrve6A?autoplay=1'
    },
    {
      id: 'U9NnwHpdSU4',
      ep: 'EP 04',
      title: 'Beyond The Runway',
      guest: 'Indie Designers',
      url: 'https://www.youtube.com/watch?v=U9NnwHpdSU4&t=1410s',
      embedUrl: 'https://www.youtube.com/embed/U9NnwHpdSU4?start=1410&autoplay=1'
    },
  ];

  const topics = [
    'Fashion Couture & Streetwear',
    'Entertainment & Cinema',
    'Lifestyle & Creative Identity',
    'Brand Financing & Algorithms',
  ];

  return (
    <section
      id="chapter-09"
      className="full-viewport-scene bg-[#060606] border-b border-neutral-900 flex flex-col justify-between relative overflow-hidden"
    >
      {/* Background Studio Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C7A46A]/5 blur-3xl pointer-events-none" />

      <div className="editorial-container relative z-10 my-auto py-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: 3D Studio Microphone Monolith */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 p-8 rounded-3xl bg-[#0c0c0c] border border-[#C7A46A]/25 relative flex flex-col items-center justify-center text-center shadow-2xl"
          >
            <div className="absolute top-4 left-4 flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#C7A46A]/20 border border-[#C7A46A]/50 text-[#C7A46A] text-[10px] font-mono tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C7A46A] animate-ping" />
              <span>STUDIO LIVE</span>
            </div>

            {/* 3D Mic Canvas */}
            <StudioMicScene />

            <div className="mt-4 pt-4 border-t border-neutral-800 w-full flex items-center justify-between text-xs font-mono text-neutral-400">
              <span className="flex items-center gap-1.5 text-[#C7A46A]">
                <Radio size={13} />
                <span>RFR STUDIO MEDIA</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Headphones size={13} />
                <span>SPATIAL AUDIO</span>
              </span>
            </div>
          </motion.div>

          {/* Right Column: Editorial Narrative & Episode Showcase */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="flex items-center gap-3 text-xs font-mono tracking-[0.35em] text-[#C7A46A] uppercase mb-4">
              <span>09</span>
              <span className="w-8 h-[1px] bg-[#C7A46A]" />
              <span>THE PODCAST INITIATIVE</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif text-white tracking-tight uppercase leading-tight mb-4">
              CONVERSATIONS <br />
              <span className="italic text-[#C7A46A] font-light">BEYOND</span> THE RUNWAY.
            </h2>

            <p className="text-neutral-300 text-xs md:text-sm font-light leading-relaxed mb-6 max-w-xl">
              Unfiltered, intellectual dialogues with visionary designers, creative entrepreneurs, models, and media moguls redefining the international creative landscape.
            </p>

            {/* 3 Featured YouTube Episodes Showcase */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-[#C7A46A] uppercase tracking-widest">
                  FEATURED YOUTUBE EPISODES
                </span>
                <span className="text-[10px] font-mono text-neutral-500">
                  CLICK TO PREVIEW
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {episodes.map((ep) => (
                  <button
                    key={ep.id}
                    onClick={() => setSelectedVideo(ep.embedUrl)}
                    className="group relative rounded-xl overflow-hidden border border-neutral-800 hover:border-[#C7A46A] transition-all bg-black/60 aspect-video text-left focus:outline-none"
                  >
                    <img
                      src={`https://img.youtube.com/vi/${ep.id}/hqdefault.jpg`}
                      alt={ep.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-75 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    
                    <div className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                      <div className="w-8 h-8 rounded-full bg-black/70 backdrop-blur-md border border-[#C7A46A] text-[#C7A46A] flex items-center justify-center group-hover:bg-[#C7A46A] group-hover:text-black transition-all shadow-lg group-hover:scale-110">
                        <Play size={12} className="fill-current ml-0.5" />
                      </div>
                    </div>

                    <div className="absolute bottom-1.5 left-2 right-2">
                      <span className="text-[9px] font-mono text-[#C7A46A] font-bold block leading-none mb-0.5">
                        {ep.ep}
                      </span>
                      <span className="text-[10px] font-serif text-white truncate block leading-tight">
                        {ep.title}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Topics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6 max-w-xl">
              {topics.map((t) => (
                <div
                  key={t}
                  className="flex items-center gap-2 p-2 rounded-xl bg-[#111111] border border-neutral-800 text-[11px] text-neutral-300"
                >
                  <Mic2 size={12} className="text-[#C7A46A] shrink-0" />
                  <span className="truncate">{t}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/services/podcast"
                data-cursor="PODCAST"
                className="btn-luxury btn-luxury-gold rounded-2xl text-xs inline-flex items-center gap-2"
              >
                <span>OPEN PODCAST STUDIO</span>
                <ArrowUpRight size={13} />
              </Link>

              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-2xl bg-[#141414] border border-neutral-700 hover:border-[#c4302b] text-neutral-300 hover:text-white text-xs font-mono uppercase tracking-wider transition-colors inline-flex items-center gap-2"
              >
                <Play size={12} className="text-[#c4302b] fill-current" />
                <span>YOUTUBE CHANNEL</span>
                <ExternalLink size={11} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-5xl aspect-video bg-[#050505] p-2 md:p-3 border border-[#C7A46A]/40 relative rounded-2xl shadow-[0_0_50px_rgba(199,164,106,0.2)] flex flex-col"
            >
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute -top-12 right-0 z-50 p-2.5 rounded-full bg-[#C7A46A] text-black shadow-lg hover:scale-110 transition-transform flex items-center gap-2 text-xs font-mono uppercase font-bold"
              >
                <span>CLOSE</span>
                <X size={16} className="stroke-[3px]" />
              </button>
              <div className="w-full h-full bg-black rounded-xl overflow-hidden relative">
                <iframe
                  src={selectedVideo}
                  title="Podcast Episode Player"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Level 05: Directional Cue */}
      <div className="scene-directional-cue">
        <span>09 / 17 • SCROLL TO ECOSYSTEM ↓</span>
      </div>
    </section>
  );
};
