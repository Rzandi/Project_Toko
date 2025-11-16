import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import config from './config'
import routes from './routes'
import { errorHandler } from './middlewares/validation'

const app = express()

// Trust proxy - untuk Railway/production
app.set('trust proxy', 1)

// Basic middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(helmet())

// Rate limiter (basic)
const limiter = rateLimit({ windowMs: 60 * 1000, max: 200 })
app.use(limiter)

// routes
app.use('/api/v1', routes)

// health
app.get('/health', (req, res) => res.json({ ok: true }))

// global error handler
app.use(errorHandler)

export default app