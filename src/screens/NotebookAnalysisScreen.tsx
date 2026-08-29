import React, { useEffect, useState } from 'react';
import { FigmaIcon } from '../components/common/FigmaIcon';

interface NotebookAnalysisScreenProps {
  sourceIds: number[];
  onFinished: () => void;
  onCancel: () => void;
}

const STEPS = [
  { icon: 'nb-synth-step-transcript', label: 'Trích xuất transcript' },
  { icon: 'nb-synth-step-topic', label: 'Nhận diện chủ đề chính' },
  { icon: 'nb-synth-step-group', label: 'Nhóm các ý liên quan' },
  { icon: 'nb-synth-step-synthesize', label: 'Tổng hợp kiến thức' },
  { icon: 'nb-synth-step-structure', label: 'Tạo cấu trúc sổ tay' },
] as const;

const StepStatus: React.FC<{ state: 'done' | 'active' | 'pending' }> = ({ state }) => {
  if (state === 'done') {
    return (
      <span className="flex size-[20px] shrink-0 items-center justify-center rounded-[16.5px] bg-[#31cf37] p-[3px]">
        <FigmaIcon name="nb-synth-status-done" size={12} />
      </span>
    );
  }

  return (
    <FigmaIcon
      name="nb-synth-status-pending"
      size={20}
      className={state === 'active' ? 'animate-spin' : 'opacity-40'}
    />
  );
};

/**
 * "AI phân tích" step of the create-notebook wizard, Figma node 2159:13602.
 * Sits between SelectSourcesScreen ("Chọn nội dung") and NotebookDetailScreen
 * ("Tạo sổ tay") — a showcase-deterministic animation, same as the sources
 * screen it follows: no Gemini call, always resolves to the same notebook.
 */
export const NotebookAnalysisScreen: React.FC<NotebookAnalysisScreenProps> = ({
  sourceIds: _sourceIds,
  onFinished,
  onCancel,
}) => {
  const [doneCount, setDoneCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const delays = [600, 550, 650, 600, 550];

    const run = async () => {
      for (let i = 0; i < delays.length; i += 1) {
        await new Promise((resolve) => setTimeout(resolve, delays[i]));
        if (cancelled) return;
        setDoneCount(i + 1);
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (cancelled) return;
      onFinished();
    };

    run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isDone = doneCount === STEPS.length;

  return (
    <div className="flex w-[390px] shrink-0 flex-col items-start gap-[15px] bg-white">
      <div
        className="flex w-full flex-col gap-[4px] rounded-bl-[16px] rounded-br-[16px] bg-white"
        style={{ boxShadow: '0 34px 38px rgba(153,134,217,0.06), 0 137px 68.5px rgba(153,134,217,0.05), 0 309px 92.5px rgba(153,134,217,0.04)' }}
      >
        <div className="flex w-full items-start justify-center gap-[8px] px-[20px]">
          <div className="flex w-[30px] shrink-0 items-center">
            <button type="button" onClick={onCancel} aria-label="Huỷ" className="flex size-[30px] items-center justify-center">
              <FigmaIcon name="select-sources-back" style={{ transform: 'rotate(180deg)' }} />
            </button>
          </div>
          <p className="flex-1 self-stretch text-center text-[18px] leading-[28px] font-medium text-[#0e0727]">
            Tạo sổ tay mới
          </p>
          <div className="w-[30px] shrink-0" />
        </div>

        <div className="relative flex w-full items-center justify-between rounded-[8px] bg-white px-[45px] py-[16px]">
          <div className="absolute top-1/2 left-[58px] right-[61px] flex h-[3px] -translate-y-1/2 items-center">
            <div className="h-[3px] flex-1 bg-[#c0b2f2]" />
            <div className="h-[3px] flex-1 bg-[#c0b2f2]" />
            <div className="h-[3px] flex-1 bg-[#f2f2f3]" />
            <div className="h-[3px] flex-1 bg-[#f2f2f3]" />
          </div>

          <div className="relative flex w-[48px] flex-col items-center gap-[2px]">
            <div className="flex items-center justify-center rounded-full border-[2.029px] border-solid border-[#7758e2] bg-[#f1eefc] p-[7.378px]">
              <FigmaIcon name="nb-synth-progress-done" size={17.245} />
            </div>
            <p className="whitespace-nowrap text-[14px] leading-[20px] font-medium tracking-[0.4px] text-[#c1b4f5]">
              Chọn nội dung
            </p>
          </div>

          <div className="relative flex flex-col items-center gap-[8px]">
            <div className="flex items-center justify-center rounded-full border-[3px] border-solid border-[#c0b2f2] bg-[#7758e2] p-[7.273px]">
              <FigmaIcon name="nb-synth-progress-active" size={17} />
            </div>
            <p className="whitespace-nowrap text-[14px] leading-[20px] font-medium tracking-[0.4px] text-[#7758e2]">
              AI phân tích
            </p>
          </div>

          <div className="relative flex w-[48px] flex-col items-center gap-[2px]">
            <div className="flex items-center justify-center rounded-full bg-[#f5f5f7] p-[7.273px]">
              <FigmaIcon name="nb-synth-progress-upcoming" size={17.455} />
            </div>
            <p className="whitespace-nowrap text-[14px] leading-[20px] font-medium tracking-[0.4px] text-[#9490a2]">
              Tạo sổ tay
            </p>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-center">
        <div className="flex w-full flex-col items-center justify-center gap-[16px] rounded-[20px] bg-white p-[20px]">
          <FigmaIcon name="nb-synth-robot" size={159} />
          <div className="flex w-full flex-col items-start gap-[16px]">
            <p className="w-full text-center text-[18px] leading-[28px] font-medium text-[#0e0727]">
              {isDone ? 'Đã phân tích xong nội dung!' : 'AI đang phân tích nội dung'}
            </p>
            <div className="flex w-full flex-col items-center justify-center gap-[8px]">
              {STEPS.map((step, index) => (
                <div key={step.label} className="flex h-[44px] w-full items-center gap-[8px] px-[52px] py-[8px]">
                  <span className="flex size-[28px] shrink-0 items-center justify-center rounded-[25.667px]">
                    <FigmaIcon name={step.icon} size={18.6667} />
                  </span>
                  <p className="flex-1 text-[16px] leading-[24px] font-normal text-[#0e0727]">
                    {step.label}
                  </p>
                  <StepStatus state={index < doneCount ? 'done' : index === doneCount ? 'active' : 'pending'} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
