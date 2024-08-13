"use client";

import { ContextViewer } from "@/lib/modqueue/components/context-viewer";
import { EntryRenderer } from "@/lib/modqueue/components/entry";
import { ToolbarRenderer } from "@/lib/modqueue/components/toolbar";
import { Box, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../reducers";
import { fetchEntries } from "../slices/modqueue";
import _ from "lodash";
import { useAsync } from "react-use";
import type { Entry } from "../model";
import { ConfirmationModal } from "./confirmation-modal";
import { Flex, FlexCol } from "@/lib/components/styled";

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
  const { completionMode, panelMode, myCasesOnly} = useAppSelector(
    (state) => state.queueContainer,
  );
  return (
    <>
      <Flex>
        <FlexCol
          style={{
            width: "66vw",
            maxWidth: "1000px",
            borderRight: 1,
            borderStyle: "solid",
            borderColor: "rgba(0,0,0,0.25)",
            paddingRight: "5px",

            height: "100vh",
          }}
        >
          <ToolbarRenderer />
          <Box sx={{ overflowY: "auto" }}>
            <Box>
              {entries
                .filter(
                  (entry) =>
                    ((completionMode === "Open Cases") ===
                      _.isNil(entry.state?.mod_decision)) &&
                    ((panelMode === "All Cases" ||
                      (panelMode === "Panel Cases Only") ===
                        !!entry.state?.panel?.is_active)) &&
		    ((!myCasesOnly) ||
		        entry?.state?.panel?.votes?.map((vote) => vote.user_id).includes(user_id)
		    )
                )
                .map((entry) => (
                  <EntryRenderer entry={entry} key={entry.id} />
                ))}
            </Box>
            {status.loading && (
              <Box width="100%" textAlign="center" mt={1}>
                <CircularProgress />
              </Box>
            )}
          </Box>
        </FlexCol>
        <Box
          sx={{
            width: "33vw",
            maxWidth: "800px",
            padding: 5,
            height: "100vh",
            overflowY: "auto",
          }}
        >
          <ContextViewer />
        </Box>
      </Flex>
      <ConfirmationModal />
    </>
  );
};
