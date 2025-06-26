import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Cliente, Jogo, StatusAluguel } from 'src/jogos/jogos.service';
import { JogosController } from 'src/jogos/jogos.controller';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();

export interface Aluguel {
    jogoId: number;
    clienteId: number;
    horaInicio: number;
    horaFim: number;
}

@Injectable()
export class AluguelService {
    constructor(private readonly prisma: PrismaService) {}

    private readonly email_cacic = process.env.CACIC_EMAIL;
    private readonly senha_cacic = process.env.CACIC_APP_PASSWORD;
    private readonly logger = new Logger(AluguelService.name);

    private hora_desativacao: string = '17:00:00'; // 17h
    private hora_ativacao: string = '08:00:00'; // 8h

    async requisitarAluguel(
        id_jogo: number,
        cliente: Cliente,
        horaInicio: number,
        horaFim: number
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
                horaInicio: {
                    lte: horaFim,
                },
                horaFim: {
                    gte: horaInicio,
                },
            },
        });

        if (conflitos.length > 0) {
            return {
                success: false,
                message: 'Jogo já está alugado nesse período.',
                conflitos: conflitos.map((a) => ({
                    de: a.horaInicio,
                    ate: a.horaFim,
                })),
            };
        }

        // Cria o aluguel
        const aluguel = await this.prisma.aluguel.create({
            data: {
                jogoId: id_jogo,
                clienteId: clienteExistente.id,
                horaInicio: horaInicio,
                horaFim: horaFim,
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
            `
                <div style="max-width:700px; margin: auto; font-family: Arial, sans-serif; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
                    <h2 style="color: #000;">✅ Pedido de Aluguel Realizado com Sucesso!</h2>

                    <p style="font-size: 16px; color: #555;">
                    <strong>🎮 Jogo:</strong> <span style="color: #222;">${aluguel.jogo.nome}</span><br>
                    <strong>📅 Data/Hora de Início:</strong> ${aluguel.horaInicio}<br>
                    <strong>📅 Data/Hora de Fim:</strong> ${aluguel.horaFim}<br>
                    <strong>🔖 Status:</strong> <b style="color: #FF3000;">PENDENTE DE APROVAÇÃO</b>
                    </p>

                    <div style="margin-top: 20px; background-color: #fff3cd; border: 1px solid #ffeeba; padding: 15px; border-radius: 6px; color: #000">
                        ⏳ Aguarde a aprovação do administrador para confirmar seu aluguel, estamos analisando a disponibilidade dos membros do Centro Acadêmico.
                    </div>

                    <p style="margin-top: 20px; font-size: 15px; color: #333;">
                        <strong>Importante:</strong> Caso a reserva seja aprovada, você receberá o Qr Code para pagamento via PIX, que deve ser apresentado na sala do Centro Acadêmico no horário de início do aluguel.
                    </p>

                    <p style="margin-top: 30px; font-size: 14px; color: #999;">
                    Este é um e-mail automático, não responda.
                    </p>
                </div>
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

    async listarClientes(): Promise<any> {
        return this.prisma.cliente.findMany({});
    }

    async atualizarAluguel(
        id: number,
        aluguel: { jogoId?: number; clienteId?: number; horaInicio?: number; horaFim?: number; status?: string }
    ): Promise<any> {
        const aluguelAtualizado = await this.prisma.aluguel.update({
            where: { id: id },
            data: aluguel as any,
            include: {
                jogo: true,
                cliente: true,
            },
        });

        if (!aluguelAtualizado) {
            return {
                success: false,
                message: 'Aluguel não encontrado.',
            };
        }

        switch (aluguelAtualizado.status) {
            case StatusAluguel.RESERVADO:
                this.aprovarAluguel(
                    aluguelAtualizado.cliente.email,
                    aluguelAtualizado.jogo.nome,
                    aluguelAtualizado.horaInicio.toISOString(),
                    aluguelAtualizado.horaFim.toISOString(),
                    String(aluguelAtualizado.jogo.precoPorHora.toFixed(2))
                );
                break;
            case StatusAluguel.INICIADO:
                this.iniciarAluguel(
                    aluguelAtualizado.cliente.email,
                    aluguelAtualizado.jogo.nome,
                    aluguelAtualizado.horaInicio.toISOString(),
                    aluguelAtualizado.horaFim.toISOString()
                );
                break;
            case StatusAluguel.FINALIZADO:
                this.finalizarAluguel(
                    aluguelAtualizado.cliente.email,
                    aluguelAtualizado.jogo.nome,
                    aluguelAtualizado.horaInicio.toISOString(),
                    aluguelAtualizado.horaFim.toISOString()
                );
                break;
        }

        return {
            success: true,
            message: 'Aluguel atualizado com sucesso.',
            aluguel: aluguelAtualizado,
        };
    }

    async atualizarCliente(
        id: number,
        cliente: { cpf?: string; nome?: string; email?: string; contato?: string; bloqueado?: boolean; motivoBloqueio?: string; dataBloqueio?: Date }
    ): Promise<any> {
        const Cliente = await this.prisma.cliente.findFirst({
            where: { id: id },
        });

        if (!Cliente) {
            return {
                success: false,
                message: 'Cliente não encontrado.',
            };
        }

        const clienteAtualizado = await this.prisma.cliente.update({
            where: { id: id },
            data: cliente as any,
        });

        // Verifica se o cliente foi bloqueado ou desbloqueado
        if(Cliente.bloqueado && !cliente.bloqueado) {
            this.desbloquearCliente(clienteAtualizado.email);
        }
        if(!Cliente.bloqueado && cliente.bloqueado && cliente.motivoBloqueio && cliente.dataBloqueio) {
            this.bloquearCliente(clienteAtualizado.email, cliente.motivoBloqueio, cliente.dataBloqueio.toISOString());
        }
    }

    async removerCliente(id: number): Promise<any> {
        const cliente = await this.prisma.cliente.delete({
            where: { id: id },
        });

        if (!cliente) {
            return {
                success: false,
                message: 'Cliente não encontrado.',
            };
        }

        return {
            success: true,
            message: 'Cliente removido com sucesso.',
            cliente: cliente,
        };
    }

    async consultarAluguel(id_aluguel: number): Promise<any> {
        const aluguel = await this.prisma.aluguel.findUnique({
            where: { id: id_aluguel }
        });
    }

    async consultarCliente(id_cliente: number): Promise<any> {
        const cliente = await this.prisma.cliente.findUnique({
            where: { id: id_cliente },
        });

        if (!cliente) {
            return {
                success: false,
                message: 'Cliente não encontrado.',
            };
        }

        return {
            success: true,
            cliente: cliente,
        };
    }

    async aprovarAluguel(email_cliente: string, nome_jogo: string, hora_inicio: string, hora_fim: string, preco_aluguel: string): Promise<any> {
        this.enviar_email(
            email_cliente,
            'Aprovação de Aluguel',
            `
                <div style="max-width:700px; margin: auto; font-family: Arial, sans-serif; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
                    <h2 style="color: #000;">🎉 Oba! Seu pedido de Aluguel foi <span style="color: #28a745;">Aprovado</span> com Sucesso!</h2>

                    <p style="font-size: 16px; color: #555;">
                        <strong>🎮 Jogo:</strong> <span style="color: #222;"> ${nome_jogo}</span><br>
                        <strong>📅 Data/Hora de Início:</strong> ${hora_inicio} <br>
                        <strong>📅 Data/Hora de Fim:</strong> ${hora_fim}<br>
                        <strong>🔖 Status:</strong> <b style="color: #28a745;">RESERVADO</b>
                    </p>

                    <div style="margin-top: 20px; background-color: #d1ecf1; border: 1px solid #bee5eb; padding: 15px; border-radius: 6px; color: #0c5460;">
                        📍 Compareça na sala do CA no horário de início do aluguel para utilizar seu jogo!
                    </div>

                    <p style="margin-top: 20px; font-size: 15px; color: #333;">
                        <strong>Importante:</strong> Para confirmar a reserva, por favor, apresente o comprovante do pagamento via PIX ao retirar o jogo na sala do Centro Acadêmico.
                        Para a retirada, apresente-se na sala do CA entre ${Number(hora_inicio)-1}:55 e ${hora_inicio}:05.
                    </p>

                    <p style="margin-top: 30px; font-size: 14px; color: #999;">
                        Este é um e-mail automático, não responda.
                    </p>
                </div>
            `
        );
    }

    async iniciarAluguel(
        email_cliente: string,
        nome_jogo: string,
        hora_inicio: string,
        hora_fim: string,
    ): Promise<any> {
        this.enviar_email(
            email_cliente,
            'Início de Aluguel',
            `
                <div style="max-width:700px; margin: auto; font-family: Arial, sans-serif; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
                    <h2 style="color: #000;">🚀 Seu Aluguel foi <span style="color: #007bff;">Iniciado</span> com Sucesso!</h2>

                    <p style="font-size: 16px; color: #555;">
                        <strong>🎮 Jogo:</strong> <span style="color: #222;">${nome_jogo}</span><br>
                        <strong>📅 Data/Hora de Início:</strong> ${hora_inicio}<br>
                        <strong>📅 Data/Hora de Fim:</strong> ${hora_fim}<br>
                        <strong>🔖 Status:</strong> <b style="color: #007bff;">INICIADO</b>
                    </p>

                    <div style="margin-top: 20px; background-color: #cce5ff; border: 1px solid #b8daff; padding: 15px; border-radius: 6px; color: #004085;">
                        🎮 Aproveite seu jogo!<br>
                        ⏰ <strong>Lembre-se:</strong> devolva o jogo no horário combinado para evitar multas e bloqueios. <br>
                        Para a devolução, apresente-se na sala do CA entre ${Number(hora_fim)-1}:55 e ${hora_fim}:05.
                    </div>

                    <p style="margin-top: 30px; font-size: 14px; color: #999;">
                        Este é um e-mail automático, não responda.
                    </p>
                </div>
            `
        );
    }

    async finalizarAluguel(
        email_cliente: string,
        nome_jogo: string,
        hora_inicio: string,
        hora_fim: string,
    ): Promise<any> {
        this.enviar_email(
            email_cliente,
            'Finalização de Aluguel',
            `
                <div style="max-width:700px; margin: auto; font-family: Arial, sans-serif; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
                    <h2 style="color: #000;">🏁 Seu Aluguel foi <span style="color: #6c757d;">Finalizado</span> com Sucesso!</h2>

                    <p style="font-size: 16px; color: #555;">
                        <strong>🎮 Jogo:</strong> <span style="color: #222;">${nome_jogo}</span><br>
                        <strong>📅 Data/Hora de Início:</strong> ${hora_inicio}<br>
                        <strong>📅 Data/Hora de Fim:</strong> ${hora_fim}<br>
                        <strong>🔖 Status:</strong> <b style="color: #6c757d;">FINALIZADO</b>
                    </p>

                    <div style="margin-top: 20px; background-color: #e2e3e5; border: 1px solid #d6d8db; padding: 15px; border-radius: 6px; color: #383d41;">
                        ✅ Obrigado por jogar!<br>
                        💬 Caso tenha alguma dúvida ou sugestão, entre em contato conosco.
                    </div>

                    <p style="margin-top: 30px; font-size: 14px; color: #999;">
                        Este é um e-mail automático, não responda.
                    </p>
                </div>
        `);
    }

    async enviar_email(email: string, assunto: string, mensagem: string): Promise<any> {
        
        const transporter = nodemailer.createTransport({
            service: 'gmail', // ou outro serviço SMTP
            auth: {
                user: this.email_cacic,
                pass: this.senha_cacic
            }
        });

        const mailOptions = {
            from: this.email_cacic,
            to: email,
            subject: assunto,
            html: mensagem,
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
                    { horaInicio: { lt: daquiDuasHoras } },
                    { horaFim: { gt: agora } },
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

        // Monta tabela de jogos
        const tabelaJogos = `
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr>
                        <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2; text-align: left;">🎮 Jogo</th>
                        <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2; text-align: left;">💰 Preço por Hora</th>
                    </tr>
                </thead>
                <tbody>
                    ${jogosDisponiveisFiltrados.map(jogo => `
                        <tr>
                            <td style="border: 1px solid #ddd; padding: 8px;">${jogo.nome}</td>
                            <td style="border: 1px solid #ddd; padding: 8px;">R$ ${jogo.precoPorHora.toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        for (const cliente of clientes) {
            const mensagem = `
                <div style="max-width:700px; margin: auto; font-family: Arial, sans-serif; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
                    <h2 style="color: #000;">🎯 Jogos Disponíveis nas Próximas 2 Horas</h2>

                    <p style="font-size: 16px; color: #555;">
                        Olá ${cliente.nome},<br><br>
                        Confira abaixo os jogos disponíveis:
                    </p>

                    ${tabelaJogos}

                    <div style="margin-top: 20px; background-color: #d1ecf1; border: 1px solid #bee5eb; padding: 15px; border-radius: 6px; color: #0c5460;">
                        ⚡ Aproveite para fazer sua reserva agora antes que alguém alugue!
                    </div>

                    <p style="margin-top: 30px; font-size: 14px; color: #999;">
                        Este é um e-mail automático, não responda.
                    </p>
                </div>
            `;

            await this.enviar_email(cliente.email, '🎮 Jogos Disponíveis nas próximas 2 horas!', mensagem)
                .catch(err => console.error(`Erro ao enviar e-mail para ${cliente.email}:`, err));
        }

        return {
            success: true,
            message: 'E-mails enviados para todos os clientes com jogos disponíveis.',
        };
    }

    async bloquearCliente(cliente_email: string, motivo: string, data_bloqueio: string): Promise<any> {

        this.enviar_email(
            cliente_email,
            'Bloqueio de Conta',
            `
                <div style="max-width:700px; margin: auto; font-family: Arial, sans-serif; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
                    <h2 style="color: #000;">🚫 Sua Conta foi <span style="color: #dc3545;">Bloqueada</span></h2>

                    <p style="font-size: 16px; color: #555;">
                        <strong>🛑 Motivo:</strong> <span style="color: #222;">${motivo}</span><br>
                        <strong>📅 Data do Bloqueio:</strong> ${data_bloqueio}<br><br>
                        ❌ <b style="color: #dc3545;">Você não poderá alugar jogos até que a situação seja resolvida.</b><br>
                        🚫 Por favor, <b>não tente realizar novos aluguéis</b> até que o bloqueio seja removido.
                    </p>

                    <div style="margin-top: 20px; background-color: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 6px; color: #721c24;">
                        ⚠️ Se você acredita que isso foi um erro, ou deseja resolver sua situação, <b>entre em contato conosco</b> para mais informações.
                    </div>

                    <p style="margin-top: 30px; font-size: 14px; color: #999;">
                        Este é um e-mail automático, não responda.
                    </p>
                </div>
            `
        );
    }

    async desbloquearCliente(
        email_cliente: string,
    ): Promise<any> {

        this.enviar_email(
            email_cliente,
            'Desbloqueio de Conta',
            `
                <div style="max-width:700px; margin: auto; font-family: Arial, sans-serif; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
                    <h2 style="color: #000;">🔓 Sua Conta foi <span style="color: #28a745;">Desbloqueada</span> com Sucesso!</h2>

                    <p style="font-size: 16px; color: #555;">
                        ✅ Você já pode <b>alugar jogos novamente</b> normalmente.<br><br>
                        🙌 Obrigado por sua compreensão e paciência.
                    </p>

                    <div style="margin-top: 20px; background-color: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 6px; color: #155724;">
                        🎉 Aproveite os jogos disponíveis e boas partidas!
                    </div>

                    <p style="margin-top: 30px; font-size: 14px; color: #999;">
                        Este é um e-mail automático, não responda.
                    </p>
                </div>
            `
        );
    }

    async ativarServicoJogosAgora(): Promise<any> {
        return this.prisma.admin.update({
            where: { id: 1 }, // Só existe um admin
            data: { servicoJogosAtivo: true },
        }).then(() => {
            return { success: true, message: 'Serviço de Jogos ativado com sucesso.' };
        }).catch((error) => {
            return { success: false, message: 'Erro ao ativar o serviço de Jogos.', error };
        });
    }

    @Cron('0 17 * * * *')
    async redefinirVariavel(): Promise<void> {
        this.hora_desativacao = '17:00:00';
        this.hora_ativacao = '08:00:00';
    }

    @Cron(CronExpression.EVERY_HOUR)
    async verificarServicoJogos(): Promise<void> {
        const agora = new Date();
        const horaAtual = agora.getHours();

        const horaDesativar = parseInt(this.hora_desativacao.split(':')[0]);
        const horaAtivar    = parseInt(this.hora_ativacao.split(':')[0]);

        if(horaAtual == horaAtivar) {
            await this.prisma.admin.updateMany({
                data: { servicoJogosAtivo: true },
            });
            this.logger.log('Serviço de Jogos ativado às 8h.');
        }

        if (horaAtual === horaDesativar) {
            await this.prisma.admin.updateMany({
                data: { servicoJogosAtivo: false },
            });
        }
    }

    async agendarDesativacaoServicoJogos(hora: string): Promise<void> {
        this.hora_desativacao = hora;
    }

    async agendarAtivacaoServicoJogos(hora: string): Promise<void> {
        this.hora_ativacao = hora;
    }

    async desativarServicoJogosAgora(): Promise<any> {
        await this.prisma.admin.updateMany({
            data: { servicoJogosAtivo: false },
        });
    }

    @Cron('0 0 12 * * 5')
    async desativarServicoJogosSexta(): Promise<void> {
        const hoje = new Date();
        if (hoje.getDay() === 5) {
            await this.prisma.admin.updateMany({
                data: { servicoJogosAtivo: false },
            });
            this.logger.log('Serviço de Jogos desativado às 12h na sexta-feira.');
        }
    }

    async verificarServicoJogosAtivo(): Promise<boolean> {
        const admin = await this.prisma.admin.findUnique({
            where: { id: 1 }, // Só existe um admin
            select: { servicoJogosAtivo: true },
        });

        return admin ? admin.servicoJogosAtivo : false;
    }

    async removerTodosAlugueis(): Promise<any> {
        return await this.prisma.aluguel.deleteMany({});
    }

    async removerTodosClientes(): Promise<any> {
        return await this.prisma.cliente.deleteMany({});
    }

    async buscarAlugueis(filtro: string, parametro: string): Promise<any> {
        return await this.prisma.aluguel.findMany({
            where: {
                [filtro]: {
                    contains: parametro,
                    mode: 'insensitive', // Ignora maiúsculas/minúsculas
                },
            },
        });
    }

    async buscarClientes(filtro: string, parametro: string): Promise<any> {
        return await this.prisma.cliente.findMany({
            where: {
                [filtro]: {
                    contains: parametro,
                    mode: 'insensitive', // Ignora maiúsculas/minúsculas
                },
            },
        });
    }
}
