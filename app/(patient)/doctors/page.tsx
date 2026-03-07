
import AllDoctorsListing from '@/components/patient/Doctors/AllDoctorsListing'
import { fetchAllDoctors } from '@/server/actions/doctor.action'


const Page = async () => {

  // In production, fetch data from your Prisma client
  // const doctors = await prisma.doctor.findMany({ ... })
  
  const doctors = await fetchAllDoctors();

  return (
    <main className="min-h-screen mt-16">
      <AllDoctorsListing doctors={doctors} />
    </main>
  )
}

export default Page