import React from 'react';

interface OrnamentalDividerProps {
  className?: string;
  variant?: 'gold' | 'maroon' | 'subtle';
}

export const OrnamentalDivider: React.FC<OrnamentalDividerProps> = ({
  className = '',
  variant = 'gold',
}) => {
  const strokeColor = variant === 'maroon' ? '#501518' : '#C59B4B';
  const diamondFill = variant === 'maroon' ? '#501518' : '#6B1D23';
  const centerDot = '#D4AF37';

  return (
    <div className={`flex items-center justify-center py-2 select-none ${className}`} aria-hidden="true">
      <svg
        className="w-48 sm:w-64 h-5 text-current"
        viewBox="0 0 240 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Left flourish wing */}
        <path
          d="M10 12 C35 12, 50 6, 75 12 C88 15, 96 12, 105 12"
          stroke={strokeColor}
          strokeWidth="1.25"
          strokeLinecap="round"
        />
        <circle cx="22" cy="12" r="1.5" fill={strokeColor} />
        <circle cx="55" cy="8.5" r="1.2" fill={strokeColor} />
        <circle cx="85" cy="13.5" r="1" fill={strokeColor} />

        {/* Center ornamental diamond motif */}
        <polygon
          points="120,4 127,12 120,20 113,12"
          fill={diamondFill}
          stroke={strokeColor}
          strokeWidth="1.2"
        />
        <circle cx="120" cy="12" r="2.2" fill={centerDot} />

        {/* Right flourish wing */}
        <path
          d="M230 12 C205 12, 190 6, 165 12 C152 15, 144 12, 135 12"
          stroke={strokeColor}
          strokeWidth="1.25"
          strokeLinecap="round"
        />
        <circle cx="218" cy="12" r="1.5" fill={strokeColor} />
        <circle cx="185" cy="8.5" r="1.2" fill={strokeColor} />
        <circle cx="155" cy="13.5" r="1" fill={strokeColor} />
      </svg>
    </div>
  );
};
