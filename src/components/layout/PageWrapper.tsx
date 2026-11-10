import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { getSeoMetadata } from '../../services/cmsService';

interface PageWrapperProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  canonical?: string;
  schema?: Record<string, unknown>;
  noPaddingTop?: boolean;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({
  title,
  description = "RFR BY RIYAS — Riyas Fashion Runway is an international luxury fashion, lifestyle and creative platform connecting fashion, events, campaigns, talent and cultural media.",
  children,
  canonical = "https://rfrbyriyas.com",
  schema,
  noPaddingTop = false,
}) => {
  const [location] = useLocation();
  const isHome = location === '/';

  const [seoData, setSeoData] = useState<{
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
    ogImageUrl?: string;
    keywords?: string[];
  }>({});

  useEffect(() => {
    let isMounted = true;
    getSeoMetadata(location).then((meta) => {
      if (!isMounted) return;
      if (meta) {
        setSeoData({
          metaTitle: meta.meta_title?.trim() || undefined,
          metaDescription: meta.meta_description?.trim() || undefined,
          canonicalUrl: meta.canonical_url?.trim() || undefined,
          ogImageUrl: meta.og_image_url?.trim() || undefined,
          keywords: meta.keywords && meta.keywords.length > 0 ? meta.keywords : undefined,
        });
      } else {
        setSeoData({});
      }
    });
    return () => {
      isMounted = false;
    };
  }, [location]);

  useEffect(() => {
    if (window.location.hash) {
      const hashId = window.location.hash.replace(/^#/, '');
      const targetEl = document.getElementById(hashId);
      if (targetEl) {
        const timer = setTimeout(() => {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }, 150);
        return () => clearTimeout(timer);
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [location]);

  const activeTitle = seoData.metaTitle || (title ? `${title} | RFR BY RIYAS — Riyas Fashion Runway` : 'RFR BY RIYAS — Riyas Fashion Runway');
  const activeDescription = seoData.metaDescription || description;
  const activeCanonical = seoData.canonicalUrl || canonical;
  const activeKeywords = seoData.keywords?.join(', ');

  return (
    <>
      <Helmet>
        <title>{activeTitle}</title>
        <meta name="description" content={activeDescription} />
        {activeKeywords && <meta name="keywords" content={activeKeywords} />}
        <link rel="canonical" href={activeCanonical} />
        <meta property="og:title" content={activeTitle} />
        <meta property="og:description" content={activeDescription} />
        <meta property="og:url" content={activeCanonical} />
        {seoData.ogImageUrl && <meta property="og:image" content={seoData.ogImageUrl} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={activeTitle} />
        <meta name="twitter:description" content={activeDescription} />
        {seoData.ogImageUrl && <meta name="twitter:image" content={seoData.ogImageUrl} />}
        {schema && (
          <script type="application/ld+json">
            {JSON.stringify(schema)}
          </script>
        )}
      </Helmet>

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`min-h-screen ${(isHome || noPaddingTop) ? 'pt-0' : 'pt-28 sm:pt-32 md:pt-36'} pb-16 md:pb-24`}
      >
        {children}
      </motion.main>
    </>
  );
};
