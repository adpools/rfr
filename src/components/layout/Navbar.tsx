import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, ArrowUpRight } from 'lucide-react';
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
  const primaryNavLinks = [
    { label: 'HOME', href: '/' },
    { label: 'ABOUT', href: '/about' },
    { label: 'SERVICES', href: '/services' },
    { label: 'JOURNEY', href: '/timeline' },
    { label: 'GALLERY', href: '/gallery' },
    { label: 'PRESS', href: '/press' },
  ];

  const isHome = location === '/';
  const showSolidBackground = isScrolled || !isHome;

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-[8000] transition-all duration-300 ${
          showSolidBackground
            ? 'py-3.5 bg-[#080808]/92 backdrop-blur-xl border-b border-[#C7A46A]/20 shadow-2xl'
            : 'py-6 bg-transparent'
        }`}
      >
        <div className="editorial-container flex items-center justify-between">
          {/* Brand Monogram & Title */}
          <Link href="/" className="group flex items-center gap-3 no-underline">
            <div className="w-8 h-8 rounded-lg bg-[#111111] border border-[#C7A46A]/40 flex items-center justify-center text-[#C7A46A] font-sculptural text-sm font-bold group-hover:border-[#C7A46A] group-hover:shadow-[0_0_15px_rgba(199,164,106,0.3)] transition-all">
              R
            </div>
            <div className="flex flex-col">
              <span className="font-sculptural text-sm md:text-base font-bold tracking-[0.2em] text-[#FAF9F6] group-hover:text-[#C7A46A] transition-colors uppercase">
                RFR BY RIYAS
              </span>
              <span className="font-sans text-[8px] tracking-[0.28em] text-neutral-400 uppercase font-light">
                RIYAS FASHION RUNWAY
              </span>
            </div>
          </Link>

          {/* Desktop Curated Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {primaryNavLinks.map((link) => {
              const isActive = location === link.href || (link.href !== '/' && location.startsWith(link.href));
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-xs font-sans tracking-[0.18em] uppercase font-light transition-all duration-300 relative py-1 ${
                    isActive
                      ? 'text-[#C7A46A] font-medium'
                      : 'text-neutral-300 hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#C7A46A]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Primary CTA & Drawer Toggle */}
          <div className="flex items-center gap-3 md:gap-4">
            <Link
              href="/business"
              data-cursor="PARTNER"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-sans tracking-[0.18em] uppercase font-medium bg-[#141414] text-[#FAF9F6] border border-[#C7A46A]/50 hover:border-[#C7A46A] hover:bg-[#C7A46A] hover:text-[#080808] transition-all duration-300 shadow-md group"
            >
              <span>DO BUSINESS</span>
              <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>

            {/* Menu Toggle (Mobile + Desktop Expanded Drawer) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Fullscreen Menu"
              className="p-2.5 rounded-full bg-[#141414] border border-[#C7A46A]/30 hover:border-[#C7A46A] text-[#FAF9F6] transition-colors"
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen Menu */}
      <FullscreenMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
};
