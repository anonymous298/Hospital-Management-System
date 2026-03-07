import DynamicDoctor from '@/components/patient/DynamicDoctor/DynamicDoctor';
import prisma from '@/lib/prisma';
import React from 'react'

export interface PageProps {
    params: Promise<{ id: string }>; // YES, a Promise
    searchParams?: Promise<{ id: string }>;
}

const Page = async ({ params }: PageProps) => {

    const { id } = await params;

    // In production, fetch doctor details from your Prisma client using the id
    // const doctor = await prisma.doctor.findMany({})

    // const doctor = {
    //     id: 'clx1a2b3c4d5e6f7g8h9i0j',
    //     name: 'Dr. Arjun Mehta',
    //     imageUrl: 'https://randomuser.me/api/portraits/men/75.jpg',
    //     specialization: 'Cardiologist',
    //     qualification: 'MBBS, MD (Cardiology), DM — AIIMS New Delhi',
    //     location: 'Apollo Hospital, Jubilee Hills, Hyderabad',
    //     success: '97%',
    //     experience: '14 years',
    //     patients: '8,200+',
    //     about:
    //         'Dr. Arjun Mehta is a senior interventional cardiologist with over 14 years of experience treating complex cardiovascular conditions. He specializes in coronary angioplasty, heart failure management, and preventive cardiology. Dr. Mehta completed his DM in Cardiology from AIIMS New Delhi and has been recognised among the top 50 cardiologists in India by the Indian Medical Association. He believes in a patient-first approach, combining cutting-edge technology with compassionate care to deliver the best outcomes.',
    //     consultationFee: 800,
    //     availability: 'AVAILABLE' as const,  // DoctorAvailabilityStatus enum
    //     rating: 4.9,
    //     createdAt: new Date('2024-01-10T08:00:00.000Z'),
    //     updatedAt: new Date('2025-06-01T10:30:00.000Z'),

    //     // DoctorAvailabilityDate[] — each with nested DoctorTimeSlot[]
    //     doctorAvailabilityDates: [
    //         {
    //             id: 'avail_date_001',
    //             doctorId: 'clx1a2b3c4d5e6f7g8h9i0j',
    //             date: new Date('2025-07-14T00:00:00.000Z'), // Monday
    //             createdAt: new Date('2025-06-01T08:00:00.000Z'),
    //             updatedAt: new Date('2025-06-01T08:00:00.000Z'),
    //             doctorTimeSlots: [
    //                 {
    //                     id: 'slot_001',
    //                     availabilityDateId: 'avail_date_001',
    //                     startTime: '09:00',
    //                     endTime: '09:30',
    //                     createdAt: new Date('2025-06-01T08:00:00.000Z'),
    //                     updatedAt: new Date('2025-06-01T08:00:00.000Z'),
    //                     doctorAppointment: { id: 'appt_booked_001' }, // ← BOOKED
    //                 },
    //                 {
    //                     id: 'slot_002',
    //                     availabilityDateId: 'avail_date_001',
    //                     startTime: '09:30',
    //                     endTime: '10:00',
    //                     createdAt: new Date('2025-06-01T08:00:00.000Z'),
    //                     updatedAt: new Date('2025-06-01T08:00:00.000Z'),
    //                     doctorAppointment: null, // ← FREE
    //                 },
    //                 {
    //                     id: 'slot_003',
    //                     availabilityDateId: 'avail_date_001',
    //                     startTime: '10:00',
    //                     endTime: '10:30',
    //                     createdAt: new Date('2025-06-01T08:00:00.000Z'),
    //                     updatedAt: new Date('2025-06-01T08:00:00.000Z'),
    //                     doctorAppointment: null, // ← FREE
    //                 },
    //                 {
    //                     id: 'slot_004',
    //                     availabilityDateId: 'avail_date_001',
    //                     startTime: '10:30',
    //                     endTime: '11:00',
    //                     createdAt: new Date('2025-06-01T08:00:00.000Z'),
    //                     updatedAt: new Date('2025-06-01T08:00:00.000Z'),
    //                     doctorAppointment: { id: 'appt_booked_002' }, // ← BOOKED
    //                 },
    //                 {
    //                     id: 'slot_005',
    //                     availabilityDateId: 'avail_date_001',
    //                     startTime: '11:00',
    //                     endTime: '11:30',
    //                     createdAt: new Date('2025-06-01T08:00:00.000Z'),
    //                     updatedAt: new Date('2025-06-01T08:00:00.000Z'),
    //                     doctorAppointment: null, // ← FREE
    //                 },
    //                 {
    //                     id: 'slot_006',
    //                     availabilityDateId: 'avail_date_001',
    //                     startTime: '11:30',
    //                     endTime: '12:00',
    //                     createdAt: new Date('2025-06-01T08:00:00.000Z'),
    //                     updatedAt: new Date('2025-06-01T08:00:00.000Z'),
    //                     doctorAppointment: null, // ← FREE
    //                 },
    //             ],
    //         },
    //         {
    //             id: 'avail_date_002',
    //             doctorId: 'clx1a2b3c4d5e6f7g8h9i0j',
    //             date: new Date('2025-07-15T00:00:00.000Z'), // Tuesday
    //             createdAt: new Date('2025-06-01T08:00:00.000Z'),
    //             updatedAt: new Date('2025-06-01T08:00:00.000Z'),
    //             doctorTimeSlots: [
    //                 {
    //                     id: 'slot_007',
    //                     availabilityDateId: 'avail_date_002',
    //                     startTime: '14:00',
    //                     endTime: '14:30',
    //                     createdAt: new Date('2025-06-01T08:00:00.000Z'),
    //                     updatedAt: new Date('2025-06-01T08:00:00.000Z'),
    //                     doctorAppointment: null, // ← FREE
    //                 },
    //                 {
    //                     id: 'slot_008',
    //                     availabilityDateId: 'avail_date_002',
    //                     startTime: '14:30',
    //                     endTime: '15:00',
    //                     createdAt: new Date('2025-06-01T08:00:00.000Z'),
    //                     updatedAt: new Date('2025-06-01T08:00:00.000Z'),
    //                     doctorAppointment: null, // ← FREE
    //                 },
    //                 {
    //                     id: 'slot_009',
    //                     availabilityDateId: 'avail_date_002',
    //                     startTime: '15:00',
    //                     endTime: '15:30',
    //                     createdAt: new Date('2025-06-01T08:00:00.000Z'),
    //                     updatedAt: new Date('2025-06-01T08:00:00.000Z'),
    //                     doctorAppointment: { id: 'appt_booked_003' }, // ← BOOKED
    //                 },
    //                 {
    //                     id: 'slot_010',
    //                     availabilityDateId: 'avail_date_002',
    //                     startTime: '15:30',
    //                     endTime: '16:00',
    //                     createdAt: new Date('2025-06-01T08:00:00.000Z'),
    //                     updatedAt: new Date('2025-06-01T08:00:00.000Z'),
    //                     doctorAppointment: null, // ← FREE
    //                 },
    //             ],
    //         },
    //         {
    //             id: 'avail_date_003',
    //             doctorId: 'clx1a2b3c4d5e6f7g8h9i0j',
    //             date: new Date('2025-07-17T00:00:00.000Z'), // Thursday
    //             createdAt: new Date('2025-06-01T08:00:00.000Z'),
    //             updatedAt: new Date('2025-06-01T08:00:00.000Z'),
    //             doctorTimeSlots: [
    //                 {
    //                     id: 'slot_011',
    //                     availabilityDateId: 'avail_date_003',
    //                     startTime: '10:00',
    //                     endTime: '10:30',
    //                     createdAt: new Date('2025-06-01T08:00:00.000Z'),
    //                     updatedAt: new Date('2025-06-01T08:00:00.000Z'),
    //                     doctorAppointment: null, // ← FREE
    //                 },
    //                 {
    //                     id: 'slot_012',
    //                     availabilityDateId: 'avail_date_003',
    //                     startTime: '10:30',
    //                     endTime: '11:00',
    //                     createdAt: new Date('2025-06-01T08:00:00.000Z'),
    //                     updatedAt: new Date('2025-06-01T08:00:00.000Z'),
    //                     doctorAppointment: null, // ← FREE
    //                 },
    //             ],
    //         },
    //     ],
    // }

    return (
        <div>
            <DynamicDoctor />
        </div>
    )
}

export default Page
