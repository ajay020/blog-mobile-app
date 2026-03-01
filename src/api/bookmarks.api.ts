import {
    BookmarksResponse, GetBookmarksParams,
    IsBookmarkedResponse,
    ToggleBookmarkResponse
} from "@/types/bookmark.types";
import { apiClient } from ".";

export const bookmarkapiClient = {
    // Toggle bookmark (add/remove)
    toggleBookmark: async (articleId: string): Promise<ToggleBookmarkResponse> => {
        const response = await apiClient.put<ToggleBookmarkResponse>(
            `/articles/${articleId}/bookmark`
        );
        console.log("Bookmark Response: ", response)
        return response;
    },

    // Get user's bookmarks with pagination
    getBookmarks: async (params?: GetBookmarksParams): Promise<BookmarksResponse> => {
        const queryParams = new URLSearchParams();

        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());

        const response = await apiClient.get<BookmarksResponse>(
            `/bookmarks?${queryParams.toString()}`
        );
        return response;
    },

    // Check if article is bookmarked
    isBookmarked: async (articleId: string): Promise<IsBookmarkedResponse> => {
        const response = await apiClient.get<IsBookmarkedResponse>(
            `/articles/${articleId}/is-bookmarked`
        );
        return response;
    },

}