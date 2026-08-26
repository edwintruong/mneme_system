import React, { useEffect, useState } from 'react';
import { SavedLink, AiExecutionResult } from '../types';
import { useMneme } from '../state/mnemeContext';
import { FigmaAnalysisStatus } from '../components/common/FigmaAnalysisStatus';
import { FigmaIcon } from '../components/common/FigmaIcon';

interface LinkAnalysisScreenProps {
  url: string;
  folder: string;
  category: string;
  onFinished: (createdLink: SavedLink) => void;
  onCancel: () => void;
}

export const LinkAnalysisScreen: React.FC<LinkAnalysisScreenProps> = ({
  url,
  folder,
  category,
  onFinished,
  onCancel,
}) => {
  const { addLink } = useMneme();
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState<AiExecutionResult<SavedLink> | null>(null);
  const [isDone, setIsDone] = useState(false);

  const steps = [
    { title: 'Kết nối và đọc dữ liệu liên kết', desc: 'Đang gửi yêu cầu đến máy chủ Mneme' },
    { title: 'Trích xuất tiêu đề & metadata', desc: 'Nhận diện kênh, tác giả và hình ảnh đại diện' },
    { title: 'Tóm tắt thông minh với Gemini', desc: 'AI phân tích ý chính và cô đọng nội dung' },
    { title: 'Phân loại thư mục & gán nhãn tags', desc: `Đề xuất thư mục: ${folder}` },
    { title: 'Lưu trữ vào bộ nhớ thiết bị', desc: 'Đồng bộ hóa dữ liệu SQLite cục bộ' },
  ];

  useEffect(() => {
    let cancelled = false;

    const runFlow = async () => {
      // Step 0 -> Step 1 -> Step 2
      setCurrentStep(0);
      await new Promise((r) => setTimeout(r, 600));
      if (cancelled) return;

      setCurrentStep(1);
      await new Promise((r) => setTimeout(r, 700));
      if (cancelled) return;

      setCurrentStep(2);
      // Perform actual AI API call in background while animating
      const aiPromise = addLink({ url, category, folder });
      
      await new Promise((r) => setTimeout(r, 900));
      if (cancelled) return;

      setCurrentStep(3);
      await new Promise((r) => setTimeout(r, 700));
      if (cancelled) return;

      const aiResult = await aiPromise;
      if (cancelled) return;

      setResult(aiResult);
      setCurrentStep(4);
      await new Promise((r) => setTimeout(r, 600));
      if (cancelled) return;

      setCurrentStep(5);
      setIsDone(true);
    };

    runFlow();

    return () => {
      cancelled = true;
    };
  }, [url, folder, category]);

  return (
    <div className="min-h-screen bg-[#7758E2] text-white flex flex-col justify-between p-6">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onCancel}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
        >
          <FigmaIcon name="close" size={20} color="#FFFFFF" />
        </button>
        <span className="text-xs font-semibold tracking-wider uppercase text-white/80">
          AI Analysis Engine
        </span>
        <div className="w-8" />
      </div>

      {/* Center Animation Content */}
      <div className="max-w-md w-full mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-3xl bg-white/15 backdrop-blur-md mx-auto flex items-center justify-center shadow-inner">
            <FigmaIcon name="ai" size={32} color="#FFFFFF" className={isDone ? '' : 'animate-pulse'} />
          </div>
          <h2 className="text-xl font-bold">
            {isDone ? 'Phân tích hoàn tất!' : 'Đang xử lý nội dung...'}
          </h2>
          <p className="text-xs text-white/75 line-clamp-1 max-w-xs mx-auto">
            {url}
          </p>
        </div>

        {/* Steps List */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-5 space-y-4 border border-white/10">
          {steps.map((step, idx) => {
            const stepDone = currentStep > idx;
            const inProgress = currentStep === idx;

            return (
              <div key={step.title} className="flex items-start gap-3">
                <FigmaAnalysisStatus done={stepDone} inProgress={inProgress} size={20} />
                <div className="flex-1">
                  <h4
                    className={`text-xs font-bold transition-colors ${
                      stepDone || inProgress ? 'text-white' : 'text-white/40'
                    }`}
                  >
                    {step.title}
                  </h4>
                  <p
                    className={`text-[11px] mt-0.5 transition-colors ${
                      inProgress ? 'text-white/90 font-medium' : 'text-white/50'
                    }`}
                  >
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* AI Info Badge if Gemini was used */}
        {isDone && result && (
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-3 text-center text-xs text-white/90 flex items-center justify-center gap-2">
            <FigmaIcon name="check-circle" size={16} color="#31CF37" />
            <span>
              {result.usedGemini
                ? 'Được xử lý bởi mô hình Gemini 2.5 Flash'
                : result.fallbackReason || 'Đã phân tích và lưu vào Mneme'}
            </span>
          </div>
        )}
      </div>

      {/* Bottom Completion Action */}
      <div className="max-w-md w-full mx-auto">
        {isDone && result ? (
          <button
            type="button"
            onClick={() => onFinished(result.value)}
            className="w-full py-4 rounded-2xl bg-white text-[#7758E2] font-bold text-sm shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span>Xem chi tiết nội dung</span>
            <FigmaIcon name="chevron-right" size={18} color="#7758E2" />
          </button>
        ) : (
          <div className="text-center text-xs text-white/60">
            Vui lòng không tắt ứng dụng trong lúc phân tích...
          </div>
        )}
      </div>
    </div>
  );
};
