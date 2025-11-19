import { Router } from 'express'
import * as ctrl from '../controllers/progreso.controller.js'
import { requireAuth } from '../middlewares/auth.js'
import { upload } from '../config/multer.js'

export const progreso = Router()

progreso.get('/cliente/:clienteId', requireAuth, ctrl.listarPorCliente)
progreso.get('/cliente/:clienteId/estadisticas', requireAuth, ctrl.obtenerEstadisticas)
progreso.get('/:id', requireAuth, ctrl.detalle)
progreso.post('/', requireAuth, upload.array('fotos', 5), ctrl.crear)
progreso.put('/:id', requireAuth, upload.array('fotos', 5), ctrl.actualizar)
progreso.delete('/:id', requireAuth, ctrl.eliminar)
