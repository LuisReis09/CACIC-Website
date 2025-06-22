import { Controller } from '@nestjs/common';
import { MonitoriasService } from './monitorias.service';
import { Get, Post, Delete, Patch, Param, Body } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';

@Controller('monitorias')
export class MonitoriasController {
    constructor(private readonly monitoriasService: MonitoriasService) {}


    @Get("/listar")
    async listarMonitorias() {
        return this.monitoriasService.listar();
    }

    @Public()
    @Get("/colunas")
    async obterColunas() {
        return [
            { column: 'id', type: 'number' },
            { column: 'monitores', type: 'string'},
            { column: 'emailMonitor', type: 'string'},
            { column: 'disciplina', type: 'string' },
            { column: 'linkDiscord', type: 'string' },
            { column: 'linkWhatsapp', type: 'string' },
            { column: 'status', type: 'enum', options: ['PENDENTE_APROVACAO', 'APROVADA'] },
            { column: 'professorID', type: 'number' }
        ]
    }

    @Public()
    @Get("/listarAprovadas")
    async listarMonitoriasAprovadas() {
        return this.monitoriasService.listarAprovadas();
    }

    @Public()
    @Get("/listarPendentes")
    async listarMonitoriasPendentes() {
        return this.monitoriasService.listarPendentes();
    }

    @Public()
    @Post("/cadastrar")
    async cadastrarMonitoria(@Body() monitoria: any) {
        return this.monitoriasService.cadastrar(monitoria);
    }


    @Patch("/aprovar/:id_monitoria")
    async aprovarMonitoria(@Param('id_monitoria') id_monitoria: number) {
        return this.monitoriasService.aprovar(id_monitoria);
    }

    @Patch("/reprovar")
    async reprovarMonitoria(@Body('reprovar') reprovar: { id_monitoria: number, motivo: string }) {
        return this.monitoriasService.reprovar(reprovar.id_monitoria, reprovar.motivo);
    }

    @Delete("/deletar/:id_monitoria")
    async removerMonitoria(@Param('id_monitoria') id_monitoria: number) {
        return this.monitoriasService.deletar(id_monitoria);
    }

    @Post("/SAC")
    async enviarEmailSAC(@Body() emailData: { email: string, assunto: string, mensagem: string }) {
        return this.monitoriasService.SAC(emailData.email, emailData.assunto, emailData.mensagem);
    }
}
