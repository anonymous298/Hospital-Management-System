import prisma from "@/lib/prisma";
import { randomUUID } from "node:crypto";
import { seedUsers } from "./seed/userSeed";
import { seedDoctors } from "./seed/doctorSeed";
import { seedDoctorAvailabilityDate } from "./seed/doctorAvailabilityDateSeed";
import { seedDoctorAppointments } from "./seed/doctorAppointmentSeed";
import { seedPatientDetails } from "./seed/patientDetailSeed";
import { seedPayment } from "./seed/paymentSeed";

async function main() {
  console.log("🌱 Seeding database...");

  // await seedUsers();
  await seedDoctors();
  // await seedDoctorAvailabilityDate('cmmfsciej0000ecgm26ph6gqb');
  // await seedDoctorAppointments();
  // await seedPatientDetails();
  // await seedPayment();

  // const doctorData = await prisma.doctor.findUnique({
  //   where : {
  //     id : "cmm5hgp1o0001vs86cv017d36",
  //   },

  //   include : {
  //     doctorAvailabilityDates : {
  //       include : {
  //         doctorTimeSlots : true
  //       }
  //     }
  //   }
  // })

  // console.log(doctorData);

  // console.log(doctorData?.doctorAvailabilityDates[0].doctorTimeSlots[0])

  // const appointmentData = await prisma.doctorAppointment.findMany({
  //   where : {
  //     userId : "cmm5hq8sp0000gk86vv2fdspr"
  //   },

  //   include: {
  //     user : true,
  //     doctor : true,
  //     timeSlot : {
  //       include : {
  //         availabilityDate: true
  //       }
  //     },
  //     patientDetail : true,
  //     payment : true,
  //   }
  // })

  // console.log(appointmentData);

  // const data = await prisma.doctorTimeSlot.findMany({});

  // console.log(data);

  console.log("✅ Seed Complete");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());