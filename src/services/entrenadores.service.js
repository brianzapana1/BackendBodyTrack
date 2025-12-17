import { prisma } from '../config/prisma.js'

/**
 * Listar todos los entrenadores
 */
export const listar = () => {
  return prisma.entrenador.findMany({
    include: {
      usuario: {
        select: {
          email: true,
          activo: true
        }
      }
    },
    orderBy: { fechaRegistro: 'desc' }
  })
}

/**
 * Buscar entrenador por ID
 */
export const buscarPorId = (id) => {
  return prisma.entrenador.findUnique({
    where: { id },
    include: {
      usuario: {
        select: {
          email: true,
          activo: true
        }
      },
      rutinas: {
        select: {
          id: true,
          nombre: true,
          objetivo: true,
          createdAt: true
        }
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
 * Actualizar perfil de entrenador
 */
export const actualizar = async (id, data) => {
  const { nombres, apellidos, especialidad, certificaciones, telefono, bio } = data
  
  const entrenador = await prisma.entrenador.update({
    where: { id },
    data: {
      nombres,
      apellidos,
      especialidad,
      certificaciones,
      telefono,
      bio
    },
    include: {
      usuario: {
        select: {
          id: true,
          email: true,
          rol: true,
          activo: true
        }
      }
    }
  })
  
  return entrenador
}

/**
 * Obtener clientes asignados a un entrenador
 */
export const obtenerClientes = (entrenadorId) => {
  return prisma.asignacionRutina.findMany({
    where: {
      entrenadorId,
      activa: true
    },
    include: {
      cliente: {
        include: {
          usuario: {
            select: {
              email: true
            }
          }
        }
      },
      rutina: {
        select: {
          nombre: true,
          objetivo: true
        }
      }
    },
    orderBy: { fechaInicio: 'desc' }
  })
}

/**
 * Obtener estadísticas del entrenador
 */
export const obtenerEstadisticas = async (entrenadorId) => {
  const [totalRutinas, clientesActivos, totalAsignaciones] = await Promise.all([
    prisma.rutina.count({ where: { entrenadorId } }),
    prisma.asignacionRutina.count({ where: { entrenadorId, activa: true } }),
    prisma.asignacionRutina.count({ where: { entrenadorId } })
  ])

  return {
    totalRutinas,
    clientesActivos,
    totalAsignaciones
  }
}
