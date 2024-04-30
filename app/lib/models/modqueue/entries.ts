import { getDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export interface Entry {
  text: string;
  title: string;
  post_body: string;
  time_delay: number;
  flair: string | null;
  reports: {
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
  const items = await collection.find({}).limit(10).toArray();
  return items;
};
