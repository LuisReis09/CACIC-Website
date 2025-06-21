import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

interface Professor{
    nome: string;
    email: string;
    sala: string;
    departamento: string;
    areasDeInteresse: string;
    disciplinas: string;
    linkedin: string;
    imagem?: string | null;
}

@Injectable()
export class ProfessoresService {

    constructor(private readonly prisma: PrismaService) {}
    
    async listar(){
        return this.prisma.professor.findMany({
            include: {
                feedbacks: true
            },
        });
    }

    async inserir(professor: Professor) {
        return this.prisma.professor.create({
            data: {
                nome: professor.nome,
                email: professor.email,
                sala: professor.sala,
                departamento: professor.departamento,
                areasDeInteresse: professor.areasDeInteresse,
                disciplinas: professor.disciplinas,
                linkedin: professor.linkedin,
                imagem: professor.imagem || ""
            }
        });
    }

    async deletar(id: number) {
        return this.prisma.professor.delete({
            where: {
                id: id
            }
        });
    }

    


}
