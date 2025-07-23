import { Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Sidebar from './components/SideBar'
import Navbar from './components/NavBar'
import styled from 'styled-components'

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
  return (
    <Layout>
      <Sidebar />
      <Content>
        <Navbar />
        <Main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            {/* Add more routes here */}
          </Routes>
        </Main>
      </Content>
    </Layout>
  )
}

export default AppRoutes
