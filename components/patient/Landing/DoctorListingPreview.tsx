import React from 'react'
import DoctorCard from './DoctorCard'

const dummyDoctors = [
  {
    name: 'Dr. Sarah Johnson',
    specialization: 'Dentist',
    experience: '6 Years',
    consultationFee: 3000,
    imageUrl: 'https://res.cloudinary.com/duplkba46/image/upload/v1770477280/doctors/jfrdnomnt4yveeglqprc.jpg',
  },
  {
    name: 'Dr. John Smith',
    specialization: 'Cardiologist',
    experience: '10 Years',
    consultationFee: 5000,
    imageUrl: 'https://res.cloudinary.com/duplkba46/image/upload/v1770476988/doctors/h8lw6hkagtm8mnvtcr15.png',
  },
  {
    name: 'Dr. Emily Davis',
    specialization: 'Dermatologist',
    experience: '5 Years',
    consultationFee: 2500,
    imageUrl: 'https://res.cloudinary.com/duplkba46/image/upload/v1770477684/doctors/lf19aocaldc1whngvvbo.png',
  },
  {
    name: 'Dr. Michael Lee',
    specialization: 'Orthopedic',
    experience: '8 Years',
    consultationFee: 4000,
    imageUrl: 'https://res.cloudinary.com/duplkba46/image/upload/v1770476814/doctors/tnc1rxr9by6ugazabs9j.png',
  },
]

const DoctorListingPreview = () => {
  return (
    <section className="py-20 bg-[#F8FAFC]">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-[#0F172A] mb-4">Meet Our Doctors</h2>
        <p className="text-[#64748B] mb-12 max-w-xl mx-auto">
          Our professional team of doctors is ready to provide the best healthcare experience.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {dummyDoctors.map((doctor, idx) => (
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

export default DoctorListingPreview