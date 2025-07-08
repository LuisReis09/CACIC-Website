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
        return await this.jogosService.listar();
    }

    @Get("/colunas")
    async listarColunas() {
        return [
            { column: 'id', type: 'number' },
            { column: 'nome', type: 'string', maxLength: 150 },
            { column: 'precoPorHora', type: 'number' },
            { column: 'imagem', type: 'string' },
            { column: 'quantidade', type: 'number' },
            { column: 'status', type: 'enum', options: ['DISPONIVEL', 'INDISPONIVEL', 'ALUGADO'] }
        ]
    }

    @Public()
    @Get("/consultar/:id")
    async consultarJogo(@Param('id') id: number) {
        return await this.jogosService.consultar(Number(id));
    }

    @Post("/cadastrar")
    async cadastrarJogo(@Body() jogo: Jogo) {
        return await this.jogosService.cadastrar(jogo);
    }

    @Post("/cadastrarMuitos")
    async cadastrarVariosJogos(@Body() jogos: Jogo[]) {
        return await this.jogosService.cadastrarVarios(jogos);
    }

    @Patch("/atualizar/:id")
    async atualizarJogo(@Param('id') id: number, @Body() jogo: Jogo) {
        return await this.jogosService.atualizar(Number(id), jogo);
    }

    @Delete("/deletar/:id")
    async deletarJogo(@Param('id') id: number) {
        return await this.jogosService.deletar(Number(id));
    }

    @Delete("/deletar")
    async deletarTodosJogos() {
        return await this.jogosService.deletarTodos();
    }

    @Public()
    @Get("/buscar/:filtro/:parametro/:tipo")
    async buscarJogoPorNome(@Param('filtro') filtro: string, @Param('parametro') parametro: string | number, @Param('tipo') tipo: string) {
        if(tipo == 'number'){
            parametro = Number(parametro);
        }
        return await this.jogosService.buscar(filtro, parametro);
    }

    @Get("/indisponibilizar/:id")
    async indisponibilizarJogo(@Param('id') id: number) {
        return await this.jogosService.indisponibilizar(Number(id));
    }

    @Get("/disponibilizar/:id")
    async disponibilizarJogo(@Param('id') id: number) {
        return await this.jogosService.disponibilizar(Number(id));
    }

}
