"use client";

import { EntryRenderer } from "@/lib/modqueue/components/entry";
import { ToolbarRenderer } from "@/lib/modqueue/components/toolbar";
import { Box } from "@mui/material";
import { useState } from "react";
import { Entry } from "../model";

export const QueueContainer = ({ entries }: { entries: Entry[] }) => {
  const modes = ["Needs Review", "Resolved"];
  
  const [activeMode, setActiveMode] = useState(modes[0]);
  
  const [sorting, setSorting] = useState(entries.map((entry, i) => (
          (entry?.state?.mod_decision != undefined)  ?  
            1
	  : 0
  )));
  
  return (
    <>
      <ToolbarRenderer
        modes={modes}
        activeMode={activeMode}
        setActiveMode={setActiveMode}
      />
      <Box>
        {sorting.map((val, i) => (
           ( val == 0 && activeMode == modes[0]) || (val == 1 && activeMode == modes[1] ) ?  
            (<EntryRenderer 
	      entry={entries[i]}
	      key={i}
	      listId={i}
	      sorting={sorting}
	      setSorting={setSorting}
	    />) 
	  : null
        ))}
      </Box>
    </>
  );
};
