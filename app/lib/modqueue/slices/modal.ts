import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ReactNode } from "react";

export interface ModalState {
  open: boolean;
  /**
   * Short name for the modal that is opened. Not visible
   * to the user. Used when determining which modals have
   * been disabled by the user. */
  name: string;
  actionDesc: string;
  body: ReactNode;
  actionFunction: () => void;
}

export const modalSlice = createSlice({
  name: "modal",
  initialState: {
    open: false,
    name: "",
    actionDesc: "",
    body: "",
    disabledModals: {},
  } as ModalState & { disabledModals: { [name: string]: boolean } },
  reducers: {
    openModal(
      state,
      action: PayloadAction<
        Pick<ModalState, "actionDesc" | "name" | "body" | "actionFunction">
      >,
    ) {
      state.name = action.payload.name;
      state.actionDesc = action.payload.actionDesc;
      state.body = action.payload.body;
      state.actionFunction = action.payload.actionFunction;

      if (!state.disabledModals[state.name]) state.open = true;
    },
    closeModal(state) {
      state.open = false;
    },
    setModalPreferences(
      state,
      action: PayloadAction<{ name: string; disable: boolean }>,
    ) {
      const { name, disable } = action.payload;
      state.disabledModals[name] = disable;
    },
  },
});

export const { openModal, closeModal, setModalPreferences } =
  modalSlice.actions;
