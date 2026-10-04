import React from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { HeroSection } from '../components/sections/HeroSection';
import { TimelinePreviewSection } from '../components/sections/TimelinePreviewSection';
import { AboutSection } from '../components/sections/AboutSection';
import { WhatIsRFRSection } from '../components/sections/WhatIsRFRSection';
import { AchievementsSection } from '../components/sections/AchievementsSection';
import { ServicesSection } from '../components/sections/ServicesSection';
import { BusinessCTASection } from '../components/sections/BusinessCTASection';
import { PartnersSection } from '../components/sections/PartnersSection';
import { MilestonesSection } from '../components/sections/MilestonesSection';
import { ClientsSection } from '../components/sections/ClientsSection';
import { TalentPortalsSection } from '../components/sections/TalentPortalsSection';
import { GalleryPreviewSection } from '../components/sections/GalleryPreviewSection';
import { PressPreviewSection } from '../components/sections/PressPreviewSection';
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
      title="RFR By Riyas — Creative Ecosystem & Fashion Runway"
      description="RFR BY RIYAS — A premier creative ecosystem built around fashion, people & possibility. 13 chapters across timeline, founder vision, achievements, services, business, partners, milestones, clients, talent assets, gallery, press, and contact."
      schema={schema}
    >
      {/* Desktop Vertical 13-Chapter Progress Rail */}
      <SectionProgressRail />

      {/* 00 — HERO / BRAND MONOGRAM */}
      <HeroSection />

      {/* 01 — TIMELINE (2020 TO 2026) */}
      <TimelinePreviewSection />

      {/* 02 — ABOUT US (FOUNDER & ABOUT: ACHIEVEMENTS, GALLARY, WORKS) */}
      <AboutSection />

      {/* 03 — WHAT IS RFR? (HOW?, WHEN?, WHAT?) */}
      <WhatIsRFRSection />

      {/* 04 — ACHIEVEMENTS */}
      <AchievementsSection />

      {/* 05 — SERVICES (EVENTS, CAMPAIGNS, PODCAST) */}
      <ServicesSection />

      {/* 06 — DO BUSINESS WITH US */}
      <BusinessCTASection />

      {/* 07 — CHANNEL PARTNERS */}
      <PartnersSection />

      {/* 08 — MILESTONES */}
      <MilestonesSection />

      {/* 09 — CLIENTS */}
      <ClientsSection />

      {/* 10 — ASSETS (CAREER, MODELS, INFLUENCERS, ARTIST) */}
      <TalentPortalsSection />

      {/* 11 — GALLARY (EVENTS, SHOWS, SHOOTS) */}
      <GalleryPreviewSection />

      {/* 12 — PRESS & NEWS */}
      <PressPreviewSection />

      {/* 13 — CONTACT */}
      <ContactSection />
    </PageWrapper>
  );
};
