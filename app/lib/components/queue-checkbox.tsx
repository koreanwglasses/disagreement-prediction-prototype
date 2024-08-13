import React, { ReactNode } from "react";
import {
  Box, Checkbox, FormControlLabel
} from "@mui/material";

export const QueueCheckbox = ({
  label,
  isChecked,
  toggleMode 
}: {
  label: string,
  isChecked: boolean,
  toggleMode: () => void
}) => {
  return (
    <FormControlLabel 
      control={<Checkbox onChange={toggleMode} checked={isChecked}/>}
      label={label}
      disableTypography={true}
      sx={{ fontSize: 20, fontWeight: "Bold" }}
    />
  );
};

