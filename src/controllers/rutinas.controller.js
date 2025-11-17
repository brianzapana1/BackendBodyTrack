import * as svc from '../services/rutinas.service.js'

const required = (obj, fields) => {
  for (const f of fields) {
    if (obj[f] == null || obj[f] === '') {
      throw Object.assign(new Error(`Campo requerido: ${f}`), { status: 400 })
    }
  }
}

/**
 * GET /api/rutinas
 */
export const listar = async (req, res, next) => {
  try {
    const filtros = {
      entrenadorId: req.query.entrenadorId
    }
    
    // Si es entrenador, solo puede ver sus propias rutinas (a menos que sea admin)
    if (req.user.rol === 'ENTRENADOR' && !req.query.entrenadorId) {
      filtros.entrenadorId = req.user.entrenador?.id
    }

    res.json(await svc.listar(filtros))
  } catch (e) {
    next(e)
  }
}

/**
 * GET /api/rutinas/:id
 */
export const detalle = async (req, res, next) => {
  try {
    const rutina = await svc.buscarPorId(req.params.id)
    if (!rutina) {
      return res.status(404).json({ error: 'Rutina no encontrada' })
    }

    // Verificar permisos
    if (req.user.rol === 'ENTRENADOR' && rutina.entrenadorId !== req.user.entrenador?.id) {
      return res.status(403).json({ error: 'No autorizado' })
    }

    res.json(rutina)
  } catch (e) {
    next(e)
  }
}

/**
 * POST /api/rutinas
 */
export const crear = async (req, res, next) => {
  try {
    required(req.body, ['nombre', 'entrenadorId'])

    // El entrenador solo puede crear sus propias rutinas
    if (req.user.rol === 'ENTRENADOR' && req.body.entrenadorId !== req.user.entrenador?.id) {
      return res.status(403).json({ error: 'No autorizado' })
    }

    const nueva = await svc.crear(req.body)
    res.status(201).json(nueva)
  } catch (e) {
    next(e)
  }
}

/**
 * PUT /api/rutinas/:id
 */
export const actualizar = async (req, res, next) => {
  try {
    const rutina = await svc.buscarPorId(req.params.id)
    if (!rutina) {
      return res.status(404).json({ error: 'Rutina no encontrada' })
    }

    // Solo el creador puede actualizar
    if (req.user.rol === 'ENTRENADOR' && rutina.entrenadorId !== req.user.entrenador?.id) {
      return res.status(403).json({ error: 'No autorizado' })
    }

    res.json(await svc.actualizar(req.params.id, req.body))
  } catch (e) {
    next(e)
  }
}

/**
 * DELETE /api/rutinas/:id
 */
export const eliminar = async (req, res, next) => {
  try {
    const rutina = await svc.buscarPorId(req.params.id)
    if (!rutina) {
      return res.status(404).json({ error: 'Rutina no encontrada' })
    }

    // Solo el creador puede eliminar
    if (req.user.rol === 'ENTRENADOR' && rutina.entrenadorId !== req.user.entrenador?.id) {
      return res.status(403).json({ error: 'No autorizado' })
    }

    await svc.eliminar(req.params.id)
    res.status(204).end()
  } catch (e) {
    next(e)
  }
}

/**
 * POST /api/rutinas/:id/ejercicios
 */
export const agregarEjercicio = async (req, res, next) => {
  try {
    required(req.body, ['ejercicioId', 'series', 'repeticiones'])
    
    const rutina = await svc.buscarPorId(req.params.id)
    if (!rutina) {
      return res.status(404).json({ error: 'Rutina no encontrada' })
    }

    if (req.user.rol === 'ENTRENADOR' && rutina.entrenadorId !== req.user.entrenador?.id) {
      return res.status(403).json({ error: 'No autorizado' })
    }

    const nuevoEjercicio = await svc.agregarEjercicio({
      ...req.body,
      rutinaId: req.params.id
    })

    res.status(201).json(nuevoEjercicio)
  } catch (e) {
    next(e)
  }
}

/**
 * PUT /api/rutinas/ejercicios/:ejercicioId
 */
export const actualizarEjercicio = async (req, res, next) => {
  try {
    res.json(await svc.actualizarEjercicio(req.params.ejercicioId, req.body))
  } catch (e) {
    next(e)
  }
}

/**
 * DELETE /api/rutinas/ejercicios/:ejercicioId
 */
export const eliminarEjercicio = async (req, res, next) => {
  try {
    await svc.eliminarEjercicio(req.params.ejercicioId)
    res.status(204).end()
  } catch (e) {
    next(e)
  }
}

/**
 * POST /api/rutinas/:id/asignar
 */
export const asignarCliente = async (req, res, next) => {
  try {
    required(req.body, ['clienteId', 'entrenadorId'])

    const rutina = await svc.buscarPorId(req.params.id)
    if (!rutina) {
      return res.status(404).json({ error: 'Rutina no encontrada' })
    }

    // Solo el entrenador propietario puede asignar
    if (req.user.rol === 'ENTRENADOR' && rutina.entrenadorId !== req.user.entrenador?.id) {
      return res.status(403).json({ error: 'No autorizado' })
    }

    const asignacion = await svc.asignarCliente({
      ...req.body,
      rutinaId: req.params.id
    })

    res.status(201).json(asignacion)
  } catch (e) {
    next(e)
  }
}

/**
 * GET /api/rutinas/mi-rutina (para clientes)
 */
export const obtenerMiRutina = async (req, res, next) => {
  try {
    if (req.user.rol !== 'CLIENTE') {
      return res.status(403).json({ error: 'Solo disponible para clientes' })
    }

    const asignacion = await svc.obtenerRutinaActiva(req.user.cliente?.id)
    
    if (!asignacion) {
      return res.status(404).json({ error: 'No tienes rutina asignada actualmente' })
    }

    res.json(asignacion)
  } catch (e) {
    next(e)
  }
}

/**
 * DELETE /api/rutinas/asignaciones/:id
 */
export const desactivarAsignacion = async (req, res, next) => {
  try {
    await svc.desactivarAsignacion(req.params.id)
    res.status(204).end()
  } catch (e) {
    next(e)
  }
}
