import React, { useState, useEffect } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { motion } from 'framer-motion';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useMediaViewer } from '../context/MediaViewerContext';
import {
  Camera,
  Maximize2
} from 'lucide-react';

interface RiyasImageItem {
  id: string;
  src: string;
  alt: string;
  orientation: 'landscape' | 'portrait';
}

const riyasImages: RiyasImageItem[] = [
  {
    id: 'riyas-01',
    src: '/images/riyas%20img%20gal/0W0A4080.JPG',
    alt: 'Riyas high-resolution master editorial portrait photograph',
    orientation: 'landscape',
  },
  {
    id: 'riyas-02',
    src: '/images/riyas%20img%20gal/FB_IMG_1755941174694.jpg',
    alt: 'Riyas high-fashion lookbook vertical portrait photograph',
    orientation: 'portrait',
  },
  {
    id: 'riyas-03',
    src: '/images/riyas%20img%20gal/0W0A4081.JPG',
    alt: 'Riyas runway staging and luxury fashion editorial photograph',
    orientation: 'landscape',
  },
  {
    id: 'riyas-04',
    src: '/images/riyas%20img%20gal/WhatsApp%20Image%202026-11-04%20at%2011.37.55%20PM.jpeg',
    alt: 'Riyas contemporary editorial portrait photograph',
    orientation: 'portrait',
  },
  {
    id: 'riyas-05',
    src: '/images/riyas%20img%20gal/0W0A4085.JPG',
    alt: 'Riyas creative direction and cinematic presentation photograph',
    orientation: 'landscape',
  },
  {
    id: 'riyas-06',
    src: '/images/riyas%20img%20gal/FB_IMG_1718991236184.jpg',
    alt: 'Riyas signature styling and studio portrait photograph',
    orientation: 'landscape',
  },
  {
    id: 'riyas-07',
    src: '/images/riyas%20img%20gal/WhatsApp%20Image%202026-11-04%20at%2011.37.56%20PM%20(1).jpeg',
    alt: 'Riyas signature styling and studio portrait photograph',
    orientation: 'portrait',
  },
  {
    id: 'riyas-08',
    src: '/images/riyas%20img%20gal/DSC00324.jpg',
    alt: 'Riyas editorial portraiture and runway showcase photograph',
    orientation: 'landscape',
  },
  {
    id: 'riyas-09',
    src: '/images/riyas%20img%20gal/WhatsApp%20Image%202026-11-04%20at%2011.37.56%20PM.jpeg',
    alt: 'Riyas fashion presentation and visual storytelling photograph',
    orientation: 'portrait',
  },
  {
    id: 'riyas-10',
    src: '/images/riyas%20img%20gal/FB_IMG_1763791773619.jpg',
    alt: 'Riyas lifestyle and fashion portrait photograph',
    orientation: 'landscape',
  },
  {
    id: 'riyas-11',
    src: '/images/riyas%20img%20gal/WhatsApp%20Image%202026-11-04%20at%2011.37.57%20PM%20(1).jpeg',
    alt: 'Riyas cultural styling and lifestyle portrait photograph',
    orientation: 'portrait',
  },
  {
    id: 'riyas-12',
    src: '/images/riyas%20img%20gal/FB_IMG_1763791778722.jpg',
    alt: 'Riyas creative direction and event photograph',
    orientation: 'landscape',
  },
  {
    id: 'riyas-13',
    src: '/images/riyas%20img%20gal/WhatsApp%20Image%202026-11-04%20at%2011.37.57%20PM.jpeg',
    alt: 'Riyas modern couture and expressive portrait photograph',
    orientation: 'portrait',
  },
];

export const RiyasGalleryPage: React.FC = () => {
  const [images, setImages] = useState<RiyasImageItem[]>(riyasImages);
  const { openImage } = useMediaViewer();

  useEffect(() => {
    const fetchGallery = async () => {
      if (!isSupabaseConfigured) return;
      try {
        const { data, error } = await supabase
          .from('riyas_gallery_items')
          .select('*')
          .eq('is_published', true)
          .order('sort_order', { ascending: true });

        if (!error && data && data.length > 0) {
          const cmsImages: RiyasImageItem[] = data.map((item: any) => ({
            id: item.id || `cms-${item.title}`,
            src: item.image || item.image_url,
            alt: item.caption || item.title || 'Riyas gallery portrait',
            orientation: (item.orientation === 'landscape' ? 'landscape' : 'portrait') as 'landscape' | 'portrait',
          }));
          setImages(cmsImages);
        }
      } catch {
        // Fallback to local images
      }
    };

    fetchGallery();
  }, []);

  const handleOpenPhoto = (index: number) => {
    const active = images[index];
    if (!active) return;

    openImage({
      src: active.src,
      alt: active.alt,
      title: `Riyas Portrait Archive • ${String(index + 1).padStart(2, '0')}`,
      subtitle: active.orientation.toUpperCase(),
      caption: active.alt,
      items: images.map((img, i) => ({
        src: img.src,
        alt: img.alt,
        title: `Riyas Portrait Archive • ${String(i + 1).padStart(2, '0')}`,
        subtitle: img.orientation.toUpperCase(),
        caption: img.alt,
      })),
      initialIndex: index,
    });
  };

  return (
    <PageWrapper
      title="Riyas — Photography Gallery | Riyas Fashion Runway"
      description="Exclusive photography gallery and curated portrait archive of Riyas."
    >
      <div className="editorial-container py-12 md:py-20">
        
        {/* Header Section */}
        <div className="max-w-4xl mb-12 md:mb-16">
          <div className="flex items-center gap-3 text-xs font-mono tracking-[0.35em] text-[#C7A46A] uppercase mb-4">
            <Camera size={14} className="text-[#C7A46A]" />
            <span>PHOTOGRAPHY ARCHIVE • PORTRAITURE</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-light text-white uppercase tracking-tight leading-[0.98] mb-6">
            RIYAS <br />
            <span className="italic text-[#C7A46A] font-normal">PHOTO GALLERY.</span>
          </h1>

          <p className="text-neutral-300 text-sm md:text-base font-light leading-relaxed max-w-2xl">
            A dedicated photography exhibition capturing bespoke editorial portraiture, runway aesthetics, and personal archival moments.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-400">
            <span className="px-3.5 py-1.5 rounded-full bg-[#141414] border border-neutral-800 text-[#C7A46A]">
              ✦ {images.length} Curated Photographs
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-[#141414] border border-neutral-800 text-neutral-300">
              ✦ Original Master Quality
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-[#141414] border border-neutral-800 text-[#FAF9F6]">
              ✦ Interactive Zoom & Fullscreen
            </span>
          </div>
        </div>

        {/* Spacious Masonry Photography Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 sm:gap-8 space-y-6 sm:space-y-8">
          {images.map((img, idx) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              onClick={() => handleOpenPhoto(idx)}
              className="break-inside-avoid group relative rounded-2xl overflow-hidden bg-[#0d0d0d] border border-neutral-800/80 hover:border-[#C7A46A]/60 transition-all duration-500 shadow-xl cursor-pointer"
            >
              <div className="relative overflow-hidden w-full bg-[#141414]">
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto block object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                />

                {/* Subtle Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
                  <div className="flex justify-end">
                    <span className="w-10 h-10 rounded-full bg-black/60 border border-neutral-700 backdrop-blur-md flex items-center justify-center text-[#C7A46A] group-hover:scale-110 transition-transform">
                      <Maximize2 size={16} />
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono text-neutral-300">
                    <span className="text-[#C7A46A] font-bold tracking-widest">
                      {String(idx + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
                    </span>
                    <span className="uppercase tracking-wider text-[11px] text-white/80">
                      EXPAND & ZOOM PHOTO
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </PageWrapper>
  );
};
