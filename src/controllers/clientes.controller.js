import * as svc from '../services/clientes.service.js'

/**
 * GET /api/clientes
 */
export const listar = async (_req, res, next) => {
  try { 
    res.json(await svc.listar()) 
  } catch (e) { 
    next(e) 
  }
}

/**
 * GET /api/clientes/:id
 */
export const detalle = async (req, res, next) => {
  try {
    const c = await svc.buscarPorId(req.params.id)
    if (!c) return res.status(404).json({ error: 'Cliente no encontrado' })
    
    // Solo el propio cliente o admin/entrenador pueden ver detalles
    if (req.user.rol === 'CLIENTE' && req.user.cliente?.id !== req.params.id) {
      return res.status(403).json({ error: 'No autorizado' })
    }
    
    res.json(c)
  } catch (e) { 
    next(e) 
  }
}

/**
 * PUT /api/clientes/:id
 */
export const actualizar = async (req, res, next) => {
  try { 
    // Solo el propio cliente o admin pueden actualizar
    if (req.user.rol === 'CLIENTE' && req.user.cliente?.id !== req.params.id) {
      return res.status(403).json({ error: 'No autorizado' })
    }
    
    res.json(await svc.actualizar(req.params.id, req.body)) 
  } catch (e) { 
    next(e) 
  }
}

/**
 * DELETE /api/clientes/:id (Solo Admin)
 */
export const eliminar = async (req, res, next) => {
  try { 
    await svc.eliminar(req.params.id)
    res.status(204).end() 
  } catch (e) { 
    next(e) 
  }
}
