import { MessageRequest } from "./types/api/message";
import { Filter } from "./types/slices/currentUser";

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
  WITH_FILTER: (filter: Filter, page: number) =>
    "accounts/filter/options?minAge=" +
    filter.minAge +
    "&maxAge=" +
    filter.maxAge +
    "&minTag=" +
    filter.minTagMatch +
    "&maxTag=" +
    filter.maxTagMatch +
    "&page=" +
    page +
    "&orderByField=" +
    (filter.orderByField.length === 0
      ? filter.minDistance
        ? "Distance"
        : "Age"
      : filter.orderByField) +
    "&orderByAsc=" +
    filter.orderByAsc +
    (filter.minDistance !== undefined && "&minDistance=" + filter.minDistance) +
    (filter.maxDistance !== undefined && "&maxDistance=" + filter.maxDistance),
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
