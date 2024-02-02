import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Filter, UserState } from "../../types/slices/currentUser";
import { api } from "../api/api";
import { RefreshTokenResponse } from "../../types/api/accounts";
import { disconnectNotificationConnection } from "../../sockets/notificationConnection";
import { disconnectChatConnection } from "../../sockets/chatConnection";

export interface CurrentUserState {
  user: UserState | null;
  access_token: string | undefined;
  interlocutorId: string | undefined;
  filter: Filter | null;
  browsingPage: number | undefined;
  searchingPage: number | undefined;
  hasMoreSearchingPage: boolean | undefined;
}

interface FillFilterPayload {
  latitude: number | undefined;
  longitude: number | undefined;
  tagsLength: number;
}

const initialState: CurrentUserState = {
  user: null,
  access_token: undefined,
  interlocutorId: undefined,
  filter: null,
  browsingPage: undefined,
  searchingPage: undefined,
  hasMoreSearchingPage: undefined,
};

const defaultFilter: Filter = {
  maxAge: 100,
  minAge: 18,
  maxDistance: undefined, // | 13588, // https://en.wikipedia.org/wiki/Extremes_on_Earth#Along_any_geodesic
  minDistance: undefined,
  minTagMatch: 0,
  maxTagMatch: 5,
  orderByField: "Age",
  orderByAsc: true,
  isForBrowsing: false,
};

const fillUserData = (state: CurrentUserState, payload: UserState) => {
  state.user = {
    id: payload.id,
    email: payload.email,
    firstName: payload.firstName,
    lastName: payload.lastName,
    username: payload.username,
    isProfileCompleted: payload.isProfileCompleted,
    latitude: payload.latitude,
    longitude: payload.longitude,
    town: payload.town,
    country: payload.country,
    tags: payload.tags,
  };

  if (payload.isProfileCompleted) {
    state.browsingPage = 0;
    state.searchingPage = 0;
    state.hasMoreSearchingPage = false;

    fillFilter(state, {
      latitude: payload.latitude,
      longitude: payload.longitude,
      tagsLength: payload.tags.length,
    });
  }
};

const fillFilter = (state: CurrentUserState, payload: FillFilterPayload) => {
  if (payload.latitude && payload.longitude) {
    state.filter = {
      ...defaultFilter,
      minDistance: 0,
      maxDistance: 13588,
      orderByField: "Distance",
    };
  } else {
    state.filter = defaultFilter;
  }

  state.filter.maxTagMatch = payload.tagsLength;
};

export const currentUserSlice = createSlice({
  name: "currentUser",
  initialState,
  reducers: {
    setCurrentUserState: (
      state,
      { payload }: PayloadAction<RefreshTokenResponse>
    ) => {
      if (payload) {
        state.access_token = payload.jwtToken;
        fillUserData(state, payload);
      }
    },
    setInterlocuterId: (state, { payload }) => {
      state.interlocutorId = payload;
    },
    removeInterlocuterId: (state) => {
      state.interlocutorId = undefined;
    },
    loggedOut: () => {
      window.location.href = "/";
      disconnectNotificationConnection();
      disconnectChatConnection();
      return initialState;
    },
    applyFilter: (state, action: PayloadAction<Filter>) => {
      if (JSON.stringify(state.filter) !== JSON.stringify(action.payload)) {
        state.filter = action.payload;
        state.browsingPage = 0;
        state.searchingPage = 0;
      }
    },
    increaseBrowsingPage: (state) => {
      state.browsingPage!++;
    },
    increaseSearchingPage: (state) => {
      state.searchingPage!++;
    },
    setHasMoreSearchingPage: (state, { payload }) => {
      state.hasMoreSearchingPage = payload;
    },
    setLocation: (state, { payload }) => {
      if (state.user) {
        state.user.latitude = payload.latitude;
        state.user.longitude = payload.longitude;
        state.user.town = payload.town;
        state.user.country = payload.country;
      }
    },
    setTags: (state, { payload }) => {
      if (state.user) {
        state.user.tags = payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      api.endpoints.refreshToken.matchFulfilled,
      (state, { payload }) => {
        if (payload.id) {
          state.access_token = payload.jwtToken;
          fillUserData(state, payload);
        }
      }
    );
    builder.addMatcher(
      api.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        if (payload.id) {
          state.access_token = payload.jwtToken;
          fillUserData(state, payload);
        }
      }
    );
    builder.addMatcher(api.endpoints.logout.matchFulfilled, () => {
      disconnectNotificationConnection();
      disconnectChatConnection();
      return initialState;
    });
    builder.addMatcher(
      api.endpoints.completeProfile.matchFulfilled,
      (state, { payload }) => {
        if (state.user) {
          state.user.isProfileCompleted = true;
          state.user.longitude = payload.longitude;
          state.user.latitude = payload.latitude;
          state.user.tags = payload.tags;

          state.browsingPage = 0;
          state.searchingPage = 0;
          state.hasMoreSearchingPage = false;

          fillFilter(state, {
            latitude: payload.longitude,
            longitude: payload.longitude,
            tagsLength: payload.tags.length,
          });
        }
      }
    );
    builder.addMatcher(
      api.endpoints.getUsersWithFilters.matchFulfilled,
      (state, { payload }) => {
        state.hasMoreSearchingPage = payload.length !== 0;
      }
    );
  },
});

export default currentUserSlice.reducer;

export const {
  setCurrentUserState,
  loggedOut,
  setInterlocuterId,
  removeInterlocuterId,
  applyFilter,
  increaseBrowsingPage,
  increaseSearchingPage,
  setLocation,
  setTags,
} = currentUserSlice.actions;
