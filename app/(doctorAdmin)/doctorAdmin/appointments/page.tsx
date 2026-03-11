// 'use client'

// import React, { useState } from 'react'
// import Image from 'next/image'
// import {
//   MapPin, Briefcase, Users, TrendingUp, Star,
//   CalendarDays, Clock, Plus, Trash2, Edit3,
//   Save, X, CheckCircle2, AlertCircle, Stethoscope,
//   BadgeCheck, ChevronDown, ToggleLeft, ToggleRight,
//   IndianRupee, BookOpen, Award,
// } from 'lucide-react'

// // ─── Types ────────────────────────────────────────────────────────────────────

// type DoctorAvailabilityStatus = 'AVAILABLE' | 'UNAVAILABLE'

// interface TimeSlot {
//   id: string
//   startTime: string
//   endTime: string
//   isBooked: boolean // derived from doctorAppointment relation
// }

// interface AvailabilityDate {
//   id: string
//   date: string // ISO string for easy input[type=date] binding
//   timeSlots: TimeSlot[]
// }

// interface DoctorProfile {
//   id: string
//   name: string
//   imageUrl: string
//   specialization: string
//   qualification: string
//   location: string
//   experience: string
//   patients: string
//   success: string
//   about: string
//   consultationFee: number
//   availability: DoctorAvailabilityStatus
//   availabilityDates: AvailabilityDate[]
// }

// // ─── Dummy Data ───────────────────────────────────────────────────────────────

// const INITIAL_DATA: DoctorProfile = {
//   id: 'clx1a2b3c4d5',
//   name: 'Dr. Arjun Mehta',
//   imageUrl: 'https://randomuser.me/api/portraits/men/75.jpg',
//   specialization: 'Cardiologist',
//   qualification: 'MBBS · MD (Cardiology) · DM — AIIMS New Delhi',
//   location: 'Apollo Hospital, Jubilee Hills, Hyderabad',
//   experience: '14 years',
//   patients: '8,200+',
//   success: '97%',
//   about:
//     'Dr. Arjun Mehta is a senior interventional cardiologist with over 14 years of experience managing complex cardiovascular conditions. He specialises in coronary angioplasty, heart failure management, and preventive cardiology. Recognised among the top 50 cardiologists in India by the IMA.',
//   consultationFee: 800,
//   availability: 'AVAILABLE',
//   availabilityDates: [
//     {
//       id: 'date_01',
//       date: '2025-07-14',
//       timeSlots: [
//         { id: 'sl_01', startTime: '09:00', endTime: '09:30', isBooked: true },
//         { id: 'sl_02', startTime: '09:30', endTime: '10:00', isBooked: false },
//         { id: 'sl_03', startTime: '10:00', endTime: '10:30', isBooked: false },
//         { id: 'sl_04', startTime: '10:30', endTime: '11:00', isBooked: true },
//         { id: 'sl_05', startTime: '11:00', endTime: '11:30', isBooked: false },
//       ],
//     },
//     {
//       id: 'date_02',
//       date: '2025-07-16',
//       timeSlots: [
//         { id: 'sl_06', startTime: '14:00', endTime: '14:30', isBooked: false },
//         { id: 'sl_07', startTime: '14:30', endTime: '15:00', isBooked: false },
//         { id: 'sl_08', startTime: '15:00', endTime: '15:30', isBooked: true },
//         { id: 'sl_09', startTime: '15:30', endTime: '16:00', isBooked: false },
//       ],
//     },
//     {
//       id: 'date_03',
//       date: '2025-07-18',
//       timeSlots: [
//         { id: 'sl_10', startTime: '10:00', endTime: '10:30', isBooked: false },
//         { id: 'sl_11', startTime: '10:30', endTime: '11:00', isBooked: false },
//         { id: 'sl_12', startTime: '17:00', endTime: '17:30', isBooked: false },
//       ],
//     },
//   ],
// }

// // ─── Helpers ──────────────────────────────────────────────────────────────────

// const uid = () => Math.random().toString(36).slice(2, 10)

// const fmtDateLabel = (iso: string) =>
//   new Date(iso).toLocaleDateString('en-IN', {
//     weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
//   })

// const inputCls =
//   'w-full bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6] transition'

// // ─── Sub: Section Header ──────────────────────────────────────────────────────

// const SectionHeader = ({ icon: Icon, title, subtitle }: { icon: React.ElementType; title: string; subtitle?: string }) => (
//   <div className="flex items-center gap-3 mb-5">
//     <div className="w-9 h-9 bg-teal-50 border border-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
//       <Icon className="w-4 h-4 text-[#14B8A6]" />
//     </div>
//     <div>
//       <h2 className="font-bold text-[#0F172A] text-base leading-none">{title}</h2>
//       {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
//     </div>
//   </div>
// )

// // ─── Sub: Toast ───────────────────────────────────────────────────────────────

// const Toast = ({ msg, onClose }: { msg: string; onClose: () => void }) => (
//   <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#0F172A] text-white text-sm font-medium px-5 py-3 rounded-2xl shadow-2xl animate-bounce-in">
//     <CheckCircle2 className="w-4 h-4 text-[#14B8A6]" />
//     {msg}
//     <button onClick={onClose}><X className="w-3.5 h-3.5 opacity-50 hover:opacity-100" /></button>
//   </div>
// )

// // ─── Main Component ───────────────────────────────────────────────────────────

// export default function DoctorProfileManager() {
//   const [doc, setDoc]               = useState<DoctorProfile>(INITIAL_DATA)
//   const [editingInfo, setEditInfo]  = useState(false)
//   const [draft, setDraft]           = useState<DoctorProfile>(INITIAL_DATA)
//   const [toast, setToast]           = useState<string | null>(null)
//   const [newDate, setNewDate]       = useState('')
//   const [expandedDate, setExpanded] = useState<string | null>(doc.availabilityDates[0]?.id ?? null)
//   const [newSlots, setNewSlots]     = useState<Record<string, { start: string; end: string }>>({})

//   const showToast = (msg: string) => {
//     setToast(msg)
//     setTimeout(() => setToast(null), 3000)
//   }

//   // ── Doctor info edit ──
//   const startEdit = () => { setDraft({ ...doc }); setEditInfo(true) }
//   const cancelEdit = () => setEditInfo(false)
//   const saveInfo = () => { setDoc({ ...draft }); setEditInfo(false); showToast('Doctor profile updated!') }

//   // ── Availability toggle ──
//   const toggleAvailability = () => {
//     const next: DoctorAvailabilityStatus = doc.availability === 'AVAILABLE' ? 'UNAVAILABLE' : 'AVAILABLE'
//     setDoc(d => ({ ...d, availability: next }))
//     showToast(`Status set to ${next}`)
//   }

//   // ── Add new date ──
//   const addDate = () => {
//     if (!newDate) return
//     if (doc.availabilityDates.find(d => d.date === newDate)) {
//       showToast('Date already exists!'); return
//     }
//     const nd: AvailabilityDate = { id: uid(), date: newDate, timeSlots: [] }
//     setDoc(d => ({ ...d, availabilityDates: [...d.availabilityDates, nd] }))
//     setExpanded(nd.id)
//     setNewDate('')
//     showToast(`Date ${fmtDateLabel(newDate)} added`)
//   }

//   // ── Delete date ──
//   const deleteDate = (dateId: string) => {
//     setDoc(d => ({ ...d, availabilityDates: d.availabilityDates.filter(x => x.id !== dateId) }))
//     showToast('Date removed')
//   }

//   // ── Add slot to date ──
//   const addSlot = (dateId: string) => {
//     const s = newSlots[dateId]
//     if (!s?.start || !s?.end) return
//     const slot: TimeSlot = { id: uid(), startTime: s.start, endTime: s.end, isBooked: false }
//     setDoc(d => ({
//       ...d,
//       availabilityDates: d.availabilityDates.map(date =>
//         date.id === dateId ? { ...date, timeSlots: [...date.timeSlots, slot] } : date
//       ),
//     }))
//     setNewSlots(prev => ({ ...prev, [dateId]: { start: '', end: '' } }))
//     showToast('Time slot added')
//   }

//   // ── Delete slot ──
//   const deleteSlot = (dateId: string, slotId: string) => {
//     setDoc(d => ({
//       ...d,
//       availabilityDates: d.availabilityDates.map(date =>
//         date.id === dateId
//           ? { ...date, timeSlots: date.timeSlots.filter(s => s.id !== slotId) }
//           : date
//       ),
//     }))
//     showToast('Slot removed')
//   }

//   const isAvailable = doc.availability === 'AVAILABLE'

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Outfit:wght@300;400;500;600;700&display=swap');
//         .dpm { font-family: 'Outfit', sans-serif; }
//         .dpm .serif { font-family: 'Instrument Serif', Georgia, serif; }
//         .fade-up { animation: fu 0.4s ease both; }
//         @keyframes fu { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
//         @keyframes bounce-in { 0%{opacity:0;transform:translateY(16px)} 60%{transform:translateY(-4px)} 100%{opacity:1;transform:translateY(0)} }
//         .animate-bounce-in { animation: bounce-in 0.35s ease both; }
//         .slot-chip { transition: all .15s ease; }
//         .slot-chip:hover { transform: translateY(-1px); }
//       `}</style>

//       <div className="dpm min-h-screen bg-[#F8FAFC]">

//         {toast && <Toast msg={toast} onClose={() => setToast(null)} />}

//         {/* ── Top Header Bar ─────────────────────────────────────────────── */}
//         <div className="bg-white border-b border-[#E8EEF4] sticky top-0 z-40">
//           <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="w-8 h-8 bg-[#14B8A6] rounded-xl flex items-center justify-center">
//                 <Stethoscope className="w-4 h-4 text-white" />
//               </div>
//               <div>
//                 <p className="text-[10px] text-slate-400 uppercase tracking-widest leading-none">Doctor Admin</p>
//                 <p className="font-bold text-[#0F172A] text-sm leading-none mt-0.5">Profile Manager</p>
//               </div>
//             </div>
//             <div className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full border ${isAvailable ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-rose-50 text-rose-500 border-rose-200'}`}>
//               <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-rose-400'}`} />
//               {isAvailable ? 'Currently Available' : 'Unavailable'}
//             </div>
//           </div>
//         </div>

//         <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">

//           {/* ── Hero Card: Doctor Info ──────────────────────────────────── */}
//           <div className="bg-white border border-[#E8EEF4] rounded-3xl overflow-hidden shadow-sm fade-up">

//             {/* Dark top banner */}
//             <div className="relative bg-gradient-to-r from-[#0F172A] via-[#0F2A2A] to-[#134E4A] px-8 pt-8 pb-16">
//               <div className="absolute inset-0 opacity-10" style={{
//                 backgroundImage: 'radial-gradient(circle at 30% 50%, #14B8A6 1px, transparent 1px), radial-gradient(circle at 70% 50%, #14B8A6 1px, transparent 1px)',
//                 backgroundSize: '32px 32px',
//               }} />
//               <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//                 <div>
//                   <span className="text-[10px] font-bold text-[#14B8A6] uppercase tracking-widest bg-teal-900/40 border border-teal-700/30 px-2.5 py-1 rounded-full">
//                     {doc.specialization}
//                   </span>
//                   <h1 className="serif text-3xl font-semibold text-white mt-2">{doc.name}</h1>
//                   <p className="text-white/40 text-sm mt-0.5">{doc.qualification}</p>
//                 </div>
//                 <div className="flex gap-2">
//                   {/* Availability toggle */}
//                   <button
//                     onClick={toggleAvailability}
//                     className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${isAvailable ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20' : 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20'}`}
//                   >
//                     {isAvailable ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
//                     {isAvailable ? 'Set Unavailable' : 'Set Available'}
//                   </button>
//                   {!editingInfo && (
//                     <button
//                       onClick={startEdit}
//                       className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white text-xs font-bold transition-all"
//                     >
//                       <Edit3 className="w-3.5 h-3.5" /> Edit Profile
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Avatar overlapping banner */}
//             <div className="relative px-8 pb-8">
//               <div className="flex flex-col sm:flex-row items-start gap-6 -mt-10">
//                 <div className="relative flex-shrink-0">
//                   <div className="w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-white shadow-xl">
//                     <Image src={doc.imageUrl} alt={doc.name} width={80} height={80} className="object-cover w-full h-full" />
//                   </div>
//                   <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-[#14B8A6] rounded-full flex items-center justify-center shadow">
//                     <BadgeCheck className="w-3.5 h-3.5 text-white" />
//                   </div>
//                 </div>

//                 <div className="flex-1 pt-12 sm:pt-0 mt-0 sm:mt-2">
//                   <div className="flex items-center gap-1.5 text-slate-400 text-sm mb-4">
//                     <MapPin className="w-3.5 h-3.5 text-[#14B8A6]" />
//                     {doc.location}
//                   </div>

//                   {/* Stats */}
//                   <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//                     {[
//                       { icon: Briefcase,   label: 'Experience',   value: doc.experience },
//                       { icon: Users,       label: 'Patients',     value: doc.patients },
//                       { icon: TrendingUp,  label: 'Success Rate', value: doc.success },
//                       { icon: IndianRupee, label: 'Fee / Session', value: `₹${doc.consultationFee}` },
//                     ].map(({ icon: Icon, label, value }) => (
//                       <div key={label} className="bg-[#F8FAFC] border border-[#E8EEF4] rounded-xl px-3 py-2.5 flex items-center gap-2.5">
//                         <Icon className="w-4 h-4 text-[#14B8A6] flex-shrink-0" />
//                         <div>
//                           <p className="text-[10px] text-slate-400 leading-none">{label}</p>
//                           <p className="font-bold text-sm text-[#0F172A] mt-0.5">{value}</p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* ── Edit Form (conditionally shown) ────────────────────────── */}
//           {editingInfo && (
//             <div className="bg-white border border-[#14B8A6]/30 rounded-3xl p-7 shadow-sm fade-up">
//               <div className="flex items-center justify-between mb-6">
//                 <SectionHeader icon={Edit3} title="Edit Doctor Profile" subtitle="All changes are local until saved" />
//                 <div className="flex gap-2">
//                   <button onClick={cancelEdit} className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-500 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl hover:border-slate-300 transition">
//                     <X className="w-3.5 h-3.5" /> Cancel
//                   </button>
//                   <button onClick={saveInfo} className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#14B8A6] hover:bg-[#0f9a8e] rounded-xl transition shadow-sm shadow-teal-100">
//                     <Save className="w-3.5 h-3.5" /> Save Changes
//                   </button>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {([
//                   ['name',            'Full Name',         'text'],
//                   ['specialization',  'Specialization',    'text'],
//                   ['qualification',   'Qualification',     'text'],
//                   ['location',        'Location',          'text'],
//                   ['experience',      'Experience',        'text'],
//                   ['patients',        'Patients Treated',  'text'],
//                   ['success',         'Success Rate',      'text'],
//                   ['consultationFee', 'Consultation Fee',  'number'],
//                 ] as [keyof DoctorProfile, string, string][]).map(([field, label, type]) => (
//                   <div key={field}>
//                     <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">{label}</label>
//                     <input
//                       type={type}
//                       value={String(draft[field] ?? '')}
//                       onChange={e => setDraft(d => ({ ...d, [field]: type === 'number' ? Number(e.target.value) : e.target.value }))}
//                       className={inputCls}
//                     />
//                   </div>
//                 ))}
//                 {/* About — full width */}
//                 <div className="md:col-span-2">
//                   <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">About</label>
//                   <textarea
//                     rows={3}
//                     value={draft.about}
//                     onChange={e => setDraft(d => ({ ...d, about: e.target.value }))}
//                     className={`${inputCls} resize-none`}
//                   />
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* ── About (read only) ──────────────────────────────────────── */}
//           {!editingInfo && (
//             <div className="bg-white border border-[#E8EEF4] rounded-3xl p-7 shadow-sm fade-up">
//               <SectionHeader icon={BookOpen} title="About" subtitle="Doctor biography" />
//               <p className="text-slate-500 leading-relaxed text-sm">{doc.about}</p>
//             </div>
//           )}

//           {/* ── Availability Dates + Slots ─────────────────────────────── */}
//           <div className="bg-white border border-[#E8EEF4] rounded-3xl p-7 shadow-sm fade-up">
//             <div className="flex items-start justify-between mb-5">
//               <SectionHeader icon={CalendarDays} title="Availability Management" subtitle="Manage dates and time slots" />
//               <span className="text-xs font-semibold text-slate-400 bg-[#F8FAFC] border border-[#E8EEF4] px-3 py-1.5 rounded-full">
//                 {doc.availabilityDates.length} date{doc.availabilityDates.length !== 1 ? 's' : ''}
//               </span>
//             </div>

//             {/* Add new date */}
//             <div className="flex gap-3 mb-6 p-4 bg-[#F8FAFC] border border-[#E8EEF4] rounded-2xl">
//               <div className="flex-1">
//                 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Add New Date</label>
//                 <input
//                   type="date"
//                   value={newDate}
//                   onChange={e => setNewDate(e.target.value)}
//                   className={inputCls}
//                 />
//               </div>
//               <div className="flex items-end">
//                 <button
//                   onClick={addDate}
//                   disabled={!newDate}
//                   className="flex items-center gap-2 px-5 py-2.5 bg-[#14B8A6] hover:bg-[#0f9a8e] disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-semibold rounded-xl transition-all"
//                 >
//                   <Plus className="w-4 h-4" /> Add Date
//                 </button>
//               </div>
//             </div>

//             {/* Date list */}
//             {doc.availabilityDates.length === 0 ? (
//               <div className="text-center py-10 text-slate-400 text-sm">
//                 No availability dates. Add one above.
//               </div>
//             ) : (
//               <div className="space-y-3">
//                 {doc.availabilityDates.map(dateObj => {
//                   const isOpen      = expandedDate === dateObj.id
//                   const freeCount   = dateObj.timeSlots.filter(s => !s.isBooked).length
//                   const bookedCount = dateObj.timeSlots.filter(s => s.isBooked).length
//                   const ns          = newSlots[dateObj.id] ?? { start: '', end: '' }

//                   return (
//                     <div key={dateObj.id} className="border border-[#E8EEF4] rounded-2xl overflow-hidden">

//                       {/* Date header row */}
//                       <div
//                         className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-[#F8FAFC] transition"
//                         onClick={() => setExpanded(isOpen ? null : dateObj.id)}
//                       >
//                         <div className="flex items-center gap-3">
//                           <div className="w-9 h-9 bg-teal-50 rounded-xl flex items-center justify-center flex-shrink-0">
//                             <CalendarDays className="w-4 h-4 text-[#14B8A6]" />
//                           </div>
//                           <div>
//                             <p className="font-semibold text-[#0F172A] text-sm">{fmtDateLabel(dateObj.date)}</p>
//                             <div className="flex items-center gap-3 mt-0.5">
//                               <span className="text-[11px] text-emerald-600 font-medium">{freeCount} free</span>
//                               {bookedCount > 0 && <span className="text-[11px] text-amber-500 font-medium">{bookedCount} booked</span>}
//                               <span className="text-[11px] text-slate-400">{dateObj.timeSlots.length} total slots</span>
//                             </div>
//                           </div>
//                         </div>

//                         <div className="flex items-center gap-2">
//                           <button
//                             onClick={e => { e.stopPropagation(); deleteDate(dateObj.id) }}
//                             className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition"
//                           >
//                             <Trash2 className="w-3.5 h-3.5" />
//                           </button>
//                           <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
//                         </div>
//                       </div>

//                       {/* Expanded: slots */}
//                       {isOpen && (
//                         <div className="border-t border-[#E8EEF4] bg-[#FAFBFC] px-5 py-5">

//                           {/* Existing slots */}
//                           {dateObj.timeSlots.length > 0 ? (
//                             <div className="flex flex-wrap gap-2 mb-5">
//                               {dateObj.timeSlots.map(slot => (
//                                 <div
//                                   key={slot.id}
//                                   className={`slot-chip flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold ${
//                                     slot.isBooked
//                                       ? 'bg-amber-50 border-amber-200 text-amber-600'
//                                       : 'bg-white border-[#E8EEF4] text-[#0F172A]'
//                                   }`}
//                                 >
//                                   <Clock className={`w-3 h-3 ${slot.isBooked ? 'text-amber-500' : 'text-[#14B8A6]'}`} />
//                                   {slot.startTime} – {slot.endTime}
//                                   {slot.isBooked ? (
//                                     <span className="text-[9px] bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded-full">Booked</span>
//                                   ) : (
//                                     <button
//                                       onClick={() => deleteSlot(dateObj.id, slot.id)}
//                                       className="ml-1 text-slate-300 hover:text-rose-500 transition"
//                                     >
//                                       <X className="w-3 h-3" />
//                                     </button>
//                                   )}
//                                 </div>
//                               ))}
//                             </div>
//                           ) : (
//                             <p className="text-xs text-slate-400 mb-4">No slots yet. Add one below.</p>
//                           )}

//                           {/* Add new slot row */}
//                           <div className="flex flex-wrap gap-3 items-end pt-4 border-t border-[#E8EEF4]">
//                             <div>
//                               <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5" htmlFor='startTime'>Start Time</label>
//                               <input
//                                 type="time"
//                                 id='startTime'
//                                 value={ns.start}
//                                 onChange={e => setNewSlots(p => ({ ...p, [dateObj.id]: { ...ns, start: e.target.value } }))}
//                                 className="bg-white border border-[#E5E7EB] rounded-xl px-3 py-2 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6] transition"
//                               />
//                             </div>
//                             <div>
//                               <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5" htmlFor='endTime'>End Time</label>
//                               <input
//                                 type="time"
//                                 id='endTime'
//                                 value={ns.end}
//                                 onChange={e => setNewSlots(p => ({ ...p, [dateObj.id]: { ...ns, end: e.target.value } }))}
//                                 className="bg-white border border-[#E5E7EB] rounded-xl px-3 py-2 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6] transition"
//                               />
//                             </div>
//                             <button
//                               onClick={() => addSlot(dateObj.id)}
//                               disabled={!ns.start || !ns.end}
//                               className="flex items-center gap-2 px-4 py-2 bg-[#14B8A6] hover:bg-[#0f9a8e] disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-bold rounded-xl transition-all"
//                             >
//                               <Plus className="w-3.5 h-3.5" /> Add Slot
//                             </button>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   )
//                 })}
//               </div>
//             )}
//           </div>

//           {/* ── Highlights / Credentials ──────────────────────────────── */}
//           <div className="bg-white border border-[#E8EEF4] rounded-3xl p-7 shadow-sm fade-up">
//             <SectionHeader icon={Award} title="Credentials & Highlights" subtitle="Auto-generated from profile data" />
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//               {[
//                 { icon: BadgeCheck,  text: 'IMA Certified Specialist' },
//                 { icon: Star,        text: `${doc.success} success rate` },
//                 { icon: Users,       text: `${doc.patients} patients treated` },
//                 { icon: CheckCircle2, text: 'Digital prescriptions' },
//               ].map(({ icon: Icon, text }) => (
//                 <div key={text} className="flex items-center gap-2.5 bg-[#F8FAFC] border border-[#E8EEF4] rounded-xl px-3 py-3">
//                   <Icon className="w-4 h-4 text-[#14B8A6] flex-shrink-0" />
//                   <span className="text-xs font-medium text-slate-600 leading-tight">{text}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* ── Danger Zone ───────────────────────────────────────────── */}
//           <div className="bg-white border border-rose-100 rounded-3xl p-7 shadow-sm fade-up">
//             <SectionHeader icon={AlertCircle} title="Danger Zone" subtitle="Irreversible actions — proceed with caution" />
//             <div className="flex flex-wrap gap-3">
//               <button className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-xl hover:bg-rose-100 transition">
//                 <Trash2 className="w-3.5 h-3.5" /> Delete All Dates & Slots
//               </button>
//               <button className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-xl hover:bg-rose-100 transition">
//                 <AlertCircle className="w-3.5 h-3.5" /> Deactivate Doctor Account
//               </button>
//             </div>
//           </div>

//         </div>
//       </div>
//     </>
//   )
// }


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

interface Appointment {
  id: string
  createdAt: string
  status: AppointmentStatus
  patientDetail: PatientDetail
  payment: Payment
  timeSlot: {
    startTime: string
    endTime: string
    period: "AM" | "PM"
    availabilityDate: { date: string }
  }
}

// ─── Dummy data ───────────────────────────────────────────────────────────────

const DUMMY: Appointment[] = [
  {
    id: "a1", createdAt: "2025-07-10T08:30:00Z", status: "COMPLETED",
    patientDetail: { fullName: "Ravi Kumar",   age: 34, phoneNumber: "9876543210", gender: "MALE",   email: "ravi.kumar@gmail.com"  },
    payment: { amount: 800, status: "COMPLETED",  method: "ONLINE" },
    timeSlot: { startTime: "09:00", endTime: "09:30", period: "AM", availabilityDate: { date: "2025-07-14" } },
  },
  {
    id: "a2", createdAt: "2025-07-11T10:15:00Z", status: "PENDING",
    patientDetail: { fullName: "Sneha Sharma", age: 28, phoneNumber: "9123456789", gender: "FEMALE", email: "sneha.sharma@gmail.com" },
    payment: { amount: 800, status: "PENDING",    method: "CASH"   },
    timeSlot: { startTime: "09:30", endTime: "10:00", period: "AM", availabilityDate: { date: "2025-07-14" } },
  },
  {
    id: "a3", createdAt: "2025-07-11T14:00:00Z", status: "CONFIRMED",
    patientDetail: { fullName: "Amit Patel",   age: 45, phoneNumber: "9988776655", gender: "MALE",   email: "amit.patel@gmail.com"  },
    payment: { amount: 800, status: "PROCESSING", method: "ONLINE" },
    timeSlot: { startTime: "10:00", endTime: "10:30", period: "AM", availabilityDate: { date: "2025-07-14" } },
  },
  {
    id: "a4", createdAt: "2025-07-12T09:00:00Z", status: "COMPLETED",
    patientDetail: { fullName: "Divya Nair",   age: 31, phoneNumber: "9871234560", gender: "FEMALE", email: "divya.nair@gmail.com"  },
    payment: { amount: 800, status: "COMPLETED",  method: "ONLINE" },
    timeSlot: { startTime: "02:00", endTime: "02:30", period: "PM", availabilityDate: { date: "2025-07-16" } },
  },
  {
    id: "a5", createdAt: "2025-07-12T11:30:00Z", status: "CANCELLED",
    patientDetail: { fullName: "Karan Singh",  age: 52, phoneNumber: "9765432100", gender: "MALE",   email: "karan.singh@gmail.com" },
    payment: { amount: 800, status: "FAILED",     method: "ONLINE" },
    timeSlot: { startTime: "03:00", endTime: "03:30", period: "PM", availabilityDate: { date: "2025-07-16" } },
  },
  {
    id: "a6", createdAt: "2025-07-13T07:45:00Z", status: "PENDING",
    patientDetail: { fullName: "Priya Mehta",  age: 38, phoneNumber: "9654321098", gender: "FEMALE", email: "priya.mehta@gmail.com" },
    payment: { amount: 800, status: "PENDING",    method: "CASH"   },
    timeSlot: { startTime: "10:00", endTime: "10:30", period: "AM", availabilityDate: { date: "2025-07-18" } },
  },
  {
    id: "a7", createdAt: "2025-07-13T09:20:00Z", status: "CONFIRMED",
    patientDetail: { fullName: "Suresh Iyer",  age: 60, phoneNumber: "9543210987", gender: "MALE",   email: "suresh.iyer@gmail.com" },
    payment: { amount: 800, status: "COMPLETED",  method: "ONLINE" },
    timeSlot: { startTime: "10:30", endTime: "11:00", period: "AM", availabilityDate: { date: "2025-07-18" } },
  },
]

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
const fmtCreated = (iso: string) => new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })

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
  appt: Appointment
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
            {p.fullName.split(" ").map(n => n[0]).join("").slice(0, 2)}
          </span>
        </div>

        {/* Patient + slot */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-bold text-[#0F172A] text-sm">{p.fullName}</p>
            <span className="text-[10px] text-slate-400 bg-[#F8FAFC] border border-[#E8EEF4] px-2 py-0.5 rounded-full">
              Age {p.age} · {p.gender}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-1">
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <CalendarDays className="w-3 h-3 text-[#14B8A6]" />
              {fmtDate(slot.availabilityDate.date)}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Clock className="w-3 h-3 text-[#14B8A6]" />
              {slot.startTime} – {slot.endTime} {slot.period}
            </span>
          </div>
        </div>

        {/* Fee */}
        <div className="flex items-center gap-1 text-sm font-bold text-[#0F172A] flex-shrink-0">
          <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
          {pay.amount}
          <span className="text-[10px] font-medium text-slate-400 ml-0.5">{pay.method}</span>
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
                  { icon: User,        label: "Name",        val: p.fullName },
                  { icon: Stethoscope, label: "Age / Gender",val: `${p.age} / ${p.gender}` },
                  { icon: Phone,       label: "Phone",       val: p.phoneNumber },
                  { icon: Mail,        label: "Email",       val: p.email },
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
                  { icon: CalendarDays,  label: "Date",      val: fmtDate(slot.availabilityDate.date) },
                  { icon: Clock,         label: "Time",      val: `${slot.startTime} – ${slot.endTime} ${slot.period}` },
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
                  <span className="font-bold text-[#0F172A]">₹{pay.amount}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Loader2 className="w-3.5 h-3.5 text-[#14B8A6] flex-shrink-0" />
                  <span className="text-slate-400 w-24 flex-shrink-0">Method</span>
                  <span className="font-semibold text-[#0F172A]">{pay.method}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <BadgeCheck className="w-3.5 h-3.5 text-[#14B8A6] flex-shrink-0" />
                  <span className="text-slate-400 w-24 flex-shrink-0">Pay status</span>
                  <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg border ${PAY_CFG[pay.status].cls}`}>
                    {PAY_CFG[pay.status].label}
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

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(DUMMY)
  const [search, setSearch]             = useState("")
  const [filter, setFilter]             = useState<AppointmentStatus | "ALL">("ALL")
  const [toast, setToast]               = useState<{ msg: string; type: "success" | "error" } | null>(null)

  const fire = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleStatusChange = (id: string, status: AppointmentStatus) => {
    setAppointments(prev => prev.map(a => {
      if (a.id !== id) return a

      // If doctor marks COMPLETED and payment method is CASH → also complete the payment
      const shouldCompleteCashPayment =
        status === "COMPLETED" &&
        a.payment.method === "CASH" &&
        a.payment.status !== "COMPLETED"

      return {
        ...a,
        status,
        payment: shouldCompleteCashPayment
          ? { ...a.payment, status: "COMPLETED" as PaymentStatus }
          : a.payment,
      }
    }))

    // Toast — extra note if cash payment was auto-completed
    const appt = appointments.find(a => a.id === id)
    const cashAutoCompleted =
      status === "COMPLETED" &&
      appt?.payment.method === "CASH" &&
      appt?.payment.status !== "COMPLETED"

    fire(cashAutoCompleted
      ? "Appointment completed — cash payment marked as collected"
      : `Marked as ${APPT_CFG[status].label}`
    )

    // TODO: await updateAppointmentStatus(id, status)
    // Backend handles: if CASH + COMPLETED → transaction to set both statuses
  }

  const filtered = appointments.filter(a => {
    const q = search.toLowerCase()
    const p = a.patientDetail
    const matchSearch = p.fullName.toLowerCase().includes(q) || p.email.toLowerCase().includes(q) || p.phoneNumber.includes(q)
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