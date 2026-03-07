"use server";

import { PaymentMethod, PaymentStatus } from "@/app/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getCurrentDbUserId } from "./user.action";

// Function for creating Payment Entry In Payment Table
export async function createPayment({ amount, status, method, doctorId, appointmentId }: { amount: number, status: PaymentStatus, method: PaymentMethod, doctorId: string, appointmentId: string }) {
    try {
        const user = await currentUser();

        if (!user) throw new Error("UnAuthenticated User");

        const userDbId = await getCurrentDbUserId();

        const paymentData = await prisma.payment.create({
            data: {
                doctorAppointmentId: appointmentId,
                userId: userDbId,
                doctorId: doctorId,
                amount,
                status,
                method
            }
        });

    } catch (error) {
        console.log("Error creating Payment", error);
        throw new Error("Error creating Payment");
    }
}