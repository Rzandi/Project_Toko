import mongoose from 'mongoose'
import app from './app'
import config from './config'

// If local Mongo is not available, use an in-memory Mongo for dev/testing
async function start() {
  try {
    await mongoose.connect(config.mongoUri)
    console.log('MongoDB connected (real)')
  } catch (err) {
    console.warn('Could not connect to MongoDB at', config.mongoUri)
    console.warn('Falling back to in-memory MongoDB for development')
    try {
      // lazy import to avoid adding overhead in production
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { MongoMemoryServer } = require('mongodb-memory-server')
      const mongod = await MongoMemoryServer.create()
      const uri = mongod.getUri()
      await mongoose.connect(uri)
      console.log('MongoDB connected (in-memory)')
    } catch (memErr) {
      console.error('Failed to start in-memory MongoDB', memErr)
      process.exit(1)
    }
  }

  app.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`)
  })
}

start()
