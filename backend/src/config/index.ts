import dotenv from 'dotenv'
import path from 'path'

const envPath = path.resolve(process.cwd(), '.env')
dotenv.config({ path: envPath })

export default {
  port: process.env.PORT || 4000,
  mongoUri: process.env.MONGO_URI || 'mongodb+srv://zandi:zandi1201@cluster0.eyym5dq.mongodb.net/invoice-ease?retryWrites=true&w=majority',
  jwtSecret: process.env.JWT_SECRET || 'please-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d'
}
