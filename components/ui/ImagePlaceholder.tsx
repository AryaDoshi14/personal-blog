import React from 'react';
import Image from 'next/image';

interface ImagePlaceholderProps {
  aspectRatio?: 'square' | 'video' | 'portrait';
  title?: string;
  className?: string;
}

export const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  aspectRatio = 'video',
  title = 'શ્રીજી બાબાની કૃપા',
  className = '',
}) => {
  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
  };

  return (
    <div
      className={`relative w-full overflow-hidden bg-[#F4EDE2] border border-[#E8DFD3] flex flex-col items-center justify-center p-6 text-center select-none ${aspectClasses[aspectRatio]} ${className}`}
    >
      <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
        <Image
          src="/images/defaults/logo-mandala.svg"
          alt="Watermark"
          width={180}
          height={180}
        />
      </div>
      <div className="relative z-10 flex flex-col items-center">
        <Image
          src="/images/defaults/logo-mandala.svg"
          alt="Emblem"
          width={40}
          height={40}
          className="mb-3 opacity-75"
        />
        <p className="text-xs sm:text-sm font-semibold text-[#501518] font-serif-gu tracking-wide">
          {title}
        </p>
      </div>
    </div>
  );
};
