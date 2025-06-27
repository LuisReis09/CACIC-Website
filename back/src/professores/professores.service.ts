import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { isString } from 'util';

export interface Professor {
  nome: string;
  email: string;
  sala: string;
  departamento: string;
  areasDeInteresse: string;
  disciplinas: string;
  linkedin: string;
  laboratorios?: string | null;
  imagem?: string | null;
}

export interface Feedback {
  professorId: number;
  cpf: string;
  matricula: string;
  curso: string;
  didatica: number;
  cordialidade: number;
  planejamento: number;
  avaliacoes: number;
}

@Injectable()
export class ProfessoresService {
  constructor(private readonly prisma: PrismaService) {}
  

  async listar() {
    return this.prisma.professor.findMany({});
  }

  async listarFeedbacks() {
    return this.prisma.feedback.findMany({});
  }

  async listarVotantes() {
    return this.prisma.votante.findMany({});
  }

  async consultar(id: number) {
    const professor = await this.prisma.professor.findUnique({
      where: {
        id: id,
      }
    });

    return professor;
  }

  async consultarFeedback(id: number) {
    const feedback = await this.prisma.feedback.findUnique({
      where: {
        id: id,
      },
    });

    return feedback;
  }

  async consultarVotante(id: number) {
    const votante = await this.prisma.votante.findUnique({
      where: {
        id: id,
      },
    });

    return votante;
  }

  async inserir(professor: Professor) {
    return this.prisma.professor.create({
      data: {
        nome: professor.nome,
        email: professor.email,
        sala: professor.sala,
        departamento: professor.departamento,
        areasDeInteresse: professor.areasDeInteresse,
        disciplinas: professor.disciplinas,
        linkedin: professor.linkedin,
        laboratorios: professor.laboratorios || '',
        imagem: professor.imagem || '',
      },
    });
  }

  async deletar(id: number) {
    return this.prisma.professor.delete({
      where: {
        id: id,
      },
    });
  }

  async deletarTodos() {
    return this.prisma.professor.deleteMany({});
  }

  async atualizar(id: number, professor: Professor) {
    return this.prisma.professor.update({
      where: {
        id: id,
      },
      data: {
        nome: professor.nome,
        email: professor.email,
        sala: professor.sala,
        departamento: professor.departamento,
        areasDeInteresse: professor.areasDeInteresse,
        disciplinas: professor.disciplinas,
        linkedin: professor.linkedin,
        laboratorios: professor.laboratorios || '',
        imagem: professor.imagem || '',
      },
    });
  }

  async avaliar(feedback: Feedback){
    const { professorId, cpf, matricula, curso, didatica, cordialidade, planejamento, avaliacoes } = feedback;

    // Primeiro passo: Verifica se a matricula eh de um aluno, realizando webscraping
    const matriculaValida = await this.verificarMatricula(matricula, curso);
    if (!matriculaValida) {
      throw new BadRequestException('Matrícula inválida ou não encontrada.');
    }

    // Segundo passo: Verifica se o professor existe
    const professor = await this.prisma.professor.findUnique({
      where: {
        id: professorId,
      },
    });

    if (!professor) {
      throw new BadRequestException('Professor não encontrado.');
    }

    // Terceiro passo: Verifica se o feedback já foi dado por esse aluno
    const feedbackExistente = await this.prisma.votante.findFirst({
      where: {
        cpf: cpf,
        professorId: professorId,
      },
    });

    if (feedbackExistente) {
      throw new BadRequestException('Feedback já foi dado por este aluno.');
    }

    // Quarto passo: Atualiza o feedback de um professor, obtendo a nova média
    // Primeiro, obtém o feedback atual do professor
    const feedbackAtual = await this.prisma.feedback.findFirst({
      where: {
        professorId: professorId,
      },
    });

    // Se não houver feedback, cria um novo
    if (!feedbackAtual) {
      return this.prisma.feedback.create({
        data: {
          professorId: professorId,
          didatica: didatica,
          cordialidade: cordialidade,
          planejamento: planejamento,
          avaliacoes: avaliacoes,
          qtdFeedbacks: 1,
        },
      });


    }else{
      // Se já houver feedback, atualiza os valores
      const novaDidatica = (feedbackAtual.didatica * feedbackAtual.qtdFeedbacks + didatica) / (feedbackAtual.qtdFeedbacks + 1);
      const novaCordialidade = (feedbackAtual.cordialidade * feedbackAtual.qtdFeedbacks + cordialidade) / (feedbackAtual.qtdFeedbacks + 1);
      const novoPlanejamento = (feedbackAtual.planejamento * feedbackAtual.qtdFeedbacks + planejamento) / (feedbackAtual.qtdFeedbacks + 1);
      const novasAvaliacoes = (feedbackAtual.avaliacoes * feedbackAtual.qtdFeedbacks + avaliacoes) / (feedbackAtual.qtdFeedbacks + 1);

      await this.prisma.feedback.update({
        where: {
          id: feedbackAtual.id,
        },
        data: {
          didatica: novaDidatica,
          cordialidade: novaCordialidade,
          planejamento: novoPlanejamento,
          avaliacoes: novasAvaliacoes,
          qtdFeedbacks: feedbackAtual.qtdFeedbacks + 1,
        },
      });
    }

    // Quinto passo: Registra o votante para evitar feedbacks duplicados
    return await this.prisma.votante.create({
      data: {
        cpf: cpf,
        professorId: professorId,
      },
    });

  }

  async verificarMatricula(matricula: string, curso: string): Promise<boolean> {
    let link: string;

    if(curso == "CC"){
      link = "https://sigaa.ufpb.br/sigaa/public/curso/alunos.jsf?lc=pt_BR&id=1626669"
    } else if(curso == "EC"){
      link = "https://sigaa.ufpb.br/sigaa/public/curso/alunos.jsf?lc=pt_BR&id=1626865"
    }else{
      link = "https://sigaa.ufpb.br/sigaa/public/curso/alunos.jsf?lc=pt_BR&id=14289031"
    }

    try {
      const response = await axios.get(link);
      const html = response.data;
      const $ = cheerio.load(html);

      const encontrou = $('td.colMatricula')
        .toArray()
        .some((td) => $(td).text().trim() === matricula);

      return encontrou;
    } catch (error) {
      console.error('Erro ao acessar o site:', error);
      return false;
    }
  }

  async deletarFeedbacks(professorId: number) {
    // Deleta todos os feedbacks associados ao professor
    await this.prisma.feedback.deleteMany({
      where: {
        professorId: professorId,
      },
    });

    // Deleta todos os votantes associados ao professor
    await this.prisma.votante.deleteMany({
      where: {
        professorId: professorId,
      },
    });

    return { message: 'Feedbacks deletados com sucesso.' };
  }

  async deletarTodosFeedbacks() {
    // Deleta todos os feedbacks
    await this.prisma.feedback.deleteMany({});

    // Deleta todos os votantes
    await this.prisma.votante.deleteMany({});

    return { message: 'Todos os feedbacks e votantes foram deletados com sucesso.' };
  }

  async deletarVotantes(id: number) {
    return this.prisma.votante.delete({
      where: {
        id: id,
      },
    });
  }

  async deletarTodosVotantes() {
    return this.prisma.votante.deleteMany({});
  }

  async atualizarFeedback(id: number, feedback: Feedback) {
    return this.prisma.feedback.update({
      where: {
        id: id,
      },
      data: {
        didatica: feedback.didatica,
        cordialidade: feedback.cordialidade,
        planejamento: feedback.planejamento,
        avaliacoes: feedback.avaliacoes,
      },
    });
  }

  async atualizarVotante(id: number, votante: { cpf?: string; professorId?: number }) {
    return this.prisma.votante.update({
      where: {
        id: id,
      },
      data: {
        cpf: votante.cpf,
        professorId: votante.professorId,
      },
    });
  }

  async buscar(filtro: string, parametro: string | number) {
    const isString = typeof parametro === 'string';

    return this.prisma.professor.findMany({
      where: {
        [filtro]: isString
          ? {
              contains: parametro,
              mode: 'insensitive', // Ignora maiúsculas/minúsculas
            }
          : parametro, // Se não for string, assume que é um número e não aplica contains
      },
    });
  }

  async buscarFeedbacks(filtro: string, parametro: string | number) {
    const isString = typeof parametro === 'string';

    return this.prisma.feedback.findMany({
      where: {
        [filtro]: isString
          ? {
              contains: parametro,
              mode: 'insensitive', // Ignora maiúsculas/minúsculas
            }
          : parametro, // Se não for string, assume que é um número e não aplica contains
      },
    });
  }

  async buscarVotantes(filtro: string, parametro: string | number) {
    const isString = typeof parametro === 'string';

    return this.prisma.votante.findMany({
      where: {
        [filtro]: isString
          ? {
              contains: parametro,
              mode: 'insensitive', // Ignora maiúsculas/minúsculas
            }
          : parametro, // Se não for string, assume que é um número e não aplica contains
      },
    });
  }
}
