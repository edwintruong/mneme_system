import React from 'react';
import { useMneme } from '../state/mnemeContext';
import { SavedLink, Notebook } from '../types';
import { SectionTitle } from '../components/common/SectionTitle';
import { LinkTile } from '../components/common/LinkTile';
import { FigmaIcon } from '../components/common/FigmaIcon';

interface ActivityScreenProps {
  onSelectLink: (link: SavedLink) => void;
  onViewSuggestions: (notebook: Notebook) => void;
}

export const ActivityScreen: React.FC<ActivityScreenProps> = ({
  onSelectLink,
  onViewSuggestions,
}) => {
  const { links, notebooks } = useMneme();

  const activeNotebook = notebooks[0];

  return (
    <div className="pb-28 pt-4 px-4 space-y-5">
      {/* Title */}
      <h2 className="text-xl font-bold text-[#0E0727]">Hoạt động</h2>

      {/* AI Recommendation Banner */}
      <div className="bg-white rounded-3xl p-6 shadow-xs border border-black/5 text-center space-y-3">
        <div className="w-14 h-14 rounded-full bg-[#F1EEFC] text-[#7758E2] mx-auto flex items-center justify-center">
          <FigmaIcon name="ai" size={26} color="#7758E2" />
        </div>

        <div>
          <h3 className="text-base font-bold text-[#0E0727]">AI có gợi ý mới cho bạn</h3>
          <p className="text-xs text-[#9490A2] mt-1 max-w-xs mx-auto">
            2 video mới có thể bổ sung vào {activeNotebook?.title || 'sổ tay của bạn'}
          </p>
        </div>

        <button
          type="button"
          disabled={!activeNotebook}
          onClick={() => activeNotebook && onViewSuggestions(activeNotebook)}
          className="w-full py-3 rounded-2xl bg-[#7758E2] text-white font-bold text-xs shadow-md shadow-[#7758E2]/25 hover:bg-[#613EEA] active:scale-[0.98] transition-all"
        >
          Xem gợi ý
        </button>
      </div>

      {/* Recently Saved Items */}
      <div className="bg-white rounded-3xl p-4 shadow-xs space-y-2">
        <SectionTitle title="Đã lưu gần đây" />
        <div className="divide-y divide-black/5">
          {links.slice(0, 4).map((link) => (
            <LinkTile
              key={link.id}
              link={link}
              onClick={() => onSelectLink(link)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
