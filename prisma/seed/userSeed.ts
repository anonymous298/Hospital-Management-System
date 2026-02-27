import prisma from "@/lib/prisma";

export async function seedUsers() {
    console.log("Seeding Users...")

    await prisma.user.create({
        data: {
            clerkId: '234234234dsfsdf23f2fs2',
            name: "Talha",
            email: "talha3@test.com",
            username: 'talhaProDev1'
            },
    })
}