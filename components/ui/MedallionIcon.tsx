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
    aria-label="Namaste"
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

    {/* Left Wrist Bangles */}
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
    {/* Right Wrist Bangles */}
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
  </svg>
);

export const FluteIcon: React.FC<{ size?: number; className?: string }> = ({
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
    aria-label="Bansuri / Flute"
  >
    {/* Flute Body (Diagonal) */}
    <rect
      x="16"
      y="47"
      width="68"
      height="7"
      rx="3.5"
      transform="rotate(-32 50 50)"
      fill="#D4AF37"
      fillOpacity="0.3"
      stroke="#D4AF37"
      strokeWidth="3"
      strokeLinejoin="round"
    />
    {/* Flute Tone Holes */}
    <circle cx="42" cy="55" r="2" fill="#D4AF37" />
    <circle cx="50" cy="50" r="2" fill="#D4AF37" />
    <circle cx="58" cy="45" r="2" fill="#D4AF37" />
    <circle cx="66" cy="40" r="2" fill="#D4AF37" />

    {/* Decorative Hanging Peacock Feather Motif at Top-Left */}
    <path
      d="M22 67 C20 75, 14 80, 20 86 C26 82, 28 75, 25 69"
      fill="#D4AF37"
      fillOpacity="0.4"
      stroke="#D4AF37"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <circle cx="21" cy="78" r="3" fill="#D4AF37" fillOpacity="0.8" stroke="#D4AF37" strokeWidth="1.5" />

    {/* Hanging Sacred Tassels */}
    <path
      d="M74 34 Q82 40 84 50"
      stroke="#D4AF37"
      strokeWidth="2"
      strokeDasharray="2 2"
      fill="none"
    />
    <circle cx="84" cy="52" r="3" fill="#D4AF37" />
    <path d="M84 55 L84 62" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export const LotusIcon: React.FC<{ size?: number; className?: string }> = ({
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
    aria-label="Lotus"
  >
    {/* Central Petal */}
    <path
      d="M50 20 C42 38, 42 62, 50 72 C58 62, 58 38, 50 20 Z"
      fill="#D4AF37"
      fillOpacity="0.3"
      stroke="#D4AF37"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Inner Left Petal */}
    <path
      d="M50 72 C35 65, 24 45, 34 32 C40 45, 45 60, 50 72 Z"
      fill="#D4AF37"
      fillOpacity="0.25"
      stroke="#D4AF37"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Inner Right Petal */}
    <path
      d="M50 72 C65 65, 76 45, 66 32 C60 45, 55 60, 50 72 Z"
      fill="#D4AF37"
      fillOpacity="0.25"
      stroke="#D4AF37"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Outer Left Petal */}
    <path
      d="M45 74 C25 72, 12 58, 20 46 C28 56, 38 66, 45 74 Z"
      fill="#D4AF37"
      fillOpacity="0.2"
      stroke="#D4AF37"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Outer Right Petal */}
    <path
      d="M55 74 C75 72, 88 58, 80 46 C72 56, 62 66, 55 74 Z"
      fill="#D4AF37"
      fillOpacity="0.2"
      stroke="#D4AF37"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Lotus Base / Water Wave */}
    <path
      d="M26 80 Q50 86 74 80"
      stroke="#D4AF37"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

export const PeacockIcon: React.FC<{ size?: number; className?: string }> = ({
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
    aria-label="Peacock Feather"
  >
    {/* Central Quill Stem */}
    <path
      d="M50 88 Q48 55 50 16"
      stroke="#D4AF37"
      strokeWidth="3"
      strokeLinecap="round"
    />

    {/* Outer Feather Crown */}
    <path
      d="M50 16 C30 20, 20 40, 32 58 C40 70, 48 76, 50 84 C52 76, 60 70, 68 58 C80 40, 70 20, 50 16 Z"
      fill="#D4AF37"
      fillOpacity="0.2"
      stroke="#D4AF37"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Outer Eye */}
    <ellipse
      cx="50"
      cy="40"
      rx="14"
      ry="18"
      fill="#D4AF37"
      fillOpacity="0.25"
      stroke="#D4AF37"
      strokeWidth="2.5"
    />

    {/* Inner Sacred Center Eye */}
    <circle
      cx="50"
      cy="42"
      r="7"
      fill="#D4AF37"
      fillOpacity="0.8"
      stroke="#D4AF37"
      strokeWidth="2"
    />

    {/* Radiating Vane Accents */}
    <line x1="30" y1="36" x2="38" y2="40" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" />
    <line x1="70" y1="36" x2="62" y2="40" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" />
    <line x1="28" y1="48" x2="36" y2="50" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" />
    <line x1="72" y1="48" x2="64" y2="50" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

interface MedallionIconProps {
  type?: 'flute' | 'lotus' | 'peacock' | 'namaste' | string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const MedallionIcon: React.FC<MedallionIconProps> = ({
  type = 'namaste',
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

  const renderIcon = () => {
    switch (type) {
      case 'flute':
        return <FluteIcon size={iconSizes[size]} />;
      case 'lotus':
        return <LotusIcon size={iconSizes[size]} />;
      case 'peacock':
        return <PeacockIcon size={iconSizes[size]} />;
      case 'namaste':
      default:
        return <NamasteIcon size={iconSizes[size]} />;
    }
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full bg-[#501518] shadow-md border-2 border-[#C59B4B]/80 p-2 select-none shrink-0 transition-transform duration-300 hover:scale-105 ${sizeClasses[size]} ${className}`}
    >
      {/* Inner decorative dotted ring */}
      <div className="absolute inset-1 rounded-full border border-dashed border-[#D4AF37]/50 pointer-events-none" />
      <div className="relative z-10 flex items-center justify-center">
        {renderIcon()}
      </div>
    </div>
  );
};
