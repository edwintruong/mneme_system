import React from 'react';

interface SectionTitleProps {
  title: string;
  trailing?: React.ReactNode;
  className?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  trailing,
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-between py-1 ${className}`}>
      <h3 className="text-sm font-semibold text-[#0E0727] tracking-tight">{title}</h3>
      {trailing && <div>{trailing}</div>}
    </div>
  );
};
