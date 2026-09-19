import React, { useState } from 'react';
import { useRoute } from 'wouter';
import { PageWrapper } from '../components/layout/PageWrapper';
import { SectionHeading } from '../components/common/SectionHeading';
import { galleryData } from '../data/galleryData';
import { GalleryItem } from '../types';
import { LightboxModal } from '../components/common/LightboxModal';
import { Maximize2, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

interface GalleryPageProps {
  initialCategory?: 'events' | 'shows' | 'shoots';
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ initialCategory }) => {
  const [, params] = useRoute('/gallery/:category');
  const routeCategory = (params?.category as 'events' | 'shows' | 'shoots') || initialCategory;

  const [activeCategory, setActiveCategory] = useState<'all' | 'events' | 'shows' | 'shoots'>(
    routeCategory || 'all'
  );
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const filteredItems = activeCategory === 'all'
    ? galleryData
    : galleryData.filter((item) => item.category === activeCategory);

  return (
    <PageWrapper
      title="Curated Fashion, Shows & Shoots Gallery"
      description="Immerse yourself in the high-fashion editorial gallery of Riyas Fashion Runway. Browse runway shows, community events, and studio lookbooks."
    >
      <div className="editorial-container py-12 md:py-20">
        <SectionHeading
          number="GALLERY"
          category="VISUAL ARCHIVE"
          title="CURATED ARCHIVE"
          subtitle="A high-contrast visual archive documenting runway presentations, experiential events, behind-the-scenes moments, and editorial campaigns."
        />

        {/* Filter Tabs */}
        <div className="flex items-center gap-3 overflow-x-auto pb-6 border-b border-neutral-800 mb-12">
          {(['all', 'events', 'shows', 'shoots'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-xs font-mono uppercase tracking-widest transition-all ${
                activeCategory === cat
                  ? 'bg-[#C7A46A] text-black font-bold shadow-md shadow-[#C7A46A]/20'
                  : 'bg-[#121212] text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              {cat === 'all' ? 'All Collections' : cat}
            </button>
          ))}
        </div>

        {/* Dynamic Editorial Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              onClick={() => setSelectedItem(item)}
              data-cursor="OPEN"
              className="group relative h-96 sm:h-[420px] rounded-3xl overflow-hidden cursor-pointer bg-[#121212] border border-neutral-800 hover:border-[#C7A46A]/60 transition-all duration-500 flex flex-col justify-end p-6"
            >
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />

              <div className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 backdrop-blur-md text-white/70 group-hover:text-[#C7A46A] opacity-0 group-hover:opacity-100 transition-all duration-300">
                <Maximize2 size={16} />
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-mono tracking-widest text-[#C7A46A] uppercase px-2 py-0.5 rounded border border-[#C7A46A]/30">
                    {item.category}
                  </span>
                  <span className="text-[11px] text-neutral-400 font-mono">
                    {item.year}
                  </span>
                </div>

                <h3 className="text-2xl font-serif text-white uppercase tracking-wide group-hover:text-[#C7A46A] transition-colors leading-snug mb-2">
                  {item.title}
                </h3>

                <p className="text-xs text-neutral-300 font-light line-clamp-2 mb-3">
                  {item.caption}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/10">
                  {item.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-[10px] text-neutral-400 font-mono">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <LightboxModal
        item={selectedItem}
        items={filteredItems}
        onClose={() => setSelectedItem(null)}
        onSelect={(item) => setSelectedItem(item)}
      />
    </PageWrapper>
  );
};
