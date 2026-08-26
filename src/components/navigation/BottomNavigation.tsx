import React from 'react';
import { FigmaIcon } from '../common/FigmaIcon';

export type TabType = 'home' | 'notebook' | 'activity' | 'profile';

interface BottomNavigationProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  onAddClick: () => void;
}

/** Figma exports the bar as a single 390x75 vector whose top edge is notched. */
const BAR_WIDTH = 390;
const BAR_HEIGHT = 75;
/** The notch arc is centred on this x in the exported path. */
const NOTCH_CENTER_X = 195;

const ACTIVE = '#7758E2';
const INACTIVE = '#9490A2';

interface TabSpec {
  tab: TabType;
  label: string;
  icon: string;
  activeIcon?: string;
}

/** Two tabs sit left of the notch, two right of it. */
const LEFT_TABS: TabSpec[] = [
  { tab: 'home', label: 'Trang chủ', icon: 'home', activeIcon: 'nav-home-active' },
  { tab: 'notebook', label: 'Sổ tay', icon: 'notebook', activeIcon: 'nav-notebook-active' },
];

const RIGHT_TABS: TabSpec[] = [
  { tab: 'activity', label: 'Hoạt động', icon: 'activity' },
  { tab: 'profile', label: 'Cá nhân', icon: 'profile' },
];

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentTab,
  onTabChange,
  onAddClick,
}) => {
  const renderTab = ({ tab, label, icon, activeIcon }: TabSpec) => {
    const isActive = currentTab === tab;
    return (
      <button
        key={tab}
        type="button"
        onClick={() => onTabChange(tab)}
        aria-current={isActive ? 'page' : undefined}
        className="flex w-[70px] flex-col items-center justify-center gap-1 pt-1"
      >
        <FigmaIcon
          name={isActive && activeIcon ? activeIcon : icon}
          size={24}
          color={isActive ? ACTIVE : INACTIVE}
        />
        <span
          className="text-[10px] font-semibold leading-none"
          style={{ color: isActive ? ACTIVE : INACTIVE }}
        >
          {label}
        </span>
      </button>
    );
  };

  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 z-40 mx-auto"
      style={{ width: BAR_WIDTH, height: BAR_HEIGHT }}
    >
      {/* The notched white bar, straight from Figma. */}
      <FigmaIcon
        name="nav-bg"
        className="absolute inset-0 h-full w-full drop-shadow-[0_-2px_12px_rgba(14,7,39,0.06)]"
      />

      <div className="pointer-events-auto absolute inset-0 flex items-start justify-between px-3 pt-2">
        <div className="flex gap-1">{LEFT_TABS.map(renderTab)}</div>
        <div className="flex gap-1">{RIGHT_TABS.map(renderTab)}</div>
      </div>

      {/* Floating action button, seated in the notch. */}
      <button
        type="button"
        onClick={onAddClick}
        aria-label="Thêm liên kết mới"
        className="pointer-events-auto absolute flex h-14 w-14 items-center justify-center rounded-full bg-[#7758E2] shadow-[0_8px_20px_-6px_rgba(119,88,226,0.7)] transition-transform active:scale-95"
        style={{ left: NOTCH_CENTER_X, top: -6, transform: 'translate(-50%, -50%)' }}
      >
        <FigmaIcon name="plus" size={24} />
      </button>
    </div>
  );
};
