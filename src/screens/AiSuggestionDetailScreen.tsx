import React, { useState } from 'react';
import { AiSuggestion, AiSuggestionItem } from '../data/aiSuggestions';
import { FigmaIcon } from '../components/common/FigmaIcon';

interface AiSuggestionDetailScreenProps {
  suggestion: AiSuggestion;
  onBack: () => void;
  onChooseNotebook: () => void;
  onIgnore: () => void;
}

const SuggestionResource: React.FC<{ item: AiSuggestionItem }> = ({ item }) => (
  <div className="flex w-full min-w-0 items-center gap-[10px] py-[10px] pb-[16px]">
    <div className="size-[80px] shrink-0 overflow-hidden rounded-[15px]">
      <img src={item.image} alt="" className="size-full object-cover" />
    </div>
    <div className="flex w-[143px] min-w-0 shrink-0 flex-col items-start justify-center gap-[8px]">
      <p className="w-full break-words text-[16px] leading-[24px] font-medium text-[#0e0727]">
        {item.title}
      </p>
      <div className="flex w-full min-w-0 items-center gap-[4px] text-[12px] leading-[16px] tracking-[0.4px] text-[#9490a2]">
        <span className="shrink-0">{item.source}</span>
        <span className="size-[3px] shrink-0 rounded-full bg-[#9490a2]" />
        <span className="min-w-0 truncate">{item.author}</span>
      </div>
      <a
        href={item.url}
        target="_blank"
        rel="noreferrer"
        className="block w-full truncate text-[12px] leading-[16px] tracking-[0.4px] text-[#0e0727] underline"
      >
        {item.url}
      </a>
    </div>
    <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-[4px] text-center font-medium text-[#31cf37]">
      <p className="w-full text-[16px] leading-[24px]">{item.score}%</p>
      <p className="w-full text-[12px] leading-[16px] tracking-[0.4px]">Phù hợp</p>
    </div>
  </div>
);

const ReasonList: React.FC<{ reasons: AiSuggestionItem['reasons'] }> = ({ reasons }) => (
  <div className="flex w-full flex-col items-start rounded-[16px] bg-[#f8f6fd] p-[12px]">
    <h3 className="w-full text-[14px] leading-[20px] font-medium tracking-[0.4px] text-[#0e0727]">
      Vì sao AI đề xuất ?
    </h3>
    {reasons.map((reason) => {
      // This sentence is one line in node 2172:5510. Give it the box's 12px
      // trailing inset as usable line width while keeping its right edge
      // inside the lavender reason area.
      const usesTrailingInset = reason === 'Có ví dụ minh họa từng bước, dễ áp dụng ngay';
      return (
        <div key={reason} className="flex w-full min-w-0 items-center gap-[8px] py-[4px]">
          <span className="flex h-[28px] shrink-0 items-center px-[4.667px] py-[6.222px]">
            <FigmaIcon name="ai-suggestions-check" size={18.667} />
          </span>
          <p className={`min-w-0 flex-1 break-words text-[14px] leading-[20px] text-[#0e0727] ${usesTrailingInset ? '-mr-[12px] whitespace-nowrap tracking-[-0.3px]' : ''}`}>
            {reason}
          </p>
        </div>
      );
    })}
  </div>
);

const ResourceActions: React.FC<{
  added: boolean;
  onAdd: () => void;
  onChooseNotebook: () => void;
  onIgnore: () => void;
}> = ({ added, onAdd, onChooseNotebook, onIgnore }) => (
  <div className="flex w-full flex-col items-center justify-center gap-[12px]">
    <button
      type="button"
      onClick={onAdd}
      className="flex h-[48px] w-full items-center justify-center rounded-[16px] bg-[#7758e2] px-[16px] text-[16px] leading-[22px] font-medium tracking-[-0.18px] text-white"
    >
      {added ? 'Đã thêm vào sổ tay' : 'Thêm vào sổ tay'}
    </button>
    <button
      type="button"
      onClick={onChooseNotebook}
      className="flex h-[48px] w-full items-center justify-center rounded-[16px] bg-[#f1eefc] px-[16px] text-[16px] leading-[22px] font-medium tracking-[-0.18px] text-[#0e0727]"
    >
      Chọn sổ tay khác
    </button>
    <button type="button" onClick={onIgnore} className="h-[19px] text-[14px] leading-[19px] tracking-[-0.28px] text-[#0e0727]">
      Bỏ qua
    </button>
  </div>
);

/** Data-driven review screens for nodes 2172:5510, 5409, 5614 and 5717. */
export const AiSuggestionDetailScreen: React.FC<AiSuggestionDetailScreenProps> = ({
  suggestion,
  onBack,
  onChooseNotebook,
  onIgnore,
}) => {
  const [addedIds, setAddedIds] = useState<string[]>([]);
  const headerBodyHeight = suggestion.headerHeight - 44;

  return (
    <div className="flex w-[390px] flex-col bg-[#f8f6fd] text-[#0e0727]">
      <header
        className="relative w-full shrink-0 overflow-hidden rounded-b-[12px] bg-gradient-to-b from-[#2e1442] to-[#18122b] text-[#f4f1fd]"
        style={{ height: headerBodyHeight, marginBottom: -36 }}
      >
        <div className="absolute top-[2px] left-[24px] flex h-[30px] w-[342px] items-center justify-between">
          <button type="button" aria-label="Quay lại" onClick={onBack} className="flex size-[30px] items-center justify-center">
            <FigmaIcon name="ai-suggestions-back" size={30} style={{ transform: 'rotate(90deg)' }} />
          </button>
          <button type="button" aria-label="Tùy chọn" className="flex size-[24px] items-center justify-center">
            <FigmaIcon name="ai-suggestions-more" size={24} style={{ transform: 'rotate(90deg)' }} />
          </button>
        </div>

        <div className="absolute top-[40px] left-[24px] flex w-[342px] items-center gap-[20px] px-[0px]">
          <div className="size-[64px] shrink-0 overflow-hidden rounded-[12px] bg-black">
            <img src={suggestion.notebookImage} alt="" className="size-full object-cover" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col items-start gap-[7px]">
            <h1 className="w-full break-words text-[18px] leading-[28px] font-bold">
              {suggestion.notebookTitle}
            </h1>
            <p className="w-full break-words text-[14px] leading-[20px] font-medium tracking-[0.4px]">
              {suggestion.notebookDescription}
            </p>
            <div className="flex w-full items-center gap-[9px]">
              <FigmaIcon name="ai" size={20} />
              <p className="min-w-0 truncate text-[14px] leading-[20px]">Tạo bởi AI 2/2/2022</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex w-full flex-col items-center gap-[15px] px-[17px] pb-[24px]">
        {suggestion.items.map((item, index) => {
          const added = addedIds.includes(item.id);
          return (
            <section key={item.id} className="flex w-full flex-col items-start gap-[10px] rounded-[20px] bg-white px-[16px] py-[20px]">
              {index === 0 && (
                <div className="flex w-full items-center gap-[16px]">
                  <h2 className="min-w-0 flex-1 text-[14px] leading-[20px] font-medium tracking-[0.4px]">
                    {suggestion.contentLabel}
                  </h2>
                  <div className="flex min-w-0 flex-1 items-center justify-end gap-[4px]">
                    <span className="truncate text-right text-[14px] leading-[20px] tracking-[0.4px]">Độ phù hợp</span>
                    <FigmaIcon name="ai-arrow" size={20} style={{ transform: 'rotate(180deg)' }} />
                  </div>
                </div>
              )}
              <SuggestionResource item={item} />
              <ReasonList reasons={item.reasons} />
              <ResourceActions
                added={added}
                onAdd={() => setAddedIds((current) => current.includes(item.id) ? current : [...current, item.id])}
                onChooseNotebook={onChooseNotebook}
                onIgnore={onIgnore}
              />
            </section>
          );
        })}
      </div>
    </div>
  );
};
