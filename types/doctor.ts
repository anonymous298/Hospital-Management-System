import { DoctorAvailabilityStatus } from "@/app/generated/prisma/enums"

export interface DoctorTimeSlot {
  id: string
  availabilityDateId: string
  startTime: string
  endTime: string
  doctorAppointment?: { id: string } | null
}

export interface DoctorAvailabilityDate {
  id: string
  doctorId: string
  date: Date
  doctorTimeSlots: DoctorTimeSlot[]
}

export interface Doctor {
  id: string
  imageUrl?: string | null
  name: string                          // UI helper (from Clerk / external)
  specialization: string
  qualification: string
  location: string
  success: string                       // String in schema e.g. "97%"
  experience: string                    // String in schema e.g. "14 years"
  patients: string                      // String in schema e.g. "8,200+"
  about: string
  consultationFee: number               // Int in schema
  availability: DoctorAvailabilityStatus
  doctorAvailabilityDates: DoctorAvailabilityDate[]
}