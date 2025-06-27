import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class LaboratoriosService {
    constructor(private readonly prisma: PrismaService) {}

    async listar(){
        return await this.prisma.laboratorio.findMany({});
    }

    async cadatrar(laboratorio: any){
        return await this.prisma.laboratorio.create({
            data: laboratorio
        });
    }

    async atualizar(id: number, laboratorio: any){
        return await this.prisma.laboratorio.update({
            where: { id },
            data: laboratorio
        });
    }

    async consultar(id: number){
        return await this.prisma.laboratorio.findUnique({
            where: { id }
        });
    }

    async deletar(id: number){
        return await this.prisma.laboratorio.delete({
            where: { id }
        });
    }

    async bucar(filtro: string, parametro: string | number) {
        const isString = typeof parametro === 'string';

        return await this.prisma.laboratorio.findMany({
            where: {
                [filtro]: isString ? { contains: parametro, mode: 'insensitive' } : parametro
            }
        });
    }

    async deletar(id: number) {
        return await this.prisma.laboratorio.delete({
            where: { id }
        });
    }

    async deletarTodos(){
        return await this.prisma.laboratorio.deleteMany({});
    }

    async cadastrarMuitos(laboratorios: any[]) {
        return await this.prisma.laboratorio.createMany({
            data: laboratorios
        });
    }
}
