import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Quote, Sparkles, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { testimonialsData } from '../../data/testimonialsData';

export const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollTo = (index: number) => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const cards = Array.from(container.children) as HTMLElement[];
    if (cards[index]) {
      container.scrollTo({
        left: cards[index].offsetLeft,
        behavior: 'smooth'
      });
      setCurrentIndex(index);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    const nextIndex = direction === 'left'
      ? Math.max(0, currentIndex - 1)
      : Math.min(testimonialsData.length - 1, currentIndex + 1);
    scrollTo(nextIndex);
  };

  const handleScroll = () => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const scrollLeft = container.scrollLeft;
    const cards = Array.from(container.children) as HTMLElement[];
    if (cards.length === 0) return;

    let closestIndex = 0;
    let minDistance = Infinity;
    cards.forEach((card, idx) => {
      const distance = Math.abs(card.offsetLeft - scrollLeft);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = idx;
      }
    });

    setCurrentIndex(closestIndex);
  };

  useEffect(() => {
    const handleResize = () => {
      if (carouselRef.current) {
        const cards = Array.from(carouselRef.current.children) as HTMLElement[];
        if (cards[currentIndex]) {
          carouselRef.current.scrollTo({
            left: cards[currentIndex].offsetLeft,
            behavior: 'auto'
          });
        }
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentIndex]);

  return (
    <section
      id="testimonials"
      aria-label="Testimonials"
      className="bg-[#050505] border-b border-neutral-900 relative overflow-hidden py-20 md:py-28"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#C7A46A]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="editorial-container relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col mb-12 md:mb-16">
          <div className="flex items-center gap-3 text-[10px] font-mono tracking-[0.35em] text-[#C7A46A] uppercase mb-3">
            <Sparkles size={14} className="text-[#C7A46A]" />
            <span>ENDORSEMENTS & COLLABORATIONS</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-800 pb-6 gap-6">
            <div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#F4F1EA] uppercase tracking-tight">
                TESTIMONIALS
              </h2>
              <p className="text-xs sm:text-sm font-light text-neutral-400 mt-2 max-w-xl">
                Reflections from esteemed collaborators, showstoppers, and industry professionals who have shared landmark stages and creative productions with RFR.
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#C7A46A] px-3.5 py-1.5 rounded-full bg-[#111111] border border-neutral-800">
                <Award size={13} />
                <span>Verified Collaborators</span>
              </div>

              {/* Header Navigation Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scroll('left')}
                  disabled={currentIndex === 0}
                  className="w-10 h-10 rounded-full border border-neutral-800 hover:border-[#C7A46A] bg-[#111111] hover:bg-[#C7A46A]/10 text-white disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center transition-all duration-300 shadow-lg"
                  aria-label="Previous Testimonial"
                >
                  <ChevronLeft size={18} className="text-[#C7A46A]" />
                </button>
                <button
                  type="button"
                  onClick={() => scroll('right')}
                  disabled={currentIndex >= testimonialsData.length - 1}
                  className="w-10 h-10 rounded-full border border-neutral-800 hover:border-[#C7A46A] bg-[#111111] hover:bg-[#C7A46A]/10 text-white disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center transition-all duration-300 shadow-lg"
                  aria-label="Next Testimonial"
                >
                  <ChevronRight size={18} className="text-[#C7A46A]" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Horizontal Carousel Track */}
        <div
          ref={carouselRef}
          onScroll={handleScroll}
          className="flex gap-8 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 pt-1 px-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] w-full"
        >
          {testimonialsData.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="w-full shrink-0 snap-start grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center bg-[#0c0c0c] border border-neutral-800/90 hover:border-[#C7A46A]/40 rounded-3xl p-6 sm:p-10 lg:p-14 shadow-2xl transition-all duration-500"
            >
              {/* Left Column: Photograph (Original Reference Structure & Proportions) */}
              <div className="lg:col-span-5 w-full">
                <div className="relative aspect-[3/4] sm:aspect-[4/5] rounded-2xl overflow-hidden bg-[#141414] border border-[#C7A46A]/30 shadow-2xl group">
                  <img
                    src={item.image}
                    alt={`${item.name} — ${item.designation}`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-top filter contrast-[1.03] group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                  {/* Identification Overlay on Photo */}
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <span className="text-[10px] font-mono tracking-widest text-[#C7A46A] uppercase block mb-1">
                      FEATURED COLLABORATOR
                    </span>
                    <h4 className="text-xl sm:text-2xl font-serif leading-tight">
                      {item.name}
                    </h4>
                    <p className="text-xs font-mono text-neutral-300 mt-1">
                      {item.designation}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Watermark Quote, Name, Designation & Full Testimonial */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                <div>
                  {/* Watermark Quote Icon */}
                  <div className="mb-4 text-[#C7A46A]/40">
                    <Quote size={42} strokeWidth={1.5} />
                  </div>

                  {/* Name and Designation */}
                  <h3 className="text-3xl sm:text-4xl font-serif text-white uppercase tracking-tight mb-2">
                    {item.name}
                  </h3>
                  <p className="text-xs sm:text-sm font-mono text-[#C7A46A] uppercase tracking-widest mb-6 font-semibold">
                    {item.designation}
                  </p>

                  {/* Preserved Testimonial Paragraphs */}
                  <div className="space-y-4 text-neutral-300 text-sm sm:text-base md:text-lg font-light leading-relaxed">
                    {item.quoteParagraphs.map((para, pIdx) => (
                      <p key={pIdx} className="text-neutral-300">
                        {para}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Highlight Badges */}
                {item.brandHighlights && item.brandHighlights.length > 0 && (
                  <div className="pt-6 border-t border-neutral-800/80 flex flex-wrap items-center gap-3">
                    {item.brandHighlights.map((badge, bIdx) => (
                      <span
                        key={bIdx}
                        className="px-3.5 py-1.5 rounded-full bg-[#141414] border border-neutral-800 text-[11px] font-mono text-neutral-300 tracking-wider"
                      >
                        ✦ {badge}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Carousel Bottom Controls & Indicators */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-neutral-900 px-2">
          {/* Slide Indicator Pills with Collaborator Names */}
          <div className="flex items-center gap-4">
            {testimonialsData.map((item, i) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollTo(i)}
                className={`group flex items-center gap-2.5 transition-all duration-300 ${
                  currentIndex === i ? 'opacity-100' : 'opacity-40 hover:opacity-80'
                }`}
                aria-label={`Go to slide ${i + 1}: ${item.name}`}
              >
                <span
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentIndex === i ? 'w-8 bg-[#C7A46A]' : 'w-2 bg-neutral-700'
                  }`}
                />
                <span className="text-[11px] font-mono tracking-wider text-neutral-300 uppercase">
                  {item.name}
                </span>
              </button>
            ))}
          </div>

          {/* Slide Counter & Arrows */}
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-neutral-400">
              <span className="text-[#C7A46A] font-bold">0{currentIndex + 1}</span> / 0{testimonialsData.length}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scroll('left')}
                disabled={currentIndex === 0}
                className="p-2.5 rounded-full border border-neutral-800 hover:border-[#C7A46A] bg-[#111111] hover:bg-[#C7A46A]/10 text-white disabled:opacity-30 disabled:pointer-events-none transition-all duration-300 shadow-md"
                aria-label="Previous Testimonial"
              >
                <ChevronLeft size={16} className="text-[#C7A46A]" />
              </button>
              <button
                type="button"
                onClick={() => scroll('right')}
                disabled={currentIndex >= testimonialsData.length - 1}
                className="p-2.5 rounded-full border border-neutral-800 hover:border-[#C7A46A] bg-[#111111] hover:bg-[#C7A46A]/10 text-white disabled:opacity-30 disabled:pointer-events-none transition-all duration-300 shadow-md"
                aria-label="Next Testimonial"
              >
                <ChevronRight size={16} className="text-[#C7A46A]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
