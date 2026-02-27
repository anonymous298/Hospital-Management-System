import prisma from "@/lib/prisma";
import { randomUUID } from "node:crypto";
import { seedUsers } from "./seed/userSeed";
import { seedDoctors } from "./seed/doctorSeed";

async function main() {
  console.log("🌱 Seeding database...");

  await seedUsers();
  await seedDoctors();

  console.log("✅ Seed Complete");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());