import { prisma } from '../config/prisma.js'

/**
 * Listar progreso de un cliente con límites según su plan
 */
export const listarPorCliente = async (clienteId, planUsuario = 'FREE') => {
  const where = { clienteId }
  
  // FREE users: solo últimos 3 meses
  if (planUsuario === 'FREE') {
    const tresMesesAtras = new Date()
    tresMesesAtras.setMonth(tresMesesAtras.getMonth() - 3)
    
    where.fecha = {
      gte: tresMesesAtras
    }
  }
  // PREMIUM users: sin límite de tiempo

  return prisma.registroProgreso.findMany({
    where,
    orderBy: { fecha: 'desc' }
  })
}

/**
 * Buscar registro por ID
 */
export const buscarPorId = (id) => {
  return prisma.registroProgreso.findUnique({
    where: { id },
    include: {
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
 * Crear nuevo registro de progreso
 */
export const crear = async (data) => {
  const {
    clienteId,
    peso,
    porcentajeGrasa,
    medidaPecho,
    medidaCintura,
    medidaCadera,
    medidaBrazo,
    medidaPierna,
    fotos,
    notas
  } = data

  // Crear el registro de progreso
  const registro = await prisma.registroProgreso.create({
    data: {
      clienteId,
      peso: peso ? parseFloat(peso) : null,
      porcentajeGrasa: porcentajeGrasa ? parseFloat(porcentajeGrasa) : null,
      medidaPecho: medidaPecho ? parseFloat(medidaPecho) : null,
      medidaCintura: medidaCintura ? parseFloat(medidaCintura) : null,
      medidaCadera: medidaCadera ? parseFloat(medidaCadera) : null,
      medidaBrazo: medidaBrazo ? parseFloat(medidaBrazo) : null,
      medidaPierna: medidaPierna ? parseFloat(medidaPierna) : null,
      fotos: fotos || [],
      notas
    }
  })

  // Si se registró peso, actualizar el peso actual del cliente
  if (peso) {
    await prisma.cliente.update({
      where: { id: clienteId },
      data: { peso: parseFloat(peso) }
    })
  }

  return registro
}

/**
 * Actualizar registro de progreso
 */
export const actualizar = (id, data) => {
  const {
    peso,
    porcentajeGrasa,
    medidaPecho,
    medidaCintura,
    medidaCadera,
    medidaBrazo,
    medidaPierna,
    fotos,
    notas
  } = data

  return prisma.registroProgreso.update({
    where: { id },
    data: {
      peso: peso ? parseFloat(peso) : undefined,
      porcentajeGrasa: porcentajeGrasa ? parseFloat(porcentajeGrasa) : undefined,
      medidaPecho: medidaPecho ? parseFloat(medidaPecho) : undefined,
      medidaCintura: medidaCintura ? parseFloat(medidaCintura) : undefined,
      medidaCadera: medidaCadera ? parseFloat(medidaCadera) : undefined,
      medidaBrazo: medidaBrazo ? parseFloat(medidaBrazo) : undefined,
      medidaPierna: medidaPierna ? parseFloat(medidaPierna) : undefined,
      fotos: fotos ? fotos : undefined,
      notas: notas !== undefined ? notas : undefined
    }
  })
}

/**
 * Eliminar registro de progreso
 */
export const eliminar = (id) => {
  return prisma.registroProgreso.delete({ where: { id } })
}

/**
 * Obtener estadísticas de progreso
 */
export const obtenerEstadisticas = async (clienteId) => {
  const registros = await prisma.registroProgreso.findMany({
    where: { clienteId },
    orderBy: { fecha: 'asc' },
    select: {
      fecha: true,
      peso: true,
      porcentajeGrasa: true
    }
  })

  if (registros.length === 0) {
    return { totalRegistros: 0 }
  }

  const primerRegistro = registros[0]
  const ultimoRegistro = registros[registros.length - 1]

  return {
    totalRegistros: registros.length,
    pesoInicial: primerRegistro.peso,
    pesoActual: ultimoRegistro.peso,
    diferenciaPeso: ultimoRegistro.peso && primerRegistro.peso 
      ? ultimoRegistro.peso - primerRegistro.peso 
      : null,
    grasaInicial: primerRegistro.porcentajeGrasa,
    grasaActual: ultimoRegistro.porcentajeGrasa,
    diferenciaGrasa: ultimoRegistro.porcentajeGrasa && primerRegistro.porcentajeGrasa
      ? ultimoRegistro.porcentajeGrasa - primerRegistro.porcentajeGrasa
      : null
  }
}
