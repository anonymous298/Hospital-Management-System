'use client'

import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

interface DoctorCardProps {
  name: string
  specialization: string
  experience: string
  consultationFee: number
  imageUrl?: string
}

const DoctorCard: React.FC<DoctorCardProps> = ({
  name,
  specialization,
  experience,
  consultationFee,
  imageUrl = '/images/doctor-placeholder.jpg', // dummy placeholder
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6 flex flex-col items-center text-center">
      <div className="w-24 h-24 mb-4 rounded-full overflow-hidden">
        <Image src={imageUrl} alt={name} width={96} height={96} />
      </div>
      <h3 className="text-xl font-semibold text-[#0F172A]">{name}</h3>
      <p className="text-[#14B8A6] font-medium">{specialization}</p>
      <p className="text-[#64748B] mt-2">{experience} experience</p>
      <p className="text-[#0F172A] font-semibold mt-2">Fee: ${consultationFee}</p>
      <Button className="mt-4 w-full bg-[#14B8A6] hover:bg-[#0fa391]">Book Appointment</Button>
    </div>
  )
}

export default DoctorCard