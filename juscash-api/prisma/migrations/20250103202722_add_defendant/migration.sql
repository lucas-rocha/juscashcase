/*
  Warnings:

  - Added the required column `defendant` to the `Publications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Publications" ADD COLUMN     "defendant" TEXT NOT NULL;
