import { articlesApi } from '@/api';
import { ApiError, Article, CreateArticleDto, UpdateArticleDto } from '@/types';
import { create } from 'zustand';
import { useAuthStore } from './authStore';

interface ArticlesState {
    // State
    articles: Article[];
    selectedArticle: Article | null;
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
    fetchArticleById: (id: string) => Promise<void>;
    fetchArticleBySlug: (slug: string) => Promise<void>;
    createArticle: (data: CreateArticleDto) => Promise<Article>;
    updateArticle: (id: string, data: UpdateArticleDto) => Promise<void>;
    deleteArticle: (id: string) => Promise<void>;
    likeArticle: (id: string) => Promise<void>;
    fetchMyArticles: () => Promise<void>;
    clearSelectedArticle: () => void;
    clearError: () => void;
}

export const useArticlesStore = create<ArticlesState>((set, get) => ({
    // Initial state
    articles: [],
    selectedArticle: null,
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

            // console.log("Articles", response);

            set({
                articles: response.data,
                pagination: {
                    page: response.currentPage,
                    totalPages: response.totalPages,
                    total: response.total,
                    hasMore: response.currentPage < response.totalPages,
                    limit: 10
                },
                isLoading: false,
            });
        } catch (error) {
            const apiError = error as ApiError;
            set({ error: apiError.message, isLoading: false });
        }
    },


    fetchArticleBySlug: async (slug: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await articlesApi.getArticleBySlug(slug);

            set({ selectedArticle: response, isLoading: false });
        } catch (err) {
            set({ error: 'Failed to load article', isLoading: false });
        }
    },

    // Fetch article by ID
    fetchArticleById: async (id: string) => {
        set({ isLoading: true, error: null });

        try {
            const article = await articlesApi.getArticleById(id);
            set({ selectedArticle: article, isLoading: false });
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
                    state.selectedArticle?._id === id ? updatedArticle : state.selectedArticle,
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
        const { user } = useAuthStore.getState();
        try {
            const { data: { likesCount, isLiked } } = await articlesApi.likeArticle(id);

            // console.log("Like response", { likesCount, isLiked });
            const currentUserId = user?.id;

            if (!currentUserId) {
                console.log("User not logged in, cannot like article", user);
                set({ error: 'You must be logged in to like articles.' });
                return;
            }

            set((state) => ({
                articles: state.articles.map((article) =>
                    article._id === id ?
                        {
                            ...article,
                            likesCount,
                            likes: isLiked ?
                                [...article.likes, currentUserId] :
                                article.likes.filter(userId => userId !== currentUserId)
                        } :
                        article
                ),
                selectedArticle:
                    state.selectedArticle?._id === id ?
                        {
                            ...state.selectedArticle,
                            likesCount,
                            likes: isLiked ?
                                [...state.selectedArticle.likes, currentUserId] :
                                state.selectedArticle.likes.filter(userId => userId !== currentUserId)
                        } :
                        state.selectedArticle,
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

    // Clear selected article
    clearSelectedArticle: () => set({ selectedArticle: null }),

    // Clear error
    clearError: () => set({ error: null }),
}));