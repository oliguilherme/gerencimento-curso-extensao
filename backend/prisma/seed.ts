/**
 * prisma/seed-bulk.ts
 *
 * Popula o banco com volume para testar dashboards, listas e filtros.
 * Idempotente: pode rodar várias vezes (createMany + skipDuplicates, IDs determinísticos,
 * PRNG com seed fixa).
 *
 * Variável opcional:
 *   SEED_SCALE=0.1   -> 10% do volume (teste rápido); 2 -> dobro
 *
 * Logins criados (além dos do seed original):
 *   marcia.holanda@ifce.edu.br     / deppi123       (DEPPI)
 *   paulo.viana@ifce.edu.br        / professor123   (PROFESSOR)
 *   ana.rocha@aluno.ifce.edu.br    / aluno123       (ALUNO)
 *   todos os demais gerados        / senha123
 */
import 'dotenv/config'
import { createHash } from 'node:crypto'
import { hash } from 'bcrypt'
import { prisma } from '../src/lib/prisma.js'

declare const console: { log: (...args: any[]) => void }

// ─── Enums (espelham o schema.prisma) ──────────────────────────────────────
type StatusCurso = 'RASCUNHO' | 'PUBLICADO' | 'EM_ANDAMENTO' | 'ENCERRADO' | 'CANCELADO'
type StatusInsc = 'PENDENTE' | 'APROVADA' | 'REJEITADA' | 'CANCELADA' | 'LISTA_ESPERA'

const SEXOS = ['MASCULINO', 'FEMININO'] as const
const RACAS = ['AMARELA', 'BRANCA', 'PARDA', 'INDIGENA', 'NAO_DECLARADA'] as const
const ESTADOS_CIVIS = ['SOLTEIRO', 'CASADO', 'DIVORCIADO', 'VIUVO', 'UNIAO_ESTAVEL'] as const
const RENDAS = ['ATE_MEIO_SM', 'MEIO_A_UM_SM', 'UM_A_UM_E_MEIO_SM', 'UM_E_MEIO_A_DOIS_SM', 'DOIS_E_MEIO_A_TRES_SM', 'ACIMA_DE_TRES_SM'] as const
const LOCAIS = ['URBANO', 'RURAL'] as const
const MODELOS = ['PRESENCIAL', 'ONLINE', 'HIBRIDO'] as const
const FORMAS_AVALIACAO = ['PARTICIPACAO', 'QUESTIONARIO', 'DEBATE', 'FREQUENCIA', 'TESTE_OBJETIVO', 'PROVA', 'TRABALHOS_ESCRITOS'] as const
const FORMAS_DIVULGACAO = ['AUDIO', 'CARTAZ', 'EMAIL', 'SISTEMA_ACADEMICO', 'REDES_SOCIAIS', 'CONVITE', 'ARTICULACOES_INSTITUCIONAIS'] as const
const ATIVIDADES = ['MINICURSO', 'PALESTRA', 'WORKSHOP', 'SEMINARIO', 'OFICINA', 'EXPOSICAO', 'HACKATHON'] as const
const CONTAS = ['BOLSA_AUXILIO_ESTUDANTES', 'BOLSA_AUXILIO_PESQUISADORES', 'DIARIAS_PESSOAL_CIVIL', 'ENCARGOS_PATRONAIS', 'EQUIPAMENTO_MATERIAL_PERMANENTE', 'MATERIAL_CONSUMO', 'OUTROS_SERVICOS_PF', 'OUTROS_SERVICOES_PJ', 'PASSAGENS_LOCOMOCAO'] as const

// ─── Volume ────────────────────────────────────────────────────────────────
const SCALE = Number(process.env.SEED_SCALE ?? 1)
const n = (base: number) => Math.max(1, Math.round(base * SCALE))

const QTD_ALUNOS = Math.max(n(1142), 5)
const QTD_PROFESSORES = n(96)
const QTD_DEPPI = 4
const PLANO_CURSOS: Record<StatusCurso, number> = {
  RASCUNHO: n(6),
  PUBLICADO: n(8),
  EM_ANDAMENTO: n(9),
  ENCERRADO: n(12),
  CANCELADO: n(3),
}

const SENHA_PADRAO = 'senha123'

// ─── Utilitários ───────────────────────────────────────────────────────────
function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const rand = mulberry32(20261005)
const int = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min
const pick = <T>(arr: readonly T[]): T => arr[int(0, arr.length - 1)] as T
const shuffle = <T>(arr: readonly T[]): T[] => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = int(0, i)
    ;[a[i], a[j]] = [a[j] as T, a[i] as T]
  }
  return a
}
const amostra = <T>(arr: readonly T[], min: number, max: number): T[] =>
  shuffle(arr).slice(0, Math.min(arr.length, int(min, max)))
const lotes = <T>(arr: T[], size = 500): T[][] => {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}
const uuid = (key: string) => {
  const h = createHash('md5').update(key).digest('hex')
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-4${h.slice(13, 16)}-8${h.slice(17, 20)}-${h.slice(20, 32)}`
}
const slug = (s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '.').replace(/^\.|\.$/g, '')
const pad = (v: number, len: number) => String(v).padStart(len, '0')
const DIA = 86_400_000
const HORA = 3_600_000
const nascimento = ([min, max]: [number, number]) => new Date(Date.now() - int(min, max) * 365 * DIA)

const hashes = new Map<string, Promise<string>>()
const senhaHash = (s: string) => {
  if (!hashes.has(s)) hashes.set(s, hash(s, 10)) // bcrypt é lento: 1 hash por senha distinta
  return hashes.get(s)!
}

// ─── Dados-base ────────────────────────────────────────────────────────────
const PRIMEIROS = ['Ana','Beatriz','Carlos','Eduardo','Francisca','Helena','João','Pedro','Mariana','Lucas','Gabriel','Maria','José','Antônio','Rafaela','Juliana','Felipe','Larissa','Mateus','Camila','Davi','Isabela','Rafael','Letícia','Thiago','Natália','Bruno','Aline','Gustavo','Vitória','Samuel','Yasmin','Henrique','Luana','Ícaro','Sofia','Renato','Tatiane','Wesley','Cecília']
const SOBRENOMES = ['Silva','Souza','Oliveira','Santos','Lima','Pereira','Costa','Ferreira','Rodrigues','Almeida','Nogueira','Albuquerque','Sousa','Freitas','Barbosa','Ribeiro','Carvalho','Araújo','Martins','Rocha','Gomes','Moreira','Cavalcante','Holanda','Viana','Bezerra','Menezes','Monteiro','Teixeira','Mendes','Lopes','Pinheiro','Fernandes','Duarte','Matos','Alencar','Brito','Chaves','Dantas','Vasconcelos']

const CAMPI = ['Fortaleza', 'Maracanaú', 'Juazeiro do Norte', 'Sobral', 'Crato', 'Iguatu'].map(cidade => ({
  nome: `IFCE Campus ${cidade}`,
  sigla: `IFCE-${slug(cidade).replace(/\./g, '').slice(0, 3).toUpperCase()}`,
  endereco: `Campus ${cidade}, ${cidade} - CE`,
}))
const DEPARTAMENTOS = [
  { nome: 'Tecnologia da Informação', sigla: 'TI' },
  { nome: 'Construção Civil', sigla: 'CC' },
  { nome: 'Química e Meio Ambiente', sigla: 'QMA' },
  { nome: 'Linguagens', sigla: 'LIN' },
  { nome: 'Ciências Básicas', sigla: 'CB' },
]

const TITULOS = ['Introdução à Programação com Python','Robótica Educacional com Arduino','Inglês Instrumental para TI','Fotografia e Edição Digital','Libras Básico','Empreendedorismo e Inovação','Introdução ao Excel','Cuidador de Idosos','Desenho Técnico com CAD','Informática Básica','Manutenção de Computadores','Educação Financeira','Redação e Produção Textual','Primeiros Socorros','Energia Solar Fotovoltaica','Marketing Digital para Pequenos Negócios','Matemática Básica para Concursos','Banco de Dados com SQL','Hortas Urbanas e Agroecologia','Design Gráfico para Redes Sociais']
const AREAS = ['Tecnologia e Produção','Educação','Saúde','Comunicação','Trabalho','Meio Ambiente','Cultura','Direitos Humanos e Justiça']
const LINHAS = ['Desenvolvimento Tecnológico','Capacitação Profissional','Línguas Estrangeiras','Divulgação Científica e Tecnológica','Empreendedorismo','Educação Profissional']
// Regra do schema: FORMACAO_CONTINUADA >= 40h; FORMACAO_INICIAL >= 160h
const CARGAS = [40, 60, 80, 120, 160, 200]
const MUNICIPIOS = ['Cedro','Fortaleza','Maracanaú','Juazeiro do Norte','Sobral','Crato','Iguatu','Icó','Orós','Caucaia','Quixadá','Limoeiro do Norte']
const PARCEIROS = ['Prefeitura Municipal','Secretaria de Educação','Associação Comunitária','Sindicato Rural','Câmara de Dirigentes Lojistas','Fundação de Apoio']
const INSTRUMENTOS = ['Convênio', 'Termo de Cooperação', 'Acordo de Parceria']
const CURSOS_GRAD = ['Análise e Desenvolvimento de Sistemas','Engenharia Civil','Licenciatura em Física','Licenciatura em Matemática','Tecnologia em Alimentos','Administração','Técnico em Informática']
const SETORES_PROF = ['Coord. de Informática','Coord. de Edificações','Coord. de Química','Coord. de Letras','Coord. de Matemática']

type Spec = { nome: string; email: string; senha: string }

const nomeAleatorio = () => `${pick(PRIMEIROS)} ${pick(SOBRENOMES)} ${pick(SOBRENOMES)}`

function gerarPessoas(qtd: number, dominio: string, fixos: Spec[]): Spec[] {
  const out = [...fixos]
  for (let i = fixos.length; i < qtd; i++) {
    const nome = nomeAleatorio()
    out.push({ nome, email: `${slug(nome)}.${i}@${dominio}`, senha: SENHA_PADRAO })
  }
  return out.slice(0, qtd)
}

const ALUNOS_FIXOS: Spec[] = [
  { nome: 'Ana Beatriz Lima Rocha',  email: 'ana.rocha@aluno.ifce.edu.br',        senha: 'aluno123' },
  { nome: 'Carlos Eduardo Nogueira', email: 'carlos.nogueira@aluno.ifce.edu.br',  senha: SENHA_PADRAO },
  { nome: 'Francisca Helena Sousa',  email: 'francisca.sousa@aluno.ifce.edu.br',  senha: SENHA_PADRAO },
  { nome: 'João Pedro Albuquerque',  email: 'joao.albuquerque@aluno.ifce.edu.br', senha: SENHA_PADRAO },
  { nome: 'Mariana Costa Freitas',   email: 'mariana.freitas@aluno.ifce.edu.br',  senha: SENHA_PADRAO },
]
const PROF_FIXOS: Spec[] = [{ nome: 'Paulo Henrique Viana', email: 'paulo.viana@ifce.edu.br', senha: 'professor123' }]
const DEPPI_FIXOS: Spec[] = [{ nome: 'Márcia Holanda', email: 'marcia.holanda@ifce.edu.br', senha: 'deppi123' }]

// ─── Helpers de banco ──────────────────────────────────────────────────────
type Inst = { id: string; sigla: string }

async function criarUsuarios(specs: Spec[], papelId: string, insts: Inst[], idade: [number, number]) {
  const hs = await Promise.all(specs.map(s => senhaHash(s.senha))) // antes do map síncrono: mantém a PRNG determinística
  const data = specs.map((s, i) => ({
    nome: s.nome,
    email: s.email,
    senhaHash: hs[i]!,
    ativo: true,
    instituicaoId: insts[i % insts.length]!.id,
    sexo: pick(SEXOS),
    racaEtnia: pick(RACAS),
    estadoCivil: pick(ESTADOS_CIVIS),
    dataNascimento: nascimento(idade),
    cidade: pick(MUNICIPIOS),
  }))
  for (const c of lotes(data)) await prisma.user.createMany({ data: c, skipDuplicates: true })

  const ids = new Map<string, string>() // email -> userId
  for (const c of lotes(specs.map(s => s.email))) {
    const rows = await prisma.user.findMany({ where: { email: { in: c } }, select: { id: true, email: true } })
    rows.forEach(r => ids.set(r.email, r.id))
  }
  const vinculos = [...ids.values()].map(userId => ({ userId, papelId }))
  for (const c of lotes(vinculos)) await prisma.userPapel.createMany({ data: c, skipDuplicates: true })
  return ids
}

async function criarServidores(
  specs: Spec[], ids: Map<string, string>, prefixo: string,
  cargo: string, setores: readonly string[], insts: Inst[],
) {
  const data = specs.map((s, i) => ({
    userId: ids.get(s.email)!,
    siape: `${prefixo}${pad(i, 6)}`,
    matricula: `SRV-${prefixo}${pad(i, 4)}`,
    setorSuap: setores[i % setores.length]!,
    lotacaoSiape: insts[i % insts.length]!.sigla,
    situacao: 'ATIVO' as const,
    regimeTrabalho: 'DEDICACAO_EXCLUSIVA' as const,
    jornadaTrabalho: 'INTEGRAL' as const,
    cargo,
    inicioServicioPublico: new Date(2005 + (i % 18), i % 12, 1),
    dataPosseInstituicao: new Date(2006 + (i % 18), i % 12, 10),
  }))
  for (const c of lotes(data)) await prisma.perfilServidor.createMany({ data: c, skipDuplicates: true })

  const rows = await prisma.perfilServidor.findMany({
    where: { siape: { in: data.map(d => d.siape) } },
    select: { id: true, userId: true },
  })
  return new Map(rows.map(r => [r.userId, r.id] as const)) // userId -> perfilServidorId
}

// ─── Cursos ────────────────────────────────────────────────────────────────
function datasCurso(status: StatusCurso): [Date, Date] {
  const agora = Date.now()
  const dur = int(30, 120) * DIA
  let ini: number, fim: number
  switch (status) {
    case 'RASCUNHO':     ini = agora + int(20, 90) * DIA; fim = ini + dur; break
    case 'PUBLICADO':    ini = agora + int(5, 40) * DIA;  fim = ini + dur; break
    case 'EM_ANDAMENTO': ini = agora - int(10, 40) * DIA; fim = agora + int(20, 80) * DIA; break
    case 'ENCERRADO':    fim = agora - int(10, 200) * DIA; ini = fim - dur; break
    case 'CANCELADO':    ini = agora + int(10, 60) * DIA; fim = ini + dur; break
  }
  return [new Date(ini), new Date(fim)]
}

const ZERO: Record<StatusInsc, number> = { PENDENTE: 0, APROVADA: 0, REJEITADA: 0, CANCELADA: 0, LISTA_ESPERA: 0 }

/** Quantas inscrições de cada status um curso recebe, conforme a fase em que está. */
function alvoInscricoes(status: StatusCurso, vagas: number): Record<StatusInsc, number> {
  const f = (min: number, max: number) => Math.round(vagas * (min + rand() * (max - min)))
  const lotado = rand() < 0.3
  let alvo: Record<StatusInsc, number>
  switch (status) {
    case 'PUBLICADO':
      alvo = { ...ZERO, APROVADA: f(0.2, 0.8), PENDENTE: int(5, Math.max(5, f(0.3, 0.6))), REJEITADA: int(0, f(0, 0.1)), CANCELADA: int(0, f(0, 0.05)) }
      break
    case 'EM_ANDAMENTO':
      alvo = { ...ZERO, APROVADA: lotado ? vagas : f(0.5, 1), PENDENTE: int(0, f(0, 0.3)), REJEITADA: int(0, f(0, 0.2)), CANCELADA: int(0, f(0, 0.1)) }
      break
    case 'ENCERRADO':
      alvo = { ...ZERO, APROVADA: lotado ? vagas : f(0.6, 1), REJEITADA: int(0, f(0, 0.2)), CANCELADA: int(0, f(0, 0.1)) }
      break
    case 'CANCELADO':
      alvo = { ...ZERO, REJEITADA: int(0, 2), CANCELADA: int(5, Math.max(5, f(0.3, 0.6))) }
      break
    default: // RASCUNHO: ainda não recebe inscrições
      alvo = { ...ZERO }
  }
  if (alvo.APROVADA >= vagas) alvo.LISTA_ESPERA = int(0, 8) // curso lotado -> lista de espera
  return alvo
}

const quando = (status: StatusInsc, dias?: number) => {
  const d = dias ?? (status === 'PENDENTE' ? int(0, 14) : int(5, 90))
  return new Date(Date.now() - d * DIA - int(0, 23) * HORA)
}

// ═══════════════════════════════════════════════════════════════════════════
export async function seedBulk() {
  console.log('▶ seed-bulk: iniciando...')

  const [papelDeppi, papelProf, papelAluno] = await Promise.all([
    prisma.papel.findUniqueOrThrow({ where: { nome: 'DEPPI' } }),
    prisma.papel.findUniqueOrThrow({ where: { nome: 'PROFESSOR' } }),
    prisma.papel.findUniqueOrThrow({ where: { nome: 'ALUNO' } }),
  ])

  // 1. Instituições e departamentos -----------------------------------------
  await prisma.instituicao.createMany({ data: CAMPI, skipDuplicates: true })
  const instituicoes: Inst[] = await prisma.instituicao.findMany({ select: { id: true, sigla: true } })

  await prisma.departamento.createMany({
    data: instituicoes.flatMap(inst =>
      DEPARTAMENTOS.map((d, k) => ({ id: uuid(`dep:${inst.id}:${k}`), nome: d.nome, sigla: d.sigla, instituicaoId: inst.id })),
    ),
    skipDuplicates: true,
  })

  // 2. DEPPI ----------------------------------------------------------------
  const deppiSpecs = gerarPessoas(QTD_DEPPI, 'ifce.edu.br', DEPPI_FIXOS)
  const deppiIds = await criarUsuarios(deppiSpecs, papelDeppi.id, instituicoes, [28, 55])
  await criarServidores(deppiSpecs, deppiIds, '2', 'Técnico Administrativo em Educação', ['DEPPI'], instituicoes)
  const deppiUserIds = [...deppiIds.values()]

  // 3. Professores ----------------------------------------------------------
  const profSpecs = gerarPessoas(QTD_PROFESSORES, 'ifce.edu.br', PROF_FIXOS)
  const profUserIds = await criarUsuarios(profSpecs, papelProf.id, instituicoes, [28, 62])
  const servidorPorUser = await criarServidores(
    profSpecs, profUserIds, '3', 'Professor do Ensino Básico, Técnico e Tecnológico', SETORES_PROF, instituicoes,
  )
  const servidorIds = [...servidorPorUser.values()]
  const jaTem = new Set(
    (await prisma.perfilProfessor.findMany({
      where: { perfilServidorId: { in: servidorIds } }, select: { perfilServidorId: true },
    })).map(p => p.perfilServidorId),
  )
  const novosProf = servidorIds.filter(id => !jaTem.has(id)).map((perfilServidorId, i) => ({
    perfilServidorId,
    titulacao: pick(['Mestre', 'Doutor', 'Especialista']),
    departamento: pick(DEPARTAMENTOS).nome,
    nce: `NCE-${pad(i + 100, 3)}`,
    disciplinaIngresso: pick(['Estruturas de Dados', 'Cálculo I', 'Redes de Computadores', 'Língua Portuguesa', 'Física Geral']),
  }))
  for (const c of lotes(novosProf)) await prisma.perfilProfessor.createMany({ data: c, skipDuplicates: true })

  const userPorServidor = new Map([...servidorPorUser].map(([u, s]) => [s, u] as const))
  const perfisProf = await prisma.perfilProfessor.findMany({
    where: { perfilServidorId: { in: servidorIds } }, select: { id: true, perfilServidorId: true },
  })
  const profs = perfisProf.map(p => ({ perfilProfessorId: p.id, userId: userPorServidor.get(p.perfilServidorId)! }))

  // 4. Alunos ---------------------------------------------------------------
  const alunoSpecs = gerarPessoas(QTD_ALUNOS, 'aluno.ifce.edu.br', ALUNOS_FIXOS)
  const alunoUserIds = await criarUsuarios(alunoSpecs, papelAluno.id, instituicoes, [16, 45])
  const perfisAluno = alunoSpecs.map((s, i) => ({
    userId: alunoUserIds.get(s.email)!,
    matricula: `2026${pad(i, 5)}`,
    cursoGraduacao: pick(CURSOS_GRAD),
    semestre: int(1, 8),
    grauInstrucao: pick(['Ensino Médio Completo', 'Ensino Superior Incompleto', 'Ensino Fundamental Completo']),
    profissao: pick(['Estudante', 'Autônomo', 'Professor', 'Comerciante', 'Desempregado']),
    rendaFamiliarPerCapita: pick(RENDAS),
    numPessoasFamilia: int(1, 7),
    telefoneCelular: `(88) 9${int(1000, 9999)}-${int(1000, 9999)}`,
  }))
  for (const c of lotes(perfisAluno)) await prisma.perfilAluno.createMany({ data: c, skipDuplicates: true })

  const perfilPorUser = new Map<string, string>()
  for (const c of lotes(perfisAluno.map(p => p.userId))) {
    const rows = await prisma.perfilAluno.findMany({ where: { userId: { in: c } }, select: { id: true, userId: true } })
    rows.forEach(r => perfilPorUser.set(r.userId, r.id))
  }
  const alunosPerfil = alunoSpecs.map(s => perfilPorUser.get(alunoUserIds.get(s.email)!)).filter((x): x is string => !!x)
  const userPorPerfilAluno = new Map([...perfilPorUser].map(([u, p]) => [p, u] as const))

  // 5. Cursos ---------------------------------------------------------------
  const statusLista = shuffle(
    (Object.keys(PLANO_CURSOS) as StatusCurso[]).flatMap(k => Array<StatusCurso>(PLANO_CURSOS[k]).fill(k)),
  )
  const cursos = statusLista.map((status, i) => {
    const base = TITULOS[i % TITULOS.length]!
    const [dataInicio, dataFim] = datasCurso(status)
    return {
      id: uuid(`curso:${i}`),
      i,
      status,
      vagas: int(20, 80),
      titulo: i < TITULOS.length ? base : `${base} — Turma B`,
      prof: profs[i % profs.length]!,
      instituicaoId: pick(instituicoes).id,
      cargaHoraria: pick(CARGAS),
      dataInicio,
      dataFim,
    }
  })

  const cursosData = cursos.map(c => ({
    id: c.id,
    titulo: c.titulo,
    tipoAcao: 'CURSO' as const,
    tipo: (c.cargaHoraria >= 160 ? 'FORMACAO_INICIAL' : 'FORMACAO_CONTINUADA') as 'FORMACAO_INICIAL' | 'FORMACAO_CONTINUADA',
    areaTematica: pick(AREAS),
    linhaExtensao: pick(LINHAS),
    localAtuacao: pick(LOCAIS),
    modeloOferta: pick(MODELOS),
    status: c.status,
    cargaHoraria: c.cargaHoraria,
    dataInicio: c.dataInicio,
    dataFim: c.dataFim,
    minBeneficiados: 10,
    maxBeneficiados: c.vagas,
    fomento: 'Recursos próprios IFCE',
    programaInstitucional: 'Programa de Extensão Tecnológica',
    apresentacao: `Curso de extensão: ${c.titulo}.`,
    justificativa: 'Demanda da comunidade local por qualificação nesta área.',
    publicoAlvo: 'Comunidade em geral e estudantes.',
    objetivoGeral: `Capacitar os participantes em ${c.titulo}.`,
    objetivosEspecificos: '1. Apresentar os fundamentos.\n2. Praticar com atividades guiadas.',
    metodologia: 'Aulas expositivas e atividades práticas.',
    professorId: c.prof.perfilProfessorId,
    instituicaoId: c.instituicaoId,
  }))
  for (const c of lotes(cursosData, 100)) await prisma.cursoExtensao.createMany({ data: c, skipDuplicates: true })

  // 5b. Tabelas filhas (chaves compostas -> vários valores distintos por curso)
  await prisma.cursoMunicipio.createMany({
    data: cursos.flatMap(c => amostra(MUNICIPIOS, 1, 3).map(nome => ({ cursoId: c.id, nome }))),
    skipDuplicates: true,
  })
  await prisma.cursoFormaAvaliacao.createMany({
    data: cursos.flatMap(c => amostra(FORMAS_AVALIACAO, 1, 3).map(forma => ({ cursoId: c.id, forma }))),
    skipDuplicates: true,
  })
  await prisma.cursoFormaDivulgacao.createMany({
    data: cursos.flatMap(c => amostra(FORMAS_DIVULGACAO, 1, 3).map(forma => ({ cursoId: c.id, forma }))),
    skipDuplicates: true,
  })
  await prisma.cursoAtividade.createMany({
    data: cursos.flatMap(c => amostra(ATIVIDADES, 1, 3).map(atividade => ({ cursoId: c.id, atividade }))),
    skipDuplicates: true,
  })

  const equipe = cursos.flatMap(c => {
    const usados = new Set<string>([c.prof.userId])
    const membros: {
      cursoId: string; userId: string
      categoria: 'COORDENADOR' | 'INTEGRANTE'
      vinculo: 'DOCENTE_IFCE' | 'TECNICO_IFCE' | 'DISCENTE_IFCE'
      receberaBolsa: boolean; horasSemanais: number; inicioParticipacao: Date; fimParticipacao: Date
    }[] = [{
      cursoId: c.id, userId: c.prof.userId, categoria: 'COORDENADOR', vinculo: 'DOCENTE_IFCE',
      receberaBolsa: false, horasSemanais: int(4, 12), inicioParticipacao: c.dataInicio, fimParticipacao: c.dataFim,
    }]
    for (let k = int(0, 3); k > 0; k--) {
      const tipo = pick(['DOCENTE_IFCE', 'DISCENTE_IFCE', 'DISCENTE_IFCE', 'TECNICO_IFCE'] as const)
      const userId = tipo === 'DOCENTE_IFCE' ? pick(profs).userId
        : tipo === 'TECNICO_IFCE' ? pick(deppiUserIds)
        : pick([...alunoUserIds.values()])
      if (usados.has(userId)) continue
      usados.add(userId)
      membros.push({
        cursoId: c.id, userId, categoria: 'INTEGRANTE', vinculo: tipo,
        receberaBolsa: tipo === 'DISCENTE_IFCE' && rand() < 0.5,
        horasSemanais: int(2, 10), inicioParticipacao: c.dataInicio, fimParticipacao: c.dataFim,
      })
    }
    return membros
  })
  for (const c of lotes(equipe)) await prisma.membroEquipe.createMany({ data: c, skipDuplicates: true })

  await prisma.itemOrcamento.createMany({
    data: cursos.flatMap(c => amostra(CONTAS, 1, 4).map(conta => ({ cursoId: c.id, conta, valor: int(2, 40) * 100 }))),
    skipDuplicates: true,
  })

  await prisma.parceria.createMany({
    data: cursos.flatMap(c =>
      Array.from({ length: int(0, 2) }, (_, k) => {
        const formalizada = rand() < 0.7
        return {
          id: uuid(`parceria:${c.i}:${k}`), // id fixo: numeroInstrumento nulo não barra duplicata no unique
          cursoId: c.id,
          instituicaoParceira: pick(PARCEIROS),
          parceriaFormalizada: formalizada,
          instrumentoUtilizado: formalizada ? pick(INSTRUMENTOS) : null,
          numeroInstrumento: formalizada ? `2026-${pad(c.i, 3)}-${k}` : null,
        }
      }),
    ),
    skipDuplicates: true,
  })

  // 6. Inscrições -----------------------------------------------------------
  // Alunos "de vitrine": Ana aprovada nos 3 primeiros cursos em andamento; os outros
  // 4 pendentes (com 1 a 3 dias) no primeiro curso publicado.
  const emAndamento = cursos.filter(c => c.status === 'EM_ANDAMENTO')
  const publicados = cursos.filter(c => c.status === 'PUBLICADO')
  type Forcado = { aluno: number; status: StatusInsc; dias?: number }
  const forcados = new Map<string, Forcado[]>()
  emAndamento.slice(0, 3).forEach(c => forcados.set(c.id, [{ aluno: 0, status: 'APROVADA' }]))
  if (publicados[0]) {
    forcados.set(publicados[0].id, [
      { aluno: 1, status: 'PENDENTE', dias: 3 }, { aluno: 2, status: 'PENDENTE', dias: 2 },
      { aluno: 3, status: 'PENDENTE', dias: 2 }, { aluno: 4, status: 'PENDENTE', dias: 1 },
    ])
  }

  const inscricoes: { alunoId: string; cursoId: string; status: StatusInsc; inscricaoEm: Date }[] = []

  for (const c of cursos) {
    const alvo = alvoInscricoes(c.status, c.vagas)
    const usados = new Set<string>()

    for (const f of forcados.get(c.id) ?? []) {
      const alunoId = alunosPerfil[f.aluno]
      if (!alunoId) continue
      usados.add(alunoId)
      alvo[f.status] = Math.max(0, alvo[f.status] - 1)
      inscricoes.push({ alunoId, cursoId: c.id, status: f.status, inscricaoEm: quando(f.status, f.dias) })
    }

    const pool = shuffle(alunosPerfil).filter(id => !usados.has(id))
    let k = 0
    for (const status of Object.keys(alvo) as StatusInsc[]) {
      for (let j = 0; j < alvo[status] && k < pool.length; j++) {
        inscricoes.push({ alunoId: pool[k++]!, cursoId: c.id, status, inscricaoEm: quando(status) })
      }
    }
  }
  for (const c of lotes(inscricoes)) await prisma.inscricao.createMany({ data: c, skipDuplicates: true })

  // 7. Histórico (toda inscrição que saiu de PENDENTE) -----------------------
  const gravadas = await prisma.inscricao.findMany({
    where: { cursoId: { in: cursos.map(c => c.id) } },
    select: { id: true, alunoId: true, status: true, inscricaoEm: true },
  })
  const OBS: Record<StatusInsc, string> = {
    PENDENTE: '',
    APROVADA: 'Documentação conferida e inscrição aprovada.',
    REJEITADA: 'Documentação incompleta ou fora dos critérios do edital.',
    CANCELADA: 'Inscrição cancelada.',
    LISTA_ESPERA: 'Vagas esgotadas; aluno incluído na lista de espera.',
  }
  const agora = Date.now()
  const historico = gravadas
    .filter(r => r.status !== 'PENDENTE')
    .map(r => ({
      id: uuid(`hist:${r.id}`),
      inscricaoId: r.id,
      statusAnterior: 'PENDENTE' as const,
      statusNovo: r.status,
      observacao: OBS[r.status],
      alteradoEm: new Date(Math.min(agora, r.inscricaoEm.getTime() + int(1, 3) * DIA)),
      alteradoPorId:
        r.status === 'CANCELADA'
          ? (userPorPerfilAluno.get(r.alunoId) ?? pick(deppiUserIds))
          : pick(deppiUserIds),
    }))
  for (const c of lotes(historico)) await prisma.inscricaoHistorico.createMany({ data: c, skipDuplicates: true })

  // 8. Relatórios -----------------------------------------------------------
  const tipos = ['inscricoes_por_curso', 'cursos_por_status', 'alunos_por_campus']
  await prisma.relatorio.createMany({
    data: Array.from({ length: 9 }, (_, i) => ({
      id: uuid(`relatorio:${i}`),
      tipo: tipos[i % tipos.length]!,
      parametros: { periodo: `2026-S${(i % 2) + 1}`, campus: i % 3 },
      arquivoUrl: null,
      geradoEm: new Date(agora - int(1, 60) * DIA),
      geradoPorId: deppiUserIds[i % deppiUserIds.length]!,
    })),
    skipDuplicates: true,
  })

  // 9. Resumo ---------------------------------------------------------------
  const [u, a, p, c, i, inst] = await Promise.all([
    prisma.user.count(), prisma.perfilAluno.count(), prisma.perfilProfessor.count(),
    prisma.cursoExtensao.count(), prisma.inscricao.count(), prisma.instituicao.count(),
  ])
  const insPorStatus = await prisma.inscricao.groupBy({ by: ['status'], _count: { _all: true } })
  const curPorStatus = await prisma.cursoExtensao.groupBy({ by: ['status'], _count: { _all: true } })
  console.log(`✅ seed-bulk: usuários=${u} alunos=${a} professores=${p} cursos=${c} inscrições=${i} instituições=${inst}`)
  console.log('   inscrições por status:', JSON.stringify(insPorStatus.map(s => [s.status, s._count._all])))
  console.log('   cursos por status:    ', JSON.stringify(curPorStatus.map(s => [s.status, s._count._all])))
}