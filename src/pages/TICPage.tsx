import React, { useState, useEffect } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  Sparkles,
  Play,
  ExternalLink,
  Users,
  Calendar,
  Building2,
  Award,
  Video,
  Radio,
  CheckCircle2,
  X,
  Maximize2
} from 'lucide-react';
import { Link } from 'wouter';

interface TICEvent {
  id: string;
  title: string;
  year: number;
  badge: string;
  host: string;
  description: string;
  hasVideo?: boolean;
  videoEmbedUrl?: string;
  driveFileId?: string;
  thumbnail?: string;
}

const ticEvents: TICEvent[] = [
  {
    id: 'tic-launch-event',
    title: 'Trivandrum Influencer Circle Launch Event',
    year: 2026,
    badge: 'FLAGSHIP INFLUENCER IP • VIDEO PREMIERE',
    host: 'Trivandrum Influencer Circle (TIC)',
    description:
      'The historic inaugural launch gala of Trivandrum Influencer Circle, uniting premier creators, media houses, and brand visionaries in a landmark evening celebrating regional creator culture.',
    hasVideo: true,
    videoEmbedUrl: 'https://drive.google.com/file/d/13KL_xZOjSNeBFJDSfbLic-0wMlBT9lDf/preview',
    driveFileId: '13KL_xZOjSNeBFJDSfbLic-0wMlBT9lDf',
    thumbnail: 'https://drive.google.com/thumbnail?id=13KL_xZOjSNeBFJDSfbLic-0wMlBT9lDf&sz=w1200'
  },
  {
    id: 'tic-event-hycinth',
    title: 'TIC Event – 2 Hycinth',
    year: 2026,
    badge: 'INFLUENCER CONCLAVE • NETWORKING BANQUET',
    host: 'Hycinth Hotels / TIC',
    description:
      'Exclusive influencer conclave and luxury networking banquet hosted at Hycinth Hotel for Trivandrum Influencer Circle members, exploring high-conversion brand activations and content strategy.'
  },
  {
    id: 'tic-onam-hyatt-news18',
    title: 'TIC Onam Event – Hyatt & News 18',
    year: 2026,
    badge: 'BROADCAST & FESTIVE • TELEVISION SHOWCASE',
    host: 'Hyatt Regency / News 18',
    description:
      'Grand festive Onam celebration and televised media showcase organized in partnership with Hyatt Regency and News 18, highlighting Kerala traditional heritage through top regional lifestyle creators.'
  },
  {
    id: 'tic-onam-imperial-kitchen',
    title: 'TIC Onam Event – Imperial Kitchen',
    year: 2026,
    badge: 'FESTIVE CULINARY • CREATOR GATHERING',
    host: 'Imperial Kitchen',
    description:
      'Traditional Onam festive feast and lifestyle creator gathering celebrating authentic Kerala culinary arts and culinary storytelling at Imperial Kitchen.'
  }
];

export interface TicCreatorItem {
  name: string;
  role: string;
  category: string;
}

export interface TicBrandItem {
  name: string;
  category: string;
}

export const DEFAULT_TIC_CREATORS: TicCreatorItem[] = [
  { name: 'Riyas', role: 'Co-Founder • Runway & Creative Direction', category: 'Fashion & Luxury' },
  { name: 'Ganga', role: 'Lifestyle & Contemporary Fashion Creator', category: 'Lifestyle' },
  { name: 'Rithu', role: 'High-Aesthetic Lookbook & Visual Storyteller', category: 'Fashion' },
  { name: 'Teena', role: 'Automotive & Urban Lifestyle Creator', category: 'Automotive & Travel' },
  { name: 'Jeevan', role: 'Hospitality, Travel & Cinematic Vlogger', category: 'Hospitality' },
  { name: 'Thara', role: 'Beauty, Editorial & Commercial Talent', category: 'Editorial' }
];

export const DEFAULT_TIC_BRANDS: TicBrandItem[] = [
  { name: 'Max Fashion', category: 'Apparel & Retail' },
  { name: 'Ather Energy', category: 'EV Automotive' },
  { name: 'Citroën India', category: 'Automotive' },
  { name: 'Škoda Auto', category: 'Automotive' },
  { name: 'Hyatt Regency', category: 'Luxury Hospitality' },
  { name: 'Hycinth Hotels', category: 'Hospitality' },
  { name: 'Imperial Kitchen', category: 'Culinary & Dining' },
  { name: 'News 18', category: 'Television Broadcast' }
];

export const ticCreators = DEFAULT_TIC_CREATORS;
export const ticBrands = DEFAULT_TIC_BRANDS;

export const TICPage: React.FC = () => {
  const [events, setEvents] = useState<TICEvent[]>(ticEvents);
  const [creators, setCreators] = useState<TicCreatorItem[]>(DEFAULT_TIC_CREATORS);
  const [brands, setBrands] = useState<TicBrandItem[]>(DEFAULT_TIC_BRANDS);
  const [content, setContent] = useState({
    title: 'TRIVANDRUM INFLUENCER CIRCLE',
    tagline: 'TIC • CO-FOUNDED BY RIYAS',
    narrative: 'Trivandrum Influencer Circle (TIC) is Kerala’s premier regional creator alliance. Co-Founded by Riyas, TIC was established to bridge authentic regional cultural resonance with high-conversion enterprise brand campaigns spanning fashion, automotive, hospitality, and digital storytelling.',
  });
  const [isPlayingLaunchVideo, setIsPlayingLaunchVideo] = useState(false);
  const [activeModalEvent, setActiveModalEvent] = useState<TICEvent | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    // Fetch TIC Manifesto & Ecosystem (stats.creators & stats.brands)
    supabase
      .from('tic_content')
      .select('*')
      .eq('is_published', true)
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setContent({
            title: data.title || 'TRIVANDRUM INFLUENCER CIRCLE',
            tagline: data.tagline || 'TIC • CO-FOUNDED BY RIYAS',
            narrative: data.narrative || 'Trivandrum Influencer Circle (TIC) is Kerala’s premier regional creator alliance.',
          });
          if (data.stats && typeof data.stats === 'object' && !Array.isArray(data.stats)) {
            if (Array.isArray(data.stats.creators) && data.stats.creators.length > 0) {
              setCreators(data.stats.creators);
            }
            if (Array.isArray(data.stats.brands) && data.stats.brands.length > 0) {
              setBrands(data.stats.brands);
            }
          }
        }
      });

    // Fetch TIC Events
    supabase
      .from('tic_events')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          const mapped: TICEvent[] = data.map((d: any) => ({
            id: d.id,
            title: d.name,
            year: d.event_date ? new Date(d.event_date).getFullYear() : 2026,
            badge: d.venue ? `${d.venue.toUpperCase()} • EVENT` : 'FLAGSHIP INFLUENCER IP',
            host: d.venue || 'Trivandrum Influencer Circle (TIC)',
            description: d.description || '',
            hasVideo: Boolean(d.video_url),
            videoEmbedUrl: d.video_url,
            thumbnail: d.cover_image,
          }));
          setEvents(mapped);
        }
      });
  }, []);

  const launchEvent = events[0] || ticEvents[0];

  return (
    <PageWrapper
      title="TIC — Trivandrum Influencer Circle | RFR Ecosystem"
      description="Official dedicated hub of Trivandrum Influencer Circle (TIC) — premier regional creator collective uniting top fashion, lifestyle, automotive, and tech creators."
    >
      <div className="editorial-container py-12 md:py-20">
        
        {/* 1. HERO SECTION */}
        <div className="max-w-5xl mb-14 md:mb-20">
          <div className="flex items-center gap-3 text-xs font-mono tracking-[0.35em] text-[#C7A46A] uppercase mb-4">
            <Sparkles size={14} className="text-[#C7A46A]" />
            <span>OFFICIAL GUILD • CREATOR COLLECTIVE</span>
          </div>

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-6">
            <div>
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-light text-white uppercase tracking-tight leading-[0.98]">
                {content.title.includes('INFLUENCER') ? (
                  <>
                    {content.title.split('INFLUENCER')[0]} <br />
                    <span className="italic text-[#C7A46A] font-normal">INFLUENCER{content.title.split('INFLUENCER')[1] || '.'}</span>
                  </>
                ) : (
                  content.title
                )}
              </h1>
              <p className="text-neutral-400 text-xs sm:text-sm font-mono uppercase tracking-[0.25em] mt-3">
                {content.tagline}
              </p>
            </div>

            {/* Prominent TIC Official Guild Logo */}
            <div className="p-5 sm:p-6 rounded-[26px] bg-[#111111]/90 backdrop-blur-xl border border-[#C7A46A]/40 flex items-center gap-5 shadow-[0_12px_40px_rgba(0,0,0,0.8)] group hover:border-[#C7A46A]/80 transition-all duration-300">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-black border border-neutral-700 p-2.5 flex items-center justify-center overflow-hidden shadow-inner group-hover:scale-105 transition-transform duration-500">
                <img
                  src="/images/clients/tic.png"
                  alt="Trivandrum Influencer Circle (TIC) Official Logo"
                  className="w-full h-full object-contain filter drop-shadow-[0_4px_16px_rgba(199,164,106,0.4)]"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-serif font-bold text-white tracking-wider">
                  TIC GUILD
                </span>
                <span className="text-xs font-mono text-[#C7A46A] font-semibold tracking-widest mt-0.5">
                  OFFICIAL CREATOR COLLECTIVE
                </span>
                <span className="text-[11px] text-neutral-400 font-mono mt-1">
                  EST. TRIVANDRUM • BY RIYAS
                </span>
              </div>
            </div>
          </div>

          <p className="text-neutral-300 text-sm md:text-base font-light leading-relaxed max-w-3xl">
            {content.narrative}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-mono text-neutral-400">
            <span className="px-3.5 py-1.5 rounded-full bg-[#141414] border border-neutral-800 text-[#C7A46A]">
              ✦ Flagship Creator IP
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-[#141414] border border-neutral-800 text-white">
              ✦ 4 Key Conclaves & Activations
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-[#141414] border border-neutral-800 text-neutral-300">
              ✦ 8+ Enterprise Brand Partners
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-[#141414] border border-neutral-800 text-[#FAF9F6]">
              ✦ Broadcast Alliances (News 18)
            </span>
          </div>
        </div>

        {/* 2. FLAGSHIP LAUNCH VIDEO PREMIERE */}
        <div className="mb-20">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-neutral-800/80">
            <div className="flex items-center gap-2.5 text-xs font-mono text-[#C7A46A]">
              <Video size={16} />
              <span className="tracking-widest uppercase font-bold">TIC FLAGSHIP LAUNCH EVENT REEL</span>
            </div>
            <a
              href={`https://drive.google.com/file/d/${launchEvent.driveFileId}/view`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-neutral-400 hover:text-[#C7A46A] flex items-center gap-1.5 transition-colors"
            >
              <span>OPEN IN GOOGLE DRIVE</span>
              <ExternalLink size={13} />
            </a>
          </div>

          <div className="relative rounded-3xl overflow-hidden bg-[#0c0c0c] border border-neutral-800 shadow-2xl">
            {isPlayingLaunchVideo ? (
              <div className="w-full aspect-video bg-black">
                <iframe
                  src={launchEvent.videoEmbedUrl}
                  title="TIC Inaugural Launch Event Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
            ) : (
              <div className="relative w-full aspect-video sm:aspect-[21/9] bg-[#141414] group overflow-hidden">
                <img
                  src={launchEvent.thumbnail}
                  alt="Trivandrum Influencer Circle Launch Event Video Frame"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-between p-6 sm:p-10">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-[#C7A46A] text-black font-mono font-bold text-xs uppercase tracking-wider">
                      OFFICIAL 2026 VIDEO
                    </span>
                    <span className="text-xs font-mono text-white/80 bg-black/60 px-3 py-1 rounded-full backdrop-blur-md">
                      VERIFIED ARCHIVE
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                    <div className="max-w-2xl">
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-white uppercase tracking-tight mb-2">
                        {launchEvent.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed line-clamp-2 sm:line-clamp-none">
                        {launchEvent.description}
                      </p>
                    </div>

                    <button
                      onClick={() => setIsPlayingLaunchVideo(true)}
                      className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-[#C7A46A] hover:bg-[#d8b57b] text-black font-mono font-bold text-xs tracking-widest uppercase transition-all shadow-xl hover:shadow-2xl hover:scale-105 shrink-0"
                    >
                      <Play size={16} fill="currentColor" />
                      <span>PLAY LAUNCH REEL</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. TIC EVENTS & ACTIVATIONS GRID */}
        <div className="mb-20">
          <div className="flex items-center justify-between pb-4 mb-8 border-b border-neutral-800/80">
            <div className="flex items-center gap-2.5 text-xs font-mono text-white">
              <Calendar size={15} className="text-[#C7A46A]" />
              <span className="tracking-widest uppercase font-bold">TIC EVENT ARCHIVES & CONCLAVES</span>
            </div>
            <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-widest">
              CHRONOLOGY 2026
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {events.map((evt, idx) => (
              <motion.div
                key={evt.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                className="group relative rounded-2xl bg-[#111111] border border-neutral-800 hover:border-[#C7A46A]/60 p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 shadow-xl hover:shadow-[#C7A46A]/5"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="text-[10px] font-mono tracking-widest px-2.5 py-1 rounded-full bg-[#C7A46A]/10 text-[#C7A46A] border border-[#C7A46A]/20">
                      {evt.badge}
                    </span>
                    <span className="text-xs font-mono text-neutral-500 font-bold">
                      {evt.year}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-serif text-white uppercase tracking-tight mb-2 group-hover:text-[#C7A46A] transition-colors">
                    {evt.title}
                  </h3>

                  <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-4">
                    <Building2 size={13} className="text-[#C7A46A]" />
                    <span>Host / Partner: <strong className="text-neutral-300">{evt.host}</strong></span>
                  </div>

                  <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed mb-6">
                    {evt.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between">
                  {evt.hasVideo ? (
                    <button
                      onClick={() => {
                        window.scrollTo({ top: 350, behavior: 'smooth' });
                        setIsPlayingLaunchVideo(true);
                      }}
                      className="text-xs font-mono text-[#C7A46A] hover:underline flex items-center gap-1.5"
                    >
                      <Play size={13} fill="currentColor" />
                      <span>WATCH EVENT VIDEO</span>
                    </button>
                  ) : (
                    <span className="text-[11px] font-mono text-neutral-500 tracking-wider">
                      CONCLAVE ARCHIVE
                    </span>
                  )}

                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                    TIC VERIFIED
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 4. CREATOR NETWORK & TALENT ROSTER */}
        <div className="mb-20">
          <div className="flex items-center justify-between pb-4 mb-8 border-b border-neutral-800/80">
            <div className="flex items-center gap-2.5 text-xs font-mono text-white">
              <Users size={15} className="text-[#C7A46A]" />
              <span className="tracking-widest uppercase font-bold">TIC CORE CREATOR NETWORK</span>
            </div>
            <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-widest">
              REGIONAL ROSTER
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {creators.map((creator, idx) => (
              <div
                key={creator.name || idx}
                className="p-5 rounded-2xl bg-[#0f0f0f] border border-neutral-800 hover:border-[#C7A46A]/40 transition-all flex flex-col justify-between"
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-lg font-serif text-white tracking-wide">{creator.name}</h4>
                  <span className="text-[10px] font-mono text-[#C7A46A] bg-[#C7A46A]/10 px-2 py-0.5 rounded-full border border-[#C7A46A]/20">
                    {creator.category}
                  </span>
                </div>
                <p className="text-xs font-mono text-neutral-400">
                  {creator.role}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 5. STRATEGIC BRAND ALLIANCES */}
        <div className="mb-20 p-8 sm:p-10 rounded-3xl bg-[#0e0e0e] border border-neutral-800/80 shadow-2xl">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-mono text-[#C7A46A] tracking-[0.3em] uppercase block mb-2">
              COMMERCIAL ALLIANCES
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif text-white uppercase tracking-tight mb-3">
              ENTERPRISE BRANDS PARTNERED WITH TIC
            </h3>
            <p className="text-neutral-400 text-xs sm:text-sm font-light leading-relaxed">
              From multinational automotive manufacturers to luxury hospitality chains and leading fashion retailers, TIC delivers measurable reach and authentic regional connection.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {brands.map((brand, idx) => (
              <div
                key={brand.name || idx}
                className="p-4 rounded-xl bg-[#141414] border border-neutral-800 flex flex-col items-center justify-center text-center hover:border-[#C7A46A]/50 transition-colors"
              >
                <span className="text-sm font-semibold text-white tracking-wide">{brand.name}</span>
                <span className="text-[10px] font-mono text-[#C7A46A] mt-1">{brand.category}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 6. CO-FOUNDER NOTE & DIRECT CONTACT */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#121212] via-[#0d0d0d] to-black border border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="max-w-xl">
            <span className="text-xs font-mono text-[#C7A46A] tracking-[0.3em] uppercase block mb-2">
              CREATIVE DIRECTION & LEADERSHIP
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif text-white uppercase tracking-tight mb-4">
              COLLABORATE WITH TRIVANDRUM INFLUENCER CIRCLE
            </h3>
            <p className="text-sm text-neutral-300 font-light leading-relaxed mb-4">
              For brand campaigns, creator casting, event hosting, and television broadcast activations across Kerala, connect directly with the RFR and TIC creative desk.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
              <CheckCircle2 size={14} className="text-[#C7A46A]" />
              <span>Co-Founded by Riyas • Supported by Riyas Fashion Runway</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <Link
              href="/contact"
              className="px-8 py-4 rounded-full bg-[#C7A46A] hover:bg-[#d8b57b] text-black font-mono font-bold text-xs tracking-widest uppercase transition-all shadow-xl hover:scale-105"
            >
              COMMISSION CAMPAIGN
            </Link>
            <Link
              href="/timeline"
              className="px-8 py-4 rounded-full bg-neutral-900 border border-neutral-700 hover:border-[#C7A46A] text-white hover:text-[#C7A46A] font-mono text-xs tracking-widest uppercase transition-all"
            >
              PORTFOLIO TIMELINE
            </Link>
          </div>
        </div>

      </div>
    </PageWrapper>
  );
};

