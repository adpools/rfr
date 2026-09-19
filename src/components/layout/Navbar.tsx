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
    { label: 'TIMELINE', href: '/timeline' },
    { label: 'ABOUT', href: '/about' },
    { label: 'FASHION', href: '/gallery' },
    { label: 'EVENTS', href: '/services' },
    { label: 'CONTACT', href: '/contact' },
  ];

  const isHome = location === '/';
  const showSolidBackground = isScrolled || !isHome;

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-[8000] transition-all duration-700 ${
          showSolidBackground
            ? 'py-4 bg-[#050505]/80 backdrop-blur-md border-b border-[#B59A62]/10 shadow-2xl'
            : 'py-6 md:py-8 bg-transparent'
        }`}
      >
        <div className="editorial-container flex items-center justify-between">
          {/* Brand Monogram & Title */}
          <Link href="/" className="group flex items-center gap-4 no-underline">
            <div className="flex flex-col">
              <span className="font-sculptural text-sm md:text-lg font-bold tracking-[0.25em] text-[#F4F1EA] group-hover:text-[#B59A62] transition-colors uppercase">
                RFR BY RIYAS
              </span>
            </div>
          </Link>

          {/* Desktop Curated Navigation Links */}
          <nav className="hidden lg:flex items-center gap-10">
            {primaryNavLinks.map((link) => {
              const isActive = location === link.href || (link.href !== '/' && location.startsWith(link.href));
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-[10px] md:text-xs font-sans tracking-[0.25em] uppercase transition-all duration-300 relative py-2 ${
                    isActive
                      ? 'text-[#B59A62] font-medium'
                      : 'text-[#8C8A85] hover:text-[#F4F1EA] font-light'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Fullscreen Menu"
              className="p-3 text-[#F4F1EA] transition-colors hover:text-[#B59A62]"
            >
              {isMobileMenuOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
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
