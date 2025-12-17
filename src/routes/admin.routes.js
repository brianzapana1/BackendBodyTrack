import { Router } from 'express'
import * as ctrl from '../controllers/admin.controller.js'
import { requireAuth, requireRole } from '../middlewares/auth.js'

export const admin = Router()

// Todas las rutas requieren autenticación y rol ADMIN
admin.use(requireAuth, requireRole('ADMIN'))

admin.get('/estadisticas', ctrl.obtenerEstadisticas)
admin.get('/usuarios', ctrl.listarUsuarios)
admin.patch('/usuarios/:id/toggle-activo', ctrl.toggleUsuarioActivo)
