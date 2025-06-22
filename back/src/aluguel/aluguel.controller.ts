import { Controller } from '@nestjs/common';
import { AluguelService } from './aluguel.service';
import { Get, Post, Delete, Patch, Param, Body } from '@nestjs/common';
import { Cliente } from 'src/jogos/jogos.service';
import { Public } from '../auth/decorators/public.decorator';

@Controller('aluguel')
export class AluguelController {
    constructor(private readonly aluguelService: AluguelService) {}
    
    @Public()
    @Post("/requisitar/:id_jogo")
    async requisitarAluguel(
        @Param('id_jogo') id_jogo: number,
        @Body() cliente: Cliente,
        @Body('horaInicio') horaInicio: Date,
        @Body('horaFim') horaFim: Date
    ) {
        return this.aluguelService.requisitarAluguel(id_jogo, cliente, horaInicio, horaFim);
    }

    @Get("/listar")
    async listarAlugueis() {
        return this.aluguelService.listar();
    }

    @Get("/listarPendentes")
    async listarPendentes() {
        return this.aluguelService.listarPendentes();
    }

    @Get("/listarReservados")
    async listarReservados() {
        return this.aluguelService.listarReservados();
    }

    @Get("/listarAlugados")
    async listarAlugados() {
        return this.aluguelService.listarAlugados();
    }

    @Get("/aprovar/:id_aluguel")
    async aprovarAluguel(@Param('id_aluguel') id_aluguel: number) {
        return this.aluguelService.aprovarAluguel(id_aluguel);
    }

    @Get("/iniciar/:id_aluguel")
    async iniciarAluguel(@Param('id_aluguel') id_aluguel: number) {
        return this.aluguelService.iniciarAluguel(id_aluguel);
    }

    @Get("/finalizar/:id_aluguel")
    async finalizarAluguel(@Param('id_aluguel') id_aluguel: number) {
        return this.aluguelService.finalizarAluguel(id_aluguel);
    }

    @Delete("/deletar/:id_aluguel")
    async removerAluguel(@Param('id_aluguel') id_aluguel: number) {
        return this.aluguelService.removerAluguel(id_aluguel);
    }

    @Get("/enviarEmailJogos")
    async enviarEmailJogos() {
        // Envia e-mails a todos os clientes anunciando os jogos disponíveis
        return this.aluguelService.enviarEmailJogos();
    }

    @Post("/bloquearCliente")
    async bloquearCliente(@Body('block') block: {clienteId: number, motivo: string}) {
        // Bloqueia um cliente pelo ID e motivo
        return this.aluguelService.bloquearCliente(block.clienteId, block.motivo);
    }

    @Get("/desbloquearCliente/:id_cliente")
    async desbloquearCliente(@Param('id_cliente') id_cliente: number) {
        // Desbloqueia um cliente pelo ID
        return this.aluguelService.desbloquearCliente(id_cliente);
    }
}
