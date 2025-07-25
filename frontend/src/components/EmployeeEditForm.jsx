import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import EmployeeContext from '../contexts/EmployeeContext'
import styled from 'styled-components'

// Reuse styles from AddEmployeeForm.jsx
const FormContainer = styled.div`
  max-height: 80vh;
  overflow-y: auto;
  width: 100%;
  max-width: 800px;
`

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
`

const PreviewSection = styled.div`
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  height: fit-content;

  @media (max-width: 768px) {
    order: -1;
  }
`

const Field = styled.div`
  margin-bottom: 1.2rem;
`

const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 0.4rem;
  color: #374151;
`

const Input = styled.input`
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
`

const Select = styled.select`
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  min-height: 100px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
`

const BenefitConfig = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 1rem;
  margin-top: 0.5rem;
  background: #fafafa;
`

const BenefitRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`

const BenefitLabel = styled.label`
  flex: 1;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const BenefitInput = styled(Input)`
  width: 100px;
  padding: 0.4rem;
  font-size: 0.85rem;
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
`

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &.primary {
    background-color: #2563eb;
    color: white;

    &:hover:not(:disabled) {
      background-color: #1d4ed8;
    }
  }

  &.secondary {
    background-color: #f3f4f6;
    color: #374151;

    &:hover:not(:disabled) {
      background-color: #e5e7eb;
    }
  }

  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
    opacity: 0.6;
  }
`

const ErrorText = styled.div`
  color: #dc2626;
  font-size: 0.95rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
`

const PreviewTitle = styled.h3`
  margin: 0 0 1rem 0;
  color: #374151;
  font-size: 1.1rem;
`

const PreviewItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  padding: 0.25rem 0;
  font-size: 0.9rem;

  &.total {
    border-top: 1px solid #d1d5db;
    padding-top: 0.5rem;
    font-weight: 600;
    color: #1f2937;
    margin-top: 0.5rem;
  }

  &.net-salary {
    background: #dbeafe;
    padding: 0.5rem;
    border-radius: 4px;
    font-weight: 700;
    color: #1e40af;
    margin-top: 0.5rem;
  }
`

const DeductionsList = styled.div`
  margin-bottom: 1rem;
`

const SmallText = styled.div`
  color: #6b7280;
  font-size: 0.8rem;
  display: block;
  margin-top: 0.25rem;
`

const SectionTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
`

// KRA deductions calculation function (aligned with backend)
const calculateKraDeductions = (salary) => {
  if (!salary || isNaN(salary)) {
    console.log('Invalid salary for KRA deductions:', salary)
    return []
  }

  const deductions = []
  const salaryNum = parseFloat(salary)
  console.log('Calculating KRA deductions for salary:', salaryNum)

  // NHIF
  let nhif = 0
  if (salaryNum <= 5999) nhif = 150
  else if (salaryNum <= 7999) nhif = 300
  else if (salaryNum <= 11999) nhif = 400
  else nhif = 1700
  deductions.push({ type: 'NHIF', amount: nhif, recurring: true })

  // NSSF
  const nssf = Math.min(salaryNum * 0.06, 1080)
  deductions.push({ type: 'NSSF', amount: Math.round(nssf), recurring: true })

  // Housing Levy
  const housingLevy = salaryNum * 0.015
  deductions.push({
    type: 'Housing Levy',
    amount: Math.round(housingLevy),
    recurring: true,
  })

  // PAYE (with 200 KES monthly relief)
  let paye = 0
  if (salaryNum <= 24000) {
    paye = salaryNum * 0.1
  } else if (salaryNum <= 32333) {
    paye = 24000 * 0.1 + (salaryNum - 24000) * 0.25
  } else {
    paye = 24000 * 0.1 + 8333 * 0.25 + (salaryNum - 32333) * 0.3
  }
  paye = Math.max(paye - 200, 0)
  deductions.push({ type: 'PAYE', amount: Math.round(paye), recurring: true })

  console.log('Calculated KRA Deductions:', deductions)
  return deductions
}

// Benefits calculation functions
const benefitCalculators = {
  'Medical Insurance': (gross) => gross * 0.02,
  'Transport Allowance': () => 3000,
  'Housing Allowance': (gross) => gross * 0.15,
  'Meal Allowance': () => 2000,
  'Phone Allowance': () => 1000,
  Overtime: () => 0,
  Commission: () => 0,
}

const calculateBenefits = (salary, benefitConfig) => {
  if (!salary || isNaN(salary)) {
    console.log('Invalid salary for benefits calculation:', salary)
    return []
  }

  const salaryNum = parseFloat(salary)
  const benefits = []

  Object.entries(benefitConfig).forEach(([type, config]) => {
    if (config.enabled) {
      const defaultAmount = benefitCalculators[type]
        ? benefitCalculators[type](salaryNum)
        : 0
      const amount =
        config.customAmount !== '' && !isNaN(config.customAmount)
          ? parseFloat(config.customAmount)
          : defaultAmount

      benefits.push({
        type,
        amount: Math.round(amount),
        recurring: !['Overtime', 'Commission'].includes(type),
      })
    }
  })

  console.log('Calculated Benefits:', benefits)
  return benefits
}

const EditEmployeeForm = () => {
  const { employeeId } = useParams()
  const navigate = useNavigate()
  const { employees, fetchEmployees, updateEmployee } =
    useContext(EmployeeContext)

  const defaultDeductions = [
    'Loan Repayment',
    'Advance Salary',
    'Disciplinary Fine',
    'Union Dues',
  ]

  const defaultBenefits = [
    'Medical Insurance',
    'Transport Allowance',
    'Housing Allowance',
    'Meal Allowance',
    'Phone Allowance',
    'Overtime',
    'Commission',
  ]

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    salary: '',
    employeeId: '',
  })

  const [deductionConfig, setDeductionConfig] = useState(
    defaultDeductions.reduce(
      (acc, ded) => ({
        ...acc,
        [ded]: { enabled: false, amount: '' },
      }),
      {}
    )
  )

  const [benefitConfig, setBenefitConfig] = useState(
    defaultBenefits.reduce((acc, benefit) => {
      acc[benefit] = { enabled: false, customAmount: '' }
      return acc
    }, {})
  )

  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [kraDeductions, setKraDeductions] = useState([])
  const [calculatedBenefits, setCalculatedBenefits] = useState([])

  useEffect(() => {
    if (!employees.length) {
      console.log('Fetching employees as employees array is empty')
      fetchEmployees()
    }
  }, [fetchEmployees, employees.length])

  useEffect(() => {
    const found = employees.find((e) => e._id === employeeId)
    if (found) {
      const salaryStr = found.salary ? found.salary.toString() : ''
      setForm({
        name: found.name || '',
        email: found.email || '',
        phone: found.phone || '',
        department: found.department || '',
        position: found.position || '',
        salary: salaryStr,
        employeeId: found.employeeId || '',
      })

      const newDeductionConfig = defaultDeductions.reduce(
        (acc, ded) => ({
          ...acc,
          [ded]: {
            enabled: found.deductions.some((d) => d.type === ded),
            amount:
              found.deductions.find((d) => d.type === ded)?.amount.toString() ||
              '',
          },
        }),
        {}
      )
      setDeductionConfig(newDeductionConfig)

      const newBenefitConfig = defaultBenefits.reduce(
        (acc, benefit) => ({
          ...acc,
          [benefit]: {
            enabled: found.benefits.some((b) => b.type === benefit),
            customAmount:
              found.benefits
                .find((b) => b.type === benefit)
                ?.amount.toString() || '',
          },
        }),
        {}
      )
      setBenefitConfig(newBenefitConfig)

      console.log('Initialized form with employee:', {
        ...found,
        salary: salaryStr,
      })
    } else {
      console.log('Employee not found for ID:', employeeId)
    }
  }, [employees, employeeId])

  useEffect(() => {
    console.log('useEffect triggered with form.salary:', form.salary)
    if (form.salary && !isNaN(form.salary) && parseFloat(form.salary) > 0) {
      const calculated = calculateKraDeductions(form.salary)
      setKraDeductions(calculated)
      console.log('Set kraDeductions:', calculated)
      const benefits = calculateBenefits(form.salary, benefitConfig)
      setCalculatedBenefits(benefits)
      console.log('Set calculatedBenefits:', benefits)
    } else {
      setKraDeductions([])
      setCalculatedBenefits([])
      console.log(
        'Reset kraDeductions and calculatedBenefits due to invalid salary:',
        form.salary
      )
    }
  }, [form.salary, benefitConfig])

  const handleChange = (e) => {
    console.log('Input change:', { name: e.target.name, value: e.target.value })
    setForm({ ...form, [e.target.name]: e.target.value })
    setError(null)
  }

  const handleDeductionToggle = (deductionType) => {
    setDeductionConfig((prev) => ({
      ...prev,
      [deductionType]: {
        ...prev[deductionType],
        enabled: !prev[deductionType].enabled,
      },
    }))
  }

  const handleDeductionAmountChange = (deductionType, amount) => {
    setDeductionConfig((prev) => ({
      ...prev,
      [deductionType]: {
        ...prev[deductionType],
        amount,
      },
    }))
  }

  const handleBenefitToggle = (benefitType) => {
    setBenefitConfig((prev) => ({
      ...prev,
      [benefitType]: {
        ...prev[benefitType],
        enabled: !prev[benefitType].enabled,
      },
    }))
  }

  const handleBenefitAmountChange = (benefitType, amount) => {
    setBenefitConfig((prev) => ({
      ...prev,
      [benefitType]: {
        ...prev[benefitType],
        customAmount: amount,
      },
    }))
  }

  const validateForm = () => {
    if (!form.name.trim()) {
      setError('Name is required')
      return false
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Please enter a valid email address')
      return false
    }
    if (form.phone && !/^(\+?\d{10,15})$/.test(form.phone)) {
      setError('Please enter a valid phone number')
      return false
    }
    if (!form.salary || isNaN(form.salary) || parseFloat(form.salary) <= 0) {
      setError('Please enter a valid salary amount')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    setError(null)

    try {
      const userDeductions = Object.entries(deductionConfig)
        .filter(([_, config]) => config.enabled)
        .map(([type, config]) => ({
          type,
          amount: parseFloat(config.amount) || 0,
          recurring: type !== 'Advance Salary',
        }))

      const benefitOverrides = {}
      const excludedBenefits = []
      Object.entries(benefitConfig).forEach(([type, config]) => {
        if (config.enabled) {
          if (config.customAmount !== '' && config.customAmount !== null) {
            benefitOverrides[type] = parseFloat(config.customAmount) || 0
          }
        } else {
          excludedBenefits.push(type)
        }
      })

      const employeeData = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        department: form.department.trim() || null,
        position: form.position.trim() || null,
        salary: parseFloat(form.salary),
        employeeId: form.employeeId.trim() || undefined,
        deductions: userDeductions,
        benefits: {
          benefitOverrides,
          excludedBenefits,
        },
      }

      console.log('Submitting employeeData:', employeeData)

      await updateEmployee(employeeId, employeeData)
      navigate(`/employees/${employeeId}`)
    } catch (err) {
      console.error('Update error:', err)
      setError(err.message || 'Failed to update employee')
    } finally {
      setLoading(false)
    }
  }

  const totalKraDeductions = kraDeductions.reduce(
    (sum, ded) => sum + ded.amount,
    0
  )
  const totalBenefits = calculatedBenefits.reduce(
    (sum, ben) => sum + ben.amount,
    0
  )
  const totalUserDeductions = Object.entries(deductionConfig)
    .filter(([_, config]) => config.enabled)
    .reduce((sum, [_, config]) => sum + (parseFloat(config.amount) || 0), 0)
  const grossSalary = parseFloat(form.salary) || 0
  const netSalary =
    grossSalary - totalKraDeductions - totalUserDeductions + totalBenefits

  return (
    <FormContainer>
      {error && <ErrorText>{error}</ErrorText>}

      <FormGrid>
        <FormSection>
          <form onSubmit={handleSubmit}>
            <Field>
              <Label>Full Name *</Label>
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Field>

            <Field>
              <Label>Email Address *</Label>
              <Input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Field>

            <Field>
              <Label>Employee ID</Label>
              <Input
                name="employeeId"
                value={form.employeeId}
                onChange={handleChange}
                disabled={loading}
              />
            </Field>

            <Field>
              <Label>Phone Number</Label>
              <Input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                disabled={loading}
              />
            </Field>

            <Field>
              <Label>Department</Label>
              <Input
                name="department"
                value={form.department}
                onChange={handleChange}
                disabled={loading}
              />
            </Field>

            <Field>
              <Label>Position/Job Title</Label>
              <Input
                name="position"
                value={form.position}
                onChange={handleChange}
                disabled={loading}
              />
            </Field>

            <Field>
              <Label>Gross Salary (KES) *</Label>
              <Input
                name="salary"
                type="number"
                min="0"
                step="0.01"
                value={form.salary}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <SmallText>Enter the gross salary before deductions</SmallText>
            </Field>

            <Field>
              <Label>Additional Deductions</Label>
              <BenefitConfig>
                {defaultDeductions.map((ded) => (
                  <BenefitRow key={ded}>
                    <BenefitLabel>
                      <input
                        type="checkbox"
                        checked={deductionConfig[ded].enabled}
                        onChange={() => handleDeductionToggle(ded)}
                        disabled={loading}
                      />
                      {ded}
                    </BenefitLabel>
                    {deductionConfig[ded].enabled && (
                      <BenefitInput
                        type="number"
                        min="0"
                        placeholder="0"
                        value={deductionConfig[ded].amount}
                        onChange={(e) =>
                          handleDeductionAmountChange(ded, e.target.value)
                        }
                        disabled={loading}
                      />
                    )}
                  </BenefitRow>
                ))}
              </BenefitConfig>
              <SmallText>
                Check deductions to include. Enter amounts or leave as 0.
              </SmallText>
            </Field>

            <Field>
              <Label>Benefits & Allowances</Label>
              <BenefitConfig>
                {defaultBenefits.map((benefit) => {
                  const defaultAmount = form.salary
                    ? Math.round(
                        benefitCalculators[benefit]
                          ? benefitCalculators[benefit](parseFloat(form.salary))
                          : 0
                      )
                    : 0

                  return (
                    <BenefitRow key={benefit}>
                      <BenefitLabel>
                        <input
                          type="checkbox"
                          checked={benefitConfig[benefit].enabled}
                          onChange={() => handleBenefitToggle(benefit)}
                          disabled={loading}
                        />
                        {benefit}
                        {defaultAmount > 0 && (
                          <span
                            style={{ color: '#6b7280', fontSize: '0.8rem' }}
                          >
                            (default: KES {defaultAmount.toLocaleString()})
                          </span>
                        )}
                      </BenefitLabel>
                      {benefitConfig[benefit].enabled && (
                        <BenefitInput
                          type="number"
                          min="0"
                          placeholder={defaultAmount.toString()}
                          value={benefitConfig[benefit].customAmount}
                          onChange={(e) =>
                            handleBenefitAmountChange(benefit, e.target.value)
                          }
                          disabled={loading}
                        />
                      )}
                    </BenefitRow>
                  )
                })}
              </BenefitConfig>
              <SmallText>
                Check benefits to include. Leave amount blank to use default
                calculation.
              </SmallText>
            </Field>

            <ButtonGroup>
              <Button
                type="button"
                className="secondary"
                onClick={() => navigate(`/employees/${employeeId}`)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" className="primary" disabled={loading}>
                {loading ? 'Updating Employee...' : 'Update Employee'}
              </Button>
            </ButtonGroup>
          </form>
        </FormSection>

        <PreviewSection>
          <PreviewTitle>Salary Breakdown</PreviewTitle>

          <PreviewItem>
            <span>Gross Salary:</span>
            <span>KES {grossSalary.toLocaleString()}</span>
          </PreviewItem>

          {kraDeductions.length > 0 && (
            <DeductionsList>
              <SectionTitle>Statutory Deductions:</SectionTitle>
              {kraDeductions.map((ded, index) => (
                <PreviewItem key={index}>
                  <span>{ded.type}:</span>
                  <span>-KES {ded.amount.toLocaleString()}</span>
                </PreviewItem>
              ))}
              <PreviewItem className="total">
                <span>Total Statutory Deductions:</span>
                <span>-KES {totalKraDeductions.toLocaleString()}</span>
              </PreviewItem>
            </DeductionsList>
          )}

          {totalUserDeductions > 0 && (
            <DeductionsList>
              <SectionTitle>Additional Deductions:</SectionTitle>
              {Object.entries(deductionConfig)
                .filter(([_, config]) => config.enabled)
                .map(([type, config], index) => (
                  <PreviewItem key={index}>
                    <span>{type}:</span>
                    <span>
                      -KES {(parseFloat(config.amount) || 0).toLocaleString()}
                    </span>
                  </PreviewItem>
                ))}
              <PreviewItem className="total">
                <span>Total Additional Deductions:</span>
                <span>-KES {totalUserDeductions.toLocaleString()}</span>
              </PreviewItem>
            </DeductionsList>
          )}

          {calculatedBenefits.length > 0 && (
            <DeductionsList>
              <SectionTitle>Benefits & Allowances:</SectionTitle>
              {calculatedBenefits.map((ben, index) => (
                <PreviewItem key={index}>
                  <span>{ben.type}:</span>
                  <span style={{ color: '#059669' }}>
                    +KES {ben.amount.toLocaleString()}
                  </span>
                </PreviewItem>
              ))}
              <PreviewItem className="total">
                <span>Total Benefits:</span>
                <span style={{ color: '#059669' }}>
                  +KES {totalBenefits.toLocaleString()}
                </span>
              </PreviewItem>
            </DeductionsList>
          )}

          <PreviewItem className="net-salary">
            <span>Net Salary:</span>
            <span>KES {netSalary.toLocaleString()}</span>
          </PreviewItem>

          {grossSalary === 0 && (
            <div
              style={{
                textAlign: 'center',
                color: '#6b7280',
                fontSize: '0.9rem',
                fontStyle: 'italic',
                marginTop: '1rem',
              }}
            >
              Enter a salary to see breakdown
            </div>
          )}
          {grossSalary >= 32000 &&
            Math.abs(
              kraDeductions.find((ded) => ded.type === 'PAYE')?.amount - 3000
            ) > 1000 && (
              <div
                style={{
                  color: '#dc2626',
                  fontSize: '0.85rem',
                  marginTop: '0.5rem',
                  fontStyle: 'italic',
                }}
              >
                Warning: PAYE (KES{' '}
                {kraDeductions
                  .find((ded) => ded.type === 'PAYE')
                  ?.amount.toLocaleString()}
                ) deviates significantly from expected ~3,000 KES. Verify
                salary.
              </div>
            )}
        </PreviewSection>
      </FormGrid>
    </FormContainer>
  )
}

export default EditEmployeeForm
