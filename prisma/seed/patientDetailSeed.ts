import prisma from "@/lib/prisma";

export async function seedPatientDetails() {
    console.log("Seeding Patient Details...")

    await prisma.patientDetail.create({
        data : {
            doctorAppointmentId: 'cmm5hq8sp0000gk86vv2fdspr',
            fullName: "Talha",
            age: 18,
            gender: "MALE",
            phoneNumber: 1234567890,
            email: "talha@example.com"
        }
    })

}