import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class GruposService {
    constructor(private readonly prisma: PrismaService) {}

    async listar() {
        return this.prisma.grupoWhatsapp.findMany({
            orderBy: {
                nome: 'asc',
            }
        });
    }

    async cadastrar(grupo: { nome: string; link: string; descricao: string, imagem: string }) {
        return this.prisma.grupoWhatsapp.create({
            data: {
                nome: grupo.nome,
                link: grupo.link,
                descricao: grupo.descricao,
                imagem: grupo.imagem,
            },
        });
    }

    async deletar(id_grupo: number) {
        return this.prisma.grupoWhatsapp.delete({
            where: {
                id: id_grupo,
            },
        });
    }

    async atualizar(id_grupo: number, grupo: { nome?: string; link?: string; descricao?: string; imagem?: string }) {
        return this.prisma.grupoWhatsapp.update({
            where: {
                id: id_grupo,
            },
            data: {
                ...grupo,
            },
        });
    }
}
