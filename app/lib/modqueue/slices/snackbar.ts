import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const snackBarSlice = createSlice({
  name: "snackBar",
  initialState: {
    snackBarOpen: false,
    snackBarText: "",
  },
  reducers: {
    setSnackBarOpen(state, action: PayloadAction<{ snackBarOpen: boolean }>) {
      state.snackBarOpen = action.payload.snackBarOpen;
    },
    setSnackBarText(state, action: PayloadAction<{ snackBarText: string }>) {
      state.snackBarText = action.payload.snackBarText;
    },
  },
});

export const { setSnackBarOpen, setSnackBarText } = snackBarSlice.actions;
