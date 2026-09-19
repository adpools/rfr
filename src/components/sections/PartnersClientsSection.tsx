import React from 'react';
import { clientCategories, partnerSectors } from '../../data/partnersClientsData';
import { Building2, ShieldCheck } from 'lucide-react';

export const PartnersClientsSection: React.FC = () => {
  return (
    <section
      id="chapter-14"
      className="full-viewport-scene bg-[#080808] border-b border-neutral-900 flex flex-col justify-between relative overflow-hidden"
    >
      <div className="editorial-container relative z-10 my-auto py-10 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-neutral-800/80">
          <div>
            <div className="flex items-center gap-3 text-xs font-mono tracking-[0.35em] text-[#C7A46A] uppercase mb-2">
              <span>14</span>
              <span className="w-8 h-[1px] bg-[#C7A46A]" />
              <span>COLLABORATIVE ECOSYSTEM</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif text-white uppercase tracking-tight">
              CLIENTS & CHANNEL PARTNERS
            </h2>
          </div>
          <p className="text-xs font-mono text-neutral-400 uppercase tracking-widest mt-2 md:mt-0">
            ENTERPRISE VERTICALS & STRATEGIC ALLIANCES
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Client Sectors */}
          <div className="p-8 rounded-3xl bg-[#111111] border border-neutral-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-neutral-800">
                <Building2 size={18} className="text-[#C7A46A]" />
                <h3 className="text-lg font-serif text-white uppercase tracking-wider">
                  CLIENT VERTICALS
                </h3>
              </div>
              <p className="text-neutral-400 text-xs font-light leading-relaxed mb-6">
                Bespoke campaign and experiential runway productions across luxury and consumer verticals:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {clientCategories.slice(0, 6).map((cat) => (
                  <div
                    key={cat}
                    className="p-3 rounded-xl bg-[#161616] border border-neutral-800 text-xs font-sans text-neutral-300 hover:border-[#C7A46A]/40 hover:text-white transition-colors"
                  >
                    {cat}
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-4 mt-6 border-t border-neutral-850 text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
              CONFIDENTIAL & VERIFIED PORTFOLIOS
            </div>
          </div>

          {/* Channel Partner Sectors */}
          <div className="p-8 rounded-3xl bg-[#111111] border border-neutral-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-neutral-800">
                <ShieldCheck size={18} className="text-[#C7A46A]" />
                <h3 className="text-lg font-serif text-white uppercase tracking-wider">
                  PARTNER ALLIANCES
                </h3>
              </div>
              <p className="text-neutral-400 text-xs font-light leading-relaxed mb-6">
                Symbiotic infrastructure alliances spanning technical cinematography, luxury spaces, and media:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {partnerSectors.slice(0, 6).map((partner) => (
                  <div
                    key={partner}
                    className="p-3 rounded-xl bg-[#161616] border border-neutral-800 text-xs font-sans text-neutral-300 hover:border-[#C7A46A]/40 hover:text-white transition-colors"
                  >
                    {partner}
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-4 mt-6 border-t border-neutral-850 text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
              STRATEGIC INDUSTRY ALLIANCES
            </div>
          </div>
        </div>
      </div>

      {/* Level 05: Directional Cue */}
      <div className="scene-directional-cue">
        <span>14 / 17 • SCROLL TO DO BUSINESS ↓</span>
      </div>
    </section>
  );
};
