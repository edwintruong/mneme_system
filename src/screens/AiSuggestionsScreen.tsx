import React, { useState } from 'react';
import { Notebook } from '../types';
import { useMneme } from '../state/mnemeContext';
import { FigmaBackButton } from '../components/common/FigmaBackButton';
import { FigmaIcon } from '../components/common/FigmaIcon';
import { Tag } from '../components/common/Tag';

interface AiSuggestionsScreenProps {
  notebook: Notebook;
  onBack: () => void;
}

export const AiSuggestionsScreen: React.FC<AiSuggestionsScreenProps> = ({
  notebook,
  onBack,
}) => {
  const { links } = useMneme();
  const [addedIds, setAddedIds] = useState<number[]>([]);

  // Find recommendations based on tags / similarity
  const suggestions = [
    {
      id: 901,
      title: 'Figma Auto Layout Advanced (2026 Edition)',
      source: 'YouTube · @designmentor',
      matchScore: '96%',
      reason: 'Bổ sung các mẹo Min/Max Width và Hug content mới nhất tương thích với mục 1 trong sổ tay.',
      tags: ['Figma', 'AutoLayout', 'Advanced'],
    },
    {
      id: 902,
      title: 'Design Tokens Architecture & Tailwind Sync',
      source: 'Website · designsystems.io',
      matchScore: '92%',
      reason: 'Đi sâu vào cách cấu trúc token biến số kết nối trực tiếp với code React.',
      tags: ['DesignSystem', 'Tokens', 'Tailwind'],
    },
  ];

  const handleAdd = (id: number) => {
    setAddedIds((prev) => [...prev, id]);
  };

  return (
    <div className="min-h-screen bg-[#F8F6FD] pb-28">
      {/* Top Bar */}
      <div className="sticky top-0 bg-[#F8F6FD]/90 backdrop-blur-md px-4 py-3 z-30 flex items-center justify-between">
        <FigmaBackButton onClick={onBack} />
        <h2 className="text-base font-semibold text-[#0E0727]">Gợi ý từ AI</h2>
        <div className="w-8" />
      </div>

      <div className="px-4 space-y-4 pt-1">
        {/* Header summary */}
        <div className="bg-[#7758E2] text-white rounded-3xl p-5 shadow-sm space-y-2">
          <div className="flex items-center gap-2">
            <FigmaIcon name="ai" size={20} color="#FFFFFF" />
            <h3 className="text-sm font-bold">Mở rộng sổ tay: {notebook.title}</h3>
          </div>
          <p className="text-xs text-white/80 leading-relaxed">
            Dựa trên nội dung các mục hiện có, AI đã tìm thấy các tài nguyên có độ tương thích cao
            để bạn cập nhật thêm kiến thức.
          </p>
        </div>

        {/* Suggestions List */}
        <div className="space-y-3">
          {suggestions.map((item) => {
            const isAdded = addedIds.includes(item.id);
            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-5 shadow-xs border border-black/5 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold text-[#31CF37] bg-[#31CF37]/10 px-2 py-0.5 rounded-full inline-block mb-1.5">
                      Độ trùng khớp {item.matchScore}
                    </span>
                    <h4 className="text-sm font-bold text-[#0E0727] leading-snug">{item.title}</h4>
                    <span className="text-xs text-[#9490A2] mt-0.5 block">{item.source}</span>
                  </div>
                </div>

                <div className="bg-[#F8F6FD] rounded-2xl p-3 text-xs text-[#0E0727] space-y-1">
                  <span className="text-[10px] font-bold text-[#7758E2] uppercase tracking-wider block">
                    Lý do gợi ý từ AI:
                  </span>
                  <p className="leading-relaxed">{item.reason}</p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1 flex-wrap">
                    {item.tags.map((t) => (
                      <Tag key={t} label={t} primary={t === 'Figma'} />
                    ))}
                  </div>

                  <button
                    type="button"
                    disabled={isAdded}
                    onClick={() => handleAdd(item.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                      isAdded
                        ? 'bg-[#31CF37]/15 text-[#31CF37]'
                        : 'bg-[#7758E2] text-white hover:bg-[#613EEA]'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <span>✓ Đã thêm</span>
                      </>
                    ) : (
                      <>
                        <FigmaIcon name="plus" size={14} color="#FFFFFF" />
                        <span>Thêm vào sổ tay</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
