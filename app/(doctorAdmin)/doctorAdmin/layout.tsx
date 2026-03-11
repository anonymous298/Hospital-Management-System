// app/(doctorAdmin)/doctorAdmin/layout.tsx

import React from "react"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import DoctorAdminShell from "@/components/doctorAdmin/layout/DoctorAdminShell"

export default async function DoctorAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await currentUser()
  if (!user) redirect("/")

  return (
    <DoctorAdminShell
      userName={`${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()}
      userEmail={user.emailAddresses[0]?.emailAddress ?? ""}
      userImage={user.imageUrl ?? ""}
    >
      {children}
    </DoctorAdminShell>
  )
}