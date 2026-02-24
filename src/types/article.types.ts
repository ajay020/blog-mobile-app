import { OutputData } from '@editorjs/editorjs';

export interface Article {
    _id: string;
    title: string;
    slug: string;
    coverImage?: string;
    content: OutputData;
    excerpt?: string;
    author: {
        _id: string;
        name: string;
        email: string;
        avatar?: string;
        bio?: string;
        articlesCount: number;
        followersCount: number;
    };
    status: 'draft' | 'published' | 'archived';
    publishedAt?: string;
    tags: string[];
    category?: string;
    metaDescription?: string;
    views: number;
    likes: string[];
    likesCount: number;
    readingTime: number;
    commentsCount: number;
    isFeatured: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ArticleState {
    articles: Article[];
    currentArticle: Article | null;
    myArticles: Article[];
    featuredArticles: Article[];
    isLoading: boolean;
    error: string | null;
    pagination: {
        currentPage: number;
        totalPages: number;
        total: number;
        limit: number;
    };
}

export interface CreateArticleData {
    title: string;
    content: OutputData;
    coverImage?: string;
    tags?: string[];
    category?: string;
    status?: 'draft' | 'published';
    metaDescription?: string;
}

export interface UpdateArticleData {
    title?: string;
    content?: OutputData;
    coverImage?: string;
    tags?: string[];
    category?: string;
    status?: 'draft' | 'published';
    metaDescription?: string;
}

export interface GetArticlesParams {
    page?: number;
    limit?: number;
    tag?: string;
    category?: string;
    search?: string;
    author?: string;
}

export interface ArticleResponse {
    success: boolean;
    data: Article;
}

export interface ArticlesResponse {
    success: boolean;
    data: Article[];
    totalPages: number;
    currentPage: number;
    total: number;
}

export interface LikeResponse {
    success: boolean;
    data: {
        likesCount: number;
        isLiked: boolean;
    };
}

export interface CreateArticleDto {
    title: string;
    content: string;
    excerpt: string;
    coverImage?: string;
    tags: string[];
}

export interface UpdateArticleDto {
    title?: string;
    content?: string;
    excerpt?: string;
    coverImage?: string;
    tags?: string[];
}