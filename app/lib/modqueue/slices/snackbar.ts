import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const snackBarSlice = createSlice({
  name: "snackBar",
  initialState: {
    snackBarOpen: false,
    snackBarText: "",
  },
  reducers: {
    setSnackBarOpen(
      state,
      action: PayloadAction<boolean>,
    ) {
      state.snackBarOpen = action.payload.snackBarOpen;
    },
    setSnackBarText(
      state,
      action: PayloadAction<string>,
    ) {
      state.snackBarText = action.payload.snackBarText;
    },
  },
});

export const { setSnackBarOpen, setSnackBarText } =
  snackBarSlice.actions;
