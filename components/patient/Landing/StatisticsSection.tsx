'use client'

import React from 'react'
import { Users, Stethoscope, CalendarCheck, DollarSign } from 'lucide-react'

const stats = [
  {
    title: 'Doctors',
    value: '120+',
    icon: <Stethoscope className="w-8 h-8 text-[#14B8A6]" />,
  },
  {
    title: 'Patients Served',
    value: '15k+',
    icon: <Users className="w-8 h-8 text-[#14B8A6]" />,
  },
  {
    title: 'Appointments Completed',
    value: '30k+',
    icon: <CalendarCheck className="w-8 h-8 text-[#14B8A6]" />,
  },
  {
    title: 'Revenue',
    value: '$500k+',
    icon: <DollarSign className="w-8 h-8 text-[#14B8A6]" />,
  },
]

const StatisticsSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-[#0F172A] mb-4">Our Impact</h2>
        <p className="text-[#64748B] mb-12 max-w-xl mx-auto">
          Veracare has been trusted by thousands of patients and doctors to manage healthcare efficiently.
        </p>

        <div className="grid md:grid-cols-4 gap-10">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl border border-[#E5E7EB] shadow-sm hover:shadow-md transition duration-300 flex flex-col items-center"
            >
              <div className="mb-4">{stat.icon}</div>
              <h3 className="text-2xl font-bold text-[#0F172A]">{stat.value}</h3>
              <p className="text-[#64748B]">{stat.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StatisticsSection