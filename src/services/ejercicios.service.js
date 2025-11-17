import { prisma } from '../config/prisma.js'

/**
 * Listar todos los ejercicios
 */
export const listar = (filtros = {}) => {
  const where = {}
  
  if (filtros.grupoMuscular) {
    where.grupoMuscular = filtros.grupoMuscular
  }
  
  if (filtros.equipamiento) {
    where.equipamiento = filtros.equipamiento
  }

  if (filtros.busqueda) {
    where.OR = [
      { nombre: { contains: filtros.busqueda, mode: 'insensitive' } },
      { descripcion: { contains: filtros.busqueda, mode: 'insensitive' } }
    ]
  }

  return prisma.ejercicio.findMany({
    where,
    orderBy: { nombre: 'asc' }
  })
}

/**
 * Buscar ejercicio por ID
 */
export const buscarPorId = (id) => {
  return prisma.ejercicio.findUnique({
    where: { id }
  })
}

/**
 * Crear nuevo ejercicio
 */
export const crear = (data) => {
  return prisma.ejercicio.create({ data })
}

/**
 * Actualizar ejercicio
 */
export const actualizar = (id, data) => {
  return prisma.ejercicio.update({
    where: { id },
    data
  })
}

/**
 * Eliminar ejercicio
 */
export const eliminar = (id) => {
  return prisma.ejercicio.delete({ where: { id } })
}

/**
 * Obtener grupos musculares únicos
 */
export const obtenerGruposMusculares = async () => {
  const ejercicios = await prisma.ejercicio.findMany({
    select: { grupoMuscular: true },
    distinct: ['grupoMuscular']
  })
  return ejercicios.map(e => e.grupoMuscular).filter(Boolean)
}
