export const dynamic = "force-dynamic"

import DoctorProfilePage from '@/components/doctorAdmin/Profile/DoctorProfileClientComponent'
import { fetchDoctorProfileBasedOnDoctorId } from '@/server/actions/doctor.action'
import React from 'react'

const page = async () => {

  const doctorProfileData = await fetchDoctorProfileBasedOnDoctorId();
  
  return (
    <div>
      <DoctorProfilePage DoctorProfileData={doctorProfileData} />
    </div>
  )
}

export default page
