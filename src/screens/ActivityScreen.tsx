import React from 'react';

interface ActivityItem {
  id: number;
  image: string;
  prefix: string;
  highlight: string;
  highlightColor: '#7758e2' | '#6095ff';
  time: string;
}

/** Node 2172:4218 "Hôm nay" — fixed notification-feed copy, per Figma. */
const TODAY_ITEMS: ActivityItem[] = [
  {
    id: 1,
    image: '/assets/images/figma_2172/2172_4208_notif1.jpg',
    prefix: 'AI đã phát hiện 3 nội dung mới có thể thêm vào sổ tay',
    highlight: 'Movies to Watch',
    highlightColor: '#7758e2',
    time: '11.00 AM',
  },
  {
    id: 2,
    image: '/assets/images/figma_2172/2172_4208_notif2.jpg',
    prefix: 'AI đã phát hiện 3 nội dung mới có thể thêm vào sổ tay',
    highlight: 'Cake Receipts',
    highlightColor: '#7758e2',
    time: '11.00 AM',
  },
  {
    id: 3,
    image: '/assets/images/figma_2172/2172_4208_notif3.jpg',
    prefix: '3 video đã được thêm vào',
    highlight: 'Học tập & Công việc',
    highlightColor: '#6095ff',
    time: '11.00 AM',
  },
];

/** Node 2172:4238 "Hôm qua" — fixed notification-feed copy, per Figma. */
const YESTERDAY_ITEMS: ActivityItem[] = [
  {
    id: 4,
    image: '/assets/images/figma_2172/2172_4208_notif1.jpg',
    prefix: '1 bài viết đã được thêm vào',
    highlight: 'Phim ảnh',
    highlightColor: '#6095ff',
    time: '11.00 AM',
  },
  {
    id: 5,
    image: '/assets/images/figma_2172/2172_4208_notif4.jpg',
    prefix: 'AI đã phát hiện 3 nội dung mới có thể thêm vào sổ tay',
    highlight: 'AI Tips & Tricks',
    highlightColor: '#7758e2',
    time: '11.00 AM',
  },
  {
    id: 6,
    image: '/assets/images/figma_2172/2172_4208_notif5.jpg',
    prefix: '3 video đã được thêm vào',
    highlight: 'Travel Inspiration',
    highlightColor: '#6095ff',
    time: '11.00 AM',
  },
];

const ActivityRow: React.FC<{ item: ActivityItem }> = ({ item }) => (
  <div className="flex w-full shrink-0 items-center border-b border-[#efefef] p-[16px]">
    <div className="flex w-[295px] items-center gap-[12px]">
      <div className="size-[40px] shrink-0 overflow-hidden rounded-[7.5px]">
        <img src={item.image} alt="" className="size-full object-cover" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col items-start gap-[4px]">
        <p className="w-full text-[14px] leading-[20px] font-medium text-[#222741]">
          <span className="font-normal">{item.prefix}</span>{' '}
          <span style={{ color: item.highlightColor }}>{item.highlight}</span>
        </p>
        <p className="text-[12px] leading-[16px] font-medium tracking-[0.5px] whitespace-nowrap text-[#acaebe]">
          {item.time}
        </p>
      </div>
    </div>
  </div>
);

export const ActivityScreen: React.FC = () => {
  return (
    <div className="flex w-full flex-col items-center">
      {/* Node 2172:4213 title bar */}
      <div className="w-full shrink-0 rounded-bl-[16px] rounded-br-[16px] bg-white py-[20px] shadow-[0_34px_38px_-13px_rgba(153,134,217,0.06),0_137px_68.5px_-27px_rgba(153,134,217,0.05),0_309px_92.5px_-40px_rgba(153,134,217,0.04)]">
        <h1 className="px-[20px] text-center text-[18px] leading-[28px] font-medium text-[#0e0727]">Hoạt động</h1>
      </div>

      <div className="flex w-full flex-col items-start gap-[16px] px-[20px] pt-[15px]">
        <p className="text-[14px] leading-[20px] font-medium tracking-[0.4px] whitespace-nowrap text-[#acaebe]">Hôm nay</p>
        <div className="flex w-full flex-col items-start gap-[4px] overflow-hidden rounded-[12px] bg-white">
          {TODAY_ITEMS.map((item) => (
            <ActivityRow key={item.id} item={item} />
          ))}
        </div>

        <p className="text-[14px] leading-[20px] font-medium tracking-[0.4px] whitespace-nowrap text-[#acaebe]">Hôm qua</p>
        <div className="flex w-full flex-col items-start gap-[4px] overflow-hidden rounded-[12px] bg-white">
          {YESTERDAY_ITEMS.map((item) => (
            <ActivityRow key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};
