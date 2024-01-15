import { MessageRequest } from "./types/api/message";

export const API_BASE_URL: string = `http://localhost:${
  (process.env.REACT_APP_BACKEND_PORT as string) ?? 5000
}`;
export const API_MESSAGE_HUB_URL: string = `http://localhost:${
  (process.env.REACT_APP_BACKEND_PORT as string) ?? 5000
}/hub/message`;
export const API_NOTIFICATION_HUB_URL: string = `http://localhost:${
  (process.env.REACT_APP_BACKEND_PORT as string) ?? 5000
}/hub/notification`;

export const ACCOUNT_ROUTES = {
  LOGIN: "/accounts/auth",
  REGISTER: "/accounts/register",
  VERIFY_EMAIL: "/accounts/verify-email",
  LOGOUT: "/accounts/revoke-token",
  REFRESH: "/accounts/refresh-token",
  FORGOT_PASSWORD: "/accounts/forgot-password",
  RESET_PASSWORD: "/accounts/reset-password",
  COMPLETE_PROFILE: "/accounts/complete-profile",
  FAVORITES: "/accounts/favorites",
  LIKE: (id: string) => `/accounts/like/${id}`,
  DISLIKE: (id: string) => `/accounts/dislike/${id}`,
  MY_VIEWS: "/accounts/my-views",
  VIEWED_ME: "/accounts/viewed-me",
  USER_BY_ID: (id: string) => `/accounts/${id}`,
  USERS: `/accounts`,
  WITH_FILTER: (
    minAge: number,
    maxAge: number,
    minTag: number,
    maxTag: number,
    minDistance: number,
    maxDistance: number,
    page: number
  ) =>
    "accounts/filter/options?minAge=" +
    minAge +
    "&maxAge=" +
    maxAge +
    "&minTag=" +
    minTag +
    "&maxTag=" +
    maxTag +
    "&minDistance=" +
    minDistance +
    "&maxDistance=" +
    maxDistance +
    "&page=" +
    page,
};

export const MESSAGE_ROUTES = {
  GET_MESSAGES: (options: MessageRequest) =>
    `messages/options?firstUserId=${options.firstUserId}&secondUserId=${options.secondUserId}`,
};

export const NOTIFICATION_ROUTES = {
  NOTIFICATIONS: "notifications",
  NOTIFICATIONS_COUNT: "notifications/count",
  DELETE: (id: string) => `notifications/${id}`,
};

export enum NotificationEvent {
  AddNotification = "AddNotification",
  DeleteNotification = "DeleteNotification",
  IncreaseNotificationsCount = "IncreaseNotificationsCount",
  ReduceNotificationsCount = "ReduceNotificationsCount",
  ProfileView = "ProfileView",
  LikeProfile = "LikeProfile",
  DislikeProfile = "DislikeProfile",
  ProfilesMatched = "ProfilesMatched",
  ProfilesUnmatched = "ProfilesUnmatched",
  NotifyMessageReceived = "NotifyMessageReceived",
}

export enum ChatEvent {
  NewMessage = "NewMessage",
  MessageNotValid = "MessageNotValid",
  NotifyInterlocutor = "NotifyInterlocutor",
  DeleteMessages = "DeleteMessages",
}

export const ACCESS_TOKEN = "jwtToken";
export const REFRESH_TOKEN = "refreshToken";
