import AllDoctorsListing from '@/components/patient/Doctors/AllDoctorsListing'
import React from 'react'


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
  {
    name: 'Dr. Olivia Brown',
    specialization: 'Pediatrician',
    experience: '7 Years',
    consultationFee: 3500,
    imageUrl: 'https://res.cloudinary.com/duplkba46/image/upload/v1770477429/doctors/urff9i3wmbk8atfkqacg.jpg',
  },
  {
    name: 'Dr. William Taylor',
    specialization: 'Neurologist',
    experience: '12 Years',
    consultationFee: 6000,
    imageUrl: 'https://res.cloudinary.com/duplkba46/image/upload/v1770477851/doctors/nq5dmoaxmundpedjdnck.jpg',
  },
  {
    name: 'Dr. Sophia Martinez',
    specialization: 'Ophthalmologist',
    experience: '9 Years',
    consultationFee: 4500,
    imageUrl: 'https://res.cloudinary.com/duplkba46/image/upload/v1770477136/doctors/erjmc7iolrkzockppfvr.png',
  },
]

const Page = async () => {
  // In production, fetch data from your Prisma client
  // const doctors = await prisma.doctor.findMany({ ... })
  
  const doctors = dummyDoctors

  return (
    <main className="min-h-screen mt-16">
      <AllDoctorsListing doctors={doctors} />
    </main>
  )
}

export default Page