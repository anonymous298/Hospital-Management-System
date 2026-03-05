'use client'

import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Calendar } from 'lucide-react'

interface TimeSlot {
  startTime: string
  endTime: string
  available: boolean
}

interface Doctor {
  id: string
  name: string
  specialization: string
  experience: string
  consultationFee: number
  imageUrl: string
  about: string
  timeSlots?: TimeSlot[]
}

interface DynamicDoctorProps {
  doctor: Doctor
}

const DynamicDoctor: React.FC<DynamicDoctorProps> = ({ doctor }) => {
  return (
    <div className="container mx-auto px-6 py-16">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Doctor Image */}
        <div className="w-full md:w-1/3 flex justify-center">
          <Image
            src={doctor.imageUrl}
            alt={doctor.name}
            width={300}
            height={300}
            className="rounded-xl object-cover shadow-lg"
          />
        </div>

        {/* Doctor Info */}
        <div className="w-full md:w-2/3 flex flex-col gap-4">
          <h1 className="text-4xl font-bold text-[#0F172A]">{doctor.name}</h1>
          <p className="text-[#14B8A6] font-semibold text-lg">{doctor.specialization}</p>
          <p className="text-[#64748B]">Experience: {doctor.experience}</p>
          <p className="text-[#64748B]">Consultation Fee: ₹{doctor.consultationFee}</p>
          <p className="text-[#0F172A]">{doctor.about}</p>

          {/* Time Slots */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#14B8A6]" /> Available Slots
            </h3>
            <div className="flex flex-wrap gap-3">
              {doctor.timeSlots?.length
                ? doctor.timeSlots.map((slot, idx) => (
                    <Button
                      key={idx}
                      variant={slot.available ? 'default' : 'destructive'}
                      disabled={!slot.available}
                      className="px-4 py-2 text-sm"
                    >
                      {slot.startTime} - {slot.endTime}
                    </Button>
                  ))
                : 'No slots available today'}
            </div>
          </div>

          {/* Book Appointment */}
          <div className="mt-6">
            <Button className="bg-[#14B8A6] text-white px-6 py-3 rounded-lg hover:bg-[#0f958d] transition">
              Book Appointment
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DynamicDoctor