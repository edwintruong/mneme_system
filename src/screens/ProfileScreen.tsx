import React from 'react';
import { FigmaIcon } from '../components/common/FigmaIcon';

const PROFILE_STATS = [
  { value: '17', label: 'Liên kết' },
  { value: '4', label: 'Sổ tay AI' },
  { value: '4', label: 'Thư mục' },
] as const;

interface ProfileMenuRowProps {
  icon: 'profile-theme' | 'profile-local' | 'profile-showcase';
  label: string;
  trailing?: 'chevron' | 'version';
}

const ProfileMenuRow: React.FC<ProfileMenuRowProps> = ({ icon, label, trailing }) => (
  <div className="flex h-[68px] w-[350px] items-center gap-[12px] overflow-hidden px-[16px] py-[14px]">
    <div className="flex size-[40px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--color-primary-50)]">
      <div className="flex size-[24px] items-center justify-center overflow-hidden">
        <FigmaIcon name={icon} />
      </div>
    </div>
    <div className="flex min-w-0 flex-1 items-center overflow-hidden">
      <p className="truncate font-['Roboto',sans-serif] text-[14px] leading-[16px] font-medium text-[var(--color-text-default)]">
        {label}
      </p>
    </div>
    {trailing === 'chevron' && (
      <div className="flex size-[20px] shrink-0 items-center justify-center overflow-hidden">
        <FigmaIcon name="profile-chevron" />
      </div>
    )}
    {trailing === 'version' && (
      <span className="shrink-0 font-['Roboto',sans-serif] text-[14px] leading-[16px] font-bold text-[var(--color-primary-500)]">
        v1.0
      </span>
    )}
  </div>
);

export const ProfileScreen: React.FC = () => {
  return (
    <div className="flex w-[390px] flex-col items-center gap-[23px] bg-[var(--color-background)] text-[var(--color-text-default)]">
      <section className="flex h-[336px] w-full shrink-0 flex-col items-start">
        <header className="z-0 mb-[-63px] flex h-[131px] w-full shrink-0 flex-col items-start rounded-b-[12px] bg-[var(--color-primary-500)] pt-[8px] pb-[29px]">
          <div className="flex h-[40px] w-full items-start justify-center px-[20px] py-[6px]">
            <h1 className="w-[350px] text-center text-[18px] leading-[28px] font-medium text-[var(--color-text-on-primary)]">
              Cá nhân
            </h1>
          </div>
        </header>

        <div className="z-10 flex w-full items-center justify-center px-[17px]">
          <div className="flex h-[268px] w-[356px] flex-col items-start gap-[16px] rounded-[20px] bg-white p-[20px]">
            <div className="flex h-[139px] w-[316px] shrink-0 flex-col items-center gap-[15px]">
              <img
                src="/assets/images/figma_2221/2221_8269_profile_avatar.png"
                alt="Ảnh đại diện của echs"
                className="size-[100px] shrink-0 rounded-full"
              />
              <p className="h-[24px] w-full text-center text-[16px] leading-[24px] font-medium">
                echs
              </p>
            </div>

            <div className="flex h-[73px] w-[336px] shrink-0 items-start overflow-hidden rounded-[16px] bg-white py-[16px]">
              {PROFILE_STATS.map((stat, index) => (
                <React.Fragment key={stat.label}>
                  {index > 0 && <div className="h-[32px] w-[2px] shrink-0 rounded-[7px] bg-[#d5cbf6]" />}
                  <div className="flex h-[41px] min-w-0 flex-1 flex-col items-center gap-[4px] overflow-hidden whitespace-nowrap">
                    <span className="font-['Roboto',sans-serif] text-[20px] leading-[23px] font-bold text-[var(--color-primary-500)]">
                      {stat.value}
                    </span>
                    <span className="font-['Roboto',sans-serif] text-[12px] leading-[14px] font-normal text-[var(--color-text-subtle)]">
                      {stat.label}
                    </span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="h-[206px] w-[350px] shrink-0 overflow-hidden rounded-[16px] bg-white">
        <ProfileMenuRow icon="profile-theme" label="Giao diện & Chủ đề" trailing="chevron" />
        <div className="h-px w-full bg-[#f0f0f0]" />
        <ProfileMenuRow icon="profile-local" label="Dữ liệu local" />
        <div className="h-px w-full bg-[#f0f0f0]" />
        <ProfileMenuRow icon="profile-showcase" label="Mneme Showcase" trailing="version" />
      </section>
    </div>
  );
};
