import jwt from 'jsonwebtoken'
import { prisma } from '../config/prisma.js'

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key-change-in-production'

/**
 * Middleware para validar JWT y adjuntar usuario al request
 */
export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token no proporcionado' })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET)

    // Buscar usuario y verificar que esté activo
    const usuario = await prisma.usuario.findUnique({
      where: { id: decoded.id },
      include: {
        cliente: true,
        entrenador: true
      }
    })

    if (!usuario || !usuario.activo) {
      return res.status(401).json({ error: 'Usuario no válido o inactivo' })
    }

    req.user = usuario
    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido' })
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' })
    }
    next(error)
  }
}

/**
 * Middleware para verificar que el usuario tenga alguno de los roles permitidos
 * @param {...string} rolesPermitidos - Lista de roles permitidos (CLIENTE, ENTRENADOR, ADMIN)
 */
export const requireRole = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' })
    }

    if (!rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({ error: 'No tienes permiso para acceder a este recurso' })
    }

    next()
  }
}

/**
 * Middleware opcional - adjunta usuario si hay token, pero no falla si no hay
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      return next()
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET)

    const usuario = await prisma.usuario.findUnique({
      where: { id: decoded.id },
      include: {
        cliente: true,
        entrenador: true
      }
    })

    if (usuario && usuario.activo) {
      req.user = usuario
    }
  } catch (error) {
    // Ignorar errores en auth opcional
  }
  next()
}
