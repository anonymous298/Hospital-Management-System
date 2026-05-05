"use server";

import { DoctorAvailabilityStatus, GenderRole, PaymentMethod, PaymentStatus } from "@/app/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { Doctor, DoctorTimeSlot } from "@/types/doctor";
import { PatientFormData } from "@/types/patientDetail";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getCurrentDbUser, getCurrentDbUserId } from "./user.action";
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
            await tx.doctorTimeSlot.update({
                where : {
                    id: timeSlot.id
                },

                data : {
                    isBooked: true
                }
            })

            // console.log("Appointment Created...")
            
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
            
            // console.log("Patient Detail Created...")
            
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

            // console.log("Payment Created...")
        })

        return {success : true}

    } catch (error) {
        console.log("Error creating Doctor Appointment", error);
        return {success : false}
    }
}

// Function for Fetching All Appointment Data Based on Current User
export async function fetchAllCurrentUserDoctorAppointments() {
    try {
        const {userId} = await auth();
        if (!userId) throw new Error("UnAuthenticated User");

        const currentDbUserId = await getCurrentDbUserId();
        if (!currentDbUserId) throw new Error("User not exists in DB!")

        const doctorAppointmentsData = await prisma.doctorAppointment.findMany({
            where : {
                userId: currentDbUserId,
            },

            include : {
                user: true,
                doctor: true,
                timeSlot: {
                    include : {
                        availabilityDate: true,
                    }
                },
                patientDetail: true,
                payment: true,
            }
        });

        if (!doctorAppointmentsData) return [];

        return doctorAppointmentsData;

    } catch (error) {
        console.log("Error fetching Current User Doctor Appointments", error);
        throw new Error("Error fetching Current User Doctor Appointments");
    }
}


// Function for Fetching All Appointment Data Based on Doctor Id
export async function fetchAllDoctorAppointmentsByDoctorId() {
    try {
        const {userId} = await auth();
        if (!userId) throw new Error("UnAuthenticated User");

        const currentDbUser = await getCurrentDbUser();
        if (!currentDbUser.id) throw new Error("User not exists in DB!");

        if (currentDbUser.role !== "DOCTOR") throw new Error("Unauthorized Access");

        // TODO: Add user.doctorId check also

        const doctorAppointmentsData = await prisma.doctorAppointment.findMany({
            where : {
                doctorId: currentDbUser.doctorId!,
            },

            include: {
                user: true,
                doctor: true,
                patientDetail: true,
                payment: true,
                timeSlot: {
                    include: {
                        availabilityDate: true,
                    }
                }
            },
        })

        if (!doctorAppointmentsData) return [];

        return doctorAppointmentsData;

    } catch (error) {
        console.log("Error fetching Doctor Appointments by Doctor Id", error);
        return [];
    }
}