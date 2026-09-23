import React from 'react';

export const NamasteIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 46,
  className = '',
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    width={size}
    height={size}
    fill="none"
    className={`drop-shadow ${className}`}
    aria-label="Namaste 🙏"
  >
    {/* Forearms */}
    <path
      d="M16 84 L26 73 L39 81 L30 90 Z"
      fill="#D4AF37"
      fillOpacity="0.2"
      stroke="#D4AF37"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M84 84 L74 73 L61 81 L70 90 Z"
      fill="#D4AF37"
      fillOpacity="0.2"
      stroke="#D4AF37"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Hands (Palms & Fingers pressed together in Namaste) */}
    <path
      d="M50 14
         C48.5 14.5, 47 16, 46 18
         L34 42
         L37 58
         L43 65
         L50 71
         L57 65
         L63 58
         L66 42
         L54 18
         C53 16, 51.5 14.5, 50 14 Z"
      fill="#D4AF37"
      fillOpacity="0.25"
      stroke="#D4AF37"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Center Palm-to-Palm Joining Line */}
    <line
      x1="50"
      y1="14"
      x2="50"
      y2="71"
      stroke="#D4AF37"
      strokeWidth="3.5"
      strokeLinecap="round"
    />

    {/* Thumbs Arch nestled in the center */}
    <path
      d="M43 54 L43 43 C43 38.5, 47 38.5, 50 38.5 C53 38.5, 57 38.5, 57 43 L57 54"
      stroke="#D4AF37"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="#D4AF37"
      fillOpacity="0.18"
    />

    {/* Left Wrist Bangles (Golden Kangan) */}
    <rect
      x="23"
      y="66.75"
      width="20"
      height="6.5"
      rx="3.25"
      transform="rotate(38 33 70)"
      fill="#D4AF37"
      fillOpacity="0.8"
      stroke="#D4AF37"
      strokeWidth="3.2"
      strokeLinejoin="round"
    />
    <rect
      x="28"
      y="58.75"
      width="20"
      height="6.5"
      rx="3.25"
      transform="rotate(38 38 62)"
      fill="#D4AF37"
      fillOpacity="0.8"
      stroke="#D4AF37"
      strokeWidth="3.2"
      strokeLinejoin="round"
    />

    {/* Right Wrist Bangles (Golden Kangan) */}
    <rect
      x="57"
      y="66.75"
      width="20"
      height="6.5"
      rx="3.25"
      transform="rotate(-38 67 70)"
      fill="#D4AF37"
      fillOpacity="0.8"
      stroke="#D4AF37"
      strokeWidth="3.2"
      strokeLinejoin="round"
    />
    <rect
      x="52"
      y="58.75"
      width="20"
      height="6.5"
      rx="3.25"
      transform="rotate(-38 62 62)"
      fill="#D4AF37"
      fillOpacity="0.8"
      stroke="#D4AF37"
      strokeWidth="3.2"
      strokeLinejoin="round"
    />
  </svg>
);

interface MedallionIconProps {
  type?: 'flute' | 'lotus' | 'peacock' | 'namaste' | string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const MedallionIcon: React.FC<MedallionIconProps> = ({
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16 sm:w-20 sm:h-20',
    lg: 'w-24 h-24',
  };

  const iconSizes = {
    sm: 30,
    md: 48,
    lg: 64,
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full bg-[#501518] shadow-md border-2 border-[#C59B4B]/80 p-2 select-none shrink-0 transition-transform duration-300 hover:scale-105 ${sizeClasses[size]} ${className}`}
    >
      {/* Inner decorative dotted ring */}
      <div className="absolute inset-1 rounded-full border border-dashed border-[#D4AF37]/50 pointer-events-none" />
      <div className="relative z-10 flex items-center justify-center">
        <NamasteIcon size={iconSizes[size]} />
      </div>
    </div>
  );
};
