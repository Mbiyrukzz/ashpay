import styled from 'styled-components'

const Layout = styled.div`
  display: flex;
  height: 100vh;
  background: #f7f9fa;
  font-family: 'Segoe UI', sans-serif;
  width: 100%;
`

const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`

const DashboardContent = styled.div`
  padding: 2rem;
`

const CardRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
`

const Card = styled.div`
  background: white;
  border-radius: 15px;
  padding: 1.25rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.04);
`

const CardTitle = styled.div`
  font-size: 0.9rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
`

const CardValue = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
`

const Dashboard = () => (
  <Layout>
    <ContentWrapper>
      <DashboardContent>
        <h2 style={{ marginBottom: '1rem' }}>Dashboard Overview</h2>
        <CardRow>
          <Card>
            <CardTitle>Total Employees</CardTitle>
            <CardValue>457</CardValue>
          </Card>
          <Card>
            <CardTitle>Payroll Processed</CardTitle>
            <CardValue>$45,457</CardValue>
          </Card>
          <Card>
            <CardTitle>Pending Pay</CardTitle>
            <CardValue>$74,897</CardValue>
          </Card>
          <Card>
            <CardTitle>Tax & Deduction</CardTitle>
            <CardValue>$87,478</CardValue>
          </Card>
        </CardRow>
      </DashboardContent>
    </ContentWrapper>
  </Layout>
)

export default Dashboard
