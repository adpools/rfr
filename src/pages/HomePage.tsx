import React from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { HeroSection } from '../components/sections/HeroSection';
import { StatementSection } from '../components/sections/StatementSection';
import { WhatIsRFRSection } from '../components/sections/WhatIsRFRSection';
import { TimelinePreviewSection } from '../components/sections/TimelinePreviewSection';
import { FounderSection } from '../components/sections/FounderSection';
import { AboutSection } from '../components/sections/AboutSection';
import { ServicesSection } from '../components/sections/ServicesSection';
import { CampaignsSection } from '../components/sections/CampaignsSection';
import { PodcastSection } from '../components/sections/PodcastSection';
import { EcosystemSection } from '../components/sections/EcosystemSection';
import { TalentPortalsSection } from '../components/sections/TalentPortalsSection';
import { GalleryPreviewSection } from '../components/sections/GalleryPreviewSection';
import { PressPreviewSection } from '../components/sections/PressPreviewSection';
import { PartnersClientsSection } from '../components/sections/PartnersClientsSection';
import { BusinessCTASection } from '../components/sections/BusinessCTASection';
import { ContactSection } from '../components/sections/ContactSection';
import { SectionProgressRail } from '../components/common/SectionProgressRail';

export const HomePage: React.FC = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "RFR BY RIYAS — Riyas Fashion Runway",
    "founder": {
      "@type": "Person",
      "name": "Riyas"
    },
    "url": "https://rfrbyriyas.com",
    "description": "An international luxury fashion, lifestyle and creative ecosystem platform.",
    "keywords": "Fashion, Runway, Events, Influencer Campaigns, UGC, Commercial Advertising, Podcast"
  };

  return (
    <PageWrapper
      title="Creative Ecosystem & Fashion Runway"
      description="RFR BY RIYAS — A creative ecosystem built around fashion, people & possibility. Explore runway shows, brand campaigns, talent networks, and cultural media."
      schema={schema}
    >
      {/* Desktop Vertical Chapter Progress Rail */}
      <SectionProgressRail />

      {/* 01 — HERO */}
      <HeroSection />

      {/* 02 — THE RFR STATEMENT */}
      <StatementSection />

      {/* 03 — WHAT IS RFR? */}
      <WhatIsRFRSection />

      {/* 04 — THE JOURNEY / TIMELINE */}
      <TimelinePreviewSection />

      {/* 05 — THE FOUNDER */}
      <FounderSection />

      {/* 06 — WHAT WE DO / PHILOSOPHY */}
      <AboutSection />

      {/* 07 — SERVICES (EVENTS) */}
      <ServicesSection />

      {/* 08 — CAMPAIGNS & ADVERTISING */}
      <CampaignsSection />

      {/* 09 — PODCAST STUDIO */}
      <PodcastSection />

      {/* 10 — CREATIVE ECOSYSTEM GRAPH */}
      <EcosystemSection />

      {/* 11 — THE RFR NETWORK / ASSETS */}
      <TalentPortalsSection />

      {/* 12 — CURATED ARCHIVE */}
      <GalleryPreviewSection />

      {/* 13 — PRESS & NEWS */}
      <PressPreviewSection />

      {/* 14 — CLIENTS & CHANNEL PARTNERS */}
      <PartnersClientsSection />

      {/* 15 — DO BUSINESS WITH US */}
      <BusinessCTASection />

      {/* 16 — CONTACT VIP FORM */}
      <ContactSection />
    </PageWrapper>
  );
};
