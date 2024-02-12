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
  CHANGE_PROFILE: "/accounts/change-profile",
  FAVORITES: "/accounts/favorites",
  LIKE: (id: string) => `/accounts/like/${id}`,
  DISLIKE: (id: string) => `/accounts/dislike/${id}`,
  PICTURES: "/accounts/pictures",
  DELETE_PICTURE: (id: string) => `accounts/pictures/${id}`,
  MY_VIEWS: "/accounts/my-views",
  VIEWED_ME: "/accounts/viewed-me",
  IP_ADRRESS: "/accounts/ip-address",
  USER_BY_ID: (id: string) => `/accounts/${id}`,
  USERS: "/accounts",
  SETTINGS_DATA: "/accounts/settings-data",
  UPDATE_PROFILE: "/accounts/update-profile",
  UPDATE_PASSWORD: "accounts/update-password",
  PROFILE_PICTURE: "/accounts/update-profile-picture",
  UPDATE_LOCATION: "/accounts/update-location",
  ACCOUNTS_COORDS: "/accounts/coords",
  REPORT_PROFILE: (id: string) => `/accounts/${id}`,
  CHANGE_EMAIL: "/accounts/change-email",
  VERIFY_CHANGED_EMAIL: "/accounts/verify-changed-email",
  UPDATE_NAMES: "accounts/update-names",
  WITH_FILTER: (filter: Filter, page: number) =>
    "accounts/filter/options?minAge=" +
    filter.minAge +
    "&maxAge=" +
    filter.maxAge +
    "&minTag=" +
    filter.minTagMatch +
    "&maxTag=" +
    filter.maxTagMatch +
    "&minFameRating=" +
    filter.minFameRating +
    "&maxFameRating=" +
    filter.maxFameRating +
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
    "&isForBrowsing=" +
    filter.isForBrowsing +
    (filter.minDistance !== undefined
      ? "&minDistance=" + filter.minDistance
      : "") +
    (filter.maxDistance !== undefined
      ? "&maxDistance=" + filter.maxDistance
      : ""),
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

export const SCHEDULED_EVENT_ROUTES = {
  GET_EVENTS: (id: string) => `/events/${id}`,
  CREATE: `/events`,
};

export enum NotificationEvent {
  AddNotification = "AddNotification",
  DeleteNotification = "DeleteNotification",
  IncreaseNotificationsCount = "IncreaseNotificationsCount",
  ReduceNotificationsCount = "ReduceNotificationsCount",
  ProfileView = "ProfileView",
  AddViewedProfile = "AddViewedProfile",
  AddProfileMeViewed = "AddProfileMeViewed",
  LikeProfile = "LikeProfile",
  DislikeProfile = "DislikeProfile",
  UnfavoriteProfile = "UnfavoriteProfile",
  ProfilesMatched = "ProfilesMatched",
  ProfilesUnmatched = "ProfilesUnmatched",
  NotifyMessageReceived = "NotifyMessageReceived",
  BlockProfile = "BlockProfile",
  UnblockProfile = "UnblockProfile",
  ProfileBlocked = "ProfileBlocked",
  MyProfileWasBlocked = "MyProfileWasBlocked",
  UserConnected = "UserConnected",
  UserDisconnected = "UserDisconnected",
}

export enum ChatEvent {
  NewMessage = "NewMessage",
  MessageNotValid = "MessageNotValid",
  NotifyInterlocutor = "NotifyInterlocutor",
  DeleteMessages = "DeleteMessages",
}

export const ACCESS_TOKEN = "jwtToken";
export const REFRESH_TOKEN = "refreshToken";
