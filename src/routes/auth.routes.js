import { Router } from 'express'
import * as ctrl from '../controllers/auth.controller.js'
import { requireAuth } from '../middlewares/auth.js'

export const auth = Router()

// Rutas públicas
auth.post('/registro/cliente', ctrl.registrarCliente)
auth.post('/registro/entrenador', ctrl.registrarEntrenador)
auth.post('/login', ctrl.login)

// Rutas protegidas
auth.get('/perfil', requireAuth, ctrl.obtenerPerfil)
auth.post('/cambiar-password', requireAuth, ctrl.cambiarPassword)
