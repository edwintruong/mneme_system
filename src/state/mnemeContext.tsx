import React, { createContext, useContext, useState, useEffect } from 'react';
import { MnemeCategory, SavedLink, Notebook, AiExecutionResult } from '../types';
import {
  CAKE_SHOWCASE_LINK_IDS,
  HOME_CATEGORY_IDS,
  HOME_CREPE_IMAGE,
  HOME_RECENT_LINK_IDS,
  INITIAL_CATEGORIES,
  INITIAL_FOLDERS,
  INITIAL_LINKS,
  INITIAL_NOTEBOOKS,
  MOVIE_SHOWCASE_LINK_IDS,
  STUDY_SHOWCASE_LINK_IDS,
  TRAVEL_SHOWCASE_LINK_IDS,
} from '../data/seed';

interface MnemeContextType {
  categories: MnemeCategory[];
  folders: string[];
  links: SavedLink[];
  notebooks: Notebook[];
  addLink: (params: { url: string; category?: string; folder?: string }) => Promise<AiExecutionResult<SavedLink>>;
  updateLink: (id: number, updates: { title?: string; folder?: string; tags?: string[] }) => void;
  deleteLink: (id: number) => void;
  deleteLinks: (ids: number[]) => void;
  moveLinks: (ids: number[], newFolder: string) => void;
  toggleFavorite: (id: number) => void;
  addFolder: (name: string, category?: string) => void;
  addNotebook: (sourceIds: number[]) => Promise<AiExecutionResult<Notebook>>;
  searchLinks: (query: string) => SavedLink[];
  resetDemoData: () => void;
}

const STORAGE_KEYS = {
  CATEGORIES: 'mneme_categories_v1',
  FOLDERS: 'mneme_folders_v1',
  LINKS: 'mneme_links_v1',
  NOTEBOOKS: 'mneme_notebooks_v1',
};

const MnemeContext = createContext<MnemeContextType | undefined>(undefined);

const LEGACY_HOME_CREPE_IMAGE = '/assets/images/figma_2159/2159_12771_recent_crepe.jpg';

const HOME_CATEGORY_ID_SET = new Set<number>(HOME_CATEGORY_IDS);
const HOME_RECENT_LINK_ID_SET = new Set<number>(HOME_RECENT_LINK_IDS);
const MOVIE_SHOWCASE_LINK_ID_SET = new Set<number>(MOVIE_SHOWCASE_LINK_IDS);
const STUDY_SHOWCASE_LINK_ID_SET = new Set<number>(STUDY_SHOWCASE_LINK_IDS);
const TRAVEL_SHOWCASE_LINK_ID_SET = new Set<number>(TRAVEL_SHOWCASE_LINK_IDS);
const CAKE_SHOWCASE_LINK_ID_SET = new Set<number>(CAKE_SHOWCASE_LINK_IDS);

/**
 * Restore Figma's Home fixtures while preserving every unrelated local-first record.
 * Older deployments persisted whole seed arrays, so changing seed.ts alone cannot
 * correct their visible Home copy, order, counts, or images.
 */
const migrateSavedCategories = (categories: MnemeCategory[]): MnemeCategory[] => {
  const canonical = new Map(
    INITIAL_CATEGORIES
      .filter((category) => HOME_CATEGORY_ID_SET.has(category.id))
      .map((category) => [category.id, category])
  );
  const present = new Set(categories.map((category) => category.id));
  const normalized = categories.map((category) => {
    const fixture = canonical.get(category.id);
    return fixture ? { ...category, ...fixture } : category;
  });
  const missing = HOME_CATEGORY_IDS
    .filter((id) => !present.has(id))
    .map((id) => canonical.get(id))
    .filter((category): category is MnemeCategory => Boolean(category));
  return [...normalized, ...missing];
};

const migrateSavedLinks = (links: SavedLink[]): SavedLink[] => {
  const canonical = new Map(
    INITIAL_LINKS
      .filter((link) =>
        HOME_RECENT_LINK_ID_SET.has(link.id)
        || MOVIE_SHOWCASE_LINK_ID_SET.has(link.id)
        || STUDY_SHOWCASE_LINK_ID_SET.has(link.id)
        || TRAVEL_SHOWCASE_LINK_ID_SET.has(link.id)
        || CAKE_SHOWCASE_LINK_ID_SET.has(link.id)
      )
      .map((link) => [link.id, link])
  );
  const present = new Set(links.map((link) => link.id));
  const normalized = links.map((link) => {
    const fixture = canonical.get(link.id);
    if (!fixture) return link;

    // HOME_CREPE_IMAGE supersedes the old 2159 asset for id:5. Keeping this
    // explicit makes the persisted-data migration traceable to node 2172:4416.
    const image = link.image === LEGACY_HOME_CREPE_IMAGE ? HOME_CREPE_IMAGE : fixture.image;
    return { ...link, ...fixture, image };
  });
  const canonicalIds = [
    ...HOME_RECENT_LINK_IDS,
    ...MOVIE_SHOWCASE_LINK_IDS,
    ...STUDY_SHOWCASE_LINK_IDS,
    ...TRAVEL_SHOWCASE_LINK_IDS,
    ...CAKE_SHOWCASE_LINK_IDS,
  ];
  const missing = canonicalIds
    .filter((id) => !present.has(id))
    .map((id) => canonical.get(id))
    .filter((link): link is SavedLink => Boolean(link));
  return [...normalized, ...missing];
};

export const MnemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<MnemeCategory[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return saved ? migrateSavedCategories(JSON.parse(saved)) : INITIAL_CATEGORIES;
  });

  const [folders, setFolders] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FOLDERS);
    return saved ? JSON.parse(saved) : INITIAL_FOLDERS;
  });

  const [links, setLinks] = useState<SavedLink[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LINKS);
    return saved ? migrateSavedLinks(JSON.parse(saved)) : INITIAL_LINKS;
  });

  const [notebooks, setNotebooks] = useState<Notebook[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTEBOOKS);
    return saved ? JSON.parse(saved) : INITIAL_NOTEBOOKS;
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(folders));
  }, [folders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LINKS, JSON.stringify(links));
  }, [links]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTEBOOKS, JSON.stringify(notebooks));
  }, [notebooks]);

  const addFolder = (name: string, category = 'Design') => {
    const trimmed = name.trim();
    if (!trimmed || folders.includes(trimmed)) return;
    setFolders((prev) => [...prev, trimmed]);
  };

  const getSourceFromUrl = (url: string): string => {
    const lower = url.toLowerCase();
    if (lower.includes('youtube') || lower.includes('youtu.be')) return 'YouTube';
    if (lower.includes('tiktok')) return 'TikTok';
    if (lower.includes('instagram')) return 'Instagram';
    if (lower.includes('facebook') || lower.includes('fb.watch')) return 'Facebook';
    return 'Website';
  };

  const getImageForCategory = (category: string): string => {
    const norm = category.toLowerCase();
    if (norm.includes('du lịch') || norm.includes('travel')) return '/assets/images/figma_2159/2159_12771_category_travel.jpg';
    if (norm.includes('phim') || norm.includes('movie')) return '/assets/images/figma_2159/2159_12771_category_movie.jpg';
    if (norm.includes('ẩm thực') || norm.includes('công thức') || norm.includes('bánh')) return '/assets/images/figma_2159/2159_12771_category_cake.jpg';
    return '/assets/images/figma_2159/2159_12771_category_study.jpg';
  };

  const addLink = async ({
    url,
    category = 'Design',
    folder = 'UI/UX',
  }: {
    url: string;
    category?: string;
    folder?: string;
  }): Promise<AiExecutionResult<SavedLink>> => {
    let usedGemini = false;
    let fallbackReason: string | undefined;
    let draftData: any = null;

    try {
      const res = await fetch('/api/gemini/analyze-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, suggestedCategory: category, suggestedFolder: folder }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.draft) {
          draftData = json.draft;
          usedGemini = json.usedGemini;
        } else {
          fallbackReason = json.fallbackReason;
        }
      } else {
        fallbackReason = `Server error: ${res.status}`;
      }
    } catch (err: any) {
      fallbackReason = err?.message || 'Không thể kết nối đến máy chủ AI';
    }

    const resolvedCategory = draftData?.category || category;
    const resolvedFolder = draftData?.folder || folder;

    // Ensure folder exists
    if (!folders.includes(resolvedFolder)) {
      setFolders((prev) => [...prev, resolvedFolder]);
    }

    const newLink: SavedLink = {
      id: Date.now(),
      title: draftData?.title || (url.includes('design-system') ? 'How to build a design system' : 'Nội dung liên kết mới'),
      url: url,
      summary: draftData?.summary || 'Nội dung được Mneme phân tích và tự động sắp xếp để bạn xem lại nhanh chóng.',
      category: resolvedCategory,
      folder: resolvedFolder,
      image: getImageForCategory(resolvedCategory),
      source: draftData?.source || getSourceFromUrl(url),
      tags: draftData?.tags || ['Design', 'AutoLayout'],
      favorite: false,
      savedAt: 'Vừa xong',
    };

    setLinks((prev) => [newLink, ...prev]);

    return {
      value: newLink,
      usedGemini,
      fallbackReason,
    };
  };

  const updateLink = (id: number, updates: { title?: string; folder?: string; tags?: string[] }) => {
    setLinks((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deleteLink = (id: number) => {
    setLinks((prev) => prev.filter((item) => item.id !== id));
  };

  const deleteLinks = (ids: number[]) => {
    const idSet = new Set(ids);
    setLinks((prev) => prev.filter((item) => !idSet.has(item.id)));
  };

  const moveLinks = (ids: number[], newFolder: string) => {
    const idSet = new Set(ids);
    setLinks((prev) =>
      prev.map((item) => (idSet.has(item.id) ? { ...item, folder: newFolder } : item))
    );
  };

  const toggleFavorite = (id: number) => {
    setLinks((prev) =>
      prev.map((item) => (item.id === id ? { ...item, favorite: !item.favorite } : item))
    );
  };

  const addNotebook = async (sourceIds: number[]): Promise<AiExecutionResult<Notebook>> => {
    const selected = links.filter((l) => sourceIds.includes(l.id));
    if (selected.length === 0) {
      throw new Error('Notebook cần ít nhất một nguồn.');
    }

    let usedGemini = false;
    let fallbackReason: string | undefined;
    let notebookDraft: any = null;

    try {
      const res = await fetch('/api/gemini/create-notebook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sources: selected.map((s) => ({
            title: s.title,
            url: s.url,
            summary: s.summary,
          })),
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.draft) {
          notebookDraft = json.draft;
          usedGemini = json.usedGemini;
        } else {
          fallbackReason = json.fallbackReason;
        }
      } else {
        fallbackReason = `Server error: ${res.status}`;
      }
    } catch (err: any) {
      fallbackReason = err?.message || 'Không thể kết nối đến máy chủ AI';
    }

    const sections = notebookDraft?.sections || selected.map((s) => ({
      title: s.title,
      body: s.summary,
    }));

    const newNotebook: Notebook = {
      id: Date.now(),
      title: notebookDraft?.title || `${selected[0]?.folder || 'Kiến thức'} · Tổng hợp`,
      description: notebookDraft?.description || 'Sổ tay AI tổng hợp từ các nội dung đã chọn.',
      image: selected[0]?.image || '/assets/images/figma_2159/2159_12771_category_study.jpg',
      itemCount: selected.length,
      sections,
      createdAt: 'Hôm nay',
    };

    setNotebooks((prev) => [newNotebook, ...prev]);

    return {
      value: newNotebook,
      usedGemini,
      fallbackReason,
    };
  };

  const searchLinks = (rawQuery: string): SavedLink[] => {
    const query = rawQuery.toLowerCase().trim();
    if (!query) return links;

    return links.filter((link) => {
      const haystack = `${link.title} ${link.summary} ${link.folder} ${link.category} ${link.source} ${(link.tags || []).join(' ')}`.toLowerCase();
      
      // Exact term matching
      const terms = query.split(/\s+/).filter((t) => t.length > 1);
      if (terms.some((term) => haystack.includes(term))) {
        return true;
      }

      // Semantic concept matching (from demo script & Flutter implementation)
      const concepts: Record<string, string[]> = {
        recipe: ['bánh', 'nồi chiên', 'công thức', 'nấu', 'đồ ăn', 'banana', 'cake', 'air fryer'],
        design: ['figma', 'auto layout', 'ui', 'ux', 'thiết kế', 'component', 'variants'],
        travel: ['du lịch', 'địa điểm', 'chuyến đi', 'travel', 'đà lạt'],
      };

      for (const [key, words] of Object.entries(concepts)) {
        if (words.some((w) => query.includes(w))) {
          if (key === 'recipe' && (haystack.includes('bánh') || haystack.includes('ẩm thực') || haystack.includes('cake'))) {
            return true;
          }
          if (key === 'design' && (haystack.includes('figma') || haystack.includes('design') || haystack.includes('layout'))) {
            return true;
          }
          if (key === 'travel' && (haystack.includes('du lịch') || haystack.includes('travel'))) {
            return true;
          }
        }
      }

      return false;
    });
  };

  const resetDemoData = () => {
    setCategories(INITIAL_CATEGORIES);
    setFolders(INITIAL_FOLDERS);
    setLinks(INITIAL_LINKS);
    setNotebooks(INITIAL_NOTEBOOKS);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.FOLDERS);
    localStorage.removeItem(STORAGE_KEYS.LINKS);
    localStorage.removeItem(STORAGE_KEYS.NOTEBOOKS);
  };

  return (
    <MnemeContext.Provider
      value={{
        categories,
        folders,
        links,
        notebooks,
        addLink,
        updateLink,
        deleteLink,
        deleteLinks,
        moveLinks,
        toggleFavorite,
        addFolder,
        addNotebook,
        searchLinks,
        resetDemoData,
      }}
    >
      {children}
    </MnemeContext.Provider>
  );
};

export const useMneme = (): MnemeContextType => {
  const context = useContext(MnemeContext);
  if (!context) {
    throw new Error('useMneme must be used within a MnemeProvider');
  }
  return context;
};
