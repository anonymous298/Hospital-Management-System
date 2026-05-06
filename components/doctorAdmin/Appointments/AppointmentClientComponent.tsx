"use client"

// app/(doctorAdmin)/doctorAdmin/appointments/page.tsx

import { useState, useRef, useEffect, useCallback } from "react"
import {
  Clock, Search, CheckCircle2, AlertCircle, X,
  ChevronDown, User, Phone, Mail, IndianRupee,
  CalendarDays, Stethoscope, RefreshCw,
  BadgeCheck, XCircle, Loader2, CalendarCheck, Hourglass,
} from "lucide-react"
import { createPortal } from "react-dom"
import { DoctorAppointmentWithDetails, } from "@/types/doctorAppointment"
import { Prisma } from "@/app/generated/prisma/client"
import { updateDoctorAppointmentStatus } from "@/server/actions/doctorAppointment.action"

// ─── Types ────────────────────────────────────────────────────────────────────

type AppointmentStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED"
type PaymentStatus     = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED"
type PaymentMethod     = "ONLINE" | "CASH"
type GenderRole        = "MALE" | "FEMALE" | "OTHER"

interface PatientDetail {
  fullName: string
  age: number
  phoneNumber: string
  gender: GenderRole
  email: string
}

interface Payment {
  amount: number
  status: PaymentStatus
  method: PaymentMethod
}



// interface Appointment {
//   id: string
//   createdAt: string
//   status: AppointmentStatus
//   patientDetail: PatientDetail
//   payment: Payment
//   timeSlot: {
//     startTime: string
//     endTime: string
//     period: "AM" | "PM"
//     availabilityDate: { date: string }
//   }
// }

// ─── Dummy data ───────────────────────────────────────────────────────────────

// const DUMMY: Appointment[] = [
//   {
//     id: "a1", createdAt: "2025-07-10T08:30:00Z", status: "COMPLETED",
//     patientDetail: { fullName: "Ravi Kumar",   age: 34, phoneNumber: "9876543210", gender: "MALE",   email: "ravi.kumar@gmail.com"  },
//     payment: { amount: 800, status: "COMPLETED",  method: "ONLINE" },
//     timeSlot: { startTime: "09:00", endTime: "09:30", period: "AM", availabilityDate: { date: "2025-07-14" } },
//   },
//   {
//     id: "a2", createdAt: "2025-07-11T10:15:00Z", status: "PENDING",
//     patientDetail: { fullName: "Sneha Sharma", age: 28, phoneNumber: "9123456789", gender: "FEMALE", email: "sneha.sharma@gmail.com" },
//     payment: { amount: 800, status: "PENDING",    method: "CASH"   },
//     timeSlot: { startTime: "09:30", endTime: "10:00", period: "AM", availabilityDate: { date: "2025-07-14" } },
//   },
//   {
//     id: "a3", createdAt: "2025-07-11T14:00:00Z", status: "CONFIRMED",
//     patientDetail: { fullName: "Amit Patel",   age: 45, phoneNumber: "9988776655", gender: "MALE",   email: "amit.patel@gmail.com"  },
//     payment: { amount: 800, status: "PROCESSING", method: "ONLINE" },
//     timeSlot: { startTime: "10:00", endTime: "10:30", period: "AM", availabilityDate: { date: "2025-07-14" } },
//   },
//   {
//     id: "a4", createdAt: "2025-07-12T09:00:00Z", status: "COMPLETED",
//     patientDetail: { fullName: "Divya Nair",   age: 31, phoneNumber: "9871234560", gender: "FEMALE", email: "divya.nair@gmail.com"  },
//     payment: { amount: 800, status: "COMPLETED",  method: "ONLINE" },
//     timeSlot: { startTime: "02:00", endTime: "02:30", period: "PM", availabilityDate: { date: "2025-07-16" } },
//   },
//   {
//     id: "a5", createdAt: "2025-07-12T11:30:00Z", status: "CANCELLED",
//     patientDetail: { fullName: "Karan Singh",  age: 52, phoneNumber: "9765432100", gender: "MALE",   email: "karan.singh@gmail.com" },
//     payment: { amount: 800, status: "FAILED",     method: "ONLINE" },
//     timeSlot: { startTime: "03:00", endTime: "03:30", period: "PM", availabilityDate: { date: "2025-07-16" } },
//   },
//   {
//     id: "a6", createdAt: "2025-07-13T07:45:00Z", status: "PENDING",
//     patientDetail: { fullName: "Priya Mehta",  age: 38, phoneNumber: "9654321098", gender: "FEMALE", email: "priya.mehta@gmail.com" },
//     payment: { amount: 800, status: "PENDING",    method: "CASH"   },
//     timeSlot: { startTime: "10:00", endTime: "10:30", period: "AM", availabilityDate: { date: "2025-07-18" } },
//   },
//   {
//     id: "a7", createdAt: "2025-07-13T09:20:00Z", status: "CONFIRMED",
//     patientDetail: { fullName: "Suresh Iyer",  age: 60, phoneNumber: "9543210987", gender: "MALE",   email: "suresh.iyer@gmail.com" },
//     payment: { amount: 800, status: "COMPLETED",  method: "ONLINE" },
//     timeSlot: { startTime: "10:30", endTime: "11:00", period: "AM", availabilityDate: { date: "2025-07-18" } },
//   },
// ]

// ─── Config ───────────────────────────────────────────────────────────────────

const APPT_CFG: Record<AppointmentStatus, { label: string; cls: string; dot: string; icon: React.ReactNode }> = {
  PENDING:   { label: "Pending",   cls: "bg-amber-50  text-amber-600  border-amber-200",     dot: "bg-amber-400",   icon: <Hourglass    className="w-3 h-3" /> },
  CONFIRMED: { label: "Confirmed", cls: "bg-blue-50   text-blue-600   border-blue-200",      dot: "bg-blue-400",    icon: <BadgeCheck   className="w-3 h-3" /> },
  COMPLETED: { label: "Completed", cls: "bg-emerald-50 text-emerald-600 border-emerald-200", dot: "bg-emerald-400", icon: <CheckCircle2 className="w-3 h-3" /> },
  CANCELLED: { label: "Cancelled", cls: "bg-rose-50   text-rose-600   border-rose-200",      dot: "bg-rose-400",    icon: <XCircle      className="w-3 h-3" /> },
}

const PAY_CFG: Record<PaymentStatus, { label: string; cls: string }> = {
  PENDING:    { label: "Pending",    cls: "bg-amber-50  text-amber-600  border-amber-200"     },
  PROCESSING: { label: "Processing", cls: "bg-blue-50   text-blue-600   border-blue-200"      },
  COMPLETED:  { label: "Completed",  cls: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  FAILED:     { label: "Failed",     cls: "bg-rose-50   text-rose-600   border-rose-200"      },
}

const ALL_APPT_STATUSES: AppointmentStatus[] = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"]

const fmtDate    = (iso: string) => new Date(iso).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })
const fmtCreated = (iso: string | Date) => new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })

// ─── Toast ────────────────────────────────────────────────────────────────────

const Toast = ({ msg, type, onClose }: { msg: string; type: "success" | "error"; onClose: () => void }) => (
  <div className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-3 text-white text-sm font-semibold px-5 py-3 rounded-2xl shadow-2xl animate-toast ${type === "success" ? "bg-[#0F172A]" : "bg-rose-600"}`}>
    {type === "success" ? <CheckCircle2 className="w-4 h-4 text-[#14B8A6]" /> : <AlertCircle className="w-4 h-4" />}
    {msg}
    <button onClick={onClose}><X className="w-3.5 h-3.5 opacity-50 hover:opacity-100" /></button>
  </div>
)

// ─── Status Dropdown — renders via portal into document.body ─────────────────
// Portal means it's completely outside the card DOM tree.
// Nothing can clip or hide it.

interface DropdownPortalProps {
  rect: DOMRect
  onSelect: (s: AppointmentStatus) => void
  onClose: () => void
  current: AppointmentStatus
}

const DropdownPortal = ({ rect, onSelect, onClose, current }: DropdownPortalProps) => {
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) onClose()
    }
    // Slight delay so the click that opened it doesn't immediately close it
    const t = setTimeout(() => document.addEventListener("mousedown", handler), 50)
    return () => { clearTimeout(t); document.removeEventListener("mousedown", handler) }
  }, [onClose])

  // Position: prefer below, flip above if not enough room
  const spaceBelow = window.innerHeight - rect.bottom
  const dropHeight = 180 // approx
  const top = spaceBelow > dropHeight
    ? rect.bottom + window.scrollY + 6
    : rect.top + window.scrollY - dropHeight - 6

  return createPortal(
    <div
      ref={ref}
      style={{
        position: "absolute",
        top,
        left: rect.left + window.scrollX,
        minWidth: Math.max(rect.width, 160),
        zIndex: 99999,
      }}
      className="bg-white border border-[#E8EEF4] rounded-2xl shadow-2xl py-1.5 overflow-hidden"
    >
      {ALL_APPT_STATUSES.map(s => {
        const c = APPT_CFG[s]
        const isActive = s === current
        return (
          <button
            key={s}
            onMouseDown={e => {
              e.preventDefault()
              e.stopPropagation()
              if (!isActive) { onSelect(s); onClose() }
            }}
            className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-left transition-colors
              ${isActive ? "opacity-40 cursor-default bg-slate-50" : "hover:bg-[#F8FAFC] cursor-pointer"}`}
          >
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${c.dot}`} />
            {c.label}
            {isActive && <span className="ml-auto text-[9px] text-slate-400">current</span>}
          </button>
        )
      })}
    </div>,
    document.body
  )
}

// ─── Status Trigger Button ────────────────────────────────────────────────────

const StatusDropdown = ({
  current,
  onChange,
}: {
  current: AppointmentStatus
  onChange: (s: AppointmentStatus) => void
}) => {
  const [open, setOpen]     = useState(false)
  const [rect, setRect]     = useState<DOMRect | null>(null)
  const triggerRef          = useRef<HTMLButtonElement>(null)
  const cfg                 = APPT_CFG[current]

  const handleOpen = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if (!triggerRef.current) return
    setRect(triggerRef.current.getBoundingClientRect())
    setOpen(o => !o)
  }, [])

  return (
    <>
      <button
        ref={triggerRef}
        onClick={handleOpen}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all hover:shadow-sm whitespace-nowrap ${cfg.cls}`}
      >
        {cfg.icon}
        {cfg.label}
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && rect && (
        <DropdownPortal
          rect={rect}
          current={current}
          onSelect={onChange}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}

// ─── Appointment Card ─────────────────────────────────────────────────────────

const AppointmentCard = ({
  appt,
  onStatusChange,
}: {
  appt: DoctorAppointmentWithDetails
  onStatusChange: (id: string, status: AppointmentStatus) => void
}) => {
  const [expanded, setExpanded] = useState(false)
  const p    = appt.patientDetail
  const pay  = appt.payment
  const slot = appt.timeSlot
  

  return (
    <div className="bg-white border border-[#E8EEF4] rounded-2xl shadow-sm hover:shadow-md transition-all hover:border-[#14B8A6]/20">

      {/* Main row */}
      <div
        className="flex flex-wrap md:flex-nowrap items-center gap-4 px-5 py-4 cursor-pointer"
        onClick={() => setExpanded(e => !e)}
      >
        {/* Avatar */}
        <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-bold text-[#14B8A6]">
            {p?.fullName.split(" ").map(n => n[0]).join("").slice(0, 2)}
          </span>
        </div>

        {/* Patient + slot */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-bold text-[#0F172A] text-sm">{p?.fullName}</p>
            <span className="text-[10px] text-slate-400 bg-[#F8FAFC] border border-[#E8EEF4] px-2 py-0.5 rounded-full">
              Age {p?.age} · {p?.gender}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-1">
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <CalendarDays className="w-3 h-3 text-[#14B8A6]" />
              {fmtDate(slot?.availabilityDate.date.toISOString())}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Clock className="w-3 h-3 text-[#14B8A6]" />

              {/* Fix this add period to timeslot table */}
              {/* {slot?.startTime} – {slot?.endTime} {slot?.period} */}
              
              {slot?.startTime} – {slot?.endTime}
            </span>
          </div>
        </div>

        {/* Fee */}
        <div className="flex items-center gap-1 text-sm font-bold text-[#0F172A] flex-shrink-0">
          <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
          {pay?.amount}
          <span className="text-[10px] font-medium text-slate-400 ml-0.5">{pay?.method}</span>
        </div>

        {/* Appointment status — doctor editable */}
        <div className="flex-shrink-0" onClick={e => e.stopPropagation()}>
          <StatusDropdown
            current={appt.status}
            onChange={s => onStatusChange(appt.id, s)}
          />
        </div>

        <ChevronDown className={`w-4 h-4 text-slate-300 flex-shrink-0 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
      </div>

      {/* Expanded panel */}
      {expanded && (
        <div className="border-t border-[#F1F5F9] bg-[#FAFBFC] px-5 py-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Patient */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <User className="w-3 h-3" /> Patient Info
              </p>
              <div className="space-y-2.5">
                {[
                  { icon: User,        label: "Name",        val: p?.fullName },
                  { icon: Stethoscope, label: "Age / Gender",val: `${p?.age} / ${p?.gender}` },
                  { icon: Phone,       label: "Phone",       val: p?.phoneNumber },
                  { icon: Mail,        label: "Email",       val: p?.email },
                ].map(({ icon: Icon, label, val }) => (
                  <div key={label} className="flex items-center gap-2 text-xs">
                    <Icon className="w-3.5 h-3.5 text-[#14B8A6] flex-shrink-0" />
                    <span className="text-slate-400 w-24 flex-shrink-0">{label}</span>
                    <span className="font-semibold text-[#0F172A] truncate">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Appointment */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <CalendarDays className="w-3 h-3" /> Appointment
              </p>
              <div className="space-y-2.5">
                {[
                  { icon: CalendarDays,  label: "Date",      val: fmtDate(slot?.availabilityDate.date.toISOString()) },

                //   Fix: add period in timeslot table later 
                //   { icon: Clock,         label: "Time",      val: `${slot.startTime} – ${slot.endTime} ${slot.period}` },

                  { icon: CalendarCheck, label: "Booked on", val: fmtCreated(appt.createdAt) },
                ].map(({ icon: Icon, label, val }) => (
                  <div key={label} className="flex items-center gap-2 text-xs">
                    <Icon className="w-3.5 h-3.5 text-[#14B8A6] flex-shrink-0" />
                    <span className="text-slate-400 w-24 flex-shrink-0">{label}</span>
                    <span className="font-semibold text-[#0F172A]">{val}</span>
                  </div>
                ))}
                <div className="flex items-center gap-2 text-xs">
                  <RefreshCw className="w-3.5 h-3.5 text-[#14B8A6] flex-shrink-0" />
                  <span className="text-slate-400 w-24 flex-shrink-0">Appt. ID</span>
                  <span className="font-mono text-[10px] text-slate-500 bg-[#F1F5F9] px-2 py-0.5 rounded-lg">{appt.id}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-[#E8EEF4]">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Update Status</p>
                <div onClick={e => e.stopPropagation()}>
                  <StatusDropdown
                    current={appt.status}
                    onChange={s => onStatusChange(appt.id, s)}
                  />
                </div>
              </div>
            </div>

            {/* Payment — read only */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <IndianRupee className="w-3 h-3" /> Payment
                <span className="ml-1 text-[9px] bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded-full normal-case tracking-normal">read-only</span>
              </p>
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs">
                  <IndianRupee className="w-3.5 h-3.5 text-[#14B8A6] flex-shrink-0" />
                  <span className="text-slate-400 w-24 flex-shrink-0">Amount</span>
                  <span className="font-bold text-[#0F172A]">₹{pay?.amount}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Loader2 className="w-3.5 h-3.5 text-[#14B8A6] flex-shrink-0" />
                  <span className="text-slate-400 w-24 flex-shrink-0">Method</span>
                  <span className="font-semibold text-[#0F172A]">{pay?.method}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <BadgeCheck className="w-3.5 h-3.5 text-[#14B8A6] flex-shrink-0" />
                  <span className="text-slate-400 w-24 flex-shrink-0">Pay status</span>
                  <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg border ${PAY_CFG[pay?.status ?? "PENDING"].cls}`}>
                    {PAY_CFG[pay?.status ?? "PENDING"].label}
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-[#E8EEF4] bg-slate-50 rounded-xl p-3">
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Payment status is managed by the payment system and cannot be changed here.
                </p>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DoctorAppointmentsPage({ appointmentData }: { appointmentData: DoctorAppointmentWithDetails[] }) {
  const [appointments, setAppointments] = useState<DoctorAppointmentWithDetails[]>(appointmentData)
  const [search, setSearch]             = useState("")
  const [filter, setFilter]             = useState<AppointmentStatus | "ALL">("ALL")
  const [toast, setToast]               = useState<{ msg: string; type: "success" | "error" } | null>(null)

  const fire = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleStatusChange = async (id: string, status: AppointmentStatus) => {
    setAppointments(prev => prev.map(a => {
        if (a.id !== id) return a
        const shouldCompleteCashPayment =
            status === "COMPLETED" &&
            a.payment?.method === "CASH" &&
            a.payment?.status !== "COMPLETED"
        return {
            ...a,
            status,
            payment: shouldCompleteCashPayment
            ? { ...a.payment!, status: "COMPLETED" as PaymentStatus }
            : a.payment,
        } as DoctorAppointmentWithDetails
    }))

    // Toast — extra note if cash payment was auto-completed
    const appt = appointments.find(a => a.id === id)
    const cashAutoCompleted =
      status === "COMPLETED" &&
      appt?.payment?.method === "CASH" &&
      appt?.payment.status !== "COMPLETED"

    fire(cashAutoCompleted
      ? "Appointment completed — cash payment marked as collected"
      : `Marked as ${APPT_CFG[status].label}`
    )

    // TODO: await updateAppointmentStatus(id, status)
    const updatedAppointment = await updateDoctorAppointmentStatus(id, status)
    // Backend handles: if CASH + COMPLETED → transaction to set both statuses
  }

  const filtered = appointments.filter(a => {
    const q = search.toLowerCase()
    const p = a.patientDetail
    const matchSearch = p?.fullName?.toLowerCase().includes(q) || p?.email?.toLowerCase().includes(q) || p?.phoneNumber?.includes(q)
    const matchFilter = filter === "ALL" || a.status === filter
    return matchSearch && matchFilter
  })

  const counts = ALL_APPT_STATUSES.reduce((acc, s) => {
    acc[s] = appointments.filter(a => a.status === s).length
    return acc
  }, {} as Record<AppointmentStatus, number>)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');
        .apt { font-family: 'Outfit', sans-serif; }
        .fade-up { animation: fu 0.35s ease both; }
        @keyframes fu { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes toast-in { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .animate-toast { animation: toast-in 0.25s ease both; }
      `}</style>

      <div className="apt p-6 max-w-5xl mx-auto space-y-6">

        {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

        {/* Header */}
        <div className="fade-up">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-[#14B8A6]" />
            <p className="text-xs font-bold text-[#14B8A6] uppercase tracking-widest">Appointments</p>
          </div>
          <h1 className="text-2xl font-bold text-[#0F172A]">My Appointments</h1>
          <p className="text-slate-400 text-sm mt-0.5">View and update the status of all patient appointments</p>
        </div>

        {/* Stat cards — double as filters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 fade-up" style={{ animationDelay: "0.05s" }}>
          {ALL_APPT_STATUSES.map(s => {
            const cfg    = APPT_CFG[s]
            const active = filter === s
            return (
              <button
                key={s}
                onClick={() => setFilter(active ? "ALL" : s)}
                className={`text-left bg-white border rounded-2xl px-4 py-4 shadow-sm transition-all hover:shadow-md ${active ? "border-[#14B8A6] ring-2 ring-[#14B8A6]/20" : "border-[#E8EEF4]"}`}
              >
                <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg border mb-2 ${cfg.cls}`}>
                  {cfg.icon} {cfg.label}
                </span>
                <p className="text-2xl font-bold text-[#0F172A]">{counts[s]}</p>
              </button>
            )
          })}
        </div>

        {/* Search + filter pills */}
        <div className="flex flex-col sm:flex-row gap-3 fade-up" style={{ animationDelay: "0.08s" }}>
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
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilter("ALL")}
              className={`text-xs font-semibold px-3 py-2 rounded-xl border transition ${filter === "ALL" ? "bg-[#0F172A] text-white border-[#0F172A]" : "bg-white text-slate-500 border-[#E8EEF4] hover:border-slate-300"}`}
            >
              All ({appointments.length})
            </button>
            {ALL_APPT_STATUSES.map(s => (
              <button
                key={s}
                onClick={() => setFilter(filter === s ? "ALL" : s)}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border transition ${filter === s ? APPT_CFG[s].cls : "bg-white text-slate-500 border-[#E8EEF4] hover:border-slate-300"}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${APPT_CFG[s].dot}`} />
                {APPT_CFG[s].label}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-white border border-dashed border-[#E5E7EB] rounded-2xl py-16 text-center fade-up">
              <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <CalendarDays className="w-6 h-6 text-[#14B8A6]" />
              </div>
              <p className="font-semibold text-[#0F172A]">No appointments found</p>
              <p className="text-sm text-slate-400 mt-1">{search ? "Try a different search term" : "No appointments match this filter"}</p>
              {(search || filter !== "ALL") && (
                <button onClick={() => { setSearch(""); setFilter("ALL") }} className="mt-4 text-xs font-semibold text-[#14B8A6] hover:underline flex items-center gap-1 mx-auto">
                  <RefreshCw className="w-3 h-3" /> Clear filters
                </button>
              )}
            </div>
          ) : (
            <>
              <p className="text-[11px] text-slate-400">Showing {filtered.length} of {appointments.length} appointments</p>
              {filtered.map((a, i) => (
                <div key={a.id} className="fade-up" style={{ animationDelay: `${i * 0.04}s` }}>
                  <AppointmentCard appt={a} onStatusChange={handleStatusChange} />
                </div>
              ))}
            </>
          )}
        </div>

        {/* Info note */}
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-2xl p-4 pb-6 fade-up">
          <BadgeCheck className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-slate-600">
            <span className="font-semibold text-[#0F172A]">Appointment status</span> is doctor-managed (Pending → Confirmed → Completed / Cancelled).{" "}
            <span className="font-semibold text-[#0F172A]">Payment status</span> is system-managed and read-only.{" "}
            Wire up <code className="text-[11px] bg-blue-100 px-1.5 py-0.5 rounded font-mono">updateAppointmentStatus(id, status)</code> when backend is ready.
          </p>
        </div>

      </div>
    </>
  )
}