import React, { useState } from 'react';
import { MnemeCategory, SavedLink } from '../types';
import { useMneme } from '../state/mnemeContext';
import { FigmaIcon } from '../components/common/FigmaIcon';

interface CategoryScreenProps {
  category: MnemeCategory;
  onBack: () => void;
  onSelectFolder: (folderName: string) => void;
  onSelectLink: (link: SavedLink) => void;
}

const FILTERS = ['Tất cả', 'Bài viết', 'Video', 'Ảnh'] as const;
const MOVIE_FOLDERS = ['Phim Hàn', 'Phim kinh dị', 'Phim ngắn', 'Anime'] as const;

const FolderThumbnail: React.FC = () => (
  <span className="relative h-[32px] w-[36px] shrink-0 overflow-hidden">
    {/* Crop transform comes directly from node 2159:13060. */}
    <img
      src="/assets/images/figma_2159/2159_13036_folder.png"
      alt=""
      className="pointer-events-none absolute top-[-81.25%] left-[-29.27%] h-[259.46%] w-[156.1%] max-w-none"
    />
  </span>
);

const CategoryLinkRow: React.FC<{ link: SavedLink; onClick: () => void }> = ({ link, onClick }) => (
  <button type="button" onClick={onClick} className="flex h-[112px] w-[316px] items-center gap-[10px] text-left">
    <span className="flex h-[112px] min-w-0 flex-1 items-center gap-[10px] rounded-[16px] bg-white p-[8px]">
      <span className="relative size-[80px] shrink-0 overflow-hidden rounded-[15px]">
        <img src={link.image} alt="" className="pointer-events-none absolute inset-0 size-full rounded-[15px] object-cover" />
        <span className="absolute top-[58px] left-[40px] flex items-center justify-center rounded-[15px] bg-[#0e0727] px-[8px] py-[2px] text-[10px] leading-[13px] font-normal tracking-[0.06px] whitespace-nowrap text-white">
          2:12
        </span>
      </span>
      <span className="flex h-[96px] min-w-0 flex-1 flex-col items-start justify-center gap-[8px]">
        <span className="line-clamp-2 min-h-[40px] w-full min-w-0 flex-1 text-[14px] leading-[20px] font-normal text-black underline [text-underline-position:from-font]">
          {link.title}
        </span>
        <span className="flex w-full shrink-0 items-center gap-[4px] text-[12px] leading-[16px] font-normal tracking-[0.4px] whitespace-nowrap text-[#9490a2]">
          <span>TikTok</span>
          <FigmaIcon name="category-dot" />
          <span>@abcdef</span>
        </span>
        <span className="flex shrink-0 items-start gap-[8px]">
          <span className="flex items-center justify-center rounded-[24px] bg-[#f2f2f3] px-[12px] py-[4px] text-[12px] leading-[16px] font-normal text-[#0e0727]">
            {link.tags[0]}
          </span>
          <span className="flex items-center justify-center rounded-[24px] bg-[#f1eefc] px-[12px] py-[4px] text-[12px] leading-[16px] font-normal text-[#7758e2]">
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

/** Category list, Figma node 2159:13036 (390x856). */
export const CategoryScreen: React.FC<CategoryScreenProps> = ({
  category,
  onBack,
  onSelectFolder,
  onSelectLink,
}) => {
  const { links, addFolder } = useMneme();
  const [filter, setFilter] = useState<string>(FILTERS[0]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const categoryLinks = links.filter((link) => link.category === category.name).slice(0, 4);

  const handleCreateFolder = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newFolderName.trim()) return;
    addFolder(newFolderName.trim(), category.name);
    setNewFolderName('');
    setShowAddModal(false);
  };

  return (
    <div className="flex w-[390px] shrink-0 flex-col items-start gap-[12px] overflow-visible bg-[#f8f6fd] px-[20px] py-[16px] font-['Roboto',sans-serif]">
      <header className="flex h-[30px] w-[350px] items-end justify-center gap-[8px] px-[20px]">
        <button type="button" onClick={onBack} aria-label="Quay lại" className="flex h-[30px] w-[30px] shrink-0 items-center">
          <FigmaIcon name="category-back" style={{ transform: 'rotate(180deg)' }} />
        </button>
        <div className="flex h-full min-w-0 flex-1 items-center justify-center">
          <h1 className="flex h-full w-[166px] items-center justify-center text-center text-[18px] leading-[28px] font-medium text-[#0e0727]">
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
              <h2 className="min-w-0 flex-1 text-[14px] leading-[20px] font-medium tracking-[0.4px] text-[#0e0727]">Folders (6)</h2>
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="flex h-[30px] shrink-0 items-center justify-center gap-[8px] rounded-[24px] bg-[#f1eefc] px-[8px] py-[4px] text-[12px] leading-[22px] font-semibold tracking-[-0.18px] text-[#7758e2]"
              >
                <FigmaIcon name="category-plus-small" />
                <span>Tạo folder</span>
              </button>
            </div>

            <div className="flex h-[72px] w-full items-center gap-[10px]">
              {MOVIE_FOLDERS.slice(0, 2).map((folder) => (
                <button key={folder} type="button" onClick={() => onSelectFolder(folder)} className="flex h-[72px] min-w-0 flex-1 items-center justify-center gap-[10px] rounded-[12px] bg-[#f7f7f8] px-[8px] py-[12px] text-left">
                  <FolderThumbnail />
                  <span className="flex min-w-0 flex-1 flex-col items-start justify-center gap-[4px] whitespace-nowrap">
                    <span className="text-[16px] leading-[24px] font-medium text-[#0e0727]">{folder}</span>
                    <span className="text-[14px] leading-[20px] font-normal tracking-[0.4px] text-[#9490a2]">24 links</span>
                  </span>
                </button>
              ))}
            </div>

            <div className="flex h-[72px] w-full items-center gap-[10px]">
              {MOVIE_FOLDERS.slice(2).map((folder) => (
                <button key={folder} type="button" onClick={() => onSelectFolder(folder)} className="flex h-[72px] min-w-0 flex-1 items-center justify-center gap-[10px] rounded-[12px] bg-[#f7f7f8] px-[8px] py-[12px] text-left">
                  <FolderThumbnail />
                  <span className="flex min-w-0 flex-1 flex-col items-start justify-center gap-[4px] whitespace-nowrap">
                    <span className="text-[16px] leading-[24px] font-medium text-[#0e0727]">{folder}</span>
                    <span className="text-[14px] leading-[20px] font-normal tracking-[0.4px] text-[#9490a2]">24 links</span>
                  </span>
                </button>
              ))}
            </div>

            <button type="button" onClick={() => onSelectFolder('Phim tài liệu')} className="h-[16px] w-full text-center text-[12px] leading-[16px] font-medium tracking-[0.4px] text-[#0098fd]">Xem tất cả folder</button>
          </section>

          <section className="flex h-[512px] w-full shrink-0 flex-col items-start gap-[10px]">
            <div className="flex h-[24px] w-full items-center gap-[10px]">
              <h2 className="min-w-0 flex-1 text-[14px] leading-[20px] font-medium tracking-[0.4px] text-[#0e0727]">Tất cả links</h2>
              <button type="button" aria-label="Thêm link" className="flex size-[24px] shrink-0 items-center justify-center rounded-full bg-[#7758e2]">
                <FigmaIcon name="category-plus" />
              </button>
            </div>
            {categoryLinks.map((link) => (
              <CategoryLinkRow key={link.id} link={link} onClick={() => onSelectLink(link)} />
            ))}
          </section>
        </div>
      </div>

      {showAddModal && (
        // Create-folder sheet, Figma node 2159:13091.
        <div className="fixed top-0 left-1/2 z-60 h-[858px] w-[390px] -translate-x-1/2 overflow-hidden bg-black/40">
          <form onSubmit={handleCreateFolder} className="absolute top-[548px] left-0 flex h-[310px] w-[390px] flex-col items-start gap-[16px] rounded-[20px] bg-white px-[20px] pt-[20px] pb-[40px]">
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
                  className="block h-[46px] w-full rounded-[11px] border-0 bg-[#f5f5f7] px-[8px] py-[12px] text-[16px] leading-[22px] font-normal tracking-[-0.18px] text-[#0e0727] outline-none placeholder:text-[#9490a2]"
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
