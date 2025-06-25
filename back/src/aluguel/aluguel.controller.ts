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

    @Get("/colunas")
    async obterColunas() {
        return [
            { column: 'id', type: 'number'},
            { column: 'jogoId', type:'number'},
            { column: 'clienteId', type: 'number' },
            { column: 'horaInicio', type: 'date' },
            { column: 'horaFim', type: 'date' },
            { column: 'status', type: 'enum', options: ['PENDENTE_APROVACAO', 'RESERVADO', 'INICIADO', 'FINALIZADO'] }
        ];
    }

    @Get("/clientes/colunas")
    async obterColunasCliente() {
        return [
            { column: 'id', type: 'number' },
            { column: 'cpf', type: 'string', maxLength: 15 },
            { column: 'nome', type: 'string', maxLength: 150 },
            { column: 'email', type: 'string', maxLength: 150 },
            { column: 'contato', type: 'string', maxLength: 20 },
            { column: 'bloqueado', type: 'boolean', nullable: true, default: false },
            { column: 'motivoBloqueio', type: 'string', maxLength: 500, nullable: true, default: '' },
            { column: 'dataBloqueio', type: 'date', nullable: true, default: null }
        ];
    }

    @Get("/clientes/consultar/:id_cliente")
    async consultarCliente(@Param('id_cliente') id_cliente: number) {
        return this.aluguelService.consultarCliente(id_cliente);
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

    @Get("/consultar/:id")
    async consultarAluguel(@Param('id') id: number) {
        return this.aluguelService.consultarAluguel(id);
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

    @Public()
    @Get("/testarEmail/:destino/:assunto/:mensagem")
    async testarEmail(
        @Param('destino') destino: string,
        @Param('assunto') assunto: string,
        @Param('mensagem') mensagem: string
    ) {
        // Testa o envio de e-mail
        return this.aluguelService.enviar_email(destino, assunto, mensagem);
    }

    @Get("/desativarServicoJogos")
    async desativarServicoJogos() {
        // Desativa o serviço de jogos
        return this.aluguelService.desativarServicoJogosAgora();
    }

    @Get("/agendarDesativacaoServicoJogos/:hora")
    async agendarDesativacaoServicoJogos(@Param('hora') hora: string) {
        // Agenda a desativação do serviço de jogos para uma hora específica
        return this.aluguelService.agendarDesativacaoServicoJogos(hora);
    }

    @Get("/ativarServicoJogos")
    async ativarServicoJogos() {
        // Ativa o serviço de jogos
        return this.aluguelService.ativarServicoJogosAgora();
    }
}
