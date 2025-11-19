import { Router } from 'express'
import * as ctrl from '../controllers/suscripciones.controller.js'
import { requireAuth, requireRole } from '../middlewares/auth.js'

export const suscripciones = Router()

suscripciones.get('/cliente/:clienteId', requireAuth, ctrl.listarPorCliente)
suscripciones.get('/cliente/:clienteId/activa', requireAuth, ctrl.obtenerSuscripcionActiva)
suscripciones.get('/estadisticas', requireAuth, requireRole('ADMIN'), ctrl.obtenerEstadisticas)
suscripciones.get('/:id', requireAuth, ctrl.detalle)
suscripciones.post('/', requireAuth, ctrl.crear)
suscripciones.post('/:id/cancelar', requireAuth, ctrl.cancelar)
suscripciones.post('/verificar-expiradas', requireAuth, requireRole('ADMIN'), ctrl.verificarExpiradas)
