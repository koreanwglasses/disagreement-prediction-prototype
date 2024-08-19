"use client";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Entry, EntryState } from "../model";
import * as Model from "../model";

///// Define async actions

export const fetchEntries = createAsyncThunk(
  "entries/fetchEntries",
  (args: Parameters<typeof Model.fetchEntries>[0]) => Model.fetchEntries(args),
);

export const updatePanelState = createAsyncThunk(
  "entries/updatePanelState",
  (args: Parameters<typeof Model.updatePanelState>[0]) =>
    Model.updatePanelState(args),
);

export const submitDecision = createAsyncThunk(
  "entries/submitDecision",
  (args: Parameters<typeof Model.submitDecision>[0]) =>
    Model.submitDecision(args),
);

export const wipeMyVote = createAsyncThunk(
  "entries/wipeMyVote",
  (args: Parameters<typeof Model.wipeMyVote>[0]) => Model.wipeMyVote(args),
);
export const wipeAllVotes = createAsyncThunk(
  "entries/wipeAllVotes",
  (args: Parameters<typeof Model.wipeAllVotes>[0]) => Model.wipeAllVotes(args),
);

///// Create slice

const initialState = {
  entries: [] as Entry[],
  user_id: "XXXXX",
  context_id: "YYYYY",
};
type State = typeof initialState;
const findIndexOfEntryById = (state: State, id?: string) =>
  state.entries.findIndex((entry) => entry.id === id);
const updateEntryStateReducer = (
  state: State,
  action: PayloadAction<EntryState | null>,
) => {
  if (action.payload) {
    const i = findIndexOfEntryById(state, action.payload!.entry_id);
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
      //
      .addCase(updatePanelState.pending, (state, action) => {
        // Optimistically update the state of the panel
        const { entry_id, is_active } = action.meta.arg;
        const i = findIndexOfEntryById(state, action.meta.arg.entry_id);
        ((state.entries[i].state ??= { entry_id }).panel ??= {
          votes: [],
          is_active,
        }).is_active = is_active;
      })
      .addCase(updatePanelState.fulfilled, updateEntryStateReducer)
      .addCase(submitDecision.fulfilled, updateEntryStateReducer)
      .addCase(wipeMyVote.fulfilled, updateEntryStateReducer)
      .addCase(wipeAllVotes.fulfilled, updateEntryStateReducer),
});
