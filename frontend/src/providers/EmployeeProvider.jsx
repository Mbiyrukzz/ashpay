import React, { useState, useEffect, useCallback } from 'react'
import EmployeeContext from '../contexts/EmployeeContext'
import useAuthedRequest from '../hooks/useAuthedRequest'
import useUser from '../hooks/useUser'

const API_URL = 'http://localhost:5000/api'

const EmployeeProvider = ({ children }) => {
  const { user } = useUser()
  const { isReady, get, post, put, del } = useAuthedRequest()
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)

  const deductions = [
    'NSSF',
    'NHIF',
    'PAYE',
    'Housing Levy',
    'Loan Repayment',
    'Advance Salary',
  ]

  const benefits = [
    'Medical Insurance',
    'Transport Allowance',
    'Housing Allowance',
    'Meal Allowance',
    'Phone Allowance',
    'Overtime',
    'Commission',
  ]

  const fetchEmployees = useCallback(async () => {
    if (!isReady || !user) return
    setLoading(true)
    try {
      const response = await get(`${API_URL}/employees`)
      setEmployees(response.employees || [])
    } catch (error) {
      console.error('❌ Error fetching employees:', error)
      throw new Error('Failed to fetch employees')
    } finally {
      setLoading(false)
    }
  }, [get, isReady, user])

  const createEmployee = async (employeeData) => {
    try {
      if (!employeeData.name || !employeeData.email || !employeeData.salary) {
        throw new Error('Name, email, and salary are required.')
      }

      const response = await post(`${API_URL}/employees`, employeeData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.employee) {
        setEmployees((prev) => [...prev, response.employee])
        return response.employee
      } else {
        throw new Error(response.error || 'Failed to create employee')
      }
    } catch (err) {
      console.error('❌ Error creating employee:', err)

      if (err.response?.status === 409) {
        throw new Error(err.response.data?.error || 'Duplicate employee entry')
      } else if (err.response?.status === 400) {
        const details = err.response.data?.details
        if (details && Array.isArray(details)) {
          throw new Error(details.join(', '))
        }
        throw new Error(err.response.data?.error || 'Invalid employee data')
      } else if (err.response?.data?.error) {
        throw new Error(err.response.data.error)
      } else {
        throw new Error('Failed to create employee. Please try again.')
      }
    }
  }

  const updateEmployee = async (id, updatedData) => {
    try {
      const response = await put(`${API_URL}/employees/${id}`, updatedData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.employee) {
        setEmployees((prev) =>
          prev.map((emp) => (emp._id === id ? response.employee : emp))
        )
        return response.employee
      } else {
        throw new Error(response.error || 'Failed to update employee')
      }
    } catch (err) {
      console.error('❌ Error updating employee:', err)

      if (err.response?.status === 404) {
        throw new Error('Employee not found')
      } else if (err.response?.data?.error) {
        throw new Error(err.response.data.error)
      } else {
        throw new Error('Failed to update employee. Please try again.')
      }
    }
  }

  const deleteEmployee = async (id) => {
    try {
      await del(`${API_URL}/employees/${id}`)
      setEmployees((prev) => prev.filter((emp) => emp._id !== id))
    } catch (err) {
      console.error('❌ Error deleting employee:', err)

      if (err.response?.status === 404) {
        throw new Error('Employee not found')
      } else {
        throw new Error('Failed to delete employee. Please try again.')
      }
    }
  }

  const getEmployeeById = (id) => {
    return employees.find((emp) => emp._id === id || emp.id === id)
  }

  const getEmployeesByDepartment = (department) => {
    return employees.filter(
      (emp) => emp.department?.toLowerCase() === department?.toLowerCase()
    )
  }

  const searchEmployees = (query) => {
    if (!query.trim()) return employees

    const searchTerm = query.toLowerCase()
    return employees.filter(
      (emp) =>
        emp.name?.toLowerCase().includes(searchTerm) ||
        emp.email?.toLowerCase().includes(searchTerm) ||
        emp.department?.toLowerCase().includes(searchTerm) ||
        emp.position?.toLowerCase().includes(searchTerm) ||
        emp.employeeId?.toLowerCase().includes(searchTerm)
    )
  }

  useEffect(() => {
    fetchEmployees()
  }, [fetchEmployees])

  const value = {
    // Employee data
    employees,
    loading,

    // Default options
    deductions,
    benefits,

    // CRUD operations
    fetchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,

    // Utility functions
    getEmployeeById,
    getEmployeesByDepartment,
    searchEmployees,

    // Stats
    totalEmployees: employees.length,
    departments: [
      ...new Set(employees.map((emp) => emp.department).filter(Boolean)),
    ],
  }

  return (
    <EmployeeContext.Provider value={value}>
      {children}
    </EmployeeContext.Provider>
  )
}

export default EmployeeProvider
