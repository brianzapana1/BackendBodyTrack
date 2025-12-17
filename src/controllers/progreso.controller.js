import * as svc from '../services/progreso.service.js'

/**
 * GET /api/progreso/cliente/:clienteId
 */
export const listarPorCliente = async (req, res, next) => {
  try {
    const { clienteId } = req.params
    
    // Verificar que el usuario sea el propio cliente o un entrenador/admin
    if (req.user.rol === 'CLIENTE' && req.user.cliente?.id !== clienteId) {
      return res.status(403).json({ error: 'No autorizado' })
    }

    // Obtener el plan del cliente para aplicar límites
    let planUsuario = 'FREE'
    if (req.user.rol === 'CLIENTE') {
      planUsuario = req.user.cliente?.plan || 'FREE'
    }
    // Entrenadores/admins ven todo sin límites (considerados como PREMIUM)

    res.json(await svc.listarPorCliente(clienteId, planUsuario))
  } catch (e) {
    next(e)
  }
}

/**
 * GET /api/progreso/:id
 */
export const detalle = async (req, res, next) => {
  try {
    const registro = await svc.buscarPorId(req.params.id)
    if (!registro) {
      return res.status(404).json({ error: 'Registro no encontrado' })
    }

    // Verificar autorización
    if (req.user.rol === 'CLIENTE' && req.user.cliente?.id !== registro.clienteId) {
      return res.status(403).json({ error: 'No autorizado' })
    }

    res.json(registro)
  } catch (e) {
    next(e)
  }
}

/**
 * POST /api/progreso
 */
export const crear = async (req, res, next) => {
  try {
    const { clienteId } = req.body

    if (!clienteId) {
      return res.status(400).json({ error: 'clienteId es requerido' })
    }

    // Si es cliente, solo puede crear su propio registro
    if (req.user.rol === 'CLIENTE' && req.user.cliente?.id !== clienteId) {
      return res.status(403).json({ error: 'No autorizado' })
    }

    // Procesar fotos subidas
    const fotos = req.files ? req.files.map(f => `/uploads/${f.filename}`) : []

    const nuevo = await svc.crear({
      ...req.body,
      fotos
    })

    res.status(201).json(nuevo)
  } catch (e) {
    next(e)
  }
}

/**
 * PUT /api/progreso/:id
 */
export const actualizar = async (req, res, next) => {
  try {
    const registro = await svc.buscarPorId(req.params.id)
    if (!registro) {
      return res.status(404).json({ error: 'Registro no encontrado' })
    }

    // Verificar autorización
    if (req.user.rol === 'CLIENTE' && req.user.cliente?.id !== registro.clienteId) {
      return res.status(403).json({ error: 'No autorizado' })
    }

    // Procesar nuevas fotos
    let fotos = req.body.fotos || registro.fotos
    if (req.files && req.files.length > 0) {
      const nuevasFotos = req.files.map(f => `/uploads/${f.filename}`)
      fotos = [...fotos, ...nuevasFotos]
    }

    res.json(await svc.actualizar(req.params.id, {
      ...req.body,
      fotos
    }))
  } catch (e) {
    next(e)
  }
}

/**
 * DELETE /api/progreso/:id
 */
export const eliminar = async (req, res, next) => {
  try {
    const registro = await svc.buscarPorId(req.params.id)
    if (!registro) {
      return res.status(404).json({ error: 'Registro no encontrado' })
    }

    // Verificar autorización
    if (req.user.rol === 'CLIENTE' && req.user.cliente?.id !== registro.clienteId) {
      return res.status(403).json({ error: 'No autorizado' })
    }

    await svc.eliminar(req.params.id)
    res.status(204).end()
  } catch (e) {
    next(e)
  }
}

/**
 * GET /api/progreso/cliente/:clienteId/estadisticas
 */
export const obtenerEstadisticas = async (req, res, next) => {
  try {
    const { clienteId } = req.params

    // Verificar autorización
    if (req.user.rol === 'CLIENTE' && req.user.cliente?.id !== clienteId) {
      return res.status(403).json({ error: 'No autorizado' })
    }

    res.json(await svc.obtenerEstadisticas(clienteId))
  } catch (e) {
    next(e)
  }
}
