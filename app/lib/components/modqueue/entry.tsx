import { Entry } from "@/lib/models/modqueue/entries";
import { Avatar, Box } from "@mui/material";
import Icon from "@mdi/react";
import { mdiFlag } from "@mdi/js";
import _ from "lodash";

export const EntryRenderer = ({ entry }: { entry: Entry }) => {
  return (
    <Box
      sx={{
        p: 1,
        m: 1,
        border: 1,
        borderRadius: 1,
        borderColor: "rgba(0,0,0,0.25)",
        display: "flex",
        gap: 1,
      }}
    >
      <Box width="48px" flexShrink={0} />
      <Box display="flex" flexDirection="column" gap={1}>
        <HeaderRenderer entry={entry} />
        <BodyRenderer entry={entry} />
        <ReportsRenderer entry={entry} />
      </Box>
    </Box>
  );
};

const HeaderRenderer: React.FC<{
  entry: Entry;
}> = ({ entry }) => {
  const subreddit = "r/changemyview";
  const timestamp = "0 minutes ago";

  return (
    <Box
      display="flex"
      gap={0.5}
      color="rgba(0,0,0,0.5)"
      fontSize="0.75em"
      alignItems="center"
    >
      <Avatar alt={subreddit} src="/cmv.png" sx={{ width: 24, height: 24 }} />
      <span>{subreddit}</span>
      <span>·</span>
      <span>Commented by {entry.author_name}</span>
      {entry.flair && (
        <Box bgcolor="#cfcfcf" borderRadius={1} px={0.5} fontWeight="bold">
          {entry.flair}
        </Box>
      )}
      <span>·</span>
      <span>{timestamp}</span>
    </Box>
  );
};

const BodyRenderer = ({ entry }: { entry: Entry }) => {
  return (
    <>
      <Box component="p" sx={{ opacity: 0.5 }}>
        {entry.title}
      </Box>
      <Box
        component="p"
        sx={{
          px: 1,
          borderLeft: 1,
          borderLeftStyle: "dashed",
        }}
      >
        {entry.text}
      </Box>
    </>
  );
};

const ReportsRenderer = ({ entry }: { entry: Entry }) => {
  const numReports = _.sum(Object.values(entry.reports ?? {}));
  return (
    entry.reports && (
      <Box
        sx={{
          p: 1,
          bgcolor: "#ffefcc",
          display: "flex",
          borderRadius: 1,
          gap: 1,
        }}
      >
        <Icon path={mdiFlag} size={1} color="#ffc33d" className="flagIcon" />
        <Box>
          <Box component="h3" fontWeight="bold">
            {numReports} {numReports == 1 ? "Report" : "Reports"}
          </Box>
          <Box>
            {Object.entries(entry.reports).map(([rule, count], i) => (
              <Box key={i}>
                {rule} ({count})
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    )
  );
};
