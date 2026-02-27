import prisma from "@/lib/prisma";

export async function seedDoctors() {
  console.log("Seeding Doctors...");

//   const object = {
//     specialization: "Dentist",
//     qualification: "BDS, MDS",
//     location: "Smile Dental Care",
//     success: "98%",
//     experience: "6 Years",
//     patients: "80k+",
//     consultationFee: 3000,
//     about: "Braces, root canal, cleaning & whitening expert",
//     availability: "AVAILABLE",
//     doctorAvailabilityDates: [
//       {
//         date: new Date("2026-03-01"),
//         doctorTimeSlots: [
//           { startTime: "10:00", endTime: "10:30" },
//           { startTime: "10:30", endTime: "11:00" },
//           { startTime: "11:00", endTime: "11:30" },
//         ],
//       },
//     ],
//   };

//   const doctor = await prisma.doctor.create({

//     data: {
//       specialization: "Dentist",
//       qualification: "BDS, MDS",
//       location: "Smile Dental Care",
//       success: "98%",
//       experience: "6 Years",
//       patients: "80k+",
//       consultationFee: 3000,
//       about: "Braces, root canal, cleaning & whitening expert",
//       availability: "AVAILABLE",
//       doctorAvailabilityDates: {
//       create: object.doctorAvailabilityDates.map((date) => ({
//         date: date.date,
//         doctorTimeSlots: {
//           create: date.doctorTimeSlots.map((slot) => ({
//             startTime: slot.startTime,
//             endTime: slot.endTime,
//           })),
//         },
//       })),
//     },
    
//     },
//   });

  const doctorData = await prisma.doctor.create({

    data: {
      specialization: "Dentist",
      qualification: "BDS, MDS",
      location: "Smile Dental Care",
      success: "98%",
      experience: "6 Years",
      patients: "80k+",
      consultationFee: 3000,
      about: "Braces, root canal, cleaning & whitening expert",
      availability: "AVAILABLE",
      doctorAvailabilityDates: {
        create: [
          {
            date: new Date("2026-03-01"),
            doctorTimeSlots: {
              create: [
                { startTime: "10:00", endTime: "10:30" },
                { startTime: "10:30", endTime: "11:00" },
                { startTime: "11:00", endTime: "11:30" },
              ],
            },
          },
        ],
      },
    },
  });

}
