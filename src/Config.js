const config = {
    API_URL: "",

    AUTH: {
        KAKAO: "/api/auth/kakao",
        REISSUE: "/api/auth/reissue",
        LOGOUT: "/api/auth/logout",
        WITHDRAW: "/api/auth/withdraw",
    },

    FOLLOW: {
        PROFILE: (id) => `/api/follow/${encodeURIComponent(id)}`,
        TODOS: (id) => `/api/follow/${encodeURIComponent(id)}/todos`,
        CALENDAR: (id) => `/api/follow/${encodeURIComponent(id)}/calendar`,
        FOLLOWINGS: "/api/follow/followings",
        AVAILABLE: "/api/follow",
        DELETE: "/api/follow",
        SEARCH: "/api/follow/search",
        CREATE: "/api/follow",
    },

    PROFILE: {
      GET: "/api/prifile",
      PUT:"/api/prifile",
      DELETE:"/api/prifile",
      INTRO: "/api/prifile/intro",
    },

    CALENDAR: {
        GET: "/api/todos/calendar",
    },

    TODOS: {
        LIST: "/api/todos",
        UPDATE: (todoId) => `/api/todos/${todoId}`,
        DELETE: (todoId, date) => `/api/todos/${todoId}/dates/${date}`,
        TOGGLE_COMPLETE: (todoId, date) =>
            `/api/todos/${todoId}/dates/${date}/complete`,
    },

    CATEGORIES: {
        GET: "/api/categories",
    },
};

export default config;