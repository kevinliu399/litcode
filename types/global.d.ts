import { MongoClient } from "mongodb";

declare global {
  // Extend globalThis instead of NodeJS.Global
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

declare type CreateUserParams = {
  clerkId: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  photo: string;
};

declare type UpdateUserParams = {
  firstName: string;
  lastName: string;
  username: string;
  photo: string;
};

export {};
