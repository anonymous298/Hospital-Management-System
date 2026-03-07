import prisma from "@/lib/prisma";

export async function seedDoctorAvailabilityDate(doctorId: string) {
    console.log("Seeding seedDoctorAvailabilityDate...");

    const date = await prisma.doctorAvailabilityDate.create({
        data: {
            doctorId,
            date: new Date("2026-03-10"),
            doctorTimeSlots : {
                create : [
                    { startTime: "15:00", endTime: "15:30" },
                    { startTime: "15:30", endTime: "16:00" },
                    { startTime: "16:00", endTime: "16:30" },
                ]
            }
        }
    })
}