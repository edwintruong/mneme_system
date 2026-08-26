import { MnemeCategory, SavedLink, Notebook } from '../types';

/** Assets exported from Figma node 2159:12771. */
const IMG = '/assets/images/figma_2159/2159_12771_';
/** Assets exported from Figma node 2159:12891. */
const IMG_NB = '/assets/images/figma_2159/2159_12891_';

export const INITIAL_CATEGORIES: MnemeCategory[] = [
  { id: 1, name: 'Học tập & Công việc', image: `${IMG}category_study.jpg`, itemCount: 24 },
  { id: 2, name: 'Du lịch', image: `${IMG}category_travel.jpg`, itemCount: 10 },
  { id: 3, name: 'Phim ảnh', image: `${IMG}category_movie.jpg`, itemCount: 10 },
  { id: 4, name: 'Công thức bánh', image: `${IMG}category_cake.jpg`, itemCount: 10 },
];

export const INITIAL_FOLDERS: string[] = ['UI/UX', 'Graphic', 'Motion', '3D'];

export const INITIAL_LINKS: SavedLink[] = [
  {
    id: 5,
    title: 'Công thức bánh crepe',
    url: 'https://www.tiktok.com/@mneme/video/air-fryer-banana-cake',
    summary: 'Công thức làm bánh chuối mềm thơm bằng nồi chiên không dầu, nhanh và dễ làm tại nhà.',
    category: 'Ẩm thực',
    folder: 'Công thức',
    image: `${IMG}recent_crepe.jpg`,
    source: 'TikTok',
    tags: ['Bánh', 'Nồi chiên', 'Dễ làm'],
    favorite: false,
    savedAt: '10 phút trước',
  },
  {
    id: 4,
    title: 'Tối ưu prompt AI',
    url: 'https://www.youtube.com/watch?v=mneme-demo-0',
    summary: 'Tổng hợp kiến thức thực tế về Auto Layout, constraints và component variants trong Figma.',
    category: 'Design',
    folder: 'UI/UX',
    image: `${IMG}recent_prompt.jpg`,
    source: 'YouTube',
    tags: ['Figma', 'AutoLayout'],
    favorite: true,
    savedAt: '2 giờ trước',
  },
  {
    id: 3,
    title: 'Phim hay mùa hè 2026',
    url: 'https://www.youtube.com/watch?v=mneme-demo-1',
    summary: 'Tổng hợp kiến thức thực tế về Auto Layout, constraints và component variants trong Figma.',
    category: 'Design',
    folder: 'Graphic',
    image: `${IMG}recent_movie.jpg`,
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
    image: `${IMG}category_study.jpg`,
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
    image: `${IMG}category_study.jpg`,
    source: 'TikTok',
    tags: ['Design'],
    favorite: false,
    savedAt: '3 ngày trước',
  },
];

export const INITIAL_NOTEBOOKS: Notebook[] = [
  {
    id: 1,
    title: 'Research với NotebookLM',
    description: 'Tổng hợp kỹ thuật thiết kế Auto Layout, Design System và tối ưu component trong Figma.',
    // An 80px SVG rather than a cover photo, per node 2159:12905.
    image: '/assets/icons/figma_2159/2159_12891_notebooklm.svg',
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
    title: 'Món ăn dễ nấu trong 15 phút',
    description: 'Những công thức nhanh gọn cho bữa tối trong tuần.',
    image: `${IMG_NB}cover_food.jpg`,
    itemCount: 10,
    createdAt: '15/1/2026',
    sections: [
      {
        title: 'Bữa tối 15 phút',
        body: 'Tổng hợp các món xào, mì và salad hoàn thành trong một phần tư giờ.',
      },
    ],
  },
  {
    // The design ships this title with a leading space; kept as-is.
    id: 3,
    title: ' AI Tips & Tricks',
    description: 'Mẹo dùng AI để tăng tốc công việc hằng ngày.',
    image: `${IMG_NB}cover_ai.jpg`,
    itemCount: 10,
    createdAt: '10/1/2026',
    sections: [
      {
        title: 'Prompt hiệu quả',
        body: 'Cách đặt câu hỏi để mô hình trả lời đúng trọng tâm ngay lần đầu.',
      },
    ],
  },
  {
    id: 4,
    title: 'Đánh giá địa điểm du lịch',
    description: 'Địa điểm và trải nghiệm đáng lưu lại cho kỳ nghỉ tiếp theo.',
    image: `${IMG_NB}cover_travel.jpg`,
    itemCount: 10,
    createdAt: '5/1/2026',
    sections: [
      {
        title: 'Lịch trình Đà Lạt 3N2Đ',
        body: 'Tổng hợp các quán cà phê ngắm hoàng hôn, đồi thông săn mây và quán ăn đặc sản.',
      },
    ],
  },
];
