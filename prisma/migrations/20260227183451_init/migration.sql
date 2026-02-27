/*
  Warnings:

  - A unique constraint covering the columns `[doctorAppointmentId]` on the table `PatientDetail` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[doctorAppointmentId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[clerkId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `about` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `consultationFee` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `experience` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patients` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `qualification` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `specialization` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `success` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `doctorId` to the `DoctorAppointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `DoctorAppointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `doctorId` to the `DoctorAvailabilityDate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `doctorAvailabilityDate` to the `DoctorTimeSlot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `age` to the `PatientDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `doctorAppointmentId` to the `PatientDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `PatientDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullName` to the `PatientDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `PatientDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `PatientDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `doctorAppointmentId` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `doctorId` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `method` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clerkId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('PATIENT', 'DOCTOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "DoctorAvailabilityStatus" AS ENUM ('AVAILABLE', 'UNAVAILABLE');

-- CreateEnum
CREATE TYPE "GenderRole" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('ONLINE', 'CASH');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "Doctor" ADD COLUMN     "about" TEXT NOT NULL,
ADD COLUMN     "availability" "DoctorAvailabilityStatus" NOT NULL DEFAULT 'AVAILABLE',
ADD COLUMN     "consultationFee" INTEGER NOT NULL,
ADD COLUMN     "experience" TEXT NOT NULL,
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "patients" TEXT NOT NULL,
ADD COLUMN     "qualification" TEXT NOT NULL,
ADD COLUMN     "specialization" TEXT NOT NULL,
ADD COLUMN     "success" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "DoctorAppointment" ADD COLUMN     "doctorId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "DoctorAvailabilityDate" ADD COLUMN     "doctorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "DoctorTimeSlot" ADD COLUMN     "doctorAvailabilityDate" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PatientDetail" ADD COLUMN     "age" INTEGER NOT NULL,
ADD COLUMN     "doctorAppointmentId" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "fullName" TEXT NOT NULL,
ADD COLUMN     "gender" "GenderRole" NOT NULL,
ADD COLUMN     "phoneNumber" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "doctorAppointmentId" TEXT NOT NULL,
ADD COLUMN     "doctorId" TEXT NOT NULL,
ADD COLUMN     "method" "PaymentMethod" NOT NULL,
ADD COLUMN     "status" "PaymentStatus" NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "clerkId" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'PATIENT',
ADD COLUMN     "username" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PatientDetail_doctorAppointmentId_key" ON "PatientDetail"("doctorAppointmentId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_doctorAppointmentId_key" ON "Payment"("doctorAppointmentId");

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "DoctorAvailabilityDate" ADD CONSTRAINT "DoctorAvailabilityDate_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorTimeSlot" ADD CONSTRAINT "DoctorTimeSlot_doctorAvailabilityDate_fkey" FOREIGN KEY ("doctorAvailabilityDate") REFERENCES "DoctorAvailabilityDate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorAppointment" ADD CONSTRAINT "DoctorAppointment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorAppointment" ADD CONSTRAINT "DoctorAppointment_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientDetail" ADD CONSTRAINT "PatientDetail_doctorAppointmentId_fkey" FOREIGN KEY ("doctorAppointmentId") REFERENCES "DoctorAppointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_doctorAppointmentId_fkey" FOREIGN KEY ("doctorAppointmentId") REFERENCES "DoctorAppointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
