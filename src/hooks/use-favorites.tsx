import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "zurich_favorites";

export interface FavoriteItem {
  label: string;
  iconName: string;
  path: string;
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage only on client (avoids SSR hydration mismatch)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setFavorites(JSON.parse(stored));
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites, hydrated]);

  const isFavorite = useCallback(
    (path: string) => favorites.some((f) => f.path === path),
    [favorites]
  );

  const toggleFavorite = useCallback(
    (item: FavoriteItem) => {
      setFavorites((prev) => {
        const exists = prev.some((f) => f.path === item.path);
        if (exists) return prev.filter((f) => f.path !== item.path);
        return [...prev, item];
      });
    },
    []
  );

  return { favorites, isFavorite, toggleFavorite };
}
