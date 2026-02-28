import { bookmarkapiClient } from '@/api/bookmarks.api';
import { useAuthStore } from '@/store/authStore';
import { Article } from '@/types';
import { create } from 'zustand';

interface BookmarkState {
    // State
    isBookmarkedMap: Record<string, boolean>; // articleId -> isBookmarked
    bookmarks: Article[];
    isLoading: boolean;
    error: string | null;
    page: number;
    totalPages: number;

    // Actions
    checkIsBookmarked: (articleId: string) => Promise<void>;
    toggleBookmark: (articleId: string) => Promise<void>;
    getBookmarks: (params?: { page?: number; limit?: number; reset?: boolean }) => Promise<void>;
    resetBookmarks: () => void;
}

export const useBookmarkStore = create<BookmarkState>((set, get) => ({
    isBookmarkedMap: {},
    bookmarks: [],
    isLoading: false,
    error: null,
    page: 1,
    totalPages: 1,

    //  Check bookmark status for one article
    checkIsBookmarked: async (articleId: string) => {
        try {
            const res = await bookmarkapiClient.isBookmarked(articleId);

            set((state) => ({
                isBookmarkedMap: {
                    ...state.isBookmarkedMap,
                    [articleId]: res.data.isBookmarked,
                },
            }));
        } catch (error: any) {
            console.log('checkIsBookmarked error:', error.message);
        }
    },

    // ⭐ Toggle bookmark (optimistic)
    toggleBookmark: async (articleId: string) => {
            console.log("Bookmark article id: ", articleId);

        const { user } = useAuthStore.getState();
        if (!user) {
            set({ error: 'You must be logged in to bookmark articles.' });
            return;
        }

        const prev = get().isBookmarkedMap[articleId] ?? false;

        // Optimistic UI
        set((state) => ({
            isBookmarkedMap: {
                ...state.isBookmarkedMap,
                [articleId]: !prev,
            },
        }));

        try {
            const res = await bookmarkapiClient.toggleBookmark(articleId);

            console.log("Bookmark response: ", res);

            // Sync with server response (source of truth)
            set((state) => ({
                isBookmarkedMap: {
                    ...state.isBookmarkedMap,
                    [articleId]: res.data.isBookmarked,
                },
            }));
        } catch (error: any) {
            // Rollback on failure
            set((state) => ({
                isBookmarkedMap: {
                    ...state.isBookmarkedMap,
                    [articleId]: prev,
                },
            }));

            set({ error: error.message || 'Failed to toggle bookmark' });
        }
    },

    // 📚 Get user's bookmarks (pagination)
    getBookmarks: async ({ page = 1, limit = 10, reset = false } = {}) => {
        set({ isLoading: true, error: null });

        try {
            const res = await bookmarkapiClient.getBookmarks({ page, limit });

            set((state) => ({
                bookmarks: reset ? res.data : [...state.bookmarks, ...res.data],
                page: res.currentPage,
                totalPages: res.totalPages,
                isLoading: false,
            }));
        } catch (error: any) {
            set({
                error: error.message || 'Failed to load bookmarks',
                isLoading: false,
            });
        }
    },

    resetBookmarks: () => {
        set({
            bookmarks: [],
            page: 1,
            totalPages: 1,
            error: null,
        });
    },
}));