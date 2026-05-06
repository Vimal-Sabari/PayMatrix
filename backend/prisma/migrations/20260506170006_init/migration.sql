-- CreateEnum
CREATE TYPE "Level" AS ENUM ('L3', 'L4', 'L5', 'L6', 'L7', 'SDE1', 'SDE2', 'SDE3', 'SENIOR', 'STAFF', 'PRINCIPAL');

-- CreateTable
CREATE TABLE "Salary" (
    "id" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "level" "Level" NOT NULL,
    "location" TEXT NOT NULL,
    "experience_years" DOUBLE PRECISION NOT NULL,
    "base_salary" DOUBLE PRECISION NOT NULL,
    "bonus" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "stock" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_compensation" DOUBLE PRECISION NOT NULL,
    "confidence_score" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Salary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Salary_company_idx" ON "Salary"("company");

-- CreateIndex
CREATE INDEX "Salary_level_idx" ON "Salary"("level");

-- CreateIndex
CREATE INDEX "Salary_company_level_idx" ON "Salary"("company", "level");

-- CreateIndex
CREATE INDEX "Salary_total_compensation_idx" ON "Salary"("total_compensation");
