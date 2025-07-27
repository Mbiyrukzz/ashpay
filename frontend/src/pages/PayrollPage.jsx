import React, { useState, useContext } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import EmployeeContext from '../contexts/EmployeeContext'
import PayrollList from '../components/PayrollList'

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
`

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`

const PageHeader = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
`

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
`

const TabContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`

const Tab = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;

  ${(props) =>
    props.active
      ? `
    background: #6366f1;
    color: white;
    box-shadow: 0 2px 4px rgba(99, 102, 241, 0.3);
  `
      : `
    background: #f3f4f6;
    color: #374151;
    &:hover {
      background: #e5e7eb;
    }
  `}
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`

const StatCard = styled.div`
  background: linear-gradient(135deg, ${(props) => props.gradient});
  padding: 1.5rem;
  border-radius: 12px;
  color: white;
  text-align: center;
`

const StatValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`

const StatLabel = styled.div`
  font-size: 0.875rem;
  opacity: 0.9;
`

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`

const GeneratorCard = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`

const CardHeader = styled.div`
  padding: 2rem 2rem 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
`

const CardTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
`

const CardSubtitle = styled.p`
  margin: 0;
  opacity: 0.9;
  font-size: 0.875rem;
`

const FormContainer = styled.div`
  padding: 2rem;
`

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const Label = styled.label`
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
`

const Input = styled.input`
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
`

const Select = styled.select`
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  background: white;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
`

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  min-height: 80px;
  resize: vertical;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
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
      : `
    background: #f3f4f6;
    color: #374151;
    &:hover:not(:disabled) {
      background: #e5e7eb;
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`

const SidebarCard = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`

const PreviewContainer = styled.div`
  padding: 1.5rem;
`

const PreviewTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 1rem 0;
`

const SummaryGrid = styled.div`
  display: grid;
  gap: 1rem;
  margin-bottom: 1.5rem;
`

const SummaryCard = styled.div`
  background: #f8fafc;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  border: 1px solid #e2e8f0;
`

const SummaryValue = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
`

const SummaryLabel = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const Message = styled.div`
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;

  ${(props) =>
    props.type === 'error'
      ? `
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #dc2626;
  `
      : props.type === 'success'
      ? `
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    color: #166534;
  `
      : `
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    color: #1d4ed8;
  `}
`

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 0.5rem;

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
  padding: 2rem;
  color: #6b7280;
`

const ListContainer = styled.div`
  margin-bottom: 2rem;
`

const PayrollPage = () => {
  const navigate = useNavigate()
  const {
    loading: employeesLoading,
    totalEmployees,
    generatePayroll,
    previewPayroll,
    calculateTotalSalaryBudget,
    getActiveEmployees,
  } = useContext(EmployeeContext)

  const [activeTab, setActiveTab] = useState('generate') // 'generate' or 'history'
  const [formData, setFormData] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    workingDays: 22,
    payDate: '',
    cutoffDate: '',
    notes: '',
  })

  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const months = [
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

  const activeEmployees = getActiveEmployees()
  const totalSalaryBudget = calculateTotalSalaryBudget()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'month' || name === 'year' || name === 'workingDays'
          ? parseInt(value) || ''
          : value,
    }))
    setMessage({ type: '', text: '' })
  }

  const handlePreview = async () => {
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const response = await previewPayroll(formData)
      setPreview(response)
      setMessage({
        type: 'info',
        text: `Preview generated for ${
          response.summary?.totalEmployees || 0
        } employees`,
      })
    } catch (error) {
      console.error('❌ Error generating preview:', error)
      setMessage({
        type: 'error',
        text: error.message || 'Failed to generate preview',
      })
      setPreview(null)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async () => {
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const response = await generatePayroll(formData)

      setMessage({
        type: 'success',
        text: `✅ Payroll generated successfully! Click to view details.`,
      })
      setPreview(null)

      // Reset form
      setFormData({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        workingDays: 22,
        payDate: '',
        cutoffDate: '',
        notes: '',
      })

      // Switch to history tab to see the new payroll
      setTimeout(() => {
        setActiveTab('history')
      }, 2000)
    } catch (error) {
      console.error('❌ Error generating payroll:', error)
      setMessage({
        type: 'error',
        text: error.message || 'Failed to generate payroll',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleViewPayroll = (payrollId) => {
    navigate(`/payroll/${payrollId}`)
  }

  const isFormValid =
    formData.month &&
    formData.year &&
    formData.workingDays > 0 &&
    !employeesLoading
  const selectedMonth = months.find((m) => m.value === formData.month)

  if (employeesLoading) {
    return (
      <PageContainer>
        <Container>
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <LoadingSpinner
              style={{ width: '40px', height: '40px', margin: '0 auto 1rem' }}
            />
            <p>Loading employee data...</p>
          </div>
        </Container>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <Container>
        <PageHeader>
          <HeaderContent>
            <Title>Payroll Management</Title>
            <TabContainer>
              <Tab
                active={activeTab === 'generate'}
                onClick={() => setActiveTab('generate')}
              >
                Generate Payroll
              </Tab>
              <Tab
                active={activeTab === 'history'}
                onClick={() => setActiveTab('history')}
              >
                Payroll History
              </Tab>
            </TabContainer>
          </HeaderContent>

          <StatsGrid>
            <StatCard gradient="#667eea 0%, #764ba2 100%">
              <StatValue>{totalEmployees}</StatValue>
              <StatLabel>Total Employees</StatLabel>
            </StatCard>

            <StatCard gradient="#f093fb 0%, #f5576c 100%">
              <StatValue>{activeEmployees.length}</StatValue>
              <StatLabel>Active Employees</StatLabel>
            </StatCard>

            <StatCard gradient="#4facfe 0%, #00f2fe 100%">
              <StatValue>KES {totalSalaryBudget.toLocaleString()}</StatValue>
              <StatLabel>Monthly Budget</StatLabel>
            </StatCard>

            <StatCard gradient="#43e97b 0%, #38f9d7 100%">
              <StatValue>{selectedMonth?.label}</StatValue>
              <StatLabel>Current Period</StatLabel>
            </StatCard>
          </StatsGrid>
        </PageHeader>

        {activeTab === 'history' ? (
          <ListContainer>
            <PayrollList onViewPayroll={handleViewPayroll} />
          </ListContainer>
        ) : activeEmployees.length === 0 ? (
          <GeneratorCard>
            <EmptyState>
              <h3>No Active Employees Found</h3>
              <p>
                You need at least one active employee with a valid salary to
                generate payroll.
              </p>
            </EmptyState>
          </GeneratorCard>
        ) : (
          <MainContent>
            <GeneratorCard>
              <CardHeader>
                <CardTitle>Generate Payroll</CardTitle>
                <CardSubtitle>
                  Create monthly payroll for your team
                </CardSubtitle>
              </CardHeader>

              <FormContainer>
                {message.text && (
                  <Message type={message.type}>
                    {message.text}
                    {message.type === 'success' && (
                      <Button
                        style={{
                          marginLeft: '1rem',
                          padding: '0.5rem 1rem',
                          fontSize: '0.75rem',
                        }}
                        onClick={() => setActiveTab('history')}
                      >
                        View History
                      </Button>
                    )}
                  </Message>
                )}

                <FormGrid>
                  <FormGroup>
                    <Label>Month</Label>
                    <Select
                      name="month"
                      value={formData.month}
                      onChange={handleInputChange}
                    >
                      {months.map((month) => (
                        <option key={month.value} value={month.value}>
                          {month.label}
                        </option>
                      ))}
                    </Select>
                  </FormGroup>

                  <FormGroup>
                    <Label>Year</Label>
                    <Input
                      type="number"
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      min="2020"
                      max="2030"
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Working Days</Label>
                    <Input
                      type="number"
                      name="workingDays"
                      value={formData.workingDays}
                      onChange={handleInputChange}
                      min="1"
                      max="31"
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Pay Date (Optional)</Label>
                    <Input
                      type="date"
                      name="payDate"
                      value={formData.payDate}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                </FormGrid>

                <FormGroup style={{ gridColumn: '1 / -1' }}>
                  <Label>Cutoff Date (Optional)</Label>
                  <Input
                    type="date"
                    name="cutoffDate"
                    value={formData.cutoffDate}
                    onChange={handleInputChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Notes (Optional)</Label>
                  <TextArea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Add any notes about this payroll period..."
                  />
                </FormGroup>

                <ButtonGroup>
                  <Button
                    type="button"
                    onClick={handlePreview}
                    disabled={!isFormValid || loading}
                  >
                    {loading && <LoadingSpinner />}
                    Preview Payroll
                  </Button>

                  {preview && (
                    <Button
                      variant="success"
                      onClick={handleGenerate}
                      disabled={loading}
                    >
                      {loading && <LoadingSpinner />}
                      Generate Payroll
                    </Button>
                  )}
                </ButtonGroup>
              </FormContainer>
            </GeneratorCard>

            <SidebarCard>
              {preview ? (
                <PreviewContainer>
                  <PreviewTitle>Payroll Preview</PreviewTitle>
                  <p
                    style={{
                      color: '#6b7280',
                      fontSize: '0.875rem',
                      marginBottom: '1rem',
                    }}
                  >
                    {selectedMonth?.label} {formData.year}
                  </p>

                  <SummaryGrid>
                    <SummaryCard>
                      <SummaryValue>
                        {preview.summary?.totalEmployees || 0}
                      </SummaryValue>
                      <SummaryLabel>Employees</SummaryLabel>
                    </SummaryCard>

                    <SummaryCard>
                      <SummaryValue>
                        KES{' '}
                        {preview.summary?.totalGrossPay?.toLocaleString() ||
                          '0'}
                      </SummaryValue>
                      <SummaryLabel>Gross Pay</SummaryLabel>
                    </SummaryCard>

                    <SummaryCard>
                      <SummaryValue>
                        KES{' '}
                        {preview.summary?.totalDeductions?.toLocaleString() ||
                          '0'}
                      </SummaryValue>
                      <SummaryLabel>Deductions</SummaryLabel>
                    </SummaryCard>

                    <SummaryCard>
                      <SummaryValue>
                        KES{' '}
                        {preview.summary?.totalNetPay?.toLocaleString() || '0'}
                      </SummaryValue>
                      <SummaryLabel>Net Pay</SummaryLabel>
                    </SummaryCard>
                  </SummaryGrid>

                  {preview.hasMore && (
                    <p
                      style={{
                        color: '#6b7280',
                        fontSize: '0.75rem',
                        textAlign: 'center',
                        fontStyle: 'italic',
                      }}
                    >
                      Preview shows first 10 employees. Full payroll will
                      include all {preview.summary?.totalEmployees} employees.
                    </p>
                  )}
                </PreviewContainer>
              ) : (
                <PreviewContainer>
                  <PreviewTitle>Payroll Summary</PreviewTitle>
                  <p
                    style={{
                      color: '#6b7280',
                      fontSize: '0.875rem',
                      marginBottom: '1rem',
                    }}
                  >
                    Generate a preview to see payroll calculations
                  </p>

                  <SummaryGrid>
                    <SummaryCard>
                      <SummaryValue>{activeEmployees.length}</SummaryValue>
                      <SummaryLabel>Active Employees</SummaryLabel>
                    </SummaryCard>

                    <SummaryCard>
                      <SummaryValue>{formData.workingDays}</SummaryValue>
                      <SummaryLabel>Working Days</SummaryLabel>
                    </SummaryCard>

                    <SummaryCard>
                      <SummaryValue>
                        KES {totalSalaryBudget.toLocaleString()}
                      </SummaryValue>
                      <SummaryLabel>Budget</SummaryLabel>
                    </SummaryCard>
                  </SummaryGrid>
                </PreviewContainer>
              )}
            </SidebarCard>
          </MainContent>
        )}
      </Container>
    </PageContainer>
  )
}

export default PayrollPage
