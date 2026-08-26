import React, { useState } from 'react';
import { useMneme } from '../state/mnemeContext';
import { MnemeImage } from '../components/common/MnemeImage';
import { FigmaIcon } from '../components/common/FigmaIcon';
import { FigmaAnalysisStatus } from '../components/common/FigmaAnalysisStatus';

export const ProfileScreen: React.FC = () => {
  const { links, notebooks, folders, resetDemoData } = useMneme();
  const [resetDone, setResetDone] = useState(false);

  const handleReset = () => {
    resetDemoData();
    setResetDone(true);
    setTimeout(() => setResetDone(false), 2500);
  };

  return (
    <div className="pb-28 pt-4 px-4 space-y-6">
      {/* Title */}
      <h2 className="text-xl font-bold text-[#0E0727]">Cá nhân</h2>

      {/* Avatar & Profile Card */}
      <div className="text-center space-y-2">
        <div className="mx-auto w-24 h-24 rounded-full overflow-hidden border-2 border-[#7758E2]/20 shadow-md">
          <img
            src="/assets/images/avatar.png"
            alt="Avatar"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>
        <div>
          <h3 className="text-lg font-bold text-[#0E0727]">echs</h3>
          <p className="text-xs text-[#9490A2]">Demo local · không cần đăng nhập</p>
        </div>
      </div>

      {/* Stats Counter Card */}
      <div className="grid grid-cols-3 gap-3 bg-white rounded-3xl p-4 shadow-xs border border-black/5 text-center">
        <div className="p-2">
          <span className="text-lg font-extrabold text-[#7758E2]">{links.length}</span>
          <span className="text-[11px] text-[#9490A2] block mt-0.5">Liên kết</span>
        </div>
        <div className="p-2 border-x border-black/5">
          <span className="text-lg font-extrabold text-[#7758E2]">{notebooks.length}</span>
          <span className="text-[11px] text-[#9490A2] block mt-0.5">Sổ tay AI</span>
        </div>
        <div className="p-2">
          <span className="text-lg font-extrabold text-[#7758E2]">{folders.length}</span>
          <span className="text-[11px] text-[#9490A2] block mt-0.5">Thư mục</span>
        </div>
      </div>

      {/* Settings list */}
      <div className="bg-white rounded-3xl p-2 shadow-xs border border-black/5 divide-y divide-black/5">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#F1EEFC] text-[#7758E2] flex items-center justify-center">
              <FigmaIcon name="edit" size={16} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#0E0727]">Giao diện & Chủ đề</h4>
              <p className="text-[11px] text-[#9490A2]">Figma Design Tokens 2159 Edition</p>
            </div>
          </div>
          <FigmaIcon name="chevron-right" size={18} className="text-[#9490A2]" />
        </div>

        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#F1EEFC] text-[#7758E2] flex items-center justify-center">
              <FigmaIcon name="layers" size={16} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#0E0727]">Dữ liệu local</h4>
              <p className="text-[11px] text-[#9490A2]">Đồng bộ SQLite & LocalStorage trên thiết bị</p>
            </div>
          </div>
          <FigmaAnalysisStatus done={true} inProgress={false} size={20} />
        </div>

        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#F1EEFC] text-[#7758E2] flex items-center justify-center">
              <FigmaIcon name="open-book" size={16} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#0E0727]">Mneme Showcase</h4>
              <p className="text-[11px] text-[#9490A2]">Phiên bản 1.0.0 (React + Gemini 2.5 Flash)</p>
            </div>
          </div>
          <span className="text-xs font-bold text-[#7758E2]">v1.0</span>
        </div>
      </div>

      {/* Reset Demo Data Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleReset}
          className="w-full py-3 rounded-2xl bg-[#F5F5F7] hover:bg-red-50 hover:text-red-600 text-xs font-semibold text-[#0E0727] transition-colors"
        >
          {resetDone ? '✓ Đã đặt lại dữ liệu mẫu' : 'Đặt lại dữ liệu mẫu ban đầu'}
        </button>
      </div>
    </div>
  );
};
