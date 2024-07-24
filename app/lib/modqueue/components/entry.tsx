"use client";

import type { Entry } from "../model";
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
  mdiArrowULeftTop
} from "@mdi/js";
import _ from "lodash";
import { ActionButton } from "@/lib/components/action-button";
import { useAppDispatch } from "../reducers";
import * as Reducers from "../reducers";

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
      <Box display="flex" flexDirection="column" gap={1} flexGrow={1}>
        <HeaderRenderer entry={entry} />
        <BodyRenderer entry={entry} />
        <ReportsRenderer entry={entry} />
        <PredictionsRenderer entry={entry} />
        <ActionsRenderer entry={entry} />
      </Box>
    </Box>
  );
};

const HeaderRenderer = ({ entry }: { entry: Entry }) => {
  const finalDecision = entry.state?.mod_decision;

  const subreddit = "r/changemyview";
  const decisionMarkerStyle = {
    backgroundColor: finalDecision == "approve" ? "#7474fc": "#ff6161",
    color: "white",
    textAlign: "center",
    marginLeft: "auto",
    px: 3,
    py: 1,
    fontSize: "16px",
    fontWeight: "bold",
  };
  return (
    <Box
      display="flex"
      gap={0.5}
      color="rgba(0,0,0,0.5)"
      fontSize="0.75em"
      alignItems="end"
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
      {finalDecision ? (
        <Box sx={decisionMarkerStyle}>
          {finalDecision.charAt(0).toUpperCase() + finalDecision.slice(1) + "d"}
        </Box>
      ) : null}
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
	  marginRight: 1
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
	  marginRight: 1
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
	  marginRight: 1
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
        bgcolor="#7474fc"
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
        bgcolor="#ff6161"
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

const ActionsRenderer = ({ entry }: { entry: Entry }) => {
  const dispatch = useAppDispatch();
  const togglePanelStatus = () =>
    dispatch(
      Reducers.updatePanelState({
        entry_id: entry.id,
        is_active: !entry.state?.panel?.is_active,
      })
    ).unwrap();

  const submitDecision = (decision: "approve" | "remove") =>
    dispatch(
      Reducers.submitDecision({ entry_id: entry.id, decision })
    ).unwrap();

  const wipeVote = async() => {
    dispatch(Reducers.wipeVote({entry_id: entry.id}));
  }

  const curDecision = entry?.state?.mod_decision
  //To-do: If there's a resolved case thats in panel mode, that the current user voted on, there should be a "change vote" button instead of an undo action button
  return (
    <Box display="flex" gap={1.5}>
      { !curDecision ? 
	<>
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
        </> :
        <ActionButton
          icon={<Icon path={mdiArrowULeftTop} size={0.7} />}
	  label={"Undo " + curDecision[0].toUpperCase() + curDecision.slice(1,-1) + "al"}
  	  variant="outlined"
	  onClick={wipeVote}
        />
      }
      <ActionButton
        icon={<Icon path={mdiAccountGroupOutline} size={0.7} />}
        label={entry?.state?.panel?.is_active ? "Cancel Panel" : (curDecision ? "Re-open as Panel"  : "Panel")}
        variant="outlined"
        onClick={togglePanelStatus}
        optimistic
      />
      {entry.state?.panel?.is_active && (
        <Box display="flex" alignItems="center">
          {[0, 1, 2].map((i) => {
            const decision = entry.state?.panel?.votes?.[i]?.decision;
            return (
              <Icon
                path={decision ? mdiAccount : mdiAccountOutline}
                size={1.2}
                key={i}
                color={
                  decision === "approve"
                    ? "#7474fc"
                    : decision === "remove"
                    ? "#ff6161"
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
