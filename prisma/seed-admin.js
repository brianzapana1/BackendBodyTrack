/**
 * Script para crear solo el usuario administrador
 * Ejecutar con: node prisma/seed-admin.js
 */
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Creando usuario administrador...')

  const hashedPassword = await bcrypt.hash('123456', 10)

  // Verificar si ya existe
  const existingAdmin = await prisma.usuario.findUnique({
    where: { email: 'admin@bodytrack.com' }
  })

  if (existingAdmin) {
    console.log('⚠️  El admin ya existe')
    return
  }

  // Crear Admin
  const admin = await prisma.usuario.create({
    data: {
      email: 'admin@bodytrack.com',
      password: hashedPassword,
      rol: 'ADMIN',
      activo: true
    }
  })
  
  console.log('✅ Admin creado exitosamente')
  console.log('📧 Email: admin@bodytrack.com')
  console.log('🔑 Password: 123456')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
