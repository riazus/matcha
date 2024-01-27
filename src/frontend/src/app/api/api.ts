import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import {
  ACCOUNT_ROUTES,
  API_BASE_URL,
  ChatEvent,
  MESSAGE_ROUTES,
  NOTIFICATION_ROUTES,
  NotificationEvent,
} from "../../config";
import {
  GenericResponse,
  RegisterBody,
  LoginBody,
  RefreshTokenResponse,
  ForgotPasswordBody,
  ResetPasswordBody,
  VerifyEmailBody,
  CompleteProfileBody,
  convertCompleteProfileBodyToFormData,
  AccountsResponse,
  AccountResponse,
  CompleteProfileResponse,
  Pictures,
  SettingsDataResponse,
  UpdateProfileSettings,
  UpdatePasswordBody,
  ChangeProfilePictureResponse,
  Location,
} from "../../types/api/accounts";
import { RootState } from "../store";
import { Mutex } from "async-mutex";
import { loggedOut, setCurrentUserState } from "../slices/currentUserSlice";
import { MessageRequest, MessageDataResponse } from "../../types/api/message";
import { NotificationsResponse } from "../../types/api/notification";
import { getNotificationConnection } from "../../sockets/notificationConnection";
import { getChatConnection } from "../../sockets/chatConnection";
import { Filter } from "../../types/slices/currentUser";

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).user.access_token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
  credentials: "include",
});

const mutex = new Mutex();
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);

  if (
    result.error &&
    result.error.status === 401 &&
    (args as FetchArgs).url != ACCOUNT_ROUTES.REFRESH
  ) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const { data } = await baseQuery(
          { url: ACCOUNT_ROUTES.REFRESH, method: "POST" },
          api,
          extraOptions
        );
        if (data) {
          api.dispatch(setCurrentUserState(data as RefreshTokenResponse));
          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(loggedOut());
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const api = createApi({
  baseQuery: baseQueryWithReauth,
  // TODO: separate endpoints for more readability
  endpoints: (builder) => ({
    register: builder.mutation<GenericResponse, RegisterBody>({
      query: (body) => ({
        url: ACCOUNT_ROUTES.REGISTER,
        method: "POST",
        body: body,
      }),
    }),
    login: builder.mutation<RefreshTokenResponse, LoginBody>({
      query: (body) => ({
        url: ACCOUNT_ROUTES.LOGIN,
        method: "POST",
        body: body,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({ url: ACCOUNT_ROUTES.LOGOUT, method: "POST" }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        setTimeout(() => dispatch(api.util.resetApiState()), 1000);
      },
    }),
    refreshToken: builder.query<RefreshTokenResponse, void>({
      query: () => ({ url: ACCOUNT_ROUTES.REFRESH, method: "POST" }),
    }),
    forgotPassword: builder.mutation<GenericResponse, ForgotPasswordBody>({
      query: (body) => ({
        url: ACCOUNT_ROUTES.FORGOT_PASSWORD,
        method: "POST",
        body: body,
      }),
    }),
    resetPassword: builder.mutation<GenericResponse, ResetPasswordBody>({
      query: (body) => ({
        url: ACCOUNT_ROUTES.RESET_PASSWORD,
        method: "POST",
        body: body,
      }),
    }),
    verifyEmail: builder.query<GenericResponse, VerifyEmailBody>({
      query: (body) => ({
        url: ACCOUNT_ROUTES.VERIFY_EMAIL,
        method: "POST",
        body: body,
      }),
    }),
    completeProfile: builder.mutation<
      CompleteProfileResponse,
      CompleteProfileBody
    >({
      query(body) {
        const bodyFormData = convertCompleteProfileBodyToFormData(body);

        return {
          url: ACCOUNT_ROUTES.COMPLETE_PROFILE,
          method: "PATCH",
          body: bodyFormData,
          formData: true,
        };
      },
    }),
    getChatMessages: builder.query<MessageDataResponse, MessageRequest>({
      query: (options) => ({
        url: MESSAGE_ROUTES.GET_MESSAGES(options),
        method: "GET",
      }),
      async onCacheEntryAdded(
        _,
        { cacheDataLoaded, cacheEntryRemoved, updateCachedData }
      ) {
        try {
          await cacheDataLoaded;

          // TODO: this is wrong!!! Need to replace this query in the another file
          const connection = getChatConnection();

          connection?.on(
            ChatEvent.NewMessage,
            (username: string, text: string, date: string) => {
              updateCachedData((draft) => {
                draft.messages.push({ username, text, date });
              });
            }
          );

          connection?.on(ChatEvent.DeleteMessages, () => {
            updateCachedData((draft) => {
              draft.messages.splice(0, draft.messages.length);
            });
          });

          await cacheEntryRemoved;

          connection?.off(ChatEvent.NewMessage);
          connection?.off(ChatEvent.DeleteMessages);
        } catch (err) {
          console.error(err);
        }
      },
    }),
    getFavoriteProfiles: builder.query<AccountsResponse[], void>({
      query: () => ({ url: ACCOUNT_ROUTES.FAVORITES }),
    }),
    setLike: builder.mutation<void, string>({
      query: (id) => ({ url: ACCOUNT_ROUTES.LIKE(id), method: "POST" }),
    }),
    removeLike: builder.mutation<void, string>({
      query: (id) => ({ url: ACCOUNT_ROUTES.DISLIKE(id), method: "POST" }),
    }),
    getViewedProfiles: builder.query<AccountsResponse[], void>({
      query: () => ({ url: ACCOUNT_ROUTES.MY_VIEWS }),
    }),
    getProfileMeViewed: builder.query<AccountsResponse[], void>({
      query: () => ({ url: ACCOUNT_ROUTES.VIEWED_ME }),
    }),
    getUserById: builder.query<AccountResponse, string>({
      query: (id) => ({ url: ACCOUNT_ROUTES.USER_BY_ID(id) }),
      async onCacheEntryAdded(
        _,
        { cacheDataLoaded, cacheEntryRemoved, updateCachedData }
      ) {
        try {
          await cacheDataLoaded;

          // TODO: this is wrong!!! Need to replace this query in the another file
          const connection = getNotificationConnection();

          connection?.on(NotificationEvent.LikeProfile, () => {
            updateCachedData((draft) => ({ ...draft, isLiked: true }));
          });

          connection?.on(NotificationEvent.DislikeProfile, () => {
            updateCachedData((draft) => ({ ...draft, isLiked: false }));
          });

          connection?.on(NotificationEvent.ProfilesMatched, () => {
            updateCachedData((draft) => ({
              ...draft,
              isProfilesMatched: true,
            }));
          });

          connection?.on(NotificationEvent.ProfilesUnmatched, () => {
            updateCachedData((draft) => ({
              ...draft,
              isProfilesMatched: false,
            }));
          });

          await cacheEntryRemoved;

          connection?.off(NotificationEvent.LikeProfile);
          connection?.off(NotificationEvent.DislikeProfile);
          connection?.off(NotificationEvent.ProfilesMatched);
          connection?.off(NotificationEvent.ProfilesUnmatched);
        } catch (err) {
          console.error(err);
        }
      },
    }),
    getPictures: builder.query<Pictures, void>({
      query: () => ({ url: ACCOUNT_ROUTES.PICTURES }),
    }),
    uploadPicture: builder.mutation<{ pictureUrl: string }, File>({
      query(file) {
        const formData = new FormData();
        formData.append("picture", file as File);

        return {
          url: ACCOUNT_ROUTES.PICTURES,
          method: "PATCH",
          body: formData,
          formData: true,
        };
      },
    }),
    deletePicture: builder.mutation<void, string>({
      query: (id) => ({
        url: ACCOUNT_ROUTES.DELETE_PICTURE(id),
        method: "DELETE",
      }),
    }),
    getUsers: builder.query<AccountsResponse[], void>({
      query: () => ({ url: ACCOUNT_ROUTES.USERS }),
    }),
    getNotificationsCount: builder.query<number, void>({
      query: () => ({ url: NOTIFICATION_ROUTES.NOTIFICATIONS_COUNT }),
      async onCacheEntryAdded(
        _,
        { cacheDataLoaded, cacheEntryRemoved, updateCachedData }
      ) {
        try {
          await cacheDataLoaded;

          // TODO: this is wrong!!! Need to replace this query in the another file
          const connection = getNotificationConnection();

          connection?.on(NotificationEvent.IncreaseNotificationsCount, () => {
            updateCachedData((draft) => draft + 1);
          });

          connection?.on(NotificationEvent.ReduceNotificationsCount, () => {
            updateCachedData((draft) => draft - 1);
          });

          await cacheEntryRemoved;

          connection?.off(NotificationEvent.IncreaseNotificationsCount);
          connection?.off(NotificationEvent.ReduceNotificationsCount);
        } catch (err) {
          console.error(err);
        }
      },
    }),
    getNotifications: builder.query<NotificationsResponse[], void>({
      query: () => ({ url: NOTIFICATION_ROUTES.NOTIFICATIONS }),
      async onCacheEntryAdded(
        _,
        { cacheDataLoaded, cacheEntryRemoved, updateCachedData }
      ) {
        try {
          await cacheDataLoaded;

          // TODO: this is wrong!!! Need to replace this query in the another file
          const connection = getNotificationConnection();

          connection?.on(
            NotificationEvent.AddNotification,
            (notificationId: string, text: string, date: string) => {
              updateCachedData((draft) => {
                draft.push({ id: notificationId, date, text });
              });
            }
          );

          connection?.on(
            NotificationEvent.DeleteNotification,
            (notificationId: string) => {
              updateCachedData((draft) => {
                const ind = draft.findIndex((d) => d.id === notificationId);
                draft.splice(ind, 1);
              });
            }
          );

          await cacheEntryRemoved;

          connection?.off(NotificationEvent.AddNotification);
          connection?.off(NotificationEvent.DeleteNotification);
        } catch (err) {
          console.error(err);
        }
      },
    }),
    getUsersWithFilters: builder.query<
      AccountsResponse[],
      { filter: Filter | null; page: number }
    >({
      query: ({ filter, page }) => ({
        url: ACCOUNT_ROUTES.WITH_FILTER(filter!, page),
      }),
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      merge: (currentCache, newItems, { arg }) => {
        if (arg.page === 0) {
          currentCache.splice(0, currentCache.length);
          currentCache.push(...newItems);
        } else {
          currentCache.push(...newItems);
        }
      },
      forceRefetch({ currentArg, previousArg }) {
        if (!currentArg || !previousArg) return false;

        return (
          currentArg.page !== previousArg.page ||
          JSON.stringify(currentArg.filter) !==
            JSON.stringify(previousArg.filter)
        );
      },
    }),
    getBrowsingUsersWithFilters: builder.query<
      AccountsResponse[],
      { filter: Filter | null; page: number }
    >({
      query: ({ filter, page }) => ({
        url: ACCOUNT_ROUTES.WITH_FILTER(filter!, page),
      }),
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      merge: (currentCache, newItems) => {
        currentCache.push(...newItems);
      },
      forceRefetch({ currentArg, previousArg }) {
        if (!currentArg || !previousArg) return false;

        return currentArg.page !== previousArg.page;
      },
    }),
    getSettingsData: builder.query<SettingsDataResponse, void>({
      query: () => ({ url: ACCOUNT_ROUTES.SETTINGS_DATA }),
    }),
    updateProfileSettings: builder.mutation<void, UpdateProfileSettings>({
      query: (body) => ({
        url: ACCOUNT_ROUTES.UPDATE_PROFILE,
        body,
        method: "PUT",
      }),
    }),
    updatePasswordSettings: builder.mutation<void, UpdatePasswordBody>({
      query: (body) => ({
        url: ACCOUNT_ROUTES.UPDATE_PASSWORD,
        body,
        method: "PUT",
      }),
    }),
    changeProfilePicture: builder.mutation<ChangeProfilePictureResponse, File>({
      query(file) {
        const formData = new FormData();
        formData.append("picture", file as File);

        return {
          url: ACCOUNT_ROUTES.PROFILE_PICTURE,
          method: "PATCH",
          body: formData,
          formData: true,
        };
      },
    }),
    changeLocation: builder.mutation<Location, Location>({
      query: (body) => ({
        url: ACCOUNT_ROUTES.UPDATE_LOCATION,
        body,
        method: "PATCH",
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useForgotPasswordMutation,
  useRefreshTokenQuery,
  useLogoutMutation,
  useCompleteProfileMutation,
  useResetPasswordMutation,
  useVerifyEmailQuery,
  useGetChatMessagesQuery,
  useGetUserByIdQuery,
  useGetPicturesQuery,
  useDeletePictureMutation,
  useUploadPictureMutation,
  useSetLikeMutation,
  useRemoveLikeMutation,
  useGetUsersQuery,
  useGetNotificationsCountQuery,
  useGetNotificationsQuery,
  useGetViewedProfilesQuery,
  useGetProfileMeViewedQuery,
  useGetFavoriteProfilesQuery,
  useGetUsersWithFiltersQuery,
  useGetBrowsingUsersWithFiltersQuery,
  useGetSettingsDataQuery,
  useUpdateProfileSettingsMutation,
  useUpdatePasswordSettingsMutation,
  useChangeProfilePictureMutation,
  useChangeLocationMutation,
} = api;
