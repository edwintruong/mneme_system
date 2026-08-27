import React, { useState } from 'react';
import { Notebook } from '../types';
import { FigmaIcon } from '../components/common/FigmaIcon';

interface NotebookDetailScreenProps {
  notebook: Notebook;
  onBack: () => void;
  onOpenSuggestions: (notebook: Notebook) => void;
}

/** Notebook detail — Figma node 2159:12842. */
export const NotebookDetailScreen: React.FC<NotebookDetailScreenProps> = ({
  notebook,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'contents' | 'info'>('contents');
  const [insightOpen, setInsightOpen] = useState(true);

  return (
    <div className="relative h-full min-h-[800px] w-[390px] overflow-hidden bg-white text-[#0e0727]">
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
        <div className="absolute top-[20px] left-[22px] flex size-[85px] items-center justify-center rounded-[12px] bg-black">
          <FigmaIcon name="notebook-detail-logo" />
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
          <p className="w-full text-[16px] leading-[22px] font-normal tracking-[-0.18px]">3 video - 12 phút đọc</p>
          <p className="w-full text-[16px] leading-[22px] font-medium tracking-[-0.18px]">
            Gợi ý cách đưa NotebookLM vào quy trình đọc, research và xử lý thông tin hằng ngày.
          </p>
          <div className="flex w-full items-center gap-[9px]">
            <FigmaIcon name="notebook-detail-ai" />
            <p className="w-[138px] text-[14px] leading-[20px] font-normal tracking-[0px]">Tạo bởi AI 2/2/2022</p>
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

      {activeTab === 'contents' ? (
        <div className="absolute top-[411px] left-[41px] flex w-[308px] flex-col items-start gap-[16px] text-[16px] leading-[24px] font-medium tracking-[0px]">
          <button type="button" className="flex w-full items-center text-left">
            <span className="w-[22px] shrink-0">1.</span>
            <span className="w-[205px] shrink-0">Chuẩn bị nguồn research</span>
            <span className="flex min-w-0 flex-1 justify-end"><FigmaIcon name="notebook-detail-dropdown" size={24} /></span>
          </button>
          <div className="flex w-full flex-col items-center justify-center gap-[8px]">
            <button
              type="button"
              onClick={() => setInsightOpen((open) => !open)}
              className="flex w-full items-center text-left"
            >
              <span className="w-[22px] shrink-0">2.</span>
              <span className="w-[202px] shrink-0">Hỏi AI để rút insight</span>
              <span className="flex min-w-0 flex-1 justify-end">
                <span className="flex size-[24px] items-center justify-center">
                  <FigmaIcon name="notebook-detail-direction" style={{ transform: insightOpen ? 'rotate(180deg)' : undefined }} />
                </span>
              </span>
            </button>
            {insightOpen && (
              <div className="flex w-[248px] flex-col items-center justify-center gap-[5px] border-l-[1.5px] border-[#f2f2f3] text-[14px] leading-[20px] font-normal tracking-[0px]">
                {[
                  ['2.1', 'Tóm tắt từng nguồn'],
                  ['2.2', 'So sánh các quan điểm'],
                  ['2.2', 'Tìm pattern lặp lại'],
                ].map(([number, label]) => (
                  <div key={label} className="flex w-[211px] items-center justify-center gap-[3px]">
                    <p className="w-[23px] shrink-0">{number}</p>
                    <p className="w-[185px] shrink-0">{label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button type="button" className="flex w-full items-center text-left">
            <span className="w-[22px] shrink-0">3.</span>
            <span className="w-[205px] shrink-0">{' Biến kết quả thành ghi chú'}</span>
            <span className="flex min-w-0 flex-1 justify-end"><FigmaIcon name="notebook-detail-dropdown" size={24} /></span>
          </button>
          <button type="button" className="flex w-full items-center text-left">
            <span className="w-[22px] shrink-0">4.</span>
            <span className="w-[205px] shrink-0">Ứng dụng vào công việc</span>
            <span className="flex min-w-0 flex-1 justify-end"><FigmaIcon name="notebook-detail-dropdown" size={24} /></span>
          </button>
        </div>
      ) : (
        <div className="absolute top-[426px] left-[40px] w-[310px] text-[14px] leading-[22px] tracking-[0.2px] text-[#9490a2]">
          {notebook.description}
        </div>
      )}

      <div className="absolute top-[682px] left-[15px] flex gap-[12px]">
        <button
          type="button"
          className="flex h-[48px] w-[174px] items-center justify-center gap-[10px] rounded-[16px] bg-[#f1eefc] text-[16px] leading-[22px] font-medium tracking-[-0.18px]"
        >
          <FigmaIcon name="notebook-detail-share" />
          Chia sẻ
        </button>
        <button
          type="button"
          className="flex h-[48px] w-[174px] items-center justify-center gap-[10px] rounded-[16px] bg-[#7758e2] text-[16px] leading-[22px] font-medium tracking-[-0.18px] text-white"
        >
          <FigmaIcon name="notebook-detail-open-book" />
          Xem sổ tay
        </button>
      </div>
      <div className="absolute bottom-[8px] left-1/2 h-[5px] w-[144px] -translate-x-1/2 rounded-full bg-black" />
    </div>
  );
};
