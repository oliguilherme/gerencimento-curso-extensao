/**
 * prisma/check-seed.ts
 * Verifica se o seed (original + seed-bulk, SEED_SCALE=1) produziu o esperado.
 *   npx tsx prisma/check-seed.ts
 */
import 'dotenv/config'
import { prisma } from '../src/lib/prisma.js'

declare const console: { log: (...args: any[]) => void }

const ok = (cond: boolean) => (cond ? '✅' : '❌')

async function main() {
  // 1. Totais -----------------------------------------------------------------
  // Esperado com SEED_SCALE=1 (bulk + 4 usuários/1 curso/1 instituição do seed original):
  //   usuarios 1246 · alunos 1143 · professores 97 · cursos 39 · instituicoes 7
  //   inscricoes ≈ 2.000–2.400 (varia pela PRNG, mas é fixo a cada execução)
  const totais = {
    usuarios: await prisma.user.count(),
    alunos: await prisma.perfilAluno.count(),
    professores: await prisma.perfilProfessor.count(),
    cursos: await prisma.cursoExtensao.count(),
    inscricoes: await prisma.inscricao.count(),
    instituicoes: await prisma.instituicao.count(),
  }
  console.log('Totais:', totais)

  // 2. Distribuições ----------------------------------------------------------
  // Cursos esperados: RASCUNHO 6 · PUBLICADO 9 (8 + o do seed original) · EM_ANDAMENTO 9 · ENCERRADO 12 · CANCELADO 3
  const cursosPorStatus = await prisma.cursoExtensao.groupBy({ by: ['status'], _count: { _all: true } })
  const insPorStatus = await prisma.inscricao.groupBy({ by: ['status'], _count: { _all: true } })
  console.log('Cursos por status:', cursosPorStatus.map(s => `${s.status}=${s._count._all}`).join(' · '))
  console.log('Inscrições por status:', insPorStatus.map(s => `${s.status}=${s._count._all}`).join(' · '))

  // 3. Invariantes ------------------------------------------------------------
  const cursos = await prisma.cursoExtensao.findMany({
    select: {
      titulo: true, status: true, maxBeneficiados: true, dataInicio: true, dataFim: true,
      _count: { select: { inscricoes: { where: { status: 'APROVADA' } } } },
    },
  })

  // 3a. Nenhum curso com mais aprovadas do que vagas
  const estourados = cursos.filter(c => c._count.inscricoes > c.maxBeneficiados)
  console.log(`${ok(estourados.length === 0)} cursos com aprovadas > vagas: ${estourados.length} (esperado 0)`)

  // 3b. Cursos EM_ANDAMENTO realmente em andamento pelas datas
  const agora = new Date()
  const emAndamento = cursos.filter(c => c.status === 'EM_ANDAMENTO')
  const coerentes = emAndamento.filter(c => c.dataInicio <= agora && c.dataFim >= agora)
  console.log(`${ok(coerentes.length === emAndamento.length)} EM_ANDAMENTO com datas coerentes: ${coerentes.length}/${emAndamento.length}`)

  // 3c. RASCUNHO não recebe inscrições
  const rascunhoComInsc = await prisma.inscricao.count({ where: { curso: { status: 'RASCUNHO' } } })
  console.log(`${ok(rascunhoComInsc === 0)} inscrições em cursos RASCUNHO: ${rascunhoComInsc} (esperado 0)`)

  // 3d. Toda inscrição fora de PENDENTE tem histórico
  const semHistorico = await prisma.inscricao.count({ where: { status: { not: 'PENDENTE' }, historico: { none: {} } } })
  console.log(`${ok(semHistorico === 0)} inscrições não pendentes sem histórico: ${semHistorico} (esperado 0)`)

  // 3e. Vagas restantes (definição PROVISÓRIA: cursos PUBLICADO + EM_ANDAMENTO)
  const vagasRestantes = cursos
    .filter(c => c.status === 'PUBLICADO' || c.status === 'EM_ANDAMENTO')
    .reduce((s, c) => s + Math.max(0, c.maxBeneficiados - c._count.inscricoes), 0)
  console.log(`ℹ️  vagas restantes (PUBLICADO + EM_ANDAMENTO): ${vagasRestantes}`)

  // 4. Logins de teste --------------------------------------------------------
  const emails = [
    'admin@ifce.edu.br', 'deppi@ifce.edu.br', 'professor@ifce.edu.br', 'aluno@ifce.edu.br',
    'marcia.holanda@ifce.edu.br', 'paulo.viana@ifce.edu.br', 'ana.rocha@aluno.ifce.edu.br',
  ]
  const usuarios = await prisma.user.findMany({
    where: { email: { in: emails } },
    select: { email: true, papeis: { select: { papel: { select: { nome: true } } } } },
  })
  for (const e of emails) {
    const u = usuarios.find(x => x.email === e)
    console.log(`${ok(!!u)} ${e} -> ${u ? u.papeis.map(p => p.papel.nome).join(',') : 'NÃO ENCONTRADO'}`)
  }

  // 5. Pendentes mais antigas (o que a tela do DEPPI vai listar) ---------------
  const antigas = await prisma.inscricao.findMany({
    where: { status: 'PENDENTE' },
    orderBy: { inscricaoEm: 'asc' },
    take: 5,
    select: { inscricaoEm: true, aluno: { select: { user: { select: { nome: true } } } }, curso: { select: { titulo: true } } },
  })
  console.log('Pendentes mais antigas:')
  for (const p of antigas) console.log(`   ${p.inscricaoEm.toISOString().slice(0, 10)} · ${p.aluno.user.nome} · ${p.curso.titulo}`)
}

main()
  .catch(e => { console.log('ERRO:', e); process.exitCode = 1 })
  .finally(() => prisma.$disconnect())