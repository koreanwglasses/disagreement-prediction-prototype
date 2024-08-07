import { Entry } from "../model";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const contextViewerSlice = createSlice({
  name: "contextViewer",
  initialState: {
    entry: null as Entry | null,
  },
  reducers: {
    setContextViewerEntry(state, action: PayloadAction<Entry | null>) {
      state.entry = action.payload;
    },
  },
});

export const { setContextViewerEntry } = contextViewerSlice.actions;
