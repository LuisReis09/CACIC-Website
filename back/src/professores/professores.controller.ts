import { Controller, Res } from '@nestjs/common';
import { ProfessoresService } from './professores.service';
import { Get, Post, Param, Delete, Body, Patch } from '@nestjs/common';
import { Professor, Feedback } from './professores.service';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('professores')
export class ProfessoresController {
  constructor(private readonly professoresService: ProfessoresService) {}

  @Public()
  @Get('/listar')
  async listar() {
    return await this.professoresService.listar();
  }

  @Public()
  @Get('/imagem/:id')
  async obterImagem(@Param('id') id: number, @Res() res) {
    return await this.professoresService.obterImagem(Number(id), res);
  }

  @Get('/feedbacks/listar')
  async listarFeedbacks() {
    return await this.professoresService.listarFeedbacks();
  }

  @Get('/votantes/listar')
  async listarVotantes() {
    return await this.professoresService.listarVotantes();
  }

  @Get('/colunas')
  async obterColunas() {
    return [
      { column: 'id', type: 'number' },
      { column: 'nome', type: 'string' },
      { column: 'email', type: 'string'},
      { column: 'sala', type: 'string' },
      { column: 'departamento', type: 'string'},
      { column: 'areasDeInteresse', type: 'string' },
      { column: 'laboratorios', type: 'string' },
      { column: 'disciplinas', type: 'string' },
      { column: 'linkedin', type: 'string' },
      { column: 'imagem', type: 'string'}
    ];
  }

  @Get('/feedbacks/colunas')
  async obterColunasFeedbacks() {
    return [
      { column: 'id', type: 'number' },
      { column: 'professorId', type: 'number' },
      { column: 'qtdFeedbacks', type: 'number' },
      { column: 'didatica', type: 'number' },
      { column: 'avaliacoes', type: 'number' },
      { column: 'planejamento', type: 'number' },
      { column: 'cordialidade', type: 'number' }
    ];
  }


  @Get('/votantes/colunas')
  async obterColunasVotantes() {
    return [
      { column: 'id', type: 'number' },
      { column: 'cpf', type: 'string', maxLength: 20 },
      { column: 'professorId', type: 'string', maxLength: 150 },

    ];
  }

  @Public()
  @Get('/consultar/:id')
  async consultar(@Param('id') id: number){
    return await this.professoresService.consultar(Number(id));
  }

  @Public()
  @Get('/feedbacks/consultar/:id')
  async consultarFeedbacks(@Param('id') id: number) {
    return await this.professoresService.consultarFeedback(Number(id));
  }

  @Get('/votantes/consultar/:id')
  async consultarVotantes(@Param('id') id: number) {
    return await this.professoresService.consultarVotante(Number(id));
  }

  @Post('/cadastrar')
  async inserir(@Body() professor: Professor) {
    return await this.professoresService.inserir(professor);
  }

  @Post('/cadastrarMuitos')
  async inserirMuitos(@Body() professores: Professor[]) {
    return await this.professoresService.inserirMuitos(professores);
  }

  @Public()
  @Post('/feedbacks/cadastrar')
  async inserirFeedback(@Body() feedback: Feedback) {
    return await this.professoresService.avaliar(feedback);
  }

  @Delete('/deletar/:id')
  async deletar(@Param('id') id: number) {
    return await this.professoresService.deletar(Number(id));
  }

  @Delete('/deletar')
  async deletarTodos() {
    return await this.professoresService.deletarTodos();
  }


  @Delete('/feedbacks/deletar/:id')
  async deletarFeedbacks(@Param('id') id: number) {
    return await this.professoresService.deletarFeedbacks(Number(id));
  }

  @Delete('/feedbacks/deletar')
  async deletarTodosFeedbacks() {
    return await this.professoresService.deletarTodosFeedbacks();
  }

  @Delete('/votantes/deletar/:id')
  async deletarVotantes(@Param('id') id: number) {
    return await this.professoresService.deletarVotantes(Number(id));
  }

  @Delete('/votantes/deletar')
  async deletarTodosVotantes() {
    return await this.professoresService.deletarTodosVotantes();
  }

  @Patch('/atualizar/:id')
  async atualizar(@Param('id') id: number, @Body() professor: Professor) {
    return await this.professoresService.atualizar(Number(id), professor);
  }

  @Patch('/feedbacks/atualizar/:id')
  async atualizarFeedbacks(@Param('id') id: number, @Body() feedback:
    Feedback) {
    return await this.professoresService.atualizarFeedback(Number(id), feedback);
  }

  @Patch('/votantes/atualizar/:id')
  async atualizarVotantes(@Param('id') id: number, @Body() votante: { cpf?: string; professorId?: number }) {
    return await this.professoresService.atualizarVotante(Number(id), votante);
  }

  @Get('/buscar/:filtro/:parametro/:tipo')
  async buscar(@Param('filtro') filtro: string, @Param('parametro') parametro: string | number, @Param('tipo') tipo: string) {
    if(tipo == 'number'){
      parametro = Number(parametro);
    }
    return await this.professoresService.buscar(filtro, parametro);
  }

  @Get('/feedbacks/buscar/:filtro/:parametro/:tipo')
  async buscarFeedbacks(@Param('filtro') filtro: string, @Param('parametro') parametro: string | number, @Param('tipo') tipo: string) {
    if(tipo == 'number'){
      parametro = Number(parametro);
    }
    return await this.professoresService.buscarFeedbacks(filtro, parametro);
  }

  @Get('/votantes/buscar/:filtro/:parametro/:tipo')
  async buscarVotantes(@Param('filtro') filtro: string, @Param('parametro') parametro: string | number, @Param('tipo') tipo: string) {
    if(tipo == 'number'){
      parametro = Number(parametro);
    }
    return await this.professoresService.buscarVotantes(filtro, parametro);
  }

}
