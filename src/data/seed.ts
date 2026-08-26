import { MnemeCategory, SavedLink, Notebook } from '../types';

export const INITIAL_CATEGORIES: MnemeCategory[] = [
  { id: 1, name: 'Học tập & Công việc', image: '/assets/images/figma.png', itemCount: 24 },
  { id: 2, name: 'Du lịch', image: '/assets/images/travel.png', itemCount: 10 },
  { id: 3, name: 'Phim ảnh', image: '/assets/images/movies.png', itemCount: 10 },
  { id: 4, name: 'Công thức bánh', image: '/assets/images/cake.png', itemCount: 10 },
];

export const INITIAL_FOLDERS: string[] = ['UI/UX', 'Graphic', 'Motion', '3D'];

export const INITIAL_LINKS: SavedLink[] = [
  {
    id: 5,
    title: 'Bánh chuối bằng nồi chiên không dầu',
    url: 'https://www.tiktok.com/@mneme/video/air-fryer-banana-cake',
    summary: 'Công thức làm bánh chuối mềm thơm bằng nồi chiên không dầu, nhanh và dễ làm tại nhà.',
    category: 'Ẩm thực',
    folder: 'Công thức',
    image: '/assets/images/cake.png',
    source: 'TikTok',
    tags: ['Bánh', 'Nồi chiên', 'Dễ làm'],
    favorite: false,
    savedAt: '10 phút trước',
  },
  {
    id: 4,
    title: 'Figma Auto Layout Tips',
    url: 'https://www.youtube.com/watch?v=mneme-demo-0',
    summary: 'Tổng hợp kiến thức thực tế về Auto Layout, constraints và component variants trong Figma.',
    category: 'Design',
    folder: 'UI/UX',
    image: '/assets/images/figma.png',
    source: 'YouTube',
    tags: ['Figma', 'AutoLayout'],
    favorite: true,
    savedAt: '2 giờ trước',
  },
  {
    id: 3,
    title: 'How to build a design system',
    url: 'https://www.youtube.com/watch?v=mneme-demo-1',
    summary: 'Tổng hợp kiến thức thực tế về Auto Layout, constraints và component variants trong Figma.',
    category: 'Design',
    folder: 'Graphic',
    image: '/assets/images/figma.png',
    source: 'TikTok',
    tags: ['DesignSystem'],
    favorite: false,
    savedAt: '1 ngày trước',
  },
  {
    id: 2,
    title: 'Figma Auto Layout Tips',
    url: 'https://www.youtube.com/watch?v=mneme-demo-2',
    summary: 'Tổng hợp kiến thức thực tế về Auto Layout, constraints và component variants trong Figma.',
    category: 'Design',
    folder: 'UI/UX',
    image: '/assets/images/figma.png',
    source: 'YouTube',
    tags: ['Figma'],
    favorite: false,
    savedAt: '2 ngày trước',
  },
  {
    id: 1,
    title: 'How to build a design system',
    url: 'https://www.youtube.com/watch?v=mneme-demo-3',
    summary: 'Tổng hợp kiến thức thực tế về Auto Layout, constraints và component variants trong Figma.',
    category: 'Design',
    folder: 'Graphic',
    image: '/assets/images/figma.png',
    source: 'TikTok',
    tags: ['Design'],
    favorite: false,
    savedAt: '3 ngày trước',
  },
];

export const INITIAL_NOTEBOOKS: Notebook[] = [
  {
    id: 1,
    title: 'Figma Tips & Tricks',
    description: 'Tổng hợp kỹ thuật thiết kế Auto Layout, Design System và tối ưu component trong Figma.',
    image: '/assets/images/figma.png',
    itemCount: 24,
    createdAt: '2/2/2026',
    sections: [
      {
        title: 'Auto Layout cơ bản và nâng cao',
        body: 'Hướng dẫn áp dụng Auto Layout kết hợp Min/Max Width, Hug content và Fill container để tạo component co giãn đa màn hình chuẩn mực.',
      },
      {
        title: 'Component Variants & Props',
        body: 'Cách tổ chức Boolean props, Instance swap và Text props giúp giảm thiểu số lượng variant rác và tăng tốc thiết kế cho cả team.',
      },
      {
        title: 'Tokens và Variables đồng bộ Code',
        body: 'Quy chuẩn đặt tên màu sắc, spacing và typography tương thích Figma Tokens và Tailwind CSS.',
      },
    ],
  },
  {
    id: 2,
    title: 'Travel Inspiration',
    description: 'Những địa điểm du lịch và trải nghiệm ẩm thực đáng lưu lại cho kỳ nghỉ tiếp theo.',
    image: '/assets/images/travel.png',
    itemCount: 10,
    createdAt: '15/1/2026',
    sections: [
      {
        title: 'Lịch trình Đà Lạt 3N2Đ',
        body: 'Tổng hợp các quán cà phê ngắm hoàng hôn, đồi thông săn mây và quán ăn đặc sản.',
      },
      {
        title: 'Cung đường biển miền Trung',
        body: 'Checklist địa điểm Quy Nhơn - Phú Yên cùng kinh nghiệm thuê xe tự lái.',
      },
    ],
  },
  {
    id: 3,
    title: 'Movies to Watch',
    description: 'Danh sách phim điện ảnh và series hay tuyển chọn năm 2026.',
    image: '/assets/images/movies.png',
    itemCount: 10,
    createdAt: '10/1/2026',
    sections: [
      {
        title: 'Top phim Sci-Fi & Trí tuệ nhân tạo',
        body: 'Các bộ phim viễn tưởng khám phá chiều sâu tri thức và tương lai công nghệ.',
      },
    ],
  },
];
