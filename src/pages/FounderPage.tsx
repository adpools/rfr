import React from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { founderData } from '../data/founderData';
import { motion } from 'framer-motion';
import { Quote, ArrowUpRight, Diamond } from 'lucide-react';
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
      title="The Founder — Riyas"
      description="Meet Riyas, the founder and creative visionary behind Riyas Fashion Runway (RFR). Discover the journey, philosophy, and creative direction."
      schema={schema}
      noPaddingTop
    >
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 w-full h-full">
          <img
            src={founderData.portraitImage}
            alt="Riyas — Founder of RFR"
            className="w-full h-full object-cover object-top opacity-60 filter grayscale brightness-75 contrast-125"
          />
          {/* Gradients for fading into content */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-black/40 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/80 via-transparent to-[#080808]/80" />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center text-center mt-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2 }}
          >
            <span className="text-xs md:text-sm font-mono tracking-[0.5em] text-[#C7A46A] uppercase mb-6 block">
              The Visionary
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-[12vw] md:text-[10vw] font-sculptural font-bold text-white uppercase tracking-tighter leading-none mb-4 mix-blend-overlay"
          >
            RIYAS
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <h2 className="text-lg md:text-2xl font-serif text-[#E0DDD5] tracking-widest uppercase mb-12">
              Founder & Creative Director
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 1.5 }}
            className="w-[1px] h-24 bg-gradient-to-b from-[#C7A46A] to-transparent mt-8"
          />
        </div>
      </section>

      {/* 2. THE STORY - EDITORIAL OFFSET GRID */}
      <section className="relative z-20 bg-[#080808] py-24 md:py-32 px-4 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
            
            {/* Left: Typography & Story */}
            <div className="lg:col-span-7 space-y-12">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1 }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <Diamond className="text-[#C7A46A]" size={16} />
                  <span className="text-xs font-mono tracking-widest text-[#C7A46A] uppercase">
                    The Origin
                  </span>
                </div>
                <h3 className="text-3xl md:text-5xl font-serif text-white uppercase leading-[1.2]">
                  A Journey Driven by Passion, Storytelling & Human Collaboration.
                </h3>
              </motion.div>

              <div className="space-y-6 text-neutral-400 font-light leading-loose text-base md:text-lg">
                {founderData.bioParagraphs.map((paragraph, idx) => (
                  <motion.p
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8, delay: idx * 0.2 }}
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </div>
            </div>

            {/* Right: Secondary Portrait / Abstract */}
            <div className="lg:col-span-5 relative h-[600px] lg:h-[800px] w-full mt-12 lg:mt-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2 }}
                className="absolute inset-0 rounded-t-full rounded-b-3xl overflow-hidden border border-[#C7A46A]/20"
              >
                <img
                  src={founderData.portraitImage}
                  alt="Riyas Creative Session"
                  className="w-full h-full object-cover object-center filter grayscale opacity-80"
                />
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080808] to-transparent" />
              </motion.div>
              
              {/* Floating Quote Badge */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 }}
                className="absolute -bottom-8 -left-8 md:-left-16 bg-[#121212] p-8 border border-[#C7A46A]/40 rounded-3xl max-w-sm backdrop-blur-md"
              >
                <Quote size={24} className="text-[#C7A46A] mb-4" />
                <p className="font-serif text-white italic text-lg leading-snug">
                  "{founderData.quote.text}"
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. GUIDING PRINCIPLES */}
      <section className="bg-[#0e0e0e] py-24 md:py-32 px-4 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <span className="text-xs font-mono tracking-[0.3em] text-[#C7A46A] uppercase mb-4 block">
              Philosophy
            </span>
            <h3 className="text-4xl md:text-5xl font-serif text-white uppercase tracking-wider">
              Guiding Principles
            </h3>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {founderData.principles.map((pr, idx) => (
              <motion.div
                key={pr.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.15 }}
                className="group p-8 rounded-3xl bg-[#141414] border border-neutral-800 hover:border-[#C7A46A] hover:bg-[#1a1814] transition-all duration-500 flex flex-col items-center text-center relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#C7A46A]/5 rounded-bl-full transform translate-x-16 -translate-y-16 group-hover:bg-[#C7A46A]/10 transition-colors" />
                
                <span className="text-5xl font-sculptural text-[#C7A46A]/30 group-hover:text-[#C7A46A] font-bold block mb-6 transition-colors duration-500">
                  {pr.number}
                </span>
                <h4 className="text-xl font-serif text-white uppercase mb-4 tracking-wide z-10">
                  {pr.title}
                </h4>
                <p className="text-sm text-neutral-400 font-light leading-relaxed z-10 group-hover:text-neutral-300 transition-colors">
                  {pr.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. THE INVITATION */}
      <section className="py-24 md:py-32 px-4 relative overflow-hidden flex flex-col items-center justify-center bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(199,164,106,0.05)_0%,transparent_70%)]" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center z-10"
        >
          <h2 className="text-3xl md:text-5xl font-serif text-white uppercase mb-8">
            Let's Create Something <br className="hidden md:block"/> Extraordinary.
          </h2>
          <Link
            href="/contact"
            className="group relative inline-flex items-center justify-center px-10 py-5 bg-[#C7A46A] text-black text-sm md:text-base font-mono tracking-widest uppercase overflow-hidden rounded-full"
          >
            <span className="relative z-10 font-bold flex items-center gap-3">
              Request Executive Meeting
              <ArrowUpRight size={18} className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-white transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out" />
          </Link>
        </motion.div>
      </section>
    </PageWrapper>
  );
};
