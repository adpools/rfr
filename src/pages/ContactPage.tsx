import React from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { ContactSection } from '../components/sections/ContactSection';

export const ContactPage: React.FC = () => {
  return (
    <PageWrapper
      title="Contact & Executive Inquiries"
      description="Connect directly with Riyas Fashion Runway for collaborations, sponsorships, talent bookings, and event commissions."
    >
      <div className="editorial-container py-6">
        <ContactSection />
      </div>
    </PageWrapper>
  );
};
