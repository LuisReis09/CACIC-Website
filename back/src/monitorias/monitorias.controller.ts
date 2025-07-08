import { Controller } from '@nestjs/common';
import { MonitoriasService } from './monitorias.service';
import { Get, Post, Delete, Patch, Param, Body } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';

@Controller('monitorias')
export class MonitoriasController {
    constructor(private readonly monitoriasService: MonitoriasService) {}


    @Public()
    @Get("/listar")
    async listarMonitorias() {
        return await this.monitoriasService.listar();
    }

    @Get("/colunas")
    async obterColunas() {
        return [
            { column: 'id', type: 'number' },
            { column: 'monitores', type: 'string'},
            { column: 'emailMonitor', type: 'string'},
            { column: 'disciplina', type: 'string' },
            { column: 'linkDiscord', type: 'string' },
            { column: 'linkWhatsapp', type: 'string' },
            { column: 'professor', type: 'string' },
            { column: 'status', type: 'enum', options: ['PENDENTE_APROVACAO', 'APROVADA', 'REPROVADA'] }
        ]
    }

    @Public()
    @Get("/listarAprovadas")
    async listarMonitoriasAprovadas() {
        return await this.monitoriasService.listarAprovadas();
    }

    @Get("/listarPendentes")
    async listarMonitoriasPendentes() {
        return await this.monitoriasService.listarPendentes();
    }

    @Public()
    @Post("/cadastrar")
    async cadastrarMonitoria(@Body() monitoria: any) {
        return await this.monitoriasService.cadastrar(monitoria);
    }

    @Post("/cadastrarMuitos")
    async cadastrarVariosMonitorias(@Body() monitorias: any[]) {
        return await this.monitoriasService.cadastrarVarios(monitorias);
    }

    @Get("/consultar/:id_monitoria")
    async consultarMonitoria(@Param('id_monitoria') id_monitoria: number) {
        return await this.monitoriasService.consultar(Number(id_monitoria));
    }


    @Patch("/atualizar/:id_monitoria")
    async atualizarMonitoria(@Param('id_monitoria') id_monitoria: number, @Body() monitoria: any) {
        return await this.monitoriasService.atualizar(Number(id_monitoria), monitoria);
    }

    @Delete("/deletar/:id_monitoria")
    async removerMonitoria(@Param('id_monitoria') id_monitoria: number) {
        return await this.monitoriasService.deletar(Number(id_monitoria));
    }

    @Delete("/deletar")
    async removerTodasMonitorias() {
        return await this.monitoriasService.deletarTodos();
    }

    @Public()
    @Post("/SAC")
    async enviarEmailSAC(@Body() emailData: { email: string, assunto: string, mensagem: string }) {
        return await this.monitoriasService.SAC(emailData.email, emailData.assunto, emailData.mensagem);
    }

    @Get("/buscar/:filtro/:parametro/:tipo")
    async buscarMonitorias(@Param('filtro') filtro: string, @Param('parametro') parametro: string | number, @Param('tipo') tipo: string) {
        if(tipo == 'number'){
            parametro = Number(parametro);
        }
        return await this.monitoriasService.buscar(filtro, parametro);
    }
}
