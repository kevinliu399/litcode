"use server";

import { revalidatePath } from "next/cache";

import User from "../dabatase/models/user";
import { connectToDatabase } from "../dabatase/mongoose";

// CREATE
export async function createUser(user: CreateUserParams) {
  console.log("Creating user", user);
  try {
    await connectToDatabase();
    let existingUser = await User.findOne({ clerkId: user.clerkId });

    if (existingUser) {
      console.log("User with this clerkId already exists:", existingUser);
      existingUser = Object.assign(existingUser, user);
    } else {
      existingUser = new User({
        ...user,
        isSubscribed: false,
        subscriptionEndDate: null,
      });
    }
    const newUser = await existingUser.save();
    console.log("User created or updated in DB", newUser);

    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    console.error("Error creating user:", error);
  }
}



// READ
export async function getUserById(userId: string) {
  console.log("Fetching user in getUserById", userId);
  try {
    await connectToDatabase();

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      console.log("User not found for clerkId:", userId);
      return null;
    }

    return JSON.parse(JSON.stringify(user));
  } catch (error) {

  }
}

// UPDATE
export async function updateUser(clerkId: string, user: UpdateUserParams) {
  try {
    await connectToDatabase();

    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
      new: true,
    });

    if (!updatedUser) throw new Error("User update failed");

    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {

  }
}

// DELETE
export async function deleteUser(clerkId: string) {
  console.log("Deleting user", clerkId);
  try {
    await connectToDatabase();

    // Find user to delete
    const userToDelete = await User.findOne({ clerkId });

    if (!userToDelete) {
      throw new Error("User not found");
    }

    // Delete user
    const deletedUser = await User.findByIdAndDelete(userToDelete._id);
    revalidatePath("/");

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  } catch (error) {
  }
}