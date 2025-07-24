import React, { useState, useContext, useEffect } from 'react'
import styled from 'styled-components'
import EmployeeContext from '../contexts/EmployeeContext'

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

const SmallText = styled.small`
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

const ItemList = styled.ul`
  margin: 0.5rem 0;
  padding-left: 1rem;
  font-size: 0.8rem;

  li {
    margin-bottom: 0.25rem;
  }
`

// KRA deductions calculation function
const calculateKraDeductions = (salary) => {
  if (!salary || isNaN(salary)) return []

  const deductions = []
  const salaryNum = parseFloat(salary)

  // NHIF
  let nhif = 0
  if (salaryNum <= 5999) nhif = 150
  else if (salaryNum <= 7999) nhif = 300
  else if (salaryNum <= 11999) nhif = 400
  else if (salaryNum <= 14999) nhif = 500
  else if (salaryNum <= 19999) nhif = 600
  else if (salaryNum <= 24999) nhif = 750
  else if (salaryNum <= 29999) nhif = 850
  else if (salaryNum <= 34999) nhif = 900
  else if (salaryNum <= 39999) nhif = 950
  else if (salaryNum <= 44999) nhif = 1000
  else if (salaryNum <= 49999) nhif = 1100
  else nhif = 1700
  deductions.push({ type: 'NHIF', amount: nhif })

  // NSSF (Tier I)
  const nssf = Math.min(salaryNum, 6000) * 0.06
  deductions.push({ type: 'NSSF', amount: Math.round(nssf) })

  // Housing Levy
  const housingLevy = salaryNum * 0.015
  deductions.push({ type: 'Housing Levy', amount: Math.round(housingLevy) })

  // PAYE
  let paye = 0
  let remaining = salaryNum

  if (remaining > 32333) {
    paye += (remaining - 32333) * 0.3
    remaining = 32333
  }
  if (remaining > 24000) {
    paye += (remaining - 24000) * 0.25
    remaining = 24000
  }
  if (remaining > 0) {
    paye += remaining * 0.1
  }

  paye = Math.max(paye - 2400, 0)
  deductions.push({ type: 'PAYE', amount: Math.round(paye) })

  return deductions
}

const AddEmployeeForm = ({ onClose, onSuccess }) => {
  const { createEmployee } = useContext(EmployeeContext)

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
  })

  const [deductions, setDeductions] = useState([])
  const [benefits, setBenefits] = useState([])
  const [photo, setPhoto] = useState(null)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [loading, setLoading] = useState(false)
  const [kraDeductions, setKraDeductions] = useState([])

  // Calculate KRA deductions when salary changes
  useEffect(() => {
    if (form.salary) {
      const calculated = calculateKraDeductions(form.salary)
      setKraDeductions(calculated)
    } else {
      setKraDeductions([])
    }
  }, [form.salary])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (error) setError(null)
  }

  const handleSelectChange = (e, setFn) => {
    const selected = Array.from(e.target.selectedOptions).map((o) => o.value)
    setFn(selected)
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
    if (!form.email.trim()) {
      setError('Email is required')
      return false
    }
    if (!form.salary || isNaN(form.salary) || parseFloat(form.salary) <= 0) {
      setError('Please enter a valid salary amount')
      return false
    }
    if (form.phone && !/^(\+?\d{10,15})$/.test(form.phone)) {
      setError('Please enter a valid phone number')
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
        ...form,
        salary: parseFloat(form.salary),
        deductions,
        benefits,
      }

      if (photo) {
        const reader = new FileReader()
        reader.onloadend = async () => {
          employeeData.photo = reader.result
          await submitEmployee(employeeData)
        }
        reader.readAsDataURL(photo)
      } else {
        await submitEmployee(employeeData)
      }
    } catch (err) {
      console.error('Form submission error:', err)
      setError('An unexpected error occurred. Please try again.')
      setLoading(false)
    }
  }

  const submitEmployee = async (employeeData) => {
    try {
      await createEmployee(employeeData)
      setSuccess('Employee created successfully!')

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess()
      }

      // Reset form
      setForm({
        name: '',
        email: '',
        phone: '',
        department: '',
        position: '',
        salary: '',
      })
      setDeductions([])
      setBenefits([])
      setPhoto(null)

      // Close modal after a brief delay
      setTimeout(() => {
        if (onClose) onClose()
      }, 1500)
    } catch (err) {
      console.error('Employee creation error:', err)
      setError(err.message || 'Failed to create employee. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Calculate totals for preview
  const totalKraDeductions = kraDeductions.reduce(
    (sum, ded) => sum + ded.amount,
    0
  )
  const grossSalary = parseFloat(form.salary) || 0
  const netSalary = grossSalary - totalKraDeductions

  return (
    <FormContainer>
      {error && <ErrorText>{error}</ErrorText>}
      {success && <SuccessText>{success}</SuccessText>}

      <FormGrid>
        <FormSection>
          <form onSubmit={handleSubmit}>
            <Field>
              <Label>Full Name *</Label>
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter employee's full name"
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
                placeholder="employee@company.com"
                required
                disabled={loading}
              />
            </Field>

            <Field>
              <Label>Phone Number</Label>
              <Input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+254712345678"
                disabled={loading}
              />
            </Field>

            <Field>
              <Label>Department</Label>
              <Input
                name="department"
                value={form.department}
                onChange={handleChange}
                placeholder="e.g., Human Resources, IT, Finance"
                disabled={loading}
              />
            </Field>

            <Field>
              <Label>Position/Job Title</Label>
              <Input
                name="position"
                value={form.position}
                onChange={handleChange}
                placeholder="e.g., Software Engineer, Accountant"
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
                placeholder="50000"
                required
                disabled={loading}
              />
              <SmallText>
                Enter the gross salary before any deductions
              </SmallText>
            </Field>

            <Field>
              <Label>Employee Photo</Label>
              <Input
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
              <Select
                multiple
                value={deductions}
                onChange={(e) => handleSelectChange(e, setDeductions)}
                disabled={loading}
              >
                {defaultDeductions.map((ded) => (
                  <option key={ded} value={ded}>
                    {ded}
                  </option>
                ))}
              </Select>
              <SmallText>
                Hold Ctrl/Cmd to select multiple. Statutory deductions are
                calculated automatically.
              </SmallText>
            </Field>

            <Field>
              <Label>Benefits & Allowances</Label>
              <Select
                multiple
                value={benefits}
                onChange={(e) => handleSelectChange(e, setBenefits)}
                disabled={loading}
              >
                {defaultBenefits.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </Select>
              <SmallText>Hold Ctrl/Cmd to select multiple</SmallText>
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
                {loading ? 'Creating Employee...' : 'Create Employee'}
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
                <span>Total Deductions:</span>
                <span>-KES {totalKraDeductions.toLocaleString()}</span>
              </PreviewItem>
            </DeductionsList>
          )}

          <PreviewItem className="net-salary">
            <span>Net Salary:</span>
            <span>KES {netSalary.toLocaleString()}</span>
          </PreviewItem>

          {deductions.length > 0 && (
            <div
              style={{
                marginTop: '1rem',
                fontSize: '0.8rem',
                color: '#dc2626',
              }}
            >
              <SectionTitle>Additional Deductions:</SectionTitle>
              <ItemList>
                {deductions.map((ded, index) => (
                  <li key={index}>{ded}</li>
                ))}
              </ItemList>
              <em>Amounts to be specified later</em>
            </div>
          )}

          {benefits.length > 0 && (
            <div
              style={{
                marginTop: '1rem',
                fontSize: '0.8rem',
                color: '#059669',
              }}
            >
              <SectionTitle>Benefits & Allowances:</SectionTitle>
              <ItemList>
                {benefits.map((ben, index) => (
                  <li key={index}>{ben}</li>
                ))}
              </ItemList>
              <em>Amounts to be specified later</em>
            </div>
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
