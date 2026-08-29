import React from 'react';
import { Notebook } from '../types';
import { FigmaIcon } from '../components/common/FigmaIcon';

interface NotebookReadingScreenProps {
  notebook: Notebook;
  onBack: () => void;
}

interface ReadingEntry {
  key: string;
  number: string;
  title: string;
  body: string;
}

/**
 * Notebook reading screen — Figma nodes 2172:4589 (Research), 2172:5216 (Món ăn),
 * 2172:5256 (AI Tips), 2172:5296 (Travel). Reached from `NotebookDetailScreen`'s
 * "Xem sổ tay" button. Confirmed a distinct screen (own header, own back target)
 * rather than a scrolled state of the Mục lục screen: its header replaces the
 * cover card with a compact title bar, and it renders only the outline
 * items/sub-items that carry a `body` — never all four outline items.
 *
 * Blocks/gaps measured from each node's own bounding boxes rather than its
 * declared 24px auto-layout gap, which does not match the actual rendered
 * deltas (a known quirk in this codebase — see AddLinkScreen's card comment):
 * 18px between top-level blocks (an item, or a whole sub-item group), 12px
 * between sub-items within one group, 12px between a block's own title and
 * body. A body is the item/sub-item's Figma text verbatim — no inserted blank
 * line between its sentences; the node's own multi-paragraph split measures
 * flush (zero extra gap), confirmed via its Frame height math.
 */
export const NotebookReadingScreen: React.FC<NotebookReadingScreenProps> = ({ notebook, onBack }) => {
  const blocks: ReadingEntry[][] = [];
  const outline = Array.isArray(notebook.outline) ? notebook.outline : [];
  outline.forEach((item) => {
    if (item.body) {
      blocks.push([{ key: item.number, number: item.number, title: item.title, body: item.body }]);
    }
    const subRows: ReadingEntry[] = (item.subItems ?? [])
      .filter((sub) => sub.body)
      .map((sub) => ({ key: `${item.number}-${sub.number}`, number: `${sub.number} .`, title: sub.title, body: sub.body! }));
    if (subRows.length > 0) blocks.push(subRows);
  });

  return (
    <div className="flex w-[390px] flex-1 flex-col items-start bg-white text-[#0e0727]">
      {/*
        15px gap before the header, matching the same offset used by
        NotebookDetailScreen's back button (top-[15px]) — confirmed via the
        node's own Frame54 y-offset (59px past the 44px status bar). A plain
        flow spacer, not part of the sticky header, so it scrolls away.
      */}
      <div className="h-[15px] w-full shrink-0" />
      {/* Header, node 2172:4589 Frame 51 — a separate compact bar, not the cover card. */}
      <div className="sticky top-0 z-10 flex w-full items-center justify-center gap-[8px] bg-white px-[20px] py-[12px]">
        <div className="flex w-[30px] shrink-0 items-center justify-center">
          <button type="button" onClick={onBack} aria-label="Quay lại">
            <FigmaIcon name="notebook-detail-back" style={{ transform: 'rotate(90deg)' }} />
          </button>
        </div>
        <p className="min-w-0 flex-1 truncate text-center text-[18px] leading-[28px] font-medium text-[#0e0727]">
          {notebook.title}
        </p>
        <div className="flex w-[24px] shrink-0 items-center justify-center">
          <button type="button" aria-label="Chỉnh sửa">
            <FigmaIcon name="notebook-reading-edit" size={24} />
          </button>
        </div>
      </div>

      <div className="flex w-full flex-col items-start gap-[18px] pb-[24px]">
        {blocks.map((rows) => (
          <div key={rows[0].key} className="flex w-full flex-col items-start gap-[12px]">
            {rows.map((entry) => (
              <div key={entry.key} className="flex w-full flex-col items-start gap-[12px] px-[20px]">
                <div className="flex w-full items-start gap-[8px] text-[20px] leading-[24px] font-medium text-black">
                  <span className="shrink-0">{entry.number}</span>
                  <span className="min-w-0 flex-1">{entry.title}</span>
                </div>
                <p className="w-full whitespace-pre-wrap text-[16px] leading-[24px] font-normal text-[#0e0727]">{entry.body}</p>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Footer, node 2172:4589 Frame 1972. */}
      <div className="sticky bottom-0 z-10 flex w-full items-center justify-center gap-[10px] bg-white px-[20px] py-[35px]">
        <button
          type="button"
          className="flex h-[48px] flex-1 items-center justify-center gap-[10px] overflow-hidden rounded-[16px] bg-[#7758e2] px-[16px] py-[12px]"
        >
          <span className="whitespace-nowrap text-center text-[16px] leading-[22px] font-medium text-white">Add Section</span>
          <FigmaIcon name="add-circle" size={24} />
        </button>
        <button
          type="button"
          aria-label="Chia sẻ"
          className="flex size-[36px] shrink-0 items-center justify-center rounded-full bg-[#f1eefc]"
        >
          <FigmaIcon name="share-figma" size={24} color="#7758e2" />
        </button>
      </div>
    </div>
  );
};
