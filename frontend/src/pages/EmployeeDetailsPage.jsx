import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
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

const EmployeeDetailsPage = () => {
  const { employeeId } = useParams()
  const { employees, fetchEmployees } = useContext(EmployeeContext)
  const [employee, setEmployee] = useState(null)

  useEffect(() => {
    if (!employees.length) {
      fetchEmployees()
    }
  }, [fetchEmployees, employees.length])

  useEffect(() => {
    const found = employees.find((e) => e._id === employeeId) // match with MongoDB _id
    setEmployee(found)
  }, [employees, employeeId])

  if (!employee) {
    return <Loading />
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
          <Value>{employee.department}</Value>
        </Row>
        <Row>
          <Label>Position:</Label>
          <Value>{employee.position}</Value>
        </Row>
        <Row>
          <Label>Salary:</Label>
          <Value>KES {employee.salary.toLocaleString()}</Value>
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
                {b.type || b.name} - KES {b.amount?.toLocaleString?.() || '0'}
              </ListItem>
            ))
          ) : (
            <ListItem>None</ListItem>
          )}
        </List>
      </Section>
    </Container>
  )
}

export default EmployeeDetailsPage
