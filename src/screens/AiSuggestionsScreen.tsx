import React, { useMemo, useState } from 'react';
import { AI_SUGGESTIONS, AiSuggestion, AiSuggestionId } from '../data/aiSuggestions';
import { FigmaIcon } from '../components/common/FigmaIcon';

interface AiSuggestionsScreenProps {
  ignoredIds: AiSuggestionId[];
  onBack: () => void;
  onReview: (id: AiSuggestionId) => void;
}

type SuggestionTab = 'all' | 'new' | 'ignored';
const GROUPS: AiSuggestion['group'][] = ['Hôm nay', 'Hôm qua', '2 ngày trước'];

const SuggestionRow: React.FC<{
  suggestion: AiSuggestion;
  withDivider: boolean;
  onReview: () => void;
}> = ({ suggestion, withDivider, onReview }) => (
  <div className={`flex w-full flex-col items-end gap-[10px] py-[10px] ${withDivider ? 'border-b border-[#f2f2f3] pb-[21px]' : ''}`}>
    <div className="flex w-full items-start gap-[16px]">
      <div
        className="shrink-0 overflow-hidden rounded-[12px] bg-black"
        style={{ width: suggestion.listImageSize, height: suggestion.listImageSize }}
      >
        <img src={suggestion.notebookImage} alt="" className="size-full object-cover" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col items-start justify-center gap-[4px]">
        <div className="flex w-full min-w-0 items-start gap-[8px]">
          <p className="min-w-0 flex-1 break-words text-[16px] leading-[24px] font-medium text-[#0e0727]">
            {suggestion.notebookTitle}
          </p>
          {suggestion.showNewBadge && (
            <span className="shrink-0 rounded-[24px] bg-[#f1eefc] px-[12px] py-[4px] text-[12px] leading-[16px] text-[#7758e2]">
              Mới
            </span>
          )}
        </div>
        <p className="w-full break-words text-[12px] leading-[16px] tracking-[0.4px] text-[#0e0727]">
          {suggestion.summary}
        </p>
        <p className="w-full break-words text-[12px] leading-[16px] tracking-[0.4px] text-[#0e0727]">
          Độ phù hợp cao: {suggestion.matchScore}%
        </p>
      </div>
    </div>
    <button
      type="button"
      aria-label={`Review ${suggestion.notebookTitle}`}
      onClick={onReview}
      className="flex h-[32px] items-center justify-center rounded-[16px] bg-[#7758e2] px-[16px] text-[16px] leading-[22px] font-medium tracking-[-0.18px] text-white"
    >
      Review
    </button>
  </div>
);

/** AI Suggestions list — showcase node 2172:5336. */
export const AiSuggestionsScreen: React.FC<AiSuggestionsScreenProps> = ({
  ignoredIds,
  onBack,
  onReview,
}) => {
  const [activeTab, setActiveTab] = useState<SuggestionTab>('all');

  const visibleSuggestions = useMemo(() => {
    if (activeTab === 'new') return AI_SUGGESTIONS.filter((item) => item.newForFilter);
    if (activeTab === 'ignored') return AI_SUGGESTIONS.filter((item) => ignoredIds.includes(item.id));
    return AI_SUGGESTIONS.filter((item) => !ignoredIds.includes(item.id));
  }, [activeTab, ignoredIds]);

  return (
    <div className="flex w-[390px] flex-col bg-[#f8f6fd] text-[#0e0727]">
      <header className="sticky top-0 z-20 bg-white pt-[15px] shadow-[0_34px_38px_rgba(153,134,217,0.06)]">
        <div className="flex h-[47px] w-full items-center px-[20px]">
          <button
            type="button"
            aria-label="Quay lại"
            onClick={onBack}
            className="flex size-[30px] shrink-0 items-center justify-center"
          >
            <FigmaIcon name="notebook-detail-back" style={{ transform: 'rotate(90deg)' }} />
          </button>
          <h1 className="min-w-0 flex-1 truncate text-center text-[18px] leading-[28px] font-medium">
            AI Suggestions
          </h1>
          <button type="button" aria-label="Cài đặt gợi ý" className="flex size-[30px] shrink-0 items-center justify-center">
            <FigmaIcon name="ai-suggestions-settings" size={28} />
          </button>
        </div>

        <div className="flex h-[44px] w-full px-[20px] text-[14px] leading-[20px] font-medium tracking-[0.4px]">
          {([
            ['all', 'Tất cả (6)'],
            ['new', 'Mới (2)'],
            ['ignored', 'Đã bỏ qua'],
          ] as const).map(([tab, label]) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex min-w-0 flex-1 items-center justify-center border-b-[1.6px] px-[4px] ${activeTab === tab ? 'border-[#7758e2] text-[#7758e2]' : 'border-transparent text-[#9490a2]'}`}
            >
              <span className="truncate">{label}</span>
            </button>
          ))}
        </div>
      </header>

      <div className="flex w-full flex-col gap-[15px] pt-[15px]">
        {GROUPS.map((group) => {
          const entries = visibleSuggestions.filter((item) => item.group === group);
          if (!entries.length) return null;
          return (
            <section key={group} className="w-full rounded-[20px] bg-white p-[20px] shadow-[0_4px_8px_rgba(0,0,0,0.06)]">
              <h2 className="mb-[9px] text-[14px] leading-[20px] font-medium tracking-[0.4px]">{group}</h2>
              {entries.map((suggestion, index) => (
                <SuggestionRow
                  key={suggestion.id}
                  suggestion={suggestion}
                  withDivider={index < entries.length - 1}
                  onReview={() => onReview(suggestion.id)}
                />
              ))}
            </section>
          );
        })}

        {visibleSuggestions.length === 0 && (
          <div className="mx-[17px] rounded-[20px] bg-white px-[20px] py-[36px] text-center text-[14px] leading-[20px] text-[#9490a2]">
            Chưa có gợi ý nào trong mục này.
          </div>
        )}
      </div>
    </div>
  );
};
