'use client'

import React, { useState } from 'react'
import { CalendarDays, Search, SlidersHorizontal, Inbox } from 'lucide-react'
// import AppointmentCard from './DoctorAppointmentCard'
import { AllDoctorAppointmentsProps, DoctorAppointmentData } from '@/types/doctorAppointment'
import DoctorAppointmentCard from './DoctorAppointmentCard'
// import { PaymentStatus } from '@/app/generated/prisma/enums'

// ─── Types ────────────────────────────────────────────────────────────────────

type PaymentStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'ALL'



// ─── Helpers ─────────────────────────────────────────────────────────────────

const STATUS_FILTERS: { label: string; value: PaymentStatus }[] = [
  { label: 'All',        value: 'ALL' },
  { label: 'Pending',    value: 'PENDING' },
  { label: 'Processing', value: 'PROCESSING' },
  { label: 'Completed',  value: 'COMPLETED' },
  { label: 'Failed',     value: 'FAILED' },
]

const statusFilterCls = (active: boolean) =>
  active
    ? 'bg-[#14B8A6] text-white border-[#14B8A6] shadow-sm shadow-teal-100'
    : 'bg-white text-slate-500 border-[#E8EEF4] hover:border-[#14B8A6] hover:text-[#14B8A6]'

// ─── Component ────────────────────────────────────────────────────────────────

const AllDoctorAppointments: React.FC<AllDoctorAppointmentsProps> = ({ appointments }) => {
  const [search, setSearch]       = useState('')
  const [statusFilter, setStatus] = useState<PaymentStatus>('ALL')

  // Filter by search (doctor name or specialization) + payment status
  const filtered = appointments.filter(apt => {
    const matchSearch =
      apt.doctor.name.toLowerCase().includes(search.toLowerCase()) ||
      apt.doctor.specialization.toLowerCase().includes(search.toLowerCase()) ||
      apt.patientDetail?.fullName.toLowerCase().includes(search.toLowerCase())

    const matchStatus =
      statusFilter === 'ALL' ||
      apt.payment?.status === statusFilter ||
      (statusFilter === 'PENDING' && !apt.payment)

    return matchSearch && matchStatus
  })

  // Summary counts
  const counts = {
    total:     appointments.length,
    completed: appointments.filter(a => a.payment?.status === 'COMPLETED').length,
    pending:   appointments.filter(a => !a.payment || a.payment.status === 'PENDING').length,
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Outfit:wght@300;400;500;600;700&display=swap');
        .aa-root { font-family: 'Outfit', sans-serif; }
        .aa-root .serif { font-family: 'Instrument Serif', Georgia, serif; }
        .fade-up { animation: fadeUp 0.4s ease both; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      <div className="aa-root w-full min-h-screen bg-[#F8FAFC] px-4 py-10">
        <div className="max-w-5xl mx-auto">

          {/* ── Page Header ─────────────────────────────────────────────── */}
          <div className="mb-8 fade-up">
            <div className="flex items-center gap-2 mb-1">
              <CalendarDays className="w-5 h-5 text-[#14B8A6]" />
              <p className="text-xs font-semibold text-[#14B8A6] uppercase tracking-widest">My Appointments</p>
            </div>
            <h1 className="serif text-3xl font-semibold text-[#0F172A]">Appointment History</h1>
            <p className="text-slate-400 text-sm mt-1">All your booked consultations in one place</p>
          </div>

          {/* ── Summary Stats ────────────────────────────────────────────── */}
          <div className="grid grid-cols-3 gap-4 mb-8 fade-up" style={{ animationDelay: '0.05s' }}>
            {[
              { label: 'Total Booked',  value: counts.total,     color: 'text-[#0F172A]' },
              { label: 'Completed',     value: counts.completed, color: 'text-emerald-600' },
              { label: 'Pending',       value: counts.pending,   color: 'text-amber-600' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-white border border-[#E8EEF4] rounded-2xl p-4 text-center shadow-sm">
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
                <p className="text-xs text-slate-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* ── Search + Filters ─────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6 fade-up" style={{ animationDelay: '0.1s' }}>

            {/* Search input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by doctor, specialization or patient name..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-white border border-[#E8EEF4] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6] transition"
              />
            </div>

            {/* Status filter pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <SlidersHorizontal className="w-4 h-4 text-slate-400 flex-shrink-0" />
              {STATUS_FILTERS.map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => setStatus(value)}
                  className={`text-xs font-semibold px-3 py-2 rounded-xl border transition-all ${statusFilterCls(statusFilter === value)}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Appointments List ─────────────────────────────────────────── */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 fade-up">
              <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mb-4">
                <Inbox className="w-8 h-8 text-[#14B8A6]" />
              </div>
              <p className="font-semibold text-[#0F172A] mb-1">No appointments found</p>
              <p className="text-sm text-slate-400">
                {search || statusFilter !== 'ALL'
                  ? 'Try adjusting your search or filter'
                  : "You haven't booked any appointments yet"}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filtered.map((apt, idx) => (
                <div
                  key={apt.id}
                  className="fade-up"
                  style={{ animationDelay: `${0.1 + idx * 0.05}s` }}
                >
                  <DoctorAppointmentCard appointment={apt} />
                </div>
              ))}
              <p className="text-center text-xs text-slate-400 mt-2">
                Showing {filtered.length} of {appointments.length} appointments
              </p>
            </div>
          )}

        </div>
      </div>
    </>
  )
}

export default AllDoctorAppointments


// ─── Usage in your /appointments page ────────────────────────────────────────
//
// app/appointments/page.tsx (server component)
//
// import { getUserAppointments } from '@/actions/appointments'
// import AllAppointments from '@/components/AllAppointments'
//
// export default async function AppointmentsPage() {
//   const appointments = await getUserAppointments()  ← your server action
//   return <AllAppointments appointments={appointments} />
// }