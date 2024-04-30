import { Entry } from "@/lib/models/modqueue/entries";
import { Box } from "@mui/material";

export const EntryRenderer = ({ entry }: { entry: Entry }) => {
  return (
    <Box
      sx={{
        border: 1,
        borderRadius: 1,
      }}
    >
      <Box component="p" sx={{ opacity: 0.6 }}>{entry.title}</Box>
      <Box component="p">{entry.text}</Box>
    </Box>
  );
};
