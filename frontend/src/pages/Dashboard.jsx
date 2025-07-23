import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUsers,
  faMoneyCheckDollar,
  faClock,
  faFileInvoiceDollar,
} from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components'
import PayrollChart from '../components/PayrollChart'
import AttendanceTable from '../components/AttendanceTable'

const DashboardContent = styled.div`
  padding: 2rem;
  font-family: 'Segoe UI', sans-serif;
`

const Title = styled.h2`
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 600;
`

const CardRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
`

const Card = styled.div`
  background: ${(props) => props.bg || '#ffffff'};
  color: #111827;
  border-radius: 15px;
  padding: 1.25rem 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border-left: 6px solid ${(props) => props.border || '#ccc'};
`

const CardIcon = styled.div`
  font-size: 1.6rem;
  color: ${(props) => props.iconColor || '#6b7280'};
`

const CardTitle = styled.div`
  font-size: 0.85rem;
  color: #6b7280;
`

const CardValue = styled.div`
  font-size: 1.6rem;
  font-weight: bold;
  color: #111827;
`

const ChartAndTableRow = styled.div`
  display: flex;
  gap: 2rem;
  margin-top: 2rem;
  flex-wrap: wrap;

  & > * {
    flex: 1;
    min-width: 300px;
  }
`

const Panel = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 400px;
  flex: 1;
`

const Dashboard = () => {
  return (
    <DashboardContent>
      <Title>Dashboard Overview</Title>

      <CardRow>
        <Card bg="#e6f9f1" border="#34d399" iconColor="#059669">
          <CardIcon>
            <FontAwesomeIcon icon={faUsers} />
          </CardIcon>
          <CardTitle>Total Employees</CardTitle>
          <CardValue>457</CardValue>
        </Card>

        <Card bg="#fff7e6" border="#fbbf24" iconColor="#d97706">
          <CardIcon>
            <FontAwesomeIcon icon={faMoneyCheckDollar} />
          </CardIcon>
          <CardTitle>Payroll Processed</CardTitle>
          <CardValue>$45,457</CardValue>
        </Card>

        <Card bg="#fff3eb" border="#f97316" iconColor="#ea580c">
          <CardIcon>
            <FontAwesomeIcon icon={faClock} />
          </CardIcon>
          <CardTitle>Pending Pay</CardTitle>
          <CardValue>$74,897</CardValue>
        </Card>

        <Card bg="#ffecec" border="#ef4444" iconColor="#dc2626">
          <CardIcon>
            <FontAwesomeIcon icon={faFileInvoiceDollar} />
          </CardIcon>
          <CardTitle>Tax & Deduction</CardTitle>
          <CardValue>$87,478</CardValue>
        </Card>
      </CardRow>

      <ChartAndTableRow>
        <Panel>
          <PayrollChart />
        </Panel>
        <Panel>
          <AttendanceTable />
        </Panel>
      </ChartAndTableRow>
    </DashboardContent>
  )
}

export default Dashboard
