"use client";

import { Box } from "@mui/material";
import _ from "lodash";
import { QueueTabs } from "@/lib/components/queue-tab";
import { QueueDropdown } from "@/lib/components/queue-dropdown";
import { useAppDispatch, useAppSelector } from "../reducers";
import {
  completionModes,
  panelModes,
  setCompletionMode,
  setPanelMode,
} from "../slices/queue-container";

export const ToolbarRenderer = () => {
  const dispatch = useAppDispatch();
  const { completionMode, panelMode } = useAppSelector(
    (state) => state.queueContainer,
  );

  return (
    <Box display="flex" flexDirection="column">
      <Box sx={{ fontSize: 30, fontWeight: "semi-bold" }}>Mod Queue</Box>
      <Box display="flex" flexDirection="row" sx={{ gap: 10 }}>
        <QueueTabs
          modes={completionModes}
          activeMode={completionMode}
          setActiveMode={(mode) => dispatch(setCompletionMode(mode))}
        />
        <QueueDropdown
          modes={panelModes}
          activeMode={panelMode}
          setActiveMode={(mode) => dispatch(setPanelMode(mode))}
        />
      </Box>
    </Box>
  );
};
