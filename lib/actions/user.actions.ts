"use server"

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

interface UserUpdateParams {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

export async function updateUser({
  userId,
  username,
  name,
  bio,
  image,
  path,
}: UserUpdateParams): Promise<void> {
  try {
    connectToDB();

    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true }
    );

    if (path === "/profile/edit") {
      // Assuming revalidatePath is defined elsewhere
      revalidatePath(path);
    }
  } catch (error: any) {
    // Handle specific types of errors or log the error
    console.error(`Failed to create/update user: ${error.message}`);
    throw error; // Rethrow the error to propagate it to the caller
  }
}

export async function fetchUser(userId: string) {
  try {
    connectToDB();

    return await User
    .findOne({ id: userId })
    // .populate({
    //   path: 'communities',
    //   model: 'Community'
    // })
  } catch (error: any) {
     throw new Error(`Failed to fetch user: ${error.message}`)
  }
}