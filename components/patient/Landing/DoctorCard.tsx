'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Briefcase, Users, TrendingUp, IndianRupee, ChevronRight, Stethoscope } from 'lucide-react'
import { DoctorAvailabilityStatus } from '@/app/generated/prisma/enums'

// ─── Type — matches Prisma Doctor schema exactly ──────────────────────────────
// `name` and `imageUrl` are UI helpers passed from page (sourced from Clerk / external)
// All other fields are direct Prisma Doctor model columns

interface DoctorCardProps {
  id: string                                          // used for /doctors/[id] route
  name: string                                        // UI helper (not in Prisma Doctor model)
  imageUrl?: string                                   // UI helper (not in Prisma Doctor model)
  specialization: string
  qualification: string
  location: string
  experience: string                                  // String in schema e.g. "12 years"
  patients: string                                    // String in schema e.g. "5,000+"
  success: string                                     // String in schema e.g. "97%"
  consultationFee: number                             // Int in schema
  availability: DoctorAvailabilityStatus         // DoctorAvailabilityStatus enum
}

// ─── Component ────────────────────────────────────────────────────────────────

const DoctorCard: React.FC<DoctorCardProps> = ({
  id,
  name,
  imageUrl,
  specialization,
  qualification,
  location,
  experience,
  patients,
  success,
  consultationFee,
  availability,
}) => {
  const isAvailable = availability === 'AVAILABLE'

  return (
    <div className="group relative bg-white border border-[#E8EEF4] rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgba(20,184,166,0.12)] hover:-translate-y-1 hover:border-[#14B8A6]/30 flex flex-col">

      {/* ── Top image section ─────────────────────────────────────────── */}
      <div className="relative h-48 bg-gradient-to-br from-[#F0FDFA] to-[#E6F7F5] overflow-hidden flex-shrink-0">

        {/* Subtle pattern */}
        <div className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 80%, #14B8A6 1px, transparent 1px),
                              radial-gradient(circle at 80% 20%, #14B8A6 1px, transparent 1px)`,
            backgroundSize: '28px 28px',
          }}
        />

        {/* Doctor image */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-28 h-28">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover object-top rounded-full ring-4 ring-white shadow-lg"
            />
          ) : (
            <div className="w-full h-full rounded-full ring-4 ring-white shadow-lg bg-teal-100 flex items-center justify-center">
              <Stethoscope className="w-10 h-10 text-[#14B8A6]" />
            </div>
          )}
        </div>

        {/* Availability badge — DoctorAvailabilityStatus enum */}
        <div className={`absolute top-3 right-3 flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest ${
          isAvailable
            ? 'bg-emerald-500 text-white'
            : 'bg-slate-400 text-white'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-white animate-pulse' : 'bg-slate-200'}`} />
          {isAvailable ? 'Available' : 'Unavailable'}
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-5 pt-6">

        {/* Name + Specialization */}
        <div className="text-center mb-4">
          <h3 className="font-bold text-[#0F172A] text-base leading-tight mb-0.5">{name}</h3>
          <span className="inline-block text-xs font-semibold text-[#14B8A6] bg-teal-50 border border-teal-100 px-2.5 py-0.5 rounded-full">
            {specialization}
          </span>
          <p className="text-[11px] text-slate-400 mt-1.5 leading-tight line-clamp-1">{qualification}</p>
        </div>

        {/* Location — from Doctor.location */}
        <div className="flex items-center justify-center gap-1 text-slate-400 text-xs mb-4">
          <MapPin className="w-3 h-3 text-[#14B8A6] flex-shrink-0" />
          <span className="line-clamp-1">{location}</span>
        </div>

        {/* Stats row — experience, patients, success (all String in schema) */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { icon: Briefcase,  label: 'Exp',      value: experience },
            { icon: Users,      label: 'Patients',  value: patients },
            { icon: TrendingUp, label: 'Success',   value: success },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex flex-col items-center bg-[#F8FAFC] border border-[#EEF2F7] rounded-xl py-2 px-1">
              <Icon className="w-3.5 h-3.5 text-[#14B8A6] mb-0.5" />
              <span className="text-[10px] text-slate-400 leading-none">{label}</span>
              <span className="font-bold text-[11px] text-[#0F172A] mt-0.5 text-center leading-tight">{value}</span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-[#F1F5F9] mb-4" />

        {/* Consultation fee — Doctor.consultationFee (Int) */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-slate-400">Consultation Fee</span>
          <div className="flex items-center gap-0.5 font-bold text-[#0F172A] text-base">
            <IndianRupee className="w-3.5 h-3.5" />
            {consultationFee}
          </div>
        </div>

        {/* CTA — links to /doctors/[id] using Doctor.id */}
        <Link
          href={`/doctors/${id}`}
          className={`mt-auto w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group/btn ${
            isAvailable
              ? 'bg-[#14B8A6] hover:bg-[#0f9a8e] text-white shadow-sm shadow-teal-100'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed pointer-events-none'
          }`}
        >
          {isAvailable ? 'Book Appointment' : 'Not Available'}
          {isAvailable && (
            <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
          )}
        </Link>
      </div>
    </div>
  )
}

export default DoctorCard


// ─── Usage example (in your /doctors page) ───────────────────────────────────
//
// const doctors = await prisma.doctor.findMany({ ... })
//
// {doctors.map(doctor => (
//   <DoctorCard
//     key={doctor.id}
//     id={doctor.id}
//     name={doctor.name}             ← from Clerk / external source
//     imageUrl={doctor.imageUrl}     ← from Clerk / external source
//     specialization={doctor.specialization}
//     qualification={doctor.qualification}
//     location={doctor.location}
//     experience={doctor.experience}
//     patients={doctor.patients}
//     success={doctor.success}
//     consultationFee={doctor.consultationFee}
//     availability={doctor.availability}
//   />
// ))}