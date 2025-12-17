import { prisma } from '../config/prisma.js'

/**
 * Normalizar texto removiendo acentos para búsqueda
 */
const normalizarTexto = (texto) => {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

/**
 * Listar todos los ejercicios
 */
export const listar = async (filtros = {}) => {
  const where = {}
  
  if (filtros.grupoMuscular) {
    where.grupoMuscular = filtros.grupoMuscular
  }
  
  if (filtros.equipamiento) {
    where.equipamiento = filtros.equipamiento
  }

  // Si hay búsqueda, primero obtener todos los ejercicios que cumplan otros filtros
  // y luego filtrar por búsqueda con normalización
  let ejercicios = await prisma.ejercicio.findMany({
    where,
    orderBy: { nombre: 'asc' }
  })

  // Filtrar por búsqueda sin acentos si se proporciona
  if (filtros.busqueda) {
    const busquedaNormalizada = normalizarTexto(filtros.busqueda)
    ejercicios = ejercicios.filter(ej => {
      const nombreNormalizado = normalizarTexto(ej.nombre || '')
      const descripcionNormalizada = normalizarTexto(ej.descripcion || '')
      return nombreNormalizado.includes(busquedaNormalizada) || 
             descripcionNormalizada.includes(busquedaNormalizada)
    })
  }

  return ejercicios
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
