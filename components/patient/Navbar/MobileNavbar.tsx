"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"
import Link from "next/link"
import { Menu, X } from "lucide-react"

const MobileNavbar = () => {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden">

      {/* Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </Button>

      {/* Mobile Menu */}
      {open && (
        <div className="absolute left-0 top-16 w-full border-t backdrop-blur-md bg-white/95 border-b border-[#E5E7EB]">
          <div className="flex flex-col gap-6 p-6 text-sm font-medium">

            <Link href="/" onClick={() => setOpen(false)}>
              Home
            </Link>

            <Link href="/doctors" onClick={() => setOpen(false)}>
              Our Doctors
            </Link>

            <Link href="/services" onClick={() => setOpen(false)}>
              Services
            </Link>

            <Link href="/contact" onClick={() => setOpen(false)}>
              Contact
            </Link>

            <div className="pt-4 border-t flex flex-col gap-3">
              <SignedOut>
                <SignInButton mode="modal">
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </SignInButton>

                <Link href="/appointment">
                  <Button className="w-full">
                    Book Appointment
                  </Button>
                </Link>
              </SignedOut>

              <SignedIn>
                <div className="flex justify-center">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </SignedIn>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

export default MobileNavbar