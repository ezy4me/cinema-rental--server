/*
  Warnings:

  - Added the required column `quantity` to the `RentalEquipment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RentalEquipment" ADD COLUMN     "quantity" INTEGER NOT NULL;
