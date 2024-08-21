"use client";

import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { modqueueSlice } from "./slices/modqueue";
import { contextViewerSlice } from "./slices/context-viewer";
import { modalSlice } from "./slices/modal";
import { queueContainerSlice } from "./slices/queue-container";
import { snackBarSlice } from "./slices/snackbar";
import { localEntryStateSlice } from "./slices/local-entry-state";

///// Configure Store and Hooks

export const store = configureStore({
  reducer: {
    modqueue: modqueueSlice.reducer,
    contextViewer: contextViewerSlice.reducer,
    modal: modalSlice.reducer,
    queueContainer: queueContainerSlice.reducer,
    snackBar: snackBarSlice.reducer,
    localEntryState: localEntryStateSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
