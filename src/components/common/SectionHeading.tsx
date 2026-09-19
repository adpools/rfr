import React from 'react';
import { motion } from 'framer-motion';

interface SectionHeadingProps {
  number?: string;
  category?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  theme?: 'dark' | 'light';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  number,
  category,
  title,
  subtitle,
  align = 'left',
  theme = 'dark',
  className = '',
}) => {
  const isLight = theme === 'light';

  return (
    <div
      className={`mb-12 md:mb-16 ${
        align === 'center'
          ? 'text-center mx-auto max-w-3xl'
          : align === 'right'
          ? 'text-right ml-auto max-w-3xl'
          : 'text-left max-w-3xl'
      } ${className}`}
    >
      {/* Category Tag & Number */}
      {(number || category) && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-4 text-xs font-sans tracking-[0.25em] uppercase font-medium"
          style={{ justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start' }}
        >
          {number && (
            <span className="font-mono text-[#C7A46A]">{number}</span>
          )}
          {number && category && (
            <span className="w-4 h-[1px] bg-[#C7A46A]/50 inline-block" />
          )}
          {category && (
            <span className={isLight ? 'text-[#9E7C49]' : 'text-[#C7A46A]'}>
              {category}
            </span>
          )}
        </motion.div>
      )}

      {/* Main Headline */}
      <motion.h2
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-light tracking-tight leading-[1.05] uppercase ${
          isLight ? 'text-[#0A0A0A]' : 'text-[#FAF9F6]'
        }`}
      >
        {title}
      </motion.h2>

      {/* Supporting Subtitle */}
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={`mt-5 text-sm md:text-base font-sans font-light leading-relaxed ${
            isLight ? 'text-neutral-600' : 'text-neutral-400'
          }`}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
};
