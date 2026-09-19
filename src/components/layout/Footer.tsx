import React, { useState } from 'react';
import { Link } from 'wouter';
import { ArrowUpRight, CheckCircle2, Send } from 'lucide-react';
import { InstagramIcon, YoutubeIcon, LinkedinIcon } from '../common/SocialIcons';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer
      id="chapter-17"
      className="full-viewport-scene bg-[#050505] text-[#FAF9F6] border-t border-[#C7A46A]/20 flex flex-col justify-between relative overflow-hidden"
    >
      {/* Background Ambient Aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[#C7A46A]/5 blur-3xl pointer-events-none" />

      {/* Top Monumental Statement */}
      <div className="editorial-container relative z-10 pt-16 md:pt-20 text-center">
        <span className="text-[10px] tracking-[0.4em] text-[#C7A46A] uppercase font-mono block mb-4">
          17 • THE PHILOSOPHY IN MOTION
        </span>
        <h2 className="text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-serif font-light tracking-tighter uppercase leading-[0.9] text-neutral-200 hover:text-white transition-colors select-none">
          SEE YOU <br />
          <span className="italic text-[#C7A46A]">BEYOND</span> <br />
          THE RUNWAY.
        </h2>
      </div>

      {/* Center Multicolumn Navigation */}
      <div className="editorial-container relative z-10 my-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-neutral-900">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4 no-underline">
              <span className="font-sculptural text-3xl font-bold tracking-[0.2em] text-[#C7A46A] block">
                RFR
              </span>
              <span className="font-sans text-[10px] tracking-[0.35em] text-neutral-400 uppercase font-light mt-1 block">
                RIYAS FASHION RUNWAY
              </span>
            </Link>
            <p className="text-neutral-400 text-xs font-light leading-relaxed max-w-sm mb-6">
              An international luxury creative ecosystem uniting fashion runways, experiential properties, creator campaigns, digital media, and cultural dialogues.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-[#111111] border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-[#C7A46A] hover:border-[#C7A46A] transition-all"
              >
                <InstagramIcon size={16} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-full bg-[#111111] border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-[#C7A46A] hover:border-[#C7A46A] transition-all"
              >
                <YoutubeIcon size={16} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-full bg-[#111111] border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-[#C7A46A] hover:border-[#C7A46A] transition-all"
              >
                <LinkedinIcon size={16} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-[0.25em] text-[#C7A46A] mb-4">
              EXPLORE
            </h4>
            <ul className="space-y-2.5 list-none text-xs font-light text-neutral-400">
              <li><Link href="/timeline" className="hover:text-white transition-colors">Timeline Archive</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About RFR</Link></li>
              <li><Link href="/what-is-rfr" className="hover:text-white transition-colors">Ecosystem Core</Link></li>
              <li><Link href="/founder" className="hover:text-white transition-colors">The Founder</Link></li>
              <li><Link href="/gallery" className="hover:text-white transition-colors">Curated Gallery</Link></li>
              <li><Link href="/press" className="hover:text-white transition-colors">Press & News</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-[0.25em] text-[#C7A46A] mb-4">
              SERVICES
            </h4>
            <ul className="space-y-2.5 list-none text-xs font-light text-neutral-400">
              <li><Link href="/services/events/fashion-events" className="hover:text-white transition-colors">Fashion Runways</Link></li>
              <li><Link href="/services/events/flea-markets" className="hover:text-white transition-colors">Curated Fleas</Link></li>
              <li><Link href="/services/campaigns/influencer" className="hover:text-white transition-colors">Influencer Roster</Link></li>
              <li><Link href="/services/campaigns/ugc" className="hover:text-white transition-colors">UGC Studio</Link></li>
              <li><Link href="/services/campaigns/ooh" className="hover:text-white transition-colors">OOH Billboards</Link></li>
              <li><Link href="/services/podcast" className="hover:text-white transition-colors">Podcast Studio</Link></li>
            </ul>
          </div>

          {/* Talent & Newsletter */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-[0.25em] text-[#C7A46A] mb-4">
              THE NETWORK
            </h4>
            <ul className="space-y-2.5 list-none text-xs font-light text-neutral-400 mb-6">
              <li><Link href="/assets/models" className="hover:text-white transition-colors">Models Guild</Link></li>
              <li><Link href="/assets/influencers" className="hover:text-white transition-colors">Influencer Portal</Link></li>
              <li><Link href="/assets/artists" className="hover:text-white transition-colors">Artists & DJs</Link></li>
              <li><Link href="/assets/careers" className="hover:text-white transition-colors">Careers at RFR</Link></li>
            </ul>

            {/* Newsletter Subscription */}
            <h5 className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase mb-2">
              EDITORIAL DISPATCH
            </h5>
            {subscribed ? (
              <div className="flex items-center gap-2 text-xs text-[#C7A46A]">
                <CheckCircle2 size={15} />
                <span>Subscribed to RFR Dispatch.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="relative">
                <input
                  type="email"
                  required
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#111111] border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#C7A46A] transition-colors pr-8"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[#C7A46A] transition-colors"
                >
                  <Send size={13} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar & Final Fade */}
      <div className="editorial-container relative z-10 pb-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-light text-neutral-500">
        <div>
          © {new Date().getFullYear()} RFR BY RIYAS (Riyas Fashion Runway). All rights reserved.
        </div>
        <div className="flex items-center gap-6">
          <Link href="/privacy" className="hover:text-neutral-300 transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-neutral-300 transition-colors">Terms of Experience</Link>
          <Link href="/contact" className="hover:text-[#C7A46A] transition-colors flex items-center gap-1">
            <span>Inquire</span>
            <ArrowUpRight size={11} />
          </Link>
        </div>
      </div>
    </footer>
  );
};
