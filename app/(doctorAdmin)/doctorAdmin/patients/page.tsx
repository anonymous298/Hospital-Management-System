"use client"

// app/(doctorAdmin)/doctorAdmin/patients/page.tsx
// All unique patients who have ever booked with this doctor
// Data comes from DoctorAppointment → PatientDetail (via doctorId)

import { useState, useMemo } from "react"
import {
  Users, Search, X, ChevronDown, Phone, Mail,
  CalendarDays, Clock, IndianRupee, User,
  BadgeCheck, XCircle, Hourglass, CheckCircle2,
  Filter, RefreshCw, AlertCircle,
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

type GenderRole        = "MALE" | "FEMALE" | "OTHER"
type AppointmentStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED"
type PaymentMethod     = "ONLINE" | "CASH"
type PaymentStatus     = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED"

interface PatientAppointment {
  id: string
  date: string
  startTime: string
  endTime: string
  period: "AM" | "PM"
  appointmentStatus: AppointmentStatus
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  amount: number
}

interface Patient {
  id: string           // patientDetail.id
  fullName: string
  age: number
  phoneNumber: string
  gender: GenderRole
  email: string
  appointments: PatientAppointment[]
}

// ─── Dummy data ───────────────────────────────────────────────────────────────
// In real app: fetched via doctor's doctorId → DoctorAppointment[] → PatientDetail

const DUMMY_PATIENTS: Patient[] = [
  {
    id: "p1", fullName: "Ravi Kumar",   age: 34, phoneNumber: "9876543210", gender: "MALE",   email: "ravi.kumar@gmail.com",
    appointments: [
      { id: "a1", date: "2025-07-14", startTime: "09:00", endTime: "09:30", period: "AM", appointmentStatus: "COMPLETED", paymentMethod: "ONLINE", paymentStatus: "COMPLETED", amount: 800 },
      { id: "a8", date: "2025-06-20", startTime: "10:00", endTime: "10:30", period: "AM", appointmentStatus: "COMPLETED", paymentMethod: "ONLINE", paymentStatus: "COMPLETED", amount: 800 },
    ],
  },
  {
    id: "p2", fullName: "Sneha Sharma", age: 28, phoneNumber: "9123456789", gender: "FEMALE", email: "sneha.sharma@gmail.com",
    appointments: [
      { id: "a2", date: "2025-07-14", startTime: "09:30", endTime: "10:00", period: "AM", appointmentStatus: "PENDING",   paymentMethod: "CASH",   paymentStatus: "PENDING",   amount: 800 },
    ],
  },
  {
    id: "p3", fullName: "Amit Patel",   age: 45, phoneNumber: "9988776655", gender: "MALE",   email: "amit.patel@gmail.com",
    appointments: [
      { id: "a3", date: "2025-07-14", startTime: "10:00", endTime: "10:30", period: "AM", appointmentStatus: "CONFIRMED", paymentMethod: "ONLINE", paymentStatus: "PROCESSING", amount: 800 },
    ],
  },
  {
    id: "p4", fullName: "Divya Nair",   age: 31, phoneNumber: "9871234560", gender: "FEMALE", email: "divya.nair@gmail.com",
    appointments: [
      { id: "a4", date: "2025-07-16", startTime: "02:00", endTime: "02:30", period: "PM", appointmentStatus: "COMPLETED", paymentMethod: "ONLINE", paymentStatus: "COMPLETED", amount: 800 },
      { id: "a9", date: "2025-05-10", startTime: "11:00", endTime: "11:30", period: "AM", appointmentStatus: "COMPLETED", paymentMethod: "CASH",   paymentStatus: "COMPLETED", amount: 800 },
      { id: "a10",date: "2025-04-02", startTime: "09:00", endTime: "09:30", period: "AM", appointmentStatus: "COMPLETED", paymentMethod: "ONLINE", paymentStatus: "COMPLETED", amount: 800 },
    ],
  },
  {
    id: "p5", fullName: "Karan Singh",  age: 52, phoneNumber: "9765432100", gender: "MALE",   email: "karan.singh@gmail.com",
    appointments: [
      { id: "a5", date: "2025-07-16", startTime: "03:00", endTime: "03:30", period: "PM", appointmentStatus: "CANCELLED", paymentMethod: "ONLINE", paymentStatus: "FAILED",    amount: 800 },
    ],
  },
  {
    id: "p6", fullName: "Priya Mehta",  age: 38, phoneNumber: "9654321098", gender: "FEMALE", email: "priya.mehta@gmail.com",
    appointments: [
      { id: "a6", date: "2025-07-18", startTime: "10:00", endTime: "10:30", period: "AM", appointmentStatus: "PENDING",   paymentMethod: "CASH",   paymentStatus: "PENDING",   amount: 800 },
      { id: "a11",date: "2025-03-15", startTime: "02:00", endTime: "02:30", period: "PM", appointmentStatus: "COMPLETED", paymentMethod: "CASH",   paymentStatus: "COMPLETED", amount: 800 },
    ],
  },
  {
    id: "p7", fullName: "Suresh Iyer",  age: 60, phoneNumber: "9543210987", gender: "MALE",   email: "suresh.iyer@gmail.com",
    appointments: [
      { id: "a7", date: "2025-07-18", startTime: "10:30", endTime: "11:00", period: "AM", appointmentStatus: "CONFIRMED", paymentMethod: "ONLINE", paymentStatus: "COMPLETED", amount: 800 },
    ],
  },
]

// ─── Config ───────────────────────────────────────────────────────────────────

const APPT_CFG: Record<AppointmentStatus, { label: string; cls: string; icon: React.ReactNode }> = {
  PENDING:   { label: "Pending",   cls: "bg-amber-50  text-amber-600  border-amber-200",     icon: <Hourglass    className="w-3 h-3" /> },
  CONFIRMED: { label: "Confirmed", cls: "bg-blue-50   text-blue-600   border-blue-200",      icon: <BadgeCheck   className="w-3 h-3" /> },
  COMPLETED: { label: "Completed", cls: "bg-emerald-50 text-emerald-600 border-emerald-200", icon: <CheckCircle2 className="w-3 h-3" /> },
  CANCELLED: { label: "Cancelled", cls: "bg-rose-50   text-rose-600   border-rose-200",      icon: <XCircle      className="w-3 h-3" /> },
}

const PAY_CFG: Record<PaymentStatus, { label: string; cls: string }> = {
  PENDING:    { label: "Pending",    cls: "bg-amber-50  text-amber-600  border-amber-200"     },
  PROCESSING: { label: "Processing", cls: "bg-blue-50   text-blue-600   border-blue-200"      },
  COMPLETED:  { label: "Completed",  cls: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  FAILED:     { label: "Failed",     cls: "bg-rose-50   text-rose-600   border-rose-200"      },
}

const GENDER_COLOR: Record<GenderRole, string> = {
  MALE:   "bg-blue-50  text-blue-600  border-blue-100",
  FEMALE: "bg-pink-50  text-pink-600  border-pink-100",
  OTHER:  "bg-slate-50 text-slate-500 border-slate-200",
}

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })

// ─── Patient Card ─────────────────────────────────────────────────────────────

const PatientCard = ({ patient }: { patient: Patient }) => {
  const [expanded, setExpanded] = useState(false)

  const totalVisits     = patient.appointments.length
  const completedVisits = patient.appointments.filter(a => a.appointmentStatus === "COMPLETED").length
  const totalSpent      = patient.appointments
    .filter(a => a.paymentStatus === "COMPLETED")
    .reduce((s, a) => s + a.amount, 0)
  const lastAppt        = patient.appointments.at(-1)

  return (
    <div className="bg-white border border-[#E8EEF4] rounded-2xl shadow-sm hover:shadow-md transition-all hover:border-[#14B8A6]/20">

      {/* ── Main row ── */}
      <div
        className="flex flex-wrap md:flex-nowrap items-center gap-4 px-5 py-4 cursor-pointer select-none"
        onClick={() => setExpanded(e => !e)}
      >
        {/* Avatar */}
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-50 to-teal-100 border border-teal-200 flex items-center justify-center flex-shrink-0">
          <span className="text-base font-bold text-[#14B8A6]">
            {patient.fullName.split(" ").map(n => n[0]).join("").slice(0, 2)}
          </span>
        </div>

        {/* Patient info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-0.5">
            <p className="font-bold text-[#0F172A] text-sm">{patient.fullName}</p>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${GENDER_COLOR[patient.gender]}`}>
              {patient.gender}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <User className="w-3 h-3 text-[#14B8A6]" /> Age {patient.age}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Phone className="w-3 h-3 text-[#14B8A6]" /> {patient.phoneNumber}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-400 truncate max-w-[180px]">
              <Mail className="w-3 h-3 text-[#14B8A6]" /> {patient.email}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="hidden md:flex items-center gap-6 flex-shrink-0">
          <div className="text-center">
            <p className="text-lg font-bold text-[#0F172A] leading-none">{totalVisits}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Visit{totalVisits !== 1 ? "s" : ""}</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-emerald-600 leading-none">{completedVisits}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Completed</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-[#0F172A] leading-none">₹{totalSpent}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Total paid</p>
          </div>
          {lastAppt && (
            <div className="text-center">
              <p className="text-xs font-semibold text-[#0F172A] leading-none">{fmtDate(lastAppt.date)}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Last visit</p>
            </div>
          )}
        </div>

        <ChevronDown className={`w-4 h-4 text-slate-300 flex-shrink-0 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
      </div>

      {/* ── Expanded: contact + appointment history ── */}
      {expanded && (
        <div className="border-t border-[#F1F5F9] bg-[#FAFBFC] px-5 py-5 space-y-5">

          {/* Contact details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: User,        label: "Full Name",   val: patient.fullName       },
              { icon: Phone,       label: "Phone",       val: patient.phoneNumber    },
              { icon: Mail,        label: "Email",       val: patient.email          },
              { icon: AlertCircle, label: "Age / Gender",val: `${patient.age} · ${patient.gender}` },
            ].map(({ icon: Icon, label, val }) => (
              <div key={label} className="bg-white border border-[#E8EEF4] rounded-xl px-4 py-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className="w-3 h-3 text-[#14B8A6]" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
                </div>
                <p className="text-xs font-semibold text-[#0F172A] truncate">{val}</p>
              </div>
            ))}
          </div>

          {/* Appointment history */}
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <CalendarDays className="w-3 h-3" /> Appointment History ({totalVisits})
            </p>
            <div className="space-y-2">
              {patient.appointments.map((appt, idx) => (
                <div key={appt.id} className="flex flex-wrap md:flex-nowrap items-center gap-3 bg-white border border-[#E8EEF4] rounded-xl px-4 py-3">

                  {/* Index */}
                  <div className="w-6 h-6 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] font-bold text-[#14B8A6]">{idx + 1}</span>
                  </div>

                  {/* Date + time */}
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <CalendarDays className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <p className="text-xs font-semibold text-[#0F172A]">{fmtDate(appt.date)}</p>
                    <span className="text-slate-300">·</span>
                    <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <p className="text-xs text-slate-500">{appt.startTime} – {appt.endTime} {appt.period}</p>
                  </div>

                  {/* Payment method + amount */}
                  <div className="flex items-center gap-1 text-xs text-slate-500 flex-shrink-0">
                    <IndianRupee className="w-3 h-3" />
                    <span className="font-semibold text-[#0F172A]">{appt.amount}</span>
                    <span className="text-slate-400 text-[10px]">{appt.paymentMethod}</span>
                  </div>

                  {/* Payment status */}
                  <span className={`flex-shrink-0 flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg border ${PAY_CFG[appt.paymentStatus].cls}`}>
                    {PAY_CFG[appt.paymentStatus].label}
                  </span>

                  {/* Appointment status */}
                  <span className={`flex-shrink-0 flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg border ${APPT_CFG[appt.appointmentStatus].cls}`}>
                    {APPT_CFG[appt.appointmentStatus].icon}
                    {APPT_CFG[appt.appointmentStatus].label}
                  </span>

                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DoctorPatientsPage() {
  const [search, setSearch]       = useState("")
  const [genderFilter, setGender] = useState<GenderRole | "ALL">("ALL")
  const [sortBy, setSortBy]       = useState<"name" | "visits" | "recent">("recent")

  const filtered = useMemo(() => {
    let list = DUMMY_PATIENTS.filter(p => {
      const q = search.toLowerCase()
      const matchSearch =
        p.fullName.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.phoneNumber.includes(q)
      const matchGender = genderFilter === "ALL" || p.gender === genderFilter
      return matchSearch && matchGender
    })

    if (sortBy === "name")    list = [...list].sort((a, b) => a.fullName.localeCompare(b.fullName))
    if (sortBy === "visits")  list = [...list].sort((a, b) => b.appointments.length - a.appointments.length)
    if (sortBy === "recent")  list = [...list].sort((a, b) => {
      const aDate = a.appointments.at(-1)?.date ?? ""
      const bDate = b.appointments.at(-1)?.date ?? ""
      return bDate.localeCompare(aDate)
    })

    return list
  }, [search, genderFilter, sortBy])

  // Summary stats
  const totalVisits   = DUMMY_PATIENTS.reduce((s, p) => s + p.appointments.length, 0)
  const totalRevenue  = DUMMY_PATIENTS.reduce((s, p) =>
    s + p.appointments.filter(a => a.paymentStatus === "COMPLETED").reduce((x, a) => x + a.amount, 0), 0)
  const returningPts  = DUMMY_PATIENTS.filter(p => p.appointments.length > 1).length

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');
        .pts { font-family: 'Outfit', sans-serif; }
        .fade-up { animation: fu 0.35s ease both; }
        @keyframes fu { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <div className="pts p-6 max-w-5xl mx-auto space-y-6">

        {/* ── Header ── */}
        <div className="fade-up">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-[#14B8A6]" />
            <p className="text-xs font-bold text-[#14B8A6] uppercase tracking-widest">Patients</p>
          </div>
          <h1 className="text-2xl font-bold text-[#0F172A]">My Patients</h1>
          <p className="text-slate-400 text-sm mt-0.5">All patients who have booked an appointment with you</p>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 fade-up" style={{ animationDelay: "0.04s" }}>
          {[
            { label: "Total Patients",    value: DUMMY_PATIENTS.length, sub: "unique",          color: "text-[#0F172A]"    },
            { label: "Returning Patients",value: returningPts,          sub: "2+ visits",        color: "text-[#14B8A6]"   },
            { label: "Total Visits",      value: totalVisits,           sub: "all time",          color: "text-[#0F172A]"   },
            { label: "Total Revenue",     value: `₹${totalRevenue}`,    sub: "payments collected",color: "text-emerald-600" },
          ].map(({ label, value, sub, color }) => (
            <div key={label} className="bg-white border border-[#E8EEF4] rounded-2xl px-5 py-4 shadow-sm">
              <p className="text-[11px] text-slate-400 mb-1">{label}</p>
              <p className={`text-2xl font-bold leading-none ${color}`}>{value}</p>
              <p className="text-[10px] text-slate-400 mt-1">{sub}</p>
            </div>
          ))}
        </div>

        {/* ── Search + filters ── */}
        <div className="flex flex-col sm:flex-row gap-3 fade-up" style={{ animationDelay: "0.08s" }}>

          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email or phone..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white border border-[#E8EEF4] rounded-xl pl-10 pr-10 py-2.5 text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6] transition"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Gender filter */}
          <div className="flex gap-2">
            {(["ALL", "MALE", "FEMALE", "OTHER"] as const).map(g => (
              <button
                key={g}
                onClick={() => setGender(g)}
                className={`text-xs font-semibold px-3 py-2 rounded-xl border transition ${
                  genderFilter === g
                    ? "bg-[#14B8A6] text-white border-[#14B8A6]"
                    : "bg-white text-slate-500 border-[#E8EEF4] hover:border-slate-300"
                }`}
              >
                {g === "ALL" ? "All" : g.charAt(0) + g.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2 bg-white border border-[#E8EEF4] rounded-xl px-3 py-2">
            <Filter className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as typeof sortBy)}
              className="text-xs font-semibold text-slate-600 bg-transparent focus:outline-none appearance-none cursor-pointer pr-4"
            >
              <option value="recent">Most Recent</option>
              <option value="visits">Most Visits</option>
              <option value="name">Name A–Z</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 -ml-3 pointer-events-none" />
          </div>
        </div>

        {/* ── Patient list ── */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-white border border-dashed border-[#E5E7EB] rounded-2xl py-16 text-center fade-up">
              <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-[#14B8A6]" />
              </div>
              <p className="font-semibold text-[#0F172A]">No patients found</p>
              <p className="text-sm text-slate-400 mt-1">{search ? "Try a different search term" : "No patients match this filter"}</p>
              {(search || genderFilter !== "ALL") && (
                <button
                  onClick={() => { setSearch(""); setGender("ALL") }}
                  className="mt-4 text-xs font-semibold text-[#14B8A6] hover:underline flex items-center gap-1 mx-auto"
                >
                  <RefreshCw className="w-3 h-3" /> Clear filters
                </button>
              )}
            </div>
          ) : (
            <>
              <p className="text-[11px] text-slate-400">
                Showing {filtered.length} of {DUMMY_PATIENTS.length} patients
              </p>
              {filtered.map((p, i) => (
                <div key={p.id} className="fade-up" style={{ animationDelay: `${i * 0.04}s` }}>
                  <PatientCard patient={p} />
                </div>
              ))}
            </>
          )}
        </div>

      </div>
    </>
  )
}