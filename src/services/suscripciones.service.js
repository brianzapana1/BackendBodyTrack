import { prisma } from '../config/prisma.js'

// Definición de planes con precios y características
const PLANES = {
  FREE: {
    nombre: 'FREE',
    descripcion: 'Plan gratuito con acceso a rutinas genéricas',
    precio: 0,
    caracteristicas: [
      'Acceso a rutinas genéricas',
      'Historial de progreso limitado (3 meses)',
      'Foro comunitario'
    ]
  },
  PREMIUM: {
    nombre: 'PREMIUM',
    descripcion: 'Plan premium con rutinas personalizadas',
    precio: 29.99,
    caracteristicas: [
      'Rutinas personalizadas por entrenador',
      'Historial de progreso ilimitado',
      'Foro comunitario',
      'Soporte prioritario',
      'Seguimiento personalizado'
    ]
  }
}

/**
 * Obtener todos los planes disponibles
 */
export const obtenerPlanes = async () => {
  return Object.values(PLANES)
}

/**
 * Obtener la suscripción activa de un cliente
 */
export const obtenerMiSuscripcion = async (clienteId) => {
  // Obtener el plan actual del cliente
  const cliente = await prisma.cliente.findUnique({
    where: { id: clienteId },
    select: { plan: true }
  })

  if (!cliente) {
    throw Object.assign(new Error('Cliente no encontrado'), { status: 404 })
  }

  // Buscar la suscripción activa más reciente
  const suscripcion = await prisma.suscripcion.findFirst({
    where: {
      clienteId,
      estado: 'ACTIVA'
    },
    orderBy: {
      fechaInicio: 'desc'
    }
  })

  // Construir respuesta
  const planInfo = PLANES[cliente.plan]
  
  return {
    planActual: cliente.plan,
    planInfo,
    suscripcion: suscripcion || null
  }
}

/**
 * Contratar un plan (simulación de pago)
 */
export const contratarPlan = async (clienteId, plan, datosSimulacion) => {
  // Validar que el plan existe
  if (!PLANES[plan]) {
    throw Object.assign(new Error('Plan no válido'), { status: 400 })
  }

  // Validar que no sea el plan FREE
  if (plan === 'FREE') {
    throw Object.assign(new Error('El plan FREE no requiere contratación'), { status: 400 })
  }

  // Obtener cliente
  const cliente = await prisma.cliente.findUnique({
    where: { id: clienteId }
  })

  if (!cliente) {
    throw Object.assign(new Error('Cliente no encontrado'), { status: 404 })
  }

  // Si ya tiene PREMIUM activo, no permitir contratar nuevamente
  if (cliente.plan === 'PREMIUM') {
    const suscripcionActiva = await prisma.suscripcion.findFirst({
      where: {
        clienteId,
        estado: 'ACTIVA'
      }
    })

    if (suscripcionActiva && suscripcionActiva.fechaFin > new Date()) {
      throw Object.assign(
        new Error('Ya tienes una suscripción PREMIUM activa'),
        { status: 400 }
      )
    }
  }

  // Simular procesamiento de pago (aquí se haría la integración real)
  const pagoExitoso = datosSimulacion?.exito !== false // Por defecto exitoso

  if (!pagoExitoso) {
    throw Object.assign(
      new Error('El pago fue rechazado. Por favor, intenta nuevamente.'),
      { status: 400 }
    )
  }

  // Calcular fecha de fin (30 días desde hoy)
  const fechaInicio = new Date()
  const fechaFin = new Date()
  fechaFin.setDate(fechaFin.getDate() + 30)

  // Crear transacción para actualizar cliente y crear suscripción
  const resultado = await prisma.$transaction(async (tx) => {
    // Cancelar suscripciones anteriores
    await tx.suscripcion.updateMany({
      where: {
        clienteId,
        estado: 'ACTIVA'
      },
      data: {
        estado: 'CANCELADA'
      }
    })

    // Actualizar plan del cliente
    const clienteActualizado = await tx.cliente.update({
      where: { id: clienteId },
      data: { plan }
    })

    // Crear nueva suscripción
    const nuevaSuscripcion = await tx.suscripcion.create({
      data: {
        clienteId,
        plan,
        estado: 'ACTIVA',
        fechaInicio,
        fechaFin,
        monto: PLANES[plan].precio,
        metodoPago: datosSimulacion?.metodoPago || 'Simulación Web'
      }
    })

    return { cliente: clienteActualizado, suscripcion: nuevaSuscripcion }
  })

  return {
    mensaje: 'Suscripción contratada exitosamente',
    ...resultado,
    planInfo: PLANES[plan]
  }
}

/**
 * Cancelar suscripción actual
 */
export const cancelarSuscripcion = async (clienteId) => {
  // Obtener cliente
  const cliente = await prisma.cliente.findUnique({
    where: { id: clienteId }
  })

  if (!cliente) {
    throw Object.assign(new Error('Cliente no encontrado'), { status: 404 })
  }

  // Si ya está en FREE, no hay nada que cancelar
  if (cliente.plan === 'FREE') {
    throw Object.assign(
      new Error('No tienes una suscripción premium activa para cancelar'),
      { status: 400 }
    )
  }

  // Buscar suscripción activa
  const suscripcionActiva = await prisma.suscripcion.findFirst({
    where: {
      clienteId,
      estado: 'ACTIVA'
    }
  })

  if (!suscripcionActiva) {
    throw Object.assign(
      new Error('No se encontró una suscripción activa'),
      { status: 404 }
    )
  }

  // Cancelar en transacción
  const resultado = await prisma.$transaction(async (tx) => {
    // Actualizar cliente a FREE
    const clienteActualizado = await tx.cliente.update({
      where: { id: clienteId },
      data: { plan: 'FREE' }
    })

    // Marcar suscripción como cancelada
    const suscripcionCancelada = await tx.suscripcion.update({
      where: { id: suscripcionActiva.id },
      data: { estado: 'CANCELADA' }
    })

    // Cancelar todas las asignaciones de rutinas personalizadas
    await tx.asignacionRutina.updateMany({
      where: {
        clienteId,
        rutina: {
          esGenerica: false
        }
      },
      data: {
        activa: false
      }
    })

    return { cliente: clienteActualizado, suscripcion: suscripcionCancelada }
  })

  return {
    mensaje: 'Suscripción cancelada. Has vuelto al plan FREE',
    ...resultado
  }
}
