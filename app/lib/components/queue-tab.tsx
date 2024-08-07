import React, { ReactNode } from "react";
import {
  Box,
  ToggleButtonGroup,
  ToggleButtonGroupProps,
  ToggleButton,
  ButtonBaseProps,
} from "@mui/material";

export const QueueTabs = ({
  modes,
  activeMode,
  setActiveMode,
}: {
  modes: string[];
  activeMode: string;
  setActiveMode: (mode: string) => void;
} & ToggleButtonGroupProps) => {
  return (
    <ToggleButtonGroup
      size="large"
      sx={{ gap: 10 }}
      exclusive
      value={activeMode}
      onChange={(event, newMode) => {
        if (newMode != null) {
          setActiveMode(newMode);
        }
      }}
    >
      {modes.map((mode) => (
        <QueueTab mode={mode} key={mode} />
      ))}
    </ToggleButtonGroup>
  );
};

const QueueTab = ({
  mode,
}: {
  mode: string;
} & ButtonBaseProps) => {
  return (
    <ToggleButton
      disableRipple
      value={mode}
      sx={[
        {
          py: 2,
          px: 4,
          border: "0px solid",
          textTransform: "none",
          display: "flex",
          fontWeight: "bold",
          fontSize: 20,
          gap: 1,
          "&:hover": {
            backgroundColor: "C9D7DE",
          },
          "&:selected": {
            backgroundColor: "333D42",
          },
        },
      ]}
    >
      {mode}
    </ToggleButton>
  );
};
