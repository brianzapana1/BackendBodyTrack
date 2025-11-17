import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../config/prisma.js'

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key-change-in-production'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

/**
 * Registrar un nuevo usuario Cliente
 */
export const registrarCliente = async (data) => {
  const { email, password, dni, nombres, apellidos, telefono, fechaNacimiento, genero, direccion } = data

  // Verificar si ya existe
  const existente = await prisma.usuario.findUnique({ where: { email } })
  if (existente) {
    throw Object.assign(new Error('El email ya está registrado'), { status: 400 })
  }

  const existeDni = await prisma.cliente.findUnique({ where: { dni } })
  if (existeDni) {
    throw Object.assign(new Error('El DNI ya está registrado'), { status: 400 })
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Crear usuario y cliente en transacción
  const usuario = await prisma.usuario.create({
    data: {
      email,
      password: hashedPassword,
      rol: 'CLIENTE',
      cliente: {
        create: {
          dni,
          nombres,
          apellidos,
          telefono,
          fechaNacimiento: fechaNacimiento ? new Date(fechaNacimiento) : null,
          genero,
          direccion,
          plan: 'BASICO'
        }
      }
    },
    include: {
      cliente: true
    }
  })

  const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })

  return {
    token,
    usuario: {
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
      cliente: usuario.cliente
    }
  }
}

/**
 * Registrar un nuevo usuario Entrenador
 */
export const registrarEntrenador = async (data) => {
  const { email, password, nombres, apellidos, especialidad, certificaciones, telefono, bio } = data

  const existente = await prisma.usuario.findUnique({ where: { email } })
  if (existente) {
    throw Object.assign(new Error('El email ya está registrado'), { status: 400 })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const usuario = await prisma.usuario.create({
    data: {
      email,
      password: hashedPassword,
      rol: 'ENTRENADOR',
      entrenador: {
        create: {
          nombres,
          apellidos,
          especialidad,
          certificaciones,
          telefono,
          bio
        }
      }
    },
    include: {
      entrenador: true
    }
  })

  const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })

  return {
    token,
    usuario: {
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
      entrenador: usuario.entrenador
    }
  }
}

/**
 * Login
 */
export const login = async (email, password) => {
  const usuario = await prisma.usuario.findUnique({
    where: { email },
    include: {
      cliente: true,
      entrenador: true
    }
  })

  if (!usuario) {
    throw Object.assign(new Error('Credenciales inválidas'), { status: 401 })
  }

  if (!usuario.activo) {
    throw Object.assign(new Error('Usuario inactivo'), { status: 403 })
  }

  const validPassword = await bcrypt.compare(password, usuario.password)
  if (!validPassword) {
    throw Object.assign(new Error('Credenciales inválidas'), { status: 401 })
  }

  const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })

  // No devolver el password
  const { password: _, ...usuarioSinPassword } = usuario

  return {
    token,
    usuario: usuarioSinPassword
  }
}

/**
 * Obtener perfil del usuario autenticado
 */
export const obtenerPerfil = async (usuarioId) => {
  const usuario = await prisma.usuario.findUnique({
    where: { id: usuarioId },
    include: {
      cliente: true,
      entrenador: true
    }
  })

  if (!usuario) {
    throw Object.assign(new Error('Usuario no encontrado'), { status: 404 })
  }

  const { password: _, ...usuarioSinPassword } = usuario
  return usuarioSinPassword
}

/**
 * Cambiar contraseña
 */
export const cambiarPassword = async (usuarioId, passwordActual, passwordNuevo) => {
  const usuario = await prisma.usuario.findUnique({ where: { id: usuarioId } })

  if (!usuario) {
    throw Object.assign(new Error('Usuario no encontrado'), { status: 404 })
  }

  const validPassword = await bcrypt.compare(passwordActual, usuario.password)
  if (!validPassword) {
    throw Object.assign(new Error('Contraseña actual incorrecta'), { status: 400 })
  }

  const hashedPassword = await bcrypt.hash(passwordNuevo, 10)

  await prisma.usuario.update({
    where: { id: usuarioId },
    data: { password: hashedPassword }
  })

  return { mensaje: 'Contraseña actualizada correctamente' }
}
