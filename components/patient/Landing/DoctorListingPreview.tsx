
import { fetchLimitedDoctors } from '@/server/actions/doctor.seed'
import DoctorCard from './DoctorCard'
import { DoctorAvailabilityStatus } from '@/app/generated/prisma/enums'

// const dummyDoctors = [
//   {
//     id: '2dfsdff2f2fd9d9ds9f',
//     name: 'Dr. Sarah Johnson',
//     specialization: 'Dentist',
//     experience: '6 Years',
//     consultationFee: 3000,
//     patients: '3,000+',
//     success: '95%',
//     imageUrl: 'https://res.cloudinary.com/duplkba46/image/upload/v1770477280/doctors/jfrdnomnt4yveeglqprc.jpg',
//     availability: DoctorAvailabilityStatus.AVAILABLE,
//     location: 'Karachi',
//     qualification: 'BDS, MDS - Prosthodontics',
//   },
//   {
//     id: '9dfsdff2f2fd9d9ds9f',
//     name: 'Dr. John Smith',
//     specialization: 'Cardiologist',
//     experience: '10 Years',
//     consultationFee: 5000,
//     patients: '10,000+',
//     success: '98%',
//     imageUrl: 'https://res.cloudinary.com/duplkba46/image/upload/v1770476988/doctors/h8lw6hkagtm8mnvtcr15.png',
//     availability: DoctorAvailabilityStatus.AVAILABLE,
//     location: 'Islamabad',
//     qualification: 'MBBS, MD - Cardiology',
//   },
//   {
//     id: '5dfsdff2f2fd9d9ds9f',
//     name: 'Dr. Emily Davis',
//     specialization: 'Dermatologist',
//     experience: '5 Years',
//     consultationFee: 2500,
//     patients: '2,000+',
//     success: '92%',
//     imageUrl: 'https://res.cloudinary.com/duplkba46/image/upload/v1770477684/doctors/lf19aocaldc1whngvvbo.png',
//     availability: DoctorAvailabilityStatus.AVAILABLE,
//     location: 'Lahore',
//     qualification: 'MBBS, MD - Dermatology',
//   },
//   {
//     id: '1dfsdff2f2fd9d9ds9f',
//     name: 'Dr. Michael Lee',
//     specialization: 'Orthopedic',
//     experience: '8 Years',
//     consultationFee: 4000,
//     patients: '5,000+',
//     success: '96%',
//     imageUrl: 'https://res.cloudinary.com/duplkba46/image/upload/v1770476814/doctors/tnc1rxr9by6ugazabs9j.png',
//     availability: DoctorAvailabilityStatus.UNAVAILABLE,
//     location: 'Multan',
//     qualification: 'MBBS, MS - Orthopedics',
//   },
// ]

const DoctorListingPreview = async () => {

  // Fetching Limited Doctors Data From Doctor Table From DB
  const doctors = await fetchLimitedDoctors();

  return (
    <section className="py-20 bg-[#F8FAFC]">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-[#0F172A] mb-4">Meet Our Doctors</h2>
        <p className="text-[#64748B] mb-12 max-w-xl mx-auto">
          Our professional team of doctors is ready to provide the best healthcare experience.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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

export default DoctorListingPreview