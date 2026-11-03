import { seedBulk } from './seed.js';
import { prisma } from '../src/lib/prisma.js'

seedBulk()
  .then(() => console.log('done'))
  .catch(e => { console.log('ERRO:', e); process.exitCode = 1 })
  .finally(() => prisma.$disconnect())