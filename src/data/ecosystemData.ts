import { EcosystemNode } from '../types';

export const ecosystemNodes: EcosystemNode[] = [
  {
    id: 'rfr-core',
    label: 'RFR CORE',
    category: 'Nucleus',
    description: 'The central creative engine orchestrating fashion runways, experiential properties, and multi-format brand campaigns.',
    x: 0,
    y: 0,
    z: 0,
    connections: ['brands', 'models', 'influencers', 'artists', 'creators', 'media', 'venues', 'agencies', 'audiences'],
    color: '#C7A46A'
  },
  {
    id: 'brands',
    label: 'BRANDS & LABELS',
    category: 'Commercial',
    description: 'Luxury fashion houses, D2C retail labels, lifestyle conglomerates, automotive, and hospitality partners.',
    x: -2.8,
    y: 1.8,
    z: -0.5,
    connections: ['rfr-core', 'creators', 'influencers', 'agencies'],
    color: '#F4F1EA'
  },
  {
    id: 'models',
    label: 'MODELS GUILD',
    category: 'Talent',
    description: 'Couture runway models, commercial talent, editorial muses, and aspiring fashion faces.',
    x: -3.2,
    y: -1.2,
    z: 0.8,
    connections: ['rfr-core', 'brands', 'media'],
    color: '#9E7C49'
  },
  {
    id: 'influencers',
    label: 'INFLUENCERS',
    category: 'Talent',
    description: 'High-engagement digital creators, lifestyle tastemakers, and social storytellers.',
    x: -1.4,
    y: -2.8,
    z: -0.8,
    connections: ['rfr-core', 'brands', 'creators', 'audiences'],
    color: '#C7A46A'
  },
  {
    id: 'artists',
    label: 'ARTISTS & DJS',
    category: 'Performers',
    description: 'Musicians, live performers, electronic music producers, choreographers, and visual artists.',
    x: 1.5,
    y: -2.7,
    z: 0.6,
    connections: ['rfr-core', 'venues', 'audiences'],
    color: '#F4F1EA'
  },
  {
    id: 'creators',
    label: 'UGC CREATORS',
    category: 'Production',
    description: 'Specialized vertical video creators, photographers, editors, and aesthetic copywriters.',
    x: 3.2,
    y: -1.0,
    z: -0.7,
    connections: ['rfr-core', 'brands', 'media'],
    color: '#9E7C49'
  },
  {
    id: 'media',
    label: 'MEDIA HOUSES',
    category: 'Amplification',
    description: 'Fashion publications, digital magazines, broadcast networks, and international press portals.',
    x: 2.9,
    y: 1.6,
    z: 0.4,
    connections: ['rfr-core', 'brands', 'audiences'],
    color: '#C7A46A'
  },
  {
    id: 'venues',
    label: 'PREMIER VENUES',
    category: 'Infrastructure',
    description: 'Luxury hotel ballrooms, open-air amphitheaters, heritage spaces, and high-fashion studio spaces.',
    x: 1.2,
    y: 2.8,
    z: -0.6,
    connections: ['rfr-core', 'artists', 'brands'],
    color: '#F4F1EA'
  },
  {
    id: 'agencies',
    label: 'PARTNER AGENCIES',
    category: 'Strategic',
    description: 'Advertising agencies, media buying firms, casting houses, and PR collectives.',
    x: -1.2,
    y: 2.8,
    z: 0.7,
    connections: ['rfr-core', 'brands', 'media'],
    color: '#9E7C49'
  },
  {
    id: 'audiences',
    label: 'AUDIENCES',
    category: 'Community',
    description: 'Tastemakers, consumers, fashion patrons, and experiential enthusiasts who give life to every creation.',
    x: 0,
    y: -3.5,
    z: 1.2,
    connections: ['rfr-core', 'brands', 'influencers', 'artists'],
    color: '#FAF9F6'
  }
];
