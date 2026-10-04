import React from 'react';
import { Link } from 'wouter';
import { InstagramIcon, YoutubeIcon, LinkedinIcon } from '../common/SocialIcons';
import { ArrowUpRight, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerGroups = [
    {
      title: '01 — 03 CORE',
      links: [
        { label: '1. Timeline (2020–2026)', href: '/timeline' },
        { label: '2. About us', href: '/about' },
        { label: '  • Riyas Personal Profile - Founder', href: '/founder' },
        { label: '  • Achievements, Gallary, Works', href: '/about' },
        { label: '3. What is RFR? (How, When, What)', href: '/what-is-rfr' },
      ],
    },
    {
      title: '04 — 06 SERVICES & VENTURES',
      links: [
        { label: '4. Achievements', href: '/achievements' },
        { label: '5. Services', href: '/services' },
        { label: '  • Events (Flee, New Year, Fashion, Kids, Festival)', href: '/services/events' },
        { label: '  • Campaigns (Influencer, UGC, ADS, OOH, Digital)', href: '/services/campaigns' },
        { label: '  • Podcast Studio', href: '/services/podcast' },
        { label: '6. Do Business with us', href: '/business' },
      ],
    },
    {
      title: '07 — 10 NETWORK & ALLIANCES',
      links: [
        { label: '7. Channel Partners', href: '/partners' },
        { label: '8. Milestones', href: '/milestones' },
        { label: '9. Clients', href: '/clients' },
        { label: '10. Assets (Career, Models, Influencers, Artist)', href: '/assets' },
      ],
    },
    {
      title: '11 — 13 ARCHIVES & CONTACT',
      links: [
        { label: '11. Gallary (Events, Shows, Shoots)', href: '/gallery' },
        { label: '12. Press & News', href: '/press' },
        { label: '13. Contact', href: '/contact' },
      ],
    },
  ];

  return (
    <footer
      id="footer-luxury"
      className="w-full bg-[#050505] text-[#F4F1EA] pt-16 pb-12 border-t border-neutral-850 relative"
    >
      <div className="editorial-container">
        {/* Top Brand Banner */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-12 border-b border-neutral-850">
          <div>
            <Link href="/" className="group inline-flex items-center gap-3 no-underline mb-2">
              <span className="font-sculptural text-2xl font-bold tracking-widest text-[#C7A46A] group-hover:text-white transition-colors">
                RFR BY RIYAS
              </span>
            </Link>
            <p className="text-xs font-light text-neutral-400 max-w-md">
              Riyas Fashion Runway — Creative ecosystem connecting luxury fashion, brand campaigns, talent networks, and cultural media.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="p-3 rounded-full bg-[#111111] border border-neutral-800 hover:border-[#C7A46A] hover:text-[#C7A46A] transition-all"
            >
              <InstagramIcon size={16} />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
              className="p-3 rounded-full bg-[#111111] border border-neutral-800 hover:border-[#C7A46A] hover:text-[#C7A46A] transition-all"
            >
              <YoutubeIcon size={16} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="p-3 rounded-full bg-[#111111] border border-neutral-800 hover:border-[#C7A46A] hover:text-[#C7A46A] transition-all"
            >
              <LinkedinIcon size={16} />
            </a>
            <Link
              href="/contact"
              className="btn-luxury btn-luxury-gold rounded-xl py-2 px-5 text-xs inline-flex items-center gap-2"
            >
              <span>CONNECT WITH RFR</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

        {/* 4-Column Directory Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-12 border-b border-neutral-850">
          {footerGroups.map((group) => (
            <div key={group.title} className="space-y-4">
              <span className="text-[10px] font-mono tracking-[0.25em] text-[#C7A46A] uppercase block">
                {group.title}
              </span>
              <ul className="space-y-2 text-xs font-sans text-neutral-400">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="hover:text-[#FAF9F6] transition-colors inline-block py-0.5"
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
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-500">
          <div>
            <span>© {currentYear} RFR BY RIYAS. ALL RIGHTS RESERVED.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-neutral-300 transition-colors">
              PRIVACY POLICY
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-neutral-300 transition-colors">
              TERMS OF PRODUCTION
            </Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-[#C7A46A] transition-colors">
              VIP INQUIRIES
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
