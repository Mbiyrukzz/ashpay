import React from 'react'
import styled from 'styled-components'

const Topbar = styled.div`
  height: 60px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  border-bottom: 1px solid #e5e7eb;
`

const Welcome = styled.div`
  font-size: 1.1rem;
  font-weight: 500;
`

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`

const Navbar = () => (
  <Topbar>
    <Welcome>Welcome back, Ashmif Office Solutions</Welcome>
    <Avatar src="https://i.pravatar.cc/40" alt="avatar" />
  </Topbar>
)

export default Navbar
