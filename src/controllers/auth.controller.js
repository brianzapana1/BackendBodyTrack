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
    
    // Set refresh token as HTTP-only cookie
    res.cookie('refreshToken', resultado.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })
    
    // Don't send refresh token in response body
    const { refreshToken, ...response } = resultado
    res.status(201).json(response)
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
    
    // Set refresh token as HTTP-only cookie
    res.cookie('refreshToken', resultado.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })
    
    // Don't send refresh token in response body
    const { refreshToken, ...response } = resultado
    res.status(201).json(response)
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
    
    // Set refresh token as HTTP-only cookie
    res.cookie('refreshToken', resultado.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })
    
    // Don't send refresh token in response body
    const { refreshToken, ...response } = resultado
    res.json(response)
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
    // Add nombres and apellidos from Usuario to root for easy access
    if (perfil.cliente) {
      perfil.nombres = perfil.cliente.nombres
      perfil.apellidos = perfil.cliente.apellidos
      perfil.telefono = perfil.cliente.telefono
    } else if (perfil.entrenador) {
      perfil.nombres = perfil.entrenador.nombres
      perfil.apellidos = perfil.entrenador.apellidos
      perfil.telefono = perfil.entrenador.telefono
    }
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

/**
 * POST /api/auth/refresh
 */
export const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken
    
    if (!refreshToken) {
      throw Object.assign(new Error('No se proporcionó token de actualización'), { status: 401 })
    }
    
    const resultado = await svc.refreshAccessToken(refreshToken)
    res.json(resultado)
  } catch (e) {
    next(e)
  }
}

/**
 * POST /api/auth/logout
 */
export const logout = async (req, res, next) => {
  try {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })
    res.json({ mensaje: 'Sesión cerrada correctamente' })
  } catch (e) {
    next(e)
  }
}
