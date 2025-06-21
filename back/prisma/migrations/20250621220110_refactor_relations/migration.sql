/*
  Warnings:

  - You are about to drop the column `areasDeInteresse` on the `Professor` table. All the data in the column will be lost.
  - You are about to drop the column `disciplinas` on the `Professor` table. All the data in the column will be lost.
  - You are about to drop the `Feedback` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Votante` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[login]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nome]` on the table `Jogo` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Professor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dataAtualizacao` to the `Aluguel` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Feedback" DROP CONSTRAINT "Feedback_professorId_fkey";

-- DropForeignKey
ALTER TABLE "Monitoria" DROP CONSTRAINT "Monitoria_professorId_fkey";

-- DropForeignKey
ALTER TABLE "Votante" DROP CONSTRAINT "Votante_professorId_fkey";

-- AlterTable
ALTER TABLE "Aluguel" ADD COLUMN     "dataAtualizacao" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Cliente" ALTER COLUMN "bloqueado" SET DEFAULT false;

-- AlterTable
ALTER TABLE "Jogo" ALTER COLUMN "status" SET DEFAULT 'DISPONIVEL';

-- AlterTable
ALTER TABLE "Monitoria" ALTER COLUMN "emailMonitor" DROP NOT NULL,
ALTER COLUMN "linkDiscord" DROP NOT NULL,
ALTER COLUMN "linkWhatsapp" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Professor" DROP COLUMN "areasDeInteresse",
DROP COLUMN "disciplinas",
ALTER COLUMN "linkedin" DROP NOT NULL,
ALTER COLUMN "imagem" DROP NOT NULL;

-- DropTable
DROP TABLE "Feedback";

-- DropTable
DROP TABLE "Votante";

-- CreateTable
CREATE TABLE "AreaDeInteresse" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "AreaDeInteresse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfessorAreasDeInteresse" (
    "professorId" INTEGER NOT NULL,
    "areaDeInteresseId" INTEGER NOT NULL,

    CONSTRAINT "ProfessorAreasDeInteresse_pkey" PRIMARY KEY ("professorId","areaDeInteresseId")
);

-- CreateTable
CREATE TABLE "Disciplina" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "Disciplina_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfessorDisciplinas" (
    "professorId" INTEGER NOT NULL,
    "disciplinaId" INTEGER NOT NULL,

    CONSTRAINT "ProfessorDisciplinas_pkey" PRIMARY KEY ("professorId","disciplinaId")
);

-- CreateTable
CREATE TABLE "FeedbackIndividual" (
    "id" SERIAL NOT NULL,
    "didatica" DOUBLE PRECISION NOT NULL,
    "planejamento" DOUBLE PRECISION NOT NULL,
    "avaliacoes" DOUBLE PRECISION NOT NULL,
    "cordialidade" DOUBLE PRECISION NOT NULL,
    "dataFeedback" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "professorId" INTEGER NOT NULL,
    "votanteId" INTEGER NOT NULL,

    CONSTRAINT "FeedbackIndividual_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeedbackAgregado" (
    "id" SERIAL NOT NULL,
    "didatica" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "planejamento" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "avaliacoes" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "cordialidade" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "qtdFeedbacks" INTEGER NOT NULL DEFAULT 0,
    "professorId" INTEGER NOT NULL,

    CONSTRAINT "FeedbackAgregado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "cpf" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contato" TEXT,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VotanteProfessor" (
    "votanteId" INTEGER NOT NULL,
    "professorId" INTEGER NOT NULL,
    "dataVoto" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VotanteProfessor_pkey" PRIMARY KEY ("votanteId","professorId")
);

-- CreateIndex
CREATE UNIQUE INDEX "AreaDeInteresse_nome_key" ON "AreaDeInteresse"("nome");

-- CreateIndex
CREATE INDEX "AreaDeInteresse_nome_idx" ON "AreaDeInteresse"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Disciplina_nome_key" ON "Disciplina"("nome");

-- CreateIndex
CREATE INDEX "Disciplina_nome_idx" ON "Disciplina"("nome");

-- CreateIndex
CREATE INDEX "FeedbackIndividual_professorId_idx" ON "FeedbackIndividual"("professorId");

-- CreateIndex
CREATE INDEX "FeedbackIndividual_votanteId_idx" ON "FeedbackIndividual"("votanteId");

-- CreateIndex
CREATE UNIQUE INDEX "FeedbackAgregado_professorId_key" ON "FeedbackAgregado"("professorId");

-- CreateIndex
CREATE INDEX "FeedbackAgregado_professorId_idx" ON "FeedbackAgregado"("professorId");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_cpf_key" ON "Usuario"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE INDEX "Usuario_cpf_idx" ON "Usuario"("cpf");

-- CreateIndex
CREATE INDEX "Usuario_email_idx" ON "Usuario"("email");

-- CreateIndex
CREATE INDEX "VotanteProfessor_votanteId_idx" ON "VotanteProfessor"("votanteId");

-- CreateIndex
CREATE INDEX "VotanteProfessor_professorId_idx" ON "VotanteProfessor"("professorId");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_login_key" ON "Admin"("login");

-- CreateIndex
CREATE INDEX "Admin_login_idx" ON "Admin"("login");

-- CreateIndex
CREATE INDEX "Aluguel_jogoId_idx" ON "Aluguel"("jogoId");

-- CreateIndex
CREATE INDEX "Aluguel_clienteId_idx" ON "Aluguel"("clienteId");

-- CreateIndex
CREATE INDEX "Aluguel_dataInicio_idx" ON "Aluguel"("dataInicio");

-- CreateIndex
CREATE INDEX "Aluguel_dataFim_idx" ON "Aluguel"("dataFim");

-- CreateIndex
CREATE INDEX "Aluguel_status_idx" ON "Aluguel"("status");

-- CreateIndex
CREATE INDEX "Cliente_cpf_idx" ON "Cliente"("cpf");

-- CreateIndex
CREATE INDEX "Cliente_email_idx" ON "Cliente"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Jogo_nome_key" ON "Jogo"("nome");

-- CreateIndex
CREATE INDEX "Jogo_nome_idx" ON "Jogo"("nome");

-- CreateIndex
CREATE INDEX "Jogo_status_idx" ON "Jogo"("status");

-- CreateIndex
CREATE INDEX "Monitoria_professorId_idx" ON "Monitoria"("professorId");

-- CreateIndex
CREATE INDEX "Monitoria_disciplina_idx" ON "Monitoria"("disciplina");

-- CreateIndex
CREATE UNIQUE INDEX "Professor_email_key" ON "Professor"("email");

-- CreateIndex
CREATE INDEX "Professor_nome_idx" ON "Professor"("nome");

-- CreateIndex
CREATE INDEX "Professor_departamento_idx" ON "Professor"("departamento");

-- AddForeignKey
ALTER TABLE "ProfessorAreasDeInteresse" ADD CONSTRAINT "ProfessorAreasDeInteresse_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "Professor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessorAreasDeInteresse" ADD CONSTRAINT "ProfessorAreasDeInteresse_areaDeInteresseId_fkey" FOREIGN KEY ("areaDeInteresseId") REFERENCES "AreaDeInteresse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessorDisciplinas" ADD CONSTRAINT "ProfessorDisciplinas_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "Professor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessorDisciplinas" ADD CONSTRAINT "ProfessorDisciplinas_disciplinaId_fkey" FOREIGN KEY ("disciplinaId") REFERENCES "Disciplina"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackIndividual" ADD CONSTRAINT "FeedbackIndividual_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "Professor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackIndividual" ADD CONSTRAINT "FeedbackIndividual_votanteId_fkey" FOREIGN KEY ("votanteId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackAgregado" ADD CONSTRAINT "FeedbackAgregado_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "Professor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VotanteProfessor" ADD CONSTRAINT "VotanteProfessor_votanteId_fkey" FOREIGN KEY ("votanteId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VotanteProfessor" ADD CONSTRAINT "VotanteProfessor_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "Professor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Monitoria" ADD CONSTRAINT "Monitoria_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "Professor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
