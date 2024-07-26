"use client";

import {
  PayloadAction,
  configureStore,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import { Entry, EntryState } from "./model";
import * as Model from "./model";
import { useDispatch, useSelector } from "react-redux";

///// Define async actions

export const fetchEntries = createAsyncThunk(
  "entries/fetchEntries",
  (args: Parameters<typeof Model.fetchEntries>[0]) => Model.fetchEntries(args)
);

export const updatePanelState = createAsyncThunk(
  "entries/updatePanelState",
  (args: Parameters<typeof Model.updatePanelState>[0]) => 
    Model.updatePanelState(args)
);

export const submitDecision = createAsyncThunk(
  "entries/submitDecision",
  (args: Parameters<typeof Model.submitDecision>[0]) =>
    Model.submitDecision(args)
);

export const wipeVote = createAsyncThunk(
  "entries/wipeVote",
  (args: Parameters<typeof Model.wipeVote>[0]) =>
    Model.wipeVote(args)
);

///// Create slice

  //user_id: "XXXXX",
  //context_id: "XXXXX",
const initialState = {
  entries: [] as Entry[]
};

type State = typeof initialState;

const updateEntryStateReducer = (
  state: State,
  action: PayloadAction<EntryState | null>
) => {
  if (action.payload) {
    const i = state.entries.findIndex(
      (entry) => entry.id === action.payload!.entry_id
    );
    state.entries[i].state = action.payload;
  }
};

export const modqueueSlice = createSlice({
  name: "modqueue",
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(fetchEntries.fulfilled, (state, action) => {
        state.entries = action.payload;
      })
      // TODO: Add Optimistic Updates
      .addCase(updatePanelState.fulfilled, updateEntryStateReducer)
      .addCase(submitDecision.fulfilled, updateEntryStateReducer)
      .addCase(wipeVote.fulfilled, updateEntryStateReducer),
});

///// Configure Store and Hooks

export const store = configureStore({
  reducer: {
    modqueue: modqueueSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
