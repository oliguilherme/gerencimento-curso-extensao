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