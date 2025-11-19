import { Router } from 'express'
import * as ctrl from '../controllers/clientes.controller.js'
import { requireAuth, requireRole } from '../middlewares/auth.js'

export const clientes = Router()
clientes.get('/', requireAuth, requireRole('ENTRENADOR', 'ADMIN'), ctrl.listar)
clientes.get('/:id', requireAuth, ctrl.detalle)
clientes.put('/:id', requireAuth, ctrl.actualizar)
clientes.delete('/:id', requireAuth, requireRole('ADMIN'), ctrl.eliminar)
