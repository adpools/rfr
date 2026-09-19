import React from 'react';
import { useRoute, Link } from 'wouter';
import { PageWrapper } from '../components/layout/PageWrapper';
import { SectionHeading } from '../components/common/SectionHeading';
import { pressData } from '../data/pressData';
import { ArrowLeft, Calendar, Clock, Share2, Quote, Tag } from 'lucide-react';

export const PressDetailPage: React.FC = () => {
  const [, params] = useRoute('/press/:slug');
  const slug = params?.slug;

  const article = pressData.find((p) => p.slug === slug) || pressData[0];

  const schema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title,
    "image": [article.coverImage],
    "datePublished": article.date,
    "author": [{
      "@type": "Person",
      "name": article.author
    }],
    "publisher": {
      "@type": "Organization",
      "name": "RFR BY RIYAS"
    },
    "description": article.excerpt
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Article link copied to clipboard.');
    }
  };

  return (
    <PageWrapper
      title={article.title}
      description={article.excerpt}
      schema={schema}
    >
      <div className="editorial-container py-12 md:py-20">
        <Link
          href="/press"
          className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-[#C7A46A] hover:text-white transition-colors uppercase mb-8"
        >
          <ArrowLeft size={14} />
          <span>BACK TO ALL DISPATCHES</span>
        </Link>

        {/* Article Header */}
        <div className="max-w-4xl mx-auto text-left mb-12">
          <div className="flex items-center gap-3 mb-4 text-xs font-mono text-neutral-400">
            <span className="text-[#C7A46A] uppercase tracking-widest px-2.5 py-0.5 rounded border border-[#C7A46A]/30">
              {article.category}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={13} />
              {article.date}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock size={13} />
              {article.readTime}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif text-white uppercase tracking-tight leading-[1.05] mb-6">
            {article.title}
          </h1>

          <div className="flex items-center justify-between pt-4 border-t border-neutral-800 text-xs text-neutral-400">
            <span>By <strong className="text-white font-medium">{article.author}</strong></span>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#181818] border border-neutral-700 hover:border-[#C7A46A] text-neutral-300 hover:text-white transition-colors"
            >
              <Share2 size={13} />
              <span>SHARE DISPATCH</span>
            </button>
          </div>
        </div>

        {/* Cover Image */}
        <div className="max-w-5xl mx-auto h-80 sm:h-[500px] rounded-3xl overflow-hidden editorial-image-frame border border-neutral-800 mb-16">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Body */}
        <div className="max-w-3xl mx-auto space-y-6 text-neutral-300 text-base md:text-lg font-light leading-relaxed">
          {article.content.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}

          {/* Quote Section if present */}
          {article.quote && (
            <div className="my-10 p-8 rounded-2xl bg-[#121212] border-l-2 border-[#C7A46A]">
              <Quote size={24} className="text-[#C7A46A] mb-3 opacity-60" />
              <p className="text-xl font-serif italic text-white leading-relaxed mb-3">
                "{article.quote.text}"
              </p>
              <span className="text-xs font-mono text-[#C7A46A] uppercase tracking-widest block">
                — {article.quote.author}
              </span>
            </div>
          )}

          {/* Tags */}
          <div className="pt-8 border-t border-neutral-800 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#141414] border border-neutral-800 text-xs font-mono text-neutral-400"
              >
                <Tag size={12} className="text-[#C7A46A]" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};
