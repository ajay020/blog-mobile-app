import { API_ENDPOINTS } from "@/constants";
import { CommentResponse, CommentsResponse, CreateCommentData, ToggleCommentLikeResponse } from "@/types";
import { apiClient } from ".";

export const commentsApi = {
    // Get comments for an article
    getComments: async (articleId: string): Promise<CommentsResponse> => {
        const response = await apiClient.get<CommentsResponse>(
            API_ENDPOINTS.ARTICLE_COMMENTS(articleId)
        );
        return response;
    },

    // Create a comment
    createComment: async (
        articleId: string,
        data: CreateCommentData
    ): Promise<CommentResponse> => {
        const response = await apiClient.post<CommentResponse>(
            API_ENDPOINTS.ARTICLE_COMMENTS(articleId),
            data
        );

        return response;
    },

    //   // Update a comment
    updateComment: async (commentId: string, content: string): Promise<CommentResponse> => {
        const response = await apiClient.put<CommentResponse>(
            API_ENDPOINTS.UPDATE_COMMENT(commentId), {
            content,
        });
        return response;
    },
    //   // Delete a comment
    deleteComment: async (commentId: string): Promise<{ success: boolean }> => {
        const response = await apiClient.delete<{ success: boolean }>(
            API_ENDPOINTS.DELETE_COMMENT(commentId));
        return response;
    },

    // Like/Unlike a comment
    toggleCommentLike: async (
        commentId: string
    ): Promise<ToggleCommentLikeResponse> => {
        const response = await apiClient.put<ToggleCommentLikeResponse>(
            API_ENDPOINTS.TOGGLE_COMMENT_LIKE(commentId));
        return response;
    }
};