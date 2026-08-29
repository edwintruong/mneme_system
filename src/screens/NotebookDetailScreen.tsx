import React, { useState } from 'react';
import { Notebook } from '../types';
import { FigmaIcon } from '../components/common/FigmaIcon';

interface NotebookDetailScreenProps {
  notebook: Notebook;
  onBack: () => void;
  onOpenReading: (notebook: Notebook) => void;
}

/**
 * Notebook detail (Mục lục tab) — Figma node 2159:12842, restaged per-notebook
 * by nodes 2172:4487 (Research), 2172:5069 (Món ăn), 2172:5118 (AI Tips), and
 * 2172:5167 (Travel). All four share this one component/layout; only
 * `notebook.outline` differs. "Xem sổ tay" opens a separate reading screen
 * (`NotebookReadingScreen`, nodes 2172:4589/5216/5256/5296) — confirmed a
 * distinct screen (its own header/back target), not a scrolled state of this
 * one.
 */
export const NotebookDetailScreen: React.FC<NotebookDetailScreenProps> = ({
  notebook,
  onBack,
  onOpenReading,
}) => {
  // Persisted records may predate the outline schema. The provider migrates
  // them, and this boundary keeps rendering safe even if a future caller
  // supplies a partial record before persistence.
  const outline = Array.isArray(notebook.outline) ? notebook.outline : [];
  const [activeTab, setActiveTab] = useState<'contents' | 'info'>('contents');
  const [expandedNumber, setExpandedNumber] = useState<string | null>(
    outline.find((item) => item.defaultExpanded)?.number ?? null,
  );
  const isVectorCover = notebook.image?.endsWith('.svg') ?? false;

  return (
    <div className="relative flex w-[390px] flex-col items-start bg-white text-[#0e0727]">
      {/*
        Header + cover + tabs, height 411px — the original single-notebook
        version's pixel-verified content-start offset (top-[411px]), now used as
        a fixed wrapper height instead. Confirmed constant across all four
        notebooks via Figma metadata (the tabs+content wrapper always starts at
        the same y with a 48px-tall tabs row and the same gap to content), so
        this part can stay absolutely positioned exactly as before. Only the
        TOC/reading content below varies in height per notebook, so it — and the
        footer after it — use normal flow instead.
      */}
      <div className="relative h-[411px] w-full shrink-0">
        <button
          type="button"
          aria-label="Quay lại"
          onClick={onBack}
          className="absolute top-[15px] left-[20px] flex size-[30px] items-center justify-center"
        >
          <FigmaIcon name="notebook-detail-back" style={{ transform: 'rotate(90deg)' }} />
        </button>
        <button
          type="button"
          aria-label="Tùy chọn sổ tay"
          className="absolute top-[18px] right-[20px] flex size-[24px] items-center justify-center"
        >
          <FigmaIcon name="notebook-detail-more" style={{ transform: 'rotate(90deg)' }} />
        </button>

        <section className="absolute top-[63px] left-[20px] h-[280px] w-[350px] overflow-hidden rounded-[30px] text-white">
          <FigmaIcon name="notebook-detail-cover" className="absolute inset-0" />
          <div className="absolute top-[20px] left-[22px] flex size-[85px] items-center justify-center overflow-hidden rounded-[12.935px] bg-black">
            {isVectorCover ? (
              <FigmaIcon name="notebook-detail-logo" />
            ) : (
              <img src={notebook.image} alt="" className="size-full object-cover" />
            )}
          </div>
          <button
            type="button"
            aria-label="Đã đánh dấu yêu thích"
            className="absolute top-[20px] right-[22px] flex size-[40px] items-center justify-center rounded-full bg-white/20 backdrop-blur-[6.15px]"
          >
            <FigmaIcon name="notebook-detail-star" size={20} />
          </button>
          <div className="absolute top-[125px] left-[23px] flex w-[308px] flex-col items-start gap-[7px] text-[#f4f1fd]">
            <div className="flex w-full items-center gap-[12px]">
              <h1 className="shrink-0 whitespace-nowrap text-[24px] leading-[30px] font-bold tracking-[-0.15px]">
                {notebook.title}
              </h1>
              <span className="relative size-[24px] shrink-0 overflow-hidden">
                <FigmaIcon name="notebook-detail-edit" className="absolute top-[3px] left-[6px]" />
              </span>
            </div>
            <p className="w-full text-[16px] leading-[22px] font-normal tracking-[-0.18px]">{notebook.meta}</p>
            <p className="w-full text-[16px] leading-[22px] font-medium tracking-[-0.18px]">
              {notebook.summary}
            </p>
            <div className="flex w-full items-center gap-[9px]">
              <FigmaIcon name="notebook-detail-ai" />
              <p className="w-[138px] text-[14px] leading-[20px] font-normal tracking-[0px]">Tạo bởi AI {notebook.createdAt}</p>
            </div>
          </div>
        </section>

        <div className="absolute top-[352px] left-[20px] flex h-[48px] w-[350px]">
          <button
            type="button"
            onClick={() => setActiveTab('contents')}
            className={`relative flex h-[48px] w-[175px] items-center justify-center border-b text-[16px] leading-[24px] font-medium tracking-[0px] ${activeTab === 'contents' ? 'border-b-2 border-[#a48fec] text-[#7758e2]' : 'border-[#f2f2f3] text-[#9490a2]'}`}
          >
            Mục lục
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`relative flex h-[48px] w-[175px] items-center justify-center border-b text-[16px] leading-[24px] font-medium tracking-[0px] ${activeTab === 'info' ? 'border-b-2 border-[#a48fec] text-[#7758e2]' : 'border-[#f2f2f3] text-[#9490a2]'}`}
          >
            Thông tin
          </button>
        </div>
      </div>

      {activeTab === 'contents' ? (
        <div className="ml-[41px] flex w-[308px] flex-col items-start gap-[16px] text-[16px] leading-[24px] font-medium tracking-[0px]">
          {outline.map((item) => {
            const isExpanded = expandedNumber === item.number;
            return (
              <div key={item.number} className="flex w-full flex-col items-center justify-center gap-[8px]">
                <button
                  type="button"
                  onClick={item.subItems ? () => setExpandedNumber((current) => (current === item.number ? null : item.number)) : undefined}
                  className="flex w-full items-center text-left"
                >
                  <span className="w-[22px] shrink-0">{item.number}</span>
                  <span className="w-[205px] shrink-0">{item.title}</span>
                  <span className="flex min-w-0 flex-1 items-center justify-end">
                    {item.subItems ? (
                      <span className="flex size-[24px] items-center justify-center">
                        <FigmaIcon name="notebook-detail-direction" style={{ transform: isExpanded ? 'rotate(180deg)' : undefined }} />
                      </span>
                    ) : (
                      <FigmaIcon name="notebook-detail-dropdown" size={24} />
                    )}
                  </span>
                </button>
                {item.subItems && isExpanded && (
                  <div className="flex w-[248px] flex-col items-center justify-center gap-[5px] border-l-[1.5px] border-[#f2f2f3] text-[14px] leading-[20px] font-normal tracking-[0px]">
                    {item.subItems.map((sub) => (
                      <div key={sub.number} className="flex w-[211px] items-center justify-center gap-[3px]">
                        <p className="w-[23px] shrink-0">{sub.number}</p>
                        <p className="w-[185px] shrink-0">{sub.title}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-[15px] ml-[40px] w-[310px] text-[14px] leading-[22px] tracking-[0.2px] text-[#9490a2]">
          {notebook.description}
        </div>
      )}

      {/*
        49px below the content block regardless of its height — confirmed
        constant across all four notebooks (their Button y-offset always sits
        exactly 49px past their tabs+content block's own end).
      */}
      <div className="mt-[49px] mb-[24px] ml-[15px] flex gap-[12px]">
        <button
          type="button"
          className="flex h-[48px] w-[174px] items-center justify-center gap-[10px] rounded-[16px] bg-[#f1eefc] text-[16px] leading-[22px] font-medium tracking-[-0.18px]"
        >
          <FigmaIcon name="notebook-detail-share" />
          Chia sẻ
        </button>
        <button
          type="button"
          onClick={() => onOpenReading(notebook)}
          className="flex h-[48px] w-[174px] items-center justify-center gap-[10px] rounded-[16px] bg-[#7758e2] text-[16px] leading-[22px] font-medium tracking-[-0.18px] text-white"
        >
          <FigmaIcon name="notebook-detail-open-book" />
          Xem sổ tay
        </button>
      </div>
    </div>
  );
};
