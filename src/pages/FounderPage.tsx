import React from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { SectionHeading } from '../components/common/SectionHeading';
import { founderData } from '../data/founderData';
import { motion } from 'framer-motion';
import { Quote, ArrowUpRight } from 'lucide-react';
import { Link } from 'wouter';

export const FounderPage: React.FC = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Riyas",
    "jobTitle": "Founder & Creative Director",
    "worksFor": {
      "@type": "Organization",
      "name": "RFR BY RIYAS — Riyas Fashion Runway"
    },
    "description": "Fashion enthusiast, creative entrepreneur, influencer and event professional."
  };

  return (
    <PageWrapper
      title="The Founder — Riyas | Dossier & Vision"
      description="Meet Riyas, the founder and creative visionary behind Riyas Fashion Runway (RFR). Discover the journey, philosophy, and creative direction."
      schema={schema}
    >
      <div className="editorial-container py-12 md:py-20">
        <SectionHeading
          number="DOSSIER"
          category="THE FOUNDER"
          title="RIYAS"
          subtitle="Founder — Riyas Fashion Runway"
        />

        {/* Large Editorial Portrait + Bio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start my-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 h-[500px] sm:h-[620px] rounded-3xl overflow-hidden editorial-image-frame border border-[#C7A46A]/30 relative"
          >
            <img
              src={founderData.portraitImage}
              alt="Riyas — Founder of RFR"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <span className="text-[10px] font-mono tracking-widest text-[#C7A46A] uppercase block mb-1">
                EXECUTIVE DOSSIER
              </span>
              <h3 className="text-3xl font-serif">{founderData.name}</h3>
              <p className="text-xs text-neutral-400 uppercase tracking-widest">{founderData.title}</p>
            </div>
          </motion.div>

          <div className="lg:col-span-6 space-y-6">
            <h3 className="text-2xl md:text-3xl font-serif text-white uppercase leading-snug">
              A JOURNEY DRIVEN BY PASSION, STORYTELLING & HUMAN COLLABORATION.
            </h3>

            <div className="space-y-4 text-neutral-300 text-sm md:text-base font-light leading-relaxed">
              {founderData.bioParagraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {/* Quote Block */}
            <div className="p-6 rounded-2xl bg-[#121212] border-l-2 border-[#C7A46A] my-6">
              <Quote size={22} className="text-[#C7A46A] mb-3 opacity-70" />
              <p className="text-base italic font-serif text-neutral-200 leading-relaxed mb-3">
                "{founderData.quote.text}"
              </p>
              <span className="text-xs font-mono text-[#C7A46A] tracking-widest uppercase">
                — {founderData.quote.author}, {founderData.quote.role}
              </span>
            </div>

            <div className="pt-4">
              <Link
                href="/contact"
                className="btn-luxury btn-luxury-gold rounded-full inline-flex items-center gap-2 text-xs"
              >
                <span>REQUEST EXECUTIVE MEETING WITH RIYAS</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        {/* 4 Guiding Principles */}
        <div className="mt-20 pt-16 border-t border-neutral-800">
          <h3 className="text-2xl font-serif text-white uppercase tracking-wider mb-8 text-center">
            GUIDING CREATIVE PRINCIPLES
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {founderData.principles.map((pr) => (
              <div
                key={pr.number}
                className="p-6 rounded-2xl bg-[#101010] border border-neutral-800 hover:border-[#C7A46A]/40 transition-colors"
              >
                <span className="text-2xl font-sculptural text-[#C7A46A] font-bold block mb-3">
                  {pr.number}
                </span>
                <h4 className="text-lg font-serif text-white uppercase mb-2">
                  {pr.title}
                </h4>
                <p className="text-xs text-neutral-400 font-light leading-relaxed">
                  {pr.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};
