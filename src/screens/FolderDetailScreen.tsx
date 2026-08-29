import React, { useState } from 'react';
import { SavedLink } from '../types';
import { useMneme } from '../state/mnemeContext';
import { FigmaIcon } from '../components/common/FigmaIcon';

interface FolderDetailScreenProps {
  folderName: string;
  onBack: () => void;
  onSelectLink: (link: SavedLink) => void;
  onAddNewLink: (folderName: string) => void;
}

const FILTERS = ['Tất cả', 'Bài viết', 'Video', 'Ảnh'] as const;

const FolderLinkRow: React.FC<{ link: SavedLink; onClick: () => void }> = ({ link, onClick }) => (
  <button type="button" onClick={onClick} className="flex h-[112px] w-[318px] items-center gap-[10px] text-left">
    <span className="flex h-[112px] min-w-0 flex-1 items-center gap-[10px] rounded-[16px] bg-white p-[8px]">
      <span className="relative size-[80px] shrink-0 overflow-hidden rounded-[15px]">
        <img src={link.image} alt="" className="pointer-events-none absolute inset-0 size-full rounded-[15px] object-cover" />
        {link.duration && (
          <span className="absolute top-[58px] left-[40px] flex items-center justify-center rounded-[15px] bg-[#0e0727] px-[8px] py-[2px] text-[10px] leading-[13px] font-normal tracking-[0.06px] whitespace-nowrap text-white">{link.duration}</span>
        )}
      </span>
      <span className="flex h-[96px] min-w-0 flex-1 flex-col items-start justify-center gap-[8px]">
        <span className="line-clamp-2 min-h-[40px] w-full min-w-0 flex-1 text-[14px] leading-[20px] font-normal text-black underline [text-underline-position:from-font]">
          {link.title}
        </span>
        <span className="flex w-full shrink-0 items-center gap-[4px] overflow-hidden text-[12px] leading-[16px] font-normal tracking-[0.4px] whitespace-nowrap text-[#9490a2]">
          <span className="shrink-0">{link.source}</span>
          <FigmaIcon name="folder-dot" />
          <span className="min-w-0 truncate">{link.author}</span>
        </span>
        <span className="flex w-full shrink-0 items-start gap-[8px] overflow-hidden">
          {link.tags[0] && (
            <span className="flex min-w-0 items-center justify-center truncate rounded-[24px] bg-[#f2f2f3] px-[12px] py-[4px] text-[12px] leading-[16px] font-normal whitespace-nowrap text-[#0e0727]">{link.tags[0]}</span>
          )}
          {link.tags[1] && (
            <span className="flex min-w-0 items-center justify-center truncate rounded-[24px] bg-[#f1eefc] px-[12px] py-[4px] text-[12px] leading-[16px] font-normal whitespace-nowrap text-[#7758e2]">{link.tags[1]}</span>
          )}
        </span>
      </span>
      <span className="relative size-[18px] shrink-0 rotate-180 overflow-hidden">
        <FigmaIcon name="folder-more-vertical-detail" className="absolute top-[3.75px] left-[7.5px]" />
      </span>
    </span>
  </button>
);

/** Empty `2159:13158` and populated `2159:13174` folder-detail states. */
export const FolderDetailScreen: React.FC<FolderDetailScreenProps> = ({
  folderName,
  onBack,
  onSelectLink,
  onAddNewLink,
}) => {
  const { links } = useMneme();
  const [filter, setFilter] = useState<string>(FILTERS[0]);
  const folderLinks = links.filter((link) => link.folder === folderName).slice(0, 5);
  const isEmpty = folderLinks.length === 0;

  return (
    <div className="flex w-[390px] shrink-0 flex-col items-start gap-[12px] overflow-visible bg-[#f8f6fd] px-[20px] py-[16px] font-['Roboto',sans-serif]">
      <header className="flex h-[30px] w-[350px] items-center justify-center gap-[8px] px-[20px]">
        <button type="button" onClick={onBack} aria-label="Quay lại" className="flex h-[30px] w-[30px] shrink-0 items-center">
          <FigmaIcon name={isEmpty ? 'folder-empty-back' : 'folder-back'} style={{ transform: 'rotate(180deg)' }} />
        </button>
        <div className="flex h-full min-w-0 flex-1 items-center justify-center">
          <h1 className="block h-full min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-center text-[18px] leading-[30px] font-medium text-[#0e0727]">{folderName}</h1>
        </div>
        <span className="h-[30px] w-[24px] shrink-0" />
        <button type="button" aria-label="Thêm tùy chọn" className="flex size-[24px] shrink-0 items-center justify-center">
          <FigmaIcon name={isEmpty ? 'folder-empty-more' : 'folder-more-horizontal'} />
        </button>
      </header>

      {isEmpty ? (
        <section className="flex h-[706px] w-[356px] shrink-0 flex-col items-center justify-center gap-[20px] rounded-[20px] bg-white px-[16px] pt-[10px] pb-[20px] shadow-[0_0_4px_rgba(0,0,0,0.04),0_4px_8px_rgba(0,0,0,0.06)]">
          <img src="/assets/images/figma_2159/2159_13158_empty.png" alt="" className="h-[78px] w-[117px] shrink-0 object-cover" />
          <div className="flex w-full shrink-0 flex-col items-start gap-[20px]">
            <p className="w-full text-center text-[14px] leading-[20px] font-normal tracking-[0.4px] text-[#9490a2]">Chưa có liên kết nào trong thư mục này</p>
            <button
              type="button"
              onClick={() => onAddNewLink(folderName)}
              className="flex h-[46px] w-full items-center justify-center gap-[10px] rounded-[16px] bg-[#7758e2] px-[16px] py-[12px] text-[16px] leading-[22px] font-medium tracking-[-0.18px] text-white"
            >
              <span>Thêm liên kết</span>
              <FigmaIcon name="folder-empty-add" />
            </button>
          </div>
        </section>
      ) : (
        <>
          <div className="flex h-[70px] w-[350px] shrink-0 flex-col items-start overflow-hidden rounded-[30px] bg-white p-[12px]">
            <div className="flex h-[46px] w-[326px] items-center justify-center gap-[18px]">
              <button type="button" className="flex h-[46px] min-w-0 flex-1 items-center gap-[10px] rounded-[11px] bg-[#f5f5f7] px-[8px] py-[12px]">
                <FigmaIcon name="folder-search" />
                <span className="whitespace-nowrap text-[16px] leading-[22px] font-normal tracking-[-0.18px] text-[#9490a2]">Enter search terms...</span>
              </button>
              <button type="button" aria-label="Bộ lọc" className="size-[36px] shrink-0"><FigmaIcon name="folder-filter" /></button>
            </div>
          </div>

          <div className="flex h-[722px] w-[350px] shrink-0 flex-col items-start gap-[20px] rounded-[20px] bg-white px-[16px] py-[20px] shadow-[0_0_2px_rgba(0,0,0,0.04),0_4px_4px_rgba(0,0,0,0.06)]">
            <div className="flex h-[28px] shrink-0 items-start gap-[10px] overflow-hidden">
              {FILTERS.map((label) => {
                const selected = filter === label;
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setFilter(label)}
                    className={`flex h-[28px] w-[70px] shrink-0 items-center justify-center rounded-[24px] px-[10px] py-[6px] text-[12px] leading-[16px] font-extrabold tracking-[0.4px] ${selected ? 'bg-[#f1eefc] text-[#7758e2]' : 'bg-[#f5f5f7] text-[#9490a2]'}`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <section className="flex h-[634px] w-[318px] shrink-0 flex-col items-start gap-[10px]">
              <div className="flex h-[24px] w-full items-center gap-[10px]">
                <h2 className="min-w-0 flex-1 text-[14px] leading-[20px] font-medium tracking-[0.4px] text-[#0e0727]">Tất cả links</h2>
                <button type="button" onClick={() => onAddNewLink(folderName)} aria-label="Thêm link" className="flex size-[24px] shrink-0 items-center justify-center rounded-full bg-[#7758e2]">
                  <FigmaIcon name="folder-detail-plus" />
                </button>
              </div>
              {folderLinks.map((link) => <FolderLinkRow key={link.id} link={link} onClick={() => onSelectLink(link)} />)}
            </section>
          </div>
        </>
      )}
    </div>
  );
};
