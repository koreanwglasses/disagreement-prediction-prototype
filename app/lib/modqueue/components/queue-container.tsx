"use client";

import { ContextViewer } from "@/lib/modqueue/components/context-viewer";
import { EntryRenderer } from "@/lib/modqueue/components/entry";
import { ToolbarRenderer } from "@/lib/modqueue/components/toolbar";
import { ModalState, ConfirmationModal } from "@/lib/components/confirmation-modal";
import { Box, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { fetchEntries, useAppDispatch, useAppSelector } from "../reducers";
import _ from "lodash";
import { useAsync } from "react-use";
import type { Entry } from "../model"


export const QueueContainer = () => {
  const dispatch = useAppDispatch();
  const context_id = useAppSelector((state) => state.modqueue.context_id)
  // Fetch entries and get status
  const status = useAsync(() => dispatch(fetchEntries({context_id: context_id})).unwrap(), []);

  // Get list of entries from global state
  const entries = useAppSelector((state) => state.modqueue.entries);

  const completionModes = ["Needs Review", "Resolved"];
  const panelModes = ["All Cases", "Panel Cases Only", "Non-Panel Cases Only"];
  const [completionMode, setCompletionMode] = useState(completionModes[0]);
  const [panelMode, setPanelMode] = useState(panelModes[0]);
  const init_modalState = {
    open: false,
    actionDesc: "",
    body: "",
  };
  //TO-DO: Avoid prop-drilling for modal updating
  const [modalState, setModalState] = useState(init_modalState);
  const [modalAction, setModalAction] = useState( () => {() => null});
  const [contextEntry, setContextEntry] = useState(null);
  //TO-DO: Make context viewer sticky (stay at the top of the screen)
  return (
    <>
      <>
        <Box style={{display: "flex", overflow: "auto", alignItems: "flex-start"}}>
          <Box style={{
	    width: "66%",
	    maxWidth: "1000px",
            borderRight: 1,
	    borderStyle: "solid",
	    borderColor: "rgba(0,0,0,0.25)",
	    paddingRight: "5px",
	  }}>
            <ToolbarRenderer
              completionModes={completionModes}
              completionMode={completionMode}
              setCompletionMode={setCompletionMode}
              panelModes={panelModes}
              panelMode={panelMode}
              setPanelMode={setPanelMode}
            />
            <Box>
              {entries
                .filter(
                  (entry) =>
                    (completionMode === "Needs Review") ===
                      _.isNil(entry.state?.mod_decision) &&
                    (panelMode === "All Cases" ||
                      (panelMode === "Panel Cases Only") ===
                        !!entry.state?.panel?.is_active)
                )
                .map((entry) => (
                  <EntryRenderer
  	            entry={entry}
  	            key={entry.id}
     	            setModalState={setModalState}
	            setModalAction={setModalAction}
		    setContextEntry={setContextEntry}
	          />
                ))}
            </Box>
            {status.loading && (
              <Box width="100%" textAlign="center" mt={1}>
                <CircularProgress />
              </Box>
            )}
          </Box>
	  <Box
	    sx={{
		  width: "33%",
		  maxWidth: "800px",
		  padding: 5,
		  position: "sticky"

	  }}>
            <ContextViewer entry={contextEntry} setContextEntry={setContextEntry} />
	  </Box>
	</Box>
      </>
      <ConfirmationModal 
        modalState={modalState}
        setModalState={setModalState}
        actionFunction={modalAction}
      />
    </>
  );
};
