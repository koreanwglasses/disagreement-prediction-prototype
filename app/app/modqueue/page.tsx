import { QueueContainer } from "@/lib/modqueue/components/queue-container";
import { EntryRenderer } from "@/lib/modqueue/components/entry";
import { ToolbarRenderer } from "@/lib/modqueue/components/toolbar";
import { fetchEntries } from "@/lib/modqueue/actions";
import { Box } from "@mui/material";

const Modqueue = async () => {
  const entries = await fetchEntries();
  return (
    <> 
      <QueueContainer entries={entries}/>  
    </>
  );
};
export default Modqueue;
