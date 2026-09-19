import React, { useState, useEffect } from 'react';

interface Chapter {
  id: string;
  num: string;
  label: string;
}

const chapters: Chapter[] = [
  { id: 'chapter-01', num: '01', label: 'ENTER' },
  { id: 'chapter-02', num: '02', label: 'STATEMENT' },
  { id: 'chapter-03', num: '03', label: 'WHAT IS RFR' },
  { id: 'chapter-04', num: '04', label: 'JOURNEY' },
  { id: 'chapter-05', num: '05', label: 'RIYAS' },
  { id: 'chapter-06', num: '06', label: 'PHILOSOPHY' },
  { id: 'chapter-07', num: '07', label: 'EVENTS' },
  { id: 'chapter-08', num: '08', label: 'CAMPAIGNS' },
  { id: 'chapter-09', num: '09', label: 'PODCAST' },
  { id: 'chapter-10', num: '10', label: 'ECOSYSTEM' },
  { id: 'chapter-11', num: '11', label: 'NETWORK' },
  { id: 'chapter-12', num: '12', label: 'ARCHIVE' },
  { id: 'chapter-13', num: '13', label: 'PRESS' },
  { id: 'chapter-14', num: '14', label: 'PARTNERS' },
  { id: 'chapter-15', num: '15', label: 'DO BUSINESS' },
  { id: 'chapter-16', num: '16', label: 'CONTACT' },
  { id: 'chapter-17', num: '17', label: 'FINALE' },
];

export const SectionProgressRail: React.FC = () => {
  const [activeChapter, setActiveChapter] = useState('chapter-01');

  useEffect(() => {
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveChapter(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '-30% 0px -40% 0px',
      threshold: 0.1,
    });

    chapters.forEach((chap) => {
      const el = document.getElementById(chap.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToChapter = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      aria-label="Chapter Navigation"
      className="fixed right-6 top-1/2 -translate-y-1/2 z-[7000] hidden xl:flex flex-col items-end gap-1.5 py-4 px-2 select-none pointer-events-auto"
    >
      {chapters.map((chap) => {
        const isActive = activeChapter === chap.id;
        return (
          <button
            key={chap.id}
            onClick={() => scrollToChapter(chap.id)}
            data-cursor={chap.num}
            aria-label={`Jump to Chapter ${chap.num}: ${chap.label}`}
            className="group flex items-center gap-2 py-0.5 text-right transition-all duration-300 focus:outline-none"
          >
            {/* Hover Tooltip Label */}
            <span
              className={`text-[9px] font-mono tracking-widest uppercase transition-all duration-300 ${
                isActive
                  ? 'text-[#C7A46A] opacity-100 translate-x-0 font-bold'
                  : 'text-neutral-500 opacity-0 group-hover:opacity-80 translate-x-2 group-hover:translate-x-0'
              }`}
            >
              {chap.label}
            </span>

            {/* Chapter Number */}
            <span
              className={`font-mono text-[10px] tracking-wider transition-colors duration-300 ${
                isActive ? 'text-[#FAF9F6] font-semibold' : 'text-neutral-600 group-hover:text-neutral-300'
              }`}
            >
              {chap.num}
            </span>

            {/* Indicator Dash / Line */}
            <span
              className={`h-[1.5px] transition-all duration-300 rounded-full ${
                isActive
                  ? 'w-6 bg-[#C7A46A] shadow-[0_0_8px_rgba(199,164,106,0.6)]'
                  : 'w-2 bg-neutral-700 group-hover:w-3 group-hover:bg-neutral-400'
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
};
