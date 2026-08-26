import React, { useEffect, useState } from 'react';
import { Notebook, AiExecutionResult } from '../types';
import { useMneme } from '../state/mnemeContext';
import { FigmaAnalysisStatus } from '../components/common/FigmaAnalysisStatus';
import { FigmaIcon } from '../components/common/FigmaIcon';

interface NotebookAnalysisScreenProps {
  sourceIds: number[];
  onFinished: (createdNotebook: Notebook) => void;
  onCancel: () => void;
}

export const NotebookAnalysisScreen: React.FC<NotebookAnalysisScreenProps> = ({
  sourceIds,
  onFinished,
  onCancel,
}) => {
  const { addNotebook } = useMneme();
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState<AiExecutionResult<Notebook> | null>(null);
  const [isDone, setIsDone] = useState(false);

  const steps = [
    { title: 'Tập hợp các tài liệu nguồn đã chọn', desc: `Đang chuẩn bị ${sourceIds.length} liên kết` },
    { title: 'Phân tích chéo các chủ đề liên quan', desc: 'Tìm kiếm điểm chung và cấu trúc tri thức' },
    { title: 'AI biên soạn các phần kiến thức', desc: 'Gemini tổng hợp nội dung chi tiết từng mục' },
    { title: 'Định dạng và phân chia các section', desc: 'Tối ưu độ súc tích và mạch lạc cho sổ tay' },
    { title: 'Lưu trữ sổ tay vào cơ sở dữ liệu', desc: 'Sẵn sàng tra cứu ngoại tuyến' },
  ];

  useEffect(() => {
    let cancelled = false;

    const runFlow = async () => {
      setCurrentStep(0);
      await new Promise((r) => setTimeout(r, 700));
      if (cancelled) return;

      setCurrentStep(1);
      await new Promise((r) => setTimeout(r, 800));
      if (cancelled) return;

      setCurrentStep(2);
      // Run AI notebook generation in background while steps animate
      const aiPromise = addNotebook(sourceIds);

      await new Promise((r) => setTimeout(r, 1000));
      if (cancelled) return;

      setCurrentStep(3);
      await new Promise((r) => setTimeout(r, 800));
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
  }, [sourceIds]);

  return (
    <div className="min-h-screen bg-[#7758E2] text-white flex flex-col justify-between p-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onCancel}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
        >
          <FigmaIcon name="close" size={20} color="#FFFFFF" />
        </button>
        <span className="text-xs font-semibold tracking-wider uppercase text-white/80">
          Notebook AI Synthesis
        </span>
        <div className="w-8" />
      </div>

      {/* Center Animated Progress */}
      <div className="max-w-md w-full mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-3xl bg-white/15 backdrop-blur-md mx-auto flex items-center justify-center shadow-inner">
            <FigmaIcon name="open-book" size={32} color="#FFFFFF" className={isDone ? '' : 'animate-pulse'} />
          </div>
          <h2 className="text-xl font-bold">
            {isDone ? 'Đã tạo sổ tay thành công!' : 'AI đang tổng hợp sổ tay...'}
          </h2>
          <p className="text-xs text-white/75">
            Từ {sourceIds.length} nguồn tài liệu đã chọn
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

        {/* AI Info Badge */}
        {isDone && result && (
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-3 text-center text-xs text-white/90 flex items-center justify-center gap-2">
            <FigmaIcon name="check-circle" size={16} color="#31CF37" />
            <span>
              {result.usedGemini
                ? 'Được tổng hợp hoàn chỉnh bởi Gemini 2.5 Flash'
                : 'Đã tổng hợp cấu trúc sổ tay vào Mneme'}
            </span>
          </div>
        )}
      </div>

      {/* Completion CTA */}
      <div className="max-w-md w-full mx-auto">
        {isDone && result ? (
          <button
            type="button"
            onClick={() => onFinished(result.value)}
            className="w-full py-4 rounded-2xl bg-white text-[#7758E2] font-bold text-sm shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span>Mở xem sổ tay ngay</span>
            <FigmaIcon name="chevron-right" size={18} color="#7758E2" />
          </button>
        ) : (
          <div className="text-center text-xs text-white/60">
            Vui lòng chờ AI tổng hợp kiến thức...
          </div>
        )}
      </div>
    </div>
  );
};
