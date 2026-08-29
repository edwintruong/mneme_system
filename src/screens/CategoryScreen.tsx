import React, { useState } from 'react';
import { MnemeCategory, SavedLink } from '../types';
import { useMneme } from '../state/mnemeContext';
import { FigmaIcon } from '../components/common/FigmaIcon';
import {
  CAKE_CATEGORY_LINK_IDS,
  MOVIE_CATEGORY_LINK_IDS,
  STUDY_CATEGORY_LINK_IDS,
  TRAVEL_CATEGORY_LINK_IDS,
} from '../data/seed';

interface CategoryScreenProps {
  category: MnemeCategory;
  onBack: () => void;
  onSelectFolder: (folderName: string) => void;
  onSelectLink: (link: SavedLink) => void;
  onAddLink: (category: MnemeCategory) => void;
}

const FILTERS = ['Tất cả', 'Bài viết', 'Video', 'Ảnh'] as const;

/**
 * Folder tiles shown per category. `Phim ảnh`'s order/count comes straight from nodes
 * 2159:13036 / 2172:5822 and is pixel-verified — do not reorder it. `Học tập & Công việc` and
 * `Du lịch` and `Công thức bánh` are matched to their Section 9 category frames.
 */
const CATEGORY_FOLDERS: Record<string, readonly string[]> = {
  'Học tập & Công việc': ['Ngoại ngữ', 'Kỹ năng làm việc', 'Tài liệu học tập', 'Công cụ AI'],
  'Phim ảnh': ['Phim Hàn', 'Phim kinh dị', 'Phim ngắn', 'Anime'],
  'Du lịch': ['Việt Nam', 'Nhật Bản', 'Đông Nam Á', 'Mẹo du lịch tiết kiệm'],
  'Công thức bánh': ['Bánh Âu', 'Bánh Á', 'Bánh không cần lò nướng', 'Trang trí bánh'],
};
const CATEGORY_FOLDER_COUNTS: Record<string, Record<string, number>> = {
  'Học tập & Công việc': {
    'Ngoại ngữ': 18,
    'Kỹ năng làm việc': 15,
    'Tài liệu học tập': 20,
    'Công cụ AI': 12,
  },
  'Du lịch': {
    'Việt Nam': 22,
    'Nhật Bản': 14,
    'Đông Nam Á': 16,
    'Mẹo du lịch tiết kiệm': 11,
  },
  'Công thức bánh': {
    'Bánh Âu': 16,
    'Bánh Á': 13,
    'Bánh không cần lò nướng': 19,
    'Trang trí bánh': 9,
  },
};
/** "Folders (6)" is exact storyboard copy rather than the number of visible tiles. */
const CATEGORY_FOLDER_LABEL: Record<string, string> = {
  'Học tập & Công việc': 'Folders (6)',
  'Du lịch': 'Folders (6)',
  'Phim ảnh': 'Folders (6)',
  'Công thức bánh': 'Folders (6)',
};
/** The view-all affordance stays live by opening the first available showcased folder. */
const CATEGORY_VIEW_ALL_FOLDER: Record<string, string> = {
  'Học tập & Công việc': 'Ngoại ngữ',
  'Du lịch': 'Việt Nam',
  'Phim ảnh': 'Phim tài liệu',
  'Công thức bánh': 'Bánh Âu',
};

const FolderThumbnail: React.FC<{ source: string }> = ({ source }) => (
  <span className="relative h-[32px] w-[36px] shrink-0 overflow-hidden">
    {/* Both category nodes use the same 36x32 crop geometry. */}
    <img
      src={source}
      alt=""
      className="pointer-events-none absolute top-[-81.25%] left-[-29.27%] h-[259.46%] w-[156.1%] max-w-none"
    />
  </span>
);

const CategoryLinkRow: React.FC<{ link: SavedLink; onClick: () => void; exactMetadata?: boolean }> = ({
  link,
  onClick,
  exactMetadata = false,
}) => (
  <button type="button" onClick={onClick} className="flex h-[112px] w-[316px] items-center gap-[10px] text-left">
    <span className="flex h-[112px] min-w-0 flex-1 items-center gap-[10px] rounded-[16px] bg-white p-[8px]">
      <span className="relative size-[80px] shrink-0 overflow-hidden rounded-[15px]">
        <img src={link.image} alt="" className="pointer-events-none absolute inset-0 size-full rounded-[15px] object-cover" />
        {(exactMetadata ? link.duration : '2:12') && (
          <span className="absolute top-[58px] left-[40px] flex items-center justify-center rounded-[15px] bg-[#0e0727] px-[8px] py-[2px] text-[10px] leading-[13px] font-normal tracking-[0.06px] whitespace-nowrap text-white">
            {exactMetadata ? link.duration : '2:12'}
          </span>
        )}
      </span>
      <span className="flex h-[96px] min-w-0 flex-1 flex-col items-start justify-center gap-[8px]">
        <span className="line-clamp-2 min-h-[40px] w-full min-w-0 flex-1 text-[14px] leading-[20px] font-normal text-black underline [text-underline-position:from-font]">
          {link.title}
        </span>
        <span className="flex w-full shrink-0 items-center gap-[4px] overflow-hidden text-[12px] leading-[16px] font-normal tracking-[0.4px] whitespace-nowrap text-[#9490a2]">
          <span className="shrink-0">{exactMetadata ? link.source : 'TikTok'}</span>
          <FigmaIcon name="category-dot" />
          <span className="min-w-0 truncate">{link.author}</span>
        </span>
        <span className="flex w-full shrink-0 items-start gap-[8px] overflow-hidden">
          <span className="flex min-w-0 items-center justify-center truncate rounded-[24px] bg-[#f2f2f3] px-[12px] py-[4px] text-[12px] leading-[16px] font-normal whitespace-nowrap text-[#0e0727]">
            {link.tags[0]}
          </span>
          <span className="flex min-w-0 items-center justify-center truncate rounded-[24px] bg-[#f1eefc] px-[12px] py-[4px] text-[12px] leading-[16px] font-normal whitespace-nowrap text-[#7758e2]">
            {link.tags[1]}
          </span>
        </span>
      </span>
      <span className="relative size-[18px] shrink-0 rotate-180 overflow-hidden">
        <FigmaIcon name="category-more-vertical" className="absolute top-[3.75px] left-[7.5px]" />
      </span>
    </span>
  </button>
);

/** Shared category list, including Figma nodes 2159:13036 and 2172:5822. */
export const CategoryScreen: React.FC<CategoryScreenProps> = ({
  category,
  onBack,
  onSelectFolder,
  onSelectLink,
  onAddLink,
}) => {
  const { links, addFolder } = useMneme();
  const [filter, setFilter] = useState<string>(FILTERS[0]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const isStudyShowcase = category.name === 'Học tập & Công việc';
  const isTravelShowcase = category.name === 'Du lịch';
  const isCakeShowcase = category.name === 'Công thức bánh';
  const usesExactMetadata = isStudyShowcase || isTravelShowcase || isCakeShowcase;
  const truncatesFolderNames = isStudyShowcase || isTravelShowcase || isCakeShowcase;
  const exactCategoryLinkIds = isStudyShowcase
    ? STUDY_CATEGORY_LINK_IDS
    : isTravelShowcase
      ? TRAVEL_CATEGORY_LINK_IDS
      : isCakeShowcase
        ? CAKE_CATEGORY_LINK_IDS
        : category.name === 'Phim ảnh'
          ? MOVIE_CATEGORY_LINK_IDS
          : null;
  const categoryLinks = exactCategoryLinkIds
    ? exactCategoryLinkIds
        .map((id) => links.find((link) => link.id === id))
        .filter((link): link is SavedLink => Boolean(link))
    : links.filter((link) => link.category === category.name).slice(0, 4);
  const categoryFolders = CATEGORY_FOLDERS[category.name] ?? [];
  const folderLabel = CATEGORY_FOLDER_LABEL[category.name] ?? `Folders (${categoryFolders.length})`;
  const viewAllFolder = CATEGORY_VIEW_ALL_FOLDER[category.name];
  const folderThumbnail = isStudyShowcase
    ? '/assets/images/figma_2172/2172_6335_folder.png'
    : '/assets/images/figma_2159/2159_13036_folder.png';

  const handleCreateFolder = (event: React.FormEvent) => {
    event.preventDefault();
    const folderName = newFolderName.trim();
    if (!folderName) return;
    addFolder(folderName, category.name);
    setNewFolderName('');
    setShowAddModal(false);
    onSelectFolder(folderName);
  };

  return (
    <div className="flex w-[390px] shrink-0 flex-col items-start gap-[12px] overflow-visible bg-[#f8f6fd] px-[20px] py-[16px] font-['Roboto',sans-serif]">
      <header className="flex h-[30px] w-[350px] items-end justify-center gap-[8px] px-[20px]">
        <button type="button" onClick={onBack} aria-label="Quay lại" className="flex h-[30px] w-[30px] shrink-0 items-center">
          <FigmaIcon name="category-back" style={{ transform: 'rotate(180deg)' }} />
        </button>
        <div className="flex h-full min-w-0 flex-1 items-center justify-center">
          <h1 className="flex h-full w-[166px] items-center justify-center overflow-hidden text-ellipsis whitespace-nowrap text-center text-[18px] leading-[28px] font-medium text-[#0e0727]">
            {category.name}
          </h1>
        </div>
        <button type="button" aria-label="Thêm tùy chọn" className="mb-0 flex size-[24px] shrink-0 items-center justify-center">
          <FigmaIcon name="category-more-horizontal" />
        </button>
      </header>

      <div className="flex h-[70px] w-[350px] shrink-0 flex-col items-start overflow-hidden rounded-[30px] bg-white p-[12px]">
        <div className="flex h-[46px] w-[326px] items-center justify-center gap-[18px]">
          <button type="button" className="flex h-[46px] min-w-0 flex-1 items-center gap-[10px] rounded-[11px] bg-[#f5f5f7] px-[8px] py-[12px]">
            <FigmaIcon name="category-search" />
            <span className="whitespace-nowrap text-[16px] leading-[22px] font-normal tracking-[-0.18px] text-[#9490a2]">Enter search terms...</span>
          </button>
          <button type="button" aria-label="Bộ lọc" className="size-[36px] shrink-0">
            <FigmaIcon name="category-filter" />
          </button>
        </div>
      </div>

      <div className="flex h-[840px] w-[350px] shrink-0 flex-col items-start gap-[20px] rounded-[20px] bg-white px-[16px] py-[20px] shadow-[0_0_2px_rgba(0,0,0,0.04),0_4px_4px_rgba(0,0,0,0.06)]">
        <div className="flex h-[28px] shrink-0 items-start gap-[10px] overflow-hidden">
          {FILTERS.map((label) => {
            const selected = filter === label;
            return (
              <button
                key={label}
                type="button"
                onClick={() => setFilter(label)}
                className={`flex h-[28px] w-[70px] shrink-0 items-center justify-center rounded-[24px] px-[10px] py-[6px] text-[12px] leading-[16px] font-extrabold tracking-[0.4px] ${
                  selected ? 'bg-[#f1eefc] text-[#7758e2]' : 'bg-[#f5f5f7] text-[#9490a2]'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="flex h-[752px] w-[318px] shrink-0 flex-col items-start gap-[20px]">
          <section className="flex h-[220px] w-full shrink-0 flex-col items-start gap-[10px]">
            <div className="flex h-[30px] w-full items-center gap-[10px]">
              <h2 className="min-w-0 flex-1 text-[14px] leading-[20px] font-medium tracking-[0.4px] text-[#0e0727]">{folderLabel}</h2>
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="flex h-[30px] shrink-0 items-center justify-center gap-[8px] rounded-[24px] bg-[#f1eefc] px-[8px] py-[4px] text-[12px] leading-[22px] font-semibold tracking-[-0.18px] text-[#7758e2]"
              >
                <FigmaIcon name="category-plus-small" />
                <span>Tạo folder</span>
              </button>
            </div>

            {categoryFolders.slice(0, 2).length > 0 && (
              <div className="flex h-[72px] w-full items-center gap-[10px]">
                {categoryFolders.slice(0, 2).map((folder) => (
                  <button key={folder} type="button" onClick={() => onSelectFolder(folder)} className="flex h-[72px] min-w-0 flex-1 items-center justify-center gap-[10px] rounded-[12px] bg-[#f7f7f8] px-[8px] py-[12px] text-left">
                    <FolderThumbnail source={folderThumbnail} />
                    <span className="flex min-w-0 flex-1 flex-col items-start justify-center gap-[4px] whitespace-nowrap">
                      <span className={`${truncatesFolderNames ? 'w-full truncate' : ''} text-[16px] leading-[24px] font-medium text-[#0e0727]`}>{folder}</span>
                      <span className="text-[14px] leading-[20px] font-normal tracking-[0.4px] text-[#9490a2]">{CATEGORY_FOLDER_COUNTS[category.name]?.[folder] ?? 24} links</span>
                    </span>
                  </button>
                ))}
              </div>
            )}

            {categoryFolders.slice(2, 4).length > 0 && (
              <div className="flex h-[72px] w-full items-center gap-[10px]">
                {categoryFolders.slice(2, 4).map((folder) => (
                  <button key={folder} type="button" onClick={() => onSelectFolder(folder)} className="flex h-[72px] min-w-0 flex-1 items-center justify-center gap-[10px] rounded-[12px] bg-[#f7f7f8] px-[8px] py-[12px] text-left">
                    <FolderThumbnail source={folderThumbnail} />
                    <span className="flex min-w-0 flex-1 flex-col items-start justify-center gap-[4px] whitespace-nowrap">
                      <span className={`${truncatesFolderNames ? 'w-full truncate' : ''} text-[16px] leading-[24px] font-medium text-[#0e0727]`}>{folder}</span>
                      <span className="text-[14px] leading-[20px] font-normal tracking-[0.4px] text-[#9490a2]">{CATEGORY_FOLDER_COUNTS[category.name]?.[folder] ?? 24} links</span>
                    </span>
                  </button>
                ))}
              </div>
            )}

            {viewAllFolder && (
              <button type="button" onClick={() => onSelectFolder(viewAllFolder)} className="h-[16px] w-full text-center text-[12px] leading-[16px] font-medium tracking-[0.4px] text-[#0098fd]">Xem tất cả folder</button>
            )}
          </section>

          <section className="flex h-[512px] w-full shrink-0 flex-col items-start gap-[10px]">
            <div className="flex h-[24px] w-full items-center gap-[10px]">
              <h2 className="min-w-0 flex-1 text-[14px] leading-[20px] font-medium tracking-[0.4px] text-[#0e0727]">Tất cả links</h2>
              <button type="button" onClick={() => onAddLink(category)} aria-label="Thêm link" className="flex size-[24px] shrink-0 items-center justify-center rounded-full bg-[#7758e2]">
                <FigmaIcon name="category-plus" />
              </button>
            </div>
            {categoryLinks.map((link) => (
              <CategoryLinkRow key={link.id} link={link} exactMetadata={usesExactMetadata} onClick={() => onSelectLink(link)} />
            ))}
          </section>
        </div>
      </div>

      {showAddModal && (
        // Create-folder sheet, Figma nodes 2159:13091 / 2172:7830.
        // `inset-0` fills the phone frame's actual height (see the frame's
        // transform-gpu in App.tsx) instead of a hardcoded 858px, so the dark
        // backdrop never leaves a gap that lets underlying content show through.
        <div className="fixed inset-0 z-60 flex flex-col justify-end overflow-hidden bg-black/40">
          <form onSubmit={handleCreateFolder} className="flex h-[310px] w-full shrink-0 flex-col items-start gap-[16px] rounded-[20px] bg-white px-[20px] pt-[20px] pb-[40px]">
            <div className="flex h-[24px] w-full items-start justify-center gap-[16px]">
              <h2 className="min-w-0 flex-1 text-center text-[16px] leading-[24px] font-semibold tracking-[0.15px] text-black">Tạo folder mới</h2>
              <button type="button" onClick={() => setShowAddModal(false)} aria-label="Đóng" className="flex size-[24px] shrink-0 items-center justify-end">
                <FigmaIcon name="create-folder-close" />
              </button>
            </div>

            <div className="flex h-[210px] w-full flex-col items-start gap-[24px]">
              <label className="flex h-[74px] w-full flex-col items-start gap-[8px]">
                <span className="h-[20px] w-full text-[14px] leading-[20px] font-medium tracking-[0.4px] text-[#0e0727]">Tên folder</span>
                <input
                  autoFocus
                  value={newFolderName}
                  onChange={(event) => setNewFolderName(event.target.value)}
                  placeholder="Nhập tên folder"
                  className="block h-[46px] w-full overflow-hidden text-ellipsis whitespace-nowrap rounded-[11px] border-0 bg-[#f5f5f7] px-[8px] py-[12px] text-[16px] leading-[22px] font-normal tracking-[-0.18px] text-[#0e0727] outline-none placeholder:text-[#9490a2]"
                />
              </label>

              <div className="flex h-[112px] w-full flex-col items-start gap-[16px]">
                <button type="submit" className="flex h-[48px] w-full items-center justify-center rounded-[16px] bg-[#7758e2] px-[16px] py-[12px] text-center text-[16px] leading-[22px] font-medium tracking-[-0.18px] text-white">Lưu</button>
                <button type="button" onClick={() => setShowAddModal(false)} className="flex h-[48px] w-full items-center justify-center rounded-[16px] bg-[#f1eefc] px-[16px] py-[12px] text-center text-[16px] leading-[22px] font-medium tracking-[-0.18px] text-[#0e0727]">Hủy</button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
