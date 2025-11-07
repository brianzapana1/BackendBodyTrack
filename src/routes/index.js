import { Router } from 'express'
import { clientes } from './clientes.routes.js'

export const router = Router()
router.use('/clientes', clientes)
