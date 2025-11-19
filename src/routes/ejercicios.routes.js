import { Router } from 'express'
import * as ctrl from '../controllers/ejercicios.controller.js'
import { requireAuth, requireRole } from '../middlewares/auth.js'

export const ejercicios = Router()

// Cualquier usuario autenticado puede listar y ver ejercicios
ejercicios.get('/', requireAuth, ctrl.listar)
ejercicios.get('/grupos-musculares', requireAuth, ctrl.obtenerGruposMusculares)
ejercicios.get('/:id', requireAuth, ctrl.detalle)

// Solo entrenadores y admins pueden crear, actualizar y eliminar
ejercicios.post('/', requireAuth, requireRole('ENTRENADOR', 'ADMIN'), ctrl.crear)
ejercicios.put('/:id', requireAuth, requireRole('ENTRENADOR', 'ADMIN'), ctrl.actualizar)
ejercicios.delete('/:id', requireAuth, requireRole('ENTRENADOR', 'ADMIN'), ctrl.eliminar)
