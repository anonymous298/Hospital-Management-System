"use server";

import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

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