import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Cliente, Jogo } from 'src/jogos/jogos.service';
import { JogosController } from 'src/jogos/jogos.controller';
import * as nodemailer from 'nodemailer';

export interface Aluguel {
    jogoId: number;
    clienteId: number;
    horaInicio: Date;
    horaFim: Date;
}

@Injectable()
export class AluguelService {
    constructor(private readonly prisma: PrismaService) {}

    async requisitarAluguel(
        id_jogo: number,
        cliente: Cliente,
        horaInicio: Date,
        horaFim: Date
    ) : Promise<any> {
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

        const conflitos = await this.prisma.aluguel.findMany({
            where: {
                jogoId: id_jogo,
                dataInicio: {
                    lte: horaFim,
                },
                dataFim: {
                    gte: horaInicio,
                },
            },
        });

        if (conflitos.length > 0) {
            return {
                success: false,
                message: 'Jogo já está alugado nesse período.',
                conflitos: conflitos.map((a) => ({
                    de: a.dataInicio,
                    ate: a.dataFim,
                })),
            };
        }

        // Cria o aluguel
        const aluguel = await this.prisma.aluguel.create({
            data: {
                jogoId: id_jogo,
                clienteId: clienteExistente.id,
                dataInicio: horaInicio,
                dataFim: horaFim,
            },
            include: {
                jogo: true,
                cliente: true,
            },
        });

        if( !aluguel) {
            return {
                success: false,
                message: 'Erro ao realizar o aluguel.',
            };
        }

        this.enviar_email(
            cliente.email,
            'Aluguel de Jogo',
            `Seu pedido de aluguel foi realizado com sucesso. Jogo: ${aluguel.jogo.nome}
            \n\nData/Hora de Início: ${aluguel.dataInicio}
            \nData/Hora de Fim: ${aluguel.dataFim}
            \n\nStatus: PENDENTE DE APROVACAO. Aguarde a aprovação do administrador.
            `
        );

        return {
            success: true,
            message: 'Aluguel realizado com sucesso.',
            aluguel: aluguel,
        };
    }

    async listar(): Promise<any> {
        return this.prisma.aluguel.findMany({
            include: {
                jogo: true,
                cliente: true,
            },
        });
    }

    async listarPendentes(): Promise<any> {
        return this.prisma.aluguel.findMany({
            where: {
                status: 'PENDENTE_APROVACAO',
            },
            include: {
                jogo: true,
                cliente: true,
            },
        });
    }

    async listarReservados(): Promise<any> {
        return this.prisma.aluguel.findMany({
            where: {
                status: 'RESERVADO',
            },
            include: {
                jogo: true,
                cliente: true,
            },
        });
    }

    async listarAlugados(): Promise<any> {
        return this.prisma.aluguel.findMany({
            where: {
                status: 'INICIADO',
            },
            include: {
                jogo: true,
                cliente: true,
            },
        });
    }

    async aprovarAluguel(id_aluguel: number): Promise<any> {
        const aluguel = await this.prisma.aluguel.update({
            where: { id: id_aluguel },
            data: { status: 'RESERVADO' },
            include: {
                jogo: true,
                cliente: true,
            },
        });

        if (!aluguel) {
            return {
                success: false,
                message: 'Aluguel não encontrado.',
            };
        }

        this.enviar_email(
            aluguel.cliente.email,
            'Aprovação de Aluguel',
            `Oba! Seu pedido de aluguel foi aprovado com sucesso. Jogo: ${aluguel.jogo.nome}
            \n\nData/Hora de Início: ${aluguel.dataInicio}
            \nData/Hora de Fim: ${aluguel.dataFim}
            \n\nStatus: RESERVADO. Compareça na sala do CA no horário de início do aluguel!.
            `
        );

        return {
            success: true,
            message: 'Aluguel aprovado com sucesso.',
            aluguel: aluguel,
        };
    }

    async iniciarAluguel(id_aluguel: number): Promise<any> {
        const aluguel = await this.prisma.aluguel.update({
            where: { id: id_aluguel },
            data: { status: 'INICIADO' },
            include: {
                cliente: true,
            },
        });

        if (!aluguel) {
            return {
                success: false,
                message: 'Aluguel não encontrado.',
            };
        }

        const atualizarJogo = await this.prisma.jogo.update({
            where: { id: aluguel.jogoId },
            data: { status: 'ALUGADO' },
        });

        this.enviar_email(
            aluguel.cliente.email,
            'Início de Aluguel',
            `Seu aluguel foi iniciado com sucesso. Jogo: ${atualizarJogo.nome}
            \n\nData/Hora de Início: ${aluguel.dataInicio}
            \nData/Hora de Fim: ${aluguel.dataFim}
            \n\nStatus: INICIADO. Aproveite o jogo!
            \nLembre-se de devolver o jogo no horário combinado para evitar multas e bloqueios.
        `,);

        return {
            success: true,
            message: 'Aluguel iniciado com sucesso.',
            aluguel: aluguel,
            jogo: atualizarJogo,
        };
    }

    async finalizarAluguel(id_aluguel: number): Promise<any> {
        const aluguel = await this.prisma.aluguel.update({
            where: { id: id_aluguel },
            data: { status: 'FINALIZADO' },
            include: {
                jogo: true,
                cliente: true,
            },
        });

        if (!aluguel) {
            return {
                success: false,
                message: 'Aluguel não encontrado.',
            };
        }

        const atualizarJogo = await this.prisma.jogo.update({
            where: { id: aluguel.jogoId },
            data: { status: 'DISPONIVEL' },
        });

        this.enviar_email(
            aluguel.cliente.email,
            'Finalização de Aluguel',
            `Seu aluguel foi finalizado com sucesso. Jogo: ${atualizarJogo.nome}
            \n\nData/Hora de Início: ${aluguel.dataInicio}
            \nData/Hora de Fim: ${aluguel.dataFim}
            \n\nStatus: FINALIZADO. Obrigado por jogar!
            \nCaso tenha alguma dúvida ou sugestão, entre em contato conosco.
        `);

        return {
            success: true,
            message: 'Aluguel finalizado com sucesso.',
            aluguel: aluguel,
        };
    }

    async enviar_email(email: string, assunto: string, mensagem: string): Promise<any> {
        
        const transporter = nodemailer.createTransport({
            service: 'gmail', // ou outro serviço SMTP
            auth: {
                user: 'contatocacicufpb@gmail.com',
                pass: '@Pravda2021'
            }
        });

        const mailOptions = {
            from: 'contatocacicufpb@gmail.com',
            to: email,
            subject: assunto,
            text: mensagem,
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            return { success: true, info };
        } catch (error) {
            return { success: false, error };
        }
    }

    async removerAluguel(id_aluguel: number): Promise<any> {
        const aluguel = await this.prisma.aluguel.delete({
            where: { id: id_aluguel },
            include: {
                jogo: true,
                cliente: true,
            },
        });

        const cliente = await this.prisma.cliente.delete({
            where: { 
                id: aluguel.clienteId,
                bloqueado: false, // Garante que só deletamos clientes não bloqueados
            },
        });

        if (!aluguel) {
            return {
                success: false,
                message: 'Aluguel não encontrado.',
            };
        }

        return {
            success: true,
            message: 'Aluguel removido com sucesso.',
            aluguel: aluguel,
        };
    }

    async enviarEmailJogos(): Promise<any> {
        const agora = new Date();
        const daquiDuasHoras = new Date(agora.getTime() + 2 * 60 * 60 * 1000);

        // Pega todos os jogos disponíveis
        const jogosDisponiveis = await this.prisma.jogo.findMany({
            where: { status: 'DISPONIVEL' },
        });

        // Alugueis que CONFLITAM com as próximas 2 horas
        const alugueisConflitantes = await this.prisma.aluguel.findMany({
            where: {
                status: 'RESERVADO',
                AND: [
                    { dataInicio: { lt: daquiDuasHoras } },
                    { dataFim: { gt: agora } },
                ],
            },
            select: { jogoId: true },
        });

        const jogosIndisponiveisIds = alugueisConflitantes.map(a => a.jogoId);

        const jogosDisponiveisFiltrados = jogosDisponiveis.filter(
            jogo => !jogosIndisponiveisIds.includes(jogo.id)
        );

        if (jogosDisponiveisFiltrados.length === 0) {
            return {
                success: false,
                message: 'Nenhum jogo disponível nas próximas 2 horas.',
            };
        }

        const clientes = await this.prisma.cliente.findMany({
            where: { bloqueado: false },
        });

        if (clientes.length === 0) {
            return {
                success: false,
                message: 'Nenhum cliente cadastrado.',
            };
        }

        for (const cliente of clientes) {
            const mensagem = `
                Olá ${cliente.nome},

                Estes são os jogos disponíveis para as próximas 2 horas:

                ${jogosDisponiveisFiltrados.map(j => `- ${j.nome}`).join('\n')}

                Aproveite para fazer sua reserva agora!
            `;

            // Dispara o e-mail de forma assíncrona
            await this.enviar_email(cliente.email, 'Jogos Disponíveis', mensagem)
                .catch(err => console.error(`Erro ao enviar e-mail para ${cliente.email}:`, err));
        }

        return {
            success: true,
            message: 'E-mails enviados para todos os clientes com jogos disponíveis.',
        };
    }

    async bloquearCliente(id: number, motivo: string): Promise<any> {
        const cliente = await this.prisma.cliente.update({
            where: { id: id },
            data: {
                bloqueado: true,
                motivoBloqueio: motivo,
                dataBloqueio: new Date(),
            },
        });

        if (!cliente) {
            return {
                success: false,
                message: 'Cliente não encontrado.',
            };
        }

        this.enviar_email(
            cliente.email,
            'Bloqueio de Conta',
            `Sua conta foi bloqueada por motivo de: ${motivo}
            \nData do Bloqueio: ${cliente.dataBloqueio}
            \nVocê não poderá alugar jogos até que a situação seja resolvida.
            \nPor favor, não tente realizar novos aluguéis até então.
            \n\nSe você acredita que isso foi um erro, entre em contato conosco para mais
            \nPara mais informações, entre em contato conosco.
            `
        );

        return {
            success: true,
            message: 'Cliente bloqueado com sucesso.',
            cliente: cliente,
        };
    }

    async desbloquearCliente(id: number): Promise<any> {
        const cliente = await this.prisma.cliente.update({
            where: { id: id },
            data: {
                bloqueado: false,
                motivoBloqueio: null,
                dataBloqueio: null,
            },
        });

        if (!cliente) {
            return {
                success: false,
                message: 'Cliente não encontrado.',
            };
        }

        this.enviar_email(
            cliente.email,
            'Desbloqueio de Conta',
            `Sua conta foi desbloqueada com sucesso.
            \nVocê já pode alugar jogos novamente.
            \n\nObrigado por sua compreensão e paciência.
            `
        );

        return {
            success: true,
            message: 'Cliente desbloqueado com sucesso.',
            cliente: cliente,
        };
    }
}
