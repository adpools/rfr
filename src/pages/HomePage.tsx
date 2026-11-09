import React, { useState, useEffect } from 'react';
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
import { TestimonialsSection } from '../components/sections/TestimonialsSection';
import { TalentPortalsSection } from '../components/sections/TalentPortalsSection';
import { InfluencerNetworkSection } from '../components/sections/InfluencerNetworkSection';
import { GalleryPreviewSection } from '../components/sections/GalleryPreviewSection';
import { PressPreviewSection } from '../components/sections/PressPreviewSection';
import { ContactSection } from '../components/sections/ContactSection';
import { SectionProgressRail } from '../components/common/SectionProgressRail';
import { getSectionVisibility } from '../services/cmsService';

export const HomePage: React.FC = () => {
  const [visibility, setVisibility] = useState<Record<string, boolean>>({
    hero: true,
    statement: true,
    what_is_rfr: true,
    timeline: true,
    services: true,
    influencers: true,
    campaigns: true,
    talent: true,
    testimonials: true,
    press: true,
    clients: true,
    contact: true,
  });

  useEffect(() => {
    getSectionVisibility().then((v) => {
      if (v) setVisibility(v);
    });
  }, []);

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
      {visibility.hero !== false && <HeroSection />}

      {/* 01 — TIMELINE (2020 TO 2026) */}
      {visibility.timeline !== false && <TimelinePreviewSection />}

      {/* 02 — ABOUT US (FOUNDER & ABOUT: ACHIEVEMENTS, GALLARY, WORKS) */}
      {visibility.what_is_rfr !== false && <AboutSection />}

      {/* 03 — WHAT IS RFR? (HOW?, WHEN?, WHAT?) */}
      {visibility.what_is_rfr !== false && <WhatIsRFRSection />}

      {/* 04 — ACHIEVEMENTS */}
      {visibility.statement !== false && <AchievementsSection />}

      {/* 05 — SERVICES (EVENTS, CAMPAIGNS, PODCAST) */}
      {visibility.services !== false && <ServicesSection />}

      {/* 06 — DO BUSINESS WITH US */}
      {visibility.services !== false && <BusinessCTASection />}

      {/* 07 — CHANNEL PARTNERS */}
      {visibility.clients !== false && <PartnersSection />}

      {/* 08 — MILESTONES */}
      {visibility.clients !== false && <MilestonesSection />}

      {/* 09 — CLIENTS */}
      {visibility.clients !== false && <ClientsSection />}

      {/* TESTIMONIALS */}
      {visibility.testimonials !== false && <TestimonialsSection />}

      {/* 10 — ASSETS (CAREER, MODELS, INFLUENCERS, ARTIST) */}
      {visibility.talent !== false && <TalentPortalsSection />}

      {/* INFLUENCER NETWORK */}
      {visibility.influencers !== false && <InfluencerNetworkSection />}

      {/* 11 — GALLARY (EVENTS, SHOWS, SHOOTS) */}
      {visibility.campaigns !== false && <GalleryPreviewSection />}

      {/* 12 — PRESS & NEWS */}
      {visibility.press !== false && <PressPreviewSection />}

      {/* 13 — CONTACT */}
      {visibility.contact !== false && <ContactSection />}
    </PageWrapper>
  );
};
