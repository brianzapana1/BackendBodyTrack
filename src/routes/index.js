import { Router } from 'express'
import { auth } from './auth.routes.js'
import { clientes } from './clientes.routes.js'
import { entrenadores } from './entrenadores.routes.js'
import { progreso } from './progreso.routes.js'
import { ejercicios } from './ejercicios.routes.js'
import { rutinas } from './rutinas.routes.js'
import { foro } from './foro.routes.js'
import { suscripciones } from './suscripciones.routes.js'
import { admin } from './admin.routes.js'

export const router = Router()

// Rutas de autenticación (públicas y protegidas)
router.use('/auth', auth)

// Rutas protegidas de recursos
router.use('/admin', admin)
router.use('/clientes', clientes)
router.use('/entrenadores', entrenadores)
router.use('/progreso', progreso)
router.use('/ejercicios', ejercicios)
router.use('/rutinas', rutinas)
router.use('/foro', foro)
router.use('/suscripciones', suscripciones)
