import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import EmployeeContext from '../contexts/EmployeeContext'

const Container = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
`

const Header = styled.div`
  padding: 2rem 2rem 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='7'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
      repeat;
    opacity: 0.1;
  }
`

const TitleSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
`

const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
  color: white;
`

const EmployeeCount = styled.div`
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`

const SearchContainer = styled.div`
  padding: 1.5rem 2rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
`

const SearchInput = styled.input`
  width: 95%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.875rem;
  background: white;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`

const SearchIcon = styled.div`
  position: absolute;
  left: 3rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;

  svg {
    width: 18px;
    height: 18px;
  }
`

const SearchWrapper = styled.div`
  position: relative;
`

const ListContainer = styled.div`
  max-height: 600px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f5f9;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
`

const EmployeeItem = styled(Link)`
  background: white;
  padding: 1.25rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-decoration: none;
  border-bottom: 1px solid #f1f5f9;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    background: linear-gradient(90deg, #f8fafc 0%, #f1f5f9 100%);
    transform: translateX(4px);
  }

  &:last-child {
    border-bottom: none;
  }

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    transform: scaleY(0);
    transition: transform 0.2s ease;
  }

  &:hover::before {
    transform: scaleY(1);
  }
`

const EmployeeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const Avatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
  text-transform: uppercase;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
`

const EmployeeDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

const EmployeeName = styled.span`
  font-weight: 600;
  color: #1f2937;
  font-size: 1rem;
`

const EmployeeRole = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
`

const EmployeeActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  opacity: 0;
  transform: translateX(10px);
  transition: all 0.2s ease;

  ${EmployeeItem}:hover & {
    opacity: 1;
    transform: translateX(0);
  }
`

const ActionButton = styled.button`
  padding: 0.5rem;
  border: none;
  background: #f3f4f6;
  border-radius: 8px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #6366f1;
    color: white;
    transform: scale(1.1);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  ${(props) =>
    props.status === 'active' &&
    `
    background: #dcfce7;
    color: #166534;
  `}

  ${(props) =>
    props.status === 'inactive' &&
    `
    background: #fef2f2;
    color: #991b1b;
  `}
  
  ${(props) =>
    props.status === 'pending' &&
    `
    background: #fef3c7;
    color: #92400e;
  `}
`

const LoadingContainer = styled.div`
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #6366f1;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`

const LoadingText = styled.p`
  color: #6b7280;
  font-size: 1rem;
  margin: 0;
`

const EmptyState = styled.div`
  padding: 3rem 2rem;
  text-align: center;
  color: #6b7280;
`

const EmptyIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;

  svg {
    width: 40px;
    height: 40px;
    color: #9ca3af;
  }
`

const EmployeeList = () => {
  const { employees, loading, fetchEmployees } = useContext(EmployeeContext)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchEmployees()
  }, [fetchEmployees])

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (emp.role && emp.role.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
  }

  const getEmployeeStatus = (emp) => {
    // Mock status logic - replace with actual employee status field
    if (emp.isActive === false) return 'inactive'
    if (emp.isPending) return 'pending'
    return 'active'
  }

  return (
    <Container>
      <Header>
        <TitleSection>
          <Title>Team Members</Title>
          <EmployeeCount>
            {filteredEmployees.length}{' '}
            {filteredEmployees.length === 1 ? 'Employee' : 'Employees'}
          </EmployeeCount>
        </TitleSection>
      </Header>

      <SearchContainer>
        <SearchWrapper>
          <SearchIcon>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Search employees by name or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchWrapper>
      </SearchContainer>

      <ListContainer>
        {loading ? (
          <LoadingContainer>
            <LoadingSpinner />
            <LoadingText>Loading team members...</LoadingText>
          </LoadingContainer>
        ) : filteredEmployees.length === 0 ? (
          <EmptyState>
            <EmptyIcon>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </EmptyIcon>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#374151' }}>
              No employees found
            </h3>
            <p style={{ margin: 0 }}>
              {searchTerm
                ? 'Try adjusting your search criteria.'
                : 'Get started by adding your first team member.'}
            </p>
          </EmptyState>
        ) : (
          filteredEmployees.map((emp) => (
            <EmployeeItem to={`/employees/${emp._id}`} key={emp._id}>
              <EmployeeInfo>
                <Avatar>{getInitials(emp.name)}</Avatar>
                <EmployeeDetails>
                  <EmployeeName>{emp.name}</EmployeeName>
                  <EmployeeRole>
                    {emp.role || emp.position || 'Employee'}
                  </EmployeeRole>
                </EmployeeDetails>
              </EmployeeInfo>

              <EmployeeActions>
                <StatusBadge status={getEmployeeStatus(emp)}>
                  {getEmployeeStatus(emp)}
                </StatusBadge>

                <ActionButton
                  onClick={(e) => {
                    e.preventDefault()
                    console.log('Edit employee:', emp._id)
                  }}
                  title="Edit Employee"
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </ActionButton>

                <ActionButton
                  onClick={(e) => {
                    e.preventDefault()
                    console.log('View profile:', emp._id)
                  }}
                  title="View Profile"
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </ActionButton>
              </EmployeeActions>
            </EmployeeItem>
          ))
        )}
      </ListContainer>
    </Container>
  )
}

export default EmployeeList
