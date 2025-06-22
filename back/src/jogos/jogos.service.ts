import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import * as QRCode from 'qrcode';

export enum StatusJogo {
  DISPONIVEL = 'DISPONIVEL',
  INDISPONIVEL = 'INDISPONIVEL',
  ALUGADO = 'ALUGADO',
}

export enum StatusAluguel {
  RESERVADO = 'RESERVADO',
  INICIADO = 'INICIADO',
  FINALIZADO = 'FINALIZADO',
}

export interface Jogo {
    nome: string;
    precoPorHora: number;
    imagem: string;
    status: StatusJogo;
}

export interface Cliente {
    cpf: string;
    nome: string;
    email: string;
    contato: string;
}

export interface Aluguel {
    jogoId: number;
    clienteId: number;
    dataInicio: Date;
    dataFim: Date;
}

@Injectable()
export class JogosService {
    constructor(private readonly prisma: PrismaService) {}

    async listar(){
      return this.prisma.jogo.findMany({});
    }

    async consultar(id: number){
        return this.prisma.jogo.findUnique({
            where: {
                id: id
            },
            include: {
                alugueis: true,
            }
        });
    }

    async cadastrar(jogo: Jogo) {
        return this.prisma.jogo.create({
            data: {
                nome: jogo.nome,
                precoPorHora: jogo.precoPorHora,
                imagem: jogo.imagem,
                status: StatusJogo.DISPONIVEL
            }
        });
    }

    async atualizar(id: number, jogo: Jogo) {
        return this.prisma.jogo.update({
            where: {
                id: id
            },
            data: jogo
        });
    }

    async deletar(id: number) {
        return this.prisma.jogo.delete({
            where: {
                id: id
            }
        });
    }

    async buscarPorNome(nome: string) {
        return this.prisma.jogo.findMany({
            where: {
                nome: {
                    contains: nome,
                    mode: 'insensitive'
                }
            }
        });
    }

    async indisponibilizar(id: number) {
        return this.prisma.jogo.update({
            where: {
                id: id
            },
            data: {
                status: StatusJogo.INDISPONIVEL
            }
        });
    }

    async disponibilizar(id: number) {
        return this.prisma.jogo.update({
            where: {
                id: id
            },
            data: {
                status: StatusJogo.DISPONIVEL
            }
        });
    }

}
