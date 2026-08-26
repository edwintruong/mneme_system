import React, { useState } from 'react';

interface MnemeImageProps {
  src: string;
  size?: number;
  width?: number;
  height?: number;
  radius?: number;
  className?: string;
  alt?: string;
}

export const MnemeImage: React.FC<MnemeImageProps> = ({
  src,
  size = 80,
  width,
  height,
  radius = 15,
  className = '',
  alt = '',
}) => {
  const [error, setError] = useState(false);
  const w = width || size;
  const h = height || size;

  // Clean URL to handle leading slashes / assets prefixes
  const normalizedSrc = src.startsWith('assets/') ? `/${src}` : src;

  return (
    <div
      style={{
        width: `${w}px`,
        height: `${h}px`,
        borderRadius: `${radius}px`,
      }}
      className={`overflow-hidden bg-[#E5E5EA] flex-shrink-0 flex items-center justify-center ${className}`}
    >
      {!error ? (
        <img
          src={normalizedSrc}
          alt={alt}
          onError={() => setError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#7758E2]/20 to-[#613EEA]/10 text-[#7758E2] text-xs font-semibold">
          Mneme
        </div>
      )}
    </div>
  );
};
