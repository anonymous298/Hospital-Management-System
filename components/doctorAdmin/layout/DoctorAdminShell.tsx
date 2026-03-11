"use client"

// app/(doctorAdmin)/doctorAdmin/_components/DoctorAdminShell.tsx
// Client shell — handles mobile sidebar open/close state
// layout.tsx is server (for currentUser), this handles all interactivity

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserButton } from "@clerk/nextjs"
import {
  Stethoscope, LayoutDashboard, CalendarDays,
  Clock, Users, Settings, BadgeCheck,
  Menu, X, ChevronRight,
} from "lucide-react"

// ─── Nav config ───────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { href: "/doctorAdmin",              label: "Overview",     icon: LayoutDashboard },
  { href: "/doctorAdmin/schedule",     label: "My Schedule",  icon: CalendarDays    },
  { href: "/doctorAdmin/appointments", label: "Appointments", icon: Clock           },
  { href: "/doctorAdmin/patients",     label: "Patients",     icon: Users           },
  { href: "/doctorAdmin/profile",     label: "Manage Profile",     icon: Settings        },
]

// ─── Props ────────────────────────────────────────────────────────────────────

interface DoctorAdminShellProps {
  children: React.ReactNode
  userName: string
  userEmail: string
  userImage: string
}

// ─── Sidebar content (shared between desktop + mobile) ────────────────────────

const SidebarContent = ({
  userName, userEmail, userImage, pathname, onNavClick,
}: {
  userName: string
  userEmail: string
  userImage: string
  pathname: string
  onNavClick?: () => void
}) => (
  <div className="flex flex-col h-full">

    {/* Brand */}
    <div className="px-5 py-5 border-b border-white/10 flex-shrink-0">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 bg-[#14B8A6] rounded-xl flex items-center justify-center flex-shrink-0">
          <Stethoscope className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-none">Doctor Portal</p>
          <p className="text-white/30 text-[10px] mt-0.5 leading-none">Admin Dashboard</p>
        </div>
      </div>
    </div>

    {/* Doctor info card */}
    <div className="px-4 py-4 border-b border-white/10 flex-shrink-0">
      <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5">
        {userImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={userImage}
            alt={userName}
            className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-white text-xs font-semibold truncate leading-none">{userName}</p>
          <div className="flex items-center gap-1 mt-1">
            <BadgeCheck className="w-3 h-3 text-[#14B8A6]" />
            <span className="text-[10px] text-[#14B8A6] font-medium">Verified Doctor</span>
          </div>
        </div>
      </div>
    </div>

    {/* Nav links */}
    <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
      <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest px-3 mb-3">
        Navigation
      </p>
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavClick}
            className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
              isActive
                ? "bg-[#14B8A6] text-white"
                : "text-white/50 hover:text-white hover:bg-white/8"
            }`}
          >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
              isActive
                ? "bg-white/20"
                : "bg-white/5 group-hover:bg-[#14B8A6]/20"
            }`}>
              <Icon className={`w-3.5 h-3.5 transition-colors ${
                isActive ? "text-white" : "text-white/40 group-hover:text-[#14B8A6]"
              }`} />
            </div>
            <span className="flex-1">{label}</span>
            {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/50" />}
          </Link>
        )
      })}
    </nav>

    {/* Footer */}
    <div className="px-4 py-4 border-t border-white/10 flex-shrink-0">
      <div className="flex items-center gap-3">
        <UserButton afterSignOutUrl="/" />
        <div className="flex-1 min-w-0">
          <p className="text-white/60 text-xs font-medium leading-none truncate">{userEmail}</p>
          <p className="text-white/30 text-[10px] mt-0.5">Sign out via avatar</p>
        </div>
      </div>
    </div>
  </div>
)

// ─── Shell ────────────────────────────────────────────────────────────────────

export default function DoctorAdminShell({
  children, userName, userEmail, userImage,
}: DoctorAdminShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  // Close sidebar on route change
  useEffect(() => { setMobileOpen(false) }, [pathname])

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [mobileOpen])

  // Current page label for breadcrumb
  const currentNav = NAV_ITEMS.slice().reverse().find(n => pathname.startsWith(n.href))
  ?? NAV_ITEMS[0]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Outfit:wght@300;400;500;600;700&display=swap');
        .da-shell { font-family: 'Outfit', sans-serif; }
        @keyframes slideIn {
          from { transform: translateX(-100%); opacity: 0; }
          to   { transform: translateX(0);     opacity: 1; }
        }
        .sidebar-slide { animation: slideIn 0.22s ease both; }
      `}</style>

      <div className="da-shell flex h-screen bg-[#F8FAFC] overflow-hidden">

        {/* ══════════════════════════════════════════
            DESKTOP SIDEBAR (hidden on mobile)
        ══════════════════════════════════════════ */}
        <aside className="hidden md:flex w-60 flex-shrink-0 bg-[#0F172A] flex-col h-full">
          <SidebarContent
            userName={userName}
            userEmail={userEmail}
            userImage={userImage}
            pathname={pathname}
          />
        </aside>

        {/* ══════════════════════════════════════════
            MOBILE SIDEBAR — backdrop + drawer
        ══════════════════════════════════════════ */}

        {/* Backdrop */}
        {mobileOpen && (
          <div
            className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Drawer */}
        {mobileOpen && (
          <aside className="md:hidden sidebar-slide fixed inset-y-0 left-0 z-50 w-72 bg-[#0F172A] flex flex-col shadow-2xl">
            {/* Close button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition z-10"
            >
              <X className="w-4 h-4" />
            </button>

            <SidebarContent
              userName={userName}
              userEmail={userEmail}
              userImage={userImage}
              pathname={pathname}
              onNavClick={() => setMobileOpen(false)}
            />
          </aside>
        )}

        {/* ══════════════════════════════════════════
            MAIN CONTENT
        ══════════════════════════════════════════ */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">

          {/* Top bar */}
          <header className="h-14 bg-white border-b border-[#E8EEF4] flex items-center justify-between px-4 md:px-6 flex-shrink-0">

            <div className="flex items-center gap-3">
              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden w-9 h-9 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] flex items-center justify-center text-slate-600 hover:border-[#14B8A6]/40 hover:text-[#14B8A6] transition"
              >
                <Menu className="w-4 h-4" />
              </button>

              {/* Breadcrumb */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 hidden sm:block">Doctor Admin</span>
                <span className="text-slate-300 text-xs hidden sm:block">/</span>
                <span className="text-xs font-semibold text-[#0F172A]">
                  {currentNav?.label ?? "Dashboard"}
                </span>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="hidden sm:block">Online</span>
              </div>
              {/* Show UserButton in topbar on mobile too */}
              <div className="md:hidden">
                <UserButton afterSignOutUrl="/" />
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto bg-[#F8FAFC]">
            {children}
          </main>
        </div>
      </div>
    </>
  )
}