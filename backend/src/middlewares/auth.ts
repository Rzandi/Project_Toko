import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import config from '../config'

export default function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ success: false, error: { message: 'Unauthorized' } })
  const token = auth.split(' ')[1]
  try {
    const payload: any = jwt.verify(token, config.jwtSecret)
    // @ts-ignore
    req.userId = payload.sub
    next()
  } catch (err) {
    return res.status(401).json({ success: false, error: { message: 'Invalid token' } })
  }
}
