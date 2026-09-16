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
  USERS: {
    ME: "/users/me",
    ME_MEDIA: "/users/me/media",
    ALL: "/users",
    ONE: (userId) => `/users/${userId}`,
    ROLE: (userId) => `/users/${userId}/role`,
    MEDIA_BY_ID: (userId) => `/users/${userId}/media`,
  },
  SEASONS: {
    ALL: "/seasons",
    ONE: (seasonId) => `/seasons/${seasonId}`,
  },
  EVENTS: {
    ALL_BY_SEASON: (seasonId) => `/seasons/${seasonId}/events`,
    ONE_BY_SEASON: (seasonId, eventId) =>
      `/seasons/${seasonId}/events/${eventId}`,
    MEDIA: (seasonId, eventId) =>
      `/seasons/${seasonId}/events/${eventId}/media`,
  },
  EVENT_INFOS: {
    ALL: "/event-infos",
    ONE: (eventInfoId) => `/event-infos/${eventInfoId}`,
  },
  MEDIA: {
    ALL: "/media",
    ONE: (mediaId) => `/media/${mediaId}`,
  },
};

export const API_BASE_URL = "http://localhost:3000/api";
