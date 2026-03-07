import { GenderRole } from "@/app/generated/prisma/enums"

export interface PatientFormData {
  fullName: string
  age: string
  phoneNumber: string
  gender: GenderRole | ''
  email: string
}


export interface FormProp {
    fullName: string
    age: number
    phoneNumber: string
    gender: GenderRole
    email: string
}