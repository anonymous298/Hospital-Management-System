import { Button } from "@/components/ui/button"
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"
import { Sparkles } from "lucide-react"
import Link from "next/link"

const DesktopNavbar = () => {
    return (
        <div className="hidden lg:flex items-center gap-10">

            {/* Navigation */}
            <nav className="flex items-center gap-8 text-sm font-medium">
                <Link
                    href="/"
                    className="text-muted-foreground hover:text-[#14B8A6] transition-colors"
                >
                    Home
                </Link>

                <Link
                    href="/doctors"
                    className="text-muted-foreground hover:text-[#14B8A6] transition-colors"
                >
                    Our Doctors
                </Link>

                <Link
                    href="/services"
                    className="text-muted-foreground hover:text-[#14B8A6] transition-colors"
                >
                    Services
                </Link>

                <SignedIn>
                    <Link
                        href="/appointments"
                        className="text-muted-foreground hover:text-[#14B8A6] transition-colors"
                    >
                        My Appointments
                    </Link>
                </SignedIn>

                <Link
                    href="/contact"
                    className="text-muted-foreground hover:text-[#14B8A6] transition-colors"
                >
                    Contact
                </Link>
            </nav>

            <div className="h-5 w-px bg-[#E5E7EB]" />

            {/* Auth */}
            <div className="flex items-center gap-3">
                {/* Book appointment CTA */}
                <Link href="/doctors">
                    <button className="flex items-center gap-1.5 px-4 py-2 bg-[#14B8A6] hover:bg-[#0f9a8e] text-white text-sm font-bold rounded-xl transition-all duration-200 shadow-sm shadow-teal-100 hover:shadow-md hover:shadow-teal-200 hover:-translate-y-0.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        Book Appointment
                    </button>
                </Link>
                
                <SignedOut>

                    <SignInButton mode="modal">
                        <Button variant="outline" size="sm">
                            Sign In
                        </Button>
                    </SignInButton>

                </SignedOut>

                <SignedIn>
                    <UserButton afterSignOutUrl="/" />
                </SignedIn>
            </div>
        </div>
    )
}

export default DesktopNavbar