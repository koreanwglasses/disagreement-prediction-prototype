"use client";

import type { Entry, EntryState } from "../model";
import * as Actions from "../actions";
import { Avatar, Box } from "@mui/material";
import Icon from "@mdi/react";
import {
  mdiFlag,
  mdiCheck,
  mdiClose,
  mdiAccountGroupOutline,
  mdiAccount,
  mdiAccountOutline,
  mdiAccountGroup,
} from "@mdi/js";
import _ from "lodash";
import { ActionButton } from "@/lib/components/action-button";
import { useState } from "react";
  
const checkIsVisible = (entryState, panelMode, completionMode) => {
    return ((entryState?.mod_decision == undefined) == (completionMode == "Needs Review")) && 
	      ((Boolean(entryState?.panel?.is_active) == (panelMode == "Panel Cases Only")) ||
	       (panelMode == "All Cases"))
}

export const EntryRenderer = ({
  entry,
  listId,
  panelMode,
  completionMode
}: {
  entry: Entry,
  listId: Number,
  panelMode: React.ReactNode,
  completionMode: React.ReactNode
}) => {
  const [entryState, setEntryState] = useState<EntryState | null | undefined>(
    entry.state
  );
  console.log(entryState)
  return (
    checkIsVisible(entryState, panelMode, completionMode) ?
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
        <Box display="flex" flexDirection="column" gap={1} flexGrow={1}>
          <HeaderRenderer entry={entry} />
          <BodyRenderer entry={entry} />
          <ReportsRenderer entry={entry} />
          <PredictionsRenderer entry={entry} />
          <ActionsRenderer 
	    entry={entry}
  	    listId={listId}
	    panelMode={panelMode}
	    entryState={entryState}
	    setEntryState={setEntryState}
	  />
        </Box>
    </Box>
    : null
  );
};

const HeaderRenderer = ({ entry }: { entry: Entry }) => {
  const subreddit = "r/changemyview";

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
        <Icon
          path={mdiFlag}
          size={1}
          color="#ffc33d"
          className="flagIcon"
          style={{ flexShrink: 0 }}
        />
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

const PredictionsRenderer = ({ entry }: { entry: Entry }) => {
  return (
    entry.panel_predictions && (
      <Box
        sx={{
          p: 1,
          bgcolor: "#ffefcc",
          display: "flex",
          borderRadius: 1,
          gap: 1,
        }}
      >
        <Icon
          path={mdiAccountGroup}
          size={1}
          color="#ffc33d"
          className="flagIcon"
          style={{ flexShrink: 0 }}
        />
        <Box>
          <Box component="h3" fontWeight="bold">
            Predicted Panel
          </Box>
          <PredictionScoresVisualization scores={entry.panel_predictions} />
          Our model thinks{" "}
          <strong>
            {(entry.panel_predictions.approve * 100).toFixed(0)}%
          </strong>{" "}
          of moderators on your mod team would support approval, and{" "}
          <strong>{(entry.panel_predictions.remove * 100).toFixed(0)}%</strong>{" "}
          of moderators would support removal. We are unsure how{" "}
          <strong>{(entry.panel_predictions.unsure * 100).toFixed(0)}%</strong>{" "}
          of moderators would act. Because consensus for this case is low, we
          recommend panel review. How are these predictions generated?
        </Box>
      </Box>
    )
  );
};

const PredictionScoresVisualization = ({
  scores,
}: {
  scores: { approve: number; remove: number; unsure: number };
}) => {
  /** Shorthand for scores as percentages */
  const s = [scores.approve * 100, scores.unsure * 100, scores.remove * 100];
  const maxWidth = "600px";
  const totalHeight = "40px";
  const barHeight = "6px";
  const barOffsetBottom = "6px";
  const tickWidth = "1.5px";
  const tickHeight = "18px";
  const labelOffsetBottom = "16px";
  const labelFontSize = "11px";
  return (
    <Box sx={{ transform: "translate(0,0)", height: totalHeight, maxWidth }}>
      {/* Bars */}
      <Box
        position="absolute"
        left="0"
        bottom={barOffsetBottom}
        width={`${s[0]}%`}
        height={barHeight}
        bgcolor="#00f"
      />
      <Box
        position="absolute"
        left={`${s[0]}%`}
        bottom={barOffsetBottom}
        width={`${s[1]}%`}
        height={barHeight}
        bgcolor="#888"
      />
      <Box
        position="absolute"
        left={`${s[0] + s[1]}%`}
        bottom={barOffsetBottom}
        width={`${s[2]}%`}
        height={barHeight}
        bgcolor="#f00"
      />

      {/* Ticks */}
      <Box
        position="absolute"
        left={`${s[0]}%`}
        bottom="0"
        height={tickHeight}
        borderRight={`solid ${tickWidth}`}
      />
      <Box
        position="absolute"
        left={`${s[0] + s[1]}%`}
        bottom="0"
        height={tickHeight}
        borderRight={`solid ${tickWidth}`}
      />

      {/* Labels */}
      <Box
        position="absolute"
        left="0"
        bottom={labelOffsetBottom}
        width={`${s[0]}%`}
        fontSize={labelFontSize}
        textAlign="center"
      >
        {s[0].toFixed(0)}% Approve
      </Box>
      <Box
        position="absolute"
        left={`${s[0]}%`}
        bottom={labelOffsetBottom}
        width={`${s[1]}%`}
        fontSize={labelFontSize}
        textAlign="center"
      >
        {s[1].toFixed(0)}% Unsure
      </Box>
      <Box
        position="absolute"
        left={`${s[0] + s[1]}%`}
        bottom={labelOffsetBottom}
        width={`${s[2]}%`}
        fontSize={labelFontSize}
        textAlign="center"
      >
        {s[2].toFixed(0)}% Remove
      </Box>
    </Box>
  );
};

const ActionsRenderer = ({
  entry,
  listId,
  panelMode,
  completionMode,
  entryState,
  setEntryState
}: {
  entry: Entry,
  listId: Number,
  panelMode: React.ReactNode,
  completionMode: React.ReactNode,
  entryState: EntryState | null | undefined,
  setEntryState: (entryState: EntryState | null | undefined) => void, 
}) => {
  const togglePanelStatus = async () => {
    setEntryState(await Actions.updatePanelStatus(entry.id, !entryState?.panel?.is_active));
  };

  const submitDecision = async (decision: "approve" | "remove") => {
    setEntryState(await Actions.submitDecision(entry.id, decision));
  };
  return (
    <Box display="flex" gap={1.5}>
      <ActionButton
        icon={<Icon path={mdiCheck} size={0.7} />}
        label="Approve"
        variant="filled"
        onClick={() => submitDecision("approve")}
      />
      <ActionButton
        icon={<Icon path={mdiClose} size={0.7} />}
        label="Remove"
        variant="outlined"
        onClick={() => submitDecision("remove")}
      />
      <ActionButton
        icon={<Icon path={mdiAccountGroupOutline} size={0.7} />}
        label={entryState?.panel?.is_active ? "Cancel Panel" : "Panel"}
        variant="outlined"
        onClick={togglePanelStatus}
      />
      {entryState?.panel?.is_active && (
        <Box display="flex" alignItems="center">
          {[0, 1, 2].map((i) => {
            const decision = entryState?.panel?.votes?.[i]?.decision;
            return (
              <Icon
                path={decision ? mdiAccount : mdiAccountOutline}
                size={1.2}
                key={i}
                color={
                  decision === "approve"
                    ? "#f00"
                    : decision === "remove"
                    ? "#00f"
                    : "#888"
                }
              />
            );
          })}
        </Box>
      )}
    </Box>
  );
};
