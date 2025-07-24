// src/firebase.js
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyD1E6IKcmo_iKbZI9sFhCCFGuFrRQYa6bg',
  authDomain: 'ashmif-payroll.firebaseapp.com',
  projectId: 'ashmif-payroll',
  storageBucket: 'ashmif-payroll.appspot.com', // ✅ fixed
  messagingSenderId: '526338513077',
  appId: '1:526338513077:web:0924ac0514b2554b7ec6fc',
}

const app = initializeApp(firebaseConfig)

const auth = getAuth(app)

export { auth }
