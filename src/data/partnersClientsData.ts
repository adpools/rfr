import { ClientPartner } from '../types';

export const clientCategories = [
  'Automotive & Mobility',
  'Fashion & Couture',
  'Retail & E-Commerce',
  'Creator Guilds & Media',
  'Hospitality & Luxury Venues',
  'Commercial Films & Ads'
];

export const partnerSectors = [
  'Media Houses & Press Portals',
  'Digital Streaming Platforms',
  'Premium Luxury Venues & Spaces',
  'Production & Cinematography Teams',
  'Talent & Artist Representation Guilds',
  'Strategic Brand Sponsorship Alliances'
];

export const clientsAndPartnersList: ClientPartner[] = [
  {
    id: 'c-skoda',
    name: 'ŠKODA AUTO INDIA',
    category: 'Automotive & Mobility',
    description: 'Headline automotive commercial films, Fans of Škoda owner rallies, and digital campaign productions.',
    type: 'client',
    logo: '/images/clients/skoda.png'
  },
  {
    id: 'c-citroen',
    name: 'CITROËN INDIA',
    category: 'Automotive & Mobility',
    description: 'Commercial video campaigns for Basalt, Aircross, and EV models featuring key regional influencers.',
    type: 'client',
    logo: '/images/clients/citroen.png'
  },
  {
    id: 'c-jeep',
    name: 'JEEP',
    category: 'Automotive & Mobility',
    description: 'Legendary SUV experiential brand partnerships and rugged lifestyle campaigns.',
    type: 'client',
    logo: '/images/clients/jeep.png'
  },
  {
    id: 'c-rb',
    name: 'R&B FASHION',
    category: 'Fashion & Couture',
    description: 'High-energy fashion runway launches, retail store inaugurations, and seasonal lookbook curations.',
    type: 'client',
    logo: '/images/clients/rb.png'
  },
  {
    id: 'c-tic',
    name: 'TRIVANDRUM INFLUENCERS CIRCLE',
    category: 'Creator Guilds & Media',
    description: 'The premier South Indian creator guild uniting 45+ top influencers for enterprise brand campaigns.',
    type: 'client',
    logo: '/images/clients/tic.png'
  },
  {
    id: 'c-max',
    name: 'MAX FASHION',
    category: 'Retail & E-Commerce',
    description: 'Multi-quarter festive campaign shoots, Onam & Diwali influencer promotions, and UDS runway showcases.',
    type: 'client',
    logo: '/images/clients/max.png'
  },
  {
    id: 'c-puma',
    name: 'PUMA',
    category: 'Fashion & Couture',
    description: 'Global sportswear brand experiential activations and marquee New Year celebrations.',
    type: 'client'
  },
  {
    id: 'c-manyavar',
    name: 'MANYAVAR',
    category: 'Fashion & Couture',
    description: 'High-fashion ethnic wear editorial productions and bridal couture showcases.',
    type: 'client'
  },
  {
    id: 'c-uds',
    name: 'UDS HOTELS & RESORTS',
    category: 'Hospitality & Luxury Venues',
    description: 'Five-star destination gala countdowns, seaside runway productions, and VIP hospitality.',
    type: 'client'
  },
  {
    id: 'c-lulu',
    name: 'LULU INTERNATIONAL MALL',
    category: 'Retail & E-Commerce',
    description: 'Global Fashion Week mainstage productions, multi-designer showcases, and mall-wide fashion activations.',
    type: 'client'
  },
  {
    id: 'c-ather',
    name: 'ATHER ENERGY',
    category: 'Automotive & Mobility',
    description: 'Sustainable EV mobility reels, urban commute storytelling, and holiday festive ad campaigns.',
    type: 'client'
  },
  {
    id: 'c-buildhub',
    name: 'BUILD HUB',
    category: 'Commercial Films & Ads',
    description: 'Architectural video commercials and interior lifestyle showcase campaigns.',
    type: 'client'
  },
  
  { id: 'p1', name: 'Manorama Music', category: 'Media Houses & Press Portals', type: 'partner' },
  { id: 'p2', name: 'Hycinth Hotels Trivandrum', category: 'Premium Luxury Venues & Spaces', type: 'partner' },
  { id: 'p3', name: 'The Fourth News', category: 'Media Houses & Press Portals', type: 'partner' },
  { id: 'p4', name: 'Chakita Haute Couture', category: 'Production & Cinematography Teams', type: 'partner' },
  { id: 'p5', name: 'Citi Kids Foundation', category: 'Talent & Artist Representation Guilds', type: 'partner' },
  { id: 'p6', name: 'Fitora Lifestyle', category: 'Strategic Brand Sponsorship Alliances', type: 'partner' }
];
