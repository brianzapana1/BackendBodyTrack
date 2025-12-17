import { prisma } from '../config/prisma.js'

/**
 * Obtener estadísticas generales del sistema
 */
export const obtenerEstadisticas = async () => {
  const [
    totalClientes,
    totalEntrenadores,
    totalAdmins,
    totalSuscripcionesActivas
  ] = await Promise.all([
    prisma.usuario.count({ where: { rol: 'CLIENTE', activo: true } }),
    prisma.usuario.count({ where: { rol: 'ENTRENADOR', activo: true } }),
    prisma.usuario.count({ where: { rol: 'ADMIN', activo: true } }),
    prisma.suscripcion.count({ 
      where: { 
        estado: 'ACTIVA',
        fechaFin: { gte: new Date() }
      } 
    })
  ])

  return {
    usuarios: {
      clientes: totalClientes,
      entrenadores: totalEntrenadores,
      administradores: totalAdmins,
      total: totalClientes + totalEntrenadores + totalAdmins
    },
    suscripciones: {
      activas: totalSuscripcionesActivas
    }
  }
}

/**
 * Listar todos los usuarios (solo para admin)
 */
export const listarUsuarios = async (filtros = {}) => {
  const where = {}
  
  if (filtros.rol) {
    where.rol = filtros.rol
  }
  
  if (filtros.activo !== undefined) {
    where.activo = filtros.activo
  }

  const usuarios = await prisma.usuario.findMany({
    where,
    include: {
      cliente: true,
      entrenador: true
    },
    orderBy: { createdAt: 'desc' }
  })

  return usuarios
}

/**
 * Activar o desactivar un usuario
 */
export const toggleUsuarioActivo = async (usuarioId) => {
  const usuario = await prisma.usuario.findUnique({
    where: { id: usuarioId }
  })

  if (!usuario) {
    throw Object.assign(new Error('Usuario no encontrado'), { status: 404 })
  }

  const actualizado = await prisma.usuario.update({
    where: { id: usuarioId },
    data: { activo: !usuario.activo }
  })

  return actualizado
}
