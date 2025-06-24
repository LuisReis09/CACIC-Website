/*
  Warnings:

  - You are about to drop the column `servico_jogos_ativo` on the `Admin` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "servico_jogos_ativo",
ADD COLUMN     "servicoJogosAtivo" BOOLEAN NOT NULL DEFAULT false;
