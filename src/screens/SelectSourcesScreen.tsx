import React, { useState } from 'react';
import { useMneme } from '../state/mnemeContext';
import { FigmaIcon } from '../components/common/FigmaIcon';

interface SelectSourcesScreenProps {
  fromFolder?: boolean;
  onBack: () => void;
  onSynthesize: (sourceIds: number[]) => void;
}

/**
 * Showcase source content, Figma node 2172:4631 (Section 9's "Chọn nội dung"
 * step). The node's first four rows carry specific research/AI copy instead
 * of the legacy node's lorem-ipsum text; each row's photo was exported from
 * its own node (2172:4655/4672/4689/4706) and verified by cropped screenshot,
 * not assumed from list order.
 */
interface ShowcaseSource {
  image: string;
  title: string;
  source: string;
  author: string;
  tags: readonly [string, string];
}

const N2172 = '/assets/images/figma_2172';

const SHOWCASE_SOURCES: readonly ShowcaseSource[] = [
  {
    image: `${N2172}/2172_4631_source_1_ai_network.jpg`,
    title: 'Cách đặt câu hỏi research để AI trả lời đúng trọng tâm',
    source: 'YouTube',
    author: 'AI Work Notes',
    tags: ['AI Workflow', 'Research'],
  },
  {
    image: `${N2172}/2172_4631_source_2_info_sign.jpg`,
    title: 'Research nhiều nguồn mà không bị loạn thông tin',
    source: 'X',
    author: '@research.notes',
    tags: ['AI Workflow', 'Research'],
  },
  {
    image: `${N2172}/2172_4631_source_3_ai_robot.jpg`,
    title: 'Dùng AI để tìm pattern trong dữ liệu research',
    source: 'TikTok',
    author: 'Insight Lab',
    tags: ['AI Workflow', 'Research'],
  },
  {
    image: `${N2172}/2172_4631_source_4_travel_rome.jpg`,
    title: 'Những lỗi dễ gặp khi research địa điểm du lịch',
    source: 'X',
    author: '@travel.smart',
    tags: ['Du lịch', 'Lập kế hoạch'],
  },
  {
    image: `${N2172}/2172_4631_source_generic_figma_dock.jpg`,
    title: 'Morem ipsum dolor sit amet, consectetur adipiscing elit.',
    source: 'TikTok',
    author: '@demo.creator',
    tags: ['AI Workflow', 'Research'],
  },
  {
    image: `${N2172}/2172_4631_source_generic_figma_dock.jpg`,
    title: 'Morem ipsum dolor sit amet, consectetur adipiscing elit.',
    source: 'TikTok',
    author: '@demo.creator',
    tags: ['AI Workflow', 'Research'],
  },
] as const;

const ProgressHeader: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <header className="absolute top-[15px] left-0 h-[125px] w-full rounded-b-[16px] bg-white" style={{ boxShadow: '0 34px 38px rgba(153,134,217,0.06)' }}>
    <button type="button" aria-label="Quay lại" onClick={onBack} className="absolute top-0 left-[20px] size-[30px]">
      <FigmaIcon name="select-sources-back" style={{ transform: 'rotate(180deg)' }} />
    </button>
    <h1 className="absolute top-0 left-[58px] flex h-[30px] w-[255px] items-center justify-center text-[18px] leading-[28px] font-medium text-[#0e0727]">Tạo sổ tay mới</h1>

    <div className="absolute top-[69px] left-[58px] h-[3px] w-[271px] bg-[#f2f2f3]" />
    <div className="absolute top-[50px] left-[18px] flex w-[100px] flex-col items-center gap-[2px]">
      <div className="flex size-[38px] items-center justify-center rounded-full bg-[#7758e2]" style={{ boxShadow: '0 0 0 2px #c0b2f2' }}>
        <FigmaIcon name="select-progress-sources" />
      </div>
      <p className="whitespace-nowrap text-[14px] leading-[20px] font-medium tracking-[0.4px] text-[#7758e2]">Chọn nội dung</p>
    </div>
    <div className="absolute top-[50px] left-[146px] flex w-[96px] flex-col items-center gap-[2px]">
      <div className="flex size-[32px] items-center justify-center rounded-full bg-[#f5f5f7]">
        <FigmaIcon name="select-progress-ai" />
      </div>
      <p className="whitespace-nowrap text-[14px] leading-[20px] font-medium tracking-[0.4px] text-[#9490a2]">AI phân tích</p>
    </div>
    <div className="absolute top-[50px] left-[272px] flex w-[96px] flex-col items-center gap-[2px]">
      <div className="flex size-[32px] items-center justify-center rounded-full bg-[#f5f5f7]">
        <FigmaIcon name="select-progress-notebook" />
      </div>
      <p className="whitespace-nowrap text-[14px] leading-[20px] font-medium tracking-[0.4px] text-[#9490a2]">Tạo sổ tay</p>
    </div>
  </header>
);

interface SourceRowProps {
  content: ShowcaseSource;
  selected: boolean;
  onToggle: () => void;
}

const SourceRow: React.FC<SourceRowProps> = ({ content, selected, onToggle }) => (
  <button type="button" onClick={onToggle} className="flex h-[112px] w-[350px] items-center gap-[10px] text-left">
    <FigmaIcon name={selected ? 'select-radio-selected' : 'select-radio-empty'} />
    <div
      className="flex h-[112px] w-[316px] items-center gap-[10px] overflow-hidden rounded-[16px] bg-white p-[8px]"
      style={selected ? { boxShadow: '0 4px 8px rgba(0,0,0,0.06), 0 0 4px rgba(0,0,0,0.04)' } : undefined}
    >
      <div className="relative size-[80px] shrink-0 overflow-hidden rounded-[15px]">
        <img src={content.image} alt="" className="size-full rounded-[15px] object-cover" />
        <span className="absolute top-[58px] left-[40px] rounded-[15px] bg-[#0e0727] px-[8px] py-[2px] text-[10px] leading-[13px] font-normal tracking-[0.06px] whitespace-nowrap text-white">2:12</span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col items-start justify-center gap-[8px] overflow-hidden">
        <p className="line-clamp-2 w-full overflow-hidden text-[14px] leading-[20px] font-normal tracking-[0px] text-black underline">{content.title}</p>
        <div className="flex w-full items-center gap-[4px] overflow-hidden text-[12px] leading-[16px] font-normal tracking-[0.4px] whitespace-nowrap text-[#9490a2]">
          <span className="shrink-0">{content.source}</span><FigmaIcon name="select-dot" /><span className="min-w-0 truncate">{content.author}</span>
        </div>
        <div className="flex w-full gap-[8px] overflow-hidden">
          <span className="min-w-0 shrink truncate rounded-[24px] bg-[#f2f2f3] px-[12px] py-[4px] text-[12px] leading-[16px] font-normal text-[#0e0727]">{content.tags[0]}</span>
          <span className="min-w-0 shrink truncate rounded-[24px] bg-[#f1eefc] px-[12px] py-[4px] text-[12px] leading-[16px] font-normal text-[#7758e2]">{content.tags[1]}</span>
        </div>
      </div>
    </div>
  </button>
);

/**
 * Source selection — Figma node 2159:13570, restaged with showcase content
 * per node 2172:4631. The row visuals are the specific research/AI sources
 * above; `sourceIds` still resolves through the real `links` array by
 * position so "Tiếp tục" keeps producing a notebook `addNotebook` can save.
 */
export const SelectSourcesScreen: React.FC<SelectSourcesScreenProps> = ({ onBack, onSynthesize }) => {
  const { links } = useMneme();
  // The third selected source sits below the static Figma viewport and becomes
  // visible when this real phone view is scrolled.
  const [selected, setSelected] = useState([true, false, true, false, true, false]);

  const toggle = (index: number) => setSelected((current) => current.map((value, i) => i === index ? !value : value));
  const selectedCount = selected.filter(Boolean).length;
  const selectedIds = selected.flatMap((value, index) => value && links[index] ? [links[index].id] : []);

  return (
    <div className="relative min-h-[1090px] w-[390px] overflow-visible bg-white text-[#0e0727]">
      <ProgressHeader onBack={onBack} />

      <section className="absolute top-[155px] left-0 flex w-full flex-col items-start gap-[16px] rounded-[20px] bg-white p-[20px]">
        <div className="flex h-[46px] w-[350px] items-center gap-[18px]">
          <div className="flex h-[46px] min-w-0 flex-1 items-center gap-[10px] rounded-[11px] bg-[#f5f5f7] px-[8px] py-[12px]">
            <FigmaIcon name="select-search" />
            <span className="text-[16px] leading-[22px] font-normal tracking-[-0.18px] whitespace-nowrap text-[#9490a2]">Enter search terms...</span>
          </div>
          <FigmaIcon name="select-filter" />
        </div>

        <div className="flex gap-[8px]">
          {['Tất cả', 'Bài viết', 'Video', 'Website'].map((label, index) => (
            <button key={label} type="button" className={`flex h-[28px] w-[70px] items-center justify-center rounded-[24px] text-[12px] leading-[16px] font-extrabold tracking-[0.4px] ${index === 0 ? 'bg-[#f1eefc] text-[#7758e2]' : 'bg-[#f5f5f7] text-[#9490a2]'}`}>{label}</button>
          ))}
        </div>

        {/* Figma's list group starts one raster row below the nominal flex sum. */}
        <div className="relative top-[1px] flex w-full flex-col items-start gap-[10px]">
          <p className="h-[19px] text-[14px] leading-[19px] font-medium tracking-[-0.28px]">Gần đây</p>
          {selected.map((isSelected, index) => (
            <SourceRow key={index} content={SHOWCASE_SOURCES[index]} selected={isSelected} onToggle={() => toggle(index)} />
          ))}
        </div>
      </section>

      <div className="sticky top-[692px] z-20 mt-[692px] ml-[20px] flex h-[62px] w-[350px] items-center gap-[43px] rounded-[38px] bg-[#7758e2] px-[16px] py-[12px]">
        <button type="button" onClick={() => setSelected(selected.map(() => false))} className="min-w-0 flex-1 text-left font-['Inter',sans-serif] text-[14px] leading-[19px] font-normal tracking-[-0.28px] text-white">Bỏ chọn {selectedCount} mục</button>
        <button type="button" disabled={selectedCount === 0} onClick={() => onSynthesize(selectedIds)} className="rounded-[24px] bg-[#f7f7f8] px-[30px] py-[8px] text-[16px] leading-[22px] font-medium tracking-[-0.18px] whitespace-nowrap text-[#7758e2] disabled:opacity-50">Tiếp tục</button>
      </div>
    </div>
  );
};
