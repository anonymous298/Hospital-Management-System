export const dynamic = "force-dynamic"

import DoctorAppointmentsPage from '@/components/doctorAdmin/Appointments/AppointmentClientComponent';
import { fetchAllDoctorAppointmentsByDoctorId } from '@/server/actions/doctorAppointment.action';
import React from 'react'

const Page = async () => {

  const appointmentData = await fetchAllDoctorAppointmentsByDoctorId() ;

  return (
    <div>
      <DoctorAppointmentsPage appointmentData={appointmentData} />
    </div>
  )
}

export default Page
