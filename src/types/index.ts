export interface TimelineEventItem {
  id: string;
  name: string;
  type: 'Event' | 'Campaign' | 'Ad' | 'Shoot' | 'Music Album' | 'Show' | 'Podcast';
  categoryBadge?: string;
  locationOrClient?: string;
  description?: string;
  image?: string;
  videoUrl?: string; // direct MP4 or video source
  videoEmbedUrl?: string; // YouTube / Vimeo / Drive embed
  hasVideo?: boolean;
  driveFolderUrl?: string;
}

export interface TimelineYear {
  year: number;
  title: string;
  theme: string;
  subtitle: string;
  description: string;
  milestones: string[];
  eventsList: TimelineEventItem[];
  image: string;
  accent: string;
  videoUrl?: string;
  driveFolderUrl?: string;
}

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  category: 'events' | 'campaigns' | 'podcast';
  subheading: string;
  description: string;
  detailedOverview: string;
  keyHighlights: string[];
  deliverables: string[];
  targetAudience: string;
  image: string;
  accentImage?: string;
  badge: string;
  videoEmbedUrl?: string;
  driveFolderUrl?: string;
}

export interface TalentCategory {
  id: 'careers' | 'models' | 'influencers' | 'artists';
  title: string;
  tagline: string;
  description: string;
  opportunities: string[];
  requirements: string[];
  ctaLabel: string;
  image: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'events' | 'shows' | 'shoots';
  caption: string;
  year: number;
  credits?: string;
  image: string;
  dimensions?: 'portrait' | 'landscape' | 'square';
  tags: string[];
  videoEmbedUrl?: string;
  driveViewUrl?: string;
  hasVideo?: boolean;
}

export interface PressArticle {
  id: string;
  slug: string;
  title: string;
  category: 'Press' | 'News' | 'Announcements' | 'Collaborations' | 'Achievements';
  date: string;
  author: string;
  readTime: string;
  coverImage: string;
  excerpt: string;
  content: string[];
  quote?: {
    text: string;
    author: string;
  };
  tags: string[];
}

export interface EcosystemNode {
  id: string;
  label: string;
  category: string;
  description: string;
  x: number;
  y: number;
  z: number;
  connections: string[];
  color: string;
}

export interface ClientPartner {
  id: string;
  name: string;
  category: string;
  description?: string;
  type: 'client' | 'partner';
  website?: string;
}
