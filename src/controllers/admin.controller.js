import * as svc from '../services/admin.service.js'

/**
 * GET /api/admin/estadisticas
 */
export const obtenerEstadisticas = async (req, res, next) => {
  try {
    const stats = await svc.obtenerEstadisticas()
    res.json(stats)
  } catch (e) {
    next(e)
  }
}

/**
 * GET /api/admin/usuarios
 */
export const listarUsuarios = async (req, res, next) => {
  try {
    const filtros = {
      rol: req.query.rol,
      activo: req.query.activo === 'true' ? true : req.query.activo === 'false' ? false : undefined
    }
    const usuarios = await svc.listarUsuarios(filtros)
    res.json(usuarios)
  } catch (e) {
    next(e)
  }
}

/**
 * PATCH /api/admin/usuarios/:id/toggle-activo
 */
export const toggleUsuarioActivo = async (req, res, next) => {
  try {
    const usuario = await svc.toggleUsuarioActivo(req.params.id)
    res.json(usuario)
  } catch (e) {
    next(e)
  }
}
