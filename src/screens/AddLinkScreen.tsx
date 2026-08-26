import React, { useState } from 'react';
import { useMneme } from '../state/mnemeContext';
import { FigmaBackButton } from '../components/common/FigmaBackButton';
import { FigmaIcon } from '../components/common/FigmaIcon';

interface AddLinkScreenProps {
  initialFolder?: string;
  onBack: () => void;
  onStartAnalysis: (params: { url: string; folder: string; category: string }) => void;
}

export const AddLinkScreen: React.FC<AddLinkScreenProps> = ({
  initialFolder,
  onBack,
  onStartAnalysis,
}) => {
  const { folders, categories } = useMneme();
  const [url, setUrl] = useState('');
  const [folder, setFolder] = useState(initialFolder || folders[0] || 'UI/UX');
  const [category, setCategory] = useState(categories[0]?.name || 'Học tập & Công việc');

  const presetSamples = [
    {
      label: 'YouTube · Figma Auto Layout Tips',
      url: 'https://www.youtube.com/watch?v=mneme-figma-autolayout-2026',
      folder: 'UI/UX',
      category: 'Học tập & Công việc',
    },
    {
      label: 'TikTok · Bánh chuối nồi chiên không dầu',
      url: 'https://www.tiktok.com/@mneme/video/air-fryer-banana-cake',
      folder: 'Công thức',
      category: 'Công thức bánh',
    },
    {
      label: 'Website · Design System Handbook',
      url: 'https://designsystems.io/handbook/design-tokens-2026',
      folder: 'Graphic',
      category: 'Học tập & Công việc',
    },
  ];

  const handlePaste = async () => {
    try {
      if (navigator.clipboard?.readText) {
        const text = await navigator.clipboard.readText();
        if (text && text.startsWith('http')) {
          setUrl(text);
        }
      }
    } catch {
      // Ignore clipboard read permission failures
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    onStartAnalysis({
      url: url.trim(),
      folder,
      category,
    });
  };

  return (
    <div className="min-h-screen bg-[#7758E2] flex flex-col">
      {/* Top Header */}
      <div className="px-4 py-3 flex items-center justify-between text-white">
        <FigmaBackButton onClick={onBack} color="#FFFFFF" />
        <h2 className="text-base font-semibold">Thêm liên kết mới</h2>
        <div className="w-8" />
      </div>

      {/* Main Curved Content Sheet */}
      <div className="flex-1 bg-[#F8F6FD] rounded-t-[32px] px-4 pt-6 pb-28 space-y-5 overflow-y-auto">
        <div className="text-center space-y-1.5 mb-2">
          <div className="w-14 h-14 rounded-2xl bg-[#F1EEFC] text-[#7758E2] mx-auto flex items-center justify-center mb-2 shadow-xs">
            <FigmaIcon name="link" size={28} color="#7758E2" />
          </div>
          <h3 className="text-lg font-bold text-[#0E0727]">Lưu liên kết vào Mneme</h3>
          <p className="text-xs text-[#9490A2]">
            AI sẽ tự động đọc, tóm tắt và phân loại liên kết của bạn
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* URL Input */}
          <div className="bg-white rounded-3xl p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#0E0727]">Đường dẫn URL</label>
              <button
                type="button"
                onClick={handlePaste}
                className="text-xs font-semibold text-[#7758E2] hover:underline"
              >
                Dán từ bộ nhớ tạm
              </button>
            </div>
            <div className="relative">
              <input
                type="url"
                required
                autoFocus
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl text-sm font-medium text-[#0E0727] outline-none focus:ring-2 focus:ring-[#7758E2]"
              />
              {url && (
                <button
                  type="button"
                  onClick={() => setUrl('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9490A2] hover:text-[#0E0727] p-1"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Folder & Category selectors */}
          <div className="bg-white rounded-3xl p-5 shadow-xs space-y-4">
            <div>
              <label className="text-xs font-bold text-[#0E0727] mb-1.5 block">
                Thư mục lưu trữ
              </label>
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

            <div>
              <label className="text-xs font-bold text-[#0E0727] mb-1.5 block">
                Chủ đề chính
              </label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl text-sm font-medium text-[#0E0727] appearance-none outline-none focus:ring-2 focus:ring-[#7758E2]"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#9490A2]">
                  <FigmaIcon name="dropdown" size={18} />
                </div>
              </div>
            </div>
          </div>

          {/* Preset Quick Links */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#9490A2] px-1">Gợi ý liên kết mẫu</span>
            <div className="space-y-1.5">
              {presetSamples.map((sample) => (
                <div
                  key={sample.label}
                  onClick={() => {
                    setUrl(sample.url);
                    setFolder(sample.folder);
                    setCategory(sample.category);
                  }}
                  className="p-3 bg-white rounded-2xl shadow-2xs hover:bg-[#F1EEFC] hover:text-[#7758E2] text-xs font-medium text-[#0E0727] cursor-pointer transition-all flex items-center justify-between"
                >
                  <span className="truncate">{sample.label}</span>
                  <FigmaIcon name="plus-small" size={16} />
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!url.trim()}
              className="w-full py-4 rounded-2xl bg-[#7758E2] text-white font-bold text-sm shadow-lg shadow-[#7758E2]/30 active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              <FigmaIcon name="ai" size={18} color="#FFFFFF" />
              Lưu và phân tích với AI
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
