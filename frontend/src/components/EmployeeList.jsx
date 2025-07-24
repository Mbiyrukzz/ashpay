import React, { useContext, useEffect } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import EmployeeContext from '../contexts/EmployeeContext'

const Container = styled.div`
  padding: 2rem;
  background: #f9fbfd;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
`

const Title = styled.h2`
  font-size: 1.5rem;
  color: #1a202c;
  margin-bottom: 1.5rem;
`

const EmployeeItem = styled(Link)`
  background: white;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-decoration: none;

  &:hover {
    background: #f1f5f9;
  }
`

const EmployeeName = styled.span`
  font-weight: 500;
  color: #2d3748;
`

const LoadingText = styled.p`
  color: #718096;
`

const EmployeeList = () => {
  const { employees, loading, fetchEmployees } = useContext(EmployeeContext)

  useEffect(() => {
    fetchEmployees()
  }, [fetchEmployees])

  return (
    <Container>
      <Title>Employees</Title>
      {loading ? (
        <LoadingText>Loading...</LoadingText>
      ) : (
        employees.map((emp) => (
          <EmployeeItem to={`/employees/${emp._id}`} key={emp._id}>
            <EmployeeName>{emp.name}</EmployeeName>
          </EmployeeItem>
        ))
      )}
    </Container>
  )
}

export default EmployeeList
