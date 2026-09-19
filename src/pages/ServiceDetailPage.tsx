import React from 'react';
import { useRoute, Link } from 'wouter';
import { PageWrapper } from '../components/layout/PageWrapper';
import { SectionHeading } from '../components/common/SectionHeading';
import { servicesData } from '../data/servicesData';
import { CheckCircle2, ArrowLeft, ArrowUpRight, Sparkles } from 'lucide-react';

interface ServiceDetailPageProps {
  customSlug?: string;
}

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({ customSlug }) => {
  const [, params] = useRoute('/services/:category/:slug');
  const slug = customSlug || params?.slug;

  const service = servicesData.find((s) => s.slug === slug) || servicesData[0];

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.title,
    "provider": {
      "@type": "Organization",
      "name": "RFR BY RIYAS"
    },
    "description": service.description
  };

  return (
    <PageWrapper
      title={`${service.title} — Service Specification`}
      description={service.description}
      schema={schema}
    >
      <div className="editorial-container py-12 md:py-20">
        {/* Back Link */}
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-[#C7A46A] hover:text-white transition-colors uppercase mb-8"
        >
          <ArrowLeft size={14} />
          <span>BACK TO ALL SERVICES</span>
        </Link>

        <SectionHeading
          number="IP SPEC"
          category={service.badge}
          title={service.title}
          subtitle={service.subheading}
        />

        {/* Hero Double Image Display */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 my-12">
          <div className="md:col-span-8 h-80 sm:h-[480px] rounded-3xl overflow-hidden editorial-image-frame border border-neutral-800">
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-full object-cover"
            />
          </div>
          {service.accentImage && (
            <div className="md:col-span-4 h-80 sm:h-[480px] rounded-3xl overflow-hidden editorial-image-frame border border-neutral-800 hidden md:block">
              <img
                src={service.accentImage}
                alt={`${service.title} Accent`}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Detailed Breakdown Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 my-16">
          <div className="lg:col-span-7 space-y-6 text-neutral-300 text-base md:text-lg font-light leading-relaxed">
            <h3 className="text-2xl font-serif text-white uppercase">OVERVIEW & PHILOSOPHY</h3>
            <p>{service.detailedOverview}</p>

            <div className="pt-6">
              <h4 className="text-lg font-serif text-white uppercase mb-4 flex items-center gap-2">
                <Sparkles size={16} className="text-[#C7A46A]" />
                <span>KEY HIGHLIGHTS</span>
              </h4>
              <div className="space-y-3">
                {service.keyHighlights.map((hl) => (
                  <div key={hl} className="flex items-start gap-3 text-sm text-neutral-300">
                    <CheckCircle2 size={16} className="text-[#C7A46A] shrink-0 mt-0.5" />
                    <span>{hl}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-8">
            {/* Deliverables Card */}
            <div className="p-8 rounded-2xl bg-[#111111] border border-neutral-800">
              <h4 className="text-base font-serif text-white uppercase tracking-wider mb-4 pb-3 border-b border-neutral-800">
                CORE DELIVERABLES
              </h4>
              <ul className="space-y-3 list-none text-xs md:text-sm text-neutral-300 font-light">
                {service.deliverables.map((del) => (
                  <li key={del} className="flex items-start gap-2">
                    <span className="text-[#C7A46A] font-mono">✦</span>
                    <span>{del}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Target Audience Card */}
            <div className="p-8 rounded-2xl bg-[#111111] border border-neutral-800">
              <h4 className="text-base font-serif text-white uppercase tracking-wider mb-2">
                TARGET AUDIENCE & SECTORS
              </h4>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                {service.targetAudience}
              </p>
            </div>

            {/* CTA Box */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-[#1c1710] to-[#121212] border border-[#C7A46A]/50 text-center">
              <h4 className="text-xl font-serif text-white uppercase mb-2">COMMISSION THIS IP</h4>
              <p className="text-xs text-neutral-300 mb-6">
                Consult with RFR creative directors to tailor this service for your brand or event calendar.
              </p>
              <Link
                href="/contact"
                className="btn-luxury btn-luxury-gold w-full rounded-full inline-flex items-center justify-center gap-2 text-xs"
              >
                <span>COMMISSION THIS SERVICE</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};
