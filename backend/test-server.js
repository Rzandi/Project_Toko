require('dotenv').config()
console.log('Env loaded, PORT:', process.env.PORT)

try {
  const server = require('./dist/server.js')
  console.log('Server loaded')
} catch (err) {
  console.error('ERROR:', err.message)
  console.error('Stack:', err.stack)
  process.exit(1)
}
