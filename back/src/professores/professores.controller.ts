import { Controller } from '@nestjs/common';
import { ProfessoresService } from './professores.service';
import { Get, Post, Param, Delete, Body, Patch } from '@nestjs/common';
import { Professor, Feedback } from './professores.service';

@Controller('professores')
export class ProfessoresController {
  constructor(private readonly professoresService: ProfessoresService) {}

  @Get('/listar')
  async listar() {
    return this.professoresService.listar();
  }

  @Get('/feedbacks/listar')
  async listarFeedbacks() {
    return this.professoresService.listarFeedbacks();
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

  @Get('/consultar/:id')
  async consultar(@Param('id') id: number){
    return await this.professoresService.consultar(id);
  }

  @Post('/cadastrar')
  async inserir(@Body() professor: Professor) {
    return this.professoresService.inserir(professor);
  }

  @Delete('/deletar/:id')
  async deletar(@Param('id') id: number) {
    return this.professoresService.deletar(Number(id));
  }

  @Patch('/atualizar/:id')
  async atualizar(@Param('id') id: number, @Body() professor: Professor) {
    return this.professoresService.atualizar(Number(id), professor);
  }

  @Post('/avaliar')
  async avaliar(@Body() feedback: Feedback) {
    return this.professoresService.avaliar(feedback);
  }

  @Get('/deletarFeedbacks/:id')
  async deletarFeedbacks(@Param('id') id: number) {
    return this.professoresService.deletarFeedbacks(Number(id));
  }

  @Get('/deletarTodosFeedbacks')
  async deletarTodosFeedbacks() {
    return this.professoresService.deletarTodosFeedbacks();
  }

}
