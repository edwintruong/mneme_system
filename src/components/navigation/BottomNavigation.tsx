import React from 'react';
import { FigmaIcon } from '../common/FigmaIcon';

export type TabType = 'home' | 'notebook' | 'activity' | 'profile';

/**
 * Bottom Navigation Bar, Figma node 2159:12841. The bar is 115 tall: the FAB
 * occupies the top 64 and the notched white bg starts at y=40.
 *
 * The bg node measures 428 wide in Figma but its exported vector is 390 and the
 * node renders with the notch centred at x=194.5 of the 390 frame (measured off
 * the Figma render), so it is drawn at 390 here.
 */

interface BottomNavigationProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  onAddClick: () => void;
}

interface TabSpec {
  tab: TabType;
  label: string;
  icon: string;
  activeIcon?: string;
  /** "Cá nhân" is constrained to 47 in the design; the others to 74. */
  labelWidth: number;
  /**
   * The design does not use one active colour: Home's node reads
   * text-color-primary #7758e2 while the notebook list's reads
   * primary-600 #6c50ce. Reproduced per tab rather than normalised.
   */
  activeColor: string;
  activeLabelColor?: string;
  activeLabelWeight?: 'medium' | 'normal';
}

const LEFT_TABS: TabSpec[] = [
  { tab: 'home', label: 'Home', icon: 'home', activeIcon: 'nav-home-active', labelWidth: 74, activeColor: '#7758e2' },
  { tab: 'notebook', label: 'Sổ tay', icon: 'notebook', activeIcon: 'nav-notebook-active', labelWidth: 74, activeColor: '#6c50ce' },
];

const RIGHT_TABS: TabSpec[] = [
  { tab: 'activity', label: 'Hoạt động', icon: 'activity', labelWidth: 74, activeColor: '#7758e2' },
  {
    tab: 'profile',
    label: 'Cá nhân',
    icon: 'profile',
    labelWidth: 47,
    activeColor: '#7758e2',
    activeLabelColor: '#9490a2',
    activeLabelWeight: 'normal',
  },
];

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentTab,
  onTabChange,
  onAddClick,
}) => {
  const renderTab = ({
    tab,
    label,
    icon,
    activeIcon,
    labelWidth,
    activeColor,
    activeLabelColor,
    activeLabelWeight,
  }: TabSpec) => {
    const isActive = currentTab === tab;
    return (
      <button
        key={tab}
        type="button"
        onClick={() => onTabChange(tab)}
        aria-current={isActive ? 'page' : undefined}
        className="flex w-[74px] shrink-0 flex-col items-center gap-[5px] px-[15px] py-[12.5px]"
      >
        <FigmaIcon
          name={isActive && activeIcon ? activeIcon : icon}
          size={24}
          color={isActive ? activeColor : '#9490a2'}
          className="shrink-0"
        />
        <span
          style={{ width: labelWidth, color: isActive ? activeLabelColor ?? activeColor : '#9490a2' }}
          className={`whitespace-nowrap text-center text-[12px] leading-[16px] tracking-[0.4px] ${
            isActive && activeLabelWeight !== 'normal' ? 'font-medium' : 'font-normal'
          }`}
        >
          {label}
        </span>
      </button>
    );
  };

  return (
    <div className="pointer-events-none absolute bottom-0 left-1/2 h-[115px] w-[390px] -translate-x-1/2">
      {/* float-btn, node I2159:12841;287:3150 — 24px glyph inside 20px padding. */}
      <button
        type="button"
        onClick={onAddClick}
        aria-label="Thêm liên kết mới"
        className="pointer-events-auto absolute top-0 left-1/2 flex -translate-x-1/2 flex-col items-center rounded-[50px] bg-gradient-to-b from-[#613eea] to-[#9f8aeb] p-[20px] transition-transform active:scale-95"
      >
        <FigmaIcon name="plus" size={24} className="shrink-0" />
      </button>

      {/* bg, node I2159:12841;285:4122 */}
      <div className="absolute top-[40px] left-0 h-[75px] w-[390px]">
        <FigmaIcon name="nav-bg" className="absolute inset-0 h-full w-full" />
      </div>

      {/* menu, node I2159:12841;285:4125 */}
      <div className="pointer-events-auto absolute top-[40px] right-0 left-0 flex h-[75px] items-start justify-between px-[16px]">
        <div className="flex shrink-0 items-start gap-[10px]">{LEFT_TABS.map(renderTab)}</div>
        <div className="flex shrink-0 items-start gap-[10px]">{RIGHT_TABS.map(renderTab)}</div>
      </div>
    </div>
  );
};
