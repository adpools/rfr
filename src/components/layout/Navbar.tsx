import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, Compass } from 'lucide-react';
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
    { label: 'TIMELINE', href: '/timeline' },
    { label: 'ABOUT', href: '/about' },
    { label: 'ACHIEVEMENTS', href: '/achievements' },
    { label: 'SERVICES', href: '/services' },
    { label: 'ASSETS', href: '/assets' },
    { label: 'GALLERY', href: '/gallery' },
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
        <Link href="/" className="group flex items-center gap-3 no-underline">
          <div className="flex flex-col">
            <span className="font-sculptural text-base md:text-lg font-bold tracking-[0.25em] text-[#F4F1EA] group-hover:text-[#C7A46A] transition-colors uppercase">
              RFR BY RIYAS
            </span>
          </div>
        </Link>

        {/* Desktop Curated Navigation Links */}
        <nav className="hidden 2xl:flex items-center gap-6">
          {primaryNavLinks.map((link) => {
            const isActive = location === link.href || (link.href !== '/' && location.startsWith(link.href));
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
