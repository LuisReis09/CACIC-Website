import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

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

    async alugar(
      id: number,
      cliente: Cliente,
      dataInicio: Date,
      dataFim: Date,
    ): Promise<any> {
      // Verifica se o cliente existe
      let clienteExistente = await this.prisma.cliente.findUnique({
        where: { cpf: cliente.cpf },
      });

      if (!clienteExistente) {
        clienteExistente = await this.prisma.cliente.create({
          data: {
            cpf: cliente.cpf,
            nome: cliente.nome,
            email: cliente.email,
            contato: cliente.contato,
            bloqueado: false,
            motivoBloqueio: null,
            dataBloqueio: null,
          },
        });
      } else if (clienteExistente.bloqueado) {
        return {
          success: false,
          message: `Cliente bloqueado: ${clienteExistente.motivoBloqueio}`,
        };
      }

      const inicio = dataInicio;
      const fim = dataFim;

      // 🔥 Verifica se o jogo já está alugado nesse período
      const alugueisConflitantes = await this.prisma.aluguel.findMany({
        where: {
          jogoId: id,
          AND: [
            { dataInicio: { lt: fim } },
            { dataFim: { gt: inicio } },
          ],
        },
      });

      if (alugueisConflitantes.length > 0) {
        return {
          success: false,
          message: 'Jogo já está alugado neste período.',
          conflitos: alugueisConflitantes.map((a) => ({
            de: a.dataInicio,
            ate: a.dataFim,
          })),
        };
      }

      // 🔥 Cria o aluguel
      const novoAluguel = await this.prisma.aluguel.create({
        data: {
          jogoId: id,
          dataInicio: inicio,
          dataFim: fim,
          status: StatusAluguel.RESERVADO,
          clienteId: clienteExistente.id,
        },
      });

      return {
        success: true,
        message: 'Aluguel criado com sucesso.',
        aluguel: novoAluguel,
      };
    }
}
