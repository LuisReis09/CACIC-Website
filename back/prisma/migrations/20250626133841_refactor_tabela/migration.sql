/*
  Warnings:

  - You are about to drop the column `dataFim` on the `Aluguel` table. All the data in the column will be lost.
  - You are about to drop the column `dataInicio` on the `Aluguel` table. All the data in the column will be lost.
  - Added the required column `horaFim` to the `Aluguel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `horaInicio` to the `Aluguel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Aluguel" DROP COLUMN "dataFim",
DROP COLUMN "dataInicio",
ADD COLUMN     "horaFim" INTEGER NOT NULL,
ADD COLUMN     "horaInicio" INTEGER NOT NULL;
