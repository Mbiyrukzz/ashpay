const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const cors = require('cors')
const { routes } = require('./routes')

const admin = require('firebase-admin')
const credentials = require('./config/credentials.json')

dotenv.config()

admin.initializeApp({
  credential: admin.credential.cert(credentials),
})

// Initialize app
const app = express()
app.use(cors())
app.use(express.json())

routes.forEach((route) => {
  if (!route.path || !route.method || !route.handler) {
    console.error('Invalid Route;', route)
  }

  const fullPath = `/api${route.path}`
  console.log(`Registering path: ${route.method.toUpperCase()} ${fullPath}`)

  if (route.middleware) {
    app[route.method](fullPath, ...route.middleware, route.handler)
  } else {
    app[route.method](fullPath, route.handler)
  }
})

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log('Server running on port 5000')
    })
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err)
  })
