import React from 'react'
import { Calendar, UserCheck, CreditCard, FileText } from 'lucide-react'

const features = [
  {
    title: 'Easy Appointment Booking',
    description: 'Book appointments with your preferred doctor in just a few clicks.',
    icon: Calendar,
  },
  {
    title: 'Trusted Doctors',
    description: 'Highly qualified doctors with verified credentials for every specialty.',
    icon: UserCheck,
  },
  {
    title: 'Secure Payments',
    description: 'Pay online securely with multiple payment options.',
    icon: CreditCard,
  },
  {
    title: 'Patient Management',
    description: 'Access your health records and appointment history anytime.',
    icon: FileText,
  },
]

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-[#0F172A] mb-4">Why Choose Veracare?</h2>
        <p className="text-[#64748B] mb-12 max-w-xl mx-auto">
          Our platform makes healthcare easier, faster, and more reliable for patients and doctors alike.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <div
                key={idx}
                className="p-6 border border-[#E5E7EB] rounded-xl shadow-sm hover:shadow-md transition duration-300 bg-[#F8FAFC]"
              >
                <div className="w-16 h-16 mx-auto mb-4 text-[#14B8A6] flex justify-center items-center">
                  <Icon size={48} />
                </div>
                <h3 className="text-xl font-semibold text-[#0F172A] mb-2">{feature.title}</h3>
                <p className="text-[#64748B]">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection