"use server";

import * as Model from "./model";

/** TODO: Get context_id and user_id from session */
const context_id = "XXXXX";
const user_id = "YYYYY";

export const fetchEntries = async () => {
  return Model.fetchEntries({ context_id });
};

export const updatePanelStatus = async (
  entry_id: string,
  is_active: boolean
) => {
  return await Model.updatePanelState({
    entry_id,
    context_id,
    is_active,
  });
};

export const submitDecision = async (
  entry_id: string,
  decision: Model.EntryState["mod_decision"]
) => {
  return await Model.submitDecision({
    entry_id,
    context_id,
    user_id,
    decision,
  });
};

export const wipeCase = async (
  entry_id: string,
) => {
  return await Model.wipeCase({
    entry_id,
    context_id,
    user_id,
  });
};
