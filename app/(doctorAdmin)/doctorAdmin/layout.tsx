// app/(doctorAdmin)/doctorAdmin/layout.tsx

import React from "react"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import DoctorAdminShell from "@/components/doctorAdmin/layout/DoctorAdminShell"
import { getCurrentDbUser } from "@/server/actions/user.action"

export default async function DoctorAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const clerkUser = await currentUser()
  if (!clerkUser) redirect("/");

  const dbUser = await getCurrentDbUser();
//   if (!dbUser.doctorId) redirect('/');
    console.log(dbUser.doctorId)

  if (dbUser.role !== 'DOCTOR') redirect('/');

  return (
    <DoctorAdminShell
      userName={`${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim()}
      userEmail={clerkUser.emailAddresses[0]?.emailAddress ?? ""}
      userImage={clerkUser.imageUrl ?? ""}
    >
      {children}
    </DoctorAdminShell>
  )
}