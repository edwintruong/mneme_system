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
  tags: string[];
  favorite: boolean;
  savedAt?: string;
}

export interface NotebookSection {
  title: string;
  body: string;
}

export interface Notebook {
  id: number;
  title: string;
  description: string;
  image: string;
  itemCount: number;
  sections: NotebookSection[];
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
