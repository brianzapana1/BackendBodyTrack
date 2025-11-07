import * as svc from '../services/clientes.service.js'

const required = (obj, fields) => {
  for (const f of fields) if (obj[f] == null || obj[f] === '') throw Object.assign(new Error(`Campo requerido: ${f}`), { status: 400 })
}

export const listar = async (_req, res, next) => {
  try { res.json(await svc.listar()) } catch (e) { next(e) }
}

export const detalle = async (req, res, next) => {
  try {
    const c = await svc.buscarPorId(req.params.id)
    if (!c) return res.status(404).json({ error: 'Cliente no encontrado' })
    res.json(c)
  } catch (e) { next(e) }
}

export const crear = async (req, res, next) => {
  try {
    required(req.body, ['dni','nombres','apellidos','email'])
    const nuevo = await svc.crear(req.body)
    res.status(201).json(nuevo)
  } catch (e) { next(e) }
}

export const actualizar = async (req, res, next) => {
  try { res.json(await svc.actualizar(req.params.id, req.body)) } catch (e) { next(e) }
}

export const eliminar = async (req, res, next) => {
  try { await svc.eliminar(req.params.id); res.status(204).end() } catch (e) { next(e) }
}
