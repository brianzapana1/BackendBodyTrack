/**
 * Script de semilla para poblar la base de datos con datos de prueba
 * Ejecutar con: node prisma/seed.js
 */
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...')

  // Limpiar datos existentes (opcional - descomenta si quieres empezar limpio)
  // await prisma.suscripcion.deleteMany()
  // await prisma.foroComentario.deleteMany()
  // await prisma.foroPost.deleteMany()
  // await prisma.asignacionRutina.deleteMany()
  // await prisma.rutinaEjercicio.deleteMany()
  // await prisma.rutina.deleteMany()
  // await prisma.ejercicio.deleteMany()
  // await prisma.registroProgreso.deleteMany()
  // await prisma.entrenador.deleteMany()
  // await prisma.cliente.deleteMany()
  // await prisma.usuario.deleteMany()

  const hashedPassword = await bcrypt.hash('123456', 10)

  // 1. Crear Admin
  const admin = await prisma.usuario.create({
    data: {
      email: 'admin@bodytrack.com',
      password: hashedPassword,
      rol: 'ADMIN'
    }
  })
  console.log('✅ Admin creado:', admin.email)

  // 2. Crear Entrenadores
  const entrenador1 = await prisma.usuario.create({
    data: {
      email: 'carlos@bodytrack.com',
      password: hashedPassword,
      rol: 'ENTRENADOR',
      entrenador: {
        create: {
          nombres: 'Carlos',
          apellidos: 'Martínez',
          especialidad: 'Musculación y Hipertrofia',
          certificaciones: 'NSCA-CPT, CrossFit Level 1',
          telefono: '70111222',
          bio: 'Entrenador con 10 años de experiencia en musculación'
        }
      }
    },
    include: { entrenador: true }
  })

  const entrenador2 = await prisma.usuario.create({
    data: {
      email: 'maria@bodytrack.com',
      password: hashedPassword,
      rol: 'ENTRENADOR',
      entrenador: {
        create: {
          nombres: 'María',
          apellidos: 'González',
          especialidad: 'Funcional y Pérdida de Peso',
          certificaciones: 'ACE, TRX',
          telefono: '70222333'
        }
      }
    },
    include: { entrenador: true }
  })
  console.log('✅ Entrenadores creados')

  // 3. Crear Clientes
  const cliente1 = await prisma.usuario.create({
    data: {
      email: 'juan@ejemplo.com',
      password: hashedPassword,
      rol: 'CLIENTE',
      cliente: {
        create: {
          dni: '12345678',
          nombres: 'Juan',
          apellidos: 'Pérez',
          telefono: '70123456',
          fechaNacimiento: new Date('1990-05-15'),
          genero: 'M',
          plan: 'PREMIUM',
          peso: 75.5,
          altura: 175
        }
      }
    },
    include: { cliente: true }
  })

  const cliente2 = await prisma.usuario.create({
    data: {
      email: 'ana@ejemplo.com',
      password: hashedPassword,
      rol: 'CLIENTE',
      cliente: {
        create: {
          dni: '87654321',
          nombres: 'Ana',
          apellidos: 'López',
          telefono: '70654321',
          fechaNacimiento: new Date('1995-08-20'),
          genero: 'F',
          plan: 'FREE',
          peso: 62.0,
          altura: 165
        }
      }
    },
    include: { cliente: true }
  })
  console.log('✅ Clientes creados')

  // 4. Crear Ejercicios
  const ejercicios = await prisma.ejercicio.createMany({
    data: [
      { nombre: 'Press de Banca', descripcion: 'Ejercicio compuesto para pecho', grupoMuscular: 'Pecho', equipamiento: 'Barra' },
      { nombre: 'Sentadilla', descripcion: 'Rey de los ejercicios de pierna', grupoMuscular: 'Piernas', equipamiento: 'Barra' },
      { nombre: 'Peso Muerto', descripcion: 'Ejercicio completo de espalda y piernas', grupoMuscular: 'Espalda', equipamiento: 'Barra' },
      { nombre: 'Press Militar', descripcion: 'Desarrollo de hombros', grupoMuscular: 'Hombros', equipamiento: 'Barra' },
      { nombre: 'Dominadas', descripcion: 'Ejercicio de espalda con peso corporal', grupoMuscular: 'Espalda', equipamiento: 'Ninguno' },
      { nombre: 'Curl de Bíceps', descripcion: 'Aislamiento de bíceps', grupoMuscular: 'Brazos', equipamiento: 'Mancuernas' },
      { nombre: 'Extensión de Tríceps', descripcion: 'Aislamiento de tríceps', grupoMuscular: 'Brazos', equipamiento: 'Polea' },
      { nombre: 'Plancha', descripcion: 'Ejercicio isométrico de core', grupoMuscular: 'Abdomen', equipamiento: 'Ninguno' }
    ]
  })
  console.log('✅ Ejercicios creados:', ejercicios.count)

  const todosEjercicios = await prisma.ejercicio.findMany()

  // 5. Crear Rutina
  const rutina1 = await prisma.rutina.create({
    data: {
      entrenadorId: entrenador1.entrenador.id,
      nombre: 'Rutina Hipertrofia 4 días',
      descripcion: 'Rutina de volumen enfocada en hipertrofia muscular',
      objetivo: 'Hipertrofia',
      duracionSemanas: 12,
      ejercicios: {
        create: [
          { ejercicioId: todosEjercicios[0].id, dia: 1, orden: 1, series: 4, repeticiones: '8-10', descansoSeg: 90 },
          { ejercicioId: todosEjercicios[5].id, dia: 1, orden: 2, series: 3, repeticiones: '12', descansoSeg: 60 },
          { ejercicioId: todosEjercicios[1].id, dia: 2, orden: 1, series: 4, repeticiones: '6-8', descansoSeg: 120 },
          { ejercicioId: todosEjercicios[2].id, dia: 3, orden: 1, series: 3, repeticiones: '5', descansoSeg: 150 },
          { ejercicioId: todosEjercicios[4].id, dia: 3, orden: 2, series: 3, repeticiones: 'al fallo', descansoSeg: 90 }
        ]
      }
    }
  })
  console.log('✅ Rutina creada')

  // 5b. Crear Rutinas Genéricas (para usuarios FREE)
  const rutinaGenericaPrincipiante = await prisma.rutina.create({
    data: {
      entrenadorId: entrenador1.entrenador.id,
      nombre: 'Rutina Principiante - Full Body',
      descripcion: 'Rutina de cuerpo completo ideal para comenzar en el gimnasio. 3 días por semana.',
      objetivo: 'Fuerza',
      duracionSemanas: 8,
      esGenerica: true,
      ejercicios: {
        create: [
          // Día 1
          { ejercicioId: todosEjercicios[0].id, dia: 1, orden: 1, series: 3, repeticiones: '10-12', descansoSeg: 90 },
          { ejercicioId: todosEjercicios[1].id, dia: 1, orden: 2, series: 3, repeticiones: '10', descansoSeg: 90 },
          { ejercicioId: todosEjercicios[2].id, dia: 1, orden: 3, series: 3, repeticiones: '8-10', descansoSeg: 120 },
          { ejercicioId: todosEjercicios[4].id, dia: 1, orden: 4, series: 2, repeticiones: '12', descansoSeg: 60 },
          // Día 2
          { ejercicioId: todosEjercicios[5].id, dia: 2, orden: 1, series: 3, repeticiones: '12', descansoSeg: 60 },
          { ejercicioId: todosEjercicios[3].id, dia: 2, orden: 2, series: 3, repeticiones: '10', descansoSeg: 90 },
          { ejercicioId: todosEjercicios[6].id, dia: 2, orden: 3, series: 3, repeticiones: '10', descansoSeg: 60 },
          // Día 3
          { ejercicioId: todosEjercicios[0].id, dia: 3, orden: 1, series: 3, repeticiones: '10', descansoSeg: 90 },
          { ejercicioId: todosEjercicios[2].id, dia: 3, orden: 2, series: 3, repeticiones: '8', descansoSeg: 120 },
          { ejercicioId: todosEjercicios[4].id, dia: 3, orden: 3, series: 3, repeticiones: '12', descansoSeg: 60 }
        ]
      }
    }
  })

  const rutinaGenericaIntermedio = await prisma.rutina.create({
    data: {
      entrenadorId: entrenador2.entrenador.id,
      nombre: 'Rutina Intermedia - Hipertrofia',
      descripcion: 'Rutina de 4 días enfocada en ganancia muscular para nivel intermedio.',
      objetivo: 'Hipertrofia',
      duracionSemanas: 12,
      esGenerica: true,
      ejercicios: {
        create: [
          // Día 1 - Pecho y Tríceps
          { ejercicioId: todosEjercicios[0].id, dia: 1, orden: 1, series: 4, repeticiones: '8-10', descansoSeg: 90 },
          { ejercicioId: todosEjercicios[5].id, dia: 1, orden: 2, series: 3, repeticiones: '10-12', descansoSeg: 60 },
          { ejercicioId: todosEjercicios[7].id, dia: 1, orden: 3, series: 3, repeticiones: '12', descansoSeg: 60 },
          // Día 2 - Espalda y Bíceps
          { ejercicioId: todosEjercicios[1].id, dia: 2, orden: 1, series: 4, repeticiones: '6-8', descansoSeg: 120 },
          { ejercicioId: todosEjercicios[3].id, dia: 2, orden: 2, series: 3, repeticiones: '10', descansoSeg: 90 },
          { ejercicioId: todosEjercicios[6].id, dia: 2, orden: 3, series: 3, repeticiones: '12', descansoSeg: 60 },
          // Día 3 - Piernas
          { ejercicioId: todosEjercicios[2].id, dia: 3, orden: 1, series: 4, repeticiones: '6-8', descansoSeg: 150 },
          { ejercicioId: todosEjercicios[8].id, dia: 3, orden: 2, series: 3, repeticiones: '10', descansoSeg: 90 },
          // Día 4 - Hombros y Abs
          { ejercicioId: todosEjercicios[9].id, dia: 4, orden: 1, series: 4, repeticiones: '10', descansoSeg: 90 },
          { ejercicioId: todosEjercicios[4].id, dia: 4, orden: 2, series: 3, repeticiones: 'al fallo', descansoSeg: 60 }
        ]
      }
    }
  })

  const rutinaGenericaPerdidaPeso = await prisma.rutina.create({
    data: {
      entrenadorId: entrenador2.entrenador.id,
      nombre: 'Rutina Pérdida de Peso - Circuito',
      descripcion: 'Rutina de alta intensidad combinando fuerza y cardio para quemar grasa.',
      objetivo: 'Pérdida de peso',
      duracionSemanas: 10,
      esGenerica: true,
      ejercicios: {
        create: [
          // Día 1 - Circuito Superior
          { ejercicioId: todosEjercicios[0].id, dia: 1, orden: 1, series: 3, repeticiones: '15', descansoSeg: 45 },
          { ejercicioId: todosEjercicios[3].id, dia: 1, orden: 2, series: 3, repeticiones: '15', descansoSeg: 45 },
          { ejercicioId: todosEjercicios[4].id, dia: 1, orden: 3, series: 3, repeticiones: '20', descansoSeg: 30 },
          // Día 2 - Circuito Inferior
          { ejercicioId: todosEjercicios[2].id, dia: 2, orden: 1, series: 4, repeticiones: '12', descansoSeg: 60 },
          { ejercicioId: todosEjercicios[8].id, dia: 2, orden: 2, series: 3, repeticiones: '15', descansoSeg: 45 },
          // Día 3 - Circuito Full Body
          { ejercicioId: todosEjercicios[1].id, dia: 3, orden: 1, series: 3, repeticiones: '12', descansoSeg: 60 },
          { ejercicioId: todosEjercicios[2].id, dia: 3, orden: 2, series: 3, repeticiones: '12', descansoSeg: 60 },
          { ejercicioId: todosEjercicios[5].id, dia: 3, orden: 3, series: 3, repeticiones: '15', descansoSeg: 45 }
        ]
      }
    }
  })

  console.log('✅ Rutinas genéricas creadas (3)')

  // 6. Asignar rutina a cliente
  await prisma.asignacionRutina.create({
    data: {
      rutinaId: rutina1.id,
      clienteId: cliente1.cliente.id,
      entrenadorId: entrenador1.entrenador.id
    }
  })
  console.log('✅ Rutina asignada a cliente')

  // 7. Registrar progreso
  await prisma.registroProgreso.create({
    data: {
      clienteId: cliente1.cliente.id,
      peso: 75.5,
      porcentajeGrasa: 18.5,
      medidaPecho: 95,
      medidaCintura: 80,
      medidaCadera: 92,
      medidaBrazo: 35,
      medidaPierna: 55,
      notas: 'Primer registro de progreso'
    }
  })
  console.log('✅ Progreso registrado')

  // 8. Crear posts de foro
  const post1 = await prisma.foroPost.create({
    data: {
      usuarioId: cliente1.id,
      titulo: '¿Cuál es la mejor proteína?',
      contenido: 'Hola a todos, quisiera saber qué proteína recomiendan para ganar masa muscular.'
    }
  })

  await prisma.foroComentario.create({
    data: {
      postId: post1.id,
      usuarioId: entrenador1.id,
      contenido: 'Te recomiendo proteína de suero aislada, tiene alta biodisponibilidad.'
    }
  })
  console.log('✅ Posts y comentarios creados')

  // 9. Crear suscripción
  await prisma.suscripcion.create({
    data: {
      clienteId: cliente1.cliente.id,
      plan: 'PREMIUM',
      estado: 'ACTIVA',
      fechaInicio: new Date(),
      fechaFin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
      monto: 150,
      metodoPago: 'Tarjeta'
    }
  })
  console.log('✅ Suscripción creada')

  console.log('\n🎉 Seed completado exitosamente!')
  console.log('\n📝 Credenciales de prueba:')
  console.log('  Admin:      admin@bodytrack.com / 123456')
  console.log('  Entrenador: carlos@bodytrack.com / 123456')
  console.log('  Cliente:    juan@ejemplo.com / 123456')
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
