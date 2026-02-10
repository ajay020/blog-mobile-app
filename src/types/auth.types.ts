export interface User {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    bio?: string;
    role: 'user' | 'admin';
    isVerified: boolean;
    website?: string;
    twitter?: string;
    github?: string;
    linkedin?: string;
    articlesCount: number;
    followersCount: number;
    followingCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    name: string;
    email: string;
    password: string;
}

export interface UpdateProfileData {
    name?: string;
    email?: string;
    bio?: string;
    avatar?: string;
    website?: string;
    twitter?: string;
    github?: string;
    linkedin?: string;
}

export interface UpdatePasswordData {
    currentPassword: string;
    newPassword: string;
}

export interface AuthResponse {
    success: boolean;
    token: string;
    user: User;
}
