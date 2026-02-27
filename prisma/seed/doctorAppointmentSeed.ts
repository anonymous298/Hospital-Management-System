import prisma from "@/lib/prisma";

export async function seedDoctorAppointments() {
    console.log("Seeding Doctor Appointments...")

    await prisma.doctorAppointment.create({
        data: {
            userId: 'cmm5hgnxf0000vs86tis9e3z9',
            doctorId: 'cmm5hgp1o0001vs86cv017d36',
            timeSlotId: 'cmm5hjirf0003ws86gxpscnq6'
        }
    })

}