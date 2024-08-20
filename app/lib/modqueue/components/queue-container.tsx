"use client";

import { ContextViewer } from "@/lib/modqueue/components/context-viewer";
import { EntryRenderer } from "@/lib/modqueue/components/entry";
import { ToolbarRenderer } from "@/lib/modqueue/components/toolbar";
import { Box, CircularProgress, Collapse, Fade, Snackbar } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../reducers";
import { fetchEntries } from "../slices/modqueue";
import _ from "lodash";
import { useAsync, useMeasure } from "react-use";
import type { Entry } from "../model";
import { ConfirmationModal } from "./confirmation-modal";
import { Flex, FlexCol } from "@/lib/components/styled";
import * as snackBarSlice from "../slices/snackbar";
import { TransitionGroup } from "react-transition-group";
import { Virtuoso } from "react-virtuoso";

export const QueueContainer = () => {
  const dispatch = useAppDispatch();
  const context_id = useAppSelector((state) => state.modqueue.context_id);
  const user_id = useAppSelector((state) => state.modqueue.user_id);

  // Fetch entries and get status
  const status = useAsync(
    () => dispatch(fetchEntries({ context_id: context_id })).unwrap(),
    [],
  );

  // Get list of entries from global state
  const entries = useAppSelector((state) => state.modqueue.entries);
  const { completionMode, panelMode, myCasesOnly } = useAppSelector(
    (state) => state.queueContainer,
  );
  const { snackBarOpen, snackBarText } = useAppSelector(
    (state) => state.snackBar,
  );

  // Filter for just the entries to show
  const shouldShowEntry = (entry: Entry) =>
    (completionMode === "Open Cases") === _.isNil(entry.state?.mod_decision) &&
    (panelMode === "Panel/Non-Panel Cases" ||
      (panelMode === "Panel Cases Only") === !!entry.state?.panel?.is_active) &&
    (!myCasesOnly ||
      entry?.state?.panel?.votes
        ?.map((vote) => vote.user_id)
        .includes(user_id));
  const entriesToShow = entries.filter(shouldShowEntry);

  // Used for sizing the virtualized list
  const [listContainerRef, listContainerRect] = useMeasure();

  return (
    <>
      <Flex>
        <FlexCol
          style={{
            width: "75vw",
            maxWidth: "1200px",
            borderRight: 1,
            borderStyle: "solid",
            borderColor: "rgba(0,0,0,0.25)",
            paddingRight: "5px",
            height: "100vh",
          }}
        >
          <ToolbarRenderer />
          <Box sx={{ overflowY: "auto" }} ref={listContainerRef}>
            <Virtuoso
              style={{ height: listContainerRect.height }}
              totalCount={entriesToShow.length}
              itemContent={(index) => (
                <EntryRenderer entry={entriesToShow[index]} />
              )}
            />
            {status.loading && (
              <Box width="100%" textAlign="center" mt={1}>
                <CircularProgress />
              </Box>
            )}
          </Box>
        </FlexCol>
        <Box
          sx={{
            width: "40vw",
            padding: 5,
            height: "100vh",
            overflowY: "auto",
          }}
        >
          <ContextViewer />
        </Box>
      </Flex>
      <ConfirmationModal />
      <Snackbar
        open={snackBarOpen}
        message={snackBarText}
        autoHideDuration={4000}
        onClose={() =>
          dispatch(snackBarSlice.setSnackBarOpen({ snackBarOpen: false }))
        }
      />
    </>
  );
};
