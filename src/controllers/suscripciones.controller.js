import * as svc from '../services/suscripciones.service.js'

/**
 * GET /api/suscripciones/planes
 * Obtener todos los planes disponibles (público)
 */
export const obtenerPlanes = async (req, res, next) => {
  try {
    const planes = await svc.obtenerPlanes()
    res.json(planes)
  } catch (e) {
    next(e)
  }
}

/**
 * GET /api/suscripciones/mi-suscripcion
 * Obtener la suscripción activa del cliente autenticado
 */
export const obtenerMiSuscripcion = async (req, res, next) => {
  try {
    // Verificar que es un cliente
    if (req.user.rol !== 'CLIENTE') {
      return res.status(403).json({ error: 'Solo clientes pueden ver su suscripción' })
    }

    if (!req.user.cliente) {
      return res.status(404).json({ error: 'Perfil de cliente no encontrado' })
    }

    const resultado = await svc.obtenerMiSuscripcion(req.user.cliente.id)
    res.json(resultado)
  } catch (e) {
    next(e)
  }
}

/**
 * POST /api/suscripciones/contratar
 * Contratar un plan premium (simulación de pago)
 */
export const contratarPlan = async (req, res, next) => {
  try {
    // Verificar que es un cliente
    if (req.user.rol !== 'CLIENTE') {
      return res.status(403).json({ error: 'Solo clientes pueden contratar planes' })
    }

    if (!req.user.cliente) {
      return res.status(404).json({ error: 'Perfil de cliente no encontrado' })
    }

    const { plan, datosSimulacion } = req.body

    if (!plan) {
      return res.status(400).json({ error: 'El campo "plan" es requerido' })
    }

    const resultado = await svc.contratarPlan(
      req.user.cliente.id,
      plan,
      datosSimulacion
    )

    res.status(201).json(resultado)
  } catch (e) {
    next(e)
  }
}

/**
 * POST /api/suscripciones/cancelar
 * Cancelar la suscripción activa del cliente autenticado
 */
export const cancelarSuscripcion = async (req, res, next) => {
  try {
    // Verificar que es un cliente
    if (req.user.rol !== 'CLIENTE') {
      return res.status(403).json({ error: 'Solo clientes pueden cancelar su suscripción' })
    }

    if (!req.user.cliente) {
      return res.status(404).json({ error: 'Perfil de cliente no encontrado' })
    }

    const resultado = await svc.cancelarSuscripcion(req.user.cliente.id)
    res.json(resultado)
  } catch (e) {
    next(e)
  }
}

