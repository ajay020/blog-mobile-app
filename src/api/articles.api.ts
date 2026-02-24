import { API_ENDPOINTS } from '@/constants/api';
import {
    ApiResponse,
    Article,
    ArticleResponse,
    Comment,
    CreateArticleDto,
    UpdateArticleDto
} from '@/types';
import { apiClient } from './client';

/**
 * Articles API service
 */
export const articlesApi = {
    /**
     * Get all articles with pagination
     */
    getArticles: async (params?: {
        page?: number;
        limit?: number;
        tag?: string;
        authorId?: string;
    }): Promise<ArticleResponse> => {
        const response = await apiClient.get<ArticleResponse>(
            API_ENDPOINTS.ARTICLES,
            { params }
        );

        // console.log("RESPONSE", response)
        return response;
    },

    /**
     * Get article by ID
     */
    getArticleById: async (id: string): Promise<Article> => {
        const response = await apiClient.get<ApiResponse<Article>>(
            API_ENDPOINTS.ARTICLE_BY_ID(id)
        );
        return response.data;
    },

    /**
     * Create new article
     */
    createArticle: async (data: CreateArticleDto): Promise<Article> => {
        const response = await apiClient.post<ApiResponse<Article>>(
            API_ENDPOINTS.ARTICLES,
            data
        );
        return response.data;
    },

    /**
     * Update article
     */
    updateArticle: async (id: string, data: UpdateArticleDto): Promise<Article> => {
        const response = await apiClient.put<ApiResponse<Article>>(
            API_ENDPOINTS.ARTICLE_BY_ID(id),
            data
        );
        return response.data;
    },

    /**
     * Delete article
     */
    deleteArticle: async (id: string): Promise<void> => {
        await apiClient.delete(API_ENDPOINTS.ARTICLE_BY_ID(id));
    },

    /**
     * Like an article
     */
    likeArticle: async (id: string): Promise<Article> => {
        const response = await apiClient.post<ApiResponse<Article>>(
            API_ENDPOINTS.ARTICLE_LIKE(id)
        );
        return response.data;
    },

    /**
     * Unlike an article
     */
    unlikeArticle: async (id: string): Promise<Article> => {
        const response = await apiClient.delete<ApiResponse<Article>>(
            API_ENDPOINTS.ARTICLE_UNLIKE(id)
        );
        return response.data;
    },

    /**
     * Get user's own articles
     */
    getMyArticles: async (): Promise<Article[]> => {
        const response = await apiClient.get<ApiResponse<Article[]>>(
            API_ENDPOINTS.MY_ARTICLES
        );
        return response.data;
    },

    /**
     * Get article comments
     */
    getArticleComments: async (articleId: string): Promise<Comment[]> => {
        const response = await apiClient.get<ApiResponse<Comment[]>>(
            API_ENDPOINTS.ARTICLE_COMMENTS(articleId)
        );
        return response.data;
    },

    /**
     * Add comment to article
     */
    addComment: async (articleId: string, content: string): Promise<Comment> => {
        const response = await apiClient.post<ApiResponse<Comment>>(
            API_ENDPOINTS.ARTICLE_COMMENTS(articleId),
            { content }
        );
        return response.data;
    },

    /**
     * Delete comment
     */
    deleteComment: async (articleId: string, commentId: string): Promise<void> => {
        await apiClient.delete(API_ENDPOINTS.COMMENT_BY_ID(articleId, commentId));
    },
};