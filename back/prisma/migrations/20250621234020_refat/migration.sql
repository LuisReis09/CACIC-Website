/*
  Warnings:

  - Added the required column `imagem` to the `Jogo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `laboratorios` to the `Professor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Jogo" ADD COLUMN     "imagem" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Professor" ADD COLUMN     "laboratorios" TEXT NOT NULL;
