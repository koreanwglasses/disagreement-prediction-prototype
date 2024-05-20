import React from "react";
import { Box, ButtonBase, ButtonBaseProps } from "@mui/material";

export const ActionButton = ({
  icon,
  label,
  variant = "outlined",
  sx = [],
  ...props
}: {
  icon: React.ReactNode;
  label: React.ReactNode;
  variant?: "filled" | "outlined";
} & ButtonBaseProps) => {
  const variantStyle = {
    filled: {
      bgcolor: "#0079d3",
      color: "#fff",
    },
    outlined: {
      border: 1.5,
      borderColor: "rgba(0,0,0,0.5)",
    },
  }[variant];

  return (
    <ButtonBase
      sx={[
        {
          py: 0.8,
          px: 2.5,
          borderRadius: 5,
          display: "flex",
          gap: 1,
        },
        variantStyle,
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...props}
    >
      {icon}
      <Box fontWeight="bold" fontSize=".85em">
        {label}
      </Box>
    </ButtonBase>
  );
};
