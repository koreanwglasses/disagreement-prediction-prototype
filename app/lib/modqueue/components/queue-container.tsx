"use client";

import { EntryRenderer } from "@/lib/modqueue/components/entry";
import { ToolbarRenderer } from "@/lib/modqueue/components/toolbar";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { fetchEntries, useAppDispatch, useAppSelector } from "../reducers";
import _ from "lodash";

export const QueueContainer = () => {
  const dispatch = useAppDispatch();
  const entries = useAppSelector((state) => state.modqueue.entries);

  useEffect(() => {
    dispatch(fetchEntries({}));
  }, []);

  const completionModes = ["Needs Review", "Resolved"];
  const panelModes = ["All Cases", "Panel Cases Only", "Non-Panel Cases Only"];
  const [completionMode, setCompletionMode] = useState(completionModes[0]);
  const [panelMode, setPanelMode] = useState(panelModes[0]);

  return (
    <Box style={{ width: "66%" }}>
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
            <EntryRenderer entry={entry} key={entry.id} />
          ))}
      </Box>
    </Box>
  );
};
