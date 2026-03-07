"use server";

import { GenderRole } from "@/app/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { PatientFormData } from "@/types/patientDetail";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getCurrentDbUserId } from "./user.action";



// Function for Creating Patient Detail Based On The Appointment Id Created In Transaction
export async function createPatientDetail({form, appointmentId}: {form: PatientFormData, appointmentId: string}) {
    try {
        const user = await currentUser();

        if (!user) throw new Error("UnAuthenticated User");

        const currentUserDbId = await getCurrentDbUserId();
        if (!currentUserDbId) throw new Error("User Not in DB");

        const patientDetail = await prisma.patientDetail.create({
            data : {
                doctorAppointmentId: appointmentId,
                fullName: form.fullName,
                age: parseInt(form.age),
                phoneNumber: form.phoneNumber,
                gender: (form.gender as GenderRole),
                email: form.email,
            }
        });
        
    } catch (error) {
        console.log("Error creating Patient Detail", error);
        throw new Error("Error creating Patient Detail");
    }
}