db = db.getSiblingDB("main");
db.createCollection("modqueueEntryStates");
db.modqueueEntryStates.createIndex({ entry_id: 1 });
db.modqueueEntryStates.createIndex({ context_id: 1 });
