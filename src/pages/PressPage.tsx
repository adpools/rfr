import React, { useState, useEffect } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { motion } from 'framer-motion';
import { Sparkles, Maximize2, Newspaper, Building2 } from 'lucide-react';
import { getPressClippings } from '../services/cmsService';
import { useMediaViewer } from '../context/MediaViewerContext';

export interface PressItem {
  id: string;
  brand: string; // BRAND OR ORGANISATION NAME ONLY
  category: 'Print Press' | 'Television Broadcast' | 'Music & Entertainment' | 'Festivals & Events';
  typeLabel: string;
  filename: string;
  src: string;
}

// Curated authentic press clippings — Deduplicated with Brand-Only titles
// All duplicate crops, repeated snippets, and uncredited fragments removed.
// Retained the single best-quality original for every unique publication and feature.
const pressItems: PressItem[] = [
  {
    id: 'press-koottam-stage',
    brand: 'Koottam',
    category: 'Festivals & Events',
    typeLabel: 'Stage Presentation & Felicitations • Technopark',
    filename: 'WhatsApp Image 2026-11-04 at 9.41.04 PM (1).jpeg',
    src: '/news%20and%20press/WhatsApp%20Image%202026-11-04%20at%209.41.04%20PM%20(1).jpeg'
  },
  {
    id: 'press-asianet-news',
    brand: 'Asianet News',
    category: 'Television Broadcast',
    typeLabel: 'Statewide Prime News Bulletin Coverage',
    filename: 'WhatsApp Image 2026-11-04 at 9.41.04 PM.jpeg',
    src: '/news%20and%20press/WhatsApp%20Image%202026-11-04%20at%209.41.04%20PM.jpeg'
  },
  {
    id: 'press-global-fashion-week',
    brand: 'Global Fashion Week',
    category: 'Festivals & Events',
    typeLabel: 'Season 2 Red Carpet & Runway Feature',
    filename: 'WhatsApp Image 2026-11-04 at 9.41.05 PM (1).jpeg',
    src: '/news%20and%20press/WhatsApp%20Image%202026-11-04%20at%209.41.05%20PM%20(1).jpeg'
  },
  {
    id: 'press-koottam-announcement',
    brand: 'Koottam',
    category: 'Festivals & Events',
    typeLabel: 'Official Flea Festival Announcement • Technopark',
    filename: 'WhatsApp Image 2026-11-04 at 9.41.05 PM.jpeg',
    src: '/news%20and%20press/WhatsApp%20Image%202026-11-04%20at%209.41.05%20PM.jpeg'
  },
  {
    id: 'press-techies-summer-fest',
    brand: "Techie's Summer Fest",
    category: 'Festivals & Events',
    typeLabel: 'Summer Festival Official Release • Genrobotics & Technopark',
    filename: 'WhatsApp Image 2026-11-04 at 9.41.06 PM (1).jpeg',
    src: '/news%20and%20press/WhatsApp%20Image%202026-11-04%20at%209.41.06%20PM%20(1).jpeg'
  },
  {
    id: 'press-manorama-music',
    brand: 'Manorama Music',
    category: 'Music & Entertainment',
    typeLabel: 'Koode Nee Musical Release Feature',
    filename: 'WhatsApp Image 2026-11-04 at 9.41.06 PM (2).jpeg',
    src: '/news%20and%20press/WhatsApp%20Image%202026-11-04%20at%209.41.06%20PM%20(2).jpeg'
  },
  {
    id: 'press-koottam-installation',
    brand: 'Koottam',
    category: 'Festivals & Events',
    typeLabel: 'Technopark Amphitheatre Event Showcase',
    filename: 'WhatsApp Image 2026-11-04 at 9.41.07 PM (1).jpeg',
    src: '/news%20and%20press/WhatsApp%20Image%202026-11-04%20at%209.41.07%20PM%20(1).jpeg'
  },
  {
    id: 'press-srishti-music',
    brand: 'Srishti Music',
    category: 'Music & Entertainment',
    typeLabel: 'Love You Too Musical Release Feature',
    filename: 'WhatsApp Image 2026-11-04 at 9.41.07 PM.jpeg',
    src: '/news%20and%20press/WhatsApp%20Image%202026-11-04%20at%209.41.07%20PM.jpeg'
  },
  {
    id: 'press-vanimahal-creations',
    brand: 'Vanimahal Creations',
    category: 'Music & Entertainment',
    typeLabel: 'Vincent and the Pope Production Feature',
    filename: 'WhatsApp Image 2026-11-04 at 9.41.08 PM.jpeg',
    src: '/news%20and%20press/WhatsApp%20Image%202026-11-04%20at%209.41.08%20PM.jpeg'
  },
  {
    id: 'press-dr-praveen-musical',
    brand: 'Dr. Praveen Musical',
    category: 'Music & Entertainment',
    typeLabel: 'Kaun Disa Mein Cover Album Feature',
    filename: 'WhatsApp Image 2026-11-04 at 9.41.09 PM.jpeg',
    src: '/news%20and%20press/WhatsApp%20Image%202026-11-04%20at%209.41.09%20PM.jpeg'
  },
  {
    id: 'press-chandrika-daily',
    brand: 'Chandrika',
    category: 'Print Press',
    typeLabel: 'State Daily Newspaper Print Feature with Masthead',
    filename: 'WhatsApp Image 2026-11-04 at 9.42.08 PM (1).jpeg',
    src: '/news%20and%20press/WhatsApp%20Image%202026-11-04%20at%209.42.08%20PM%20(1).jpeg'
  },
  {
    id: 'press-kerala-kaumudi',
    brand: 'Kerala Kaumudi',
    category: 'Print Press',
    typeLabel: 'Daily Newspaper Clipping with Official Masthead',
    filename: 'WhatsApp Image 2026-11-04 at 9.42.10 PM (1).jpeg',
    src: '/news%20and%20press/WhatsApp%20Image%202026-11-04%20at%209.42.10%20PM%20(1).jpeg'
  },
  {
    id: 'press-technopark-feature',
    brand: 'Technopark',
    category: 'Print Press',
    typeLabel: 'Back to Campus Initiative Print Coverage',
    filename: 'WhatsApp Image 2026-11-04 at 9.42.11 PM (1).jpeg',
    src: '/news%20and%20press/WhatsApp%20Image%202026-11-04%20at%209.42.11%20PM%20(1).jpeg'
  },
  {
    id: 'press-technopark-english-daily',
    brand: 'Technopark',
    category: 'Print Press',
    typeLabel: 'English Daily Newspaper Feature on Flea Market Events',
    filename: 'WhatsApp Image 2026-11-04 at 9.42.11 PM (2).jpeg',
    src: '/news%20and%20press/WhatsApp%20Image%202026-11-04%20at%209.42.11%20PM%20(2).jpeg'
  },
  {
    id: 'press-metro-vartha',
    brand: 'Metro Vartha',
    category: 'Print Press',
    typeLabel: 'Statewide Daily Newsprint Feature with Masthead',
    filename: 'WhatsApp Image 2026-11-04 at 9.42.11 PM.jpeg',
    src: '/news%20and%20press/WhatsApp%20Image%202026-11-04%20at%209.42.11%20PM.jpeg'
  },
  {
    id: 'press-technopark-kerala-piravi',
    brand: 'Technopark',
    category: 'Print Press',
    typeLabel: 'Kerala Piravi Flea Market English Newsprint Article',
    filename: 'WhatsApp Image 2026-11-04 at 9.42.14 PM.jpeg',
    src: '/news%20and%20press/WhatsApp%20Image%202026-11-04%20at%209.42.14%20PM.jpeg'
  },
  {
    id: 'press-aynus-entertainments',
    brand: 'Aynus Entertainments',
    category: 'Music & Entertainment',
    typeLabel: 'Thara Production Showcase Feature',
    filename: 'WhatsApp Image 2026-11-04 at 9.46.07 PM.jpeg',
    src: '/news%20and%20press/WhatsApp%20Image%202026-11-04%20at%209.46.07%20PM.jpeg'
  },
  {
    id: 'press-success-kerala',
    brand: 'Success Kerala',
    category: 'Print Press',
    typeLabel: "പാഷനുണ്ടോ? വിജയം താനേ വരും! ഇത് 'സർട്ടിഫൈഡ്' ഉറപ്പ്...! • Do You Have Passion? Success Will Come",
    filename: 'WhatsApp Image 2026-11-06 at 10.53.08 AM (1).jpeg',
    src: '/news%20and%20press/WhatsApp%20Image%202026-11-06%20at%2010.53.08%20AM%20(1).jpeg'
  }
];

export const PressPage: React.FC = () => {
  const [items, setItems] = useState<PressItem[]>(pressItems);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { openImage } = useMediaViewer();

  useEffect(() => {
    getPressClippings().then((records) => {
      const valid = records.filter(r => r.cover_image && !r.cover_image.includes('final bro.png'));
      if (valid.length > 0) {
        const categoryMap = (cat: string): PressItem['category'] => {
          if (cat === 'Press' || cat === 'Print Press') return 'Print Press';
          if (cat === 'News' || cat === 'Television Broadcast') return 'Television Broadcast';
          if (cat === 'Collaborations' || cat === 'Music & Entertainment') return 'Music & Entertainment';
          return 'Festivals & Events';
        };

        const mapped: PressItem[] = valid.map((r) => ({
          id: r.id || r.slug,
          brand: r.author && r.author !== 'Editorial Desk' ? r.author : r.title,
          category: categoryMap(r.category),
          typeLabel: r.excerpt || r.title,
          filename: r.cover_image.split('/').pop() || '',
          src: r.cover_image,
        }));
        setItems(mapped);
      }
    });
  }, []);

  const categories = [
    { label: 'All Clippings', value: 'all' },
    { label: 'Print Press', value: 'Print Press' },
    { label: 'Television Broadcast', value: 'Television Broadcast' },
    { label: 'Music & Entertainment', value: 'Music & Entertainment' },
    { label: 'Festivals & Events', value: 'Festivals & Events' }
  ];

  const filteredItems = selectedCategory === 'all'
    ? items
    : items.filter((item) => item.category === selectedCategory);

  const handleOpenClipping = (index: number) => {
    const active = filteredItems[index];
    if (!active) return;

    openImage({
      src: active.src,
      alt: `${active.brand} — Press Clipping`,
      title: active.brand,
      subtitle: active.category,
      caption: active.typeLabel,
      items: filteredItems.map((p) => ({
        src: p.src,
        alt: `${p.brand} — Press Clipping`,
        title: p.brand,
        subtitle: p.category,
        caption: p.typeLabel,
      })),
      initialIndex: index,
    });
  };

  return (
    <PageWrapper
      title="News & Press Archive | Riyas Fashion Runway"
      description="Curated visual archive of print newspaper coverage, television broadcasts, and publication features documenting Riyas Fashion Runway."
    >
      <div className="editorial-container py-12 md:py-20">
        
        {/* Editorial Subpage Hero Header */}
        <div className="max-w-4xl mb-12 md:mb-16">
          <div className="flex items-center gap-3 text-xs font-mono tracking-[0.35em] text-[#C7A46A] uppercase mb-4">
            <Sparkles size={14} className="text-[#C7A46A]" />
            <span>EDITORIAL ARCHIVE • MEDIA & PRESS</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-light text-white uppercase tracking-tight leading-[0.98] mb-6">
            NEWS & <br />
            <span className="italic text-[#C7A46A] font-normal">PRESS GALLERY.</span>
          </h1>

          <p className="text-neutral-300 text-sm md:text-base font-light leading-relaxed max-w-3xl">
            A curated visual retrospective of print media features, newspaper clippings, and press publications documenting landmark runways, campaigns, and cultural milestones spearheaded by <strong>RFR</strong> and <strong>Riyas</strong>.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-400">
            <span className="px-3.5 py-1.5 rounded-full bg-[#141414] border border-neutral-800 text-[#C7A46A]">
              ✦ {items.length} Unique Verified Publications
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-[#141414] border border-neutral-800 text-neutral-300">
              ✦ Brand-Only Titles
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-[#141414] border border-neutral-800 text-[#FAF9F6]">
              ✦ High-Resolution Lightbox
            </span>
          </div>
        </div>

        {/* Minimal Category Filter & Control Bar */}
        <div className="p-4 md:p-5 rounded-2xl bg-[#0e0e0e]/95 border border-neutral-800/80 backdrop-blur-xl mb-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 shadow-xl">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => {
                  setSelectedCategory(cat.value);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono tracking-wider transition-all duration-200 ${
                  selectedCategory === cat.value
                    ? 'bg-[#C7A46A] text-black font-semibold shadow-md shadow-[#C7A46A]/20'
                    : 'bg-[#141414] text-neutral-400 hover:text-white border border-neutral-800/80 hover:border-neutral-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-500 uppercase tracking-wider">
            <Newspaper size={14} className="text-[#C7A46A]" />
            <span>CLICK ANY CLIPPING TO VIEW ORIGINAL HIGH-RES MEDIA</span>
          </div>
        </div>

        {/* Spacious Editorial Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7 md:gap-8">
          {filteredItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: (idx % 6) * 0.05 }}
              onClick={() => handleOpenClipping(idx)}
              className="group relative cursor-pointer rounded-2xl overflow-hidden bg-[#111111] border border-neutral-800 hover:border-[#C7A46A]/60 transition-all duration-300 flex flex-col shadow-lg hover:shadow-2xl hover:shadow-[#C7A46A]/5"
            >
              {/* Image Frame with natural top-alignment for newspaper headers */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#0c0c0c]">
                <img
                  src={item.src}
                  alt={`${item.brand} — Press Clipping`}
                  loading="lazy"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Subtle Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 pointer-events-none">
                  <div className="flex justify-end">
                    <span className="p-2 rounded-full bg-black/80 backdrop-blur-md text-[#C7A46A] border border-[#C7A46A]/50 shadow-xl">
                      <Maximize2 size={14} />
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 text-xs">
                    <span className="text-[#C7A46A] font-mono font-bold tracking-wider uppercase">
                      {item.brand}
                    </span>
                    <span className="text-[11px] text-neutral-300 font-light line-clamp-1">
                      {item.typeLabel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Clean Brand-Only Card Title Footer */}
              <div className="p-4 bg-[#121212] border-t border-neutral-800/80 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white tracking-wide group-hover:text-[#C7A46A] transition-colors">
                    {item.brand}
                  </h3>
                  <span className="text-[10px] font-mono text-[#C7A46A] bg-[#C7A46A]/10 px-2 py-0.5 rounded-full border border-[#C7A46A]/20">
                    {item.category === 'Print Press' ? 'PRINT' : item.category === 'Television Broadcast' ? 'TV' : 'FEATURE'}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 font-mono tracking-tight line-clamp-1">
                  {item.typeLabel}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </PageWrapper>
  );
};
