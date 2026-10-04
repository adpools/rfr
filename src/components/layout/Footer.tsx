import React from 'react';
import { Link } from 'wouter';
import { InstagramIcon, YoutubeIcon, LinkedinIcon } from '../common/SocialIcons';
import { ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerGroups = [
    {
      title: 'CORE',
      links: [
        { label: 'Timeline (2020–2026)', href: '/timeline' },
        { label: 'About Us', href: '/about' },
        { label: 'Riyas — Founder', href: '/riyas' },
        { label: 'Achievements & Works', href: '/achievements' },
        { label: 'What is RFR?', href: '/what-is-rfr' },
      ],
    },
    {
      title: 'VENTURES',
      links: [
        { label: 'Services', href: '/services' },
        { label: 'Events & Flea Markets', href: '/services/events' },
        { label: 'Campaigns & Ads', href: '/services/campaigns' },
        { label: 'Podcast Studio', href: '/services/podcast' },
        { label: 'Do Business With Us', href: '/business' },
      ],
    },
    {
      title: 'ALLIANCES',
      links: [
        { label: 'Channel Partners', href: '/partners' },
        { label: 'Milestones', href: '/milestones' },
        { label: 'Our Clients', href: '/clients' },
        { label: 'Talent Guilds & Models', href: '/assets' },
      ],
    },
    {
      title: 'ARCHIVES',
      links: [
        { label: 'Gallery', href: '/gallery' },
        { label: 'Press & News', href: '/press' },
        { label: 'Contact', href: '/contact' },
      ],
    },
  ];

  return (
    <footer
      id="footer-luxury"
      className="w-full bg-[#030303] text-[#F4F1EA] pt-24 pb-8 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(199,164,106,0.03)_0%,transparent_70%)] pointer-events-none" />

      <div className="editorial-container relative z-10">
        {/* Massive Brand Typography Header */}
        <div className="flex flex-col items-center justify-center mb-20">
          <h2 className="text-[12vw] md:text-[8vw] font-sculptural font-bold leading-none text-[#101010] tracking-tighter w-full text-center select-none" style={{ WebkitTextStroke: '1px rgba(199,164,106,0.15)' }}>
            RIYAS FASHION RUNWAY
          </h2>
        </div>

        {/* Top Info & Socials */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 pb-16 border-b border-white/5">
          <div className="max-w-md">
            <Link href="/" className="inline-block mb-4">
              <span className="font-sculptural text-3xl font-bold tracking-widest text-white transition-colors">
                RFR BY RIYAS
              </span>
            </Link>
            <p className="text-sm font-light text-neutral-400 leading-relaxed">
              A creative ecosystem connecting luxury fashion, brand campaigns, talent networks, and cultural media.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="flex items-center gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-12 h-12 rounded-full bg-[#0a0a0a] border border-white/5 hover:border-[#C7A46A] flex items-center justify-center hover:text-[#C7A46A] transition-all duration-300"
              >
                <InstagramIcon size={18} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="w-12 h-12 rounded-full bg-[#0a0a0a] border border-white/5 hover:border-[#C7A46A] flex items-center justify-center hover:text-[#C7A46A] transition-all duration-300"
              >
                <YoutubeIcon size={18} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-12 h-12 rounded-full bg-[#0a0a0a] border border-white/5 hover:border-[#C7A46A] flex items-center justify-center hover:text-[#C7A46A] transition-all duration-300"
              >
                <LinkedinIcon size={18} />
              </a>
            </div>
            <Link
              href="/contact"
              className="group relative inline-flex items-center justify-center px-8 py-3.5 bg-transparent border border-[#C7A46A] text-[#C7A46A] hover:text-black text-xs font-mono tracking-widest uppercase overflow-hidden rounded-full transition-colors duration-300"
            >
              <span className="relative z-10 flex items-center gap-2">
                Connect With RFR
                <ArrowUpRight size={14} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-[#C7A46A] transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out" />
            </Link>
          </div>
        </div>

        {/* 4-Column Directory Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 py-16 border-b border-white/5">
          {footerGroups.map((group) => (
            <div key={group.title} className="flex flex-col">
              <span className="text-[11px] font-mono tracking-[0.3em] text-white/40 uppercase mb-8">
                {group.title}
              </span>
              <ul className="space-y-4 text-[13px] font-sans font-light text-neutral-400">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="hover:text-[#C7A46A] transition-colors duration-300 block w-fit"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Sub-Footer */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] md:text-xs font-mono text-neutral-500 tracking-widest">
          <div>
            <span>© {currentYear} RFR BY RIYAS. ALL RIGHTS RESERVED.</span>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8">
            <Link href="/privacy" className="hover:text-white transition-colors duration-300">
              PRIVACY POLICY
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors duration-300">
              TERMS OF PRODUCTION
            </Link>
            <Link href="/contact" className="text-[#C7A46A] hover:text-white transition-colors duration-300">
              VIP INQUIRIES
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
