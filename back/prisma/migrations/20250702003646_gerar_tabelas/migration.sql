/*
  Warnings:

  - You are about to drop the column `professorId` on the `Monitoria` table. All the data in the column will be lost.
  - Added the required column `professor` to the `Monitoria` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Monitoria" DROP CONSTRAINT "Monitoria_professorId_fkey";

-- AlterTable
ALTER TABLE "Monitoria" DROP COLUMN "professorId",
ADD COLUMN     "professor" TEXT NOT NULL;
