import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, Compass, ChevronDown } from 'lucide-react';
import { FullscreenMenu } from './FullscreenMenu';

export const Navbar: React.FC = () => {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Primary curated editorial navigation links
  const primaryNavLinks: Array<{
    label: string;
    href: string;
    subItems?: Array<{ label: string; href: string }>;
  }> = [
    { label: 'TIMELINE', href: '/timeline' },
    {
      label: 'ABOUT',
      href: '/about',
      subItems: [
        { label: 'About Riyas', href: '/about' },
        { label: 'Our Team', href: '/our-team' },
      ],
    },
    { label: 'ACHIEVEMENTS', href: '/achievements' },
    { label: 'SERVICES', href: '/services' },
    { label: 'ASSETS', href: '/assets' },
    { label: 'TIC', href: '/tic' },
    { label: 'RIYAS', href: '/riyas-gallery' },
    {
      label: 'GALLERY',
      href: '/gallery',
      subItems: [
        { label: 'Curated Archive', href: '/gallery' },
        { label: 'Riyas Gallery', href: '/riyas-gallery' },
        { label: 'Testimonials', href: '/#testimonials' },
      ],
    },
    { label: 'CONTACT', href: '/contact' },
  ];

  const isHome = location === '/';
  const showSolidBackground = isScrolled || !isHome;

  return (
    <>
      <header
        className="fixed left-1/2 -translate-x-1/2 z-[8000] transition-all duration-700 w-[94%] max-w-7xl rounded-full flex items-center justify-between top-4 py-3 px-6 md:px-8 bg-[#0B0B0B]/90 backdrop-blur-xl border border-[#333] shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
      >
        {/* Brand Monogram & Title */}
        <Link href="/" className="group flex items-center gap-3 no-underline shrink-0" aria-label="RFR by Riyas Home">
          <img
            src="/images/final bro.png"
            alt="RFR by Riyas"
            className="h-9 sm:h-10 md:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <div className="flex flex-col">
            <span className="font-sculptural text-base md:text-lg font-bold tracking-[0.25em] text-[#F4F1EA] group-hover:text-[#C7A46A] transition-colors uppercase">
              RFR BY RIYAS
            </span>
          </div>
        </Link>

        {/* Desktop Curated Navigation Links */}
        <nav className="hidden 2xl:flex items-center gap-6">
          {primaryNavLinks.map((link) => {
            const isActive =
              location === link.href ||
              (link.href !== '/' && location.startsWith(link.href)) ||
              Boolean(link.subItems?.some((sub) => location === sub.href));

            if (link.subItems) {
              return (
                <div key={link.label} className="relative group py-1.5">
                  <Link
                    href={link.href}
                    className={`text-xs md:text-sm font-sans tracking-[0.15em] uppercase transition-all duration-300 relative inline-flex items-center gap-1.5 ${
                      isActive
                        ? 'text-[#C7A46A] font-bold'
                        : 'text-[#E0DDD5] group-hover:text-[#C7A46A] font-medium'
                    }`}
                  >
                    <span>{link.label}</span>
                    <ChevronDown size={12} className="transition-transform duration-300 group-hover:rotate-180 text-neutral-500 group-hover:text-[#C7A46A]" />
                  </Link>

                  {/* Dropdown Menu */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-50">
                    <div className="bg-[#0B0B0B]/95 backdrop-blur-xl border border-neutral-800 rounded-xl p-1.5 min-w-[150px] shadow-[0_10px_30px_rgba(0,0,0,0.6)] flex flex-col gap-0.5">
                      {link.subItems.map((sub) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          onClick={(e) => {
                            if (sub.href.startsWith('/#') || sub.href.startsWith('#')) {
                              const id = sub.href.replace(/^\/?#/, '');
                              const el = document.getElementById(id);
                              if (el) {
                                e.preventDefault();
                                el.scrollIntoView({ behavior: 'smooth' });
                                window.history.pushState(null, '', `#${id}`);
                              }
                            }
                          }}
                          className="px-3.5 py-2 rounded-lg text-xs font-sans tracking-[0.1em] text-[#E0DDD5] hover:text-[#C7A46A] hover:bg-[#161616] transition-colors whitespace-nowrap block no-underline"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={link.label}
                href={link.href}
                className={`text-xs md:text-sm font-sans tracking-[0.15em] uppercase transition-all duration-300 relative py-1.5 ${
                  isActive
                    ? 'text-[#C7A46A] font-bold'
                    : 'text-[#E0DDD5] hover:text-[#C7A46A] font-medium'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Full Directory Menu Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open 13-Chapter Menu"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#161616] border border-neutral-700 hover:border-[#C7A46A] text-[#F4F1EA] hover:text-[#C7A46A] transition-all text-sm font-mono tracking-wider"
          >
            <Menu size={18} />
            <span className="hidden sm:inline text-xs md:text-sm font-mono uppercase tracking-widest font-semibold">
              DIRECTORY (13)
            </span>
          </button>
        </div>
      </header>

      {/* Fullscreen Menu with complete 13 order hierarchy */}
      <FullscreenMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
};
