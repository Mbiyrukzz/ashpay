import React, { useState, useContext } from 'react'
import styled from 'styled-components'
import useAuthedRequest from '../hooks/useAuthedRequest'

import Modal from './Modal'
import PayrollOptionsContext from '../contexts/PayrollOptionsContext'

const FormContainer = styled.div`
  max-height: 90vh;
  overflow-y: auto;
  padding: 2rem;
  width: 700px;
  background: white;
  border-radius: 12px;
`

const Field = styled.div`
  margin-bottom: 1.2rem;
`

const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 0.4rem;
`

const Input = styled.input`
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
`

const Select = styled.select`
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
`

const Button = styled.button`
  background-color: #2563eb;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background-color: #1d4ed8;
  }
`

const ErrorText = styled.p`
  color: red;
  font-size: 0.95rem;
  margin-bottom: 1rem;
`

const AddEmployeeForm = ({ onClose, onSuccess }) => {
  const { post } = useAuthedRequest()
  const { deductions: defaultDeductions, benefits: defaultBenefits } =
    useContext(PayrollOptionsContext)

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    salary: '',
  })

  const [deductions, setDeductions] = useState([...defaultDeductions])
  const [benefits, setBenefits] = useState([...defaultBenefits])
  const [photo, setPhoto] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (e, setFn) => {
    const selected = Array.from(e.target.selectedOptions).map((o) => o.value)
    setFn(selected)
  }

  const handleFileChange = (e) => {
    setPhoto(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData()
    Object.entries(form).forEach(([key, value]) => formData.append(key, value))
    formData.append('deductions', JSON.stringify(deductions))
    formData.append('benefits', JSON.stringify(benefits))
    if (photo) formData.append('photo', photo)

    try {
      const res = await post('/employees', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      onSuccess?.(res.data.employee)
      onClose?.()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create employee.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal onClose={onClose}>
      <FormContainer>
        <h2>Add New Employee</h2>

        {error && <ErrorText>{error}</ErrorText>}

        <form onSubmit={handleSubmit}>
          <Field>
            <Label>Name</Label>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </Field>

          <Field>
            <Label>Email</Label>
            <Input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </Field>

          <Field>
            <Label>Phone</Label>
            <Input name="phone" value={form.phone} onChange={handleChange} />
          </Field>

          <Field>
            <Label>Department</Label>
            <Input
              name="department"
              value={form.department}
              onChange={handleChange}
            />
          </Field>

          <Field>
            <Label>Position</Label>
            <Input
              name="position"
              value={form.position}
              onChange={handleChange}
            />
          </Field>

          <Field>
            <Label>Salary (KES)</Label>
            <Input
              name="salary"
              type="number"
              value={form.salary}
              onChange={handleChange}
              required
            />
          </Field>

          <Field>
            <Label>Photo</Label>
            <Input type="file" accept="image/*" onChange={handleFileChange} />
          </Field>

          <Field>
            <Label>Deductions</Label>
            <Select
              multiple
              value={deductions}
              onChange={(e) => handleSelectChange(e, setDeductions)}
            >
              {defaultDeductions.map((ded) => (
                <option key={ded} value={ded}>
                  {ded}
                </option>
              ))}
            </Select>
          </Field>

          <Field>
            <Label>Benefits</Label>
            <Select
              multiple
              value={benefits}
              onChange={(e) => handleSelectChange(e, setBenefits)}
            >
              {defaultBenefits.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </Select>
          </Field>

          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Create Employee'}
          </Button>
        </form>
      </FormContainer>
    </Modal>
  )
}

export default AddEmployeeForm
