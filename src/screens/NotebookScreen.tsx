import React from 'react';
import { useMneme } from '../state/mnemeContext';
import { Notebook } from '../types';
import { SearchCard } from '../components/common/SearchCard';
import { FigmaIcon } from '../components/common/FigmaIcon';

/**
 * Notebook list, Figma node 2159:12891.
 *
 * The AI banner's fill is a gradient that `get_design_context` does not report,
 * so the stops below were sampled column-by-column off the Figma render.
 */
/**
 * Figma softens the fill toward the top and bottom edges — colour still bleeds a
 * few pixels past the 84px box — so a vertical white wash sits over the
 * horizontal ramp. Both profiles were sampled off the Figma render.
 */
const BANNER_GRADIENT = [
  'linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 16%,' +
    ' rgba(255,255,255,0) 55%, rgba(255,255,255,0.30) 82%, rgba(255,255,255,0.62) 100%)',
  'linear-gradient(90deg, #f79cf9 0%, #f9acfa 20%, #fcbafc 30%, #fac2fa 40%,' +
    ' #fcd1fc 50%, #fad6fa 60%, #e4cbf5 70%, #d5d6f9 80%, #bfe6fe 100%)',
].join(', ');

interface NotebookScreenProps {
  onSelectNotebook: (notebook: Notebook) => void;
  onCreateNotebook: () => void;
  onOpenSearch: () => void;
}

export const NotebookScreen: React.FC<NotebookScreenProps> = ({
  onSelectNotebook,
  onCreateNotebook,
  onOpenSearch,
}) => {
  const { notebooks } = useMneme();

  return (
    <div className="flex w-[390px] flex-col items-start gap-[12px]">
      {/* Header, node 2159:12360 */}
      <div className="flex h-[62px] w-full items-center justify-center gap-[10px] px-[20px] py-[8px]">
        <h1 className="flex h-full min-w-px flex-1 flex-col justify-center text-[24px] leading-[30px] font-medium tracking-[-0.15px] text-[#0e0727]">
          Sổ tay
        </h1>
        <button
          type="button"
          onClick={onCreateNotebook}
          className="flex h-full shrink-0 items-center justify-center gap-[10px] overflow-hidden rounded-[16px] bg-[#7758e2] px-[16px] py-[12px]"
        >
          <span className="whitespace-nowrap text-center text-[16px] leading-[22px] font-medium tracking-[-0.18px] text-white">
            Tạo sổ tay
          </span>
          <FigmaIcon name="add-circle" size={24} />
        </button>
      </div>

      {/* node 2159:12897 */}
      <div className="flex w-full flex-col items-center justify-center gap-[15px] overflow-hidden bg-[#f8f6fd] px-[17px] pb-[16px]">
        <SearchCard onTap={onOpenSearch} className="w-full" withShadow />

        {/* node 2159:12899 */}
        <div
          className="flex w-full flex-col items-start gap-[20px] rounded-[20px] bg-white px-[16px] pt-[10px] pb-[20px]"
          style={{ boxShadow: 'var(--shadow-card)' }}
        >
          {/* AI banner, node 2159:12900 */}
          <div className="relative h-[127px] w-[324px] shrink-0">
            <div className="absolute top-[38px] left-0 h-[90px] w-[324px]">
              <div
                className="absolute top-0 left-0 h-[84px] w-[324px] rounded-[16px]"
                style={{ backgroundImage: BANNER_GRADIENT }}
              />
              <div className="absolute top-0 left-0 flex w-[324px] flex-col items-center justify-center rounded-[16px] px-[12px] py-[8px]">
                <div className="flex flex-col items-end justify-center gap-[4px]">
                  <div className="flex h-[16px] w-[306px] items-center justify-center">
                    <div className="flex min-w-px flex-1 items-end justify-end">
                      <button type="button" aria-label="Bỏ qua gợi ý">
                        <FigmaIcon name="banner-close" size={24} />
                      </button>
                    </div>
                  </div>
                  <div className="flex w-[306px] flex-col items-center justify-center">
                    <div className="flex w-full items-center justify-center gap-[17px]">
                      {/*
                        Figma neutralises the paragraph's own type (text-0/leading-0)
                        and lets each span carry its size and leading. The content is
                        written as explicit strings so JSX indentation cannot leak
                        into the pre-wrapped text.
                      */}
                      <p
                        className="w-[166px] whitespace-pre-wrap text-[0px] leading-[0] text-white"
                        style={{ textShadow: '0px 1.5px 1px rgba(0,0,0,0.1)' }}
                      >
                        <span className="text-[12px] leading-[16px] font-medium tracking-[0.4px]">{'AI đã phát hiện 3 nội dung mới có thể thêm vào sổ tay\n '}</span>
                        <span className="text-[14px] leading-[20px] font-medium tracking-[0.4px]">{'“'}</span>
                        <span className="text-[12px] leading-[16px] font-extrabold tracking-[0.4px]">{'AI Tips & Tricks'}</span>
                        <span className="text-[14px] leading-[20px] font-medium tracking-[0.4px]">{'”'}</span>
                      </p>
                      <div className="flex w-[100px] shrink-0 items-center">
                        <button
                          type="button"
                          className="flex h-[36px] w-[108px] shrink-0 items-center justify-center gap-[7.582px] overflow-hidden rounded-[16px] bg-white px-[12.131px] py-[9.098px]"
                        >
                          <span className="whitespace-nowrap text-center text-[12.13px] leading-[16.68px] font-medium tracking-[-0.18px] text-[#0e0727]">
                            Cập nhật ngay
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Mascot, node I2159:12900;313:3053 — the design crops the wide source. */}
            <div className="absolute top-0 left-[7px] h-[49.381px] w-[46px] overflow-hidden">
              <img
                src="/assets/images/figma_2159/2159_12891_banner_mascot.png"
                alt=""
                className="absolute top-0 left-[-34.41%] h-[106.22%] w-[171.05%] max-w-none"
              />
            </div>
          </div>

          {/* List, node 2159:12902 */}
          <div className="flex w-full flex-col items-start gap-[10px]">
            <p className="w-full text-[14px] leading-[20px] font-medium tracking-[0.4px] text-[#0e0727]">
              Sổ tay của bạn ết toàn năng
            </p>
            {notebooks.map((notebook, index) => {
              const isVector = notebook.image.endsWith('.svg');
              return (
                <button
                  key={notebook.id}
                  type="button"
                  onClick={() => onSelectNotebook(notebook)}
                  className="flex w-full items-center gap-[10px] text-left"
                >
                  <div
                    className={`size-[80px] shrink-0 overflow-hidden ${isVector ? '' : 'rounded-[15px]'}`}
                  >
                    <img
                      src={notebook.image}
                      alt=""
                      className={`size-full ${isVector ? 'object-contain' : 'rounded-[15px] object-cover'}`}
                    />
                  </div>
                  <div className="flex min-w-px flex-1 flex-col items-start justify-center gap-[8px]">
                    <p className="w-full whitespace-pre-wrap text-[16px] leading-[24px] font-medium tracking-[0px] text-[#0e0727]">
                      {notebook.title}
                    </p>
                    <div className="flex w-full items-center gap-[4px]">
                      <p className="whitespace-nowrap text-[14px] leading-[20px] font-normal tracking-[0.4px] text-[#9490a2]">
                        {notebook.itemCount} mục
                      </p>
                    </div>
                  </div>
                  {index === notebooks.length - 1 && (
                    <span className="relative size-[24px] shrink-0">
                      <FigmaIcon
                        name="more-vertical"
                        className="absolute"
                        style={{ left: '10.75px', top: '4.75px', transform: 'rotate(90deg)' }}
                      />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
