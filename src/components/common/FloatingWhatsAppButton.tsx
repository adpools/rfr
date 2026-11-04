import React from 'react';
import { WhatsAppIcon } from './SocialIcons';

export const FloatingWhatsAppButton: React.FC = () => {
  return (
    <a
      href="https://wa.me/917736533346"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-[8500] p-3 sm:px-4 sm:py-3 rounded-full bg-[#111111]/90 backdrop-blur-xl border border-[#25D366]/40 hover:border-[#25D366] text-[#FAF9F6] hover:text-[#25D366] transition-all duration-300 shadow-[0_8px_25px_rgba(0,0,0,0.6)] flex items-center gap-2.5 group"
    >
      <WhatsAppIcon size={18} className="text-[#25D366]" />
      <span className="text-[11px] font-mono tracking-wider uppercase text-neutral-300 group-hover:text-white hidden sm:inline">
        Chat on WhatsApp
      </span>
    </a>
  );
};

