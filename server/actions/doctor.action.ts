"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { getCurrentDbUser } from "./user.action";
import { DoctorAvailabilityStatus } from "@/app/generated/prisma/enums";

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

export async function fetchDateAndTimeSlotBasedOnDoctorId() {
    try {
        const {userId} = await auth();
        if (!userId) throw new Error("UnAuthenticated User");

        const currentDbUser = await getCurrentDbUser();
        if (!currentDbUser.id) throw new Error("User not exists in DB!");

        if (currentDbUser.role !== "DOCTOR") throw new Error("Unauthorized Access");

        // TODO: Add user.doctorId check also

        const doctorAvailabilityDatesAndTimeSlots = await prisma.doctorAvailabilityDate.findMany({
            where : {
                doctorId: currentDbUser.doctorId!,
            },

            include: {
                doctorTimeSlots: true,
            }
        });

        if (!doctorAvailabilityDatesAndTimeSlots) return [];

        return doctorAvailabilityDatesAndTimeSlots;
        
        
    } catch (error) {
        console.log("Error fetching Date and TimeSlot Based On DoctorId", error);
        throw new Error("Error fetching Date and TimeSlot Based On DoctorId");
    }
}

export async function fetchDoctorProfileBasedOnDoctorId() {
    try {
        const {userId} = await auth();
        if (!userId) throw new Error("UnAuthenticated User");

        const currentDbUser = await getCurrentDbUser();
        if (!currentDbUser.id) throw new Error("User not exists in DB!");

        if (currentDbUser.role !== "DOCTOR") throw new Error("Unauthorized Access");

        // TODO: Add user.doctorId check also

        const doctorProfileData = await prisma.doctor.findUnique({
            where : {
                id: currentDbUser.doctorId!,
            }
        })

        if (!doctorProfileData) throw new Error("Doctor Profile Data Not Found");

        return doctorProfileData;

    } catch (error) {
        console.log("Error fetching Doctor Profile Based On DoctorId", error);
        throw new Error("Error fetching Doctor Profile Based On DoctorId");
    }
}

export async function saveDoctorProfileUpdates(
    {
        name, 
        specialization,
        qualification,
        about,
        consultationFee,
        location,
        experience,
        patients,
        success,
    } : {
        name: string,
        specialization: string,
        qualification: string,
        about: string,
        consultationFee: number,
        location: string,
        experience: string,
        patients: string,
        success : string,
    }
) {
    try {
        const {userId} = await auth();
        if (!userId) throw new Error("UnAuthenticated User");

        const currentDbUser = await getCurrentDbUser();
        if (!currentDbUser.id) throw new Error("User not exists in DB!");

        if (currentDbUser.role !== "DOCTOR") throw new Error("Unauthorized Access");

        // TODO: Add user.doctorId check also

        const updatedDoctorProfile = await prisma.doctor.update({
            where : {
                id: currentDbUser.doctorId!,
            },

            data : {
                name,
                specialization,
                qualification,
                location,
                experience,
                patients,
                success,
                about,
                consultationFee,
            }
        })

        if (!updatedDoctorProfile) throw new Error("Failed to update Doctor Profile");

        return updatedDoctorProfile;
        
    } catch (error) {
        console.log("Error saving Doctor Profile Updates", error);
        throw new Error("Error saving Doctor Profile Updates");
    }
}

export async function updateDoctorAvailability(next: DoctorAvailabilityStatus) {
    try {
        const {userId} = await auth();
        if (!userId) throw new Error("UnAuthenticated User");

        const currentDbUser = await getCurrentDbUser();
        if (!currentDbUser.id) throw new Error("User not exists in DB!");

        if (currentDbUser.role !== "DOCTOR") throw new Error("Unauthorized Access");

        // TODO: Add user.doctorId check also

        const updatedDoctorAvailability = await prisma.doctor.update({
            where : {
                id: currentDbUser.doctorId!,
            },

            data : {
                availability: next,
            }
        })

        if (!updatedDoctorAvailability) throw new Error("Failed to update Doctor Availability");

        return updatedDoctorAvailability;

    } catch (error) {
        console.log("Error updating Doctor Availability", error);
        throw new Error("Error updating Doctor Availability");
    }
}