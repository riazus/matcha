import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface Filter {
  maxAge: number;
  minAge: number;
  maxDistance: number | undefined;
  minDistance: number | undefined;
  minTagMatch: number;
  maxTagMatch: number;
  orderByField: string;
  orderByAsc: boolean;
}

const defaultFilter: Filter = {
  maxAge: 100,
  minAge: 18,
  maxDistance: 13588, // https://en.wikipedia.org/wiki/Extremes_on_Earth#Along_any_geodesic
  minDistance: 0,
  minTagMatch: 0,
  maxTagMatch: 5,
  orderByField: "",
  orderByAsc: true,
};

export const filterSlice = createSlice({
  name: "filter",
  initialState: defaultFilter,
  reducers: {
    applyFilter: (state, action: PayloadAction<Filter>) => {
      Object.assign(state, action.payload);
    },
    resetFilter: () => defaultFilter,
  },
});

export default filterSlice.reducer;

export const { applyFilter, resetFilter } = filterSlice.actions;
