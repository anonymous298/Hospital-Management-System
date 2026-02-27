import prisma from "@/lib/prisma";

export async function seedPayment() {
    console.log("Seeding Payments...")

    await prisma.payment.create({
        data : {
            doctorAppointmentId: 'cmm5hq8sp0000gk86vv2fdspr',
            userId: 'cmm5hgnxf0000vs86tis9e3z9',
            doctorId: 'cmm5hgp1o0001vs86cv017d36',
            amount: 100,
            method: "CASH",
            status: "PENDING",
        }
    })
}