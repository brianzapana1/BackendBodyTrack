import { prisma } from '../config/prisma.js'

/**
 * Listar suscripciones de un cliente
 */
export const listarPorCliente = (clienteId) => {
  return prisma.suscripcion.findMany({
    where: { clienteId },
    orderBy: { fechaInicio: 'desc' }
  })
}

/**
 * Buscar suscripción por ID
 */
export const buscarPorId = (id) => {
  return prisma.suscripcion.findUnique({
    where: { id },
    include: {
      cliente: {
        select: {
          nombres: true,
          apellidos: true,
          usuario: {
            select: {
              email: true
            }
          }
        }
      }
    }
  })
}

/**
 * Crear nueva suscripción
 */
export const crear = async (data) => {
  const { clienteId, plan, monto, duracionMeses, metodoPago } = data

  const fechaInicio = new Date()
  const fechaFin = new Date()
  fechaFin.setMonth(fechaFin.getMonth() + (duracionMeses || 1))

  // Crear la suscripción
  const suscripcion = await prisma.suscripcion.create({
    data: {
      clienteId,
      plan,
      estado: 'ACTIVA',
      fechaInicio,
      fechaFin,
      monto: parseFloat(monto),
      metodoPago
    }
  })

  // Actualizar el plan del cliente
  await prisma.cliente.update({
    where: { id: clienteId },
    data: { plan }
  })

  return suscripcion
}

/**
 * Cancelar suscripción
 */
export const cancelar = async (id) => {
  const suscripcion = await prisma.suscripcion.update({
    where: { id },
    data: {
      estado: 'CANCELADA',
      fechaFin: new Date()
    }
  })

  // Volver el cliente a plan BASICO
  await prisma.cliente.update({
    where: { id: suscripcion.clienteId },
    data: { plan: 'BASICO' }
  })

  return suscripcion
}

/**
 * Obtener suscripción activa de un cliente
 */
export const obtenerSuscripcionActiva = (clienteId) => {
  return prisma.suscripcion.findFirst({
    where: {
      clienteId,
      estado: 'ACTIVA',
      fechaFin: {
        gte: new Date()
      }
    },
    orderBy: { fechaInicio: 'desc' }
  })
}

/**
 * Verificar y actualizar suscripciones expiradas
 */
export const verificarSuscripcionesExpiradas = async () => {
  const suscripcionesExpiradas = await prisma.suscripcion.findMany({
    where: {
      estado: 'ACTIVA',
      fechaFin: {
        lt: new Date()
      }
    }
  })

  for (const suscripcion of suscripcionesExpiradas) {
    await prisma.suscripcion.update({
      where: { id: suscripcion.id },
      data: { estado: 'EXPIRADA' }
    })

    await prisma.cliente.update({
      where: { id: suscripcion.clienteId },
      data: { plan: 'BASICO' }
    })
  }

  return suscripcionesExpiradas.length
}

/**
 * Obtener estadísticas de suscripciones
 */
export const obtenerEstadisticas = async () => {
  const [totalActivas, totalCanceladas, totalExpiradas, ingresoTotal] = await Promise.all([
    prisma.suscripcion.count({ where: { estado: 'ACTIVA' } }),
    prisma.suscripcion.count({ where: { estado: 'CANCELADA' } }),
    prisma.suscripcion.count({ where: { estado: 'EXPIRADA' } }),
    prisma.suscripcion.aggregate({
      where: { estado: 'ACTIVA' },
      _sum: { monto: true }
    })
  ])

  return {
    totalActivas,
    totalCanceladas,
    totalExpiradas,
    ingresoTotal: ingresoTotal._sum.monto || 0
  }
}
