"use server";

import { DoctorAvailabilityStatus, GenderRole, PaymentMethod, PaymentStatus } from "@/app/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { Doctor, DoctorTimeSlot } from "@/types/doctor";
import { PatientFormData } from "@/types/patientDetail";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getCurrentDbUserId } from "./user.action";
import { createPatientDetail } from "./patientDetail.action";


// Function for creating Doctor Appointment
export async function createDoctorAppointment({
    doctor,
    timeSlot,
    paymentMethod,
    paymentStatus,
    patientForm,
}: {
    doctor: Doctor,
    timeSlot: DoctorTimeSlot,
    paymentMethod: PaymentMethod,
    paymentStatus: PaymentStatus,
    patientForm: PatientFormData
}) {
    try {
        const {userId: clerkId} = await auth();

        if (!clerkId) throw new Error("UnAuthenticated User");

        const currentUserDbId = await getCurrentDbUserId();
        if (!currentUserDbId) throw new Error("User Not in DB");

        await prisma.$transaction(async (tx) => {
            // Creating Appointment Based On User, Doctor, Timeslot
            const currentAppointment = await tx.doctorAppointment.create({
                data : {
                    userId: currentUserDbId,
                    doctorId: doctor.id,
                    timeSlotId: timeSlot.id,
                }
            });

            // Atomic Update
            await prisma.doctorTimeSlot.update({
                where : {
                    id: timeSlot.id
                },

                data : {
                    isBooked: true
                }
            })

            console.log("Appointment Created...")
            
            // Creating Patient Detail Based On currentAppointment In Transaction
            await tx.patientDetail.create({
                data : {
                    doctorAppointmentId: currentAppointment.id,
                    fullName: patientForm.fullName,
                    age: parseInt(patientForm.age),
                    phoneNumber: patientForm.phoneNumber,
                    gender: (patientForm.gender) as GenderRole,
                    email: patientForm.email
                }
            });
            
            // Creating Patient Detail Based on Current Appointment In Transaction
            // await createPatientDetail({
            //     form : patientForm,
            //     appointmentId: currentAppointment.id
            // })
            
            console.log("Patient Detail Created...")
            
            // Creating Payment Based On current Appointment In Transaction
            await tx.payment.create({
                data : {
                    userId: currentUserDbId,
                    doctorId: doctor.id,
                    doctorAppointmentId: currentAppointment.id,
                    amount: doctor.consultationFee,
                    method: paymentMethod,
                    status: paymentStatus 
                }
            })

            console.log("Payment Created...")
        })

        return {success : true}

    } catch (error) {
        console.log("Error creating Doctor Appointment", error);
        return {success : false}
    }
}
