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
        @Body('horaInicio') horaInicio: number,
        @Body('horaFim') horaFim: number
    ) {
        return this.aluguelService.requisitarAluguel(Number(id_jogo), cliente, horaInicio, horaFim);
    }

    @Get("/colunas")
    async obterColunas() {
        return [
            { column: 'id', type: 'number'},
            { column: 'jogoId', type:'number'},
            { column: 'clienteId', type: 'number' },
            { column: 'horaInicio', type: 'number' },
            { column: 'horaFim', type: 'number' },
            { column: 'status', type: 'enum', options: ['PENDENTE_APROVACAO', 'RESERVADO', 'INICIADO', 'FINALIZADO', 'CANCELADO'] }
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
    
    @Get("/consultar/:id")
    async consultarAluguel(@Param('id') id: number) {
        return this.aluguelService.consultarAluguel(Number(id));
    }

    @Get("/clientes/consultar/:id_cliente")
    async consultarCliente(@Param('id_cliente') id_cliente: number) {
        return this.aluguelService.consultarCliente(Number(id_cliente));
    }
    
    @Patch("/atualizar/:id")
    async atualizarAluguel(
        @Param('id') id: number,
        @Body() aluguel: { jogoId?: number; clienteId?: number; horaInicio?: number; horaFim?: number; status?: string }
    ) {
        return this.aluguelService.atualizarAluguel(Number(id), aluguel);
    }

    @Patch("/clientes/atualizar/:id_cliente")
    async atualizarCliente(
        @Param('id_cliente') id_cliente: number,
        @Body() cliente: { cpf?: string; nome?: string; email?: string; contato?: string; bloqueado?: boolean; motivoBloqueio?: string; dataBloqueio?: Date }
    ) {
        return this.aluguelService.atualizarCliente(Number(id_cliente), cliente);
    }

    @Get("/listar")
    async listarAlugueis() {
        return this.aluguelService.listar();
    }

    @Get("/clientes/listar")
    async listarClientes() {
        return this.aluguelService.listarClientes();
    }

    @Delete("/deletar")
    async removerTodosAlugueis() {
        // Remove todos os aluguéis
        return this.aluguelService.removerTodosAlugueis();
    }

    @Delete("/deletar/:id_aluguel")
    async removerAluguel(@Param('id_aluguel') id_aluguel: number) {
        return this.aluguelService.removerAluguel(Number(id_aluguel));
    }

    @Delete("/clientes/deletar")
    async removerTodosClientes() {
        // Remove todos os clientes
        return this.aluguelService.removerTodosClientes();
    }

    @Delete("/clientes/deletar/:id_cliente")
    async removerCliente(@Param('id_cliente') id_cliente: number) {
        return this.aluguelService.removerCliente(Number(id_cliente));
    }


    @Get("/enviarEmailJogos")
    async enviarEmailJogos() {
        // Envia e-mails a todos os clientes anunciando os jogos disponíveis
        return this.aluguelService.enviarEmailJogos();
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

    @Get("/agendarAtivacaoServicoJogos/:hora")
    async agendarAtivacaoServicoJogos(@Param('hora') hora: string)
    {
        // Agenda a ativação do serviço de jogos para uma hora específica
        return this.aluguelService.agendarAtivacaoServicoJogos(hora);
    }

    @Get("/ativarServicoJogos")
    async ativarServicoJogos() {
        // Ativa o serviço de jogos
        return this.aluguelService.ativarServicoJogosAgora();
    }

    @Get("/buscar/:filtro/:parametro/:tipo")
    async buscarAlugueis(
        @Param('filtro') filtro: string,
        @Param('parametro') parametro: string | number,
        @Param('tipo') tipo: string
    ) {
        if(tipo == 'number'){
            parametro = Number(parametro);
        }
        
        return this.aluguelService.buscarAlugueis(filtro, parametro);
    }

    @Get("/clientes/:parametro")
    async buscarClientes(
        @Param('filtro') filtro: string,
        @Param('parametro') parametro: string | number
    ) {
        return this.aluguelService.buscarClientes(filtro, parametro);
    }

    @Get("/clientes/buscar/:filtro/:parametro/:tipo")
    async buscarClientesPorFiltro(
        @Param('filtro') filtro: string,
        @Param('parametro') parametro: string | number | Date,
        @Param('tipo') tipo: string
    ) {
        if(tipo == 'number'){
            parametro = Number(parametro);
        }
        if(tipo == 'date'){
            // Se o tipo for 'date', converte o parâmetro para uma data
            parametro = new Date(parametro as string);
        }
        
        return this.aluguelService.buscarClientesPorFiltro(filtro, parametro);
    }

    @Get("/servicoAtivo")
    async isServicoAtivo() {
        // Verifica se o serviço de jogos está ativo
        return this.aluguelService.servicoAtivo();
    }

    @Get("/horariosHoje")
    async horariosHoje() {
        // Retorna os horários disponíveis para hoje
        return this.aluguelService.horariosHoje();
    }
}
