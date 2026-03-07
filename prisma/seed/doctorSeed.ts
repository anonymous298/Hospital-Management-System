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
      name: "Dr. Ali Ahmed",
      imageUrl: "https://images.pexels.com/photos/8460094/pexels-photo-8460094.jpeg",
      specialization: "Neurologist",
      qualification: "BDS, MDS",
      location: "Smile Dental Care",
      success: "98%",
      experience: "10+ Years",
      patients: "70k+",
      consultationFee: 7000,
      about: "Neurologist with expertise in brain and nervous system disorders",
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
                { startTime: "11:30", endTime: "12:00" },
              ],
            },
          },
          {
            date: new Date("2026-03-03"),
            doctorTimeSlots: {
              create: [
                { startTime: "14:00", endTime: "14:30" },
                { startTime: "14:30", endTime: "15:00" },
                { startTime: "15:00", endTime: "15:30" },
                { startTime: "15:30", endTime: "16:00" },
              ],
            },
          },
          {
            date: new Date("2026-03-04"),
            doctorTimeSlots: {
              create: [
                { startTime: "09:00", endTime: "09:30" },
                { startTime: "09:30", endTime: "10:00" },
                { startTime: "10:00", endTime: "10:30" },
              ],
            },
          },
          {
            date: new Date("2026-03-07"),
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
