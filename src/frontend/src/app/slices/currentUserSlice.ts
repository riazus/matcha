import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserState } from "../../types/slices/currentUser";
import { api } from "../api/api";
import { deleteUser, persistUser } from "../services/localStorageService";
import { RefreshTokenResponse } from "../../types/api/accounts";

export interface CurrentUserState {
  user: UserState | null;
  access_token: string | null;
  interlocutorId: string | null;
}

const initialState: CurrentUserState = {
  user: null,
  access_token: null,
  interlocutorId: null,
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
      (state, action) => {
        if (state.user) {
          state.user.isProfileCompleted = true;
          state.user.longitude = action.payload.longitude;
          state.user.latitude = action.payload.latitude;
          state.user.tags = action.payload.tags;
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
} = currentUserSlice.actions;
