import { EntryRenderer } from "@/lib/modqueue/components/entry";
import { ToolbarRenderer } from "@/lib/modqueue/components/toolbar";
import { fetchEntries } from "@/lib/modqueue/actions";
import { Box } from "@mui/material";

const Modqueue = async () => {
  const entries = await fetchEntries();
  return (
    <>	  
      <ToolbarRenderer/>
      <Box>
        {entries.map((entry, i) => (
          <EntryRenderer entry={entry} key={i} />
        ))}
      </Box>
    </>
  );
};
export default Modqueue;
