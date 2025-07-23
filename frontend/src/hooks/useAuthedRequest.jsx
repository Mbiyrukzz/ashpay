import { useEffect, useState } from 'react'
import { auth } from '../firebase/setupFirebase'

const useAuthedRequest = () => {
  const [token, setToken] = useState(null)

  useEffect(() => {
    const fetchToken = async () => {
      const user = auth.currentUser
      if (user) {
        const idToken = await user.getIdToken()
        setToken(idToken)
      }
    }

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        user.getIdToken().then(setToken)
      } else {
        setToken(null)
      }
    })

    fetchToken()
    return () => unsubscribe()
  }, [])

  const authedFetch = async (url, options = {}) => {
    if (!token) throw new Error('User not authenticated')

    const res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }

    return res.json()
  }

  return authedFetch
}

export default useAuthedRequest
