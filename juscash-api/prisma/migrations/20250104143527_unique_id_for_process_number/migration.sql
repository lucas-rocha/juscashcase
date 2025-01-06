/*
  Warnings:

  - You are about to alter the column `principalValue` on the `Publications` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(15,2)`.
  - You are about to alter the column `interestValue` on the `Publications` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(15,2)`.
  - You are about to alter the column `attorneyFees` on the `Publications` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(15,2)`.
  - A unique constraint covering the columns `[processNumber]` on the table `Publications` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Publications" ALTER COLUMN "principalValue" SET DATA TYPE DECIMAL(15,2),
ALTER COLUMN "interestValue" SET DATA TYPE DECIMAL(15,2),
ALTER COLUMN "attorneyFees" SET DATA TYPE DECIMAL(15,2);

-- CreateIndex
CREATE UNIQUE INDEX "Publications_processNumber_key" ON "Publications"("processNumber");
