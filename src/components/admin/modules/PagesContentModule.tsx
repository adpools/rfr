import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import { Save, RefreshCw, Eye, EyeOff, FileText, CheckCircle2, Globe, Layers } from 'lucide-react';

interface PageDef {
  slug: string;
  name: string;
  route: string;
  group: 'Core' | 'Events' | 'Campaigns' | 'Podcast' | 'Talent';
  defaultTitle: string;
  defaultSubtitle: string;
  defaultContent: {
    leadNarrative?: string;
    secondaryNarrative?: string;
    items?: Array<{ title: string; desc: string }>;
  };
}

const PAGE_DEFINITIONS: PageDef[] = [
  // --- CORE PAGES ---
  {
    slug: 'what-is-rfr',
    name: 'What is RFR? Manifesto',
    route: '/what-is-rfr',
    group: 'Core',
    defaultTitle: 'WHAT IS RFR?',
    defaultSubtitle: 'A complete overview of the vision, operational mechanics, seasonal rhythms, and creative outputs of Riyas Fashion Runway.',
    defaultContent: {
      leadNarrative: 'RFR stands for Riyas Fashion Runway. It is a fashion, lifestyle, and multi-disciplinary creative platform founded by Riyas.',
      secondaryNarrative: 'Rather than functioning solely as an event firm, RFR operates as an interconnected creative ecosystem designed to unite runway couture, digital creator economies, enterprise advertising, and cultural media platforms into a singular, prestigious engine.',
      items: [
        { title: 'Runway Couture Architecture', desc: 'Curating flagship runway productions, lookbooks, and high-fashion galas across luxury venues.' },
        { title: 'Digital Creator Economy', desc: 'Empowering top lifestyle, fashion, and culture creators with high-value brand alignments.' },
        { title: 'Enterprise Ad Direction', desc: 'Directing cinematic commercial films, brand campaigns, and omnichannel digital rollouts.' },
        { title: 'Cultural IP & Festival Ecosystems', desc: 'Pioneering lifestyle IPs such as Koottam Flea Market and The Indian Couture conclaves.' }
      ]
    }
  },
  {
    slug: 'business',
    name: 'Business & Collaborations',
    route: '/business',
    group: 'Core',
    defaultTitle: 'DO BUSINESS WITH US',
    defaultSubtitle: 'Partner with Riyas Fashion Runway for marquee sponsorships, commercial ad campaigns, experiential flea pop-ups, and co-branded intellectual property.',
    defaultContent: {
      leadNarrative: 'We collaborate with forward-thinking luxury brands, enterprise advertisers, retail giants, and cultural entities to craft unforgettable brand resonance.',
      items: [
        { title: 'Title & Headline Sponsorships', desc: 'Marquee naming rights, VIP hospitality suites, runway stage branding, and red-carpet dominance across flagship RFR Galas and Fashion Weeks.' },
        { title: '360° Omnichannel Campaigns', desc: 'Bespoke integration uniting high-production commercial films, influencer creator tiers, OOH urban billboards, and digital ad funnels.' },
        { title: 'Experiential Activations & Flea Pop-ups', desc: 'Custom branded retail pavilions, sensory sampling zones, and VIP lounge takeovers across high-footfall lifestyle festivals.' },
        { title: 'Strategic Production & Co-Branded IP', desc: 'Long-term joint venture IP development, co-branded collection drops, and dedicated podcast series seasons.' }
      ]
    }
  },
  {
    slug: 'partners',
    name: 'Channel Partners & Alliances',
    route: '/partners',
    group: 'Core',
    defaultTitle: 'CHANNEL PARTNERS',
    defaultSubtitle: 'Collaborating with visionary media houses, luxury venue operators, technical cinematographers, and talent representation guilds.',
    defaultContent: {
      leadNarrative: 'Strategic alliances driving luxury production values, international distribution, and elite venue partnerships.',
      items: [
        { title: 'Luxury Hospitality Partners', desc: 'Marquee venue alliances with 5-star luxury resorts and iconic architectural properties.' },
        { title: 'Broadcast Media Houses', desc: 'Televised syndication and media network partnerships across regional and national outlets.' },
        { title: 'Audio & Visual Engineering', desc: 'Cutting-edge lighting, 4K multi-cam cinematography, and stage acoustic engineering.' },
        { title: 'Talent Guild Representation', desc: 'Official scouting and agency representations across international fashion circuits.' }
      ]
    }
  },
  {
    slug: 'achievements',
    name: 'Honors & Track Record',
    route: '/achievements',
    group: 'Core',
    defaultTitle: 'HONORS & TRACK RECORD',
    defaultSubtitle: 'A curated chronicle of industry milestones, flagship productions, talent mentorships, and enterprise brand partnerships.',
    defaultContent: {
      leadNarrative: 'From South India’s luxury runways to enterprise automotive campaigns, RFR has set benchmark production standards across fashion, retail, and lifestyle.',
      items: [
        { title: '100+ Flagship Productions', desc: 'Curated high-fashion runway shows, beauty pageants, countdown galas, and festival spectacles across India.' },
        { title: '500+ Talents Mentored', desc: 'Discovered, coached, groomed, and provided runway and commercial campaign exposure to hundreds of models, artists, and creators.' },
        { title: '50+ Global & National Brands', desc: 'Trusted by industry titans such as Manyavar, Puma, Max Fashion, Mahindra, Lulu Mall, and UDS Hotels.' },
        { title: '100,000+ Flea Market Attendees', desc: 'Built the Koottam Flea Market into a premier youth lifestyle and entrepreneurial cultural phenomenon.' }
      ]
    }
  },
  {
    slug: 'milestones',
    name: 'Milestones Evolution',
    route: '/milestones',
    group: 'Core',
    defaultTitle: 'EVERY CHAPTER BECOMES PART OF THE JOURNEY',
    defaultSubtitle: 'Every event, campaign, collaboration and partnership adds another defining chapter to the RFR creative evolution.',
    defaultContent: {
      leadNarrative: 'Tracing the path from foundational runway showcases to a multi-tiered international creative and production powerhouse.',
      items: [
        { title: '2026: Global Expansion & Digital Studios', desc: 'AI-integrated runway lookbooks, international fashion exchange tours, and RFR Creator Studio Residency.' },
        { title: '2025: Grand Runway Tours & IP Scaling', desc: 'Produced marquee regional runway editions and expanded creator campaign impressions.' },
        { title: '2024: Mega Runway & Media Ecosystem', desc: 'Executed high-impact commercial campaigns and established official luxury resort partnerships.' },
        { title: '2023: The Koottam Flea Phenomenon', desc: 'Solidified the Flea Market format as a cultural staple and managed national festive campaigns.' }
      ]
    }
  },
  {
    slug: 'services',
    name: 'Services Overview Spectrum',
    route: '/services',
    group: 'Core',
    defaultTitle: 'SERVICES & CREATIVE IP',
    defaultSubtitle: 'Explore the complete spectrum of experiential event productions, commercial campaigns, influencer amplification, and podcast media.',
    defaultContent: {
      leadNarrative: 'RFR delivers end-to-end creative direction, high-fashion choreography, architectural runway staging, and multi-channel content production.',
      items: [
        { title: 'Fashion Runway & Staging', desc: 'Choreography, lighting architecture, model casting, and stage direction for premier couture.' },
        { title: 'Commercial Ad Direction', desc: 'Cinematic ad films, brand storytelling, and automotive launch productions.' },
        { title: 'Creator & Influencer Marketing', desc: 'Multi-tier influencer amplification, PR seeding, and authentic lifestyle creator integrations.' },
        { title: 'Broadcast Podcast Facility', desc: 'Full 4K multi-camera studio dialogues, audio engineering, and creator residency series.' }
      ]
    }
  },

  // --- 11 INDIVIDUAL SERVICES (5 Events, 5 Campaigns, 1 Podcast) ---
  {
    slug: 'service_flea-markets',
    name: 'Service: Koottam Flea Market',
    route: '/services/events/flea-markets',
    group: 'Events',
    defaultTitle: 'Koottam Flea Market & Lifestyle Curations',
    defaultSubtitle: 'Kerala\'s benchmark experiential flea marketplace uniting 50+ independent brands, creators & live entertainment.',
    defaultContent: {
      leadNarrative: 'RFR\'s flagship Koottam Flea Market IP brings together 50+ independent fashion labels, artisanal lifestyle crafts, gourmet culinary creators, acoustic stages, and thousands of attendees in high-vibe weekend curations.',
      secondaryNarrative: 'Koottam Flea Market is RFR\'s proprietary signature IP, conceived to celebrate indie entrepreneurs, home-grown fashion labels, handmade artisan accessories, and contemporary street culture.',
      items: [
        { title: 'Stall curation & vendor spatial design', desc: '50+ independent fashion, lifestyle & artisanal brands per edition' },
        { title: 'Comprehensive on-ground production', desc: 'Integrated live music stages, acoustic sets, and runway pop-ups' },
        { title: 'Sponsor integration & experiential branded zones', desc: 'Engaging culinary spaces and gourmet creator showcases' },
        { title: 'Omnichannel social and influencer amplification', desc: 'Over 15,000+ enthusiastic attendees across multi-day seasons' }
      ]
    }
  },
  {
    slug: 'service_new-year-events',
    name: 'Service: New Year Celebrations',
    route: '/services/events/new-year-events',
    group: 'Events',
    defaultTitle: 'New Year Celebrations & Countdown Galas',
    defaultSubtitle: 'Marquee holiday spectacles at UDS Kovalam and Hycinth Hotels with world-class light and sound architecture.',
    defaultContent: {
      leadNarrative: 'High-octane countdown galas produced across Kerala\'s premier 5-star properties, featuring headline DJ acts, couture countdown showcases, laser projection mapping, and VIP brand lounges.',
      secondaryNarrative: 'Engineered as monumental holiday celebrations, RFR New Year productions unite premium hospitality, world-class sound, bespoke lighting architecture, celebrity talent, and immersive visual storytelling.',
      items: [
        { title: 'Monumental Countdown Stage Architecture', desc: 'Intelligent laser lighting design and audio engineering' },
        { title: 'Headline DJ Acts & Live Performers', desc: 'Couture countdown showcases and choreographed entertainment' },
        { title: 'VIP Hospitality & Security Protocol', desc: 'Red-carpet media coverage and luxury patron management' },
        { title: 'Turnkey Technical & Hospitality Integration', desc: 'Complete multi-hall audio-visual production' }
      ]
    }
  },
  {
    slug: 'service_fashion-events',
    name: 'Service: Fashion Runway',
    route: '/services/events/fashion-events',
    group: 'Events',
    defaultTitle: 'Fashion Runway & Designer Showcases',
    defaultSubtitle: 'The quintessential RFR signature runway presentations from Global Fashion Week Lulu to Chakita DD Retreat.',
    defaultContent: {
      leadNarrative: 'Bespoke couture runway architecture that blends high-fashion choreography, mood-calibrated lighting, and curated model line-ups into transcendent spectacles.',
      secondaryNarrative: 'RFR runway events set the gold standard in South Indian high fashion, partnering with premier couture designers and luxury retail destinations.',
      items: [
        { title: 'Runway Choreography & Stage Direction', desc: 'Precision model coaching and show timing' },
        { title: 'Lighting Architecture & Scenic Scenography', desc: 'Custom catwalk construction and LED video backdrops' },
        { title: 'Model Casting & Backstage Management', desc: 'A-list models and backstage dressers' },
        { title: 'Front-Row VIP Protocol', desc: 'Press coverage, red carpet step-and-repeat, and media distribution' }
      ]
    }
  },
  {
    slug: 'service_kids-events',
    name: 'Service: Kids Runway',
    route: '/services/events/kids-events',
    group: 'Events',
    defaultTitle: 'Kids Fashion & Youth Creative Runways',
    defaultSubtitle: 'Nurturing young confidence through high-production junior runways, confidence grooming, and family festivals.',
    defaultContent: {
      leadNarrative: 'Empowering children and young talents with stage poise, creative expression, and runway exposure in a vibrant, family-centric celebratory environment.',
      secondaryNarrative: 'RFR Junior runways are crafted with professional runway standards tailored to inspire confidence and celebrate youthful creativity.',
      items: [
        { title: 'Junior Runway Choreography', desc: 'Age-appropriate runway pacing and confidence coaching' },
        { title: 'Parent & Family VIP Lounge Management', desc: 'Comfortable family hospitality and safe backstage protocol' },
        { title: 'Designer Kidswear Showcases', desc: 'Partnering with national and regional children\'s fashion brands' },
        { title: 'Professional Portfolio Photography', desc: 'High-resolution lookbook assets for participating kids' }
      ]
    }
  },
  {
    slug: 'service_festival-events',
    name: 'Service: Cultural Festivals',
    route: '/services/events/festival-events',
    group: 'Events',
    defaultTitle: 'Cultural Festivals & Thematic Galas',
    defaultSubtitle: 'High-energy festive galas translating cultural heritage into contemporary celebrations with thousands of dancers.',
    defaultContent: {
      leadNarrative: 'Immersive cultural celebrations, Onam spectacles, and heritage festivals featuring mass flash mobs, synchronized traditional percussion, and thematic stage performances.',
      secondaryNarrative: 'Harmonizing traditional artistry with modern stage spectacle, RFR crafts cultural experiences that captivate broad audiences.',
      items: [
        { title: 'Heritage Choreography & Mass Flash Mobs', desc: 'Synchronized cultural dancers and acoustic percussion ensembles' },
        { title: 'Thematic Stage Architecture', desc: 'Traditional Kerala aesthetic fused with modern concert lighting' },
        { title: 'Festival Crowd Dynamics & Production', desc: 'High-capacity venue management and public safety protocols' },
        { title: 'Broadcast & Media Syndication', desc: 'Regional television and digital broadcast streaming' }
      ]
    }
  },

  // --- CAMPAIGNS SERVICES (5) ---
  {
    slug: 'service_influencer',
    name: 'Service: TIC & Influencer Alliances',
    route: '/services/campaigns/influencer',
    group: 'Campaigns',
    defaultTitle: 'Trivandrum Influencer Circle (TIC) & Talent Alliances',
    defaultSubtitle: 'Curating high-credibility creator collaborations connecting global brands with South India\'s most influential voices.',
    defaultContent: {
      leadNarrative: 'Pioneered by RFR, Trivandrum Influencer Circle brings together 50+ verified lifestyle, beauty, tech, and cultural creators for high-impact brand activations.',
      secondaryNarrative: 'TIC bridges enterprise brands with regional authentic creators, guaranteeing authentic reach and elevated brand prestige.',
      items: [
        { title: 'Creator Curation & Strategic Casting', desc: 'Matching brand aesthetics with vetted regional and national influencers' },
        { title: 'Experiential Creator Gatherings', desc: 'Curated networking dinners, product unboxing galas, and VIP experiences' },
        { title: 'Multi-Platform Content Campaigns', desc: 'Coordinated Instagram reels, YouTube shorts, and digital media rollouts' },
        { title: 'Performance Analytics & Reach Metrics', desc: 'Transparent impression tracking, engagement metrics, and ROI reporting' }
      ]
    }
  },
  {
    slug: 'service_ugc',
    name: 'Service: UGC Creator Studio',
    route: '/services/campaigns/ugc',
    group: 'Campaigns',
    defaultTitle: 'UGC & High-Conversion Creator Studio',
    defaultSubtitle: 'High-converting, organic-feel user generated video & reels designed for Meta ads, TikTok & Instagram.',
    defaultContent: {
      leadNarrative: 'Performance-driven User-Generated Content engineered for modern digital ad funnels, driving authentic trust and direct customer conversions.',
      secondaryNarrative: 'Our in-house creator network script, shoot, and edit raw, relatable, high-converting video creative for direct-to-consumer and lifestyle brands.',
      items: [
        { title: 'Scripting & Direct Response Hook Writing', desc: 'Crafted for 3-second retention and high conversion click-through' },
        { title: 'Authentic Creator Filming', desc: 'Natural lighting, real-world product usage, and lifestyle settings' },
        { title: 'Fast-Turnaround Post-Production', desc: 'Dynamic subtitles, sound design, and vertical aspect ratio optimization' },
        { title: 'A/B Test Creative Variations', desc: 'Multiple hooks and calls-to-action to optimize ad performance' }
      ]
    }
  },
  {
    slug: 'service_ads',
    name: 'Service: Commercial Brand Films',
    route: '/services/campaigns/ads',
    group: 'Campaigns',
    defaultTitle: 'Commercial Brand Films & Automotive Campaigns',
    defaultSubtitle: 'Cinematic brand commercials, automobile campaigns & television commercials for national and international brands.',
    defaultContent: {
      leadNarrative: 'Cinematic visual storytelling crafted with cinema cameras, dramatic lighting, precision vehicle tracking, and world-class color grading.',
      secondaryNarrative: 'From concept script to cinema DCP, RFR commercial productions deliver benchmark advertising for leading automotive, fashion, and retail brands.',
      items: [
        { title: 'Concept Ideation & Cinematic Treatments', desc: 'Creative storyboards, scriptwriting, and location scouting' },
        { title: 'Cinema-Grade Production', desc: 'High-end cinema packages, anamorphic lenses, and professional camera crews' },
        { title: 'Precision Automotive & Stunt Tracking', desc: 'Vehicle tracking rigs and high-speed motion capture' },
        { title: 'High-End Color & Sound Finishing', desc: 'DaVinci Resolve color grading and 5.1 surround sound design' }
      ]
    }
  },
  {
    slug: 'service_ooh',
    name: 'Service: OOH Billboards',
    route: '/services/campaigns/ooh',
    group: 'Campaigns',
    defaultTitle: 'Out-Of-Home (OOH) & High-Street Billboards',
    defaultSubtitle: 'Dominating prime Kerala city skylines and transit corridors with high-contrast luxury outdoor media.',
    defaultContent: {
      leadNarrative: 'Commanding urban skylines and key highway arteries with striking, high-fashion billboard creative that anchors brand dominance.',
      secondaryNarrative: 'Combining strategic location procurement with unforgettable luxury art direction to deliver non-skippable real-world impact.',
      items: [
        { title: 'Prime Urban Site Selection', desc: 'High-visibility hoardings, LED billboards, and airport transit corridors' },
        { title: 'High-Impact Creative Direction', desc: 'Oversized typographic hierarchy and striking visual composition' },
        { title: 'Print Production & Fabrication', desc: 'Large-format UV-resistant vinyl printing and illumination' },
        { title: 'Omnichannel Alignment', desc: 'Synchronizing billboard rollouts with digital and print campaigns' }
      ]
    }
  },
  {
    slug: 'service_digital-ads',
    name: 'Service: Digital Ads Media',
    route: '/services/campaigns/digital-ads',
    group: 'Campaigns',
    defaultTitle: 'Targeted Digital Ads & Performance Media',
    defaultSubtitle: 'Data-guided digital advertising across Meta, Google, TikTok, and programmatic networks.',
    defaultContent: {
      leadNarrative: 'High-performance digital advertising campaigns designed to maximize brand reach, customer acquisition, and campaign conversion.',
      secondaryNarrative: 'Combining creative sophistication with rigorous data optimization to achieve measurable business results for our brand partners.',
      items: [
        { title: 'Multi-Channel Media Planning', desc: 'Targeted distribution across Meta, YouTube, Google, and programmatic' },
        { title: 'Dynamic Ad Creative Production', desc: 'Video, carousel, and static banner design optimized for click-through' },
        { title: 'Funnel Optimization & Tracking', desc: 'Pixel integration, conversion API setup, and attribution modeling' },
        { title: 'Real-Time Performance Tuning', desc: 'Budget pacing, audience testing, and continuous ROAS optimization' }
      ]
    }
  },

  // --- PODCAST SERVICE (1) ---
  {
    slug: 'service_podcast',
    name: 'Service: Podcast Studio',
    route: '/services/podcast',
    group: 'Podcast',
    defaultTitle: 'The RFR Podcast Studio & Rewind with Riyas',
    defaultSubtitle: 'Unfiltered, intellectual dialogues with cultural icons, playback singers, designers, and creative pioneers.',
    defaultContent: {
      leadNarrative: 'A dedicated multi-camera 4K podcast and vodcast studio facility producing thought leadership dialogues, celebrity interviews, and creative industry retrospectives.',
      secondaryNarrative: 'Hosted by Adv. Riyas, Rewind with Riyas dives into the creative evolution, struggles, and triumphs of influential figures.',
      items: [
        { title: '4K Multi-Camera Studio Production', desc: 'Cinema camera multi-angle recording with live broadcast switching' },
        { title: 'Broadcast Audio Engineering', desc: 'Studio-grade Shure microphone arrays and acoustic sound treatment' },
        { title: 'Long-Form & Micro-Content Editing', desc: 'Full YouTube episodes, podcast audio masters, and viral reel cutdowns' },
        { title: 'Distribution & Syndication', desc: 'Publishing across YouTube, Spotify, Apple Podcasts, and social media' }
      ]
    }
  },

  // --- TALENT GUILDS & ASSETS ---
  {
    slug: 'assets',
    name: 'Talent Guilds & Assets Overview',
    route: '/assets',
    group: 'Talent',
    defaultTitle: 'THE RFR NETWORK',
    defaultSubtitle: 'A premier launchpad and collaborative ecosystem for passionate professionals, models, creators, and performing artists.',
    defaultContent: {
      leadNarrative: 'A premier launchpad and collaborative ecosystem for passionate professionals, models, creators, and performing artists.',
      items: [
        { title: 'Careers Portal', desc: 'Backstage production, styling, and creative operations guild.' },
        { title: 'Models Intake', desc: 'Runway casting, commercial lookbooks, and high-fashion modeling.' },
        { title: 'Influencers Network', desc: 'Creator campaigns, brand ambassadors, and lifestyle storytelling.' },
        { title: 'Artists & Performers', desc: 'Live music, contemporary dancers, and visionary stage acts.' }
      ]
    }
  },
  {
    slug: 'talent_careers',
    name: 'Talent Guild: Careers Portal',
    route: '/assets/careers',
    group: 'Talent',
    defaultTitle: 'PRODUCTION CREW & CAREERS',
    defaultSubtitle: 'Join our backstage production, styling, and creative operations guild.',
    defaultContent: {
      leadNarrative: 'We are expanding our core team of event managers, choreographers, backstage styling coordinators, and media technicians.',
      items: [
        { title: 'Runway Show Operations', desc: 'Backstage coordinators, model line-up managers, and cue callers.' },
        { title: 'Styling & Wardrobe', desc: 'Fashion stylists, wardrobe dressers, and accessory curators.' },
        { title: 'Cinematography & Audio', desc: 'Camera operators, drone pilots, and live sound engineers.' },
        { title: 'Event Marketing & PR', desc: 'Media liaison officers, creator relations coordinators, and brand reps.' }
      ]
    }
  },
  {
    slug: 'talent_artists',
    name: 'Talent Guild: Artists Portal',
    route: '/assets/artists',
    group: 'Talent',
    defaultTitle: 'ARTISTS & PERFORMERS INTAKE',
    defaultSubtitle: 'Curating visionary performance artists, musicians, and stage acts.',
    defaultContent: {
      leadNarrative: 'RFR platforms emerging and established musical acts, contemporary dancers, and visual artists across our high-fashion galas and festivals.',
      items: [
        { title: 'Live Music & Bands', desc: 'Acoustic sets, fusion bands, and instrumental soloists for festival stages.' },
        { title: 'DJ & Electronic Producers', desc: 'Deep house, electronic percussion, and runway sound designers.' },
        { title: 'Choreography & Dance', desc: 'Contemporary, avant-garde, and traditional Kerala cultural performers.' },
        { title: 'Visual & Installation Artists', desc: 'Live muralists, kinetic sculptors, and digital projection artists.' }
      ]
    }
  }
];

interface PagesContentModuleProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  isConfigured: boolean;
}

export const PagesContentModule: React.FC<PagesContentModuleProps> = ({ showToast }) => {
  const [activeGroup, setActiveGroup] = useState<'All' | 'Core' | 'Events' | 'Campaigns' | 'Podcast' | 'Talent'>('All');
  const [selectedSlug, setSelectedSlug] = useState<string>('what-is-rfr');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [leadNarrative, setLeadNarrative] = useState('');
  const [secondaryNarrative, setSecondaryNarrative] = useState('');
  const [items, setItems] = useState<Array<{ title: string; desc: string }>>([]);
  const [isPublished, setIsPublished] = useState(true);

  const activePageDef = PAGE_DEFINITIONS.find((p) => p.slug === selectedSlug) || PAGE_DEFINITIONS[0];

  const loadPageContent = async (slug: string) => {
    setLoading(true);
    const def = PAGE_DEFINITIONS.find((p) => p.slug === slug) || PAGE_DEFINITIONS[0];

    // Set defaults first
    setTitle(def.defaultTitle);
    setSubtitle(def.defaultSubtitle);
    setLeadNarrative(def.defaultContent.leadNarrative || '');
    setSecondaryNarrative(def.defaultContent.secondaryNarrative || '');
    setItems(def.defaultContent.items || []);
    setIsPublished(true);

    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .eq('page_slug', slug)
        .maybeSingle();

      if (error) {
        console.warn('page_content fetch notice:', error.message);
      } else if (data) {
        if (data.title) setTitle(data.title);
        if (data.subtitle !== undefined) setSubtitle(data.subtitle || '');
        if (data.is_published !== undefined) setIsPublished(data.is_published);
        if (data.content && typeof data.content === 'object') {
          if (data.content.leadNarrative !== undefined) setLeadNarrative(data.content.leadNarrative);
          else if (data.content.description !== undefined) setLeadNarrative(data.content.description);

          if (data.content.secondaryNarrative !== undefined) setSecondaryNarrative(data.content.secondaryNarrative);
          else if (data.content.detailedOverview !== undefined) setSecondaryNarrative(data.content.detailedOverview);

          if (Array.isArray(data.content.items)) {
            setItems(data.content.items);
          } else if (Array.isArray(data.content.deliverables)) {
            setItems(data.content.deliverables.map((d: string) => {
              const parts = d.split(':');
              return { title: parts[0]?.trim() || 'Highlight', desc: parts.slice(1).join(':').trim() };
            }));
          }
        }
      }
    } catch (err: any) {
      console.warn('Error loading page content:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPageContent(selectedSlug);
  }, [selectedSlug]);

  const handleItemChange = (index: number, field: 'title' | 'desc', val: string) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: val };
      return next;
    });
  };

  const addItem = () => {
    setItems((prev) => [...prev, { title: 'New Item', desc: 'Description here...' }]);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    if (!isSupabaseConfigured) {
      setTimeout(() => {
        setSaving(false);
        showToast('Changes saved locally in preview mode');
      }, 400);
      return;
    }

    const payload = {
      page_slug: selectedSlug,
      title: title.trim() || activePageDef.defaultTitle,
      subtitle: subtitle.trim() || null,
      content: {
        leadNarrative: leadNarrative.trim(),
        description: leadNarrative.trim(),
        secondaryNarrative: secondaryNarrative.trim(),
        detailedOverview: secondaryNarrative.trim(),
        items,
        deliverables: items.map((i) => (i.desc ? `${i.title}: ${i.desc}` : i.title)),
      },
      is_published: isPublished,
      updated_at: new Date().toISOString(),
    };

    try {
      const { error } = await supabase
        .from('page_content')
        .upsert(payload, { onConflict: 'page_slug' });

      if (error) throw error;
      showToast(`${activePageDef.name} saved successfully & live!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to save page content', 'error');
    } finally {
      setSaving(false);
    }
  };

  const filteredDefs = activeGroup === 'All'
    ? PAGE_DEFINITIONS
    : PAGE_DEFINITIONS.filter((p) => p.group === activeGroup);

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#C7A46A] uppercase tracking-wider mb-1">
            <FileText size={14} />
            <span>UNIFIED CONTENT MANAGEMENT</span>
          </div>
          <h1 className="text-2xl font-serif text-white uppercase tracking-wide">
            Site Pages & Narratives CMS
          </h1>
          <p className="text-neutral-400 text-xs font-light">
            Manage headlines, manifestos, all 11 service cards, and section copy. Saves to Supabase and updates live without redeploying.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="px-6 py-2.5 rounded-xl bg-[#C7A46A] hover:bg-[#D4B678] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 self-start sm:self-auto transition-all shadow-lg shadow-[#C7A46A]/20 disabled:opacity-50"
        >
          <Save size={15} />
          <span>{saving ? 'Publishing...' : 'Save & Publish Live'}</span>
        </button>
      </div>

      {/* Category Group Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(['All', 'Core', 'Events', 'Campaigns', 'Podcast', 'Talent'] as const).map((group) => (
          <button
            key={group}
            onClick={() => setActiveGroup(group)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors ${
              activeGroup === group
                ? 'bg-[#C7A46A] text-black font-bold'
                : 'bg-[#141414] text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            {group === 'All' ? 'All (19)' : group}
          </button>
        ))}
      </div>

      {/* Page Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-neutral-850">
        {filteredDefs.map((def) => {
          const isActive = def.slug === selectedSlug;
          return (
            <button
              key={def.slug}
              onClick={() => setSelectedSlug(def.slug)}
              className={`px-4 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-[#C7A46A] text-black font-bold shadow-md shadow-[#C7A46A]/20'
                  : 'bg-[#121212] hover:bg-[#1a1a1a] text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              <span>{def.name}</span>
            </button>
          );
        })}
      </div>

      {/* Editor Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Primary Copy */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 rounded-3xl bg-[#0D0D0D] border border-neutral-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-850">
              <span className="text-xs font-mono text-[#C7A46A] uppercase tracking-wider">
                Target Route: {activePageDef.route}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPublished(!isPublished)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                    isPublished
                      ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-800/40'
                      : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                  }`}
                >
                  {isPublished ? <Eye size={12} /> : <EyeOff size={12} />}
                  <span>{isPublished ? 'Published' : 'Draft'}</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                Page Header Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#141414] border border-neutral-800 text-white text-xs font-mono focus:border-[#C7A46A] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                Section Subtitle / Tagline
              </label>
              <textarea
                rows={2}
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#141414] border border-neutral-800 text-white text-xs font-mono focus:border-[#C7A46A] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                Primary Narrative / Overview
              </label>
              <textarea
                rows={3}
                value={leadNarrative}
                onChange={(e) => setLeadNarrative(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#141414] border border-neutral-800 text-white text-xs font-mono focus:border-[#C7A46A] focus:outline-none"
              />
            </div>

            {(selectedSlug === 'what-is-rfr' || selectedSlug.startsWith('service_')) && (
              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                  Detailed Operational Overview
                </label>
                <textarea
                  rows={3}
                  value={secondaryNarrative}
                  onChange={(e) => setSecondaryNarrative(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#141414] border border-neutral-800 text-white text-xs font-mono focus:border-[#C7A46A] focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Structured Items / Cards */}
          <div className="p-6 rounded-3xl bg-[#0D0D0D] border border-neutral-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-850">
              <span className="text-xs font-mono text-[#C7A46A] uppercase tracking-wider">
                Structured Content Blocks & Deliverables ({items.length})
              </span>
              <button
                type="button"
                onClick={addItem}
                className="text-xs font-mono text-[#C7A46A] hover:underline"
              >
                + Add Block
              </button>
            </div>

            <div className="space-y-4">
              {items.map((it, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#141414] border border-neutral-850 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase">
                      Block #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      className="text-[10px] font-mono text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>

                  <input
                    type="text"
                    value={it.title}
                    onChange={(e) => handleItemChange(idx, 'title', e.target.value)}
                    placeholder="Block Title / Deliverable"
                    className="w-full px-3 py-1.5 rounded-lg bg-[#1a1a1a] border border-neutral-800 text-white text-xs font-mono focus:border-[#C7A46A] focus:outline-none"
                  />

                  <textarea
                    rows={2}
                    value={it.desc}
                    onChange={(e) => handleItemChange(idx, 'desc', e.target.value)}
                    placeholder="Block Description / Specification"
                    className="w-full px-3 py-1.5 rounded-lg bg-[#1a1a1a] border border-neutral-800 text-white text-xs font-mono focus:border-[#C7A46A] focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Context & Guidance */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-[#0D0D0D] border border-neutral-800 space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#C7A46A]">
              Live Reflection Rules
            </h3>
            <ul className="text-xs font-mono text-neutral-400 space-y-3 list-disc list-inside">
              <li>
                <strong className="text-white">Zero Redeployment</strong>: Changes saved here are stored in Supabase <code className="text-[#C7A46A]">public.page_content</code>.
              </li>
              <li>
                <strong className="text-white">Instant Refresh</strong>: Visiting <span className="text-[#C7A46A]">{activePageDef.route}</span> immediately displays the updated content.
              </li>
              <li>
                <strong className="text-white">Graceful Fallback</strong>: If the table has not yet been seeded, the public page safely displays verified default copy.
              </li>
              <li>
                <strong className="text-white">Draft Mode</strong>: If toggled to Draft, public users see the default baseline while admins can preview updates.
              </li>
            </ul>

            <div className="pt-4 border-t border-neutral-850">
              <a
                href={activePageDef.route}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-[#161616] hover:bg-[#202020] border border-neutral-800 text-neutral-300 hover:text-white font-mono text-xs flex items-center justify-center gap-2 no-underline transition-colors"
              >
                <Globe size={13} className="text-[#C7A46A]" />
                <span>Open {activePageDef.route} in New Tab</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
