const User = require('../models/User')
const { verifyAuthToken } = require('../middleware/verifyAuthToken')

const createUserRoute = {
  path: '/users',
  method: 'post',
  middleware: [verifyAuthToken],
  handler: async (req, res) => {
    const { name, email, firebaseUid } = req.body

    console.log('Incoming POST /users body:', req.body)

    if (!name || !email || !firebaseUid) {
      return res.status(400).json({ error: 'Missing required fields.' })
    }

    try {
      const existing = await User.findOne({ firebaseUid })

      if (existing) {
        return res.status(409).json({ error: 'User already exists.' })
      }

      const user = await User.create({ name, email, firebaseUid })

      res.status(201).json({ message: 'User created successfully', user })
    } catch (err) {
      console.error('Error creating user:', err)
      res.status(500).json({ error: 'Server error' })
    }
  },
}

module.exports = { createUserRoute }
