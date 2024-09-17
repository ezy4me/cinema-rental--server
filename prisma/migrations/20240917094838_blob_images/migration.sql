/*
  Warnings:

  - Changed the type of `image` on the `Category` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `image` on the `Equipment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Category" DROP COLUMN "image",
ADD COLUMN     "image" BYTEA NOT NULL;

-- AlterTable
ALTER TABLE "Equipment" DROP COLUMN "image",
ADD COLUMN     "image" BYTEA NOT NULL;
