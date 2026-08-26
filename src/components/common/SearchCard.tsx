import React from 'react';
import { FigmaIcon } from './FigmaIcon';

interface SearchCardProps {
  onTap?: () => void;
  placeholder?: string;
  className?: string;
}

export const SearchCard: React.FC<SearchCardProps> = ({
  onTap,
  placeholder = 'Enter search terms...',
  className = '',
}) => {
  return (
    <div
      onClick={onTap}
      role="button"
      tabIndex={0}
      className={`bg-white rounded-[30px] p-3 shadow-sm hover:shadow-md transition-all cursor-pointer select-none flex items-center ${className}`}
    >
      <div className="flex-1 bg-[#F5F5F7] rounded-[11px] h-[46px] px-3 flex items-center gap-2.5">
        <FigmaIcon name="search" size={16} className="text-[#9490A2]" />
        <span className="text-base text-[#9490A2] tracking-tight">{placeholder}</span>
      </div>
      <div className="ml-4 pr-1 text-[#0E0727] hover:text-[#7758E2] transition-colors">
        <FigmaIcon name="filter" size={26} />
      </div>
    </div>
  );
};
