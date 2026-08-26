import React, { useState } from 'react';
import { useMneme } from '../state/mnemeContext';
import { FigmaBackButton } from '../components/common/FigmaBackButton';
import { FigmaIcon } from '../components/common/FigmaIcon';
import { MnemeImage } from '../components/common/MnemeImage';

interface SelectSourcesScreenProps {
  fromFolder?: boolean;
  onBack: () => void;
  onSynthesize: (sourceIds: number[]) => void;
}

export const SelectSourcesScreen: React.FC<SelectSourcesScreenProps> = ({
  fromFolder = false,
  onBack,
  onSynthesize,
}) => {
  const { links, folders } = useMneme();
  const [selectedLinkIds, setSelectedLinkIds] = useState<number[]>(() => {
    // Default select first 2-3 links for showcase
    return links.slice(0, 2).map((l) => l.id);
  });
  const [selectedFolder, setSelectedFolder] = useState<string>(folders[0] || 'UI/UX');

  const toggleLink = (id: number) => {
    setSelectedLinkIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (fromFolder) {
      const folderLinkIds = links.filter((l) => l.folder === selectedFolder).map((l) => l.id);
      if (folderLinkIds.length > 0) {
        onSynthesize(folderLinkIds);
      } else {
        // Fallback to top links if empty
        onSynthesize(links.slice(0, 2).map((l) => l.id));
      }
    } else {
      if (selectedLinkIds.length > 0) {
        onSynthesize(selectedLinkIds);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6FD] pb-32">
      {/* Top App Bar */}
      <div className="sticky top-0 bg-[#F8F6FD]/90 backdrop-blur-md px-4 py-3 z-30 flex items-center justify-between">
        <FigmaBackButton onClick={onBack} />
        <h2 className="text-base font-semibold text-[#0E0727]">
          {fromFolder ? 'Chọn thư mục tổng hợp' : 'Chọn nội dung nguồn'}
        </h2>
        <div className="w-8" />
      </div>

      <div className="px-4 space-y-4 pt-1">
        <div className="bg-[#F1EEFC] rounded-2xl p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#7758E2]">
            <FigmaIcon name="ai" size={18} color="#7758E2" />
            <span className="text-xs font-bold">
              {fromFolder
                ? `Thư mục đã chọn: ${selectedFolder}`
                : `Đã chọn ${selectedLinkIds.length} nguồn tài liệu`}
            </span>
          </div>
        </div>

        {fromFolder ? (
          /* Folder Picker */
          <div className="space-y-3">
            {folders.map((f) => {
              const count = links.filter((l) => l.folder === f).length;
              const isSelected = selectedFolder === f;
              return (
                <div
                  key={f}
                  onClick={() => setSelectedFolder(f)}
                  className={`bg-white rounded-3xl p-4 shadow-xs flex items-center justify-between cursor-pointer transition-all border ${
                    isSelected ? 'border-[#7758E2] ring-2 ring-[#7758E2]/20' : 'border-black/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#F1EEFC] flex items-center justify-center text-[#7758E2]">
                      <FigmaIcon name="folder-plus" size={20} color="#7758E2" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#0E0727]">{f}</h4>
                      <span className="text-xs text-[#9490A2]">{count} liên kết bên trong</span>
                    </div>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isSelected
                        ? 'border-[#7758E2] bg-[#7758E2] text-white'
                        : 'border-[#D1D1D6]'
                    }`}
                  >
                    {isSelected && <span className="text-xs">✓</span>}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Individual Links Selector */
          <div className="bg-white rounded-3xl p-4 shadow-xs divide-y divide-black/5">
            {links.map((link) => {
              const isSelected = selectedLinkIds.includes(link.id);
              return (
                <div
                  key={link.id}
                  onClick={() => toggleLink(link.id)}
                  className={`flex items-start gap-3 py-3 px-2 rounded-2xl transition-all cursor-pointer ${
                    isSelected ? 'bg-[#F1EEFC]/80' : 'hover:bg-[#F5F5F7]/80'
                  }`}
                >
                  <div className="pt-2 flex-shrink-0">
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-[#7758E2] border-[#7758E2] text-white'
                          : 'border-[#D1D1D6] bg-white'
                      }`}
                    >
                      {isSelected && '✓'}
                    </div>
                  </div>

                  <MnemeImage src={link.image} size={64} radius={12} alt={link.title} />

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-[#0E0727] line-clamp-2 leading-snug">
                      {link.title}
                    </h4>
                    <span className="text-[11px] text-[#9490A2] block mt-1">
                      {link.source} · {link.folder}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white/95 backdrop-blur-md border-t border-black/5 z-40">
        <button
          type="button"
          disabled={!fromFolder && selectedLinkIds.length === 0}
          onClick={handleNext}
          className="w-full py-4 rounded-2xl bg-[#7758E2] text-white font-bold text-sm shadow-lg shadow-[#7758E2]/30 active:scale-[0.98] disabled:opacity-40 transition-all flex items-center justify-center gap-2"
        >
          <FigmaIcon name="ai" size={18} color="#FFFFFF" />
          Tiếp tục tổng hợp sổ tay
        </button>
      </div>
    </div>
  );
};
