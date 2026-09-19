import React from 'react';
import { Link } from 'wouter';
import { pressData } from '../../data/pressData';
import { ArrowUpRight, Calendar, Clock } from 'lucide-react';

export const PressPreviewSection: React.FC = () => {
  const featured = pressData[0];
  const secondary = pressData.slice(1, 4);

  return (
    <section
      id="chapter-13"
      className="full-viewport-scene bg-[#0a0a0a] border-b border-neutral-900 flex flex-col justify-between relative overflow-hidden"
    >
      <div className="editorial-container relative z-10 my-auto py-10 w-full">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-neutral-800/80">
          <div>
            <div className="flex items-center gap-3 text-xs font-mono tracking-[0.35em] text-[#C7A46A] uppercase mb-2">
              <span>13</span>
              <span className="w-8 h-[1px] bg-[#C7A46A]" />
              <span>EDITORIAL DISPATCHES</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif text-white uppercase tracking-tight">
              PRESS & NEWS
            </h2>
          </div>

          <Link
            href="/press"
            data-cursor="PRESS"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-xs font-sans tracking-[0.2em] uppercase text-[#C7A46A] hover:text-white transition-colors group"
          >
            <span>VIEW ALL DISPATCHES</span>
            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Editorial Magazine Spread Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Featured Lead Story (7 cols) */}
          <div className="lg:col-span-7 rounded-3xl bg-[#111111] border border-neutral-800 p-6 md:p-8 flex flex-col justify-between group hover:border-[#C7A46A]/40 transition-all">
            <div className="h-60 sm:h-72 rounded-2xl overflow-hidden mb-6 editorial-image-frame relative">
              <img
                src={featured.coverImage}
                alt={featured.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 px-3 py-1 rounded bg-black/80 backdrop-blur-md border border-[#C7A46A]/40 text-[#C7A46A] text-[9px] font-mono tracking-widest uppercase">
                FEATURED DISPATCH • {featured.category}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-4 text-xs font-mono text-neutral-400 mb-2">
                <span className="flex items-center gap-1.5">
                  <Calendar size={12} />
                  {featured.date}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Clock size={12} />
                  {featured.readTime}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-serif text-white uppercase tracking-wide group-hover:text-[#C7A46A] transition-colors leading-snug mb-3">
                {featured.title}
              </h3>

              <p className="text-neutral-300 text-xs md:text-sm font-light leading-relaxed mb-6">
                {featured.excerpt}
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
              <Link
                href={`/press/${featured.slug}`}
                data-cursor="READ"
                className="btn-luxury btn-luxury-gold rounded-full text-xs inline-flex items-center gap-2"
              >
                <span>READ FULL ARTICLE</span>
                <ArrowUpRight size={13} />
              </Link>
              <span className="text-[10px] font-mono text-neutral-500 uppercase">
                {featured.author}
              </span>
            </div>
          </div>

          {/* Secondary Stories as Refined Editorial Rows (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            {secondary.map((article) => (
              <Link
                key={article.id}
                href={`/press/${article.slug}`}
                data-cursor="READ"
                className="p-6 rounded-2xl bg-[#111111] border border-neutral-800 hover:border-[#C7A46A]/50 transition-all flex flex-col justify-between group no-underline"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 mb-2">
                    <span className="text-[#C7A46A] uppercase tracking-widest">
                      {article.category}
                    </span>
                    <span>{article.date}</span>
                  </div>
                  <h4 className="text-base sm:text-lg font-serif text-white uppercase group-hover:text-[#C7A46A] transition-colors leading-snug mb-2">
                    {article.title}
                  </h4>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-neutral-850 text-xs text-neutral-500">
                  <span>{article.readTime}</span>
                  <ArrowUpRight size={14} className="text-[#C7A46A] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Level 05: Directional Cue */}
      <div className="scene-directional-cue">
        <span>13 / 17 • SCROLL TO PARTNERS ↓</span>
      </div>
    </section>
  );
};
