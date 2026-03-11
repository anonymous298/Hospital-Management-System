"use client"

// app/(doctorAdmin)/doctorAdmin/schedule/page.tsx
// Doctor schedule management — add/delete dates, add/delete time slots per date

import { useState } from "react"
import {
  CalendarDays, Clock, Plus, Trash2, ChevronDown,
  Sun, Moon, CheckCircle2, AlertCircle, X,
  CalendarCheck, Layers, Sparkles,
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

type Period = "AM" | "PM"

interface TimeSlot {
  id: string
  startTime: string
  endTime: string
  period: Period
  isBooked: boolean
}

interface AvailabilityDate {
  id: string
  date: string
  timeSlots: TimeSlot[]
}

// ─── Dummy Data ───────────────────────────────────────────────────────────────

const INITIAL_DATES: AvailabilityDate[] = [
  {
    id: "d1",
    date: "2025-07-14",
    timeSlots: [
      { id: "s1", startTime: "09:00", endTime: "09:30", period: "AM", isBooked: true  },
      { id: "s2", startTime: "09:30", endTime: "10:00", period: "AM", isBooked: false },
      { id: "s3", startTime: "10:00", endTime: "10:30", period: "AM", isBooked: false },
      { id: "s4", startTime: "10:30", endTime: "11:00", period: "AM", isBooked: true  },
      { id: "s5", startTime: "11:00", endTime: "11:30", period: "AM", isBooked: false },
    ],
  },
  {
    id: "d2",
    date: "2025-07-16",
    timeSlots: [
      { id: "s6", startTime: "02:00", endTime: "02:30", period: "PM", isBooked: false },
      { id: "s7", startTime: "03:00", endTime: "03:30", period: "PM", isBooked: true  },
      { id: "s8", startTime: "04:00", endTime: "04:30", period: "PM", isBooked: false },
    ],
  },
  {
    id: "d3",
    date: "2025-07-18",
    timeSlots: [
      { id: "s9",  startTime: "10:00", endTime: "10:30", period: "AM", isBooked: false },
      { id: "s10", startTime: "10:30", endTime: "11:00", period: "AM", isBooked: false },
    ],
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const uid = () => Math.random().toString(36).slice(2, 10)

const fmtFull = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  })

const fmtShort = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    weekday: "short", day: "numeric", month: "short",
  })

// ─── Toast ────────────────────────────────────────────────────────────────────

const Toast = ({ msg, type, onClose }: { msg: string; type: "success" | "error"; onClose: () => void }) => (
  <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 text-white text-sm font-semibold px-5 py-3 rounded-2xl shadow-2xl animate-toast ${type === "success" ? "bg-[#0F172A]" : "bg-rose-600"}`}>
    {type === "success"
      ? <CheckCircle2 className="w-4 h-4 text-[#14B8A6]" />
      : <AlertCircle className="w-4 h-4" />
    }
    {msg}
    <button onClick={onClose}><X className="w-3.5 h-3.5 opacity-50 hover:opacity-100" /></button>
  </div>
)

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SchedulePage() {
  const [dates, setDates]           = useState<AvailabilityDate[]>(INITIAL_DATES)
  const [newDate, setNewDate]       = useState("")
  const [expandedId, setExpanded]   = useState<string | null>(INITIAL_DATES[0]?.id ?? null)
  const [newSlots, setNewSlots]     = useState<Record<string, { start: string; end: string; period: Period }>>({})
  const [toast, setToast]           = useState<{ msg: string; type: "success" | "error" } | null>(null)

  const fire = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  // ── Date ops ──
  const addDate = () => {
    if (!newDate) return
    if (dates.find(d => d.date === newDate)) { fire("Date already exists!", "error"); return }
    const nd: AvailabilityDate = { id: uid(), date: newDate, timeSlots: [] }
    setDates(prev => [...prev, nd].sort((a, b) => a.date.localeCompare(b.date)))
    setExpanded(nd.id)
    setNewDate("")
    fire(`${fmtShort(newDate)} added`)
  }

  const deleteDate = (id: string) => {
    const d = dates.find(x => x.id === id)
    const hasBooked = d?.timeSlots.some(s => s.isBooked)
    if (hasBooked) { fire("Cannot delete — date has booked slots!", "error"); return }
    setDates(prev => prev.filter(x => x.id !== id))
    if (expandedId === id) setExpanded(null)
    fire("Date removed", "error")
  }

  // ── Slot ops ──
  const ns = (dateId: string) => newSlots[dateId] ?? { start: "", end: "", period: "AM" as Period }

  const setNs = (dateId: string, patch: Partial<{ start: string; end: string; period: Period }>) =>
    setNewSlots(prev => ({ ...prev, [dateId]: { ...ns(dateId), ...patch } }))

  const addSlot = (dateId: string) => {
    const s = ns(dateId)
    if (!s.start || !s.end) { fire("Fill in start and end times", "error"); return }
    const slot: TimeSlot = { id: uid(), startTime: s.start, endTime: s.end, period: s.period, isBooked: false }
    setDates(prev => prev.map(d =>
      d.id === dateId ? { ...d, timeSlots: [...d.timeSlots, slot] } : d
    ))
    setNewSlots(prev => ({ ...prev, [dateId]: { start: "", end: "", period: "AM" } }))
    fire("Slot added")
  }

  const deleteSlot = (dateId: string, slotId: string) => {
    setDates(prev => prev.map(d =>
      d.id === dateId
        ? { ...d, timeSlots: d.timeSlots.filter(s => s.id !== slotId) }
        : d
    ))
    fire("Slot removed", "error")
  }

  // ── Summary stats ──
  const totalSlots  = dates.reduce((a, d) => a + d.timeSlots.length, 0)
  const bookedSlots = dates.reduce((a, d) => a + d.timeSlots.filter(s => s.isBooked).length, 0)
  const freeSlots   = totalSlots - bookedSlots

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Outfit:wght@300;400;500;600;700&display=swap');
        .sch { font-family: 'Outfit', sans-serif; }
        .fade-up { animation: fu 0.35s ease both; }
        @keyframes fu { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes toast-in { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .animate-toast { animation: toast-in 0.25s ease both; }
        .slot-pill { transition: all 0.15s ease; }
        .slot-pill:hover { transform: translateY(-1px); }
        .accordion-content { animation: fu 0.2s ease both; }
      `}</style>

      <div className="sch p-6 max-w-5xl mx-auto space-y-6">

        {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

        {/* ── Page header ─────────────────────────────────────────────── */}
        <div className="fade-up">
          <div className="flex items-center gap-2 mb-1">
            <CalendarCheck className="w-4 h-4 text-[#14B8A6]" />
            <p className="text-xs font-bold text-[#14B8A6] uppercase tracking-widest">Schedule</p>
          </div>
          <h1 className="text-2xl font-bold text-[#0F172A]">My Availability</h1>
          <p className="text-slate-400 text-sm mt-0.5">Manage your dates and time slots for patient bookings</p>
        </div>

        {/* ── Stats row ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-4 fade-up" style={{ animationDelay: "0.05s" }}>
          {[
            { label: "Dates Added",   value: dates.length, icon: CalendarDays, color: "text-[#14B8A6]",  bg: "bg-teal-50",   border: "border-teal-100"   },
            { label: "Free Slots",    value: freeSlots,    icon: Sparkles,     color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-100" },
            { label: "Booked Slots",  value: bookedSlots,  icon: Layers,       color: "text-amber-500",  bg: "bg-amber-50",  border: "border-amber-100"  },
          ].map(({ label, value, icon: Icon, color, bg, border }) => (
            <div key={label} className="bg-white border border-[#E8EEF4] rounded-2xl px-5 py-4 shadow-sm">
              <div className={`w-8 h-8 ${bg} border ${border} rounded-xl flex items-center justify-center mb-2`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <p className="text-2xl font-bold text-[#0F172A]">{value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* ── Add date panel ──────────────────────────────────────────── */}
        <div className="fade-up bg-white border border-[#E8EEF4] rounded-2xl p-6 shadow-sm" style={{ animationDelay: "0.08s" }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-teal-50 border border-teal-100 rounded-xl flex items-center justify-center">
              <Plus className="w-4 h-4 text-[#14B8A6]" />
            </div>
            <div>
              <h2 className="font-bold text-[#0F172A] text-sm">Add Availability Date</h2>
              <p className="text-[11px] text-slate-400">Pick a date to open it for patient bookings</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="date"
              value={newDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={e => setNewDate(e.target.value)}
              className="flex-1 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6] transition"
            />
            <button
              onClick={addDate}
              disabled={!newDate}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#14B8A6] hover:bg-[#0f9a8e] disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-bold rounded-xl transition-all shadow-sm shadow-teal-100 disabled:shadow-none"
            >
              <CalendarDays className="w-4 h-4" />
              Add Date
            </button>
          </div>
        </div>

        {/* ── Dates list ──────────────────────────────────────────────── */}
        <div className="space-y-3 fade-up" style={{ animationDelay: "0.12s" }}>
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              {dates.length} Availability Date{dates.length !== 1 ? "s" : ""}
            </p>
            {dates.length > 0 && (
              <p className="text-[11px] text-slate-400">{totalSlots} total slots across all dates</p>
            )}
          </div>

          {dates.length === 0 ? (
            <div className="bg-white border border-dashed border-[#E5E7EB] rounded-2xl py-14 text-center">
              <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <CalendarDays className="w-6 h-6 text-[#14B8A6]" />
              </div>
              <p className="font-semibold text-[#0F172A]">No dates added yet</p>
              <p className="text-sm text-slate-400 mt-1">Add your first availability date above</p>
            </div>
          ) : (
            dates.map((dateObj, idx) => {
              const isOpen      = expandedId === dateObj.id
              const free        = dateObj.timeSlots.filter(s => !s.isBooked).length
              const booked      = dateObj.timeSlots.filter(s => s.isBooked).length
              const slot        = ns(dateObj.id)
              const hasBookings = booked > 0

              return (
                <div
                  key={dateObj.id}
                  className="bg-white border border-[#E8EEF4] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow fade-up"
                  style={{ animationDelay: `${0.12 + idx * 0.04}s` }}
                >
                  {/* ── Date header row ── */}
                  <div
                    className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-[#FAFBFC] transition-colors select-none"
                    onClick={() => setExpanded(isOpen ? null : dateObj.id)}
                  >
                    {/* Date tile */}
                    <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center flex-shrink-0 ${isOpen ? "bg-[#14B8A6]" : "bg-teal-50 border border-teal-100"}`}>
                      <span className={`text-[10px] font-bold uppercase leading-none ${isOpen ? "text-teal-100" : "text-slate-400"}`}>
                        {new Date(dateObj.date).toLocaleDateString("en-IN", { weekday: "short" })}
                      </span>
                      <span className={`text-lg font-bold leading-none mt-0.5 ${isOpen ? "text-white" : "text-[#0F172A]"}`}>
                        {new Date(dateObj.date).getDate()}
                      </span>
                    </div>

                    {/* Date info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[#0F172A] text-sm">{fmtFull(dateObj.date)}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-0.5">
                        {free > 0 && (
                          <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            {free} free
                          </span>
                        )}
                        {booked > 0 && (
                          <span className="text-[11px] font-semibold text-amber-600 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            {booked} booked
                          </span>
                        )}
                        {dateObj.timeSlots.length === 0 && (
                          <span className="text-[11px] text-slate-400 italic">No slots yet</span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={e => { e.stopPropagation(); deleteDate(dateObj.id) }}
                        title={hasBookings ? "Cannot delete — has bookings" : "Delete date"}
                        className={`p-2 rounded-xl border transition-all ${
                          hasBookings
                            ? "text-slate-200 border-slate-100 cursor-not-allowed"
                            : "text-slate-300 border-[#E8EEF4] hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50"
                        }`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <div className={`p-2 rounded-xl text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* ── Expanded slot area ── */}
                  {isOpen && (
                    <div className="accordion-content border-t border-[#F1F5F9] bg-[#FAFBFC] px-5 py-5 space-y-5">

                      {/* Existing slots */}
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                          <Clock className="w-3 h-3" /> Time Slots
                        </p>

                        {dateObj.timeSlots.length === 0 ? (
                          <p className="text-sm text-slate-400 italic py-2">No slots yet — add one below.</p>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {dateObj.timeSlots.map(slot => (
                              <div
                                key={slot.id}
                                className={`slot-pill flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold ${
                                  slot.isBooked
                                    ? "bg-amber-50 border-amber-200 text-amber-700"
                                    : slot.period === "AM"
                                    ? "bg-sky-50 border-sky-200 text-sky-700"
                                    : "bg-violet-50 border-violet-200 text-violet-700"
                                }`}
                              >
                                {slot.period === "AM"
                                  ? <Sun className="w-3 h-3 flex-shrink-0" />
                                  : <Moon className="w-3 h-3 flex-shrink-0" />
                                }
                                {slot.startTime} – {slot.endTime}
                                <span className="opacity-50 text-[10px]">{slot.period}</span>

                                {slot.isBooked ? (
                                  <span className="ml-1 bg-amber-100 text-amber-600 text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                                    Booked
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => deleteSlot(dateObj.id, slot.id)}
                                    className="ml-1 opacity-40 hover:opacity-100 transition-opacity"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Add slot form */}
                      <div className="border-t border-[#E8EEF4] pt-4">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                          <Plus className="w-3 h-3" /> Add New Slot
                        </p>

                        <div className="flex flex-wrap gap-3 items-end">
                          {/* Start time */}
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                              Start Time
                            </label>
                            <input
                              type="time"
                              value={slot.start}
                              onChange={e => setNs(dateObj.id, { start: e.target.value })}
                              className="bg-white border border-[#E5E7EB] rounded-xl px-3 py-2 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6] transition"
                            />
                          </div>

                          {/* End time */}
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                              End Time
                            </label>
                            <input
                              type="time"
                              value={slot.end}
                              onChange={e => setNs(dateObj.id, { end: e.target.value })}
                              className="bg-white border border-[#E5E7EB] rounded-xl px-3 py-2 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6] transition"
                            />
                          </div>

                          {/* AM / PM toggle */}
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                              Period
                            </label>
                            <div className="flex rounded-xl border border-[#E5E7EB] overflow-hidden bg-white">
                              {(["AM", "PM"] as Period[]).map(p => (
                                <button
                                  key={p}
                                  onClick={() => setNs(dateObj.id, { period: p })}
                                  className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold transition-all ${
                                    slot.period === p
                                      ? p === "AM"
                                        ? "bg-amber-400 text-white"
                                        : "bg-violet-500 text-white"
                                      : "text-slate-400 hover:bg-slate-50"
                                  }`}
                                >
                                  {p === "AM"
                                    ? <Sun className="w-3 h-3" />
                                    : <Moon className="w-3 h-3" />
                                  }
                                  {p}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Add button */}
                          <button
                            onClick={() => addSlot(dateObj.id)}
                            disabled={!slot.start || !slot.end}
                            className="flex items-center gap-2 px-5 py-2 bg-[#14B8A6] hover:bg-[#0f9a8e] disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-bold rounded-xl transition-all"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add Slot
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>

        {/* ── Tips footer ─────────────────────────────────────────────── */}
        {dates.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-6 fade-up">
            <div className="flex items-start gap-3 bg-teal-50 border border-teal-100 rounded-2xl p-4">
              <CheckCircle2 className="w-4 h-4 text-[#14B8A6] mt-0.5 flex-shrink-0" />
              <p className="text-xs text-slate-600">
                <span className="font-semibold text-[#0F172A]">Booked slots</span> can't be deleted — cancel the appointment first from the Appointments page.
              </p>
            </div>
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-2xl p-4">
              <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-slate-600">
                <span className="font-semibold text-[#0F172A]">Dates with bookings</span> can't be deleted. Remove all free slots first or cancel existing appointments.
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}