import React, { useState, useEffect } from 'react';
import { useRoute, Link } from 'wouter';
import { PageWrapper } from '../components/layout/PageWrapper';
import { pressData } from '../data/pressData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ArrowLeft, Calendar, Clock, Share2, Quote, Tag, Maximize2 } from 'lucide-react';
import { useMediaViewer } from '../context/MediaViewerContext';

interface ArticleView {
  title: string;
  category: string;
  date: string;
  author: string;
  readTime: string;
  coverImage: string;
  excerpt: string;
  content: string[];
  quote?: { text: string; author: string };
  tags: string[];
}

export const PressDetailPage: React.FC = () => {
  const [, params] = useRoute('/press/:slug');
  const slug = params?.slug;
  const { openImage } = useMediaViewer();

  const defaultLocal = pressData.find((p) => p.slug === slug) || pressData[0];

  const [article, setArticle] = useState<ArticleView>({
    title: defaultLocal.title,
    category: defaultLocal.category,
    date: defaultLocal.date,
    author: defaultLocal.author,
    readTime: defaultLocal.readTime,
    coverImage: defaultLocal.coverImage,
    excerpt: defaultLocal.excerpt,
    content: defaultLocal.content,
    quote: defaultLocal.quote,
    tags: defaultLocal.tags,
  });

  useEffect(() => {
    if (!slug) return;

    const fetchLiveArticle = async () => {
      if (!isSupabaseConfigured) return;
      try {
        const { data, error } = await supabase
          .from('press_articles')
          .select('*')
          .eq('slug', slug)
          .eq('is_published', true)
          .single();

        if (!error && data) {
          setArticle({
            title: data.title,
            category: data.category,
            date: data.date_label || new Date(data.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            author: data.author || 'Editorial Desk',
            readTime: data.read_time || '4 min read',
            coverImage: data.cover_image,
            excerpt: data.excerpt,
            content: Array.isArray(data.content) && data.content.length > 0 ? data.content : [data.excerpt],
            quote: data.quote_text ? { text: data.quote_text, author: data.quote_author || 'RFR Editorial' } : undefined,
            tags: data.tags || ['Fashion'],
          });
        }
      } catch {
        // Fallback to static
      }
    };

    fetchLiveArticle();
  }, [slug]);

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
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#181818] border border-neutral-700 hover:border-[#C7A46A] text-neutral-300 hover:text-white transition-colors"
            >
              <Share2 size={13} />
              <span>SHARE DISPATCH</span>
            </button>
          </div>
        </div>

        {/* Cover Image */}
        <div 
          onClick={() => openImage({
            src: article.coverImage,
            alt: article.title,
            title: article.title,
            subtitle: article.category,
            caption: article.excerpt,
          })}
          className="max-w-5xl mx-auto h-80 sm:h-[500px] rounded-3xl overflow-hidden editorial-image-frame border border-neutral-800 mb-16 relative group cursor-pointer"
        >
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
          />
          <div className="absolute top-4 right-4 p-2.5 rounded-full bg-black/70 border border-neutral-700 text-[#C7A46A] opacity-0 group-hover:opacity-100 transition-opacity">
            <Maximize2 size={16} />
          </div>
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
                &ldquo;{article.quote.text}&rdquo;
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
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-[#141414] border border-neutral-800 text-xs font-mono text-neutral-400"
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
