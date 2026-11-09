export type ProfessorCourse = {
  id: number;
  nome: string;
  sigla: string;
  instituicao: string;
  campus: string;
  situacao: string;
  dataInicio: string;
  dataFim: string;
  horarioInicio: string;
  horarioFim: string;
  cargaHoraria: number;
  vagasOcupadas: number;
  totalVagas: number;
}