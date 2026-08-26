import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Helper to lazily instantiate Google Gen AI client
  function getGeminiClient(): GoogleGenAI | null {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key.trim() === '') return null;
    return new GoogleGenAI({ apiKey: key.trim() });
  }

  // Health endpoint
  app.get('/api/health', (req, res) => {
    const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '');
    res.json({ status: 'ok', geminiConfigured: hasKey });
  });

  // Analyze URL endpoint
  app.post('/api/gemini/analyze-url', async (req, res) => {
    const { url, suggestedCategory = 'Design', suggestedFolder = 'UI/UX' } = req.body;

    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'URL is required' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        usedGemini: false,
        fallbackReason: 'GEMINI_API_KEY chưa được cấu hình trên server',
        draft: null,
      });
    }

    try {
      const prompt = `
Bạn là bộ máy lưu trữ tri thức của Mneme. Hãy phân tích URL sau:
${url}

Trả lời bằng JSON thuần túy (không markdown fense nếu có thể) với cấu trúc:
{
  "title": "tiêu đề thực tế, tối đa 90 ký tự",
  "summary": "tóm tắt có ích trong 2-3 câu, tối đa 350 ký tự",
  "category": "nhóm chủ đề chính (ví dụ: ${suggestedCategory}, Ẩm thực, Du lịch, Phim ảnh, Công nghệ)",
  "folder": "thư mục cụ thể (ví dụ: ${suggestedFolder}, UI/UX, Graphic, Công thức, Điểm đến)",
  "source": "Website | YouTube | TikTok | Instagram | Khác",
  "tags": ["tag1", "tag2", "tag3"]
}
Nếu URL không thể truy cập trực tiếp, hãy suy luận logic từ cấu trúc URL.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          temperature: 0.2,
          responseMimeType: 'application/json',
        },
      });

      const responseText = response.text || '';
      const cleanJson = responseText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
      const parsed = JSON.parse(cleanJson);

      return res.json({
        usedGemini: true,
        draft: {
          title: parsed.title || 'Nội dung lưu từ liên kết',
          summary: parsed.summary || 'Nội dung được Mneme phân tích và tóm tắt tự động.',
          category: parsed.category || suggestedCategory,
          folder: parsed.folder || suggestedFolder,
          source: parsed.source || 'Website',
          tags: Array.isArray(parsed.tags) ? parsed.tags : ['Link'],
        },
      });
    } catch (err: any) {
      console.warn('Gemini analyze-url warning:', err?.message || err);
      return res.json({
        usedGemini: false,
        fallbackReason: err?.message || 'Gemini không phản hồi kịp thời',
        draft: null,
      });
    }
  });

  // Create Notebook synthesis endpoint
  app.post('/api/gemini/create-notebook', async (req, res) => {
    const { sources } = req.body;

    if (!Array.isArray(sources) || sources.length === 0) {
      return res.status(400).json({ error: 'At least one source is required' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        usedGemini: false,
        fallbackReason: 'GEMINI_API_KEY chưa được cấu hình trên server',
        draft: null,
      });
    }

    try {
      const sourceList = sources
        .map(
          (s: any, idx: number) =>
            `Nguồn ${idx + 1}:
- Tiêu đề: ${s.title || ''}
- URL: ${s.url || ''}
- Tóm tắt: ${s.summary || ''}`
        )
        .join('\n\n');

      const prompt = `
Bạn là biên tập viên tri thức của Mneme. Hãy tổng hợp các nguồn sau thành một Sổ tay kiến thức hoàn chỉnh, logic và hữu ích bằng tiếng Việt:

${sourceList}

Yêu cầu trả về JSON có dạng:
{
  "title": "Tên sổ tay súc tích (tối đa 70 ký tự)",
  "description": "Mô tả 2 câu về giá trị của sổ tay này",
  "sections": [
    {
      "title": "Tiêu đề mục",
      "body": "Nội dung tổng hợp sâu sắc, mạch lạc (60-150 từ mỗi mục)"
    }
  ]
}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          temperature: 0.3,
          responseMimeType: 'application/json',
        },
      });

      const responseText = response.text || '';
      const cleanJson = responseText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
      const parsed = JSON.parse(cleanJson);

      return res.json({
        usedGemini: true,
        draft: {
          title: parsed.title || 'Sổ tay tổng hợp Mneme',
          description: parsed.description || 'Sổ tay AI tổng hợp từ các nguồn nội dung đã chọn.',
          sections: Array.isArray(parsed.sections) && parsed.sections.length > 0
            ? parsed.sections
            : [
                {
                  title: 'Tổng quan kiến thức',
                  body: 'Tổng hợp từ các liên kết đã chọn nhằm phục vụ mục đích tra cứu và học tập nhanh chóng.',
                },
              ],
        },
      });
    } catch (err: any) {
      console.warn('Gemini create-notebook warning:', err?.message || err);
      return res.json({
        usedGemini: false,
        fallbackReason: err?.message || 'Gemini không phản hồi kịp thời',
        draft: null,
      });
    }
  });

  // Development vs Production serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Mneme server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
