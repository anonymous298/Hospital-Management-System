'use client'

import React from 'react'
import DoctorCard from '../Landing/DoctorCard'
import { DoctorAvailabilityStatus } from '@/app/generated/prisma/enums'

interface Doctor {
  id: string                                          // used for /doctors/[id] route
  name: string                                        // UI helper (not in Prisma Doctor model)
  imageUrl?: string | null                                // UI helper (not in Prisma Doctor model)
  specialization: string
  qualification: string
  location: string
  experience: string                                  // String in schema e.g. "12 years"
  patients: string                                    // String in schema e.g. "5,000+"
  success: string                                     // String in schema e.g. "97%"
  consultationFee: number                             // Int in schema
  availability: DoctorAvailabilityStatus         // DoctorAvailabilityStatus enum
}

interface Props {
  doctors: Doctor[]
}

const AllDoctorsListing: React.FC<Props> = ({ doctors }) => {
  return (
    <section className=" bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-[#0F172A] mb-8 text-center">Our Doctors</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {doctors.map((doctor, idx) => (
            <DoctorCard
              key={idx}
              id={doctor.id}
              name={doctor.name}
              specialization={doctor.specialization}
              experience={doctor.experience}
              consultationFee={doctor.consultationFee}
              imageUrl={(doctor.imageUrl ?? "https://res.cloudinary.com/duplkba46/image/upload/v1770477280/doctors/jfrdnomnt4yveeglqprc.jpg")}
              availability={doctor.availability}
              patients={doctor.patients}
              success={doctor.success}
              location={doctor.location}
              qualification={doctor.qualification}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default AllDoctorsListing