'use client'

import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

const CallToActionSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-10">
        
        {/* Text Content */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-4xl font-bold text-[#0F172A] mb-4">
            Get Started With Veracare Today
          </h2>
          <p className="text-[#64748B] mb-6 max-w-lg">
            Book your doctor appointments in seconds and enjoy a seamless healthcare experience. Trusted, fast, and secure platform for all your healthcare needs.
          </p>
          <Button className="bg-[#14B8A6] hover:bg-[#0f9d8c] text-white px-6 py-3 rounded-lg shadow-md transition">
            Book an Appointment
          </Button>
        </div>

        {/* Illustration */}
        <div className="flex-1">
          <Image 
            src="/CallToActionSection.svg" // new dummy online illustration
            alt="Healthcare Illustration"
            width={500}
            height={400}
            className="mx-auto"
          />
        </div>
      </div>
    </section>
  )
}

export default CallToActionSection