export interface MnemeCategory {
  id: number;
  name: string;
  image: string;
  itemCount: number;
}

export interface SavedLink {
  id: number;
  title: string;
  url: string;
  summary: string;
  /** Optional detail lines shown as bullets on the link-detail screen. */
  details?: string[];
  category: string;
  folder: string;
  image: string;
  source: string;
  /** Optional source account/site label used by Figma list rows. */
  author?: string;
  /** Optional video-length badge shown over the folder-detail thumbnail. */
  duration?: string;
  tags: string[];
  favorite: boolean;
  savedAt?: string;
}

export interface AddLinkPreset {
  title: string;
  summary: string;
  image: string;
  source: string;
  tags: string[];
  author?: string;
  duration?: string;
}

export interface AddLinkParams {
  url: string;
  category?: string;
  folder?: string;
  /** Deterministic showcase metadata supplied by a resolved Figma preview. */
  preset?: AddLinkPreset;
}

export interface NotebookSection {
  title: string;
  body: string;
}

export interface NotebookOutlineSubItem {
  /** e.g. "2.1" */
  number: string;
  title: string;
  /** Present only when the reading screen (Figma nodes 2172:4589 etc.) shows this sub-item's body. */
  body?: string;
}

export interface NotebookOutlineItem {
  /** e.g. "1." or "2." — includes the trailing dot as authored in Figma. */
  number: string;
  title: string;
  /** Present only when the reading screen shows this item's body. */
  body?: string;
  subItems?: NotebookOutlineSubItem[];
  /** Whether the Mục lục tab shows this item's sub-items expanded by default. */
  defaultExpanded?: boolean;
}

export interface Notebook {
  id: number;
  title: string;
  /** Cover subtitle, e.g. "3 video - 12 phút đọc". */
  meta: string;
  /** Cover one-line summary shown under the meta line. */
  summary: string;
  /** Longer copy shown on the Thông tin tab. */
  description: string;
  image: string;
  itemCount: number;
  sections: NotebookSection[];
  /** Mục lục outline, Figma nodes 2172:4487/4589 and its three sibling notebooks. */
  outline: NotebookOutlineItem[];
  createdAt?: string;
}

export interface GeminiLinkDraft {
  title: string;
  summary: string;
  category: string;
  folder: string;
  source: string;
  tags: string[];
}

export interface GeminiNotebookDraft {
  title: string;
  description: string;
  sections: NotebookSection[];
}

export interface AiExecutionResult<T> {
  value: T;
  usedGemini: boolean;
  fallbackReason?: string;
}
