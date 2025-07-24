const User = require('../models/User')
const { verifyAuthToken } = require('../middleware/verifyAuthToken')

const getUserProfileRoute = {
  path: '/users/me',
  method: 'get',
  middleware: [verifyAuthToken],
  handler: async (req, res) => {
    try {
      const firebaseUid = req.user.uid // set by verifyAuthToken

      const user = await User.findOne({ firebaseUid })

      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      res.status(200).json(user)
    } catch (err) {
      console.error('Error fetching user profile:', err)
      res.status(500).json({ error: 'Server error' })
    }
  },
}

module.exports = { getUserProfileRoute }
