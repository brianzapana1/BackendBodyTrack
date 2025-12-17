/**
 * Script para resetear contraseñas de usuarios
 * Ejecutar con: node prisma/reset-passwords.js
 */
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🔑 Reseteando contraseñas...')

  const newPassword = '123456'
  const hashedPassword = await bcrypt.hash(newPassword, 10)

  // Resetear admin
  const admin = await prisma.usuario.updateMany({
    where: { email: 'admin@bodytrack.com' },
    data: { password: hashedPassword }
  })
  if (admin.count > 0) {
    console.log('✅ Admin: admin@bodytrack.com / 123456')
  }

  // Resetear entrenadores
  const trainer1 = await prisma.usuario.updateMany({
    where: { email: 'carlos@bodytrack.com' },
    data: { password: hashedPassword }
  })
  if (trainer1.count > 0) {
    console.log('✅ Entrenador: carlos@bodytrack.com / 123456')
  }

  const trainer2 = await prisma.usuario.updateMany({
    where: { email: 'maria@bodytrack.com' },
    data: { password: hashedPassword }
  })
  if (trainer2.count > 0) {
    console.log('✅ Entrenador: maria@bodytrack.com / 123456')
  }

  // Resetear clientes
  const client1 = await prisma.usuario.updateMany({
    where: { email: 'juan@ejemplo.com' },
    data: { password: hashedPassword }
  })
  if (client1.count > 0) {
    console.log('✅ Cliente: juan@ejemplo.com / 123456')
  }

  const client2 = await prisma.usuario.updateMany({
    where: { email: 'ana@ejemplo.com' },
    data: { password: hashedPassword }
  })
  if (client2.count > 0) {
    console.log('✅ Cliente: ana@ejemplo.com / 123456')
  }

  console.log('\n🎉 Contraseñas reseteadas exitosamente')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
