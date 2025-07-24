import { Route, Routes, useLocation, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Sidebar from './components/SideBar'
import Navbar from './components/NavBar'
import LoginPage from './pages/LoginPage'
import CreateAccountPage from './pages/CreateAccountPage'
import styled from 'styled-components'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import useUser from './hooks/useUser'
import EmployeePage from './pages/EmployeePage'
import Loading from './components/Loading'
import EmployeeDetailsPage from './pages/EmployeeDetailsPage'

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
  const { user, loading } = useUser()
  const isAuthPage = ['/login', '/create-account'].includes(location.pathname)

  if (loading) return <Loading />

  if (isAuthPage && user) {
    return <Navigate to="/" replace />
  }

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/create-account" element={<CreateAccountPage />} />
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
            <Route
              path="/"
              element={
                <ProtectedRoute
                  canAccess={!!user}
                  isLoading={loading}
                  redirectTo="/login"
                />
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="/employees" element={<EmployeePage />} />
              <Route
                path="/employees/:employeeId"
                element={<EmployeeDetailsPage />}
              />
            </Route>
          </Routes>
        </Main>
        <Footer />
      </Content>
    </Layout>
  )
}

export default AppRoutes
