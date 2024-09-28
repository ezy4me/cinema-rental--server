/*
  Warnings:

  - You are about to drop the column `statusId` on the `Equipment` table. All the data in the column will be lost.
  - You are about to drop the `Status` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Equipment" DROP CONSTRAINT "Equipment_statusId_fkey";

-- AlterTable
ALTER TABLE "Equipment" DROP COLUMN "statusId";

-- DropTable
DROP TABLE "Status";
