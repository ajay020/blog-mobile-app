import { commentsApi } from "@/api/comments.api";
import { ApiError, Comment } from "@/types";
import { create } from "zustand";
import { useAuthStore } from "./authStore";

interface CommentsState {
    comments: Comment[];
    isLoading: boolean;
    error: string | null;

    getComments: (articleId: string) => Promise<void>;
    createComment: (articleId: string, content: string, parentCommentId?: string) => Promise<void>;
    updateComment: (commentId: string, content: string) => Promise<void>;
    deleteComment: (commentId: string) => Promise<void>;
    toggleCommentLike: (commentId: string) => Promise<void>;
}

export const useCommentsStore = create<CommentsState>((set, get) => ({
    comments: [],
    isLoading: false,
    error: null,

    getComments: async (articleId: string) => {
        set({ isLoading: true, error: null });

        try {
            const response = await commentsApi.getComments(articleId);
            set({ comments: response.data, isLoading: false });
        } catch (error) {
            const apiError = error as ApiError;
            set({ error: apiError.message, isLoading: false });
        }
    },

    // Create a comment
    createComment: async (articleId: string, content: string, parentCommentId?: string) => {
        set({ isLoading: true, error: null });

        try {
            const response = await commentsApi.createComment(articleId, { content, parentComment: parentCommentId });
            set({ comments: [...get().comments, response.data], isLoading: false });
        } catch (error) {
            const apiError = error as ApiError;
            set({ error: apiError.message, isLoading: false });
        }
    },

    //Update a comment
    updateComment: async (commentId: string, content: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await commentsApi.updateComment(commentId, content);

            set({
                comments: get().comments.map(comment =>
                    comment._id === commentId ? response.data : comment
                ),
                isLoading: false,
            });
        } catch (error) {
            const apiError = error as ApiError;
            set({ error: apiError.message, isLoading: false });
        }
    },

    // Delete a comment
    deleteComment: async (commentId: string) => {
        set({ isLoading: true, error: null });
        try {
            await commentsApi.deleteComment(commentId);
            set({
                comments: get().comments.filter(comment => comment._id !== commentId),
                isLoading: false,
            });
        } catch (error) {
            const apiError = error as ApiError;
            set({ error: apiError.message, isLoading: false });
        }
    },

    //Like/Unlike a comment
    toggleCommentLike: async (commentId: string) => {
        const { user } = useAuthStore.getState();

        if (user === null) {
            set({ error: 'You must be logged in to like a comment.' });
            return;
        }
        const currentUserId = user.id;

        set({ isLoading: true, error: null });
        try {
            const response = await commentsApi.toggleCommentLike(commentId);

            set({
                comments: get().comments.map(comment =>
                    comment._id === commentId
                        ? {
                            ...comment,
                            likesCount: response.data.likesCount,
                            likes: [
                                ...comment.likes.filter(id => id !== currentUserId),
                                ...(response.data.isLiked ? [currentUserId] : [])
                            ],
                        }
                        : comment
                ),
                isLoading: false,
            });
        } catch (error) {
            const apiError = error as ApiError;
            set({ error: apiError.message, isLoading: false });
        }
    }
}));