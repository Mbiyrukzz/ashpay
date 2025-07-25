import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import EmployeeContext from '../contexts/EmployeeContext'
import styled from 'styled-components'
import Loading from '../components/Loading'

const Container = styled.div`
  max-width: 1000px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`

const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
`

const Section = styled.div`
  margin-bottom: 2rem;
`

const Label = styled.div`
  font-weight: 600;
  min-width: 140px;
  color: #2d3748;
`

const Value = styled.div`
  flex: 1;
  color: #4a5568;
`

const Row = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 0.75rem;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`

const List = styled.ul`
  max-height: 150px;
  overflow-y: auto;
  background: #f9fafb;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
  margin-top: 0.5rem;
`

const ListItem = styled.li`
  margin-bottom: 0.5rem;
  color: #2d3748;
`

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`

const ActionButton = styled.button`
  background-color: #2b6cb0;
  color: white;
  border: none;
  padding: 0.5rem 1.25rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;

  &:hover {
    background-color: #2c5282;
  }
`

const EmployeeDetailsPage = () => {
  const { employeeId } = useParams()
  const { employees, fetchEmployees } = useContext(EmployeeContext)
  const [employee, setEmployee] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!employees.length) {
      fetchEmployees()
    }
  }, [fetchEmployees, employees.length])

  useEffect(() => {
    const found = employees.find((e) => e._id === employeeId)
    setEmployee(found)
  }, [employees, employeeId])

  if (!employee) {
    return <Loading />
  }

  const handleEdit = () => {
    navigate(`/employees/${employeeId}/edit`)
  }

  const handleLoan = () => {
    navigate(`/employees/${employeeId}/loan`)
  }

  const handleAdvance = () => {
    navigate(`/employees/${employeeId}/advance`)
  }

  const handleOvertime = () => {
    navigate(`/employees/${employeeId}/overtime`)
  }

  return (
    <Container>
      <Title>Employee Details</Title>

      <Section>
        <Row>
          <Label>Name:</Label>
          <Value>{employee.name}</Value>
        </Row>
        <Row>
          <Label>Email:</Label>
          <Value>{employee.email}</Value>
        </Row>
        <Row>
          <Label>Phone:</Label>
          <Value>{employee.phone || 'N/A'}</Value>
        </Row>
        <Row>
          <Label>Department:</Label>
          <Value>{employee.department || 'N/A'}</Value>
        </Row>
        <Row>
          <Label>Position:</Label>
          <Value>{employee.position || 'N/A'}</Value>
        </Row>
        <Row>
          <Label>Gross Salary:</Label>
          <Value>KES {employee.salary.toLocaleString()}</Value>
        </Row>
        <Row>
          <Label>Net Salary:</Label>
          <Value>KES {employee.netPay.toLocaleString()}</Value>
        </Row>
      </Section>

      <Section>
        <Label>Deductions:</Label>
        <List>
          {employee.deductions?.length ? (
            employee.deductions.map((d, idx) => (
              <ListItem key={idx}>
                {d.type} - KES {d.amount.toLocaleString()}{' '}
                {d.recurring ? '(Recurring)' : ''}
              </ListItem>
            ))
          ) : (
            <ListItem>None</ListItem>
          )}
        </List>
      </Section>

      <Section>
        <Label>Benefits:</Label>
        <List>
          {employee.benefits?.length ? (
            employee.benefits.map((b, idx) => (
              <ListItem key={idx}>
                {b.type} - KES {b.amount.toLocaleString()}{' '}
                {b.recurring ? '(Recurring)' : ''}
              </ListItem>
            ))
          ) : (
            <ListItem>None</ListItem>
          )}
        </List>
      </Section>

      <Section>
        <ButtonGroup>
          <ActionButton onClick={handleLoan}>Loan</ActionButton>
          <ActionButton onClick={handleAdvance}>Advance</ActionButton>
          <ActionButton onClick={handleOvertime}>Overtime</ActionButton>
          <ActionButton onClick={handleEdit}>Edit</ActionButton>
        </ButtonGroup>
      </Section>
    </Container>
  )
}

export default EmployeeDetailsPage
