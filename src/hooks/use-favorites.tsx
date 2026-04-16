import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "zurich_favorites";

export interface FavoriteItem {
  label: string;
  iconName: string;
  path: string;
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

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
