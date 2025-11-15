import { Router } from 'express'
import { register, login, me } from '../controllers/authController'
import authMiddleware from '../middlewares/auth'
import { validate } from '../middlewares/validation'
import { registerSchema, loginSchema } from '../schemas/validationSchemas'

const router = Router()

router.post('/register', validate(registerSchema), register)
router.post('/login', validate(loginSchema), login)
router.get('/me', authMiddleware, me)

export default router
