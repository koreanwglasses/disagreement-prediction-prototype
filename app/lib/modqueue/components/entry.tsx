"use client";

import type { Entry } from "../model";
import { MouseEventHandler, ReactNode, useState } from "react";
import {
  Avatar,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
  Snackbar
} from "@mui/material";
import Icon from "@mdi/react";
import {
  mdiFlag,
  mdiCheck,
  mdiClose,
  mdiAccountGroupOutline,
  mdiAccountGroup,
  mdiArrowULeftTop,
  mdiChevronDown,
} from "@mdi/js";
import _ from "lodash";
import { ActionButton } from "@/lib/components/action-button";
import { useAppDispatch, useAppSelector } from "../reducers";
import * as modqueueSlice from "../slices/modqueue";
import * as modalSlice from "../slices/modal";
import * as snackBarSlice from "../slices/snackbar";
import { setContextViewerEntry } from "../slices/context-viewer";
import { ModalState } from "../slices/modal";
import { theme } from "../../theme";

export const EntryRenderer = ({ entry }: { entry: Entry }) => {
  const dispatch = useAppDispatch();
  return (
    <Box
      onClick={() => dispatch(setContextViewerEntry(entry))}
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
        <PredictionsRenderer entry={entry} includeHeader={true} />
        <ActionsRenderer entry={entry} />
      </Box>
    </Box>
  );
};

const HeaderRenderer = ({ entry }: { entry: Entry }) => {
  const finalDecision = entry.state?.mod_decision;
  const subreddit = "r/changemyview";
  const decisionMarkerStyle = {
    backgroundColor:
      finalDecision == "approve"
        ? theme.palette.accept.main
        : theme.palette.remove.main,
    color: "white",
    borderRadius: 1,
    paddingLeft: 0.5,
    paddingRight: 1,
    fontWeight: "bold",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 0.25,
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
        <Tooltip
          title={
            (finalDecision == "approve" ? "Approved by " : "Removed by ") +
            (entry?.state?.panel?.is_active
              ? "panel"
              : entry?.state?.panel?.votes[0].user_id)
          }
        >
          <Box sx={decisionMarkerStyle}>
            <Icon
              path={finalDecision == "remove" ? mdiClose : mdiCheck}
              size={0.5}
            />
            {`${finalDecision.charAt(0).toUpperCase() + finalDecision.slice(1)}d`}
          </Box>
        </Tooltip>
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
          marginRight: 1,
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
          marginRight: 1,
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

const PredictionsRenderer = ({
  entry,
  includeHeader,
}: {
  entry: Entry;
  includeHeader: boolean;
}) => {
  const [expanded, setExpanded] = useState(false);
  const toggleAccordion: MouseEventHandler<HTMLDivElement> = (e) => {
    setExpanded((prev) => !prev);
    e.stopPropagation();
  };
  return (
    entry.panel_predictions && (
      <Accordion
        sx={{
          bgcolor: "#e5ebee",
          borderRadius: 1,
          boxShadow: "none",
        }}
        expanded={!includeHeader || expanded}
        onClick={toggleAccordion}
        disableGutters
      >
        {includeHeader && (
          <AccordionSummary
            expandIcon={
              <Icon
                path={mdiChevronDown}
                size={1}
                aria-controls={"panel-prediction-content-" + entry.id}
              />
            }
            sx={{ borderRadius: "4px" }}
          >
            <Icon
              path={mdiAccountGroup}
              size={1}
              color="#0b4b6b"
              className="flagIcon"
              style={{ flexShrink: 0 }}
            />
            <Box component="h3" fontWeight="bold" paddingLeft="8px">
              Prediction: What would other r/CMV moderators do?
            </Box>
          </AccordionSummary>
        )}
        <AccordionDetails sx={{ width: "100%" }}>
          <PredictionScoresVisualization scores={entry.panel_predictions} />
          If every moderator on your team took a vote, our model predicts{" "}
          <strong>
            {(entry.panel_predictions.approve * 100).toFixed(0)}%
          </strong>{" "}
          would support approval, and{" "}
          <strong>{(entry.panel_predictions.remove * 100).toFixed(0)}%</strong>{" "}
          support removal. We are unsure how{" "}
          <strong>{(entry.panel_predictions.unsure * 100).toFixed(0)}%</strong>{" "}
          of moderators would act.{" "}
          {entry.panel_predictions.approve < 0.7 &&
          entry.panel_predictions.remove < 0.7 ? (
            <span>
              Because consensus for this case is low,{" "}
              <strong>we recommend starting a panel.</strong>
            </span>
          ) : (
            ""
          )}{" "}
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
      {s[0] > 0 && (
        <Box
          position="absolute"
          left="0"
          bottom={barOffsetBottom}
          width={`${s[0]}%`}
          height={barHeight}
          bgcolor={theme.palette.accept.main}
        />
      )}
      {s[1] > 1 && (
        <Box
          position="absolute"
          left={`${s[0]}%`}
          bottom={barOffsetBottom}
          width={`${s[1]}%`}
          height={barHeight}
          bgcolor="#888"
        />
      )}
      {s[2] > 1 && (
        <Box
          position="absolute"
          left={`${s[0] + s[1]}%`}
          bottom={barOffsetBottom}
          width={`${s[2]}%`}
          height={barHeight}
          bgcolor={theme.palette.remove.main}
        />
      )}
      {/* Ticks */}
      {s[0] > 1 && (
        <Box
          position="absolute"
          left={`${s[0]}%`}
          bottom="0"
          height={tickHeight}
          borderRight={`solid ${tickWidth}`}
        />
      )}
      {s[1] > 1 && (
        <Box
          position="absolute"
          left={`${s[0] + s[1]}%`}
          bottom="0"
          height={tickHeight}
          borderRight={`solid ${tickWidth}`}
        />
      )}
      {/* Labels */}
      {s[0] > 0 && (
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
      )}
      {s[1] > 0 && (
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
      )}
      {s[2] > 0 && (
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
      )}
    </Box>
  );
};

//current solution for aligning panel icons with buttons is hacky, TO-DO: Find a better one
const ActionsRenderer = ({ entry }: { entry: Entry }) => {
  const dispatch = useAppDispatch();
  const user_id = useAppSelector((state) => state.modqueue.user_id);
  const context_id = useAppSelector((state) => state.modqueue.context_id);
  const disabledModals = useAppSelector((state) => state.modal.disabledModals);

  const togglePanelStatus = () => {
    return dispatch(
      modqueueSlice.updatePanelState({
        entry_id: entry.id,
        is_active: !entry.state?.panel?.is_active,
        context_id,
      }),
    ).unwrap();
  }
  const snackWrap = (func) => {
    return () => {
      console.log("in the wrap")
      let preValue = entry?.state?.mod_decision
      let promise = func().then( (value) => {
        let postValue = value?.mod_decision;
        let postPanel = value?.panel?.is_active;
        let postVotes = value?.panel?.votes?.map( (cur_entry) => cur_entry.decision );
        let voteCounts = _.countBy(postVotes);
        if (preValue != postValue) {
  	  let newSnackBarText = ["Case", "", ""]
 	  newSnackBarText[1] = !postValue 
	                         ? "Re-opened"
	  	                 : (postValue == "approve")	       
		  	           ? "Resolved - Approved"
			  	   : "Resolved - Removed"
          newSnackBarText[2] = postPanel
  	                         ? "(Votes: " + (voteCounts?.approve ? voteCounts.approve.toString() : "0") +  " Approve, " + (voteCounts?.remove ? voteCounts.remove.toString() : "0") + " Remove)"
	  	  	         : ""
	   return newSnackBarText
	} else{
	  return [""]
	}
      
      }).then(
       	  (value) => value[0] != ""
	       ? dispatch(snackBarSlice.setSnackBarText({snackBarText:value.join(" ")}))
	       : -1
        ).then(
	  (value) => value != -1 
             ? dispatch(snackBarSlice.setSnackBarOpen({snackBarOpen:true}))
	     : -1
       );
    }
  }
  const submitDecision = (decision: "approve" | "remove") => {
    return dispatch(
      modqueueSlice.submitDecision({
        entry_id: entry.id,
        decision,
        context_id,
        user_id,
      }),
    ).unwrap();
  }
  const wipeMyVote = () => {
    return dispatch(
      modqueueSlice.wipeMyVote({
        entry_id: entry.id,
        user_id,
        context_id,
      }),
    ).unwrap();
  }
  const wipeAllVotesAndCancelPanel = () => {
    dispatch(
      modqueueSlice.wipeAllVotes({
        entry_id: entry.id,
        context_id,
      }),
    ).unwrap()
    return dispatch(
      modqueueSlice.updatePanelState({
        entry_id: entry.id,
        is_active: false,
        context_id,
      })
    ).unwrap();
  };
  const userInVote = entry?.state?.panel?.votes?.some(
    (elem) => elem.user_id === user_id,
  );

  const othersInVote = entry?.state?.panel?.votes?.some(
    (elem) => elem.user_id !== user_id,
  );

  const userVote = entry?.state?.panel?.votes?.filter(
    (elem) => elem.user_id === user_id,
  );


  const openModal = (
    newModalContent: Omit<ModalState, "actionFunction">,
    newModalAction: ModalState["actionFunction"],
  ) => {
    if (disabledModals[newModalContent.name]) {
      // Skip opening the modal and execute action function immediately if the modal is disabled
      newModalAction();
    } else {
      // Otherwise open the modal as usual
      dispatch(
        modalSlice.openModal({
          ...newModalContent,
          actionFunction: newModalAction,
        }),
      );
    }
  };

  const curDecision = entry?.state?.mod_decision;
  const uncertain = (entry.panel_predictions.remove < 0.8) &&
	  (entry.panel_predictions.approve < 0.8)
  return (
    <Box
      display="flex"
      gap={1.5}
      alignItems={"start"}
      justifyContent={"space-between"}
    >
      <Box display="flex" gap={1.5} alignItems={"start"}>
        {!curDecision && (
          <>
            <ActionButton
              icon={<Icon path={mdiCheck} size={0.7} />}
              label={
                entry?.state?.panel?.is_active ? "Vote for Approval" : "Approve"
              }
              variant={
                userInVote && userVote?.[0].decision === "approve"
                  ? "filled"
                  : "outlined"
              }
              palette={theme.palette.accept}
              onClick={() => {
                userInVote && userVote?.[0].decision === "approve"
                  ? snackWrap( () => wipeMyVote() )()
                  : uncertain && !entry?.state?.panel?.is_active
	      	    ? openModal(ModalContent(entry, "approve"),
		       	        snackWrap(()=>submitDecision("approve")) )
   	 	    : snackWrap( () => submitDecision("approve") )()
              }}
              stopPropagation
            />
            <ActionButton
              icon={<Icon path={mdiClose} size={0.7} />}
              label={
                entry?.state?.panel?.is_active ? "Vote for Removal" : "Remove"
              }
              variant={
                userInVote && userVote?.[0].decision === "remove"
                  ? "filled"
                  : "outlined"
              }
              palette={theme.palette.remove}
              onClick={() => {
                userInVote && userVote?.[0].decision === "remove"
                  ? snackWrap( () => wipeMyVote() )()
                  : uncertain && !entry?.state?.panel?.is_active
		    ? openModal(ModalContent(entry, "remove"),
  			        snackWrap( ()=>submitDecision("remove") ))
  		    : snackWrap ( ()=> submitDecision("remove") )()
              }}
              stopPropagation
            />
          </>
        )}
        {curDecision && userInVote && entry?.state?.panel?.is_active && (
          <ActionButton
            icon={<Icon path={mdiArrowULeftTop} size={0.7} />}
            label={"Withdraw My Vote"}
            variant="outlined"
            onClick={snackWrap(wipeMyVote)}
            stopPropagation
          />
        )}
        {curDecision && !entry?.state?.panel?.is_active && (
          <ActionButton
            icon={<Icon path={mdiAccountGroupOutline} size={0.7} />}
            label={"Re-open in Panel Mode"}
            variant="outlined"
            onClick={snackWrap(togglePanelStatus)}
            stopPropagation
          />
        )}
        {curDecision && (
          <ActionButton
            icon={<Icon path={mdiArrowULeftTop} size={0.7} />}
            label={
              "Undo " +
              curDecision[0].toUpperCase() +
              curDecision.slice(1, -1) +
              "al"
            }
            variant="outlined"
            onClick={() =>
              othersInVote
                ? openModal(
                    ModalContent(entry, "wipe"),
                    snackWrap(wipeAllVotesAndCancelPanel),
                  )
                : snackWrap(wipeAllVotesAndCancelPanel)()
            }
            stopPropagation
          />
        )}
      </Box>
      <Box display="flex" gap={5} alignItems={"start"}>
        {entry.state?.panel?.is_active && (
          <Box display="flex" gap={0.5} alignItems={"start"}>
            {[0, 1, 2].map((i) => {
              const decision = entry.state?.panel?.votes?.[i]?.decision;
              const curUser = entry.state?.panel?.votes?.[i]?.user_id;
              return (
                <Box
                  display={"flex"}
                  flexDirection={"column"}
                  alignItems={"center"}
                  key={i}
                >
                  <Tooltip title={curUser ? curUser : ""}>
                    <Icon
                      // @ts-ignore Forwards the prop to the underlying svg
                      viewBox={"0 0 16 16"}
                      size={1.5}
                      key={i}
                      color={
                        decision === "approve" &&
                        (userInVote || entry?.state?.mod_decision)
                          ? theme.palette.accept.main
                          : decision &&
                              (userInVote || entry?.state?.mod_decision)
                            ? theme.palette.remove.main
                            : "#888"
                      }
                      path={
                        decision === "approve" &&
                        (userInVote || entry?.state?.mod_decision)
                          ? approvePath
                          : decision &&
                              (userInVote || entry?.state?.mod_decision)
                            ? removePath
                            : decision
                              ? filledPath
                              : outlinePath
                      }
                    />
                  </Tooltip>
                  <Box
                    fontSize={"13px"}
                    marginLeft={curUser === user_id ? "2px" : "0px"}
                    color={curUser === user_id ? "black" : "white"}
                  >
                    {"You"}
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
        {!curDecision && (
          <ActionButton
            icon={<Icon path={mdiAccountGroupOutline} size={0.7} />}
            label={
              entry?.state?.panel?.is_active ? "Cancel Panel" : "Start Panel"
            }
            variant="outlined"
            onClick={() =>
              othersInVote && entry?.state?.panel?.is_active
                ? openModal(ModalContent(entry, "cancel"), togglePanelStatus)
                : togglePanelStatus()
            }
            stopPropagation
          />
        )}
      </Box>
    </Box>
  );
};

const filledPath =
  "M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6";
const outlinePath =
  "M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z";
const approvePath =
  "M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m1.679-4.493-1.335 2.226a.75.75 0 0 1-1.174.144l-.774-.773a.5.5 0 0 1 .708-.708l.547.548 1.17-1.951a.5.5 0 1 1 .858.514M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0 M2 13c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4";
const removePath =
  "M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0m-9 8c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4 M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m-.646-4.854.646.647.646-.647a.5.5 0 0 1 .708.708l-.647.646.647.646a.5.5 0 0 1-.708.708l-.646-.647-.646.647a.5.5 0 0 1-.708-.708l.647-.646-.647-.646a.5.5 0 0 1 .708-.708";

const ModalContent = (
  entry: Entry,
  action: string,
): Omit<ModalState, "actionFunction"> => {
  const returnObj = {
    open: true,
    name: "",
    actionDesc: "",
    body: "" as ReactNode,
  };
  if (action == "cancel") {
    returnObj.name = "cancel/wipe";
    returnObj.actionDesc = "cancel panel";
    returnObj.body =
      "Cancelling this panel will erase all existing votes, including those made by other moderators.";
    if (entry?.state?.mod_decision) {
      returnObj.name = "cancel/move";
      returnObj.body =
        returnObj.body +
        'The case will be moved back into the "Open Cases" queue.';
    }
    if (entry?.state?.mod_decision == "remove") {
      returnObj.name = "cancel/visible";
      returnObj.body =
        (returnObj.body as string).slice(0, -1) +
        ", and the comment will become visible to users again.";
    }
  } else if (action === "wipe") {
    returnObj.actionDesc =
      entry?.state?.mod_decision === "approve"
        ? "undo approval"
        : "undo removal";
    if (!entry?.state?.panel?.is_active) {
      returnObj.name = "wipe/another-moderator";
      returnObj.body =
        "This action was taken by another moderator. Consider starting a panel instead if you disagree with their decision";
    } else {
      returnObj.name = "wipe/erase-votes";
      returnObj.body =
        "This comment was " +
        (entry?.state?.mod_decision === "approve" ? "approved" : "removed") +
        " via panel. If you proceed, you will erase all existing votes on the panel, including those made by other moderators.";
    }
  } else if (action === "approve" || action === "remove") {
    if (
      entry.panel_predictions.remove < 0.7 &&
      entry.panel_predictions.approve < 0.7
    ) {
      returnObj.name = "uncertain/" + action;
      returnObj.actionDesc = action;
      returnObj.body = (
        <PredictionsRenderer entry={entry} includeHeader={false} />
      );
    }
  }
  return returnObj;
};
