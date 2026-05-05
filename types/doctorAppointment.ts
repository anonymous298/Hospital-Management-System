import { PatientDetail, Payment } from "@/app/generated/prisma/client"
import { AppointmentStatus, DoctorAvailabilityStatus, GenderRole, PaymentMethod, PaymentStatus, UserRole } from "@/app/generated/prisma/enums"

export interface DoctorAppointmentData {
  id: string
  createdAt: Date
  updatedAt: Date

  user: {
    id: string
    name: string | null
    email: string
    imageUrl: string | null
    username: string
  }

  doctor: {
    id: string
    name: string
    imageUrl: string | null
    specialization: string
    qualification: string
    location: string
    consultationFee: number
  }

  timeSlot: {
    id: string
    startTime: string
    endTime: string
    availabilityDate: {
      id: string
      date: Date
    }
  }

  patientDetail: {
    id: string
    fullName: string
    age: number
    phoneNumber: string
    gender: GenderRole
    email: string
  } | null

  payment: {
    id: string
    amount: number
    status: PaymentStatus
    method: PaymentMethod
  } | null
}

export interface DoctorAppointmentCardProps {
  appointment: DoctorAppointmentData
}

export interface AllDoctorAppointmentsProps {
  appointments: DoctorAppointmentData[]
}

export interface DoctorAppointmentWithDetails {
  id: string
  userId: string
  doctorId: string
  timeSlotId: string
  status: AppointmentStatus
  createdAt: Date
  updatedAt: Date

  user: {
    id: string
    clerkId: string
    doctorId: string | null
    username: string
    email: string
    name: string | null
    imageUrl: string | null
    role: UserRole
    createdAt: Date
    updatedAt: Date
  }

  doctor: {
    id: string
    name: string
    specialization: string
    qualification: string
    location: string
    success: string
    experience: string
    patients: string
    about: string
    consultationFee: number
    imageUrl: string | null
    availability: DoctorAvailabilityStatus
    createdAt: Date
    updatedAt: Date
  }

  timeSlot: {
    id: string
    availabilityDateId: string
    startTime: string
    endTime: string
    isBooked: boolean
    createdAt: Date
    updatedAt: Date
    availabilityDate: {
      id: string
      doctorId: string
      date: Date
      createdAt: Date
      updatedAt: Date
    }
  }

  patientDetail: {
    id: string
    doctorAppointmentId: string
    fullName: string
    age: number
    phoneNumber: string
    gender: GenderRole
    email: string
    createdAt: Date
    updatedAt: Date
  } | null

  payment: {
    id: string
    userId: string
    doctorId: string
    doctorAppointmentId: string
    amount: number
    status: PaymentStatus
    method: PaymentMethod
    createdAt: Date
    updatedAt: Date
  } | null
}