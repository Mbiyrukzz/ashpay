import React, { useState, useContext, useEffect } from 'react'
import styled from 'styled-components'
import EmployeeContext from '../contexts/EmployeeContext'

const Container = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`

const Header = styled.div`
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
`

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
`

const Subtitle = styled.p`
  margin: 0;
  opacity: 0.9;
  font-size: 0.875rem;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`

const TableHeader = styled.thead`
  background: #f8fafc;
`

const TableRow = styled.tr`
  border-bottom: 1px solid #e5e7eb;
  transition: background-color 0.2s;
  cursor: pointer;

  &:hover {
    background: #f8fafc;
  }

  &:last-child {
    border-bottom: none;
  }
`

const TableHeaderCell = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const TableCell = styled.td`
  padding: 1rem;
  color: #1f2937;
  font-size: 0.875rem;
`

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  ${(props) => {
    switch (props.status) {
      case 'draft':
        return `background: #fef3c7; color: #92400e;`
      case 'approved':
        return `background: #dcfce7; color: #166534;`
      case 'paid':
        return `background: #dbeafe; color: #1e40af;`
      case 'cancelled':
        return `background: #fef2f2; color: #991b1b;`
      default:
        return `background: #f3f4f6; color: #374151;`
    }
  }}
`

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  background: #6366f1;
  color: white;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #5855eb;
    transform: translateY(-1px);
  }
`

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  flex-direction: column;
  gap: 1rem;
`

const LoadingSpinner = styled.div`
  width: 32px;
  height: 32px;
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

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6b7280;
`

const ErrorMessage = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 2rem;
`

const FilterContainer = styled.div`
  padding: 1.5rem 2rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  gap: 1rem;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  background: white;
  min-width: 120px;

  &:focus {
    outline: none;
    border-color: #6366f1;
  }
`

const PayrollList = ({ onViewPayroll }) => {
  const { payrolls, payrollLoading, fetchPayrolls, getMonthName } =
    useContext(EmployeeContext)

  const [filters, setFilters] = useState({
    status: '',
    year: new Date().getFullYear(),
    month: '',
  })
  const [error, setError] = useState('')

  useEffect(() => {
    loadPayrolls()
  }, [filters])

  const loadPayrolls = async () => {
    setError('')
    try {
      const filterParams = {}
      if (filters.status) filterParams.status = filters.status
      if (filters.year) filterParams.year = filters.year
      if (filters.month) filterParams.month = filters.month

      await fetchPayrolls(filterParams)
    } catch (err) {
      setError(err.message)
      console.error('Error loading payrolls:', err)
    }
  }

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }))
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const formatCurrency = (amount) => {
    return `KES ${(amount || 0).toLocaleString()}`
  }

  const getYearOptions = () => {
    const currentYear = new Date().getFullYear()
    const years = []
    for (let i = currentYear; i >= currentYear - 5; i--) {
      years.push(i)
    }
    return years
  }

  const getMonthOptions = () => {
    return [
      { value: 1, label: 'January' },
      { value: 2, label: 'February' },
      { value: 3, label: 'March' },
      { value: 4, label: 'April' },
      { value: 5, label: 'May' },
      { value: 6, label: 'June' },
      { value: 7, label: 'July' },
      { value: 8, label: 'August' },
      { value: 9, label: 'September' },
      { value: 10, label: 'October' },
      { value: 11, label: 'November' },
      { value: 12, label: 'December' },
    ]
  }

  return (
    <Container>
      <Header>
        <Title>Payroll History</Title>
        <Subtitle>View and manage your payroll records</Subtitle>
      </Header>

      <FilterContainer>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>
            Status:
          </label>
          <Select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="approved">Approved</option>
            <option value="paid">Paid</option>
            <option value="cancelled">Cancelled</option>
          </Select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>
            Year:
          </label>
          <Select
            value={filters.year}
            onChange={(e) =>
              handleFilterChange('year', parseInt(e.target.value))
            }
          >
            {getYearOptions().map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </Select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>
            Month:
          </label>
          <Select
            value={filters.month}
            onChange={(e) =>
              handleFilterChange(
                'month',
                e.target.value ? parseInt(e.target.value) : ''
              )
            }
          >
            <option value="">All Months</option>
            {getMonthOptions().map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </Select>
        </div>
      </FilterContainer>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {payrollLoading ? (
        <LoadingContainer>
          <LoadingSpinner />
          <p>Loading payroll records...</p>
        </LoadingContainer>
      ) : payrolls.length === 0 ? (
        <EmptyState>
          <h3>No payroll records found</h3>
          <p>
            {Object.values(filters).some((f) => f)
              ? 'Try adjusting your filters to see more results.'
              : 'Start by generating your first payroll.'}
          </p>
        </EmptyState>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Period</TableHeaderCell>
              <TableHeaderCell>Employees</TableHeaderCell>
              <TableHeaderCell>Total Net Pay</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Generated</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <tbody>
            {payrolls.map((payroll) => (
              <TableRow
                key={payroll._id}
                onClick={() => onViewPayroll && onViewPayroll(payroll._id)}
              >
                <TableCell>
                  <div style={{ fontWeight: '600' }}>
                    {getMonthName(payroll.month)} {payroll.year}
                  </div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      marginTop: '0.25rem',
                    }}
                  >
                    {payroll.workingDays} working days
                  </div>
                </TableCell>

                <TableCell>{payroll.summary?.totalEmployees || 0}</TableCell>

                <TableCell>
                  <div style={{ fontWeight: '600' }}>
                    {formatCurrency(payroll.summary?.totalNetPay)}
                  </div>
                </TableCell>

                <TableCell>
                  <StatusBadge status={payroll.status}>
                    {payroll.status}
                  </StatusBadge>
                </TableCell>

                <TableCell>
                  <div>{formatDate(payroll.createdAt)}</div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      marginTop: '0.25rem',
                    }}
                  >
                    by {payroll.generatedBy}
                  </div>
                </TableCell>

                <TableCell>
                  <ActionButton
                    onClick={(e) => {
                      e.stopPropagation()
                      onViewPayroll && onViewPayroll(payroll._id)
                    }}
                  >
                    View Details
                  </ActionButton>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  )
}

export default PayrollList
