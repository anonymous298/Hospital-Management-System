import { SignInButton } from "@clerk/nextjs"
import { LockKeyhole, Sparkles } from "lucide-react"

const NotLoggedIn = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="flex flex-col items-center text-center max-w-sm">

        {/* Icon */}
        <div className="relative mb-6">
          <div className="w-20 h-20 bg-teal-50 border-2 border-dashed border-teal-200 rounded-3xl flex items-center justify-center">
            <LockKeyhole className="w-9 h-9 text-[#14B8A6]" />
          </div>
          {/* Ping dot */}
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#14B8A6] rounded-full border-2 border-white animate-pulse" />
        </div>

        {/* Text */}
        <h2 className="text-xl font-bold text-[#0F172A] mb-2">
          Sign in to continue
        </h2>
        <p className="text-sm text-slate-400 leading-relaxed mb-7">
          Please sign in to view and manage your appointments with our doctors.
        </p>

        {/* CTA */}
        <SignInButton mode="modal">
          <button className="flex items-center gap-2 px-6 py-3 bg-[#14B8A6] hover:bg-[#0f9a8e] text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-teal-100 hover:shadow-lg hover:shadow-teal-200 hover:-translate-y-0.5">
            <Sparkles className="w-4 h-4" />
            Sign In to View Appointments
          </button>
        </SignInButton>

      </div>
    </div>
  )
}

export default NotLoggedIn