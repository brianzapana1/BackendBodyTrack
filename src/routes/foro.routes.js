import { Router } from 'express'
import * as ctrl from '../controllers/foro.controller.js'
import { requireAuth } from '../middlewares/auth.js'

export const foro = Router()

// Gestión de posts
foro.get('/posts', requireAuth, ctrl.listarPosts)
foro.get('/posts/:id', requireAuth, ctrl.detallePost)
foro.post('/posts', requireAuth, ctrl.crearPost)
foro.put('/posts/:id', requireAuth, ctrl.actualizarPost)
foro.delete('/posts/:id', requireAuth, ctrl.eliminarPost)

// Gestión de comentarios
foro.post('/posts/:id/comentarios', requireAuth, ctrl.crearComentario)
foro.put('/comentarios/:id', requireAuth, ctrl.actualizarComentario)
foro.delete('/comentarios/:id', requireAuth, ctrl.eliminarComentario)
