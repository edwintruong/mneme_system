import React, { useState } from 'react';
import { SavedLink } from '../types';
import { useMneme } from '../state/mnemeContext';
import { FigmaBackButton } from '../components/common/FigmaBackButton';
import { FigmaIcon } from '../components/common/FigmaIcon';
import { LinkTile } from '../components/common/LinkTile';

interface SearchScreenProps {
  onBack: () => void;
  onSelectLink: (link: SavedLink) => void;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({ onBack, onSelectLink }) => {
  const { searchLinks } = useMneme();
  const [query, setQuery] = useState('');

  const results = searchLinks(query);

  const popularQueries = [
    'video làm bánh bằng nồi chiên',
    'figma auto layout',
    'design system',
    'du lịch đà lạt',
  ];

  return (
    <div className="min-h-screen bg-[#F8F6FD] pb-28">
      {/* Top Search Bar */}
      <div className="sticky top-0 bg-[#F8F6FD]/90 backdrop-blur-md px-4 py-3 z-30 flex items-center gap-2">
        <FigmaBackButton onClick={onBack} />
        <div className="flex-1 relative">
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm link, folder hoặc category..."
            className="w-full pl-10 pr-9 py-2.5 bg-white rounded-full text-sm font-medium text-[#0E0727] placeholder:text-[#9490A2] shadow-xs outline-none focus:ring-2 focus:ring-[#7758E2]"
          />
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9490A2] pointer-events-none">
            <FigmaIcon name="search" size={16} />
          </div>
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9490A2] hover:text-[#0E0727] p-1"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="px-4 space-y-4 pt-1">
        {/* Semantic Helper Banner */}
        {query.trim() !== '' ? (
          <div className="px-1 text-xs text-[#9490A2]">
            {results.length === 0 && 'Không tìm thấy nội dung phù hợp'}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-5 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-[#9490A2] uppercase tracking-wider">
              Tìm kiếm nhanh theo gợi ý
            </h4>
            <div className="flex flex-wrap gap-2">
              {popularQueries.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setQuery(item)}
                  className="px-3.5 py-1.5 rounded-full bg-[#F1EEFC] text-[#7758E2] text-xs font-medium hover:bg-[#7758E2] hover:text-white transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results List */}
        <div className="bg-white rounded-3xl p-4 shadow-xs divide-y divide-black/5">
          {results.map((link) => (
            <LinkTile
              key={link.id}
              link={link}
              onClick={() => onSelectLink(link)}
            />
          ))}

          {query && results.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-sm font-semibold text-[#0E0727]">Không tìm thấy kết quả nào</p>
              <p className="text-xs text-[#9490A2] mt-1">
                Thử tìm từ khóa ngắn hơn hoặc tìm theo chủ đề như "Figma", "Bánh", "Du lịch"
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
