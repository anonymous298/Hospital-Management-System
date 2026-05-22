"use client"

// app/(doctorAdmin)/doctorAdmin/profile/page.tsx
// Doctor profile management — view current profile + update all fields

import { useState } from "react"
import {
  Stethoscope, MapPin, GraduationCap, IndianRupee,
  Users, TrendingUp, Briefcase, Edit3, Save, X,
  CheckCircle2, AlertCircle, BadgeCheck, Info,
  ToggleLeft, ToggleRight, FileText, Shield, UserCircle2,
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

type AvailabilityStatus = "AVAILABLE" | "UNAVAILABLE"

interface DoctorProfile {
  // All from Doctor model — all editable
  id : string
  name: string
  specialization: string
  qualification: string
  location: string
  experience: string
  patients: string
  success: string
  about: string
  consultationFee: number
  availability: AvailabilityStatus
  imageUrl: string | null
  // From Clerk — display only, never sent to updateDoctor
  createdAt: Date
  updatedAt: Date
}

// ─── Dummy data ───────────────────────────────────────────────────────────────

// const INITIAL: DoctorProfile = {
//   name:            "Dr. Arjun Mehta",
//   specialization:  "Cardiologist",
//   qualification:   "MBBS · MD · DM — AIIMS New Delhi",
//   location:        "Apollo Hospital, Hyderabad",
//   experience:      "14 years",
//   patients:        "8,200+",
//   success:         "97%",
//   about:           "Senior interventional cardiologist specialising in coronary angioplasty, heart failure management, and structural heart disease. Committed to evidence-based, patient-centred care with a focus on minimally invasive techniques.",
//   consultationFee: 800,
//   availability:    "AVAILABLE",
//   // Clerk — read-only display
//   clerkImage: "https://randomuser.me/api/portraits/men/75.jpg",
//   clerkEmail: "arjun.mehta@gmail.com",
// }

const SPECIALIZATIONS = [
  "Cardiologist", "Neurologist", "Orthopedic Surgeon", "Dermatologist",
  "Pediatrician", "Gynecologist", "Ophthalmologist", "Psychiatrist",
  "Oncologist", "Endocrinologist", "Urologist", "General Physician",
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const inputCls = "w-full bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6] transition"
const labelCls = "block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5"

// ─── Toast ────────────────────────────────────────────────────────────────────

const Toast = ({ msg, type, onClose }: { msg: string; type: "success" | "error"; onClose: () => void }) => (
  <div className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-3 text-white text-sm font-semibold px-5 py-3 rounded-2xl shadow-2xl animate-toast ${type === "success" ? "bg-[#0F172A]" : "bg-rose-600"}`}>
    {type === "success" ? <CheckCircle2 className="w-4 h-4 text-[#14B8A6]" /> : <AlertCircle className="w-4 h-4" />}
    {msg}
    <button onClick={onClose}><X className="w-3.5 h-3.5 opacity-50 hover:opacity-100" /></button>
  </div>
)

// ─── Section wrapper ──────────────────────────────────────────────────────────

const Section = ({ icon: Icon, title, subtitle, children }: {
  icon: React.ElementType
  title: string
  subtitle: string
  children: React.ReactNode
}) => (
  <div className="bg-white border border-[#E8EEF4] rounded-2xl shadow-sm overflow-hidden">
    <div className="flex items-center gap-3 px-6 py-4 border-b border-[#F1F5F9]">
      <div className="w-8 h-8 bg-teal-50 border border-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-[#14B8A6]" />
      </div>
      <div>
        <h2 className="font-bold text-[#0F172A] text-sm">{title}</h2>
        <p className="text-[11px] text-slate-400">{subtitle}</p>
      </div>
    </div>
    <div className="px-6 py-5">{children}</div>
  </div>
)

// ─── Read-only field ──────────────────────────────────────────────────────────

const ReadField = ({ icon: Icon, value }: { icon: React.ElementType; value: string }) => (
  <div className="flex items-center gap-2 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl px-4 py-2.5">
    <Icon className="w-4 h-4 text-[#14B8A6] flex-shrink-0" />
    <p className="text-sm font-semibold text-[#0F172A] flex-1 truncate">{value}</p>
  </div>
)

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DoctorProfilePage({DoctorProfileData} : {DoctorProfileData: DoctorProfile}) {
  const [profile, setProfile] = useState<DoctorProfile>(DoctorProfileData)
  const [draft,   setDraft  ] = useState<DoctorProfile>(DoctorProfileData)
  const [editing, setEditing] = useState(false)
  const [toast,   setToast  ] = useState<{ msg: string; type: "success" | "error" } | null>(null)
  const [saving,  setSaving ] = useState(false)

  const fire = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  const set = (field: keyof DoctorProfile, val: string | number) =>
    setDraft(d => ({ ...d, [field]: val }))

  const startEdit  = () => { setDraft({ ...profile }); setEditing(true) }
  const cancelEdit = () => { setDraft({ ...profile }); setEditing(false) }

  const saveProfile = async () => {
    if (!draft.name.trim() || !draft.specialization || !draft.qualification.trim() || !draft.location.trim()) {
      fire("Please fill in all required fields", "error"); return
    }
    setSaving(true)

    // TODO: replace timeout with real server action:
    // await saveDoctorProfile(user.doctorId, {
    //   name:            draft.name,
    //   specialization:  draft.specialization,
    //   qualification:   draft.qualification,
    //   location:        draft.location,
    //   experience:      draft.experience,
    //   patients:        draft.patients,
    //   success:         draft.success,
    //   about:           draft.about,
    //   consultationFee: draft.consultationFee,
    // })

    await new Promise(r => setTimeout(r, 800))
    setProfile({ ...draft })
    setEditing(false)
    setSaving(false)
    fire("Profile updated successfully")
  }

  const toggleAvailability = async () => {
    const next: AvailabilityStatus = profile.availability === "AVAILABLE" ? "UNAVAILABLE" : "AVAILABLE"
    setProfile(p => ({ ...p, availability: next }))
    if (editing) setDraft(d => ({ ...d, availability: next }))
    fire(`You are now ${next === "AVAILABLE" ? "available" : "unavailable"} for bookings`)
    // TODO: await updateDoctorAvailability(user.doctorId, next)
  }

  const isAvail = profile.availability === "AVAILABLE"

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Outfit:wght@300;400;500;600;700&display=swap');
        .prf { font-family: 'Outfit', sans-serif; }
        .prf .serif { font-family: 'Instrument Serif', Georgia, serif; }
        .fade-up { animation: fu 0.35s ease both; }
        @keyframes fu { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes toast-in { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .animate-toast { animation: toast-in 0.25s ease both; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="prf p-6 max-w-4xl mx-auto space-y-6 pb-10">

        {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

        {/* ── Page header ── */}
        <div className="fade-up flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-[#14B8A6]" />
              <p className="text-xs font-bold text-[#14B8A6] uppercase tracking-widest">Manage Profile</p>
            </div>
            <h1 className="text-2xl font-bold text-[#0F172A]">Your Doctor Profile</h1>
            <p className="text-slate-400 text-sm mt-0.5">Manage your public profile visible to patients</p>
          </div>

          {!editing ? (
            <button
              onClick={startEdit}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#14B8A6] hover:bg-[#0f9a8e] text-white text-sm font-bold rounded-xl transition shadow-sm shadow-teal-100 flex-shrink-0"
            >
              <Edit3 className="w-4 h-4" /> Edit Profile
            </button>
          ) : (
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={cancelEdit}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-[#E5E7EB] rounded-xl hover:bg-slate-50 transition"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
              <button
                onClick={saveProfile}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#14B8A6] hover:bg-[#0f9a8e] disabled:bg-[#14B8A6]/60 text-white text-sm font-bold rounded-xl transition shadow-sm shadow-teal-100"
              >
                {saving
                  ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full spin" />
                  : <Save className="w-4 h-4" />
                }
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          )}
        </div>

        {/* ── Hero card ── */}
        <div className="fade-up relative bg-gradient-to-br from-[#0F172A] via-[#0f2a2a] to-[#134E4A] rounded-3xl px-8 py-7 overflow-hidden" style={{ animationDelay: "0.04s" }}>
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
            backgroundImage: "radial-gradient(circle, #14B8A6 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }} />
          <div className="absolute right-0 top-0 w-56 h-56 bg-[#14B8A6]/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={profile.imageUrl || "/default-avatar.png"} alt={profile.name} className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-[#14B8A6] rounded-lg flex items-center justify-center border-2 border-[#0F172A]">
                <BadgeCheck className="w-3.5 h-3.5 text-white" />
              </div>
            </div>

            {/* Name + meta — reflects live draft while editing */}
            <div className="flex-1 min-w-0">
              <p className="text-white/40 text-xs mb-0.5">Verified Doctor</p>
              <h2 className="serif text-2xl text-white font-semibold">
                {editing ? draft.name || "—" : profile.name}
              </h2>
              <p className="text-[#14B8A6] text-sm font-semibold mt-0.5">
                {editing ? draft.specialization : profile.specialization}
              </p>
              <p className="text-white/40 text-xs mt-1">{profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "—"}</p>
            </div>

            {/* Stats */}
            <div className="flex gap-5 flex-shrink-0">
              {[
                { icon: Briefcase,  val: editing ? draft.experience : profile.experience, label: "Experience" },
                { icon: Users,      val: editing ? draft.patients   : profile.patients,   label: "Patients"   },
                { icon: TrendingUp, val: editing ? draft.success    : profile.success,    label: "Success"    },
              ].map(({ icon: Icon, val, label }) => (
                <div key={label} className="text-center">
                  <Icon className="w-4 h-4 text-[#14B8A6] mx-auto mb-1" />
                  <p className="text-white font-bold text-sm leading-none">{val || "—"}</p>
                  <p className="text-white/30 text-[10px] mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Availability */}
            <div className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold ${isAvail ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-white/5 border-white/10 text-white/30"}`}>
              <span className={`w-2 h-2 rounded-full ${isAvail ? "bg-emerald-400 animate-pulse" : "bg-white/20"}`} />
              {isAvail ? "Available" : "Unavailable"}
            </div>
          </div>
        </div>

        {/* ── Availability toggle ── */}
        <div className="fade-up" style={{ animationDelay: "0.06s" }}>
          <div className="bg-white border border-[#E8EEF4] rounded-2xl px-6 py-4 shadow-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isAvail ? "bg-emerald-50 border border-emerald-100" : "bg-slate-50 border border-slate-200"}`}>
                {isAvail ? <ToggleRight className="w-4 h-4 text-emerald-500" /> : <ToggleLeft className="w-4 h-4 text-slate-400" />}
              </div>
              <div>
                <p className="text-sm font-bold text-[#0F172A]">Availability Status</p>
                <p className="text-[11px] text-slate-400">
                  {isAvail ? "You are currently accepting new bookings" : "You are not accepting new bookings"}
                </p>
              </div>
            </div>
            <button
              onClick={toggleAvailability}
              className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
                isAvail
                  ? "bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100"
                  : "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100"
              }`}
            >
              {isAvail ? "Go Unavailable" : "Go Available"}
            </button>
          </div>
        </div>

        {/* ── Clerk info (read-only) ── */}
        <div className="fade-up" style={{ animationDelay: "0.08s" }}>
          <Section icon={Info} title="Account Information" subtitle="Managed by Clerk — cannot be changed here">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className={labelCls}>Email</p>
                <div className="flex items-center gap-2 bg-slate-50 border border-[#E5E7EB] rounded-xl px-4 py-2.5">
                  <p className="text-sm text-slate-500 flex-1">{profile.name}</p>
                  <span className="text-[10px] text-slate-400 bg-slate-200 px-2 py-0.5 rounded-full font-semibold flex-shrink-0">Read-only</span>
                </div>
              </div>
              <div>
                <p className={labelCls}>Profile Photo</p>
                <div className="flex items-center gap-3 bg-slate-50 border border-[#E5E7EB] rounded-xl px-4 py-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={profile.imageUrl || "/default-avatar.png"} alt="" className="w-7 h-7 rounded-lg object-cover" />
                  <p className="text-sm text-slate-500 flex-1">Via Clerk account</p>
                  <span className="text-[10px] text-slate-400 bg-slate-200 px-2 py-0.5 rounded-full font-semibold flex-shrink-0">Read-only</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-3 flex items-center gap-1.5">
              <BadgeCheck className="w-3.5 h-3.5 text-[#14B8A6]" />
              To update your email or photo, go to your Clerk account settings.
            </p>
          </Section>
        </div>

        {/* ── Professional info (editable) ── */}
        <div className="fade-up" style={{ animationDelay: "0.1s" }}>
          <Section icon={Stethoscope} title="Professional Details" subtitle="Displayed on your public doctor profile">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

              {/* Name — now editable */}
              <div className="sm:col-span-2">
                <label className={labelCls}>Full Name *</label>
                {editing ? (
                  <div className="relative">
                    <UserCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Dr. Full Name"
                      value={draft.name}
                      onChange={e => set("name", e.target.value)}
                      className={`${inputCls} pl-9`}
                    />
                  </div>
                ) : (
                  <ReadField icon={UserCircle2} value={profile.name} />
                )}
              </div>

              {/* Specialization */}
              <div>
                <label className={labelCls}>Specialization *</label>
                {editing ? (
                  <div className="relative">
                    <select
                      value={draft.specialization}
                      onChange={e => set("specialization", e.target.value)}
                      className={`${inputCls} appearance-none pr-8`}
                    >
                      {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <Stethoscope className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                ) : (
                  <ReadField icon={Stethoscope} value={profile.specialization} />
                )}
              </div>

              {/* Consultation fee */}
              <div>
                <label className={labelCls}>Consultation Fee (₹) *</label>
                {editing ? (
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      min={0}
                      value={draft.consultationFee}
                      onChange={e => set("consultationFee", Number(e.target.value))}
                      className={`${inputCls} pl-9`}
                    />
                  </div>
                ) : (
                  <ReadField icon={IndianRupee} value={`₹${profile.consultationFee}`} />
                )}
              </div>

              {/* Qualification */}
              <div className="sm:col-span-2">
                <label className={labelCls}>Qualification *</label>
                {editing ? (
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="MBBS · MD · DM — Institute"
                      value={draft.qualification}
                      onChange={e => set("qualification", e.target.value)}
                      className={`${inputCls} pl-9`}
                    />
                  </div>
                ) : (
                  <ReadField icon={GraduationCap} value={profile.qualification} />
                )}
              </div>

              {/* Location */}
              <div className="sm:col-span-2">
                <label className={labelCls}>Location *</label>
                {editing ? (
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Hospital, City"
                      value={draft.location}
                      onChange={e => set("location", e.target.value)}
                      className={`${inputCls} pl-9`}
                    />
                  </div>
                ) : (
                  <ReadField icon={MapPin} value={profile.location} />
                )}
              </div>

            </div>
          </Section>
        </div>

        {/* ── Stats ── */}
        <div className="fade-up" style={{ animationDelay: "0.12s" }}>
          <Section icon={TrendingUp} title="Profile Statistics" subtitle="Shown as social proof on your doctor card">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                { field: "experience" as const, label: "Experience",       icon: Briefcase,  placeholder: "e.g. 12 years" },
                { field: "patients"   as const, label: "Patients Treated", icon: Users,      placeholder: "e.g. 8,200+"   },
                { field: "success"    as const, label: "Success Rate",     icon: TrendingUp, placeholder: "e.g. 97%"      },
              ].map(({ field, label, icon: Icon, placeholder }) => (
                <div key={field}>
                  <label className={labelCls}>{label}</label>
                  {editing ? (
                    <div className="relative">
                      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder={placeholder}
                        value={draft[field]}
                        onChange={e => set(field, e.target.value)}
                        className={`${inputCls} pl-9`}
                      />
                    </div>
                  ) : (
                    <ReadField icon={Icon} value={profile[field]} />
                  )}
                </div>
              ))}
            </div>
          </Section>
        </div>

        {/* ── About ── */}
        <div className="fade-up" style={{ animationDelay: "0.14s" }}>
          <Section icon={FileText} title="About" subtitle="Your bio shown to patients on your profile page">
            {editing ? (
              <textarea
                rows={5}
                placeholder="Write a short professional bio..."
                value={draft.about}
                onChange={e => set("about", e.target.value)}
                className={`${inputCls} resize-none`}
              />
            ) : (
              <p className="text-sm text-slate-600 leading-relaxed">{profile.about}</p>
            )}
          </Section>
        </div>

        {/* ── Unsaved changes banner ── */}
        {editing && (
          <div className="fade-up flex items-center justify-between gap-4 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <p className="text-sm text-amber-700 font-medium">You have unsaved changes</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={cancelEdit} className="text-xs font-semibold text-amber-700 hover:underline">
                Discard
              </button>
              <button
                onClick={saveProfile}
                disabled={saving}
                className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition"
              >
                {saving
                  ? <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full spin" />
                  : <Save className="w-3 h-3" />
                }
                Save
              </button>
            </div>
          </div>
        )}

      </div>
    </>
  )
}