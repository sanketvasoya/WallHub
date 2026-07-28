import { create } from "zustand";
import { persist } from "zustand/middleware";
import { get, set, del, keys } from "idb-keyval";
import type { ThemeMode, SortOption, OrientationPreference } from "@/types";
import type { DownloadHistoryEntry } from "@wallhub/types";

type GridDensity = "compact" | "comfortable" | "spacious";

interface SettingsState {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  gridDensity: GridDensity;
  setGridDensity: (density: GridDensity) => void;
  orientation: OrientationPreference;
  setOrientation: (orientation: OrientationPreference) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: "dark",
      setTheme: (theme) => set({ theme }),
      gridDensity: "comfortable" as GridDensity,
      setGridDensity: (gridDensity) => set({ gridDensity }),
      orientation: "all" as OrientationPreference,
      setOrientation: (orientation) => set({ orientation }),
    }),
    { name: "wallhub-settings" }
  )
);

interface FavoritesState {
  favorites: string[];
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.includes(id)
            ? state.favorites
            : [...state.favorites, id],
        })),
      removeFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.filter((f) => f !== id),
        })),
      isFavorite: (id) => get().favorites.includes(id),
      toggleFavorite: (id) => {
        const { favorites } = get();
        if (favorites.includes(id)) {
          set({ favorites: favorites.filter((f) => f !== id) });
        } else {
          set({ favorites: [...favorites, id] });
        }
      },
    }),
    { name: "wallhub-favorites" }
  )
);

interface SearchHistoryState {
  history: string[];
  addSearch: (query: string) => void;
  removeSearch: (query: string) => void;
  clearHistory: () => void;
}

export const useSearchHistoryStore = create<SearchHistoryState>()(
  persist(
    (set, get) => ({
      history: [],
      addSearch: (query) => {
        const trimmed = query.trim();
        if (!trimmed) return;
        const history = get().history.filter((h) => h !== trimmed);
        set({ history: [trimmed, ...history].slice(0, 20) });
      },
      removeSearch: (query) =>
        set((state) => ({
          history: state.history.filter((h) => h !== query),
        })),
      clearHistory: () => set({ history: [] }),
    }),
    { name: "wallhub-search-history" }
  )
);

const DOWNLOAD_HISTORY_KEY = "wallhub-download-history";
const MAX_DOWNLOAD_HISTORY = 50;

async function loadDownloadHistory(): Promise<DownloadHistoryEntry[]> {
  try {
    const data = await get<DownloadHistoryEntry[]>(DOWNLOAD_HISTORY_KEY);
    return data || [];
  } catch {
    return [];
  }
}

async function saveDownloadHistory(entries: DownloadHistoryEntry[]): Promise<void> {
  try {
    await set(DOWNLOAD_HISTORY_KEY, entries);
  } catch {
    // Silent fail for IndexedDB
  }
}

interface DownloadHistoryState {
  history: DownloadHistoryEntry[];
  loaded: boolean;
  loadHistory: () => Promise<void>;
  addDownload: (entry: Omit<DownloadHistoryEntry, "id" | "downloadedAt">) => Promise<void>;
  removeDownload: (id: string) => Promise<void>;
  clearHistory: () => Promise<void>;
}

export const useDownloadHistoryStore = create<DownloadHistoryState>()(
  (set, get) => ({
    history: [],
    loaded: false,
    loadHistory: async () => {
      if (get().loaded) return;
      const history = await loadDownloadHistory();
      set({ history, loaded: true });
    },
    addDownload: async (entry) => {
      const id = `${entry.wallpaperId}-${Date.now()}`;
      const newEntry: DownloadHistoryEntry = {
        ...entry,
        id,
        downloadedAt: new Date().toISOString(),
      };
      const history = [newEntry, ...get().history].slice(0, MAX_DOWNLOAD_HISTORY);
      set({ history });
      await saveDownloadHistory(history);
    },
    removeDownload: async (id) => {
      const history = get().history.filter((e) => e.id !== id);
      set({ history });
      await saveDownloadHistory(history);
    },
    clearHistory: async () => {
      set({ history: [] });
      await saveDownloadHistory([]);
    },
  })
);

interface SortPersistenceState {
  sorts: Record<string, SortOption>;
  setSort: (categorySlug: string, sort: SortOption) => void;
  getSort: (categorySlug: string) => SortOption;
}

export const useSortPersistenceStore = create<SortPersistenceState>()(
  persist(
    (set, get) => ({
      sorts: {},
      setSort: (categorySlug, sort) =>
        set((state) => ({
          sorts: { ...state.sorts, [categorySlug]: sort },
        })),
      getSort: (categorySlug) => get().sorts[categorySlug] || "hot",
    }),
    { name: "wallhub-sorts" }
  )
);
