import { prisma } from '../config/prisma.js'

/**
 * Listar posts del foro
 */
export const listarPosts = (filtros = {}) => {
  return prisma.foroPost.findMany({
    include: {
      usuario: {
        select: {
          email: true,
          rol: true,
          cliente: {
            select: {
              nombres: true,
              apellidos: true
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
      comentarios: {
        select: {
          id: true
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: filtros.limite || 50
  })
}

/**
 * Buscar post por ID con comentarios
 */
export const buscarPostPorId = (id) => {
  return prisma.foroPost.findUnique({
    where: { id },
    include: {
      usuario: {
        select: {
          email: true,
          rol: true,
          cliente: {
            select: {
              nombres: true,
              apellidos: true
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
      comentarios: {
        include: {
          usuario: {
            select: {
              email: true,
              rol: true,
              cliente: {
                select: {
                  nombres: true,
                  apellidos: true
                }
              },
              entrenador: {
                select: {
                  nombres: true,
                  apellidos: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'asc' }
      }
    }
  })
}

/**
 * Crear post
 */
export const crearPost = (data) => {
  const { usuarioId, titulo, contenido } = data
  return prisma.foroPost.create({
    data: {
      usuarioId,
      titulo,
      contenido
    },
    include: {
      usuario: {
        select: {
          email: true,
          rol: true
        }
      }
    }
  })
}

/**
 * Actualizar post
 */
export const actualizarPost = (id, data) => {
  const { titulo, contenido } = data
  return prisma.foroPost.update({
    where: { id },
    data: {
      titulo,
      contenido
    }
  })
}

/**
 * Eliminar post
 */
export const eliminarPost = (id) => {
  return prisma.foroPost.delete({ where: { id } })
}

/**
 * Crear comentario en un post
 */
export const crearComentario = (data) => {
  const { postId, usuarioId, contenido } = data
  return prisma.foroComentario.create({
    data: {
      postId,
      usuarioId,
      contenido
    },
    include: {
      usuario: {
        select: {
          email: true,
          rol: true,
          cliente: {
            select: {
              nombres: true,
              apellidos: true
            }
          },
          entrenador: {
            select: {
              nombres: true,
              apellidos: true
            }
          }
        }
      }
    }
  })
}

/**
 * Actualizar comentario
 */
export const actualizarComentario = (id, contenido) => {
  return prisma.foroComentario.update({
    where: { id },
    data: { contenido }
  })
}

/**
 * Eliminar comentario
 */
export const eliminarComentario = (id) => {
  return prisma.foroComentario.delete({ where: { id } })
}

/**
 * Buscar comentario por ID
 */
export const buscarComentarioPorId = (id) => {
  return prisma.foroComentario.findUnique({
    where: { id }
  })
}
