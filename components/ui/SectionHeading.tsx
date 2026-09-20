import React from 'react';
import { OrnamentalDivider } from './OrnamentalDivider';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  subtitle,
  className = '',
}) => {
  return (
    <div className={`text-center mb-8 sm:mb-12 ${className}`}>
      <OrnamentalDivider />
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#501518] tracking-wide mt-1 font-serif-gu">
        {title}
      </h2>
      {subtitle && (
        <p className="text-[#614D43] text-sm sm:text-base max-w-2xl mx-auto mt-2 font-normal leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};
