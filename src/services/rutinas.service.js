import { prisma } from '../config/prisma.js'

/**
 * Listar rutinas (filtrado por entrenador si se especifica)
 */
export const listar = (filtros = {}) => {
  const where = {}
  
  if (filtros.entrenadorId) {
    where.entrenadorId = filtros.entrenadorId
  }

  return prisma.rutina.findMany({
    where,
    include: {
      entrenador: {
        select: {
          nombres: true,
          apellidos: true
        }
      },
      ejercicios: {
        include: {
          ejercicio: true
        },
        orderBy: [
          { dia: 'asc' },
          { orden: 'asc' }
        ]
      }
    },
    orderBy: { createdAt: 'desc' }
  })
}

/**
 * Buscar rutina por ID con todos sus detalles
 */
export const buscarPorId = (id) => {
  return prisma.rutina.findUnique({
    where: { id },
    include: {
      entrenador: {
        select: {
          nombres: true,
          apellidos: true,
          especialidad: true
        }
      },
      ejercicios: {
        include: {
          ejercicio: true
        },
        orderBy: [
          { dia: 'asc' },
          { orden: 'asc' }
        ]
      },
      asignaciones: {
        include: {
          cliente: {
            select: {
              nombres: true,
              apellidos: true
            }
          }
        }
      }
    }
  })
}

/**
 * Crear nueva rutina con ejercicios
 */
export const crear = async (data) => {
  const { entrenadorId, nombre, descripcion, objetivo, duracionSemanas, ejercicios } = data

  return prisma.rutina.create({
    data: {
      entrenadorId,
      nombre,
      descripcion,
      objetivo,
      duracionSemanas: duracionSemanas ? parseInt(duracionSemanas) : null,
      ejercicios: ejercicios ? {
        create: ejercicios.map(ej => ({
          ejercicioId: ej.ejercicioId,
          orden: ej.orden || 0,
          dia: ej.dia || 0,
          series: parseInt(ej.series),
          repeticiones: ej.repeticiones,
          descansoSeg: ej.descansoSeg ? parseInt(ej.descansoSeg) : null,
          notas: ej.notas
        }))
      } : undefined
    },
    include: {
      ejercicios: {
        include: {
          ejercicio: true
        }
      }
    }
  })
}

/**
 * Actualizar rutina
 */
export const actualizar = (id, data) => {
  const { nombre, descripcion, objetivo, duracionSemanas } = data
  return prisma.rutina.update({
    where: { id },
    data: {
      nombre,
      descripcion,
      objetivo,
      duracionSemanas: duracionSemanas ? parseInt(duracionSemanas) : undefined
    }
  })
}

/**
 * Eliminar rutina
 */
export const eliminar = (id) => {
  return prisma.rutina.delete({ where: { id } })
}

/**
 * Agregar ejercicio a rutina
 */
export const agregarEjercicio = (data) => {
  const { rutinaId, ejercicioId, orden, dia, series, repeticiones, descansoSeg, notas } = data
  
  return prisma.rutinaEjercicio.create({
    data: {
      rutinaId,
      ejercicioId,
      orden: orden || 0,
      dia: dia || 0,
      series: parseInt(series),
      repeticiones,
      descansoSeg: descansoSeg ? parseInt(descansoSeg) : null,
      notas
    },
    include: {
      ejercicio: true
    }
  })
}

/**
 * Actualizar ejercicio de rutina
 */
export const actualizarEjercicio = (id, data) => {
  const { orden, dia, series, repeticiones, descansoSeg, notas } = data
  
  return prisma.rutinaEjercicio.update({
    where: { id },
    data: {
      orden: orden !== undefined ? parseInt(orden) : undefined,
      dia: dia !== undefined ? parseInt(dia) : undefined,
      series: series ? parseInt(series) : undefined,
      repeticiones,
      descansoSeg: descansoSeg ? parseInt(descansoSeg) : undefined,
      notas
    }
  })
}

/**
 * Eliminar ejercicio de rutina
 */
export const eliminarEjercicio = (id) => {
  return prisma.rutinaEjercicio.delete({ where: { id } })
}

/**
 * Asignar rutina a un cliente
 */
export const asignarCliente = async (data) => {
  const { rutinaId, clienteId, entrenadorId, fechaInicio, fechaFin } = data

  // Desactivar asignaciones previas activas de este cliente
  await prisma.asignacionRutina.updateMany({
    where: {
      clienteId,
      activa: true
    },
    data: {
      activa: false,
      fechaFin: new Date()
    }
  })

  return prisma.asignacionRutina.create({
    data: {
      rutinaId,
      clienteId,
      entrenadorId,
      fechaInicio: fechaInicio ? new Date(fechaInicio) : new Date(),
      fechaFin: fechaFin ? new Date(fechaFin) : null
    },
    include: {
      rutina: true,
      cliente: {
        select: {
          nombres: true,
          apellidos: true
        }
      }
    }
  })
}

/**
 * Obtener rutina activa de un cliente
 */
export const obtenerRutinaActiva = (clienteId) => {
  return prisma.asignacionRutina.findFirst({
    where: {
      clienteId,
      activa: true
    },
    include: {
      rutina: {
        include: {
          ejercicios: {
            include: {
              ejercicio: true
            },
            orderBy: [
              { dia: 'asc' },
              { orden: 'asc' }
            ]
          }
        }
      },
      entrenador: {
        select: {
          nombres: true,
          apellidos: true
        }
      }
    }
  })
}

/**
 * Desactivar asignación de rutina
 */
export const desactivarAsignacion = (id) => {
  return prisma.asignacionRutina.update({
    where: { id },
    data: {
      activa: false,
      fechaFin: new Date()
    }
  })
}
