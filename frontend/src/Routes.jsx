import { Route, Routes, useLocation } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Sidebar from './components/SideBar'
import Navbar from './components/NavBar'
import LoginPage from './pages/LoginPage'
import styled from 'styled-components'
import Footer from './components/Footer'

const Layout = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
`

const Content = styled.div`
  flex: 1;
  background: #f4f6f8;
  display: flex;
  flex-direction: column;
`

const Main = styled.main`
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
`

const AppRoutes = () => {
  const location = useLocation()
  const isAuthPage = location.pathname === '/login'

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    )
  }

  return (
    <Layout>
      <Sidebar />
      <Content>
        <Navbar />
        <Main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            {/* Add more authenticated routes here */}
          </Routes>
        </Main>
        <Footer />
      </Content>
    </Layout>
  )
}

export default AppRoutes
