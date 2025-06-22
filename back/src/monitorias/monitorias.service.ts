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
    professorId: number;
    status: string;
}


@Injectable()
export class MonitoriasService {
    private readonly email_cacic = process.env.CACIC_EMAIL;
    private readonly senha_cacic = process.env.CACIC_APP_PASSWORD;

    constructor(private prisma: PrismaService) {}

    async listar(){
        return this.prisma.monitoria.findMany({
            include: {
                professor: true,
            },
        });
    }

    async listarPendentes(){
        return this.prisma.monitoria.findMany({
            where: {
                status: 'PENDENTE',
            },
            include: {
                professor: true,
            },
        });
    }


    async listarAprovadas(){
        return this.prisma.monitoria.findMany({
            where: {
                status: 'APROVADA',
            },
            include: {
                professor: true,
            },
        });
    }

    async cadastrar(monitoria: Monitoria) {
        return this.prisma.monitoria.create({
            data: {
                monitores: monitoria.monitores,
                emailMonitor: monitoria.emailMonitor,
                disciplina: monitoria.disciplina,
                linkDiscord: monitoria.linkDiscord,
                linkWhatsapp: monitoria.linkWhatsapp,
                professorId: monitoria.professorId,
            },
        });
    }

    async atualizar(id: number, monitoria: Monitoria) {
        return this.prisma.monitoria.update({
            where: { id },
            data: {
                monitores: monitoria.monitores,
                emailMonitor: monitoria.emailMonitor,
                disciplina: monitoria.disciplina,
                linkDiscord: monitoria.linkDiscord,
                linkWhatsapp: monitoria.linkWhatsapp,
                professorId: monitoria.professorId,
            },
        });
    }

    async deletar(id: number) {
        return this.prisma.monitoria.delete({
            where: { id },
        });
    }

    async aprovar(id: number) {
        const monitoria = await this.prisma.monitoria.update({
            where: { id },
            data: {
                status: 'APROVADA',
            },
        });

        // Envia o e-mail de aprovação para o monitor:
        this.enviarEmail(
            monitoria.emailMonitor,
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

        return monitoria;
    }

    async reprovar(id: number, motivo: string) {
        // Deleta a monitoria do banco de dados:
        const deletada = await this.prisma.monitoria.delete({
            where: { id },
        });

        
        this.enviarEmail(
            deletada.emailMonitor,
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

        return deletada;
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
}
