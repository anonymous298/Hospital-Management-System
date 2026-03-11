// app/(doctorAdmin)/doctorAdmin/page.tsx
// Overview — the main landing page of the Doctor Admin dashboard

import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import {
  CalendarDays, Clock, Users, TrendingUp,
  CheckCircle2, AlertCircle, ArrowRight,
  Stethoscope, Star, Activity,
} from "lucide-react"
import Link from "next/link"

// ─── Dummy data (replace with real Prisma queries later) ─────────────────────

const STATS = [
  {
    label: "Total Appointments",
    value: "284",
    delta: "+12 this week",
    positive: true,
    icon: CalendarDays,
    color: "text-[#14B8A6]",
    bg: "bg-teal-50",
    border: "border-teal-100",
  },
  {
    label: "Today's Slots",
    value: "8",
    delta: "3 remaining",
    positive: true,
    icon: Clock,
    color: "text-blue-500",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  {
    label: "Patients Treated",
    value: "8,200+",
    delta: "+34 this month",
    positive: true,
    icon: Users,
    color: "text-violet-500",
    bg: "bg-violet-50",
    border: "border-violet-100",
  },
  {
    label: "Success Rate",
    value: "97%",
    delta: "Above average",
    positive: true,
    icon: TrendingUp,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
]

const TODAY_SLOTS = [
  { time: "09:00 – 09:30", patient: "Ravi Kumar",    status: "completed", age: 34 },
  { time: "09:30 – 10:00", patient: "Sneha Sharma",  status: "completed", age: 28 },
  { time: "10:00 – 10:30", patient: "Amit Patel",    status: "upcoming",  age: 45 },
  { time: "10:30 – 11:00", patient: "Divya Nair",    status: "upcoming",  age: 31 },
  { time: "11:00 – 11:30", patient: "Karan Singh",   status: "upcoming",  age: 52 },
  { time: "11:30 – 12:00", patient: "—",             status: "free",      age: 0  },
]

const RECENT_PATIENTS = [
  { name: "Ravi Kumar",   spec: "Follow-up",       date: "Today",      rating: 5 },
  { name: "Priya Mehta",  spec: "Consultation",    date: "Yesterday",  rating: 5 },
  { name: "Arun Das",     spec: "ECG Review",      date: "Jul 12",     rating: 4 },
  { name: "Sunita Rao",   spec: "First Visit",     date: "Jul 11",     rating: 5 },
]

const QUICK_LINKS = [
  { label: "Manage Schedule",   href: "/doctorAdmin/schedule",     icon: CalendarDays, desc: "Add dates & time slots"     },
  { label: "View Appointments", href: "/doctorAdmin/appointments", icon: Clock,        desc: "All upcoming & past"        },
  { label: "Patient Records",   href: "/doctorAdmin/patients",     icon: Users,        desc: "Browse patient details"     },
  { label: "Profile Settings",  href: "/doctorAdmin/settings",     icon: Stethoscope,  desc: "Update your doctor profile" },
]

// ─── Status config ────────────────────────────────────────────────────────────

const slotStatus = {
  completed: { label: "Done",     cls: "bg-slate-100 text-slate-500"                },
  upcoming:  { label: "Upcoming", cls: "bg-teal-50 text-[#14B8A6] border border-teal-200" },
  free:      { label: "Free",     cls: "bg-emerald-50 text-emerald-600 border border-emerald-200" },
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function DoctorAdminOverviewPage() {
  const user = await currentUser()
  if (!user) redirect("/")

  const firstName = user.firstName ?? "Doctor"
  const hour      = new Date().getHours()
  const greeting  = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening"

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Outfit:wght@300;400;500;600;700&display=swap');
        .ov { font-family: 'Outfit', sans-serif; }
        .ov .serif { font-family: 'Instrument Serif', Georgia, serif; }
        .fade-up { animation: fu 0.4s ease both; }
        @keyframes fu { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <div className="ov p-6 space-y-6 max-w-6xl mx-auto">

        {/* ── Greeting Banner ──────────────────────────────────────────── */}
        <div className="fade-up relative bg-gradient-to-br from-[#0F172A] via-[#0f2a2a] to-[#134E4A] rounded-3xl px-8 py-7 overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
            backgroundImage: "radial-gradient(circle at 20% 50%, #14B8A6 1px, transparent 1px), radial-gradient(circle at 80% 50%, #14B8A6 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }} />
          {/* Glow blob */}
          <div className="absolute right-0 top-0 w-64 h-64 bg-[#14B8A6]/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-[#14B8A6] text-xs font-bold uppercase tracking-widest mb-1">{greeting}</p>
              <h1 className="serif text-3xl text-white font-semibold mb-1">Dr. {firstName} 👋</h1>
              <p className="text-white/40 text-sm">
                Here's what's happening with your practice today.
              </p>
            </div>
            <div className="flex-shrink-0 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-center">
              <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">Today</p>
              <p className="text-white font-bold text-lg leading-none">
                {new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
              </p>
              <div className="flex items-center justify-center gap-1.5 mt-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 text-xs font-semibold">Available</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats Grid ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map(({ label, value, delta, positive, icon: Icon, color, bg, border }, i) => (
            <div
              key={label}
              className="fade-up bg-white border border-[#E8EEF4] rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <div className={`w-9 h-9 ${bg} border ${border} rounded-xl flex items-center justify-center mb-3`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mb-1">{label}</p>
              <p className="text-2xl font-bold text-[#0F172A] leading-none mb-1">{value}</p>
              <p className={`text-xs font-medium ${positive ? "text-emerald-500" : "text-rose-500"}`}>{delta}</p>
            </div>
          ))}
        </div>

        {/* ── Two column: Today's schedule + Recent patients ─────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

          {/* Today's schedule (col-span-3) */}
          <div className="lg:col-span-3 fade-up bg-white border border-[#E8EEF4] rounded-2xl shadow-sm overflow-hidden" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1F5F9]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-teal-50 border border-teal-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-4 h-4 text-[#14B8A6]" />
                </div>
                <div>
                  <h2 className="font-bold text-[#0F172A] text-sm">Today's Schedule</h2>
                  <p className="text-[11px] text-slate-400">
                    {TODAY_SLOTS.filter(s => s.status === "upcoming").length} upcoming · {TODAY_SLOTS.filter(s => s.status === "free").length} free
                  </p>
                </div>
              </div>
              <Link href="/doctorAdmin/schedule" className="text-xs font-semibold text-[#14B8A6] hover:text-[#0f9a8e] flex items-center gap-1 transition-colors">
                Manage <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="divide-y divide-[#F8FAFC]">
              {TODAY_SLOTS.map((slot, i) => {
                const cfg = slotStatus[slot.status as keyof typeof slotStatus]
                return (
                  <div key={i} className="flex items-center gap-4 px-6 py-3.5 hover:bg-[#FAFBFC] transition-colors">
                    {/* Time */}
                    <div className="w-28 flex-shrink-0">
                      <p className="text-xs font-bold text-[#0F172A]">{slot.time}</p>
                    </div>
                    {/* Patient */}
                    <div className="flex-1">
                      {slot.patient !== "—" ? (
                        <>
                          <p className="text-sm font-semibold text-[#0F172A]">{slot.patient}</p>
                          <p className="text-xs text-slate-400">Age {slot.age}</p>
                        </>
                      ) : (
                        <p className="text-sm text-slate-300 italic">No booking</p>
                      )}
                    </div>
                    {/* Status badge */}
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${cfg.cls}`}>
                      {cfg.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Recent patients (col-span-2) */}
          <div className="lg:col-span-2 fade-up bg-white border border-[#E8EEF4] rounded-2xl shadow-sm overflow-hidden" style={{ animationDelay: "0.15s" }}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1F5F9]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-violet-50 border border-violet-100 rounded-xl flex items-center justify-center">
                  <Users className="w-4 h-4 text-violet-500" />
                </div>
                <div>
                  <h2 className="font-bold text-[#0F172A] text-sm">Recent Patients</h2>
                  <p className="text-[11px] text-slate-400">Last 4 consultations</p>
                </div>
              </div>
              <Link href="/doctorAdmin/patients" className="text-xs font-semibold text-[#14B8A6] hover:text-[#0f9a8e] flex items-center gap-1 transition-colors">
                All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="divide-y divide-[#F8FAFC]">
              {RECENT_PATIENTS.map((p, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#FAFBFC] transition-colors">
                  {/* Avatar initials */}
                  <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-[11px] font-bold text-[#14B8A6]">
                      {p.name.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#0F172A] truncate">{p.name}</p>
                    <p className="text-xs text-slate-400">{p.spec} · {p.date}</p>
                  </div>
                  {/* Star rating */}
                  <div className="flex items-center gap-0.5 flex-shrink-0">
                    {Array.from({ length: p.rating }).map((_, idx) => (
                      <Star key={idx} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Quick Actions ────────────────────────────────────────────── */}
        <div className="fade-up" style={{ animationDelay: "0.2s" }}>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Quick Actions</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {QUICK_LINKS.map(({ label, href, icon: Icon, desc }, i) => (
              <Link
                key={href}
                href={href}
                className="group flex items-center gap-3 bg-white border border-[#E8EEF4] rounded-2xl px-4 py-4 hover:border-[#14B8A6]/30 hover:shadow-[0_4px_16px_rgba(20,184,166,0.08)] transition-all"
              >
                <div className="w-9 h-9 bg-teal-50 border border-teal-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#14B8A6] group-hover:border-[#14B8A6] transition-colors">
                  <Icon className="w-4 h-4 text-[#14B8A6] group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#0F172A] leading-none mb-0.5">{label}</p>
                  <p className="text-[11px] text-slate-400 truncate">{desc}</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#14B8A6] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>

        {/* ── Performance snapshot ─────────────────────────────────────── */}
        <div className="fade-up bg-white border border-[#E8EEF4] rounded-2xl p-6 shadow-sm" style={{ animationDelay: "0.25s" }}>
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center">
              <Activity className="w-4 h-4 text-emerald-500" />
            </div>
            <div>
              <h2 className="font-bold text-[#0F172A] text-sm">Performance Snapshot</h2>
              <p className="text-[11px] text-slate-400">Based on your profile data</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Appointments this month", value: 42,  max: 60, color: "bg-[#14B8A6]" },
              { label: "Slots utilization",       value: 78,  max: 100, color: "bg-blue-400" },
              { label: "Patient satisfaction",    value: 97,  max: 100, color: "bg-emerald-400" },
              { label: "Follow-up rate",          value: 63,  max: 100, color: "bg-violet-400" },
            ].map(({ label, value, max, color }) => (
              <div key={label}>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-[11px] text-slate-400 font-medium leading-tight">{label}</p>
                  <p className="text-xs font-bold text-[#0F172A]">{value}{max === 100 ? "%" : ""}</p>
                </div>
                <div className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                  <div
                    className={`h-full ${color} rounded-full transition-all`}
                    style={{ width: `${(value / max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Notices ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 fade-up pb-6" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-start gap-3 bg-teal-50 border border-teal-100 rounded-2xl p-4">
            <CheckCircle2 className="w-5 h-5 text-[#14B8A6] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-[#0F172A]">Profile verified</p>
              <p className="text-xs text-slate-500 mt-0.5">Your doctor profile is active and visible to patients on the platform.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-2xl p-4">
            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-[#0F172A]">Add next week's slots</p>
              <p className="text-xs text-slate-500 mt-0.5">You have no availability dates set for next week. <Link href="/doctorAdmin/schedule" className="text-[#14B8A6] font-semibold underline">Add now →</Link></p>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}