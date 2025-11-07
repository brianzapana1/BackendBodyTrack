import { Router } from 'express'
import * as ctrl from '../controllers/clientes.controller.js'

export const clientes = Router()
clientes.get('/', ctrl.listar)
clientes.get('/:id', ctrl.detalle)
clientes.post('/', ctrl.crear)
clientes.put('/:id', ctrl.actualizar)     // reemplazo total
clientes.patch('/:id', ctrl.actualizar)   // actualización parcial
clientes.delete('/:id', ctrl.eliminar)
