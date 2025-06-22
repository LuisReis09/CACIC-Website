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
