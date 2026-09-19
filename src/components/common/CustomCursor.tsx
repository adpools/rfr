import React from 'react';
import { motion } from 'framer-motion';
import { useCursor } from '../../hooks/useCursor';

export const CustomCursor: React.FC = () => {
  const { x, y, isHovered, hoverText, isClicking, isVisible } = useCursor();

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Central Pin Point */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#C7A46A] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        animate={{
          x,
          y,
          scale: isClicking ? 0.6 : isHovered ? 0 : 1,
          opacity: isHovered ? 0 : 1,
        }}
        transition={{ type: 'spring', stiffness: 800, damping: 35 }}
      />

      {/* Outer Floating Ring / Expanded Label Capsule */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border border-[#C7A46A] -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center backdrop-blur-[2px]"
        animate={{
          x,
          y,
          width: hoverText ? 84 : isHovered ? 48 : 28,
          height: hoverText ? 36 : isHovered ? 48 : 28,
          backgroundColor: hoverText
            ? 'rgba(199, 164, 106, 0.95)'
            : isHovered
            ? 'rgba(199, 164, 106, 0.2)'
            : 'rgba(199, 164, 106, 0.05)',
          borderColor: hoverText ? '#FAF9F6' : '#C7A46A',
          scale: isClicking ? 0.9 : 1,
        }}
        transition={{ type: 'spring', stiffness: 450, damping: 28 }}
      >
        {hoverText && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-[9px] font-sans font-bold tracking-widest text-[#080808] uppercase select-none"
          >
            {hoverText}
          </motion.span>
        )}
      </motion.div>
    </div>
  );
};
