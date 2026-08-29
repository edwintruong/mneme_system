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

const EMPTY_STATE_IMAGE = '/assets/images/figma_2159/2159_13796_search_empty.png';

/** Search screen, Figma node 2159:13796. */
export const SearchScreen: React.FC<SearchScreenProps> = ({ onBack, onSelectLink }) => {
  const { searchLinks, categories } = useMneme();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const textResults = searchLinks(query);
  const results = activeCategory
    ? textResults.filter((link) => link.category === activeCategory)
    : textResults;

  // Filter chips can narrow the saved links on their own, so "browsing" starts
  // as soon as either a query is typed or a category chip is selected — the
  // Figma "Bắt đầu tìm kiếm" placeholder only applies to the true blank state.
  const isBrowsing = query.trim() !== '' || activeCategory !== null;

  return (
    <div className="flex min-h-full w-[390px] flex-col items-start bg-[#f8f6fd]">
      <div className="sticky top-0 z-30 flex w-full items-center justify-center bg-[#f8f6fd] px-[20px] py-[16px]">
        <div className="flex w-full items-center gap-0 rounded-[30px] bg-white p-[12px]">
          <FigmaBackButton onClick={onBack} />
          <div className="flex flex-1 items-center justify-center gap-[18px]">
            <div className="flex flex-1 items-center gap-[10px] rounded-[11px] border-2 border-[#d5cbf6] bg-[#f5f5f7] px-[8px] py-[12px]">
              <FigmaIcon name="search" size={16} />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm link, folder hoặc category..."
                className="w-full bg-transparent text-[16px] leading-[22px] tracking-[-0.18px] text-[#0e0727] placeholder:text-[#9490a2] outline-none"
              />
            </div>
            <button type="button" aria-label="Bộ lọc" className="shrink-0">
              <FigmaIcon name="filter" size={36} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col items-start px-[20px] pb-[28px]">
        <div
          className="flex w-full flex-col items-center gap-[10px] rounded-[20px] bg-white px-[16px] pt-[10px] pb-[20px]"
          style={{ boxShadow: '0px 4px 8px 0px rgba(0,0,0,0.06), 0px 0px 4px 0px rgba(0,0,0,0.04)' }}
        >
          {categories.length > 0 && (
            <div className="flex w-full flex-wrap items-start gap-[10px]">
              {categories.map((category) => {
                const active = activeCategory === category.name;
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setActiveCategory(active ? null : category.name)}
                    className={`flex shrink-0 items-center justify-center gap-[8px] rounded-[24px] px-[10px] py-[6px] text-[12px] font-extrabold leading-[16px] tracking-[0.4px] whitespace-nowrap transition-colors ${
                      active ? 'bg-[#7758e2] text-white' : 'bg-[#f5f5f7] text-[#9490a2]'
                    }`}
                  >
                    {category.name}
                  </button>
                );
              })}
            </div>
          )}

          {!isBrowsing ? (
            <div className="flex w-full flex-col items-center gap-[10px] py-[20px]">
              <div className="relative h-[79px] w-[86px] shrink-0 overflow-hidden">
                <img
                  src={EMPTY_STATE_IMAGE}
                  alt=""
                  className="absolute top-[-49.37%] left-[-37.21%] h-[189.87%] w-[174.42%] max-w-none"
                />
              </div>
              <p className="w-full text-center text-[16px] leading-[22px] tracking-[-0.18px] text-[#9490a2]">
                Bắt đầu tìm kiếm
              </p>
              <p className="w-[234px] text-center text-[14px] leading-[20px] tracking-[0.4px] text-[#9490a2]">
                Nhập từ khóa để tìm link, folder hoặc category bạn đã lưu
              </p>
            </div>
          ) : (
            <div className="flex w-full flex-col divide-y divide-black/5">
              {results.map((link) => (
                <LinkTile key={link.id} link={link} onClick={() => onSelectLink(link)} />
              ))}

              {results.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-sm font-semibold text-[#0E0727]">Không tìm thấy kết quả nào</p>
                  <p className="mt-1 text-xs text-[#9490A2]">
                    Thử tìm từ khóa ngắn hơn hoặc tìm theo chủ đề như "Figma", "Bánh", "Du lịch"
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
