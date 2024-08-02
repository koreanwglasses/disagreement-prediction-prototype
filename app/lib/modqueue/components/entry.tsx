"use client";

import type { Entry } from "../model";
import {
  Avatar,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from "@mui/material";
import Icon from "@mdi/react";
import {
  mdiFlag,
  mdiCheck,
  mdiClose,
  mdiAccountGroupOutline,
  mdiAccount,
  mdiAccountOutline,
  mdiAccountGroup,
  mdiArrowULeftTop,
  mdiChevronDown
} from "@mdi/js";
import _ from "lodash";
import { ActionButton } from "@/lib/components/action-button";
import { ModalState } from "@/lib/components/confirmation-modal";
import { useAppDispatch, useAppSelector } from "../reducers";
import * as Reducers from "../reducers";

export const EntryRenderer = ({
  entry,
  setModalState,
  setModalAction
}: {
  entry: Entry,
  setModalState: (modalState: ModalState) => void,
  setModalAction: (modalAction: () => void) => void
}) => {
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
        <ActionsRenderer
          entry={entry}
	  setModalState={setModalState}
	  setModalAction={setModalAction}
	/>
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
    borderRadius: 1,
    paddingLeft: 0.5,
    paddingRight: 1,
    fontWeight: "bold",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 0.25
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
          <Icon path={finalDecision == "remove" ? mdiClose : mdiCheck} size={0.5} />
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
      <Accordion
        sx={{
          bgcolor: "#ffefcc",
          borderRadius: 1,
	  boxShadow: "none",
        }}
      >
          <AccordionSummary
	    expandIcon={<Icon path={mdiChevronDown} size={1} aria-controls={"panel-prediction-content-" + entry.id} />}
	    sx={{borderRadius: "4px"}}>  
              <Icon
                path={mdiAccountGroup}
                size={1}
                color="#ffc33d"
                className="flagIcon"
                style={{ flexShrink: 0 }}
              />
              <Box component="h3" fontWeight="bold" paddingLeft="8px">Predicted Panel</Box>
          </AccordionSummary>  
	  <AccordionDetails sx={{width: "100%"}}>
            <PredictionScoresVisualization scores={entry.panel_predictions} />
            If every moderator on your team took a vote, our model predicts{" "}
            <strong>
              {(entry.panel_predictions.approve * 100).toFixed(0)}%
            </strong>{" "}
            would support approval, and{" "}
            <strong>{(entry.panel_predictions.remove * 100).toFixed(0)}%</strong>{" "}
            support removal. We are unsure how{" "}
            <strong>{(entry.panel_predictions.unsure * 100).toFixed(0)}%</strong>{" "}
            of moderators would act. Because consensus for this case is low, we
            recommend panel review.
          </AccordionDetails>
      </Accordion>
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
  const maxWidth = "650px";
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

const ActionsRenderer = ({
  entry,
  setModalState,
  setModalAction
}: {
  entry: Entry,
  setModalState: (modalState: ModalState) => void,
  setModalAction: (modalAction: () => void) => void
}) => {
  const dispatch = useAppDispatch();
  const user_id = useAppSelector((state) => state.modqueue.user_id)
  const context_id = useAppSelector((state) => state.modqueue.context_id)

  const togglePanelStatus = () => {
    dispatch(
      Reducers.updatePanelState({
        entry_id: entry.id,
        is_active: !entry.state?.panel?.is_active,
	user_id: user_id,
	context_id: context_id
      })
    ).unwrap();
  }

  const submitDecision = (decision: "approve" | "remove") =>
    dispatch(
      Reducers.submitDecision({
        entry_id: entry.id,
       	decision: decision,
       	context_id: context_id,
        user_id: user_id
      })
    ).unwrap();

  const wipeVote = async() => {
    dispatch(
      Reducers.wipeVote({
        entry_id: entry.id,
        user_id: user_id,
	context_id: context_id
      })
    ).unwrap();
  }
  const undoAction = async() => {
    dispatch(
      Reducers.undoAction({
        entry_id: entry.id,
        user_id: user_id,
	context_id: context_id
      })
    ).unwrap();
  }
  const userInVote = ( entry?.state?.panel?.votes &&
		       (entry.state.panel.votes.some( (elem) => elem.user_id === user_id))
		     )
  const othersInVote = ( entry?.state?.panel?.votes &&
			 entry.state.panel.votes.some( (elem) => elem.user_id !== user_id  )
                       )
  const curDecision = entry?.state?.mod_decision

  const openModal = (newModalContent, newModalAction) => {
    return () => {
      setModalState(newModalContent)
      setModalAction(() => newModalAction)
    }
  }

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
        (userInVote || !entry?.state?.panel?.is_active) ? 
          <ActionButton
            icon={<Icon path={mdiArrowULeftTop} size={0.7} />}
  	    label={entry?.state?.panel?.is_active ? "Withdraw Vote" : 
		    "Undo " + curDecision[0].toUpperCase() + curDecision.slice(1,-1) + "al"}
  	    variant="outlined"
	    onClick={(othersInVote && !entry?.state?.panel?.is_active) ? openModal(ModalContent(entry, "wipe"), wipeVote) : wipeVote}
          /> : <></>
      }
      <ActionButton
        icon={<Icon path={mdiAccountGroupOutline} size={0.7} />}
        label={entry?.state?.panel?.is_active ? "Cancel Panel" : (curDecision ? "Re-open as Panel"  : "Panel")}
        variant="outlined"
        onClick={(othersInVote && entry?.state?.panel?.is_active) ?
	           openModal(ModalContent(entry, "cancel"), togglePanelStatus) : 
		   togglePanelStatus
	}
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

const ModalContent = (entry, action) => {
  let returnObj = {open: true, actionDesc: "", body: ""}
    if (action == "cancel") {
      returnObj.actionDesc = "cancel panel";
      returnObj.body = "Cancelling this panel will erase all existing votes, including those made by other moderators. The case will be moved back into the \"Needs Review\" queue."
      if (entry?.state?.mod_decision == "remove") { 
          returnObj.body = returnObj.body.slice(0, -1) + ", and the comment will become visible to users again."
      }
    } else if (action == "wipe") {
      console.log("hit else case")
      returnObj.actionDesc = (entry?.mod_decision === "approve" ? "undo approval": "undo removal")
      returnObj.body = "This action was taken by another moderator. Consider starting a panel instead if you disagree with their decision"      
    }
  return returnObj
}
