import React from 'react';
import { FigmaIcon } from '../common/FigmaIcon';

export type TabType = 'home' | 'notebook' | 'activity' | 'profile';

interface BottomNavigationProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  onAddClick: () => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentTab,
  onTabChange,
  onAddClick,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40 px-4 pb-4 pointer-events-none">
      <div className="bg-white/95 backdrop-blur-md rounded-[32px] shadow-lg border border-black/5 px-6 py-2.5 flex items-center justify-between pointer-events-auto relative">
        {/* Home */}
        <button
          type="button"
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all ${
            currentTab === 'home' ? 'text-[#7758E2] scale-105' : 'text-[#9490A2] hover:text-[#0E0727]'
          }`}
        >
          <FigmaIcon name="home" size={22} color={currentTab === 'home' ? '#7758E2' : '#9490A2'} />
          <span className="text-[10px] font-semibold mt-1">Trang chủ</span>
        </button>

        {/* Notebook */}
        <button
          type="button"
          onClick={() => onTabChange('notebook')}
          className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all ${
            currentTab === 'notebook' ? 'text-[#7758E2] scale-105' : 'text-[#9490A2] hover:text-[#0E0727]'
          }`}
        >
          <FigmaIcon name="open-book" size={22} color={currentTab === 'notebook' ? '#7758E2' : '#9490A2'} />
          <span className="text-[10px] font-semibold mt-1">Sổ tay</span>
        </button>

        {/* Floating Center Plus */}
        <div className="relative -top-5">
          <button
            type="button"
            onClick={onAddClick}
            aria-label="Thêm liên kết mới"
            className="w-13 h-13 rounded-full bg-gradient-to-tr from-[#613EEA] to-[#7758E2] text-white flex items-center justify-center shadow-lg shadow-[#7758E2]/40 hover:scale-105 active:scale-95 transition-all"
          >
            <FigmaIcon name="plus" size={26} color="#FFFFFF" />
          </button>
        </div>

        {/* Activity */}
        <button
          type="button"
          onClick={() => onTabChange('activity')}
          className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all ${
            currentTab === 'activity' ? 'text-[#7758E2] scale-105' : 'text-[#9490A2] hover:text-[#0E0727]'
          }`}
        >
          <FigmaIcon name="ai" size={22} color={currentTab === 'activity' ? '#7758E2' : '#9490A2'} />
          <span className="text-[10px] font-semibold mt-1">Hoạt động</span>
        </button>

        {/* Profile */}
        <button
          type="button"
          onClick={() => onTabChange('profile')}
          className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all ${
            currentTab === 'profile' ? 'text-[#7758E2] scale-105' : 'text-[#9490A2] hover:text-[#0E0727]'
          }`}
        >
          <div className="w-5.5 h-5.5 rounded-full overflow-hidden border border-[#9490A2]/40">
            <img src="/assets/images/avatar.png" alt="Profile" className="w-full h-full object-cover" />
          </div>
          <span className="text-[10px] font-semibold mt-1">Cá nhân</span>
        </button>
      </div>
    </div>
  );
};
