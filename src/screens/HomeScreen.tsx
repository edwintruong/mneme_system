import React, { useState } from 'react';
import { useMneme } from '../state/mnemeContext';
import { FigmaIcon } from '../components/common/FigmaIcon';
import { MnemeCategory, SavedLink } from '../types';
import { HOME_CATEGORY_IDS, HOME_RECENT_LINK_IDS } from '../data/seed';

/**
 * Home, Figma node 2172:4416. Every size, gap and colour below is read from
 * that node; do not adjust them to taste.
 */

const FILTERS = ['Tất cả', 'Bài viết', 'Video', 'Ảnh'] as const;

interface HomeScreenProps {
  onOpenSearch: () => void;
  onSelectCategory: (category: MnemeCategory) => void;
  onSelectLink: (link: SavedLink) => void;
  showSuccessToast?: boolean;
  onDismissToast?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onOpenSearch,
  onSelectCategory,
  onSelectLink,
  showSuccessToast = false,
  onDismissToast,
}) => {
  const { categories, links } = useMneme();
  const [filter, setFilter] = useState<string>(FILTERS[0]);

  // This screen is the fixed showcase storyboard from node 2172:4416. Select
  // its fixtures by id so older localStorage order and user-created links do
  // not silently replace the copy visible in the Figma frame.
  const recent = HOME_RECENT_LINK_IDS
    .map((id) => links.find((link) => link.id === id))
    .filter((link): link is SavedLink => Boolean(link));
  const homeCategories = HOME_CATEGORY_IDS
    .map((id) => categories.find((category) => category.id === id))
    .filter((category): category is MnemeCategory => Boolean(category));

  return (
    // Content, node 2172:4418
    <div className="flex w-[390px] flex-1 flex-col items-start gap-[12px] px-[20px] py-[16px]">
      {showSuccessToast && (
        // Add-link toast, node 2159:13227
        <div className="flex w-[350px] items-center justify-between rounded-[16px] border border-[#31cf37]/30 bg-[#31cf37]/15 p-[12px]">
          <div className="flex items-center gap-[10px]">
            <FigmaIcon name="check-circle" size={24} />
            <span className="text-[12px] leading-[16px] font-medium tracking-[0.4px] text-[#0e0727]">
              Đã thêm liên kết vào Mneme thành công!
            </span>
          </div>
          <button type="button" onClick={onDismissToast} aria-label="Đóng thông báo" className="p-[4px]">
            <FigmaIcon name="close-small" size={16} color="#9490a2" />
          </button>
        </div>
      )}

      {/* Header, node 2172:4419 */}
      <div className="flex w-[350px] items-start justify-end">
        <h1 className="min-w-px flex-1 self-stretch text-[24px] leading-[30px] font-medium tracking-[-0.15px] text-[#0e0727]">
          Xin chào, echs
        </h1>
        <div className="size-[36px] shrink-0 overflow-hidden rounded-[18px] border-[1.385px] border-solid border-[#e5e5ea] bg-[#eef1f4]">
          <img
            src="/assets/images/figma_2159/2159_12771_avatar.jpg"
            alt=""
            className="size-full rounded-[18px] object-cover"
          />
        </div>
      </div>

      {/* Search Card, node 2172:4422 */}
      <div className="flex w-[350px] flex-col items-start overflow-hidden rounded-[30px] bg-white p-[12px]">
        <div className="flex w-[326px] items-center justify-center gap-[18px]">
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex min-w-px flex-1 items-center gap-[10px] rounded-[11px] bg-[#f5f5f7] px-[8px] py-[12px]"
          >
            <FigmaIcon name="search" size={16} />
            <span className="whitespace-nowrap text-[16px] leading-[22px] font-normal tracking-[-0.18px] text-[#9490a2]">
              Enter search terms...
            </span>
          </button>
          <button type="button" onClick={onOpenSearch} aria-label="Bộ lọc" className="shrink-0">
            <FigmaIcon name="filter" size={36} />
          </button>
        </div>
      </div>

      {/* Card, node 2172:4424 */}
      <div
        className="flex w-full flex-col items-start gap-[20px] rounded-[20px] bg-white px-[16px] py-[20px]"
        style={{ boxShadow: 'var(--shadow-card)' }}
      >
        {/* Filter Chips, node 2172:4425 */}
        <div className="flex items-start gap-[10px] overflow-hidden">
          {FILTERS.map((label) => {
            const selected = filter === label;
            return (
              <button
                key={label}
                type="button"
                onClick={() => setFilter(label)}
                className={`flex w-[70px] items-center justify-center gap-[8px] overflow-hidden rounded-[24px] px-[10px] py-[6px] ${
                  selected ? 'bg-[#f1eefc]' : 'bg-[#f5f5f7]'
                }`}
              >
                <span
                  className={`whitespace-nowrap text-[12px] leading-[16px] font-extrabold tracking-[0.4px] ${
                    selected ? 'text-[#7758e2]' : 'text-[#9490a2]'
                  }`}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>

        {/* node 2172:4430 */}
        <div className="flex w-full flex-col items-start gap-[20px]">
          {/* Đã lưu gần đây, node 2172:4431 */}
          <div className="flex w-full flex-col items-start gap-[10px]">
            <p className="w-full text-[14px] leading-[20px] font-medium tracking-[0.4px] text-[#0e0727]">
              Đã lưu gần đây
            </p>
            <div className="flex w-full items-center gap-[12px]">
              {recent.map((link) => (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => onSelectLink(link)}
                  className="flex min-w-px flex-1 flex-col items-center justify-center gap-[9px]"
                >
                  <div className="size-[80px] shrink-0 overflow-hidden rounded-[15px]">
                    <img src={link.image} alt="" className="size-full rounded-[15px] object-cover" />
                  </div>
                  <p className="w-full min-w-full overflow-hidden text-ellipsis whitespace-nowrap text-left text-[12px] leading-[16px] font-medium tracking-[0px] text-[#0e0727]">
                    {link.title}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Categories, node 2172:4446 */}
          <div className="flex w-full flex-col items-start gap-[10px]">
            <p className="w-full text-[14px] leading-[20px] font-medium tracking-[0.4px] text-[#0e0727]">
              Categories
            </p>
            {homeCategories.map((category, index) => (
              <button
                key={category.id}
                type="button"
                onClick={() => onSelectCategory(category)}
                className="flex w-full items-center gap-[10px] text-left"
              >
                <div className="size-[80px] shrink-0 overflow-hidden rounded-[15px]">
                  <img src={category.image} alt="" className="size-full rounded-[15px] object-cover" />
                </div>
                <div className="flex min-w-px flex-1 flex-col items-start justify-center gap-[8px]">
                  <p className="w-full text-[16px] leading-[24px] font-medium tracking-[0px] text-[#0e0727]">
                    {category.name}
                  </p>
                  <div className="flex w-full items-center gap-[4px]">
                    <p className="whitespace-nowrap text-[14px] leading-[20px] font-normal tracking-[0.4px] text-[#9490a2]">
                      {category.itemCount} mục
                    </p>
                  </div>
                </div>
                {/* Only the last row carries the overflow control in the design. */}
                {index === homeCategories.length - 1 && (
                  // 24px box holding a 2.5x12.5 glyph, node 2143:3538
                  <span className="relative size-[24px] shrink-0">
                    {/*
                      The instance is rotated in Figma: the exported vector is
                      2.5x12.5 but the design renders it as 12.5x2.5 centred at
                      (12, 11) in the 24px box, measured off the Figma render.
                    */}
                    <FigmaIcon
                      name="more-vertical"
                      className="absolute"
                      style={{ left: '10.75px', top: '4.75px', transform: 'rotate(90deg)' }}
                    />
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
