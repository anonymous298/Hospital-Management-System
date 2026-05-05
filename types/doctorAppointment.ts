import { PatientDetail, Payment } from "@/app/generated/prisma/client"
import { AppointmentStatus, GenderRole, PaymentMethod, PaymentStatus } from "@/app/generated/prisma/enums"

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

export interface DoctorAppointment {
  id: string
  createdAt: string
  status: AppointmentStatus
  patientDetail: PatientDetail
  payment: Payment
  timeSlot: {
    startTime: string
    endTime: string
    period: "AM" | "PM"
    availabilityDate: { 
      id: string;
      doctorId: string;
      createdAt: Date;
      updatedAt: Date;
      date: Date;
     }
  }
}