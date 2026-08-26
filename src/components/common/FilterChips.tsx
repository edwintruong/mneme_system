import React, { useState } from 'react';

interface FilterChipsProps {
  onChange?: (selected: string) => void;
  className?: string;
}

export const FilterChips: React.FC<FilterChipsProps> = ({ onChange, className = '' }) => {
  const [selected, setSelected] = useState(0);
  const labels = ['Tất cả', 'Bài viết', 'Video', 'Ảnh'];

  const handleSelect = (idx: number) => {
    setSelected(idx);
    onChange?.(labels[idx]);
  };

  return (
    <div className={`flex items-center gap-2.5 overflow-x-auto no-scrollbar py-0.5 ${className}`}>
      {labels.map((label, idx) => {
        const isSelected = selected === idx;
        return (
          <button
            key={label}
            type="button"
            onClick={() => handleSelect(idx)}
            className={`w-[70px] h-[28px] rounded-full text-xs font-extrabold flex items-center justify-center transition-all flex-shrink-0 ${
              isSelected
                ? 'bg-[#F1EEFC] text-[#7758E2] shadow-xs'
                : 'bg-[#F5F5F7] text-[#9490A2] hover:bg-[#EBEBF0]'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};
