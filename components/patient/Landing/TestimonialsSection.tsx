'use client'

import React from 'react'
import { Star } from 'lucide-react'

const testimonials = [
    {
        name: 'Alice Johnson',
        role: 'Patient',
        feedback:
            'Veracare made booking my doctor so easy! The platform is intuitive and the doctors are amazing.',
        imageUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
        rating: 5,
    },
    {
        name: 'Michael Smith',
        role: 'Patient',
        feedback:
            'I love how seamless the appointments and payments are. Highly recommended!',
        imageUrl: 'https://randomuser.me/api/portraits/men/36.jpg',
        rating: 5,
    },
    {
        name: 'Emily Davis',
        role: 'Patient',
        feedback:
            'The best healthcare platform I have ever used. Professional doctors and great service.',
        imageUrl: 'https://randomuser.me/api/portraits/women/68.jpg',
        rating: 5,
    },
]

const TestimonialsSection = () => {
    return (
        <section className="py-20 bg-[#F8FAFC]">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-4xl font-bold text-[#0F172A] mb-4">What Our Patients Say</h2>
                <p className="text-[#64748B] mb-12 max-w-xl mx-auto">
                    Real feedback from people who trusted Veracare for their healthcare needs.
                </p>

                <div className="grid md:grid-cols-3 gap-10">
                    {testimonials.map((testimonial, idx) => (
                        <div
                            key={idx}
                            className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition duration-300"
                        >
                            <div className="flex items-center justify-center mb-4">
                                <img
                                    src={testimonial.imageUrl}
                                    alt={testimonial.name}
                                    className="w-16 h-16 rounded-full object-cover"
                                />
                            </div>
                            <div className="flex justify-center mb-2">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className="w-4 h-4 text-[#14B8A6] fill-current"
                                    />
                                ))}
                            </div>
                            <p className="text-[#0F172A] font-semibold">{testimonial.name}</p>
                            <p className="text-[#64748B] text-sm mb-4">{testimonial.role}</p>
                            <p className="text-[#0F172A] text-sm">{testimonial.feedback}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default TestimonialsSection