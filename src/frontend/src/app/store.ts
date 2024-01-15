import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { api } from "./api/api";
import currentUserReducer from "./slices/currentUserSlice";
import filterReducer from "./slices/filter";
import { rtkQueryErrorMiddleware } from "./middlewares/rtkQueryErrorMiddleware";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    user: currentUserReducer,
    filter: filterReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([api.middleware, rtkQueryErrorMiddleware]),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
