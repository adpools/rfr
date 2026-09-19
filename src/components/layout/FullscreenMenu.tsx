import React from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowUpRight, Mail, Phone } from 'lucide-react';
import { InstagramIcon, YoutubeIcon, LinkedinIcon } from '../common/SocialIcons';

interface FullscreenMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FullscreenMenu: React.FC<FullscreenMenuProps> = ({ isOpen, onClose }) => {
  const menuItems = [
    { number: '01', title: 'HOME', href: '/' },
    { number: '02', title: 'TIMELINE ARCHIVE', href: '/timeline' },
    { number: '03', title: 'ABOUT RFR', href: '/about' },
    { number: '04', title: 'WHAT IS RFR?', href: '/what-is-rfr' },
    { number: '05', title: 'THE FOUNDER', href: '/founder' },
    { number: '06', title: 'SERVICES & IP', href: '/services' },
    { number: '07', title: 'PODCAST STUDIO', href: '/services/podcast' },
    { number: '08', title: 'TALENT NETWORK', href: '/assets' },
    { number: '09', title: 'CURATED GALLERY', href: '/gallery' },
    { number: '10', title: 'PRESS & EDITORIAL', href: '/press' },
    { number: '11', title: 'CLIENTS & PARTNERS', href: '/clients' },
    { number: '12', title: 'CONTACT & INQUIRIES', href: '/contact' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' }}
          animate={{ opacity: 1, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
          exit={{ opacity: 0, clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9500] bg-[#080808] text-[#FAF9F6] flex flex-col justify-between p-6 sm:p-12 md:p-16 overflow-y-auto"
        >
          {/* Top Row */}
          <div className="flex items-center justify-between border-b border-neutral-800/80 pb-6">
            <div className="flex items-center gap-3">
              <span className="font-sculptural text-xl font-bold tracking-widest text-[#C7A46A]">RFR</span>
              <span className="text-[10px] tracking-[0.25em] text-neutral-400 uppercase font-mono">
                CREATIVE ECOSYSTEM
              </span>
            </div>

            <button
              onClick={onClose}
              aria-label="Close Menu"
              className="p-3 rounded-full bg-neutral-900 border border-neutral-700 hover:border-[#C7A46A] hover:text-[#C7A46A] transition-all"
            >
              <X size={20} />
            </button>
          </div>

          {/* Center Links Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-12 py-10 max-w-5xl mx-auto w-full">
            {menuItems.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.04 }}
              >
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="group flex items-center justify-between py-3 border-b border-neutral-900 hover:border-[#C7A46A]/50 transition-colors no-underline"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xs text-[#C7A46A]/70 group-hover:text-[#C7A46A]">
                      {item.number}
                    </span>
                    <span className="text-xl sm:text-2xl font-serif tracking-wide text-neutral-300 group-hover:text-white transition-colors">
                      {item.title}
                    </span>
                  </div>
                  <ArrowUpRight
                    size={18}
                    className="text-neutral-600 group-hover:text-[#C7A46A] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all"
                  />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Bottom Row Information */}
          <div className="border-t border-neutral-800/80 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-neutral-400">
            <div className="flex items-center gap-6">
              <a href="mailto:partnerships@rfrbyriyas.com" className="flex items-center gap-2 hover:text-[#C7A46A] transition-colors">
                <Mail size={14} className="text-[#C7A46A]" />
                partnerships@rfrbyriyas.com
              </a>
              <span className="hidden sm:inline text-neutral-700">•</span>
              <span className="flex items-center gap-2">
                <Phone size={14} className="text-[#C7A46A]" />
                VIP Inquiries Desk
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[10px] tracking-widest uppercase font-mono text-[#C7A46A]">
                Follow RFR:
              </span>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="p-2 rounded-full bg-neutral-900 hover:text-[#C7A46A] transition-colors">
                <InstagramIcon size={16} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="p-2 rounded-full bg-neutral-900 hover:text-[#C7A46A] transition-colors">
                <YoutubeIcon size={16} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 rounded-full bg-neutral-900 hover:text-[#C7A46A] transition-colors">
                <LinkedinIcon size={16} />
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
