-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "DoctorAppointment" ADD COLUMN     "status" "AppointmentStatus" NOT NULL DEFAULT 'PENDING';
