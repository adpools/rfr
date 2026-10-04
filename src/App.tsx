import React, { useState } from 'react';
import { Switch, Route, Redirect } from 'wouter';
import { HelmetProvider } from 'react-helmet-async';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CustomCursor } from './components/common/CustomCursor';
import { Preloader } from './components/common/Preloader';
import { AudioAmbienceToggle } from './components/common/AudioAmbienceToggle';
import { useSmoothScroll } from './hooks/useSmoothScroll';

// Multi-Route Pages
import { HomePage } from './pages/HomePage';
import { TimelinePage } from './pages/TimelinePage';
import { AboutPage } from './pages/AboutPage';
import { FounderPage } from './pages/FounderPage';
import { WhatIsRFRPage } from './pages/WhatIsRFRPage';
import { AchievementsPage } from './pages/AchievementsPage';
import { ServicesPage } from './pages/ServicesPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { PodcastPage } from './pages/PodcastPage';
import { BusinessPage } from './pages/BusinessPage';
import { PartnersPage } from './pages/PartnersPage';
import { MilestonesPage } from './pages/MilestonesPage';
import { ClientsPage } from './pages/ClientsPage';
import { AssetsNetworkPage } from './pages/AssetsNetworkPage';
import { TalentDetailPage } from './pages/TalentDetailPage';
import { GalleryPage } from './pages/GalleryPage';
import { PressPage } from './pages/PressPage';
import { PressDetailPage } from './pages/PressDetailPage';
import { ContactPage } from './pages/ContactPage';

export const App: React.FC = () => {
  const [, setLoaded] = useState(false);
  useSmoothScroll();

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-[#080808] text-[#FAF9F6] relative selection:bg-[#C7A46A] selection:text-black">
        {/* Cinematic Preloader */}
        <Preloader onComplete={() => setLoaded(true)} />

        {/* Custom Luxury Trailing Cursor */}
        <CustomCursor />

        {/* Global Film Grain Texture */}
        <div className="film-grain" />

        {/* Sticky Luxury Navbar */}
        <Navbar />

        {/* Sound Ambience Synthesizer Toggle */}
        <AudioAmbienceToggle />

        {/* Application View Switcher in 13-Order Structure */}
        <Switch>
          {/* 00. Home */}
          <Route path="/" component={HomePage} />

          {/* 01. Timeline (2020-2026) */}
          <Route path="/timeline" component={TimelinePage} />

          {/* 02. About Us */}
          <Route path="/about" component={AboutPage} />
          <Route path="/founder" component={FounderPage} />

          {/* 03. What is RFR? */}
          <Route path="/what-is-rfr" component={WhatIsRFRPage} />

          {/* 04. Achievements */}
          <Route path="/achievements" component={AchievementsPage} />
          
          {/* 05. Services & Categories */}
          <Route path="/services" component={ServicesPage} />
          <Route path="/services/events" component={ServicesPage} />
          <Route path="/services/events/flee-markets">
            <Redirect to="/services/events/flea-markets" />
          </Route>
          <Route path="/services/events/:slug" component={() => <ServiceDetailPage />} />
          <Route path="/services/campaigns" component={ServicesPage} />
          <Route path="/services/campaigns/:slug" component={() => <ServiceDetailPage />} />
          <Route path="/services/podcast" component={PodcastPage} />

          {/* 06. Do Business with us */}
          <Route path="/business" component={BusinessPage} />

          {/* 07. Channel Partners */}
          <Route path="/partners" component={PartnersPage} />

          {/* 08. Milestones */}
          <Route path="/milestones" component={MilestonesPage} />

          {/* 09. Clients */}
          <Route path="/clients" component={ClientsPage} />

          {/* 10. Assets & Talent Guilds */}
          <Route path="/assets" component={AssetsNetworkPage} />
          <Route path="/assets/career" component={() => <TalentDetailPage customId="careers" />} />
          <Route path="/assets/careers" component={() => <TalentDetailPage customId="careers" />} />
          <Route path="/assets/models" component={() => <TalentDetailPage customId="models" />} />
          <Route path="/assets/influencer" component={() => <TalentDetailPage customId="influencers" />} />
          <Route path="/assets/influencers" component={() => <TalentDetailPage customId="influencers" />} />
          <Route path="/assets/artist" component={() => <TalentDetailPage customId="artists" />} />
          <Route path="/assets/artists" component={() => <TalentDetailPage customId="artists" />} />
          <Route path="/assets/:id" component={() => <TalentDetailPage />} />

          {/* 11. Gallary & Gallery Archives */}
          <Route path="/gallery" component={() => <GalleryPage />} />
          <Route path="/gallary" component={() => <GalleryPage />} />
          <Route path="/gallery/events" component={() => <GalleryPage initialCategory="events" />} />
          <Route path="/gallary/events" component={() => <GalleryPage initialCategory="events" />} />
          <Route path="/gallery/shows" component={() => <GalleryPage initialCategory="shows" />} />
          <Route path="/gallary/shows" component={() => <GalleryPage initialCategory="shows" />} />
          <Route path="/gallery/shoots" component={() => <GalleryPage initialCategory="shoots" />} />
          <Route path="/gallary/shoots" component={() => <GalleryPage initialCategory="shoots" />} />

          {/* 12. Press & News */}
          <Route path="/press" component={PressPage} />
          <Route path="/press/:slug" component={PressDetailPage} />

          {/* 13. Contact */}
          <Route path="/contact" component={ContactPage} />

          {/* Fallback */}
          <Route>
            <Redirect to="/" />
          </Route>
        </Switch>

        {/* Oversized Architectural Luxury Footer */}
        <Footer />
      </div>
    </HelmetProvider>
  );
};
