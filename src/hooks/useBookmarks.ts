import { useState, useEffect, useCallback } from 'react';

const BOOKMARKS_STORAGE_KEY = 'jami3ati_bookmarked_ids_v1';

export function useBookmarks() {
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse bookmarks from localStorage', e);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarkedIds));
    } catch (e) {
      console.warn('Failed to save bookmarks to localStorage', e);
    }
  }, [bookmarkedIds]);

  const isBookmarked = useCallback((id: string) => {
    return bookmarkedIds.includes(id);
  }, [bookmarkedIds]);

  const toggleBookmark = useCallback((id: string) => {
    setBookmarkedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  }, []);

  const clearBookmarks = useCallback(() => {
    setBookmarkedIds([]);
  }, []);

  return {
    bookmarkedIds,
    isBookmarked,
    toggleBookmark,
    clearBookmarks,
    bookmarksCount: bookmarkedIds.length,
  };
}
