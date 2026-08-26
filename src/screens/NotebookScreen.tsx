import React, { useState } from 'react';
import { useMneme } from '../state/mnemeContext';
import { Notebook } from '../types';
import { SearchCard } from '../components/common/SearchCard';
import { FilterChips } from '../components/common/FilterChips';
import { FigmaIcon } from '../components/common/FigmaIcon';

interface NotebookScreenProps {
  onSelectNotebook: (notebook: Notebook) => void;
  onCreateNotebook: () => void;
  onOpenSearch: () => void;
}

export const NotebookScreen: React.FC<NotebookScreenProps> = ({
  onSelectNotebook,
  onCreateNotebook,
  onOpenSearch,
}) => {
  const { notebooks } = useMneme();
  const [filter, setFilter] = useState('Tất cả');

  return (
    <div className="pb-28 pt-4 px-4 space-y-5">
      {/* Header Title with Add button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#0E0727]">Sổ tay tổng hợp</h2>
          <p className="text-xs text-[#9490A2]">Kiến thức được AI đúc kết từ nhiều nguồn</p>
        </div>
        <button
          type="button"
          onClick={onCreateNotebook}
          className="px-3.5 py-2 rounded-full bg-[#7758E2] text-white text-xs font-bold shadow-md shadow-[#7758E2]/25 flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all"
        >
          <FigmaIcon name="plus" size={14} color="#FFFFFF" />
          Tạo sổ tay
        </button>
      </div>

      {/* Search Bar */}
      <SearchCard onTap={onOpenSearch} placeholder="Tìm kiếm trong các sổ tay..." />

      {/* Filter Chips */}
      <FilterChips onChange={(f) => setFilter(f)} />

      {/* Notebook Cards List */}
      <div className="space-y-4">
        {notebooks.map((nb) => (
          <div
            key={nb.id}
            onClick={() => onSelectNotebook(nb)}
            className="bg-white rounded-3xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer group active:scale-[0.99] border border-black/5"
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#F1EEFC] flex items-center justify-center flex-shrink-0 text-[#7758E2] group-hover:scale-105 transition-transform overflow-hidden">
                <img
                  src={nb.image}
                  alt={nb.title}
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#7758E2] bg-[#F1EEFC] px-2 py-0.5 rounded-full">
                    {nb.itemCount} nguồn tổng hợp
                  </span>
                  <span className="text-[11px] text-[#9490A2]">{nb.createdAt || 'Mới'}</span>
                </div>
                <h3 className="text-base font-bold text-[#0E0727] mt-1 group-hover:text-[#7758E2] transition-colors truncate">
                  {nb.title}
                </h3>
                <p className="text-xs text-[#9490A2] line-clamp-2 mt-1">
                  {nb.description}
                </p>
              </div>
            </div>

            {/* Snippet from section 1 */}
            {nb.sections && nb.sections.length > 0 && (
              <div className="mt-4 pt-3 border-t border-black/5 bg-[#F8F6FD] rounded-2xl p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7758E2] block mb-1">
                  Chủ đề tiêu biểu: {nb.sections[0].title}
                </span>
                <p className="text-xs text-[#0E0727] line-clamp-2 leading-relaxed">
                  {nb.sections[0].body}
                </p>
              </div>
            )}
          </div>
        ))}

        {notebooks.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center shadow-xs">
            <div className="w-12 h-12 rounded-full bg-[#F1EEFC] text-[#7758E2] mx-auto flex items-center justify-center mb-3">
              <FigmaIcon name="open-book" size={24} color="#7758E2" />
            </div>
            <h4 className="text-sm font-bold text-[#0E0727]">Chưa có sổ tay nào</h4>
            <p className="text-xs text-[#9490A2] mt-1 mb-4">
              Chọn các liên kết để AI tổng hợp thành sổ tay kiến thức đầu tiên!
            </p>
            <button
              type="button"
              onClick={onCreateNotebook}
              className="px-4 py-2 rounded-xl bg-[#7758E2] text-white text-xs font-bold"
            >
              Tạo sổ tay mới
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
