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