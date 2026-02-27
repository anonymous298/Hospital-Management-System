import prisma from "@/lib/prisma";

export async function seedDoctorAvailabilityDate(doctorId: string) {
    console.log("Seeding seedDoctorAvailabilityDate...");

    const date = await prisma.doctorAvailabilityDate.create({
        data: {
            doctorId,
            date: new Date("2026-03-01"),
            doctorTimeSlots : {
                create : [
                    { startTime: "12:00", endTime: "12:30" },
                    { startTime: "12:30", endTime: "13:00" },
                    { startTime: "13:00", endTime: "13:30" },
                ]
            }
        }
    })
}