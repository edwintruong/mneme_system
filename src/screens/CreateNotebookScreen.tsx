import React from 'react';
import { FigmaBackButton } from '../components/common/FigmaBackButton';
import { FigmaIcon } from '../components/common/FigmaIcon';

interface CreateNotebookScreenProps {
  onBack: () => void;
  onSelectFlow: (fromFolder: boolean) => void;
}

export const CreateNotebookScreen: React.FC<CreateNotebookScreenProps> = ({
  onBack,
  onSelectFlow,
}) => {
  return (
    <div className="min-h-screen bg-[#7758E2] flex flex-col">
      {/* Top App Bar */}
      <div className="px-4 py-3 flex items-center justify-between text-white">
        <FigmaBackButton onClick={onBack} color="#FFFFFF" />
        <h2 className="text-base font-semibold">Tạo sổ tay mới</h2>
        <div className="w-8" />
      </div>

      {/* Main Curved Body */}
      <div className="flex-1 bg-[#F8F6FD] rounded-t-[32px] px-4 pt-10 pb-28 space-y-6 overflow-y-auto">
        <div className="text-center space-y-2">
          <div className="w-20 h-20 rounded-3xl bg-[#F1EEFC] text-[#7758E2] mx-auto flex items-center justify-center shadow-xs">
            <img
              src="/assets/images/create_sources.png"
              alt="Sources"
              className="w-12 h-12 object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <h3 className="text-lg font-bold text-[#0E0727]">Chọn nguồn để tạo sổ tay</h3>
          <p className="text-xs text-[#9490A2] leading-relaxed max-w-xs mx-auto">
            AI sẽ tổng hợp nội dung từ các nguồn bạn chọn thành một sổ tay có cấu trúc
          </p>
        </div>

        {/* Source Cards */}
        <div className="space-y-3.5 max-w-md mx-auto">
          <div
            onClick={() => onSelectFlow(false)}
            className="bg-white rounded-3xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer group active:scale-[0.98] border border-black/5 flex items-center gap-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#F1EEFC] flex items-center justify-center flex-shrink-0 text-[#7758E2]">
              <FigmaIcon name="layers" size={26} color="#7758E2" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-[#0E0727] group-hover:text-[#7758E2] transition-colors">
                Tạo từ các nội dung đã chọn
              </h4>
              <p className="text-xs text-[#9490A2] mt-1 leading-snug">
                Chọn nhiều video, bài viết hoặc website để AI tổng hợp
              </p>
            </div>
            <div className="text-[#9490A2] group-hover:text-[#7758E2] transition-colors">
              <FigmaIcon name="chevron-right" size={20} />
            </div>
          </div>

          <div
            onClick={() => onSelectFlow(true)}
            className="bg-white rounded-3xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer group active:scale-[0.98] border border-black/5 flex items-center gap-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#F1EEFC] flex items-center justify-center flex-shrink-0 text-[#7758E2]">
              <FigmaIcon name="folder-plus" size={26} color="#7758E2" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-[#0E0727] group-hover:text-[#7758E2] transition-colors">
                Tạo từ một folder lớn
              </h4>
              <p className="text-xs text-[#9490A2] mt-1 leading-snug">
                Chọn một folder từ category. AI sẽ tổng hợp toàn bộ nội dung bên trong
              </p>
            </div>
            <div className="text-[#9490A2] group-hover:text-[#7758E2] transition-colors">
              <FigmaIcon name="chevron-right" size={20} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
