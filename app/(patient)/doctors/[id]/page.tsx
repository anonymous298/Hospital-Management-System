import DynamicDoctor from '@/components/patient/DynamicDoctor/DynamicDoctor';
import React from 'react'

export interface PageProps {
    params: Promise<{ id: string }>; // YES, a Promise
    searchParams?: Promise<{ id: string }>;
}

const Page = async ({ params }: PageProps) => {

    const { id } = await params;
    
    // In production, fetch doctor details from your Prisma client using the id
    const doctor = {
        id: '1',
        name: 'Dr. Sarah Johnson',
        specialization: 'Dentist',
        experience: '6 Years',
        consultationFee: 3000,
        imageUrl: 'https://res.cloudinary.com/.../doctor1.jpg',
        about: 'Expert in braces, root canal, and teeth whitening.',
        timeSlots: [
            { startTime: '10:00', endTime: '10:30', available: true },
            { startTime: '10:30', endTime: '11:00', available: false },
            { startTime: '11:00', endTime: '11:30', available: true },
        ],
    }

    return (
        <div>
            <DynamicDoctor doctor={doctor}/>
        </div>
    )
}

export default Page
