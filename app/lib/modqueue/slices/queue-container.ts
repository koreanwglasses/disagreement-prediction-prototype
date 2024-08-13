import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const completionModes = ["Open Cases", "Resolved"] as const;
export const panelModes = [
  "All Cases",
  "Panel Cases Only",
  "Non-Panel Cases Only",
] as const;

export type CompletionMode = (typeof completionModes)[number];
export type PanelMode = (typeof panelModes)[number];

export const queueContainerSlice = createSlice({
  name: "queueContainer",
  initialState: {
    completionMode: completionModes[0] as CompletionMode,
    panelMode: panelModes[0] as PanelMode,
    myCasesOnly: false,
  },
  reducers: {
    setCompletionMode(state, action: PayloadAction<CompletionMode>) {
      state.completionMode = action.payload;
    },
    setPanelMode(state, action: PayloadAction<PanelMode>) {
      state.panelMode = action.payload;
    },
    setMyCasesOnly(state, action: PayloadAction<boolean>) {
      state.myCasesOnly = action.payload;
    },
  },
});

export const { setCompletionMode, setPanelMode, setMyCasesOnly } =
  queueContainerSlice.actions;
