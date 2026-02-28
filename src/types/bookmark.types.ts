import { Article } from './article.types';

export interface Bookmark {
    _id: string;
    user: string;
    article: string | Article;
    createdAt: string;
    updatedAt: string;
}

export interface BookmarksResponse {
    success: boolean;
    data: Article[];
    totalPages: number;
    currentPage: number;
    total: number;
}

export interface ToggleBookmarkResponse {
    success: boolean;
    message: string;
    data: {
        isBookmarked: boolean;
    };
}

export interface IsBookmarkedResponse {
    success: boolean;
    data: {
        isBookmarked: boolean;
    };
}

export interface RemoveBookmarkResponse {
    success: boolean;
    message: string;
}

export interface GetBookmarksParams {
    page?: number;
    limit?: number;
}