-- AlterTable
ALTER TABLE "Rental" ADD COLUMN     "statusId" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "Status" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Status_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Rental" ADD CONSTRAINT "Rental_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "Status"("id") ON DELETE CASCADE ON UPDATE CASCADE;
