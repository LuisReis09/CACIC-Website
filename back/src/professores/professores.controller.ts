import { Controller } from '@nestjs/common';
import { ProfessoresService } from './professores.service';
import { Get, Post, Param, Delete } from '@nestjs/common';

@Controller('professores')
export class ProfessoresController {
    constructor(private readonly professoresService: ProfessoresService) {}

    @Get("/listar")
    async listar() {
        return this.professoresService.listar();
    }

    @Get("/inserir/:nome/:email/:sala/:departamento/:areasDeInteresse/:disciplinas/:linkedin")
    async inserir(
        @Param('nome') nome: string,
        @Param('email') email: string,
        @Param('sala') sala: string,
        @Param('departamento') departamento: string,
        @Param('areasDeInteresse') areasDeInteresse: string,
        @Param('disciplinas') disciplinas: string,
        @Param('linkedin') linkedin: string
    ) {
        return this.professoresService.inserir({
            nome,
            email,
            sala,
            departamento,
            areasDeInteresse,
            disciplinas,
            linkedin
        });
    }

    @Delete("/deletar/:id")
    async deletar(@Param('id') id: number) {
        return this.professoresService.deletar(Number(id));
    }
}
