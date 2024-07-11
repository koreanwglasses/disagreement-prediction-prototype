"use client";

import { EntryRenderer } from "@/lib/modqueue/components/entry";
import { ToolbarRenderer } from "@/lib/modqueue/components/toolbar";
import { Box } from "@mui/material";
import { useState } from "react";
import { Entry } from "../model";

export const QueueContainer = ({ entries }: { entries: Entry[] }) => {
  const modes = ["Needs Review", "Resolved"];
  const [activeMode, setActiveMode] = useState(modes[0]);
  return (
    <>
      <ToolbarRenderer
        activeMode={activeMode}
        setActiveMode={setActiveMode}
        modes={modes}
      />
      <Box>
        {entries.map((entry, i) => (
          <EntryRenderer entry={entry} key={i} />
        ))}
      </Box>
    </>
  );
};
