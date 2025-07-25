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
  didatica: number;
  cordialidade: number;
  planejamento: number;
  avaliacoes: number;
}

@Injectable()
export class ProfessoresService {
  constructor(private readonly prisma: PrismaService) {}
  

  async listar() {
    return await this.prisma.professor.findMany({
        include: {
          feedbacks: true, // Inclui o feedback associado ao professor
        },
        orderBy: {
          nome: 'asc', // Ordena os professores pelo nome
        },
    });
  }

  async listarFeedbacks() {
    return await this.prisma.feedback.findMany({});
  }

  async listarVotantes() {
    return await this.prisma.votante.findMany({});
  }

  async consultar(id: number) {
    const professor = await this.prisma.professor.findUnique({
      where: {
        id: id,
      }
    });

    return professor;
  }

  async obterImagem(id: number, res: any): Promise<any> {
    const prof = await this.prisma.professor.findUnique({
      where: { id: Number(id) },
      select: { imagem: true },
    });

    if (!prof?.imagem || prof.imagem == "https://sigaa.ufpb.br/sigaa/img/no_picture.png") {
      return res.redirect('http://localhost:3000/assets/professors/imagem_padrao.svg');
    }

    try {
      const response = await fetch(prof.imagem);
      if (!response.ok) {
        return res.redirect('http://localhost:3000/assets/professors/imagem_padrao.svg');
      }

      const buffer = await response.arrayBuffer();
      res.setHeader('Content-Type', 'image/jpeg');
      res.send(Buffer.from(buffer));
    } catch {
      return res.redirect('http://localhost:3000/assets/professors/imagem_padrao.svg');
    }
  }

  async consultarFeedback(id: number) {
    const feedback = await this.prisma.feedback.findFirst({
      where: {
        professorId: id,
      },
    });

    if(!feedback) {
      return {};
    }

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
    return await this.prisma.professor.create({
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

  async inserirMuitos(professores: any[]) {
    return await this.prisma.professor.createMany({
      data: professores
    });
  }

  async deletar(id: number) {
    return await this.prisma.professor.delete({
      where: {
        id: id,
      },
    });
  }

  async deletarTodos() {
    return await this.prisma.professor.deleteMany({});
  }

  async atualizar(id: number, professor: Professor) {
    return await this.prisma.professor.update({
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
    const { professorId, cpf, matricula, didatica, cordialidade, planejamento, avaliacoes } = feedback;

    // Primeiro passo: Verifica se a matricula eh de um aluno, realizando webscraping
    let matriculaValida = await this.verificarMatricula(matricula, "CC");
    if (!matriculaValida) {
      matriculaValida = await this.verificarMatricula(matricula, "EC");
    }
    if (!matriculaValida) {
      matriculaValida = await this.verificarMatricula(matricula, "SI");
    }

    if (!matriculaValida) {
      return {
        success: false,
        message: 'Matrícula inválida. Verifique se a matrícula está correta e pertence a um aluno dos cursos de CC, EC ou CDIA.',
      };
    }

    // Segundo passo: Verifica se o professor existe
    const professor = await this.prisma.professor.findUnique({
      where: {
        id: professorId,
      },
    });

    if (!professor) {
      return {
        success: false,
        message: 'Professor não encontrado.',
      }
    }

    // Terceiro passo: Verifica se o feedback já foi dado por esse aluno
    const feedbackExistente = await this.prisma.votante.findFirst({
      where: {
        cpf: cpf,
        professorId: professorId,
      },
    });

    if (feedbackExistente) {
      return {
        success: false,
        message: 'Feedback já registrado para este professor com o CPF fornecido.',
      };
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
      await this.prisma.feedback.create({
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
    let votante = await this.prisma.votante.create({
      data: {
        cpf: cpf,
        professorId: professorId,
      },
    });

    return {
      success: true,
      message: 'Feedback registrado com sucesso.',
      votante: votante,
    }

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
    return await this.prisma.votante.delete({
      where: {
        id: id,
      },
    });
  }

  async deletarTodosVotantes() {
    return await this.prisma.votante.deleteMany({});
  }

  async atualizarFeedback(id: number, feedback: Feedback) {
    return await this.prisma.feedback.update({
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
    return await this.prisma.votante.update({
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

    return await this.prisma.professor.findMany({
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

    return await this.prisma.feedback.findMany({
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

    return await this.prisma.votante.findMany({
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
