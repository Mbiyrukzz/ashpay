import React, { useState, useContext, useEffect } from 'react'
import styled from 'styled-components'
import { useParams, useNavigate } from 'react-router-dom'
import { PDFDownloadLink } from '@react-pdf/renderer'
import EmployeeContext from '../contexts/EmployeeContext'
import PayrollPDF from './PayrollPDF' // Ensure this component exists

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
`

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`

const Header = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
`

const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f3f4f6;
  border: none;
  border-radius: 8px;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #e5e7eb;
    transform: translateX(-2px);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`

const TitleSection = styled.div`
  flex: 1;
`

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
`

const Subtitle = styled.p`
  color: #6b7280;
  margin: 0;
  font-size: 1rem;
`

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-start;
  }
`

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  ${(props) =>
    props.variant === 'primary'
      ? `
    background: #6366f1;
    color: white;
    &:hover:not(:disabled) {
      background: #5855eb;
      transform: translateY(-1px);
    }
  `
      : props.variant === 'success'
      ? `
    background: #10b981;
    color: white;
    &:hover:not(:disabled) {
      background: #059669;
      transform: translateY(-1px);
    }
  `
      : props.variant === 'danger'
      ? `
    background: #ef4444;
    color: white;
    &:hover:not(:disabled) {
      background: #dc2626;
      transform: translateY(-1px);
    }
  `
      : `
    background: #f3f4f6;
    color: #374151;
    border: 1px solid #d1d5db;
    &:hover:not(:disabled) {
      background: #e5e7eb;
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`

const PDFButton = styled(PDFDownloadLink)`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;

  &:hover {
    background: #e5e7eb;
    transform: translateY(-1px);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`

const StatusBadge = styled.span`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
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

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
`

const SummaryCard = styled.div`
  background: linear-gradient(135deg, ${(props) => props.gradient});
  padding: 1.5rem;
  border-radius: 12px;
  color: white;
  text-align: center;
`

const SummaryValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`

const SummaryLabel = styled.div`
  font-size: 0.875rem;
  opacity: 0.9;
`

const ContentCard = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 2rem;
`

const CardHeader = styled.div`
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e5e7eb;
  background: #f8fafc;
`

const CardTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
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

const EmployeeName = styled.div`
  font-weight: 600;
  color: #1f2937;
`

const EmployeeId = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
`

const Amount = styled.div`
  font-weight: 600;
  text-align: right;

  ${(props) => props.type === 'positive' && `color: #059669;`}
  ${(props) => props.type === 'negative' && `color: #dc2626;`}
  ${(props) => props.type === 'total' && `color: #1f2937; font-size: 1rem;`}
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

const ErrorMessage = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 2rem;
`

const WarningMessage = styled.div`
  background: #fef3c7;
  border: 1px solid #fed7aa;
  color: #92400e;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 2rem;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6b7280;
`

const PayrollViewer = () => {
  const { payrollId } = useParams()
  const navigate = useNavigate()
  const { getPayrollDetails, updatePayrollStatus, getMonthName } =
    useContext(EmployeeContext)

  const [payroll, setPayroll] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [downloading, setDownloading] = useState({ csv: false, pdf: false })

  useEffect(() => {
    fetchPayrollDetails()
  }, [payrollId])

  const fetchPayrollDetails = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getPayrollDetails(payrollId)
      if (data.error) {
        setError(data.error)
        setPayroll(null)
      } else {
        setPayroll(data.payroll || data)
      }
    } catch (err) {
      setError('An unexpected error occurred while fetching payroll details')
      console.error('Error fetching payroll details:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadCSV = async () => {
    setDownloading((prev) => ({ ...prev, csv: true }))
    try {
      const csvContent = convertToCSV(payroll.payrollItems)
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `payroll_${getMonthName(payroll.month)}_${
        payroll.year
      }.csv`
      link.click()
    } catch (err) {
      console.error('Error downloading CSV:', err)
      alert('Failed to download CSV file')
    } finally {
      setDownloading((prev) => ({ ...prev, csv: false }))
    }
  }

  const handleStatusUpdate = async (newStatus) => {
    try {
      await updatePayrollStatus(payrollId, newStatus, {
        approvedBy: 'current_user',
        notes: `Status updated to ${newStatus}`,
      })
      setPayroll((prev) => ({ ...prev, status: newStatus }))
    } catch (err) {
      console.error('Error updating status:', err)
      alert('Failed to update payroll status')
    }
  }

  const convertToCSV = (payrollItems) => {
    if (!payrollItems || payrollItems.length === 0) return ''

    const headers = [
      'Employee Name',
      'Employee Number',
      'Basic Salary',
      'Gross Salary',
      'NSSF',
      'NHIF',
      'PAYE',
      'SHIF',
      'Housing Levy',
      'Other Deductions',
      'Total Deductions',
      'Total Benefits',
      'Net Salary',
    ]

    const getDeductionAmount = (deductions, type) => {
      const deduction = deductions.find((d) => d.type === type)
      return deduction ? deduction.amount : 0
    }

    const rows = payrollItems.map((item) => {
      const deductions = item.deductions || []
      const otherDeductions = deductions
        .filter(
          (d) =>
            !['NSSF', 'NHIF', 'PAYE', 'SHIF', 'Housing Levy'].includes(d.type)
        )
        .reduce((sum, d) => sum + (d.amount || 0), 0)

      return [
        item.employeeName || '',
        item.employeeNumber || '',
        item.basicSalary || 0,
        item.grossSalary || 0,
        getDeductionAmount(deductions, 'NSSF'),
        getDeductionAmount(deductions, 'NHIF'),
        getDeductionAmount(deductions, 'PAYE'),
        getDeductionAmount(deductions, 'SHIF'),
        getDeductionAmount(deductions, 'Housing Levy'),
        otherDeductions,
        item.totalDeductions || 0,
        item.totalBenefits || 0,
        item.netSalary || 0,
      ]
    })

    return [headers, ...rows]
      .map((row) => row.map((field) => `"${field}"`).join(','))
      .join('\n')
  }

  // Check for duplicate deductions or SHIF mismatches
  const getWarnings = () => {
    if (!payroll?.payrollItems) return []
    const warnings = []
    payroll.payrollItems.forEach((item) => {
      const deductions = item.deductions || []
      const deductionTypes = deductions.map((d) => d.type)
      const uniqueTypes = new Set(deductionTypes)
      if (deductionTypes.length !== uniqueTypes.size) {
        const duplicates = deductionTypes.filter(
          (type, index) => deductionTypes.indexOf(type) !== index
        )
        warnings.push(
          `Duplicate deductions for ${item.employeeName} (${
            item.employeeNumber
          }): ${[...new Set(duplicates)].join(', ')}`
        )
      }
      const shifDeduction =
        deductions.find((d) => d.type === 'SHIF')?.amount || 0
      if (item.shifAmount !== shifDeduction) {
        warnings.push(
          `SHIF amount mismatch for ${item.employeeName} (${item.employeeNumber}): Expected ${item.shifAmount}, Found ${shifDeduction}`
        )
      }
    })
    return warnings
  }

  if (loading) {
    return (
      <PageContainer>
        <Container>
          <LoadingContainer>
            <LoadingSpinner />
            <p>Loading payroll details...</p>
          </LoadingContainer>
        </Container>
      </PageContainer>
    )
  }

  if (error) {
    return (
      <PageContainer>
        <Container>
          <ContentCard>
            <ErrorMessage>{error}</ErrorMessage>
            <div style={{ padding: '1rem 2rem' }}>
              <Button onClick={() => navigate('/payroll')}>
                ← Back to Payroll
              </Button>
            </div>
          </ContentCard>
        </Container>
      </PageContainer>
    )
  }

  if (!payroll) {
    return (
      <PageContainer>
        <Container>
          <ContentCard>
            <EmptyState>
              <h3>Payroll not found</h3>
              <p>The requested payroll could not be found.</p>
              <Button onClick={() => navigate('/payroll')}>
                ← Back to Payroll
              </Button>
            </EmptyState>
          </ContentCard>
        </Container>
      </PageContainer>
    )
  }

  const warnings = getWarnings()

  return (
    <PageContainer>
      <Container>
        <Header>
          <HeaderTop>
            <BackButton onClick={() => navigate('/payroll')}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back
            </BackButton>

            <TitleSection>
              <Title>
                {getMonthName(payroll.month)} {payroll.year} Payroll
              </Title>
              <Subtitle>
                Generated on {new Date(payroll.createdAt).toLocaleDateString()}{' '}
                • ID: {payroll._id}
              </Subtitle>
            </TitleSection>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <StatusBadge status={payroll.status}>
                {payroll.status}
              </StatusBadge>

              <ActionButtons>
                <Button onClick={handleDownloadCSV} disabled={downloading.csv}>
                  {downloading.csv ? (
                    <LoadingSpinner style={{ width: '16px', height: '16px' }} />
                  ) : (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  )}
                  CSV
                </Button>

                <PDFButton
                  document={<PayrollPDF payroll={payroll} />}
                  fileName={`payroll_${getMonthName(payroll.month)}_${
                    payroll.year
                  }.pdf`}
                >
                  {({ loading }) => (
                    <>
                      {loading ? (
                        <LoadingSpinner
                          style={{ width: '16px', height: '16px' }}
                        />
                      ) : (
                        <svg
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                          />
                        </svg>
                      )}
                      PDF
                    </>
                  )}
                </PDFButton>

                {payroll.status === 'draft' && (
                  <Button
                    variant="success"
                    onClick={() => handleStatusUpdate('approved')}
                  >
                    Approve
                  </Button>
                )}
                {['draft', 'approved'].includes(payroll.status) && (
                  <Button
                    variant="danger"
                    onClick={() => handleStatusUpdate('cancelled')}
                  >
                    Cancel
                  </Button>
                )}
              </ActionButtons>
            </div>
          </HeaderTop>

          {warnings.length > 0 && (
            <WarningMessage>
              {warnings.map((warning, index) => (
                <div key={index}>{warning}</div>
              ))}
            </WarningMessage>
          )}

          <SummaryGrid>
            <SummaryCard gradient="#667eea 0%, #764ba2 100%">
              <SummaryValue>{payroll.payrollItems?.length || 0}</SummaryValue>
              <SummaryLabel>Total Employees</SummaryLabel>
            </SummaryCard>

            <SummaryCard gradient="#f093fb 0%, #f5576c 100%">
              <SummaryValue>
                KES{' '}
                {payroll.payrollItems
                  ?.reduce((sum, item) => sum + (item.grossSalary || 0), 0)
                  .toLocaleString() || '0'}
              </SummaryValue>
              <SummaryLabel>Gross Pay</SummaryLabel>
            </SummaryCard>

            <SummaryCard gradient="#4facfe 0%, #00f2fe 100%">
              <SummaryValue>
                KES{' '}
                {payroll.payrollItems
                  ?.reduce((sum, item) => sum + (item.totalDeductions || 0), 0)
                  .toLocaleString() || '0'}
              </SummaryValue>
              <SummaryLabel>Total Deductions</SummaryLabel>
            </SummaryCard>

            <SummaryCard gradient="#43e97b 0%, #38f9d7 100%">
              <SummaryValue>
                KES{' '}
                {payroll.payrollItems
                  ?.reduce((sum, item) => sum + (item.netSalary || 0), 0)
                  .toLocaleString() || '0'}
              </SummaryValue>
              <SummaryLabel>Net Pay</SummaryLabel>
            </SummaryCard>
          </SummaryGrid>
        </Header>

        <ContentCard>
          <CardHeader>
            <CardTitle>Employee Payroll Details</CardTitle>
          </CardHeader>

          {payroll.payrollItems && payroll.payrollItems.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell>Employee</TableHeaderCell>
                  <TableHeaderCell>Basic Salary</TableHeaderCell>
                  <TableHeaderCell>Gross Pay</TableHeaderCell>
                  <TableHeaderCell>Deductions</TableHeaderCell>
                  <TableHeaderCell>Benefits</TableHeaderCell>
                  <TableHeaderCell>Net Pay</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <tbody>
                {payroll.payrollItems.map((item, index) => (
                  <TableRow key={item._id || index}>
                    <TableCell>
                      <EmployeeName>{item.employeeName}</EmployeeName>
                      <EmployeeId>ID: {item.employeeNumber}</EmployeeId>
                    </TableCell>
                    <TableCell>
                      <Amount>
                        KES {item.basicSalary?.toLocaleString() || '0'}
                      </Amount>
                    </TableCell>
                    <TableCell>
                      <Amount type="positive">
                        KES {item.grossSalary?.toLocaleString() || '0'}
                      </Amount>
                    </TableCell>
                    <TableCell>
                      <Amount type="negative">
                        KES {item.totalDeductions?.toLocaleString() || '0'}
                      </Amount>
                    </TableCell>
                    <TableCell>
                      <Amount type="positive">
                        KES {item.totalBenefits?.toLocaleString() || '0'}
                      </Amount>
                    </TableCell>
                    <TableCell>
                      <Amount type="total">
                        KES {item.netSalary?.toLocaleString() || '0'}
                      </Amount>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          ) : (
            <EmptyState>
              <p>No payroll items found for this period.</p>
            </EmptyState>
          )}
        </ContentCard>
      </Container>
    </PageContainer>
  )
}

export default PayrollViewer
