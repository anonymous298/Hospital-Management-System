"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"
import Link from "next/link"
import { Menu, X, Home, Stethoscope, CalendarDays, Phone, ChevronRight, Sparkles } from "lucide-react"
import { usePathname } from "next/navigation"

// ─── Nav links config ─────────────────────────────────────────────────────────

const NAV_LINKS = [
  { href: "/",            label: "Home",            icon: Home,          public: true  },
  { href: "/doctors",     label: "Our Doctors",     icon: Stethoscope,   public: true  },
  { href: "/appointments",label: "My Appointments", icon: CalendarDays,  public: false }, // signed-in only
  { href: "/contact",     label: "Contact",         icon: Phone,         public: true  },
]

// ─── Component ────────────────────────────────────────────────────────────────

const MobileNavbar = () => {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  // Close on route change
  useEffect(() => { setOpen(false) }, [pathname])

  const close = () => setOpen(false)

  return (
    <>
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeItem {
          from { opacity: 0; transform: translateX(-10px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .menu-enter    { animation: slideDown 0.22s ease both; }
        .nav-item      { animation: fadeItem 0.25s ease both; }
        .nav-item-1    { animation-delay: 0.04s; }
        .nav-item-2    { animation-delay: 0.08s; }
        .nav-item-3    { animation-delay: 0.12s; }
        .nav-item-4    { animation-delay: 0.16s; }
        .nav-item-5    { animation-delay: 0.20s; }
      `}</style>

      <div className="lg:hidden">

        {/* ── Hamburger Button ── */}
        <button
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
          className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
            open
              ? "bg-[#14B8A6] text-white shadow-md shadow-teal-200"
              : "bg-[#F8FAFC] border border-[#E5E7EB] text-slate-600 hover:border-[#14B8A6]/40 hover:text-[#14B8A6]"
          }`}
        >
          <span className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${open ? "opacity-100 rotate-0" : "opacity-0 rotate-90"}`}>
            <X size={18} />
          </span>
          <span className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${open ? "opacity-0 -rotate-90" : "opacity-100 rotate-0"}`}>
            <Menu size={18} />
          </span>
        </button>

        {/* ── Backdrop ── */}
        {open && (
          <div
            className="fixed inset-0 top-16 bg-black/20 backdrop-blur-[2px] z-40"
            onClick={close}
          />
        )}

        {/* ── Drawer ── */}
        {open && (
          <div className="menu-enter fixed left-0 right-0 top-16 z-50 mx-3 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xl shadow-black/10 overflow-hidden">

            {/* Top teal accent strip */}
            <div className="h-1 w-full bg-gradient-to-r from-[#14B8A6] via-[#0ea5e9] to-[#14B8A6]" />

            <div className="p-4">

              {/* ── Nav Links ── */}
              <nav className="flex flex-col gap-1 mb-4">
                {NAV_LINKS.map((link, idx) => {
                  const Icon = link.icon
                  const isActive = pathname === link.href
                  const linkEl = (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={close}
                      className={`nav-item nav-item-${idx + 1} group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                        isActive
                          ? "bg-[#14B8A6] text-white shadow-sm shadow-teal-200"
                          : "text-slate-600 hover:bg-teal-50 hover:text-[#14B8A6]"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                        isActive
                          ? "bg-white/20"
                          : "bg-[#F8FAFC] border border-[#E5E7EB] group-hover:border-teal-200 group-hover:bg-teal-50"
                      }`}>
                        <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-[#14B8A6]"}`} />
                      </div>
                      <span className="flex-1">{link.label}</span>
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 ${isActive ? "text-white/60" : "text-slate-300"}`} />
                    </Link>
                  )

                  // Wrap signed-in only links
                  if (!link.public) {
                    return (
                      <SignedIn key={link.href}>
                        {linkEl}
                      </SignedIn>
                    )
                  }

                  return linkEl
                })}
              </nav>

              {/* ── Divider ── */}
              <div className="h-px bg-gradient-to-r from-transparent via-[#E5E7EB] to-transparent mb-4" />

              {/* ── Auth Section ── */}
              <div className="nav-item nav-item-5 flex flex-col gap-2.5">

                <SignedOut>
                  {/* Sign in */}
                  <SignInButton mode="modal">
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-sm font-semibold text-slate-700 hover:border-[#14B8A6]/40 hover:text-[#14B8A6] hover:bg-teal-50 transition-all">
                      Sign In
                    </button>
                  </SignInButton>

                  {/* Book appointment CTA */}
                  <Link href="/doctors" onClick={close}>
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#14B8A6] hover:bg-[#0f9a8e] text-white text-sm font-bold transition-all shadow-md shadow-teal-100">
                      <Sparkles className="w-4 h-4" />
                      Book Appointment
                    </button>
                  </Link>
                </SignedOut>

                <SignedIn>
                  {/* User profile row */}
                  <div className="flex items-center gap-3 px-4 py-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl">
                    <UserButton afterSignOutUrl="/" />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-[#0F172A]">My Account</p>
                      <p className="text-[11px] text-slate-400">Manage your profile</p>
                    </div>
                  </div>

                  {/* Quick book CTA */}
                  <Link href="/doctors" onClick={close}>
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#14B8A6] hover:bg-[#0f9a8e] text-white text-sm font-bold transition-all shadow-md shadow-teal-100">
                      <Sparkles className="w-4 h-4" />
                      Book Appointment
                    </button>
                  </Link>
                </SignedIn>
              </div>

            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default MobileNavbar