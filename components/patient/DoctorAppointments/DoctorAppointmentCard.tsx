'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import {
  CalendarDays, Clock, MapPin, User, Mail, Phone,
  CreditCard, Banknote, CheckCircle2, AlertCircle,
  Loader2, XCircle, ChevronDown, ChevronUp, Stethoscope,
  BadgeCheck,
} from 'lucide-react'
import { DoctorAppointmentCardProps } from '@/types/doctorAppointment'
import { PaymentMethod, PaymentStatus } from '@/app/generated/prisma/enums'

// ─── Types (from Prisma include query) ───────────────────────────────────────

// type PaymentStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
// type PaymentMethod = 'ONLINE' | 'CASH'
// type GenderRole    = 'MALE' | 'FEMALE' | 'OTHER'


// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmtDate = (d: Date) =>
  new Date(d).toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

const fmtCreated = (d: Date) =>
  new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  })

const paymentStatusConfig: Record<PaymentStatus, { label: string; cls: string; icon: React.ElementType }> = {
  PENDING:    { label: 'Pending',    cls: 'bg-amber-50 text-amber-600 border-amber-200',   icon: Loader2 },
  PROCESSING: { label: 'Processing', cls: 'bg-blue-50 text-blue-600 border-blue-200',     icon: Loader2 },
  COMPLETED:  { label: 'Completed',  cls: 'bg-emerald-50 text-emerald-600 border-emerald-200', icon: CheckCircle2 },
  FAILED:     { label: 'Failed',     cls: 'bg-rose-50 text-rose-600 border-rose-200',     icon: XCircle },
}

const methodIcon: Record<PaymentMethod, React.ElementType> = {
  ONLINE: CreditCard,
  CASH:   Banknote,
}

// ─── Component ────────────────────────────────────────────────────────────────

const DoctorAppointmentCard: React.FC<DoctorAppointmentCardProps> = ({ appointment }) => {
  const [expanded, setExpanded] = useState(false)
  const { doctor, timeSlot, patientDetail, payment, createdAt } = appointment

  const paymentCfg = payment ? paymentStatusConfig[payment.status] : null
  const PayStatusIcon = paymentCfg?.icon ?? AlertCircle
  const MethodIcon = payment ? methodIcon[payment.method] : CreditCard

  return (
    <div className="bg-white border border-[#E8EEF4] rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_4px_20px_rgba(20,184,166,0.1)] hover:border-[#14B8A6]/20">

      {/* ── Main Row ──────────────────────────────────────────────────── */}
      <div className="p-5">
        <div className="flex flex-col sm:flex-row gap-4 items-start">

          {/* Doctor avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-teal-50 ring-2 ring-[#E8EEF4]">
              {doctor.imageUrl ? (
                <Image src={doctor.imageUrl} alt={doctor.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-[#14B8A6]" />
                </div>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#14B8A6] rounded-full flex items-center justify-center">
              <BadgeCheck className="w-3 h-3 text-white" />
            </div>
          </div>

          {/* Doctor info + appointment meta */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
              <div>
                <h3 className="font-bold text-[#0F172A] text-base leading-tight">{doctor.name}</h3>
                <span className="text-xs font-semibold text-[#14B8A6] bg-teal-50 border border-teal-100 px-2 py-0.5 rounded-full">
                  {doctor.specialization}
                </span>
              </div>

              {/* Payment status badge */}
              {paymentCfg && (
                <div className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${paymentCfg.cls}`}>
                  <PayStatusIcon className="w-3 h-3" />
                  {paymentCfg.label}
                </div>
              )}
            </div>

            {/* Date + time + location */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <CalendarDays className="w-3.5 h-3.5 text-[#14B8A6]" />
                {fmtDate(timeSlot.availabilityDate.date)}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Clock className="w-3.5 h-3.5 text-[#14B8A6]" />
                {timeSlot.startTime} – {timeSlot.endTime}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-[#14B8A6]" />
                <span className="line-clamp-1">{doctor.location}</span>
              </div>
            </div>
          </div>

          {/* Fee + expand toggle */}
          <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-1 flex-shrink-0">
            <div className="text-right">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Fee</p>
              <p className="font-bold text-[#0F172A] text-lg leading-none">₹{doctor.consultationFee}</p>
            </div>
            <button
              onClick={() => setExpanded(p => !p)}
              className="flex items-center gap-1 text-xs text-[#14B8A6] font-semibold hover:text-[#0f9a8e] transition-colors mt-1"
            >
              {expanded ? 'Less' : 'Details'}
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Expanded Detail Panel ──────────────────────────────────────── */}
      {expanded && (
        <div className="border-t border-[#F1F5F9] bg-[#FAFBFC] px-5 py-5 grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* Patient Detail — PatientDetail schema */}
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <User className="w-3 h-3" /> Patient Info
            </p>
            {patientDetail ? (
              <div className="space-y-2">
                {[
                  { label: 'Name',   value: patientDetail.fullName },
                  { label: 'Age',    value: String(patientDetail.age) },
                  { label: 'Gender', value: patientDetail.gender },
                  { label: 'Phone',  value: patientDetail.phoneNumber, icon: Phone },
                  { label: 'Email',  value: patientDetail.email, icon: Mail },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">{label}</span>
                    <span className="text-xs font-medium text-[#0F172A] flex items-center gap-1">
                      {Icon && <Icon className="w-3 h-3 text-[#14B8A6]" />}
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No patient details recorded.</p>
            )}
          </div>

          {/* Doctor Detail */}
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Stethoscope className="w-3 h-3" /> Doctor Info
            </p>
            <div className="space-y-2">
              {[
                { label: 'Name',           value: doctor.name },
                { label: 'Qualification',  value: doctor.qualification },
                { label: 'Location',       value: doctor.location },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-start justify-between gap-3">
                  <span className="text-xs text-slate-400 flex-shrink-0">{label}</span>
                  <span className="text-xs font-medium text-[#0F172A] text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment — Payment schema */}
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <CreditCard className="w-3 h-3" /> Payment
            </p>
            {payment ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-slate-400">Amount</span>
                  <span className="text-xs font-bold text-[#0F172A]">₹{payment.amount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">Method</span>
                  <span className="text-xs font-medium text-[#0F172A] flex items-center gap-1">
                    <MethodIcon className="w-3 h-3 text-[#14B8A6]" />
                    {payment.method}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">Status</span>
                  {paymentCfg && (
                    <div className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${paymentCfg.cls}`}>
                      <PayStatusIcon className="w-2.5 h-2.5" />
                      {paymentCfg.label}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No payment record found.</p>
            )}

            <p className="text-[10px] text-slate-300 mt-4">
              Booked on {fmtCreated(createdAt)}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default DoctorAppointmentCard