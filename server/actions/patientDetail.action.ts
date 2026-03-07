"use server";

import { GenderRole } from "@/app/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

interface FormProp {
    fullName: string
    age: number
    phoneNumber: number
    gender: GenderRole
    email: string
}

// Function for Creating Patient Detail Based On The Appointment Id Created In Transaction
export async function createPatientDetail({form, appointmentId}: {form: FormProp, appointmentId: string}) {
    try {
        const user = await currentUser();

        if (!user) throw new Error("UnAuthenticated User");

        const patientDetail = await prisma.patientDetail.create({
            data : {
                doctorAppointmentId: appointmentId,
                fullName: form.fullName,
                age: form.age,
                phoneNumber: form.phoneNumber,
                gender: form.gender,
                email: form.email,
            }
        });
        
    } catch (error) {
        console.log("Error creating Patient Detail", error);
        throw new Error("Error creating Patient Detail");
    }
}