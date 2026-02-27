/*
  Warnings:

  - You are about to drop the column `doctorAvailabilityDate` on the `DoctorTimeSlot` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[timeSlotId]` on the table `DoctorAppointment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `timeSlotId` to the `DoctorAppointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `DoctorAvailabilityDate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `availabilityDateId` to the `DoctorTimeSlot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endTime` to the `DoctorTimeSlot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `DoctorTimeSlot` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DoctorTimeSlot" DROP CONSTRAINT "DoctorTimeSlot_doctorAvailabilityDate_fkey";

-- AlterTable
ALTER TABLE "DoctorAppointment" ADD COLUMN     "timeSlotId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "DoctorAvailabilityDate" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "DoctorTimeSlot" DROP COLUMN "doctorAvailabilityDate",
ADD COLUMN     "availabilityDateId" TEXT NOT NULL,
ADD COLUMN     "endTime" TEXT NOT NULL,
ADD COLUMN     "startTime" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "DoctorAppointment_timeSlotId_key" ON "DoctorAppointment"("timeSlotId");

-- AddForeignKey
ALTER TABLE "DoctorTimeSlot" ADD CONSTRAINT "DoctorTimeSlot_availabilityDateId_fkey" FOREIGN KEY ("availabilityDateId") REFERENCES "DoctorAvailabilityDate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorAppointment" ADD CONSTRAINT "DoctorAppointment_timeSlotId_fkey" FOREIGN KEY ("timeSlotId") REFERENCES "DoctorTimeSlot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
