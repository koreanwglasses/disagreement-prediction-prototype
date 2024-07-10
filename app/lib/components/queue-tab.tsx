import React from "react";
import { Box, ToggleButtonGroup, ToggleButtonGroupProps, ToggleButton, ButtonBaseProps } from "@mui/material";

export const QueueTabs = ({
  modes,
  activeMode,
  setActiveMode,
  sx = [],
  ...props
}: {
  modes: React.ReactNode[],
  activeMode: React.ReactNode,
  setActiveMode: (event: React.FormEvent<HTMLButtonElement>, newState: React.ReactNode) => void;
} & ToggleButtonGroupProps) => {
  const handleChange = (event, newState) =>  {
    if (newState != null) {
    setActiveMode(newState)
  };
};
  return (
      <ToggleButtonGroup 
        size="Large" 
	sx={{gap: 10}}
       	exclusive
       	value={activeMode}
       	onChange = {handleChange}
      >
        { modes.map( (mode) => {
	  return (
	    <QueueTab mode={mode}/>
	  );
	})}
      </ToggleButtonGroup>
  );
};


const QueueTab = ({
  mode,
  sx = [],
  ...props
}: {
  mode: React.ReactNode;
} & ButtonBaseProps) => {
  return (
      <ToggleButton disableRipple
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
	    '&:hover': {
                backgroundColor: 'C9D7DE'
	    },
	    '&:selected': {
	        backgroundColor: '333D42'
	    },
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...props}>
	  {mode}
     </ToggleButton>
  );
};

