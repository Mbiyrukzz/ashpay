import styled from 'styled-components'
import LoginForm from '../components/LoginForm'

const PageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(to bottom right, #f0f4ff, #e2f0f9);
  padding: 2rem;
`

const LoginPage = () => {
  return (
    <PageContainer>
      <LoginForm />
    </PageContainer>
  )
}

export default LoginPage
