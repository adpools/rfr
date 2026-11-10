import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { ArrowUpRight, User, Users } from 'lucide-react';
import { founderData } from '../../data/founderData';
import { getAboutRiyas } from '../../services/cmsService';

export const AboutSection: React.FC = () => {
  const [founder, setFounder] = useState({
    name: founderData.name,
    title: founderData.title,
    portraitImage: founderData.portraitImage,
    bioParagraphs: founderData.bioParagraphs,
  });

  useEffect(() => {
    getAboutRiyas().then((res) => {
      if (res) {
        setFounder({
          name: res.founder_name || founderData.name,
          title: res.official_title || founderData.title,
          portraitImage: res.portrait_image || founderData.portraitImage,
          bioParagraphs: res.biography_paragraphs && res.biography_paragraphs.length > 0
            ? res.biography_paragraphs
            : founderData.bioParagraphs,
        });
      }
    });
  }, []);
  return (
    <section
      id="chapter-02"
      className="full-viewport-scene bg-[#080808] border-b border-neutral-900 flex flex-col justify-center relative overflow-hidden py-16 md:py-24"
    >
      <div className="editorial-container relative z-10 w-full my-auto">
        {/* Section Header */}
        <div className="flex flex-col justify-start mb-8 pb-4">
          <div className="flex items-center gap-3 text-[10px] font-mono tracking-[0.35em] text-[#C7A46A] uppercase mb-2">
            <span>02</span>
            <span className="w-12 h-[1px] bg-[#C7A46A]" />
            <span>FOUNDATION & IDENTITY</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-800 pb-4 gap-4">
            <div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#F4F1EA] uppercase tracking-tight">
                ABOUT US
              </h2>
              <p className="text-xs sm:text-sm font-light text-neutral-400 mt-2 max-w-xl">
                Riyas Fashion Runway is an integrated creative platform built on runway heritage, artistic vision, and empowering possibility.
              </p>
            </div>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-xs font-mono text-[#C7A46A] hover:text-white uppercase tracking-wider transition-colors"
            >
              <span>VIEW FULL ABOUT PAGE</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

        {/* Tab Selection: About Riyas & Our Team */}
        <div className="flex items-center gap-3 mb-8">
          <div className="px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider flex items-center gap-2 bg-[#C7A46A] text-black font-semibold shadow-[0_0_15px_rgba(199,164,106,0.3)]">
            <User size={14} />
            <span>About Riyas</span>
          </div>

          <Link
            href="/our-team"
            className="px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2 bg-[#111111] text-neutral-400 hover:text-[#C7A46A] hover:border-[#C7A46A]/50 border border-neutral-800 no-underline"
          >
            <Users size={14} />
            <span>Our Team</span>
          </Link>
        </div>

        {/* Founder Leadership Dossier */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#0d0d0d] border border-neutral-800 rounded-3xl p-6 sm:p-10">
          <div className="lg:col-span-5 h-80 sm:h-96 rounded-2xl overflow-hidden editorial-image-frame border border-neutral-800 relative">
            <img
              src={founder.portraitImage}
              alt={founder.name}
              className="w-full h-full object-cover object-top grayscale hover:grayscale-0 transition-all duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="text-[10px] font-mono text-[#C7A46A] uppercase tracking-widest block">
                {founder.title || 'FOUNDER & CREATIVE DIRECTOR'}
              </span>
              <span className="text-xl font-serif text-white uppercase">{founder.name}</span>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-[10px] font-mono text-[#C7A46A] tracking-widest uppercase block mb-1">
                LEADERSHIP DOSSIER
              </span>
              <h3 className="text-3xl font-serif text-white uppercase mb-4">
                THE VISIONARY BEHIND RFR
              </h3>
              <p className="text-sm text-neutral-300 font-light leading-relaxed mb-4">
                {founder.bioParagraphs[0]}
              </p>
              <p className="text-sm text-neutral-400 font-light leading-relaxed">
                {founder.bioParagraphs[1]}
              </p>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link href="/founder" className="btn-luxury btn-luxury-gold rounded-xl py-2.5 px-6 text-xs inline-flex items-center gap-2">
                <span>EXPLORE FOUNDER DOSSIER</span>
                <ArrowUpRight size={14} />
              </Link>
              <span className="text-xs font-mono text-neutral-500">
                DIRECTOR • CHOREOGRAPHER • PRODUCER
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
