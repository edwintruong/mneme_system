import React from 'react';

interface TagProps {
  label: string;
  primary?: boolean;
  className?: string;
}

export const Tag: React.FC<TagProps> = ({ label, primary = false, className = '' }) => {
  return (
    <span
      className={`inline-flex items-center justify-center px-2.5 py-1 text-xs rounded-full font-medium tracking-tight whitespace-nowrap ${
        primary
          ? 'bg-[#F1EEFC] text-[#7758E2]'
          : 'bg-[#F5F5F7] text-[#0E0727]'
      } ${className}`}
    >
      {label}
    </span>
  );
};
