import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { router } from './routes/index.js'
import { notFound, errorHandler } from './middlewares/error.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(cors())
app.use(express.json())

// Servir archivos estáticos (fotos subidas)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

app.get('/health', (_req, res) => res.json({ ok: true }))
app.use('/api', router)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`🚀 API BodyTrack lista en http://localhost:${PORT}`))
