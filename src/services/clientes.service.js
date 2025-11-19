import { prisma } from '../config/prisma.js'

export const listar = () => prisma.cliente.findMany({ 
  include: {
    usuario: {
      select: {
        email: true,
        activo: true
      }
    }
  },
  orderBy: { fechaRegistro: 'desc' } 
})

export const buscarPorId = (id) => prisma.cliente.findUnique({ 
  where: { id },
  include: {
    usuario: {
      select: {
        email: true,
        activo: true
      }
    },
    rutinasAsignadas: {
      where: { activa: true },
      include: {
        rutina: {
          select: {
            nombre: true,
            objetivo: true
          }
        },
        entrenador: {
          select: {
            nombres: true,
            apellidos: true
          }
        }
      }
    },
    suscripciones: {
      where: { estado: 'ACTIVA' },
      orderBy: { fechaInicio: 'desc' },
      take: 1
    }
  }
})

export const actualizar = (id, data) => {
  const { nombres, apellidos, telefono, fechaNacimiento, genero, direccion, plan } = data
  return prisma.cliente.update({ 
    where: { id }, 
    data: {
      nombres,
      apellidos,
      telefono,
      fechaNacimiento: fechaNacimiento ? new Date(fechaNacimiento) : undefined,
      genero,
      direccion,
      plan
    }
  })
}

export const eliminar = (id) => prisma.cliente.delete({ where: { id } })
