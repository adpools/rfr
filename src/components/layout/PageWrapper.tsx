import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

interface PageWrapperProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  canonical?: string;
  schema?: Record<string, unknown>;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({
  title,
  description = "RFR BY RIYAS — Riyas Fashion Runway is an international luxury fashion, lifestyle and creative platform connecting fashion, events, campaigns, talent and cultural media.",
  children,
  canonical = "https://rfrbyriyas.com",
  schema,
}) => {
  const [location] = useLocation();
  const isHome = location === '/';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [location]);

  const fullTitle = `${title} | RFR BY RIYAS — Riyas Fashion Runway`;

  return (
    <>
      <Helmet>
        <title>{fullTitle}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={description} />
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
        className={`min-h-screen ${isHome ? 'pt-0' : 'pt-28 sm:pt-32 md:pt-36 pb-16 md:pb-24'}`}
      >
        {children}
      </motion.main>
    </>
  );
};
