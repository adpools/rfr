import React from 'react';
import { NetworkGraph3D } from '../3d/NetworkGraph3D';

export const EcosystemSection: React.FC = () => {
  return (
    <section
      id="chapter-10"
      className="full-viewport-scene bg-[#080808] border-b border-neutral-900 flex flex-col justify-between relative overflow-hidden"
    >
      <div className="editorial-container relative z-10 my-auto py-10 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 pb-4 border-b border-neutral-800/80">
          <div>
            <div className="flex items-center gap-3 text-xs font-mono tracking-[0.35em] text-[#C7A46A] uppercase mb-2">
              <span>10</span>
              <span className="w-8 h-[1px] bg-[#C7A46A]" />
              <span>THE INTERCONNECTED MATRIX</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif text-white uppercase tracking-tight">
              CREATIVE ECOSYSTEM
            </h2>
          </div>
          <p className="text-xs font-mono text-neutral-400 uppercase tracking-widest mt-2 md:mt-0">
            NUCLEUS ARCHITECTURE • 10 SYMBIOTIC HUBS
          </p>
        </div>

        {/* Full-Viewport 3D Network Graph Canvas */}
        <div className="w-full">
          <NetworkGraph3D />
        </div>
      </div>

      {/* Level 05: Directional Cue */}
      <div className="scene-directional-cue">
        <span>10 / 17 • SCROLL TO NETWORK ↓</span>
      </div>
    </section>
  );
};
