export const ROLES = {
  GUEST: "guest",
  MEMBER: "Member",
  ADMIN: "Admin",
};

export const STORAGE_KEYS = {
  USER: "osc_user",
};

export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    VERIFY_EMAIL: "/auth/verify-email",
    RESEND_OTP: "/auth/resend-otp",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    LOGOUT: "/auth/logout",
  },
  EVENTS: {
    GET_BY_SEASON: (seasonId) => `/seasons/${seasonId}/events`,
    GET_ONE: (seasonId, eventId) => `/seasons/${seasonId}/events/${eventId}`,
  },
  SEASONS: "/seasons",
};
export const API_BASE_URL = "https://containers.back4app.com/apps/d950dc41-51ab-4b39-b47c-1c619a1fd5be/api";
