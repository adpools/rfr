import React from 'react';

export const FallbackBackdrop: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 bg-[#080808]">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#C7A46A]/10 via-[#9E7C49]/5 to-transparent blur-3xl" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] rounded-full bg-[#C7A46A]/5 blur-2xl" />
      <div className="absolute inset-0 bg-[radial-gradient(#C7A46A_1px,transparent_1px)] [background-size:32px_32px] opacity-10" />
    </div>
  );
};
