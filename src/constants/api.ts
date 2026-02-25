export const API_BASE_URL = __DEV__
    ? 'http://10.145.203.37:5000/api' // For development
    : ' https://blog-backend-a08f.onrender.com/api'; // For production


// console.log('API_BASE_URL:', API_BASE_URL);

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
    ARTICLE_BY_SLUG: (slug: string) => `/articles/${slug}`,
    ARTICLE_LIKE: (id: string) => `/articles/${id}/like`,
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