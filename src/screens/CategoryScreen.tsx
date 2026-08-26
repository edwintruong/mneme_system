import React, { useState } from 'react';
import { MnemeCategory } from '../types';
import { useMneme } from '../state/mnemeContext';
import { FigmaBackButton } from '../components/common/FigmaBackButton';
import { FigmaIcon } from '../components/common/FigmaIcon';
import { MnemeImage } from '../components/common/MnemeImage';

interface CategoryScreenProps {
  category: MnemeCategory;
  onBack: () => void;
  onSelectFolder: (folderName: string) => void;
}

export const CategoryScreen: React.FC<CategoryScreenProps> = ({
  category,
  onBack,
  onSelectFolder,
}) => {
  const { folders, links, addFolder } = useMneme();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      addFolder(newFolderName.trim(), category.name);
      setNewFolderName('');
      setShowAddModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6FD] pb-24">
      {/* Top App Bar */}
      <div className="sticky top-0 bg-[#F8F6FD]/90 backdrop-blur-md px-4 py-3 z-30 flex items-center justify-between">
        <FigmaBackButton onClick={onBack} />
        <h2 className="text-base font-semibold text-[#0E0727]">{category.name}</h2>
        <div className="w-8" />
      </div>

      <div className="px-4 pt-2 space-y-5">
        {/* Category Banner Card */}
        <div className="bg-white rounded-3xl p-5 shadow-xs flex items-center gap-4">
          <MnemeImage src={category.image} size={70} radius={18} alt={category.name} />
          <div>
            <h3 className="text-lg font-bold text-[#0E0727]">{category.name}</h3>
            <p className="text-xs text-[#9490A2] mt-0.5">{category.itemCount} liên kết và ghi chú</p>
          </div>
        </div>

        {/* Folders Section */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h4 className="text-sm font-semibold text-[#0E0727]">Thư mục bên trong</h4>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="text-xs font-semibold text-[#7758E2] flex items-center gap-1 hover:underline"
            >
              <FigmaIcon name="plus-small" size={16} color="#7758E2" />
              Tạo folder
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {folders.map((f) => {
              const count = links.filter((l) => l.folder === f).length;
              return (
                <div
                  key={f}
                  onClick={() => onSelectFolder(f)}
                  className="bg-white rounded-2xl p-4 shadow-xs hover:shadow-md transition-all cursor-pointer group active:scale-95 flex flex-col justify-between h-[110px]"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#F1EEFC] flex items-center justify-center text-[#7758E2]">
                    <FigmaIcon name="folder-plus" size={18} color="#7758E2" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-[#0E0727] truncate group-hover:text-[#7758E2]">
                      {f}
                    </h5>
                    <span className="text-[11px] text-[#9490A2]">{count} liên kết</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Folder Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-scale-up">
            <h3 className="text-base font-bold text-[#0E0727] mb-2">Tạo thư mục mới</h3>
            <p className="text-xs text-[#9490A2] mb-4">
              Nhập tên thư mục để phân loại liên kết trong {category.name}
            </p>
            <form onSubmit={handleCreateFolder} className="space-y-4">
              <input
                type="text"
                autoFocus
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Ví dụ: 3D, Design System..."
                className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#7758E2]"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#F5F5F7] text-xs font-semibold text-[#0E0727]"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={!newFolderName.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-[#7758E2] text-xs font-semibold text-white disabled:opacity-50"
                >
                  Tạo ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
