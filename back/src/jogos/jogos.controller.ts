import { Controller } from '@nestjs/common';
import { JogosService, Jogo, Cliente } from './jogos.service';
import { Get, Post, Param, Delete, Body, Patch } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';


@Controller('jogos')
export class JogosController {
    constructor(private readonly jogosService: JogosService) {}

    @Public()
    @Get("/listar")
    async listarJogos() {
        return this.jogosService.listar();
    }

    @Public()
    @Get("/colunas")
    async listarColunas() {
        return [
            { column: 'id', type: 'number' },
            { column: 'nome', type: 'string', maxLength: 150 },
            { column: 'precoPorHora', type: 'number' },
            { column: 'imagem', type: 'string' },
            { column: 'status', type: 'enum', options: ['DISPONIVEL', 'INDISPONIVEL', 'ALUGADO'] }
        ]
    }

    @Public()
    @Get("/consultar/:id")
    async consultarJogo(@Param('id') id: number) {
        return this.jogosService.consultar(Number(id));
    }

    @Post("/cadastrar")
    async cadastrarJogo(@Body() jogo: Jogo) {
        return this.jogosService.cadastrar(jogo);
    }

    @Patch("/atualizar/:id")
    async atualizarJogo(@Param('id') id: number, @Body() jogo: Jogo) {
        return this.jogosService.atualizar(Number(id), jogo);
    }

    @Delete("/deletar/:id")
    async deletarJogo(@Param('id') id: number) {
        return this.jogosService.deletar(Number(id));
    }

    @Public()
    @Get("/buscar/:nome")
    async buscarJogoPorNome(@Param('nome') nome: string) {
        return this.jogosService.buscarPorNome(nome);
    }

    @Get("/indisponibilizar/:id")
    async indisponibilizarJogo(@Param('id') id: number) {
        return this.jogosService.indisponibilizar(Number(id));
    }

    @Get("/disponibilizar/:id")
    async disponibilizarJogo(@Param('id') id: number) {
        return this.jogosService.disponibilizar(Number(id));
    }

}
