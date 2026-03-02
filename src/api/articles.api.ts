import { API_ENDPOINTS } from '@/constants/api';
import {
    ApiResponse,
    Article,
    ArticlesResponse,
    Comment,
    CreateArticleDto,
    GetArticlesParams,
    LikeResponse,
    UpdateArticleDto
} from '@/types';
import { delay } from '@/utils/helper';
import { apiClient } from './client';

/**
 * Articles API service
 */
export const articlesApi = {
    /**
     * Get all articles with pagination
     */
    getArticles: async (params?: GetArticlesParams): Promise<ArticlesResponse> => {
        // console.log("Query params: ", params);
        await delay(2000);
        const response = await apiClient.get<ArticlesResponse>(
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
     * Get article by slug
     */
    getArticleBySlug: async (slug: string): Promise<Article> => {
        const response = await apiClient.get<ApiResponse<Article>>(
            API_ENDPOINTS.ARTICLE_BY_SLUG(slug)
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
    likeArticle: async (id: string): Promise<LikeResponse> => {
        const response = await apiClient.put<LikeResponse>(
            API_ENDPOINTS.ARTICLE_LIKE(id)
        );
        return response;
    },

    /**
     * Get user's own articles
     */
    getMyArticles: async (): Promise<Article[]> => {
        await delay(1000);
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