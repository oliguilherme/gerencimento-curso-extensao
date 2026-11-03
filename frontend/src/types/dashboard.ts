export interface DashboardStats {
  usuarios: number
  alunos: number
  professores: number
  cursos: number
  inscricoes: number
  instituicoes: number
  vagasRestantes: number
}

export interface EnrollmentDistribution {
  status: string
  quantidade: number
}

export interface CourseDistribution {
  status: string
  quantidade: number
}

export type EnrollmentStatus =
  | 'PENDENTE'
  | 'APROVADA'
  | 'REJEITADA'
  | 'CANCELADA'
  | 'LISTA_ESPERA'

export type CourseStatus =
  | 'RASCUNHO'
  | 'PUBLICADO'
  | 'EM_ANDAMENTO'
  | 'ENCERRADO'
  | 'CANCELADO'

export interface AdminDashboardResponse {
  estatisticas: {
    usuarios: number
    alunos: number
    professores: number
    cursos: number
    inscricoes: number
    instituicoes: number
    vagasRestantes: number
  }

  inscricoesPorSituacao: {
    situacao: EnrollmentStatus
    quantidade: number
  }[]

  cursosPorSituacao: {
    situacao: CourseStatus
    quantidade: number
  }[]
}