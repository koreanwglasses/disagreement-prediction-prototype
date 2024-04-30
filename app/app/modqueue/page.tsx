import { EntryRenderer } from "@/lib/components/modqueue/entry";
import { getEntries } from "@/lib/models/modqueue/entries";

const Modqueue = async () => {
  const entries = await getEntries();

  return (
    <>
      {entries.map((entry, i) => (
        <EntryRenderer entry={entry} key={i} />
      ))}
    </>
  );
};
export default Modqueue;
