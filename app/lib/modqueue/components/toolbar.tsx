"use client";

import { Box } from "@mui/material";
import _ from "lodash";
import { QueueTabs } from "@/lib/components/queue-tab";
import { QueueDropdown } from "@/lib/components/queue-dropdown";
import { QueueCheckbox } from "@/lib/components/queue-checkbox";
import { useAppDispatch, useAppSelector } from "../reducers";
import {
  completionModes,
  panelModes,
  setCompletionMode,
  setPanelMode,
  setMyCasesOnly,
  CompletionMode,
} from "../slices/queue-container";

export const ToolbarRenderer = () => {
  const dispatch = useAppDispatch();
  const { completionMode, panelMode, myCasesOnly } = useAppSelector(
    (state) => state.queueContainer,
  );

  const queueTabEffect = (mode: CompletionMode) => {
    dispatch(setCompletionMode(mode));
    dispatch(setMyCasesOnly(false));
  };

  return (
    <Box display="flex" flexDirection="column">
      <Box sx={{ fontSize: 30, fontWeight: "semi-bold" }}>Mod Queue</Box>
      <Box
        display="flex"
       	flexDirection="row"
       	sx={{ justifyContent: "space-between", paddingLeft: "20px", paddingRight: "20px"}}
      >
        <QueueTabs
          modes={completionModes}
          activeMode={completionMode}
          setActiveMode={queueTabEffect}
        />
	<Box display="flex" flexDirection="row" sx={{gap: 5}}>
          <QueueDropdown
            modes={panelModes}
            activeMode={panelMode}
            setActiveMode={(mode) => dispatch(setPanelMode(mode))}
          />
          <QueueCheckbox
            label="Show My Cases Only"
            isChecked={myCasesOnly}
            toggleMode={() => dispatch(setMyCasesOnly(!myCasesOnly))}
          />
	</Box>
      </Box>
    </Box>
  );
};
