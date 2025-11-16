import mongoose from 'mongoose'
import app from './app'
import config from './config'

async function start() {
  try {
    console.log('Connecting to MongoDB at:', config.mongoUri)
    await mongoose.connect(config.mongoUri)
    console.log('✅ MongoDB connected successfully')

    app.listen(config.port, () => {
      console.log(`✅ Server listening on port ${config.port}`)
    })
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err)
    console.error('MONGO_URI:', config.mongoUri)
    process.exit(1)
  }
}

start()
