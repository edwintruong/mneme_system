import React from 'react';
import { SavedLink } from '../../types';
import { MnemeImage } from './MnemeImage';
import { Tag } from './Tag';
import { FigmaIcon } from './FigmaIcon';

interface LinkTileProps {
  link: SavedLink;
  onClick?: () => void;
  onMore?: () => void;
  compact?: boolean;
  className?: string;
}

export const LinkTile: React.FC<LinkTileProps> = ({
  link,
  onClick,
  onMore,
  compact = false,
  className = '',
}) => {
  return (
    <div
      onClick={onClick}
      className={`group flex items-start gap-3 py-2.5 px-2 rounded-2xl hover:bg-[#F5F5F7]/80 active:scale-[0.99] transition-all cursor-pointer ${className}`}
    >
      <div className="relative flex-shrink-0">
        <MnemeImage
          src={link.image}
          size={compact ? 72 : 80}
          radius={14}
          alt={link.title}
        />
        <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md bg-[#0E0727]/75 text-[10px] text-white font-medium">
          2:12
        </div>
      </div>

      <div className="flex-1 min-w-0 flex flex-col">
        <h4 className="text-sm font-medium text-[#0E0727] line-clamp-2 underline group-hover:text-[#7758E2] transition-colors leading-snug">
          {link.title}
        </h4>
        <div className="text-xs text-[#9490A2] mt-1 truncate">
          {link.author ? `${link.source} · ${link.author}` : link.source}
        </div>
        <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
          <Tag label={link.folder} />
          {link.tags && link.tags.length > 0 ? (
            <Tag label={link.tags[0]} primary />
          ) : (
            <Tag label="Figma" primary />
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onMore?.();
        }}
        className="p-1 text-[#9490A2] hover:text-[#0E0727] rounded-full"
      >
        <FigmaIcon name="more-vertical" size={18} />
      </button>
    </div>
  );
};
