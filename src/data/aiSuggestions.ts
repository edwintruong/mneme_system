export type AiSuggestionId = 'research' | 'food' | 'ai-tips' | 'figma-tips';

export interface AiSuggestionItem {
  id: string;
  title: string;
  image: string;
  source: string;
  author: string;
  url: string;
  score: number;
  reasons: [string, string, string];
}

export interface AiSuggestion {
  id: AiSuggestionId;
  notebookTitle: string;
  notebookDescription: string;
  notebookImage: string;
  group: 'Hôm nay' | 'Hôm qua' | '2 ngày trước';
  summary: string;
  matchScore: number;
  newForFilter: boolean;
  showNewBadge: boolean;
  listImageSize: 64 | 80;
  contentLabel: 'Bài viết đề xuất' | 'Video đề xuất';
  headerHeight: number;
  items: [AiSuggestionItem, AiSuggestionItem];
}

const IMG = '/assets/images/figma_2172';

export const AI_SUGGESTIONS: AiSuggestion[] = [
  {
    id: 'research',
    notebookTitle: 'Research với NotebookLM',
    notebookDescription: 'Tổng hợp các bài viết hướng dẫn dùng NotebookLM để nghiên cứu và tổng hợp tài liệu hiệu quả hơn.',
    notebookImage: '/assets/icons/figma_2159/2159_12891_notebooklm.svg',
    group: 'Hôm nay',
    summary: '2 bài viết mới có thể bổ sung',
    matchScore: 92,
    newForFilter: true,
    showNewBadge: true,
    listImageSize: 80,
    contentLabel: 'Bài viết đề xuất',
    headerHeight: 263,
    items: [
      {
        id: 'notebooklm-summary',
        title: 'Dùng NotebookLM để tóm tắt tài liệu',
        image: `${IMG}/2172_5510_article_notebooklm.jpg`,
        source: 'Blog',
        author: '@ai.studytips',
        url: 'https://blog.notebooklm.tips/',
        score: 96,
        reasons: [
          'Nội dung hướng dẫn NotebookLM, đúng chủ đề bạn đang tìm hiểu',
          'Có ví dụ minh họa từng bước, dễ áp dụng ngay',
          'Được chia sẻ nhiều trong cộng đồng học tập bằng AI gần đây',
        ],
      },
      {
        id: 'notebooklm-research',
        title: '5 mẹo khai thác NotebookLM cho nghiên cứu chuyên sâu',
        image: `${IMG}/2172_5510_article_research.jpg`,
        source: 'Medium',
        author: '@research.ai',
        url: 'https://medium.com/',
        score: 91,
        reasons: [
          'Danh sách mẹo sử dụng NotebookLM phù hợp với sở thích đã lưu',
          'Có phân tích ưu nhược điểm từng tính năng',
          'Chủ đề khớp với các bài viết về AI nghiên cứu đã lưu trong sổ tay',
        ],
      },
    ],
  },
  {
    id: 'food',
    notebookTitle: 'Món ăn dễ nấu trong 15 phút',
    notebookDescription: 'Tổng hợp những món nhanh, ít nguyên liệu và dễ làm.',
    notebookImage: `${IMG}/2172_5336_cover_food.jpg`,
    group: 'Hôm nay',
    summary: '2 video mới có thể bổ sung',
    matchScore: 95,
    newForFilter: true,
    showNewBadge: true,
    listImageSize: 64,
    contentLabel: 'Video đề xuất',
    headerHeight: 240,
    items: [
      {
        id: 'egg-cheese',
        title: 'Bánh trứng phô mai',
        image: `${IMG}/2172_5409_video_egg.jpg`,
        source: 'TikTok',
        author: '@easy.cooking',
        url: 'https://tiktok.com/',
        score: 95,
        reasons: [
          'Thời gian nấu ngắn, phù hợp với tiêu chí dưới 15 phút',
          'Nguyên liệu đơn giản, dễ chuẩn bị',
          'Ít bước nấu, phù hợp cho bữa sáng nhanh',
        ],
      },
      {
        id: 'sesame-tofu',
        title: 'Đậu phụ sốt mè',
        image: `${IMG}/2172_5409_video_tofu.jpg`,
        source: 'TikTok',
        author: '@homecook.tips',
        url: 'https://tiktok.com/',
        score: 95,
        reasons: [
          'Thời gian nấu ngắn, phù hợp với tiêu chí dưới 15 phút',
          'Nguyên liệu đơn giản, dễ chuẩn bị',
          'Ít bước nấu, phù hợp cho bữa sáng nhanh',
        ],
      },
    ],
  },
  {
    id: 'ai-tips',
    notebookTitle: 'AI Tips & Tricks',
    notebookDescription: 'Tổng hợp các video mẹo và thủ thuật sử dụng AI hiệu quả hơn được lưu gần đây.',
    notebookImage: `${IMG}/2172_5336_cover_ai.jpg`,
    group: 'Hôm qua',
    summary: '2 video mới có thể bổ sung',
    matchScore: 92,
    newForFilter: false,
    showNewBadge: false,
    listImageSize: 80,
    contentLabel: 'Video đề xuất',
    headerHeight: 254,
    items: [
      {
        id: 'chatgpt-prompts',
        title: '10 prompt ChatGPT giúp làm việc nhanh gấp đôi',
        image: `${IMG}/2172_5614_video_prompts.jpg`,
        source: 'YouTube',
        author: '@ai.productivity',
        url: 'https://youtube.com/',
        score: 95,
        reasons: [
          'Nội dung xoay quanh mẹo dùng AI, đúng chủ đề bạn đang lưu',
          'Có ví dụ prompt cụ thể, dễ áp dụng ngay',
          'Được nhắc đến nhiều trong các video AI đã lưu gần đây',
        ],
      },
      {
        id: 'ai-image',
        title: 'Thủ thuật dùng AI tạo ảnh chỉ với vài từ khóa',
        image: `${IMG}/2172_5614_video_image_ai.jpg`,
        source: 'TikTok',
        author: '@aitools.vn',
        url: 'https://tiktok.com/',
        score: 88,
        reasons: [
          'Danh sách thủ thuật AI phù hợp với sở thích đã lưu',
          'Có hướng dẫn ngắn gọn, dễ làm theo',
          'Chủ đề khớp với các video AI tips đã lưu trong sổ tay',
        ],
      },
    ],
  },
  {
    id: 'figma-tips',
    notebookTitle: 'Figma Tips & Tricks',
    notebookDescription: 'Tổng hợp các mẹo dùng Figma nhanh và gọn hơn khi thiết kế.',
    notebookImage: `${IMG}/2172_5336_cover_figma.jpg`,
    group: '2 ngày trước',
    summary: '2 video mới có thể bổ sung',
    matchScore: 92,
    newForFilter: false,
    showNewBadge: true,
    listImageSize: 80,
    contentLabel: 'Video đề xuất',
    headerHeight: 240,
    items: [
      {
        id: 'figma-shortcuts',
        title: '5 phím tắt Figma giúp thao tác nhanh gấp đôi',
        image: `${IMG}/2172_5717_video_shortcuts.jpg`,
        source: 'TikTok',
        author: '@designtips',
        url: 'https://tiktok.com/',
        score: 92,
        reasons: [
          'Liệt kê phím tắt thực tế, ít người biết',
          'Video ngắn gọn, dễ xem lại khi cần',
          'Đúng chủ đề mẹo Figma đang theo dõi',
        ],
      },
      {
        id: 'figma-autolayout',
        title: 'Cách dùng Auto Layout để không phải chỉnh tay từng nút',
        image: `${IMG}/2172_5717_video_autolayout.jpg`,
        source: 'YouTube',
        author: '@uiuxvn',
        url: 'https://youtube.com/',
        score: 86,
        reasons: [
          'Giải thích rõ nguyên lý Auto Layout cho người mới',
          'Có ví dụ dựng layout thực tế từng bước',
          'Giúp tiết kiệm thời gian khi chỉnh sửa thiết kế',
        ],
      },
    ],
  },
];

export const getAiSuggestion = (id: AiSuggestionId) =>
  AI_SUGGESTIONS.find((suggestion) => suggestion.id === id);
