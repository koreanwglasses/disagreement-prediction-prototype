import React, { useState } from "react";
import {
  Box,
  ButtonBase,
  ButtonBaseProps,
  CircularProgress,
  alpha,
} from "@mui/material";

export const ActionButton = ({
  icon,
  label,
  variant = "outlined",
  optimistic = false,
  palette,
  onClick,
  sx = [],
  ...props
}: {
  icon: React.ReactNode;
  label: React.ReactNode;
  variant?: "filled" | "outlined";
  palette?: { main?: string; contrastText?: string };
  /** If true, will not show a loading icon while the action is pending */
  optimistic?: boolean;
} & ButtonBaseProps) => {
  const variantStyle = {
    filled: {
      bgcolor: palette?.main ?? "#0079d3",
      color: palette?.contrastText ?? "#fff",
      "&.pending": {
        bgcolor: "#ccc",
      },
    },
    outlined: {
      border: 1.5,
      borderColor: "rgba(0,0,0,0.5)",
      "&.pending": {
        opacity: "0.5",
      },
    },
  }[variant];

  const [status, setStatus] = useState<"idle" | "pending" | "error">("idle");
  return (
    <ButtonBase
      className={status}
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
      onClick={async (e) => {
        if (!optimistic) setStatus("pending");
        try {
          await onClick?.(e);
          setStatus("idle");
        } catch {
          setStatus("error");
        }
      }}
      {...props}
    >
      {status === "pending" ? (
        <CircularProgress color="inherit" size={17} />
      ) : (
        icon
      )}
      <Box fontWeight="bold" fontSize=".85em">
        {label}
      </Box>
    </ButtonBase>
  );
};
