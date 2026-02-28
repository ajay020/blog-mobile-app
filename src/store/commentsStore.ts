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
            // console.log('Fetched comments:', response);

            set({ comments: response.data, isLoading: false });
        } catch (error) {
            const apiError = error as ApiError;
            set({ error: apiError.message, isLoading: false });
        }
    },

    // Create a comment
    createComment: async (articleId: string, content: string, parentCommentId?: string) => {
        // console.log('Creating comment:', { articleId, content, parentCommentId });
        set({ isLoading: true, error: null });

        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
        await delay(2000);

        // Optimistically add the new comment to the UI
        const tempComment: Comment = {
            _id: `temp-${Date.now()}`, // Temporary ID for optimistic UI
            content,
            author: {
                _id: useAuthStore.getState().user?.id || '',
                name: useAuthStore.getState().user?.name || 'You',
                avatar: useAuthStore.getState().user?.avatar || undefined,
            },
            createdAt: new Date().toISOString(),
            likesCount: 0,
            likes: [],
            article: "",
            isDeleted: false,
            updatedAt: ""
        };

        set({ comments: [...get().comments, tempComment], isLoading: false });

        try {
            const response = await commentsApi.createComment(
                articleId,
                { content, parentComment: parentCommentId }
            );

            set({
                comments: [...get().comments.filter(c => c._id !== tempComment._id), response.data],
                isLoading: false
            }
            );
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

        get().comments.forEach(comment => {
            if (comment._id === commentId || comment.replies?.some(reply => reply._id === commentId)) {
                console.log('Current like status for comment:', {
                    commentId,
                    isLiked: comment.likes.includes(user.id),
                    likesCount: comment.likesCount,
                });
            }
        });

        // Optimistically update the UI
        set({
            comments: get().comments.map(c =>
                c._id === commentId
                    ? {
                        ...c,
                        likesCount: c.likes.includes(user.id) ? c.likesCount - 1 : c.likesCount + 1,
                        likes: c.likes.includes(user.id)
                            ? c.likes.filter(id => id !== user.id)
                            : [...c.likes, user.id],
                    }
                    : {
                        ...c,
                        replies: c.replies?.map(r =>
                            r._id === commentId
                                ? {
                                    ...r,
                                    likesCount: r.likes.includes(user.id) ? r.likesCount - 1 : r.likesCount + 1,
                                    likes: r.likes.includes(user.id)
                                        ? r.likes.filter(id => id !== user.id)
                                        : [...r.likes, user.id],
                                }
                                : r
                        )
                    }

            ),
        });

        set({ isLoading: true, error: null });
        try {
            const response = await commentsApi.toggleCommentLike(commentId);
            console.log('Toggled comment like:', response, commentId);

            // Update the comment with the response from the server to ensure consistency
            set({
                comments: get().comments.map(c =>
                    c._id === commentId ? {
                        ...c,
                        likesCount: response.data.likesCount,
                        likes: response.data.isLiked ? [...c.likes, user.id] : c.likes.filter(id => id !== user.id),
                    }
                        : {
                            ...c,
                            replies: c.replies?.map(r =>
                                r._id === commentId
                                    ? {
                                        ...r,
                                        likesCount: response.data.likesCount,
                                        likes: response.data.isLiked ? [...r.likes, user.id] : r.likes.filter(id => id !== user.id),
                                    }
                                    : r
                            )
                        }
                ),
                isLoading: false,
            });
        } catch (error) {
            const apiError = error as ApiError;
            set({ error: apiError.message, isLoading: false });
            console.log('failed comment like', error);
        }
    }
}));