import React, { useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { SectionHeading } from '../components/common/SectionHeading';
import { pressData } from '../data/pressData';
import { ArrowUpRight, Calendar, Clock, Search } from 'lucide-react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';

export const PressPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['all', 'Press', 'News', 'Announcements', 'Collaborations'];

  const filtered = pressData.filter((article) => {
    const matchesCat = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesQuery = searchQuery === '' ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <PageWrapper
      title="Press, News & Editorial Dispatches"
      description="Read the latest press releases, strategic announcements, and industry articles from Riyas Fashion Runway."
    >
      <div className="editorial-container py-12 md:py-20">
        <SectionHeading
          number="PRESS"
          category="MEDIA & NEWS"
          title="EDITORIAL DISPATCHES"
          subtitle="Explore in-depth editorial articles, industry think pieces, official announcements, and media releases from the RFR ecosystem."
        />

        {/* Filter & Search Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-800 mb-12">
          <div className="flex items-center gap-2 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs font-mono uppercase tracking-widest transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#C7A46A] text-black font-bold'
                    : 'bg-[#121212] text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                {cat === 'all' ? 'All Dispatches' : cat}
              </button>
            ))}
          </div>

          <div className="relative max-w-xs w-full">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#141414] border border-neutral-800 rounded-full pl-9 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#C7A46A] transition-colors"
            />
          </div>
        </div>

        {/* Articles List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filtered.map((article, idx) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="p-8 rounded-3xl bg-[#111111] border border-neutral-800 hover:border-[#C7A46A]/50 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="h-60 rounded-2xl overflow-hidden mb-6 editorial-image-frame relative">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded bg-black/80 backdrop-blur-md border border-[#C7A46A]/40 text-[#C7A46A] text-[10px] font-mono tracking-widest uppercase">
                    {article.category}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono text-neutral-400 mb-3">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} />
                    {article.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={13} />
                    {article.readTime}
                  </span>
                </div>

                <h3 className="text-2xl font-serif text-white uppercase tracking-wide group-hover:text-[#C7A46A] transition-colors leading-snug mb-3">
                  {article.title}
                </h3>

                <p className="text-neutral-300 text-sm font-light leading-relaxed mb-6">
                  {article.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
                <Link
                  href={`/press/${article.slug}`}
                  data-cursor="READ"
                  className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-[#FAF9F6] hover:text-[#C7A46A] transition-colors uppercase"
                >
                  <span>FULL DISPATCH</span>
                  <ArrowUpRight size={13} />
                </Link>
                <span className="text-[10px] font-mono text-neutral-500 uppercase">
                  {article.author}
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
};
