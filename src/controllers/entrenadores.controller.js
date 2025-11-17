import * as svc from '../services/entrenadores.service.js'

/**
 * GET /api/entrenadores
 */
export const listar = async (_req, res, next) => {
  try {
    res.json(await svc.listar())
  } catch (e) {
    next(e)
  }
}

/**
 * GET /api/entrenadores/:id
 */
export const detalle = async (req, res, next) => {
  try {
    const entrenador = await svc.buscarPorId(req.params.id)
    if (!entrenador) {
      return res.status(404).json({ error: 'Entrenador no encontrado' })
    }
    res.json(entrenador)
  } catch (e) {
    next(e)
  }
}

/**
 * PUT /api/entrenadores/:id
 */
export const actualizar = async (req, res, next) => {
  try {
    // Solo el propio entrenador puede actualizar su perfil
    if (req.user.rol === 'ENTRENADOR' && req.user.entrenador?.id !== req.params.id) {
      return res.status(403).json({ error: 'No puedes actualizar otro perfil' })
    }
    res.json(await svc.actualizar(req.params.id, req.body))
  } catch (e) {
    next(e)
  }
}

/**
 * GET /api/entrenadores/:id/clientes
 */
export const obtenerClientes = async (req, res, next) => {
  try {
    // Solo el entrenador puede ver sus propios clientes
    if (req.user.rol === 'ENTRENADOR' && req.user.entrenador?.id !== req.params.id) {
      return res.status(403).json({ error: 'No autorizado' })
    }
    res.json(await svc.obtenerClientes(req.params.id))
  } catch (e) {
    next(e)
  }
}

/**
 * GET /api/entrenadores/:id/estadisticas
 */
export const obtenerEstadisticas = async (req, res, next) => {
  try {
    res.json(await svc.obtenerEstadisticas(req.params.id))
  } catch (e) {
    next(e)
  }
}
