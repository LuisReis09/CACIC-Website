import { Controller } from '@nestjs/common';
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
    return this.professoresService.listar();
  }

  @Get('/feedbacks/listar')
  async listarFeedbacks() {
    return this.professoresService.listarFeedbacks();
  }

  @Get('/votantes/listar')
  async listarVotantes() {
    return this.professoresService.listarVotantes();
  }

  @Get('/colunas')
  async obterColunas() {
    return [
      { column: 'id', type: 'number' },
      { column: 'nome', type: 'string', maxLength: 200 },
      { column: 'email', type: 'string', maxLength: 200 },
      { column: 'sala', type: 'string', maxLength: 30 },
      { column: 'departamento', type: 'string', maxLength: 500},
      { column: 'areasDeInteresse', type: 'string', maxLength: 500 },
      { column: 'laboratorios', type: 'string', maxLength: 500 },
      { column: 'disciplinas', type: 'string', maxLength: 500 },
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
    return this.professoresService.consultarFeedback(Number(id));
  }

  @Get('/votantes/consultar/:id')
  async consultarVotantes(@Param('id') id: number) {
    return this.professoresService.consultarVotante(Number(id));
  }

  @Post('/cadastrar')
  async inserir(@Body() professor: Professor) {
    return this.professoresService.inserir(professor);
  }

  @Post('/cadastrarMuitos')
  async inserirMuitos(@Body() professores: Professor[]) {
    return this.professoresService.inserirMuitos(professores);
  }

  @Public()
  @Post('/feedbacks/cadastrar')
  async inserirFeedback(@Body() feedback: Feedback) {
    return this.professoresService.avaliar(feedback);
  }

  @Delete('/deletar/:id')
  async deletar(@Param('id') id: number) {
    return this.professoresService.deletar(Number(id));
  }

  @Delete('/deletar')
  async deletarTodos() {
    return this.professoresService.deletarTodos();
  }


  @Delete('/feedbacks/deletar/:id')
  async deletarFeedbacks(@Param('id') id: number) {
    return this.professoresService.deletarFeedbacks(Number(id));
  }

  @Delete('/feedbacks/deletar')
  async deletarTodosFeedbacks() {
    return this.professoresService.deletarTodosFeedbacks();
  }

  @Delete('/votantes/deletar/:id')
  async deletarVotantes(@Param('id') id: number) {
    return this.professoresService.deletarVotantes(Number(id));
  }

  @Delete('/votantes/deletar')
  async deletarTodosVotantes() {
    return this.professoresService.deletarTodosVotantes();
  }

  @Patch('/atualizar/:id')
  async atualizar(@Param('id') id: number, @Body() professor: Professor) {
    return this.professoresService.atualizar(Number(id), professor);
  }

  @Patch('/feedbacks/atualizar/:id')
  async atualizarFeedbacks(@Param('id') id: number, @Body() feedback:
    Feedback) {
    return this.professoresService.atualizarFeedback(Number(id), feedback);
  }

  @Patch('/votantes/atualizar/:id')
  async atualizarVotantes(@Param('id') id: number, @Body() votante: { cpf?: string; professorId?: number }) {
    return this.professoresService.atualizarVotante(Number(id), votante);
  }

  @Get('/buscar/:filtro/:parametro/:tipo')
  async buscar(@Param('filtro') filtro: string, @Param('parametro') parametro: string | number, @Param('tipo') tipo: string) {
    if(tipo == 'number'){
      parametro = Number(parametro);
    }
    return this.professoresService.buscar(filtro, parametro);
  }

  @Get('/feedbacks/buscar/:filtro/:parametro/:tipo')
  async buscarFeedbacks(@Param('filtro') filtro: string, @Param('parametro') parametro: string | number, @Param('tipo') tipo: string) {
    if(tipo == 'number'){
      parametro = Number(parametro);
    }
    return this.professoresService.buscarFeedbacks(filtro, parametro);
  }

  @Get('/votantes/buscar/:filtro/:parametro/:tipo')
  async buscarVotantes(@Param('filtro') filtro: string, @Param('parametro') parametro: string | number, @Param('tipo') tipo: string) {
    if(tipo == 'number'){
      parametro = Number(parametro);
    }
    return this.professoresService.buscarVotantes(filtro, parametro);
  }

}
