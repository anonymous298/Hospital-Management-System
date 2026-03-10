export const dynamic = 'force-dynamic'

import AllDoctorAppointments from "@/components/patient/DoctorAppointments/AllDoctorApointments";
import NotLoggedIn from "@/components/patient/DoctorAppointments/NotLoggedIn";
import { fetchAllCurrentUserDoctorAppointments } from "@/server/actions/doctorAppointment.action"
import { currentUser } from "@clerk/nextjs/server";


const Page = async () => {

    const user = await currentUser();

    if (!user) return <NotLoggedIn/>;

    // Fetching ALl Current User Doctor Appointments
    const doctorAppointments = await fetchAllCurrentUserDoctorAppointments();

  return (
    <div>
      <AllDoctorAppointments appointments={doctorAppointments}/>
    </div>
  )
}

export default Page
