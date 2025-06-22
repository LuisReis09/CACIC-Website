import { Controller } from '@nestjs/common';
import { JogosService, Jogo, Cliente } from './jogos.service';
import { Get, Post, Param, Delete, Body, Patch } from '@nestjs/common';


@Controller('jogos')
export class JogosController {
    constructor(private readonly jogosService: JogosService) {}

    @Get("/listar")
    async listarJogos() {
        return this.jogosService.listar();
    }

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

    @Get("/buscar/:nome")
    async buscarJogoPorNome(@Param('nome') nome: string) {
        return this.jogosService.buscarPorNome(nome);
    }

    @Post("/alugar/:id")
    async alugarJogo(
        @Param('id') id: number,
        @Body('cliente') cliente: Cliente, 
        @Body('horarios') horarios: {horaInicio: Date, horaFim: Date}
    ){
        return this.jogosService.alugar(Number(id), cliente, horarios.horaInicio, horarios.horaFim);
    }


}
