import { prisma } from '../config/prisma.js'

export const listar = () => prisma.cliente.findMany({ 
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
            id: true,
            nombre: true,
            objetivo: true
          }
        }
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

export const actualizar = async (id, data) => {
  const { nombres, apellidos, telefono, fechaNacimiento, genero, direccion, plan, peso, altura } = data
  
  // Get current cliente data to check if weight changed
  const clienteActual = await prisma.cliente.findUnique({ where: { id } })
  
  // Update cliente data
  const cliente = await prisma.cliente.update({ 
    where: { id }, 
    data: {
      nombres,
      apellidos,
      telefono,
      fechaNacimiento: fechaNacimiento ? new Date(fechaNacimiento) : undefined,
      genero,
      direccion,
      plan,
      peso: peso !== undefined ? parseFloat(peso) : undefined,
      altura: altura !== undefined ? parseFloat(altura) : undefined
    },
    include: {
      usuario: {
        select: {
          id: true,
          email: true,
          rol: true,
          activo: true
        }
      }
    }
  })
  
  // If weight was updated and different from current, create a progress record
  if (peso !== undefined && parseFloat(peso) !== clienteActual.peso) {
    await prisma.registroProgreso.create({
      data: {
        clienteId: id,
        peso: parseFloat(peso),
        notas: 'Peso actualizado desde el perfil'
      }
    })
  }
  
  return cliente
}

export const eliminar = (id) => prisma.cliente.delete({ where: { id } })
