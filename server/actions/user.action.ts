"use server";

import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { useId } from "react";

// Function for Creating User In DB On Initial SignIn
export async function createInitialUserInDbOnSignIn() {
    try {
        const {userId: clerkId} = await auth();
        const user = await currentUser();

        if (!clerkId) throw new Error("UnAuthenticated Authentication Required");

        const exisitingUser = await prisma.user.findUnique({
            where : {
                clerkId
            }
        });

        if (!exisitingUser) {
            const newUser = await prisma.user.create({
                data : {
                    clerkId,
                    email: (user?.emailAddresses[0].emailAddress) ?? "",
                    username: (user?.username || user?.emailAddresses[0].emailAddress.split('@')[0]) ?? "",
                    name: `${user?.firstName ?? ""} ${user?.lastName ?? ""}`,
                    imageUrl: user?.imageUrl,

                }
            })
        }

    } catch (error) {
        console.log("Error While Creating User")
        throw new Error("Error While Creating User")
    }
}

// Function for Getting Current User Data Based On ClerkId
export async function getCurrentDbUser() {
    try {
        const {userId: clerkId} = await auth();
        // const user = await currentUser();

        if (!clerkId) throw new Error("UnAuthenticated User");

        const currentUser = await prisma.user.findUnique({
            where : {
                clerkId
            }
        });

        if (!currentUser) throw new Error("User Not Found In DB");

        return currentUser;

    } catch (error) {
        console.log("Error Getting Current DB User Info", error);
        throw new Error("Error Getting Current DB User Info");
    }
}

// Function for Getting Current User Id
export async function getCurrentDbUserId() {
    try {
        const {userId: clerkId} = await auth();

        if (!clerkId) throw new Error("UnAuthenticated User");

        const user = await getCurrentDbUser();
        const userId = user.id;

        return userId;

    } catch (error) {
        console.log("Error Getting Current DB User ID", error);
        throw new Error("Error Getting Current DB User ID");
    }
}