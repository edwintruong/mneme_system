import React from 'react';
import { FigmaIcon } from './FigmaIcon';

/**
 * The white search card that opens every list screen. Figma nodes 2159:12777
 * (Home) and 2159:12364 (Notebook list) — identical apart from the shadow,
 * which Home's copy does not carry.
 */
interface SearchCardProps {
  onTap: () => void;
  /** Home fixes this at 350; the notebook list fills its 356 column. */
  className?: string;
  withShadow?: boolean;
}

export const SearchCard: React.FC<SearchCardProps> = ({
  onTap,
  className = 'w-[350px]',
  withShadow = false,
}) => (
  <div
    className={`flex flex-col items-start overflow-hidden rounded-[30px] bg-white p-[12px] ${className}`}
    style={withShadow ? { boxShadow: 'var(--shadow-card)' } : undefined}
  >
    <div className="flex w-full items-center justify-center gap-[18px]">
      <button
        type="button"
        onClick={onTap}
        className="flex min-w-px flex-1 items-center gap-[10px] rounded-[11px] bg-[#f5f5f7] px-[8px] py-[12px]"
      >
        <FigmaIcon name="search" size={16} />
        <span className="whitespace-nowrap text-[16px] leading-[22px] font-normal tracking-[-0.18px] text-[#9490a2]">
          Enter search terms...
        </span>
      </button>
      <button type="button" onClick={onTap} aria-label="Bộ lọc" className="shrink-0">
        <FigmaIcon name="filter" size={36} />
      </button>
    </div>
  </div>
);
