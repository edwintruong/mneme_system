import React, { useState } from 'react';
import { useMneme } from '../state/mnemeContext';
import { SearchCard } from '../components/common/SearchCard';
import { FilterChips } from '../components/common/FilterChips';
import { SectionTitle } from '../components/common/SectionTitle';
import { LinkTile } from '../components/common/LinkTile';
import { MnemeCategory, SavedLink } from '../types';
import { FigmaIcon } from '../components/common/FigmaIcon';

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
  const [filter, setFilter] = useState('Tất cả');

  const filteredLinks = links.filter((l) => {
    if (filter === 'Bài viết') return l.source === 'Website' || l.source === 'Article';
    if (filter === 'Video') return l.source === 'YouTube' || l.source === 'TikTok';
    if (filter === 'Ảnh') return l.source === 'Instagram' || l.tags.includes('Photo');
    return true;
  });

  return (
    <div className="pb-28 pt-4 px-4 space-y-5">
      {/* Toast Notification if newly added link */}
      {showSuccessToast && (
        <div className="bg-[#31CF37]/15 border border-[#31CF37]/30 rounded-2xl p-3.5 flex items-center justify-between text-[#0E0727]">
          <div className="flex items-center gap-2.5">
            <FigmaIcon name="check-circle" size={24} />
            <span className="text-xs font-semibold">Đã thêm liên kết vào Mneme thành công!</span>
          </div>
          <button
            type="button"
            onClick={onDismissToast}
            aria-label="Đóng thông báo"
            className="p-1"
          >
            <FigmaIcon name="close-small" size={16} color="#9490A2" />
          </button>
        </div>
      )}

      {/* Search Header */}
      <SearchCard onTap={onOpenSearch} />

      {/* Filter Chips */}
      <FilterChips onChange={(f) => setFilter(f)} />

      {/* Categories Horizontal Carousel */}
      <div className="space-y-2.5">
        <SectionTitle
          title="Danh mục kiến thức"
          trailing={
            <span className="text-xs text-[#7758E2] font-semibold cursor-pointer">
              {categories.length} danh mục
            </span>
          }
        />
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat)}
              className="w-[124px] flex-shrink-0 bg-white rounded-2xl p-3 shadow-xs hover:shadow-md transition-all cursor-pointer group active:scale-95"
            >
              <div className="w-full h-[76px] rounded-xl overflow-hidden bg-[#F5F5F7] mb-2 flex items-center justify-center">
                <img
                  src={cat.image}
                  alt={cat.name}
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <h4 className="text-xs font-semibold text-[#0E0727] truncate">{cat.name}</h4>
              <p className="text-[10px] text-[#9490A2] mt-0.5">{cat.itemCount} mục</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recently Saved Links */}
      <div className="space-y-2 bg-white rounded-3xl p-4 shadow-xs">
        <SectionTitle
          title="Đã lưu gần đây"
          trailing={
            <button
              type="button"
              onClick={onOpenSearch}
              className="text-xs text-[#7758E2] font-semibold hover:underline flex items-center gap-1"
            >
              Xem tất cả
              <FigmaIcon name="chevron-right" size={14} color="#7758E2" />
            </button>
          }
        />

        <div className="divide-y divide-black/5">
          {filteredLinks.slice(0, 5).map((link) => (
            <LinkTile
              key={link.id}
              link={link}
              onClick={() => onSelectLink(link)}
            />
          ))}

          {filteredLinks.length === 0 && (
            <div className="py-8 text-center text-xs text-[#9490A2]">
              Không có liên kết nào phù hợp với bộ lọc.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
