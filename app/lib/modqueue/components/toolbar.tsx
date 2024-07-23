"use client";

import { Box } from "@mui/material";
import _ from "lodash";
import { QueueTabs } from "@/lib/components/queue-tab";
import { QueueDropdown } from "@/lib/components/queue-dropdown";

export const ToolbarRenderer = ({
  completionModes,
  completionMode,
  setCompletionMode,
  panelModes,
  panelMode,
  setPanelMode,
}: {
  completionModes: string[];
  completionMode: string;
  setCompletionMode: (mode: string) => void;
  panelModes: string[];
  panelMode: string;
  setPanelMode: (mode: string) => void;
}) => {
  return (
    <Box display="flex" flexDirection="column">
      <Box sx={{ fontSize: 30, fontWeight: "semi-bold" }}>Mod Queue</Box>
      <Box display="flex" flexDirection="row" sx={{ gap: 10 }}>
        <QueueTabs
          modes={completionModes}
          activeMode={completionMode}
          setActiveMode={setCompletionMode}
        />
        <QueueDropdown
          modes={panelModes}
          activeMode={panelMode}
          setActiveMode={setPanelMode}
        />
      </Box>
    </Box>
  );
};
