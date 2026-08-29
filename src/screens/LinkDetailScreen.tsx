import React, { useState } from 'react';
import { SavedLink } from '../types';
import { useMneme } from '../state/mnemeContext';
import { FigmaIcon } from '../components/common/FigmaIcon';

interface LinkDetailScreenProps {
  link: SavedLink;
  onBack: () => void;
  onEdit: (link: SavedLink) => void;
}

const getSourceIcon = (source: string): string => {
  const normalized = source.toLowerCase().replace(/\s+/g, '');
  if (normalized.includes('youtube')) return 'showcase-youtube';
  if (normalized.includes('facebook')) return 'showcase-facebook';
  return 'tiktok';
};

/** Link detail, shared by nodes 2159:12980 and showcase nodes 2172:4258/4313/4365. */
export const LinkDetailScreen: React.FC<LinkDetailScreenProps> = ({
  link,
  onBack,
  onEdit,
}) => {
  const { toggleFavorite } = useMneme();
  const [copied, setCopied] = useState(false);

  const details = link.details?.length ? link.details : [link.summary];
  const visibleTags = link.tags.slice(0, 3);
  const sourceIcon = getSourceIcon(link.source);
  const usesCompactTagGap = link.id === 4;

  const handleCopy = async () => {
    try {
      await navigator.clipboard?.writeText(link.url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be unavailable in a non-secure local preview.
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: link.title, url: link.url });
        return;
      } catch {
        return;
      }
    }
    await handleCopy();
  };

  return (
    <div className="relative h-full w-[390px] shrink-0 bg-[#f8f6fd] pt-[9px] font-['Roboto',sans-serif]">
      {/* Frame 55, node 2159:12992. The shared app shell renders the 44px status bar. */}
      <div className="flex h-[30px] w-full items-center gap-[8px] px-[20px]">
        <div className="flex min-w-0 flex-1 items-center">
          <button type="button" onClick={onBack} aria-label="Quay lại" className="flex size-[30px] items-center justify-center">
            {/* The exported down-chevron instance is rotated 90deg to point left. */}
            <FigmaIcon name="link-back" style={{ transform: 'rotate(90deg)' }} />
          </button>
        </div>
        <div className="flex min-w-0 flex-1 items-center justify-end">
          <button type="button" onClick={handleShare} aria-label="Chia sẻ" className="flex size-[24px] items-center justify-center">
            {/* This instance is vertically mirrored in node 2159:12996. */}
            <FigmaIcon name="share-figma" style={{ transform: 'scaleY(-1)' }} />
          </button>
        </div>
      </div>

      {/* Image placeholder, node 2159:12998. */}
      <div className="mx-[20px] mt-[16px] h-[164px] w-[350px] overflow-hidden rounded-[15px]">
        <img src={link.image} alt="" className="size-full rounded-[15px] object-cover" />
      </div>

      {/* Detail card, node 2159:12999. */}
      <section className="mx-[20px] mt-[16px] flex w-[350px] flex-col gap-[24px] rounded-[16px] bg-white py-[16px]">
        <div className="flex w-full flex-col gap-[12px]">
          <div className="flex h-[28px] w-full items-center gap-[10px] px-[20px]">
            <h1 className="shrink-0 whitespace-nowrap text-[18px] leading-[28px] font-medium tracking-[0px] text-[#0e0727]">
              {link.title}
            </h1>
            <div className="flex min-w-0 flex-1 items-center">
              <button
                type="button"
                onClick={() => toggleFavorite(link.id)}
                aria-label={link.favorite ? 'Bỏ yêu thích' : 'Yêu thích'}
                className="flex size-[20px] items-center justify-center"
              >
                <FigmaIcon name="star-filled" size={20} />
              </button>
            </div>
          </div>

          <div className="mx-auto flex h-[48px] w-[316px] items-center gap-[10px] rounded-[16px] border-[1.8px] border-solid border-[#f2f2f3] px-[20px] py-[8px]">
            <p className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-[16px] leading-[24px] font-normal tracking-[0px] text-[#0e0727]">
              {link.url}
            </p>
            <button
              type="button"
              onClick={handleCopy}
              aria-label={copied ? 'Đã sao chép' : 'Sao chép liên kết'}
              className="flex size-[32px] shrink-0 items-center justify-center rounded-full bg-[#f2f2f3]"
            >
              <FigmaIcon name="copy-figma" />
            </button>
          </div>

          <div className="w-full px-[20px]">
            <ul className="w-[310px] list-disc pl-[24px] text-[16px] leading-[24px] font-normal tracking-[0px] text-[#0e0727]">
              {details.map((detail) => (
                <li key={detail} className="whitespace-pre-line">{detail}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className={`flex h-[32px] w-full items-center px-[20px] ${usesCompactTagGap ? 'gap-[4px]' : 'gap-[10px]'}`}>
          {visibleTags.map((tag, index) => (
            <span
              key={tag}
              className={`flex h-[32px] shrink-0 items-center justify-center rounded-[24px] px-[12px] text-[16px] leading-[24px] font-normal tracking-[0px] ${
                index === visibleTags.length - 1 ? 'bg-[#f1eefc] text-[#7758e2]' : 'bg-[#f2f2f3] text-[#0e0727]'
              }`}
            >
              {tag}
            </span>
          ))}
          <button
            type="button"
            onClick={() => onEdit(link)}
            aria-label="Thêm thẻ"
            className="flex size-[32px] shrink-0 items-center justify-center rounded-[10px] bg-[#7758e2]"
          >
            <FigmaIcon name="tag-add" />
          </button>
        </div>

        <div className="flex h-[60px] w-full flex-col gap-[12px]">
          <div className="flex h-[24px] w-full items-center gap-[10px] px-[20px] text-[16px] leading-[24px] font-normal tracking-[0px] text-[#0e0727]">
            <span className="flex size-[20px] shrink-0 items-center justify-center">
              <FigmaIcon name="layers-figma" />
            </span>
            <span className="min-w-0 flex-1">Nguồn</span>
            <FigmaIcon name={sourceIcon} />
            <span className="shrink-0 whitespace-nowrap">{link.source}</span>
          </div>
          <div className="flex h-[24px] w-full items-center gap-[10px] px-[20px] text-[16px] leading-[24px] font-normal tracking-[0px] text-[#0e0727]">
            <FigmaIcon name="saved-clock" />
            <span className="min-w-0 flex-1">Đã lưu</span>
            <span className="shrink-0 whitespace-nowrap">{link.savedAt || 'Vừa xong'}</span>
          </div>
        </div>
      </section>

      {/* Fixed action area, node 2159:13031. It extends 1px past the frame in Figma. */}
      <div className="absolute -bottom-[1px] left-0 z-40 h-[102px] w-[390px] rounded-[16px] border-t border-solid border-[#f1eefc] bg-white px-[16px] py-[28px]">
        {/* The border is painted without consuming the node's 28px content offset. */}
        <div className="flex h-[46px] w-full -translate-y-px items-center gap-[16px] px-[12px]">
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-[46px] min-w-0 flex-1 items-center justify-center rounded-[16px] bg-[#7758e2] px-[16px] py-[12px] text-center text-[16px] leading-[22px] font-medium tracking-[-0.18px] text-white"
          >
            Mở Link
          </a>
          <button
            type="button"
            onClick={() => onEdit(link)}
            aria-label="Thêm tùy chọn"
            className="flex size-[46px] shrink-0 items-center justify-center rounded-full bg-[#f1eefc]"
          >
            <FigmaIcon name="more-horizontal-detail" />
          </button>
        </div>
      </div>
    </div>
  );
};
