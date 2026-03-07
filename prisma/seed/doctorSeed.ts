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
      name: "Dr. Fatima Khan",
      imageUrl: "https://res.cloudinary.com/duplkba46/image/upload/v1770477280/doctors/jfrdnomnt4yveeglqprc.jpg",
      specialization: "Cardiologist",
      qualification: "BDS, MDS",
      location: "Smile Dental Care",
      success: "89%",
      experience: "3+ Years",
      patients: "50k+",
      consultationFee: 4000,
      about: "Cardiologist with expertise in heart disease treatment and prevention",
      availability: "AVAILABLE",
      doctorAvailabilityDates: {
        create: [
          {
            date: new Date("2026-03-05"),
            doctorTimeSlots: {
              create: [
                { startTime: "10:00", endTime: "10:30" },
                { startTime: "10:30", endTime: "11:00" },
                { startTime: "11:00", endTime: "11:30" },
              ],
            },
          },
          {
            date: new Date("2026-03-06"),
            doctorTimeSlots: {
              create: [
                { startTime: "14:00", endTime: "14:30" },
                { startTime: "14:30", endTime: "15:00" },
                { startTime: "15:00", endTime: "15:30" },
              ],
            },
          },
          {
            date: new Date("2026-03-09"),
            doctorTimeSlots: {
              create: [
                { startTime: "09:00", endTime: "09:30" },
                { startTime: "09:30", endTime: "10:00" },
                { startTime: "10:00", endTime: "10:30" },
                { startTime: "10:30", endTime: "11:00" },
              ],
            },
          },
          {
            date: new Date("2026-03-10"),
            doctorTimeSlots: {
              create: [
                { startTime: "13:00", endTime: "13:30" },
                { startTime: "13:30", endTime: "14:00" },
                { startTime: "14:00", endTime: "14:30" },
                { startTime: "14:30", endTime: "15:00" },
                { startTime: "15:00", endTime: "15:30" },
              ],
            },
          },
        ],
      },
    },
  });

}
