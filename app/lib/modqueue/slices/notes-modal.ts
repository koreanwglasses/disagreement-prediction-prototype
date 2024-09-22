import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ReactNode } from "react";
import { NoteModel, Note } from "../model"


export interface NotesModalState {
  open: boolean;
  /**
   * Short name for the modal that is opened. Not visible
   * to the user. Used when determining which modals have
   * been disabled by the user. */
  entry_id: String;
  notes: Array<NoteModel>;
}

export const notesModalSlice = createSlice({
  name: "modal",
  initialState: {
    open: false,
    entry_id: "",
    notes: [],
  } as NotesModalState,
  reducers: {
    openNotesModal(
      state,
      action: PayloadAction< Pick< NotesModalState, "open" | "entry_id" | "notes" > >,
    ) {
      state.open = true;
      state.entry_id = action.payload.entry_id;
      state.notes = action.payload.notes;
    },
    closeNotesModal(state) {
      state.open = false;
    },
    addNoteText(state, action: PayloadAction<{ author: string, body: string }>) {
      state.notes = state.notes.concat(action.payload)
    }
  },
});

export const { openNotesModal, closeNotesModal, addNoteText} =
  notesModalSlice.actions;
