import "server-only";
import { getDB } from "@/lib/mongodb";
import hash from "string-hash";
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
} from "unique-names-generator";
import { ObjectId, UpdateFilter } from "mongodb";
import _ from "lodash";

// Structures of the Entry/State objects as they are in the DB
interface EntryModel {
  author_name?: string;
  text: string;
  title: string;
  post_body: string;
  time_delay: number;
  flair: string | null;
  reports?: {
    [rule: string]: number;
  };
  is_op?: boolean;
  panel_predictions?: { approve: number; remove: number; unsure: number };
}

interface EntryStateModel {
  entry_id: ObjectId;
  context_id: string;

  mod_decision?: "approve" | "remove";
  panel?: PanelStateModel;
}

interface PanelStateModel {
  is_active: boolean;
  votes: {
    user_id: string;
    decision: "approve" | "remove";
  }[];
}

/// Structures of the Entry/State objects as they are sent to the client
export type EntryState = Omit<EntryStateModel, "entry_id" | "context_id">;
export type PanelState = PanelStateModel;
export type Entry = EntryModel & {
  id: string;
  state?: EntryState;
};

/// Methods for fetching/updating data (Public)

export const fetchEntries = async ({
  context_id,
  limit = 20,
}: {
  context_id: string;
  limit?: number;
}) => {
  const collection = await getEntriesCollection();
  const pipeline = [
    // Lookup corresponding entry state
    {
      $lookup: {
        from: "modqueueEntryStates",
        localField: "_id",
        foreignField: "entry_id",
        pipeline: [
          {
            $match: {
              context_id,
            },
          },
        ],
        as: "state",
      },
    },
    // Reshape the data to match the intended output structure
    {
      $addFields: {
        id: { $toString: "$_id" },
        state: { $arrayElemAt: ["$state", 0] },
      },
    },
    {
      $project: {
        _id: 0,
        "state._id": 0,
        "state.entry_id": 0,
        "state.sandbox_id": 0,
      },
    },
    { $limit: limit },
  ];
  const items = await collection.aggregate<Entry>(pipeline).toArray();
  return fillMockData(items);
};

export const updatePanelState = async ({
  entry_id,
  context_id,
  is_active,
}: {
  entry_id: string;
  context_id: string;
  is_active: boolean;
}) => {
  const key = { entry_id: ObjectId.createFromHexString(entry_id), context_id };
  const collection = await getEntryStatesCollection();
  const currentState = await collection.findOne(key);
  let set_vals = {}
  if (currentState?.mod_decision != undefined) {
    if (is_active) {
      //Are you sure? Re-opning closed case
      set_vals = {"panel.is_active": is_active, "mod_decision": null}
    } else {
      // Voids all votes, are you sure?
      set_vals = {"panel.is_active": is_active, "panel.votes": []}
    }
  } else {
    if (is_active) {
      // Normal: Activating panel for undecided case
      set_vals = {"panel.is_active": is_active, "mod_decision": null}
    } else{
      // Are there votes from other people? hit em with the "are you sre"?
	    // else just cancel panel and void all votes
      set_vals = {"panel.is_active": is_active, "panel.votes": []}
    }
  }

  await collection.updateOne(
    key,
    { $set: set_vals},
    { upsert: true }
  );

  return cleanEntryState(await collection.findOne(key));
};

export const wipeCase  = async({
  entry_id,
  context_id,
  user_id
}: {
  entry_id: string;
  context_id: string;
  user_id: string;
}) => {
  const key = { entry_id: ObjectId.createFromHexString(entry_id), context_id };
  const collection = await getEntryStatesCollection();
  await collection.updateOne(
    key,
    { $set: {"mod_decision": null, "panel.votes": []}},
    { upsert: true }
  );
  return cleanEntryState(await collection.findOne(key))
}

export const submitDecision = async ({
  entry_id,
  context_id,
  user_id,
  decision,
}: {
  entry_id: string;
  context_id: string;
  user_id: string;
  decision: EntryStateModel["mod_decision"];
}) => {
  const key = { entry_id: ObjectId.createFromHexString(entry_id), context_id };
  const collection = await getEntryStatesCollection();
  const currentState = await collection.findOne(key);

  //If there's no panel, the new decision will be the user-inputted value
  var updated_decision = decision
  if (currentState?.panel?.is_active) {
    //If there's a panel, determine what the updated outcome should be
    if (currentState?.panel?.votes) {
      const updated_vote_vals = currentState.panel.votes.map(
    	    (elem) => elem.user_id == user_id ? decision : elem.decision 
      );
      updated_decision = computeDecisionFromVotes(updated_vote_vals)
    } else {
      updated_decision = null;
    }
  }
  // Update outcome
  await collection.updateOne(
	  key,
          { $set: { mod_decision: updated_decision } },
          { upsert: true }
  );

  const vote = { user_id, decision };
  if (_.some(currentState?.panel?.votes, (elem) => elem.user_id === user_id)) {
    // If the user already voted, update their vote
    await collection.updateOne(
      { ...key, "panel.votes": { $elemMatch: { user_id } } },
      { $set: { "panel.votes.$": vote } },
      { upsert: true }
    );
  } else {
    // If the user hasn't already voted, push their vote
    await collection.updateOne(
      key,
      { $push: { "panel.votes": vote } },
      { upsert: true }
    );
  }
  return cleanEntryState(await collection.findOne(key));
};

/// DB access helpers

const getEntriesCollection = async () => {
  const db = await getDB();
  return db.collection<EntryModel>("modqueueEntries");
};

const getEntryStatesCollection = async () => {
  const db = await getDB();
  return db.collection<EntryStateModel>("modqueueEntryStates");
};

/// Methods for cleaning data and removing extraneous fields

const cleanEntryState = (
  entryState: EntryStateModel | null
): EntryState | null =>
  entryState &&
  _.omit(
    entryState,
    "_id",
    "entry_id",
    "context_id",

    // Omit panel votes from the result if the panel is not active
    ...(entryState.panel?.is_active ? [] : ["panel.votes"])
  );

/// Helper function to compute the correct decision based on current vote state

const computeDecisionFromVotes = (votes: String[]) => {
  var approves = 0
  var removes = 0
  for (let i = 0; i < 3; i ++ ) {
    if (i < votes.length) {
      if (votes[i] == "") {
        approves = approves + 1
      } else {
        removes = removes + 1
      }
    }      
  }
  if (approves >= 2) {
    return "approve"
  } else if (removes >= 2) {
    return "remove"
  } else {
    return null;
  }
}

/// Methods for mocking data

const fillMockData = (entries: Entry[]) => {
  return entries.map((entry) => ({
    ...entry,
    author_name: generateAuthorName(entry),
    panel_predictions: generatePanelPrediction(entry),
  }));
};

const hashEntry = (entry: Entry) =>
  // Use hashes to generate stable "random" data
  hash(entry.text) ^ hash(entry.title) ^ hash(entry.post_body);

const generateAuthorName = (entry: Entry) => {
  const seed = hashEntry(entry);
  return uniqueNamesGenerator({ dictionaries: [adjectives, colors], seed });
};

const generatePanelPrediction = (entry: Entry) => {
  return {
    approve: 0.6,
    remove: 0.3,
    unsure: 0.1,
  };
};
