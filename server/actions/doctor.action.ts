"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

// Function for fetching Limited Doctors limit-4
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

// Function for fetching All Doctors
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

// Function for Fetching Specific Doctor Based on ID
export async function fetchSingleDoctor(id: string) {
    try {

        if (!id) throw new Error("Id Not Recognized"); 

        const doctorData = await prisma.doctor.findUnique({
            where: {
                id,
            },

            include : {
                doctorAvailabilityDates : {
                    include : {
                        doctorTimeSlots : true,
                    }
                }
            }
        });

        if (!doctorData) throw new Error("Doctor Data Not Found");

        return doctorData;


    } catch (error) {
        console.log("Error getting Single Doctor Data", error);
        throw new Error("Error getting Single Doctor Data");
    }
}