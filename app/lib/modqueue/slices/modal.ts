import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface ModalState {
  open: boolean;
  actionDesc: string;
  body: string;
  actionFunction: () => void;
}

export const modalSlice = createSlice({
  name: "modal",
  initialState: { open: false, actionDesc: "", body: "" } as ModalState,
  reducers: {
    openModal(
      state,
      action: PayloadAction<
        Pick<ModalState, "actionDesc" | "body" | "actionFunction">
      >,
    ) {
      state.open = true;
      state.actionDesc = action.payload.actionDesc;
      state.body = action.payload.body;
      state.actionFunction = action.payload.actionFunction;
    },
    closeModal(state) {
      state.open = false;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
