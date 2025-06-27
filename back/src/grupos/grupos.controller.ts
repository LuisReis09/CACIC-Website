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

    @Get("/consultar/:id")
    async consultar(@Param('id') id: number) {
        return this.gruposService.consultar(Number(id));
    }

    @Post("/cadastrar")
    async cadastrar(@Body() grupo: { nome: string; link: string; descricao: string; imagem: string }) {
        console.log("Grupo recebido:", grupo);
        return this.gruposService.cadastrar(grupo);
    }

    @Delete("/deletar/:id")
    async deletar(@Param('id') id: number) {
        return this.gruposService.deletar(Number(id));
    }

    @Delete("/deletar")
    async deletarTodos() {
        return this.gruposService.deletarTodos();
    }

    @Patch("/atualizar/:id")
    async atualizar(@Param('id') id: number, @Body() grupo: { nome?: string; link?: string; descricao?: string; imagem?: string }) {
        return this.gruposService.atualizar(id, grupo);
    }

    @Get("/buscar/:filtro/:parametro/:tipo")
    async buscar(@Param('filtro') filtro: string, @Param('parametro') parametro: string | number, @Param('tipo') tipo: string) {
        if(tipo == 'number'){
            parametro = Number(parametro);
        }
        return this.gruposService.buscar(filtro, parametro);
    }
}
