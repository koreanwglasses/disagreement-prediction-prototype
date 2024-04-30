import { getDB } from "@/lib/mongodb";
import hash from "string-hash";
import {
  uniqueNamesGenerator,
  adjectives,
  animals,
  colors
} from "unique-names-generator";
import { WithId } from "mongodb";

export interface Entry {
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
}

export const getCollection = async () => {
  const db = await getDB();
  return db.collection<Entry>("modqueue.entries");
};

export const getEntries = async () => {
  const collection = await getCollection();
  const items = await collection.find({}).limit(20).toArray();
  return generateAuthorNames(items);
};

const generateAuthorName = (entry: Entry) => {
  const seed = hash(entry.text) ^ hash(entry.title) ^ hash(entry.post_body);
  return uniqueNamesGenerator({ dictionaries: [adjectives, colors], seed });
};

const generateAuthorNames = (entries: WithId<Entry>[]) => {
  return entries.map((entry) => ({
    ...entry,
    author_name: generateAuthorName(entry),
  }));
};
