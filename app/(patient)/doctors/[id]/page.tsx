import DynamicDoctor from '@/components/patient/DynamicDoctor/DynamicDoctor';
import prisma from '@/lib/prisma';
import { fetchSingleDoctor } from '@/server/actions/doctor.seed';
import React from 'react'

export interface PageProps {
    params: Promise<{ id: string }>; // YES, a Promise
    searchParams?: Promise<{ id: string }>;
}

const Page = async ({ params }: PageProps) => {

    // Fetching Dynamic Id Slug
    const { id } = await params;

    // Fetching Doctor Data based on Dynamic Id Slug
    const doctor = await fetchSingleDoctor(id);

    return (
        <div>
            <DynamicDoctor doctor={doctor}/>
        </div>
    )
}

export default Page
