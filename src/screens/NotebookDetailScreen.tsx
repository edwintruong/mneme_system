import React, { useState } from 'react';
import { Notebook } from '../types';
import { FigmaBackButton } from '../components/common/FigmaBackButton';
import { FigmaIcon } from '../components/common/FigmaIcon';

interface NotebookDetailScreenProps {
  notebook: Notebook;
  onBack: () => void;
  onOpenSuggestions: (notebook: Notebook) => void;
}

export const NotebookDetailScreen: React.FC<NotebookDetailScreenProps> = ({
  notebook,
  onBack,
  onOpenSuggestions,
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'sources'>('content');
  const [expandedSections, setExpandedSections] = useState<number[]>(() =>
    notebook.sections.map((_, i) => i)
  );

  const toggleSection = (idx: number) => {
    setExpandedSections((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F6FD] pb-32">
      {/* Top Bar */}
      <div className="sticky top-0 bg-[#F8F6FD]/90 backdrop-blur-md px-4 py-3 z-30 flex items-center justify-between">
        <FigmaBackButton onClick={onBack} />
        <h2 className="text-base font-semibold text-[#0E0727] truncate max-w-[200px]">
          {notebook.title}
        </h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onOpenSuggestions(notebook)}
            className="p-2 rounded-full bg-[#F1EEFC] text-[#7758E2] hover:bg-[#7758E2] hover:text-white transition-colors"
            title="Gợi ý bổ sung từ AI"
          >
            <FigmaIcon name="ai" size={18} />
          </button>
        </div>
      </div>

      <div className="px-4 space-y-4 pt-1">
        {/* Cover Header Banner */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-black/5 space-y-3">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#F1EEFC] flex items-center justify-center flex-shrink-0 text-[#7758E2] overflow-hidden">
              <img
                src={notebook.image}
                alt={notebook.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-[#7758E2] bg-[#F1EEFC] px-2 py-0.5 rounded-full">
                  {notebook.itemCount} nguồn đã liên kết
                </span>
                <span className="text-[11px] text-[#9490A2]">
                  {notebook.createdAt || 'Gần đây'}
                </span>
              </div>
              <h3 className="text-base font-bold text-[#0E0727] mt-1">{notebook.title}</h3>
            </div>
          </div>

          <p className="text-xs text-[#9490A2] leading-relaxed pt-2 border-t border-black/5">
            {notebook.description}
          </p>
        </div>

        {/* AI Suggestions CTA Strip */}
        <div
          onClick={() => onOpenSuggestions(notebook)}
          className="bg-gradient-to-r from-[#7758E2] to-[#613EEA] rounded-2xl p-4 text-white shadow-md shadow-[#7758E2]/20 flex items-center justify-between cursor-pointer group active:scale-[0.99] transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-xs">
              <FigmaIcon name="ai" size={20} color="#FFFFFF" />
            </div>
            <div>
              <h4 className="text-xs font-bold">2 gợi ý nội dung mới từ AI</h4>
              <p className="text-[11px] text-white/80 mt-0.5">
                Các bài viết & video tương đồng để mở rộng sổ tay
              </p>
            </div>
          </div>
          <FigmaIcon name="chevron-right" size={18} color="#FFFFFF" />
        </div>

        {/* Sections Content List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h4 className="text-sm font-bold text-[#0E0727]">Nội dung tổng hợp</h4>
            <span className="text-xs text-[#9490A2]">
              {notebook.sections?.length || 0} chương mục
            </span>
          </div>

          {notebook.sections?.map((section, idx) => {
            const isExpanded = expandedSections.includes(idx);
            return (
              <div
                key={section.title}
                className="bg-white rounded-3xl p-5 shadow-xs border border-black/5 space-y-2 transition-all"
              >
                <div
                  onClick={() => toggleSection(idx)}
                  className="flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#F1EEFC] text-[#7758E2] font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h5 className="text-sm font-bold text-[#0E0727] group-hover:text-[#7758E2] transition-colors">
                      {section.title}
                    </h5>
                  </div>
                  <div
                    className={`text-[#9490A2] transition-transform duration-200 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  >
                    <FigmaIcon name="dropdown" size={18} />
                  </div>
                </div>

                {isExpanded && (
                  <p className="text-xs text-[#0E0727] leading-relaxed pt-2 border-t border-black/5 bg-[#F8F6FD] p-3 rounded-xl mt-2 animate-fade-in">
                    {section.body}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
