import { MongoClient } from "mongodb";

declare global {
  // Extend globalThis instead of NodeJS.Global
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export {};
