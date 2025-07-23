import React, { useState } from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons'

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

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
  position: relative;
`

const Icon = styled(FontAwesomeIcon)`
  position: absolute;
  top: 50%;
  left: 1rem;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 1rem;
`

const Input = styled.input`
  width: 85%;
  padding: 0.85rem 1rem 0.85rem 3rem;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  background: #f8fafc;
  color: #1e293b;
  font-size: 1rem;
  transition: border 0.2s, background 0.2s;

  &:focus {
    outline: none;
    border-color: #6366f1;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
  }
`

const Button = styled.button`
  width: 100%;
  padding: 0.85rem;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  border: none;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s;

  &:hover {
    background: linear-gradient(135deg, #4f46e5, #4338ca);
    transform: scale(1.02);
  }

  &:active {
    transform: scale(0.98);
  }
`

const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    console.log('Logging in with:', email, password)
  }

  return (
    <FormWrapper>
      <Title>Welcome Back</Title>
      <form onSubmit={handleLogin}>
        <InputGroup>
          <Icon icon={faEnvelope} />
          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </InputGroup>
        <InputGroup>
          <Icon icon={faLock} />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </InputGroup>
        <Button type="submit">Sign In</Button>
      </form>
    </FormWrapper>
  )
}

export default LoginForm
