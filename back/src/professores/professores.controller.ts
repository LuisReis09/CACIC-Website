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

  @Get('/consultar/:id')
  async consultar(@Param('id') id: number){
    return await this.professoresService.consultar(id);
  }

  @Post('/inserir')
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
