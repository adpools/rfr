import { ClientPartner } from '../types';

export const clientCategories = [
  'Fashion & Couture',
  'Lifestyle & Apparel',
  'Hospitality & Luxury Venues',
  'Retail & E-Commerce',
  'Automotive & Premium Mobility',
  'Wellness & Beauty',
  'Media & Entertainment'
];

export const partnerSectors = [
  'Media Houses & Press Portals',
  'Digital Streaming Platforms',
  'Premium Luxury Venues & Spaces',
  'Creative Agencies & Consultancies',
  'Production & Cinematography Teams',
  'Talent & Artist Representation Guilds',
  'Strategic Brand Sponsorship Alliances'
];

export const clientsAndPartnersList: ClientPartner[] = [
  { id: 'c1', name: 'Couture House Atelier', category: 'Fashion & Couture', type: 'client' },
  { id: 'c2', name: 'Urban Apparel Collective', category: 'Lifestyle & Apparel', type: 'client' },
  { id: 'c3', name: 'Grand Horizon Hospitality', category: 'Hospitality & Luxury Venues', type: 'client' },
  { id: 'c4', name: 'Aura Fine Jewels', category: 'Retail & E-Commerce', type: 'client' },
  { id: 'c5', name: 'Velocita Motors', category: 'Automotive & Premium Mobility', type: 'client' },
  { id: 'c6', name: 'Botanica Luxe Beauty', category: 'Wellness & Beauty', type: 'client' },
  
  { id: 'p1', name: 'Prime Media Network', category: 'Media Houses & Press Portals', type: 'partner' },
  { id: 'p2', name: 'Aura Stage & Lighting', category: 'Production & Cinematography Teams', type: 'partner' },
  { id: 'p3', name: 'Metropolis Arena & Venues', category: 'Premium Luxury Venues & Spaces', type: 'partner' },
  { id: 'p4', name: 'Vanguard Creative Group', category: 'Creative Agencies & Consultancies', type: 'partner' },
  { id: 'p5', name: 'Studio One Sound & Acoustic', category: 'Production & Cinematography Teams', type: 'partner' },
  { id: 'p6', name: 'Global Talent Guild', category: 'Talent & Artist Representation Guilds', type: 'partner' }
];
