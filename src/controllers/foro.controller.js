import * as svc from '../services/foro.service.js'

const required = (obj, fields) => {
  for (const f of fields) {
    if (obj[f] == null || obj[f] === '') {
      throw Object.assign(new Error(`Campo requerido: ${f}`), { status: 400 })
    }
  }
}

/**
 * GET /api/foro/posts
 */
export const listarPosts = async (req, res, next) => {
  try {
    const filtros = {
      limite: req.query.limite ? parseInt(req.query.limite) : 50
    }
    res.json(await svc.listarPosts(filtros))
  } catch (e) {
    next(e)
  }
}

/**
 * GET /api/foro/posts/:id
 */
export const detallePost = async (req, res, next) => {
  try {
    const post = await svc.buscarPostPorId(req.params.id)
    if (!post) {
      return res.status(404).json({ error: 'Post no encontrado' })
    }
    res.json(post)
  } catch (e) {
    next(e)
  }
}

/**
 * POST /api/foro/posts
 */
export const crearPost = async (req, res, next) => {
  try {
    required(req.body, ['titulo', 'contenido'])
    
    const nuevoPost = await svc.crearPost({
      ...req.body,
      usuarioId: req.user.id
    })

    res.status(201).json(nuevoPost)
  } catch (e) {
    next(e)
  }
}

/**
 * PUT /api/foro/posts/:id
 */
export const actualizarPost = async (req, res, next) => {
  try {
    const post = await svc.buscarPostPorId(req.params.id)
    if (!post) {
      return res.status(404).json({ error: 'Post no encontrado' })
    }

    // Solo el autor o admin pueden actualizar
    if (post.usuarioId !== req.user.id && req.user.rol !== 'ADMIN') {
      return res.status(403).json({ error: 'No autorizado' })
    }

    res.json(await svc.actualizarPost(req.params.id, req.body))
  } catch (e) {
    next(e)
  }
}

/**
 * DELETE /api/foro/posts/:id
 */
export const eliminarPost = async (req, res, next) => {
  try {
    const post = await svc.buscarPostPorId(req.params.id)
    if (!post) {
      return res.status(404).json({ error: 'Post no encontrado' })
    }

    // Solo el autor o admin pueden eliminar
    if (post.usuarioId !== req.user.id && req.user.rol !== 'ADMIN') {
      return res.status(403).json({ error: 'No autorizado' })
    }

    await svc.eliminarPost(req.params.id)
    res.status(204).end()
  } catch (e) {
    next(e)
  }
}

/**
 * POST /api/foro/posts/:id/comentarios
 */
export const crearComentario = async (req, res, next) => {
  try {
    required(req.body, ['contenido'])

    const post = await svc.buscarPostPorId(req.params.id)
    if (!post) {
      return res.status(404).json({ error: 'Post no encontrado' })
    }

    const nuevoComentario = await svc.crearComentario({
      postId: req.params.id,
      usuarioId: req.user.id,
      contenido: req.body.contenido
    })

    res.status(201).json(nuevoComentario)
  } catch (e) {
    next(e)
  }
}

/**
 * PUT /api/foro/comentarios/:id
 */
export const actualizarComentario = async (req, res, next) => {
  try {
    required(req.body, ['contenido'])

    const comentario = await svc.buscarComentarioPorId(req.params.id)
    if (!comentario) {
      return res.status(404).json({ error: 'Comentario no encontrado' })
    }

    // Solo el autor o admin pueden actualizar
    if (comentario.usuarioId !== req.user.id && req.user.rol !== 'ADMIN') {
      return res.status(403).json({ error: 'No autorizado' })
    }

    res.json(await svc.actualizarComentario(req.params.id, req.body.contenido))
  } catch (e) {
    next(e)
  }
}

/**
 * DELETE /api/foro/comentarios/:id
 */
export const eliminarComentario = async (req, res, next) => {
  try {
    const comentario = await svc.buscarComentarioPorId(req.params.id)
    if (!comentario) {
      return res.status(404).json({ error: 'Comentario no encontrado' })
    }

    // Solo el autor o admin pueden eliminar
    if (comentario.usuarioId !== req.user.id && req.user.rol !== 'ADMIN') {
      return res.status(403).json({ error: 'No autorizado' })
    }

    await svc.eliminarComentario(req.params.id)
    res.status(204).end()
  } catch (e) {
    next(e)
  }
}
