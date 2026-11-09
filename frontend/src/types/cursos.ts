export type StatusCurso =
  | "RASCUNHO"
  | "PUBLICADO"
  | "EM_ANDAMENTO"
  | "ENCERRADO"
  | "CANCELADO";

export type TipoCurso =
  | "FORMACAO_INICIAL"
  | "FORMACAO_CONTINUADA";

export type TipoAcao =
  | "CURSO"
  | "EVENTO"
  | "PROJETO"
  | "PROGRAMA";

export type LocalAtuacao = "URBANO" | "RURAL";

export type ModeloOferta =
  | "PRESENCIAL"
  | "ONLINE"
  | "HIBRIDO";

export type Curso = {
  id: string;
  createdAt: string;
  instituicaoId: string;
  professorId: string;

  titulo: string;
  status: StatusCurso;
  tipoAcao: TipoAcao;
  tipo: TipoCurso;

  areaTematica: string;
  linhaExtensao: string;
  localAtuacao: LocalAtuacao;
  modeloOferta: ModeloOferta;

  imagemCapa: string | null;
  cargaHoraria: number;
  dataInicio: string;
  dataFim: string;

  minBeneficiados: number;
  maxBeneficiados: number;

  fomento: string | null;
  programaInstitucional: string | null;
}