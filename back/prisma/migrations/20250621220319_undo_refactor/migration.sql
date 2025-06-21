/*
  Warnings:

  - You are about to drop the column `dataAtualizacao` on the `Aluguel` table. All the data in the column will be lost.
  - You are about to drop the column `dataCriacao` on the `Aluguel` table. All the data in the column will be lost.
  - You are about to drop the `AreaDeInteresse` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Disciplina` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FeedbackAgregado` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FeedbackIndividual` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProfessorAreasDeInteresse` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProfessorDisciplinas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Usuario` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VotanteProfessor` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `emailMonitor` on table `Monitoria` required. This step will fail if there are existing NULL values in that column.
  - Made the column `linkDiscord` on table `Monitoria` required. This step will fail if there are existing NULL values in that column.
  - Made the column `linkWhatsapp` on table `Monitoria` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `areasDeInteresse` to the `Professor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `disciplinas` to the `Professor` table without a default value. This is not possible if the table is not empty.
  - Made the column `linkedin` on table `Professor` required. This step will fail if there are existing NULL values in that column.
  - Made the column `imagem` on table `Professor` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "FeedbackAgregado" DROP CONSTRAINT "FeedbackAgregado_professorId_fkey";

-- DropForeignKey
ALTER TABLE "FeedbackIndividual" DROP CONSTRAINT "FeedbackIndividual_professorId_fkey";

-- DropForeignKey
ALTER TABLE "FeedbackIndividual" DROP CONSTRAINT "FeedbackIndividual_votanteId_fkey";

-- DropForeignKey
ALTER TABLE "Monitoria" DROP CONSTRAINT "Monitoria_professorId_fkey";

-- DropForeignKey
ALTER TABLE "ProfessorAreasDeInteresse" DROP CONSTRAINT "ProfessorAreasDeInteresse_areaDeInteresseId_fkey";

-- DropForeignKey
ALTER TABLE "ProfessorAreasDeInteresse" DROP CONSTRAINT "ProfessorAreasDeInteresse_professorId_fkey";

-- DropForeignKey
ALTER TABLE "ProfessorDisciplinas" DROP CONSTRAINT "ProfessorDisciplinas_disciplinaId_fkey";

-- DropForeignKey
ALTER TABLE "ProfessorDisciplinas" DROP CONSTRAINT "ProfessorDisciplinas_professorId_fkey";

-- DropForeignKey
ALTER TABLE "VotanteProfessor" DROP CONSTRAINT "VotanteProfessor_professorId_fkey";

-- DropForeignKey
ALTER TABLE "VotanteProfessor" DROP CONSTRAINT "VotanteProfessor_votanteId_fkey";

-- DropIndex
DROP INDEX "Admin_login_idx";

-- DropIndex
DROP INDEX "Admin_login_key";

-- DropIndex
DROP INDEX "Aluguel_clienteId_idx";

-- DropIndex
DROP INDEX "Aluguel_dataFim_idx";

-- DropIndex
DROP INDEX "Aluguel_dataInicio_idx";

-- DropIndex
DROP INDEX "Aluguel_jogoId_idx";

-- DropIndex
DROP INDEX "Aluguel_status_idx";

-- DropIndex
DROP INDEX "Cliente_cpf_idx";

-- DropIndex
DROP INDEX "Cliente_email_idx";

-- DropIndex
DROP INDEX "Jogo_nome_idx";

-- DropIndex
DROP INDEX "Jogo_nome_key";

-- DropIndex
DROP INDEX "Jogo_status_idx";

-- DropIndex
DROP INDEX "Monitoria_disciplina_idx";

-- DropIndex
DROP INDEX "Monitoria_professorId_idx";

-- DropIndex
DROP INDEX "Professor_departamento_idx";

-- DropIndex
DROP INDEX "Professor_email_key";

-- DropIndex
DROP INDEX "Professor_nome_idx";

-- AlterTable
ALTER TABLE "Aluguel" DROP COLUMN "dataAtualizacao",
DROP COLUMN "dataCriacao";

-- AlterTable
ALTER TABLE "Cliente" ALTER COLUMN "bloqueado" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Jogo" ALTER COLUMN "status" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Monitoria" ALTER COLUMN "emailMonitor" SET NOT NULL,
ALTER COLUMN "linkDiscord" SET NOT NULL,
ALTER COLUMN "linkWhatsapp" SET NOT NULL;

-- AlterTable
ALTER TABLE "Professor" ADD COLUMN     "areasDeInteresse" TEXT NOT NULL,
ADD COLUMN     "disciplinas" TEXT NOT NULL,
ALTER COLUMN "linkedin" SET NOT NULL,
ALTER COLUMN "imagem" SET NOT NULL;

-- DropTable
DROP TABLE "AreaDeInteresse";

-- DropTable
DROP TABLE "Disciplina";

-- DropTable
DROP TABLE "FeedbackAgregado";

-- DropTable
DROP TABLE "FeedbackIndividual";

-- DropTable
DROP TABLE "ProfessorAreasDeInteresse";

-- DropTable
DROP TABLE "ProfessorDisciplinas";

-- DropTable
DROP TABLE "Usuario";

-- DropTable
DROP TABLE "VotanteProfessor";

-- CreateTable
CREATE TABLE "Feedback" (
    "id" SERIAL NOT NULL,
    "didatica" DOUBLE PRECISION NOT NULL,
    "planejamento" DOUBLE PRECISION NOT NULL,
    "avaliacoes" DOUBLE PRECISION NOT NULL,
    "cordialidade" DOUBLE PRECISION NOT NULL,
    "qtdFeedbacks" INTEGER NOT NULL,
    "professorId" INTEGER NOT NULL,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Votante" (
    "id" SERIAL NOT NULL,
    "cpf" TEXT NOT NULL,
    "professorId" INTEGER NOT NULL,

    CONSTRAINT "Votante_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "Professor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Votante" ADD CONSTRAINT "Votante_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "Professor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Monitoria" ADD CONSTRAINT "Monitoria_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "Professor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
