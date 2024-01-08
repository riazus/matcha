import { isRejectedWithValue } from "@reduxjs/toolkit";
import type { MiddlewareAPI, Middleware } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export const rtkQueryErrorMiddleware: Middleware =
  (api: MiddlewareAPI) => (next) => async (action) => {
    if (isRejectedWithValue(action)) {
      // TODO: Global handler for errors from RTK Q

      let message = "";

      if (action.payload.status) {
        message += `${action.payload.status}`;
      }

      if (action.payload.error) {
        message += `: ${action.payload.error}`;
      } else if (action.payload.data) {
        if (action.payload.data.message) {
          message += `: ${action.payload.data.message}`;
        }
      }

      toast.error(message);
    }

    return next(action);
  };
