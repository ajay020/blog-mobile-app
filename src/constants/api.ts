// Update this with your actual backend API URL
export const API_BASE_URL = __DEV__
    ? 'http://172.21.212.37:5000/api' // For development
    : 'https://your-production-api.com/api'; // For production

export const API_ENDPOINTS = {
    // Auth endpoints
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    REFRESH_TOKEN: '/auth/refresh',

    // Article endpoints
    ARTICLES: '/articles',
    ARTICLE_BY_ID: (id: string) => `/articles/${id}`,
    ARTICLE_LIKE: (id: string) => `/articles/${id}/like`,
    ARTICLE_UNLIKE: (id: string) => `/articles/${id}/unlike`,
    MY_ARTICLES: '/articles/my-articles',

    // Comment endpoints
    ARTICLE_COMMENTS: (articleId: string) => `/articles/${articleId}/comments`,
    COMMENT_BY_ID: (articleId: string, commentId: string) =>
        `/articles/${articleId}/comments/${commentId}`,

    // User endpoints
    USER_PROFILE: (userId: string) => `/users/${userId}`,
    UPDATE_PROFILE: '/users/profile',
    FOLLOW_USER: (userId: string) => `/users/${userId}/follow`,
    UNFOLLOW_USER: (userId: string) => `/users/${userId}/unfollow`,
} as const;

// Request timeout
export const API_TIMEOUT = 30000; // 30 seconds