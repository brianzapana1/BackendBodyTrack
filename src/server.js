import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { router } from './routes/index.js'
import { notFound, errorHandler } from './middlewares/error.js'

const app = express()
app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => res.json({ ok: true }))
app.use('/api', router)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`API lista en http://localhost:${PORT}`))
