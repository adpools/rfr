import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PreloaderProps {
  onComplete?: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsFinished(true);
            if (onComplete) onComplete();
          }, 400);
          return 100;
        }
        const diff = Math.floor(Math.random() * 20) + 10;
        return Math.min(prev + diff, 100);
      });
    }, 120);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[99999] bg-[#000000] flex flex-col items-center justify-center p-6 select-none"
        >
          {/* Subtle Background Glow */}
          <div className="absolute w-96 h-96 rounded-full bg-[#C7A46A]/5 blur-3xl pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-center relative z-10 flex flex-col items-center justify-center"
          >
            <img
              src="/images/final bro.png"
              alt="RFR by Riyas — Official Site Logo"
              className="w-64 sm:w-80 md:w-[460px] max-w-[88vw] h-auto object-contain select-none"
              draggable={false}
            />
          </motion.div>

          {/* Luxury Progress Bar */}
          <div className="w-48 md:w-64 h-[1px] bg-neutral-800 relative mt-12 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#C7A46A] via-[#C7A46A] to-[#FAF9F6]"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut', duration: 0.2 }}
            />
          </div>

          <div className="mt-4 font-mono text-[10px] tracking-widest text-[#C7A46A]/80">
            {progress}%
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
