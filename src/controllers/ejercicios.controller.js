import * as svc from '../services/ejercicios.service.js'

const required = (obj, fields) => {
  for (const f of fields) {
    if (obj[f] == null || obj[f] === '') {
      throw Object.assign(new Error(`Campo requerido: ${f}`), { status: 400 })
    }
  }
}

/**
 * GET /api/ejercicios
 */
export const listar = async (req, res, next) => {
  try {
    const filtros = {
      grupoMuscular: req.query.grupoMuscular,
      equipamiento: req.query.equipamiento,
      busqueda: req.query.busqueda
    }
    res.json(await svc.listar(filtros))
  } catch (e) {
    next(e)
  }
}

/**
 * GET /api/ejercicios/grupos-musculares
 */
export const obtenerGruposMusculares = async (_req, res, next) => {
  try {
    res.json(await svc.obtenerGruposMusculares())
  } catch (e) {
    next(e)
  }
}

/**
 * GET /api/ejercicios/:id
 */
export const detalle = async (req, res, next) => {
  try {
    const ejercicio = await svc.buscarPorId(req.params.id)
    if (!ejercicio) {
      return res.status(404).json({ error: 'Ejercicio no encontrado' })
    }
    res.json(ejercicio)
  } catch (e) {
    next(e)
  }
}

/**
 * POST /api/ejercicios
 */
export const crear = async (req, res, next) => {
  try {
    required(req.body, ['nombre', 'grupoMuscular'])
    const nuevo = await svc.crear(req.body)
    res.status(201).json(nuevo)
  } catch (e) {
    next(e)
  }
}

/**
 * PUT /api/ejercicios/:id
 */
export const actualizar = async (req, res, next) => {
  try {
    res.json(await svc.actualizar(req.params.id, req.body))
  } catch (e) {
    next(e)
  }
}

/**
 * DELETE /api/ejercicios/:id
 */
export const eliminar = async (req, res, next) => {
  try {
    await svc.eliminar(req.params.id)
    res.status(204).end()
  } catch (e) {
    next(e)
  }
}
