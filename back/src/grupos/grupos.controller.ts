import { Controller } from '@nestjs/common';
import { GruposService } from './grupos.service';
import { Get, Post, Body, Delete, Param, Patch } from '@nestjs/common';

@Controller('grupos')
export class GruposController {
    constructor(private readonly gruposService: GruposService) {}

    @Get("/listar")
    async listar() {
        return this.gruposService.listar();
    }

    @Get("/colunas")
    async obterColunas() {
        return [
            { column: 'id', type: 'number' },
            { column: 'nome', type: 'string', maxLength: 150 },
            { column: 'link', type: 'string', maxLength: 200 },
            { column: 'descricao', type: 'string', maxLength: 500 },
            { column: 'imagem', type: 'string' }
        ];
    }

    @Get("/consultar/:id_grupo")
    async consultar(@Param('id_grupo') id_grupo: number) {
        return this.gruposService.consultar(id_grupo);
    }

    @Post("/cadastrar")
    async cadastrar(@Body() grupo: { nome: string; link: string; descricao: string; imagem: string }) {
        return this.gruposService.cadastrar(grupo);
    }

    @Delete("/deletar/:id_grupo")
    async deletar(@Param('id_grupo') id_grupo: number) {
        return this.gruposService.deletar(id_grupo);
    }

    @Patch("/atualizar/:id_grupo")
    async atualizar(@Param('id_grupo') id_grupo: number, @Body() grupo: { nome?: string; link?: string; descricao?: string; imagem?: string }) {
        return this.gruposService.atualizar(id_grupo, grupo);
    }
}
