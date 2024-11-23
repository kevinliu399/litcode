/* eslint-disable no-unused-vars */

// ====== USER PARAMS
declare type CreateUserParams = {
  clerkId: string;
  firstName: string | null;
  lastName: string | null;
  photo: string;
  email: string;
};

declare type UpdateUserParams = {
  firstName: string | null;
  lastName: string | null;
  photo: string;
};