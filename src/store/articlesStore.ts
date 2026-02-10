import { articlesApi } from '@/api';
import { ApiError, Article, CreateArticleDto, UpdateArticleDto } from '@/types';
import { create } from 'zustand';

interface ArticlesState {
    // State
    articles: Article[];
    currentArticle: Article | null;
    myArticles: Article[];
    isLoading: boolean;
    isLoadingMore: boolean;
    error: string | null;
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasMore: boolean;
    };

    // Actions
    fetchArticles: (params?: {
        page?: number;
        limit?: number;
        tag?: string;
    }) => Promise<void>;
    fetchMoreArticles: () => Promise<void>;
    fetchArticleById: (id: string) => Promise<void>;
    createArticle: (data: CreateArticleDto) => Promise<Article>;
    updateArticle: (id: string, data: UpdateArticleDto) => Promise<void>;
    deleteArticle: (id: string) => Promise<void>;
    likeArticle: (id: string) => Promise<void>;
    unlikeArticle: (id: string) => Promise<void>;
    fetchMyArticles: () => Promise<void>;
    clearCurrentArticle: () => void;
    clearError: () => void;
}

export const useArticlesStore = create<ArticlesState>((set, get) => ({
    // Initial state
    articles: [],
    currentArticle: null,
    myArticles: [],
    isLoading: false,
    isLoadingMore: false,
    error: null,
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasMore: false,
    },

    // Fetch articles
    fetchArticles: async (params = {}) => {
        set({ isLoading: true, error: null });

        try {
            const response = await articlesApi.getArticles({
                page: params.page || 1,
                limit: params.limit || 10,
                tag: params.tag,
            });

            set({
                articles: response.data,
                pagination: {
                    ...response.pagination,
                    hasMore: response.pagination.page < response.pagination.totalPages,
                },
                isLoading: false,
            });
        } catch (error) {
            const apiError = error as ApiError;
            set({ error: apiError.message, isLoading: false });
        }
    },

    // Fetch more articles (pagination)
    fetchMoreArticles: async () => {
        const { pagination, isLoadingMore } = get();

        if (!pagination.hasMore || isLoadingMore) return;

        set({ isLoadingMore: true, error: null });

        try {
            const nextPage = pagination.page + 1;
            const response = await articlesApi.getArticles({
                page: nextPage,
                limit: pagination.limit,
            });

            set((state) => ({
                articles: [...state.articles, ...response.data],
                pagination: {
                    ...response.pagination,
                    hasMore: response.pagination.page < response.pagination.totalPages,
                },
                isLoadingMore: false,
            }));
        } catch (error) {
            const apiError = error as ApiError;
            set({ error: apiError.message, isLoadingMore: false });
        }
    },

    // Fetch article by ID
    fetchArticleById: async (id: string) => {
        set({ isLoading: true, error: null });

        try {
            const article = await articlesApi.getArticleById(id);
            set({ currentArticle: article, isLoading: false });
        } catch (error) {
            const apiError = error as ApiError;
            set({ error: apiError.message, isLoading: false });
        }
    },

    // Create article
    createArticle: async (data: CreateArticleDto) => {
        set({ isLoading: true, error: null });

        try {
            const article = await articlesApi.createArticle(data);
            set((state) => ({
                articles: [article, ...state.articles],
                myArticles: [article, ...state.myArticles],
                isLoading: false,
            }));
            return article;
        } catch (error) {
            const apiError = error as ApiError;
            set({ error: apiError.message, isLoading: false });
            throw error;
        }
    },

    // Update article
    updateArticle: async (id: string, data: UpdateArticleDto) => {
        set({ isLoading: true, error: null });

        try {
            const updatedArticle = await articlesApi.updateArticle(id, data);

            set((state) => ({
                articles: state.articles.map((article) =>
                    article._id === id ? updatedArticle : article
                ),
                myArticles: state.myArticles.map((article) =>
                    article._id === id ? updatedArticle : article
                ),
                currentArticle:
                    state.currentArticle?._id === id ? updatedArticle : state.currentArticle,
                isLoading: false,
            }));
        } catch (error) {
            const apiError = error as ApiError;
            set({ error: apiError.message, isLoading: false });
            throw error;
        }
    },

    // Delete article
    deleteArticle: async (id: string) => {
        set({ isLoading: true, error: null });

        try {
            await articlesApi.deleteArticle(id);

            set((state) => ({
                articles: state.articles.filter((article) => article._id !== id),
                myArticles: state.myArticles.filter((article) => article._id !== id),
                isLoading: false,
            }));
        } catch (error) {
            const apiError = error as ApiError;
            set({ error: apiError.message, isLoading: false });
            throw error;
        }
    },

    // Like article
    likeArticle: async (id: string) => {
        try {
            const updatedArticle = await articlesApi.likeArticle(id);

            set((state) => ({
                articles: state.articles.map((article) =>
                    article._id === id ? updatedArticle : article
                ),
                currentArticle:
                    state.currentArticle?._id === id ? updatedArticle : state.currentArticle,
            }));
        } catch (error) {
            const apiError = error as ApiError;
            set({ error: apiError.message });
        }
    },

    // Unlike article
    unlikeArticle: async (id: string) => {
        try {
            const updatedArticle = await articlesApi.unlikeArticle(id);

            set((state) => ({
                articles: state.articles.map((article) =>
                    article._id === id ? updatedArticle : article
                ),
                currentArticle:
                    state.currentArticle?._id === id ? updatedArticle : state.currentArticle,
            }));
        } catch (error) {
            const apiError = error as ApiError;
            set({ error: apiError.message });
        }
    },

    // Fetch user's articles
    fetchMyArticles: async () => {
        set({ isLoading: true, error: null });

        try {
            const articles = await articlesApi.getMyArticles();
            set({ myArticles: articles, isLoading: false });
        } catch (error) {
            const apiError = error as ApiError;
            set({ error: apiError.message, isLoading: false });
        }
    },

    // Clear current article
    clearCurrentArticle: () => set({ currentArticle: null }),

    // Clear error
    clearError: () => set({ error: null }),
}));