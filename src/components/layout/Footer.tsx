import React from 'react';
import { Link } from 'wouter';
import { InstagramIcon } from '../common/SocialIcons';

export const Footer: React.FC = () => {
  return (
    <footer
      id="footer-minimal"
      className="w-full bg-[#050505] text-[#F4F1EA] py-12 border-t border-[#B59A62]/10"
    >
      <div className="editorial-container flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & Copyright */}
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 text-xs font-sans font-light tracking-widest text-[#8C8A85] uppercase">
          <Link href="/" className="hover:text-[#F4F1EA] transition-colors">
            RFR BY RIYAS
          </Link>
          <span className="hidden md:inline-block w-1 h-1 rounded-full bg-[#B59A62]/30" />
          <span>© {new Date().getFullYear()}</span>
        </div>

        {/* Minimal Links */}
        <div className="flex items-center gap-8 text-[10px] font-sans font-light tracking-[0.25em] uppercase text-[#8C8A85]">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#B59A62] transition-colors flex items-center gap-2"
            aria-label="Instagram"
          >
            <InstagramIcon size={14} />
            <span className="hidden md:inline-block">INSTAGRAM</span>
          </a>
          <Link href="/contact" className="hover:text-[#F4F1EA] transition-colors">
            CONTACT
          </Link>
          <Link href="/privacy" className="hover:text-[#F4F1EA] transition-colors">
            PRIVACY
          </Link>
        </div>
      </div>
    </footer>
  );
};
