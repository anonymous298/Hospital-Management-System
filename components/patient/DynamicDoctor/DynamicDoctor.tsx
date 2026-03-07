'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import {
  MapPin, Star, Briefcase, Users, TrendingUp, ShieldCheck,
  Clock, CalendarDays, CheckCircle2, CreditCard, Banknote,
  User, Mail, Phone, ChevronDown, BadgeCheck, AlertCircle,
  Loader2Icon,
} from 'lucide-react'

// ─── Types (Prisma schema) ────────────────────────────────────────────────────

type DoctorAvailabilityStatus = 'AVAILABLE' | 'UNAVAILABLE'
type GenderRole = 'MALE' | 'FEMALE' | 'OTHER'
type PaymentMethod = 'ONLINE' | 'CASH'
type PaymentStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'

interface DoctorTimeSlot {
  id: string
  availabilityDateId: string
  startTime: string
  endTime: string
  doctorAppointment?: { id: string } | null
}

interface DoctorAvailabilityDate {
  id: string
  doctorId: string
  date: Date
  doctorTimeSlots: DoctorTimeSlot[]
}

interface Doctor {
  id: string
  imageUrl?: string
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

interface PatientFormData {
  fullName: string
  age: string
  phoneNumber: string
  gender: GenderRole | ''
  email: string
}

// ─── Dummy Data (hardcoded, replace with real fetch later) ────────────────────

const dummyDoctor: Doctor = {
  id: 'clx1a2b3c4d5',
  name: 'Dr. Arjun Mehta',
  imageUrl: 'https://randomuser.me/api/portraits/men/75.jpg',
  specialization: 'Cardiologist',
  qualification: 'MBBS · MD (Cardiology) · DM — AIIMS New Delhi',
  location: 'Apollo Hospital, Jubilee Hills, Hyderabad',
  success: '97%',
  experience: '14 yrs',
  patients: '8,200+',
  about:
    'Dr. Arjun Mehta is a senior interventional cardiologist with over 14 years of experience managing complex cardiovascular conditions including coronary artery disease, heart failure, and arrhythmias. He completed his DM in Cardiology from AIIMS New Delhi and is a Fellow of the Cardiological Society of India. Known for his patient-first philosophy, Dr. Mehta combines advanced diagnostics with personalised treatment plans to deliver consistently excellent outcomes.',
  consultationFee: 800,
  availability: 'AVAILABLE',
  doctorAvailabilityDates: [
    {
      id: 'date_01',
      doctorId: 'clx1a2b3c4d5',
      date: new Date('2025-07-14'),
      doctorTimeSlots: [
        { id: 'sl_01', availabilityDateId: 'date_01', startTime: '09:00', endTime: '09:30', doctorAppointment: { id: 'apt_1' } },
        { id: 'sl_02', availabilityDateId: 'date_01', startTime: '09:30', endTime: '10:00', doctorAppointment: null },
        { id: 'sl_03', availabilityDateId: 'date_01', startTime: '10:00', endTime: '10:30', doctorAppointment: null },
        { id: 'sl_04', availabilityDateId: 'date_01', startTime: '10:30', endTime: '11:00', doctorAppointment: { id: 'apt_2' } },
        { id: 'sl_05', availabilityDateId: 'date_01', startTime: '11:00', endTime: '11:30', doctorAppointment: null },
        { id: 'sl_06', availabilityDateId: 'date_01', startTime: '11:30', endTime: '12:00', doctorAppointment: null },
      ],
    },
    {
      id: 'date_02',
      doctorId: 'clx1a2b3c4d5',
      date: new Date('2025-07-16'),
      doctorTimeSlots: [
        { id: 'sl_07', availabilityDateId: 'date_02', startTime: '14:00', endTime: '14:30', doctorAppointment: null },
        { id: 'sl_08', availabilityDateId: 'date_02', startTime: '14:30', endTime: '15:00', doctorAppointment: null },
        { id: 'sl_09', availabilityDateId: 'date_02', startTime: '15:00', endTime: '15:30', doctorAppointment: { id: 'apt_3' } },
        { id: 'sl_10', availabilityDateId: 'date_02', startTime: '15:30', endTime: '16:00', doctorAppointment: null },
      ],
    },
    {
      id: 'date_03',
      doctorId: 'clx1a2b3c4d5',
      date: new Date('2025-07-18'),
      doctorTimeSlots: [
        { id: 'sl_11', availabilityDateId: 'date_03', startTime: '10:00', endTime: '10:30', doctorAppointment: null },
        { id: 'sl_12', availabilityDateId: 'date_03', startTime: '10:30', endTime: '11:00', doctorAppointment: null },
        { id: 'sl_13', availabilityDateId: 'date_03', startTime: '17:00', endTime: '17:30', doctorAppointment: null },
      ],
    },
  ],
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtDay   = (d: Date) => new Date(d).toLocaleDateString('en-IN', { weekday: 'short' })
const fmtDate  = (d: Date) => new Date(d).getDate()
const fmtMonth = (d: Date) => new Date(d).toLocaleDateString('en-IN', { month: 'short' })
const fmtFull  = (d: Date) => new Date(d).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
const isBooked = (s: DoctorTimeSlot) => !!s.doctorAppointment

// ─── Component ────────────────────────────────────────────────────────────────

export default function DynamicDoctor({ doctor = dummyDoctor }: { doctor?: Doctor }) {
  const [selectedDateIdx, setSelectedDateIdx] = useState(0)
  const [selectedSlot, setSelectedSlot] = useState<DoctorTimeSlot | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('ONLINE')
  const [form, setForm] = useState<PatientFormData>({
    fullName: '', age: '', phoneNumber: '', gender: '', email: '',
  })

  const [isBooking, setIsBooking] = useState(false)

  const isAvailable   = doctor.availability === 'AVAILABLE'
  const currentDate   = doctor.doctorAvailabilityDates[selectedDateIdx]
  const isFormFilled  = form.fullName && form.age && form.phoneNumber && form.gender && form.email && selectedSlot

  const handleForm = (field: keyof PatientFormData, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const tempDeleteMe = async () => {
    setIsBooking(true)
    setTimeout(() => {
        setIsBooking(false)
    }, 2000);
  }

  // shared input style
  const inputCls = `w-full bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/40 focus:border-[#14B8A6] transition`

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Outfit:wght@300;400;500;600;700&display=swap');
        .dp-root { font-family: 'Outfit', sans-serif; color: #0F172A; }
        .dp-root .serif { font-family: 'Instrument Serif', Georgia, serif; }
        .slot-btn { transition: all 0.15s ease; }
        .slot-btn:not(:disabled):hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(20,184,166,0.15); }
        .date-pill { transition: all 0.18s ease; }
        .date-pill:hover:not(.date-active) { border-color: #14B8A6; color: #14B8A6; }
        .fade-up { animation: fadeUp 0.45s ease both; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        .ping-dot { display:inline-block; width:8px; height:8px; border-radius:50%; background:#14B8A6; margin-right:6px; animation: ping 1.8s ease-in-out infinite; }
        @keyframes ping { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.7)} }
      `}</style>

      <div className="dp-root w-full p-3 py-10 bg-[#F8FAFC] min-h-screen">
        <div className="container max-w-7xl mx-auto flex flex-col gap-10">

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 1 — Doctor Info  (image left · info right)
          ═══════════════════════════════════════════════════════════════ */}
          <div className="doctorInfo grid grid-cols-1 gap-5 md:grid-cols-10">

            {/* ── LEFT: Doctor Image (sticky) ── */}
            <div className="doctorImg col-span-1 md:col-span-4 md:sticky md:top-25 fade-up">
              <div className="relative w-full h-[420px] rounded-3xl overflow-hidden shadow-xl">
                {doctor.imageUrl ? (
                  <Image src={doctor.imageUrl} alt={doctor.name} fill className="object-cover object-top" />
                ) : (
                  <div className="w-full h-full bg-teal-50 flex items-center justify-center">
                    <User className="w-24 h-24 text-teal-200" />
                  </div>
                )}
                {/* gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/70 via-transparent to-transparent" />

                {/* Bottom info strip over image */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className={`inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-full mb-2 ${isAvailable ? 'bg-teal-500 text-white' : 'bg-rose-500 text-white'}`}>
                    {isAvailable
                      ? <><span className="ping-dot" />Accepting Patients</>
                      : <><AlertCircle className="w-3 h-3 mr-1.5" />Unavailable</>
                    }
                  </div>
                  <h2 className="serif text-2xl text-white font-semibold leading-tight">{doctor.name}</h2>
                  <p className="text-teal-300 text-sm font-medium">{doctor.specialization}</p>
                </div>
              </div>

              {/* Stats row below image */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                {[
                  { icon: Briefcase,  label: 'Experience', val: doctor.experience },
                  { icon: Users,      label: 'Patients',   val: doctor.patients },
                  { icon: TrendingUp, label: 'Success',    val: doctor.success },
                ].map(({ icon: Icon, label, val }) => (
                  <div key={label} className="bg-white border border-[#E5E7EB] rounded-2xl p-3 text-center shadow-sm">
                    <Icon className="w-4 h-4 text-[#14B8A6] mx-auto mb-1" />
                    <p className="text-xs text-slate-400 leading-none">{label}</p>
                    <p className="font-bold text-sm text-[#0F172A] mt-0.5">{val}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── RIGHT: Doctor Information ── */}
            <div className="docInformation col-span-1 md:col-span-6 h-fit fade-up" style={{ animationDelay: '0.1s' }}>
              <div className="bg-white border border-[#E5E7EB] rounded-3xl p-8 shadow-sm h-full">

                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <span className="text-xs font-semibold text-[#14B8A6] bg-teal-50 border border-teal-100 px-3 py-1 rounded-full uppercase tracking-widest">
                      {doctor.specialization}
                    </span>
                    <h1 className="serif text-3xl font-semibold text-[#0F172A] mt-3 mb-1">{doctor.name}</h1>
                    <p className="text-slate-400 text-sm">{doctor.qualification}</p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <p className="text-xs text-slate-400 mb-0.5">Consultation Fee</p>
                    <p className="serif text-3xl font-bold text-[#14B8A6]">₹{doctor.consultationFee}</p>
                    <p className="text-xs text-slate-400">per session</p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-slate-500 text-sm mb-6 pb-6 border-b border-[#F1F5F9]">
                  <MapPin className="w-4 h-4 text-[#14B8A6] flex-shrink-0" />
                  <span>{doctor.location}</span>
                </div>

                {/* About */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-4 bg-[#14B8A6] rounded-full" />
                    <h3 className="font-semibold text-[#0F172A] text-sm uppercase tracking-wider">About</h3>
                  </div>
                  <p className="text-slate-500 leading-relaxed text-sm">{doctor.about}</p>
                </div>

                {/* Highlights */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: ShieldCheck,   text: 'Verified & Licensed Doctor' },
                    { icon: Star,          text: '4.9 / 5 Patient Rating' },
                    { icon: BadgeCheck,    text: 'IMA Certified Specialist' },
                    { icon: CheckCircle2,  text: 'Digital Prescription Provided' },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-2.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl px-3 py-2.5">
                      <Icon className="w-4 h-4 text-[#14B8A6] flex-shrink-0" />
                      <span className="text-xs font-medium text-slate-600">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 2 — Appointment Creation
          ═══════════════════════════════════════════════════════════════ */}
          <div className="appointmentCreation flex flex-col gap-5">

            {/* ── Date + Time Slot Row ── */}
            <div className="dateSlotSelection flex flex-col md:flex-row w-full gap-5 fade-up" style={{ animationDelay: '0.15s' }}>

              {/* DATES (yellow → white) */}
              <div className="dates w-full md:w-1/2 bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 bg-teal-50 rounded-xl flex items-center justify-center">
                    <CalendarDays className="w-4 h-4 text-[#14B8A6]" />
                  </div>
                  <h2 className="font-semibold text-[#0F172A]">Select Date</h2>
                </div>

                {doctor.doctorAvailabilityDates.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-6">No dates available.</p>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {doctor.doctorAvailabilityDates.map((d, idx) => {
                      const active = selectedDateIdx === idx
                      const free   = d.doctorTimeSlots.filter(s => !isBooked(s)).length
                      return (
                        <button
                          key={d.id}
                          onClick={() => { setSelectedDateIdx(idx); setSelectedSlot(null) }}
                          className={`date-pill flex flex-col items-center w-[72px] py-3 rounded-2xl border font-medium transition ${
                            active
                              ? 'date-active bg-[#14B8A6] border-[#14B8A6] text-white shadow-lg shadow-teal-100'
                              : 'bg-[#F8FAFC] border-[#E5E7EB] text-slate-600'
                          }`}
                        >
                          <span className={`text-[10px] uppercase tracking-widest font-bold ${active ? 'text-teal-100' : 'text-slate-400'}`}>
                            {fmtDay(d.date)}
                          </span>
                          <span className={`text-2xl font-bold leading-tight ${active ? 'text-white' : 'text-[#0F172A]'}`}>
                            {fmtDate(d.date)}
                          </span>
                          <span className={`text-[11px] ${active ? 'text-teal-100' : 'text-slate-400'}`}>
                            {fmtMonth(d.date)}
                          </span>
                          <span className={`mt-1 text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${active ? 'bg-white/20 text-white' : 'bg-teal-50 text-teal-600'}`}>
                            {free} free
                          </span>
                        </button>
                      )
                    })}
                  </div>
                )}

                {currentDate && (
                  <p className="mt-4 text-xs text-slate-400 flex items-center gap-1.5">
                    <CalendarDays className="w-3 h-3" />
                    {fmtFull(currentDate.date)}
                  </p>
                )}
              </div>

              {/* TIME SLOTS (purple → white) */}
              <div className="timeslots w-full md:w-1/2 bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 bg-teal-50 rounded-xl flex items-center justify-center">
                    <Clock className="w-4 h-4 text-[#14B8A6]" />
                  </div>
                  <h2 className="font-semibold text-[#0F172A]">Select Time Slot</h2>
                </div>

                {!currentDate || currentDate.doctorTimeSlots.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-6">No slots for this date.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-2.5">
                    {currentDate.doctorTimeSlots.map(slot => {
                      const booked = isBooked(slot)
                      const active = selectedSlot?.id === slot.id
                      return (
                        <button
                          key={slot.id}
                          disabled={booked}
                          onClick={() => setSelectedSlot(slot)}
                          className={`slot-btn flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium ${
                            booked
                              ? 'bg-[#F8FAFC] border-[#E5E7EB] text-slate-300 cursor-not-allowed'
                              : active
                              ? 'bg-[#14B8A6] border-[#14B8A6] text-white'
                              : 'bg-white border-[#E5E7EB] text-[#0F172A] hover:border-[#14B8A6]'
                          }`}
                        >
                          <Clock className={`w-3.5 h-3.5 flex-shrink-0 ${booked ? 'text-slate-300' : active ? 'text-white' : 'text-[#14B8A6]'}`} />
                          <span className={booked ? 'line-through text-xs' : 'text-xs'}>
                            {slot.startTime} – {slot.endTime}
                          </span>
                          {booked && <span className="ml-auto text-[9px] bg-slate-200 text-slate-400 px-1.5 py-0.5 rounded-full">Booked</span>}
                        </button>
                      )
                    })}
                  </div>
                )}

                {selectedSlot && (
                  <div className="mt-4 flex items-center gap-2 bg-teal-50 border border-teal-100 rounded-xl px-3 py-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#14B8A6] flex-shrink-0" />
                    <p className="text-xs text-slate-600">
                      <span className="font-semibold text-[#0F172A]">{selectedSlot.startTime} – {selectedSlot.endTime}</span>
                      {' '}selected
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* ── Patient Details + Summary Row ── */}
            <div className="patientPaymentDetail grid grid-cols-1 md:grid-cols-12 gap-5 fade-up" style={{ animationDelay: '0.2s' }}>

              {/* PATIENT DETAILS (cyan → white, sticky) */}
              <div className="patientdetails col-span-1 md:col-span-5 h-[450px] md:sticky md:top-22">
                <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-sm h-full">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 bg-teal-50 rounded-xl flex items-center justify-center">
                      <User className="w-4 h-4 text-[#14B8A6]" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-[#0F172A]">Patient Details</h2>
                      <p className="text-xs text-slate-400">Fill in as per PatientDetail schema</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">

                    {/* fullName: String */}
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                        Full Name <span className="text-rose-400">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="e.g. Ravi Kumar"
                          value={form.fullName}
                          onChange={e => handleForm('fullName', e.target.value)}
                          className={`${inputCls} pl-10`}
                        />
                      </div>
                    </div>

                    {/* age: Int  +  gender: GenderRole */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                          Age <span className="text-rose-400">*</span>
                        </label>
                        <input
                          type="number"
                          placeholder="e.g. 32"
                          min={1} max={120}
                          value={form.age}
                          onChange={e => handleForm('age', e.target.value)}
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                          Gender <span className="text-rose-400">*</span>
                        </label>
                        <div className="relative">
                          <select
                            value={form.gender}
                            onChange={e => handleForm('gender', e.target.value)}
                            className={`${inputCls} appearance-none pr-8`}
                          >
                            <option value="">Select</option>
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                            <option value="OTHER">Other</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* phoneNumber: Int */}
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                        Phone Number <span className="text-rose-400">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="tel"
                          placeholder="e.g. 9876543210"
                          value={form.phoneNumber}
                          onChange={e => handleForm('phoneNumber', e.target.value)}
                          className={`${inputCls} pl-10`}
                          maxLength={10}
                        />
                      </div>
                    </div>

                    {/* email: String */}
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                        Email <span className="text-rose-400">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="email"
                          placeholder="patient@email.com"
                          value={form.email}
                          onChange={e => handleForm('email', e.target.value)}
                          className={`${inputCls} pl-10`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SUMMARY + PAYMENT (green → white) */}
              <div className="summary col-span-1 md:col-span-7 h-fit">
                <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-sm">

                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 bg-teal-50 rounded-xl flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-[#14B8A6]" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-[#0F172A]">Summary & Payment</h2>
                      <p className="text-xs text-slate-400">Review before confirming</p>
                    </div>
                  </div>

                  {/* Appointment summary rows */}
                  <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl p-5 mb-5 space-y-3">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Appointment Details</h3>
                    {[
                      { label: 'Doctor',       value: doctor.name },
                      { label: 'Specialization', value: doctor.specialization },
                      { label: 'Location',     value: doctor.location },
                      { label: 'Date',         value: currentDate ? fmtFull(currentDate.date) : '—' },
                      { label: 'Time Slot',    value: selectedSlot ? `${selectedSlot.startTime} – ${selectedSlot.endTime}` : '—' },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between items-start">
                        <span className="text-xs text-slate-400 w-32 flex-shrink-0">{label}</span>
                        <span className="text-sm font-medium text-[#0F172A] text-right">{value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Patient summary rows (live from form) */}
                  <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl p-5 mb-5 space-y-3">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Patient Details</h3>
                    {[
                      { label: 'Full Name',    value: form.fullName    || '—' },
                      { label: 'Age',          value: form.age         || '—' },
                      { label: 'Gender',       value: form.gender      || '—' },
                      { label: 'Phone',        value: form.phoneNumber || '—' },
                      { label: 'Email',        value: form.email       || '—' },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between items-start">
                        <span className="text-xs text-slate-400 w-32 flex-shrink-0">{label}</span>
                        <span className="text-sm font-medium text-[#0F172A] text-right">{value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Payment method — PaymentMethod enum: ONLINE | CASH */}
                  <div className="mb-5">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Payment Method</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {([['ONLINE', 'Pay Online', CreditCard], ['CASH', 'Pay at Clinic', Banknote]] as const).map(([val, label, Icon]) => (
                        <button
                          key={val}
                          onClick={() => setPaymentMethod(val as PaymentMethod)}
                          className={`flex items-center gap-3 p-4 rounded-2xl border text-sm font-medium transition-all ${
                            paymentMethod === val
                              ? 'bg-[#14B8A6] border-[#14B8A6] text-white shadow-md shadow-teal-100'
                              : 'bg-[#F8FAFC] border-[#E5E7EB] text-slate-600 hover:border-[#14B8A6]'
                          }`}
                        >
                          <Icon className={`w-5 h-5 ${paymentMethod === val ? 'text-white' : 'text-[#14B8A6]'}`} />
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Total + CTA */}
                  <div className="border-t border-[#E5E7EB] pt-5">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-slate-500 text-sm">Consultation Fee</span>
                      <span className="serif text-2xl font-bold text-[#0F172A]">₹{doctor.consultationFee}</span>
                    </div>

                    {/* PaymentStatus badge — will be PENDING on creation */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xs text-slate-400">Payment Status:</span>
                      <span className="text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full">
                        PENDING
                      </span>
                    </div>

                    <button
                      disabled={!isFormFilled || !isAvailable}
                      className="w-full h-13 py-3.5 bg-[#14B8A6] hover:bg-[#0f9a8e] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-semibold rounded-2xl transition-all shadow-lg shadow-teal-100 disabled:shadow-none text-sm"
                      onClick={tempDeleteMe}
                    >
                      {!isAvailable
                        ? 'Doctor Unavailable'
                        : !selectedSlot
                        ? 'Select a Time Slot First'
                        : !isFormFilled
                        ? 'Fill Patient Details'
                        : `Confirm & ${paymentMethod === 'ONLINE' ? 'Pay ₹' + doctor.consultationFee : 'Book Appointment'}`
                      }
                      {isBooking && <Loader2Icon className='animate-spin'/>}
                    </button>

                    <p className="text-center text-xs text-slate-400 mt-3">
                      Free cancellation up to 2 hours before the appointment
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  )
}