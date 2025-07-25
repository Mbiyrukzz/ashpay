import React, { useState, useContext, useMemo } from 'react'
import styled from 'styled-components'
import EmployeeContext from '../contexts/EmployeeContext'
import {
  calculateKraDeductions,
  calculateBenefits,
  calculateSalaryBreakdown,
  validatePayeCalculation,
  DEFAULT_BENEFITS,
  DEFAULT_DEDUCTIONS,
  benefitCalculators,
} from '../utils/kraDeductions'

// Styled components
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

  &.toggle {
    background-color: #e2e8f0;
    color: #374151;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;

    &:hover:not(:disabled) {
      background-color: #d1d5db;
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
  border-left: 4px solid #dc2626;
`

const SuccessText = styled.div`
  color: #059669;
  font-size: 0.95rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 6px;
  border-left: 4px solid #059669;
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

const AddEmployeeForm = ({ onClose, onSuccess }) => {
  const { createEmployee } = useContext(EmployeeContext)

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
    DEFAULT_DEDUCTIONS.reduce((acc, ded) => {
      acc[ded] = { enabled: false, amount: '' }
      return acc
    }, {})
  )

  const [benefitConfig, setBenefitConfig] = useState(
    DEFAULT_BENEFITS.reduce((acc, benefit) => {
      acc[benefit] = { enabled: false, customAmount: '' }
      return acc
    }, {})
  )

  const [showBenefits, setShowBenefits] = useState(false)
  const [photo, setPhoto] = useState(null)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [loading, setLoading] = useState(false)

  const grossSalary = parseFloat(form.salary) || 0

  const kraDeductions = useMemo(() => {
    if (grossSalary <= 0) return []
    return calculateKraDeductions(grossSalary)
  }, [grossSalary])

  const calculatedBenefits = useMemo(() => {
    if (grossSalary <= 0) return []
    return calculateBenefits(grossSalary, benefitConfig)
  }, [grossSalary, benefitConfig])

  const nonStatutoryDeductions = useMemo(() => {
    return Object.entries(deductionConfig)
      .filter(([config]) => config.enabled)
      .map(([type, config]) => ({
        type,
        amount: parseFloat(config.amount) || 0,
        recurring: true,
      }))
  }, [deductionConfig])

  const breakdown = useMemo(() => {
    return calculateSalaryBreakdown(
      grossSalary,
      [...kraDeductions, ...nonStatutoryDeductions],
      calculatedBenefits
    )
  }, [grossSalary, kraDeductions, calculatedBenefits, nonStatutoryDeductions])

  const payeValidation = useMemo(() => {
    const paye = kraDeductions.find((ded) => ded.type === 'PAYE')?.amount || 0
    return validatePayeCalculation(grossSalary, paye)
  }, [grossSalary, kraDeductions])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (error) setError(null)
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

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Photo size must be less than 5MB')
        return
      }
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file')
        return
      }
      setPhoto(file)
      setError(null)
    }
  }

  const validateForm = () => {
    if (!form.name.trim()) {
      setError('Name is required')
      return false
    }
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Please enter a valid email address')
      return false
    }
    if (grossSalary <= 0) {
      setError('Please enter a valid salary amount')
      return false
    }
    if (form.phone && !/^(\+?\d{10,15})$/.test(form.phone)) {
      setError('Please enter a valid phone number')
      return false
    }
    if (
      Object.values(deductionConfig).some(
        (config) =>
          config.enabled &&
          (isNaN(config.amount) || parseFloat(config.amount) < 0)
      )
    ) {
      setError('Please enter valid amounts for selected deductions')
      return false
    }
    if (
      Object.values(benefitConfig).some(
        (config) =>
          config.enabled &&
          config.customAmount !== '' &&
          (isNaN(config.customAmount) || parseFloat(config.customAmount) < 0)
      )
    ) {
      setError('Please enter valid amounts for selected benefits')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const employeeData = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        department: form.department.trim() || null,
        position: form.position.trim() || null,
        salary: grossSalary,
        employeeId: form.employeeId.trim() || undefined,
        deductions: [...kraDeductions, ...nonStatutoryDeductions],
        benefits: calculatedBenefits,
        netSalary: breakdown.netSalary,
        photo: null,
      }

      if (photo) {
        const reader = new FileReader()
        employeeData.photo = await new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result)
          reader.readAsDataURL(photo)
        })
      }

      const result = await createEmployee(employeeData)
      setSuccess('Employee created successfully!')
      if (onSuccess) onSuccess(result)

      setForm({
        name: '',
        email: '',
        phone: '',
        department: '',
        position: '',
        salary: '',
        employeeId: '',
      })
      setDeductionConfig(
        DEFAULT_DEDUCTIONS.reduce((acc, ded) => {
          acc[ded] = { enabled: false, amount: '' }
          return acc
        }, {})
      )
      setBenefitConfig(
        DEFAULT_BENEFITS.reduce((acc, benefit) => {
          acc[benefit] = { enabled: false, customAmount: '' }
          return acc
        }, {})
      )
      setPhoto(null)
      setShowBenefits(false)

      setTimeout(() => {
        if (onClose) onClose()
      }, 1500)
    } catch (err) {
      setError(err.message || 'Failed to create employee. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <FormContainer>
      {error && <ErrorText role="alert">{error}</ErrorText>}
      {success && <SuccessText role="alert">{success}</SuccessText>}

      <FormGrid>
        <FormSection>
          <form onSubmit={handleSubmit}>
            <Field>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter employee's full name"
                required
                disabled={loading}
                aria-invalid={!!error && error.includes('Name')}
              />
            </Field>

            <Field>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="employee@company.com"
                required
                disabled={loading}
                aria-invalid={!!error && error.includes('email')}
              />
            </Field>

            <Field>
              <Label htmlFor="employeeId">Employee ID</Label>
              <Input
                id="employeeId"
                name="employeeId"
                value={form.employeeId}
                onChange={handleChange}
                placeholder="Leave blank to auto-generate"
                disabled={loading}
              />
              <SmallText>
                Optional. If left blank, system will generate automatically
                (EMP-timestamp)
              </SmallText>
            </Field>

            <Field>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+254712345678"
                disabled={loading}
                aria-invalid={!!error && error.includes('phone')}
              />
            </Field>

            <Field>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                name="department"
                value={form.department}
                onChange={handleChange}
                placeholder="e.g., Human Resources, IT, Finance"
                disabled={loading}
              />
            </Field>

            <Field>
              <Label htmlFor="position">Position/Job Title</Label>
              <Input
                id="position"
                name="position"
                value={form.position}
                onChange={handleChange}
                placeholder="e.g., Software Engineer, Accountant"
                disabled={loading}
              />
            </Field>

            <Field>
              <Label htmlFor="salary">Gross Salary (KES) *</Label>
              <Input
                id="salary"
                name="salary"
                type="number"
                min="0"
                step="0.01"
                value={form.salary}
                onChange={handleChange}
                placeholder="50000"
                required
                disabled={loading}
                aria-invalid={!!error && error.includes('salary')}
              />
              <SmallText>
                Enter the gross salary before any deductions
              </SmallText>
            </Field>

            <Field>
              <Label htmlFor="photo">Employee Photo</Label>
              <Input
                id="photo"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={loading}
              />
              <SmallText>
                Optional. Max size: 5MB. Supported formats: JPG, PNG, GIF
              </SmallText>
            </Field>

            <Field>
              <Label>Additional Deductions</Label>
              <BenefitConfig>
                {DEFAULT_DEDUCTIONS.map((deduction) => (
                  <BenefitRow key={deduction}>
                    <BenefitLabel>
                      <input
                        type="checkbox"
                        id={`deduction-${deduction}`}
                        checked={deductionConfig[deduction].enabled}
                        onChange={() => handleDeductionToggle(deduction)}
                        disabled={loading}
                      />
                      <span>{deduction}</span>
                    </BenefitLabel>
                    {deductionConfig[deduction].enabled && (
                      <BenefitInput
                        type="number"
                        min="0"
                        placeholder="0"
                        value={deductionConfig[deduction].amount}
                        onChange={(e) =>
                          handleDeductionAmountChange(deduction, e.target.value)
                        }
                        disabled={loading}
                        aria-label={`Amount for ${deduction}`}
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
              <Label>Benefits & Allowances (Optional)</Label>
              <Button
                type="button"
                className="toggle"
                onClick={() => setShowBenefits(!showBenefits)}
                disabled={loading}
              >
                {showBenefits ? 'Hide Benefits' : 'Add Benefits'}
              </Button>
              {showBenefits && (
                <BenefitConfig>
                  {DEFAULT_BENEFITS.map((benefit) => {
                    const defaultAmount = grossSalary
                      ? Math.round(
                          benefitCalculators[benefit]
                            ? benefitCalculators[benefit](grossSalary)
                            : 0
                        )
                      : 0

                    return (
                      <BenefitRow key={benefit}>
                        <BenefitLabel>
                          <input
                            type="checkbox"
                            id={`benefit-${benefit}`}
                            checked={benefitConfig[benefit].enabled}
                            onChange={() => handleBenefitToggle(benefit)}
                            disabled={loading}
                          />
                          <span>{benefit}</span>
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
                            aria-label={`Custom amount for ${benefit}`}
                          />
                        )}
                      </BenefitRow>
                    )
                  })}
                </BenefitConfig>
              )}
              <SmallText>
                Benefits are optional. Click "Add Benefits" to select
                allowances. Leave amount blank to use default calculation.
              </SmallText>
            </Field>

            <ButtonGroup>
              <Button
                type="button"
                className="secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" className="primary" disabled={loading}>
                {loading ? 'Processing...' : 'Create Employee'}
              </Button>
            </ButtonGroup>
          </form>
        </FormSection>

        <PreviewSection aria-labelledby="salary-breakdown">
          <PreviewTitle id="salary-breakdown">Salary Breakdown</PreviewTitle>

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
                <span>-KES {breakdown.totalDeductions.toLocaleString()}</span>
              </PreviewItem>
            </DeductionsList>
          )}

          {nonStatutoryDeductions.length > 0 && (
            <DeductionsList>
              <SectionTitle>Additional Deductions:</SectionTitle>
              {nonStatutoryDeductions.map((ded, index) => (
                <PreviewItem key={index}>
                  <span>{ded.type}:</span>
                  <span>-KES {ded.amount.toLocaleString()}</span>
                </PreviewItem>
              ))}
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
                  +KES {breakdown.totalBenefits.toLocaleString()}
                </span>
              </PreviewItem>
            </DeductionsList>
          )}

          <PreviewItem className="net-salary">
            <span>Net Salary:</span>
            <span>KES {breakdown.netSalary.toLocaleString()}</span>
          </PreviewItem>

          {payeValidation.warning && (
            <ErrorText
              role="alert"
              style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}
            >
              {payeValidation.warning}
            </ErrorText>
          )}

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
        </PreviewSection>
      </FormGrid>
    </FormContainer>
  )
}

export default AddEmployeeForm
