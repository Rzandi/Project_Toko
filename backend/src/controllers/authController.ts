import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcryptjs'
import jwt, { SignOptions } from 'jsonwebtoken'
import User from '../models/User'
import config from '../config'
import { AppError } from '../middlewares/validation'

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, business } = req.body
    const existing = await User.findOne({ email })
    if (existing) throw new AppError(409, 'Email already registered')

    const hash = password ? await bcrypt.hash(password, 10) : undefined
    const user = await User.create({ email, passwordHash: hash, business })

    const accessToken = jwt.sign(
      { sub: user._id },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn } as SignOptions
    )

    res.status(201).json({ success: true, data: { user: { id: user._id, email: user.email, business: user.business }, tokens: { accessToken } } })
  } catch (err) {
    next(err)
  }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) throw new AppError(401, 'Invalid credentials')

    const ok = user.passwordHash ? await bcrypt.compare(password, user.passwordHash) : false
    if (!ok) throw new AppError(401, 'Invalid credentials')

    const accessToken = jwt.sign(
      { sub: user._id },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn } as SignOptions
    )
    res.json({ success: true, data: { user: { id: user._id, email: user.email, business: user.business }, tokens: { accessToken } } })
  } catch (err) {
    next(err)
  }
}

export const me = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // @ts-ignore
    const userId = req.userId
    const user = await User.findById(userId).select('-passwordHash')
    if (!user) throw new AppError(404, 'User not found')
    res.json({ success: true, data: user })
  } catch (err) {
    next(err)
  }
}
