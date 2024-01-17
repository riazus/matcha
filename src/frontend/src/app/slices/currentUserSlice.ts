import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Filter, UserState } from "../../types/slices/currentUser";
import { api } from "../api/api";
import { deleteUser, persistUser } from "../services/localStorageService";
import { RefreshTokenResponse } from "../../types/api/accounts";

export interface CurrentUserState {
  user: UserState | null;
  access_token: string | null;
  interlocutorId: string | null;
  filter: Filter | null;
}

const initialState: CurrentUserState = {
  user: null,
  access_token: null,
  interlocutorId: null,
  filter: null,
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
};

export const currentUserSlice = createSlice({
  name: "currentUser",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.access_token = action.payload;
    },
    setCurrentUserState: (
      state,
      { payload }: PayloadAction<RefreshTokenResponse>
    ) => {
      if (payload) {
        state.access_token = payload.jwtToken;
        state.user = {
          id: payload.id,
          email: payload.email,
          firstName: payload.firstName,
          lastName: payload.lastName,
          username: payload.username,
          isProfileCompleted: payload.isProfileCompleted,
          latitude: payload.latitude,
          longitude: payload.longitude,
          tags: payload.tags,
        };

        if (payload.latitude && payload.longitude) {
          state.filter = {
            ...defaultFilter,
            minDistance: 0,
            maxDistance: 13588,
            orderByField: "Distance",
            maxTagMatch: payload.tags.length,
          };
        } else {
          state.filter = defaultFilter;
        }

        state.filter.maxTagMatch = payload.tags.length;

        persistUser(state.user);
      }
    },
    setInterlocuterId: (state, { payload }) => {
      state.interlocutorId = payload;
    },
    removeInterlocuterId: (state) => {
      state.interlocutorId = null;
    },
    loggedOut: () => {
      window.location.href = "/";
      deleteUser();
      return initialState;
    },
    applyFilter: (state, action: PayloadAction<Filter>) => {
      state.filter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      api.endpoints.refreshToken.matchFulfilled,
      (state, { payload }) => {
        if (payload.id) {
          state.access_token = payload.jwtToken;
          state.user = {
            id: payload.id,
            email: payload.email,
            firstName: payload.firstName,
            lastName: payload.lastName,
            username: payload.username,
            isProfileCompleted: payload.isProfileCompleted,
            latitude: payload.latitude,
            longitude: payload.longitude,
            tags: payload.tags,
          };

          if (payload.latitude && payload.longitude) {
            state.filter = {
              ...defaultFilter,
              minDistance: 0,
              maxDistance: 13588,
              orderByField: "Distance",
              maxTagMatch: payload.tags.length,
            };
          } else {
            state.filter = defaultFilter;
          }

          state.filter.maxTagMatch = payload.tags.length;

          persistUser(state.user);
        }
      }
    );
    builder.addMatcher(
      api.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        if (payload.id) {
          state.access_token = payload.jwtToken;
          state.user = {
            id: payload.id,
            email: payload.email,
            firstName: payload.firstName,
            lastName: payload.lastName,
            username: payload.username,
            isProfileCompleted: payload.isProfileCompleted,
            latitude: payload.latitude,
            longitude: payload.longitude,
            tags: payload.tags,
          };

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

          state.filter.maxTagMatch = payload.tags.length;

          persistUser(state.user);
        }
      }
    );
    builder.addMatcher(api.endpoints.logout.matchFulfilled, () => {
      deleteUser();
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

          state.filter.maxTagMatch = payload.tags.length;

          persistUser(state.user);
        }
      }
    );
  },
});

export default currentUserSlice.reducer;

export const {
  setToken,
  setCurrentUserState,
  loggedOut,
  setInterlocuterId,
  removeInterlocuterId,
  applyFilter,
} = currentUserSlice.actions;
