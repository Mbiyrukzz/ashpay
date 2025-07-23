const admin = require('firebase-admin')

const verifyAuthToken = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ message: 'Missing or invalid Authorization header' })
  }

  const idToken = authHeader.split('Bearer ')[1]

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken)
    req.user = decodedToken // Attach user info to request
    next()
  } catch (error) {
    console.error('Token verification failed:', error.message)
    return res
      .status(401)
      .json({ message: 'Unauthorized: Invalid or expired token' })
  }
}

module.exports = { verifyAuthToken }
