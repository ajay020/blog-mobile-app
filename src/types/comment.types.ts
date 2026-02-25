export interface CommentAuthor {
    _id: string;
    name: string;
    avatar?: string;
}

export interface Comment {
    _id: string;
    content: string;
    article: string;
    author: CommentAuthor;
    parentComment?: string | null;
    likes: string[];
    likesCount: number;
    repliesCount?: number;
    replies?: Comment[];
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CommentState {
    comments: Comment[];
    isLoading: boolean;
    error: string | null;
}

export interface CreateCommentData {
    content: string;
    parentComment?: string;
}

export interface CommentResponse {
    success: boolean;
    data: Comment;
}

export interface CommentsResponse {
    success: boolean;
    data: Comment[];
    count: number;
}

export interface ToggleCommentLikeResponse {
    success: boolean;
    data: {
        likesCount: number;
        isLiked: boolean;
    };
}