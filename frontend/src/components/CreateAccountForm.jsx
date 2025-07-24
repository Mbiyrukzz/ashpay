import React, { useState } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import axios from 'axios'
import { auth } from '../firebase/setupFirebase'

const FormWrapper = styled.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  padding: 2.5rem 2rem;
  border-radius: 16px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 420px;
  transition: all 0.3s ease;
`

const Title = styled.h2`
  margin-bottom: 2rem;
  text-align: center;
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
`

const Input = styled.input`
  width: 100%;
  margin-bottom: 1.2rem;
  padding: 0.9rem;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  background: #f8fafc;
  font-size: 1rem;
`

const Button = styled.button`
  width: 100%;
  padding: 0.9rem;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  border: none;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  border-radius: 10px;
  cursor: pointer;
  margin-top: 1rem;
`

const CreateAccountForm = () => {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      const user = userCredential.user
      const token = await user.getIdToken()

      await axios.post(
        'http://localhost:5000/api/users',
        {
          name,
          email,
          firebaseUid: user.uid,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      localStorage.setItem('token', token)

      navigate('/login')
    } catch (error) {
      console.error('❌ Error creating account:', error.message)
    }
  }

  return (
    <FormWrapper>
      <Title>Create an Account</Title>
      <form onSubmit={handleSubmit}>
        <Input
          name="name"
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          name="email"
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          name="password"
          type="password"
          placeholder="Create Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit">Create Account</Button>
      </form>
    </FormWrapper>
  )
}

export default CreateAccountForm
