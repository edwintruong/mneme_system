import React, { useState } from 'react';
import { SavedLink } from '../types';
import { useMneme } from '../state/mnemeContext';
import { FigmaBackButton } from '../components/common/FigmaBackButton';
import { FigmaIcon } from '../components/common/FigmaIcon';
import { MnemeImage } from '../components/common/MnemeImage';
import { Tag } from '../components/common/Tag';

interface LinkDetailScreenProps {
  link: SavedLink;
  onBack: () => void;
  onEdit: (link: SavedLink) => void;
}

export const LinkDetailScreen: React.FC<LinkDetailScreenProps> = ({
  link,
  onBack,
  onEdit,
}) => {
  const { toggleFavorite, deleteLink } = useMneme();
  const [copied, setCopied] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(link.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = () => {
    deleteLink(link.id);
    onBack();
  };

  return (
    <div className="min-h-screen bg-[#F8F6FD] pb-28">
      {/* Top App Bar */}
      <div className="sticky top-0 bg-[#F8F6FD]/90 backdrop-blur-md px-4 py-3 z-30 flex items-center justify-between">
        <FigmaBackButton onClick={onBack} />
        <h2 className="text-base font-semibold text-[#0E0727]">Chi tiết liên kết</h2>
        <button
          type="button"
          onClick={() => onEdit(link)}
          className="text-xs font-semibold text-[#7758E2] px-2 py-1 rounded-lg hover:bg-[#F1EEFC]"
        >
          Sửa
        </button>
      </div>

      <div className="px-4 space-y-4 pt-1">
        {/* Cover Preview Image */}
        <div className="w-full h-48 rounded-3xl overflow-hidden bg-white shadow-xs relative">
          <img
            src={link.image}
            alt={link.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 text-white text-xs font-medium backdrop-blur-xs flex items-center gap-1.5">
            <FigmaIcon name="youtube" size={14} color="#FF0000" />
            {link.source}
          </div>
        </div>

        {/* Action Button Strip */}
        <div className="flex items-center justify-around bg-white rounded-2xl p-3 shadow-xs">
          <button
            type="button"
            onClick={() => toggleFavorite(link.id)}
            className={`flex flex-col items-center gap-1 text-xs font-medium transition-colors ${
              link.favorite ? 'text-[#7758E2]' : 'text-[#9490A2] hover:text-[#0E0727]'
            }`}
          >
            <FigmaIcon name="star" size={20} color={link.favorite ? '#7758E2' : '#9490A2'} />
            <span>{link.favorite ? 'Đã thích' : 'Yêu thích'}</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="flex flex-col items-center gap-1 text-xs font-medium text-[#9490A2] hover:text-[#0E0727]"
          >
            <FigmaIcon name="copy" size={20} />
            <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: link.title, url: link.url }).catch(() => {});
              } else {
                handleCopy();
              }
            }}
            className="flex flex-col items-center gap-1 text-xs font-medium text-[#9490A2] hover:text-[#0E0727]"
          >
            <FigmaIcon name="share" size={20} />
            <span>Chia sẻ</span>
          </button>

          <button
            type="button"
            onClick={() => setShowConfirmDelete(true)}
            className="flex flex-col items-center gap-1 text-xs font-medium text-red-500 hover:text-red-700"
          >
            <FigmaIcon name="delete" size={20} color="#EF4444" />
            <span>Xóa</span>
          </button>
        </div>

        {/* Title & Metadata */}
        <div className="bg-white rounded-3xl p-5 shadow-xs space-y-3">
          <h3 className="text-lg font-bold text-[#0E0727] leading-snug">{link.title}</h3>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#7758E2] hover:underline break-all block"
          >
            {link.url}
          </a>

          <div className="flex items-center gap-2 pt-2 border-t border-black/5 flex-wrap">
            <span className="text-xs text-[#9490A2]">Thư mục:</span>
            <Tag label={link.folder} primary />
            <span className="text-xs text-[#9490A2] ml-2">Chủ đề:</span>
            <Tag label={link.category} />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-xs text-[#9490A2]">Tags:</span>
            {link.tags?.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </div>
        </div>

        {/* AI Summary Card */}
        <div className="bg-white rounded-3xl p-5 shadow-xs space-y-2.5">
          <div className="flex items-center gap-2 text-[#7758E2]">
            <FigmaIcon name="ai" size={18} color="#7758E2" />
            <h4 className="text-sm font-bold">Tóm tắt thông minh từ AI</h4>
          </div>
          <p className="text-sm text-[#0E0727] leading-relaxed bg-[#F8F6FD] p-4 rounded-2xl">
            {link.summary}
          </p>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-xs w-full shadow-2xl animate-scale-up text-center">
            <h3 className="text-base font-bold text-[#0E0727] mb-2">Xóa liên kết này?</h3>
            <p className="text-xs text-[#9490A2] mb-5">
              Hành động này sẽ xóa liên kết vĩnh viễn khỏi thiết bị của bạn.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowConfirmDelete(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#F5F5F7] text-xs font-semibold text-[#0E0727]"
              >
                Giữ lại
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-xs font-semibold text-white"
              >
                Xóa ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
