'use client'

import React from 'react'
import { CalendarCheck, UserCheck, CreditCard } from 'lucide-react'

const steps = [
  {
    icon: CalendarCheck,
    title: 'Book Appointment',
    description: 'Select your preferred doctor and choose a time slot that works for you.',
  },
  {
    icon: UserCheck,
    title: 'Consult with Doctor',
    description: 'Meet your doctor online or in-person and get expert medical advice.',
  },
  {
    icon: CreditCard,
    title: 'Secure Payment',
    description: 'Pay securely through our platform with multiple payment options.',
  },
]

const HowItWorksSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-[#0F172A] mb-4">How It Works</h2>
        <p className="text-[#64748B] mb-12 max-w-xl mx-auto">
          Booking a doctor and managing your appointments has never been easier.
        </p>

        <div className="grid md:grid-cols-3 gap-10">
          {steps.map((step, idx) => {
            const Icon = step.icon
            return (
              <div key={idx} className="p-6 border border-[#E5E7EB] rounded-xl shadow-sm hover:shadow-md transition duration-300 bg-[#F8FAFC]">
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-[#14B8A6]/20 rounded-full">
                  <Icon className="text-[#14B8A6] w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-[#0F172A] mb-2">{step.title}</h3>
                <p className="text-[#64748B]">{step.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default HowItWorksSection