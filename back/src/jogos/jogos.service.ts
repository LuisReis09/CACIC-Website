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
    quantidade: number;
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
      return await this.prisma.jogo.findMany({
        where: {
            status: StatusJogo.DISPONIVEL // Filtra apenas jogos disponíveis
        },
        orderBy: {
            nome: 'asc' // Ordena os jogos pelo nome
        }
      });
    }

    async consultar(id: number){
        return await this.prisma.jogo.findUnique({
            where: {
                id: id
            }
        });
    }

    async cadastrar(jogo: Jogo) {
        return await this.prisma.jogo.create({
            data: {
                nome: jogo.nome,
                precoPorHora: jogo.precoPorHora,
                imagem: jogo.imagem,
                status: StatusJogo.DISPONIVEL,
                quantidade: jogo.quantidade
            }
        });
    }

    async cadastrarVarios(jogos: any[]) {
        return await this.prisma.jogo.createMany({
            data: jogos
        });
    }

    async atualizar(id: number, jogo: Jogo) {
        return await this.prisma.jogo.update({
            where: {
                id: id
            },
            data: jogo
        });
    }

    async deletar(id: number) {
        return await this.prisma.jogo.delete({
            where: {
                id: id
            }
        });
    }

    async deletarTodos() {
        return await this.prisma.jogo.deleteMany({});
    }

    async buscar(filtro: string, parametro: string | number) {
        const isString = typeof parametro === 'string';

        return await this.prisma.jogo.findMany({
            where: {
                [filtro]: isString ? { contains: parametro as string, mode: 'insensitive' } : parametro
            }
        });
    }

    async indisponibilizar(id: number) {
        return await this.prisma.jogo.update({
            where: {
                id: id
            },
            data: {
                status: StatusJogo.INDISPONIVEL
            }
        });
    }

    async disponibilizar(id: number) {
        return await this.prisma.jogo.update({
            where: {
                id: id
            },
            data: {
                status: StatusJogo.DISPONIVEL
            }
        });
    }


}
