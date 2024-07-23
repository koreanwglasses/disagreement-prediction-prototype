"use client";

import { EntryRenderer } from "@/lib/modqueue/components/entry";
import { ToolbarRenderer } from "@/lib/modqueue/components/toolbar";
import { Box } from "@mui/material";
import { useState } from "react";
import { Entry } from "../model";

export const QueueContainer = ({ entries }: { entries: Entry[] }) => {

  const completionModes = ["Needs Review", "Resolved"];
  const panelModes = ["All Cases", "Panel Cases Only", "Non-Panel Cases Only"]
  const [completionMode, setCompletionMode] = useState(completionModes[0]);
  const [panelMode, setPanelMode] = useState(panelModes[0])

  return (
    <Box style={{width: "66%"}}>
      <ToolbarRenderer
        completionModes={completionModes}
        completionMode={completionMode}
        setCompletionMode={setCompletionMode}
	panelModes={panelModes}
	panelMode={panelMode}
	setPanelMode={setPanelMode}
      />
      <Box>
        {entries.map((entry, i) => (
            <EntryRenderer 
	      entry={entry}
	      key={i}
	      listId={i}
	      panelMode={panelMode}
	      completionMode={completionMode}
	    />
	))}
      </Box>
    </Box>
  );
};

