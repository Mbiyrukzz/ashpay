import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

const TableContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  margin-top: 2rem;
  min-height: 400px;
`

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`

const TableTitle = styled.h3`
  font-size: 1.1rem;
  color: #111827;
`

const SeeMoreLink = styled(Link)`
  background-color: #2563eb;
  color: white;
  padding: 0.4rem 0.9rem;
  font-size: 0.85rem;
  border-radius: 9999px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1d4ed8;
  }
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`

const Th = styled.th`
  text-align: left;
  padding: 0.75rem;
  font-weight: 600;
  color: #4b5563;
`

const Td = styled.td`
  padding: 0.75rem;
  border-top: 1px solid #e5e7eb;
  color: #374151;
`

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  background-color: ${({ status }) =>
    status === 'On time'
      ? '#d1fae5'
      : status === 'Late'
      ? '#fef3c7'
      : '#fee2e2'};
  color: ${({ status }) =>
    status === 'On time'
      ? '#065f46'
      : status === 'Late'
      ? '#92400e'
      : '#991b1b'};
`

const AttendanceTable = () => {
  const data = [
    { name: 'Kandi M. Zielinski', in: '09:00', out: '10:00', status: 'Late' },
    {
      name: 'Guillermina R. Riley',
      in: '09:00',
      out: '10:00',
      status: 'Absence',
    },
    {
      name: 'Pauline C. Chestnut',
      in: '09:00',
      out: '10:00',
      status: 'On time',
    },
    { name: 'Maria J. Beard', in: '09:00', out: '10:00', status: 'Absence' },
  ]

  return (
    <TableContainer>
      <HeaderRow>
        <TableTitle>Attendance</TableTitle>
        <SeeMoreLink to="/attendance">See more</SeeMoreLink>
      </HeaderRow>

      <Table>
        <thead>
          <tr>
            <Th>Employee</Th>
            <Th>Check In</Th>
            <Th>Check Out</Th>
            <Th>Status</Th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, idx) => (
            <tr key={idx}>
              <Td>{entry.name}</Td>
              <Td>{entry.in}</Td>
              <Td>{entry.out}</Td>
              <Td>
                <StatusBadge status={entry.status}>{entry.status}</StatusBadge>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  )
}

export default AttendanceTable
