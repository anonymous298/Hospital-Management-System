"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function fetchLimitedDoctors() {
    try {
        // const {userId: clerkId} = await auth();
        // if (!clerkId) throw new Error("UnAuthenticated Authentication Required")

        const doctors = await prisma.doctor.findMany({
            take: 4
        })

        if (!doctors) return [];

        return doctors;

    } catch (error) {
        console.log("Unable to find LimitedDoctors", error);
        throw new Error('Unable to find LimitedDoctors');
    }
}

export async function fetchAllDoctors() {
    try {
        const doctors = await prisma.doctor.findMany({});

        if (!doctors) return [];

        return doctors;
    } catch (error) {
        console.log("UnAble to fetch all doctors data", error);
        throw new Error("Unable to fetch all doctors data");
    }
}