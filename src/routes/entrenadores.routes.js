import { Router } from 'express'
import * as ctrl from '../controllers/entrenadores.controller.js'
import { requireAuth, requireRole } from '../middlewares/auth.js'

export const entrenadores = Router()

entrenadores.get('/', requireAuth, ctrl.listar)
entrenadores.get('/:id', requireAuth, ctrl.detalle)
entrenadores.put('/:id', requireAuth, requireRole('ENTRENADOR', 'ADMIN'), ctrl.actualizar)
entrenadores.get('/:id/clientes', requireAuth, requireRole('ENTRENADOR', 'ADMIN'), ctrl.obtenerClientes)
entrenadores.get('/:id/estadisticas', requireAuth, ctrl.obtenerEstadisticas)
