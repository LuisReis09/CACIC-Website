-- CreateEnum
CREATE TYPE "StatusJogo" AS ENUM ('DISPONIVEL', 'INDISPONIVEL', 'ALUGADO');

-- CreateEnum
CREATE TYPE "StatusAluguel" AS ENUM ('RESERVADO', 'INICIADO', 'FINALIZADO');

-- CreateTable
CREATE TABLE "Professor" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "sala" TEXT NOT NULL,
    "departamento" TEXT NOT NULL,
    "areasDeInteresse" TEXT NOT NULL,
    "disciplinas" TEXT NOT NULL,
    "linkedin" TEXT NOT NULL,

    CONSTRAINT "Professor_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "Monitoria" (
    "id" SERIAL NOT NULL,
    "monitores" TEXT NOT NULL,
    "emailMonitor" TEXT NOT NULL,
    "disciplina" TEXT NOT NULL,
    "linkDiscord" TEXT NOT NULL,
    "linkWhatsapp" TEXT NOT NULL,
    "professorId" INTEGER NOT NULL,

    CONSTRAINT "Monitoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "login" TEXT NOT NULL,
    "senha" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Jogo" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "precoPorHora" DOUBLE PRECISION NOT NULL,
    "status" "StatusJogo" NOT NULL,

    CONSTRAINT "Jogo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" SERIAL NOT NULL,
    "cpf" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contato" TEXT NOT NULL,
    "bloqueado" BOOLEAN NOT NULL,
    "motivoBloqueio" TEXT,
    "dataBloqueio" TIMESTAMP(3),

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Aluguel" (
    "id" SERIAL NOT NULL,
    "jogoId" INTEGER NOT NULL,
    "clienteId" INTEGER NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3) NOT NULL,
    "status" "StatusAluguel" NOT NULL DEFAULT 'RESERVADO',

    CONSTRAINT "Aluguel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_cpf_key" ON "Cliente"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_email_key" ON "Cliente"("email");

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "Professor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Votante" ADD CONSTRAINT "Votante_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "Professor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Monitoria" ADD CONSTRAINT "Monitoria_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "Professor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aluguel" ADD CONSTRAINT "Aluguel_jogoId_fkey" FOREIGN KEY ("jogoId") REFERENCES "Jogo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aluguel" ADD CONSTRAINT "Aluguel_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
