import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../reducers";

// For state associated with entries that is not reflected
// anywhere else. E.g., if the panel predictions are open or not.

export const localEntryStateSlice = createSlice({
  name: "localEntryState",
  initialState: {
    localStates: {} as {
      [entry_id: string]: { predictionsExpanded?: boolean } | undefined;
    },
  },
  reducers: {
    setPredictionsExpanded(
      state,
      action: PayloadAction<{ entry_id: string; expanded: boolean }>,
    ) {
      const { entry_id, expanded } = action.payload;
      (state.localStates[entry_id] ??= {}).predictionsExpanded = expanded;
    },
  },
});

export const { setPredictionsExpanded } = localEntryStateSlice.actions;

export const selectLocalEntryState = (entry_id: string) => (state: RootState) =>
  state.localEntryState.localStates[entry_id];
