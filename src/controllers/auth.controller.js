import * as svc from '../services/auth.service.js'

const required = (obj, fields) => {
  for (const f of fields) {
    if (obj[f] == null || obj[f] === '') {
      throw Object.assign(new Error(`Campo requerido: ${f}`), { status: 400 })
    }
  }
}

/**
 * POST /api/auth/registro/cliente
 */
export const registrarCliente = async (req, res, next) => {
  try {
    required(req.body, ['email', 'password', 'dni', 'nombres', 'apellidos'])
    const resultado = await svc.registrarCliente(req.body)
    res.status(201).json(resultado)
  } catch (e) {
    next(e)
  }
}

/**
 * POST /api/auth/registro/entrenador
 */
export const registrarEntrenador = async (req, res, next) => {
  try {
    required(req.body, ['email', 'password', 'nombres', 'apellidos'])
    const resultado = await svc.registrarEntrenador(req.body)
    res.status(201).json(resultado)
  } catch (e) {
    next(e)
  }
}

/**
 * POST /api/auth/login
 */
export const login = async (req, res, next) => {
  try {
    required(req.body, ['email', 'password'])
    const resultado = await svc.login(req.body.email, req.body.password)
    res.json(resultado)
  } catch (e) {
    next(e)
  }
}

/**
 * GET /api/auth/perfil
 */
export const obtenerPerfil = async (req, res, next) => {
  try {
    const perfil = await svc.obtenerPerfil(req.user.id)
    res.json(perfil)
  } catch (e) {
    next(e)
  }
}

/**
 * POST /api/auth/cambiar-password
 */
export const cambiarPassword = async (req, res, next) => {
  try {
    required(req.body, ['passwordActual', 'passwordNuevo'])
    const resultado = await svc.cambiarPassword(
      req.user.id,
      req.body.passwordActual,
      req.body.passwordNuevo
    )
    res.json(resultado)
  } catch (e) {
    next(e)
  }
}
