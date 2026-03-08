import { Button } from "@/components/ui/button"
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"
import Link from "next/link"

const DesktopNavbar = () => {
    return (
        <div className="hidden md:flex items-center gap-10">

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

            {/* Auth */}
            <div className="flex items-center gap-3">
                <Link href="/appointment">
                    <Button size="sm">
                        Book Appointment
                    </Button>
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