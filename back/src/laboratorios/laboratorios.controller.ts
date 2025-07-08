import { Controller } from '@nestjs/common';
import { LaboratoriosService } from './laboratorios.service'
import { Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('laboratorios')
export class LaboratoriosController {
    constructor(private readonly laboratoriosService: LaboratoriosService) {}

    @Get("/colunas")
    async colunas() {
        return [
            { column: "id", type: "number"},
            { column: "nome", type: "string" },
            { column: "link", type: "string" },
            { column: "descricao", type: "string" },
            { column: "localizacao", type: "string" },
            { column: "imagem", type: "string" },
        ]
    }

    @Public()
    @Get("/listar")
    async listar() {
        return await this.laboratoriosService.listar();
    }

    @Get("/consultar/:id")
    async consultar(@Param('id') id: string) {
        return await this.laboratoriosService.consultar(Number(id));
    }

    @Post("/cadastrar")
    async cadastrar(@Body() laboratorio: any) {
        return await this.laboratoriosService.cadastrar(laboratorio);
    }

    @Post("/cadastrarMuitos")
    async cadastrarMuitos(@Body() laboratorios: any[]) {
        return await this.laboratoriosService.cadastrarMuitos(laboratorios);
    }

    @Patch("/atualizar/:id")
    async atualizar(@Param('id') id: string, @Body() laboratorio: any){
        return await this.laboratoriosService.atualizar(Number(id), laboratorio);
    }

    @Delete("/deletar/:id")
    async deletar(@Param('id') id: string) {
        return await this.laboratoriosService.deletar(Number(id));
    }

    @Delete("/deletar")
    async deletarTodos() {
        return await this.laboratoriosService.deletarTodos();
    }

    @Get("/buscar/:filtro/:valor/:type")
    async buscar(@Param('filtro') filtro: string, @Param('valor') valor: string | number, @Param('type') type: string) {
        if(type === "number") {
            valor = Number(valor);
        }
        return await this.laboratoriosService.buscar(filtro, valor);
    }
}
