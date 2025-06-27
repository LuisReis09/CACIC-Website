import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import * as QRCode from 'qrcode';

export enum StatusJogo {
  DISPONIVEL = 'DISPONIVEL',
  INDISPONIVEL = 'INDISPONIVEL',
  ALUGADO = 'ALUGADO',
}

export enum StatusAluguel {
  PENDENTE_APROVACAO = 'PENDENTE_APROVACAO',
  RESERVADO = 'RESERVADO',
  INICIADO = 'INICIADO',
  FINALIZADO = 'FINALIZADO',
  CANCELADO = 'CANCELADO',
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

    async deletarTodos() {
        return this.prisma.jogo.deleteMany({});
    }

    async buscar(filtro: string, parametro: string | number) {
        const isString = typeof parametro === 'string';

        return this.prisma.jogo.findMany({
            where: {
                [filtro]: isString ? { contains: parametro as string, mode: 'insensitive' } : parametro
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
