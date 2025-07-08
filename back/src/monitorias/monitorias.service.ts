import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();

interface Monitoria {
    id?: number;
    monitores: string;
    emailMonitor: string;
    disciplina: string;
    linkDiscord: string;
    linkWhatsapp: string;
    professor: string;
    status: string;
}


@Injectable()
export class MonitoriasService {
    private readonly email_cacic = process.env.CACIC_EMAIL;
    private readonly senha_cacic = process.env.CACIC_APP_PASSWORD;

    constructor(private prisma: PrismaService) {}

    async listar(){
        return await this.prisma.monitoria.findMany({});
    }

    async consultar(id_monitoria: number) {
        return await this.prisma.monitoria.findUnique({
            where: { id: id_monitoria }
        });
    }

    async listarPendentes(){
        return await this.prisma.monitoria.findMany({
            where: {
                status: 'PENDENTE',
            },
        });
    }


    async listarAprovadas(){
        return await this.prisma.monitoria.findMany({
            where: {
                status: 'APROVADA',
            },
            orderBy: {
                disciplina: 'asc', // Ordena as monitorias aprovadas por disciplina
            },
        });
    }

    async cadastrar(monitoria: Monitoria) {
        const monitorias = await this.prisma.monitoria.create({
            data: {
                monitores: monitoria.monitores,
                emailMonitor: monitoria.emailMonitor,
                disciplina: monitoria.disciplina,
                linkDiscord: monitoria.linkDiscord,
                linkWhatsapp: monitoria.linkWhatsapp,
                professor: monitoria.professor,
            },
        });

        // Envia o e-mail de confirmação de cadastro, para cada monitoria cadastrada:
        const emails = monitoria.emailMonitor.split(';').map(email => email.trim());
        for (const email of emails) {
            await this.enviarEmail(
                email,
                'Cadastro de Monitoria',
                `
                    <div style="max-width:700px; margin: auto; font-family: Arial, sans-serif; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
                        <h2 style="color: #000;">✅ Monitoria Cadastrada com Sucesso</h2>

                        <p style="font-size: 16px; color: #555;">
                            Olá,<br><br>
                            Sua monitoria foi cadastrada com sucesso! 🎉<br>
                            Em breve, nossa equipe irá analisar e aprovar sua solicitação.
                        </p>

                        <p style="font-size: 16px; color: #555;">
                            Atenciosamente,<br>
                            <b>Equipe do CACIC</b>
                        </p>

                        <p style="margin-top: 30px; font-size: 14px; color: #999;">
                            Este é um e-mail automático, não responda.
                        </p>
                    </div>
                `
            );
        }

        return monitorias;
    }

    async cadastrarVarios(monitorias: Monitoria[]) {
        // Cadastra várias monitorias de uma vez:
        const monitoriasCriadas = await this.prisma.monitoria.createMany({
            data: monitorias,
        });

        return monitoriasCriadas;
    }

    async atualizar(id: number, monitoria: Monitoria, motivoRejeicao?: string) {
        const monit = await this.prisma.monitoria.findUnique({
            where: { id },
        });

        const monit_atualizada = await this.prisma.monitoria.update({
            where: { id },
            data: {
                monitores:      monitoria.monitores,
                emailMonitor:   monitoria.emailMonitor,
                disciplina:     monitoria.disciplina,
                linkDiscord:    monitoria.linkDiscord,
                linkWhatsapp:   monitoria.linkWhatsapp,
                professor:    monitoria.professor,
                status:         monitoria.status, // Pode ser 'PENDENTE', 'APROVADA', etc.
            },
        });

        if(monit?.status === 'PENDENTE_APROVACAO' && monit_atualizada.status === 'APROVADA'){
            // Se a monitoria foi aprovada, envia o e-mail de aprovação:
            this.aprovar(monitoria.emailMonitor);
            
        }else if(monit?.status === 'PENDENTE_APROVACAO' && monit_atualizada.status === 'REPROVADA'){
            // Se a monitoria foi reprovada, envia o e-mail de reprovação:
            this.reprovar(monitoria.emailMonitor, motivoRejeicao || 'Motivo não especificado');
        }
    }

    async deletar(id: number) {
        return await this.prisma.monitoria.delete({
            where: { id },
        });
    }

    async deletarTodos() {
        // Deleta todas as monitorias do banco de dados:
        return await this.prisma.monitoria.deleteMany({});
    }

    async aprovar(email_monitor: string) {
        // Envia o e-mail de aprovação para o monitor:
        await this.enviarEmail(
            email_monitor,
            'Monitoria Aprovada',
            `
                <div style="max-width:700px; margin: auto; font-family: Arial, sans-serif; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
                    <h2 style="color: #000;">✅ Sua Monitoria foi <span style="color: #28a745;">Publicada</span> no Sistema</h2>

                    <p style="font-size: 16px; color: #555;">
                        Olá,<br><br>
                        Sua monitoria está <b>agora disponível no sistema</b>! 🎉<br>
                        Isso significa que os alunos já podem visualizar sua monitoria, acessando informações como os grupos de Discord e de WhatsApp (se cadastrados).
                    </p>

                    <div style="margin: 15px 0; background-color: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 6px; color: #155724;">
                        ✅ Continue acompanhando seus alunos e, se necessário, envie-nos um pedido de atualização dos dados.
                    </div>

                    <p style="font-size: 16px; color: #555;">
                        Desejamos uma ótima experiência como monitor(a)!<br><br>
                        Atenciosamente,<br>
                        <b>Equipe do CACIC</b>
                    </p>

                    <p style="margin-top: 30px; font-size: 14px; color: #999;">
                        Este é um e-mail automático, não responda.
                    </p>
                </div>
            `
        )
    }

    async reprovar(email_monitor: string, motivo: string) {

        
        await this.enviarEmail(
            email_monitor,
            'Monitoria Reprovada',
            `
                <div style="max-width:700px; margin: auto; font-family: Arial, sans-serif; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
                    <h2 style="color: #000;">❌ Monitoria <span style="color: #dc3545;">Reprovada</span></h2>

                    <p style="font-size: 16px; color: #555;">
                        Olá,<br><br>
                        Sua solicitação de <b>cadastro da monitoria foi reprovada</b> pelo seguinte motivo:
                    </p>

                    <div style="margin: 15px 0; background-color: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 6px; color: #721c24;">
                        <b>${motivo}</b>
                    </div>

                    <p style="font-size: 16px; color: #555;">
                        Caso tenha dúvidas ou queira mais informações, entre em contato conosco.<br><br>
                        Atenciosamente,<br>
                        <b>Equipe do CACIC</b>
                    </p>

                    <p style="margin-top: 30px; font-size: 14px; color: #999;">
                        Este é um e-mail automático, não responda.
                    </p>
                </div>
            `
        )
    }

    async enviarEmail(email_monitor: string, assunto: string, mensagem: string) {
        const transporter = nodemailer.createTransport({
            service: 'gmail', // ou outro serviço SMTP
            auth: {
                user: this.email_cacic,
                pass: this.senha_cacic
            }
        });

        const mailOptions = {
            from: this.email_cacic,
            to: email_monitor,
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

    async SAC(email_usuario: string, assunto: string, mensagem: string) {
        // Não necessariamente tem relação com monitorias, mas é uma funcionalidade do CACIC:

        const transporter = nodemailer.createTransport({
            service: 'gmail', // ou outro serviço SMTP
            auth: {
                user: this.email_cacic,
                pass: this.senha_cacic
            }
        });

        const mailOptions = {
            from: this.email_cacic,
            to: this.email_cacic, // Envia para o e-mail do CACIC
            replyTo: email_usuario, // Responde para o usuário que enviou
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

    async buscar(filtro: string, parametro: string | number) {
        // Busca monitorias com base em um filtro e parâmetro:
        const isString = typeof parametro === 'string';

        return await this.prisma.monitoria.findMany({
            where: {
                [filtro]: isString
                    ? {
                        contains: parametro,
                        mode: 'insensitive', // Ignora maiúsculas/minúsculas
                    }
                    : parametro, // Se não for string, assume que é um número e não aplica contains
            }
        });
    }
}
