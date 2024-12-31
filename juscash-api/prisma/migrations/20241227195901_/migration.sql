/*
  Warnings:

  - Added the required column `availabilityData` to the `Publications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Publications" ADD COLUMN     "availabilityData" TIMESTAMP(3) NOT NULL;
