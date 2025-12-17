/**
 * Script para agregar rutinas genéricas a la base de datos existente
 */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Agregando rutinas genéricas...')

  // Obtener entrenadores existentes
  const entrenadores = await prisma.entrenador.findMany({ take: 2 })
  
  if (entrenadores.length < 2) {
    console.error('❌ Se necesitan al menos 2 entrenadores en la base de datos')
    process.exit(1)
  }

  // Obtener ejercicios existentes
  const ejercicios = await prisma.ejercicio.findMany()
  
  if (ejercicios.length < 10) {
    console.error('❌ Se necesitan al menos 10 ejercicios en la base de datos')
    process.exit(1)
  }

  // Verificar si ya existen rutinas genéricas
  const rutinasGenericasExistentes = await prisma.rutina.count({
    where: { esGenerica: true }
  })

  if (rutinasGenericasExistentes > 0) {
    console.log(`⚠️  Ya existen ${rutinasGenericasExistentes} rutinas genéricas. Eliminándolas primero...`)
    await prisma.rutina.deleteMany({
      where: { esGenerica: true }
    })
  }

  // Crear Rutina Genérica 1: Principiante
  const rutinaPrincipiante = await prisma.rutina.create({
    data: {
      entrenadorId: entrenadores[0].id,
      nombre: 'Rutina Principiante - Full Body',
      descripcion: 'Rutina de cuerpo completo ideal para comenzar en el gimnasio. 3 días por semana.',
      objetivo: 'Fuerza',
      duracionSemanas: 8,
      esGenerica: true,
      ejercicios: {
        create: [
          // Día 1
          { ejercicioId: ejercicios[0].id, dia: 1, orden: 1, series: 3, repeticiones: '10-12', descansoSeg: 90 },
          { ejercicioId: ejercicios[1].id, dia: 1, orden: 2, series: 3, repeticiones: '10', descansoSeg: 90 },
          { ejercicioId: ejercicios[2].id, dia: 1, orden: 3, series: 3, repeticiones: '8-10', descansoSeg: 120 },
          { ejercicioId: ejercicios[4].id, dia: 1, orden: 4, series: 2, repeticiones: '12', descansoSeg: 60 },
          // Día 2
          { ejercicioId: ejercicios[5].id, dia: 2, orden: 1, series: 3, repeticiones: '12', descansoSeg: 60 },
          { ejercicioId: ejercicios[3].id, dia: 2, orden: 2, series: 3, repeticiones: '10', descansoSeg: 90 },
          { ejercicioId: ejercicios[6].id, dia: 2, orden: 3, series: 3, repeticiones: '10', descansoSeg: 60 },
          // Día 3
          { ejercicioId: ejercicios[0].id, dia: 3, orden: 1, series: 3, repeticiones: '10', descansoSeg: 90 },
          { ejercicioId: ejercicios[2].id, dia: 3, orden: 2, series: 3, repeticiones: '8', descansoSeg: 120 },
          { ejercicioId: ejercicios[4].id, dia: 3, orden: 3, series: 3, repeticiones: '12', descansoSeg: 60 }
        ]
      }
    }
  })
  console.log('✅ Rutina Principiante creada')

  // Crear Rutina Genérica 2: Intermedia
  const rutinaIntermedia = await prisma.rutina.create({
    data: {
      entrenadorId: entrenadores[1].id,
      nombre: 'Rutina Intermedia - Hipertrofia',
      descripcion: 'Rutina de 4 días enfocada en ganancia muscular para nivel intermedio.',
      objetivo: 'Hipertrofia',
      duracionSemanas: 12,
      esGenerica: true,
      ejercicios: {
        create: [
          // Día 1 - Pecho y Tríceps
          { ejercicioId: ejercicios[0].id, dia: 1, orden: 1, series: 4, repeticiones: '8-10', descansoSeg: 90 },
          { ejercicioId: ejercicios[5].id, dia: 1, orden: 2, series: 3, repeticiones: '10-12', descansoSeg: 60 },
          { ejercicioId: ejercicios[7].id, dia: 1, orden: 3, series: 3, repeticiones: '12', descansoSeg: 60 },
          // Día 2 - Espalda y Bíceps
          { ejercicioId: ejercicios[1].id, dia: 2, orden: 1, series: 4, repeticiones: '6-8', descansoSeg: 120 },
          { ejercicioId: ejercicios[3].id, dia: 2, orden: 2, series: 3, repeticiones: '10', descansoSeg: 90 },
          { ejercicioId: ejercicios[6].id, dia: 2, orden: 3, series: 3, repeticiones: '12', descansoSeg: 60 },
          // Día 3 - Piernas
          { ejercicioId: ejercicios[2].id, dia: 3, orden: 1, series: 4, repeticiones: '6-8', descansoSeg: 150 },
          { ejercicioId: ejercicios[8].id, dia: 3, orden: 2, series: 3, repeticiones: '10', descansoSeg: 90 },
          // Día 4 - Hombros y Abs
          { ejercicioId: ejercicios[9].id, dia: 4, orden: 1, series: 4, repeticiones: '10', descansoSeg: 90 },
          { ejercicioId: ejercicios[4].id, dia: 4, orden: 2, series: 3, repeticiones: 'al fallo', descansoSeg: 60 }
        ]
      }
    }
  })
  console.log('✅ Rutina Intermedia creada')

  // Crear Rutina Genérica 3: Pérdida de Peso
  const rutinaPerdidaPeso = await prisma.rutina.create({
    data: {
      entrenadorId: entrenadores[1].id,
      nombre: 'Rutina Pérdida de Peso - Circuito',
      descripcion: 'Rutina de alta intensidad combinando fuerza y cardio para quemar grasa.',
      objetivo: 'Pérdida de peso',
      duracionSemanas: 10,
      esGenerica: true,
      ejercicios: {
        create: [
          // Día 1 - Circuito Superior
          { ejercicioId: ejercicios[0].id, dia: 1, orden: 1, series: 3, repeticiones: '15', descansoSeg: 45 },
          { ejercicioId: ejercicios[3].id, dia: 1, orden: 2, series: 3, repeticiones: '15', descansoSeg: 45 },
          { ejercicioId: ejercicios[4].id, dia: 1, orden: 3, series: 3, repeticiones: '20', descansoSeg: 30 },
          // Día 2 - Circuito Inferior
          { ejercicioId: ejercicios[2].id, dia: 2, orden: 1, series: 4, repeticiones: '12', descansoSeg: 60 },
          { ejercicioId: ejercicios[8].id, dia: 2, orden: 2, series: 3, repeticiones: '15', descansoSeg: 45 },
          // Día 3 - Circuito Full Body
          { ejercicioId: ejercicios[1].id, dia: 3, orden: 1, series: 3, repeticiones: '12', descansoSeg: 60 },
          { ejercicioId: ejercicios[2].id, dia: 3, orden: 2, series: 3, repeticiones: '12', descansoSeg: 60 },
          { ejercicioId: ejercicios[5].id, dia: 3, orden: 3, series: 3, repeticiones: '15', descansoSeg: 45 }
        ]
      }
    }
  })
  console.log('✅ Rutina Pérdida de Peso creada')

  console.log('\n🎉 Rutinas genéricas creadas exitosamente!')
  console.log(`  - ${rutinaPrincipiante.nombre}`)
  console.log(`  - ${rutinaIntermedia.nombre}`)
  console.log(`  - ${rutinaPerdidaPeso.nombre}`)
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
