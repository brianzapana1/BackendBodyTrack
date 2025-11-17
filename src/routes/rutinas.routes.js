import { Router } from 'express'
import * as ctrl from '../controllers/rutinas.controller.js'
import { requireAuth, requireRole } from '../middlewares/auth.js'

export const rutinas = Router()

// Rutas generales de rutinas
rutinas.get('/', requireAuth, ctrl.listar)
rutinas.get('/mi-rutina', requireAuth, requireRole('CLIENTE'), ctrl.obtenerMiRutina)
rutinas.get('/:id', requireAuth, ctrl.detalle)
rutinas.post('/', requireAuth, requireRole('ENTRENADOR', 'ADMIN'), ctrl.crear)
rutinas.put('/:id', requireAuth, requireRole('ENTRENADOR', 'ADMIN'), ctrl.actualizar)
rutinas.delete('/:id', requireAuth, requireRole('ENTRENADOR', 'ADMIN'), ctrl.eliminar)

// Gestión de ejercicios dentro de rutinas
rutinas.post('/:id/ejercicios', requireAuth, requireRole('ENTRENADOR', 'ADMIN'), ctrl.agregarEjercicio)
rutinas.put('/ejercicios/:ejercicioId', requireAuth, requireRole('ENTRENADOR', 'ADMIN'), ctrl.actualizarEjercicio)
rutinas.delete('/ejercicios/:ejercicioId', requireAuth, requireRole('ENTRENADOR', 'ADMIN'), ctrl.eliminarEjercicio)

// Asignación de rutinas a clientes
rutinas.post('/:id/asignar', requireAuth, requireRole('ENTRENADOR', 'ADMIN'), ctrl.asignarCliente)
rutinas.delete('/asignaciones/:id', requireAuth, requireRole('ENTRENADOR', 'ADMIN'), ctrl.desactivarAsignacion)
