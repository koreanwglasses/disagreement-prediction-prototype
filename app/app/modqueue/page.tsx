import { EntryRenderer } from "@/lib/modqueue/components/entry";
import { fetchEntries } from "@/lib/modqueue/actions";
import { Box } from "@mui/material";

const Modqueue = async () => {
  const entries = await fetchEntries();

  return (
    <>
      {entries.map((entry, i) => (
        <EntryRenderer entry={entry} key={i} />
      ))}
    </>
  );
};
export default Modqueue;
