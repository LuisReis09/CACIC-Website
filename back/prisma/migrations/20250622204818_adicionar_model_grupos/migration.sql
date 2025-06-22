-- CreateTable
CREATE TABLE "GrupoWhatsapp" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "imagem" TEXT NOT NULL,

    CONSTRAINT "GrupoWhatsapp_pkey" PRIMARY KEY ("id")
);
