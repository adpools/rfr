import React, { useState } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, ChevronRight, ArrowUpRight, Mail, Phone, Search } from 'lucide-react';
import { InstagramIcon, YoutubeIcon, LinkedinIcon } from '../common/SocialIcons';

interface FullscreenMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavSubItem {
  label: string;
  href: string;
  badge?: string;
}

interface NavGroup {
  label: string;
  href?: string;
  items?: NavSubItem[];
}

interface MainNavItem {
  id: string;
  num: string;
  title: string;
  href: string;
  subGroups?: NavGroup[];
  subItems?: NavSubItem[];
}

export const FullscreenMenu: React.FC<FullscreenMenuProps> = ({ isOpen, onClose }) => {
  const [activeExpanded, setActiveExpanded] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const menuStructure: MainNavItem[] = [
    {
      id: 'timeline',
      num: '01',
      title: 'Timeline',
      href: '/timeline',
      subItems: [
        { label: '2020', href: '/timeline#year-2020' },
        { label: '2021', href: '/timeline#year-2021' },
        { label: '2022', href: '/timeline#year-2022' },
        { label: '2023', href: '/timeline#year-2023' },
        { label: '2024', href: '/timeline#year-2024' },
        { label: '2025', href: '/timeline#year-2025' },
        { label: '2026', href: '/timeline#year-2026' },
      ],
    },
    {
      id: 'about-us',
      num: '02',
      title: 'About us',
      href: '/about',
      subGroups: [
        {
          label: 'a. Riyas Personal Profile - Founder',
          href: '/founder',
        },
        {
          label: 'b. About',
          href: '/about',
          items: [
            { label: 'i. Achievements', href: '/achievements' },
            { label: 'ii. Gallary', href: '/gallery' },
            { label: 'iii. Works', href: '/about#works' },
          ],
        },
      ],
    },
    {
      id: 'what-is-rfr',
      num: '03',
      title: 'What is RFR?',
      href: '/what-is-rfr',
      subItems: [
        { label: 'a. How?', href: '/what-is-rfr#how' },
        { label: 'b. When?', href: '/what-is-rfr#when' },
        { label: 'c. What?', href: '/what-is-rfr#what' },
      ],
    },
    {
      id: 'achievements',
      num: '04',
      title: 'Achievements',
      href: '/achievements',
    },
    {
      id: 'services',
      num: '05',
      title: 'Services',
      href: '/services',
      subGroups: [
        {
          label: 'a. Events',
          href: '/services/events',
          items: [
            { label: 'i. Flee Markets', href: '/services/events/flea-markets' },
            { label: 'ii. New Year Events', href: '/services/events/new-year-events' },
            { label: 'iii. Fashion Events', href: '/services/events/fashion-events' },
            { label: 'iv. Kids Events', href: '/services/events/kids-events' },
            { label: 'v. Festival Events', href: '/services/events/festival-events' },
          ],
        },
        {
          label: 'b. Campaigns',
          href: '/services/campaigns',
          items: [
            { label: 'i. Influencer', href: '/services/campaigns/influencer' },
            { label: 'ii. UGC', href: '/services/campaigns/ugc' },
            { label: 'iii. ADS', href: '/services/campaigns/ads' },
            { label: 'iv. OOH', href: '/services/campaigns/ooh' },
            { label: 'v. Digital Ads', href: '/services/campaigns/digital-ads' },
          ],
        },
        {
          label: 'c. Podcast',
          href: '/services/podcast',
        },
      ],
    },
    {
      id: 'business',
      num: '06',
      title: 'Do Business with us',
      href: '/business',
    },
    {
      id: 'partners',
      num: '07',
      title: 'Channel Partners',
      href: '/partners',
    },
    {
      id: 'milestones',
      num: '08',
      title: 'Milestones',
      href: '/milestones',
    },
    {
      id: 'clients',
      num: '09',
      title: 'Clients',
      href: '/clients',
    },
    {
      id: 'assets',
      num: '10',
      title: 'Assets',
      href: '/assets',
      subItems: [
        { label: 'a. Career', href: '/assets/careers' },
        { label: 'b. Models', href: '/assets/models' },
        { label: 'c. Influencers', href: '/assets/influencers' },
        { label: 'd. Artist', href: '/assets/artists' },
      ],
    },
    {
      id: 'gallary',
      num: '11',
      title: 'Gallary',
      href: '/gallery',
      subItems: [
        { label: 'a. Events', href: '/gallery/events' },
        { label: 'b. Shows', href: '/gallery/shows' },
        { label: 'c. Shoots', href: '/gallery/shoots' },
      ],
    },
    {
      id: 'press',
      num: '12',
      title: 'Press & News',
      href: '/press',
    },
    {
      id: 'contact',
      num: '13',
      title: 'Contact',
      href: '/contact',
    },
  ];

  const toggleExpand = (id: string) => {
    setActiveExpanded(activeExpanded === id ? null : id);
  };

  const filteredItems = menuStructure.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchesTitle = item.title.toLowerCase().includes(q);
    const matchesSub = item.subItems?.some((s) => s.label.toLowerCase().includes(q));
    const matchesGroups = item.subGroups?.some(
      (g) => g.label.toLowerCase().includes(q) || g.items?.some((i) => i.label.toLowerCase().includes(q))
    );
    return matchesTitle || matchesSub || matchesGroups;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' }}
          animate={{ opacity: 1, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
          exit={{ opacity: 0, clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9500] bg-[#050505] text-[#FAF9F6] flex flex-col justify-between overflow-y-auto"
        >
          {/* Top Bar */}
          <div className="z-20 bg-transparent px-6 md:px-16 py-6 border-b border-neutral-900 flex items-center justify-between w-full">
            <div className="flex items-center">
              <Link href="/" onClick={onClose} className="group flex items-center gap-4 no-underline">
                <span className="font-serif text-2xl font-bold text-[#C7A46A] group-hover:text-white transition-colors">
                  RFR
                </span>
                <span className="text-[10px] md:text-[11px] tracking-[0.25em] text-neutral-500 uppercase font-mono hidden sm:inline">
                  BY RIYAS • ECOSYSTEM DIRECTORY
                </span>
              </Link>
            </div>

            {/* Quick Search */}
            <div className="flex items-center gap-4">
              <div className="relative hidden md:flex items-center">
                <Search size={14} className="absolute left-4 text-neutral-600" />
                <input
                  type="text"
                  placeholder="Filter 13 chapters..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[#111111] border border-neutral-800 rounded-full pl-10 pr-4 py-2.5 text-[11px] font-sans tracking-wide text-white placeholder-neutral-600 focus:outline-none focus:border-[#C7A46A] w-56 transition-all"
                />
              </div>

              <button
                onClick={onClose}
                aria-label="Close Menu"
                className="p-2.5 rounded-full bg-[#111111] border border-neutral-800 hover:border-[#C7A46A] hover:text-[#C7A46A] transition-all"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Main Hierarchical Grid */}
          <div className="max-w-[1400px] mx-auto w-full px-6 md:px-16 py-10 flex-1">
            <div className="mb-8 flex items-center justify-between">
              <span className="text-[10px] md:text-[11px] font-mono tracking-[0.25em] uppercase text-[#C7A46A]">
                COMPLETE ARCHITECTURAL ORDER (1 — 13)
              </span>
              <span className="text-[10px] font-mono tracking-[0.2em] text-neutral-600 uppercase">
                13 SECTIONS
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
              {filteredItems.map((item, idx) => {
                const hasChildren = Boolean(item.subItems?.length || item.subGroups?.length);
                const isExpanded = activeExpanded === item.id || searchQuery.length > 0;

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: idx * 0.02 }}
                    className={`rounded-[14px] border transition-all duration-300 ${
                      isExpanded
                        ? 'bg-[#0a0a0a] border-[#C7A46A]/50 shadow-[0_4px_20px_rgba(0,0,0,0.5)]'
                        : 'bg-transparent border-neutral-800/80 hover:border-[#C7A46A]/40'
                    }`}
                  >
                    {/* Item Header */}
                    <div className="px-6 py-5 flex items-center justify-between gap-3">
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className="flex items-center gap-4 group flex-1 no-underline"
                      >
                        <span className="font-serif text-sm font-bold text-[#C7A46A]">
                          {item.num}.
                        </span>
                        <span className="text-base sm:text-[17px] font-serif tracking-wide text-[#E0DDD5] group-hover:text-white transition-colors">
                          {item.title}
                        </span>
                      </Link>

                      {hasChildren && (
                        <button
                          onClick={() => toggleExpand(item.id)}
                          aria-label={`Toggle ${item.title} sub-items`}
                          className="p-1.5 rounded-md bg-[#111111] border border-transparent hover:border-neutral-800 text-neutral-500 hover:text-[#C7A46A] transition-colors"
                        >
                          <ChevronDown
                            size={16}
                            className={`transition-transform duration-300 ${
                              isExpanded ? 'rotate-180 text-[#C7A46A]' : ''
                            }`}
                          />
                        </button>
                      )}
                    </div>

                    {/* Nested Sub-Items / Sub-Groups */}
                    {hasChildren && isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-6 pb-6 pt-1 border-t border-neutral-900 space-y-4"
                      >
                        {/* Simple Flat Sub-Items */}
                        {item.subItems && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                            {item.subItems.map((sub) => (
                              <Link
                                key={sub.label}
                                href={sub.href}
                                onClick={onClose}
                                className="px-3 py-1.5 rounded-lg bg-[#0e0e0e] hover:bg-[#151515] text-xs font-sans text-neutral-300 hover:text-[#C7A46A] transition-colors flex items-center justify-between no-underline"
                              >
                                <span>{sub.label}</span>
                                <ChevronRight size={12} className="text-neutral-600" />
                              </Link>
                            ))}
                          </div>
                        )}

                        {/* Hierarchical Sub-Groups (like About & Services) */}
                        {item.subGroups && (
                          <div className="space-y-2.5 pt-1">
                            {item.subGroups.map((grp) => (
                              <div
                                key={grp.label}
                                className="p-2.5 rounded-xl bg-[#0e0e0e] border border-neutral-850"
                              >
                                {grp.href ? (
                                  <Link
                                    href={grp.href}
                                    onClick={onClose}
                                    className="text-xs font-serif uppercase tracking-wider text-[#C7A46A] hover:text-white flex items-center justify-between no-underline mb-1"
                                  >
                                    <span>{grp.label}</span>
                                    <ArrowUpRight size={12} />
                                  </Link>
                                ) : (
                                  <span className="text-xs font-serif uppercase tracking-wider text-[#C7A46A] block mb-1">
                                    {grp.label}
                                  </span>
                                )}

                                {grp.items && (
                                  <div className="grid grid-cols-1 gap-1 mt-2 pl-2 border-l border-neutral-800">
                                    {grp.items.map((sub) => (
                                      <Link
                                        key={sub.label}
                                        href={sub.href}
                                        onClick={onClose}
                                        className="py-1 text-[11px] font-sans text-neutral-400 hover:text-white transition-colors flex items-center justify-between no-underline"
                                      >
                                        <span>{sub.label}</span>
                                        <ChevronRight size={10} className="text-neutral-600" />
                                      </Link>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Bottom Row Information */}
          <div className="bg-[#050505] border-t border-neutral-900 px-6 md:px-16 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
            <div className="flex flex-wrap items-center gap-6">
              <a
                href="mailto:partnerships@rfrbyriyas.com"
                className="flex items-center gap-2 hover:text-[#C7A46A] transition-colors"
              >
                <Mail size={14} className="text-[#C7A46A]" />
                <span>partnerships@rfrbyriyas.com</span>
              </a>
              <span className="hidden sm:inline text-neutral-800">•</span>
              <span className="flex items-center gap-2 text-neutral-500">
                <Phone size={14} className="text-[#C7A46A]" />
                <span>RFR VIP Desk</span>
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-[#C7A46A]">
                FOLLOW RFR:
              </span>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full bg-[#111111] hover:text-[#C7A46A] transition-colors"
              >
                <InstagramIcon size={14} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full bg-[#111111] hover:text-[#C7A46A] transition-colors"
              >
                <YoutubeIcon size={14} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full bg-[#111111] hover:text-[#C7A46A] transition-colors"
              >
                <LinkedinIcon size={14} />
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
