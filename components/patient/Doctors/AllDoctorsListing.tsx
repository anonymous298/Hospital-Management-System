'use client'

import React from 'react'
import DoctorCard from '../Landing/DoctorCard'


interface Doctor {
  name: string
  specialization: string
  experience: string
  consultationFee: number
  imageUrl: string
}

interface Props {
  doctors: Doctor[]
}

const AllDoctorsListing: React.FC<Props> = ({ doctors }) => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-[#0F172A] mb-8 text-center">Our Doctors</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {doctors.map((doctor, idx) => (
            <DoctorCard
              key={idx}
              name={doctor.name}
              specialization={doctor.specialization}
              experience={doctor.experience}
              consultationFee={doctor.consultationFee}
              imageUrl={doctor.imageUrl}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default AllDoctorsListing