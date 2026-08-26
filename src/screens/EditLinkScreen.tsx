import React, { useState } from 'react';
import { SavedLink } from '../types';
import { useMneme } from '../state/mnemeContext';
import { FigmaBackButton } from '../components/common/FigmaBackButton';
import { MnemeImage } from '../components/common/MnemeImage';
import { Tag } from '../components/common/Tag';
import { FigmaIcon } from '../components/common/FigmaIcon';

interface EditLinkScreenProps {
  link: SavedLink;
  onBack: () => void;
  onSaved: () => void;
}

export const EditLinkScreen: React.FC<EditLinkScreenProps> = ({
  link,
  onBack,
  onSaved,
}) => {
  const { folders, updateLink } = useMneme();
  const [title, setTitle] = useState(link.title);
  const [folder, setFolder] = useState(link.folder);
  const [tags, setTags] = useState<string[]>(link.tags || ['Design', 'UI/UX']);
  const [newTagInput, setNewTagInput] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    updateLink(link.id, {
      title: title.trim(),
      folder,
      tags,
    });
    onSaved();
  };

  const addTag = () => {
    if (newTagInput.trim() && !tags.includes(newTagInput.trim())) {
      setTags([...tags, newTagInput.trim()]);
      setNewTagInput('');
      setShowTagInput(false);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  return (
    <div className="min-h-screen bg-[#F8F6FD] pb-28">
      {/* Top Bar */}
      <div className="sticky top-0 bg-[#F8F6FD]/90 backdrop-blur-md px-4 py-3 z-30 flex items-center justify-between">
        <FigmaBackButton onClick={onBack} />
        <h2 className="text-base font-semibold text-[#0E0727]">Chỉnh sửa liên kết</h2>
        <div className="w-8" />
      </div>

      <form onSubmit={handleSave} className="px-4 space-y-5 pt-2">
        {/* Preview Link Summary */}
        <div className="bg-white rounded-3xl p-4 shadow-xs flex items-center gap-3">
          <MnemeImage src={link.image} size={70} radius={16} alt={link.title} />
          <div className="flex-1 min-w-0">
            <span className="text-xs text-[#9490A2] block truncate">{link.url}</span>
            <span className="text-[11px] text-[#7758E2] font-semibold mt-1 inline-block">
              Nguồn: {link.source}
            </span>
          </div>
        </div>

        {/* Title Input */}
        <div className="bg-white rounded-3xl p-5 shadow-xs space-y-2">
          <label className="text-xs font-bold text-[#0E0727] block">Tên liên kết</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl text-sm font-medium text-[#0E0727] outline-none focus:ring-2 focus:ring-[#7758E2]"
          />
        </div>

        {/* Folder Selector */}
        <div className="bg-white rounded-3xl p-5 shadow-xs space-y-2">
          <label className="text-xs font-bold text-[#0E0727] block">Thư mục</label>
          <div className="relative">
            <select
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
              className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl text-sm font-medium text-[#0E0727] appearance-none outline-none focus:ring-2 focus:ring-[#7758E2]"
            >
              {folders.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#9490A2]">
              <FigmaIcon name="dropdown" size={18} />
            </div>
          </div>
        </div>

        {/* Tags Selector */}
        <div className="bg-white rounded-3xl p-5 shadow-xs space-y-2">
          <label className="text-xs font-bold text-[#0E0727] block">Tags</label>
          <div className="flex items-center gap-2 flex-wrap">
            {tags.map((t) => (
              <span
                key={t}
                onClick={() => removeTag(t)}
                className="inline-flex items-center gap-1 px-3 py-1 bg-[#F1EEFC] text-[#7758E2] rounded-full text-xs font-medium cursor-pointer hover:bg-red-50 hover:text-red-500 transition-colors"
                title="Bấm để xóa tag"
              >
                {t}
                <span className="text-[10px]">✕</span>
              </span>
            ))}

            {showTagInput ? (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  autoFocus
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="Tag mới..."
                  className="px-2.5 py-1 text-xs bg-[#F5F5F7] rounded-full outline-none w-24"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="w-6 h-6 rounded-full bg-[#7758E2] text-white flex items-center justify-center text-xs"
                >
                  ✓
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowTagInput(true)}
                className="w-7 h-7 rounded-full bg-[#F1EEFC] text-[#7758E2] flex items-center justify-center hover:scale-105 transition-transform"
              >
                <FigmaIcon name="plus-small" size={16} color="#7758E2" />
              </button>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white/95 backdrop-blur-md border-t border-black/5 z-40">
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-[#7758E2] text-white font-bold text-sm shadow-md shadow-[#7758E2]/30 active:scale-[0.98] transition-all"
          >
            Lưu thay đổi
          </button>
        </div>
      </form>
    </div>
  );
};
