export const dynamic = 'force-dynamic'

import AllDoctorAppointments from "@/components/patient/DoctorAppointments/AllDoctorApointments";
import { fetchAllCurrentUserDoctorAppointments } from "@/server/actions/doctorAppointment.action"


const Page = async () => {

    // Fetching ALl Current User Doctor Appointments
    const doctorAppointments = await fetchAllCurrentUserDoctorAppointments();

  return (
    <div>
      <AllDoctorAppointments appointments={doctorAppointments}/>
    </div>
  )
}

export default Page
