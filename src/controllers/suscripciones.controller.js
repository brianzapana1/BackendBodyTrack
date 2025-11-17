import * as svc from '../services/suscripciones.service.js'

const required = (obj, fields) => {
  for (const f of fields) {
    if (obj[f] == null || obj[f] === '') {
      throw Object.assign(new Error(`Campo requerido: ${f}`), { status: 400 })
    }
  }
}

/**
 * GET /api/suscripciones/cliente/:clienteId
 */
export const listarPorCliente = async (req, res, next) => {
  try {
    const { clienteId } = req.params

    // Solo el propio cliente o admin pueden ver las suscripciones
    if (req.user.rol === 'CLIENTE' && req.user.cliente?.id !== clienteId) {
      return res.status(403).json({ error: 'No autorizado' })
    }

    res.json(await svc.listarPorCliente(clienteId))
  } catch (e) {
    next(e)
  }
}

/**
 * GET /api/suscripciones/:id
 */
export const detalle = async (req, res, next) => {
  try {
    const suscripcion = await svc.buscarPorId(req.params.id)
    if (!suscripcion) {
      return res.status(404).json({ error: 'Suscripción no encontrada' })
    }

    // Verificar autorización
    if (req.user.rol === 'CLIENTE' && req.user.cliente?.id !== suscripcion.clienteId) {
      return res.status(403).json({ error: 'No autorizado' })
    }

    res.json(suscripcion)
  } catch (e) {
    next(e)
  }
}

/**
 * POST /api/suscripciones
 */
export const crear = async (req, res, next) => {
  try {
    required(req.body, ['clienteId', 'plan', 'monto'])

    // Si es cliente, solo puede crear su propia suscripción
    if (req.user.rol === 'CLIENTE' && req.user.cliente?.id !== req.body.clienteId) {
      return res.status(403).json({ error: 'No autorizado' })
    }

    const nueva = await svc.crear(req.body)
    res.status(201).json(nueva)
  } catch (e) {
    next(e)
  }
}

/**
 * POST /api/suscripciones/:id/cancelar
 */
export const cancelar = async (req, res, next) => {
  try {
    const suscripcion = await svc.buscarPorId(req.params.id)
    if (!suscripcion) {
      return res.status(404).json({ error: 'Suscripción no encontrada' })
    }

    // Solo el cliente dueño o admin pueden cancelar
    if (req.user.rol === 'CLIENTE' && req.user.cliente?.id !== suscripcion.clienteId) {
      return res.status(403).json({ error: 'No autorizado' })
    }

    res.json(await svc.cancelar(req.params.id))
  } catch (e) {
    next(e)
  }
}

/**
 * GET /api/suscripciones/cliente/:clienteId/activa
 */
export const obtenerSuscripcionActiva = async (req, res, next) => {
  try {
    const { clienteId } = req.params

    // Verificar autorización
    if (req.user.rol === 'CLIENTE' && req.user.cliente?.id !== clienteId) {
      return res.status(403).json({ error: 'No autorizado' })
    }

    const suscripcion = await svc.obtenerSuscripcionActiva(clienteId)
    
    if (!suscripcion) {
      return res.status(404).json({ error: 'No hay suscripción activa' })
    }

    res.json(suscripcion)
  } catch (e) {
    next(e)
  }
}

/**
 * POST /api/suscripciones/verificar-expiradas (Admin only)
 */
export const verificarExpiradas = async (req, res, next) => {
  try {
    const cantidad = await svc.verificarSuscripcionesExpiradas()
    res.json({ 
      mensaje: `Se actualizaron ${cantidad} suscripciones expiradas`,
      cantidad
    })
  } catch (e) {
    next(e)
  }
}

/**
 * GET /api/suscripciones/estadisticas (Admin only)
 */
export const obtenerEstadisticas = async (_req, res, next) => {
  try {
    res.json(await svc.obtenerEstadisticas())
  } catch (e) {
    next(e)
  }
}
