import React from 'react';
import { FigmaIcon } from '../components/common/FigmaIcon';

interface CreateNotebookScreenProps {
  onBack: () => void;
  onSelectFlow: (fromFolder: boolean) => void;
}

const COLLAGE = '/assets/images/figma_2159/2159_13626_source_collage.png';
const FOLDER = '/assets/images/figma_2159/2159_13626_folder.png';

const SourceStack: React.FC<{ compact?: boolean }> = ({ compact = false }) =>
  compact ? (
    <div className="relative h-[80px] w-[69px] shrink-0 rounded-full bg-white">
      <div className="absolute top-[24.58px] left-[24px] h-[29.317px] w-[31.467px] overflow-hidden">
        <img src={COLLAGE} alt="" className="absolute top-[-112.43%] left-[-188.59%] h-[341.33%] w-[477.02%] max-w-none" />
      </div>
      <div className="absolute top-[31.42px] left-[32px] h-[28.354px] w-[31.243px] overflow-hidden">
        <img src={COLLAGE} alt="" className="absolute top-[-146.42%] left-[-352.32%] h-[386.42%] w-[526.03%] max-w-none" />
      </div>
      <div className="absolute top-[20.3px] left-[6px] flex h-[37.093px] w-[39.05px] -rotate-9 items-center justify-center">
        <div className="relative h-[32.099px] w-[34.453px] overflow-hidden">
          <img src={COLLAGE} alt="" className="absolute top-[-120.67%] left-[-60.87%] h-[341.33%] w-[477.02%] max-w-none" />
        </div>
      </div>
    </div>
  ) : (
    <div className="relative size-[130px] shrink-0 rounded-full">
      <div className="absolute top-[32px] left-[43.3px] h-[60.758px] w-[65.214px] overflow-hidden">
        <img src={COLLAGE} alt="" className="absolute top-[-112.43%] left-[-188.59%] h-[341.33%] w-[477.02%] max-w-none" />
      </div>
      <div className="absolute top-[47px] left-[59.88px] h-[58.762px] w-[64.749px] overflow-hidden">
        <img src={COLLAGE} alt="" className="absolute top-[-146.42%] left-[-352.32%] h-[386.42%] w-[526.03%] max-w-none" />
      </div>
      <div className="absolute top-[24px] left-[6px] flex h-[76.874px] w-[80.929px] -rotate-9 items-center justify-center">
        <div className="relative h-[66.523px] w-[71.402px] overflow-hidden">
          <img src={COLLAGE} alt="" className="absolute top-[-120.67%] left-[-60.87%] h-[341.33%] w-[477.02%] max-w-none" />
        </div>
      </div>
    </div>
  );

/** Source-choice screen — Figma node 2159:13626. */
export const CreateNotebookScreen: React.FC<CreateNotebookScreenProps> = ({
  onBack,
  onSelectFlow,
}) => (
  <div className="relative h-full min-h-[800px] w-[390px] overflow-hidden bg-[#f8f6fd]">
    <header
      className="absolute top-0 left-0 h-[131px] w-full rounded-b-[12px] bg-[#7758e2]"
      style={{ boxShadow: '0 34px 38px rgba(153,134,217,0.06), 0 137px 68.5px rgba(153,134,217,0.05), 0 309px 92.5px rgba(153,134,217,0.04)' }}
    >
      <button type="button" aria-label="Quay lại" onClick={onBack} className="absolute top-[14px] left-[20px] size-[30px]">
        <FigmaIcon name="create-notebook-back" style={{ transform: 'rotate(180deg)' }} />
      </button>
      <h1 className="absolute top-[14px] left-[58px] flex h-[30px] w-[255px] items-center justify-center text-[18px] leading-[28px] font-medium text-[#f4f1fd]">
        Tạo sổ tay mới
      </h1>
    </header>

    <section className="absolute top-[68px] left-[17px] flex h-[490px] w-[356px] flex-col items-start gap-[16px] rounded-[20px] bg-white p-[20px]">
      <div className="flex h-[226px] w-full flex-col items-center gap-[15px]">
        <SourceStack />
        <div className="flex h-[81px] w-full flex-col items-center gap-[8px] text-center">
          <p className="w-full text-[16px] leading-[24px] font-medium tracking-[0px] text-[#0e0727]">Chọn nguồn để tạo sổ tay</p>
          <p className="w-full text-[14px] leading-[20px] font-normal tracking-[0.4px] text-[#9490a2]">
            Ai sẽ tổng hợp nội dung từ các nguồn bạn chọn<br />thành một sổ tay có cấu trúc
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onSelectFlow(false)}
        className="flex h-[96px] w-full shrink-0 items-center p-[8px] text-left"
        style={{ boxShadow: 'inset 0 0 0 2px #f7f7f8', borderRadius: '16px' }}
      >
        <div className="flex w-full items-center gap-[8px]">
          <SourceStack compact />
          <div className="flex min-w-0 flex-1 flex-col items-start justify-center gap-[8px]">
            <p className="w-full whitespace-nowrap text-[16px] leading-[22px] font-medium tracking-[-0.18px] text-[#0e0727]">Tạo từ các nội dung đã chọn</p>
            <p className="w-[186px] text-[12px] leading-[16px] font-normal tracking-[0.4px] text-[#9490a2]">Chọn nhiều video, bài viết hoặc website để AI tổng hợp</p>
          </div>
          <FigmaIcon name="create-notebook-chevron" />
        </div>
      </button>

      <button
        type="button"
        onClick={() => onSelectFlow(true)}
        className="flex h-[96px] w-full shrink-0 items-center p-[8px] text-left"
        style={{ boxShadow: 'inset 0 0 0 2px #f7f7f8', borderRadius: '16px' }}
      >
        <div className="flex w-full items-center gap-[8px]">
          <div className="relative h-[80px] w-[69px] shrink-0 rounded-full bg-white">
            <div className="absolute top-[21.9px] left-[15px] h-[36.098px] w-[40px] overflow-hidden">
              <img src={FOLDER} alt="" className="absolute top-[-81.25%] left-[-29.27%] h-[259.46%] w-[156.1%] max-w-none" />
            </div>
          </div>
          <div className="flex min-w-0 flex-1 flex-col items-start justify-center gap-[8px]">
            <p className="w-full whitespace-nowrap text-[16px] leading-[22px] font-medium tracking-[-0.18px] text-[#0e0727]">Tạo từ một folder lớn</p>
            <p className="w-[186px] text-[12px] leading-[16px] font-normal tracking-[0.4px] text-[#9490a2]">Chọn một folder từ category<br />AI sẽ tổng hợp toàn bộ nội dung bên trong</p>
          </div>
          <FigmaIcon name="create-notebook-chevron" />
        </div>
      </button>
    </section>

    <div className="absolute bottom-[8px] left-1/2 h-[5px] w-[144px] -translate-x-1/2 rounded-full bg-black" />
  </div>
);
