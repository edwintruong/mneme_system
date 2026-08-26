import React, { useState } from 'react';
import { SavedLink } from '../types';
import { useMneme } from '../state/mnemeContext';
import { FigmaBackButton } from '../components/common/FigmaBackButton';
import { FigmaIcon } from '../components/common/FigmaIcon';
import { MnemeImage } from '../components/common/MnemeImage';
import { Tag } from '../components/common/Tag';

interface FolderDetailScreenProps {
  folderName: string;
  onBack: () => void;
  onSelectLink: (link: SavedLink) => void;
  onAddNewLink: (folderName: string) => void;
}

export const FolderDetailScreen: React.FC<FolderDetailScreenProps> = ({
  folderName,
  onBack,
  onSelectLink,
  onAddNewLink,
}) => {
  const { links, folders, deleteLinks, moveLinks } = useMneme();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);

  const folderLinks = links.filter((l) => l.folder === folderName);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === folderLinks.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(folderLinks.map((l) => l.id));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    deleteLinks(selectedIds);
    setSelectedIds([]);
    setIsSelectionMode(false);
  };

  const handleMoveTo = (targetFolder: string) => {
    if (selectedIds.length === 0) return;
    moveLinks(selectedIds, targetFolder);
    setSelectedIds([]);
    setShowMoveModal(false);
    setIsSelectionMode(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F6FD] pb-28">
      {/* Top App Bar */}
      <div className="sticky top-0 bg-[#F8F6FD]/90 backdrop-blur-md px-4 py-3 z-30 flex items-center justify-between">
        <FigmaBackButton onClick={onBack} />
        <h2 className="text-base font-semibold text-[#0E0727]">{folderName}</h2>
        <button
          type="button"
          onClick={() => {
            setIsSelectionMode(!isSelectionMode);
            setSelectedIds([]);
          }}
          className="text-xs font-semibold text-[#7758E2] px-2 py-1 rounded-lg hover:bg-[#F1EEFC]"
        >
          {isSelectionMode ? 'Hủy chọn' : 'Chọn nhiều'}
        </button>
      </div>

      <div className="px-4 space-y-4 pt-1">
        {/* Folder Header Summary */}
        <div className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-xs">
          <div>
            <span className="text-xs text-[#9490A2]">Tổng cộng</span>
            <h3 className="text-lg font-bold text-[#0E0727]">{folderLinks.length} liên kết</h3>
          </div>
          <button
            type="button"
            onClick={() => onAddNewLink(folderName)}
            className="px-3 py-1.5 rounded-full bg-[#F1EEFC] text-[#7758E2] text-xs font-bold flex items-center gap-1.5 hover:bg-[#7758E2] hover:text-white transition-colors"
          >
            <FigmaIcon name="plus" size={14} />
            Thêm vào folder
          </button>
        </div>

        {/* Multi-Selection Control Bar if active */}
        {isSelectionMode && (
          <div className="bg-white rounded-2xl p-3 shadow-sm flex items-center justify-between border border-[#7758E2]/20">
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-xs font-semibold text-[#7758E2]"
            >
              {selectedIds.length === folderLinks.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
            </button>
            <span className="text-xs text-[#9490A2]">Đã chọn {selectedIds.length}</span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={selectedIds.length === 0}
                onClick={() => setShowMoveModal(true)}
                className="px-2.5 py-1 rounded-lg bg-[#F5F5F7] text-xs font-semibold text-[#0E0727] disabled:opacity-40"
              >
                Di chuyển
              </button>
              <button
                type="button"
                disabled={selectedIds.length === 0}
                onClick={handleDeleteSelected}
                className="px-2.5 py-1 rounded-lg bg-red-50 text-xs font-semibold text-red-600 disabled:opacity-40"
              >
                Xóa
              </button>
            </div>
          </div>
        )}

        {/* Links List */}
        <div className="bg-white rounded-3xl p-4 shadow-xs divide-y divide-black/5">
          {folderLinks.map((link) => {
            const isSelected = selectedIds.includes(link.id);
            return (
              <div
                key={link.id}
                onClick={() => (isSelectionMode ? toggleSelect(link.id) : onSelectLink(link))}
                className={`flex items-start gap-3 py-3 px-2 rounded-2xl transition-all cursor-pointer ${
                  isSelected ? 'bg-[#F1EEFC]' : 'hover:bg-[#F5F5F7]/80'
                }`}
              >
                {isSelectionMode && (
                  <div className="pt-2 flex-shrink-0">
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                        isSelected
                          ? 'bg-[#7758E2] border-[#7758E2] text-white'
                          : 'border-[#D1D1D6] bg-white'
                      }`}
                    >
                      {isSelected && '✓'}
                    </div>
                  </div>
                )}

                <div className="relative flex-shrink-0">
                  <MnemeImage src={link.image} size={72} radius={14} alt={link.title} />
                  <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md bg-[#0E0727]/75 text-[10px] text-white">
                    2:12
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-[#0E0727] line-clamp-2 underline leading-snug">
                    {link.title}
                  </h4>
                  <div className="text-xs text-[#9490A2] mt-1">
                    {link.source} · {link.savedAt || 'Gần đây'}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                    {link.tags?.map((t) => (
                      <Tag key={t} label={t} primary={t === 'Figma'} />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          {folderLinks.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-sm font-semibold text-[#0E0727]">Thư mục chưa có liên kết nào</p>
              <p className="text-xs text-[#9490A2] mt-1">
                Bấm "Thêm vào folder" để lưu tài liệu đầu tiên!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Move Folder Modal */}
      {showMoveModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-scale-up">
            <h3 className="text-base font-bold text-[#0E0727] mb-2">Di chuyển liên kết</h3>
            <p className="text-xs text-[#9490A2] mb-4">
              Chọn thư mục đích cho {selectedIds.length} liên kết đã chọn:
            </p>
            <div className="space-y-2 max-h-60 overflow-y-auto mb-4">
              {folders
                .filter((f) => f !== folderName)
                .map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => handleMoveTo(f)}
                    className="w-full text-left px-4 py-3 rounded-xl bg-[#F5F5F7] hover:bg-[#F1EEFC] hover:text-[#7758E2] text-sm font-medium transition-colors flex items-center justify-between"
                  >
                    <span>{f}</span>
                    <FigmaIcon name="chevron-right" size={16} />
                  </button>
                ))}
            </div>
            <button
              type="button"
              onClick={() => setShowMoveModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#F5F5F7] text-xs font-semibold text-[#0E0727]"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
