import React from 'react';
import Image from 'next/image';

interface MedallionIconProps {
  type: 'flute' | 'lotus' | 'peacock';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const MedallionIcon: React.FC<MedallionIconProps> = ({
  type,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16 sm:w-20 sm:h-20',
    lg: 'w-24 h-24',
  };

  const iconSizes = {
    sm: 24,
    md: 36,
    lg: 48,
  };

  const iconPaths = {
    flute: '/images/defaults/prayer-flute.svg',
    lotus: '/images/defaults/prayer-lotus.svg',
    peacock: '/images/defaults/prayer-peacock.svg',
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full bg-[#501518] shadow-md border-2 border-[#C59B4B]/80 p-2 select-none flex-shrink-0 transition-transform duration-300 hover:scale-105 ${sizeClasses[size]} ${className}`}
    >
      {/* Inner decorative dotted ring */}
      <div className="absolute inset-1 rounded-full border border-dashed border-[#D4AF37]/50 pointer-events-none" />
      <div className="relative z-10 flex items-center justify-center">
        <Image
          src={iconPaths[type]}
          alt={type}
          width={iconSizes[size]}
          height={iconSizes[size]}
          className="w-auto h-auto drop-shadow"
        />
      </div>
    </div>
  );
};
