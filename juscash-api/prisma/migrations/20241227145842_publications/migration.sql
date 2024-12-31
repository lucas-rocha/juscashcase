-- CreateTable
CREATE TABLE "Publications" (
    "id" TEXT NOT NULL,
    "processNumber" TEXT NOT NULL,
    "authors" TEXT NOT NULL,
    "lawyers" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "principalValue" DECIMAL(65,30) NOT NULL,
    "interestValue" DECIMAL(65,30) NOT NULL,
    "attorneyFees" DECIMAL(65,30) NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Publications_pkey" PRIMARY KEY ("id")
);
