import { prisma } from '../config/prisma.js'

export const listar = () => prisma.cliente.findMany({ orderBy: { fechaRegistro: 'desc' } })
export const buscarPorId = (id) => prisma.cliente.findUnique({ where: { id } })
export const crear = (data) => prisma.cliente.create({ data })
export const actualizar = (id, data) => prisma.cliente.update({ where: { id }, data })
export const eliminar = (id) => prisma.cliente.delete({ where: { id } })
