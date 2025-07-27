import React, { useState, useEffect, useCallback } from 'react'
import EmployeeContext from '../contexts/EmployeeContext'
import useAuthedRequest from '../hooks/useAuthedRequest'
import useUser from '../hooks/useUser'

const API_URL = 'http://localhost:5000/api'

const EmployeeProvider = ({ children }) => {
  const { user } = useUser()
  const { isReady, get, post, put, del } = useAuthedRequest()
  const [employees, setEmployees] = useState([])
  const [payrolls, setPayrolls] = useState([])
  const [loading, setLoading] = useState(true)
  const [payrollLoading, setPayrollLoading] = useState(false)

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
        headers: { 'Content-Type': 'application/json' },
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
        headers: { 'Content-Type': 'application/json' },
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

  const fetchPayrolls = useCallback(
    async (params = {}) => {
      if (!isReady || !user) return
      setPayrollLoading(true)
      try {
        const queryParams = new URLSearchParams(params).toString()
        const url = queryParams
          ? `${API_URL}/payroll?${queryParams}`
          : `${API_URL}/payroll`
        const response = await get(url)
        setPayrolls(response.payrolls || [])
        return response
      } catch (error) {
        console.error('❌ Error fetching payrolls:', error)
        throw new Error('Failed to fetch payrolls')
      } finally {
        setPayrollLoading(false)
      }
    },
    [get, isReady, user]
  )

  const generatePayroll = async (payrollData) => {
    if (!isReady) throw new Error('Authentication not ready')
    try {
      const response = await post(`${API_URL}/payroll/generate`, {
        ...payrollData,
        generatedBy: 'manual',
      })
      await fetchPayrolls()
      return response
    } catch (error) {
      console.error('❌ Error generating payroll:', error)
      if (error.response?.status === 409) {
        throw new Error(
          error.response.data?.error || 'Payroll already exists for this period'
        )
      } else if (error.response?.status === 400) {
        const details = error.response.data?.details
        if (details && Array.isArray(details)) {
          throw new Error(details.join(', '))
        }
        throw new Error(error.response.data?.error || 'Invalid payroll data')
      } else if (error.response?.data?.error) {
        throw new Error(error.response.data.error)
      } else {
        throw new Error('Failed to generate payroll. Please try again.')
      }
    }
  }

  const previewPayroll = async (payrollData) => {
    if (!isReady) throw new Error('Authentication not ready')
    try {
      const response = await post(`${API_URL}/payroll/preview`, payrollData)
      return response
    } catch (error) {
      console.error('❌ Error generating payroll preview:', error)
      if (error.response?.status === 400) {
        const details = error.response.data?.details
        if (details && Array.isArray(details)) {
          throw new Error(details.join(', '))
        }
        throw new Error(error.response.data?.error || 'Invalid payroll data')
      } else if (error.response?.status === 404) {
        throw new Error('No active employees found with valid salaries')
      } else if (error.response?.data?.error) {
        throw new Error(error.response.data.error)
      } else {
        throw new Error('Failed to generate preview. Please try again.')
      }
    }
  }

  const updatePayrollStatus = async (payrollId, status, options = {}) => {
    if (!isReady) throw new Error('Authentication not ready')
    try {
      const response = await put(`${API_URL}/payroll/${payrollId}/status`, {
        status,
        ...options,
      })
      setPayrolls((prev) =>
        prev.map((payroll) =>
          payroll._id === payrollId
            ? { ...payroll, status, ...response.payroll }
            : payroll
        )
      )
      return response
    } catch (error) {
      console.error('❌ Error updating payroll status:', error)
      if (error.response?.status === 404) {
        throw new Error('Payroll not found')
      } else if (error.response?.data?.error) {
        throw new Error(error.response.data.error)
      } else {
        throw new Error('Failed to update payroll status. Please try again.')
      }
    }
  }

  const getPayrollDetails = async (payrollId) => {
    if (!isReady) return { error: 'Authentication not ready' }
    try {
      const response = await get(`${API_URL}/payroll/${payrollId}`)
      return response // { payroll: {...} } or { error: "Payroll not found" }
    } catch (error) {
      return {
        error:
          error.response?.status === 404
            ? 'Payroll not found'
            : error.response?.data?.error || 'Failed to fetch payroll details',
      }
    }
  }

  const downloadPayrollCSV = async (payrollId) => {
    if (!isReady) throw new Error('Authentication not ready')
    try {
      const response = await get(`${API_URL}/payroll/${payrollId}/export/csv`)
      return response
    } catch (error) {
      console.error('❌ Error downloading payroll CSV:', error)
      throw new Error('Failed to download payroll CSV. Please try again.')
    }
  }

  const downloadPayrollPDF = async (payrollId) => {
    if (!isReady) throw new Error('Authentication not ready')
    try {
      const response = await get(`${API_URL}/payroll/${payrollId}/export/pdf`)
      return response
    } catch (error) {
      console.error('❌ Error downloading payroll PDF:', error)
      throw new Error('Failed to download payroll PDF. Please try again.')
    }
  }

  const getPayrollById = (id) => {
    return payrolls.find((payroll) => payroll._id === id || payroll.id === id)
  }
  console.log(payrolls)
  const getPayrollsByStatus = (status) => {
    return payrolls.filter((payroll) => payroll.status === status)
  }

  const getPayrollsByPeriod = (year, month) => {
    return payrolls.filter(
      (payroll) => payroll.year === year && (!month || payroll.month === month)
    )
  }

  const getMonthName = (monthNum) => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]
    return months[monthNum - 1] || 'Unknown'
  }

  const calculateTotalSalaryBudget = () => {
    const activeEmployees = employees.filter((emp) => emp.isActive !== false)
    return activeEmployees.reduce((sum, emp) => sum + (emp.salary || 0), 0)
  }

  const getActiveEmployees = () => {
    return employees.filter((emp) => emp.isActive !== false)
  }

  useEffect(() => {
    fetchEmployees()
  }, [fetchEmployees])

  useEffect(() => {
    if (!loading && employees.length > 0) {
      fetchPayrolls({ limit: 10 })
    }
  }, [loading, employees.length, fetchPayrolls])

  const value = {
    employees,
    loading,
    payrolls,
    payrollLoading,
    deductions,
    benefits,
    fetchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployeeById,
    getEmployeesByDepartment,
    searchEmployees,
    fetchPayrolls,
    generatePayroll,
    previewPayroll,
    updatePayrollStatus,
    getPayrollDetails,
    downloadPayrollCSV,
    downloadPayrollPDF,
    getPayrollById,
    getPayrollsByStatus,
    getPayrollsByPeriod,
    getMonthName,
    calculateTotalSalaryBudget,
    getActiveEmployees,
    totalEmployees: employees.length,
    departments: [
      ...new Set(employees.map((emp) => emp.department).filter(Boolean)),
    ],
    totalPayrolls: payrolls.length,
    recentPayrolls: payrolls.slice(0, 5),
  }

  return (
    <EmployeeContext.Provider value={value}>
      {children}
    </EmployeeContext.Provider>
  )
}

export default EmployeeProvider
