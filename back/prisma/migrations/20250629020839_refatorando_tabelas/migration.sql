/*
  Warnings:

  - You are about to drop the `GrupoWhatsapp` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Jogo" ADD COLUMN     "quantidade" INTEGER NOT NULL DEFAULT 1;

-- DropTable
DROP TABLE "GrupoWhatsapp";

-- CreateTable
CREATE TABLE "Laboratorio" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "localizacao" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "imagem" TEXT NOT NULL,

    CONSTRAINT "Laboratorio_pkey" PRIMARY KEY ("id")
);
