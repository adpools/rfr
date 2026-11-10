import React, { useState, useEffect } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { SectionHeading } from '../components/common/SectionHeading';
import { motion } from 'framer-motion';
import { Sparkles, Eye, Shield, Globe, Award, Image as ImageIcon, Briefcase, User, Users, ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'wouter';
import { founderData } from '../data/founderData';
import { getAboutRiyas, getProjectsPortfolio } from '../services/cmsService';
import { selectedWork, driveThumb, driveView } from '../data/selectedWorkData';

export const AboutPage: React.FC = () => {
  const [founder, setFounder] = useState({
    name: founderData.name,
    title: founderData.title,
    portraitImage: founderData.portraitImage,
    quote: 'Fashion is not merely what we wear; it is an architectural symphony of identity, passion and purpose.',
  });
  const [works, setWorks] = useState<any[]>(selectedWork);

  useEffect(() => {
    getAboutRiyas().then((res) => {
      if (res) {
        setFounder({
          name: res.founder_name || founderData.name,
          title: res.official_title || founderData.title,
          portraitImage: res.portrait_image || founderData.portraitImage,
          quote: res.quote || 'Fashion is not merely what we wear; it is an architectural symphony of identity, passion and purpose.',
        });
      }
    });

    getProjectsPortfolio().then((res) => {
      if (res && res.length > 0) {
        const mapped = res.map((p) => ({
          id: p.slug || p.id,
          year: p.year || 2026,
          title: p.title,
          category: p.category,
          driveFileId: '',
          customImage: p.cover_image,
          linkUrl: p.video_url || undefined,
        }));
        setWorks(mapped);
      }
    });
  }, []);

  const pillars = [
    {
      icon: Eye,
      title: 'Editorial Vision',
      desc: 'Treating every presentation, lookbook, and campaign with high-fashion editorial rigor, dramatic lighting, and refined curation.',
    },
    {
      icon: Sparkles,
      title: 'Creative Synergy',
      desc: 'Bridging high couture designers, energetic creators, and commercial enterprises to generate symbiotic cultural resonance.',
    },
    {
      icon: Globe,
      title: 'International Credibility',
      desc: 'Constructing production standards, spatial set architectures, and visual storytelling capable of competing on the global stage.',
    },
    {
      icon: Shield,
      title: 'Authenticity & Talent Welfare',
      desc: 'Providing models, creators, and artists with structured commercial opportunities, transparent workflows, and respectful mentorship.',
    },
  ];

  return (
    <PageWrapper
      title="About Us — Riyas Fashion Runway (RFR)"
      description="Learn about RFR's foundational ethos, founder profile by Riyas, achievements, curated gallery, and past landmark works."
    >
      <div className="editorial-container py-12 md:py-20">
        <SectionHeading
          number="02"
          category="FOUNDATION & LEADERSHIP"
          title="ABOUT US"
          subtitle="RFR By Riyas — An integrated creative platform focused on fashion, lifestyle, entertainment, advertising, events and digital media."
        />

        {/* Navigation Tabs: About Riyas & Our Team */}
        <div className="flex flex-wrap items-center gap-3 my-10">
          <div className="px-6 py-3 rounded-2xl font-mono text-xs uppercase tracking-wider flex items-center gap-2.5 bg-[#C7A46A] text-black font-semibold shadow-[0_0_15px_rgba(199,164,106,0.3)]">
            <User size={14} />
            <span>About Riyas</span>
          </div>

          <Link
            href="/our-team"
            className="px-6 py-3 rounded-2xl font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2.5 bg-[#111111] text-neutral-400 hover:text-[#C7A46A] hover:border-[#C7A46A]/50 border border-neutral-800 no-underline"
          >
            <Users size={14} />
            <span>Our Team</span>
          </Link>
        </div>

        {/* Tab 1: About Riyas */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-12"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-[#0d0d0d] border border-neutral-800 rounded-3xl p-8 lg:p-12">
              <div className="lg:col-span-5 h-96 lg:h-[480px] rounded-2xl overflow-hidden editorial-image-frame border border-[#C7A46A]/30 relative">
                <img
                  src={founder.portraitImage}
                  alt="Riyas — Co-Founder, Trivandrum Influencer Circle"
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-[10px] font-mono tracking-widest text-[#C7A46A] uppercase block mb-1">
                    CO-FOUNDER
                  </span>
                  <h4 className="text-3xl font-serif">RIYAS</h4>
                  <p className="text-xs text-neutral-300 font-light">Trivandrum Influencer Circle</p>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-6 text-neutral-300 text-sm md:text-base font-light leading-relaxed">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#161616] border border-[#C7A46A]/40 text-[10px] font-mono text-[#C7A46A] uppercase tracking-widest">
                    SECTION 2.A • LEADERSHIP
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif text-white uppercase">
                  BIOGRAPHY & CREATIVE VISION
                </h3>
                <p className="text-[#C7A46A] font-mono text-xs uppercase tracking-widest">
                  {founder.title}
                </p>
                <p>
                  <strong className="text-white font-medium">Riyas</strong> is Co-Founder of <strong className="text-white font-medium">Trivandrum Influencer Circle</strong>. Since 2021 he has worked across influencer marketing, brand collaborations, events, advertising campaigns and creator-led content — including Max, Pothys Swarnamahal, Nissan, Toyota, Škoda, Ather, Citroën and Jeep campaigns, Koottam Flea Market, and the Rewind with Riyas podcast.
                </p>
                <p>
                  Founded by <strong className="text-white font-medium">Riyas</strong>, RFR was born out of a desire to move beyond standard event hosting and construct a prestige multi-disciplinary creative universe.
                </p>
                <p>
                  As an acclaimed director, fashion choreographer, and production architect, Riyas has spent over a decade orchestrating high-concept runways, celebrity launches, brand commercial films, and youth cultural festivals across South India.
                </p>
                <p>
                  His philosophy unites runway elegance with community empowerment—providing models, independent designers, and emerging artists a credible, high-prestige platform to thrive.
                </p>

                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <Link href="/founder" className="btn-luxury btn-luxury-gold rounded-xl py-2.5 px-6 text-xs inline-flex items-center gap-2">
                    <span>VIEW COMPLETE FOUNDER DOSSIER</span>
                    <ArrowRight size={14} />
                  </Link>
                  <Link href="/tic" className="btn-luxury rounded-xl py-2.5 px-6 text-xs inline-flex items-center gap-2 border border-neutral-700 hover:border-[#C7A46A] text-[#E0DDD5] hover:text-[#C7A46A]">
                    <span>EXPLORE TIC CREATOR CIRCLE</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Selected Work — original Drive media from client portfolio document */}
            <section aria-labelledby="selected-work-heading">
              <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
                <div>
                  <span className="text-[10px] font-mono text-[#C7A46A] uppercase tracking-widest block mb-1">2021 — 2026</span>
                  <h3 id="selected-work-heading" className="text-2xl sm:text-3xl font-serif text-white uppercase">Selected Work</h3>
                </div>
                <Link href="/timeline" className="text-xs font-mono uppercase tracking-wider text-[#C7A46A] hover:text-white inline-flex items-center gap-2">
                  Full timeline <ArrowRight size={12} />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {works.map((w: any) => (
                  <a
                    key={w.id}
                    id={`selected-work-${w.id}`}
                    href={w.linkUrl || (w.driveFileId ? driveView(w.driveFileId) : '#')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block rounded-2xl overflow-hidden bg-[#0d0d0d] border border-neutral-800 hover:border-[#C7A46A]/60 transition-colors"
                  >
                    <div className="relative aspect-[4/3] bg-[#161616] overflow-hidden">
                      <img
                        src={w.customImage || (w.driveFileId ? driveThumb(w.driveFileId) : '/images/final bro.png')}
                        alt={`${w.title} (${w.year}) — original project media`}
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.visibility = 'hidden'; }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 text-[10px] font-mono text-[#C7A46A]">{w.year}</span>
                      
                    </div>
                    <div className="p-4">
                      <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">{w.category}</span>
                      <h4 className="text-sm text-white font-medium mt-1 flex items-start justify-between gap-2">
                        <span>{w.title}</span>
                        <ExternalLink size={13} className="shrink-0 mt-0.5 text-neutral-500 group-hover:text-[#C7A46A]" aria-hidden />
                      </h4>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          </motion.div>

        {/* 4 Pillars */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="p-6 rounded-2xl bg-[#111111] border border-neutral-800 hover:border-[#C7A46A]/40 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-[#181818] border border-neutral-700 flex items-center justify-center text-[#C7A46A] mb-4">
                  <Icon size={18} />
                </div>
                <h3 className="text-lg font-serif text-white uppercase mb-2">{p.title}</h3>
                <p className="text-xs text-neutral-400 font-light leading-relaxed">{p.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </PageWrapper>
  );
};
