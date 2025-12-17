import { Router } from 'express'
import * as ctrl from '../controllers/suscripciones.controller.js'
import { requireAuth } from '../middlewares/auth.js'

export const suscripciones = Router()

// Rutas públicas (sin autenticación)
suscripciones.get('/planes', ctrl.obtenerPlanes)

// Rutas protegidas (requieren autenticación)
suscripciones.get('/mi-suscripcion', requireAuth, ctrl.obtenerMiSuscripcion)
suscripciones.post('/contratar', requireAuth, ctrl.contratarPlan)
suscripciones.post('/cancelar', requireAuth, ctrl.cancelarSuscripcion)

