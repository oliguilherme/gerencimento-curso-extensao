import { prisma } from '../../lib/prisma.js'

export class DashboardService {
  static async getAdminDashboard() {
    const [
      totalUsuarios,
      totalAlunos,
      totalProfessores,
      totalCursos,
      totalInscricoes,
      totalInstituicoes,
      inscricoesAgrupadas,
      cursosAgrupados,
      cursosComVagas,
    ] = await prisma.$transaction([
      prisma.user.count(),

      prisma.perfilAluno.count(),

      prisma.perfilProfessor.count(),

      prisma.cursoExtensao.count(),

      prisma.inscricao.count(),

      prisma.instituicao.count(),

      prisma.inscricao.groupBy({
        by: ['status'],
        _count: {
          _all: true,
        },
      }),

      prisma.cursoExtensao.groupBy({
        by: ['status'],
        _count: {
          _all: true,
        },
      }),

      prisma.cursoExtensao.findMany({
        where: {
          status: {
            in: ['PUBLICADO', 'EM_ANDAMENTO'],
          },
        },
        select: {
          maxBeneficiados: true,
          _count: {
            select: {
              inscricoes: {
                where: {
                  status: 'APROVADA',
                },
              },
            },
          },
        },
      }),
    ])

    const vagasRestantes = cursosComVagas.reduce(
      (total, curso) => {
        const vagasDoCurso =
          curso.maxBeneficiados - curso._count.inscricoes

        return total + Math.max(0, vagasDoCurso)
      },
      0,
    )

    return {
      estatisticas: {
        usuarios: totalUsuarios,
        alunos: totalAlunos,
        professores: totalProfessores,
        cursos: totalCursos,
        inscricoes: totalInscricoes,
        instituicoes: totalInstituicoes,
        vagasRestantes,
      },

      inscricoesPorSituacao: inscricoesAgrupadas.map((item) => ({
        situacao: item.status,
        quantidade: item._count._all,
      })),

      cursosPorSituacao: cursosAgrupados.map((item) => ({
        situacao: item.status,
        quantidade: item._count._all,
      })),
    }
  }
}