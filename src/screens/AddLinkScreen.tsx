import React, { useState } from 'react';
import { useMneme } from '../state/mnemeContext';
import { FigmaIcon } from '../components/common/FigmaIcon';
import { AddLinkParams } from '../types';

/**
 * Add link, Figma node 2159:13180.
 *
 * The design shows the screen mid-edit: a URL already pasted, its preview
 * resolved, and an AI-suggested category. The fields below start on those
 * values so the screen opens in the state the design specifies, and stay
 * editable.
 */
const DESIGN_URL = 'https://mimimi.vn/skincare/routine-toi-gian-da-nhay-cam';
const DESIGN_CATEGORY = 'Lifestyle';
const DESIGN_FOLDER = 'Self-care';

const TRAVEL_DESIGN = {
  url: 'https://mimimi.vn/travelguide/routine-toi-gian-da-nhay-cam',
  category: 'Du lịch',
  folder: 'Mẹo du lịch tiết kiệm',
  title: 'Lịch trình khám phá Kyoto tự túc trong 5 ngày',
  summary: 'Mẹo du lịch cho người mới bắt đầu',
  domain: 'mimimi.com',
  previewImage: '/assets/images/figma_2172/2172_8010_preview.png',
  categoryImage: '/assets/images/figma_2159/2159_12771_category_travel.jpg',
} as const;

interface AddLinkScreenProps {
  initialFolder?: string;
  initialCategory?: string;
  onBack: () => void;
  onStartAnalysis: (params: { url: string; folder: string; category: string }) => void;
  onSaveToCategory?: (params: AddLinkParams) => Promise<void>;
}

/** A native select laid invisibly over a styled row, so the row keeps Figma's look. */
const OverlaySelect: React.FC<{
  value: string;
  options: string[];
  onChange: (v: string) => void;
  label: string;
}> = ({ value, options, onChange, label }) => (
  <select
    aria-label={label}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="absolute inset-0 cursor-pointer appearance-none opacity-0"
  >
    {options.map((o) => (
      <option key={o} value={o}>
        {o}
      </option>
    ))}
  </select>
);

export const AddLinkScreen: React.FC<AddLinkScreenProps> = ({
  initialFolder,
  initialCategory,
  onBack,
  onStartAnalysis,
  onSaveToCategory,
}) => {
  const { folders, categories } = useMneme();
  const isTravelCategoryFlow = initialCategory === TRAVEL_DESIGN.category;
  const designUrl = isTravelCategoryFlow ? TRAVEL_DESIGN.url : DESIGN_URL;
  const designFolder = isTravelCategoryFlow ? TRAVEL_DESIGN.folder : DESIGN_FOLDER;
  const designCategory = initialCategory || DESIGN_CATEGORY;
  const previewTitle = isTravelCategoryFlow ? TRAVEL_DESIGN.title : 'Routine skincare tối giản';
  const previewSummary = isTravelCategoryFlow
    ? TRAVEL_DESIGN.summary
    : 'Routine đơn giản cho làn da khỏe và ít kích ứng.';
  const previewImage = isTravelCategoryFlow
    ? TRAVEL_DESIGN.previewImage
    : '/assets/images/figma_2159/2159_13180_preview.jpg';
  const categoryImage = isTravelCategoryFlow
    ? TRAVEL_DESIGN.categoryImage
    : '/assets/images/figma_2159/2159_13180_cat_thumb.jpg';
  const [url, setUrl] = useState(designUrl);
  const [folder, setFolder] = useState(initialFolder || designFolder);
  const [category, setCategory] = useState(designCategory);

  const folderOptions = Array.from(new Set([designFolder, ...folders]));
  const categoryOptions = Array.from(new Set([designCategory, ...categories.map((c) => c.name)]));

  const handleSave = () => {
    if (isTravelCategoryFlow && onSaveToCategory) {
      void onSaveToCategory({
        url,
        folder,
        category,
        preset: {
          title: TRAVEL_DESIGN.title,
          summary: TRAVEL_DESIGN.summary,
          image: TRAVEL_DESIGN.previewImage,
          source: 'Website',
          tags: ['Du lịch', 'Kyoto'],
        },
      });
      return;
    }

    onStartAnalysis({ url, folder, category });
  };

  return (
    <div className="relative flex w-[390px] flex-1 flex-col items-start gap-[12px] px-[20px] py-[16px]">
      {/* Header, node 2159:13183 */}
      <div className="flex w-full shrink-0 items-center justify-center gap-[8px] px-[20px]">
        <div className="flex w-[30px] shrink-0 items-center">
          <button type="button" onClick={onBack} aria-label="Quay lại">
            <FigmaIcon name="add-link-back" size={30} />
          </button>
        </div>
        <div className="flex flex-1 self-stretch">
          <div className="flex h-full min-w-px flex-1 items-center justify-center">
            <p className="w-[166px] text-center text-[18px] leading-[28px] font-medium tracking-[0px] text-[#0e0727]">
              Thêm liên kết
            </p>
          </div>
        </div>
        <div className="h-[30px] w-[24px] shrink-0" />
        <button type="button" aria-label="Tuỳ chọn khác" className="shrink-0">
          <FigmaIcon name="more-horizontal-figma" size={24} />
        </button>
      </div>

      {/*
        Card, node 2159:13190. The node reports gap-20, but its own render puts
        every child 2px higher than that produces; 18 is what reproduces the
        export at all four block boundaries (field 148, preview 218, category
        box 364, folder label 466).
      */}
      <div
        className={`flex h-[706px] w-[356px] shrink-0 flex-col items-center overflow-hidden rounded-[20px] bg-white px-[16px] py-[20px] ${isTravelCategoryFlow ? 'gap-[20px]' : 'gap-[18px]'}`}
        style={{ boxShadow: 'var(--shadow-card)' }}
      >
        {/* Liên kết, node 2159:13191 */}
        <div className="flex w-full flex-col items-start gap-[8px]">
          <p className="h-[18px] w-full text-[14px] leading-[20px] font-medium tracking-[0.4px] text-[#0e0727]">
            Liên kết<span className="text-white">*</span>
          </p>
          <div className="flex w-full items-center gap-[10px] overflow-hidden rounded-[11px] border-2 border-solid border-[#f5f5f7] bg-[#f7f7f9] px-[8px] py-[12px]">
            <FigmaIcon name="link-field" size={24} />
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              aria-label="Đường dẫn liên kết"
              className="block h-[24px] min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap border-0 bg-transparent p-0 leading-[24px] text-[16px] font-normal tracking-[-0.18px] text-[#0e0727] outline-none"
            />
            <button type="button" onClick={() => setUrl('')} aria-label="Xoá liên kết">
              <FigmaIcon name="url-clear" size={24} />
            </button>
          </div>
        </div>

        {/* Preview, node 2159:13192 */}
        {url.trim() !== '' && (
          <div className="flex w-[316px] shrink-0 items-center">
            <div
              className="flex w-[316px] items-center gap-[10px] overflow-hidden rounded-[16px] bg-white p-[8px]"
              style={{ boxShadow: 'var(--shadow-card)' }}
            >
              <div className="h-[84px] w-[80px] shrink-0 overflow-hidden rounded-[15px]">
                <img
                  src={previewImage}
                  alt=""
                  className="size-full rounded-[15px] object-cover"
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col items-start justify-center gap-[8px] overflow-hidden">
                <p className="line-clamp-2 w-full overflow-hidden text-[14px] leading-[20px] font-medium tracking-[0px] text-[#0e0727]">
                  {previewTitle}
                </p>
                <p className="line-clamp-2 w-full overflow-hidden text-[12px] leading-[16px] font-normal tracking-[0.4px] text-[#0e0727]">
                  {previewSummary}
                </p>
                <div className="flex w-full min-w-0 items-center overflow-hidden">
                  <p className="w-full truncate whitespace-nowrap text-[12px] leading-[16px] font-normal tracking-[0.4px] text-[#9490a2]">
                    {isTravelCategoryFlow ? TRAVEL_DESIGN.domain : 'mimimi.com'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Categories, node 2159:13201 */}
        <div className="flex w-full flex-col items-start gap-[8px]">
          <div className="flex w-full items-start gap-[8px]">
            <p className="h-[18px] min-w-px flex-1 text-[14px] leading-[20px] font-medium tracking-[0.4px] text-[#0e0727]">
              Categories<span className="text-[#f12950]">*</span>
            </p>
            <span className="flex shrink-0 items-center rounded-full bg-[#7758e2] p-[4.032px]">
              <FigmaIcon name="badge-check" size={11.935} />
            </span>
          </div>
          <div className="relative flex w-full items-center gap-[20px] overflow-hidden rounded-[11px] border-2 border-solid border-[#f1eefc] bg-[#fefefe] p-[8px]">
            <div className={`relative size-[60px] shrink-0 overflow-hidden ${isTravelCategoryFlow ? 'rounded-[15px]' : 'rounded-[11.25px]'}`}>
              <img
                src={categoryImage}
                alt=""
                className={`size-full object-cover ${isTravelCategoryFlow ? 'rounded-[15px]' : 'rounded-[11.25px]'}`}
              />
              <span className={`absolute flex items-center rounded-[10.765px] border-[0.487px] border-solid border-[#d9d9d9] bg-white p-[2.691px] ${isTravelCategoryFlow ? 'top-[39px] left-[5px]' : 'top-[40.5px] left-[3.75px]'}`}>
                <FigmaIcon name="img-badge" size={10.144} />
              </span>
            </div>
            <div className="flex min-w-px flex-1 items-center gap-[10px]">
              <div className="flex min-w-px flex-1 flex-col items-start justify-center gap-[4px]">
                <div className="flex w-full items-center justify-center px-[8px]">
                  <p className="min-w-px flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-[16px] leading-[22px] font-medium tracking-[-0.18px] text-[#0e0727]">
                    {category}
                  </p>
                </div>
                <div className="flex items-center justify-center gap-[8px] overflow-hidden rounded-[24px] bg-[#f1eefc] px-[10px] py-[6px]">
                  <span className="whitespace-nowrap text-[12px] leading-[16px] font-extrabold tracking-[0.4px] text-[#7758e2]">
                    Đề xuất bởi AI
                  </span>
                </div>
              </div>
              <span className="flex shrink-0 items-center justify-center">
                <FigmaIcon
                  name="dropdown-close"
                  size={24}
                  style={{ transform: 'rotate(180deg) scaleY(-1)' }}
                />
              </span>
            </div>
            <OverlaySelect value={category} options={categoryOptions} onChange={setCategory} label="Danh mục" />
          </div>
        </div>

        {/* Folder, node 2159:13217 */}
        <div className="flex w-full flex-col items-start gap-[8px]">
          <p className="h-[18px] w-full text-[14px] leading-[20px] font-medium tracking-[0.4px] text-[#0e0727]">
            Folder
          </p>
          <div className="relative flex w-full items-center gap-[10px] overflow-hidden rounded-[11px] border-2 border-solid border-[#f5f5f7] px-[8px] py-[12px]">
            <p className="min-w-px flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-[16px] leading-[22px] font-normal tracking-[-0.18px] text-[#0e0727]">
              {folder}
            </p>
            <span className="flex shrink-0 items-center justify-center">
              <span
                className="relative block size-[24px] overflow-hidden rounded-[23px] bg-white"
                style={{ transform: 'rotate(180deg)' }}
              >
                {/* inner vector at inset 38.54% / 26.04% of the 24px box */}
                <FigmaIcon
                  name="direction-down-figma"
                  className="absolute"
                  style={{ left: '6.25px', top: '9.25px' }}
                />
              </span>
            </span>
            <OverlaySelect value={folder} options={folderOptions} onChange={setFolder} label="Thư mục" />
          </div>
        </div>
      </div>

      {/* Save bar, node 2159:13225 — frame y=750, i.e. 706 inside the content area. */}
      <div className="absolute top-[706px] left-0 flex w-[390px] flex-col items-start rounded-[16px] border-t border-solid border-[#f1eefc] bg-white px-[16px] py-[30px]">
        <button
          type="button"
          onClick={handleSave}
          className="flex w-[354px] items-center justify-center gap-[10px] overflow-hidden rounded-[16px] bg-[#7758e2] px-[16px] py-[12px]"
        >
          <span className="whitespace-nowrap text-center text-[16px] leading-[22px] font-medium tracking-[-0.18px] text-white">
            Lưu liên kết
          </span>
        </button>
      </div>
    </div>
  );
};
